'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [gatekeeperPassed, setGatekeeperPassed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  // Read gatekeeper status from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGatekeeperPassed(localStorage.getItem('ty_gatekeeper_passed') === 'true');
    }
  }, []);

  async function handleLogin(enteredPassword: string) {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: enteredPassword, type: 'gatekeeper' }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Ungültiges Passwort.');
        setLoading(false);
        return;
      }

      // Save credentials flags in storage
      localStorage.setItem('ty_is_member', 'true');
      localStorage.setItem('ty_gatekeeper_passed', 'true');
      localStorage.setItem('ty_last_active', Date.now().toString());
      sessionStorage.setItem('ty_session_active', 'true');

      // Successful login redirects directly to landing page
      window.location.href = '/';
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.');
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await handleLogin(password);
  }

  async function handleQuickLogin() {
    // Automatically submit with the expected default password
    await handleLogin('Longevity3000');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>TrueYears Longevity</h1>
        
        <p className="login-subtitle">Projekt-Zugang freischalten</p>
        
        {/* Manual Password Input (Always Visible) */}
        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              id="project-password"
              name="project-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort"
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

        {/* Green Quick-Login Button (Visible below if unlocked before) */}
        {gatekeeperPassed && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', width: '100%' }}>
            <p className="login-subtitle" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
              Projekt bereits freigeschaltet
            </p>
            <div className="login-form">
              <button
                type="button"
                onClick={handleQuickLogin}
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
            </div>
          </div>
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
