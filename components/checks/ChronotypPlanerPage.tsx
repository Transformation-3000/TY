'use client';

import React, { useState } from 'react';

interface ChronotypPlanerPageProps {
  onBack: () => void;
}

interface ChronoProfile {
  id: string;
  number: number;
  name: string;
  scientificName: string;
  tagline: string;
  desc: string;
  wakeTime: number; // in hours (e.g. 7.0 = 07:00)
  bedTime: number;  // in hours (e.g. 23.0 = 23:00)
  focusStart: number;
  focusEnd: number;
  sportStart: number;
  sportEnd: number;
  caffeineDeadline: number;
  melatoninOnset: number;
  icon: string; // Bootstrap icon
}

const CHRONO_PROFILES: ChronoProfile[] = [
  {
    id: 'fruetyp',
    number: 1,
    name: 'Frühtyp',
    scientificName: 'Morgen-Typ (Lerche)',
    tagline: 'Früher Fokus-Peak: Hohe Leistungsfähigkeit am Morgen.',
    desc: 'Frühtypen wachen früh ohne Wecker auf und erreichen ihre geistige Höchstleistung in den ersten Morgenstunden. Am Abend ermüden sie früh.',
    wakeTime: 6.0,
    bedTime: 22.0,
    focusStart: 8.0,
    focusEnd: 11.5,
    sportStart: 15.5,
    sportEnd: 17.5,
    caffeineDeadline: 12.0,
    melatoninOnset: 20.0,
    icon: 'bi-sunrise-fill'
  },
  {
    id: 'normaltyp',
    number: 2,
    name: 'Normaltyp',
    scientificName: 'Zwischen-Typ',
    tagline: 'Standard-Rhythmus: Ausgeglichene Tagesverteilung.',
    desc: 'Der Normaltyp folgt dem typischen Tag-Nacht-Rhythmus. Die Leistungsfähigkeit erreicht am späten Vormittag ihren Höhepunkt.',
    wakeTime: 7.0,
    bedTime: 23.0,
    focusStart: 9.5,
    focusEnd: 12.5,
    sportStart: 17.0,
    sportEnd: 19.0,
    caffeineDeadline: 14.0,
    melatoninOnset: 21.0,
    icon: 'bi-sun-fill'
  },
  {
    id: 'spaettyp',
    number: 3,
    name: 'Spättyp',
    scientificName: 'Abend-Typ (Eule)',
    tagline: 'Später Fokus-Peak: Geistige Höchstform am Nachmittag/Abend.',
    desc: 'Spättypen kommen morgens schwer in den Gang. Ihr Melatoninspiegel sinkt verzögert ab, weshalb ihre produktivste Phase am späten Nachmittag liegt.',
    wakeTime: 8.5,
    bedTime: 0.5,
    focusStart: 13.0,
    focusEnd: 16.5,
    sportStart: 18.0,
    sportEnd: 20.0,
    caffeineDeadline: 16.0,
    melatoninOnset: 23.0,
    icon: 'bi-moon-stars-fill'
  },
  {
    id: 'sensiblertyp',
    number: 4,
    name: 'Sensibler Typ',
    scientificName: 'Leichter Schläfer',
    tagline: 'Fragmentierter Rhythmus: Erhöhtes Schlafbedürfnis.',
    desc: 'Sensible Schläfer reagieren stark auf Umweltreize. Ihr zirkadianer Taktgeber ist weniger ausgeprägt, was zu unruhigem Schlaf führen kann.',
    wakeTime: 7.0,
    bedTime: 23.0,
    focusStart: 10.0,
    focusEnd: 13.0,
    sportStart: 16.0,
    sportEnd: 18.0,
    caffeineDeadline: 13.0,
    melatoninOnset: 21.5,
    icon: 'bi-activity'
  }
];

