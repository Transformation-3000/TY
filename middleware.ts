import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MEMBER_COOKIE = 'member_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login-Seite und API-Auth immer erlauben
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth')
  ) {
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



  // 2. Mitglieder-Login prüfen (gilt nur für das Dashboard /dashboard)
  if (pathname.startsWith('/dashboard')) {
    const hasMemberCookie = request.cookies.has(MEMBER_COOKIE);
    const memberCookieValue = request.cookies.get(MEMBER_COOKIE)?.value;
    const isMemberPassed = hasMemberCookie && memberCookieValue === 'true';

    if (!isMemberPassed) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api/auth).*)'],
};
