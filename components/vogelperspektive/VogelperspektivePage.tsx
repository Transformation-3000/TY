'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CategoryPetal {
  id: string;
  title: string;
  score: string;
  unit?: string;
  subInfo: string;
  trend: string;
  status: 'good' | 'warning' | 'critical';
  angle: number;
}

const categories: CategoryPetal[] = [
  {
    id: 'sleep',
    title: 'SCHLAFQUALITÄT',
    score: '87',
    unit: '/100',
    subInfo: '7.5h letzte Nacht',
    trend: '+5%',
    status: 'good',
    angle: 0,
  },
  {
    id: 'recovery',
    title: 'RECOVERY',
    score: '72',
    unit: '/100',
    subInfo: 'HRV: 45ms',
    trend: '-8%',
    status: 'warning',
    angle: 36,
  },
  {
    id: 'steps',
    title: 'TAGESSCHRITTE',
    score: '12.450',
    subInfo: 'Ziel: 10.000',
    trend: '+24%',
    status: 'good',
    angle: 72,
  },
  {
    id: 'nutrition',
    title: 'ERNÄHRUNG',
    score: '68',
    unit: '/100',
    subInfo: '1.850 kcal',
    trend: '-3%',
    status: 'warning',
    angle: 108,
  },
  {
    id: 'fitness',
    title: 'FITNESS',
    score: '91',
    unit: '/100',
    subInfo: 'VO2max: 48',
    trend: '+12%',
    status: 'good',
    angle: 144,
  },
  {
    id: 'stress',
    title: 'STRESS',
    score: '45',
    unit: '/100',
    subInfo: '0 Min Meditation',
    trend: '-15%',
    status: 'critical',
    angle: 180,
  },
  {
    id: 'heart',
    title: 'HERZGESUNDHEIT',
    score: '82',
    unit: '/100',
    subInfo: 'Ruhepuls: 58',
    trend: '+4%',
    status: 'good',
    angle: 216,
  },
  {
    id: 'cognitive',
    title: 'KOGNITION',
    score: '78',
    unit: '/100',
    subInfo: 'Focus: 85%',
    trend: '+7%',
    status: 'good',
    angle: 252,
  },
  {
    id: 'hydration',
    title: 'HYDRATION',
    score: '2.1',
    unit: 'L',
    subInfo: 'Ziel: 2.5L',
    trend: '-16%',
    status: 'warning',
    angle: 288,
  },
  {
    id: 'biomarkers',
    title: 'BIOMARKER',
    score: '54',
    unit: '/100',
    subInfo: 'Cholesterin ↑',
    trend: '-22%',
    status: 'critical',
    angle: 324,
  },
];

