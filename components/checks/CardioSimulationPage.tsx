'use client';

import React, { useState, useEffect } from 'react';

interface CardioSimulationPageProps {
  onBack: () => void;
}

interface WeekData {
  vo2: number;
  msg: string;
  color: string;
}

export default function CardioSimulationPage({ onBack }: CardioSimulationPageProps) {
  // Inputs (Mischpult ganz unten)
  const [simZone2, setSimZone2] = useState(90);
  const [simHIIT, setSimHIIT] = useState(1);
  const [simRegen, setSimRegen] = useState(70);

  // Manual & Playback state
  const [simWeek, setSimWeek] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lisaReport, setLisaReport] = useState<string | null>(null);
  const [activeFactors, setActiveFactors] = useState<string[]>([]);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [userWeight, setUserWeight] = useState<number>(80);
  const [targetWeight, setTargetWeight] = useState<number>(76);
  const [selectedInfoFactor, setSelectedInfoFactor] = useState<string>('zone2');
  const [currentZone2, setCurrentZone2] = useState<number>(45);
  const [targetZone2, setTargetZone2] = useState<number>(150);
  const [currentHIIT, setCurrentHIIT] = useState<number>(0);
  const [targetHIIT, setTargetHIIT] = useState<number>(2);
  const [currentSleep, setCurrentSleep] = useState<number>(6.0);
  const [targetSleep, setTargetSleep] = useState<number>(8.0);

  const toggleFactor = (factor: string) => {
    setActiveFactors(prev => 
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const baseVO2 = 35.0;

  // 1. Generate the complete 12-week trajectory reactively based on current Mischpult configurations
  const getTrajectory = (): WeekData[] => {
    const data: WeekData[] = [{ vo2: baseVO2, msg: 'Woche 0: Starte Trainingszyklus...', color: '#64748b' }];
    let current = baseVO2;

    for (let w = 1; w <= 12; w++) {
      if (activeFactors.length === 0) {
        data.push({ 
          vo2: baseVO2, 
          msg: `Woche ${w}: Keine Hebel aktiviert. Schalte einen VO2max-Hebel ein, um deine Entwicklung zu starten.`, 
          color: '#64748b' 
        });
        continue;
      }

      let weeklyChange = 0;
      const regenFactor = (simRegen - 30) / 70; // 0 to 1

      const isExtremeHIITNoRegen = simHIIT >= 3 && simRegen < 60;
      const isModerateHIITNoRegen = simHIIT >= 2 && simRegen < 50;
      const isCriticalSleepDeprived = simRegen < 40;
      const isNoBaseOnlyHIIT = simZone2 < 45 && simHIIT >= 2;

      let msg = '';
      let color = '';

      if (isCriticalSleepDeprived) {
        weeklyChange = -0.3;
        msg = `Woche ${w}: Systemischer Schlafmangel! Deine Zellen können sich nicht regenerieren.`;
        color = '#ef4444';
      } else if (isExtremeHIITNoRegen && w > 4) {
        weeklyChange = -0.5;
        msg = `Woche ${w}: Übertraining! Chronische Entzündung und Muskelkater bremsen dich aus.`;
        color = '#ef4444';
      } else if (isModerateHIITNoRegen && w > 3) {
        weeklyChange = -0.3;
        msg = `Woche ${w}: Erschöpfung! Dein Körper fordert dringend Ruhetage.`;
        color = '#f97316';
      } else if (isNoBaseOnlyHIIT && w > 5) {
        weeklyChange = -0.15;
        msg = `Woche ${w}: Mitochondrien-Kollaps! Dir fehlt die aerobe Basis.`;
        color = '#f97316';
      } else {
        const z2Adaptation = (simZone2 / 240) * 0.3;
        let hiitAdaptation = (simHIIT / 4) * 0.4;
        
        if (simZone2 < 90 && w > 4) {
          hiitAdaptation *= 0.5;
        }

        weeklyChange = (z2Adaptation + hiitAdaptation) * (0.3 + 0.7 * regenFactor);
        
        if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
          msg = `Woche ${w}: Perfect Flow! Optimale Balance aus aerober Basis und Intervallen.`;
          color = '#22c55e';
        } else if (simHIIT > 0 && simRegen >= 70) {
          msg = `Woche ${w}: Guter Reiz! Dein Herzschlagvolumen passt sich an.`;
          color = '#4C99C2';
        } else if (simZone2 > 0 && simHIIT === 0) {
          msg = `Woche ${w}: Grundlagen-Aufbau. Du vermehrst deine Mitochondrien.`;
          color = '#eab308';
        } else {
          msg = `Woche ${w}: Kaum Trainingsreize gesetzt. Dein VO2-Max stagniert.`;
          color = '#64748b';
        }
      }

      // Hebel-Effekt: Realistische Zuwächse je nach Hebel (HIIT: +2,0 | Zone 2: +1,5 | Gewicht: +1,2 | Erholung: +0,8)
      let factorBonus = 0;
      if (activeFactors.includes('zone2')) factorBonus += 1.5 / 12;
      if (activeFactors.includes('hiit')) factorBonus += 2.0 / 12;
      if (activeFactors.includes('regen')) factorBonus += 0.8 / 12;
      if (activeFactors.includes('weight')) factorBonus += 1.2 / 12;

      weeklyChange += factorBonus;

      current = Math.min(48.5, Math.max(30.0, current + weeklyChange));
      data.push({ vo2: current, msg, color });
    }

    return data;
  };

  const trajectory = getTrajectory();

  // Active state derived from trajectory and current week index
  const currentWeekData = trajectory[simWeek] || trajectory[0];
  const currentVO2 = currentWeekData.vo2;
  const simMessage = currentWeekData.msg;
  const simStatusColor = currentWeekData.color;

  // 2. Playback simulation loop (much slower: 1800ms)
  useEffect(() => {
    if (!isSimulating) return;

    if (simWeek >= 12) {
      setIsSimulating(false);
      generateLisaReport(trajectory[12].vo2);
      return;
    }

    const timer = setTimeout(() => {
      setSimWeek((prev) => prev + 1);
    }, 1800); // 1.8 seconds per week (much slower, highly readable)

    return () => clearTimeout(timer);
  }, [isSimulating, simWeek]);

  // Start automation
  const startSimulation = () => {
    setLisaReport(null);
    setSimWeek(0);
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
    } else if (isExtremeHIITNoRegen) {
      setLisaReport(
        "⚠️ **Übertrainings-Crash in Woche 5.**\nDein Plan war zu intensiv für deine Erholungsfähigkeit. HIIT-Intervalle ohne ausreichenden Schlaf führen zu chronisch erhöhten Entzündungswerten (Cortisol) und überlasten dein zentrales Nervensystem. Dein VO2-Max ist nach anfänglichen Gewinnen wieder eingebrochen. *Empfehlung:* Reduziere HIIT auf 1x pro Woche und erhöhe den Schlaf."
      );
    } else if (isNoBaseOnlyHIIT) {
      setLisaReport(
        "📉 **Mitochondrien-Kollaps ab Woche 6.**\nDu hast zwar intensive Intervalle gesetzt, aber dir fehlt die aerobe Basis (Zone 2). Ohne Mitochondrien können deine Muskelzellen den bereitgestellten Sauerstoff nicht verwerten. Dein Training verpufft und führt zu schneller Ermüdung. *Empfehlung:* Mindestens 90–120 Minuten lockeres Zone-2-Training pro Woche einbauen."
      );
    } else if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
      setLisaReport(
        "🏆 **Perfect Flow erreicht! Herausragendes Ergebnis.**\nDu hast das wissenschaftlich erprobte Polarized-Training perfekt umgesetzt. 80 % ruhige Ausdauer (Zone 2) gepaart mit 20 % Spitzenintensität (Zone 5) und exzellenter Regeneration. Deine Mitochondrien arbeiten hocheffizient und dein Schlagvolumen hat sich maximiert. Dein Herzalter hat sich signifikant verjüngt!"
      );
    } else if (simZone2 > 0 && simHIIT === 0) {
      setLisaReport(
        "ℹ️ **Solide Basis, aber kein Spitzen-Reiz.**\nDu hast ein hervorragendes aerobes Fundament gebaut. Deine Mitochondriendichte ist gestiegen, was deine zelluläre Gesundheit schützt. Allerdings fehlt dir der HIIT-Intensitätsreiz, um dein Herzschlagvolumen maximal auszuweiten. *Empfehlung:* Integriere 1x pro Woche ein 4x4-Minuten-Intervalltraining."
      );
    } else if (simZone2 === 0 && simHIIT === 0) {
      setLisaReport(
        "💤 **Keine Anpassungen.**\nOhne Trainingsreize baut der Körper ungenutzte Kapazitäten ab. Dein VO2-Max ist über die 12 Wochen leicht gesunken. Langlebigkeit ist ein aktiver Prozess – fange klein an, z. B. mit 45 Minuten zügigem Gehen in Zone 2."
      );
    } else {
      setLisaReport(
        "📈 **Guter Fortschritt.**\nDu hast spürbare Fortschritte erzielt. Dein Herzkreislauf-System ist fitter und dein Langlebigkeits-Score hat sich verbessert. Um das Maximum herauszuholen (Perfect Flow), versuche das Verhältnis von Ausdauer zu HIIT noch feiner abzustimmen."
      );
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

  // Mischpult-Status ableiten für UI
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

        /* Styling the timeline timeline-slider */
        .timeline-slider-input {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          border-radius: 10px;
          background: #e2e8f0;
          outline: none;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: background 0.15s ease-in-out;
        }
        .timeline-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #006ea7;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0, 110, 167, 0.4);
          cursor: pointer;
          transition: transform 0.1s;
          margin-top: -14px; /* Align thumb center with track center */
        }
        .timeline-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .tacho-btn-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .tacho-circle-btn {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          font-size: 2.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }
        .tacho-circle-btn:hover {
          background: #f8fafc;
          border-color: #006ea7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 110, 167, 0.08);
        }
        .tacho-circle-btn.active {
          background: #006ea7 !important;
          border-color: #006ea7 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(0, 110, 167, 0.25);
          transform: translateY(-2px);
        }
        .tacho-circle-btn.active span {
          filter: brightness(0) invert(1);
        }
        .tacho-info-icon-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: help;
          padding: 4px;
        }
        .tacho-info-icon {
          color: #94a3b8;
          font-size: 0.82rem;
          transition: color 0.2s ease;
        }
        .tacho-info-icon-wrapper:hover .tacho-info-icon {
          color: #006ea7;
        }
        .tacho-tooltip {
          visibility: hidden;
          width: 210px;
          background-color: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(4px);
          color: #fff;
          text-align: left;
          border-radius: 10px;
          padding: 10px 12px;
          position: absolute;
          z-index: 99;
          top: 135%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-size: 0.75rem;
          line-height: 1.35;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          pointer-events: none;
          white-space: normal;
          font-weight: normal;
        }
        .tacho-tooltip::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent rgba(15, 23, 42, 0.95) transparent;
        }
        .tacho-info-icon-wrapper:hover .tacho-tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(-50%) translateY(2px);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '2rem' }}>
            <div>
              <h2 className="sim-sec-title" style={{ margin: 0 }}>I. Das Langlebigkeits-Rennen</h2>
              <p className="sim-sec-desc" style={{ margin: '0.2rem 0 0 0', fontSize: '1.15rem' }}>
                Drücke auf Start oder schiebe den Wochenregler, um die Leistungsentwicklung zu steuern.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              {isSimulating && (
                <button
                  onClick={() => setIsSimulating(false)}
                  style={{
                    background: '#cbd5e1',
                    color: '#334155',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  Pause
                </button>
              )}
              <button
                onClick={startSimulation}
                style={{
                  background: 'linear-gradient(135deg, #006ea7, #4c99c2)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 110, 167, 0.25)'
                }}
              >
                {isSimulating ? `Woche ${simWeek}...` : 'Simulation starten'}
              </button>
            </div>
          </div>



          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
            <div style={{ paddingRight: '2rem', paddingTop: '5.5rem' }}>
              
              {/* Dynamic weekly progression track */}
              <div 
                style={{
                  background: '#f1f5f9',
                  height: '24px',
                  borderRadius: '12px',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  margin: '0.25rem 0 1.5rem'
                }}
              >
                {/* Grid Marks */}
                {/* Grid Marks */}
                {[0, 25, 50, 75, 100].map((mark) => (
                  <span 
                    key={mark}
                    style={{
                      position: 'absolute',
                      left: `${mark * 0.9}%`,
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
                    left: '0%',
                    top: '-65px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '4.8rem', lineHeight: 1, display: 'inline-block', transform: 'scaleX(-1)' }}>🏃‍♂️</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '8px', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    Basis 35
                  </span>
                </div>

                {/* Finish Line Trophy (Target at the far right end) */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '90%',
                    top: '-65px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '4.8rem', lineHeight: 1 }}>🏆</span>
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#a855f7',
                      background: '#faf5ff',
                      border: '1px solid #e2e8f0',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    Ziel (48,5)
                  </span>
                </div>

                {/* Avatar B: Zukünftiges Ich (moves weekly during sim) */}
                <div 
                  style={{
                    position: 'absolute',
                    left: `${(simWeek / 12) * 90}%`,
                    top: '-65px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <span style={{ fontSize: '4.8rem', lineHeight: 1, display: 'inline-block', transform: 'scaleX(-1)', filter: 'drop-shadow(0 2px 5px rgba(34, 197, 94, 0.4))' }}>
                    🏃‍♂️
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
                    Woche {simWeek} ({currentVO2.toFixed(1).replace('.', ',')})
                  </span>
                </div>
              </div>

              {/* Wochen timeline & slider (DRAGGABLE SLIDER) */}
              <div style={{ marginTop: '1.5rem', background: '#fafcff', border: '1px solid #e2eef8', borderRadius: '20px', padding: '1.5rem 0px 1.5rem 1.5rem', width: '102%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e3a5f' }}>Wochen-Zeitleiste</span>
                  <span style={{ background: '#006ea7', color: '#ffffff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800 }}>Woche {simWeek} / 12</span>
                </div>
                
                {/* Drag range slider */}
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={simWeek}
                  onChange={(e) => {
                    setSimWeek(parseInt(e.target.value));
                    setIsSimulating(false);
                    setLisaReport(null);
                  }}
                  className="timeline-slider-input"
                />

                {/* Week Labels under slider */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', padding: '0 0px 0 4px' }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((wk) => {
                    const isActive = wk === simWeek;
                    return (
                      <button
                        key={wk}
                        onClick={() => {
                          setSimWeek(wk);
                          setIsSimulating(false);
                          setLisaReport(null);
                        }}
                        style={{
                          background: isActive ? '#006ea7' : 'transparent',
                          color: isActive ? '#ffffff' : '#64748b',
                          border: 'none',
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: isActive ? '0 2px 6px rgba(0, 110, 167, 0.3)' : 'none',
                          transition: 'all 0.2s'
                        }}
                      >
                        {wk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VO2max Reference Values Table */}
              <div 
                style={{ 
                  marginTop: '1.25rem', 
                  background: '#ffffff', 
                  border: '1.5px solid #e2e8f0', 
                  borderRadius: '20px', 
                  padding: '1.25rem', 
                  width: '102%',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a5f', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📊 <span>VO2max Altersreferenzwerte (Normalbereiche)</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #cbd5e1', color: '#64748b', fontWeight: 700 }}>
                        <th style={{ padding: '6px 4px' }}>Alter</th>
                        <th style={{ padding: '6px 4px' }}>Frauen (Schnitt)</th>
                        <th style={{ padding: '6px 4px' }}>Männer (Schnitt)</th>
                        <th style={{ padding: '6px 4px' }}>Fitness-Niveau</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: '#334155' }}>
                      {[
                        { age: '20–24', w: '37–41', m: '44–48', level: 'Gut / Athletisch' },
                        { age: '25–29', w: '35–39', m: '42–46', level: 'Gut / Durchschnitt' },
                        { age: '30–34', w: '34–38', m: '40–45', level: 'Durchschnitt' },
                        { age: '35–39', w: '33–37', m: '39–43', level: 'Durchschnitt' },
                        { age: '40–44', w: '32–35', m: '37–41', level: 'Durchschnitt' },
                        { age: '45–49', w: '31–34', m: '35–39', level: 'Mäßig / Normal' },
                        { age: '50–54', w: '29–32', m: '34–38', level: 'Mäßig / Normal' },
                        { age: '55–59', w: '27–30', m: '32–35', level: 'Mäßig' },
                        { age: '60–64', w: '25–28', m: '30–33', level: 'Einsteiger' },
                        { age: '65–69', w: '23–26', m: '28–31', level: 'Einsteiger' },
                        { age: '70+', w: '< 23', m: '< 26', level: 'Basis-Camp' }
                      ].map((row, idx) => (
                        <tr 
                          key={idx} 
                          style={{ 
                            borderBottom: '1px solid #f1f5f9', 
                            background: idx % 2 === 0 ? '#f8fafc' : 'transparent',
                            transition: 'background 0.15s ease' 
                          }}
                        >
                          <td style={{ padding: '5px 4px', fontWeight: 700, color: '#1e3a5f' }}>{row.age}</td>
                          <td style={{ padding: '5px 4px' }}>{row.w} ml/kg/min</td>
                          <td style={{ padding: '5px 4px' }}>{row.m} ml/kg/min</td>
                          <td style={{ padding: '5px 4px', fontWeight: 600, color: '#4c99c2' }}>{row.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* VO2-Max Analytics Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                style={{
                  background: '#fafcff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '24px',
                  padding: '0.85rem 1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 110, 167, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2effa', paddingBottom: '1rem' }}>
                  <div style={{ position: 'relative', width: '330px', height: '285px', margin: '0 auto' }}>
                    {(() => {
                      const needleAngle = Math.min(405, Math.max(135, 200 + (currentVO2 - 35.0) * 17.57));
                      const activeArcPct = (needleAngle - 135) / 270;
                      return (
                        <svg width="330" height="285" viewBox="0 0 220 190">
                          <defs>
                            <linearGradient id="tachoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="30%" stopColor="#f97316" />
                              <stop offset="52%" stopColor="#f97316" />
                              <stop offset="70%" stopColor="#eab308" />
                              <stop offset="86%" stopColor="#22c55e" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3.5" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#1e293b" />
                              <stop offset="80%" stopColor="#0f172a" />
                              <stop offset="100%" stopColor="#020617" />
                            </radialGradient>
                          </defs>
                          
                          {/* Background Track Arc */}
                          <path 
                            d="M 46 164 A 85 85 0 1 1 174 164" 
                            fill="none" 
                            stroke="#cbd5e1" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                            opacity="0.3"
                          />

                          {/* Colored Active Arc with Glow */}
                          <path 
                            d="M 46 164 A 85 85 0 1 1 174 164" 
                            fill="none" 
                            stroke="url(#tachoGrad)" 
                            strokeWidth="11" 
                            strokeLinecap="round" 
                            strokeDasharray="400"
                            strokeDashoffset={400 - (activeArcPct * 400)}
                            style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
                          />

                          {/* Futuristic Cyber-Grid Tick Marks */}
                          <path 
                            d="M 46 164 A 85 85 0 1 1 174 164" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="3" 
                            strokeDasharray="2, 6" 
                            opacity="0.4"
                          />

                          {/* Tacho Hub (Dark Glass Center Circle) */}
                          <circle cx="110" cy="110" r="48" fill="url(#hubGrad)" stroke="#334155" strokeWidth="2" />
                          
                          {/* Glowing inner cyan laser ring */}
                          <circle cx="110" cy="110" r="44" fill="none" stroke="#00f2fe" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.8" />
                          
                          {/* Futuristic Laser Needle - Glow Outer Layer */}
                          <line 
                            x1={110 + 48 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y1={110 + 48 * Math.sin((needleAngle * Math.PI) / 180)} 
                            x2={110 + 82 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y2={110 + 82 * Math.sin((needleAngle * Math.PI) / 180)} 
                            stroke="#00f2fe" 
                            strokeWidth="6" 
                            strokeLinecap="round"
                            filter="url(#neonGlow)"
                            opacity="0.85"
                            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                          />
                          {/* Futuristic Laser Needle - Bright White Core */}
                          <line 
                            x1={110 + 48 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y1={110 + 48 * Math.sin((needleAngle * Math.PI) / 180)} 
                            x2={110 + 82 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y2={110 + 82 * Math.sin((needleAngle * Math.PI) / 180)} 
                            stroke="#ffffff" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                          />
                        </svg>
                      );
                    })()}

                    {/* Values inside the Center Circle */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '60%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        lineHeight: 1
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em', textShadow: '0 0 5px rgba(56,189,248,0.4)' }}>VO2max</span>
                      <div style={{ fontSize: '2.85rem', fontWeight: 900, color: '#ffffff', margin: 0, padding: 0, textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
                        {currentVO2.toFixed(1).replace('.', ',')}
                      </div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: currentVO2 >= baseVO2 ? '#4ade80' : '#f87171', textShadow: `0 0 8px ${currentVO2 >= baseVO2 ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)'}` }}>
                        {currentVO2 >= baseVO2 ? '▲' : '▼'} {Math.abs(currentVO2 - baseVO2).toFixed(1).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VO2-Max Hebel Card (Eigener Kasten) */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: '1.5px solid #bae6fd',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 110, 167, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
                    VO2max Hebel
                  </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '4px' }}>
                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('zone2') ? 'active' : ''}`}
                          onClick={() => { toggleFactor('zone2'); setSelectedInfoFactor('zone2'); }}
                        >
                          <span>🏃‍♂️</span>
                        </button>
                        <div 
                          onClick={() => { toggleFactor('zone2'); setSelectedInfoFactor('zone2'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: selectedInfoFactor === 'zone2' ? '#0284c7' : '#334155', textDecoration: selectedInfoFactor === 'zone2' ? 'underline' : 'none' }}>Zone 2</span>
                        </div>
                      </div>

                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('hiit') ? 'active' : ''}`}
                          onClick={() => { toggleFactor('hiit'); setSelectedInfoFactor('hiit'); }}
                        >
                          <span>⚡</span>
                        </button>
                        <div 
                          onClick={() => { toggleFactor('hiit'); setSelectedInfoFactor('hiit'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: selectedInfoFactor === 'hiit' ? '#0284c7' : '#334155', textDecoration: selectedInfoFactor === 'hiit' ? 'underline' : 'none' }}>HIIT</span>
                        </div>
                      </div>

                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('regen') ? 'active' : ''}`}
                          onClick={() => { toggleFactor('regen'); setSelectedInfoFactor('regen'); }}
                        >
                          <span>🛌</span>
                        </button>
                        <div 
                          onClick={() => { toggleFactor('regen'); setSelectedInfoFactor('regen'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: selectedInfoFactor === 'regen' ? '#0284c7' : '#334155', textDecoration: selectedInfoFactor === 'regen' ? 'underline' : 'none' }}>Erholung</span>
                        </div>
                      </div>

                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('weight' ) ? 'active' : ''}`}
                          onClick={() => { toggleFactor('weight'); setSelectedInfoFactor('weight'); }}
                        >
                          <span>⚖️</span>
                        </button>
                        <div 
                          onClick={() => { toggleFactor('weight'); setSelectedInfoFactor('weight'); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'color 0.2s' }}
                        >
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: selectedInfoFactor === 'weight' ? '#0284c7' : '#334155', textDecoration: selectedInfoFactor === 'weight' ? 'underline' : 'none' }}>Gewicht</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Tooltip Info Box (Kasten unterhalb der Buttons) */}
                    {(() => {
                      const activeKey = selectedInfoFactor;
                      let content = null;
                      
                      if (activeKey === 'zone2') {
                        content = (
                          <div style={{ width: '100%' }}>
                            <strong>Mitochondriale Kapazität:</strong> Verbessert die Sauerstoffverarbeitung in den Muskelzellen und bildet das aerobe Fundament.
                            
                            {/* Interactive Zone 2 Fields */}
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', background: '#f0f9ff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #bae6fd', width: 'fit-content' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>🏃‍♂️ Aktuell:</span>
                                <input 
                                  type="number" 
                                  value={currentZone2 || ''} 
                                  onChange={(e) => setCurrentZone2(Number(e.target.value))}
                                  style={{ width: '52px', padding: '2px 4px', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: '#0f172a', background: '#ffffff', fontSize: '0.78rem' }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>Min/Woche</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>🎯 Ziel:</span>
                                <input 
                                  type="number" 
                                  value={targetZone2 || ''} 
                                  onChange={(e) => setTargetZone2(Number(e.target.value))}
                                  style={{ width: '52px', padding: '2px 4px', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: '#0f172a', background: '#ffffff', fontSize: '0.78rem' }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>Min/Woche</span>
                              </div>
                            </div>

                            {/* Dynamic Mathematical Example */}
                            {(() => {
                              const curZ2 = currentZone2 >= 0 ? currentZone2 : 0;
                              const tarZ2 = targetZone2 >= 0 ? targetZone2 : 0;
                              const diff = tarZ2 - curZ2;
                              if (diff <= 0) {
                                return (
                                  <div style={{ marginTop: '8px', color: '#64748b', fontWeight: 600 }}>
                                    💡 Tipp: Gib ein Zone 2-Ziel ein, das über deinem aktuellen Wert liegt, um den VO2max-Effekt zu berechnen.
                                  </div>
                                );
                              }
                              const bonus = (diff * 0.01).toFixed(1).replace('.', ',');
                              return (
                                <div style={{ marginTop: '8px', color: '#006ea7', fontWeight: 600 }}>
                                  <strong>Rechenbeispiel:</strong> Du erhöhst dein wöchentliches Zone 2-Training von {curZ2} auf {tarZ2} Minuten (+{diff} Min. Zuwachs). Deine relative VO2max steigt am Ende von Woche 12 rein rechnerisch um ca. **+{bonus}** Punkte!
                                </div>
                              );
                            })()}
                          </div>
                        );
                      } else if (activeKey === 'hiit') {
                        content = (
                          <div style={{ width: '100%' }}>
                            <strong>Kardiales Schlagvolumen:</strong> Vergrößert das Herzminutenvolumen, sodass pro Herzschlag mehr sauerstoffreiches Blut gepumpt wird.
                            
                            {/* Interactive HIIT Fields */}
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', background: '#f0f9ff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #bae6fd', width: 'fit-content' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>⚡ Aktuell:</span>
                                <input 
                                  type="number" 
                                  value={currentHIIT === 0 ? 0 : (currentHIIT || '')} 
                                  onChange={(e) => setCurrentHIIT(Number(e.target.value))}
                                  style={{ width: '52px', padding: '2px 4px', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: '#0f172a', background: '#ffffff', fontSize: '0.78rem' }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>Einheiten/Woche</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>🎯 Ziel:</span>
                                <input 
                                  type="number" 
                                  value={targetHIIT || ''} 
                                  onChange={(e) => setTargetHIIT(Number(e.target.value))}
                                  style={{ width: '52px', padding: '2px 4px', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: '#0f172a', background: '#ffffff', fontSize: '0.78rem' }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>Einheiten/Woche</span>
                              </div>
                            </div>

                            {/* Dynamic Mathematical Example */}
                            {(() => {
                              const curH = currentHIIT >= 0 ? currentHIIT : 0;
                              const tarH = targetHIIT >= 0 ? targetHIIT : 0;
                              const diff = tarH - curH;
                              if (diff <= 0) {
                                return (
                                  <div style={{ marginTop: '8px', color: '#64748b', fontWeight: 600 }}>
                                    💡 Tipp: Gib ein HIIT-Ziel ein, das über deinem aktuellen Wert liegt, um den VO2max-Effekt zu berechnen.
                                  </div>
                                );
                              }
                              const bonus = (diff * 1.0).toFixed(1).replace('.', ',');
                              return (
                                <div style={{ marginTop: '8px', color: '#006ea7', fontWeight: 600 }}>
                                  <strong>Rechenbeispiel:</strong> Du steigerst dein HIIT-Training von {curH} auf {tarH} Einheiten pro Woche (+{diff} Einheiten). Dein maximales Schlagvolumen wächst, was deine VO2max rein rechnerisch um ca. **+{bonus}** Punkte verbessert!
                                </div>
                              );
                            })()}
                          </div>
                        );
                      } else if (activeKey === 'regen') {
                        content = (
                          <div style={{ width: '100%' }}>
                            <strong>Regeneration:</strong> Ausreichend Schlaf und Trainingspausen erlauben es Herz und Muskeln, sich an gesetzte Reize anzupassen.
                            
                            {/* Interactive Sleep Fields */}
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', background: '#f0f9ff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #bae6fd', width: 'fit-content' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>🛌 Aktuell:</span>
                                <input 
                                  type="number" 
                                  step="0.5"
                                  value={currentSleep || ''} 
                                  onChange={(e) => setCurrentSleep(Number(e.target.value))}
                                  style={{ width: '52px', padding: '2px 4px', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: '#0f172a', background: '#ffffff', fontSize: '0.78rem' }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>Std. Schlaf/Nacht</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>🎯 Ziel:</span>
                                <input 
                                  type="number" 
                                  step="0.5"
                                  value={targetSleep || ''} 
                                  onChange={(e) => setTargetSleep(Number(e.target.value))}
                                  style={{ width: '52px', padding: '2px 4px', border: '1.5px solid #0284c7', borderRadius: '6px', textAlign: 'center', fontWeight: 800, color: '#0f172a', background: '#ffffff', fontSize: '0.78rem' }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>Std. Schlaf/Nacht</span>
                              </div>
                            </div>

                            {/* Dynamic Mathematical Example */}
                            {(() => {
                              const curS = currentSleep > 0 ? currentSleep : 6.0;
                              const tarS = targetSleep > 0 ? targetSleep : 8.0;
                              const diff = tarS - curS;
                              if (diff <= 0) {
                                return (
                                  <div style={{ marginTop: '8px', color: '#64748b', fontWeight: 600 }}>
                                    💡 Tipp: Gib ein Schlafziel ein, das über deinem aktuellen Wert liegt, um den VO2max-Effekt zu berechnen.
                                  </div>
                                );
                              }
                              const bonus = (diff * 0.4).toFixed(1).replace('.', ',');
                              return (
                                <div style={{ marginTop: '8px', color: '#006ea7', fontWeight: 600 }}>
                                  <strong>Rechenbeispiel:</strong> Du optimierst deinen Schlaf von {curS.toFixed(1).replace('.', ',')} auf {tarS.toFixed(1).replace('.', ',')} Std. pro Nacht (+{diff.toFixed(1).replace('.', ',')} Std. mehr Regeneration). Deine VO2max steigt rein rechnerisch um ca. **+{bonus}** Punkte!
                                </div>
                              );
                            })()}
                          </div>
                        );
                      } else if (activeKey === 'weight') {
                        content = (
                          <div style={{ width: '100%' }}>
                            <strong>Gewichtsreduktion:</strong> Da die relative VO2max pro Kilogramm Körpergewicht gemessen wird (ml/kg/min), erhöht Fettabbau deinen Wert rechnerisch sofort, da weniger Masse versorgt werden muss.
                            
                            {/* Interactive Weight Fields (Current & Target) */}
                            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', background: '#f0f9ff', padding: '6px 12px', borderRadius: '10px', border: '1px solid #bae6fd', width: 'fit-content' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>⚖️ Aktuell:</span>
                                <input 
                                  type="number" 
                                  value={userWeight || ''} 
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setUserWeight(val);
                                  }}
                                  style={{ 
                                    width: '52px', 
                                    padding: '2px 4px', 
                                    border: '1.5px solid #0284c7', 
                                    borderRadius: '6px', 
                                    textAlign: 'center', 
                                    fontWeight: 800, 
                                    color: '#0f172a',
                                    background: '#ffffff',
                                    fontSize: '0.78rem'
                                  }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>kg</span>
                              </div>
                              
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>🎯 Ziel:</span>
                                <input 
                                  type="number" 
                                  value={targetWeight || ''} 
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setTargetWeight(val);
                                  }}
                                  style={{ 
                                    width: '52px', 
                                    padding: '2px 4px', 
                                    border: '1.5px solid #0284c7', 
                                    borderRadius: '6px', 
                                    textAlign: 'center', 
                                    fontWeight: 800, 
                                    color: '#0f172a',
                                    background: '#ffffff',
                                    fontSize: '0.78rem'
                                  }} 
                                />
                                <span style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.78rem' }}>kg</span>
                              </div>
                            </div>

                            {/* Dynamic Mathematical Example */}
                            {(() => {
                              const curW = userWeight > 10 ? userWeight : 80;
                              const targetW = targetWeight > 10 ? targetWeight : 76;
                              const weightLoss = curW - targetW;
                              
                              if (weightLoss <= 0) {
                                return (
                                  <div style={{ marginTop: '8px', color: '#64748b', fontWeight: 600 }}>
                                    💡 Tipp: Gib ein Zielgewicht ein, das unter deinem aktuellen Gewicht liegt, um den VO2max-Effekt zu berechnen.
                                  </div>
                                );
                              }
                              
                              const newVO2Val = ((35.0 * curW) / targetW).toFixed(1).replace('.', ',');
                              return (
                                <div style={{ marginTop: '8px', color: '#006ea7', fontWeight: 600 }}>
                                  <strong>Rechenbeispiel:</strong> Du reduzierst dein Gewicht von {curW} kg auf {targetW} kg ({weightLoss} kg Verlust). Deine relative VO2max steigt dadurch rein rechnerisch sofort von 35,0 auf {newVO2Val} ml/kg/min an!
                                </div>
                              );
                            })()}
                          </div>
                        );
                      }

                      return (
                        <div 
                          style={{
                            marginTop: '1rem',
                            background: '#fafcff',
                            border: '1.5px solid #e2eef8',
                            borderRadius: '16px',
                            padding: '0.8rem 1rem',
                            fontSize: '0.78rem',
                            lineHeight: '1.4',
                            color: '#334155',
                            minHeight: '155px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {content}
                        </div>
                      );
                    })()}
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
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{currentVO2.toFixed(1).replace('.', ',')}</div>
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
