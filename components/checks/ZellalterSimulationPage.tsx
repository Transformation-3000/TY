'use client';

import React, { useState, useEffect } from 'react';

interface ZellalterSimulationPageProps {
  onBack: () => void;
}

export default function ZellalterSimulationPage({ onBack }: ZellalterSimulationPageProps) {
  // Inputs
  const [chronologicalAge] = useState(46.7);
  const [sleepScore, setSleepScore] = useState(3);
  const [exerciseScore, setExerciseScore] = useState(3);
  const [nutritionScore, setNutritionScore] = useState(3);
  const [stressScore, setStressScore] = useState(3);
  const [toxinsScore, setToxinsScore] = useState(3);

  // Outputs
  const [biologicalAge, setBiologicalAge] = useState(42.5);
  const [ageDifference, setAgeDifference] = useState(-4.2);
  const [agingRate, setAgingRate] = useState(0.84);

  useEffect(() => {
    // 1. Sleep delta
    // 1: +2.5, 2: +0.8, 3: -1.8, 4: -1.4, 5: +0.5
    let sleepDelta = 0;
    if (sleepScore === 1) sleepDelta = 2.5;
    else if (sleepScore === 2) sleepDelta = 0.8;
    else if (sleepScore === 3) sleepDelta = -1.8;
    else if (sleepScore === 4) sleepDelta = -1.4;
    else if (sleepScore === 5) sleepDelta = 0.5;

    // 2. Exercise delta
    // 1: +2.0, 3: -0.5, 5: -2.5
    let exerciseDelta = 0;
    if (exerciseScore === 1) exerciseDelta = 2.0;
    else if (exerciseScore === 2) exerciseDelta = 0.8;
    else if (exerciseScore === 3) exerciseDelta = -0.5;
    else if (exerciseScore === 4) exerciseDelta = -1.8;
    else if (exerciseScore === 5) exerciseDelta = -2.5;

    // 3. Nutrition delta
    // 1: +2.5, 3: -0.5, 5: -3.2
    let nutritionDelta = 0;
    if (nutritionScore === 1) nutritionDelta = 2.5;
    else if (nutritionScore === 2) nutritionDelta = 1.2;
    else if (nutritionScore === 3) nutritionDelta = -0.5;
    else if (nutritionScore === 4) nutritionDelta = -1.8;
    else if (nutritionScore === 5) nutritionDelta = -3.2;

    // 4. Stress delta
    // 1: +2.0, 3: -0.4, 5: -2.5
    let stressDelta = 0;
    if (stressScore === 1) stressDelta = 2.0;
    else if (stressScore === 2) stressDelta = 0.8;
    else if (stressScore === 3) stressDelta = -0.4;
    else if (stressScore === 4) stressDelta = -1.6;
    else if (stressScore === 5) stressDelta = -2.5;

    // 5. Genussmittel & Schadstoffe delta
    // 1: +2.5, 2: +1.0, 3: -0.5, 4: -1.8, 5: -2.8
    let toxinsDelta = 0;
    if (toxinsScore === 1) toxinsDelta = 2.5;
    else if (toxinsScore === 2) toxinsDelta = 1.0;
    else if (toxinsScore === 3) toxinsDelta = -0.5;
    else if (toxinsScore === 4) toxinsDelta = -1.8;
    else if (toxinsScore === 5) toxinsDelta = -2.8;

    const totalDelta = sleepDelta + exerciseDelta + nutritionDelta + stressDelta + toxinsDelta;
    // Offset totalDelta so it is exactly 0 at default slider scores:
    // sleepScore = 3 (delta = -1.8)
    // exerciseScore = 3 (delta = -0.5)
    // nutritionScore = 3 (delta = -0.5)
    // stressScore = 3 (delta = -0.4)
    // toxinsScore = 3 (delta = -0.5)
    // Sum of defaults = -1.8 - 0.5 - 0.5 - 0.4 - 0.5 = -3.7
    const baseOffset = -3.7;
    const currentDeltaFromBaseline = totalDelta - baseOffset;
    
    const computedBioAge = Math.max(18, 42.5 + currentDeltaFromBaseline);
    const computedDifference = computedBioAge - 46.7;
    
    setBiologicalAge(parseFloat(computedBioAge.toFixed(1)));
    setAgeDifference(parseFloat(computedDifference.toFixed(1)));
    
    // Aging rate: normally 0.75x to 1.3x, multiplier of 1.72 matches 15.5% slow down at -4.2 difference
    const rate = 1.0 + (computedDifference / 46.7) * 1.72;
    setAgingRate(parseFloat(Math.max(0.65, Math.min(1.45, rate)).toFixed(2)));
  }, [sleepScore, exerciseScore, nutritionScore, stressScore, toxinsScore]);

  // Color mapping based on results
  const isGood = ageDifference < 0;
  const strokeColor = isGood ? '#22c55e' : '#ef4444';
  const textGlow = isGood ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';

  const isNeutral = ageDifference >= -0.5 && ageDifference <= 0.5;
  const isGoodStatus = ageDifference < -0.5;

  // Calculate dynamic fill percentage and strokeDashoffset matching Entwicklung > BioAge style:
  // 100% fill corresponds to 111 years (P = biologicalAge / 111)
  const P = Math.max(0.05, Math.min(0.95, biologicalAge / 111));
  const strokeDashoffset = 257.6 * (1 - P);

  // 1. Zelluläre Resilienz Score & Text
  const zellResilience = (() => {
    let sleepVal = 0;
    if (sleepScore === 1) sleepVal = 20;
    else if (sleepScore === 2) sleepVal = 60;
    else if (sleepScore === 3) sleepVal = 100;
    else if (sleepScore === 4) sleepVal = 90;
    else if (sleepScore === 5) sleepVal = 50;

    const exerciseVal = (exerciseScore / 5) * 100;
    const nutritionVal = (nutritionScore / 5) * 100;
    const stressVal = (stressScore / 5) * 100;
    const toxinsVal = (toxinsScore / 5) * 100;

    const score = Math.round((sleepVal + exerciseVal + nutritionVal + stressVal + toxinsVal) / 5);
    
    let label = 'Moderater Schutz';
    let sub = 'Solide Abwehrkraft, aber noch Steigerungspotenzial.';
    if (score >= 85) {
      label = 'Optimaler Schutz';
      sub = 'Hervorragende zelluläre Widerstandskraft gegen Entzündungen.';
    } else if (score < 60) {
      label = 'Erhöhte Anfälligkeit';
      sub = 'Zellen sind anfälliger für oxidativen Stress und Alterung.';
    }
    return { score, label, sub };
  })();

  // 2. Deine stärksten Hebel
  const renderLeverIcon = (type: string) => {
    switch (type) {
      case 'sleep':
        return <i className="bi bi-moon-stars-fill"></i>;
      case 'exercise':
        return <i className="bi bi-lightning-charge-fill"></i>;
      case 'nutrition':
        return <i className="bi bi-apple"></i>;
      case 'stress':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          </svg>
        );
      case 'toxins':
        return <i className="bi bi-shield-x"></i>;
      default:
        return <i className="bi bi-award-fill"></i>;
    }
  };

  const strongestLevers = (() => {
    const list = [];
    if (sleepScore <= 2) {
      list.push({ text: 'Schlaf verbessern (Ziel: 7-8 Std.)', priority: 'Kritisch', color: '#ef4444', bgColor: '#fee2e2', type: 'sleep' });
    }
    if (exerciseScore <= 2) {
      list.push({ text: 'Mehr Sport (Kraft & Cardio) einbauen', priority: 'Hoch', color: '#d97706', bgColor: '#fef3c7', type: 'exercise' });
    }
    if (nutritionScore <= 2) {
      list.push({ text: 'Zucker reduzieren & frisch kochen', priority: 'Hoch', color: '#d97706', bgColor: '#fef3c7', type: 'nutrition' });
    }
    if (stressScore <= 2) {
      list.push({ text: 'Aktive Stressbewältigung (Atemübungen)', priority: 'Kritisch', color: '#ef4444', bgColor: '#fee2e2', type: 'stress' });
    }
    if (toxinsScore <= 2) {
      list.push({ text: 'Rauchen aufgeben & Alkohol reduzieren', priority: 'Kritisch', color: '#ef4444', bgColor: '#fee2e2', type: 'toxins' });
    }

    // Fallbacks if scores are good
    if (list.length === 0) {
      if (sleepScore === 3 || sleepScore === 4) {
        list.push({ text: 'Optimierung der Tiefschlaf-Qualität', priority: 'Tipp', color: '#059669', bgColor: '#d1fae5', type: 'sleep' });
      }
      if (exerciseScore === 3 || exerciseScore === 4) {
        list.push({ text: 'Intensiviertes Kraft- & HIIT-Training', priority: 'Tipp', color: '#059669', bgColor: '#d1fae5', type: 'exercise' });
      }
      if (nutritionScore === 3 || nutritionScore === 4) {
        list.push({ text: 'Aktivierung der Autophagie (Esspausen)', priority: 'Tipp', color: '#059669', bgColor: '#d1fae5', type: 'nutrition' });
      }
      if (stressScore === 3 || stressScore === 4) {
        list.push({ text: 'Tägliche Meditationspraxis ausbauen', priority: 'Tipp', color: '#059669', bgColor: '#d1fae5', type: 'stress' });
      }
      if (toxinsScore === 3 || toxinsScore === 4) {
        list.push({ text: 'Vollständiger Verzicht auf Schadstoffe', priority: 'Tipp', color: '#059669', bgColor: '#d1fae5', type: 'toxins' });
      }
    }

    if (list.length === 0) {
      list.push({ text: 'Vitalität auf diesem Spitzen-Level halten', priority: 'Top', color: '#059669', bgColor: '#d1fae5', type: 'general' });
    }

    return list.slice(0, 3);
  })();

  return (
    <div className="sim-container">
      <div className="sim-header">
        <div className="sim-header-title-row">
          <h1 className="sim-title">Zellalter-Simulation</h1>
          <button className="sim-back-btn" onClick={onBack}>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9L1 5L5 1" />
            </svg>
            Zurück
          </button>
        </div>
        <p className="sim-subtitle">
          Simuliere, wie sich dein alltäglicher Lebensstil direkt auf deine zelluläre Vitalität und dein biologisches Alter auswirkt.
        </p>
      </div>

      <div className="sim-grid">
        {/* Left Column: Sliders */}
        <div className="sim-card inputs-card">
          <h2>Dein exemplarischer Lebensstil</h2>



          <div className="slider-group">
            <div className="slider-header">
              <div className="slider-title-wrapper">
                <div className="slider-icon-box">
                  <i className="bi bi-moon-stars-fill"></i>
                </div>
                <span className="slider-label">Schlafdauer</span>
              </div>
              <span className="slider-value">
                {sleepScore === 1 && '< 6 Std. / Nacht'}
                {sleepScore === 2 && '6-7 Std. / Nacht'}
                {sleepScore === 3 && '7-8 Std. / Nacht'}
                {sleepScore === 4 && '8-9 Std. / Nacht'}
                {sleepScore === 5 && '> 9 Std. / Nacht'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={sleepScore} 
              onChange={(e) => setSleepScore(parseInt(e.target.value))}
              className="sim-slider-input sleep-slider"
            />
            <span className="slider-desc">
              {sleepScore === 1 && <>❌ <strong>Stufe 1:</strong> Chronischer Schlafmangel (&lt; 6 Std.)</>}
              {sleepScore === 2 && <>⚠️ <strong>Stufe 2:</strong> Suboptimaler Schlaf (6-7 Std.)</>}
              {sleepScore === 3 && <>🍃 <strong>Stufe 3:</strong> Erholsamer Schlaf (7-8 Std.)</>}
              {sleepScore === 4 && <>✨ <strong>Stufe 4:</strong> Optimaler Schlaf (8-9 Std.)</>}
              {sleepScore === 5 && <>🌟 <strong>Stufe 5:</strong> Sehr langer Schlaf (&gt; 9 Std.)</>}
            </span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <div className="slider-title-wrapper">
                <div className="slider-icon-box">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <span className="slider-label">Aktivität & Sport</span>
              </div>
              <span className="slider-value">
                {exerciseScore === 1 && '0 Std. / Woche'}
                {exerciseScore === 2 && '1-2 Std. / Woche'}
                {exerciseScore === 3 && '2-3 Std. / Woche'}
                {exerciseScore === 4 && '3-4 Std. / Woche'}
                {exerciseScore === 5 && '5+ Std. / Woche'}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={exerciseScore} 
              onChange={(e) => setExerciseScore(parseInt(e.target.value))}
              className="sim-slider-input exercise-slider"
            />
            <span className="slider-desc">
              {exerciseScore === 1 && <>❌ <strong>Stufe 1:</strong> Sitzender Alltag ohne Sport</>}
              {exerciseScore === 2 && <>⚠️ <strong>Stufe 2:</strong> Wenig Bewegung, nur Spaziergänge</>}
              {exerciseScore === 3 && <>🍃 <strong>Stufe 3:</strong> Moderater Sport (1-2 Std./Woche)</>}
              {exerciseScore === 4 && <>✨ <strong>Stufe 4:</strong> Regelmäßiges Training (3-4 Std./Woche)</>}
              {exerciseScore === 5 && <>🌟 <strong>Stufe 5:</strong> Sehr aktiv (mehr als 5 Std./Woche)</>}
            </span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <div className="slider-title-wrapper">
                <div className="slider-icon-box">
                  <i className="bi bi-apple"></i>
                </div>
                <span className="slider-label">Zelluläre Ernährung</span>
              </div>
              <span className="slider-value">Stufe {nutritionScore} / 5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={nutritionScore} 
              onChange={(e) => setNutritionScore(parseInt(e.target.value))}
              className="sim-slider-input nutrition-slider"
            />
            <span className="slider-desc">
              {nutritionScore === 1 && <>❌ <strong>Stufe 1:</strong> Viel Zucker & Fertiggerichte</>}
              {nutritionScore === 2 && <>⚠️ <strong>Stufe 2:</strong> Mischkost mit wenig Gemüse</>}
              {nutritionScore === 3 && <>🍃 <strong>Stufe 3:</strong> Ausgewogen, ausreichend Proteine</>}
              {nutritionScore === 4 && <>✨ <strong>Stufe 4:</strong> Zuckerarm, nährstoffreiche Bio-Kost</>}
              {nutritionScore === 5 && <>🌟 <strong>Stufe 5:</strong> Longevity-Food & Polyphenole</>}
            </span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <div className="slider-title-wrapper">
                <div className="slider-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                  </svg>
                </div>
                <span className="slider-label">Stress & Regeneration</span>
              </div>
              <span className="slider-value">Stufe {stressScore} / 5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={stressScore} 
              onChange={(e) => setStressScore(parseInt(e.target.value))}
              className="sim-slider-input stress-slider"
            />
            <span className="slider-desc">
              {stressScore === 1 && <>❌ <strong>Stufe 1:</strong> Dauerhafter Stress ohne Ausgleich</>}
              {stressScore === 2 && <>⚠️ <strong>Stufe 2:</strong> Häufiger Stress, wenig Erholung</>}
              {stressScore === 3 && <>🍃 <strong>Stufe 3:</strong> Ausgewogen mit Feierabend-Ruhe</>}
              {stressScore === 4 && <>✨ <strong>Stufe 4:</strong> Aktive Entspannung & Atemübungen</>}
              {stressScore === 5 && <>🌟 <strong>Stufe 5:</strong> Hohe Resilienz & tägliche Meditation</>}
            </span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <div className="slider-title-wrapper">
                <div className="slider-icon-box">
                  <i className="bi bi-shield-x"></i>
                </div>
                <span className="slider-label">Schadstoffe & Genussmittel</span>
              </div>
              <span className="slider-value">Stufe {toxinsScore} / 5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={toxinsScore} 
              onChange={(e) => setToxinsScore(parseInt(e.target.value))}
              className="sim-slider-input toxins-slider"
            />
            <span className="slider-desc">
              {toxinsScore === 1 && <>❌ <strong>Stufe 1:</strong> Täglich Tabak & regelmäßiger Alkohol</>}
              {toxinsScore === 2 && <>⚠️ <strong>Stufe 2:</strong> Gelegentlich Tabak, regelmäßiger Alkohol</>}
              {toxinsScore === 3 && <>🍃 <strong>Stufe 3:</strong> Rauchfrei, Alkohol nur in Maßen</>}
              {toxinsScore === 4 && <>✨ <strong>Stufe 4:</strong> Rauchfrei, minimaler Alkohol & Detox</>}
              {toxinsScore === 5 && <>🌟 <strong>Stufe 5:</strong> Komplett abstinent & schadstofffreie Umwelt</>}
            </span>
          </div>
        </div>

        {/* Right Column: Visual Result */}
        <div className="sim-right-col">
          <div className="sim-card result-card">
            <h2>Dein biologisches Alter</h2>
            
            <div className="bac-circle-container" style={{ margin: '1rem 0' }}>
              <svg className="bac-circle-svg" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="ageScoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4498ca" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                  <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.15" />
                  </filter>
                </defs>
                {/* Background Track */}
                <circle cx="50" cy="50" r="41" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                {/* Active Arc with Rounded Caps */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="41" 
                  fill="none" 
                  stroke="url(#ageScoreGrad)" 
                  strokeWidth="6.5" 
                  strokeDasharray="257.6" 
                  strokeDashoffset={strokeDashoffset} 
                  strokeLinecap="round" 
                  filter="url(#softGlow)"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
                />
              </svg>
              <div className="bac-circle-text-box">
                <span className="bac-circle-val">{biologicalAge.toFixed(1).replace('.', ',')}</span>
                <span className="bac-circle-lab">Jahre</span>
              </div>
            </div>

            <div className="result-stats">
              <div className={`rstat-card ${isNeutral ? 'neutral' : isGoodStatus ? 'good' : 'bad'}`}>
                <span className="rstat-label">Biologischer Status</span>
                <span className="rstat-val">
                  {isNeutral 
                    ? `⚖️ ${ageDifference >= 0 ? '+' : ''}${ageDifference.toFixed(1).replace('.', ',')} Jahre` 
                    : isGoodStatus 
                      ? `😊 -${Math.abs(ageDifference).toFixed(1).replace('.', ',')} Jahre` 
                      : `⚠️ +${Math.abs(ageDifference).toFixed(1).replace('.', ',')} Jahre`}
                </span>
                <span className="rstat-sub">
                  {isNeutral ? 'Zellalter ≈ Kalenderalter' : isGoodStatus ? 'Du verjüngst dich' : 'Du alterst'}
                </span>
              </div>
              
              <div className={`rstat-card ${isGood ? 'good' : 'bad'}`}>
                <span className="rstat-label">Alterungs-Rate</span>
                <span className="rstat-val">
                  {agingRate < 1.0 
                    ? `⬇️ ${(100 - agingRate * 100).toFixed(0)}%` 
                    : `⬆️ ${(agingRate * 100 - 100).toFixed(0)}%`}
                </span>
                <span className="rstat-sub">
                  {agingRate < 1.0 ? 'Du alterst langsamer' : 'Du alterst schneller'}
                </span>
              </div>
            </div>

            <div className="result-insight">
              <p>
                {isGood 
                  ? 'Klasse! Dein zellulärer Rhythmus arbeitet effizient. Du schützt deine DNA und verlangsamst den Alterungsprozess aktiv.' 
                  : 'Achtung: Dein Körper altert schneller als die biologische Baseline. Mitochondriale Erschöpfung und Entzündungsmarker steigen.'}
              </p>
            </div>
          </div>

          <div className="sim-card vitality-card-sim">
            {/* Option 2: Zelluläre Resilienz */}
            <div className="resilience-section-sim">
              <div className="resilience-header-sim">
                <span className="resilience-title-sim">Zelluläre Resilienz</span>
                <span className="resilience-val-sim">{zellResilience.score}%</span>
              </div>
              <div className="resilience-bar-track-sim">
                <div className="resilience-bar-fill-sim" style={{ width: `${zellResilience.score}%` }}></div>
              </div>
              <p className="resilience-desc-sim">
                <strong>{zellResilience.label}</strong> – {zellResilience.sub}
              </p>
            </div>

            <div className="vitality-divider-sim"></div>

            {/* Option 1: Deine stärksten Hebel */}
            <div className="levers-card-sim">
              <span className="levers-title-sim">Deine stärksten Hebel</span>
              <div className="levers-list-sim">
                {strongestLevers.map((lever, idx) => (
                  <div key={idx} className="lever-item-sim">
                    <div className="lever-icon-wrapper-sim" style={{ color: lever.color, backgroundColor: `${lever.color}15` }}>
                      {renderLeverIcon(lever.type)}
                    </div>
                    <span className="lever-text-sim">{lever.text}</span>
                    <span className="lever-priority-badge-sim" style={{ color: lever.color, backgroundColor: `${lever.color}12` }}>
                      {lever.priority}
                    </span>
                  </div>
                ))}
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
        @media (max-width: 1366px) {
          .sim-subtitle {
            font-size: 1.05rem;
          }
        }
        @media (max-width: 1200px) {
          .sim-subtitle {
            font-size: 0.88rem;
          }
        }
        @media (max-width: 1050px) {
          .sim-subtitle {
            font-size: 0.76rem;
          }
        }

        .sim-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        @media (max-width: 992px) {
          .sim-grid {
            grid-template-columns: 1fr;
          }
          .sim-subtitle {
            white-space: normal;
            font-size: 1rem;
            text-overflow: clip;
            overflow: visible;
          }
        }

        .sim-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 30px;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.03);
        }

        .sim-card h2 {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 10px;
          color: #1e3a5f;
        }
        
        .card-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .slider-group {
          background: #fafcff;
          border: 1.5px solid #e2eef8;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          transition: all 0.2s ease;
        }
        .slider-group:hover {
          border-color: #cbdbe9;
          background: #eef4fa;
          box-shadow: 0 4px 15px rgba(68, 152, 202, 0.04);
        }
        .slider-group:last-child {
          margin-bottom: 0;
        }
        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .slider-title-wrapper {
          display: flex;
          align-items: center;
        }
        .slider-icon-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          margin-right: 0.75rem;
          font-size: 1.15rem;
          flex-shrink: 0;
          background: transparent;
          border: 1.5px solid #4498ca;
          color: #4498ca;
        }

        .slider-label {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e3a5f;
        }
        .slider-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: #4498ca;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .slider-desc {
          display: block;
          font-size: 0.95rem;
          color: #64748b;
          margin-top: 0.75rem;
          line-height: 1.5;
        }

        .sim-slider-input {
          width: 100%;
          height: 8px;
          border-radius: 10px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          margin: 1rem 0 0.5rem 0;
        }
        .sim-slider-input.sleep-slider {
          background: linear-gradient(to right, #ef4444 0%, #ef4444 10%, #eab308 25%, #22c55e 45%, #22c55e 65%, #eab308 80%, #ef4444 95%, #ef4444 100%);
        }
        .sim-slider-input.exercise-slider {
          background: linear-gradient(to right, #ef4444 0%, #ef4444 15%, #eab308 35%, #eab308 65%, #22c55e 80%, #22c55e 100%);
        }
        .sim-slider-input.nutrition-slider {
          background: linear-gradient(to right, #ef4444 0%, #ef4444 15%, #eab308 35%, #eab308 65%, #22c55e 80%, #22c55e 100%);
        }
        .sim-slider-input.stress-slider {
          background: linear-gradient(to right, #ef4444 0%, #ef4444 15%, #eab308 35%, #eab308 65%, #22c55e 80%, #22c55e 100%);
        }
        .sim-slider-input.toxins-slider {
          background: linear-gradient(to right, #ef4444 0%, #ef4444 15%, #eab308 35%, #eab308 65%, #22c55e 80%, #22c55e 100%);
        }
        .sim-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ffffff;
          border: 4.5px solid #4498ca;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(68, 152, 202, 0.35);
          transition: all 0.15s;
        }
        .sim-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 3px 12px rgba(68, 152, 202, 0.5);
          border-color: #006ea7;
        }

        /* Result Card */
        .result-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .bac-circle-container {
          position: relative; width: 210px; height: 210px;
          display: flex; align-items: center; justify-content: center;
        }
        .bac-circle-svg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        }
        .bac-circle-text-box {
          position: relative; z-index: 2; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .bac-circle-val { font-size: 3.4rem; font-weight: 900; color: #1c2b3e; line-height: 1; letter-spacing: -0.02em; }
        .bac-circle-lab { font-size: 1.25rem; font-weight: 700; color: #8fa0b5; margin-top: 2px; }

        .result-stats {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        .rstat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.25rem 1rem;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          transition: all 0.25s ease;
          background: #ffffff;
        }
        .rstat-card.neutral {
          background: #f0f9ff;
          border-color: #bae6fd;
          color: #0369a1;
        }
        .rstat-card.good {
          background: #f0fdf4;
          border-color: #bbf7d0;
          color: #15803d;
        }
        .rstat-card.bad {
          background: #fef2f2;
          border-color: #fecaca;
          color: #b91c1c;
        }
        
        .rstat-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.35rem;
          color: #64748b;
        }
        .rstat-card.neutral .rstat-label { color: #0284c7; }
        .rstat-card.good .rstat-label { color: #16a34a; }
        .rstat-card.bad .rstat-label { color: #dc2626; }

        .rstat-val {
          font-size: 1.25rem;
          font-weight: 900;
          line-height: 1.2;
        }
        
        .rstat-sub {
          font-size: 0.76rem;
          font-weight: 600;
          margin-top: 0.25rem;
          color: #64748b;
          text-align: center;
        }
        .rstat-card.neutral .rstat-sub { color: #0369a1; opacity: 0.85; }
        .rstat-card.good .rstat-sub { color: #15803d; opacity: 0.85; }
        .rstat-card.bad .rstat-sub { color: #b91c1c; opacity: 0.85; }

        .result-insight {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 0.85rem 1.15rem;
          font-size: 0.92rem;
          line-height: 1.5;
          color: #475569;
          font-weight: 500;
        }

        .sim-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .vitality-card-sim {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .vitality-divider-sim {
          height: 1px;
          background: #e2effa;
          margin: 0.25rem 0;
        }

        .resilience-section-sim {
          width: 100%;
          text-align: left;
        }
        .resilience-header-sim {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .resilience-title-sim {
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .resilience-val-sim {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e3a5f;
        }
        .resilience-bar-track-sim {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.6rem;
        }
        .resilience-bar-fill-sim {
          height: 100%;
          background: linear-gradient(to right, #4498ca, #22c55e);
          border-radius: 10px;
          transition: width 0.4s ease-out;
        }
        .resilience-desc-sim {
          font-size: 0.88rem;
          color: #475569;
          margin: 0;
          line-height: 1.4;
        }

        .levers-card-sim {
          width: 100%;
          text-align: left;
        }
        .levers-title-sim {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.85rem;
        }
        .levers-list-sim {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .lever-item-sim {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.35rem 0;
        }
        .lever-icon-wrapper-sim {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .lever-priority-badge-sim {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          flex-shrink: 0;
        }
        .lever-text-sim {
          font-size: 0.92rem;
          font-weight: 600;
          color: #1e3a5f;
          flex-grow: 1;
        }

        @media (max-width: 768px) {
          .sim-container {
            padding: 1rem;
          }
          .sim-card {
            padding: 1.75rem 1.25rem;
            border-radius: 20px;
          }
          .sim-title {
            font-size: 1.8rem;
          }
          .sim-grid {
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 576px) {
          .sim-header-title-row {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 1rem;
          }
          .sim-back-btn {
            align-self: flex-start;
            padding: 0.4rem 0.9rem;
            font-size: 0.85rem;
          }
          .slider-header {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .slider-title-wrapper {
            width: 100%;
          }
          .slider-value {
            font-size: 1.05rem;
            margin-left: 2.85rem; /* Align under the label text */
            margin-top: -0.25rem;
            display: block;
          }
          .slider-group {
            padding: 1rem;
            border-radius: 14px;
          }
          .slider-label {
            font-size: 1rem;
          }
          .slider-desc {
            font-size: 0.85rem;
          }
          .rstat-val {
            font-size: 1.12rem;
          }
          .rstat-sub {
            font-size: 0.72rem;
          }
          .lever-item-sim {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .lever-priority-badge-sim {
            margin-left: auto;
          }
        }

        @media (max-width: 420px) {
          .result-stats {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .rstat-card {
            padding: 1rem;
          }
          .bac-circle-container {
            width: 180px;
            height: 180px;
          }
          .bac-circle-val {
            font-size: 2.8rem;
          }
          .bac-circle-lab {
            font-size: 1.1rem;
          }
          .lever-text-sim {
            font-size: 0.88rem;
            width: 100%;
            order: 3; /* Push text to a new line if screen is extremely narrow */
            margin-left: 2.5rem;
          }
          .lever-priority-badge-sim {
            margin-left: 0;
            order: 2;
          }
        }
      `}</style>
    </div>
  );
}