export default function VogelperspektivePage() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'warning':
        return '#FFA000';
      case 'critical':
        return '#EF5350';
      default:
        return '#4C99C2';
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return '#4CAF50';
    if (trend.startsWith('-')) return '#EF5350';
    return '#7a9ab0';
  };

  const calculatePosition = (angle: number, distance: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const x = 50 + distance * Math.cos(rad);
    const y = 50 + distance * Math.sin(rad);
    return { x, y };
  };

  // Ring radius - directly at center circle edge
  const ringRadius = 16.5;

  return (
    <div className="bird-view-container">
      {/* Background decoration */}
      <div className="bird-view-bg">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
      </div>

      <div className="bird-view-canvas">
        {/* SVG for ring and connection lines */}
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
          
          
          {/* Thin crisp ring line */}
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
                      <stop offset="0%" stopColor={prevColor} stopOpacity="0.5" />
                      <stop offset="30%" stopColor={color} stopOpacity="0.8" />
                      <stop offset="50%" stopColor={color} stopOpacity="1" />
                      <stop offset="70%" stopColor={color} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={nextColor} stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M ${x1} ${y1} A ${ringRadius} ${ringRadius} 0 0 1 ${x2} ${y2}`}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="0.5"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                  {/* Subtle breathing */}
                  <path
                    d={`M ${x1} ${y1} A ${ringRadius} ${ringRadius} 0 0 1 ${x2} ${y2}`}
                    stroke={color}
                    strokeWidth="0.3"
                    fill="none"
                    strokeLinecap="round"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.25;0.55;0.25"
                      dur="5s"
                      repeatCount="indefinite"
                      begin={`${index * 0.5}s`}
                    />
                  </path>
                </g>
              );
            })}
          </g>
          
          {/* Connection lines with smooth wave pulse */}
          {categories.map((category, index) => {
            const ringPos = calculatePosition(category.angle, ringRadius);
            const petalPos = calculatePosition(category.angle, 35);
            const isHovered = hoveredCategory === category.id;
            const lineColor = getStatusColor(category.status);
            const lineId = `line-${category.id}`;
            const waveGradId = `waveGrad-${category.id}`;
            
            return (
              <g key={lineId}>
                <defs>
                  {/* Animated gradient for smooth wave effect */}
                  <linearGradient id={waveGradId} x1={petalPos.x} y1={petalPos.y} x2={ringPos.x} y2={ringPos.y} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={lineColor} stopOpacity="0.15">
                      <animate
                        attributeName="offset"
                        values="-0.5;1"
                        dur="4s"
                        repeatCount="indefinite"
                        begin={`${index * 0.4}s`}
                      />
                    </stop>
                    <stop offset="20%" stopColor={lineColor} stopOpacity="0.5">
                      <animate
                        attributeName="offset"
                        values="-0.3;1.2"
                        dur="4s"
                        repeatCount="indefinite"
                        begin={`${index * 0.4}s`}
                      />
                    </stop>
                    <stop offset="50%" stopColor={lineColor} stopOpacity="0.15">
                      <animate
                        attributeName="offset"
                        values="0;1.5"
                        dur="4s"
                        repeatCount="indefinite"
                        begin={`${index * 0.4}s`}
                      />
                    </stop>
                  </linearGradient>
                </defs>
                
                {/* Base line */}
                <line
                  x1={ringPos.x}
                  y1={ringPos.y}
                  x2={petalPos.x}
                  y2={petalPos.y}
                  stroke={lineColor}
                  strokeWidth={isHovered ? "0.3" : "0.2"}
                  strokeOpacity="0.2"
                />
                
                {/* Wave pulse line */}
                <line
                  x1={ringPos.x}
                  y1={ringPos.y}
                  x2={petalPos.x}
                  y2={petalPos.y}
                  stroke={`url(#${waveGradId})`}
                  strokeWidth="0.35"
                  strokeLinecap="round"
                />
                
                {/* Connection dot at petal */}
                <circle
                  cx={petalPos.x}
                  cy={petalPos.y}
                  r={isHovered ? "0.6" : "0.4"}
                  fill={lineColor}
                  stroke="white"
                  strokeWidth="0.12"
                  opacity="0.6"
                />
              </g>
            );
          })}
        </svg>

        {/* Central Score Hub */}
        <div className="central-hub">
          <div className="hub-glow"></div>
          <div className="hub-content">
            <div className="profile-avatar">
              <Image
                src="/images/profilepic.png"
                alt="Profile"
                width={90}
                height={90}
                className="avatar-image"
              />
            </div>
            <div className="score-display">
              <span className="score-number">825</span>
              <div className="score-meta">
                <span className="score-period">TODAY'S</span>
                <span className="score-comparison">(6 MONTH IHS: 880</span>
                <span className="score-avg">YOUR AGE GROUP AVERAGE: 780</span>
          </div>
            </div>
            <div className="score-title">TODAY'S LONGEVITY SCORE</div>
            <div className="score-subtitle">YOUR AGE GROUP AVERAGE</div>
            <div className="hub-actions">
              <button className="hub-btn hub-btn-primary">SET NEW GOALS</button>
              <button className="hub-btn hub-btn-secondary">RECOVERY PLAN</button>
            </div>
          </div>
        </div>

        {/* Score Cards - Cloud shaped */}
        {categories.map((category) => {
          const pos = calculatePosition(category.angle, 38);
          const isHovered = hoveredCategory === category.id;
          const statusColor = getStatusColor(category.status);
          const trendColor = getTrendColor(category.trend);

          return (
            <div
              key={category.id}
              className={`petal-cloud ${category.status} ${isHovered ? 'hovered' : ''}`}
                style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                '--status-color': statusColor,
              } as React.CSSProperties}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
              {/* Cloud shape with pointer */}
              <div className="cloud-shape">
                <div 
                  className="cloud-pointer"
                  style={{
                    transform: `rotate(${category.angle + 180}deg)`,
                    background: statusColor,
                  }}
                ></div>
                  </div>
              
              {/* Content with Score */}
              <div className="cloud-content">
                <div className="cloud-title">{category.title}</div>
                
                <div className="score-row">
                  <span className="main-score" style={{ color: statusColor }}>
                    {category.score}
                  </span>
                  {category.unit && (
                    <span className="score-unit">{category.unit}</span>
                  )}
                </div>
                
                <div className="info-row">
                  <span className="sub-info">{category.subInfo}</span>
                  <span className="trend" style={{ color: trendColor }}>
                    {category.trend}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bird-view-footer">
        <span>HOW IT STARTED: BIRD'S-EYE VIEW</span>
        <span className="footer-sparkle">✦</span>
      </div>

      <style jsx>{`
        .bird-view-container {
          width: 100%;
          min-height: calc(100vh - 80px);
          background: linear-gradient(160deg, #a8cce8 0%, #7eb3d9 30%, #b5d4ed 60%, #d4e5f2 100%);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .bird-view-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .bg-circle {
          position: absolute;
          border-radius: 50%;
        }

        .bg-circle-1 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(200, 225, 245, 0.4) 0%, transparent 60%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .bg-circle-2 {
          width: 1200px;
          height: 1200px;
          background: radial-gradient(circle, rgba(220, 235, 250, 0.3) 0%, transparent 50%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .bird-view-canvas {
          position: relative;
          width: 100%;
          max-width: 1000px;
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .connection-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        /* Subtle ambient animations */
        .gradient-ring {
          filter: blur(0.2px);
        }

        /* Central Hub */
        .central-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          z-index: 10;
        }

        .hub-glow {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          pointer-events: none;
          background: transparent;
        }

        .hub-content {
          position: relative;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg, 
            rgba(255, 255, 255, 0.85) 0%, 
            rgba(248, 252, 255, 0.82) 50%,
            rgba(255, 255, 255, 0.85) 100%
          );
          backdrop-filter: blur(10px) saturate(1.2);
          -webkit-backdrop-filter: blur(10px) saturate(1.2);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          box-shadow: 
            0 4px 24px rgba(0, 100, 150, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            inset 0 -1px 0 rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .hub-content::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.3) 0%,
            transparent 40%
          );
          pointer-events: none;
        }

        .profile-avatar {
          width: 95px;
          height: 95px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid rgba(200, 220, 240, 0.9);
          box-shadow: 0 4px 20px rgba(0, 100, 150, 0.2);
          margin-bottom: 0.4rem;
        }

        .profile-avatar :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .score-display {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.2rem;
        }

        .score-number {
          font-size: 2.8rem;
          font-weight: 700;
          color: #2a5070;
          letter-spacing: -2px;
          line-height: 1;
        }

        .score-meta {
          display: flex;
          flex-direction: column;
          font-size: 0.5rem;
          color: #5a8aa8;
          font-weight: 600;
          line-height: 1.3;
        }

        .score-title {
          font-size: 0.6rem;
          font-weight: 700;
          color: #3a6a88;
          letter-spacing: 0.4px;
          margin-bottom: 0.15rem;
        }

        .score-subtitle {
          font-size: 0.5rem;
          color: #7a9ab0;
          margin-bottom: 0.5rem;
        }

        .hub-actions {
          display: flex;
          gap: 0.4rem;
        }

        .hub-btn {
          padding: 0.35rem 0.7rem;
          border-radius: 20px;
          font-size: 0.5rem;
          font-weight: 700;
          letter-spacing: 0.2px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          white-space: nowrap;
        }

        .hub-btn-primary {
          background: linear-gradient(135deg, #3a8ab8 0%, #2a6a98 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(50, 120, 170, 0.3);
        }

        .hub-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(50, 120, 170, 0.4);
        }

        .hub-btn-secondary {
          background: white;
          color: #3a8ab8;
          border: 1.5px solid #3a8ab8;
        }

        .hub-btn-secondary:hover {
          background: #f0f8fc;
        }

        /* Cloud-shaped Score Cards */
        .petal-cloud {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 5;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .petal-cloud.hovered {
          z-index: 20;
          transform: translate(-50%, -50%) scale(1.06);
        }

        .cloud-shape {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(10px);
          border-radius: 35% 35% 40% 40% / 30% 30% 45% 45%;
          box-shadow: 
            0 4px 25px rgba(0, 60, 100, 0.1),
            0 2px 10px rgba(0, 0, 0, 0.05),
            inset 0 2px 15px rgba(255, 255, 255, 0.8);
          border: 2px solid rgba(200, 220, 240, 0.6);
          transition: all 0.3s ease;
        }

        .petal-cloud.hovered .cloud-shape {
          box-shadow: 
            0 8px 35px rgba(0, 60, 100, 0.18),
            0 4px 15px rgba(0, 0, 0, 0.08),
            inset 0 2px 15px rgba(255, 255, 255, 0.9);
          border-color: var(--status-color);
        }

        .petal-cloud.critical .cloud-shape {
          border-color: rgba(239, 83, 80, 0.4);
        }

        .cloud-pointer {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          margin-top: -68px;
          margin-left: -5px;
          transform-origin: 5px 73px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          border: 2px solid white;
        }

        .cloud-content {
          position: relative;
          width: 130px;
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1rem;
          gap: 0.3rem;
          text-align: center;
        }

        .cloud-title {
          font-size: 0.6rem;
          font-weight: 700;
          color: #4a6a88;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }

        .score-row {
          display: flex;
          align-items: baseline;
          gap: 0.15rem;
        }

        .main-score {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -1px;
        }

        .score-unit {
          font-size: 0.7rem;
          font-weight: 600;
          color: #7a9ab0;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .sub-info {
          font-size: 0.55rem;
          color: #6a8aa8;
          font-weight: 500;
        }

        .trend {
          font-size: 0.6rem;
          font-weight: 700;
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.04);
        }

        /* Footer */
        .bird-view-footer {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #7a9ab0;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 1.5px;
        }

        .footer-sparkle {
          color: #5a8aa8;
          font-size: 1.2rem;
        }

        @media (max-width: 900px) {
          .bird-view-canvas {
            max-width: 700px;
          }

          .central-hub {
            width: 220px;
            height: 220px;
          }

          .profile-avatar {
            width: 70px;
            height: 70px;
          }

          .score-number {
            font-size: 2rem;
          }
          
          .hub-btn {
            padding: 0.3rem 0.5rem;
            font-size: 0.45rem;
          }

          .cloud-content {
            width: 110px;
            height: 95px;
            padding: 0.6rem 0.8rem;
          }

          .cloud-title {
            font-size: 0.5rem;
          }

          .main-score {
            font-size: 1.3rem;
          }

          .score-unit {
            font-size: 0.6rem;
          }

          .sub-info {
            font-size: 0.45rem;
          }

          .trend {
            font-size: 0.5rem;
          }

          .cloud-pointer {
            width: 8px;
            height: 8px;
            margin-top: -55px;
            margin-left: -4px;
            transform-origin: 4px 59px;
          }
        }

        @media (max-width: 600px) {
          .bird-view-container {
            padding: 1rem;
          }

          .bird-view-canvas {
            max-width: 450px;
          }

          .central-hub {
            width: 160px;
            height: 160px;
          }

          .hub-content {
            padding: 0.8rem;
          }

          .profile-avatar {
            width: 50px;
            height: 50px;
            margin-bottom: 0.2rem;
          }

          .score-number {
            font-size: 1.4rem;
          }

          .score-meta,
          .score-subtitle {
            display: none;
          }

          .score-title {
            font-size: 0.4rem;
          }

          .hub-actions {
            flex-direction: row;
            gap: 0.2rem;
          }

          .hub-btn {
            padding: 0.2rem 0.4rem;
            font-size: 0.35rem;
          }

          .cloud-content {
            width: 80px;
            height: 70px;
            padding: 0.4rem 0.5rem;
            gap: 0.15rem;
          }

          .cloud-title {
            font-size: 0.4rem;
            margin-bottom: 0;
          }

          .main-score {
            font-size: 1rem;
          }

          .score-unit {
            font-size: 0.45rem;
          }

          .info-row {
            flex-direction: column;
            gap: 0.1rem;
          }

          .sub-info {
            font-size: 0.35rem;
          }

          .trend {
            font-size: 0.4rem;
            padding: 0.1rem 0.2rem;
          }

          .cloud-pointer {
            width: 6px;
            height: 6px;
            margin-top: -40px;
            margin-left: -3px;
            transform-origin: 3px 43px;
          }

          .cloud-shape {
            border-radius: 30% 30% 35% 35% / 25% 25% 40% 40%;
          }
        }
      `}</style>
    </div>
  );
}
