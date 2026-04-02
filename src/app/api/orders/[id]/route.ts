import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * GET /api/orders/[id]
 * Public – used by the customer order-tracking page.
 * Returns order + its items.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const db = getDb(process.env as any);

    const orderResult = await db
      .select()
      .from(orders)
      .where(eq(orders.id, params.id))
      .limit(1);

    if (orderResult.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, params.id));

    return NextResponse.json({ order: orderResult[0], items });
  } catch (err: any) {
    console.error('[GET /api/orders/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
