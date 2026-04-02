import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and, gte, sql, count, sum } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Mock analytics data — shown when the café has no orders yet
// ---------------------------------------------------------------------------
const MOCK_DATA = {
  isDummy: true,
  notice: 'No order data found for this period. Showing sample data to preview your dashboard.',

  summary: {
    totalOrders: 247,
    totalRevenue: 4892.50,
    avgOrderValue: 19.81,
    revenueChange: +12,   // percent vs prior period
    ordersChange: +8,
  },

  statusBreakdown: {
    pending: 5,
    preparing: 8,
    ready: 3,
    served: 228,
    cancelled: 3,
  },

  topItems: [
    { name: 'Signature Cappuccino',     orders: 89, revenue: 489.50 },
    { name: 'Nitro Honey Cold Brew',    orders: 67, revenue: 452.25 },
    { name: 'Artisan Almond Croissant', orders: 54, revenue: 267.30 },
    { name: 'Spiced Aztec Mocha',       orders: 43, revenue: 268.75 },
    { name: 'Ethiopian Pour Over',      orders: 31, revenue: 217.00 },
  ],

  ordersPerDay: [
    { date: '2024-10-13', count: 28, revenue: 554.20 },
    { date: '2024-10-14', count: 35, revenue: 693.75 },
    { date: '2024-10-15', count: 42, revenue: 831.60 },
    { date: '2024-10-16', count: 30, revenue: 594.30 },
    { date: '2024-10-17', count: 38, revenue: 752.40 },
    { date: '2024-10-18', count: 45, revenue: 891.75 },
    { date: '2024-10-19', count: 29, revenue: 574.50 },
  ],
};

// ---------------------------------------------------------------------------
// Analytics endpoint
// ---------------------------------------------------------------------------

/**
 * GET /api/admin/analytics?cafeId=X&range=7d
 *
 * Returns real aggregated data from D1.
 * Falls back to MOCK_DATA (with isDummy=true notice) when no orders exist.
 *
 * range: "7d" | "30d" | "90d"  (default: "7d")
 */
export async function GET(request: Request) {
  const [payload, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId') ?? payload.cafeId;
    const range = searchParams.get('range') ?? '7d';

    if (!cafeId) {
      return NextResponse.json({ error: 'cafeId is required' }, { status: 400 });
    }

    const days = range === '30d' ? 30 : range === '90d' ? 90 : 7;
    const db = getDb(process.env as any);

    // -----------------------------------------------------------------------
    // 1. Total orders & revenue for the period
    // -----------------------------------------------------------------------
    const startUnix = Math.floor((Date.now() - days * 86400_000) / 1000);

    const summaryRows = await db
      .select({
        totalOrders: count(),
        totalRevenue: sum(orders.totalAmount),
      })
      .from(orders)
      .where(
        and(
          eq(orders.cafeId, cafeId),
          gte(orders.createdAt, new Date(startUnix * 1000)),
        ),
      );

    const totalOrders = summaryRows[0]?.totalOrders ?? 0;
    const totalRevenue = Number(summaryRows[0]?.totalRevenue ?? 0);

    // If no data, return mock
    if (totalOrders === 0) {
      return NextResponse.json(MOCK_DATA);
    }

    const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

    // -----------------------------------------------------------------------
    // 2. Status breakdown
    // -----------------------------------------------------------------------
    const statusRows = await db
      .select({
        status: orders.status,
        count: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.cafeId, cafeId),
          gte(orders.createdAt, new Date(startUnix * 1000)),
        ),
      )
      .groupBy(orders.status);

    const statusBreakdown = { pending: 0, preparing: 0, ready: 0, served: 0, cancelled: 0 };
    for (const row of statusRows) {
      if (row.status && row.status in statusBreakdown) {
        (statusBreakdown as any)[row.status] = row.count;
      }
    }

    // -----------------------------------------------------------------------
    // 3. Orders per day — raw SQL for SQLite strftime grouping
    // -----------------------------------------------------------------------
    const perDayRows = await db
      .all(sql`
        SELECT
          strftime('%Y-%m-%d', datetime(created_at, 'unixepoch')) AS date,
          COUNT(*)                                                  AS count,
          COALESCE(SUM(total_amount), 0)                           AS revenue
        FROM orders
        WHERE cafe_id = ${cafeId}
          AND created_at >= ${startUnix}
        GROUP BY date
        ORDER BY date ASC
      `);

    // -----------------------------------------------------------------------
    // 4. Top menu items
    // -----------------------------------------------------------------------
    const topItemRows = await db
      .all(sql`
        SELECT
          oi.name,
          SUM(oi.quantity)                     AS orders,
          SUM(oi.quantity * oi.price)          AS revenue
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE o.cafe_id = ${cafeId}
          AND o.created_at >= ${startUnix}
        GROUP BY oi.name
        ORDER BY orders DESC
        LIMIT 5
      `);

    return NextResponse.json({
      isDummy: false,
      summary: { totalOrders, totalRevenue, avgOrderValue },
      statusBreakdown,
      ordersPerDay: perDayRows,
      topItems: topItemRows,
    });
  } catch (err: any) {
    console.error('[GET /api/admin/analytics]', err);

    // On any DB error (e.g. D1 not available in plain npm run dev), serve mock
    return NextResponse.json({
      ...MOCK_DATA,
      notice: 'Could not reach the database. Showing sample data.',
    });
  }
}
