'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CategoryPetal {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  status: 'positive' | 'negative' | 'neutral';
  angle: number;
  stars: number;
  maxStars: number;
}

const categories: CategoryPetal[] = [
  { id: 'erholung', number: 1, title: 'Erholung', subtitle: 'Schlaf & Regeneration', status: 'positive', angle: 0, stars: 2, maxStars: 2 },
  { id: 'kraft', number: 2, title: 'Kraft & Ausdauer', subtitle: 'Bewegung & Sport', status: 'positive', angle: 60, stars: 1, maxStars: 2 },
  { id: 'vitalitaet', number: 3, title: 'Vitalität & Schutz', subtitle: 'Zellgesundheit & Ernährung', status: 'neutral', angle: 120, stars: 1, maxStars: 2 },
  { id: 'selbstfuersorge', number: 4, title: 'Selbstfürsorge', subtitle: 'Routinen & Mentales', status: 'positive', angle: 180, stars: 2, maxStars: 2 },
  { id: 'balance', number: 5, title: 'Balance & Entlastung', subtitle: 'Stress & Soziales', status: 'negative', angle: 240, stars: 0, maxStars: 2 },
  { id: 'resilienz', number: 6, title: 'Resilienz', subtitle: 'Adaptionsfähigkeit', status: 'neutral', angle: 300, stars: 1, maxStars: 2 },
];

const getCategoryIcon = (categoryId: string, color: string) => {
  const s = 18;
  const icons: Record<string, React.ReactElement> = {
    erholung: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    kraft: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <circle cx="12" cy="5" r="2" stroke={color} strokeWidth="2" />
        <path d="M12 7v4l-3 5M12 11l3 5M9 21l1.5-5M15 21l-1.5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11h3M14 11h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    vitalitaet: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M12 3L4 7v6c0 5.5 3.4 10.3 8 11.5 4.6-1.2 8-6 8-11.5V7l-8-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    selbstfuersorge: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    balance: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M12 3v18M3 9l9-6 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12l-2 6h4l-2-6zM19 12l-2 6h4l-2-6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    resilienz: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[categoryId] || icons['resilienz'];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'positive': return '#22c55e';
    case 'negative': return '#ef4444';
    default: return '#4498ca';
  }
};

const calculatePosition = (angle: number, distance: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: 50 + distance * Math.cos(rad), y: 50 + distance * Math.sin(rad) };
};

const ringRadius = 17;
const rayLength = 14;

const todayActivities = [
  { icon: '🚶', label: '20 Min. Spazieren', done: true },
  { icon: '💧', label: '2,5l Wasser', done: true },
  { icon: '🧘', label: 'Atemübung', done: false },
];

