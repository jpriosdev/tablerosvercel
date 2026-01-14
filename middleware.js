import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // allow static files and public assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/public') || pathname.startsWith('/static') || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // allow the login page
  if (pathname === '/login' || pathname === '/favicon.ico') return NextResponse.next();

  const cookie = request.cookies.get('auth_token');
  const token = cookie?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(process.env.AUTH_COOKIE_SECRET || 'dev-secret-change-me');
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (e) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}
