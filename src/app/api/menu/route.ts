import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { categories, menuItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * GET /api/menu?cafeId=X
 * Public endpoint – returns all categories with their menu items nested.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId');

    if (!cafeId) {
      return NextResponse.json({ error: 'cafeId is required' }, { status: 400 });
    }

    const db = getDb(process.env as any);

    // Fetch categories ordered by sort_order
    const cats = await db
      .select()
      .from(categories)
      .where(eq(categories.cafeId, cafeId))
      .orderBy(asc(categories.sortOrder));

    // Fetch all available items for this café
    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.cafeId, cafeId))
      .orderBy(asc(menuItems.sortOrder));

    // Nest items under their category
    const menu = cats.map((cat) => ({
      ...cat,
      items: items.filter((item) => item.categoryId === cat.id),
    }));

    // Also include items without a category
    const uncategorised = items.filter((item) => !item.categoryId);
    if (uncategorised.length > 0) {
      menu.push({
        id: 'uncategorised',
        cafeId,
        name: 'Other',
        sortOrder: 999,
        items: uncategorised,
      });
    }

    return NextResponse.json({ menu });
  } catch (err: any) {
    console.error('[GET /api/menu]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
