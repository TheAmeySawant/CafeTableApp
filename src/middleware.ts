import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const url = request.nextUrl.clone();

  // DEV BYPASS: Skip auth entirely in local development for UI review
  if (process.env.NEXT_PUBLIC_DEV_BYPASS === 'true') {
    return NextResponse.next();
  }

  // Public paths
  const isPublicPath = url.pathname === '/login' || url.pathname === '/' || url.pathname.includes('/menu');

  // If no token and not a public path, redirect to login
  if (!token && !isPublicPath) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      // Note: we're using a hardcoded secret for demo purposes. In production, this should use process.env.JWT_SECRET
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super_secret_for_local_dev_only');
      const { payload } = await jwtVerify(token, secret);

      // Admin routes guard
      if (url.pathname.startsWith('/admin') && payload.role !== 'admin') {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Kitchen routes guard
      if (url.pathname.startsWith('/kitchen') && payload.role !== 'kitchen' && payload.role !== 'admin') {
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
      
      // If authenticating and on login page, redirect to home/dashboard based on role
      if (url.pathname === '/login') {
        if (payload.role === 'admin') url.pathname = '/admin';
        else if (payload.role === 'kitchen') url.pathname = '/kitchen';
        else url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch (err) {
      // Token is invalid/expired
      if (!isPublicPath) {
        url.pathname = '/login';
        const response = NextResponse.redirect(url);
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
