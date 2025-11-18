'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const recoveryData = {
  week: {
    labels: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'],
    data: [88, 92, 85, 90, 95, 93, 89],
  },
  '6M': {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
    data: [89, 91, 88, 92, 94, 90],
  },
  '12M': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [90, 92, 89, 91],
  },
};

export default function RecoveryCard() {
  const [timeRange, setTimeRange] = useState<'week' | '6M' | '12M'>('week');

  const data = recoveryData[timeRange];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Recovery Score',
        data: data.data,
        borderColor: '#4498ca',
        backgroundColor: 'rgba(68, 152, 202, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#4498ca',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
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
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
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
        <h3>Recovery Score</h3>
        <div className="time-selector">
          <button
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Woche
          </button>
          <button
            className={`time-btn ${timeRange === '6M' ? 'active' : ''}`}
            onClick={() => setTimeRange('6M')}
          >
            6M
          </button>
          <button
            className={`time-btn ${timeRange === '12M' ? 'active' : ''}`}
            onClick={() => setTimeRange('12M')}
          >
            12M
          </button>
        </div>
      </div>
      <div className="chart-container" style={{ position: 'relative' }}>
        <Line data={chartData} options={options} />
        <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#2e6ca3' }}>92%</div>
          <button style={{ background: 'none', border: 'none', color: '#4498ca', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            +3% zur Vorwoche
          </button>
        </div>
      </div>
    </div>
  );
}

