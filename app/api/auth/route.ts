import { NextRequest, NextResponse } from 'next/server';

const MEMBER_COOKIE = 'member_auth';

export async function GET(request: NextRequest) {
  const hasMember = request.cookies.has(MEMBER_COOKIE);
  const memberValue = request.cookies.get(MEMBER_COOKIE)?.value;
  const isMemberValid = hasMember && memberValue === 'true';

  return NextResponse.json({ isGatekeeperValid: true, isMemberValid });
}

export async function POST(request: NextRequest) {
  let body: { password?: string; email?: string; type?: 'gatekeeper' | 'member' } = {};
  try {
    body = await request.json();
  } catch {
    // Ignore parse errors
  }

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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
    path: '/',
  });
  return res;
}
