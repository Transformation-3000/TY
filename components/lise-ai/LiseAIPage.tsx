'use client';

import { useState } from 'react';

// SVG Icons als Komponenten
const Icons = {
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  ),
  dna: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6"></path>
      <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"></path>
      <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"></path>
      <path d="M17 6l-2.5-2.5"></path>
      <path d="M14 8l-1.5-1.5"></path>
      <path d="M7 18l2.5 2.5"></path>
      <path d="M10 16l1.5 1.5"></path>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  ),
  microscope: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8"></path>
      <path d="M3 22h18"></path>
      <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
      <path d="M9 14h2"></path>
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path>
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path>
    </svg>
  ),
  footprints: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path>
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path>
      <path d="M16 17h4"></path>
      <path d="M4 13h4"></path>
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10"></line>
      <line x1="18" y1="20" x2="18" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="16"></line>
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    </svg>
  ),
  watch: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6"></circle>
      <polyline points="12 10 12 12 13 13"></polyline>
      <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"></path>
      <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"></path>
    </svg>
  ),
  ring: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8"></circle>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  droplet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path>
    </svg>
  ),
  smartphone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
      <line x1="12" y1="18" x2="12.01" y2="18"></line>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  mic: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2"></rect>
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  ),
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
  ),
};

// Mock Daten die Lisa "sieht"
const userHealthData = {
  longevityScore: 825,
  biologicalAge: 38,
  chronologicalAge: 45,
  sleepScore: 89,
  sleepHours: 7.2,
  stressLevel: 'erhöht',
  hrvTrend: 'fallend',
  steps: 8420,
  activeMinutes: 42,
};

const dataInsights = [
  {
    id: 'sleep',
    category: 'Schlaf',
    icon: 'moon',
    status: 'good',
    title: 'Schlafqualität analysiert',
    insight: 'Deine REM-Phase war 22% länger als letzte Woche. Dein optimales Schlaffenster liegt zwischen 22:30-23:00.',
    dataSource: 'Oura Ring · Letzte 7 Tage',
    metric: '89%',
    metricLabel: 'Schlaf-Score',
  },
  {
    id: 'stress',
    category: 'HRV & Stress',
    icon: 'heart',
    status: 'warning',
    title: 'Stressmuster erkannt',
    insight: 'Deine HRV ist seit Montag um 15% gesunken. Das korreliert mit weniger Bewegung und späterem Einschlafen.',
    dataSource: 'Apple Watch · Echtzeit',
    metric: '↓ 15%',
    metricLabel: 'HRV-Trend',
  },
  {
    id: 'biomarker',
    category: 'Biomarker',
    icon: 'microscope',
    status: 'warning',
    title: 'Vitamin D Optimierung',
    insight: 'Dein Vitamin D liegt bei 28 ng/mL - unter dem optimalen Longevity-Bereich (40-60). Mit Supplementierung könntest du in 8 Wochen optimale Werte erreichen.',
    dataSource: 'Bluttest vom 15.12.2025',
    metric: '28',
    metricLabel: 'ng/mL',
  },
  {
    id: 'activity',
    category: 'Bewegung',
    icon: 'footprints',
    status: 'neutral',
    title: 'Bewegungsanalyse',
    insight: 'Du bist diese Woche 23% weniger aktiv als dein Durchschnitt. 15 Min. zusätzliche Bewegung würde dein biologisches Alter um 0.3 Jahre verbessern können.',
    dataSource: 'Apple Health · Diese Woche',
    metric: '8.4k',
    metricLabel: 'Schritte/Tag',
  },
];

