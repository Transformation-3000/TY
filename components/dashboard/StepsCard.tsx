'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Image from 'next/image';

const stepsData = {
  day: {
    labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    data: [1200, 2500, 1800, 3200, 2100, 2800, 1500],
  },
  week: {
    labels: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'],
    data: [10500, 12400, 11800, 13200, 12500, 14500, 11200],
  },
  year: {
    labels: ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN'],
    data: [380000, 395000, 410000, 425000, 440000, 455000],
  },
};

export default function StepsCard() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'year'>('day');

  const data = stepsData[timeRange];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Schritte',
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
        <h3>Tagesschritte</h3>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
        <div style={{ color: '#4498ca', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/images/schritte.png" alt="Schritte" width={24} height={24} />
          <span>12,547</span>
        </div>
        <div style={{ color: '#4498ca', fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/images/distanz.png" alt="Distanz" width={24} height={24} />
          <span>10,3KM</span>
        </div>
      </div>
      <div className="chart-container" style={{ background: 'rgba(68, 152, 202, 0.1)', borderRadius: '12px', padding: '1rem' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}

