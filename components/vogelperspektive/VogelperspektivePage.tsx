'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CategoryPetal {
  id: string;
  title: string;
  status: 'positive' | 'negative' | 'neutral';
  angle: number;
}

const categories: CategoryPetal[] = [
  {
    id: 'sleep',
    title: 'Schlaf & Erholung',
    status: 'positive',
    angle: 0,
  },
  {
    id: 'movement',
    title: 'Bewegung & Sport',
    status: 'positive',
    angle: 36,
  },
  {
    id: 'nutrition',
    title: 'Ernährung',
    status: 'negative',
    angle: 72,
  },
  {
    id: 'cell-protection',
    title: 'Zellschutz & Zellreinigung',
    status: 'neutral',
    angle: 108,
  },
  {
    id: 'molecular',
    title: 'Molekulare Biologie',
    status: 'positive',
    angle: 144,
  },
  {
    id: 'gut',
    title: 'Darm & Immunsystem',
    status: 'neutral',
    angle: 180,
  },
  {
    id: 'social',
    title: 'Soziales Umfeld',
    status: 'positive',
    angle: 216,
  },
  {
    id: 'toxins',
    title: 'Umweltgifte',
    status: 'negative',
    angle: 252,
  },
  {
    id: 'therapies',
    title: 'High End Therapien',
    status: 'neutral',
    angle: 288,
  },
  {
    id: 'mental',
    title: 'Mentale Resilienz',
    status: 'negative',
    angle: 324,
  },
];

const getCategoryIcon = (categoryId: string, statusColor: string) => {
  const iconSize = 16;
  const icons: { [key: string]: React.ReactElement } = {
    'sleep': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 8l2 2-2 2" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    'movement': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <circle cx="12" cy="5" r="2" stroke={statusColor} strokeWidth="2"/>
        <path d="M12 7v4l-3 5M12 11l3 5M9 21l1.5-5M15 21l-1.5-5" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 11h3M14 11h3" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'nutrition': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M12 2C9 2 7 4 7 7c0 2 1 4 5 6 4-2 5-4 5-6 0-3-2-5-5-5z" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v14" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 5c0-1.5.5-3 2-3" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    'cell-protection': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M12 3L4 7v6c0 5.5 3.4 10.3 8 11.5 4.6-1.2 8-6 8-11.5V7l-8-4z" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'molecular': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M4 4c0 0 4 1 8 8s8 8 8 8" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 4c0 0-4 1-8 8s-8 8-8 8" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="2" fill={statusColor} opacity="0.4"/>
        <circle cx="16" cy="16" r="2" fill={statusColor} opacity="0.4"/>
        <circle cx="12" cy="12" r="1.5" fill={statusColor}/>
      </svg>
    ),
    'gut': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8v4M12 16h.01" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'social': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <circle cx="9" cy="7" r="3" stroke={statusColor} strokeWidth="2"/>
        <circle cx="15" cy="7" r="3" stroke={statusColor} strokeWidth="2"/>
        <path d="M3 21v-2a4 4 0 0 1 4-4h2" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 21v-2a4 4 0 0 0-4-4h-2" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 17v4" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="17" r="2" stroke={statusColor} strokeWidth="1.5" fill="none" opacity="0.6"/>
      </svg>
    ),
    'toxins': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M12 2L2 19h20L12 2z" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9v4" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1" fill={statusColor}/>
      </svg>
    ),
    'therapies': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 16.7l-6.2 4.5 2.4-7.3L2 9.4h7.6L12 2z" stroke={statusColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'mental': (
      <svg viewBox="0 0 24 24" fill="none" width={iconSize} height={iconSize}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke={statusColor} strokeWidth="2"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke={statusColor} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="9" cy="10" r="1" fill={statusColor}/>
        <circle cx="15" cy="10" r="1" fill={statusColor}/>
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  };
  return icons[categoryId] || icons['molecular'];
};

