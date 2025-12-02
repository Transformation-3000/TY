'use client';

import { useState } from 'react';

interface JourneyLevel {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  actions: string[];
  status: 'completed' | 'current' | 'upcoming';
  width: number;
  color: string;
}

const journeyLevels: JourneyLevel[] = [
  {
    id: 'basics',
    title: 'Level 1 · Basics',
    subtitle: 'Fundament & Lifestyle',
    description: 'Schlaf, Stress, Ernährung und Bewegung bilden die Basis deiner Longevity-Reise.',
    highlights: [
      'Schlafscore > 80%',
      'Tägliche Bewegung etabliert',
      'Micro Habits implementiert',
    ],
    actions: [
      'Schlaftracking aktiv halten',
      'Blue-Light-Routine am Abend',
      'Mindestens 7.000 Schritte pro Tag',
    ],
    status: 'completed',
    width: 100,
    color: '#B3E0F0',
  },
  {
    id: 'diagnostics',
    title: 'Level 2 · Diagnostics',
    subtitle: 'Screenings & Biomarker',
    description: 'Labordaten, Wearables und AI-Coaches liefern deinen biologischen Status.',
    highlights: [
      'Quarterly Check-ups',
      'Blutpanel & Hormone',
      'Stress- & Recovery-Daten',
    ],
    actions: [
      'Biomarker Dashboard aktualisieren',
      'Wearables synchronisieren',
      'Coach Feedback umsetzen',
    ],
    status: 'completed',
    width: 85,
    color: '#4C99C2',
  },
  {
    id: 'protocols',
    title: 'Level 3 · Protocols',
    subtitle: 'Personalisierte Programme',
    description: 'Lifestyle-Protokolle werden mit Supplements, Mikronährstoffen und Routinen kombiniert.',
    highlights: [
      'Individualisierte Supplement-Stacks',
      'Ernährungsperiodisierung',
      'Neuromuskuläre Routinen',
    ],
    actions: [
      'Supplements-Plan überprüfen',
      'Flow Sessions integrieren',
      'Erste Sauna/Kältezyklen',
    ],
    status: 'current',
    width: 70,
    color: '#006EA7',
  },
  {
    id: 'advanced-therapies',
    title: 'Level 4 · Advanced Therapies',
    subtitle: 'Regeneration & Longevity Labs',
    description: 'Infusionen, Peptide, regenerative Medizin und Deep Diagnostics.',
    highlights: [
      'Peptid-Zyklen',
      'AI-gestützte Therapieplanung',
      'Longevity Labs Check-ins',
    ],
    actions: [
      'Planung mit Medical Advisor',
      'Therapiezyklen terminieren',
      'Budgets & Recovery planen',
    ],
    status: 'upcoming',
    width: 55,
    color: '#7FD049',
  },
  {
    id: 'highend',
    title: 'Level 5 · High-End Therapie',
    subtitle: 'Future Tech & Biological Reversal',
    description: 'Cell Reprogramming, Exosome-Therapie, AI-Zwillinge und Full Stack Medicine.',
    highlights: [
      'Biological Age Reversal',
      'Digital Twin Medical Board',
      'Vollintegrierte Therapiekette',
    ],
    actions: [
      'Gold Paket & Medical Board',
      '360° Longevity Retreats',
      'Mentoring & Impact Projekte',
    ],
    status: 'upcoming',
    width: 40,
    color: '#222F3E',
  },
];

const currentLevelId = journeyLevels.find((level) => level.status === 'current')?.id ?? journeyLevels[0].id;

export default function LongevityJourneyPyramidPage() {
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const displayLevels = [...journeyLevels].slice().reverse();
  
  const completedCount = journeyLevels.filter(l => l.status === 'completed').length;
  const totalLevels = journeyLevels.length;
  const progressPercentage = (completedCount / totalLevels) * 100;

  return (
    <div className="pyramid-journey-container">
      <div className="pyramid-progress-header">
        <div className="pyramid-progress-info">
          <h2>Deine Longevity Reise</h2>
          <p>{completedCount}/{totalLevels} Stufen aktiv</p>
        </div>
        <div className="pyramid-progress-bar">
          <div 
            className="pyramid-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          >
            <span className="pyramid-progress-text">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>
      <div className="pyramid-stack">
        {displayLevels.map((level) => {
          const orderIndex = journeyLevels.length - journeyLevels.findIndex((l) => l.id === level.id);
          const isActive = activeLevel === level.id;
          const handleClick = () => {
            setActiveLevel((prev) => (prev === level.id ? null : level.id));
          };

          return (
            <div
              key={level.id}
              className={`pyramid-level ${level.status} ${isActive ? 'active' : ''}`}
              style={{
                width: `${level.width}%`,
                zIndex: orderIndex,
                background: `linear-gradient(135deg, ${level.color}, ${
                  level.status === 'completed' ? '#92c7d9' : level.status === 'current' ? '#219ebc' : '#d9d9d9'
                })`,
              }}
              onClick={handleClick}
              role="button"
            >
              <div className="pyramid-level-content">
                {level.status === 'completed' && (
                  <div className="pyramid-completed-badge">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                )}
                <span className="pyramid-level-number">{orderIndex}</span>
                <div className="pyramid-text">
                  <strong>{level.subtitle}</strong>
                  <p>{level.title}</p>
                </div>
                <div className="pyramid-level-actions">
                  {level.status === 'completed' && (
                    <span className="pyramid-level-chip completed-chip">
                      <i className="bi bi-check-circle-fill"></i>
                      Aktiv in deinem Alltag
                    </span>
                  )}
                  {level.status === 'current' && (
                    <span className="pyramid-level-chip">
                      <i className="bi bi-bolt-fill"></i>
                      Aktuelle Stufe
                    </span>
                  )}
                  <i className={`bi ${isActive ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </div>
              </div>
              {isActive && (
                <div className="pyramid-level-details">
                  <div className="level-status-chip">
                    <i className="bi bi-bolt"></i>{' '}
                    {level.status === 'current'
                      ? 'Aktuelle Stufe'
                      : level.status === 'completed'
                      ? 'Schon Teil deines Alltags'
                      : 'Als nächstes'}
                  </div>
                  <p className="level-description">{level.description}</p>

                  <div className="level-block">
                    <h3>
                      <i className="bi bi-stars"></i> Highlights
                    </h3>
                    <ul>
                      {level.highlights.map((item, idx) => (
                        <li key={idx} className={level.status === 'completed' ? 'completed-item' : ''}>
                          <i className={`bi ${level.status === 'completed' ? 'bi-check-circle-fill completed-check' : 'bi-check-circle'}`}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="level-block">
                    <h3>
                      <i className="bi bi-list-check"></i> {level.status === 'completed' ? 'Erreichte Ziele' : 'Next Steps'}
                    </h3>
                    <ul>
                      {level.actions.map((item, idx) => (
                        <li key={idx} className={level.status === 'completed' ? 'completed-item' : ''}>
                          <i className={`bi ${level.status === 'completed' ? 'bi-check-circle-fill completed-check' : 'bi-arrow-right-circle'}`}></i>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="pyramid-legend">
        <span>
          <i className="status-dot completed"></i> Completed
        </span>
        <span>
          <i className="status-dot current"></i> Current
        </span>
        <span>
          <i className="status-dot upcoming"></i> Upcoming
        </span>
      </div>
    </div>
  );
}

