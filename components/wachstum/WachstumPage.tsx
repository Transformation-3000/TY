'use client';

import { useState } from 'react';
import Image from 'next/image';

interface QuickWin {
  id: string;
  title: string;
  desc: string;
  maturityRequired: number;
  unlocked: boolean;
  category: string;
}

const QUICK_WINS: QuickWin[] = [
  { id: 'qw1', category: 'Schlaf', title: 'Magnesium vor dem Schlaf', desc: 'Verbessert die Muskelentspannung.', maturityRequired: 1, unlocked: true },
  { id: 'qw2', category: 'Schlaf', title: 'Blaulichtfilter ab 20 Uhr', desc: 'Schont die Melatonin-Produktion.', maturityRequired: 2, unlocked: true },
  
  { id: 'qw4', category: 'Zellversorgung', title: '14h Fastenfenster', desc: 'Erster Schritt zur Autophagie.', maturityRequired: 1, unlocked: true },
  { id: 'qw5', category: 'Zellversorgung', title: 'Spermidin-reiche Kost', desc: 'Unterstützt die Zellreinigung.', maturityRequired: 2, unlocked: false },

  { id: 'qw7', category: 'Kraft', title: 'Täglich 8.000 Schritte', desc: 'Basis für kardiovaskuläre Fitness.', maturityRequired: 1, unlocked: true },
  { id: 'qw8', category: 'Kraft', title: 'Zone 2 Training (30 Min.)', desc: 'Optimiert die Mitochondrien.', maturityRequired: 2, unlocked: true },
];

const OPTIMIZATION_FIELDS = [
  { id: 'Schlaf', label: 'Schlaf & Erholung', icon: 'bi-moon-stars', color: '#4498ca', maturity: 65, level: 2, active: true },
  { id: 'Kraft', label: 'Kraft & Ausdauer', icon: 'bi-fire', color: '#22c55e', maturity: 42, level: 1, active: true },
  { id: 'Zellversorgung', label: 'Zellerneuerung & Wachstum', icon: 'bi-cup-hot', color: '#f59e0b', maturity: 15, level: 0, active: false },
  { id: 'Immunbalance', label: 'Immunbalance & Entlastung', icon: 'bi-wind', color: '#8b5cf6', maturity: 30, level: 0, active: false },
  { id: 'Soziale Bindungen', label: 'Selbstfürsorge & Soziale Bindungen', icon: 'bi-people', color: '#ec4899', maturity: 80, level: 0, active: false },
  { id: 'Mindset', label: 'Mentale Resilienz & Mindset', icon: 'bi-stars', color: '#06b6d4', maturity: 50, level: 0, active: false },
];

interface WachstumPageProps {
  onNavigate?: (id: string) => void;
  onStartLisaDaily?: () => void;
  onStartSimulation?: () => void;
}

