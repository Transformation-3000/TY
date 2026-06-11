'use client';

import React, { useState, useEffect } from 'react';

interface ZellalterSimulationPageProps {
  onBack: () => void;
}

export default function ZellalterSimulationPage({ onBack }: ZellalterSimulationPageProps) {
  // Inputs
  const [chronologicalAge, setChronologicalAge] = useState(40);
  const [sleepScore, setSleepScore] = useState(7.5);
  const [exerciseScore, setExerciseScore] = useState(2);
  const [nutritionScore, setNutritionScore] = useState(3);
  const [stressScore, setStressScore] = useState(3);

  // Outputs
  const [biologicalAge, setBiologicalAge] = useState(40);
  const [ageDifference, setAgeDifference] = useState(0);
  const [agingRate, setAgingRate] = useState(1.0);

  useEffect(() => {
    // 1. Sleep delta
    // Optimal: 8h (-1.8 yrs). 5h (+2.5 yrs)
    let sleepDelta = 0;
    if (sleepScore >= 7.5 && sleepScore <= 8.5) {
      sleepDelta = -1.8 + (sleepScore - 7.5) * 0.4;
    } else if (sleepScore > 8.5) {
      sleepDelta = -1.4 + (sleepScore - 8.5) * 0.8;
    } else {
      sleepDelta = 2.5 - ((sleepScore - 5) / 2.5) * 4.3;
    }

    // 2. Exercise delta
    // 0h: +2.0 yrs, 4h: -1.8 yrs, 6h: -2.3 yrs
    let exerciseDelta = 2.0;
    if (exerciseScore > 0) {
      if (exerciseScore <= 4) {
        exerciseDelta = 2.0 - (exerciseScore / 4) * 3.8;
      } else {
        exerciseDelta = -1.8 - ((exerciseScore - 4) / 2) * 0.5;
      }
    }

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

    const totalDelta = sleepDelta + exerciseDelta + nutritionDelta + stressDelta;
    const computedBioAge = Math.max(18, chronologicalAge + totalDelta);
    
    setBiologicalAge(parseFloat(computedBioAge.toFixed(1)));
    setAgeDifference(parseFloat(totalDelta.toFixed(1)));
    
    // Aging rate: normally 0.75x to 1.3x
    const rate = 1.0 + (totalDelta / chronologicalAge) * 0.8;
    setAgingRate(parseFloat(Math.max(0.65, Math.min(1.45, rate)).toFixed(2)));
  }, [chronologicalAge, sleepScore, exerciseScore, nutritionScore, stressScore]);

  // Color mapping based on results
  const isGood = ageDifference < 0;
  const strokeColor = isGood ? '#22c55e' : '#ef4444';
  const textGlow = isGood ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <div className="sim-container">
      <div className="sim-back-row">
        <button className="sim-back-btn" onClick={onBack}>
          <i className="bi bi-arrow-left"></i> Zurück zur Entwicklung
        </button>
      </div>

      <div className="sim-header">
        <h1 className="sim-title">Zellalter-Simulation</h1>
        <p className="sim-subtitle">
          Simuliere, wie sich dein alltäglicher Lebensstil direkt auf deine zelluläre Vitalität und dein biologisches Alter auswirkt.
        </p>
      </div>

      <div className="sim-grid">
        {/* Left Column: Sliders */}
        <div className="sim-card inputs-card">
          <h2>Dein Lebensstil</h2>
          <p className="card-subtitle">Stelle die Regler auf deine Gewohnheiten ein.</p>

          <div className="slider-group">
            <div className="slider-header">
              <span className="slider-label">🎂 Chronologisches Alter</span>
              <span className="slider-value">{chronologicalAge} Jahre</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="80" 
              value={chronologicalAge} 
              onChange={(e) => setChronologicalAge(parseInt(e.target.value))}
              className="sim-slider-input"
            />
            <span className="slider-desc">Dein tatsächliches Alter laut Geburtsurkunde.</span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span className="slider-label">😴 Schlafdauer</span>
              <span className="slider-value">{sleepScore} Stunden / Nacht</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="9" 
              step="0.5"
              value={sleepScore} 
              onChange={(e) => setSleepScore(parseFloat(e.target.value))}
              className="sim-slider-input"
            />
            <span className="slider-desc">Wie viel ununterbrochenen Schlaf du im Schnitt pro Nacht bekommst.</span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span className="slider-label">🏃 Aktivität & Sport</span>
              <span className="slider-value">{exerciseScore} Stunden / Woche</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="6" 
              value={exerciseScore} 
              onChange={(e) => setExerciseScore(parseInt(e.target.value))}
              className="sim-slider-input"
            />
            <span className="slider-desc">Ausdauer-, Kraft- oder Intervalltraining pro Woche.</span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span className="slider-label">🌿 Zelluläre Ernährung</span>
              <span className="slider-value">Stufe {nutritionScore} / 5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={nutritionScore} 
              onChange={(e) => setNutritionScore(parseInt(e.target.value))}
              className="sim-slider-input"
            />
            <span className="slider-desc">
              {nutritionScore === 1 && '❌ Stufe 1: Viel Zucker, industriell verarbeitete Lebensmittel'}
              {nutritionScore === 2 && '⚠️ Stufe 2: Mischkost mit wenig frischem Gemüse, viel Getreide'}
              {nutritionScore === 3 && '⚖️ Stufe 3: Ausgewogene Kost, regelmäßige Proteine & Ballaststoffe'}
              {nutritionScore === 4 && '🥗 Stufe 4: Zuckerarm, Intervallfasten & nährstoffreiche Bio-Kost'}
              {nutritionScore === 5 && '🌟 Stufe 5: Langlebigkeits-Food, Autophagie-Fasten & Polyphenole'}
            </span>
          </div>

          <div className="slider-group">
            <div className="slider-header">
              <span className="slider-label">🧠 Stress & Regeneration</span>
              <span className="slider-value">Stufe {stressScore} / 5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={stressScore} 
              onChange={(e) => setStressScore(parseInt(e.target.value))}
              className="sim-slider-input"
            />
            <span className="slider-desc">
              {stressScore === 1 && '❌ Stufe 1: Dauerhafter beruflicher/privater Stress, kein Ausgleich'}
              {stressScore === 2 && '⚠️ Stufe 2: Häufiger Stress, unregelmäßige Entspannungsphasen'}
              {stressScore === 3 && '⚖️ Stufe 3: Ausgewogene Belastung, ausreichend Feierabend-Ruhe'}
              {stressScore === 4 && '🧘 Stufe 4: Aktive Stressbewältigung, Yoga oder kurze Atemübungen'}
              {stressScore === 5 && '🌟 Stufe 5: Hohe Resilienz, tägliche Meditations- & Achtsamkeitspraxis'}
            </span>
          </div>
        </div>

        {/* Right Column: Visual Result */}
        <div className="sim-card result-card">
          <h2>Dein biologisches Alter</h2>
          
          <div className="result-circle-wrapper">
            <div className="result-glow" style={{ boxShadow: `0 0 50px 10px ${textGlow}` }}></div>
            <svg className="circle-svg" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" className="circle-bg" />
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                className="circle-fill" 
                style={{
                  stroke: strokeColor,
                  strokeDasharray: '534',
                  strokeDashoffset: isGood ? `${534 - (Math.abs(ageDifference) / 10) * 200}` : '534'
                }}
              />
            </svg>
            <div className="result-text-overlay">
              <span className="result-age">{biologicalAge}</span>
              <span className="result-unit">Jahre (Biologisch)</span>
            </div>
          </div>

          <div className="result-stats">
            <div className="rstat-item">
              <span className="rstat-label">Biologischer Status</span>
              <span className={`rstat-val ${isGood ? 'good' : 'bad'}`}>
                {isGood ? `😊 -${Math.abs(ageDifference)} Jahre verjüngt` : `⚠️ +${Math.abs(ageDifference)} Jahre gealtert`}
              </span>
            </div>
            <div className="rstat-item">
              <span className="rstat-label">Alterungs-Geschwindigkeit</span>
              <span className={`rstat-val ${isGood ? 'good' : 'bad'}`}>
                {agingRate < 1.0 ? `⬇️ ${(100 - agingRate * 100).toFixed(0)}% langsamer` : `⬆️ ${(agingRate * 100 - 100).toFixed(0)}% schneller`}
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
      </div>

      <style jsx>{`
        .sim-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .sim-back-row {
          margin-bottom: 1.5rem;
        }
        
        .sim-back-btn {
          background: transparent;
          border: none;
          color: #4498ca;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
          transition: color 0.2s;
        }
        
        .sim-back-btn:hover {
          color: #006ea7;
        }

        .sim-header {
          margin-bottom: 3rem;
        }
        
        .sim-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 0.5rem;
        }
        
        .sim-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          line-height: 1.55;
          max-width: 800px;
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
          margin-bottom: 0.5rem;
          color: #1e3a5f;
        }
        
        .card-subtitle {
          font-size: 0.95rem;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .slider-group {
          margin-bottom: 1.75rem;
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
        .slider-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: #334155;
        }
        .slider-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #4498ca;
        }
        .slider-desc {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.45rem;
          line-height: 1.4;
        }

        .sim-slider-input {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        .sim-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3.5px solid #4498ca;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(68, 152, 202, 0.3);
          transition: all 0.15s;
        }
        .sim-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 10px rgba(68, 152, 202, 0.5);
        }

        /* Result Card */
        .result-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .result-circle-wrapper {
          position: relative;
          width: 200px;
          height: 200px;
          margin: 2rem 0;
        }
        .result-glow {
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          z-index: 1;
          transition: all 0.3s;
        }
        .circle-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
          position: relative;
          z-index: 2;
        }
        .circle-bg {
          fill: none;
          stroke: #f1f5f9;
          stroke-width: 12;
        }
        .circle-fill {
          fill: none;
          stroke-width: 12;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.4s ease-out, stroke 0.4s;
        }
        .result-text-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .result-age {
          font-size: 3rem;
          font-weight: 800;
          color: #1e3a5f;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .result-unit {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .result-stats {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .rstat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rstat-label {
          font-size: 0.8rem;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.4rem;
          font-weight: 600;
        }
        .rstat-val {
          font-size: 1.1rem;
          font-weight: 800;
        }
        .rstat-val.good {
          color: #22c55e;
          text-shadow: 0 0 10px rgba(34, 197, 94, 0.1);
        }
        .rstat-val.bad {
          color: #ef4444;
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.1);
        }

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
      `}</style>
    </div>
  );
}
