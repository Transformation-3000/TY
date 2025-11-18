'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';

const fitnessData = {
  day: {
    labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    data: [0, 15, 5, 25, 0, 45, 0],
    minutes: "45'",
    intensity: '85%',
    calories: '320',
    yMax: 50,
  },
  week: {
    labels: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'],
    data: [10, 60, 38, 37, 58, 45, 30],
    minutes: "45'",
    intensity: '85%',
    calories: '320',
    yMax: 70,
  },
  year: {
    labels: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'],
    data: [35, 42, 38, 52, 48, 55, 60, 58, 40, 45, 50, 55],
    minutes: "48'",
    intensity: '78%',
    calories: '3850',
    yMax: 80,
  },
};

export default function FitnessCard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'year'>('day');

  const data = fitnessData[timeRange];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Minuten',
        data: data.data,
        backgroundColor: 'rgba(68, 152, 202, 0.8)',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: data.yMax,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="dashboard-card">
      <div className="metric-header">
        <h3>FITNESS</h3>
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
            className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Jahr
          </button>
        </div>
      </div>

      <div
        className="fitness-metrics-layout"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
        }}
      >
        <div className="metric-item" style={{ textAlign: 'center' }}>
          <div className="metric-label" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Minuten
          </div>
          <div className="metric-big-value" style={{ fontSize: '2rem', fontWeight: 600, color: '#4498ca' }}>
            {data.minutes}
          </div>
        </div>
        <div className="metric-item" style={{ textAlign: 'center' }}>
          <div className="metric-label" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Trainingsintensität
          </div>
          <div className="metric-big-value" style={{ fontSize: '2rem', fontWeight: 600, color: '#4498ca' }}>
            {data.intensity}
          </div>
        </div>
        <div className="metric-item" style={{ textAlign: 'center' }}>
          <div className="metric-label" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
            Kalorien
          </div>
          <div className="metric-big-value" style={{ fontSize: '2rem', fontWeight: 600, color: '#4498ca' }}>
            {data.calories}
          </div>
        </div>
      </div>

      <div className="fitness-chart-container" style={{ position: 'relative', minHeight: '200px' }}>
        <h4 className="chart-title" style={{ fontSize: '1rem', fontWeight: 600, color: '#2e6ca3', marginBottom: '0.5rem' }}>
          Minuten
        </h4>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