const weeklyFocusTopics = [
  {
    id: 'longevity-review',
    title: 'Wöchentlicher Longevity Check-in',
    description: 'Lass uns deine Fortschritte der letzten Woche besprechen und dein biologisches Alter analysieren.',
    duration: '8-10 Min',
    dataPoints: ['Longevity Score', 'Bio-Age Trend', 'Wochenziele'],
    icon: 'barChart',
    priority: 'recommended',
  },
  {
    id: 'stress-recovery',
    title: 'Stress-Recovery Session',
    description: 'Basierend auf deiner HRV sollten wir über Regeneration sprechen.',
    duration: '5-7 Min',
    dataPoints: ['HRV-Analyse', 'Schlafmuster', 'Recovery-Plan'],
    icon: 'brain',
    priority: 'suggested',
  },
  {
    id: 'biomarker-deep',
    title: 'Biomarker Deep-Dive',
    description: 'Deine letzten Blutwerte zeigen Optimierungspotenzial bei Vitamin D und Cholesterin.',
    duration: '10-12 Min',
    dataPoints: ['Blutbild', 'Supplements', 'Ernährung'],
    icon: 'dna',
    priority: 'optional',
  },
];

const conversationMockup = [
  {
    type: 'lisa',
    message: 'Hallo Anna! Ich habe mir deine Daten der letzten Woche angeschaut.',
    time: '10:02',
  },
  {
    type: 'lisa',
    message: 'Dein Longevity Score liegt bei 825 - das ist gut! Aber mir ist aufgefallen, dass deine HRV seit Montag um 15% gesunken ist. Das könnte mit deinem erhöhten Stresslevel zusammenhängen.',
    time: '10:02',
    dataTag: 'HRV-Trend · Apple Watch',
  },
  {
    type: 'user',
    message: 'Ja, diese Woche war wirklich stressig auf der Arbeit.',
    time: '10:03',
  },
  {
    type: 'lisa',
    message: 'Das verstehe ich. Ich sehe auch, dass du die letzten 3 Tage nicht meditiert hast und später eingeschlafen bist als üblich. Das hat einen direkten Einfluss auf deine Regeneration.',
    time: '10:03',
    dataTag: 'Schlaf-Daten · Oura Ring',
  },
  {
    type: 'lisa',
    message: 'Sollen wir zusammen einen kleinen Recovery-Plan für die nächsten Tage erstellen? Mit 10 Minuten Atemübungen am Abend könntest du deine HRV schnell wieder verbessern.',
    time: '10:04',
    suggestion: true,
  },
];

