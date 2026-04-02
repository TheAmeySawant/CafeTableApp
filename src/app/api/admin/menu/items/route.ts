import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

/** POST /api/admin/menu/items — Create a new menu item */
export async function POST(request: Request) {
  const [payload, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const body = await request.json();
    const {
      cafeId,
      categoryId,
      name,
      description,
      price,
      imageUrl,
      isAvailable = true,
      isPopular = false,
      sortOrder = 0,
    } = body;

    if (!cafeId || !name || price === undefined) {
      return NextResponse.json(
        { error: 'cafeId, name, and price are required' },
        { status: 400 },
      );
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'price must be a non-negative number' }, { status: 400 });
    }

    const db = getDb(process.env as any);

    const id = uuidv4();
    await db.insert(menuItems).values({
      id,
      cafeId,
      categoryId: categoryId ?? null,
      name,
      description: description ?? null,
      price,
      imageUrl: imageUrl ?? null,
      isAvailable,
      isPopular,
      sortOrder,
    });

    const [created] = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/admin/menu/items]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
