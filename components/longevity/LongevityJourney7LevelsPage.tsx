'use client';

import { useState, useEffect } from 'react';

interface JourneyLevel {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  scoreRange: string;
  description: string;
  criteria: string[];
  unlocks: string[];
  status: 'completed' | 'current' | 'upcoming';
  color: string;
  icon: string;
}

const journeyLevels: JourneyLevel[] = [
  {
    id: 'explorer',
    level: 1,
    title: 'Explorer',
    subtitle: 'Orientierung & Erste Quick Wins',
    scoreRange: 'L1: 0–15',
    description: 'Du beginnst deine Longevity-Reise und lernst die Grundlagen kennen.',
    criteria: [
      'Onboarding abgeschlossen (Fragebogen + Wearable optional)',
      '7-Tage-Resets mind. 5/7 Tagen eingecheckt',
      '1 Micro-Habit-Apps 10× gemacht',
    ],
    unlocks: [
      'Die erste Masterclass Foundation wird freigeschaltet',
    ],
    status: 'completed',
    color: '#7FD049',
    icon: 'bi-compass',
  },
  {
    id: 'builder',
    level: 2,
    title: 'Builder',
    subtitle: 'Routine & Konsistenz gestartet',
    scoreRange: 'L2: 16–30',
    description: 'Du etablierst Routinen und baust Konsistenz auf – die Grundlage für langfristigen Erfolg.',
    criteria: [
      'Habit-Adherence: Ø 4–5 Tage/Woche über 2 Wochen',
      'Wöchentliche Sessions Lisa AI 4× durchgeführt',
    ],
    unlocks: [
      'Weitere Masterclasses werden freigeschaltet',
    ],
    status: 'completed',
    color: '#4C99C2',
    icon: 'bi-bricks',
  },
  {
    id: 'optimizer',
    level: 3,
    title: 'Optimizer',
    subtitle: 'Feedback-Loop mit Daten',
    scoreRange: 'L3: 31–45',
    description: 'Du nutzt Daten, um gezielt zu optimieren und erste Experimente durchzuführen.',
    criteria: [
      'Wearable integriert = Datenquelle aktiv',
      '(Self-Tracking: Schlaf/Energie/Stress täglich)',
      '+2 Experimente erfolgreich abgeschlossen',
      'Mind. 1 KPI zeigt Trend nach oben',
    ],
    unlocks: [
      'Regelmäßige Wearable-Auswertung',
      'Experiment-Library',
      '„Experiment-Vorschlag der Woche"',
    ],
    status: 'current',
    color: '#006EA7',
    icon: 'bi-graph-up-arrow',
  },
  {
    id: 'integrator',
    level: 4,
    title: 'Integrator',
    subtitle: 'System statt Hacks',
    scoreRange: 'L4: 46–60',
    description: 'Du verstehst, wie alle Bereiche zusammenwirken und baust ein ganzheitliches System auf.',
    criteria: [
      'Schlaf + Bewegung + Metabolik + Stress als System',
      'Rückfall-Protokoll vorhanden und angewendet',
    ],
    unlocks: [
      '„Minimum Effective Dose" je Hebel für Alltag',
    ],
    status: 'upcoming',
    color: '#FFD700',
    icon: 'bi-puzzle',
  },
  {
    id: 'architect',
    level: 5,
    title: 'Architect',
    subtitle: 'Biomarker & individuelle Protokolle',
    scoreRange: 'L5: 61–75',
    description: 'Du nutzt Lab-Daten, um personalisierte Protokolle zu entwickeln.',
    criteria: [
      'Labs genutzt',
    ],
    unlocks: [
      'Lab-Interpretation',
      'Action Plans',
      'Protokolle',
    ],
    status: 'upcoming',
    color: '#FF6B35',
    icon: 'bi-building',
  },
  {
    id: 'elite',
    level: 6,
    title: 'Elite',
    subtitle: 'Performance auf hohem Niveau',
    scoreRange: 'L6: 76–90',
    description: 'Du hältst ein hohes Performance- und Longevity-Niveau stabil.',
    criteria: [
      'Stabil hohe Konsistenz',
      'Fortschrittliche Trainings-/Recovery-Steuerung',
      'Geringe Varianz',
    ],
    unlocks: [
      'Advanced Trainingsblöcke',
      'Gezielte Optimierung',
      '„Deep Dives" mit True Years',
    ],
    status: 'upcoming',
    color: '#9B59B6',
    icon: 'bi-trophy',
  },
  {
    id: 'legacy',
    level: 7,
    title: 'Legacy',
    subtitle: 'Vorbild & Healthspan',
    scoreRange: 'L7: 91–100',
    description: 'Du lebst nachhaltige Longevity und kannst andere anleiten.',
    criteria: [
      'Langfristige Stabilität',
      'Eigene Routinen sitzen',
      'Kann andere anleiten (Mentor-Qualität)',
      'Klare persönliche Strategie',
    ],
    unlocks: [
      'Invite-Only Circle',
      'Teilnahme an Expertenrunden',
      'Ambassador-Mentor',
    ],
    status: 'upcoming',
    color: '#E74C3C',
    icon: 'bi-stars',
  },
];

