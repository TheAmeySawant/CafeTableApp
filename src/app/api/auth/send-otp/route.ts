import { NextResponse } from 'next/server';

// VERCEL UI PREVIEW STUB
// This route is stubbed for frontend UI testing on Vercel.
// Real implementation uses Cloudflare D1 + Brevo email.

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  // Stub: pretend OTP was sent
  console.log(`[STUB] OTP would be sent to ${email}`);
  return NextResponse.json({ success: true, message: 'OTP sent (UI preview stub)' });
}
