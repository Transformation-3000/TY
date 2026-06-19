'use client';

import React, { useState, useEffect } from 'react';

interface HebelItem {
  title: string;
  desc: string;
  impact: 'Hoch' | 'Mittel' | 'Niedrig';
  field: string;
  actionLabel: string;
  actionTab: string;
}

interface RubricHebel {
  id: string;
  name: string;
  score: number;
  color: string;
  icon: string;
  items: HebelItem[];
}

const RUBRIC_DEFAULTS = {
  Schlaf: { name: 'Schlaf & Erholung', color: '#3b82f6', icon: 'bi-moon-stars-fill', defaultScore: 85 },
  Kraft: { name: 'Kraft & Ausdauer', color: '#10b981', icon: 'bi-lightning-charge-fill', defaultScore: 48 },
  Zellversorgung: { name: 'Zellversorgung', color: '#f59e0b', icon: 'bi-apple', defaultScore: 56 },
  Immunbalance: { name: 'Immunbalance', color: '#8b5cf6', icon: 'bi-yin-yang', defaultScore: 52 },
  'Soziale Bindungen': { name: 'Soziale Bindungen', color: '#ec4899', icon: 'bi-heart-fill', defaultScore: 80 },
  Mindset: { name: 'Mentale Resilienz', color: '#06b6d4', icon: 'bi-sun-fill', defaultScore: 36 }
};

