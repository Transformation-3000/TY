'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Icons als Komponenten
const Icons = {
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
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  ),
  volume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
  ),
};

// Coaching-Session Topics nach dem Lisa AI Konzept
const sessionTopics = [
  {
    id: 'schlaf',
    title: 'Schlafverhalten',
    subtitle: 'Reflexion & Micro Habits',
    example: '"Wie erholt hast du dich heute Morgen gefühlt?"',
    icon: '🌙',
  },
  {
    id: 'bewegung',
    title: 'Bewegung',
    subtitle: 'Alltagsaktivität erkunden',
    example: '"Wie aktiv warst du gestern?"',
    icon: '🚶',
  },
  {
    id: 'stress',
    title: 'Stressmanagement',
    subtitle: 'Muster erkennen & verstehen',
    example: '"Gab es heute einen stressigen Moment?"',
    icon: '🧘',
  },
];

export default function Coaching2Page() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'topic-select' | 'session'>('welcome');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Conversation state für den Dialog
  const [messages, setMessages] = useState<Array<{type: 'lisa' | 'user', text: string}>>([]);

  // Simuliert Timer während der Session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setCurrentPhase('topic-select');
  };

  const selectTopic = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentPhase('session');
    setIsSessionActive(true);
    setIsSpeaking(true);
    
    // Lisa beginnt zu sprechen
    const topic = sessionTopics.find(t => t.id === topicId);
    setMessages([
      { type: 'lisa', text: `Schön, dass du da bist! Lass uns gemeinsam über dein ${topic?.title} sprechen. ${topic?.example}` }
    ]);
    
    // Simuliert Ende des Sprechens
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Simuliert eine Antwort
      setMessages(prev => [...prev, { type: 'user', text: 'Ich habe heute gut geschlafen, aber bin trotzdem müde aufgewacht...' }]);
      
      // Lisa antwortet
      setTimeout(() => {
        setIsSpeaking(true);
        setMessages(prev => [...prev, { type: 'lisa', text: 'Das verstehe ich. Manchmal liegt es nicht nur an der Schlafdauer, sondern auch an der Schlafqualität. Gab es vielleicht etwas, das dich vor dem Einschlafen beschäftigt hat?' }]);
        setTimeout(() => setIsSpeaking(false), 3000);
      }, 1000);
    } else {
      setIsListening(true);
    }
  };

  const endSession = () => {
    setIsSessionActive(false);
    setIsListening(false);
    setIsSpeaking(false);
    setCurrentPhase('welcome');
    setSessionTime(0);
    setMessages([]);
    setSelectedTopic(null);
  };

  return (
    <div className="coaching2-container">
      {/* Background */}
      <div className="coaching2-bg">
        <div className="bg-gradient-soft"></div>
        <div className="bg-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className="coaching2-content">
        {/* Main Layout - Lisa links, Interface rechts */}
        <div className="coaching2-main">
          
          {/* Lisa Section - Halber Bildschirm */}
          <div className="lisa-section">
            <div className="lisa-image-container">
              <div className={`lisa-glow ${isSpeaking ? 'speaking' : ''} ${isListening ? 'listening' : ''}`}></div>
              <Image
                src="/images/lisa.png"
                alt="Lisa - Deine KI-Begleiterin"
                width={500}
                height={600}
                className="lisa-image"
                style={{ objectFit: 'cover', borderRadius: '24px' }}
                priority
              />
              
              {/* Voice Indicator */}
              {(isSpeaking || isListening) && (
                <div className={`voice-indicator ${isSpeaking ? 'speaking' : 'listening'}`}>
                  <div className="voice-waves">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="wave" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <span>{isSpeaking ? 'Lisa spricht...' : 'Ich höre zu...'}</span>
                </div>
              )}
            </div>
            
            {/* Lisa Status */}
            <div className="lisa-status">
              <div className="status-dot"></div>
              <span>Lisa ist bereit für dich</span>
            </div>
          </div>

          {/* Interface Section - Halber Bildschirm */}
          <div className="interface-section">
            
            {/* Welcome Phase */}
            {currentPhase === 'welcome' && (
              <div className="welcome-content">
                <div className="welcome-header">
                  <h1>Hallo!</h1>
                  <p className="welcome-subtitle">
                    Ich bin Lisa, deine persönliche Begleiterin für mehr Wohlbefinden.
                  </p>
                </div>

                <div className="intro-card">
                  <div className="intro-icon">{Icons.heart}</div>
                  <p className="intro-text">
                    Hier startest du eine neue Coaching-Session von <strong>5-10 Minuten</strong> mit mir. 
                    Wir reflektieren gemeinsam über deine Gewohnheiten und entwickeln kleine, 
                    alltagstaugliche Micro Habits.
                  </p>
                </div>

                <div className="session-info">
                  <div className="info-item">
                    <span className="info-icon">{Icons.clock}</span>
                    <span>5-10 Minuten</span>
                  </div>
                  <div className="info-item">
                    <span className="info-icon">{Icons.sparkle}</span>
                    <span>Personalisiert für dich</span>
                  </div>
                </div>

                <button className="start-session-btn" onClick={startSession}>
                  <span className="btn-icon">{Icons.play}</span>
                  <span>Session starten</span>
                </button>
              </div>
            )}

            {/* Topic Selection Phase */}
            {currentPhase === 'topic-select' && (
              <div className="topic-selection">
                <h2>Worüber möchtest du heute sprechen?</h2>
                <p className="topic-hint">Wähle ein Thema, das dich gerade beschäftigt</p>

                <div className="topics-grid">
                  {sessionTopics.map((topic) => (
                    <button
                      key={topic.id}
                      className="topic-card"
                      onClick={() => selectTopic(topic.id)}
                    >
                      <span className="topic-emoji">{topic.icon}</span>
                      <h3>{topic.title}</h3>
                      <p className="topic-subtitle">{topic.subtitle}</p>
                      <p className="topic-example">{topic.example}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Session Phase */}
            {currentPhase === 'session' && (
              <div className="session-content">
                {/* Session Header */}
                <div className="session-header">
                  <div className="session-topic">
                    <span className="topic-emoji-small">
                      {sessionTopics.find(t => t.id === selectedTopic)?.icon}
                    </span>
                    <span>{sessionTopics.find(t => t.id === selectedTopic)?.title}</span>
                  </div>
                  <div className="session-timer">
                    <span className="timer-icon">{Icons.clock}</span>
                    <span>{formatTime(sessionTime)}</span>
                  </div>
                </div>

                {/* Dialog Area */}
                <div className="dialog-area">
                  {messages.map((msg, index) => (
                    <div key={index} className={`dialog-message ${msg.type}`}>
                      {msg.type === 'lisa' && (
                        <div className="msg-avatar">
                          <Image
                            src="/images/lisa.png"
                            alt="Lisa"
                            width={40}
                            height={40}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className="msg-bubble">
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voice Control */}
                <div className="voice-control">
                  <div className="voice-visualizer">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`vis-bar ${isListening ? 'active' : ''}`}
                        style={{ animationDelay: `${i * 0.05}s` }}
                      ></div>
                    ))}
                  </div>

                  <button
                    className={`voice-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
                    onClick={toggleListening}
                    disabled={isSpeaking}
                  >
                    <div className="voice-btn-inner">
                      {isListening ? Icons.stop : Icons.mic}
                    </div>
                  </button>

                  <p className="voice-hint-text">
                    {isSpeaking 
                      ? 'Lisa spricht gerade...' 
                      : isListening 
                        ? 'Ich höre dir zu. Tippe erneut zum Beenden.' 
                        : 'Tippe zum Sprechen'}
                  </p>
                </div>

                {/* End Session */}
                <button className="end-session-btn" onClick={endSession}>
                  Session beenden
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .coaching2-container {
          min-height: calc(100vh - 80px);
          position: relative;
          overflow: hidden;
          background: linear-gradient(165deg, #f8fcff 0%, #eef6fb 30%, #e5f0f8 60%, #f0f7fc 100%);
        }

        .coaching2-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-gradient-soft {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(68, 152, 202, 0.08) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(176, 224, 240, 0.12) 0%, transparent 40%);
        }

        .bg-circles {
          position: absolute;
          inset: 0;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(68, 152, 202, 0.08);
        }

        .circle-1 {
          width: 600px;
          height: 600px;
          left: -200px;
          top: -100px;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          right: -100px;
          bottom: -50px;
        }

        .circle-3 {
          width: 300px;
          height: 300px;
          left: 40%;
          bottom: 20%;
        }

        .coaching2-content {
          position: relative;
          z-index: 1;
          height: calc(100vh - 80px);
        }

        .coaching2-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
        }

        /* Lisa Section */
        .lisa-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }

        .lisa-image-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          overflow: hidden;
        }

        .lisa-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(68, 152, 202, 0.15) 0%, transparent 70%);
          z-index: 0;
          transition: all 0.5s ease;
        }

        .lisa-glow.speaking {
          animation: glowPulse 1.5s ease-in-out infinite;
          background: radial-gradient(circle, rgba(68, 152, 202, 0.25) 0%, transparent 70%);
        }

        .lisa-glow.listening {
          animation: glowPulse 2s ease-in-out infinite;
          background: radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%);
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        .lisa-image {
          position: relative;
          z-index: 1;
          max-height: 70vh;
          width: auto;
          filter: drop-shadow(0 20px 40px rgba(0, 60, 120, 0.15));
          border-radius: 24px;
        }

        .voice-indicator {
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1.25rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 30px;
          box-shadow: 0 4px 20px rgba(0, 60, 120, 0.15);
          z-index: 10;
        }

        .voice-indicator.speaking {
          border: 2px solid rgba(68, 152, 202, 0.4);
        }

        .voice-indicator.listening {
          border: 2px solid rgba(76, 175, 80, 0.4);
        }

        .voice-waves {
          display: flex;
          align-items: center;
          gap: 3px;
          height: 20px;
        }

        .wave {
          width: 3px;
          height: 8px;
          background: #4498ca;
          border-radius: 2px;
          animation: waveAnim 0.8s ease-in-out infinite;
        }

        .voice-indicator.listening .wave {
          background: #4CAF50;
        }

        @keyframes waveAnim {
          0%, 100% { height: 8px; }
          50% { height: 18px; }
        }

        .voice-indicator span {
          font-size: 0.8rem;
          font-weight: 500;
          color: #2c5a7c;
        }

        .lisa-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          font-size: 0.85rem;
          color: #4a6a80;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #4CAF50;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Interface Section */
        .interface-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
        }

        /* Welcome Content */
        .welcome-content {
          max-width: 480px;
        }

        .welcome-header h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0 0 0.5rem 0;
          letter-spacing: -1px;
        }

        .welcome-subtitle {
          font-size: 1.2rem;
          color: #5a8aa8;
          line-height: 1.6;
          margin: 0 0 2rem 0;
        }

        .intro-card {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          margin-bottom: 2rem;
        }

        .intro-icon {
          width: 24px;
          height: 24px;
          color: #e57373;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .intro-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .intro-text {
          font-size: 0.95rem;
          color: #4a6a80;
          line-height: 1.65;
          margin: 0;
        }

        .intro-text strong {
          color: #2c5a7c;
        }

        .session-info {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #5a8aa8;
        }

        .info-icon {
          width: 18px;
          height: 18px;
          color: #4498ca;
        }

        .info-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .start-session-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          max-width: 280px;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(68, 152, 202, 0.35);
        }

        .start-session-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(68, 152, 202, 0.45);
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        .btn-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        /* Topic Selection */
        .topic-selection {
          max-width: 520px;
        }

        .topic-selection h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.75rem;
          color: #2c5a7c;
          margin: 0 0 0.5rem 0;
        }

        .topic-hint {
          font-size: 0.95rem;
          color: #7a9ab0;
          margin: 0 0 2rem 0;
        }

        .topics-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .topic-card {
          text-align: left;
          padding: 1.25rem 1.5rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(68, 152, 202, 0.12);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .topic-card:hover {
          background: #fff;
          border-color: rgba(68, 152, 202, 0.3);
          transform: translateX(8px);
          box-shadow: 0 8px 25px rgba(0, 60, 120, 0.1);
        }

        .topic-emoji {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .topic-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0 0 0.25rem 0;
        }

        .topic-subtitle {
          font-size: 0.8rem;
          color: #7a9ab0;
          margin: 0 0 0.5rem 0;
        }

        .topic-example {
          font-size: 0.85rem;
          color: #5a8aa8;
          font-style: italic;
          margin: 0;
        }

        /* Session Content */
        .session-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: calc(100vh - 160px);
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(68, 152, 202, 0.1);
          margin-bottom: 1rem;
        }

        .session-topic {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #2c5a7c;
        }

        .topic-emoji-small {
          font-size: 1.25rem;
        }

        .session-timer {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          color: #7a9ab0;
          padding: 0.4rem 0.8rem;
          background: rgba(68, 152, 202, 0.08);
          border-radius: 20px;
        }

        .timer-icon {
          width: 14px;
          height: 14px;
        }

        .timer-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        /* Dialog Area */
        .dialog-area {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .dialog-message {
          display: flex;
          gap: 0.75rem;
          max-width: 90%;
        }

        .dialog-message.lisa {
          align-self: flex-start;
        }

        .dialog-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #4498ca;
        }

        .msg-bubble {
          padding: 1rem 1.25rem;
          border-radius: 18px;
          background: #fff;
          border: 1px solid rgba(68, 152, 202, 0.1);
        }

        .dialog-message.lisa .msg-bubble {
          border-bottom-left-radius: 4px;
        }

        .dialog-message.user .msg-bubble {
          background: rgba(68, 152, 202, 0.1);
          border-bottom-right-radius: 4px;
        }

        .msg-bubble p {
          font-size: 0.9rem;
          color: #3a5a70;
          line-height: 1.55;
          margin: 0;
        }

        /* Voice Control */
        .voice-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 0;
          margin-top: auto;
        }

        .voice-visualizer {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 30px;
        }

        .vis-bar {
          width: 4px;
          height: 8px;
          background: rgba(68, 152, 202, 0.3);
          border-radius: 2px;
          transition: all 0.15s ease;
        }

        .vis-bar.active {
          background: linear-gradient(180deg, #4498ca 0%, #2c6a8c 100%);
          animation: barWave 0.6s ease-in-out infinite;
        }

        @keyframes barWave {
          0%, 100% { height: 8px; }
          50% { height: 26px; }
        }

        .voice-btn {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid rgba(68, 152, 202, 0.3);
          background: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }

        .voice-btn:hover:not(:disabled) {
          border-color: #4498ca;
          transform: scale(1.05);
        }

        .voice-btn.listening {
          border-color: #4CAF50;
          animation: listenPulse 1.5s ease-in-out infinite;
        }

        @keyframes listenPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
        }

        .voice-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .voice-btn-inner {
          position: absolute;
          inset: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .voice-btn.listening .voice-btn-inner {
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
        }

        .voice-btn-inner :global(svg) {
          width: 28px;
          height: 28px;
        }

        .voice-hint-text {
          font-size: 0.85rem;
          color: #7a9ab0;
          text-align: center;
          margin: 0;
        }

        .end-session-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: #7a9ab0;
          border: 1px solid rgba(68, 152, 202, 0.2);
          border-radius: 25px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: center;
        }

        .end-session-btn:hover {
          background: rgba(239, 83, 80, 0.1);
          border-color: rgba(239, 83, 80, 0.3);
          color: #EF5350;
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .coaching2-main {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }

          .lisa-section {
            padding: 1.5rem;
          }

          .lisa-image-container {
            max-width: 280px;
          }

          .lisa-image {
            max-height: 40vh;
          }

          .interface-section {
            padding: 2rem;
          }
        }

        @media (max-width: 600px) {
          .welcome-header h1 {
            font-size: 2.25rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .session-info {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
