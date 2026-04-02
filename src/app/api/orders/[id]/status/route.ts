import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { triggerPusherEvent } from '@/lib/pusher-server';

export const runtime = 'edge';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending:    ['preparing', 'cancelled'],
  preparing:  ['ready', 'cancelled'],
  ready:      ['served'],
  served:     [],
  cancelled:  [],
};

/**
 * PATCH /api/orders/[id]/status
 * Kitchen or Admin – update an order's status.
 * Triggers Pusher events on both the kitchen channel and the customer's order channel.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [payload, errRes] = await requireAuth(request, 'kitchen', 'admin');
  if (errRes) return errRes;

  try {
    const { status: newStatus } = await request.json();

    if (!newStatus) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    const db = getDb(process.env as any);

    // Fetch current order
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, params.id))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate status transition
    const allowed = VALID_TRANSITIONS[order.status ?? 'pending'];
    if (!allowed.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from "${order.status}" to "${newStatus}"` },
        { status: 422 },
      );
    }

    // Update order
    await db
      .update(orders)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(orders.id, params.id));

    const eventData = { orderId: params.id, status: newStatus, updatedBy: payload.sub };

    // Notify kitchen channel (KDS update)
    await triggerPusherEvent(`kitchen-${order.cafeId}`, 'order.updated', eventData);
    // Notify customer's tracking channel
    await triggerPusherEvent(`order-${params.id}`, 'status.changed', eventData);

    return NextResponse.json({ success: true, orderId: params.id, status: newStatus });
  } catch (err: any) {
    console.error('[PATCH /api/orders/:id/status]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
