'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const sleepData = {
  week: {
    labels: ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'],
    data: [87, 97, 85, 91, 95, 95, 88],
  },
  '6M': {
    labels: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
    data: [89, 92, 88, 91, 93, 90],
  },
  '12M': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [90, 92, 89, 91],
  },
};

export default function SleepCard() {
  const [timeRange, setTimeRange] = useState<'week' | '6M' | '12M'>('week');

  const data = sleepData[timeRange];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Schlafleistung',
        data: data.data,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return 'rgba(68, 152, 202, 1)';
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(68, 152, 202, 1)');
          gradient.addColorStop(0.6, 'rgba(68, 152, 202, 1)');
          gradient.addColorStop(1, 'rgba(68, 152, 202, 0)');
          return gradient;
        },
        borderRadius: 0,
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
      datalabels: {
        anchor: 'end' as const,
        align: 'top' as const,
        formatter: function(value: number) {
          return value + '%';
        },
        color: '#2e6ca3',
        font: {
          weight: 600,
          size: 11,
        },
        padding: {
          top: 5,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
          drawBorder: false,
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          callback: function(value: any) {
            if (value % 20 === 0) return value + '%';
            return '';
          },
          color: '#999',
          padding: 10,
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#999',
          padding: 5,
          font: {
            size: 10,
          },
        },
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  return (
    <div className="dashboard-card">
      <div className="metric-header">
        <h3>Schlafleistung</h3>
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
      <div className="sleep-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="sleep-layout" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="sleep-metric">
            <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div className="metric-label">Geschlafen</div>
              <div className="metric-value" style={{ color: '#64B5F6' }}>7.2h</div>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '90%', backgroundColor: '#64B5F6' }}></div>
            </div>
          </div>
          <div className="sleep-circle" style={{ position: 'relative', width: '120px', height: '120px' }}>
            <div className="sleep-score" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem', fontWeight: 600, color: '#2e6ca3' }}>
              89%
            </div>
          </div>
          <div className="sleep-metric">
            <div className="metric-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div className="metric-label">Benötigt</div>
              <div className="metric-value" style={{ color: '#64B5F6' }}>8h</div>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '100%', backgroundColor: '#64B5F6' }}></div>
            </div>
          </div>
        </div>
        <div className="chart-container">
          <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
      </div>
    </div>
  );
}

