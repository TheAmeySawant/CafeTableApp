import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

/** PATCH /api/admin/menu/items/[id] — Update a menu item */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const body = await request.json();
    const db = getDb(process.env as any);

    // Only update fields that were explicitly provided
    const updates: Partial<typeof menuItems.$inferInsert> = {};
    if (body.name !== undefined)        updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.price !== undefined)       updates.price = body.price;
    if (body.categoryId !== undefined)  updates.categoryId = body.categoryId;
    if (body.imageUrl !== undefined)    updates.imageUrl = body.imageUrl;
    if (body.isAvailable !== undefined) updates.isAvailable = body.isAvailable;
    if (body.isPopular !== undefined)   updates.isPopular = body.isPopular;
    if (body.sortOrder !== undefined)   updates.sortOrder = body.sortOrder;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    await db.update(menuItems).set(updates).where(eq(menuItems.id, params.id));
    const [updated] = await db.select().from(menuItems).where(eq(menuItems.id, params.id)).limit(1);

    if (!updated) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    return NextResponse.json({ item: updated });
  } catch (err: any) {
    console.error('[PATCH /api/admin/menu/items/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/admin/menu/items/[id] — Delete a menu item */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const db = getDb(process.env as any);
    await db.delete(menuItems).where(eq(menuItems.id, params.id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[DELETE /api/admin/menu/items/:id]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
