'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ZellalterCheckPage() {
  return (
    <div className="check-container">
      <div className="check-header">
        <h1 className="check-title">Analyse Zellstatus</h1>
        <p className="check-subtitle">Erfahre, wie jung deine Zellen wirklich sind.</p>
      </div>

      <div className="check-main-grid">
        <div className="check-card info-card">
          <div className="info-content">
            <h2 className="info-title">Der epigenetische Test</h2>
            <p className="info-text">
              Mithilfe modernster Sequenzierung analysieren wir die Methylierungsmuster deiner DNA. 
              Dies gibt uns Aufschluss über dein biologisches Alter im Vergleich zu deinem chronologischen Alter.
            </p>
            <div className="info-stats">
              <div className="info-stat">
                <span className="stat-value">98%</span>
                <span className="stat-label">Genauigkeit</span>
              </div>
              <div className="info-stat">
                <span className="stat-value">21 Tage</span>
                <span className="stat-label">Dauer</span>
              </div>
            </div>
            <button className="order-btn">Test-Kit bestellen</button>
          </div>
          <div className="info-visual">
            <Image src="/images/longevity_sphere_final.png" width={300} height={300} alt="DNA" />
          </div>
        </div>

        <div className="check-card result-preview">
          <h3 className="preview-title">Vorschau Ergebnisbericht</h3>
          <div className="preview-mockup">
            <div className="mock-age-circle">
              <span className="mock-age-val">42</span>
              <span className="mock-age-lab">Jahre</span>
            </div>
            <p className="mock-text">Dein biologisches Alter liegt 6 Jahre unter deinem chronologischen Alter.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .check-container { padding: 2rem; max-width: 1100px; margin: 0 auto; }
        .check-header { margin-bottom: 3rem; }
        .check-title { font-size: 2.4rem; font-weight: 800; color: #1e293b; }
        .check-subtitle { font-size: 1.2rem; color: #64748b; }

        .check-main-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
        .check-card {
          background: #fff; border-radius: 32px; padding: 2.5rem;
          border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.04);
        }

        .info-card { display: flex; gap: 2rem; align-items: center; }
        .info-content { flex: 1; }
        .info-title { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin-bottom: 1rem; }
        .info-text { font-size: 1rem; color: #64748b; line-height: 1.6; margin-bottom: 2rem; }
        
        .info-stats { display: flex; gap: 2rem; margin-bottom: 2rem; }
        .stat-value { display: block; font-size: 1.5rem; font-weight: 800; color: #4498ca; }
        .stat-label { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }

        .order-btn {
          background: #1e293b; color: #fff; border: none; padding: 1rem 2rem;
          border-radius: 100px; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .order-btn:hover { background: #334155; transform: translateY(-2px); }

        .result-preview { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); }
        .preview-title { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 2rem; }
        
        .mock-age-circle {
          width: 140px; height: 140px; border-radius: 50%;
          border: 8px solid #4498ca; display: flex; flex-direction: column;
          align-items: center; justify-content: center; margin: 0 auto 1.5rem;
          background: #fff;
        }
        .mock-age-val { font-size: 2.5rem; font-weight: 800; color: #1e293b; }
        .mock-age-lab { font-size: 0.9rem; color: #64748b; font-weight: 600; }
        .mock-text { font-size: 0.95rem; color: #475569; font-weight: 500; }
      `}</style>
    </div>
  );
}
