'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HabitApp {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  stats: {
    label: string;
    value: string;
    change?: string;
  }[];
  sessions: {
    date: string;
    duration: string;
    score?: number;
  }[];
}

const habitApps: HabitApp[] = [
  {
    id: 'breath',
    title: 'Breath',
    icon: 'bi-wind',
    description: 'Atemübungen für Entspannung und Fokus',
    color: '#4C99C2',
    gradient: 'linear-gradient(135deg, #4C99C2, #A0C9DE)',
    stats: [
      { label: 'Diese Woche', value: '12 Sessions', change: '+3' },
      { label: 'Durchschnitt', value: '8 Min', change: '+2 Min' },
      { label: 'Streak', value: '5 Tage', change: '🔥' },
    ],
    sessions: [
      { date: 'Heute', duration: '10 Min', score: 95 },
      { date: 'Gestern', duration: '8 Min', score: 88 },
      { date: 'Mo, 15.01', duration: '12 Min', score: 92 },
      { date: 'So, 14.01', duration: '6 Min', score: 85 },
    ],
  },
  {
    id: 'meditation',
    title: 'Meditation',
    icon: 'bi-flower1',
    description: 'Achtsamkeit und mentale Klarheit',
    color: '#006EA7',
    gradient: 'linear-gradient(135deg, #006EA7, #4C99C2)',
    stats: [
      { label: 'Diese Woche', value: '8 Sessions', change: '+2' },
      { label: 'Durchschnitt', value: '15 Min', change: '+5 Min' },
      { label: 'Streak', value: '7 Tage', change: '🔥' },
    ],
    sessions: [
      { date: 'Heute', duration: '20 Min', score: 98 },
      { date: 'Gestern', duration: '15 Min', score: 92 },
      { date: 'Mo, 15.01', duration: '18 Min', score: 95 },
      { date: 'So, 14.01', duration: '12 Min', score: 88 },
    ],
  },
  {
    id: 'brain',
    title: 'Brain',
    icon: 'bi-lightbulb',
    description: 'Kognitive Übungen für mentale Fitness',
    color: '#A0C9DE',
    gradient: 'linear-gradient(135deg, #A0C9DE, #B3E0F0)',
    stats: [
      { label: 'Diese Woche', value: '15 Sessions', change: '+5' },
      { label: 'Durchschnitt', value: '92%', change: '+4%' },
      { label: 'Streak', value: '10 Tage', change: '🔥' },
    ],
    sessions: [
      { date: 'Heute', duration: '25 Min', score: 96 },
      { date: 'Gestern', duration: '20 Min', score: 94 },
      { date: 'Mo, 15.01', duration: '22 Min', score: 91 },
      { date: 'So, 14.01', duration: '18 Min', score: 89 },
    ],
  },
  {
    id: 'relax',
    title: 'Entspannung',
    icon: 'bi-sun',
    description: 'Geführte Entspannungsübungen für Stressabbau',
    color: '#3A8AB8',
    gradient: 'linear-gradient(135deg, #3A8AB8, #7BBDD9)',
    stats: [
      { label: 'Diese Woche', value: '6 Sessions', change: '+2' },
      { label: 'Durchschnitt', value: '12 Min', change: '+3 Min' },
      { label: 'Streak', value: '4 Tage', change: '🔥' },
    ],
    sessions: [
      { date: 'Heute', duration: '15 Min', score: 94 },
      { date: 'Gestern', duration: '12 Min', score: 90 },
      { date: 'Mo, 15.01', duration: '10 Min', score: 88 },
      { date: 'So, 14.01', duration: '8 Min', score: 86 },
    ],
  },
];

