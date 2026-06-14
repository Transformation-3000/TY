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
  Schlaf: { name: 'Schlaf & Erholung', color: '#4498ca', icon: 'bi-moon-stars', defaultScore: 85 },
  Kraft: { name: 'Kraft & Ausdauer', color: '#22c55e', icon: 'bi-lightning', defaultScore: 48 },
  Zellversorgung: { name: 'Zellversorgung', color: '#ACE189', icon: 'bi-apple', defaultScore: 56 },
  Immunbalance: { name: 'Immunbalance', color: '#f59e0b', icon: 'bi-yin-yang', defaultScore: 52 },
  'Soziale Bindungen': { name: 'Soziale Bindungen', color: '#ec4899', icon: 'bi-heart', defaultScore: 80 },
  Mindset: { name: 'Mentale Resilienz', color: '#06b6d4', icon: 'bi-sun', defaultScore: 36 }
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
            actionLabel: 'Chronotyp-Tagesplaner starten',
            actionTab: 'chronotyp-planer'
          },
          {
            title: 'Späte Mahlzeiten vermeiden',
            desc: 'Essen weniger als 3 Stunden vor dem Schlaf hemmt die nächtliche Kerntemperaturabsenkung.',
            impact: 'Mittel',
            field: 'Chronotyp',
            actionLabel: 'Chronotyp-Tagesplaner starten',
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
            actionLabel: 'VO2-Max & Cardio-Simulator starten',
            actionTab: 'quick-wins'
          },
          {
            title: 'Regelmäßige Bewegungszeiten',
            desc: 'Baut Muskelgewebe auf und schützt vor altersbedingtem Abbau (Sarkopenie).',
            impact: 'Hoch',
            field: 'Kraftaufbau',
            actionLabel: 'VO2-Max & Cardio-Simulator starten',
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
            actionLabel: 'Autophagie & Fasten-Timer starten',
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
            desc: 'Fest etablierem mentale Routinen beugen emotionalen Erschöpfungsphasen vor.',
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

  return (
    <div className="hebel-page-container">
      <div className="hebel-header">
        <h1>Lebensstil-Hebel aus dem Onboarding</h1>
        <p>Hier siehst du alle Hebel, die wir basierend auf deiner initialen Baseline berechnet haben. Aktiviere gezielte Routinen, um deinen Alterungsprozess zu verlangsamen.</p>
      </div>

      <div className="hebel-grid">
        {hebelData.map((rubric, idx) => (
          <div key={rubric.id} className="rubric-hebel-card" style={{ borderColor: rubric.color + '30' }}>
            <div className="rubric-hebel-card-header" style={{ borderBottomColor: rubric.color + '15' }}>
              <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3>{idx + 1}. {rubric.name}</h3>
                <span className="rubric-icon-right" style={{ color: rubric.color, fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', marginLeft: '4px' }}>
                  <i className={`bi ${rubric.icon}`}></i>
                </span>
              </div>
              <div className="header-right">
                <span className="score-badge" style={{ backgroundColor: rubric.color + '10', color: rubric.color }}>
                  Initialscore: {rubric.score}%
                </span>
              </div>
            </div>

            <div className="rubric-hebel-card-body">
              <div className="hebel-items-list">
                {rubric.items.map((item, idx) => (
                  <div key={idx} className={`hebel-item-box border-${item.impact.toLowerCase()}`}>
                    <div className="item-content-wrap">
                      <div className="item-title-row">
                        <h4 className="item-title">
                          <span className={`dot dot-${item.impact.toLowerCase()}`}></span>
                          {item.title}
                        </h4>
                        <span className={`nba-priority text-${item.impact.toLowerCase()}`}>{item.impact}</span>
                      </div>
                      <p className="item-desc">{item.desc}</p>
                      <div className="item-footer-row">
                        <button className="activate-hebel-btn" onClick={() => onNavigate(item.actionTab)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {item.actionLabel} <i className="bi bi-chevron-right" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}></i>
                        </button>
                        <span className={`nba-pillar pillar-${item.impact.toLowerCase()}`}>{item.field}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .hebel-page-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'DM Sans', sans-serif;
        }
        .hebel-header {
          margin-bottom: 2rem;
        }
        .hebel-header h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }
        .hebel-header p {
          color: #64748b;
          font-size: 1.2rem;
          line-height: 1.5;
          max-width: 800px;
        }
        
        .hebel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        @media (max-width: 992px) {
          .hebel-grid {
            grid-template-columns: 1fr;
          }
        }

        .rubric-hebel-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rubric-hebel-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 110, 167, 0.05);
        }
        .rubric-hebel-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: #fafcfd;
        }
        .rubric-hebel-card-header .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .rubric-hebel-card-header .header-left h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .score-badge {
          font-size: 1.05rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }
        
        .rubric-hebel-card-body {
          padding: 1.5rem;
        }
        .hebel-items-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        
        .hebel-item-box {
          display: flex;
          flex-direction: column;
          padding: 1.25rem 1.4rem;
          border-radius: 16px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          position: relative;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hebel-item-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
        }
        
        .hebel-item-box.border-hoch {
          border-left: 5px solid #22c55e;
        }
        .hebel-item-box.border-mittel {
          border-left: 5px solid #f59e0b;
        }
        .hebel-item-box.border-niedrig {
          border-left: 5px solid #3b82f6;
        }

        .item-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }

        .item-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .item-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-hoch {
          background-color: #22c55e;
        }
        .dot-mittel {
          background-color: #f59e0b;
        }
        .dot-niedrig {
          background-color: #3b82f6;
        }

        .nba-priority {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .text-hoch {
          color: #22c55e;
        }
        .text-mittel {
          color: #f59e0b;
        }
        .text-niedrig {
          color: #3b82f6;
        }

        .item-desc {
          font-size: 0.88rem;
          line-height: 1.45;
          color: #475569;
          margin: 0;
        }

        .item-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
          gap: 1rem;
        }

        .nba-pillar {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          white-space: nowrap;
        }
        .pillar-hoch {
          background: rgba(34, 197, 94, 0.08);
          color: #166534;
        }
        .pillar-mittel {
          background: rgba(245, 158, 11, 0.08);
          color: #92400e;
        }
        .pillar-niedrig {
          background: rgba(59, 130, 246, 0.08);
          color: #1e40af;
        }

        .activate-hebel-btn {
          background: none;
          border: none;
          padding: 0;
          color: #006ea7;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          text-align: left;
          transition: color 0.2s;
          text-decoration: none;
        }
        .activate-hebel-btn:hover {
          color: #004d77;
          text-decoration: underline;
        }

        /* Mobile Optimization / App View responsiveness */
        @media (max-width: 768px) {
          .hebel-page-container {
            padding: 0.75rem 1rem;
          }
          .hebel-header {
            margin-bottom: 1.25rem;
            padding: 0 0.5rem;
          }
          .hebel-header h1 {
            font-size: 1.5rem;
          }
          .hebel-header p {
            font-size: 0.95rem;
          }
          .hebel-grid {
            gap: 1rem;
          }
          .rubric-hebel-card {
            border-radius: 14px;
          }
          .rubric-hebel-card-header {
            padding: 1rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .rubric-hebel-card-header .header-left h3 {
            font-size: 0.95rem;
          }
          .score-badge {
            font-size: 0.85rem;
            padding: 0.2rem 0.5rem;
          }
          .rubric-hebel-card-body {
            padding: 0.75rem;
          }
          .hebel-items-list {
            gap: 0.75rem;
          }
          .hebel-item-box {
            padding: 1rem;
            border-radius: 12px;
          }
          .item-title {
            font-size: 0.9rem;
          }
          .nba-priority {
            font-size: 0.7rem;
          }
          .item-desc {
            font-size: 0.82rem;
            line-height: 1.4;
          }
          .item-footer-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            margin-top: 0.5rem;
          }
          .activate-hebel-btn {
            font-size: 0.8rem;
            padding: 0.4rem 0.75rem;
            background-color: #f1f5f9;
            border-radius: 8px;
            text-align: center;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          .nba-pillar {
            align-self: flex-start;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
