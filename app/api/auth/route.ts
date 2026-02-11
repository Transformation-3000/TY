import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'longevity_auth';

export async function POST(request: NextRequest) {
  const password = process.env.LONGIVITY_DASHBOARD_PASSWORD;

  if (!password) {
    return NextResponse.json(
      { error: 'Passwortschutz ist nicht konfiguriert.' },
      { status: 500 }
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Ungültige Anfrage.' },
      { status: 400 }
    );
  }

  if (body.password !== password) {
    return NextResponse.json(
      { error: 'Falsches Passwort.' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
    path: '/',
  });

  return res;
}
