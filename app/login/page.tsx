'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [isGatekeeperPassed, setIsGatekeeperPassed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form states
  const [gatekeeperPassword, setGatekeeperPassword] = useState('');
  const [email, setEmail] = useState('demo@trueyears.com');
  const [memberPassword, setMemberPassword] = useState('123456');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  // Check current auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          setIsGatekeeperPassed(data.isGatekeeperValid);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  async function handleGatekeeperSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: gatekeeperPassword, type: 'gatekeeper' }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Projekt-Passwort ungültig.');
        setLoading(false);
        return;
      }

      setIsGatekeeperPassed(true);
      setLoading(false);

      // If we came from the landing page, we can redirect back there now
      if (from === '/') {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.');
      setLoading(false);
    }
  }

  async function handleMemberSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: memberPassword, type: 'member' }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Anmeldung fehlgeschlagen.');
        setLoading(false);
        return;
      }

      // Flag for UI state
      localStorage.setItem('ty_is_member', 'true');

      router.push(from === '/' ? '/dashboard' : from);
      router.refresh();
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.');
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <LoginFallback />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TrueYears Longevity</h1>
        
        {!isGatekeeperPassed ? (
          // Gatekeeper login
          <>
            <p className="login-subtitle">Projekt-Zugang freischalten</p>
            <form onSubmit={handleGatekeeperSubmit} className="login-form">
              <input
                id="gatekeeper-password"
                name="gatekeeper-password"
                type="password"
                value={gatekeeperPassword}
                onChange={(e) => setGatekeeperPassword(e.target.value)}
                placeholder="Projekt-Passwort"
                autoFocus
                autoComplete="current-password"
                disabled={loading}
                className="login-input"
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Wird geprüft…' : 'Zugang freischalten'}
              </button>
            </form>
          </>
        ) : (
          // Member login
          <>
            <p className="login-subtitle">Mitglieder-Login</p>
            <form onSubmit={handleMemberSubmit} className="login-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>E-Mail-Adresse</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  autoFocus
                  autoComplete="email"
                  disabled={loading}
                  className="login-input"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="member-password" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Passwort</label>
                <input
                  id="member-password"
                  name="member-password"
                  type="password"
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  placeholder="Passwort"
                  autoComplete="current-password"
                  disabled={loading}
                  className="login-input"
                />
              </div>

              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Wird angemeldet…' : 'Anmelden'}
              </button>

              <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
                Demo-Zugang: <strong style={{ color: '#006EA7' }}>demo@trueyears.com</strong> / <strong style={{ color: '#006EA7' }}>123456</strong>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TrueYears Longevity</h1>
        <p className="login-subtitle">Wird geladen…</p>
        <div className="login-form">
          <div className="login-input" style={{ opacity: 0.7 }} aria-hidden>Bitte warten…</div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
