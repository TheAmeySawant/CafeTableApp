import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users, otpCodes } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { SignJWT } from 'jose';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const db = getDb(process.env as any);

    // Validate OTP
    const validOtp = await db.select().from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          gt(otpCodes.expiresAt, new Date())
        )
      ).limit(1);

    if (validOtp.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
    }

    // Find User
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];

    // Delete used OTP
    await db.delete(otpCodes).where(eq(otpCodes.email, email));

    // Issue JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_for_local_dev_only');
    
    const jwt = await new SignJWT({ 
        sub: user.id, 
        email: user.email, 
        role: user.role,
        cafeId: user.cafeId
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d') // 30 days
      .sign(secret);

    // Respond and set cookie
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } });
    
    response.cookies.set({
      name: 'auth_token',
      value: jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    console.error('Verify OTP Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
