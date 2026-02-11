import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'longevity_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login-Seite und API-Auth immer erlauben
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Statische Assets und Next.js-Interna durchlassen
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE);
  const expected = process.env.LONGIVITY_DASHBOARD_PASSWORD;

  if (!expected) {
    // Kein Passwort konfiguriert → Zugriff erlauben (Dev-Fallback)
    return NextResponse.next();
  }

  if (!cookie?.value || cookie.value !== expected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api/auth).*)'],
};