export default function MicroHabitsPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleStartSession = (appId: string) => {
    setActiveSession(appId);
    setBreathCount(0);
    setSessionTime(0);
    setBreathPhase('inhale');
    setIsPaused(false);
  };

  const handleCloseSession = () => {
    setActiveSession(null);
    setBreathCount(0);
    setSessionTime(0);
    setIsPaused(false);
  };

  // Breath cycle timer
  useEffect(() => {
    if (activeSession !== 'breath' || isPaused) return;

    const phaseTimers = {
      inhale: 4000,
      hold: 4000,
      exhale: 6000,
    };

    const timer = setTimeout(() => {
      if (breathPhase === 'inhale') {
        setBreathPhase('hold');
      } else if (breathPhase === 'hold') {
        setBreathPhase('exhale');
      } else {
        setBreathPhase('inhale');
        setBreathCount((prev) => prev + 1);
      }
    }, phaseTimers[breathPhase]);

    return () => clearTimeout(timer);
  }, [breathPhase, activeSession, isPaused]);

  // Session time counter
  useEffect(() => {
    if (activeSession !== 'breath' || isPaused) return;

    const timer = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Tief einatmen...';
      case 'hold':
        return 'Atem anhalten...';
      case 'exhale':
        return 'Langsam ausatmen...';
    }
  };

  return (
    <div className="microhabits-container">
      <div className="microhabits-grid">
        {habitApps.map((app) => (
          <div key={app.id} className="microhabit-card">
            <div className="microhabit-card-header" style={{ background: app.gradient }}>
              {(app.id === 'breath' || app.id === 'meditation' || app.id === 'brain') && (
                <div className="microhabit-image">
                  <Image
                    src={`/images/${app.id}.png`}
                    alt={app.title}
                    width={200}
                    height={200}
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      objectFit: 'contain',
                      maxHeight: '180px'
                    }}
                  />
                </div>
              )}
              <div className="microhabit-icon">
                <i className={`bi ${app.icon}`}></i>
              </div>
              <div className="microhabit-title-section">
                <h2>{app.title}</h2>
                <p>{app.description}</p>
              </div>
            </div>

            <div className="microhabit-content">
              <div className="microhabit-sessions">
                <h3>Letzte Sessions</h3>
                <div className="sessions-list">
                  {app.sessions.slice(0, 3).map((session, index) => (
                    <div key={index} className="session-item">
                      <div className="session-date">{session.date}</div>
                      <div className="session-info">
                        <span className="session-duration">{session.duration}</span>
                        {session.score && (
                          <span className="session-score">{session.score}%</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="microhabit-start-btn"
                style={{ background: app.gradient }}
                onClick={() => handleStartSession(app.id)}
              >
                <i className="bi bi-play-fill"></i>
                Jetzt starten
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeSession === 'breath' && (
        <div className="microhabit-session-modal" onClick={handleCloseSession}>
          <div className="session-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="session-modal-close"
              onClick={handleCloseSession}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="session-modal-header">
              <div className="session-modal-icon" style={{ background: 'linear-gradient(135deg, #4498ca, #5aafde)' }}>
                <i className="bi bi-wind"></i>
              </div>
              <h2>Atemübung</h2>
              <p className="session-subtitle">Box Breathing • 4-4-6 Technik</p>
            </div>

            <div className="session-stats-row">
              <div className="session-stat-item">
                <div className="session-stat-label">Zeit</div>
                <div className="session-stat-value">{formatTime(sessionTime)}</div>
              </div>
              <div className="session-stat-item">
                <div className="session-stat-label">Zyklen</div>
                <div className="session-stat-value">{breathCount}</div>
              </div>
              <div className="session-stat-item">
                <div className="session-stat-label">BPM</div>
                <div className="session-stat-value">{breathCount > 0 ? Math.round((breathCount * 60) / sessionTime) : 0}</div>
              </div>
            </div>

            <div className="session-modal-body">
              <div className="breath-animation">
                <div className={`breath-circle ${breathPhase}`}>
                  <div className="breath-inner">
                    <i className="bi bi-wind"></i>
                  </div>
                </div>
                <p className="breath-instruction">{getBreathInstruction()}</p>
                <div className="breath-phase-indicator">
                  <div className={`phase-dot ${breathPhase === 'inhale' ? 'active' : ''}`}></div>
                  <div className={`phase-dot ${breathPhase === 'hold' ? 'active' : ''}`}></div>
                  <div className={`phase-dot ${breathPhase === 'exhale' ? 'active' : ''}`}></div>
                </div>
              </div>

              <div className="session-controls">
                <button 
                  className="session-pause-btn"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  <i className={`bi bi-${isPaused ? 'play' : 'pause'}-fill`}></i>
                  {isPaused ? 'Fortsetzen' : 'Pausieren'}
                </button>
                <button className="session-stop-btn" onClick={handleCloseSession}>
                  <i className="bi bi-check-lg"></i>
                  Beenden
                </button>
              </div>

              <div className="session-tips">
                <h4>💡 Tipps für diese Übung:</h4>
                <ul>
                  <li>Finde eine bequeme Sitzposition</li>
                  <li>Atme durch die Nase ein und durch den Mund aus</li>
                  <li>Konzentriere dich auf deinen Atem</li>
                  <li>5-10 Zyklen sind ideal für den Einstieg</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