export default function VogelperspektivePage() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [checkedActivity, setCheckedActivity] = useState<number[]>([0, 1]);

  const todayStars = categories.reduce((sum, c) => sum + c.stars, 0);
  const maxStars = categories.reduce((sum, c) => sum + c.maxStars, 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Guten Morgen';
    if (h < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  const getCurrentDate = () =>
    new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="bird-view-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-gradient-orb bg-gradient-orb-1" />
        <div className="bg-gradient-orb bg-gradient-orb-2" />
        <div className="bg-gradient-orb bg-gradient-orb-3" />
      </div>

      {/* Welcome Header */}
      <div className="welcome-header">
        <span className="welcome-date-badge">{getCurrentDate()}</span>
        <h1 className="welcome-greeting">{getGreeting()}, <span className="user-name">Hendrik</span></h1>
        <p className="welcome-subtitle">
          Du hast heute <strong style={{ color: '#4498ca' }}>{todayStars} von {maxStars} Sternen</strong> gesammelt – weiter so!
        </p>
      </div>

      {/* Sun Canvas */}
      <div className="bird-view-layout">
        <div className="bird-view-canvas">
          <div className="bird-view-bg">
            <div className="bg-circle bg-circle-1" />
            <div className="bg-circle bg-circle-2" />
          </div>

          <svg className="connection-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="0.2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Colored ring segments */}
            <g>
              {categories.map((cat, i) => {
                const color = getStatusColor(cat.status);
                const prevColor = getStatusColor(categories[(i - 1 + categories.length) % categories.length].status);
                const nextColor = getStatusColor(categories[(i + 1) % categories.length].status);
                const startAngle = cat.angle - 30;
                const endAngle = cat.angle + 30;
                const start = ((startAngle - 90) * Math.PI) / 180;
                const end = ((endAngle - 90) * Math.PI) / 180;
                const x1 = 50 + ringRadius * Math.cos(start);
                const y1 = 50 + ringRadius * Math.sin(start);
                const x2 = 50 + ringRadius * Math.cos(end);
                const y2 = 50 + ringRadius * Math.sin(end);
                const gId = `seg-${cat.id}`;
                return (
                  <g key={gId}>
                    <defs>
                      <linearGradient id={gId} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                        <stop offset="0%" stopColor={prevColor} stopOpacity="0.4" />
                        <stop offset="50%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={nextColor} stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <path d={`M ${x1} ${y1} A ${ringRadius} ${ringRadius} 0 0 1 ${x2} ${y2}`}
                      stroke={`url(#${gId})`} strokeWidth="0.7" fill="none" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>
            {/* Ray lines */}
            {categories.map((cat) => {
              const ringPos = calculatePosition(cat.angle, ringRadius);
              const boxPos = calculatePosition(cat.angle, ringRadius + rayLength);
              const isHovered = hoveredCategory === cat.id;
              const lineColor = getStatusColor(cat.status);
              return (
                <g key={`line-${cat.id}`}>
                  <line x1={ringPos.x} y1={ringPos.y} x2={boxPos.x} y2={boxPos.y}
                    stroke={lineColor} strokeWidth={isHovered ? '0.45' : '0.28'}
                    strokeOpacity={isHovered ? '0.6' : '0.35'} />
                  <circle cx={boxPos.x} cy={boxPos.y} r={isHovered ? '0.55' : '0.38'}
                    fill={lineColor} stroke="white" strokeWidth="0.1"
                    opacity={isHovered ? '0.95' : '0.75'} />
                </g>
              );
            })}
          </svg>

          {/* Central Sun – profile image + star overlay */}
          <div className="central-sun-circle">
            <div className="sun-inner-ring" />
            <div className="sun-image-wrapper">
              <div className="sun-image-glow" />
              <Image
                src="/images/woman3.png"
                alt="Profile"
                width={400}
                height={400}
                className="sun-profile-image"
                style={{ objectFit: 'cover', aspectRatio: '1' }}
              />
            </div>
            <div className="sun-overlay-section">
              <div className="sun-stars-row">
                {Array.from({ length: maxStars }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < todayStars ? '#4498ca' : 'rgba(255,255,255,0.3)'} style={{ filter: i < todayStars ? 'drop-shadow(0 0 3px rgba(68,152,202,0.8))' : 'none' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div className="sun-stars-label">{todayStars}/{maxStars} Heute</div>
            </div>
          </div>

          {/* Category boxes */}
          {categories.map((cat) => {
            const pos = calculatePosition(cat.angle, ringRadius + rayLength);
            const isHovered = hoveredCategory === cat.id;
            const statusColor = getStatusColor(cat.status);
            return (
              <div
                key={cat.id}
                className={`category-box ${cat.status} ${isHovered ? 'hovered' : ''}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, '--status-color': statusColor } as React.CSSProperties}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="category-box-content">
                  <div className="category-icon-wrapper" style={{ '--icon-color': statusColor } as React.CSSProperties}>
                    <div className="icon-bg" />
                    {getCategoryIcon(cat.id, statusColor)}
                  </div>
                  <div>
                    <div className="category-title">{cat.number}. {cat.title}</div>
                    <div className="category-stars-mini">
                      {Array.from({ length: cat.maxStars }).map((_, i) => (
                        <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill={i < cat.stars ? '#4498ca' : '#cbd5e1'}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Two-Column Section */}
      <div className="bottom-section">
        {/* LEFT: Level & Journey */}
        <div className="bottom-card">
          <div className="bottom-card-header">
            <div className="bottom-card-icon" style={{ background: 'linear-gradient(135deg, #4498ca, #2c6a8c)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <div className="bottom-card-title">Dein Level & Journey</div>
              <div className="bottom-card-sub">Longevity Fortschritt</div>
            </div>
            <div className="level-badge">Level 3</div>
          </div>

          <div style={{ padding: '0 0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>Fortschritt zu Level 4</span>
              <span style={{ fontSize: '0.72rem', color: '#4498ca', fontWeight: 700 }}>68%</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: '68%' }} />
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.4rem' }}>Noch 32 Sterne bis Level 4</div>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Wöchentliche Highlights
            </div>
            {[
              { icon: '🔥', text: '5 Tage Streak', sub: 'Login-Serie läuft!' },
              { icon: '⭐', text: '47 Sterne diese Woche', sub: '+12 vs. letzte Woche' },
              { icon: '🎯', text: 'Ziel: Erholung', sub: 'Schlafqualität verbessert' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.5rem 0.6rem', borderRadius: '8px',
                background: 'rgba(68,152,202,0.05)', border: '1px solid rgba(68,152,202,0.1)',
              }}>
                <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>{item.text}</div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="bottom-cta-btn" style={{ marginTop: '1rem' }}>
            <i className="bi bi-compass" style={{ marginRight: '0.4rem' }} />
            Journey fortsetzen
          </button>
        </div>

        {/* RIGHT: Lisa Daily + Activity Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Lisa Daily Card */}
          <div className="lisa-daily-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Image
                  src="/images/woman3.png"
                  alt="Lisa"
                  width={52}
                  height={52}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '2.5px solid rgba(68,152,202,0.4)' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: '#22c55e', border: '2px solid white',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a3a50' }}>Lisa Daily</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>„Heute ist ein guter Tag für einen Check-in 💙"</div>
              </div>
              <div style={{
                background: 'rgba(68,152,202,0.1)', borderRadius: '8px',
                padding: '0.3rem 0.6rem', fontSize: '0.65rem', fontWeight: 700, color: '#4498ca',
              }}>
                ~5 Min
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="bottom-cta-btn" style={{ flex: 1, fontSize: '0.78rem' }}>
                <i className="bi bi-chat-heart" style={{ marginRight: '0.35rem' }} />
                Daily Check-in starten
              </button>
              <button style={{
                padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1.5px solid rgba(68,152,202,0.25)',
                background: 'transparent', color: '#4498ca', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              }}>
                Weekly →
              </button>
            </div>
          </div>

          {/* Activity Quick-Log */}
          <div className="bottom-card" style={{ padding: '1rem 1.25rem' }}>
            <div className="bottom-card-header" style={{ marginBottom: '0.75rem' }}>
              <div className="bottom-card-icon" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <div>
                <div className="bottom-card-title">Aktivitäten heute</div>
                <div className="bottom-card-sub">Schnell eintragen</div>
              </div>
              <button style={{
                marginLeft: 'auto', padding: '0.3rem 0.65rem', borderRadius: '7px',
                background: 'linear-gradient(135deg, #4498ca, #2c6a8c)',
                border: 'none', color: 'white', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
              }}>
                + Hinzufügen
              </button>
            </div>

            {todayActivities.map((act, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.5rem 0.6rem', borderRadius: '8px', marginBottom: '0.35rem',
                background: checkedActivity.includes(i) ? 'rgba(68,152,202,0.06)' : 'rgba(248,250,252,0.8)',
                border: `1px solid ${checkedActivity.includes(i) ? 'rgba(68,152,202,0.2)' : 'rgba(203,213,225,0.5)'}`,
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '1rem' }}>{act.icon}</span>
                <span style={{
                  fontSize: '0.78rem', fontWeight: 500, flex: 1,
                  color: checkedActivity.includes(i) ? '#334155' : '#64748b',
                  textDecoration: checkedActivity.includes(i) ? 'none' : 'none',
                }}>
                  {act.label}
                </span>
                <button
                  onClick={() => setCheckedActivity(prev =>
                    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
                  )}
                  style={{
                    width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                    border: `2px solid ${checkedActivity.includes(i) ? '#4498ca' : '#cbd5e1'}`,
                    background: checkedActivity.includes(i) ? '#4498ca' : 'transparent',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                >
                  {checkedActivity.includes(i) && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                {checkedActivity.includes(i) && (
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#4498ca', background: 'rgba(68,152,202,0.12)', borderRadius: '5px', padding: '0.1rem 0.35rem' }}>
                    +1 ★
                  </span>
                )}
              </div>
            ))}

            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.6rem',
              padding: '0.45rem 0.6rem', borderRadius: '8px',
              background: 'rgba(248,250,252,0.5)', border: '1.5px dashed rgba(203,213,225,0.7)',
              cursor: 'pointer', color: '#94a3b8', fontSize: '0.75rem',
            }}>
              <i className="bi bi-mic-fill" style={{ color: '#4498ca' }} />
              <span>„Ich war 30 Minuten joggen..." – Voice eingeben</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bird-view-container {
          width: 100%;
          min-height: calc(100vh - 80px);
          background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 20%, #f0fdfa 40%, #ecfeff 60%, #e0f2fe 80%, #f0f9ff 100%);
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          padding: 0.5rem 2rem 2.5rem 2rem;
          animation: backgroundShift 20s ease-in-out infinite;
        }

        @keyframes backgroundShift {
          0%, 100% { background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 20%, #f0fdfa 40%, #ecfeff 60%, #e0f2fe 80%, #f0f9ff 100%); }
          50% { background: linear-gradient(145deg, #e0f2fe 0%, #f0fdfa 20%, #ecfeff 40%, #f0f9ff 60%, #e0f2fe 80%, #f0fdfa 100%); }
        }

        .animated-background {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          pointer-events: none; z-index: 0; overflow: hidden;
        }
        .bg-gradient-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; animation: floatOrb 20s ease-in-out infinite; }
        .bg-gradient-orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(68,152,202,0.25) 0%, rgba(34,197,94,0.15) 50%, transparent 70%); top: 10%; left: 10%; animation-duration: 25s; }
        .bg-gradient-orb-2 { width: 800px; height: 800px; background: radial-gradient(circle, rgba(44,106,140,0.2) 0%, rgba(68,152,202,0.12) 50%, transparent 70%); top: 60%; right: 15%; animation-duration: 30s; animation-direction: reverse; }
        .bg-gradient-orb-3 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(68,152,202,0.1) 50%, transparent 70%); bottom: 20%; left: 50%; animation-duration: 35s; }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0,0) scale(1); opacity: 0.4; }
          25% { transform: translate(50px,-30px) scale(1.1); opacity: 0.5; }
          50% { transform: translate(-30px,50px) scale(0.9); opacity: 0.3; }
          75% { transform: translate(30px,30px) scale(1.05); opacity: 0.45; }
        }

        .welcome-header {
          text-align: center; padding: 1rem 0 0 0; z-index: 10; position: relative;
          margin-bottom: -4.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
        }
        .welcome-date-badge {
          font-size: 0.65rem; color: #64748b; background: rgba(255,255,255,0.7);
          padding: 0.25rem 0.6rem; border-radius: 20px; font-weight: 500;
        }
        .welcome-greeting { font-size: 2rem; font-weight: 400; color: #475569; margin: 0; }
        .user-name {
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 600;
        }
        .welcome-subtitle { font-size: 0.92rem; color: #64748b; margin: 0; }

        .bird-view-layout {
          position: relative; width: 100%; max-width: 1300px; margin: 0 auto; z-index: 1;
        }

        .bird-view-canvas {
          position: relative; width: 100%; max-width: 950px; aspect-ratio: 1;
          margin: -5.5rem auto 1rem;
        }

        .connection-svg {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1;
          animation: pulseLines 3s ease-in-out infinite;
        }
        @keyframes pulseLines { 0%, 100% { opacity: 1; } 50% { opacity: 0.75; } }

        .bird-view-bg { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 100%; height: 100%; pointer-events: none; }
        .bg-circle { position: absolute; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: float 25s ease-in-out infinite; }
        .bg-circle-1 { width: 900px; height: 900px; background: radial-gradient(circle, rgba(68,152,202,0.08) 0%, rgba(34,197,94,0.05) 40%, transparent 70%); }
        .bg-circle-2 { width: 1400px; height: 1400px; background: radial-gradient(circle, rgba(44,106,140,0.06) 0%, rgba(68,152,202,0.04) 30%, transparent 60%); animation-delay: -12s; }
        @keyframes float { 0%, 100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.03); } }

        .central-sun-circle {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
          width: ${ringRadius * 2}%; aspect-ratio: 1; border-radius: 50%;
          background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.95) 50%, rgba(224,242,254,0.9) 100%);
          backdrop-filter: blur(30px);
          box-shadow: 0 8px 40px rgba(68,152,202,0.2), 0 4px 20px rgba(34,197,94,0.1), inset 0 2px 0 rgba(255,255,255,1), 0 0 60px rgba(68,152,202,0.15);
          border: 3px solid rgba(255,255,255,0.95); z-index: 2;
          display: flex; flex-direction: column; align-items: stretch; overflow: hidden;
          animation: sunPulse 4s ease-in-out infinite;
        }
        @keyframes sunPulse {
          0%, 100% { box-shadow: 0 8px 40px rgba(68,152,202,0.2), 0 4px 20px rgba(34,197,94,0.1), inset 0 2px 0 rgba(255,255,255,1), 0 0 60px rgba(68,152,202,0.15); }
          50% { box-shadow: 0 12px 50px rgba(68,152,202,0.3), 0 6px 25px rgba(34,197,94,0.15), inset 0 2px 0 rgba(255,255,255,1), 0 0 80px rgba(68,152,202,0.25); }
        }

        .sun-inner-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 85%; height: 85%; border-radius: 50%; border: 2px solid rgba(68,152,202,0.15); pointer-events: none; z-index: 1; }

        .sun-image-wrapper { width: 100%; height: 100%; overflow: hidden; position: absolute; top: 0; left: 0; border-radius: 50%; z-index: 1; display: flex; align-items: center; justify-content: center; }
        .sun-image-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 110%; height: 110%; border-radius: 50%; background: radial-gradient(circle, rgba(68,152,202,0.1) 0%, transparent 70%); filter: blur(10px); z-index: 0; }
        .sun-profile-image { width: 88% !important; height: 88% !important; object-fit: cover; object-position: center 20%; border-radius: 50%; border: 3px solid rgba(255,255,255,0.8); box-shadow: 0 4px 20px rgba(0,0,0,0.15); animation: imagePulse 3s ease-in-out infinite; }
        @keyframes imagePulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }

        .sun-overlay-section {
          width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
          padding: 0 1rem 1.5rem; position: absolute; bottom: 0; z-index: 3;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.45) 100%);
          border-radius: 50%;
        }
        .sun-stars-row { display: flex; gap: 3px; margin-bottom: 0.25rem; }
        .sun-stars-label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.95); background: rgba(68,152,202,0.3); backdrop-filter: blur(6px); padding: 0.2rem 0.6rem; border-radius: 12px; border: 1px solid rgba(68,152,202,0.4); }

        /* Category Boxes */
        .category-box { position: absolute; transform: translate(-50%,-50%); z-index: 5; cursor: pointer; transition: all 0.3s ease; }
        .category-box.hovered { z-index: 20; transform: translate(-50%,-50%) scale(1.08); }
        .category-box-content {
          background: linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.97) 100%);
          backdrop-filter: blur(20px); border-radius: 14px; padding: 0.5rem 0.7rem;
          min-width: 120px; max-width: 165px; width: max-content;
          box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
          border: 1.5px solid rgba(255,255,255,0.8); transition: all 0.3s ease;
          display: flex; align-items: flex-start; gap: 0.5rem;
        }
        .category-box.hovered .category-box-content {
          box-shadow: 0 15px 45px rgba(0,0,0,0.2), 0 0 0 3px var(--status-color), 0 0 20px var(--status-color);
          transform: translateY(-3px); border-color: var(--status-color);
        }
        .category-box.positive .category-box-content { border-color: rgba(34,197,94,0.35); box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 0 12px rgba(34,197,94,0.15); }
        .category-box.negative .category-box-content { border-color: rgba(239,68,68,0.35); box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 0 12px rgba(239,68,68,0.15); }
        .category-box.neutral .category-box-content { border-color: rgba(68,152,202,0.35); box-shadow: 0 6px 20px rgba(0,0,0,0.1), 0 0 12px rgba(68,152,202,0.15); }

        .category-icon-wrapper { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 26px; height: 26px; border-radius: 7px; position: relative; transition: all 0.3s; margin-top: 1px; }
        .icon-bg { position: absolute; inset: 0; border-radius: 7px; background: var(--icon-color); opacity: 0.12; }
        .category-box.hovered .icon-bg { opacity: 0.22; }
        .category-title { font-size: 0.7rem; font-weight: 700; color: #1e293b; text-transform: uppercase; letter-spacing: 0.02em; line-height: 1.2; transition: color 0.3s; }
        .category-box.hovered .category-title { color: var(--status-color); }
        .category-stars-mini { display: flex; gap: 2px; margin-top: 3px; }

        /* Bottom Section */
        .bottom-section {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
          max-width: 1050px; margin: -5rem auto 0; padding: 0 1rem; z-index: 5; position: relative;
        }

        .bottom-card {
          background: linear-gradient(145deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.94) 100%);
          backdrop-filter: blur(20px); border-radius: 16px; padding: 1.25rem 1.35rem;
          box-shadow: 0 4px 20px rgba(68,152,202,0.1), 0 2px 8px rgba(0,0,0,0.04);
          border: 1.5px solid rgba(255,255,255,0.9); transition: all 0.25s;
        }
        .bottom-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(68,152,202,0.15), 0 4px 12px rgba(0,0,0,0.06); }

        .bottom-card-header { display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1rem; }
        .bottom-card-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .bottom-card-title { font-size: 0.82rem; font-weight: 700; color: #1a3a50; line-height: 1.2; }
        .bottom-card-sub { font-size: 0.67rem; color: #94a3b8; }

        .level-badge {
          margin-left: auto; padding: 0.25rem 0.65rem; border-radius: 20px;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em; white-space: nowrap;
        }

        .progress-bar-track { width: 100%; height: 8px; background: rgba(68,152,202,0.1); border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg, #4498ca, #2c6a8c); border-radius: 4px; animation: progressGrow 1s ease-out; }
        @keyframes progressGrow { from { width: 0 !important; } }

        .bottom-cta-btn {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 0.55rem; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 0.8rem; font-weight: 600; cursor: pointer; letter-spacing: 0.02em;
          box-shadow: 0 3px 10px rgba(68,152,202,0.3); transition: all 0.2s;
        }
        .bottom-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 15px rgba(68,152,202,0.4); }

        .lisa-daily-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.97) 0%, rgba(240,249,255,0.95) 100%);
          backdrop-filter: blur(20px); border-radius: 16px; padding: 1.1rem 1.25rem;
          box-shadow: 0 4px 20px rgba(68,152,202,0.12), 0 2px 8px rgba(0,0,0,0.04);
          border: 1.5px solid rgba(68,152,202,0.2); transition: all 0.25s;
        }
        .lisa-daily-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(68,152,202,0.18); }

        @media (max-width: 1100px) {
          .bottom-section { grid-template-columns: 1fr; margin: -3rem auto 0; }
          .bird-view-canvas { max-width: 700px; }
        }
        @media (max-width: 700px) {
          .bird-view-container { padding: 0.5rem 1rem 2rem; }
          .bird-view-canvas { max-width: 500px; }
          .category-box-content { min-width: 95px; padding: 0.4rem 0.55rem; }
          .category-title { font-size: 0.6rem; }
        }
      `}</style>
    </div>
  );
}