export default function ChronotypPlanerPage({ onBack }: ChronotypPlanerPageProps) {
  const [selectedChrono, setSelectedChrono] = useState<ChronoProfile>(CHRONO_PROFILES[1]); // Normaltyp default
  const [simulatedTime, setSimulatedTime] = useState<number>(10.0); // 10:00 Uhr standard

  // Helper to check what phase an hour belongs to
  const getHourPhase = (h: number, profile: ChronoProfile) => {
    const wake = profile.wakeTime;
    const bed = profile.bedTime;

    // Sleep check
    const isSleeping = bed > wake
      ? (h >= bed || h < wake)
      : (h >= bed && h < wake);

    if (isSleeping) return 'sleep';
    if (h >= profile.focusStart && h < profile.focusEnd) return 'focus';
    if (h >= profile.sportStart && h < profile.sportEnd) return 'sport';
    if (h >= profile.melatoninOnset && (bed > profile.melatoninOnset ? h < bed : true)) return 'melatonin';
    return 'active';
  };

  // Real-time recommendations logic
  const getCaffeineStatus = () => {
    const isPastDeadline = simulatedTime > selectedChrono.caffeineDeadline || simulatedTime < selectedChrono.wakeTime;
    const isJustWokeUp = simulatedTime >= selectedChrono.wakeTime && simulatedTime < selectedChrono.wakeTime + 1.5;
    
    if (isJustWokeUp) {
      return {
        label: 'Verzögern',
        desc: 'Der Cortisolspiegel sinkt noch ab. Warte noch etwas, um ein Nachmittagstief zu vermeiden.',
        color: '#ca8a04',
        bgColor: 'rgba(202, 138, 4, 0.08)'
      };
    }
    if (isPastDeadline) {
      return {
        label: 'Vermeiden',
        desc: 'Koffein stört jetzt den Einschlafprozess und vermindert die Tiefschlaf-Qualität.',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.08)'
      };
    }
    return {
      label: 'Unbedenklich',
      desc: 'Idealer Zeitpunkt für Koffein-Zufuhr, da der Cortisol-Peak vorüber ist.',
      color: '#16a34a',
      bgColor: 'rgba(22, 163, 74, 0.08)'
    };
  };

  const getLightStatus = () => {
    const h = simulatedTime;
    const wake = selectedChrono.wakeTime;
    const bed = selectedChrono.bedTime;

    // Morning light window
    if (h >= wake && h < wake + 2) {
      return {
        label: 'Helles Tageslicht',
        desc: 'Nimm jetzt 10-15 Min. direktes Tageslicht auf, um Melatonin abzubauen und den Rhythmus zu takten.',
        color: '#16a34a',
        bgColor: 'rgba(22, 163, 74, 0.08)'
      };
    }
    // Evening light reduction
    const hoursToBed = bed > h ? bed - h : (24 - h) + bed;
    if (hoursToBed <= 2.5) {
      return {
        label: 'Blaulicht reduzieren',
        desc: 'Schalte Displays stumm oder nutze Nachtmodi, um die körpereigene Melatonin-Produktion zu schützen.',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.08)'
      };
    }
    return {
      label: 'Normales Raumlicht',
      desc: 'Eine gute Umgebungshelligkeit stützt die Wachheit am Tag.',
      color: '#2563eb',
      bgColor: 'rgba(37, 99, 235, 0.08)'
    };
  };

  const getPhaseDescription = () => {
    const phase = getHourPhase(simulatedTime, selectedChrono);
    switch (phase) {
      case 'sleep':
        return {
          title: 'Regeneration & Schlaf',
          desc: 'Der Körper befindet sich in der nächtlichen Reparaturphase. Wichtig für Gehirnentgiftung und Hormonausgleich.',
          color: '#4f6174',
          flatColor: '#5b8ec5'
        };
      case 'focus':
        return {
          title: 'Geistiger Fokus-Peak',
          desc: 'Höchste kognitive Leistungsfähigkeit und Problemlösungskompetenz. Ideal für anspruchsvolle mentale Aufgaben.',
          color: '#a16207',
          flatColor: '#ca8a04'
        };
      case 'sport':
        return {
          title: 'Physisches Leistungsoptimum',
          desc: 'Muskeltemperatur, Lungenkapazität und Koordination sind am höchsten. Bester Zeitpunkt für Training.',
          color: '#15803d',
          flatColor: '#16a34a'
        };
      case 'melatonin':
        return {
          title: 'Melatonin-Anstieg',
          desc: 'Die Kerntemperatur sinkt und die Schlafbereitschaft steigt. Ideal für ruhige Abendroutinen.',
          color: '#6d28d9',
          flatColor: '#a855f7'
        };
      default:
        return {
          title: 'Aktivität & Routine',
          desc: 'Solides Energielevel. Geeignet für Kommunikation, Planungen und moderaten Energieeinsatz.',
          color: '#1d4ed8',
          flatColor: '#3b82f6',
          hideBox: true
        };
    }
  };

  const currentPhase = getPhaseDescription();
  const caffeine = getCaffeineStatus();
  const light = getLightStatus();

