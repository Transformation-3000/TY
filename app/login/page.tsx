'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const memberFlag = localStorage.getItem('ty_is_member');
      if (memberFlag === 'true') {
        setIsMember(true);
      }
    }
  }, []);

  async function performLogin(pass: string) {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || 'Anmeldung fehlgeschlagen.');
        setLoading(false);
        return;
      }

      // Flag speichern
      localStorage.setItem('ty_is_member', 'true');

      router.push(from);
      router.refresh();
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.');
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await performLogin(password);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Longevity Dashboard</h1>
        <p className="login-subtitle">Bitte Passwort eingeben</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input 
            type="text" 
            name="username" 
            autoComplete="username" 
            value="TrueYears Member" 
            readOnly 
            style={{ display: 'none' }} 
          />
          <label htmlFor="password" className="visually-hidden">
            Passwort
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
            autoFocus
            autoComplete="current-password"
            disabled={loading}
            className="login-input"
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Wird geprüft…' : 'Anmelden'}
          </button>

          {isMember && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', margin: '0.75rem 0' }}></div>
              <button
                type="button"
                onClick={() => performLogin('Longevity3000')}
                disabled={loading}
                className="login-button"
                style={{
                  width: '100%',
                  backgroundColor: '#7FD049',
                  borderColor: '#7FD049',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>👤</span> Member-Login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Longevity Dashboard</h1>
        <p className="login-subtitle">Bitte Passwort eingeben</p>
        <div className="login-form">
          <div className="login-input" style={{ opacity: 0.7 }} aria-hidden>Laden…</div>
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
