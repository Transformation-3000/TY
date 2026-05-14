'use client';

import { useState, useMemo } from 'react';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';

type SubTab = 'trends' | 'goals' | 'activities' | 'reports' | 'journey';
type TrendPeriod = '3m' | '6m' | '12m';

export default function EntwicklungPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('trends');
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('12m');
  const [showBioAgeDetails, setShowBioAgeDetails] = useState(false);

  // --- DATA SETS ---

  const trendData = [
    { title: 'Schlaf & Erholung', data: [65, 66, 67, 68, 68, 69, 69, 70, 71, 72, 72, 72] },
    { title: 'Kraft & Ausdauer', data: [60, 62, 65, 68, 70, 72, 74, 76, 78, 80, 82, 85] },
    { title: 'Zellversorgung', data: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82] },
    { title: 'Immunbalance', data: [80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60, 58] },
    { title: 'Selbstfürsorge', data: [75, 74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64] },
    { title: 'Mentale Resilienz', data: [60, 61, 62, 63, 64, 66, 68, 70, 72, 75, 78, 81] },
  ];

  const activities = [
    { type: 'Krafttraining', date: 'Heute, 17:30', dur: '45 Min', cal: '340 kcal', icon: 'bi-lightning-charge', score: '+12' },
    { type: 'Dead Hang', date: 'Heute, 16:15', dur: '2:30 Min', cal: '25 kcal', icon: 'bi-hand-index-thumb', score: '+4' },
    { type: 'Griffkraft-Test', date: 'Gestern, 18:00', dur: '5 Min', cal: '10 kcal', icon: 'bi-activity', score: '+8' },
    { type: 'Joggen', date: 'Gestern, 08:15', dur: '32 Min', cal: '410 kcal', icon: 'bi-bicycle', score: '+22' },
    { type: 'Atemübung', date: '08. Mai, 22:00', dur: '10 Min', cal: '5 kcal', icon: 'bi-wind', score: '+5' },
    { type: 'Spaziergang', date: '08. Mai, 12:30', dur: '45 Min', cal: '180 kcal', icon: 'bi-person-walking', score: '+9' },
  ];

  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  return (
    <div className="entw-page">
      {/* Header */}
      <div className="entw-header">
        <h1 className="entw-title">Entwicklung</h1>
      </div>

      {/* Main Tabs */}
      <div className="entw-tabs">
        {[
          { id: 'trends', label: 'Trends' },
          { id: 'goals', label: 'Wochenziele' },
          { id: 'activities', label: 'Aktivitäten' },
          { id: 'reports', label: 'Reports' },
          { id: 'journey', label: 'Journey' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubTab)}
            className={`entw-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TRENDS TAB ── */}
      {activeTab === 'trends' && (
        <div className="trends-view">
          {/* BioAge Module */}
          <div className="bioage-hero" onClick={() => setShowBioAgeDetails(true)} style={{ cursor: 'pointer' }}>
            <div className="bah-content">
              <div className="bah-label">Biologisches Alter</div>
              <div className="bah-value">34.2 <span className="bah-unit">Jahre</span></div>
              <div className="bah-status">
                <span className="status-pill positive">-2.8 Jahre vs. Chronologisch</span>
              </div>
              <div className="bah-hint">Klicken für Details</div>
            </div>
            <div className="bah-visual">
              <div className="bah-circle">
                <div className="bah-circle-inner">34</div>
                <svg className="bah-ring" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#4498ca" strokeWidth="8" strokeDasharray="283" strokeDashoffset="70" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="period-selector">
            {(['3m', '6m', '12m'] as TrendPeriod[]).map(p => (
              <button 
                key={p} 
                className={`period-btn ${trendPeriod === p ? 'active' : ''}`}
                onClick={() => setTrendPeriod(p)}
              >
                {p === '3m' ? '3 Monate' : p === '6m' ? '6 Monate' : '12 Monate'}
              </button>
            ))}
          </div>

          {/* 6 Optimization Fields */}
          <div className="tac-grid">
            {trendData.map((t, i) => {
              const baseline = t.data[0];
              const periodLen = trendPeriod === '3m' ? 3 : trendPeriod === '6m' ? 6 : 12;
              const displayData = t.data.slice(0, periodLen);
              const labels = monthNames.slice(0, periodLen);
              
              const currentVal = displayData[displayData.length - 1];
              const avgScore = Math.round(displayData.reduce((a, b) => a + b, 0) / displayData.length);
              const changePct = Math.round(((currentVal - baseline) / baseline) * 100);
              
              const isPositive = changePct > 1;
              const isNegative = changePct < -1;
              const color = isPositive ? '#22c55e' : isNegative ? '#ef4444' : '#4498ca';
              const trendIcon = isPositive ? '↑' : isNegative ? '↓' : '→';

              const max = Math.max(...displayData, 100);
              const min = Math.min(...displayData, 0);
              const range = max - min || 1;
              const points = displayData.map((v, idx) => {
                const x = (idx / (displayData.length - 1)) * 100;
                const y = 80 - ((v - min) / range) * 60;
                return `${x},${y}`;
              }).join(' ');

              return (
                <div key={i} className={`tac-item ${isPositive ? 'pos' : isNegative ? 'neg' : 'neu'}`}>
                  <div className="taci-header">
                    <span className="taci-label">{t.title}</span>
                    <span className="taci-trend" style={{ color }}>{trendIcon} {Math.abs(changePct)}%</span>
                  </div>
                  <div className="taci-score-row">
                    <span className="taci-score">{avgScore}</span>
                    <span className="taci-unit">Pkt</span>
                  </div>
                  <div className="taci-sparkline">
                    <svg viewBox="0 0 100 80" preserveAspectRatio="none">
                      <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="taci-labels">
                    {labels.map((l, idx) => (
                      <span key={idx} className={(idx === 0 || idx === labels.length - 1) ? 'visible' : ''}>{l}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── WOCHENZIELE ── */}
      {activeTab === 'goals' && (
        <div className="goals-view">
          <div className="goal-hero-card">
            <h3>Wochenfortschritt</h3>
            <div className="goal-summary">
              <div className="gs-item">
                <span className="gs-val">28</span>
                <span className="gs-lab">Sterne</span>
              </div>
              <div className="gs-item">
                <span className="gs-val">75%</span>
                <span className="gs-lab">Ziel erreicht</span>
              </div>
            </div>
          </div>
          <div className="goal-list">
            {[
              { label: 'Tagesziel Sterne', val: 5, total: 7, color: '#4498ca' },
              { label: 'Workout Sessions', val: 3, total: 4, color: '#22c55e' },
              { label: '8 Std. Schlaf', val: 4, total: 7, color: '#8b5cf6' },
            ].map((g, i) => (
              <div key={i} className="goal-card">
                <div className="gc-info">
                  <span>{g.label}</span>
                  <strong>{g.val}/{g.total}</strong>
                </div>
                <div className="gc-track"><div className="gc-fill" style={{ width: `${(g.val/g.total)*100}%`, background: g.color }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AKTIVITÄTEN ── */}
      {activeTab === 'activities' && (
        <div className="activities-view">
          <div className="act-list">
            {activities.map((a, i) => (
              <div key={i} className="act-item">
                <div className="act-icon"><i className={`bi ${a.icon}`} /></div>
                <div className="act-main">
                  <div className="act-type">{a.type}</div>
                  <div className="act-date">{a.date}</div>
                </div>
                <div className="act-right">
                  <div className="act-dur">{a.dur}</div>
                  <div className="act-score">{a.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {activeTab === 'reports' && (
        <div className="reports-view">
          {[
            { month: 'Februar 2025', score: 84 },
            { month: 'Januar 2025', score: 76 },
            { month: 'Dezember 2024', score: 71 },
          ].map((r, i) => (
            <div key={i} className="rep-card">
              <div className="rep-info">
                <div className="rep-month">{r.month}</div>
                <div className="rep-score">Gesamt-Score: {r.score}</div>
              </div>
              <button className="rep-btn">PDF herunterladen</button>
            </div>
          ))}
        </div>
      )}

      {/* ── JOURNEY ── */}
      {activeTab === 'journey' && (
        <LongevityJourney7LevelsPage />
      )}

      {/* ── BIO AGE DETAILS MODAL ── */}
      {showBioAgeDetails && (
        <div className="modal-overlay" onClick={() => setShowBioAgeDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBioAgeDetails(false)}>&times;</button>
            
            <div className="modal-header">
              <h2>Biologisches Alter Analyse</h2>
              <p>Basierend auf deinen aktuellsten Biomarkern und Messwerten</p>
            </div>

            <div className="modal-body">
              <div className="bio-summary-grid">
                <div className="bsg-item">
                  <span className="bsg-label">Chronologisch</span>
                  <span className="bsg-value">37.0</span>
                </div>
                <div className="bsg-item highlight">
                  <span className="bsg-label">Biologisch</span>
                  <span className="bsg-value">34.2</span>
                </div>
                <div className="bsg-item">
                  <span className="bsg-label">Differenz</span>
                  <span className="bsg-value text-green">-2.8</span>
                </div>
              </div>

              <h3 className="section-title">Einflussfaktoren</h3>
              <div className="factors-list">
                {[
                  { label: 'Herz-Kreislauf (V02 Max)', age: 31.5, status: 'Exzellent' },
                  { label: 'Zelluläre Gesundheit (HBA1C)', age: 35.8, status: 'Gut' },
                  { label: 'Inflammations-Marker (hs-CRP)', age: 33.1, status: 'Exzellent' },
                  { label: 'Muskelmasse & Kraft', age: 32.4, status: 'Sehr Gut' },
                  { label: 'Kognitive Leistung', age: 36.2, status: 'Normal' },
                ].map((f, i) => (
                  <div key={i} className="factor-row">
                    <div className="fr-label">
                      <strong>{f.label}</strong>
                      <span>Status: {f.status}</span>
                    </div>
                    <div className="fr-value">{f.age} J.</div>
                  </div>
                ))}
              </div>

              <div className="modal-info-box">
                <i className="bi bi-info-circle"></i>
                <p>Dein biologisches Alter spiegelt die Funktionsfähigkeit deiner Zellen und Organe wider. Durch gezielte Interventionen in den Bereichen Krafttraining und Zellversorgung konnte dein Wert im letzten Quartal um 0.4 Jahre gesenkt werden.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .entw-page { padding: 2rem 2.5rem; max-width: 1200px; margin: 0 auto; color: #1e293b; }
        .entw-header { margin-bottom: 2rem; }
        .entw-title { font-size: 2.4rem; font-weight: 850; letter-spacing: -0.04em; color: #0f172a; margin: 0; }

        /* TABS */
        .entw-tabs { display: flex; gap: 0.75rem; margin-bottom: 2.5rem; }
        .entw-tab { 
          padding: 0.8rem 1.6rem; border-radius: 14px; border: 1.5px solid rgba(68,152,202,0.1);
          background: #f8fafc; color: #64748b; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        .entw-tab:hover { background: #fff; border-color: #4498ca; color: #4498ca; }
        .entw-tab.active { background: #4498ca; color: white; border-color: #4498ca; box-shadow: 0 4px 15px rgba(68,152,202,0.3); }

        /* BIOAGE HERO */
        .bioage-hero { 
          display: flex; justify-content: space-between; align-items: center;
          background: #0f172a; padding: 2.5rem; border-radius: 28px; color: white; margin-bottom: 2.5rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15); transition: transform 0.2s;
        }
        .bioage-hero:hover { transform: scale(1.01); }
        .bah-label { font-size: 1rem; opacity: 0.7; font-weight: 600; margin-bottom: 0.4rem; }
        .bah-value { font-size: 4.2rem; font-weight: 900; letter-spacing: -0.05em; color: #4498ca; line-height: 1; }
        .bah-unit { font-size: 1.2rem; opacity: 0.8; font-weight: 600; }
        .bah-status { margin-top: 1.2rem; }
        .status-pill { padding: 0.5rem 1.2rem; border-radius: 100px; font-size: 0.9rem; font-weight: 700; }
        .status-pill.positive { background: rgba(34,197,94,0.2); color: #4ade80; }
        .bah-hint { margin-top: 1.5rem; font-size: 0.8rem; opacity: 0.4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        
        .bah-visual { position: relative; width: 150px; height: 150px; }
        .bah-circle { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
        .bah-circle-inner { font-size: 2.8rem; font-weight: 900; color: white; z-index: 2; }
        .bah-ring { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg); }

        /* PERIOD SELECTOR */
        .period-selector { display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.35rem; border-radius: 12px; width: fit-content; margin-bottom: 1.8rem; }
        .period-btn { padding: 0.45rem 1.2rem; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .period-btn.active { background: white; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

        /* TAC GRID */
        .tac-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .tac-item { 
          background: white; border-radius: 24px; padding: 1.8rem; border: 1.5px solid #f1f5f9;
          transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .tac-item:hover { border-color: #4498ca; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .taci-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
        .taci-label { font-size: 1rem; font-weight: 700; color: #64748b; }
        .taci-trend { font-size: 0.9rem; font-weight: 800; }
        .taci-score-row { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 1.2rem; }
        .taci-score { font-size: 2.4rem; font-weight: 900; color: #0f172a; }
        .taci-unit { font-size: 0.9rem; font-weight: 700; color: #94a3b8; }
        .taci-sparkline { height: 70px; margin-bottom: 1rem; }
        .taci-labels { display: flex; justify-content: space-between; }
        .taci-labels span { font-size: 0.7rem; font-weight: 700; color: #cbd5e1; opacity: 0; }
        .taci-labels span.visible { opacity: 1; }

        /* MODAL */
        .modal-overlay { 
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.8);
          backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem;
        }
        .modal-content { 
          background: white; border-radius: 32px; width: 100%; max-width: 600px; max-height: 90vh;
          overflow-y: auto; position: relative; padding: 3rem; box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }
        .modal-close { position: absolute; top: 1.5rem; right: 1.5rem; border: none; background: #f1f5f9; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .modal-header h2 { font-size: 1.8rem; font-weight: 850; letter-spacing: -0.03em; margin-bottom: 0.5rem; }
        .modal-header p { color: #64748b; margin-bottom: 2rem; font-weight: 500; }

        .bio-summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2.5rem; }
        .bsg-item { background: #f8fafc; padding: 1.5rem; border-radius: 20px; text-align: center; }
        .bsg-item.highlight { background: #0f172a; color: white; }
        .bsg-label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; opacity: 0.7; }
        .bsg-value { font-size: 1.8rem; font-weight: 900; }
        .text-green { color: #22c55e; }

        .section-title { font-size: 1.1rem; font-weight: 800; margin-bottom: 1.2rem; }
        .factor-row { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 0; border-bottom: 1px solid #f1f5f9; }
        .fr-label strong { display: block; font-size: 1rem; color: #1e293b; }
        .fr-label span { font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
        .fr-value { font-size: 1.1rem; font-weight: 800; color: #4498ca; }

        .modal-info-box { background: #f0f7ff; padding: 1.5rem; border-radius: 20px; margin-top: 2rem; display: flex; gap: 1rem; }
        .modal-info-box i { font-size: 1.4rem; color: #4498ca; }
        .modal-info-box p { font-size: 0.9rem; color: #1e293b; line-height: 1.6; font-weight: 500; margin: 0; }

        /* GOALS / ACTIVITIES / JOURNEY (Shorter styles for brevity) */
        .goal-hero-card { background: #f8fafc; border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem; border: 1px solid #e2e8f0; }
        .goal-summary { display: flex; gap: 3rem; margin-top: 1rem; }
        .gs-val { display: block; font-size: 2rem; font-weight: 800; color: #4498ca; }
        .gs-lab { font-size: 0.8rem; font-weight: 600; color: #64748b; }
        .goal-card { background: white; border-radius: 16px; padding: 1.2rem; border: 1.5px solid #f1f5f9; margin-bottom: 1rem; }
        .gc-info { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.95rem; }
        .gc-track { height: 10px; background: #f1f5f9; border-radius: 100px; overflow: hidden; }
        .gc-fill { height: 100%; border-radius: 100px; transition: width 1s ease-out; }

        .act-item { display: flex; align-items: center; gap: 1.2rem; background: white; border-radius: 20px; padding: 1.25rem; border: 1.5px solid #f1f5f9; margin-bottom: 1rem; }
        .act-icon { width: 48px; height: 48px; border-radius: 14px; background: #f0f7ff; color: #4498ca; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .act-main { flex: 1; }
        .act-type { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .act-date { font-size: 0.8rem; color: #94a3b8; }
        .act-right { text-align: right; }
        .act-dur { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .act-score { font-size: 0.85rem; font-weight: 800; color: #22c55e; }

        .rep-card { display: flex; justify-content: space-between; align-items: center; background: white; border-radius: 20px; padding: 1.5rem; border: 1.5px solid #f1f5f9; margin-bottom: 1rem; }
        .rep-month { font-size: 1.1rem; font-weight: 750; color: #0f172a; margin-bottom: 0.3rem; }
        .rep-score { font-size: 0.85rem; font-weight: 600; color: #64748b; }
        .rep-btn { padding: 0.6rem 1.2rem; border-radius: 10px; border: 1.5px solid #4498ca; background: transparent; color: #4498ca; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .rep-btn:hover { background: #4498ca; color: white; }

        .journey-hero { background: linear-gradient(135deg, #4498ca 0%, #2563eb 100%); border-radius: 24px; padding: 2rem; color: white; display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; }
        .jh-badge { width: 80px; height: 80px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; border: 2px solid rgba(255,255,255,0.3); }
        .jh-info h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .jh-info p { opacity: 0.9; margin: 0.3rem 0 0 0; }
        .journey-map { display: flex; justify-content: space-between; padding: 0 1rem; position: relative; }
        .journey-map::after { content: ''; position: absolute; top: 22px; left: 0; right: 0; height: 4px; background: #f1f5f9; z-index: 0; }
        .map-node { position: relative; z-index: 1; text-align: center; }
        .node-num { width: 44px; height: 44px; border-radius: 50%; background: white; border: 3px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #cbd5e1; margin-bottom: 0.8rem; transition: all 0.3s; }
        .map-node.active .node-num { background: #4498ca; border-color: #4498ca; color: white; box-shadow: 0 0 20px rgba(68,152,202,0.4); }
        .node-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; }
        .map-node.active .node-label { color: #1e293b; }

        @media (max-width: 1000px) { .tac-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) { .tac-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
