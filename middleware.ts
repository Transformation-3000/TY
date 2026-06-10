import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE = 'longevity_auth';
const MEMBER_COOKIE = 'member_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login-Seite immer erlauben und Cookies bereinigen, um alte Sessions zu löschen
  if (pathname === '/login') {
    console.log(`[Middleware] /login requested, clearing cookies.`);
    const response = NextResponse.next();
    response.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
    response.cookies.set(MEMBER_COOKIE, '', { maxAge: 0, path: '/' });
    return response;
  }

  // API-Auth immer erlauben
  if (pathname.startsWith('/api/auth')) {
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

  const hasGatekeeperCookie = request.cookies.has(AUTH_COOKIE);
  const gatekeeperCookieValue = request.cookies.get(AUTH_COOKIE)?.value;
  const isGatekeeperPassed = hasGatekeeperCookie && gatekeeperCookieValue === 'Longevity3000';

  const hasMemberCookie = request.cookies.has(MEMBER_COOKIE);
  const memberCookieValue = request.cookies.get(MEMBER_COOKIE)?.value;
  const isMemberPassed = hasMemberCookie && memberCookieValue === 'true';

  console.log(`[Middleware] Path: ${pathname} | Gatekeeper Passed: ${isGatekeeperPassed} (Cookie: ${gatekeeperCookieValue}) | Member Passed: ${isMemberPassed} (Cookie: ${memberCookieValue})`);

  if (!isGatekeeperPassed || !isMemberPassed) {
    console.log(`[Middleware] Auth failed for ${pathname}. Redirecting to /login`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl, { status: 307 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|api/auth).*)'],
};
