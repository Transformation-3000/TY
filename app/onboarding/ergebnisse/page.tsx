'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WelcomeSection from '@/components/layout/WelcomeSection';

interface CategoryScore {
  id: string;
  name: string;
  score: number; // 0 to 100
  color: string;
  icon: string;
  details: string;
  optimalRange: string;
  savedYears: number;
}

const RUBRIC_DEFAULTS: Record<string, { color: string; icon: string; name: string; details: string; optimalRange: string; savedYears: number }> = {
  Einstieg: { name: 'Einstieg', color: '#B3E0F0', icon: 'bi-rocket-takeoff', details: 'Grundlegende Einstufung deines biologischen Alters und Lebensstils.', optimalRange: 'N/A', savedYears: 0 },
  Schlaf: { name: 'Schlaf & Erholung', color: '#4498ca', icon: 'bi-moon-stars', details: 'Qualität deines Tiefschlafs, Einschlafdauer und Zirkadiane Rhythmik.', optimalRange: '80-100%', savedYears: 1.2 },
  Kraft: { name: 'Kraft & Ausdauer', color: '#22c55e', icon: 'bi-lightning', details: 'Muskelmasse-Erhalt, wöchentliche Aktivitätsminuten und VO2max-Potenzial.', optimalRange: '75-100%', savedYears: 0.8 },
  Zellversorgung: { name: 'Zellversorgung', color: '#ACE189', icon: 'bi-apple', details: 'Nährstoffdichte, Blutzuckervariabilität und Hydratation.', optimalRange: '80-100%', savedYears: 1.1 },
  Immunbalance: { name: 'Immunbalance', color: '#f59e0b', icon: 'bi-yin-yang', details: 'Chronische Entzündungsmarker, Regeneration und Stressresilienz.', optimalRange: '85-100%', savedYears: 0.5 },
  'Soziale Bindungen': { name: 'Soziale Bindungen', color: '#ec4899', icon: 'bi-heart', details: 'Qualität deines Unterstützungsnetzwerks und soziale Interaktionen.', optimalRange: '70-100%', savedYears: 1.5 },
  Mindset: { name: 'Mentale Resilienz', color: '#06b6d4', icon: 'bi-sun', details: 'Stressbewältigungsstrategien, mentale Flexibilität und Achtsamkeit.', optimalRange: '80-100%', savedYears: 0.7 }
};

const getDarkColor = (color: string) => {
  if (color.toLowerCase() === '#ace189') return '#15803d'; // dark green for Zellversorgung
  return color;
};

