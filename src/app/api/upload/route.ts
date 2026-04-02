import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

/**
 * POST /api/upload
 *
 * Returns Backblaze B2 upload credentials so the client can PUT a file
 * directly to B2 without the server key ever reaching the browser.
 *
 * Flow:
 *  1. Admin calls this endpoint with { filename, contentType }
 *  2. Server authenticates with B2 (b2_authorize_account)
 *  3. Server gets an upload URL for the bucket (b2_get_upload_url)
 *  4. Returns { uploadUrl, authorizationToken, fileName } to the client
 *  5. Client PUTs the file directly to uploadUrl using the token
 *
 * Required env vars:
 *   B2_KEY_ID               — Backblaze applicationKeyId
 *   B2_APPLICATION_KEY      — Backblaze applicationKey
 *   B2_BUCKET_ID            — Backblaze bucket ID (not name — the alphanumeric ID)
 *   NEXT_PUBLIC_B2_ENDPOINT — Public CDN / download URL base
 */
export async function POST(request: Request) {
  const [, errRes] = await requireAuth(request, 'admin');
  if (errRes) return errRes;

  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 },
      );
    }

    const keyId = process.env.B2_KEY_ID;
    const appKey = process.env.B2_APPLICATION_KEY;
    const bucketId = process.env.B2_BUCKET_ID;

    if (!keyId || !appKey || !bucketId) {
      return NextResponse.json(
        { error: 'B2 credentials not configured (B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_ID)' },
        { status: 503 },
      );
    }

    // --- Step 1: b2_authorize_account ---
    const authRes = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(`${keyId}:${appKey}`)}`,
      },
    });

    if (!authRes.ok) {
      const body = await authRes.text();
      console.error('[Upload] B2 auth failed:', body);
      return NextResponse.json({ error: 'B2 authorisation failed' }, { status: 502 });
    }

    const authData = await authRes.json() as {
      apiInfo: { storageApi: { apiUrl: string } };
      authorizationToken: string;
    };

    const apiUrl = authData.apiInfo.storageApi.apiUrl;
    const authToken = authData.authorizationToken;

    // --- Step 2: b2_get_upload_url ---
    const uploadUrlRes = await fetch(`${apiUrl}/b2api/v3/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucketId }),
    });

    if (!uploadUrlRes.ok) {
      const body = await uploadUrlRes.text();
      console.error('[Upload] b2_get_upload_url failed:', body);
      return NextResponse.json({ error: 'Failed to get B2 upload URL' }, { status: 502 });
    }

    const uploadData = await uploadUrlRes.json() as {
      uploadUrl: string;
      authorizationToken: string;
    };

    // Prefix filename with timestamp to ensure uniqueness
    const uniqueFileName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

    return NextResponse.json({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
      fileName: uniqueFileName,
      contentType,
      // Public URL the client can store in the DB after upload
      publicUrl: `${process.env.NEXT_PUBLIC_B2_ENDPOINT}/${uniqueFileName}`,
    });
  } catch (err: any) {
    console.error('[POST /api/upload]', err);
    return NextResponse.json({ error: err.message ?? 'Internal server error' }, { status: 500 });
  }
}
