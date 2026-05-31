import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE = 'longevity_auth';

export async function POST(request: NextRequest) {
  let body: { password?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Ignore parse errors, use empty body
  }

  // Passwortschutz aktivieren - Passwort prüfen
  if (body.password !== 'Longevity3000') {
    return NextResponse.json(
      { error: 'Ungültiges Passwort.' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(AUTH_COOKIE, body.password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 Tage
    path: '/',
  });

  return res;
}
