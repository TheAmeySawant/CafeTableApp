import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

/** PATCH /api/admin/tables/[id] — Toggle active status or update table details */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const body = await request.json();
    const updates: Partial<typeof tables.$inferInsert> = {};
    if (body.isActive !== undefined)    updates.isActive = body.isActive;
    if (body.tableNumber !== undefined) updates.tableNumber = body.tableNumber;
    if (body.qrCodeUrl !== undefined)   updates.qrCodeUrl = body.qrCodeUrl;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    const db = getDb(process.env as any);
    await db.update(tables).set(updates).where(eq(tables.id, params.id));
    const [updated] = await db.select().from(tables).where(eq(tables.id, params.id)).limit(1);

    if (!updated) return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    return NextResponse.json({ table: updated });
  } catch (err: any) {
    console.error('[PATCH /api/admin/tables/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/admin/tables/[id] */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const db = getDb(process.env as any);
    await db.delete(tables).where(eq(tables.id, params.id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/admin/tables/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
