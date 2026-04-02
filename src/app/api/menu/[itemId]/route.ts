import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { menuItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

/**
 * GET /api/menu/[itemId]
 * Public – returns a single menu item by ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: { itemId: string } },
) {
  try {
    const db = getDb(process.env as any);

    const result = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, params.itemId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item: result[0] });
  } catch (err: any) {
    console.error('[GET /api/menu/:itemId]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