export default function OnboardingHebelPage({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('ty_onboarding_answers');
      if (savedAnswers) {
        try {
          setAnswers(JSON.parse(savedAnswers));
        } catch (e) {
          console.error(e);
        }
      }

      const handleStorage = (e: StorageEvent) => {
        if (e.key === 'ty_onboarding_answers' && e.newValue) {
          try {
            setAnswers(JSON.parse(e.newValue));
          } catch (err) {
            console.error(err);
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, []);

  const calculateScore = (cat: string, defaultScore: number) => {
    const categoryAnswerKeys = Object.keys(answers).filter(key => {
      const id = parseInt(key);
      if (cat === 'Schlaf' && id >= 21 && id <= 30) return true;
      if (cat === 'Kraft' && id >= 31 && id <= 40) return true;
      if (cat === 'Zellversorgung' && id >= 41 && id <= 50) return true;
      if (cat === 'Immunbalance' && id >= 51 && id <= 60) return true;
      if (cat === 'Soziale Bindungen' && id >= 61 && id <= 70) return true;
      if (cat === 'Mindset' && id >= 71 && id <= 80) return true;
      return false;
    });

    if (categoryAnswerKeys.length === 0) return defaultScore;

    let totalVal = 0;
    categoryAnswerKeys.forEach(k => {
      const val = answers[parseInt(k)];
      if (Array.isArray(val)) {
        totalVal += val.length > 2 ? 80 : 50;
      } else {
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
          totalVal += 15;
        }
      }
    });
    return Math.round(totalVal / categoryAnswerKeys.length);
  };

  const getHebelData = (): RubricHebel[] => {
    return [
      {
        id: 'Schlaf',
        name: 'Schlaf & Erholung',
        score: calculateScore('Schlaf', RUBRIC_DEFAULTS.Schlaf.defaultScore),
        color: RUBRIC_DEFAULTS.Schlaf.color,
        icon: RUBRIC_DEFAULTS.Schlaf.icon,
        items: [
          {
            title: 'Regelmäßiger Schlafrhythmus',
            desc: 'Deine Aufstehzeiten variieren kaum, was deinen zirkadianen Rhythmus stabilisiert.',
            impact: 'Hoch',
            field: 'Schlafrhythmus',
            actionLabel: 'Tagesplaner starten',
            actionTab: 'chronotyp-planer'
          },
          {
            title: 'Späte Mahlzeiten vermeiden',
            desc: 'Essen weniger als 3 Stunden vor dem Schlaf hemmt die nächtliche Kerntemperaturabsenkung.',
            impact: 'Mittel',
            field: 'Chronotyp',
            actionLabel: 'Tagesplaner starten',
            actionTab: 'chronotyp-planer'
          }
        ]
      },
      {
        id: 'Kraft',
        name: 'Kraft & Ausdauer',
        score: calculateScore('Kraft', RUBRIC_DEFAULTS.Kraft.defaultScore),
        color: RUBRIC_DEFAULTS.Kraft.color,
        icon: RUBRIC_DEFAULTS.Kraft.icon,
        items: [
          {
            title: 'Sitzenden Lebensstil unterbrechen',
            desc: 'Mehr als 6 Stunden tägliches Sitzen hemmt die Insulinsensitivität. Kurze Aktivpausen einbauen.',
            impact: 'Hoch',
            field: 'Cardio-Training',
            actionLabel: 'Cardio-Simulator starten',
            actionTab: 'quick-wins'
          },
          {
            title: 'Regelmäßige Bewegungszeiten',
            desc: 'Baut Muskelgewebe auf und schützt vor altersbedingtem Abbau (Sarkopenie).',
            impact: 'Hoch',
            field: 'Kraftaufbau',
            actionLabel: 'Cardio-Simulator starten',
            actionTab: 'quick-wins'
          }
        ]
      },
      {
        id: 'Zellversorgung',
        name: 'Zellversorgung',
        score: calculateScore('Zellversorgung', RUBRIC_DEFAULTS.Zellversorgung.defaultScore),
        color: RUBRIC_DEFAULTS.Zellversorgung.color,
        icon: RUBRIC_DEFAULTS.Zellversorgung.icon,
        items: [
          {
            title: 'Ernährungsqualität optimieren',
            desc: 'Hohe Nährstoffdichte und Bio-Qualität reduzieren oxidativen Stress in den Mitochondrien.',
            impact: 'Mittel',
            field: 'Kitchen-Planer',
            actionLabel: 'Langlebigkeitsküche starten',
            actionTab: 'quick-wins'
          },
          {
            title: 'Eiweißzufuhr decken',
            desc: 'Ausreichend Proteine sichern den Aminosäurepool für Zellerneuerung und Gewebeaufbau.',
            impact: 'Hoch',
            field: 'Ernährung',
            actionLabel: 'Langlebigkeitsküche starten',
            actionTab: 'quick-wins'
          }
        ]
      },
      {
        id: 'Immunbalance',
        name: 'Immunbalance',
        score: calculateScore('Immunbalance', RUBRIC_DEFAULTS.Immunbalance.defaultScore),
        color: RUBRIC_DEFAULTS.Immunbalance.color,
        icon: RUBRIC_DEFAULTS.Immunbalance.icon,
        items: [
          {
            title: 'Chronische Entzündungen reduzieren',
            desc: 'Durch bewusste Essenspausen (Autophagie) können entartete Proteinstrukturen abgebaut werden.',
            impact: 'Mittel',
            field: 'Autophagie',
            actionLabel: 'Fasten-Timer starten',
            actionTab: 'quick-wins'
          },
          {
            title: 'Umweltgifte ausleiten',
            desc: 'Belastungen durch Alltags-Toxine minimieren und die körpereigenen Entgiftungswege stärken.',
            impact: 'Niedrig',
            field: 'Toxine',
            actionLabel: 'Toxin-Simulator starten',
            actionTab: 'quick-wins'
          }
        ]
      },
      {
        id: 'Soziale Bindungen',
        name: 'Soziale Bindungen',
        score: calculateScore('Soziale Bindungen', RUBRIC_DEFAULTS['Soziale Bindungen'].defaultScore),
        color: RUBRIC_DEFAULTS['Soziale Bindungen'].color,
        icon: RUBRIC_DEFAULTS['Soziale Bindungen'].icon,
        items: [
          {
            title: 'Starkes soziales Umfeld',
            desc: 'Enge soziale Bindungen reduzieren nachweislich das Stresshormon Cortisol und verlängern das Leben.',
            impact: 'Mittel',
            field: 'Bindungen',
            actionLabel: 'Inspirationen ansehen',
            actionTab: 'insights'
          }
        ]
      },
      {
        id: 'Mindset',
        name: 'Mentale Resilienz',
        score: calculateScore('Mindset', RUBRIC_DEFAULTS.Mindset.defaultScore),
        color: RUBRIC_DEFAULTS.Mindset.color,
        icon: RUBRIC_DEFAULTS.Mindset.icon,
        items: [
          {
            title: 'Stressabbau über Vagusnerv',
            desc: 'Regelmäßige Atemübungen oder Kurzmeditationen aktivieren den Parasympathikus für rasche Beruhigung.',
            impact: 'Hoch',
            field: 'Vagusnerv',
            actionLabel: 'HRV-Gym starten',
            actionTab: 'quick-wins'
          },
          {
            title: 'Stimmung stabilisieren',
            desc: 'Fest etablierte mentale Routinen beugen emotionalen Erschöpfungsphasen vor.',
            impact: 'Mittel',
            field: 'Routinen',
            actionLabel: 'Stress-Barometer starten',
            actionTab: 'quick-wins'
          }
        ]
      }
    ];
  };

  const hebelData = getHebelData();
  const scores = hebelData.map(r => r.score);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const highImpactCount = hebelData.reduce((acc, curr) => acc + curr.items.filter(i => i.impact === 'Hoch').length, 0);

  return (
    <div className="hebel-page-container">
      {/* HEADER SECTION WITH STATS CARDS */}
      <div className="hebel-hero-section">
        <div className="hebel-hero-left">
          <h1 className="hebel-title-gradient">Deine Lifestyle-Hebel</h1>
          <p className="hebel-subtitle">
            Basierend auf deiner Onboarding-Baseline haben wir deine stärksten Hebel zur Zellverjüngung identifiziert. Setze diese gezielt ein, um dein biologisches Alter positiv zu beeinflussen und dein Lebensgefühl noch weiter positiv zu verbessern
          </p>
          <div className="hebel-quick-stats">
            <div className="quick-stat-pill">
              <span className="stat-num">{highImpactCount}</span>
              <span className="stat-lbl">Hebel mit hoher Wirkung</span>
            </div>
            <div className="quick-stat-pill font-blue">
              <span className="stat-num">11</span>
              <span className="stat-lbl">Identifizierte Routinen</span>
            </div>
          </div>
        </div>

        {/* RADIAL SCORE WIDGET */}
        <div className="score-summary-widget">
          <div className="widget-circle-wrap">
            <svg className="widget-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="6" />
              <circle 
                cx="50" 
                cy="50" 
                r="42" 
                fill="none" 
                stroke="url(#summaryGrad)" 
                strokeWidth="7" 
                strokeDasharray="263.8" 
                strokeDashoffset={263.8 * (1 - averageScore / 100)}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="summaryGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#006EA7" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="widget-value-box">
              <span className="widget-score">{averageScore}%</span>
              <span className="widget-label">Lifestyle Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC LEVERS GRID */}
      <div className="hebel-grid">
        {hebelData.map((rubric, idx) => {
          const dashArray = 2 * Math.PI * 18;
          const dashOffset = dashArray * (1 - rubric.score / 100);

          return (
            <div key={rubric.id} className="rubric-hebel-card" style={{ '--theme-color': rubric.color } as React.CSSProperties}>
              <div className="rubric-hebel-card-header">
                <div className="header-left-group">
                  <div className="header-icon-box" style={{ backgroundColor: rubric.color + '15', color: rubric.color }}>
                    <i className={`bi ${rubric.icon}`}></i>
                  </div>
                  <div>
                    <span className="header-index">Säule {idx + 1}</span>
                    <h3>{rubric.name}</h3>
                  </div>
                </div>

                <div className="header-right-gauge">
                  <svg className="mini-gauge-svg" width="50" height="50" viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="18" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle 
                      cx="25" 
                      cy="25" 
                      r="18" 
                      fill="none" 
                      stroke={rubric.color} 
                      strokeWidth="3.5" 
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      transform="rotate(-90 25 25)"
                    />
                  </svg>
                  <span className="gauge-text" style={{ color: rubric.color }}>{rubric.score}%</span>
                </div>
              </div>

              <div className="rubric-hebel-card-body">
                <div className="hebel-items-list">
                  {rubric.items.map((item, iIdx) => {
                    const impactClass = item.impact.toLowerCase();
                    const iconPill = item.impact === 'Hoch' ? '🔥' : item.impact === 'Mittel' ? '⚡' : '✨';
                    
                    return (
                      <div key={iIdx} className={`hebel-item-box priority-${impactClass}`}>
                        <div className="item-content-wrap">
                          <div className="item-title-row">
                            <h4 className="item-title">
                              <span className="priority-emoji">{iconPill}</span>
                              {item.title}
                            </h4>
                            <span className={`nba-priority-pill priority-bg-${impactClass}`}>
                              {item.impact}
                            </span>
                          </div>
                          
                          <p className="item-desc">{item.desc}</p>
                          
                          <div className="item-footer-row">
                            <button className="activate-hebel-btn-styled" onClick={() => onNavigate(item.actionTab)}>
                              <span>{item.actionLabel}</span>
                              <i className="bi bi-arrow-right-short icon-slide"></i>
                            </button>
                            <span className="nba-pillar-tag">{item.field}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        /* TY - PREMIUM STYLING LIFESTYLE HEBEL */
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .hebel-page-container {
          padding: 2.5rem 2rem;
          max-width: 1250px;
          margin: 0 auto;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f1f5f9;
          animation: pageLoadFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pageLoadFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* HERO STATS SECTION */
        .hebel-hero-section {
          background: linear-gradient(135deg, #0b1528 0%, #0e1e38 100%);
          border-radius: 28px;
          padding: 2.5rem 3rem;
          margin-bottom: 3rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
          box-shadow: 0 20px 40px rgba(11, 21, 40, 0.08), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
        }

        .hebel-hero-section::before {
          content: '';
          position: absolute;
          width: 350px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0, 110, 167, 0.15) 0%, transparent 70%);
          top: -100px;
          right: -50px;
          pointer-events: none;
        }

        .hebel-hero-left {
          flex: 1;
          z-index: 1;
        }

        .hebel-title-gradient {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 30%, #a5f3fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 0.75rem 0;
        }

        .hebel-subtitle {
          font-size: 1.08rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 680px;
          margin: 0 0 1.75rem 0;
        }

        .hebel-quick-stats {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .quick-stat-pill {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          padding: 0.6rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quick-stat-pill.font-blue {
          border-color: rgba(59, 130, 246, 0.25);
          background: rgba(59, 130, 246, 0.08);
        }

        .quick-stat-pill .stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 850;
          color: #22c55e;
          line-height: 1;
        }

        .quick-stat-pill.font-blue .stat-num {
          color: #67e8f9;
        }

        .quick-stat-pill .stat-lbl {
          font-size: 0.85rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        /* SCORE SUMMARY WIDGET */
        .score-summary-widget {
          flex-shrink: 0;
          z-index: 1;
        }

        .widget-circle-wrap {
          position: relative;
          width: 160px;
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .widget-svg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .widget-value-box {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 3px;
        }

        .widget-score {
          font-family: 'Outfit', sans-serif;
          font-size: 2.6rem;
          font-weight: 900;
          color: #ffffff;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .widget-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }

        /* HEBEL GRID LAYOUT */
        .hebel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.75rem;
        }

        /* HEBEL CARDS */
        .rubric-hebel-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 28px;
          box-shadow: 0 15px 35px -5px rgba(15, 23, 42, 0.05), 0 5px 15px -3px rgba(15, 23, 42, 0.03);
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .rubric-hebel-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background-color: var(--theme-color);
          opacity: 0.85;
        }

        .rubric-hebel-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 45px -12px rgba(15, 23, 42, 0.12),
                      0 0 0 1.5px var(--theme-color);
          border-color: transparent;
        }

        .rubric-hebel-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.75rem 1.25rem;
          border-bottom: 1px solid #f1f5f9;
          background: #fafcfd;
        }

        .header-left-group {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.02);
          flex-shrink: 0;
        }

        .header-index {
          font-size: calc(0.72rem + 2pt);
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 2px;
        }

        .header-left-group h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .header-right-gauge {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-gauge-svg {
          position: absolute;
          top: 0;
          left: 0;
        }

        .gauge-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 850;
          z-index: 1;
          letter-spacing: -0.02em;
        }

        .rubric-hebel-card-body {
          padding: 1.75rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .hebel-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex: 1;
        }

        /* HEBEL INDIVIDUAL LEVER ITEM BOX */
        .hebel-item-box {
          background: linear-gradient(135deg, #ffffff 0%, #fcfdfe 100%);
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.5rem;
          position: relative;
          box-shadow: 0 4px 12px rgba(8, 15, 30, 0.01);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
        }

        .hebel-item-box::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20px;
          bottom: 20px;
          width: 4px;
          border-radius: 0 4px 4px 0;
          transition: all 0.3s ease;
        }

        .hebel-item-box.priority-hoch::before { background-color: #10b981; }
        .hebel-item-box.priority-mittel::before { background-color: #f59e0b; }
        .hebel-item-box.priority-niedrig::before { background-color: #3b82f6; }

        .hebel-item-box:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 24px -5px rgba(8, 15, 30, 0.05);
          border-color: #cbd5e1;
        }

        .hebel-item-box.priority-hoch:hover { border-color: rgba(16, 185, 129, 0.3); }
        .hebel-item-box.priority-mittel:hover { border-color: rgba(245, 158, 11, 0.3); }
        .hebel-item-box.priority-niedrig:hover { border-color: rgba(59, 130, 246, 0.3); }

        .item-content-wrap {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0.6rem;
        }

        .item-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .item-title {
          font-size: 1.02rem;
          font-weight: 800;
          margin: 0;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.015em;
        }

        .priority-emoji {
          font-size: 1.1rem;
          line-height: 1;
        }

        .nba-priority-pill {
          font-size: 0.65rem;
          font-weight: 850;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
        }

        .priority-bg-hoch { background: rgba(16, 185, 129, 0.08); color: #065f46; }
        .priority-bg-mittel { background: rgba(245, 158, 11, 0.08); color: #92400e; }
        .priority-bg-niedrig { background: rgba(59, 130, 246, 0.08); color: #1e40af; }

        .item-desc {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #475569;
          margin: 0;
          font-weight: 500;
        }

        .item-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          gap: 1rem;
        }

        .nba-pillar-tag {
          font-size: 0.72rem;
          font-weight: 750;
          padding: 4px 10px;
          border-radius: 100px;
          white-space: nowrap;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
        }

        .activate-hebel-btn-styled {
          background: rgba(0, 110, 167, 0.05);
          border: 1px solid rgba(0, 110, 167, 0.08);
          padding: 0.5rem 1.1rem;
          color: #006ea7;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .icon-slide {
          font-size: 1.15rem;
          transition: transform 0.25s ease;
          display: inline-block;
          line-height: 1;
        }

        .activate-hebel-btn-styled:hover {
          background: #006ea7;
          color: #ffffff;
          border-color: #006ea7;
          box-shadow: 0 4px 12px rgba(0, 110, 167, 0.25);
        }

        .activate-hebel-btn-styled:hover .icon-slide {
          transform: translateX(3px);
        }

        /* RESPONSIBER BREAKPOINTS */
        @media (max-width: 992px) {
          .hebel-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .hebel-hero-section {
            flex-direction: column;
            gap: 2rem;
            padding: 2rem;
            text-align: center;
          }
          .hebel-hero-left {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hebel-quick-stats {
            justify-content: center;
          }
          .hebel-subtitle {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .hebel-page-container {
            padding: 1rem 0.75rem;
          }
          .hebel-title-gradient {
            font-size: 1.85rem;
          }
          .hebel-subtitle {
            font-size: 0.95rem;
          }
          .rubric-hebel-card-header {
            padding: 1.1rem 1.25rem;
          }
          .header-left-group h3 {
            font-size: 1.02rem;
          }
          .rubric-hebel-card-body {
            padding: 1.1rem;
          }
          .hebel-items-list {
            gap: 1rem;
          }
          .hebel-item-box {
            padding: 1.1rem;
            border-radius: 16px;
          }
          .item-title {
            font-size: 0.92rem;
          }
          .item-desc {
            font-size: 0.85rem;
            line-height: 1.45;
          }
          .item-footer-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.6rem;
            margin-top: 0.5rem;
          }
          .activate-hebel-btn-styled {
            justify-content: space-between;
            font-size: 0.8rem;
            width: 100%;
            padding: 0.6rem 1.1rem;
          }
          .nba-pillar-tag {
            align-self: flex-start;
            font-size: 0.7rem;
            padding: 3px 8px;
          }
        }
      `}</style>
    </div>
  );
}
