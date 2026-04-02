import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { tables } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

/** GET /api/admin/tables?cafeId=X */
export async function GET(request: Request) {
  const [payload, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId') ?? payload.cafeId;
    if (!cafeId) return NextResponse.json({ error: 'cafeId is required' }, { status: 400 });

    const db = getDb(process.env as any);
    const result = await db.select().from(tables).where(eq(tables.cafeId, cafeId));
    return NextResponse.json({ tables: result });
  } catch (err: any) {
    console.error('[GET /api/admin/tables]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}

/** POST /api/admin/tables — Create a table, auto-generate its QR code URL */
export async function POST(request: Request) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const { cafeId, tableNumber } = await request.json();
    if (!cafeId || tableNumber === undefined) {
      return NextResponse.json({ error: 'cafeId and tableNumber are required' }, { status: 400 });
    }

    const id = uuidv4();

    // QR code encodes the customer ordering URL for this table.
    // We store the URL; actual QR image is rendered client-side via the qrcode library.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourdomain.com';
    const qrCodeUrl = `${appUrl}/menu?cafeId=${cafeId}&table=${tableNumber}`;

    const db = getDb(process.env as any);
    await db.insert(tables).values({
      id,
      cafeId,
      tableNumber,
      qrCodeUrl,
      isActive: true,
    });

    const [created] = await db.select().from(tables).where(eq(tables.id, id)).limit(1);
    return NextResponse.json({ table: created }, { status: 201 });
  } catch (err: any) {
    console.error('[POST /api/admin/tables]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
