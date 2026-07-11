'use client';

import React, { useState, useEffect } from 'react';

interface CardioSimulationPageProps {
  onBack: () => void;
}

export default function CardioSimulationPage({ onBack }: CardioSimulationPageProps) {
  // Inputs (Mischpult ganz unten)
  const [simZone2, setSimZone2] = useState(90);
  const [simHIIT, setSimHIIT] = useState(1);
  const [simRegen, setSimRegen] = useState(70);

  // Simulation States (Rennen ganz oben)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simWeek, setSimWeek] = useState(0);
  const [simHistory, setSimHistory] = useState<number[]>([35.0]);
  const [currentVO2, setCurrentVO2] = useState(35.0);
  const [simMessage, setSimMessage] = useState('Stelle dein Mischpult unten ein und starte das 12-Wochen-Rennen!');
  const [simStatusColor, setSimStatusColor] = useState('#64748b'); // Slate
  const [lisaReport, setLisaReport] = useState<string | null>(null);

  const baseVO2 = 35.0;

  // Run week-by-week simulation cleanly using useEffect
  useEffect(() => {
    if (!isSimulating) return;

    if (simWeek >= 12) {
      setIsSimulating(false);
      generateLisaReport(currentVO2);
      return;
    }

    const timer = setTimeout(() => {
      const nextWeek = simWeek + 1;
      setSimWeek(nextWeek);

      setCurrentVO2((prevVO2) => {
        let weeklyChange = 0;
        const regenFactor = (simRegen - 30) / 70; // 0 to 1

        const isExtremeHIITNoRegen = simHIIT >= 3 && simRegen < 60;
        const isModerateHIITNoRegen = simHIIT >= 2 && simRegen < 50;
        const isCriticalSleepDeprived = simRegen < 40;
        const isNoBaseOnlyHIIT = simZone2 < 45 && simHIIT >= 2;

        if (isCriticalSleepDeprived) {
          weeklyChange = -0.3;
          setSimMessage(`Woche ${nextWeek}: Systemischer Schlafmangel! Deine Zellen können sich nicht regenerieren.`);
          setSimStatusColor('#ef4444');
        } else if (isExtremeHIITNoRegen && nextWeek > 4) {
          weeklyChange = -0.5;
          setSimMessage(`Woche ${nextWeek}: Übertraining! Chronische Entzündung und Muskelkater bremsen dich aus.`);
          setSimStatusColor('#ef4444');
        } else if (isModerateHIITNoRegen && nextWeek > 3) {
          weeklyChange = -0.3;
          setSimMessage(`Woche ${nextWeek}: Erschöpfung! Dein Körper fordert dringend Ruhetage.`);
          setSimStatusColor('#f97316');
        } else if (isNoBaseOnlyHIIT && nextWeek > 5) {
          weeklyChange = -0.15;
          setSimMessage(`Woche ${nextWeek}: Mitochondrien-Kollaps! Dir fehlt die aerobe Basis.`);
          setSimStatusColor('#f97316');
        } else {
          const z2Adaptation = (simZone2 / 240) * 0.4;
          let hiitAdaptation = (simHIIT / 4) * 0.5;
          
          if (simZone2 < 90 && nextWeek > 4) {
            hiitAdaptation *= 0.5;
          }

          weeklyChange = (z2Adaptation + hiitAdaptation) * (0.3 + 0.7 * regenFactor);
          
          if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
            setSimMessage(`Woche ${nextWeek}: Perfect Flow! Optimale Balance aus aerober Basis und Intervallen.`);
            setSimStatusColor('#22c55e');
          } else if (simHIIT > 0 && simRegen >= 70) {
            setSimMessage(`Woche ${nextWeek}: Guter Reiz! Dein Herzschlagvolumen passt sich an.`);
            setSimStatusColor('#4C99C2');
          } else if (simZone2 > 0 && simHIIT === 0) {
            setSimMessage(`Woche ${nextWeek}: Grundlagen-Aufbau. Du vermehrst deine Mitochondrien.`);
            setSimStatusColor('#eab308');
          } else {
            setSimMessage(`Woche ${nextWeek}: Kaum Trainingsreize gesetzt. Dein VO2-Max stagniert.`);
            setSimStatusColor('#64748b');
          }
        }

        const nextVO2 = Math.min(48.5, Math.max(30.0, prevVO2 + weeklyChange));
        setSimHistory((prevHistory) => [...prevHistory, nextVO2]);
        return nextVO2;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [isSimulating, simWeek, simZone2, simHIIT, simRegen]);

  const startSimulation = () => {
    if (isSimulating) return;

    setSimWeek(0);
    setSimHistory([baseVO2]);
    setCurrentVO2(baseVO2);
    setSimMessage('Woche 0: Starte Trainingszyklus...');
    setSimStatusColor('#006EA7');
    setLisaReport(null);
    setIsSimulating(true);
  };

  // Generate the final analysis report from Lisa AI
  const generateLisaReport = (finalVO2: number) => {
    const isExtremeHIITNoRegen = simHIIT >= 3 && simRegen < 60;
    const isNoBaseOnlyHIIT = simZone2 < 45 && simHIIT >= 2;
    const isCriticalSleepDeprived = simRegen < 40;

    if (isCriticalSleepDeprived) {
      setLisaReport(
        "❌ **Rennen abgebrochen: Systemischer Kollaps.**\nDu hast versucht zu trainieren, aber dein Schlaf- und Regenerationsniveau liegt im kritischen Bereich. Ohne Erholung führen Trainingsreize zu Muskelabbau und zellulärem Stress. Erhöhe deine Regeneration auf mindestens 70 %, um Fortschritte zu erzielen."
      );
      setSimMessage("Rennen beendet: Systemischer Schlafmangel!");
      setSimStatusColor('#ef4444');
    } else if (isExtremeHIITNoRegen) {
      setLisaReport(
        "⚠️ **Übertrainings-Crash in Woche 5.**\nDein Plan war zu intensiv für deine Erholungsfähigkeit. HIIT-Intervalle ohne ausreichenden Schlaf führen zu chronisch erhöhten Entzündungswerten (Cortisol) und überlasten dein zentrales Nervensystem. Dein VO2-Max ist nach anfänglichen Gewinnen wieder eingebrochen. *Empfehlung:* Reduziere HIIT auf 1x pro Woche und erhöhe den Schlaf."
      );
      setSimMessage("Rennen beendet: Übertraining!");
      setSimStatusColor('#ef4444');
    } else if (isNoBaseOnlyHIIT) {
      setLisaReport(
        "📉 **Mitochondrien-Kollaps ab Woche 6.**\nDu hast zwar intensive Intervalle gesetzt, aber dir fehlt die aerobe Basis (Zone 2). Ohne Mitochondrien können deine Muskelzellen den bereitgestellten Sauerstoff nicht verwerten. Dein Training verpufft und führt zu schneller Ermüdung. *Empfehlung:* Mindestens 90–120 Minuten lockeres Zone-2-Training pro Woche einbauen."
      );
      setSimMessage("Rennen beendet: Fehlende Ausdauerbasis!");
      setSimStatusColor('#f97316');
    } else if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
      setLisaReport(
        "🏆 **Perfect Flow erreicht! Herausragendes Ergebnis.**\nDu hast das wissenschaftlich erprobte Polarized-Training perfekt umgesetzt. 80 % ruhige Ausdauer (Zone 2) gepaart mit 20 % Spitzenintensität (Zone 5) und exzellenter Regeneration. Deine Mitochondrien arbeiten hocheffizient und dein Schlagvolumen hat sich maximiert. Dein Herzalter hat sich signifikant verjüngt!"
      );
      setSimMessage("Rennen erfolgreich beendet: Perfect Flow!");
      setSimStatusColor('#22c55e');
    } else if (simZone2 > 0 && simHIIT === 0) {
      setLisaReport(
        "ℹ️ **Solide Basis, aber kein Spitzen-Reiz.**\nDu hast ein hervorragendes aerobes Fundament gebaut. Deine Mitochondriendichte ist gestiegen, was deine zelluläre Gesundheit schützt. Allerdings fehlt dir der HIIT-Intensitätsreiz, um dein Herzschlagvolumen maximal auszuweiten. *Empfehlung:* Integriere 1x pro Woche ein 4x4-Minuten-Intervalltraining."
      );
      setSimMessage("Rennen beendet: Grundlagen aufgebaut.");
      setSimStatusColor('#eab308');
    } else if (simZone2 === 0 && simHIIT === 0) {
      setLisaReport(
        "💤 **Keine Anpassungen.**\nOhne Trainingsreize baut der Körper ungenutzte Kapazitäten ab. Dein VO2-Max ist über die 12 Wochen leicht gesunken. Langlebigkeit ist ein aktiver Prozess – fange klein an, z. B. mit 45 Minuten zügigem Gehen in Zone 2."
      );
      setSimMessage("Rennen beendet: Keine Trainingsreize.");
      setSimStatusColor('#64748b');
    } else {
      setLisaReport(
        "📈 **Guter Fortschritt.**\nDu hast spürbare Fortschritte erzielt. Dein Herzkreislauf-System ist fitter und dein Langlebigkeits-Score hat sich verbessert. Um das Maximum herauszuholen (Perfect Flow), versuche das Verhältnis von Ausdauer zu HIIT noch feiner abzustimmen."
      );
      setSimMessage("Rennen erfolgreich beendet.");
      setSimStatusColor('#22c55e');
    }
  };

  // Live outcomes
  const bioAgeDiff = (currentVO2 - baseVO2) * 0.45;
  const healthspanBonus = (currentVO2 - baseVO2) * 0.35;

  // Mountain climb elevations
  const isBaseCamp = currentVO2 < 35.0;
  const isWaldgrenze = currentVO2 >= 35.0 && currentVO2 < 40.0;
  const isFelsstufe = currentVO2 >= 40.0 && currentVO2 < 45.0;
  const isGipfel = currentVO2 >= 45.0;

  return (
    <div className="sim-container">
      <style dangerouslySetInnerHTML={{__html: `
        .sim-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .sim-header {
          margin-bottom: 3rem;
        }
        .sim-header-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .sim-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 0;
        }
        .sim-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          line-height: 1.55;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sim-back-btn {
          background: transparent;
          border: 1.5px solid #4498ca;
          border-radius: 12px;
          color: #4498ca;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.15rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(68, 152, 202, 0.02);
        }
        .sim-back-btn:hover {
          background: #ffffff;
          border-color: #006ea7;
          color: #006ea7;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(68, 152, 202, 0.12);
        }
        .sim-back-btn:active {
          transform: translateY(0);
        }
        .sim-section-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 30px;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.03);
          margin-bottom: 2rem;
        }
        .sim-sec-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0 0 0.5rem 0;
        }
        .sim-sec-desc {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0 0 2rem 0;
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
        <div className="sim-header-title-row">
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="sim-sec-title" style={{ margin: 0 }}>I. Das Langlebigkeits-Rennen (Wochen 1–12)</h2>
              <p className="sim-sec-desc" style={{ margin: '0.2rem 0 0 0' }}>
                Starte die 12-Wochen-Simulation und sieh zu, wie weit dein Avatar auf der Laufbahn sprintet.
              </p>
            </div>
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              style={{
                background: isSimulating ? '#cbd5e1' : 'linear-gradient(135deg, #006ea7, #4c99c2)',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: isSimulating ? 'default' : 'pointer',
                boxShadow: isSimulating ? 'none' : '0 4px 15px rgba(0, 110, 167, 0.25)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="bi bi-play-circle-fill" style={{ fontSize: '1.2rem' }}></i>
              {isSimulating ? `Woche ${simWeek} läuft...` : '12-Wochen-Rennen simulieren'}
            </button>
          </div>

          {/* Simulation status banner */}
          <div 
            style={{
              background: `${simStatusColor}08`,
              border: `1.5px dashed ${simStatusColor}40`,
              borderRadius: '16px',
              padding: '1rem 1.5rem',
              color: simStatusColor,
              fontWeight: 700,
              fontSize: '1rem',
              marginBottom: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s'
            }}
          >
            <i className="bi bi-info-circle-fill" />
            <span>{simMessage}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            <div style={{ paddingRight: '2rem' }}>
              
              {/* Dynamic weekly progression track */}
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

                {/* Avatar A: Aktuelles Ich (static baseline) */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '10%',
                    top: '-32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
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

                {/* Avatar B: Zukünftiges Ich (moves weekly during sim) */}
                <div 
                  style={{
                    position: 'absolute',
                    left: `${10 + ((currentVO2 - 30) / 20) * 75}%`,
                    top: '-32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <span style={{ fontSize: '1.8rem', lineHeight: 1, filter: 'drop-shadow(0 2px 5px rgba(34, 197, 94, 0.4))' }}>
                    {isSimulating ? '🏃‍♂️⚡' : currentVO2 > baseVO2 ? '🏃‍♂️🏆' : '🏃‍♂️'}
                  </span>
                  <span 
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: currentVO2 > baseVO2 ? '#22c55e' : currentVO2 < baseVO2 ? '#ef4444' : '#64748b',
                      background: currentVO2 > baseVO2 ? '#f0fdf4' : currentVO2 < baseVO2 ? '#fef2f2' : '#f1f5f9',
                      border: `1px solid ${currentVO2 > baseVO2 ? '#bbf7d0' : currentVO2 < baseVO2 ? '#fecaca' : '#cbd5e1'}`,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    Woche {simWeek} ({currentVO2.toFixed(1)})
                  </span>
                </div>
              </div>

              {/* Mini visual curve of VO2-Max progress */}
              <div style={{ display: 'flex', gap: '4px', height: '60px', alignItems: 'flex-end', marginTop: '1.5rem', background: '#fafcff', border: '1px solid #e2eef8', borderRadius: '12px', padding: '10px 15px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', width: '50px', alignSelf: 'center', fontWeight: 700 }}>Verlauf:</div>
                <div style={{ display: 'flex', gap: '6px', flex: 1, height: '100%', alignItems: 'flex-end' }}>
                  {simHistory.map((val, idx) => {
                    const pct = ((val - 30) / 20) * 100;
                    return (
                      <div 
                        key={idx}
                        style={{
                          flex: 1,
                          height: `${Math.max(10, pct)}%`,
                          background: val > baseVO2 ? '#4C99C2' : val < baseVO2 ? '#ef4444' : '#94a3b8',
                          borderRadius: '3px',
                          transition: 'all 0.3s'
                        }}
                        title={`Woche ${idx}: ${val.toFixed(1)}`}
                      />
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Outcomes Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div 
                  style={{
                    background: currentVO2 >= baseVO2 ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${currentVO2 >= baseVO2 ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: '20px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                  }}
                >
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: currentVO2 >= baseVO2 ? '#16a34a' : '#dc2626' }}>
                    {currentVO2 >= baseVO2 ? '-' : '+'}{Math.abs(bioAgeDiff).toFixed(1)} J.
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentVO2 >= baseVO2 ? '#15803d' : '#991b1b', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                    Herzalter
                  </div>
                </div>

                <div 
                  style={{
                    background: currentVO2 >= baseVO2 ? '#eff6ff' : '#f1f5f9',
                    border: `1px solid ${currentVO2 >= baseVO2 ? '#bfdbfe' : '#e2e8f0'}`,
                    borderRadius: '20px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                  }}
                >
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: currentVO2 >= baseVO2 ? '#2563eb' : '#64748b' }}>
                    {currentVO2 >= baseVO2 ? '+' : ''}{healthspanBonus.toFixed(1)} J.
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentVO2 >= baseVO2 ? '#1d4ed8' : '#475569', textTransform: 'uppercase', marginTop: '0.3rem' }}>
                    Healthspan
                  </div>
                </div>
              </div>

              {/* Lisa AI Report placeholder */}
              {lisaReport && (
                <div 
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    fontSize: '0.9rem',
                    color: '#334155',
                    lineHeight: '1.5',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', fontWeight: 800, color: '#0f172a' }}>
                    <span>🤖 Lisa AI Analyse-Report</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{lisaReport}</div>
                </div>
              )}
            </div>

          </div>
        </div>

        <hr className="sim-divider" />

        {/* II. DER VO2-MAX BERGSTEIGER-SIMULATOR */}
        <div>
          <h2 className="sim-sec-title">II. Der VO2-Max Bergsteiger-Simulator</h2>
          <p className="sim-sec-desc">
            Dein kardiovaskulärer Aufstieg auf den Mount Longevitus. Je höher du steigst, desto besser für deine Zellen.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center' }}>
            
            {/* Left Column: Stage details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#fafcff', border: '1.5px solid #e2eef8', borderRadius: '20px', padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e3a5f', fontSize: '1.1rem', fontWeight: 700 }}>
                  Aktuelle Kletter-Etappe
                </h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>
                  {isBaseCamp && "Du befindest dich im Basis-Camp. Deine aerobe Kapazität hat noch viel Entwicklungspotenzial. Baue zuerst deine Zone-2-Mitochondrienbasis auf."}
                  {isWaldgrenze && "Du hast die Waldgrenze erreicht! Deine Mitochondriendichte wächst, dein Herz pumpt bereits ökonomischer. Perfekter Startpunkt."}
                  {isFelsstufe && "Starke Leistung auf der Felsstufe! Du liegst deutlich über dem Durchschnitt. Dein Herzkreislauf-System schützt deine Zellen aktiv."}
                  {isGipfel && "Peak Health! Du hast den Gipfel des Mount Longevitus bezwungen. Diese aerobe Fitnessklasse schenkt dir maximale vitale Jahre."}
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.2rem' }}>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.6rem 1rem', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>VO2-Max prognose</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{currentVO2.toFixed(1)}</div>
                  </div>
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '0.6rem 1rem', flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Etappen-Status</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isGipfel ? '#a855f7' : isFelsstufe ? '#3b82f6' : isWaldgrenze ? '#22c55e' : '#94a3b8', marginTop: '0.3rem' }}>
                      {isGipfel ? "Peak Elite" : isFelsstufe ? "Athlet" : isWaldgrenze ? "Fortgeschritten" : "Einsteiger"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Vertical Mountain (Mount Longevitus) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div 
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '24px',
                  padding: '2rem 1.5rem',
                  width: '100%',
                  maxWidth: '350px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.1rem',
                  position: 'relative'
                }}
              >
                {/* Mountain Name Title inside */}
                <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kletterpfad</span>
                  <h4 style={{ margin: '0.1rem 0 0 0', color: '#1e3a5f', fontSize: '1.15rem', fontWeight: 800 }}>Mount Longevitus</h4>
                </div>

                {/* Vertical Trail Path Line */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '90px',
                    bottom: '70px',
                    left: '52px',
                    width: '3px',
                    background: 'dashed',
                    borderLeft: '2px dashed #cbd5e1',
                    zIndex: 1
                  }}
                />

                {/* Level 4: Gipfel */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 2,
                    opacity: isGipfel ? 1 : 0.45,
                    transform: isGipfel ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isGipfel ? '#faf5ff' : '#ffffff',
                      border: isGipfel ? '2px solid #a855f7' : '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      boxShadow: isGipfel ? '0 0 10px rgba(168,85,247,0.2)' : 'none'
                    }}
                  >
                    🏔️
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#7e22ce', fontSize: '0.9rem' }}>Gipfel (Elite)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>VO2-Max &gt;= 45</div>
                  </div>
                  {isGipfel && (
                    <span style={{ marginLeft: 'auto', fontSize: '1.5rem', animation: 'heartbeat-sim 2s infinite ease-in-out' }}>🧗</span>
                  )}
                </div>

                {/* Level 3: Felsstufe */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 2,
                    opacity: isFelsstufe ? 1 : 0.45,
                    transform: isFelsstufe ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isFelsstufe ? '#eff6ff' : '#ffffff',
                      border: isFelsstufe ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      boxShadow: isFelsstufe ? '0 0 10px rgba(59,130,246,0.2)' : 'none'
                    }}
                  >
                    🧗‍♀️
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1d4ed8', fontSize: '0.9rem' }}>Felsstufe (Athlet)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>VO2-Max 40–44</div>
                  </div>
                  {isFelsstufe && (
                    <span style={{ marginLeft: 'auto', fontSize: '1.5rem', animation: 'heartbeat-sim 2s infinite ease-in-out' }}>🧗</span>
                  )}
                </div>

                {/* Level 2: Waldgrenze */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 2,
                    opacity: isWaldgrenze ? 1 : 0.45,
                    transform: isWaldgrenze ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isWaldgrenze ? '#f0fdf4' : '#ffffff',
                      border: isWaldgrenze ? '2px solid #22c55e' : '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      boxShadow: isWaldgrenze ? '0 0 10px rgba(34,197,94,0.2)' : 'none'
                    }}
                  >
                    🌲
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.9rem' }}>Waldgrenze (Fortgeschritten)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>VO2-Max 35–39</div>
                  </div>
                  {isWaldgrenze && (
                    <span style={{ marginLeft: 'auto', fontSize: '1.5rem', animation: 'heartbeat-sim 2s infinite ease-in-out' }}>🧗</span>
                  )}
                </div>

                {/* Level 1: Basis-Camp */}
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    position: 'relative',
                    zIndex: 2,
                    opacity: isBaseCamp ? 1 : 0.45,
                    transform: isBaseCamp ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 0.3s'
                  }}
                >
                  <div 
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isBaseCamp ? '#f8fafc' : '#ffffff',
                      border: isBaseCamp ? '2px solid #94a3b8' : '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      boxShadow: isBaseCamp ? '0 0 10px rgba(148,163,184,0.2)' : 'none'
                    }}
                  >
                    ⛺
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#475569', fontSize: '0.9rem' }}>Basis-Camp (Einsteiger)</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>VO2-Max &lt; 35</div>
                  </div>
                  {isBaseCamp && (
                    <span style={{ marginLeft: 'auto', fontSize: '1.5rem', animation: 'heartbeat-sim 2s infinite ease-in-out' }}>🧗</span>
                  )}
                </div>

              </div>
            </div>

          </div>
        </div>

        <hr className="sim-divider" />

        {/* III. DAS CARDIO-MISCHPULT */}
        <div>
          <h2 className="sim-sec-title">III. Das Cardio-Mischpult</h2>
          <p className="sim-sec-desc">
            Bewege die Regler, um dein wöchentliches Training zu konfigurieren, bevor du das Rennen oben startest.
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
                  disabled={isSimulating}
                  onChange={(e) => setSimZone2(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: '#006EA7',
                    cursor: isSimulating ? 'default' : 'pointer',
                    opacity: isSimulating ? 0.6 : 1
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
                  disabled={isSimulating}
                  onChange={(e) => setSimHIIT(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: '#006EA7',
                    cursor: isSimulating ? 'default' : 'pointer',
                    opacity: isSimulating ? 0.6 : 1
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
                  disabled={isSimulating}
                  onChange={(e) => setSimRegen(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    outline: 'none',
                    accentColor: '#006EA7',
                    cursor: isSimulating ? 'default' : 'pointer',
                    opacity: isSimulating ? 0.6 : 1
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
