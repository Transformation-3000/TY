'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DigitalTwin3D = dynamic(() => import('./DigitalTwin3D'), {
  ssr: false,
});

interface BodyMetric {
  id: string;
  name: string;
  position: { x: number; y: number };
  current: number;
  past: number;
  future: number;
  unit: string;
  icon: string;
  color: string;
}

interface TimePoint {
  id: string;
  label: string;
  months: number;
  date: string;
}

export default function LongevityJourneyPage() {
  const [selectedTimePoint, setSelectedTimePoint] = useState<string>('current');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const timePoints: TimePoint[] = [
    { id: 'start', label: 'Start', months: 0, date: 'Jan 2024' },
    { id: 'month3', label: '3 Monate', months: 3, date: 'Apr 2024' },
    { id: 'current', label: 'Jetzt', months: 6, date: 'Jul 2024' },
    { id: 'month9', label: '9 Monate', months: 9, date: 'Okt 2024' },
    { id: 'year1', label: '1 Jahr', months: 12, date: 'Jan 2025' },
  ];

  const bodyMetrics: BodyMetric[] = [
    {
      id: 'heart',
      name: 'Herzgesundheit',
      position: { x: 50, y: 35 },
      current: 85,
      past: 72,
      future: 92,
      unit: '%',
      icon: 'bi-heart-pulse',
      color: '#dc3545',
    },
    {
      id: 'brain',
      name: 'Kognitive Leistung',
      position: { x: 50, y: 20 },
      current: 78,
      past: 68,
      future: 88,
      unit: '%',
      icon: 'bi-cpu',
      color: '#006EA7',
    },
    {
      id: 'muscle',
      name: 'Muskelmasse',
      position: { x: 40, y: 50 },
      current: 82,
      past: 75,
      future: 90,
      unit: '%',
      icon: 'bi-lightning',
      color: '#7FD049',
    },
    {
      id: 'bone',
      name: 'Knochendichte',
      position: { x: 50, y: 60 },
      current: 88,
      past: 85,
      future: 93,
      unit: '%',
      icon: 'bi-shield',
      color: '#4C99C2',
    },
    {
      id: 'metabolism',
      name: 'Stoffwechsel',
      position: { x: 60, y: 50 },
      current: 80,
      past: 70,
      future: 89,
      unit: '%',
      icon: 'bi-fire',
      color: '#FF6B35',
    },
    {
      id: 'immune',
      name: 'Immunsystem',
      position: { x: 50, y: 45 },
      current: 83,
      past: 76,
      future: 91,
      unit: '%',
      icon: 'bi-shield-check',
      color: '#7FD049',
    },
    {
      id: 'skin',
      name: 'Hautgesundheit',
      position: { x: 50, y: 30 },
      current: 79,
      past: 71,
      future: 87,
      unit: '%',
      icon: 'bi-circle',
      color: '#E8B4CB',
    },
    {
      id: 'energy',
      name: 'Energielevel',
      position: { x: 50, y: 25 },
      current: 81,
      past: 65,
      future: 90,
      unit: '%',
      icon: 'bi-battery-full',
      color: '#FFD700',
    },
  ];

  const currentTimePoint = timePoints.find(tp => tp.id === selectedTimePoint) || timePoints[2];
  const currentIndex = timePoints.findIndex(tp => tp.id === selectedTimePoint);

  useEffect(() => {
    setAnimationProgress(0);
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [selectedTimePoint]);

  const getMetricValue = (metric: BodyMetric) => {
    if (selectedTimePoint === 'start') return metric.past;
    if (selectedTimePoint === 'current') return metric.current;
    
    const timeIndex = timePoints.findIndex(tp => tp.id === selectedTimePoint);
    if (timeIndex === -1) return metric.current;
    
    if (timeIndex < 2) {
      // Zwischen Start und Jetzt
      const progress = timePoints[timeIndex].months / 6;
      return metric.past + (metric.current - metric.past) * progress;
    } else {
      // Zwischen Jetzt und Zukunft
      const progress = (timePoints[timeIndex].months - 6) / 6;
      return metric.current + (metric.future - metric.current) * progress;
    }
  };

  const getMetricColor = (metric: BodyMetric, value: number) => {
    if (value >= 85) return '#7FD049';
    if (value >= 75) return '#4C99C2';
    if (value >= 65) return '#FFD700';
    return '#FF6B35';
  };

  const getOverallHealth = () => {
    const avg = bodyMetrics.reduce((sum, m) => sum + getMetricValue(m), 0) / bodyMetrics.length;
    return Math.round(avg);
  };

  return (
    <div className="digital-twin-container">
      <div className="twin-time-selector-compact">
        <div className="time-selector-compact-header">
          <span className="time-selector-label">
            <i className="bi bi-calendar3"></i>
            Snapshot wählen:
          </span>
        </div>
        <div className="time-snapshots-compact">
          {timePoints.map((tp, index) => {
            const isUnlocked = index <= currentIndex || tp.id === 'current';
            const isActive = selectedTimePoint === tp.id;
            
            return (
              <button
                key={tp.id}
                className={`time-snapshot-compact ${isActive ? 'active' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => {
                  if (isUnlocked) {
                    setSelectedTimePoint(tp.id);
                  }
                }}
                disabled={!isUnlocked}
                title={isUnlocked ? `Zeige Daten von ${tp.label} (${tp.date})` : 'Noch nicht verfügbar'}
              >
                {isUnlocked ? (
                  <i className="bi bi-camera-fill"></i>
                ) : (
                  <i className="bi bi-lock-fill"></i>
                )}
                <span className="snapshot-compact-label">{tp.label}</span>
                {isActive && <div className="snapshot-compact-indicator"></div>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="twin-body-section">
        <div className="avatar-container">
          <div className="avatar-body">
            <DigitalTwin3D
              metrics={bodyMetrics.map((metric) => {
                const value = getMetricValue(metric);
                const color = getMetricColor(metric, value);
                // Convert 2D positions to 3D positions around the model
                const x = (metric.position.x / 100 - 0.5) * 2;
                const y = (0.5 - metric.position.y / 100) * 1.5;
                const z = 0;
                
                return {
                  id: metric.id,
                  name: metric.name,
                  position: [x, y, z] as [number, number, number],
                  value: value,
                  color: color,
                  icon: metric.icon,
                };
              })}
              onMetricHover={setHoveredMetric}
              hoveredMetric={hoveredMetric}
            />
          </div>
        </div>

        <div className="metrics-panel">
          <div className="metrics-panel-header">
            <h3>Körpermetriken</h3>
            <span className="metrics-time">{currentTimePoint.label} • {currentTimePoint.date}</span>
          </div>
          <div className="metrics-list">
            {bodyMetrics.map((metric) => {
              const value = getMetricValue(metric);
              const color = getMetricColor(metric, value);
              const change = selectedTimePoint === 'start' 
                ? 0 
                : selectedTimePoint === 'current'
                ? value - metric.past
                : value - metric.current;
              
              return (
                <div 
                  key={metric.id}
                  className="metric-card"
                  onMouseEnter={() => setHoveredMetric(metric.id)}
                  onMouseLeave={() => setHoveredMetric(null)}
                >
                  <div className="metric-card-icon" style={{ background: `${color}20`, color }}>
                    <i className={`bi ${metric.icon}`}></i>
                  </div>
                  <div className="metric-card-content">
                    <div className="metric-card-header">
                      <h4>{metric.name}</h4>
                      {change !== 0 && (
                        <span className={`metric-change ${change > 0 ? 'positive' : 'negative'}`}>
                          <i className={`bi ${change > 0 ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
                          {change > 0 ? '+' : ''}{Math.round(change)}{metric.unit}
                        </span>
                      )}
                    </div>
                    <div className="metric-card-value">
                      <span className="value-main">{Math.round(value)}</span>
                      <span className="value-unit">{metric.unit}</span>
                    </div>
                    <div className="metric-card-progress">
                      <div className="progress-bar-small">
                        <div 
                          className="progress-fill-small" 
                          style={{ width: `${value}%`, background: color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="twin-insights">
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #7FD049, #ACE189)' }}>
            <i className="bi bi-graph-up-arrow"></i>
          </div>
          <div className="insight-content">
            <h3>Dein Fortschritt</h3>
            <p>
              Seit dem Start hast du deine Gesamtgesundheit um <strong>{getOverallHealth() - bodyMetrics[0].past}%</strong> verbessert.
              {selectedTimePoint !== 'current' && selectedTimePoint !== 'start' && (
                <> In {currentTimePoint.label} wird sie bei <strong>{Math.round(getOverallHealth() + (bodyMetrics[0].future - bodyMetrics[0].current) * 0.5)}%</strong> liegen.</>
              )}
            </p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'linear-gradient(135deg, #006EA7, #4C99C2)' }}>
            <i className="bi bi-lightbulb"></i>
          </div>
          <div className="insight-content">
            <h3>Nächste Schritte</h3>
            <p>
              {bodyMetrics
                .filter(m => getMetricValue(m) < 85)
                .sort((a, b) => getMetricValue(a) - getMetricValue(b))
                .slice(0, 2)
                .map(m => m.name)
                .join(' und ')} 
              {' '}haben noch Potenzial. Fokussiere dich auf diese Bereiche für maximale Wirkung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
