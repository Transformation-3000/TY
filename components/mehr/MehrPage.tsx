'use client';

import React from 'react';

const MEHR_ITEMS: { id: string; label: string; icon: string; color: string; desc: string }[] = [];

export default function MehrPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  return (
    <div className="mehr-page">
      <div className="mehr-header">
        <h1>Mehr entdecken</h1>
        <p>Weitere Funktionen und Services für deine Longevity-Journey.</p>
      </div>

      <div className="mehr-grid">
        {MEHR_ITEMS.length > 0 ? (
          MEHR_ITEMS.map((item) => (
            <div key={item.id} className="mehr-card" onClick={() => onNavigate?.(item.id)}>
              <div className="mehr-card-icon" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                <i className={`bi ${item.icon}`}></i>
              </div>
              <div className="mehr-card-content">
                <h3>{item.label}</h3>
                <p>{item.desc}</p>
              </div>
              <button className="mehr-card-btn">
                Öffnen <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="mehr-empty-state" style={{ gridColumn: '1 / -1', padding: '3rem', background: '#f8fafc', borderRadius: '20px', border: '1px dashed #cbd5e1', color: '#64748b', textAlign: 'center' }}>
            <i className="bi bi-info-circle" style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem', color: '#94a3b8' }}></i>
            <p style={{ margin: 0, fontWeight: 500 }}>Aktuell sind keine weiteren Services in diesem Bereich verfügbar.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .mehr-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mehr-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .mehr-header h1 {
          font-size: 2.5rem;
          color: var(--color-30-blue-main);
          margin-bottom: 1rem;
        }

        .mehr-header p {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        .mehr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mehr-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }

        .mehr-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .mehr-card-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .mehr-card-content h3 {
          font-size: 1.4rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }

        .mehr-card-content p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .mehr-card-btn {
          margin-top: auto;
          background: transparent;
          border: 2px solid var(--color-30-blue-main);
          color: var(--color-30-blue-main);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mehr-card-btn:hover {
          background: var(--color-30-blue-main);
          color: white;
        }
      `}</style>
    </div>
  );
}
