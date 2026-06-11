'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type HabitOption = {
  title: string;
  desc: string;
  icon: string;
};

export default function JungbrunnenPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Inputs
  const [chronologicalAge, setChronologicalAge] = useState(40);
  const [sleepScore, setSleepScore] = useState(7.5);
  const [exerciseScore, setExerciseScore] = useState(2);
  const [nutritionScore, setNutritionScore] = useState(3);
  const [stressScore, setStressScore] = useState(3);

  // Outputs
  const [biologicalAge, setBiologicalAge] = useState(40);
  const [ageDifference, setAgeDifference] = useState(0);
  const [agingRate, setAgingRate] = useState(1.0); // 1.0 is normal

  useEffect(() => {
    // 1. Sleep delta
    // Optimal: 8h (-1.8 yrs). 5h (+2.5 yrs)
    let sleepDelta = 0;
    if (sleepScore >= 7.5 && sleepScore <= 8.5) {
      sleepDelta = -1.8 + (sleepScore - 7.5) * 0.4; // smooth optimal range
    } else if (sleepScore > 8.5) {
      sleepDelta = -1.4 + (sleepScore - 8.5) * 0.8; // slightly less optimal
    } else {
      // sleepScore < 7.5
      sleepDelta = 2.5 - ((sleepScore - 5) / 2.5) * 4.3;
    }

    // 2. Exercise delta
    // 0h: +2.0 yrs, 4h: -1.8 yrs, 6h: -2.3 yrs
    let exerciseDelta = 2.0;
    if (exerciseScore > 0) {
      if (exerciseScore <= 4) {
        exerciseDelta = 2.0 - (exerciseScore / 4) * 3.8; // down to -1.8
      } else {
        exerciseDelta = -1.8 - ((exerciseScore - 4) / 2) * 0.5; // down to -2.3
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

  // Generate dynamic habits based on user selections
  const getTailoredHabits = (): HabitOption[] => {
    const habits: HabitOption[] = [];

    if (sleepScore < 7) {
      habits.push({
        title: 'Handyfreie Abendroutine',
        desc: 'Lege dein Smartphone ab 21:30 Uhr weg. Die Oura-Daten zeigen, dass dadurch die Tiefschlaf-Phase um bis zu 25% verlängert wird.',
        icon: '🌙'
      });
    }
    if (exerciseScore < 3) {
      habits.push({
        title: 'Zelluläre Aktivierung (HIIT)',
        desc: 'Führe 2x pro Woche ein kurzes 15-minütiges Intervalltraining durch. Das regt die mitochondriale Erneuerung massiv an.',
        icon: '⚡'
      });
    }
    if (nutritionScore < 4) {
      habits.push({
        title: '16:8 Autophagie-Fasten',
        desc: 'Halte ein 16-stündiges Fastenfenster ein. Dies initiiert die zelluläre Müllabfuhr (Autophagie) und verlangsamt den Alterungsprozess.',
        icon: '🌿'
      });
    }
    if (stressScore < 4) {
      habits.push({
        title: '5-Minuten Box-Breathing',
        desc: 'Senke dein Stresslevel vor Meetings oder dem Schlafengehen mit 4-4-4-4 Atmung. Beruhigt das Nervensystem sofort und erhöht deine HRV.',
        icon: '🧠'
      });
    }

    // Fallbacks if user is doing perfect
    if (habits.length < 3) {
      if (!habits.some(h => h.title.includes('Fasten'))) {
        habits.push({
          title: 'Zell-Ernährung erweitern',
          desc: 'Integriere gezielt NAD+ Vorstufen und Polyphenole (wie Resveratrol) in deine Ernährung, um die Langlebigkeitsgene (Sirtuine) zu aktivieren.',
          icon: '🍇'
        });
      }
    }
    if (habits.length < 3) {
      habits.push({
        title: 'Kälte-Hormesis',
        desc: 'Beende jede Dusche mit 30-60 Sekunden eiskaltem Wasser. Das stärkt das braune Fettgewebe und erhöht die Mitochondrien-Dichte.',
        icon: '❄️'
      });
    }

    return habits.slice(0, 3);
  };

  const activeHabits = getTailoredHabits();

  // Color mapping based on results
  const isGood = ageDifference < 0;
  const strokeColor = isGood ? '#10b981' : '#f43f5e';
  const textGlow = isGood ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)';

  return (
    <div className="jb-container">
      {/* Background Orbs */}
      <div className="jb-glow-orb orb-1"></div>
      <div className="jb-glow-orb orb-2"></div>
      
      {/* Navigation */}
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
        <Link href="/" className="logo">
          <Image 
            src="/images/logoneu.png" 
            alt="TrueYears Logo" 
            width={180} 
            height={60} 
            className="landing-header-logo"
            priority
          />
        </Link>
        <button 
          className={`nav-toggle ${menuOpen ? 'toggle-active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <Link href="/" className="nav-link">Startseite</Link>
          <Link href="/#features" className="nav-link">Bausteine</Link>
          <Link href="/#erfolgsprinzip" className="nav-link">Mitgliedschaften</Link>
          <Link href="/dashboard" className="btn-cta-small">Dashboard</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="jb-content">
        <div className="jb-header">
          <span className="jb-badge">Zellalter-Simulator</span>
          <h1>Der interaktive True Years Jungbrunnen</h1>
          <p>Simuliere, wie sich dein alltäglicher Lebensstil direkt auf deine zelluläre Vitalität und dein biologisches Alter auswirkt.</p>
        </div>

        <div className="jb-grid">
          {/* Left Column: Sliders */}
          <div className="jb-inputs-card">
            <h2>Dein aktueller Lebensstil</h2>
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
                className="jb-slider-input"
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
                className="jb-slider-input"
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
                className="jb-slider-input"
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
                className="jb-slider-input"
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
                className="jb-slider-input"
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
          <div className="jb-result-card">
            <h2>Dein biologisches Ergebnis</h2>
            
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

        {/* Tailored Blueprint Section */}
        <div className="jb-blueprint">
          <h2>Dein persönlicher Jungbrunnen-Blueprint</h2>
          <p className="section-subtitle">Die effektivsten Sofortmaßnahmen basierend auf deiner heutigen Auswertung:</p>
          
          <div className="blueprint-grid">
            {activeHabits.map((habit, i) => (
              <div key={i} className="blueprint-card">
                <div className="bp-icon-wrap">{habit.icon}</div>
                <div className="bp-body">
                  <h3>{habit.title}</h3>
                  <p>{habit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="blueprint-cta">
            <div className="bp-cta-content">
              <h3>Möchtest du dein wahres biologisches Alter im Blut messen?</h3>
              <p>True Years verbindet präzise epigenetische DNA-Analysen mit einem interaktiven Begleiter, damit du deine Verjüngung Tag für Tag messen und steuern kannst.</p>
            </div>
            <Link href="/dashboard" className="btn-bp-cta">Jetzt zellulär durchstarten</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-new" style={{marginTop:'5rem'}}>
        <div className="footer-container-new">
          <div className="footer-top-new">
            <div className="footer-brand-new">
              <Image 
                src="/images/logoneu.png" 
                alt="TrueYears Logo" 
                width={160} 
                height={53} 
                className="footer-logo-new"
              />
              <p className="footer-description-new">
                True Years ist die am schnellsten wachsende europäische Plattform für Langlebigkeit, um das biologische Alter mit KI und Wissenschaft zurückzudrehen.
              </p>
            </div>
            <div className="footer-nav-grid-new">
              <div className="footer-col-new">
                <h4>Navigation</h4>
                <Link href="/">Startseite</Link>
                <Link href="/#features">Bausteine</Link>
                <Link href="/#erfolgsprinzip">Mitgliedschaften</Link>
              </div>
              <div className="footer-col-new">
                <h4>Rechtliches</h4>
                <Link href="/impressum">Impressum</Link>
                <Link href="/datenschutz">Datenschutz</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom-new">
            <p>&copy; 2026 True Years Beyond Age GmbH. Alle Rechte vorbehalten.</p>
            <div className="footer-bottom-links-new">
              <span className="footer-badge-clean-new">Made with ♥ in Germany</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .jb-container {
          background-color: #060d18;
          color: #f8fafc;
          min-height: 100vh;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
          overflow: hidden;
          padding-top: 100px;
        }

        .jb-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
        }
        .orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #38bdf8, #0369a1, transparent);
          top: 10%;
          left: -10%;
        }
        .orb-2 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #c084fc, #7e22ce, transparent);
          bottom: 10%;
          right: -10%;
        }

        .jb-content {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
        }

        .jb-header {
          text-align: center;
          max-width: 750px;
          margin: 0 auto 3.5rem;
        }
        .jb-badge {
          display: inline-block;
          padding: 0.35rem 0.95rem;
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 9999px;
          font-size: 0.85rem;
          color: #38bdf8;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .jb-header h1 {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1rem;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }
        .jb-header p {
          font-size: 1.15rem;
          color: rgba(180, 210, 240, 0.7);
          line-height: 1.55;
        }

        .jb-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }
        @media (max-width: 992px) {
          .jb-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Input Card styling */
        .jb-inputs-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
        }
        .jb-inputs-card h2, .jb-result-card h2, .jb-blueprint h2 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #e2e8f0;
          letter-spacing: -0.01em;
        }
        .card-subtitle {
          font-size: 0.95rem;
          color: rgba(180, 210, 240, 0.5);
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
          font-weight: 600;
          color: #e2e8f0;
        }
        .slider-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: #38bdf8;
        }
        .slider-desc {
          display: block;
          font-size: 0.8rem;
          color: rgba(180, 210, 240, 0.45);
          margin-top: 0.45rem;
          line-height: 1.4;
        }

        .jb-slider-input {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.08);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }
        .jb-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid #38bdf8;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
          transition: all 0.15s;
        }
        .jb-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.8);
        }

        /* Result Card styling */
        .jb-result-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
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
          stroke: rgba(255, 255, 255, 0.04);
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
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }
        .result-unit {
          font-size: 0.85rem;
          color: rgba(180, 210, 240, 0.6);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .result-stats {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
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
          color: rgba(180, 210, 240, 0.45);
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 0.4rem;
        }
        .rstat-val {
          font-size: 1.1rem;
          font-weight: 700;
        }
        .rstat-val.good {
          color: #10b981;
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
        }
        .rstat-val.bad {
          color: #f43f5e;
          text-shadow: 0 0 10px rgba(244, 63, 150, 0.2);
        }

        .result-insight {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 0.85rem 1.15rem;
          font-size: 0.92rem;
          line-height: 1.5;
          color: rgba(180, 210, 240, 0.7);
        }

        /* Blueprint section styling */
        .jb-blueprint {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 28px;
          padding: 3rem;
          margin-top: 2rem;
        }
        @media (max-width: 768px) {
          .jb-blueprint {
            padding: 2rem 1.5rem;
          }
        }
        .section-subtitle {
          font-size: 1.1rem;
          color: rgba(180, 210, 240, 0.6);
          margin-bottom: 2.5rem;
        }

        .blueprint-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        @media (max-width: 992px) {
          .blueprint-grid {
            grid-template-columns: 1fr;
          }
        }

        .blueprint-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.25s;
        }
        .blueprint-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(56, 189, 248, 0.2);
          transform: translateY(-4px);
        }
        .bp-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.2);
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bp-body h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.5rem;
        }
        .bp-body p {
          font-size: 0.92rem;
          color: rgba(180, 210, 240, 0.6);
          line-height: 1.5;
        }

        /* Blueprint CTA styling */
        .blueprint-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(126, 34, 206, 0.1) 100%);
          border: 1px solid rgba(56, 189, 248, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }
        @media (max-width: 992px) {
          .blueprint-cta {
            flex-direction: column;
            text-align: center;
          }
        }
        .bp-cta-content h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }
        .bp-cta-content p {
          font-size: 1rem;
          color: rgba(180, 210, 240, 0.75);
          line-height: 1.5;
          margin: 0;
        }
        .btn-bp-cta {
          padding: 0.9rem 2rem;
          background: #ffffff;
          color: #060d18;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
        }
        .btn-bp-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
