'use client';

import { useState, useEffect, useRef } from 'react';
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
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
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
    icon: '🧠',
  },
];

interface Coaching2PageProps {
  onOpenAvatar?: () => void;
}

export default function Coaching2Page({ onOpenAvatar }: Coaching2PageProps) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'session-opening' | 'topic-select' | 'session'>('welcome');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [lastSessionTopic] = useState<string>('Schlafverhalten'); // Simuliert letztes Thema
  const [showOptions, setShowOptions] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Conversation state für den Dialog
  const [messages, setMessages] = useState<Array<{type: 'lisa' | 'user', text: string, isTyping?: boolean}>>([]);

  // Typing Animation Effect
  const typeMessage = (text: string, onComplete?: () => void) => {
    if (!text || text.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    
    setIsTyping(true);
    let currentText = text[0]; // Starte mit dem ersten Zeichen
    setTypingText(currentText);
    let index = 1;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        setTypingText(currentText);
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    }, 30);
    return () => clearInterval(interval);
  };

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

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.scrollTop = dialogRef.current.scrollHeight;
    }
  }, [messages, typingText]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setCurrentPhase('session-opening');
    setIsSessionActive(true); // Timer startet sofort
    setIsSpeaking(true);
    
    // Lisa begrüßt empathisch (Begrüßung haben wir schon auf der Welcome-Seite)
    const greeting = 'Schön, dass du dir Zeit für dich nimmst. Wie möchtest du heute starten?';
    
    setMessages([{ type: 'lisa', text: '', isTyping: true }]);
    
    setTimeout(() => {
      typeMessage(greeting, () => {
        setMessages([{ type: 'lisa', text: greeting }]);
        setIsSpeaking(false);
        // Zeige Optionen mit Verzögerung für smooth animation
        setTimeout(() => setShowOptions(true), 300);
      });
    }, 500);
  };

  // Session-Eröffnung Auswahlfelder basierend auf Konzept
  const sessionOpeningOptions = [
    {
      id: 'continue',
      text: `Wollen wir auf „${lastSessionTopic}" aus der letzten Session aufbauen?`,
      icon: '🔄',
      color: 'ocean',
    },
    {
      id: 'share',
      text: 'Möchtest du etwas mitteilen, das dich aktuell besonders bewegt?',
      icon: '💭',
      color: 'sage',
    },
    {
      id: 'learn',
      text: 'Möchtest du etwas Neues kennenlernen?',
      icon: '✨',
      color: 'lavender',
    },
  ];

  const handleSessionOpening = (optionId: string) => {
    setShowOptions(false);
    
    const selectedOption = sessionOpeningOptions.find(o => o.id === optionId);
    
    // Zeige User-Auswahl als Nachricht
    setMessages(prev => [...prev, { type: 'user', text: selectedOption?.text || '' }]);
    
    // Lisa antwortet basierend auf Auswahl
    setTimeout(() => {
      setIsSpeaking(true);
      let lisaResponse = '';
      
      if (optionId === 'continue') {
        lisaResponse = `Wunderbar! Lass uns dort weitermachen, wo wir aufgehört haben. Ich habe mir unsere letzte Session zu „${lastSessionTopic}" gemerkt. Was hat sich seither für dich verändert?`;
      } else if (optionId === 'share') {
        lisaResponse = 'Ich bin ganz Ohr für dich. Manchmal hilft es, Dinge auszusprechen. Was liegt dir gerade auf dem Herzen?';
      } else if (optionId === 'learn') {
        lisaResponse = 'Wie schön, dass du neugierig bist! Es gibt so viele spannende Themen zu entdecken. Wähle ein Thema, das dich interessiert.';
      }

      setMessages(prev => [...prev, { type: 'lisa', text: '', isTyping: true }]);
      
      setTimeout(() => {
        typeMessage(lisaResponse, () => {
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { type: 'lisa', text: lisaResponse };
            return newMsgs;
          });
          setIsSpeaking(false);
          setCurrentPhase('topic-select');
          setTimeout(() => setShowOptions(true), 300);
        });
      }, 400);
    }, 600);
  };

  const selectTopic = (topicId: string) => {
    setShowOptions(false);
    setSelectedTopic(topicId);
    
    const topic = sessionTopics.find(t => t.id === topicId);
    
    // Zeige Topic-Auswahl als User-Nachricht
    setMessages(prev => [...prev, { type: 'user', text: `${topic?.icon} ${topic?.title}` }]);
    
    setTimeout(() => {
      setCurrentPhase('session');
      // Timer läuft bereits seit startSession
      setIsSpeaking(true);
      
      const startMessage = `Perfekt! Lass uns gemeinsam über dein ${topic?.title} sprechen. ${topic?.example.replace(/"/g, '')}`;
      
      setMessages(prev => [...prev, { type: 'lisa', text: '', isTyping: true }]);
      
      setTimeout(() => {
        typeMessage(startMessage, () => {
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { type: 'lisa', text: startMessage };
            return newMsgs;
          });
          setIsSpeaking(false);
        });
      }, 400);
    }, 600);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      // Simuliert eine Antwort
      setMessages(prev => [...prev, { type: 'user', text: 'Ich habe heute gut geschlafen, aber bin trotzdem müde aufgewacht...' }]);
      
      // Lisa antwortet
      setTimeout(() => {
        setIsSpeaking(true);
        const response = 'Das verstehe ich gut. Manchmal liegt es nicht nur an der Schlafdauer, sondern auch an der Schlafqualität. Gab es vielleicht etwas, das dich vor dem Einschlafen beschäftigt hat?';
        
        setMessages(prev => [...prev, { type: 'lisa', text: '', isTyping: true }]);
        
        setTimeout(() => {
          typeMessage(response, () => {
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1] = { type: 'lisa', text: response };
              return newMsgs;
            });
            setIsSpeaking(false);
          });
        }, 400);
      }, 800);
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
    setShowOptions(false);
    setTypingText('');
  };

  return (
    <div className="coaching2-container">
      {/* Background */}
      <div className="coaching2-bg">
        <div className="bg-gradient-soft"></div>
        <div className="bg-pattern"></div>
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
            <div
              className="lisa-image-container"
              role={onOpenAvatar ? 'button' : undefined}
              tabIndex={onOpenAvatar ? 0 : undefined}
              onClick={onOpenAvatar}
              onKeyDown={onOpenAvatar ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenAvatar(); } } : undefined}
              title={onOpenAvatar ? 'Mit Lisa (Avatar) sprechen' : undefined}
              style={onOpenAvatar ? { cursor: 'pointer' } : undefined}
            >
              <div className={`lisa-glow ${isSpeaking ? 'speaking' : ''} ${isListening ? 'listening' : ''}`}></div>
              <div className="lisa-frame">
                <Image
                  src="/images/lisa.png"
                  alt="Lisa - Deine KI-Begleiterin"
                  width={500}
                  height={600}
                  className="lisa-image"
                  style={{ objectFit: 'cover', borderRadius: '24px' }}
                  priority
                />
              </div>
              
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
              <span>Lisa ist bereit für dich{onOpenAvatar && ' – Klicke auf das Bild für Video-Chat'}</span>
            </div>
          </div>

          {/* Interface Section - Halber Bildschirm */}
          <div className="interface-section">
            
            {/* Welcome Phase */}
            {currentPhase === 'welcome' && (
              <div className="welcome-content">
                <div className="welcome-badge">
                  <span className="badge-icon">✨</span>
                  <span>Deine persönliche KI-Begleiterin</span>
                </div>
                
                <div className="welcome-header">
                  <h1>Einen wundervollen Tag.</h1>
                  <p className="welcome-subtitle">
                    Ich bin <strong>Lisa AI</strong>, deine empathische Begleiterin für Vitalität und Langlebigkeit.
                  </p>
                </div>

                <div className="intro-card">
                  <div className="intro-icon-wrap">
                    <div className="intro-icon">{Icons.heart}</div>
                  </div>
                  <div className="intro-text-wrap">
                    <p className="intro-text">
                      Hier startest du eine <strong>Coaching-Session</strong> von 5-10 Minuten mit mir. 
                      Wir reflektieren gemeinsam über deine Gewohnheiten und entwickeln neue, 
                      alltagstaugliche Gewohnheiten, die dir helfen, deinen Zielen Schritt für Schritt näher zu kommen.
                    </p>
                  </div>
                </div>

                <div className="session-info">
                  <div className="info-item">
                    <div className="info-icon-wrap">
                      <span className="info-icon">{Icons.clock}</span>
                    </div>
                    <span>5-10 Minuten</span>
                  </div>
                  <div className="info-item">
                    <div className="info-icon-wrap">
                      <span className="info-icon">{Icons.sparkle}</span>
                    </div>
                    <span>Personalisiert für dich</span>
                  </div>
                </div>

                <button className="start-session-btn" onClick={startSession}>
                  <span className="btn-text">Session starten</span>
                  <span className="btn-icon">{Icons.arrow}</span>
                </button>
              </div>
            )}

            {/* Session Opening + Topic Select + Session - Dialog View */}
            {currentPhase !== 'welcome' && (
              <div className="dialog-view">
                {/* Session Header mit prominenter Uhr - erscheint sofort bei Gesprächsstart */}
                <div className="session-header">
                  <div className="session-topic">
                    {selectedTopic ? (
                      <>
                        <span className="topic-emoji-small">
                          {sessionTopics.find(t => t.id === selectedTopic)?.icon}
                        </span>
                        <span>{sessionTopics.find(t => t.id === selectedTopic)?.title}</span>
                      </>
                    ) : (
                      <>
                        <span className="topic-emoji-small">💬</span>
                        <span>Coaching Session</span>
                      </>
                    )}
                  </div>
                  <div className="session-timer session-timer-prominent">
                    <span className="timer-icon">{Icons.clock}</span>
                    <span className="timer-value">{formatTime(sessionTime)}</span>
                  </div>
                </div>
                
                {/* Dialog Area */}
                <div className="dialog-area" ref={dialogRef}>
                  {messages.map((msg, index) => (
                    <div key={index} className={`dialog-message ${msg.type}`}>
                      {msg.type === 'lisa' && (
                        <div className="msg-avatar">
                          <Image
                            src="/images/lisa.png"
                            alt="Lisa"
                            width={44}
                            height={44}
                            style={{ borderRadius: '50%', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className="msg-bubble">
                        {msg.isTyping ? (
                          <p className="typing-text">
                            {typingText}
                            <span className="typing-cursor">|</span>
                          </p>
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Session Opening Options */}
                {currentPhase === 'session-opening' && showOptions && (
                  <div className="options-container session-options">
                    <div className="options-label">Wähle eine Option:</div>
                    <div className="options-grid">
                      {sessionOpeningOptions.map((option, index) => (
                        <button
                          key={option.id}
                          className={`option-card option-${option.color}`}
                          onClick={() => handleSessionOpening(option.id)}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <span className="option-icon">{option.icon}</span>
                          <span className="option-text">{option.text}</span>
                          <span className="option-arrow">{Icons.arrow}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topic Selection Options */}
                {currentPhase === 'topic-select' && showOptions && (
                  <div className="options-container topic-options">
                    <div className="options-label">Wähle ein Thema:</div>
                    <div className="topics-grid">
                      {sessionTopics.map((topic, index) => (
                        <button
                          key={topic.id}
                          className="topic-card"
                          onClick={() => selectTopic(topic.id)}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <span className="topic-emoji">{topic.icon}</span>
                          <div className="topic-info">
                            <h3>{topic.title}</h3>
                            <p className="topic-subtitle">{topic.subtitle}</p>
                          </div>
                          <span className="topic-arrow">{Icons.arrow}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Control - Only in active session */}
                {currentPhase === 'session' && (
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
                )}

                {/* End Session Button */}
                {currentPhase === 'session' && (
                  <button className="end-session-btn" onClick={endSession}>
                    Session beenden
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .coaching2-container {
          min-height: calc(100vh - 90px);
          position: relative;
          overflow-x: hidden;
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

        .bg-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: 
            radial-gradient(circle at 1px 1px, rgba(68, 152, 202, 0.5) 1px, transparent 0);
          background-size: 32px 32px;
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
        }

        .coaching2-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 90px);
        }

        /* Lisa Section */
        .lisa-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          min-height: calc(100vh - 90px);
        }

        .lisa-image-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          overflow: visible;
          margin: auto 0;
        }

        .lisa-frame {
          position: relative;
          z-index: 1;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 25px 50px -12px rgba(0, 60, 120, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.8);
        }

        .lisa-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(68, 152, 202, 0.12) 0%, transparent 70%);
          z-index: 0;
          transition: all 0.5s ease;
        }

        .lisa-glow.speaking {
          animation: glowPulse 1.5s ease-in-out infinite;
          background: radial-gradient(circle, rgba(68, 152, 202, 0.25) 0%, transparent 70%);
          width: 420px;
          height: 420px;
        }

        .lisa-glow.listening {
          animation: glowPulse 2s ease-in-out infinite;
          background: radial-gradient(circle, rgba(76, 175, 80, 0.2) 0%, transparent 70%);
          width: 420px;
          height: 420px;
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .lisa-image {
          position: relative;
          z-index: 1;
          max-height: calc(100vh - 250px);
          max-width: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
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
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(16px);
          border-radius: 30px;
          box-shadow: 0 4px 24px rgba(0, 60, 120, 0.12);
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .voice-indicator.speaking {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 248, 255, 0.98) 100%);
          border: 1px solid rgba(68, 152, 202, 0.2);
        }

        .voice-indicator.listening {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 255, 244, 0.98) 100%);
          border: 1px solid rgba(76, 175, 80, 0.2);
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
          background: linear-gradient(180deg, #4498ca 0%, #2c6a8c 100%);
          border-radius: 2px;
          animation: waveAnim 0.8s ease-in-out infinite;
        }

        .voice-indicator.listening .wave {
          background: linear-gradient(180deg, #4CAF50 0%, #388E3C 100%);
        }

        @keyframes waveAnim {
          0%, 100% { height: 8px; }
          50% { height: 18px; }
        }

        .voice-indicator span {
          font-size: 0.85rem;
          font-weight: 600;
          color: #2c5a7c;
          letter-spacing: -0.01em;
        }

        .lisa-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border-radius: 24px;
          font-size: 0.85rem;
          color: #4a6a80;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 2px 12px rgba(0, 60, 120, 0.06);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* Interface Section */
        .interface-section {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 2.5rem 3rem;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(16px);
          min-height: calc(100vh - 90px);
          border-left: 1px solid rgba(255, 255, 255, 0.6);
        }

        /* Welcome Content */
        .welcome-content {
          max-width: 500px;
          margin-top: 2rem;
        }

        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, rgba(68, 152, 202, 0.1) 0%, rgba(68, 152, 202, 0.05) 100%);
          border-radius: 24px;
          font-size: 0.8rem;
          color: #4498ca;
          font-weight: 500;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(68, 152, 202, 0.15);
        }

        .badge-icon {
          font-size: 1rem;
        }

        .welcome-header h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3.5rem;
          font-weight: 600;
          color: #1a3a50;
          margin: 0 0 0.75rem 0;
          letter-spacing: -1.5px;
          line-height: 1.1;
        }

        .welcome-subtitle {
          font-size: 1.2rem;
          color: #5a8aa8;
          line-height: 1.7;
          margin: 0 0 2.5rem 0;
          font-weight: 400;
        }

        .welcome-subtitle strong {
          color: #4498ca;
          font-weight: 600;
        }

        .intro-card {
          display: flex;
          gap: 1.25rem;
          padding: 1.75rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 252, 255, 0.9) 100%);
          border-radius: 20px;
          border: 1px solid rgba(68, 152, 202, 0.1);
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 60, 120, 0.05);
        }

        .intro-icon-wrap {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(229, 115, 115, 0.15) 0%, rgba(229, 115, 115, 0.08) 100%);
          border-radius: 14px;
          flex-shrink: 0;
        }

        .intro-icon {
          width: 24px;
          height: 24px;
          color: #e57373;
        }

        .intro-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        .intro-text-wrap {
          flex: 1;
        }

        .intro-text {
          font-size: 0.95rem;
          color: #4a6a80;
          line-height: 1.7;
          margin: 0;
        }

        .intro-text strong {
          color: #2c5a7c;
          font-weight: 600;
        }

        .session-info {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          color: #5a8aa8;
          font-weight: 500;
        }

        .info-icon-wrap {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(68, 152, 202, 0.12) 0%, rgba(68, 152, 202, 0.06) 100%);
          border-radius: 10px;
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
          gap: 1rem;
          width: 100%;
          max-width: 300px;
          padding: 1.1rem 2rem;
          background: linear-gradient(135deg, #4498ca 0%, #2c6a8c 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 30px rgba(68, 152, 202, 0.35);
          letter-spacing: -0.01em;
        }

        .start-session-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(68, 152, 202, 0.45);
        }

        .start-session-btn:active {
          transform: translateY(-1px);
        }

        .btn-text {
          flex: 1;
          text-align: center;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
          opacity: 0.9;
        }

        .btn-icon :global(svg) {
          width: 100%;
          height: 100%;
        }

        /* Dialog View */
        .dialog-view {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: calc(100vh - 140px);
        }

        .session-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0 1.25rem 0;
          padding-top: 3rem;
          border-bottom: 1px solid rgba(68, 152, 202, 0.1);
          margin-bottom: 1rem;
          flex-shrink: 0;
          position: relative;
        }

        .session-topic {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1rem;
          font-weight: 600;
          color: #2c5a7c;
        }

        .topic-emoji-small {
          font-size: 1.35rem;
        }

        .session-timer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #7a9ab0;
          padding: 0.5rem 1rem;
          background: rgba(68, 152, 202, 0.08);
          border-radius: 20px;
          font-weight: 500;
        }

        .session-timer-prominent {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 1.35rem;
          font-weight: 700;
          color: #2c5a7c;
          padding: 0.65rem 1.25rem;
          background: rgba(68, 152, 202, 0.12);
          border: 1px solid rgba(68, 152, 202, 0.2);
          border-radius: 16px;
          box-shadow: 0 2px 12px rgba(68, 152, 202, 0.1);
        }

        .session-timer-prominent .timer-icon {
          width: 22px;
          height: 22px;
        }

        .session-timer-prominent .timer-value {
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.02em;
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
          gap: 1.25rem;
          scrollbar-width: thin;
          scrollbar-color: rgba(68, 152, 202, 0.2) transparent;
        }

        .dialog-area::-webkit-scrollbar {
          width: 4px;
        }

        .dialog-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .dialog-area::-webkit-scrollbar-thumb {
          background: rgba(68, 152, 202, 0.2);
          border-radius: 4px;
        }

        .dialog-message {
          display: flex;
          gap: 0.85rem;
          max-width: 90%;
          animation: messageIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dialog-message.lisa {
          align-self: flex-start;
        }

        .dialog-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(68, 152, 202, 0.2);
          box-shadow: 0 2px 8px rgba(0, 60, 120, 0.1);
        }

        .msg-bubble {
          padding: 1.1rem 1.4rem;
          border-radius: 20px;
          background: #fff;
          border: 1px solid rgba(68, 152, 202, 0.08);
          box-shadow: 0 2px 12px rgba(0, 60, 120, 0.04);
        }

        .dialog-message.lisa .msg-bubble {
          border-bottom-left-radius: 6px;
          background: linear-gradient(135deg, #fff 0%, #f8fcff 100%);
        }

        .dialog-message.user .msg-bubble {
          background: linear-gradient(135deg, rgba(68, 152, 202, 0.12) 0%, rgba(68, 152, 202, 0.08) 100%);
          border-bottom-right-radius: 6px;
          border: 1px solid rgba(68, 152, 202, 0.15);
        }

        .msg-bubble p {
          font-size: 0.95rem;
          color: #2c5a7c;
          line-height: 1.65;
          margin: 0;
        }

        .typing-text {
          display: inline;
        }

        .typing-cursor {
          display: inline-block;
          animation: cursorBlink 0.8s infinite;
          color: #4498ca;
          font-weight: 300;
          margin-left: 1px;
        }

        @keyframes cursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Options Container */
        .options-container {
          padding: 1.5rem 0;
          flex-shrink: 0;
          border-top: 1px solid rgba(68, 152, 202, 0.08);
          margin-top: auto;
        }

        .options-label {
          font-size: 0.85rem;
          color: #7a9ab0;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .option-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          padding: 1.1rem 1.4rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.95) 100%);
          border: 1px solid rgba(68, 152, 202, 0.12);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: optionSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
        }

        @keyframes optionSlideIn {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .option-card:hover {
          background: #fff;
          border-color: rgba(68, 152, 202, 0.35);
          transform: translateX(6px);
          box-shadow: 0 8px 28px rgba(0, 60, 120, 0.1);
        }

        .option-card.option-ocean:hover {
          border-color: rgba(68, 152, 202, 0.5);
          box-shadow: 0 8px 28px rgba(68, 152, 202, 0.15);
        }

        .option-card.option-sage:hover {
          border-color: rgba(76, 175, 80, 0.4);
          box-shadow: 0 8px 28px rgba(76, 175, 80, 0.12);
        }

        .option-card.option-lavender:hover {
          border-color: rgba(156, 136, 255, 0.4);
          box-shadow: 0 8px 28px rgba(156, 136, 255, 0.12);
        }

        .option-icon {
          font-size: 1.6rem;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(68, 152, 202, 0.08);
          border-radius: 12px;
        }

        .option-card.option-sage .option-icon {
          background: rgba(76, 175, 80, 0.08);
        }

        .option-card.option-lavender .option-icon {
          background: rgba(156, 136, 255, 0.08);
        }

        .option-text {
          flex: 1;
          font-size: 0.95rem;
          color: #2c5a7c;
          line-height: 1.5;
          font-weight: 500;
        }

        .option-arrow {
          width: 20px;
          height: 20px;
          color: #b0c8d8;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .option-arrow :global(svg) {
          width: 100%;
          height: 100%;
        }

        .option-card:hover .option-arrow {
          color: #4498ca;
          transform: translateX(4px);
        }

        /* Topics Grid */
        .topics-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .topic-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          padding: 1.1rem 1.4rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 252, 255, 0.95) 100%);
          border: 1px solid rgba(68, 152, 202, 0.12);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: optionSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) backwards;
        }

        .topic-card:hover {
          background: #fff;
          border-color: rgba(68, 152, 202, 0.35);
          transform: translateX(6px);
          box-shadow: 0 8px 28px rgba(0, 60, 120, 0.1);
        }

        .topic-emoji {
          font-size: 1.75rem;
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(68, 152, 202, 0.1) 0%, rgba(68, 152, 202, 0.05) 100%);
          border-radius: 14px;
          flex-shrink: 0;
        }

        .topic-info {
          flex: 1;
        }

        .topic-card h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #2c5a7c;
          margin: 0 0 0.2rem 0;
        }

        .topic-subtitle {
          font-size: 0.8rem;
          color: #7a9ab0;
          margin: 0;
        }

        .topic-arrow {
          width: 20px;
          height: 20px;
          color: #b0c8d8;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .topic-arrow :global(svg) {
          width: 100%;
          height: 100%;
        }

        .topic-card:hover .topic-arrow {
          color: #4498ca;
          transform: translateX(4px);
        }

        /* Voice Control */
        .voice-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 0;
          margin-top: auto;
          flex-shrink: 0;
          border-top: 1px solid rgba(68, 152, 202, 0.08);
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
          background: rgba(68, 152, 202, 0.25);
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
          border: 3px solid rgba(68, 152, 202, 0.25);
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
          box-shadow: 0 4px 16px rgba(68, 152, 202, 0.3);
        }

        .voice-btn.listening .voice-btn-inner {
          background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
          box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
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
          font-weight: 500;
        }

        .end-session-btn {
          margin-top: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: #7a9ab0;
          border: 1px solid rgba(68, 152, 202, 0.15);
          border-radius: 25px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          align-self: center;
        }

        .end-session-btn:hover {
          background: rgba(239, 83, 80, 0.08);
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
            min-height: auto;
            justify-content: center;
          }

          .lisa-image-container {
            max-width: 280px;
          }

          .lisa-image {
            max-height: 50vh;
          }

          .interface-section {
            padding: 1.5rem 2rem;
            min-height: auto;
            justify-content: flex-start;
          }
          
          .dialog-view {
            max-height: 60vh;
          }
        }

        @media (max-width: 600px) {
          .welcome-header h1 {
            font-size: 2.5rem;
          }

          .welcome-subtitle {
            font-size: 1rem;
          }

          .session-info {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .option-card, .topic-card {
            padding: 1rem 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
