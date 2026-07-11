'use client';

import React, { useState } from 'react';

interface CardioSimulationPageProps {
  onBack: () => void;
}

export default function CardioSimulationPage({ onBack }: CardioSimulationPageProps) {
  // Inputs
  const [simZone2, setSimZone2] = useState(90);
  const [simHIIT, setSimHIIT] = useState(1);
  const [simRegen, setSimRegen] = useState(70);

  // Calculations
  const baseVO2 = 35.0;
  const z2Points = (simZone2 / 240) * 5.0; // Max +5 VO2-Max
  const hiitPoints = (simHIIT / 4) * 6.0;  // Max +6 VO2-Max
  
  let overtrainingPenalty = 0;
  if (simHIIT >= 3 && simRegen < 60) {
    overtrainingPenalty = 4.0;
  } else if (simHIIT >= 2 && simRegen < 50) {
    overtrainingPenalty = 2.0;
  } else if (simHIIT === 4 && simRegen < 75) {
    overtrainingPenalty = 2.5;
  }
  
  const regenFactor = (simRegen - 30) / 70; // 0 bis 1
  const calculatedVO2 = Math.min(48.5, Math.max(30.0, baseVO2 + (z2Points + hiitPoints) * (0.3 + 0.7 * regenFactor) - overtrainingPenalty));
  
  const bioAgeDiff = (calculatedVO2 - baseVO2) * 0.45; // Bis zu -6 Jahre
  const healthspanBonus = (calculatedVO2 - baseVO2) * 0.35; // Bis zu +4.7 Jahre
  
  let cardMixerStatus = "Gute Balance. Erhöhe Zone-2 oder HIIT für stärkere Langlebigkeits-Effekte.";
  let cardMixerColor = "#eab308"; // gelb
  let cardMixerIcon = "bi-shield-shaded";
  let pulseSpeed = "2s";
  
  if (simHIIT >= 3 && simRegen < 70) {
    cardMixerStatus = "Systemwarnung: Übertraining! Du trainierst zu hart für deine Regeneration. Schontage einlegen!";
    cardMixerColor = "#ef4444"; // rot
    cardMixerIcon = "bi-exclamation-triangle-fill";
    pulseSpeed = "0.4s";
  } else if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
    cardMixerStatus = "Perfect Flow! Dein Herzschlag-Rhythmus klingt kraftvoll und harmonisch. Maximaler Fortschritt!";
    cardMixerColor = "#22c55e"; // grün
    cardMixerIcon = "bi-check-circle-fill";
    pulseSpeed = "1.2s";
  } else if (simZone2 < 60 && simHIIT === 0) {
    cardMixerStatus = "Systemstatus: Träge. Erhöhe Zone-2-Einheiten, um deine zelluläre Akkuladung zu starten.";
    cardMixerColor = "#64748b"; // grau
    cardMixerIcon = "bi-info-circle-fill";
    pulseSpeed = "3s";
  }

  return (
    <div className="sim-container">
      <style dangerouslySetInnerHTML={{__html: `
        .sim-container {
          padding: 2rem 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
        }
        .sim-header {
          margin-bottom: 2.5rem;
        }
        .sim-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .sim-title {
          font-size: 2.2rem;
          fontWeight: 800;
          color: #0f172a;
          margin: 0;
        }
        .sim-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          margin: 0;
          max-width: 800px;
          line-height: 1.6;
        }
        .sim-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.88rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .sim-back-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .sim-section-card {
          background: #ffffff;
          border: 1px solid rgba(0, 110, 167, 0.06);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.01);
          margin-bottom: 2.5rem;
        }
        .sim-sec-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #006EA7;
          margin: 0 0 0.5rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sim-sec-desc {
          font-size: 1rem;
          color: #475569;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }
        .sim-divider {
          border: none;
          border-top: 1px solid rgba(0, 110, 167, 0.08);
          margin: 2.5rem 0;
        }
        @keyframes heartbeat-sim {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1.18); }
          100% { transform: scale(1); }
        }
      `}} />

      {/* Header */}
      <div className="sim-header">
        <div className="sim-title-row">
          <h1 className="sim-title">Cardio- & VO2-Max-Simulator</h1>
          <button className="sim-back-btn" onClick={onBack}>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9L1 5L5 1" />
            </svg>
            Zurück
          </button>
        </div>
        <p className="sim-subtitle">
          Verstehe spielerisch, wie sich deine wöchentlichen Trainings- und Erholungseinheiten direkt auf deine Langlebigkeit auswirken.
        </p>
      </div>

      <div className="sim-section-card">

        {/* I. DAS LANGLEBIGKEITS-RENNEN */}
        <div>
          <h2 className="sim-sec-title">I. Das Langlebigkeits-Rennen</h2>
          <p className="sim-sec-desc">
            Vergleiche deine simulated Leistung mit deiner untrainierten Langlebigkeits-Basis.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ paddingRight: '2rem' }}>
              <div 
                style={{
                  background: '#f1f5f9',
                  height: '24px',
                  borderRadius: '12px',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  margin: '3rem 0 2.5rem'
                }}
              >
                {/* Grid Marks */}
                {[0, 25, 50, 75, 100].map((mark) => (
                  <span 
                    key={mark}
                    style={{
                      position: 'absolute',
                      left: `${10 + mark * 0.75}%`,
                      top: '5px',
                      width: '2px',
                      height: '14px',
                      background: '#cbd5e1'
                    }}
                  />
                ))}

                {/* Avatar A: Aktuelles Ich */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '10%',
                    top: '-32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>🏃‍♂️</span>
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    Basis (35.0)
                  </span>
                </div>

                {/* Avatar B: Zukünftiges Ich */}
                <div 
                  style={{
                    position: 'absolute',
                    left: `${10 + ((calculatedVO2 - 30) / 20) * 75}%`,
                    top: '-32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 5px rgba(34, 197, 94, 0.4))' }}>🏃‍♂️⚡</span>
                  <span 
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#22c55e',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    Ziel ({calculatedVO2.toFixed(1)})
                  </span>
                </div>
              </div>
            </div>

            {/* Outcomes Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div 
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.04)'
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>
                  -{bioAgeDiff.toFixed(1)} J.
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                  Herzalter
                </div>
              </div>

              <div 
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.04)'
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2563eb' }}>
                  +{healthspanBonus.toFixed(1)} J.
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                  Healthspan
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="sim-divider" />

        {/* II. DER VO2-MAX BERGSTEIGER-SIMULATOR */}
        <div>
          <h2 className="sim-sec-title">II. Der VO2-Max Bergsteiger-Simulator</h2>
          <p className="sim-sec-desc">
            Dein kardiovaskulärer Aufstieg: Welche VO2-Max Klasse erreichst du durch dein Training?
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            
            {/* Category 1: Basis-Camp */}
            <div 
              style={{
                background: calculatedVO2 < 35.0 ? '#f8fafc' : '#ffffff',
                border: calculatedVO2 < 35.0 ? '2.5px solid #94a3b8' : '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: calculatedVO2 < 35.0 ? '0 8px 20px rgba(148, 163, 184, 0.12)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {calculatedVO2 < 35.0 && (
                <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🧗</span>
              )}
              <div style={{ fontSize: '2rem', margin: '0.2rem 0' }}>⛺</div>
              <div style={{ fontWeight: 800, color: '#475569', fontSize: '1rem' }}>Basis-Camp</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.3rem' }}>VO2-Max &lt; 35</div>
            </div>

            {/* Category 2: Waldgrenze */}
            <div 
              style={{
                background: (calculatedVO2 >= 35.0 && calculatedVO2 < 40.0) ? '#f0fdf4' : '#ffffff',
                border: (calculatedVO2 >= 35.0 && calculatedVO2 < 40.0) ? '2.5px solid #22c55e' : '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: (calculatedVO2 >= 35.0 && calculatedVO2 < 40.0) ? '0 8px 20px rgba(34, 197, 94, 0.12)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {(calculatedVO2 >= 35.0 && calculatedVO2 < 40.0) && (
                <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🧗</span>
              )}
              <div style={{ fontSize: '2rem', margin: '0.2rem 0' }}>🌲</div>
              <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>Waldgrenze</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.3rem' }}>VO2-Max 35–39</div>
            </div>

            {/* Category 3: Felsstufe */}
            <div 
              style={{
                background: (calculatedVO2 >= 40.0 && calculatedVO2 < 45.0) ? '#eff6ff' : '#ffffff',
                border: (calculatedVO2 >= 40.0 && calculatedVO2 < 45.0) ? '2.5px solid #3b82f6' : '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: (calculatedVO2 >= 40.0 && calculatedVO2 < 45.0) ? '0 8px 20px rgba(59, 130, 246, 0.12)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {(calculatedVO2 >= 40.0 && calculatedVO2 < 45.0) && (
                <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🧗</span>
              )}
              <div style={{ fontSize: '2rem', margin: '0.2rem 0' }}>🧗‍♀️</div>
              <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '1rem' }}>Felsstufe</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.3rem' }}>VO2-Max 40–44</div>
            </div>

            {/* Category 4: Gipfel */}
            <div 
              style={{
                background: calculatedVO2 >= 45.0 ? '#faf5ff' : '#ffffff',
                border: calculatedVO2 >= 45.0 ? '2.5px solid #a855f7' : '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative',
                boxShadow: calculatedVO2 >= 45.0 ? '0 8px 20px rgba(168, 85, 247, 0.12)' : 'none',
                transition: 'all 0.3s'
              }}
            >
              {calculatedVO2 >= 45.0 && (
                <span style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem' }}>🧗</span>
              )}
              <div style={{ fontSize: '2rem', margin: '0.2rem 0' }}>🏔️</div>
              <div style={{ fontWeight: 800, color: '#7e22ce', fontSize: '1rem' }}>Gipfel (Elite)</div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.3rem' }}>VO2-Max &gt;= 45</div>
            </div>

          </div>
        </div>

        <hr className="sim-divider" />

        {/* III. DAS CARDIO-MISCHPULT */}
        <div>
          <h2 className="sim-sec-title">III. Das Cardio-Mischpult</h2>
          <p className="sim-sec-desc">
            Bewege die Regler, um die perfekte Balance aus Ausdauer, Intensität und Erholung einzustellen.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Slider 1 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>
                    🚴‍♂️ Zone-2-Ausdauer (Grundlage)
                  </span>
                  <span style={{ fontWeight: 800, color: '#006EA7' }}>{simZone2} Min. / Woche</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="240"
                  step="15"
                  value={simZone2}
                  onChange={(e) => setSimZone2(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: '#006EA7',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                  <span>0m (Träge)</span>
                  <span>120m (Herzschutz)</span>
                  <span>240m (Mito-Pro)</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>
                    ⚡ Zone-5-HIIT (Spitzenleistung)
                  </span>
                  <span style={{ fontWeight: 800, color: '#006EA7' }}>{simHIIT}x / Woche</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={simHIIT}
                  onChange={(e) => setSimHIIT(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: '#006EA7',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                  <span>Kein HIIT</span>
                  <span>1 Session</span>
                  <span>4 Sessions (Limit)</span>
                </div>
              </div>

              {/* Slider 3 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1rem' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>
                    🛌 Regeneration (Schlaf & Ruhetage)
                  </span>
                  <span style={{ fontWeight: 800, color: '#006EA7' }}>{simRegen}% Erholung</span>
                </div>
                <input 
                  type="range"
                  min="30"
                  max="100"
                  step="5"
                  value={simRegen}
                  onChange={(e) => setSimRegen(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: '#006EA7',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                  <span>30% (Schlafmangel)</span>
                  <span>70% (Gut)</span>
                  <span>100% (Maximum)</span>
                </div>
              </div>

            </div>

            {/* Status box */}
            <div 
              style={{
                background: `${cardMixerColor}08`,
                border: `1.5px solid ${cardMixerColor}20`,
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.2rem',
                textAlign: 'center',
                minHeight: '220px',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}
            >
              <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i 
                  className={`bi ${cardMixerIcon}`}
                  style={{
                    fontSize: '3.5rem',
                    color: cardMixerColor,
                    display: 'inline-block',
                    animation: `heartbeat-sim ${pulseSpeed} infinite ease-in-out`
                  }}
                />
              </div>
              <div>
                <span 
                  style={{
                    background: `${cardMixerColor}18`,
                    color: cardMixerColor,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Mischpult-Status
                </span>
                <p style={{ fontSize: '1rem', color: '#334155', fontWeight: 600, margin: '0.8rem 0 0 0', lineHeight: '1.5' }}>
                  {cardMixerStatus}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
