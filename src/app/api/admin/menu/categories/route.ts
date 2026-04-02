import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

/** GET /api/admin/menu/categories?cafeId=X — List all categories for a café */
export async function GET(request: Request) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId');
    if (!cafeId) return NextResponse.json({ error: 'cafeId is required' }, { status: 400 });

    const db = getDb(process.env as any);
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.cafeId, cafeId))
      .orderBy(asc(categories.sortOrder));

    return NextResponse.json({ categories: result });
  } catch (err: any) {
    console.error('[GET /api/admin/menu/categories]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/admin/menu/categories — Create a category */
export async function POST(request: Request) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const { cafeId, name, sortOrder = 0 } = await request.json();
    if (!cafeId || !name) {
      return NextResponse.json({ error: 'cafeId and name are required' }, { status: 400 });
    }

    const db = getDb(process.env as any);
    const id = uuidv4();
    await db.insert(categories).values({ id, cafeId, name, sortOrder });

    const [created] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return NextResponse.json({ category: created }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/admin/menu/categories]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