const topSignals = [
  { 
    label: 'Gesamt', 
    value: '78/100',
    context: 'Dein Longevity-Score basierend auf allen Lebensbereichen',
    status: 'good' as const
  },
  { 
    label: 'Schlaf & Erholung', 
    value: '72/100',
    context: 'Letzte Nacht: 6,5h Schlaf, 85% Effizienz',
    status: 'medium' as const
  },
  { 
    label: 'Stresslevel', 
    value: '41/100',
    context: 'Erhöhte HRV-Variabilität, Cortisol leicht erhöht',
    status: 'warning' as const
  },
  { 
    label: 'Energie heute', 
    value: '7,2/10',
    context: 'Basierend auf Schlafqualität und Aktivität',
    status: 'good' as const
  },
  { 
    label: 'Schritte', 
    value: '5.225',
    context: 'Tagesziel: 8.000 Schritte (65% erreicht)',
    status: 'medium' as const
  },
];

const recommendedActions = [
  { 
    text: 'Coaching mit Lisa AI', 
    subtext: '5-Min Check-in',
    buttonText: 'Jetzt starten',
    icon: '💬'
  },
  { 
    text: 'Früher schlafen', 
    subtext: 'Abend-Reset für bessere Erholung',
    buttonText: 'Erinnerung setzen',
    icon: '🌙'
  },
  { 
    text: 'Atemfokus', 
    subtext: '3-Min Entspannung',
    buttonText: 'Beginnen',
    icon: '🧘'
  },
  { 
    text: 'Protein-Impuls', 
    subtext: 'Energie stabilisieren',
    buttonText: 'Rezeptideen',
    icon: '🥗'
  },
  { 
    text: 'Stoffwechsel-Kick', 
    subtext: '10–15 Min Walk',
    buttonText: 'Los geht\'s',
    icon: '🚶'
  },
];