// Unused circular helper methods removed

  // Zirkadiane Energiewelle Path generation in SVG coordinates (100w x 40h)
  const getEnergyCurvePoints = () => {
    const points = [];
    const wake = selectedChrono.wakeTime;
    const bed = selectedChrono.bedTime;
    const focus = (selectedChrono.focusStart + selectedChrono.focusEnd) / 2;
    const sport = (selectedChrono.sportStart + selectedChrono.sportEnd) / 2;

    for (let h = 0; h <= 24; h += 0.2) {
      let energy = 45; // baseline

      const isSleeping = bed > wake
        ? (h >= bed || h < wake)
        : (h >= bed && h < wake);

      if (isSleeping) {
        energy = 15; // sleeping state
      } else {
        const distToFocus = Math.abs(h - focus);
        const distToSport = Math.abs(h - sport);
        const focusContribution = 45 * Math.exp(-Math.pow(distToFocus / 2.5, 2));
        const sportContribution = 35 * Math.exp(-Math.pow(distToSport / 2.0, 2));
        
        energy = 35 + focusContribution + sportContribution;
        if (energy > 90) energy = 90;
      }

      const x = (h / 24) * 100;
      const y = 45 - (energy * 0.4); // scale to SVG height
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return points;
  };

  const getEnergyCurveAreaPath = () => {
    const points = getEnergyCurvePoints();
    return `M 0,50 L ${points.join(' L ')} L 100,50 Z`;
  };

  const getEnergyCurveStrokePath = () => {
    const points = getEnergyCurvePoints();
    return `M ${points.join(' L ')}`;
  };

  // Get current Y point on the curve for simulated time marker dot
  const getMarkerYOnCurve = () => {
    const h = simulatedTime;
    const wake = selectedChrono.wakeTime;
    const bed = selectedChrono.bedTime;
    const focus = (selectedChrono.focusStart + selectedChrono.focusEnd) / 2;
    const sport = (selectedChrono.sportStart + selectedChrono.sportEnd) / 2;

    let energy = 45;
    const isSleeping = bed > wake
      ? (h >= bed || h < wake)
      : (h >= bed && h < wake);

    if (isSleeping) {
      energy = 15;
    } else {
      const distToFocus = Math.abs(h - focus);
      const distToSport = Math.abs(h - sport);
      const focusContribution = 45 * Math.exp(-Math.pow(distToFocus / 2.5, 2));
      const sportContribution = 35 * Math.exp(-Math.pow(distToSport / 2.0, 2));
      energy = 35 + focusContribution + sportContribution;
      if (energy > 90) energy = 90;
    }

    return 45 - (energy * 0.4);
  };

  const markerY = getMarkerYOnCurve();

  return (
    <div className="sim-container">
      <div className="sim-header">
        <div className="sim-header-title-row">
          <h1 className="sim-title">Chronotyp & Schlaf-Planer</h1>
          <button className="sim-back-btn" onClick={onBack}>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9L1 5L5 1" />
            </svg>
            Zurück
          </button>
        </div>
        <p className="sim-subtitle">
          Wissenschaftlich fundierte circadiane Optimierung auf Basis deines biologischen Chronotyps.
        </p>
      </div>

      <div className="sim-grid">
        {/* Left Column: Typen & Schieberegler */}
        <div className="sim-card inputs-card">
            <h2>Wissenschaftliche Typisierung</h2>
            <p className="card-subtitle">Wähle den Chronotyp, der deinen Schlafgewohnheiten entspricht:</p>

            <div className="chrono-selector-column">
              {CHRONO_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  className={`chrono-select-row ${selectedChrono.id === profile.id ? 'active' : ''}`}
                  onClick={() => setSelectedChrono(profile)}
                  type="button"
                >
                  <div className="chrono-row-header">
                    <div className="chrono-name-with-icon">
                      <span className="chrono-number">{profile.number}.</span>
                      <div className="chrono-icon-wrapper">
                        <i className={`bi ${profile.icon}`}></i>
                      </div>
                      <span className="chrono-profile-name">{profile.name}</span>
                    </div>
                    <span className="chrono-profile-scientific">{profile.scientificName}</span>
                  </div>
                  <p className="chrono-profile-desc">{profile.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Agenda Checklist Summary */}
          <div className="sim-card agenda-card">
            <h2>Beispiel optimaler Tagesplan</h2>
            <div className="agenda-list">
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.wakeTime).toString().padStart(2, '0')}:00 Uhr
                </span>
                <span className="agenda-text">Aufwachen & sofort 10 Min. Tageslicht aufnehmen</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.wakeTime + 1.5).toString().padStart(2, '0')}:30 Uhr
                </span>
                <span className="agenda-text">Frühestes Koffein-Fenster (Adenosin-Abbau abwarten)</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.focusStart).toString().padStart(2, '0')}:00 Uhr
                </span>
                <span className="agenda-text">Geistiges Fokus-Hoch (Höchste Konzentration)</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.caffeineDeadline).toString().padStart(2, '0')}:00 Uhr
                </span>
                <span className="agenda-text">Koffein-Stopp (Letzter Kaffee)</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.sportStart).toString().padStart(2, '0')}:00 Uhr
                </span>
                <span className="agenda-text">Physischer Sport-Peak (Bestes Trainingsergebnis)</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.melatoninOnset).toString().padStart(2, '0')}:00 Uhr
                </span>
                <span className="agenda-text">Melatonin-Ausschüttung (Licht dimmen, Blaulicht aus)</span>
              </div>
              <div className="agenda-item">
                <span className="agenda-time">
                  {Math.floor(selectedChrono.bedTime).toString().padStart(2, '0')}:00 Uhr
                </span>
                <span className="agenda-text">Schlafenszeit</span>
              </div>
            </div>
          </div>

          {/* Visual 2: Zirkadianer Energieverlauf (Waveform Curve) */}
          <div className="sim-card timeline-card">
            <h2>Zirkadianer Energieverlauf</h2>
            <p className="card-subtitle">Toleranzkurve und biologische Aktivitätswelle:</p>

            <div className="waveform-container">
              <svg viewBox="0 0 100 50" className="waveform-svg">
                <defs>
                  <linearGradient id="waveAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="waveLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#93c5fd" />
                    <stop offset="30%" stopColor="#ffe082" />
                    <stop offset="70%" stopColor="#86efac" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1="0" y1="45" x2="100" y2="45" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="27.5" x2="100" y2="27.5" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />

                {/* Filled Area beneath curve */}
                <path d={getEnergyCurveAreaPath()} fill="url(#waveAreaGrad)" style={{ transition: 'd 0.3s' }} />

                {/* Main Curve Line */}
                <path d={getEnergyCurveStrokePath()} fill="none" stroke="url(#waveLineGrad)" strokeWidth="1.2" style={{ transition: 'd 0.3s' }} />

                {/* Vertical time marker swept by simulated hour */}
                <line x1={(simulatedTime / 24) * 100} y1="0" x2={(simulatedTime / 24) * 100} y2="45" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="1,1" />

                {/* Indicator Dot on the wave curve */}
                <circle cx={(simulatedTime / 24) * 100} cy={markerY} r="1.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.5" />
              </svg>

              <div className="waveform-labels">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>
            </div>

            {/* Simple Legend */}
            <div className="timeline-legend" style={{ justifyContent: 'center', margin: '0.75rem 0' }}>
              <span className="legend-item"><span className="legend-box sleep"></span> Schlaf</span>
              <span className="legend-item"><span className="legend-box focus"></span> Fokus</span>
              <span className="legend-item"><span className="legend-box sport"></span> Sport</span>
              <span className="legend-item"><span className="legend-box melatonin"></span> Melatonin</span>
            </div>

            <div className="wave-stats-box">
              <span className="wave-status-label">Biologischer Status um {Math.floor(simulatedTime).toString().padStart(2, '0')}:00 Uhr:</span>
              <span className="wave-status-value" style={{ color: currentPhase.flatColor }}>{currentPhase.title}</span>
            </div>
          </div>

          {/* Visual 3: Simulierte Tageszeit Control Card */}
          <div className="sim-card time-control-card">
            <div className="time-control-header">
              <h2>Simuliere die Tageszeit</h2>
              <span className="time-control-digital">
                {Math.floor(simulatedTime).toString().padStart(2, '0')}
                :
                {Math.round((simulatedTime % 1) * 60).toString().padStart(2, '0')}
                <span className="time-control-unit"> Uhr</span>
              </span>
            </div>

            <div className="premium-slider-container">
              <input
                type="range"
                min="0"
                max="23.75"
                step="0.25"
                value={simulatedTime}
                onChange={(e) => setSimulatedTime(parseFloat(e.target.value))}
                className="premium-range-input"
              />
              <div className="slider-phase-ticks">
                <span className="tick-label"><i className="bi bi-moon-stars-fill"></i> Nacht</span>
                <span className="tick-label"><i className="bi bi-sunrise-fill"></i> Morgen</span>
                <span className="tick-label"><i className="bi bi-sun-fill"></i> Mittag</span>
                <span className="tick-label"><i className="bi bi-sunset-fill"></i> Abend</span>
              </div>
            </div>
          </div>

          {/* Current Hour Recommendations */}
          <div className="sim-card info-card">
            <h2>Empfehlungen</h2>
            {!currentPhase.hideBox && (
              <div className="recommendation-box" style={{ borderColor: currentPhase.color }}>
                <div className="rec-phase-header" style={{ color: currentPhase.color }}>
                  {currentPhase.title}
                </div>
                <p className="rec-phase-desc">{currentPhase.desc}</p>
              </div>
            )}

            <div className="status-grid">
              {/* Caffeine */}
              <div className="status-row" style={{ backgroundColor: caffeine.bgColor }}>
                <span className="status-title">☕ Koffein-Status</span>
                <div className="status-badge-wrapper">
                  <span className="status-badge" style={{ color: caffeine.color, border: `1.5px solid ${caffeine.color}` }}>
                    {caffeine.label}
                  </span>
                  <p className="status-desc-text">{caffeine.desc}</p>
                </div>
              </div>

              {/* Light */}
              <div className="status-row" style={{ backgroundColor: light.bgColor }}>
                <span className="status-title">☀️ Licht-Führung</span>
                <div className="status-badge-wrapper">
                  <span className="status-badge" style={{ color: light.color, border: `1.5px solid ${light.color}` }}>
                    {light.label}
                  </span>
                  <p className="status-desc-text">{light.desc}</p>
                </div>
              </div>
            </div>
          </div>
      </div>

      <style jsx>{`
        .sim-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: fadeIn 0.4s ease-out;
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
        }
        
        .sim-back-btn:hover {
          background: #ffffff;
          border-color: #006ea7;
          color: #006ea7;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(68, 152, 202, 0.12);
        }

        .sim-header {
          margin-bottom: 2.5rem;
        }
        
        .sim-header-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .sim-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0;
        }
        
        .sim-subtitle {
          font-size: 1.1rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }

        .sim-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
          align-items: stretch;
        }

        .inputs-card {
          grid-column: 1;
          grid-row: span 2;
          display: flex;
          flex-direction: column;
          align-self: stretch;
        }

        .timeline-card {
          grid-column: 2;
          grid-row: 1;
          display: flex;
          flex-direction: column;
          align-self: stretch;
        }

        .time-control-card {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          flex-direction: column;
          align-self: stretch;
        }

        .inputs-card,
        .timeline-card,
        .time-control-card {
          padding-bottom: 1.25rem;
        }

        .agenda-card {
          grid-column: 1;
          grid-row: 3;
        }

        .info-card {
          grid-column: 2;
          grid-row: 3;
        }

        @media (max-width: 992px) {
          .sim-grid {
            grid-template-columns: 1fr;
          }
          .inputs-card, .timeline-card, .time-control-card, .agenda-card, .info-card {
            grid-column: auto !important;
            grid-row: auto !important;
          }
        }

        .sim-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 30px;
          padding: 2.25rem 2rem;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.02);
        }

        .sim-card h2 {
          font-size: 1.45rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: #1e3a5f;
        }

        .card-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0 0 1.5rem 0;
        }

        .chrono-selector-column {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 0;
        }

        .chrono-select-row {
          background: #ffffff;
          border: 2px solid transparent;
          border-radius: 18px;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: none;
        }

        .chrono-select-row:hover {
          background: #edf5fc;
          border-color: rgba(0, 110, 167, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
        }

        .chrono-select-row.active {
          background: #ffffff;
          border: 2px solid #4498ca;
          box-shadow: 0 8px 24px rgba(0, 110, 167, 0.08);
          transform: translateY(-2px);
        }

        .chrono-select-row:not(.active):not(:hover) {
          background: #f8fafc;
          border-color: transparent;
          opacity: 0.55;
          box-shadow: none;
        }

        .chrono-select-row:not(.active):not(:hover) .chrono-icon-wrapper {
          border-color: #cbd5e1;
          background: #f1f5f9;
          color: #94a3b8;
        }

        .chrono-row-header {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          margin-bottom: 6px;
        }

        .chrono-name-with-icon {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .chrono-number {
          font-size: 1.15rem;
          font-weight: 800;
          color: #94a3b8;
          min-width: 18px;
        }

        .chrono-select-row.active .chrono-number {
          color: #4498ca;
        }

        .chrono-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid #4498ca;
          background: #f0f7ff;
          color: #4498ca;
          font-size: 1.15rem;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .chrono-icon-wrapper i {
          color: inherit !important;
        }

        .chrono-select-row.active .chrono-icon-wrapper {
          background: #4498ca;
          color: #ffffff;
        }

        /* Stabilize icon appearance on row hover */
        .chrono-select-row:hover .chrono-icon-wrapper {
          border-color: #4498ca;
          background: #f0f7ff;
          color: #4498ca;
        }

        .chrono-select-row.active:hover .chrono-icon-wrapper {
          background: #4498ca;
          color: #ffffff;
        }

        .chrono-profile-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e3a5f;
        }

        .chrono-profile-scientific {
          font-size: 0.85rem;
          font-weight: 700;
          color: #4498ca;
          background: #e0f2fe;
          padding: 3px 10px;
          border-radius: 100px;
        }

        .chrono-profile-desc {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        .time-slider-section {
          background: #fafcff;
          border: 1.5px solid #e2eef8;
          border-radius: 20px;
          padding: 1.5rem;
        }

        .slider-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .slider-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e3a5f;
        }

        .slider-value-display {
          font-size: 1.25rem;
          font-weight: 800;
          color: #4498ca;
        }

        .time-slider-bar {
          width: 100%;
          height: 8px;
          border-radius: 10px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          margin: 0.75rem 0;
        }

        .time-slider-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #ffffff;
          border: 4px solid #4498ca;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(68, 152, 202, 0.3);
        }

        .slider-info {
          font-size: 0.88rem;
          color: #64748b;
          margin: 4px 0 0 0;
        }

        /* Unused circular clock styles removed */

        /* Waveform Curve Styles */
        .waveform-container {
          position: relative;
          margin: 1.25rem 0 0.5rem 0;
        }

        .waveform-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .waveform-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          padding: 0 4px;
        }

        .waveform-labels span {
          font-size: 0.88rem; /* +2pt larger than 0.72rem */
          font-weight: 700;
          color: #94a3b8;
        }

        .wave-stats-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          margin-top: 0.75rem;
        }

        .wave-status-label {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        .wave-status-value {
          font-size: 0.92rem;
          font-weight: 800;
        }

        .timeline-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          justify-content: flex-start;
          margin-top: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
        }

        .legend-box {
          width: 14px;
          height: 14px;
          border-radius: 4px;
          display: inline-block;
        }

        .legend-box.sleep { background-color: #93c5fd; }
        .legend-box.focus { background-color: #ffe082; }
        .legend-box.sport { background-color: #86efac; }
        .legend-box.melatonin { background-color: #c084fc; }

        /* Recommendation card styles */
        .recommendation-box {
          border-left: 4px solid #e2e8f0;
          padding: 0.5rem 0 0.5rem 1.25rem;
          margin-bottom: 1.75rem;
        }

        .rec-phase-header {
          font-size: 1.35rem;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .rec-phase-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.45;
          margin: 0;
        }

        .status-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .status-row {
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .status-title {
          font-size: 0.92rem;
          font-weight: 800;
          color: #1e3a5f;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .status-badge-wrapper {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .status-badge {
          font-size: 0.85rem;
          font-weight: 800;
          padding: 3px 12px;
          border-radius: 100px;
          background: #ffffff;
          white-space: nowrap;
        }

        .status-desc-text {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.4;
          margin: 0;
        }

        /* Agenda Checklist styles */
        .agenda-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .agenda-item {
          display: flex;
          gap: 1.25rem;
          padding: 8px 0;
          border-bottom: 1px solid #f1f5f9;
          align-items: flex-start;
        }

        .agenda-item:last-child {
          border-bottom: none;
        }

        .agenda-time {
          font-size: 0.92rem;
          font-weight: 800;
          color: #4498ca;
          width: 80px;
          flex-shrink: 0;
        }

        .agenda-text {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.4;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Time Control Card Styles */
        .time-control-card {
          border: 1.5px solid #cbd5e1;
          box-shadow: 0 10px 30px rgba(68, 152, 202, 0.08);
          background: #ffffff;
        }

        .time-control-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .time-control-digital {
          font-size: 1.8rem;
          font-weight: 950;
          color: #4498ca;
          font-family: 'DM Sans', monospace;
          background: #f0f7ff;
          padding: 4px 14px;
          border-radius: 12px;
          border: 1.5px solid #e0f2fe;
          text-shadow: 0 0 10px rgba(68, 152, 202, 0.05);
        }

        .time-control-unit {
          font-size: 0.95rem;
          font-weight: 700;
          color: #64748b;
        }

        .premium-slider-container {
          position: relative;
          margin: 2rem 0 0 0;
          padding: 0 4px;
        }

        .premium-range-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 48px;
          background: transparent;
          outline: none;
          cursor: pointer;
        }

        .premium-range-input::-webkit-slider-runnable-track {
          width: 100%;
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, 
            #93c5fd 0%, #93c5fd 25%,   /* Sleep */
            #ffe082 35%, #ffe082 50%,   /* Focus */
            #86efac 60%, #86efac 75%,   /* Sport */
            #c084fc 85%, #c084fc 100%   /* Melatonin */
          );
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 10px rgba(68, 152, 202, 0.05);
        }

        .premium-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 46px;
          border-radius: 6px;
          background: #ffffff;
          border: 2.5px solid #4498ca;
          box-shadow: 0 4px 10px rgba(68, 152, 202, 0.3);
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s;
          margin-top: -17px; /* (12 / 2) - (46 / 2) = 6 - 23 = -17 */
        }

        .premium-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.05);
          border-color: #006ea7;
          box-shadow: 0 4px 12px rgba(68, 152, 202, 0.4);
        }

        .premium-range-input::-moz-range-track {
          width: 100%;
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(to right, 
            #93c5fd 0%, #93c5fd 25%,
            #ffe082 35%, #ffe082 50%,
            #86efac 60%, #86efac 75%,
            #c084fc 85%, #c084fc 100%
          );
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .premium-range-input::-moz-range-thumb {
          width: 22px;
          height: 46px;
          border-radius: 6px;
          background: #ffffff;
          border: 2.5px solid #4498ca;
          box-shadow: 0 4px 10px rgba(68, 152, 202, 0.3);
          cursor: pointer;
          transition: transform 0.15s, border-color 0.15s;
        }

        .premium-range-input::-moz-range-thumb:hover {
          transform: scale(1.05);
          border-color: #006ea7;
        }

        .slider-phase-ticks {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 4px;
        }

         .tick-label {
          font-size: 0.98rem; /* 25% larger than 0.78rem */
          font-weight: 800;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tick-label i {
          font-size: 1.06rem; /* 25% larger than 0.85rem */
        }

        .time-presets {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        @media (max-width: 576px) {
          .time-presets {
            grid-template-columns: 1fr;
          }
        }

        .preset-btn {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.65rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .preset-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #1e293b;
          transform: translateY(-1px);
        }

        .preset-btn.active {
          background: #e0f2fe;
          border-color: #38bdf8;
          color: #0369a1;
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.15);
        }
      `}</style>
    </div>
  );
}