export default function LiseAIPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return '#4CAF50';
      case 'warning': return '#FFA000';
      case 'critical': return '#EF5350';
      default: return '#4498ca';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'recommended': return { bg: 'rgba(76, 175, 80, 0.1)', border: '#4CAF50', text: 'Empfohlen' };
      case 'suggested': return { bg: 'rgba(255, 160, 0, 0.1)', border: '#FFA000', text: 'Vorgeschlagen' };
      default: return { bg: 'rgba(68, 152, 202, 0.1)', border: '#4498ca', text: 'Optional' };
    }
  };

  const getIcon = (iconName: string) => {
    return Icons[iconName as keyof typeof Icons] || Icons.sparkles;
  };

  return (
    <div className="lisa-container">
      {/* Soft Background */}
      <div className="lisa-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="lisa-content">
        {/* Header with Lisa and Data Connection */}
        <div className="lisa-header">
          <div className="lisa-intro">
            <div className="lisa-avatar-area">
              <div className="avatar-pulse"></div>
              <div className="lisa-avatar">
                <span className="avatar-icon">{Icons.sparkles}</span>
                <div className="data-connection">
                  <div className="connection-dot"></div>
                </div>
              </div>
            </div>
            <div className="lisa-info">
              <h1 className="lisa-name">Lisa</h1>
              <p className="lisa-subtitle">Deine KI-Begleiterin für Longevity</p>
              <div className="data-status">
                <span className="status-dot active"></span>
                <span>Verbunden mit deinen Gesundheitsdaten</span>
              </div>
            </div>
          </div>
          
          {/* Live Data Overview */}
          <div className="live-data-panel">
            <div className="data-header">
              <span className="data-title">Live Datenübersicht</span>
              <span className="last-sync">Aktualisiert vor 2 Min</span>
            </div>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-icon">{Icons.target}</span>
                <div className="data-content">
                  <span className="data-value">{userHealthData.longevityScore}</span>
                  <span className="data-label">Longevity Score</span>
                </div>
              </div>
              <div className="data-item">
                <span className="data-icon">{Icons.dna}</span>
                <div className="data-content">
                  <span className="data-value">{userHealthData.biologicalAge} <small>Jahre</small></span>
                  <span className="data-label">Bio-Alter (vs. {userHealthData.chronologicalAge})</span>
                </div>
              </div>
              <div className="data-item">
                <span className="data-icon">{Icons.moon}</span>
                <div className="data-content">
                  <span className="data-value">{userHealthData.sleepScore}%</span>
                  <span className="data-label">Schlaf-Score</span>
                </div>
              </div>
              <div className="data-item warning">
                <span className="data-icon">{Icons.heart}</span>
                <div className="data-content">
                  <span className="data-value">{userHealthData.stressLevel}</span>
                  <span className="data-label">HRV {userHealthData.hrvTrend}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-grid">
          {/* Left: Data Insights */}
          <div className="insights-section">
            <div className="section-title">
              <h2>Was Lisa in deinen Daten sieht</h2>
              <p>Personalisierte Erkenntnisse basierend auf deinen Gesundheitsdaten</p>
            </div>
            
            <div className="insights-list">
              {dataInsights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`insight-card ${activeInsight === insight.id ? 'expanded' : ''}`}
                  onClick={() => setActiveInsight(activeInsight === insight.id ? null : insight.id)}
                >
                  <div className="insight-header">
                    <div className="insight-icon" style={{ background: `${getStatusColor(insight.status)}15`, color: getStatusColor(insight.status) }}>
                      {getIcon(insight.icon)}
                    </div>
                    <div className="insight-meta">
                      <span className="insight-category">{insight.category}</span>
                      <h3 className="insight-title">{insight.title}</h3>
                    </div>
                    <div className="insight-metric">
                      <span className="metric-value" style={{ color: getStatusColor(insight.status) }}>{insight.metric}</span>
                      <span className="metric-label">{insight.metricLabel}</span>
                    </div>
                  </div>
                  <div className="insight-body">
                    <p className="insight-text">{insight.insight}</p>
                    <div className="insight-source">
                      {Icons.check}
                      <span>{insight.dataSource}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Session Interface */}
          <div className="session-section">
            <div className="section-title">
              <h2>Wöchentliche Session</h2>
              <p>Wähle ein Thema für dein Gespräch mit Lisa</p>
            </div>

            <div className="topics-list">
              {weeklyFocusTopics.map((topic) => {
                const style = getPriorityStyle(topic.priority);
                return (
                  <button
                    key={topic.id}
                    className={`topic-card ${selectedTopic === topic.id ? 'selected' : ''}`}
                    onClick={() => setSelectedTopic(topic.id)}
                    style={{ '--priority-bg': style.bg, '--priority-border': style.border } as React.CSSProperties}
                  >
                    <div className="topic-header">
                      <span className="topic-icon">{getIcon(topic.icon)}</span>
                      <span className="topic-badge" style={{ background: style.bg, color: style.border }}>{style.text}</span>
                    </div>
                    <h3 className="topic-title">{topic.title}</h3>
                    <p className="topic-desc">{topic.description}</p>
                    <div className="topic-meta">
                      <span className="topic-duration">
                        <span className="duration-icon">{Icons.clock}</span>
                        {topic.duration}
                      </span>
                      <div className="topic-datapoints">
                        {topic.dataPoints.map((dp, i) => (
                          <span key={i} className="datapoint-tag">{dp}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Start Button */}
            <button className={`start-btn ${selectedTopic ? 'ready' : ''}`}>
              <div className="btn-content">
                <span>{selectedTopic ? 'Session starten' : 'Freies Gespräch beginnen'}</span>
                {Icons.play}
              </div>
            </button>
          </div>
        </div>

        {/* Conversation Preview */}
        <div className="conversation-preview">
          <div className="preview-header">
            <h2>So spricht Lisa mit dir</h2>
            <span className="demo-badge">Beispiel-Session</span>
          </div>
          
          <div className="conversation-window">
            <div className="messages">
              {conversationMockup.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  {msg.type === 'lisa' && (
                    <div className="msg-avatar">{Icons.sparkles}</div>
                  )}
                  <div className="msg-content">
                    <p>{msg.message}</p>
                    {msg.dataTag && (
                      <div className="msg-data-tag">
                        {Icons.database}
                        <span>{msg.dataTag}</span>
                      </div>
                    )}
                    {msg.suggestion && (
                      <div className="msg-suggestion">
                        <button className="suggestion-btn">Ja, lass uns das machen</button>
                        <button className="suggestion-btn secondary">Später</button>
                      </div>
                    )}
                    <span className="msg-time">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Voice Input */}
            <div className="voice-area">
              <div className="voice-visualizer">
                {[...Array(16)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`bar ${isListening ? 'active' : ''}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  ></div>
                ))}
              </div>
              <button 
                className={`voice-btn ${isListening ? 'active' : ''}`}
                onClick={() => setIsListening(!isListening)}
              >
                <div className="voice-ring"></div>
                <div className="voice-inner">
                  {isListening ? Icons.stop : Icons.mic}
                </div>
              </button>
              <span className="voice-hint">{isListening ? 'Ich höre zu...' : 'Tippe zum Sprechen'}</span>
            </div>
          </div>
        </div>

        {/* Connected Devices Footer */}
        <div className="devices-footer">
          <span className="footer-label">Verbundene Datenquellen:</span>
          <div className="device-list">
            <span className="device-tag"><span className="tag-icon">{Icons.watch}</span> Apple Watch</span>
            <span className="device-tag"><span className="tag-icon">{Icons.ring}</span> Oura Ring</span>
            <span className="device-tag"><span className="tag-icon">{Icons.droplet}</span> Bluttests</span>
            <span className="device-tag"><span className="tag-icon">{Icons.smartphone}</span> Apple Health</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lisa-container {
          min-height: calc(100vh - 80px);
          background: linear-gradient(160deg, #e8f4fc 0%, #d4e8f5 30%, #e0e8f0 60%, #f0f5fa 100%);
          position: relative;
          overflow-x: hidden;
          padding: 1.5rem 2rem;
        }

        .lisa-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(176, 224, 240, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(200, 220, 240, 0.3) 0%, transparent 40%);
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234498ca' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .lisa-content {
          position: relative;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
        }

        /* Header */
        .lisa-header {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .lisa-intro {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          box-shadow: 0 4px 20px rgba(0, 80, 150, 0.08);
        }

        .lisa-avatar-area {
          position: relative;
        }

        .avatar-pulse {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(68, 152, 202, 0.2) 0%, transparent 70%);
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }

        .lisa-avatar {
          position: relative;
          width: 72px;
          height: 72px;
          background: linear-gradient(145deg, #fff 0%, #e8f4fc 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #4498ca;
          box-shadow: 0 4px 15px rgba(68, 152, 202, 0.25);
        }

        .avatar-icon {
          width: 32px;
          height: 32px;
          color: #4498ca;
        }

        .avatar-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .data-connection {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .connection-dot {
          width: 10px;
          height: 10px;
          background: #4CAF50;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .lisa-info {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .lisa-name {
          font-family: 'Georgia', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .lisa-subtitle {
          font-size: 0.9rem;
          color: #5a8aa8;
          margin: 0;
        }

        .data-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #4CAF50;
          font-weight: 500;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4CAF50;
        }

        /* Live Data Panel */
        .live-data-panel {
          flex: 1;
          max-width: 500px;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          box-shadow: 0 4px 20px rgba(0, 80, 150, 0.08);
        }

        .data-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(68, 152, 202, 0.1);
        }

        .data-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #2c5a7c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .last-sync {
          font-size: 0.7rem;
          color: #7a9ab0;
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .data-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.5rem;
          background: rgba(68, 152, 202, 0.05);
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .data-item:hover {
          background: rgba(68, 152, 202, 0.1);
        }

        .data-item.warning {
          background: rgba(255, 160, 0, 0.08);
        }

        .data-icon {
          width: 24px;
          height: 24px;
          color: #4498ca;
          margin-bottom: 0.25rem;
        }

        .data-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .data-item.warning .data-icon {
          color: #e65100;
        }

        .data-content {
          display: flex;
          flex-direction: column;
        }

        .data-value {
          font-size: 1rem;
          font-weight: 700;
          color: #2c5a7c;
        }

        .data-value small {
          font-size: 0.65rem;
          font-weight: 500;
        }

        .data-item.warning .data-value {
          color: #e65100;
        }

        .data-label {
          font-size: 0.6rem;
          color: #7a9ab0;
          margin-top: 0.1rem;
        }

        /* Main Grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .section-title {
          margin-bottom: 1rem;
        }

        .section-title h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0 0 0.25rem 0;
        }

        .section-title p {
          font-size: 0.8rem;
          color: #7a9ab0;
          margin: 0;
        }

        /* Insights Section */
        .insights-section {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(0, 80, 150, 0.08);
        }

        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .insight-card {
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(68, 152, 202, 0.1);
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .insight-card:hover {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 15px rgba(0, 80, 150, 0.1);
        }

        .insight-card.expanded {
          background: #fff;
          border-color: rgba(68, 152, 202, 0.25);
        }

        .insight-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .insight-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 8px;
        }

        .insight-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .insight-meta {
          flex: 1;
          min-width: 0;
        }

        .insight-category {
          font-size: 0.65rem;
          color: #7a9ab0;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .insight-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0.15rem 0 0 0;
        }

        .insight-metric {
          text-align: right;
          flex-shrink: 0;
        }

        .metric-value {
          font-size: 1.1rem;
          font-weight: 700;
          display: block;
        }

        .metric-label {
          font-size: 0.6rem;
          color: #7a9ab0;
        }

        .insight-body {
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .insight-card.expanded .insight-body {
          max-height: 200px;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(68, 152, 202, 0.1);
        }

        .insight-text {
          font-size: 0.8rem;
          color: #4a6a80;
          line-height: 1.5;
          margin: 0 0 0.5rem 0;
        }

        .insight-source {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.7rem;
          color: #4CAF50;
        }

        .insight-source :global(svg) {
          width: 14px;
          height: 14px;
        }

        /* Session Section */
        .session-section {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(0, 80, 150, 0.08);
          display: flex;
          flex-direction: column;
        }

        .topics-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .topic-card {
          text-align: left;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(68, 152, 202, 0.1);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .topic-card:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 80, 150, 0.1);
        }

        .topic-card.selected {
          background: var(--priority-bg);
          border-color: var(--priority-border);
        }

        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .topic-icon {
          width: 24px;
          height: 24px;
          color: #4498ca;
        }

        .topic-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .topic-badge {
          font-size: 0.6rem;
          font-weight: 600;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .topic-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0 0 0.35rem 0;
        }

        .topic-desc {
          font-size: 0.75rem;
          color: #5a8aa8;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .topic-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .topic-duration {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #7a9ab0;
        }

        .duration-icon {
          width: 12px;
          height: 12px;
        }

        .duration-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .topic-datapoints {
          display: flex;
          gap: 0.35rem;
        }

        .datapoint-tag {
          font-size: 0.6rem;
          color: #4498ca;
          background: rgba(68, 152, 202, 0.1);
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }

        .start-btn {
          margin-top: 1rem;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(68, 152, 202, 0.15) 0%, rgba(68, 152, 202, 0.25) 100%);
          border: 1px solid rgba(68, 152, 202, 0.3);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .start-btn:hover {
          background: linear-gradient(135deg, rgba(68, 152, 202, 0.25) 0%, rgba(68, 152, 202, 0.35) 100%);
        }

        .start-btn.ready {
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          border-color: transparent;
        }

        .start-btn.ready:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(68, 152, 202, 0.35);
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #2c5a7c;
        }

        .btn-content :global(svg) {
          width: 18px;
          height: 18px;
        }

        .start-btn.ready .btn-content {
          color: #fff;
        }

        /* Conversation Preview */
        .conversation-preview {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          padding: 1.25rem;
          box-shadow: 0 4px 20px rgba(0, 80, 150, 0.08);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .preview-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0;
        }

        .demo-badge {
          font-size: 0.65rem;
          font-weight: 600;
          color: #7a9ab0;
          background: rgba(68, 152, 202, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .conversation-window {
          background: rgba(248, 252, 255, 0.8);
          border-radius: 16px;
          overflow: hidden;
        }

        .messages {
          padding: 1.25rem;
          max-height: 320px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          max-width: 85%;
        }

        .message.lisa {
          align-self: flex-start;
        }

        .message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8f4fc 0%, #d4e8f5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 2px solid #4498ca;
          padding: 6px;
          color: #4498ca;
        }

        .msg-avatar :global(svg) {
          width: 100%;
          height: 100%;
        }

        .msg-content {
          background: #fff;
          padding: 0.75rem 1rem;
          border-radius: 16px;
          border: 1px solid rgba(68, 152, 202, 0.1);
          position: relative;
        }

        .message.lisa .msg-content {
          border-bottom-left-radius: 4px;
        }

        .message.user .msg-content {
          background: rgba(68, 152, 202, 0.1);
          border-bottom-right-radius: 4px;
        }

        .msg-content p {
          font-size: 0.85rem;
          color: #3a5a70;
          margin: 0;
          line-height: 1.5;
        }

        .msg-data-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          margin-top: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: rgba(76, 175, 80, 0.1);
          border-radius: 6px;
          font-size: 0.65rem;
          color: #4CAF50;
        }

        .msg-data-tag :global(svg) {
          width: 12px;
          height: 12px;
        }

        .msg-suggestion {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
        }

        .suggestion-btn {
          padding: 0.4rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          color: #fff;
          border: none;
        }

        .suggestion-btn.secondary {
          background: transparent;
          color: #5a8aa8;
          border: 1px solid rgba(68, 152, 202, 0.3);
        }

        .msg-time {
          font-size: 0.6rem;
          color: #a0b5c5;
          display: block;
          margin-top: 0.35rem;
        }

        /* Voice Area */
        .voice-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem;
          border-top: 1px solid rgba(68, 152, 202, 0.1);
          background: rgba(255, 255, 255, 0.5);
        }

        .voice-visualizer {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 24px;
        }

        .bar {
          width: 3px;
          height: 6px;
          background: rgba(68, 152, 202, 0.3);
          border-radius: 2px;
          transition: all 0.15s ease;
        }

        .bar.active {
          animation: wave 0.5s ease-in-out infinite;
          background: linear-gradient(180deg, #4498ca 0%, #2c6a8c 100%);
        }

        @keyframes wave {
          0%, 100% { height: 6px; }
          50% { height: 20px; }
        }

        .voice-btn {
          position: relative;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .voice-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(68, 152, 202, 0.4);
          transition: all 0.3s ease;
        }

        .voice-btn:hover .voice-ring {
          border-color: #4498ca;
          transform: scale(1.1);
        }

        .voice-btn.active .voice-ring {
          border-color: #4CAF50;
          animation: ringPulse 1.5s ease-in-out infinite;
        }

        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        .voice-inner {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .voice-inner :global(svg) {
          width: 24px;
          height: 24px;
        }

        .voice-btn.active .voice-inner {
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
        }

        .voice-hint {
          font-size: 0.75rem;
          color: #7a9ab0;
        }

        /* Devices Footer */
        .devices-footer {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .footer-label {
          font-size: 0.75rem;
          color: #7a9ab0;
        }

        .device-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .device-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          color: #5a8aa8;
          background: rgba(255, 255, 255, 0.7);
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          border: 1px solid rgba(68, 152, 202, 0.15);
        }

        .tag-icon {
          width: 14px;
          height: 14px;
          display: flex;
        }

        .tag-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .lisa-header {
            flex-direction: column;
          }

          .live-data-panel {
            max-width: 100%;
          }

          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .lisa-container {
            padding: 1rem;
          }

          .data-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .lisa-intro {
            flex-direction: column;
            text-align: center;
          }

          .data-status {
            justify-content: center;
          }

          .message {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}