export default function VogelperspektivePage() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [benefitMessage, setBenefitMessage] = useState<string>('Wie fühlst du dich heute?');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive':
        return '#22c55e'; // Grün
      case 'negative':
        return '#ef4444'; // Rot
      case 'neutral':
      default:
        return '#3b82f6'; // Blau
    }
  };

  const calculatePosition = (angle: number, distance: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x = 50 + distance * Math.cos(rad);
    const y = 50 + distance * Math.sin(rad);
    return { x, y };
  };

  // Dynamischer Abstand basierend auf Winkel
  const getAdjustedRayLength = (angle: number) => {
    const baseLength = 11;
    
    // Spezifische Anpassungen pro Winkel für optimale Optik:
    // 0° (Schlaf) und 180° (Darm) = oben/unten - bleiben normal
    // 36°, 324° = oben diagonal - leicht näher
    // 72°, 108°, 252°, 288° = seitlich - näher
    // 144°, 216° = unten diagonal - leicht näher
    
    const adjustments: { [key: number]: number } = {
      0: 0,      // Schlaf - oben, normal
      36: -1,    // Bewegung - oben rechts diagonal, etwas weiter weg
      72: 1,     // Ernährung - rechts oben, weiter weg
      108: 1.5,  // Zellschutz - rechts mitte, weiter weg
      144: -1.5, // Molekulare - rechts unten diagonal, etwas weiter weg
      180: 0,    // Darm - unten, normal
      216: -1.5, // Soziales - links unten diagonal, etwas weiter weg
      252: 1.5,  // Umweltgifte - links mitte, weiter weg
      288: 1,    // Therapien - links oben, weiter weg
      324: -1,   // Mentale - oben links diagonal, etwas weiter weg
    };
    
    return baseLength + (adjustments[angle] || 0);
  };

  // Kürzere Strahlen - Ring näher zur Sonne
  const ringRadius = 16;

  return (
    <div className="bird-view-container">
      {/* Animierter Hintergrund */}
      <div className="animated-background">
        <div className="bg-gradient-orb bg-gradient-orb-1"></div>
        <div className="bg-gradient-orb bg-gradient-orb-2"></div>
        <div className="bg-gradient-orb bg-gradient-orb-3"></div>
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}></div>
          ))}
        </div>
      </div>

      <div className="bird-view-layout">
        {/* Hauptbereich mit Sonne, Strahlen und Kästen */}
        <div className="bird-view-canvas">
          {/* Background decoration - zentriert am Sonnen-Kreis */}
          <div className="bird-view-bg">
            <div className="bg-circle bg-circle-1"></div>
            <div className="bg-circle bg-circle-2"></div>
          </div>
          {/* SVG für Strahlen und Verbindungslinien */}
          <svg className="connection-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.2" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Ring mit Farben */}
            <g className="gradient-ring">
              {categories.map((cat, index) => {
                const color = getStatusColor(cat.status);
                const prevCat = categories[(index - 1 + categories.length) % categories.length];
                const prevColor = getStatusColor(prevCat.status);
                const nextCat = categories[(index + 1) % categories.length];
                const nextColor = getStatusColor(nextCat.status);
                
                const startAngle = cat.angle - 18;
                const endAngle = cat.angle + 18;
                
                const start = ((startAngle - 90) * Math.PI) / 180;
                const end = ((endAngle - 90) * Math.PI) / 180;
                
                const x1 = 50 + ringRadius * Math.cos(start);
                const y1 = 50 + ringRadius * Math.sin(start);
                const x2 = 50 + ringRadius * Math.cos(end);
                const y2 = 50 + ringRadius * Math.sin(end);
                
                const gradientId = `segGrad-${cat.id}`;
                
                return (
                  <g key={`ring-${cat.id}`}>
                    <defs>
                      <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>
                        <stop offset="0%" stopColor={prevColor} stopOpacity="0.4" />
                        <stop offset="25%" stopColor={color} stopOpacity="0.9" />
                        <stop offset="50%" stopColor={color} stopOpacity="1" />
                        <stop offset="75%" stopColor={color} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={nextColor} stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M ${x1} ${y1} A ${ringRadius} ${ringRadius} 0 0 1 ${x2} ${y2}`}
                      stroke={`url(#${gradientId})`}
                      strokeWidth="0.6"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </g>
            
            {/* Kürzere Verbindungslinien zu den Kästen */}
            {categories.map((category) => {
              const ringPos = calculatePosition(category.angle, ringRadius);
              const boxPos = calculatePosition(category.angle, ringRadius + getAdjustedRayLength(category.angle));
              const isHovered = hoveredCategory === category.id;
              const lineColor = getStatusColor(category.status);
              
              return (
                <g key={`line-${category.id}`}>
                  <line
                    x1={ringPos.x}
                    y1={ringPos.y}
                    x2={boxPos.x}
                    y2={boxPos.y}
                    stroke={lineColor}
                    strokeWidth={isHovered ? "0.4" : "0.25"}
                    strokeOpacity={isHovered ? "0.5" : "0.3"}
                  />
                  <circle
                    cx={boxPos.x}
                    cy={boxPos.y}
                    r={isHovered ? "0.5" : "0.35"}
                    fill={lineColor}
                    stroke="white"
                    strokeWidth="0.1"
                    opacity={isHovered ? "0.9" : "0.7"}
                  />
                </g>
              );
            })}
          </svg>

          {/* Zentrale Sonne mit Bild und Text */}
          <div className="central-sun-circle">
            {/* Dekorativer innerer Ring */}
            <div className="sun-inner-ring"></div>
            
            {/* Profilbild füllt den kompletten Kreis */}
            <div className="sun-image-wrapper">
              <div className="sun-image-glow"></div>
              <Image
                src="/images/profile-large2.png"
                alt="Profile"
                width={400}
                height={400}
                className="sun-profile-image"
              />
            </div>
            
            {/* Scores als Overlay über dem Bild */}
            <div className="sun-overlay-section">
            <div className="sun-benefit-text">
              {benefitMessage}
              </div>
              <div className="sun-score-badge">
                <span className="sun-score-value">78</span>
                <span className="sun-score-label">/100</span>
              </div>
            </div>
          </div>

          {/* Kategorien-Kästen - niedriger */}
          {categories.map((category) => {
            const pos = calculatePosition(category.angle, ringRadius + getAdjustedRayLength(category.angle));
            const isHovered = hoveredCategory === category.id;
            const statusColor = getStatusColor(category.status);

            return (
              <div
                key={category.id}
                className={`category-box ${category.status} ${isHovered ? 'hovered' : ''}`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  '--status-color': statusColor,
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="category-box-content">
                  <div className="category-icon-wrapper" style={{ '--icon-color': statusColor } as React.CSSProperties}>
                    <div className="icon-bg"></div>
                    {getCategoryIcon(category.id, statusColor)}
                  </div>
                  <div className="category-title">{category.title}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Unten: Signale und Maßnahmen */}
      <div className="bottom-section">
        <div className="signals-box">
          <div className="box-title">Deine 5 wichtigsten Signale für heute</div>
          <div className="signals-list">
            {topSignals.map((signal, index) => (
              <div key={index} className={`signal-item signal-${signal.status}`}>
                <span className="signal-number">{index + 1}</span>
                <div className="signal-content">
                  <div className="signal-header">
                    <span className="signal-label">{signal.label}</span>
                <span className="signal-value">{signal.value}</span>
                  </div>
                  <span className="signal-context">{signal.context}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-box">
          <div className="box-title">Empfohlene Maßnahmen</div>
          <div className="actions-list">
            {recommendedActions.map((action, index) => (
              <div key={index} className="action-item">
                <span className="action-icon">{action.icon}</span>
                <div className="action-content">
                <span className="action-text">{action.text}</span>
                  <span className="action-subtext">{action.subtext}</span>
                </div>
                <button className="action-button">{action.buttonText}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bird-view-container {
          width: 100%;
          min-height: calc(100vh - 80px);
          background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 20%, #f0fdfa 40%, #ecfeff 60%, #e0f2fe 80%, #f0f9ff 100%);
          position: relative;
          overflow-x: hidden;
          overflow-y: visible;
          display: flex;
          flex-direction: column;
          padding: 1rem 2.5rem 2.5rem 2.5rem;
          animation: backgroundShift 20s ease-in-out infinite;
        }

        @keyframes backgroundShift {
          0%, 100% { 
            background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 20%, #f0fdfa 40%, #ecfeff 60%, #e0f2fe 80%, #f0f9ff 100%);
          }
          50% { 
            background: linear-gradient(145deg, #e0f2fe 0%, #f0fdfa 20%, #ecfeff 40%, #f0f9ff 60%, #e0f2fe 80%, #f0fdfa 100%);
          }
        }

        /* Animierter Hintergrund */
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .bg-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: floatOrb 20s ease-in-out infinite;
        }

        .bg-gradient-orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(34, 197, 94, 0.2) 50%, transparent 70%);
          top: 10%;
          left: 10%;
          animation: floatOrb 25s ease-in-out infinite;
        }

        .bg-gradient-orb-2 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 70%);
          top: 60%;
          right: 15%;
          animation: floatOrb 30s ease-in-out infinite reverse;
        }

        .bg-gradient-orb-3 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 70%);
          bottom: 20%;
          left: 50%;
          animation: floatOrb 35s ease-in-out infinite;
        }

        @keyframes floatOrb {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          25% { 
            transform: translate(50px, -30px) scale(1.1);
            opacity: 0.5;
          }
          50% { 
            transform: translate(-30px, 50px) scale(0.9);
            opacity: 0.3;
          }
          75% { 
            transform: translate(30px, 30px) scale(1.05);
            opacity: 0.45;
          }
        }

        .bg-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%);
          border-radius: 50%;
          animation: particleFloat linear infinite;
          box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px) scale(1);
            opacity: 0;
          }
        }

        .bird-view-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: visible;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
          animation: float 25s ease-in-out infinite;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.03); }
        }

        .bg-circle-1 {
          width: 900px;
          height: 900px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.06) 40%, transparent 70%);
        }

        .bg-circle-2 {
          width: 1400px;
          height: 1400px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.05) 30%, transparent 60%);
          animation-delay: -12s;
        }

        .bird-view-layout {
          position: relative;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* Canvas für Sonne und Strahlen */
        .bird-view-canvas {
          position: relative;
          width: 100%;
          max-width: 1000px;
          aspect-ratio: 1;
          margin: 0 auto 2rem;
          padding-top: 0;
        }

        .connection-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          animation: pulseLines 3s ease-in-out infinite;
        }

        @keyframes pulseLines {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .central-sun-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${ringRadius * 2}%;
          height: ${ringRadius * 2}%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 50%, rgba(224, 242, 254, 0.9) 100%);
          backdrop-filter: blur(30px);
          box-shadow: 
            0 8px 40px rgba(59, 130, 246, 0.2),
            0 4px 20px rgba(34, 197, 94, 0.1),
            inset 0 2px 0 rgba(255, 255, 255, 1),
            inset 0 -2px 0 rgba(0, 110, 167, 0.05),
            0 0 60px rgba(59, 130, 246, 0.15);
          border: 3px solid rgba(255, 255, 255, 0.95);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          overflow: hidden;
          margin: 0;
          padding: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: sunPulse 4s ease-in-out infinite;
        }

        @keyframes sunPulse {
          0%, 100% { 
            box-shadow: 
              0 8px 40px rgba(59, 130, 246, 0.2),
              0 4px 20px rgba(34, 197, 94, 0.1),
              inset 0 2px 0 rgba(255, 255, 255, 1),
              inset 0 -2px 0 rgba(0, 110, 167, 0.05),
              0 0 60px rgba(59, 130, 246, 0.15);
          }
          50% { 
            box-shadow: 
              0 12px 50px rgba(59, 130, 246, 0.25),
              0 6px 25px rgba(34, 197, 94, 0.15),
              inset 0 2px 0 rgba(255, 255, 255, 1),
              inset 0 -2px 0 rgba(0, 110, 167, 0.08),
              0 0 80px rgba(59, 130, 246, 0.25);
          }
        }

        .central-sun-circle:hover {
          transform: translate(-50%, -50%) scale(1.02);
          box-shadow: 
            0 12px 50px rgba(59, 130, 246, 0.25),
            0 6px 25px rgba(34, 197, 94, 0.15),
            inset 0 2px 0 rgba(255, 255, 255, 1),
            inset 0 -2px 0 rgba(0, 110, 167, 0.08);
        }

        /* Dekorativer innerer Ring */
        .sun-inner-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          height: 85%;
          border-radius: 50%;
          border: 2px solid rgba(59, 130, 246, 0.15);
          pointer-events: none;
          z-index: 1;
        }

        .sun-image-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: 0;
          padding: 0;
          border-radius: 50%;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: wrapperPulse 4s ease-in-out infinite;
        }

        @keyframes wrapperPulse {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.02);
          }
        }

        .sun-image-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 110%;
          height: 110%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(34, 197, 94, 0.05) 40%, transparent 70%);
          filter: blur(10px);
          z-index: 0;
          pointer-events: none;
          animation: pulseGlow 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.02); }
        }

        .sun-profile-image {
          width: 70%;
          height: 70%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
          margin: 0;
          padding: 0;
          border-radius: 50%;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
          animation: imagePulse 3s ease-in-out infinite;
        }

        @keyframes imagePulse {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1);
          }
          50% { 
            transform: scale(1.03);
            filter: brightness(1.05);
          }
        }

        .central-sun-circle:hover .sun-profile-image {
          animation: none;
          transform: scale(1.08);
          filter: brightness(1.1);
        }

        .sun-overlay-section {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          padding: 1rem 0.75rem;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 3;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.5) 100%);
          border-radius: 50%;
        }

        .sun-benefit-text {
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          text-align: center;
          margin-bottom: 0.6rem;
          letter-spacing: 0.02em;
          line-height: 1.3;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .sun-score-badge {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.9) 100%);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 24px;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .sun-score-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e40af;
          line-height: 1;
        }

        .sun-score-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #3b82f6;
          opacity: 0.7;
        }

        /* Kategorien-Kästen - modernisiert */
        .category-box {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 5;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .category-box.hovered {
          z-index: 20;
          transform: translate(-50%, -50%) scale(1.1);
        }

        .category-box-content {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.97) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 0.5rem 0.75rem;
          min-width: 115px;
          max-width: 170px;
          width: max-content;
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1.5px solid rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          position: relative;
          overflow: visible;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .category-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          position: relative;
          transition: all 0.3s ease;
        }

        .icon-bg {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: var(--icon-color);
          opacity: 0.12;
          transition: all 0.35s ease;
        }

        .category-box.hovered .icon-bg {
          opacity: 0.22;
          transform: scale(1.1);
        }

        .category-box.hovered .category-icon-wrapper {
          transform: scale(1.15) rotate(-3deg);
        }

        .category-icon-wrapper svg {
          width: 14px;
          height: 14px;
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
          transition: all 0.3s ease;
        }

        .category-box.hovered .category-icon-wrapper svg {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }


        .category-box.hovered .category-box-content {
          box-shadow: 
            0 15px 45px rgba(0, 0, 0, 0.2),
            0 6px 20px rgba(0, 0, 0, 0.12),
            0 0 0 4px var(--status-color),
            0 0 20px var(--status-color);
          transform: translateY(-4px);
          border-color: var(--status-color);
        }

        .category-box.positive .category-box-content {
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.12),
            0 3px 10px rgba(0, 0, 0, 0.08),
            0 0 15px rgba(34, 197, 94, 0.2);
        }

        .category-box.negative .category-box-content {
          border-color: rgba(239, 68, 68, 0.4);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.12),
            0 3px 10px rgba(0, 0, 0, 0.08),
            0 0 15px rgba(239, 68, 68, 0.2);
        }

        .category-box.neutral .category-box-content {
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.12),
            0 3px 10px rgba(0, 0, 0, 0.08),
            0 0 15px rgba(59, 130, 246, 0.2);
        }

        .category-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #1e293b;
          text-align: left;
          white-space: normal;
          word-wrap: break-word;
          line-height: 1.25;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
          flex: 1;
        }

        .category-box.hovered .category-title {
          color: var(--status-color);
        }

        /* Unten: Signale und Maßnahmen */
        .bottom-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          max-width: 1100px;
          margin: -2rem auto 0;
          padding: 0 1rem;
        }

        .signals-box,
        .actions-box {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 100%);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          box-shadow: 
            0 4px 20px rgba(59, 130, 246, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          transition: all 0.25s ease;
        }

        .signals-box:hover,
        .actions-box:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 30px rgba(59, 130, 246, 0.12),
            0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .box-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 0.9rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .box-title::before {
          content: '';
          width: 3px;
          height: 16px;
          background: linear-gradient(180deg, #3b82f6 0%, #22c55e 100%);
          border-radius: 2px;
        }

        .signals-list,
        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .signal-item,
        .action-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.8rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 10px;
          transition: all 0.2s ease;
          border: 1px solid rgba(59, 130, 246, 0.08);
        }

        .signal-item:hover,
        .action-item:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: translateX(3px);
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.15);
        }

        .signal-number {
          font-weight: 700;
          font-size: 0.7rem;
          color: #fff;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          width: 22px;
          height: 22px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .signal-item.signal-good .signal-number {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        }

        .signal-item.signal-medium .signal-number {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .signal-item.signal-warning .signal-number {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .signal-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .signal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .signal-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
        }

        .signal-value {
          font-size: 0.8rem;
          font-weight: 700;
          color: #1e40af;
          background: rgba(59, 130, 246, 0.1);
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
        }

        .signal-item.signal-good .signal-value {
          color: #15803d;
          background: rgba(34, 197, 94, 0.1);
        }

        .signal-item.signal-warning .signal-value {
          color: #b45309;
          background: rgba(245, 158, 11, 0.1);
        }

        .signal-context {
          font-size: 0.7rem;
          color: #94a3b8;
          line-height: 1.3;
        }

        .action-icon {
          font-size: 1.1rem;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.08);
          border-radius: 8px;
          flex-shrink: 0;
        }

        .action-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .action-text {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          line-height: 1.2;
        }

        .action-subtext {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .action-button {
          font-size: 0.7rem;
          font-weight: 600;
          color: #fff;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none;
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .action-button:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .action-button:active {
          transform: translateY(0);
        }

        @media (max-width: 1200px) {
          .bottom-section {
            grid-template-columns: 1fr;
          }

          .sun-benefit-text {
            font-size: 0.8rem;
            padding: 0.4rem;
          }
        }

        @media (max-width: 900px) {
          .bird-view-canvas {
            max-width: 700px;
          }

          .sun-benefit-text {
            font-size: 0.75rem;
            padding: 0.3rem;
          }

          .category-box-content {
            min-width: 120px;
            padding: 0.5rem 0.8rem;
          }

          .category-title {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 600px) {
          .bird-view-container {
            padding: 1rem;
          }

          .bird-view-canvas {
            max-width: 500px;
          }

          .sun-benefit-text {
            font-size: 0.65rem;
            padding: 0.3rem;
          }

          .category-box-content {
            min-width: 100px;
            padding: 0.4rem 0.6rem;
          }

          .category-title {
            font-size: 0.55rem;
          }

          .scores-box,
          .nbas-box,
          .signals-box,
          .actions-box {
            padding: 1.2rem;
          }

          .box-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
