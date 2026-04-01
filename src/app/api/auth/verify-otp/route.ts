import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

// VERCEL UI PREVIEW STUB
// This route is stubbed for frontend UI testing on Vercel.
// Any OTP code is accepted. Issues a real JWT so the auth middleware works.
// Real implementation uses Cloudflare D1 for OTP verification.

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
  }

  // Stub: accept any 4-digit code for UI preview
  if (!/^\d{4}$/.test(code)) {
    return NextResponse.json({ error: 'Enter any 4-digit code for the UI preview' }, { status: 401 });
  }

  // Determine role from email prefix for testing different views
  let role = 'customer';
  if (email.startsWith('admin')) role = 'admin';
  else if (email.startsWith('kitchen')) role = 'kitchen';

  // Issue a real JWT so middleware allows access to protected routes
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'vercel_ui_preview_secret');
  const jwt = await new SignJWT({ sub: 'preview-user', email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  const response = NextResponse.json({ 
    success: true, 
    user: { id: 'preview-user', email, role },
    _preview: 'UI stub — use admin@... for admin role, kitchen@... for kitchen role'
  });

  response.cookies.set({
    name: 'auth_token',
    value: jwt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
