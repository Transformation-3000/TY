import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'longevity_auth';
const MEMBER_COOKIE = 'member_auth';

export async function GET(request: NextRequest) {
  const hasGatekeeper = request.cookies.has(AUTH_COOKIE);
  const gatekeeperValue = request.cookies.get(AUTH_COOKIE)?.value;
  const isGatekeeperValid = hasGatekeeper && gatekeeperValue === 'Longevity3000';

  const hasMember = request.cookies.has(MEMBER_COOKIE);
  const memberValue = request.cookies.get(MEMBER_COOKIE)?.value;
  const isMemberValid = hasMember && memberValue === 'true';

  return NextResponse.json({ isGatekeeperValid, isMemberValid });
}

export async function POST(request: NextRequest) {
  let body: { password?: string; email?: string; type?: 'gatekeeper' | 'member' } = {};
  try {
    body = await request.json();
  } catch {
    // Ignore parse errors
  }

  const type = body.type || 'gatekeeper';

  if (type === 'gatekeeper') {
    const envPassword = process.env.LONGIVITY_DASHBOARD_PASSWORD;
    const isPasswordCorrect = body.password === 'Longevity3000' || (envPassword && body.password === envPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Ungültiges Passwort.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(AUTH_COOKIE, 'Longevity3000', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
      path: '/',
    });
    res.cookies.set(MEMBER_COOKIE, 'true', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
      path: '/',
    });
    return res;
  } else {
    // Member Login
    const email = body.email || '';
    const password = body.password || '';

    if (!email.includes('@') || password.length < 4) {
      return NextResponse.json(
        { error: 'Bitte gib eine gültige E-Mail-Adresse und ein Passwort (mind. 4 Zeichen) ein.' },
        { status: 400 }
      );
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(MEMBER_COOKIE, 'true', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 Tage
      path: '/',
    });
    return res;
  }
}
