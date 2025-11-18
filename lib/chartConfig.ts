'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Registriere Chart.js Komponenten
if (typeof window !== 'undefined') {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartDataLabels
  );

  // Globale Chart-Konfiguration
  ChartJS.defaults.responsive = true;
  ChartJS.defaults.maintainAspectRatio = true;
  ChartJS.defaults.aspectRatio = 1.5;
}

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
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
};

