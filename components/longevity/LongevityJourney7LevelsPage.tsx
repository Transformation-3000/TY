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

interface LeaderboardMember {
  rank: number;
  name: string;
  avatar: string;
  trueYearsScore: number;
  level: number;
  levelTitle: string;
  streak: number;
  badges: string[];
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  isCurrentUser?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

// Mock Leaderboard Data - Top 100
const generateLeaderboard = (): LeaderboardMember[] => {
  const names = [
    'MaxPower', 'HealthyLena', 'BioHacker_Tom', 'ZenMaster', 'FitPhil', 
    'VitalVera', 'LongevityLeo', 'WellnessWolf', 'NutriNina', 'SleepKing',
    'MindfulMike', 'EnergyElena', 'StrengthSam', 'BalanceBot', 'RecoveryRex',
    'OptimumOli', 'PeakPetra', 'FlowFrank', 'GlowGabi', 'VitalViktor',
    'HealthHero', 'BioBoost', 'MindBody', 'WellWise', 'FitFocus',
    'ZenZara', 'PowerPete', 'NutriNerd', 'SleepSage', 'StretchSteve'
  ];
  
  const levelTitles = ['Explorer', 'Builder', 'Optimizer', 'Integrator', 'Architect', 'Elite', 'Legacy'];
  const badgeOptions = ['●', '●', '●', '●', '●', '●', '●', '●', '●', '●'];
  
  return Array.from({ length: 100 }, (_, i) => {
    const score = Math.max(98.5 - (i * 0.8) + (Math.random() * 0.5 - 0.25), 15);
    const level = Math.min(7, Math.max(1, Math.ceil(score / 14.3)));
    const numBadges = Math.max(1, Math.floor((100 - i) / 15));
    const selectedBadges = badgeOptions.slice(0, numBadges);
    
    return {
      rank: i + 1,
      name: i === 23 ? 'Du' : names[i % names.length] + (i >= names.length ? `_${Math.floor(i / names.length)}` : ''),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i === 23 ? 'currentuser' : `user${i}`}`,
      trueYearsScore: Math.round(score * 10) / 10,
      level,
      levelTitle: levelTitles[level - 1],
      streak: Math.max(1, Math.floor((100 - i) / 3) + Math.floor(Math.random() * 10)),
      badges: selectedBadges,
      trend: i < 20 ? 'up' : i < 50 ? 'stable' : 'down',
      trendValue: Math.floor(Math.random() * 5) + 1,
      isCurrentUser: i === 23
    };
  });
};

const leaderboardData = generateLeaderboard();

// Achievements/Badges System
const achievements: Achievement[] = [
  { id: 'first-week', title: 'Erste Woche', description: '7 Tage in Folge aktiv', icon: 'bi-calendar-check', color: '#7FD049', unlocked: true },
  { id: 'habit-master', title: 'Habit Master', description: '30 Habits abgeschlossen', icon: 'bi-check2-all', color: '#4C99C2', unlocked: true },
  { id: 'data-driven', title: 'Data Driven', description: 'Wearable 30 Tage verbunden', icon: 'bi-smartwatch', color: '#006EA7', unlocked: true },
  { id: 'bio-hacker', title: 'Bio-Hacker', description: '5 Experimente erfolgreich', icon: 'bi-lightning', color: '#00CED1', unlocked: true },
];

const journeyLevels: JourneyLevel[] = [
  {
    id: 'explorer',
    level: 1,
    title: 'Explorer',
    subtitle: 'Orientierung & Erste Quick Wins',
    scoreRange: 'L1: 0–15',
    description: 'Du beginnst deine Longevity-Reise und lernst die Grundlagen kennen.',
    criteria: [
      'Onboarding abgeschlossen (Profil & Fragebogen)',
      'Wearable erfolgreich verbunden (Apple Watch, Garmin, Oura etc.)',
      'Erste Micro-Habit-Session absolviert (z. B. Breathwork)',
    ],
    unlocks: [
      'Erste Trainings-Module in Lisa AI freigeschaltet',
      'Zugang zu den Micro-Habit-Apps',
    ],
    status: 'completed',
    color: '#10B981', // green for completed L1
    icon: 'bi-binoculars',
  },
  {
    id: 'builder',
    level: 2,
    title: 'Builder',
    subtitle: 'Routine & Konsistenz gestartet',
    scoreRange: 'L2: 16–30',
    description: 'Du etablierst Routinen und baust Konsistenz auf – die Grundlage für langfristigen Erfolg.',
    criteria: [
      'Lisa AI Daily Training: 5 Tage Check-in Streak',
      'Lisa AI Weekly Training: Erste Session abgeschlossen',
      'Mindestens 1 Habit-App aktiv genutzt (3+ Sessions)',
    ],
    unlocks: [
      'Ausführliches wöchentliches Plan-Feedback',
      'Zusätzliche Masterclasses freigeschaltet',
    ],
    status: 'completed',
    color: '#059669', // green for completed L2
    icon: 'bi-layers-half',
  },
  {
    id: 'optimizer',
    level: 3,
    title: 'Optimizer',
    subtitle: 'Feedback-Loop mit Daten',
    scoreRange: 'L3: 31–45',
    description: 'Du nutzt Daten, um gezielt zu optimieren und erste Experimente durchzuführen.',
    criteria: [
      'Tägliche Wearable-Synchronisation aktiv',
      'Lisa AI Weekly: Erste Schlaf-Optimierung gestartet',
      '1 Community-Experiment aktiv (z. B. Koffein-Cutoff)',
      'Mindestens 1 Vitalwert (z. B. HRV) zeigt stabilen Trend',
    ],
    unlocks: [
      'Detaillierte Analyse-Dashboards',
      'Community-Experiment-Library freigeschaltet',
      'Monatliche Health-Score-Auswertungen',
    ],
    status: 'current',
    color: '#EAB308', // vibrant amber/gold
    icon: 'bi-sliders',
  },
  {
    id: 'integrator',
    level: 4,
    title: 'Integrator',
    subtitle: 'System statt Hacks',
    scoreRange: 'L4: 46–60',
    description: 'Du verstehst, wie alle Bereiche zusammenwirken und baust ein ganzheitliches System auf.',
    criteria: [
      'Ersten Monatsreport analysiert & Next Best Actions umgesetzt',
      'Mindestens 2 Habits mit 10+ Tagen Streak',
      'An einer aktiven Community-Challenge teilgenommen',
    ],
    unlocks: [
      'Monatlicher Detailreport & Biomarker-Vorschau',
      'Priorisierungs-Matrix für deinen Tagesplan',
    ],
    status: 'upcoming',
    color: '#3B82F6', // vibrant blue
    icon: 'bi-diagram-3',
  },
  {
    id: 'architect',
    level: 5,
    title: 'Architect',
    subtitle: 'Biomarker & individuelle Protokolle',
    scoreRange: 'L5: 61–75',
    description: 'Du nutzt Lab-Daten, um personalisierte Protokolle zu entwickeln.',
    criteria: [
      'Lab-Analyse durchgeführt (Zellstatus Moleqlar / Balance Lifespin)',
      'Persönliches Supplement-Protokoll im System hinterlegt',
      'Lisa AI Quarterly Review erfolgreich abgeschlossen',
    ],
    unlocks: [
      'Automatische Lab-Dateninterpretation',
      'Personalisierte Action-Plans basierend auf Biomarkern',
    ],
    status: 'upcoming',
    color: '#6366F1', // indigo
    icon: 'bi-clipboard-data',
  },
  {
    id: 'elite',
    level: 6,
    title: 'Elite',
    subtitle: 'Performance auf hohem Niveau',
    scoreRange: 'L6: 76–90',
    description: 'Du hältst ein hohes Performance- und Longevity-Niveau stabil.',
    criteria: [
      'Schlaf-Score Ø > 80% über 14 Tage gehalten',
      'Konsistente Aktivitätsdaten (Ø 7.500+ Schritte pro Woche)',
      'Mindestens 3 Experimente erfolgreich beendet',
    ],
    unlocks: [
      'Advanced Trainingsblöcke und HRV-Tiefenanalysen',
      'Zutritt zum exklusiven Beta-Feature: Digital Twin Predictor',
    ],
    status: 'upcoming',
    color: '#8B5CF6', // violet
    icon: 'bi-trophy',
  },
  {
    id: 'legacy',
    level: 7,
    title: 'Legacy',
    subtitle: 'Vorbild & Lifespan',
    scoreRange: 'L7: 91–100',
    description: 'Du lebst nachhaltige Longevity und kannst andere anleiten.',
    criteria: [
      'Langfristige Stabilität des biologischen Alters nachgewiesen',
      'Aktiver Mentor im Community-Leaderboard',
      'Eigene Best-Practice-Protokolle mit der Community geteilt',
    ],
    unlocks: [
      'Invite-Only Circle & Zutritt zu Expertengremien',
      'Ambassador- & Mentor-Status in der Community',
    ],
    status: 'upcoming',
    color: '#EC4899', // pink
    icon: 'bi-infinity',
  },
];

export default function LongevityJourney7LevelsPage() {
  const [activeLevel, setActiveLevel] = useState<string | null>('optimizer');
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'leaderboard' | 'achievements'>('journey');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'friends' | 'level'>('all');
  const currentLevel = journeyLevels.find(l => l.status === 'current') || journeyLevels[0];
  const currentLevelIndex = journeyLevels.findIndex(l => l.id === currentLevel.id);
  const progressPercentage = ((currentLevelIndex + 1) / journeyLevels.length) * 100;
  
  // Current user data
  const currentUser = leaderboardData.find(m => m.isCurrentUser)!;
  const userTrueYears = 36; // Fixed score for Level 3
  const userStreak = currentUser.streak;
  const userRank = currentUser.rank;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

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
          <h1 className="journey-title journey-title-single">
            Deine Longevity-Journey
          </h1>
          <p className="journey-subtitle">
            Du befindest dich aktuell in Level 3 (31–45 Punkte).<br />Wie du weiter aufsteigen kannst.
          </p>
        </div>

        {/* True Years Score Hero Card */}
        <div className="true-years-hero-card">
          <div className="true-years-glow"></div>
          <div className="true-years-content">
            <div className="true-years-main-horizontal">
              <div className="true-years-details-horizontal">
                <h3>Aktueller Fortschritt</h3>
                <div className="true-years-meta-horizontal">
                  <div className="meta-item">
                    <i className="bi bi-graph-up-arrow" style={{ marginRight: '6px' }}></i>
                    <span>+2.3 letzte 30 Tage</span>
                  </div>
                  <div className="meta-item highlight">
                    <i className="bi bi-trophy" style={{ marginRight: '6px' }}></i>
                    <span>Rang #{userRank} von 100</span>
                  </div>
                </div>
              </div>
              
              <div className="journey-progress-timeline-container">
                <div className="timeline-track-wrapper">
                  <div className="timeline-track">
                    <div className="timeline-fill" style={{ width: `${userTrueYears}%` }}></div>
                    <div className="timeline-marker" style={{ left: `${userTrueYears}%` }}>
                      <div className="timeline-tooltip">
                        <span className="tooltip-score">{userTrueYears}</span>
                        <div className="tooltip-arrow"></div>
                      </div>
                      <div className="timeline-dot"></div>
                    </div>
                  </div>
                </div>
                <div className="timeline-labels">
                  <span className="timeline-min">1</span>
                  <span className="timeline-max">100</span>
                </div>
              </div>
            </div>
            
            {/* Gamification Quick Stats */}
            <div className="gamification-stats">
              <div className="gam-stat">
                <div className="gam-stat-icon level">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 17H9V21H3V17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12H15V21H9V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 7H21V21H15V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="18" cy="4" r="2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="gam-stat-info">
                  <span className="gam-stat-value">Level {currentLevel.level}</span>
                  <span className="gam-stat-label">{currentLevel.title}</span>
                </div>
              </div>
              <div className="gam-stat">
                <div className="gam-stat-icon fire">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C12 14 10 16 10 18C10 20 11 22 12 22C13 22 14 20 14 18C14 16 12 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 10C6 11 5 13 5 15C5 18 7.5 21 12 21C16.5 21 19 18 19 15C19 13 18 11 16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="gam-stat-info">
                  <span className="gam-stat-value">{userStreak}</span>
                  <span className="gam-stat-label">Tage Streak</span>
                </div>
              </div>
              <div className="gam-stat">
                <div className="gam-stat-icon rank">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="17" cy="7" r="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 21V17C5 15.3431 6.34315 14 8 14H10C11.6569 14 13 15.3431 13 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M15 21V18C15 16.8954 15.8954 16 17 16C18.1046 16 19 16.8954 19 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="gam-stat-info">
                  <span className="gam-stat-value">Top {Math.ceil((userRank / 100) * 100)}%</span>
                  <span className="gam-stat-label">Community</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="journey-tabs">
          <button 
            className={`journey-tab ${activeTab === 'journey' ? 'active' : ''}`}
            onClick={() => setActiveTab('journey')}
          >
            <i className="bi bi-map"></i>
            <span>Journey</span>
          </button>
          <button 
            className={`journey-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            <i className="bi bi-trophy"></i>
            <span>Top 100</span>
            <div className="tab-badge">Live</div>
          </button>
          <button 
            className={`journey-tab ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            <i className="bi bi-award"></i>
            <span>Badges</span>
            <div className="tab-badge achievement">{unlockedAchievements}</div>
          </button>
        </div>
      </header>

      {/* Main Content Area - Conditional based on active tab */}
      <main className="journey-main-content">
        
        {/* Journey Path Tab */}
        {activeTab === 'journey' && (
          <div className="journey-path-container">
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
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      // @ts-ignore
                      '--level-color': level.color
                    }}
                    onClick={() => setActiveLevel(isActive ? null : level.id)}
                  >
                    {/* Node Marker on Path */}
                    <div 
                      className="node-marker"
                    >
                      <i className={`bi ${getStatusIcon(level.status)}`}></i>
                      {level.status === 'current' && <div className="node-pulse"></div>}
                    </div>

                    {/* Node Content Card */}
                    <div 
                      className={`node-card ${isVisible ? 'visible' : ''}`}
                      style={{ 
                        animationDelay: `${index * 0.15 + 0.3}s`
                      }}
                    >
                      <div className="node-card-header">
                        <div className="node-icon">
                          <i className={`bi ${level.icon}`}></i>
                        </div>
                        <div className="node-title-group">
                          <span className="node-level-badge">
                            Level {level.level}
                          </span>
                          <h3 className="node-title">{level.title}</h3>
                          <p className="node-subtitle">{level.subtitle}</p>
                        </div>
                        {level.status === 'completed' && (
                          <div className="node-check">
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
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="leaderboard-container">
            {/* Leaderboard Header */}
            <div className="leaderboard-header">
              <div className="leaderboard-title-section">
                <h2>
                  <i className="bi bi-trophy-fill"></i>
                  True Years Top 100
                </h2>
                <p>Die aktivsten Mitglieder unserer Community – ranked nach True Years Score</p>
              </div>
              <div className="leaderboard-filters">
                <button 
                  className={`filter-btn ${leaderboardFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setLeaderboardFilter('all')}
                >
                  <i className="bi bi-globe"></i>
                  Alle
                </button>
                <button 
                  className={`filter-btn ${leaderboardFilter === 'friends' ? 'active' : ''}`}
                  onClick={() => setLeaderboardFilter('friends')}
                >
                  <i className="bi bi-people"></i>
                  Freunde
                </button>
                <button 
                  className={`filter-btn ${leaderboardFilter === 'level' ? 'active' : ''}`}
                  onClick={() => setLeaderboardFilter('level')}
                >
                  <i className="bi bi-layers"></i>
                  Mein Level
                </button>
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="leaderboard-podium">
              {/* Second Place */}
              <div className="podium-place second">
                <div className="podium-avatar-container">
                  <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} className="podium-avatar" />
                  <div className="podium-rank-badge">2</div>
                </div>
                <div className="podium-info">
                  <span className="podium-name">{leaderboardData[1].name}</span>
                  <span className="podium-score">{leaderboardData[1].trueYearsScore}</span>
                  <span className="podium-level">Level {leaderboardData[1].level}</span>
                </div>
                <div className="podium-pedestal second">
                  <i className="bi bi-award"></i>
                </div>
              </div>

              {/* First Place */}
              <div className="podium-place first">
                <div className="podium-crown">
                  <i className="bi bi-trophy-fill"></i>
                </div>
                <div className="podium-avatar-container">
                  <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} className="podium-avatar" />
                  <div className="podium-rank-badge gold">1</div>
                </div>
                <div className="podium-info">
                  <span className="podium-name">{leaderboardData[0].name}</span>
                  <span className="podium-score">{leaderboardData[0].trueYearsScore}</span>
                  <span className="podium-level">Level {leaderboardData[0].level}</span>
                </div>
                <div className="podium-pedestal first">
                  <i className="bi bi-trophy-fill"></i>
                </div>
              </div>

              {/* Third Place */}
              <div className="podium-place third">
                <div className="podium-avatar-container">
                  <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} className="podium-avatar" />
                  <div className="podium-rank-badge">3</div>
                </div>
                <div className="podium-info">
                  <span className="podium-name">{leaderboardData[2].name}</span>
                  <span className="podium-score">{leaderboardData[2].trueYearsScore}</span>
                  <span className="podium-level">Level {leaderboardData[2].level}</span>
                </div>
                <div className="podium-pedestal third">
                  <i className="bi bi-award"></i>
                </div>
              </div>
            </div>

            {/* Your Position Highlight */}
            <div className="your-position-card">
              <div className="your-position-glow"></div>
              <div className="your-position-content">
                <div className="your-position-left">
                  <div className="your-rank">
                    <span className="rank-hash">#</span>
                    <span className="rank-number">{userRank}</span>
                  </div>
                  <img src={currentUser.avatar} alt="Du" className="your-avatar" />
                  <div className="your-info">
                    <span className="your-name">Du</span>
                    <span className="your-level">{currentUser.levelTitle} · Level {currentUser.level}</span>
                  </div>
                </div>
                <div className="your-position-right">
                  <div className="your-score">
                    <span className="score-value">{userTrueYears}</span>
                    <span className="score-unit">True Years</span>
                  </div>
                  <div className="your-badges">
                    {currentUser.badges.map((badge, idx) => (
                      <span key={idx} className="badge-emoji">{badge}</span>
                    ))}
                  </div>
                  <div className="your-streak">
                    <i className="bi bi-fire"></i>
                    <span>{userStreak} Tage</span>
                  </div>
                </div>
              </div>
              <div className="position-hint">
                <i className="bi bi-arrow-up-circle"></i>
                <span>Noch {(leaderboardData[userRank - 2]?.trueYearsScore - userTrueYears).toFixed(1)} Punkte bis Rang {userRank - 1}</span>
              </div>
            </div>

            {/* Leaderboard List */}
            <div className="leaderboard-list">
              {leaderboardData.slice(3).map((member, idx) => (
                <div 
                  key={member.rank}
                  className={`leaderboard-row ${member.isCurrentUser ? 'current-user' : ''}`}
                  style={{ animationDelay: `${idx * 0.02}s` }}
                >
                  <div className="row-rank">
                    <span className="rank-number">{member.rank}</span>
                    {member.trend === 'up' && (
                      <span className="trend-indicator up">
                        <i className="bi bi-caret-up-fill"></i>
                        {member.trendValue}
                      </span>
                    )}
                    {member.trend === 'down' && (
                      <span className="trend-indicator down">
                        <i className="bi bi-caret-down-fill"></i>
                        {member.trendValue}
                      </span>
                    )}
                    {member.trend === 'stable' && (
                      <span className="trend-indicator stable">
                        <i className="bi bi-dash"></i>
                      </span>
                    )}
                  </div>
                  
                  <div className="row-user">
                    <img src={member.avatar} alt={member.name} className="row-avatar" />
                    <div className="row-user-info">
                      <span className="row-name">{member.name}</span>
                      <span className="row-level">Level {member.level} · {member.levelTitle}</span>
                    </div>
                  </div>
                  
                  <div className="row-badges">
                    {member.badges.slice(0, 3).map((badge, i) => (
                      <span key={i} className="row-badge">{badge}</span>
                    ))}
                    {member.badges.length > 3 && (
                      <span className="row-badge-more">+{member.badges.length - 3}</span>
                    )}
                  </div>
                  
                  <div className="row-streak">
                    <i className="bi bi-fire"></i>
                    <span>{member.streak}</span>
                  </div>
                  
                  <div className="row-score">
                    <span className="score-main">{member.trueYearsScore}</span>
                    <span className="score-label">TY</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="achievements-container">
            <div className="achievements-header">
              <h2>
                <i className="bi bi-award-fill"></i>
                Deine Badges & Achievements
              </h2>
              <p>Sammle Badges durch Konsistenz, Meilensteine und besondere Leistungen</p>
              <div className="achievements-summary">
                <div className="summary-stat">
                  <span className="summary-value">{unlockedAchievements}</span>
                  <span className="summary-label">Freigeschaltet</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-value">{achievements.length - unlockedAchievements}</span>
                  <span className="summary-label">In Arbeit</span>
                </div>
                <div className="summary-stat">
                  <span className="summary-value">{Math.round((unlockedAchievements / achievements.length) * 100)}%</span>
                  <span className="summary-label">Komplett</span>
                </div>
              </div>
            </div>

            <div className="achievements-grid">
              {achievements.map((achievement, idx) => (
                <div 
                  key={achievement.id}
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div 
                    className="achievement-icon"
                    style={{ 
                      // @ts-ignore
                      '--badge-color': achievement.color
                    }}
                  >
                    <i className={`bi ${achievement.icon}`}></i>
                    {achievement.unlocked && (
                      <div className="achievement-unlocked-badge">
                        <i className="bi bi-check"></i>
                      </div>
                    )}
                  </div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="achievement-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ 
                              width: `${(achievement.progress / (achievement.maxProgress || 1)) * 100}%`,
                              backgroundColor: achievement.color
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <div className="achievement-earned">
                      <i className="bi bi-patch-check-fill" style={{ color: achievement.color }}></i>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Upcoming Achievements Teaser */}
            <div className="achievements-teaser">
              <div className="teaser-icon">
                <i className="bi bi-stars"></i>
              </div>
              <div className="teaser-content">
                <h4>Mehr Badges kommen!</h4>
                <p>Wir arbeiten an neuen Achievements für Saison-Events, Community-Challenges und besondere Meilensteine.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Info */}
      <footer className="journey-footer">
        <div className="journey-info-banner">
          <div className="info-banner-icon">
            <i className="bi bi-lightbulb"></i>
          </div>
          <div className="info-banner-content">
            <h4>Aufstieg durch Konsistenz</h4>
            <p>Regelmäßige Check-Ins, Trainings und erfolgreiche Tests bringen dich zum nächsten Level.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
