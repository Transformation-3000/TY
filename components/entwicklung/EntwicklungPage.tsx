'use client';

import { useState, useMemo } from 'react';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';

type SubTab = 'trends' | 'goals' | 'activities' | 'reports' | 'journey';
type TrendPeriod = '3m' | '6m' | '12m';

export default function EntwicklungPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('trends');
  const [selectedMetric, setSelectedMetric] = useState<'chronological' | 'difference' | 'dna'>('difference');
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('12m');
  const [showBioAgeDetails, setShowBioAgeDetails] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);



  const trendData = [
    { title: 'Schlaf & Erholung', data: [62, 60, 68, 64, 70, 67, 72, 70, 75, 72, 78, 75] },
    { title: 'Kraft & Ausdauer', data: [55, 58, 60, 63, 67, 70, 72, 75, 78, 80, 83, 84] },
    { title: 'Zellerneuerung & Wachstum', data: [64, 66, 63, 68, 70, 72, 71, 75, 77, 76, 82, 81] },
    { title: 'Immunbalance & Entlastung', data: [82, 78, 80, 74, 76, 70, 72, 65, 68, 60, 64, 62] },
    { title: 'Selbstfürsorge & Soziale Bindungen', data: [72, 71, 73, 72, 72, 74, 73, 71, 72, 73, 72, 73] },
    { title: 'Mentale Resilienz & Mindset', data: [56, 55, 57, 56, 55, 56, 57, 55, 56, 57, 56, 57] },
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

  // --- DYNAMIC METRICS FOR CIRCLE ---
  const circleValue = selectedMetric === 'chronological' ? '46,7' : selectedMetric === 'difference' ? '42,5' : '0,82';
  const circleLabel = selectedMetric === 'dna' ? 'DNA' : 'Jahre';

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
          { id: 'journey', label: 'Reise' }, // Geändert von Journey zu Reise analog zum Screenshot
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
          {/* Aktuelles True Years BioAge Headline */}
          <div className="bioage-headline-row" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Aktuelles True Years BioAge</h2>
            </div>
            <button 
              className="opt-modal-btn" 
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: '#4498ca', color: 'white', border: 'none', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => setShowUploadModal(true)}
            >
              <i className="bi bi-cloud-arrow-up-fill"></i>
              BioAge Nachweise hochladen
            </button>
          </div>

          {/* BioAge Card */}
          <div className="bioage-card-new">
            <div className="bac-left">
              <div className="bac-circle-container">
                <svg className="bac-circle-svg" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="ageScoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4498ca" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="41" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                  {/* Active Arc with Rounded Caps */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="41" 
                    fill="none" 
                    stroke="url(#ageScoreGrad)" 
                    strokeWidth="6.5" 
                    strokeDasharray="257.6" 
                    strokeDashoffset="65" 
                    strokeLinecap="round" 
                    filter="url(#softGlow)"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="bac-circle-text-box">
                  <span className="bac-circle-val">{circleValue}</span>
                  <span className="bac-circle-lab">{circleLabel}</span>
                </div>
              </div>
            </div>
            
            <div className="bac-right">
              <div className="bac-badges-row">
                <span className="badge-pill badge-excellent">
                  <span className="dot-green"></span>Exzellenter Status
                </span>
                <span className="badge-pill badge-top5">
                  Top 5% deiner Altersgruppe
                </span>
              </div>
              
              <h3 className="bac-main-text">
                Du alterst aktuell <strong>15,5% langsamer</strong> als der Durchschnitt.
              </h3>
              
              <div className="bac-stats-grid">
                <div 
                  className={`bac-stat-card ${selectedMetric === 'chronological' ? 'active-metric' : ''}`}
                  onClick={() => setSelectedMetric('chronological')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="bac-stat-label">CHRONOLOGISCH</span>
                  <span className="bac-stat-val" style={{ fontSize: '1.15rem' }}>46,7 Jahre</span>
                </div>
                <div 
                  className={`bac-stat-card ${selectedMetric === 'difference' ? 'active-metric-green' : ''}`}
                  onClick={() => {
                    setSelectedMetric('difference');
                    setShowBioAgeDetails(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="bac-stat-label">DIFFERENZ</span>
                  <span className="bac-stat-val" style={{ fontSize: '1.15rem' }}>-4,2 Jahre jünger</span>
                </div>
                <div 
                  className={`bac-stat-card ${selectedMetric === 'dna' ? 'active-metric' : ''}`}
                  onClick={() => setSelectedMetric('dna')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="bac-stat-label">DNA-ALTERUNG</span>
                  <span className="bac-stat-val" style={{ fontSize: '1.15rem' }}>0.82x</span>
                </div>
              </div>
              
              <div className="bac-footer-info">
                <i className="bi bi-info-circle" style={{ marginRight: '8px', color: '#3b82f6', fontSize: '1.15rem', flexShrink: 0 }}></i>
                <span><strong>Datengrundlage deiner Auswertung:</strong> Fragebogen bei Programmstart, Whoop Age, Epi-Proteomic-Age</span>
              </div>
            </div>
          </div>

          {/* Headline & Period Selector Row */}
          <div className="trends-opt-header">
            <div className="bioage-headline-row" style={{ marginBottom: 0 }}>
              <span className="blue-bar"></span>
              <h2>Trends Optimierungsfelder</h2>
            </div>
            
            <div className="period-selector" style={{ marginBottom: 0 }}>
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
          </div>

          {/* 6 Optimization Fields Grid */}
          <div className="tac-grid">
            {trendData.map((t, i) => {
              const periodLen = trendPeriod === '3m' ? 3 : trendPeriod === '6m' ? 6 : 12;
              const displayData = t.data.slice(-periodLen);
              const baseline = displayData[0];
              
              // Dynamic month generation ending in May (index 4)
              const currentMonthIdx = 4; // Mai (2026)
              const labels = Array.from({ length: periodLen }, (_, idx) => {
                const mIdx = (currentMonthIdx - (periodLen - 1 - idx) + 12) % 12;
                const name = monthNames[mIdx];
                return periodLen === 12 ? name.charAt(0) : name;
              });
              
              const currentVal = displayData[displayData.length - 1];
              const changePct = Math.round(((currentVal - baseline) / baseline) * 100);
              
              const isPositive = changePct >= 0;
              const color = isPositive ? '#22c55e' : '#ef4444';
              const trendIcon = isPositive ? '↗' : '↘';
              const formattedPct = `${trendIcon} ${isPositive ? '+' : ''}${changePct}%`;

              const dataMin = Math.min(...displayData);
              const dataMax = Math.max(...displayData);
              const dataRange = dataMax - dataMin || 1;
              
              // Add a bit of padding to top and bottom so the line doesn't hit the absolute edges
              const min = Math.max(0, dataMin - dataRange * 0.1);
              const max = Math.min(100, dataMax + dataRange * 0.1);
              const range = max - min || 1;
              
              // Sparkline points
              const points = displayData.map((v, idx) => {
                const x = (idx / (displayData.length - 1)) * 100;
                const y = 75 - ((v - min) / range) * 60; // Keep slightly away from borders
                return `${x},${y}`;
              }).join(' ');

              // Area fill polygon points
              const areaPoints = `${points} 100,80 0,80`;

              const gradId = `sparkGrad-${i}`;

              return (
                <div key={i} className={`tac-item ${isPositive ? 'pos' : 'neg'}`}>
                  <div className="taci-header">
                    <span className="taci-label">
                      {t.title.split(' & ').map((part, idx, arr) => (
                        <span key={idx} style={{ display: 'block', lineHeight: '1.25' }}>
                          {part}{idx < arr.length - 1 ? ' &' : ''}
                        </span>
                      ))}
                    </span>
                    <span className="taci-trend" style={{ color }}>{formattedPct}</span>
                  </div>
                  <div className="taci-score-row">
                    <span className="taci-score">{Math.round(currentVal)}</span>
                    <span className="taci-unit">Pkt</span>
                  </div>
                  <div className="taci-sparkline">
                    <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                          <stop offset="100%" stopColor={color} stopOpacity="0.00" />
                        </linearGradient>
                      </defs>
                      {/* Area Fill */}
                      <polygon points={areaPoints} fill={`url(#${gradId})`} />
                      {/* Line */}
                      <polyline points={points} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                  <div className="taci-labels">
                    {labels.map((l, idx) => (
                      <span key={idx} className="visible">{l}</span>
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '740px', borderRadius: '28px', padding: '2.5rem' }}>
            <button className="modal-close" onClick={() => setShowBioAgeDetails(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
            </button>
            
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">BioAge Optimierungsfelder</h2>
              <p className="modal-subtitle-custom">Diese 6 Säulen bestimmen dein aktuelles biologisches Alter</p>
            </div>

            <div className="opt-modal-grid">
              {[
                { title: 'Schlaf & Erholung', val: '-1.5 J.', icon: 'bi-moon-stars', type: 'green' },
                { title: 'Kraft & Ausdauer', val: '-1.2 J.', icon: 'bi-lightning-charge', type: 'green' },
                { title: 'Zellversorgung', val: '-0.9 J.', icon: 'bi-cup-hot', type: 'green' },
                { title: 'Immunbalance', val: '+0.5 J.', icon: 'bi-wind', type: 'red' },
                { title: 'Soziale Bindungen', val: '-0.6 J.', icon: 'bi-people', type: 'green' },
                { title: 'Mindset', val: '-0.5 J.', icon: 'bi-stars', type: 'green' },
              ].map((item, idx) => (
                <div key={idx} className={`opt-pill-card ${item.type === 'green' ? 'green-tint' : 'red-tint'}`}>
                  <div className="opt-pill-left">
                    <div className="opt-pill-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <span className="opt-pill-label">{item.title}</span>
                  </div>
                  <span className={`opt-pill-val ${item.type === 'green' ? 'green-text' : 'red-text'}`}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="opt-modal-btn"
                onClick={() => {
                  setActiveTab('journey');
                  setShowBioAgeDetails(false);
                }}
              >
                Zur Longevity Reise <i className="bi bi-arrow-right" style={{ marginLeft: '4px' }}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '850px', borderRadius: '28px', padding: '1.5rem 2.5rem 2.5rem 2.5rem', overflow: 'hidden', background: '#e0f2fe' }}>
            <button className="modal-close" onClick={() => setShowUploadModal(false)} style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
            </button>
            
            <div className="modal-header-custom" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(68,152,202,0.12)' }}>
                  <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '1.4rem', color: '#4498ca' }}></i>
                </div>
                <h2 className="modal-title-custom" style={{ margin: 0 }}>BioAge Nachweise hochladen</h2>
              </div>
              <p className="modal-subtitle-custom">Wähle einen BioAge-Nachweis aus, den du deinem Profil hinzufügen möchtest, damit dein biologisches Alter präziser und aussagekräftiger eingeschätzt werden kann.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(3, auto)', gridAutoFlow: 'column', gap: '1rem' }}>
              {[
                { title: <>Wearable Age<br/></>, providers: '(WHOOP / Oura / Garmin)', desc: 'Verlaufsindikator über Schlaf, Erholung, HRV & Fitnessdaten.', icon: 'bi-smartwatch', color: '#3b82f6' },
                { title: 'Wellness Age', providers: '(Technogym)', desc: 'Funktionelles Alter über Kraft, Ausdauer, Balance & Körperbau.', icon: 'bi-heart-pulse', color: '#10b981' },
                { title: 'PhenoAge', providers: '(AWARE / Blutwerte)', desc: 'Biologisches Alter auf Basis klassischer Blutmarker.', icon: 'bi-droplet', color: '#ef4444' },
                { title: <>Epigenetic Age /<br/>Epi-Proteomic Age<br/></>, providers: '(MoleQlar / TruDiagnostic / Elysium)', desc: 'Biologisches Alter auf Basis von DNA-Methylierungsmustern.', icon: 'bi-diagram-3', color: '#8b5cf6' },
                { title: 'Pace of Aging', providers: '(MoleQlar / DunedinPACE / TruDiagnostic)', desc: 'Messung der aktuellen biologischen Alterungsgeschwindigkeit.', icon: 'bi-speedometer2', color: '#f59e0b' },
                { title: 'GlycanAge', providers: '', desc: 'Alterungs- und Entzündungsstatus mit Fokus auf Immunsystem.', icon: 'bi-shield-check', color: '#0ea5e9' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.1rem', padding: '1.05rem 1.2rem', border: '1.5px solid transparent', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }} className="upload-option-card">
                  <div style={{ width: '52px', height: '52px', flexShrink: 0, background: `${item.color}15`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: '1.6rem' }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1e3a5f', marginBottom: '0.4rem', fontSize: '1.1rem' }}>
                      {idx + 1}. {item.title} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.9rem', marginLeft: '2px' }}>{item.providers}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.4' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .upload-option-card:hover { 
          border-color: #4498ca !important; 
          box-shadow: 0 10px 25px rgba(68,152,202,0.15) !important; 
          transform: translateY(-4px); 
          background: #bae6fd !important;
        }
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

        /* BIOAGE HERO RESTORED */
        .bioage-headline-row { display: flex; align-items: center; margin-bottom: 1.5rem; }
        .blue-bar { display: inline-block; width: 4px; height: 22px; background: #4498ca; margin-right: 12px; border-radius: 4px; }
        .bioage-headline-row h2 { font-size: 1.45rem; font-weight: 800; color: #1e3a5f; margin: 0; }

        .bioage-card-new {
          background: white; border-radius: 28px; padding: 2.25rem;
          box-shadow: 0 10px 30px rgba(68,152,202,0.06), 0 1px 8px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9; display: flex; gap: 2.5rem; align-items: center; margin-bottom: 2.25rem;
        }
        .bac-left { display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .bac-circle-container {
          position: relative; width: 210px; height: 210px;
          display: flex; align-items: center; justify-content: center;
        }
        .bac-circle-svg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        }
        .bac-circle-text-box {
          position: relative; z-index: 2; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .bac-circle-val { font-size: 3.4rem; font-weight: 900; color: #1c2b3e; line-height: 1; letter-spacing: -0.02em; }
        .bac-circle-lab { font-size: 1.25rem; font-weight: 700; color: #8fa0b5; margin-top: 2px; }

        .bac-right { flex: 1; }
        .bac-badges-row { display: flex; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap; }
        .badge-pill {
          padding: 0.35rem 0.85rem; border-radius: 100px; font-size: 0.78rem; font-weight: 700;
          display: inline-flex; align-items: center; gap: 0.35rem;
        }
        .badge-excellent { background: rgba(34,197,94,0.1); color: #22c55e; }
        .dot-green { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
        .badge-top5 { background: rgba(68,152,202,0.1); color: #4498ca; }

        .bac-main-text { font-size: 1.45rem; font-weight: 700; color: #1e293b; margin: 0 0 1.25rem 0; line-height: 1.3; }
        .bac-main-text strong { font-weight: 850; color: #0f172a; }

        .bac-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
        .bac-stat-card {
          background: #f8fafc; border-radius: 16px; padding: 1rem 1.25rem;
          border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.25rem;
        }
        .bac-stat-card.active-metric { background: #4498ca; border-color: #4498ca; color: white; transition: all 0.2s; }
        .bac-stat-card.active-metric-green { background: #22c55e; border-color: #22c55e; color: white; transition: all 0.2s; }
        .bac-stat-label { font-size: 0.72rem; font-weight: 750; color: #94a3b8; letter-spacing: 0.05em; }
        .bac-stat-card.active-metric .bac-stat-label,
        .bac-stat-card.active-metric-green .bac-stat-label { color: rgba(255,255,255,0.85); }
        .bac-stat-val { font-size: 1.4rem; font-weight: 900; color: #0f172a; }
        .bac-stat-card.active-metric .bac-stat-val,
        .bac-stat-card.active-metric-green .bac-stat-val { color: white; }

        .bac-footer-info { display: flex; align-items: center; font-size: 0.95rem; color: #64748b; font-weight: 500; line-height: 1.4; }

        .trends-opt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
        }

        /* PERIOD SELECTOR */
        .period-selector { display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.35rem; border-radius: 12px; width: fit-content; }
        .period-btn { padding: 0.45rem 1.2rem; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .period-btn.active { background: white; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

        /* TAC GRID */
        .tac-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .tac-item { 
          background: white; border-radius: 24px; padding: 1.8rem; border: 1.5px solid #f1f5f9;
          transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .tac-item:hover { border-color: #4498ca; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .taci-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; }
        .taci-label { font-size: 1.25rem; font-weight: 800; color: #1e3a5f; }
        .taci-trend { font-size: 1.2rem; font-weight: 900; margin-top: 2px; }
        .taci-score-row { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 1.2rem; }
        .taci-score { font-size: 2.4rem; font-weight: 900; color: #1c2b3e; }
        .taci-unit { font-size: 0.9rem; font-weight: 700; color: #94a3b8; margin-left: 2px; }
        .taci-sparkline { height: 70px; margin-bottom: 1.25rem; }
        .taci-labels { display: flex; justify-content: space-between; padding: 0 0.25rem; }
        .taci-labels span { font-size: 0.75rem; font-weight: 700; color: #a1b0cb; opacity: 1 !important; }

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
        .modal-header-custom { margin-bottom: 2rem; text-align: left; }
        .modal-title-custom { font-size: 2.1rem; font-weight: 850; color: #1e2b3e; letter-spacing: -0.03em; margin: 0 0 0.4rem 0; }
        .modal-subtitle-custom { color: #70849e; font-size: 1.15rem; font-weight: 600; margin: 0; }
 
        .opt-modal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.1rem; margin: 2rem 0; }
        .opt-pill-card { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; border-radius: 20px; border: 1.5px solid #f1f5f9; background: #f8fafc; transition: all 0.2s; }
        .opt-pill-card.green-tint { background: #f4fbf7; border-color: rgba(34,197,94,0.1); }
        .opt-pill-card.red-tint { background: #fdf4f4; border-color: rgba(239,68,68,0.1); }
        
        .opt-pill-left { display: flex; align-items: center; gap: 0.95rem; }
        .opt-pill-icon { width: 44px; height: 44px; border-radius: 12px; background: white; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #2e3e5c; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .opt-pill-card.green-tint .opt-pill-icon { color: #2e3e5c; }
        .opt-pill-card.red-tint .opt-pill-icon { color: #2e3e5c; }
        
        .opt-pill-label { font-size: 1.05rem; font-weight: 750; color: #1c2b3e; white-space: nowrap; }
        .opt-pill-val { font-size: 1.1rem; font-weight: 850; letter-spacing: -0.01em; white-space: nowrap; }
        .opt-pill-val.green-text { color: #22c55e; }
        .opt-pill-val.red-text { color: #ef4444; }
        
        .opt-modal-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: #0f172a; color: white; border: none; padding: 1rem 2.5rem; border-radius: 100px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
        .opt-modal-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,23,42,0.2); }

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
