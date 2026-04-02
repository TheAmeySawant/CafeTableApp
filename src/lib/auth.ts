import { jwtVerify } from 'jose';
import { NextResponse } from 'next/server';

export interface AuthPayload {
  sub: string;      // userId
  email: string;
  role: 'customer' | 'kitchen' | 'admin';
  cafeId?: string;
}

/**
 * Extract and verify the `auth_token` cookie from a Request.
 * Returns the decoded JWT payload, or null if the token is missing / invalid.
 */
export async function getAuthPayload(request: Request): Promise<AuthPayload | null> {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  const token = match?.[1];

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET ?? 'super_secret_for_local_dev_only',
    );
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

/**
 * Convenience: require auth with optional role check.
 * Returns [payload, null] on success or [null, errorResponse] on failure.
 */
export async function requireAuth(
  request: Request,
  ...roles: Array<AuthPayload['role']>
): Promise<[AuthPayload, null] | [null, NextResponse]> {
  const payload = await getAuthPayload(request);

  if (!payload) {
    return [null, NextResponse.json({ error: 'Unauthorised' }, { status: 401 })];
  }

  if (roles.length > 0 && !roles.includes(payload.role)) {
    return [null, NextResponse.json({ error: 'Forbidden' }, { status: 403 })];
  }

  return [payload, null];
}