export default function WachstumPage({ onNavigate, onStartLisaDaily, onStartSimulation }: WachstumPageProps) {
  const [selectedField, setSelectedField] = useState(OPTIMIZATION_FIELDS[0]);
  const userMaturity = 2; // Beispiel-Reifegrad für die Logik rechts

  const filteredWins = QUICK_WINS.filter(win => win.category === selectedField.id && win.maturityRequired <= userMaturity);

  return (
    <div className="wachstum-container">
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Quick Wins</h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '0.5rem', margin: 0 }}>Do Longevity yourself: Deine sofort umsetzbaren Bausteine</p>
      </header>

      <div className="wachstum-layout">
        
        {/* Links: Auswahl Optimierungsfelder */}
        <section className="fields-section">
          <div className="fields-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {OPTIMIZATION_FIELDS.map((field) => (
              <button
                key={field.id}
                onClick={() => field.active && setSelectedField(field)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderRadius: '20px',
                  border: selectedField.id === field.id ? `2px solid ${field.color}` : '2px solid #f1f5f9',
                  background: selectedField.id === field.id ? '#fff' : '#f8fafc',
                  cursor: field.active ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedField.id === field.id ? '0 10px 20px rgba(0,0,0,0.05)' : 'none',
                  opacity: field.active ? 1 : 0.6,
                  filter: field.active ? 'none' : 'grayscale(0.8)'
                }}
              >
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '12px', 
                  background: selectedField.id === field.id ? field.color : '#fff',
                  color: selectedField.id === field.id ? '#fff' : (field.active ? field.color : '#94a3b8'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', transition: 'all 0.2s'
                }}>
                  <i className={`bi ${field.active ? field.icon : 'bi-lock'}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: field.active ? '#1e293b' : '#64748b' }}>{field.label}</div>
                  {field.active && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        Level {field.level}
                      </div>
                      <div style={{ 
                        padding: '2px 8px', borderRadius: '6px', background: selectedField.id === field.id ? field.color : '#e2e8f0',
                        color: selectedField.id === field.id ? '#fff' : '#64748b', fontSize: '0.65rem', fontWeight: 800,
                        textTransform: 'uppercase', letterSpacing: '0.02em'
                      }}>
                        Auswählen
                      </div>
                    </div>
                  )}
                  <div style={{ marginTop: '0.5rem', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${field.maturity}%`, height: '100%', background: field.active ? field.color : '#cbd5e1' }} />
                  </div>
                </div>
                {field.active ? (
                  <div style={{ textAlign: 'right', marginLeft: '0.5rem' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
                      {field.maturity}<span style={{ fontSize: '0.9rem', opacity: 0.6 }}>%</span>
                    </div>
                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginTop: '2px' }}>Reifegrad</div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Inaktiv</div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Rechts: Quick Wins Navigator */}
        <section className="navigator-section">
          {onStartSimulation && (
            <div 
              className="sim-card-wide"
              onClick={onStartSimulation}
            >
              <div className="sim-card-wide-img-wrap">
                <Image 
                  src="/images/dna_helix_soft.png" 
                  alt="Zellalter Simulation" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="sim-card-wide-content">
                <div className="sim-card-body-row">
                  <div className="sim-card-text-side">
                    <span className="sim-card-wide-badge">Zellalter-Simulation</span>
                    <h3>Wie beeinflusst dein Lebensstil dein biologisches Alter?</h3>
                    <p>
                      Finde heraus, wie sich gezielte Lifestyle-Changes in den Bereichen Schlaf, Sport und Ernährung direkt auf deine Zellen auswirken. Simuliere deine Routinen und starte dein Verjüngungsexperiment!
                    </p>
                    <span className="sim-card-wide-link">Simulation starten →</span>
                  </div>
                  <div className="sim-card-circle-side">
                    <div className="bac-circle-container-mini">
                      <svg className="bac-circle-svg-mini" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="simAgeScoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4498ca" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                          <filter id="simSoftGlow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.15" />
                          </filter>
                        </defs>
                        <circle cx="50" cy="50" r="41" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="41" 
                          fill="none" 
                          stroke="url(#simAgeScoreGrad)" 
                          strokeWidth="7.5" 
                          strokeDasharray="257.6" 
                          strokeDashoffset={257.6 * (1 - 42.5 / 111)} 
                          strokeLinecap="round" 
                          filter="url(#simSoftGlow)"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="bac-circle-text-box-mini">
                        <span className="bac-circle-val-mini">42,5</span>
                        <span className="bac-circle-lab-mini">Jahre</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="navigator-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
                  Fokus: {selectedField.label}
                </h2>
              </div>
            </div>

            <div className="quick-wins-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {filteredWins.map((win) => (
                <div key={win.id} className="quick-win-card">
                  <div className="quick-win-card-icon" style={{ 
                    width: '60px', height: '60px', borderRadius: '50%', 
                    background: `${selectedField.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', color: selectedField.color,
                    flexShrink: 0
                  }}>
                    <i className="bi bi-check2-circle"></i>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                        {win.title}
                      </h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                      {win.desc}
                    </p>
                  </div>
                  <div style={{ color: selectedField.color, fontSize: '1.2rem', opacity: 0.5 }}>
                    <i className="bi bi-chevron-right"></i>
                  </div>
                </div>
              ))}
              {filteredWins.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                  <i className="bi bi-info-circle" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}></i>
                  Aktuell keine weiteren Quick Wins für diesen Bereich verfügbar.
                </div>
              )}
            </div>


          </div>
        </section>
      </div>

      <style jsx>{`
        .sim-card-wide {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 2rem;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sim-card-wide:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0, 110, 167, 0.08);
          border-color: #006ea7;
        }
        .sim-card-wide-img-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          flex-shrink: 0;
          background: #f1f5f9;
        }
        .sim-card-wide-content {
          padding: 1.5rem;
          text-align: left;
        }
        .sim-card-body-row {
          display: flex;
          align-items: flex-end;
          gap: 1.5rem;
        }
        .sim-card-text-side {
          flex: 1;
        }
        .sim-card-circle-side {
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .bac-circle-container-mini {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bac-circle-svg-mini {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .bac-circle-text-box-mini {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .bac-circle-val-mini {
          font-size: 2.3rem;
          font-weight: 900;
          color: #1c2b3e;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .bac-circle-lab-mini {
          font-size: 0.85rem;
          font-weight: 700;
          color: #8fa0b5;
          margin-top: 2px;
        }
        .sim-card-wide-badge {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #22c55e;
          margin-bottom: 0.35rem;
          display: inline-block;
        }
        .sim-card-wide h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.3;
        }
        .sim-card-wide p {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.5;
        }
        .sim-card-wide-link {
          font-size: 0.9rem;
          font-weight: 700;
          color: #006ea7;
          transition: color 0.2s ease;
        }
        .sim-card-wide:hover .sim-card-wide-link {
          color: #22c55e;
        }

        .wachstum-container {
          padding: 2rem 3.5rem 2rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeIn 0.5s ease-out;
        }
        
        .wachstum-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .navigator-box {
          background: #f8fafc;
          border-radius: 32px;
          padding: 1.75rem 2.5rem 2.5rem;
        }

        .quick-win-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }

        @media (max-width: 991px) {
          .wachstum-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .wachstum-container {
            padding: 1rem 2rem 1rem 1rem;
          }
        }

        @media (max-width: 576px) {
          .navigator-box {
            padding: 1.25rem 1rem 1.5rem;
            border-radius: 24px;
          }
          .quick-win-card {
            padding: 1rem;
            gap: 1rem;
            flex-direction: column;
            align-items: flex-start;
          }
          .quick-win-card-icon {
            align-self: center;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