export default function ErgebnissePage() {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [finished, setFinished] = useState<boolean>(false);
  const [selectedRubric, setSelectedRubric] = useState<string>('Schlaf');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('ty_onboarding_answers');
      const savedFinished = localStorage.getItem('ty_onboarding_finished');
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch (e) {
          console.error('Error loading answers', e);
        }
      }
      if (savedFinished) {
        setFinished(JSON.parse(savedFinished));
      }

      // Sync changes from other tabs or actions
      const handleStorage = (e: StorageEvent) => {
        if (e.key === 'ty_onboarding_answers' && e.newValue) {
          try {
            setAnswers(JSON.parse(e.newValue));
          } catch (err) {
            console.error(err);
          }
        }
        if (e.key === 'ty_onboarding_finished' && e.newValue) {
          try {
            setFinished(JSON.parse(e.newValue));
          } catch (err) {
            console.error(err);
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => {
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, []);

  // Simple heuristic score calculation based on mock or real answers
  const calculateScores = (): CategoryScore[] => {
    const categories = ['Einstieg', 'Schlaf', 'Kraft', 'Zellversorgung', 'Immunbalance', 'Soziale Bindungen', 'Mindset'];
    
    return categories.map(cat => {
      const defaults = RUBRIC_DEFAULTS[cat];
      
      // Filter answers belonging to this category
      // If none exist, we provide a premium high-fidelity default score
      let score = 50; // default fallback
      if (cat === 'Einstieg') score = 60;
      else if (cat === 'Schlaf') score = 85;
      else if (cat === 'Kraft') score = 48;
      else if (cat === 'Zellversorgung') score = 56;
      else if (cat === 'Immunbalance') score = 52;
      else if (cat === 'Soziale Bindungen') score = 80;
      else if (cat === 'Mindset') score = 36;

      // Adjust score slightly if user answered questions
      const categoryAnswerKeys = Object.keys(answers).filter(key => {
        const id = parseInt(key);
        // Map question ID to category ranges
        if (cat === 'Einstieg' && id >= 1 && id <= 20) return true;
        if (cat === 'Schlaf' && id >= 21 && id <= 30) return true;
        if (cat === 'Kraft' && id >= 31 && id <= 40) return true;
        if (cat === 'Zellversorgung' && id >= 41 && id <= 50) return true;
        if (cat === 'Immunbalance' && id >= 51 && id <= 60) return true;
        if (cat === 'Soziale Bindungen' && id >= 61 && id <= 70) return true;
        if (cat === 'Mindset' && id >= 71 && id <= 80) return true;
        return false;
      });

      if (categoryAnswerKeys.length > 0) {
        let totalVal = 0;
        categoryAnswerKeys.forEach(k => {
          const val = answers[parseInt(k)];
          if (Array.isArray(val)) {
            // Multiselect: more selections = different rating, we give a medium score
            totalVal += val.length > 2 ? 80 : 50;
          } else {
            // Text values, rate by keywords
            const lower = val.toLowerCase();
            if (lower.includes('sehr gut') || lower.includes('täglich') || lower.includes('sehr hoch') || lower.includes('stark') || lower.includes('nie')) {
              totalVal += 90;
            } else if (lower.includes('gut') || lower.includes('oft') || lower.includes('hoch') || lower.includes('selten')) {
              totalVal += 75;
            } else if (lower.includes('mittel') || lower.includes('manchmal') || lower.includes('gelegentlich')) {
              totalVal += 55;
            } else if (lower.includes('schlecht') || lower.includes('kaum') || lower.includes('wenig')) {
              totalVal += 35;
            } else {
              totalVal += 15; // poor/critical
            }
          }
        });
        score = Math.round(totalVal / categoryAnswerKeys.length);
      }

      return {
        id: cat,
        name: defaults.name,
        score: score,
        color: defaults.color,
        icon: defaults.icon,
        details: defaults.details,
        optimalRange: defaults.optimalRange,
        savedYears: cat === 'Einstieg' ? 0 : parseFloat(((score / 100) * 0.5).toFixed(1))
      };
    });
  };

  const scores = calculateScores();
  const activeScoreDetails = scores.find(s => s.id === selectedRubric) || scores[1];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const totalSaved = parseFloat(scores.reduce((acc, s) => acc + s.savedYears, 0).toFixed(1));
      const calAge = 53;
      const bAge = parseFloat((calAge - totalSaved).toFixed(1));
      localStorage.setItem('ty_onboarding_calendar_age', calAge.toString());
      localStorage.setItem('ty_onboarding_bio_age', bAge.toString());
      localStorage.setItem('ty_onboarding_saved_years', totalSaved.toString());
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('ty-onboarding-age-sync'));
    }
  }, [answers]);

  // Calculate overall bio age based on sum of saved years
  const totalSavedYears = parseFloat(scores.reduce((acc, s) => acc + s.savedYears, 0).toFixed(1));
  const calendarAge = 53;
  const bioAge = parseFloat((calendarAge - totalSavedYears).toFixed(1));
  const sleepSavedYears = scores.find(s => s.id === 'Schlaf')?.savedYears || 0.4;

  // Gauge Calculations for Inner Age
  const gaugeMin = 30;
  const gaugeMax = 60;
  const percentBio = Math.max(0, Math.min(1, (bioAge - gaugeMin) / (gaugeMax - gaugeMin)));
  const percentCal = Math.max(0, Math.min(1, (calendarAge - gaugeMin) / (gaugeMax - gaugeMin)));
  
  const angleBio = Math.PI - (percentBio * Math.PI);
  const angleCal = Math.PI - (percentCal * Math.PI);
  
  const xBio = 100 + 80 * Math.cos(angleBio);
  const yBio = 100 - 80 * Math.sin(angleBio);
  
  const xCal = 100 + 80 * Math.cos(angleCal);
  const yCal = 100 - 80 * Math.sin(angleCal);
  
  const xNeedleBio = 100 + 65 * Math.cos(angleBio);
  const yNeedleBio = 100 - 65 * Math.sin(angleBio);

  const isYounger = bioAge <= calendarAge;
  const arcPath = isYounger
    ? `M ${xBio},${yBio} A 80,80 0 0,1 ${xCal},${yCal}`
    : `M ${xCal},${yCal} A 80,80 0 0,1 ${xBio},${yBio}`;
  const arcColor = isYounger ? '#7FD049' : '#ef4444'; // TrueYears green if younger, red if older

  // Age Speed Calculations (0.0 to 2.0 scale)
  const speedVal = 0.82;
  const speedPercent = Math.max(0, Math.min(1, speedVal / 2.0));
  const speedAngle = Math.PI - (speedPercent * Math.PI);
  const xSpeed = 100 + 80 * Math.cos(speedAngle);
  const ySpeed = 100 - 80 * Math.sin(speedAngle);
  const xNeedleSpeed = 100 + 65 * Math.cos(speedAngle);
  const yNeedleSpeed = 100 - 65 * Math.sin(speedAngle);

  // Visual Coordinates for SVG Radar chart (7 axes)
  // Center is (150, 150), radius is 100
  const radarAxes = scores.filter(s => s.id !== 'Einstieg'); // The 6 optimization fields
  const getRadarPoint = (index: number, score: number) => {
    const angle = (index * 2 * Math.PI) / 6 - Math.PI / 2; // 6 axes
    const r = (score / 100) * 100;
    const x = 150 + r * Math.cos(angle);
    const y = 150 + r * Math.sin(angle);
    return `${x},${y}`;
  };

  // Coordinates for the visual optimal line (85% score)
  const optimalPoints = radarAxes.map((_, idx) => getRadarPoint(idx, 85)).join(' ');
  // Coordinates for the actual scores
  const scorePoints = radarAxes.map((s, idx) => getRadarPoint(idx, s.score)).join(' ');

  return (
    <div className="onboarding-page theme-playful results-subpage">
      {/* TOP MENU BAR */}
      <div className="top-menu-bar">
        <div style={{ width: '40px' }}></div>
        <WelcomeSection 
          isOnboarding={true}
          onboardingCategory={selectedRubric}
          onNavigate={(id) => {
            if (id === 'website') window.location.href = '/';
            else window.location.href = `/dashboard?tab=${id}`;
          }}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="results-container">
        
        {/* HERO HEADER */}
        <div className="results-banner">
          <div className="banner-left">
            <span className="results-tag">Auswertung Onboarding</span>
            <h1 className="banner-title">Initiale Baseline</h1>
            <p className="banner-desc">Basierend auf deinem Onboarding haben wir dein initiales <span className="highlight-text">TRUE YEARS BIOAGE ©</span> berechnet und erste mögliche <span className="highlight-text">HEBEL</span> identifiziert. Besonders bei deiner Schlafqualität zeigt sich bereits ein starker präventiver Fortschritt (-{sleepSavedYears.toFixed(1).replace('.', ',')} biologische Jahre), während in den Bereichen Kraft und Resilienz deine größten Potenziale zur weiteren Verjüngung liegen.</p>
          </div>
          <div className="banner-right">
            <div className="age-circle-wrapper">
              <svg className="age-svg" viewBox="0 0 100 100">
                <circle className="age-circle-bg" cx="50" cy="50" r="42" />
                <circle 
                  className="age-circle-fill" 
                  cx="50" 
                  cy="50" 
                  r="42" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * (bioAge / 111))} 
                />
              </svg>
              <div className="age-text-center">
                <span className="age-val">{bioAge}</span>
                <span className="age-label">BioAge</span>
              </div>
            </div>
            <div className="age-legend">
              <div>Kalendarisch: <strong>{calendarAge.toFixed(1).replace('.', ',')} Jahre</strong></div>
              <div className="saved-green">Differenz: <strong>-{totalSavedYears.toFixed(1).replace('.', ',')} Jahre</strong></div>
            </div>
          </div>
        </div>

        {/* GAUGE LOGIC ROW */}
        <div className="gauges-row">
          {/* Card 1: Age Speed */}
          <div className="gauge-card" style={{ position: 'relative' }}>
            <div className="gauge-tooltip-container">
              <i className="bi bi-info-circle tooltip-trigger"></i>
              <div className="gauge-tooltip-text">
                Das Alterungstempo (Age Speed) gibt an, wie viele biologische Jahre du pro kalendarischem Jahr alterst. Ein Wert von 0,82 bedeutet beispielsweise, dass du in einem normalen Jahr biologisch nur um 0,82 Jahre alterst. Ein Wert unter 1,0 verlangsamt den Alterungsprozess.
              </div>
            </div>
            <div className="gauge-title-wrapper">
              <h3>Age Speed</h3>
              <span className="gauge-subtitle">Wie schnell alterst du?</span>
            </div>
            <div className="gauge-main-val">{speedVal.toFixed(2).replace('.', ',')}</div>
            <div className="gauge-visual-wrapper">
              <svg viewBox="0 0 200 120" className="gauge-svg-element">
                {/* Background arc */}
                <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                {/* Active colored arc (green) */}
                <path d={`M20,100 A80,80 0 0,1 ${xSpeed},${ySpeed}`} fill="none" stroke="#7FD049" strokeWidth="12" strokeLinecap="round" />
                {/* Needle */}
                <line x1="100" y1="100" x2={xNeedleSpeed} y2={yNeedleSpeed} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="100" cy="100" r="6" fill="#0f172a" />
                {/* Scale labels */}
                <text x="20" y="118" className="gauge-scale-label">0,0</text>
                <text x="180" y="118" className="gauge-scale-label" textAnchor="end">2,0</text>
              </svg>
            </div>
            <div className="gauge-bottom-info">
              <span className="gauge-bottom-val">0,95</span>
              <span className="gauge-bottom-label">Letzte 3 Monate</span>
            </div>
          </div>

          {/* Card 2: BioAge */}
          <div className="gauge-card" style={{ position: 'relative' }}>
            <div className="gauge-tooltip-container">
              <i className="bi bi-info-circle tooltip-trigger"></i>
              <div className="gauge-tooltip-text">
                Dein biologisches Alter (BioAge) zeigt den Zustand deiner Zellen und deiner allgemeinen Gesundheit im Vergleich zu deinem tatsächlichen (kalendarischen) Alter. Da dein biologisches Alter unter deinem kalendarischen Alter liegt, alterst du gesünder und langsamer.
              </div>
            </div>
            <div className="gauge-title-wrapper">
              <h3>BioAge</h3>
              <span className="gauge-subtitle">Dein Biologisches Alter</span>
            </div>
            <div className="gauge-main-val">{bioAge.toFixed(1).replace('.', ',')}</div>
            <div className="gauge-visual-wrapper">
              <svg viewBox="0 0 200 120" className="gauge-svg-element">
                {/* Background arc */}
                <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                {/* Active colored arc (green/red) */}
                {bioAge !== calendarAge && (
                  <path d={arcPath} fill="none" stroke={arcColor} strokeWidth="12" />
                )}
                {/* Vertical thin line representing calendar age */}
                <line x1="100" y1="100" x2={xCal} y2={yCal} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Needle */}
                <line x1="100" y1="100" x2={xNeedleBio} y2={yNeedleBio} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="100" cy="100" r="6" fill="#0f172a" />
                {/* Scale labels */}
                <text x="20" y="118" className="gauge-scale-label">30</text>
                <text x="180" y="118" className="gauge-scale-label" textAnchor="end">60</text>
              </svg>
            </div>
            <div className="gauge-bottom-info">
              <span className="gauge-bottom-val">{calendarAge.toFixed(1).replace('.', ',')}</span>
              <span className="gauge-bottom-label">Dein kalendarisches Alter</span>
            </div>
          </div>
        </div>

        {/* DIAGRAMS ROW */}
        <div className="diagrams-row">
          
          {/* RADAR CHART CARD */}
          <div className="diagram-card radar-card">
            <h3>Initiale Einschätzung</h3>
            <p className="diagram-subtitle">Dein Profil (grüne Linie) im Vergleich zum optimalen Bereich (gestrichelte Linie).</p>
            
            <div className="radar-wrapper">
              <svg className="radar-svg" viewBox="0 0 300 300">
                {/* Background circles */}
                <circle cx="150" cy="150" r="100" className="radar-grid" />
                <circle cx="150" cy="150" r="75" className="radar-grid" />
                <circle cx="150" cy="150" r="50" className="radar-grid" />
                <circle cx="150" cy="150" r="25" className="radar-grid" />
                
                {/* Axis lines */}
                {radarAxes.map((s, idx) => {
                  const angle = (idx * 2 * Math.PI) / 6 - Math.PI / 2;
                  const x = 150 + 100 * Math.cos(angle);
                  const y = 150 + 100 * Math.sin(angle);
                  const textX = 150 + 120 * Math.cos(angle);
                  const textY = 150 + 120 * Math.sin(angle);
                  
                  return (
                    <g key={s.id}>
                      <line x1="150" y1="150" x2={x} y2={y} className="radar-axis" />
                      <text 
                        x={textX} 
                        y={textY} 
                        textAnchor="middle" 
                        alignmentBaseline="middle" 
                        className="radar-axis-label"
                      >
                        {`${idx + 1}. ${s.name.split(' ')[0]}`}
                      </text>
                    </g>
                  );
                })}

                {/* Optimal Shape */}
                <polygon points={optimalPoints} className="radar-shape-optimal" />
                
                {/* Actual Shape */}
                <polygon points={scorePoints} className="radar-shape-actual" />

                {/* Points */}
                {radarAxes.map((s, idx) => {
                  const pt = getRadarPoint(idx, s.score).split(',');
                  return (
                    <circle 
                      key={s.id}
                      cx={pt[0]} 
                      cy={pt[1]} 
                      r="4" 
                      className="radar-shape-dot" 
                      style={{ fill: s.color }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* SUMMARY SCORE CARD */}
          <div className="diagram-card scores-list-card">
            <h3>Übersicht aller 6 Optimierungsbereiche</h3>
            <p className="diagram-subtitle">Wähle eine Rubrik aus, um tiefergehende physiologische Auswertungen zu erhalten.</p>
            
            <div className="rubrics-interactive-list">
              {scores.filter(s => s.id !== 'Einstieg').map(s => {
                const isActive = selectedRubric === s.id;
                return (
                  <button 
                    key={s.id} 
                    className={`rubric-score-row ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedRubric(s.id)}
                  >
                    <span className="rubric-icon" style={{ backgroundColor: 'transparent', border: '1.5px solid #006EA7', color: '#006EA7' }}>
                      <i className={`bi ${s.icon}`}></i>
                    </span>
                    <span className="rubric-name">{s.name}</span>
                    <div className="rubric-progress-track">
                      <div className="rubric-progress-fill" style={{ width: `${s.score}%`, backgroundColor: s.color }}></div>
                    </div>
                    <span className="rubric-value">{s.score}%</span>
                    <span className="rubric-years">
                      {s.savedYears === 0 ? '0,0 J.' : `-${s.savedYears.toFixed(1).replace('.', ',')} J.`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* DETAILED RUBRIC BREAKDOWN */}
        <div className="detail-breakdown-card">
          <div className="detail-header" style={{ borderBottomColor: activeScoreDetails.color }}>
            <span className="rubric-badge" style={{ backgroundColor: activeScoreDetails.color + '20', color: getDarkColor(activeScoreDetails.color) }}>
              <i className={`bi ${activeScoreDetails.icon} badge-icon`}></i> {activeScoreDetails.name}
            </span>
            <div className="detail-header-right">
              <div>Optimalbereich: <strong>{activeScoreDetails.optimalRange}</strong></div>
              <div>Dein Beitrag: <strong className="green-accent">-{activeScoreDetails.savedYears.toFixed(1).replace('.', ',')} Jahre</strong></div>
            </div>
          </div>

          <div className="detail-body">
            <div className="detail-text-col">
              <h4>Physiologische Relevanz & Auswertung</h4>
              <p className="detail-desc">{activeScoreDetails.details} Deine Antworten zeigen ein Optimierungspotenzial von <strong>{100 - activeScoreDetails.score}%</strong> in diesem Bereich.</p>
              
              <div className="answers-impact-box">
                <h5>Deine aktuell wichtigsten Lebensstil-Hebel:</h5>
                <div className="impact-items">
                  {selectedRubric === 'Schlaf' && (
                    <>
                      <div className="impact-item positive">
                        <i className="bi bi-patch-check-fill"></i>
                        <div>
                          <strong>Gute Regelmäßigkeit:</strong> Deine Aufstehzeiten variieren kaum. Das stabilisiert deinen zirkadianen Rhythmus und fördert die Ausschüttung von Wachstumshormonen im Tiefschlaf.
                        </div>
                      </div>
                      <div className="impact-item warning">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <div>
                          <strong>Späte Mahlzeiten:</strong> Essen weniger als 3 Stunden vor dem Schlaf erhöht deine Kerntemperatur und hemmt die nächtliche Fettverbrennung.
                        </div>
                      </div>
                    </>
                  )}
                  {selectedRubric === 'Kraft' && (
                    <>
                      <div className="impact-item warning">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <div>
                          <strong>Sitzender Lebensstil:</strong> Mehr als 60 Stunden Sitzen wöchentlich korreliert mit verringerter Insulinsensitivität. Wir empfehlen kurze Aktivitätsunterbrechungen.
                        </div>
                      </div>
                      <div className="impact-item positive">
                        <i className="bi bi-patch-check-fill"></i>
                        <div>
                          <strong>Regelmäßiges Dehnen:</strong> Behält deine Faszienelastizität bei und verringert das Verletzungsrisiko.
                        </div>
                      </div>
                    </>
                  )}
                  {selectedRubric !== 'Schlaf' && selectedRubric !== 'Kraft' && (
                    <>
                      <div className="impact-item positive">
                        <i className="bi bi-patch-check-fill"></i>
                        <div>
                          <strong>Bewusstes Verhalten erkannt:</strong> Du hast gute Ansätze zur präventiven Alltagsgestaltung gezeigt.
                        </div>
                      </div>
                      <div className="impact-item warning">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <div>
                          <strong>Struktur-Optimierung möglich:</strong> Feste Zeiten für diese Routinen würden deinen Stresslevel dauerhaft senken.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="detail-coach-col">
              <div className="lisa-coach-card">
                <div className="lisa-avatar-row">
                  <div className="lisa-img-container">
                    <img src="/images/lisa.png" alt="Lisa Coach" onError={(e) => { e.currentTarget.src = "/images/woman_53_blonde.png" }} />
                  </div>
                  <div className="lisa-title-block">
                    <h4>Empfehlungen von Lisa AI</h4>
                    <span>Deine Personal Trainerin</span>
                  </div>
                </div>
                <div className="lisa-quote">
                  {selectedRubric === 'Schlaf' && (
                    <p>„Dein Schlaf-Score von 85% ist fantastisch! Um die restlichen 15% zu aktivieren, empfehle ich dir, abends auf Koffein nach 14 Uhr komplett zu verzichten und dein Abendessen 1 Stunde früher einzunehmen. Das entlastet die Leber und senkt die Herzfrequenz am Anfang der Nacht.“</p>
                  )}
                  {selectedRubric === 'Kraft' && (
                    <p>„Hier liegt dein größter Hebel! Um dem altersbedingten Muskelverlust (Sarkopenie) entgegenzuwirken, solltest du 2x pro Woche kurze 15-minütige Kniebeugen- und Liegestütz-Einheiten in deinen Alltag einbauen. Ich unterstütze dich dabei!“</p>
                  )}
                  {selectedRubric !== 'Schlaf' && selectedRubric !== 'Kraft' && (
                    <p>„In dieser Rubrik können wir mit kleinen Gewohnheiten Großes bewirken. Lass uns im Dashboard die passende DIY-Routine dafür aktivieren, um deinen biologischen Alterungsprozess weiter zu verlangsamen.“</p>
                  )}
                </div>
                <Link href="/dashboard?tab=quick-wins" className="coach-cta-btn">
                  Hebel im Dashboard aktivieren
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="results-footer-actions">
          <Link href="/dashboard" className="footer-action-btn primary">
            Direkt zum Dashboard
          </Link>
        </div>

      </div>

      <style jsx global>{`
        .results-subpage {
          background-color: #f8fafc !important;
          color: #1e293b !important;
          padding-top: 130px !important;
          padding-bottom: 1rem !important;
        }
        .highlight-text {
          font-weight: 800;
          color: #7FD049;
        }

        .results-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0 1.5rem;
        }

        /* BANNER */
        .results-banner {
          background: linear-gradient(135deg, #006EA7 0%, #004d77 100%);
          border-radius: 24px;
          padding: 2rem;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 110, 167, 0.15);
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .results-banner {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
          }
        }
        .banner-left {
          flex: 1;
        }
        .results-tag {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 0.35rem 0.85rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 1rem;
        }
        .banner-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }
        .banner-desc {
          font-size: 1.05rem;
          opacity: 0.9;
          line-height: 1.5;
        }
        .banner-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          min-width: 200px;
        }
        .age-circle-wrapper {
          position: relative;
          width: 130px;
          height: 130px;
        }
        .age-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        .age-circle-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.15);
          stroke-width: 8;
        }
        .age-circle-fill {
          fill: none;
          stroke: #7FD049;
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s ease-out;
        }
        .age-text-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          line-height: 1.1;
        }
        .age-val {
          font-size: 2.2rem;
          font-weight: 800;
          color: #ffffff;
        }
        .age-label {
          font-size: 0.75rem;
          opacity: 0.8;
          text-transform: uppercase;
          font-weight: 600;
        }
        .age-legend {
          font-size: calc(0.9rem + 2pt);
          text-align: center;
          line-height: 1.4;
        }
        .saved-green {
          color: #7FD049;
          font-weight: 700;
        }

        /* DIAGRAMS ROW */
        .diagrams-row {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
        }
        @media (max-width: 900px) {
          .diagrams-row {
            grid-template-columns: 1fr;
          }
        }
        .diagram-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .diagram-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: #0f172a;
        }
        .diagram-subtitle {
          font-size: calc(0.88rem + 2pt);
          color: #64748b;
          margin-bottom: 1.5rem;
        }

        /* RADAR CHART */
        .radar-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 385px;
        }
        .radar-svg {
          width: 100%;
          max-width: 385px;
          height: 100%;
        }
        .radar-grid {
          fill: none;
          stroke: #e2e8f0;
          stroke-width: 1;
        }
        .radar-axis {
          stroke: #e2e8f0;
          stroke-width: 1.5;
        }
        .radar-axis-label {
          font-size: 12px;
          font-weight: 700;
          fill: #64748b;
        }
        .radar-shape-optimal {
          fill: rgba(0, 110, 167, 0.03);
          stroke: #94a3b8;
          stroke-width: 1.5;
          stroke-dasharray: 4,4;
        }
        .radar-shape-actual {
          fill: rgba(127, 208, 73, 0.22);
          stroke: #7FD049;
          stroke-width: 2.5;
          stroke-linejoin: round;
        }
        .radar-shape-dot {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        /* RUBRICS INTERACTIVE LIST */
        .rubrics-interactive-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .rubric-score-row {
          display: flex;
          align-items: center;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
        }
        .rubric-score-row:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .rubric-score-row.active {
          border-color: #006EA7;
          background: #f0f7ff;
          box-shadow: 0 4px 12px rgba(0, 110, 167, 0.05);
        }
        .rubric-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          margin-right: 0.75rem;
          flex-shrink: 0;
        }
        .rubric-name {
          font-weight: 700;
          font-size: 0.92rem;
          color: #334155;
          width: 140px;
        }
        .rubric-progress-track {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          margin: 0 1rem;
          overflow: hidden;
        }
        .rubric-progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        .rubric-value {
          font-weight: 700;
          font-size: 0.9rem;
          color: #0f172a;
          width: 45px;
          text-align: right;
        }
        .rubric-years {
          font-size: 0.85rem;
          font-weight: 800;
          color: #10b981;
          margin-left: 0.75rem;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.15rem 0.4rem;
          border-radius: 6px;
          white-space: nowrap;
        }

        /* DETAIL BREAKDOWN CARD */
        .detail-breakdown-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 3px solid;
          background: #fafcfd;
        }
        @media (max-width: 600px) {
          .detail-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
        .rubric-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 800;
          padding: 0.4rem 1rem;
          border-radius: 50px;
        }
        .badge-icon {
          font-size: 1.15rem;
        }
        .detail-header-right {
          display: flex;
          gap: 1.5rem;
          font-size: 0.92rem;
          color: #64748b;
        }
        .green-accent {
          color: #10b981;
          font-weight: 800;
        }
        
        .detail-body {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          padding: 2rem;
          gap: 2.5rem;
        }
        @media (max-width: 850px) {
          .detail-body {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        .detail-text-col h4 {
          font-size: calc(1.1rem + 2pt);
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .detail-desc {
          font-size: calc(0.98rem + 2pt);
          line-height: 1.5;
          color: #475569;
          margin-bottom: 1.5rem;
        }
        .answers-impact-box h5 {
          font-size: calc(0.92rem + 2pt);
          font-weight: 700;
          color: #475569;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .impact-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .impact-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          font-size: calc(0.9rem + 2pt);
          line-height: 1.4;
        }
        .impact-item.positive {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          color: #166534;
        }
        .impact-item.positive i {
          color: #22c55e;
          font-size: 1.1rem;
        }
        .impact-item.warning {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          color: #92400e;
        }
        .impact-item.warning i {
          color: #f59e0b;
          font-size: 1.1rem;
        }

        /* GAUGE LOGIC METER */
        .gauges-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .gauges-row {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }
        .gauge-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .gauge-title-wrapper {
          margin-bottom: 0.75rem;
        }
        .gauge-title-wrapper h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px 0;
        }
        .gauge-subtitle {
          font-size: 0.88rem;
          color: #64748b;
        }
        .gauge-main-val {
          font-size: 2.2rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .gauge-visual-wrapper {
          width: 100%;
          max-width: 240px;
          height: auto;
        }
        .gauge-svg-element {
          width: 100%;
          height: auto;
        }
        .gauge-scale-label {
          font-size: 10px;
          font-weight: 700;
          fill: #64748b;
        }
        .gauge-bottom-info {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.3;
        }
        .gauge-bottom-val {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
        }
        .gauge-bottom-label {
          font-size: 0.85rem;
          color: #64748b;
        }

        /* GAUGE TOOLTIP */
        .gauge-tooltip-container {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
        }
        .tooltip-trigger {
          font-size: 1.15rem;
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.2s;
        }
        .tooltip-trigger:hover {
          color: #006ea7;
        }
        .gauge-tooltip-text {
          visibility: hidden;
          width: 240px;
          background-color: #1e293b;
          color: #fff;
          text-align: left;
          border-radius: 8px;
          padding: 10px 12px;
          position: absolute;
          z-index: 20;
          top: 125%;
          right: 0;
          opacity: 0;
          transition: opacity 0.2s, visibility 0.2s;
          font-size: 0.82rem;
          font-weight: 500;
          line-height: 1.4;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .gauge-tooltip-text::after {
          content: "";
          position: absolute;
          bottom: 100%;
          right: 10px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent #1e293b transparent;
        }
        .gauge-tooltip-container:hover .gauge-tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        /* LISA COACH CARD */
        .lisa-coach-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .lisa-avatar-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .lisa-img-container {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #7FD049;
          flex-shrink: 0;
        }
        .lisa-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .lisa-title-block h4 {
          font-size: calc(0.95rem + 2pt);
          font-weight: 800;
          margin: 0;
          color: #0f172a;
        }
        .lisa-title-block span {
          font-size: calc(0.75rem + 2pt);
          color: #64748b;
        }
        .lisa-quote {
          font-size: calc(0.92rem + 2pt);
          line-height: 1.5;
          color: #334155;
          font-style: italic;
          background: #ffffff;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .coach-cta-btn {
          background: #006EA7;
          color: #ffffff !important;
          font-weight: 700;
          font-size: calc(0.95rem + 2pt);
          padding: 0.75rem;
          border-radius: 10px;
          text-align: center;
          text-decoration: none;
          transition: background 0.2s;
        }
        .coach-cta-btn:hover {
          background: #005682;
          text-decoration: none;
        }

        /* FOOTER ACTIONS */
        .results-footer-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        @media (max-width: 500px) {
          .results-footer-actions {
            flex-direction: column;
          }
        }
        .footer-action-btn {
          padding: 0.85rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }
        .footer-action-btn.primary {
          background: #7FD049;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(127, 208, 73, 0.3);
        }
        .footer-action-btn.primary:hover {
          background: #6ab73c;
          transform: translateY(-1px);
        }
        .footer-action-btn.secondary {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          color: #64748b !important;
        }
        .footer-action-btn.secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        @media (max-width: 768px) {
          .results-subpage {
            padding: 90px 0.5rem 1.5rem !important;
          }
          .results-container {
            padding: 0 !important;
            gap: 1rem !important;
          }
          .results-banner {
            flex-direction: column !important;
            padding: 1.5rem 1rem !important;
            border-radius: 16px !important;
            text-align: center !important;
            gap: 1.5rem !important;
          }
          .banner-title {
            font-size: 1.5rem !important;
          }
          .banner-desc {
            font-size: 0.92rem !important;
          }
          .diagrams-row {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .diagram-card {
            padding: 1.25rem 1rem !important;
            border-radius: 16px !important;
          }
          .radar-wrapper {
            height: 280px !important;
          }
          .radar-svg {
            max-width: 280px !important;
          }
          .detail-body {
            padding: 1.25rem 1rem !important;
            gap: 1.25rem !important;
          }
          .detail-desc {
            font-size: 0.9rem !important;
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
