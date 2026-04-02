import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

/** PATCH /api/admin/menu/categories/[id] — Rename / reorder a category */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const body = await request.json();
    const updates: Partial<typeof categories.$inferInsert> = {};
    if (body.name !== undefined)      updates.name = body.name;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    const db = getDb(process.env as any);
    await db.update(categories).set(updates).where(eq(categories.id, params.id));
    const [updated] = await db.select().from(categories).where(eq(categories.id, params.id)).limit(1);
    if (!updated) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    return NextResponse.json({ category: updated });
  } catch (err: any) {
    console.error('[PATCH /api/admin/menu/categories/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/admin/menu/categories/[id] — Delete a category */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const db = getDb(process.env as any);
    await db.delete(categories).where(eq(categories.id, params.id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/admin/menu/categories/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
