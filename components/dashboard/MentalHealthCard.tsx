'use client';

import { useState } from 'react';

const mentalMetrics = [
  { name: 'Stress', value: 45, color: '#FF6B6B', icon: 'bi-gear-wide-connected' },
  { name: 'Fokus', value: 87, color: '#4ECDC4', icon: 'bi-eye' },
  { name: 'Energie', value: 72, color: '#FFD166', icon: 'bi-lightning-charge' },
  { name: 'Resilienz', value: 90, color: '#6A7FDB', icon: 'bi-heart-pulse' },
];

const recommendations = [
  { title: 'Atemübung', time: '5 Min', icon: 'bi-wind' },
  { title: 'Tagebuch', time: '10 Min', icon: 'bi-journal-text' },
  { title: 'Meditation', time: '15 Min', icon: 'bi-sunrise' },
];

export default function MentalHealthCard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  const [selectedRecommendation, setSelectedRecommendation] = useState(0);

  return (
    <div className="dashboard-card mental-health-card">
      <div className="metric-header">
        <h3>Mentale Gesundheit</h3>
        <div className="time-selector">
          <button
            className={`time-btn ${timeRange === 'day' ? 'active' : ''}`}
            onClick={() => setTimeRange('day')}
          >
            Tag
          </button>
          <button
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Woche
          </button>
          <button
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Monat
          </button>
        </div>
      </div>
      <div className="mental-health-container">
        {/* Metriken-Grid */}
        <div
          className="mental-metrics-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.6rem',
            marginBottom: '1rem',
          }}
        >
          {mentalMetrics.map((metric) => (
            <div
              key={metric.name}
              className="mental-metric-card"
              style={{
                background: '#f8fbff',
                borderRadius: '12px',
                padding: '0.8rem',
                display: 'flex',
                gap: '0.8rem',
                alignItems: 'center',
              }}
            >
              <div
                className="metric-icon"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${metric.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: metric.color,
                  fontSize: '1.3rem',
                }}
              >
                <i className={`bi ${metric.icon}`}></i>
              </div>
              <div className="metric-content" style={{ flex: 1 }}>
                <div className="metric-name" style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.2rem' }}>
                  {metric.name}
                </div>
                <div className="metric-value" style={{ fontSize: '1.1rem', fontWeight: 600, color: metric.color, marginBottom: '0.2rem' }}>
                  {metric.value}%
                </div>
                <div className="progress" style={{ height: '4px', marginTop: '3px' }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${metric.value}%`,
                      backgroundColor: metric.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empfehlungen */}
      <div
        className="mental-health-recommendations"
        style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="recommendation-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.7rem',
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#2e6ca3', margin: 0 }}>
            Empfehlungen für heute
          </h4>
          <button
            className="refresh-btn"
            style={{
              background: 'none',
              border: 'none',
              color: '#4498ca',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>
        <div
          className="recommendation-cards"
          style={{
            display: 'flex',
            gap: '0.6rem',
            marginBottom: '0.8rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '0.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: '#4498ca rgba(68, 152, 202, 0.1)',
          }}
        >
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`recommendation-card ${selectedRecommendation === index ? 'active' : ''}`}
              onClick={() => setSelectedRecommendation(index)}
              style={{
                minWidth: '180px',
                flexShrink: 0,
                background: selectedRecommendation === index ? '#f3fafd' : '#fff',
                border: selectedRecommendation === index ? '2px solid #4498ca' : '2px solid transparent',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                gap: '0.8rem',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                className="recommendation-icon"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#e3f3f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4498ca',
                  fontSize: '1.5rem',
                }}
              >
                <i className={`bi ${rec.icon}`}></i>
              </div>
              <div className="recommendation-content">
                <div
                  className="recommendation-title"
                  style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2e6ca3', marginBottom: '0.2rem' }}
                >
                  {rec.title}
                </div>
                <div className="recommendation-time" style={{ fontSize: '0.85rem', color: '#666' }}>
                  {rec.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="action-button"
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #4498ca 70%, #64B5F6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.8rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <i className="bi bi-play-circle"></i>
          Jetzt starten
        </button>
      </div>
    </div>
  );
}