export default function LongevityJourney7LevelsPage() {
  const [activeLevel, setActiveLevel] = useState<string | null>('optimizer');
  const [isVisible, setIsVisible] = useState(false);
  const currentLevel = journeyLevels.find(l => l.status === 'current') || journeyLevels[0];
  const currentLevelIndex = journeyLevels.findIndex(l => l.id === currentLevel.id);
  const progressPercentage = ((currentLevelIndex + 1) / journeyLevels.length) * 100;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bi-check-circle-fill';
      case 'current':
        return 'bi-lightning-charge-fill';
      default:
        return 'bi-lock-fill';
    }
  };

  return (
    <div className="longevity-journey-page">
      {/* Animated Background */}
      <div className="journey-bg-elements">
        <div className="journey-bg-orb journey-bg-orb-1"></div>
        <div className="journey-bg-orb journey-bg-orb-2"></div>
        <div className="journey-bg-orb journey-bg-orb-3"></div>
        <div className="journey-mountain-silhouette"></div>
      </div>

      {/* Header Section */}
      <header className={`journey-hero ${isVisible ? 'visible' : ''}`}>
        <div className="journey-hero-content">
          <div className="journey-badge">
            <i className="bi bi-rocket-takeoff"></i>
            <span>Deine Reise</span>
          </div>
          <h1 className="journey-title">
            <span className="journey-title-line">Longevity</span>
            <span className="journey-title-accent">Journey</span>
          </h1>
          <p className="journey-subtitle">
            7 Stufen zur optimalen Gesundheit – von den ersten Schritten bis zur Meisterschaft
          </p>
        </div>

        {/* Current Progress Card */}
        <div className="journey-progress-card">
          <div className="progress-card-glow"></div>
          <div className="progress-card-content">
            <div className="progress-level-indicator">
              <div 
                className="progress-level-ring"
                style={{ 
                  background: `conic-gradient(${currentLevel.color} ${progressPercentage}%, transparent ${progressPercentage}%)` 
                }}
              >
                <div className="progress-level-inner">
                  <span className="progress-level-number">{currentLevel.level}</span>
                </div>
              </div>
            </div>
            <div className="progress-info">
              <span className="progress-label">Aktuelles Level</span>
              <h3 className="progress-level-name">{currentLevel.title}</h3>
              <p className="progress-level-subtitle">{currentLevel.subtitle}</p>
            </div>
            <div className="progress-stats">
              <div className="progress-stat">
                <span className="stat-value">{currentLevelIndex + 1}</span>
                <span className="stat-label">von 7</span>
              </div>
              <div className="progress-stat">
                <span className="stat-value">{Math.round(progressPercentage)}%</span>
                <span className="stat-label">Fortschritt</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Journey Path */}
      <main className="journey-path-container">
        <div className="journey-path">
          {/* Vertical Line */}
          <div className="journey-vertical-line">
            <div 
              className="journey-line-progress" 
              style={{ height: `${((currentLevelIndex + 1) / journeyLevels.length) * 100}%` }}
            ></div>
          </div>

          {/* Level Nodes */}
          {journeyLevels.map((level, index) => {
            const isActive = activeLevel === level.id;
            const isLeft = index % 2 === 0;
            
            return (
              <div
                key={level.id}
                className={`journey-node ${level.status} ${isActive ? 'active' : ''} ${isLeft ? 'left' : 'right'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveLevel(isActive ? null : level.id)}
              >
                {/* Node Marker on Path */}
                <div 
                  className="node-marker"
                  style={{ backgroundColor: level.status !== 'upcoming' ? level.color : '#d1d5db' }}
                >
                  <i className={`bi ${getStatusIcon(level.status)}`}></i>
                  {level.status === 'current' && <div className="node-pulse"></div>}
                </div>

                {/* Node Content Card */}
                <div 
                  className={`node-card ${isVisible ? 'visible' : ''}`}
                  style={{ 
                    borderColor: level.status !== 'upcoming' ? level.color : 'transparent',
                    animationDelay: `${index * 0.15 + 0.3}s`
                  }}
                >
                  <div className="node-card-header">
                    <div 
                      className="node-icon"
                      style={{ 
                        background: level.status !== 'upcoming' 
                          ? `linear-gradient(135deg, ${level.color}20, ${level.color}40)` 
                          : 'rgba(0,0,0,0.05)',
                        color: level.status !== 'upcoming' ? level.color : '#9ca3af'
                      }}
                    >
                      <i className={`bi ${level.icon}`}></i>
                    </div>
                    <div className="node-title-group">
                      <span className="node-level-badge" style={{ backgroundColor: `${level.color}20`, color: level.color }}>
                        Level {level.level}
                      </span>
                      <h3 className="node-title">{level.title}</h3>
                      <p className="node-subtitle">{level.subtitle}</p>
                    </div>
                    {level.status === 'completed' && (
                      <div className="node-check" style={{ backgroundColor: level.color }}>
                        <i className="bi bi-check-lg"></i>
                      </div>
                    )}
                  </div>

                  {/* Expanded Content */}
                  {isActive && (
                    <div className="node-details">
                      <p className="node-description">{level.description}</p>
                      
                      <div className="node-section">
                        <h4>
                          <i className="bi bi-list-check"></i>
                          Kriterien
                        </h4>
                        <ul>
                          {level.criteria.map((criterion, idx) => (
                            <li key={idx}>
                              <i className={`bi ${level.status === 'completed' ? 'bi-check-circle-fill' : 'bi-circle'}`}
                                style={{ color: level.status === 'completed' ? level.color : '#9ca3af' }}
                              ></i>
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="node-section">
                        <h4>
                          <i className="bi bi-gift"></i>
                          Unlocks
                        </h4>
                        <ul className="unlocks-list">
                          {level.unlocks.map((unlock, idx) => (
                            <li key={idx}>
                              <i className="bi bi-star-fill" style={{ color: level.color }}></i>
                              <span>{unlock}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="node-score-range">
                        <i className="bi bi-bar-chart-line"></i>
                        <span>{level.scoreRange}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Preview (when not expanded) */}
                  {!isActive && (
                    <div className="node-preview">
                      <p>{level.description}</p>
                      <span className="node-expand-hint">
                        <i className="bi bi-chevron-down"></i>
                        Mehr erfahren
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

        </div>
      </main>

      {/* Bottom Info */}
      <footer className="journey-footer">
        <div className="journey-info-banner">
          <div className="info-banner-icon">
            <i className="bi bi-lightbulb"></i>
          </div>
          <div className="info-banner-content">
            <h4>Aufstieg durch Konsistenz</h4>
            <p>Regelmäßige Check-Ins, Coachings und erfolgreiche Tests bringen dich zum nächsten Level.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
