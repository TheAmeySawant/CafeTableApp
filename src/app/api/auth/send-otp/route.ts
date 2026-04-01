import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users, otpCodes } from '@/db/schema';
import { sendOtpEmail } from '@/lib/brevo';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Connect to database to process
    // NOTE: For 'edge' environment, process.env is accessible, but `env.DB` 
    // needs to come through Nextjs on Cloudflare Pages using `process.env.DB` binding mapping 
    const db = getDb(process.env as any);

    // Generate a 4-digit numeric OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // Upsert user if they don't exist
    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (existingUsers.length === 0) {
      await db.insert(users).values({
        id: uuidv4(),
        email: email,
        // we leave everything default
      });
    }

    // Upsert OTP
    const existingOtp = await db.select().from(otpCodes).where(eq(otpCodes.email, email)).limit(1);
    if (existingOtp.length > 0) {
      await db.update(otpCodes).set({ code, expiresAt }).where(eq(otpCodes.email, email));
    } else {
      await db.insert(otpCodes).values({
        email,
        code,
        expiresAt,
      });
    }

    // Send the email
    await sendOtpEmail(email, code);

    return NextResponse.json({ success: true, message: 'OTP sent' });

  } catch (err: any) {
    console.error('Send OTP Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
