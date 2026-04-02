import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders, orderItems, menuItems } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { triggerPusherEvent } from '@/lib/pusher-server';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

/** POST /api/orders — Place a new order (public, any customer) */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cafeId, tableId, tableNumber, customerName, notes, items } = body;

    // Basic validation
    if (!cafeId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'cafeId and at least one item are required' },
        { status: 400 },
      );
    }

    const db = getDb(process.env as any);

    // Resolve item prices from DB (never trust client prices)
    const itemIds: string[] = items.map((i: any) => i.menuItemId);
    const dbItems = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.cafeId, cafeId));

    const itemMap = new Map(dbItems.map((i) => [i.id, i]));

    let totalAmount = 0;
    const orderItemValues: (typeof orderItems.$inferInsert)[] = [];

    for (const item of items) {
      const dbItem = itemMap.get(item.menuItemId);
      if (!dbItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItemId} not found` },
          { status: 400 },
        );
      }
      if (!dbItem.isAvailable) {
        return NextResponse.json(
          { error: `"${dbItem.name}" is currently unavailable` },
          { status: 400 },
        );
      }

      const quantity = Math.max(1, parseInt(item.quantity ?? 1, 10));
      totalAmount += dbItem.price * quantity;

      orderItemValues.push({
        id: uuidv4(),
        orderId: '', // filled below
        menuItemId: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity,
        notes: item.notes ?? null,
      });
    }

    // Create the order
    const orderId = uuidv4();
    await db.insert(orders).values({
      id: orderId,
      cafeId,
      tableId: tableId ?? null,
      tableNumber: tableNumber ?? null,
      customerName: customerName ?? null,
      status: 'pending',
      totalAmount: Math.round(totalAmount * 100) / 100,
      notes: notes ?? null,
    });

    // Insert order items
    const finalItems = orderItemValues.map((oi) => ({ ...oi, orderId }));
    await db.insert(orderItems).values(finalItems);

    // Notify kitchen via Pusher
    await triggerPusherEvent(`kitchen-${cafeId}`, 'order.created', {
      orderId,
      cafeId,
      tableNumber,
      customerName,
      totalAmount,
      items: finalItems.map((i) => ({ name: i.name, quantity: i.quantity, notes: i.notes })),
    });

    return NextResponse.json({ success: true, orderId }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

/** GET /api/orders?cafeId=X&status=Y — Kitchen/Admin order list */
export async function GET(request: Request) {
  const [payload, errRes] = await requireAuth(request, 'kitchen', 'admin');
  if (errRes) return errRes;

  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId') ?? payload.cafeId;
    const status = searchParams.get('status');

    if (!cafeId) {
      return NextResponse.json({ error: 'cafeId is required' }, { status: 400 });
    }

    const db = getDb(process.env as any);

    const conditions = [eq(orders.cafeId, cafeId)];
    if (status) {
      conditions.push(eq(orders.status, status as any));
    }

    const result = await db
      .select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    return NextResponse.json({ orders: result });
  } catch (err: any) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
