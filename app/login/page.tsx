'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isGatekeeperPassed, setIsGatekeeperPassed] = useState(false);
  const [gatekeeperPassword, setGatekeeperPassword] = useState('');

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
          // If already logged in as member, redirect to target page
          if (data.isMemberValid) {
            router.push(from === '/' ? '/dashboard' : from);
            return;
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [from, router]);

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
      setError('');
      setLoading(false);

      if (from === '/') {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.');
      setLoading(false);
    }
  }

  async function handleQuickMemberLogin() {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@trueyears.com', password: '123456', type: 'member' }),
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
          <>
            <p className="login-subtitle">Projekt-Zugang freischalten</p>
            <form onSubmit={handleGatekeeperSubmit} className="login-form">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="gatekeeper-password" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Projekt-Passwort</label>
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
              </div>

              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Wird geprüft…' : 'Zugang freischalten'}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="login-subtitle">Projekt freigeschaltet</p>
            <div className="login-form">
              <button
                type="button"
                onClick={handleQuickMemberLogin}
                className="login-button"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                  boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                  border: 'none',
                  padding: '0.85rem 1.5rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: '12px'
                }}
              >
                {loading ? 'Wird angemeldet…' : 'Mitglieder-Login'}
              </button>
              {error && <p className="login-error">{error}</p>}
            </div>
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
