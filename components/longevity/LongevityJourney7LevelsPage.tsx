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
  { id: 'early-bird', title: 'Early Bird', description: '14x vor 6 Uhr aufgestanden', icon: 'bi-sunrise', color: '#FFD700', unlocked: false, progress: 9, maxProgress: 14 },
  { id: 'sleep-champion', title: 'Sleep Champion', description: '7 Tage optimaler Schlaf', icon: 'bi-moon-stars', color: '#9B59B6', unlocked: false, progress: 4, maxProgress: 7 },
  { id: 'marathon', title: 'Marathon', description: '100 Tage Streak', icon: 'bi-fire', color: '#E74C3C', unlocked: false, progress: 42, maxProgress: 100 },
  { id: 'community-star', title: 'Community Star', description: '10 Mitglieder inspiriert', icon: 'bi-people', color: '#FF6B35', unlocked: false, progress: 3, maxProgress: 10 },
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
  const [activeTab, setActiveTab] = useState<'journey' | 'leaderboard' | 'achievements'>('journey');
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'friends' | 'level'>('all');
  const currentLevel = journeyLevels.find(l => l.status === 'current') || journeyLevels[0];
  const currentLevelIndex = journeyLevels.findIndex(l => l.id === currentLevel.id);
  const progressPercentage = ((currentLevelIndex + 1) / journeyLevels.length) * 100;
  
  // Current user data
  const currentUser = leaderboardData.find(m => m.isCurrentUser)!;
  const userTrueYears = currentUser.trueYearsScore;
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

        {/* True Years Score Hero Card */}
        <div className="true-years-hero-card">
          <div className="true-years-glow"></div>
          <div className="true-years-content">
            <div className="true-years-main">
              <div className="true-years-score-container">
                <div className="true-years-ring">
                  <svg viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7FD049" />
                        <stop offset="50%" stopColor="#4C99C2" />
                        <stop offset="100%" stopColor="#9B59B6" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      fill="none" 
                      stroke="url(#scoreGradient)" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={`${(userTrueYears / 100) * 339.3} 339.3`}
                      transform="rotate(-90 60 60)"
                      className="score-ring-progress"
                    />
                  </svg>
                  <div className="true-years-value">
                    <span className="score-number">{userTrueYears}</span>
                    <span className="score-label">True Years</span>
                  </div>
                </div>
              </div>
              
              <div className="true-years-details">
                <h3>Dein True Years Score</h3>
                <p className="true-years-explanation">
                  Dein biologisches Alter im Vergleich zu deinem chronologischen Alter – je höher, desto jünger!
                </p>
                <div className="true-years-meta">
                  <div className="meta-item">
                    <i className="bi bi-graph-up-arrow"></i>
                    <span>+2.3 letzte 30 Tage</span>
                  </div>
                  <div className="meta-item highlight">
                    <i className="bi bi-trophy"></i>
                    <span>Rang #{userRank} von 100</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Gamification Quick Stats */}
            <div className="gamification-stats">
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
                  <span className="gam-stat-value">L{currentLevel.level}</span>
                  <span className="gam-stat-label">{currentLevel.title}</span>
                </div>
              </div>
              <div className="gam-stat">
                <div className="gam-stat-icon achievements">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L14.4 8.2L21 9L16 13.5L17.5 20L12 17L6.5 20L8 13.5L3 9L9.6 8.2L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="gam-stat-info">
                  <span className="gam-stat-value">{unlockedAchievements}/{achievements.length}</span>
                  <span className="gam-stat-label">Badges</span>
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
                      backgroundColor: achievement.unlocked ? `${achievement.color}20` : 'rgba(0,0,0,0.05)',
                      color: achievement.unlocked ? achievement.color : '#9ca3af'
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
            <p>Regelmäßige Check-Ins, Coachings und erfolgreiche Tests bringen dich zum nächsten Level.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
