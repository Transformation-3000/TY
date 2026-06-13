'use client';

import { useState, useMemo, useEffect } from 'react';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';

type SubTab = 'trends' | 'goals' | 'activities' | 'reports' | 'journey';
type TrendPeriod = '3m' | '6m' | '12m';

interface ActivityItem {
  id: string;
  label: string;
  cluster: string;
}

const wochenAktivitaeten: ActivityItem[] = [
  // Schlaf & Erholung (10 items)
  { id: '8-8,5 Std. geschlafen', label: '8-8,5 Std. geschlafen', cluster: 'Schlaf & Erholung' },
  { id: 'Zur Chronotyp-Zeit geschlafen', label: 'Zur Chronotyp-Zeit geschlafen', cluster: 'Schlaf & Erholung' },
  { id: 'Vor Schlafen bildschirmfrei', label: 'Vor Schlafen bildschirmfrei', cluster: 'Schlaf & Erholung' },
  { id: 'Schlafzimmer kühl + dunkel gehalten', label: 'Schlafzimmer kühl + dunkel gehalten', cluster: 'Schlaf & Erholung' },
  { id: 'Feste Aufstehzeit eingehalten', label: 'Feste Aufstehzeit eingehalten', cluster: 'Schlaf & Erholung' },
  { id: 'Nach 14 Uhr kein Koffein mehr', label: 'Nach 14 Uhr kein Koffein mehr', cluster: 'Schlaf & Erholung' },
  { id: 'Power Nap gemacht', label: 'Power Nap gemacht', cluster: 'Schlaf & Erholung' },
  { id: 'Abendroutine durchgeführt', label: 'Abendroutine durchgeführt', cluster: 'Schlaf & Erholung' },
  { id: 'Wahrgenommene Schlafqualität', label: 'Wahrgenommene Schlafqualität', cluster: 'Schlaf & Erholung' },
  { id: 'Vor Schlaf keinen Alk. konsumiert', label: 'Vor Schlaf keinen Alk. konsumiert', cluster: 'Schlaf & Erholung' },

  // Kraft & Ausdauer (11 items)
  { id: 'Schritte gegangen', label: 'Schritte gegangen', cluster: 'Kraft & Ausdauer' },
  { id: 'Zügig spazieren gegangen', label: 'Zügig spazieren gegangen', cluster: 'Kraft & Ausdauer' },
  { id: 'Joggen gegangen', label: 'Joggen gegangen', cluster: 'Kraft & Ausdauer' },
  { id: 'Krafttraining abgeschlossen', label: 'Krafttraining abgeschlossen', cluster: 'Kraft & Ausdauer' },
  { id: 'Dehnungen durchgeführt', label: 'Dehnungen durchgeführt', cluster: 'Kraft & Ausdauer' },
  { id: 'Rad gefahren', label: 'Rad gefahren', cluster: 'Kraft & Ausdauer' },
  { id: 'Treppen gestiegen', label: 'Treppen gestiegen', cluster: 'Kraft & Ausdauer' },
  { id: 'HIT-Intervalltraining', label: 'HIT-Intervalltraining', cluster: 'Kraft & Ausdauer' },
  { id: 'Dead Hang gehalten', label: 'Dead Hang gehalten', cluster: 'Kraft & Ausdauer' },
  { id: 'Griffkraft-Training durchgeführt', label: 'Griffkraft-Training durchgeführt', cluster: 'Kraft & Ausdauer' },
  { id: 'Cooper-Test: 2,3 km gelaufen', label: 'Cooper-Test: 2,3 km gelaufen', cluster: 'Kraft & Ausdauer' },

  // Zellerneuerung & Wachstum (10 items)
  { id: 'Protein (Ziel 160g) aufgenommen', label: 'Protein (Ziel 160g) aufgenommen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Omega-3-reiche Lebensmittel / Fischöl', label: 'Omega-3-reiche Lebensmittel / Fischöl', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Esspause eingehalten', label: 'Esspause eingehalten', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Vollwertige Hauptmahlzeit gegessen', label: 'Vollwertige Hauptmahlzeit gegessen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Ballaststoffe (Ziel 30g) zugeführt', label: 'Ballaststoffe (Ziel 30g) zugeführt', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Wasser getrunken', label: 'Wasser getrunken', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Gemüse + Obst gegessen', label: 'Gemüse + Obst gegessen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Kein Ultra-Processed-Snacking', label: 'Kein Ultra-Processed-Snacking', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Zuckerarm gegessen', label: 'Zuckerarm gegessen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Keinen Alkohol konsumiert', label: 'Keinen Alkohol konsumiert', cluster: 'Zellerneuerung & Wachstum' },

  // Immunbalance & Entlastung (6 items)
  { id: 'Innenraum aktiv gelüftet', label: 'Innenraum aktiv gelüftet', cluster: 'Immunbalance & Entlastung' },
  { id: 'Sonnenschutz bewusst eingehalten', label: 'Sonnenschutz bewusst eingehalten', cluster: 'Immunbalance & Entlastung' },
  { id: 'Nikotinfreien Tag geschafft', label: 'Nikotinfreien Tag geschafft', cluster: 'Immunbalance & Entlastung' },
  { id: 'Atemübung durchgeführt', label: 'Atemübung durchgeführt', cluster: 'Immunbalance & Entlastung' },
  { id: 'Bewusste Auszeit in Natur', label: 'Bewusste Auszeit in Natur', cluster: 'Immunbalance & Entlastung' },
  { id: 'Eine Pause ohne Handy gemacht', label: 'Eine Pause ohne Handy gemacht', cluster: 'Immunbalance & Entlastung' },

  // Selbstfürsorge & Soziale Bindungen (5 items)
  { id: 'Echten sozialen Austausch erlebt', label: 'Echten sozialen Austausch erlebt', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Freund / Familienmitglied kontaktiert', label: 'Freund / Familienmitglied kontaktiert', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Mahlzeit mit Verbundenheit erlebt', label: 'Mahlzeit mit Verbundenheit erlebt', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Unterstützung gegeben/angenommen', label: 'Unterstützung gegeben/angenommen', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Im soz. Kontext alkoholfrei geblieben', label: 'Im soz. Kontext alkoholfrei geblieben', cluster: 'Selbstfürsorge & Soziale Bindungen' },

  // Mentale Resilienz (6 items)
  { id: 'Tageslicht am Morgen getankt', label: 'Tageslicht am Morgen getankt', cluster: 'Mentale Resilienz' },
  { id: 'Mikropause 5 Min. eingebaut', label: 'Mikropause 5 Min. eingebaut', cluster: 'Mentale Resilienz' },
  { id: 'Meditiert', label: 'Meditiert', cluster: 'Mentale Resilienz' },
  { id: 'Dankbarkeits-Journaling', label: 'Dankbarkeits-Journaling', cluster: 'Mentale Resilienz' },
  { id: 'Negativen Gedankenkreislauf durchbrochen', label: 'Negativen Gedankenkreislauf durchbrochen', cluster: 'Mentale Resilienz' },
  { id: 'Social-Media-Zeit um 50% reduziert', label: 'Social-Media-Zeit um 50% reduziert', cluster: 'Mentale Resilienz' }
];

const CLUSTER_CONFIGS: Record<string, { icon: string; color: string; bgColor: string; borderColor: string; lightBg: string }> = {
  'Schlaf & Erholung': {
    icon: 'bi-moon-stars-fill',
    color: '#4498ca',
    bgColor: 'rgba(68, 152, 202, 0.1)',
    borderColor: 'rgba(68, 152, 202, 0.2)',
    lightBg: '#f0f9ff'
  },
  'Kraft & Ausdauer': {
    icon: 'bi-lightning-charge-fill',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    lightBg: '#f0fdf4'
  },
  'Zellerneuerung & Wachstum': {
    icon: 'bi-apple',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    lightBg: '#fffbeb'
  },
  'Immunbalance & Entlastung': {
    icon: 'bi-yin-yang',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    lightBg: '#ecfeff'
  },
  'Selbstfürsorge & Soziale Bindungen': {
    icon: 'bi-heart-fill',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    lightBg: '#fdf2f8'
  },
  'Mentale Resilienz': {
    icon: 'bi-sun-fill',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    lightBg: '#f5f3ff'
  }
};

const clusterNames = [
  'Schlaf & Erholung',
  'Kraft & Ausdauer',
  'Zellerneuerung & Wachstum',
  'Immunbalance & Entlastung',
  'Selbstfürsorge & Soziale Bindungen',
  'Mentale Resilienz'
];

interface EntwicklungPageProps {
  onStartSimulation?: () => void;
}

export default function EntwicklungPage({ onStartSimulation }: EntwicklungPageProps) {
  const [activeTab, setActiveTab] = useState<SubTab>('trends');
  const [selectedMetric, setSelectedMetric] = useState<'chronological' | 'difference' | 'dna'>('difference');
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('12m');
  const [showBioAgeDetails, setShowBioAgeDetails] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [checkedActivities, setCheckedActivities] = useState<string[]>([]);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ty-checked-activities');
    if (saved) {
      setCheckedActivities(JSON.parse(saved));
    } else {
      const defaultChecked = ['8-8,5 Std. geschlafen', 'Schritte gegangen'];
      setCheckedActivities(defaultChecked);
      localStorage.setItem('ty-checked-activities', JSON.stringify(defaultChecked));
    }

    const handleSync = () => {
      const updated = localStorage.getItem('ty-checked-activities');
      if (updated) setCheckedActivities(JSON.parse(updated));
    };
    window.addEventListener('ty-activities-sync', handleSync);
    return () => window.removeEventListener('ty-activities-sync', handleSync);
  }, []);

  const filteredActivities = useMemo(() => {
    if (!activitySearchQuery.trim()) return wochenAktivitaeten;
    const q = activitySearchQuery.toLowerCase();
    return wochenAktivitaeten.filter(act => act.label.toLowerCase().includes(q));
  }, [activitySearchQuery]);

  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {
      'Schlaf & Erholung': [],
      'Kraft & Ausdauer': [],
      'Zellerneuerung & Wachstum': [],
      'Immunbalance & Entlastung': [],
      'Selbstfürsorge & Soziale Bindungen': [],
      'Mentale Resilienz': [],
    };
    filteredActivities.forEach(act => {
      if (groups[act.cluster]) {
        groups[act.cluster].push(act);
      }
    });
    return groups;
  }, [filteredActivities]);

  const toggleActivity = (id: string) => {
    const next = checkedActivities.includes(id)
      ? checkedActivities.filter(x => x !== id)
      : [...checkedActivities, id];
    setCheckedActivities(next);
    localStorage.setItem('ty-checked-activities', JSON.stringify(next));
    window.dispatchEvent(new Event('ty-activities-sync'));
  };

  const [yesterdayStr, setYesterdayStr] = useState('10. MAI');
  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const day = yesterday.getDate();
    const months = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
    const month = months[yesterday.getMonth()];
    setYesterdayStr(`${day}. ${month}`);
  }, []);



  const trendData = [
    { title: 'Schlaf & Erholung', data: [62, 60, 68, 64, 70, 67, 72, 70, 75, 72, 78, 75] },
    { title: 'Kraft & Ausdauer', data: [55, 58, 60, 63, 67, 70, 72, 75, 78, 80, 83, 84] },
    { title: 'Zellerneuerung & Wachstum', data: [64, 66, 63, 68, 70, 72, 71, 75, 77, 76, 82, 81] },
    { title: 'Immunbalance & Entlastung', data: [82, 78, 80, 74, 76, 70, 72, 65, 68, 60, 64, 62] },
    { title: 'Selbstfürsorge & Soziale Bindungen', data: [72, 71, 73, 72, 72, 74, 73, 71, 72, 73, 72, 73] },
    { title: 'Mentale Resilienz', data: [56, 55, 57, 56, 55, 56, 57, 55, 56, 57, 56, 57] },
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

  const lastThreeMonths = useMemo(() => {
    const fullMonths = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const results = [];
    const date = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      results.push({
        monthName: fullMonths[d.getMonth()],
        year: d.getFullYear(),
      });
    }
    return results;
  }, []);

  // --- DYNAMIC METRICS FOR CIRCLE ---
  const circleValue = selectedMetric === 'chronological' ? '46,7' : selectedMetric === 'difference' ? '42,5' : '0,82';
  const circleLabel = selectedMetric === 'dna' ? 'DNA' : 'Jahre';

  // activeDashoffset determines the active stroke outline of the circle based on selected metric.
  // 100% of the circle corresponds to 111 years.
  const activeDashoffset = useMemo(() => {
    if (selectedMetric === 'difference') {
      // biological age = 42.5 years
      const P = 42.5 / 111;
      return 257.6 * (1 - P);
    } else if (selectedMetric === 'chronological') {
      // chronological age = 46.7 years
      const P = 46.7 / 111;
      return 257.6 * (1 - P);
    } else {
      // DNA aging rate 0.82x -> 82% fill
      return 257.6 * 0.18;
    }
  }, [selectedMetric]);

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
          { id: 'activities', label: 'Wochenaktivitäten' },
          { id: 'reports', label: 'Monatsreports' },
          { id: 'journey', label: 'Journey' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubTab)}
            className={`entw-tab ${activeTab === tab.id ? 'active' : ''}`}
            style={tab.id === 'journey' ? { display: 'inline-flex', alignItems: 'center', gap: '6px' } : undefined}
          >
            {tab.id === 'journey' && (
              <i className="bi bi-lock-fill" style={{ fontSize: '0.9rem', color: activeTab === 'journey' ? '#fff' : '#64748b' }}></i>
            )}
            {tab.label}
            {tab.id === 'journey' && (
              <span className="premium-badge" style={{
                fontSize: '0.62rem',
                background: activeTab === 'journey' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(68, 152, 202, 0.15)',
                color: activeTab === 'journey' ? 'white' : '#4498ca',
                padding: '2px 5px',
                borderRadius: '4px',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}>PREMIUM</span>
            )}
          </button>
        ))}
      </div>

      {/* ── TRENDS TAB ── */}
      {activeTab === 'trends' && (
        <div className="trends-view">
          {/* Aktuelles True Years BioAge Headline */}
          <div className="bioage-headline-row">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Dein True Years BioAge</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} className="bioage-btn-row">
              <button 
                type="button"
                className="upload-trigger-btn" 
                onClick={() => setShowUploadModal(true)}
              >
                <i className="bi bi-lock-fill" style={{ color: 'white' }}></i>
                <span>BioAge-Optimizer</span>
                <span className="premium-badge" style={{
                  marginLeft: '4px',
                  fontSize: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.22)',
                  color: 'white',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center'
                }}>
                  Premium
                </span>
              </button>
            </div>
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
                    strokeDashoffset={activeDashoffset} 
                    strokeLinecap="round" 
                    filter="url(#softGlow)"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
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

              <h3 className="bac-main-text" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                Du alterst aktuell <strong>15,5% langsamer</strong> als der Durchschnitt.
              </h3>
              
              <div className="bac-footer-info">
                <i className="bi bi-info-circle" style={{ marginRight: '8px', color: '#3b82f6', fontSize: '1.15rem', flexShrink: 0 }}></i>
                <span><strong>Datengrundlage deiner Auswertung:</strong> Fragebogen bei Programmstart, Whoop Age, Epi-Proteomic-Age</span>
              </div>
            </div>
          </div>

          {/* Headline & Period Selector Row */}
          <div className="trends-opt-header">
            <div className="trends-title-group">
              <span className="blue-bar"></span>
              <h2>Trends Optimierungsfelder</h2>
            </div>
            
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
                  <div className="taci-header" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <span className="taci-label">
                        {t.title.split(' & ').map((part, idx, arr) => (
                          <span key={idx} style={{ display: 'block', lineHeight: '1.25' }}>
                            {idx === 0 ? `${i + 1}. ` : ''}{part}{idx < arr.length - 1 ? ' &' : ''}
                          </span>
                        ))}
                      </span>
                      <div className="taci-score-row" style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                        <span className="taci-score">{Math.round(currentVal)}</span>
                        <span className="taci-unit">Pkt</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: '2px solid #4498ca',
                        background: '#f0f9ff',
                        color: '#4498ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}>
                        <i className={`bi ${CLUSTER_CONFIGS[t.title]?.icon || 'bi-question-circle'}`}></i>
                      </div>
                      <span className="taci-trend" style={{ color }}>{formattedPct}</span>
                    </div>
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
          <div className="goals-section-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Deine Wochenziele</h2>
            </div>
            <button className="adjust-goals-btn">
              <i className="bi bi-sliders" style={{ marginRight: '6px', color: 'white' }}></i>
              Wochenziele anpassen
            </button>
          </div>

          <div className="wochenziele-grid">
            {/* Card 1 */}
            <div className="wochenziel-card">
              <div className="wzc-top">
                <div className="wzc-left-content">
                  <h3>1. Schlafrhythmus stabilisieren</h3>
                  <p>Stelle 4x in Folge regelmäßige Einschlafzeiten sicher (+/- 30 Min.), um maximale Regeneration und vollen Fokus am Tag zu erreichen.</p>
                </div>
                <div className="wzc-date-badge">
                  <i className="bi bi-calendar3"></i>
                  <span>{yesterdayStr}<br/><small>Letzter Tag</small></span>
                </div>
              </div>
              <div className="wzc-progress-box">
                <div className="wzc-circles">
                  <div className="wzc-circle done"><i className="bi bi-check"></i></div>
                  <div className="wzc-circle done"><i className="bi bi-check"></i></div>
                  <div className="wzc-circle empty"></div>
                  <div className="wzc-circle empty"></div>
                </div>
                <div className="wzc-progress-text">
                  <strong>50%</strong>
                  <span>2/4 Tagen</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="wochenziel-card">
              <div className="wzc-top">
                <div className="wzc-left-content">
                  <h3>2. Kraftaufbau</h3>
                  <p>Absolviere diese Woche 3 Trainingseinheiten, um deinen Bewegungsapparat und deine Haltung nachhaltig zu stärken.</p>
                </div>
                <div className="wzc-date-badge">
                  <i className="bi bi-calendar3"></i>
                  <span>{yesterdayStr}<br/><small>Letzter Tag</small></span>
                </div>
              </div>
              <div className="wzc-progress-box">
                <div className="wzc-circles">
                  <div className="wzc-circle done"><i className="bi bi-check"></i></div>
                  <div className="wzc-circle empty"></div>
                  <div className="wzc-circle empty"></div>
                </div>
                <div className="wzc-progress-text">
                  <strong>33%</strong>
                  <span>1/3 Einheiten</span>
                </div>
              </div>
            </div>
          </div>

          <div className="goals-section-header" style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Next Best Actions</h2>
            </div>
          </div>

          <div className="nba-grid">
            {/* Linke Spalte (passend zum linken Wochenziel: Schlafrhythmus) */}
            <div className="nba-column">
              {/* Action 1 */}
              <div className="nba-card border-green">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-green"></span>Koffein-Sperrzeit ab 14 Uhr</h4>
                  <p className="nba-desc">Verbessert die Schlafqualität und hilft, die Einschlafzeit am Abend stabil zu halten.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Hoch</span>
                  <span className="nba-pillar pillar-schlaf">Schlafrhythmus</span>
                </div>
              </div>

              {/* Action 2 */}
              <div className="nba-card border-orange">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-orange"></span>15 Min. Morgenlicht</h4>
                  <p className="nba-desc">Triggert die Serotonin-Produktion für besseren Schlaf am Abend.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Mittel</span>
                  <span className="nba-pillar pillar-schlaf">Schlafrhythmus</span>
                </div>
              </div>

              {/* Action 3 */}
              <div className="nba-card border-blue">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-blue"></span>Kein Blaulicht ab 21 Uhr</h4>
                  <p className="nba-desc">Verhindert die Blockade der Melatonin-Ausschüttung durch Bildschirme.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Niedrig</span>
                  <span className="nba-pillar pillar-schlaf">Schlafrhythmus</span>
                </div>
              </div>
            </div>

            {/* Rechte Spalte (passend zum rechten Wochenziel: Kraftaufbau) */}
            <div className="nba-column">
              {/* Action 3 */}
              <div className="nba-card border-green">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-green"></span>Protein-Intake optimieren</h4>
                  <p className="nba-desc">Strebe täglich 1,5–2 g Protein je kg Körpergewicht an, um den Muskelaufbau optimal zu unterstützen.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Hoch</span>
                  <span className="nba-pillar pillar-kraft">Kraftaufbau</span>
                </div>
              </div>

              {/* Action 4 */}
              <div className="nba-card border-orange">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-orange"></span>15 Kniebeugen (Squats)</h4>
                  <p className="nba-desc">Stärkt die Gesäß- und Oberschenkelmuskulatur für eine stabile Haltung.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Mittel</span>
                  <span className="nba-pillar pillar-kraft">Kraftaufbau</span>
                </div>
              </div>

              {/* Action 5 */}
              <div className="nba-card border-blue">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-blue"></span>Griffkraft-Übung</h4>
                  <p className="nba-desc">Fördert die funktionelle Kraft und ist ein starker Langlebigkeits-Indikator.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Niedrig</span>
                  <span className="nba-pillar pillar-kraft">Kraftaufbau</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── AKTIVITÄTEN ── */}
      {activeTab === 'activities' && (
        <div className="activities-view">
          <div className="goals-section-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Deine erfassten Wochenaktivitäten</h2>
            </div>
          </div>

          <div className="act-search-row">
            <div className="act-search-wrap">
              <i className="bi bi-search" style={{ color: '#94a3b8', marginRight: '8px' }}></i>
              <input
                type="text"
                placeholder="Aktivität suchen (z.B. Yoga, Spaziergang, Fokus...)"
                value={activitySearchQuery}
                onChange={e => setActivitySearchQuery(e.target.value)}
                className="act-search-input"
              />
              {activitySearchQuery && (
                <button className="act-search-clear" onClick={() => setActivitySearchQuery('')}>&times;</button>
              )}
            </div>
          </div>

          <div className="act-count-text">
            49 Aktivitäten in 6 Clustern
          </div>

          <div className="act-cluster-grid">
            {clusterNames.map((clusterName, idx) => {
              const config = CLUSTER_CONFIGS[clusterName];
              const items = groupedActivities[clusterName] || [];
              const totalCount = wochenAktivitaeten.filter(act => act.cluster === clusterName).length;
              const doneCount = wochenAktivitaeten.filter(act => act.cluster === clusterName && checkedActivities.includes(act.id)).length;
              
              return (
                <div key={clusterName} className="act-cluster-card">
                  <div className="acc-header">
                    <div className="acc-icon-box" style={{ background: config.bgColor, color: config.color }}>
                      <i className={`bi ${config.icon}`} style={{ color: config.color }}></i>
                    </div>
                    <span className="acc-status" style={{ color: config.color }}>
                      {doneCount}/{totalCount} Erledigt
                    </span>
                  </div>
                  
                  <div className="acc-title-box">
                    <h3>{idx + 1}. {clusterName}</h3>
                    <div className="acc-underline" style={{ background: config.color }}></div>
                  </div>
                  
                  <div className="acc-list">
                    {items.length === 0 ? (
                      <div style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem 0' }}>Keine Treffer</div>
                    ) : (
                      items.map(act => {
                        const isChecked = checkedActivities.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            className={`acc-item ${isChecked ? 'checked' : ''}`}
                            onClick={() => toggleActivity(act.id)}
                            style={isChecked ? { background: config.lightBg } : {}}
                          >
                            <div className="acc-checkbox" style={isChecked ? { background: config.color, borderColor: config.color } : {}}>
                              {isChecked && <i className="bi bi-check-lg" style={{ color: 'white', fontSize: '0.8rem' }}></i>}
                            </div>
                            <span className="acc-label">{act.label}</span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {activeTab === 'reports' && (
        <div className="reports-view">
          <div className="goals-section-header" style={{ marginBottom: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Deine Monatsreports</h2>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '1.05rem', margin: '0 0 2rem 0' }}>
            Analysiere deine Fortschritte und entdecke personalisierte Empfehlungen
          </p>

          <div className="rep-grid-custom">
            {lastThreeMonths.map((m, idx) => {
              const scores = [78, 67, 75, 71];
              const score = scores[idx];
              const diffVal = score - scores[idx + 1];
              const diff = diffVal >= 0 ? `+${diffVal}` : `${diffVal}`;
              const isPos = diffVal >= 0;

              let bgClass = "bg-blue";
              let strokeClass = "stroke-blue";
              let isCurrent = idx === 0;
              let barHeights = ['8px', '8px', '16px', '12px', '18px', '10px', '14px', '22px'];

              if (idx === 1) {
                bgClass = "bg-dark";
                strokeClass = "stroke-dark";
                barHeights = ['14px', '8px', '16px', '14px', '14px', '14px', '22px', '16px'];
              } else if (idx === 2) {
                bgClass = "bg-green";
                strokeClass = "stroke-green";
                barHeights = ['12px', '8px', '14px', '14px', '18px', '14px', '20px', '16px'];
              }

              return (
                <div key={idx} className="rep-card-custom">
                  <div className={`rep-card-top ${bgClass}`}>
                    <div className="rep-top-header">
                      <span className="rep-meta" style={{ color: '#ffffff', opacity: 1 }}>
                        <i className="bi bi-file-earmark-text" style={{ marginRight: '6.5px', color: '#ffffff' }}></i>
                        Monatsreport
                      </span>
                      {isCurrent && <span className="rep-badge-aktuell">Aktuell</span>}
                    </div>
                    <div className="rep-month-year">
                      <h3>{m.monthName}</h3>
                      <span className="rep-year">{m.year}</span>
                    </div>
                    <div className="rep-mini-chart">
                      {barHeights.map((h, bIdx) => (
                        <div key={bIdx} className="rep-bar" style={{ height: h }}></div>
                      ))}
                    </div>
                  </div>
                  <div className="rep-card-bottom">
                    <div className="rep-bottom-left">
                      <span className="rep-index-label">LIFESTYLE INDEX</span>
                      <div className="rep-score-row">
                        <span className="rep-score-val">{score}</span>
                        <span className={`rep-diff-badge ${isPos ? 'pos' : 'neg'}`}>{diff}</span>
                      </div>
                    </div>
                    <div className="rep-bottom-right">
                      <div className="rep-circle-wrap">
                        <svg className="rep-circle-svg" viewBox="0 0 36 36">
                          <path
                            className="rep-circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="3.5"
                          />
                          <path
                            className={`rep-circle-fg ${strokeClass}`}
                            strokeDasharray={`${score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="rep-circle-text">{score}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                { title: 'Zellerneuerung & Wachstum', val: '-0.9 J.', icon: 'bi-cup-hot', type: 'green' },
                { title: 'Immunbalance & Entlastung', val: '+0.5 J.', icon: 'bi-wind', type: 'red' },
                { title: 'Selbstfürsorge & Soziale Bindungen', val: '-0.6 J.', icon: 'bi-people', type: 'green' },
                { title: 'Mentale Resilienz', val: '-0.5 J.', icon: 'bi-stars', type: 'green' },
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
          <div className="modal-content upload-modal-content" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '1000px', borderRadius: '28px', padding: '2.05rem 2rem 2.25rem 2rem', background: '#e0f2fe' }}>
            <button className="modal-close" onClick={() => setShowUploadModal(false)} style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', top: '1.5rem', right: '1.5rem' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
            </button>
            
            <div className="modal-header-custom" style={{ marginBottom: '0.35rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(68,152,202,0.12)' }}>
                  <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '1.0rem', color: '#4498ca' }}></i>
                </div>
                <h2 className="modal-title-custom" style={{ margin: 0, fontSize: '1.55rem' }}>BioAge Nachweise hochladen</h2>
              </div>
              <p className="modal-subtitle-custom" style={{ fontSize: '1.18rem', margin: '5px 0', lineHeight: '1.3' }}>Wähle einen BioAge-Nachweis aus, den du deinem Profil hinzufügen möchtest,<br/>damit dein biologisches Alter präziser eingeschätzt werden kann.</p>
            </div>

            <div className="upload-grid">
              {[
                { title: <>Wearable Age<br/></>, providers: '(WHOOP / Oura / Garmin)', desc: 'Alterseinschätzung über Schlaf, HRV, Erholung und Aktivität', img: '/images/four_wearables.png', color: '#3b82f6', fit: 'contain' },
                { title: <>Functional Fitness Age<br/></>, providers: '(Technogym / EGYM)', desc: 'Funktionelles Alter über Kraft, Ausdauer, Balance & Körperbau', img: '/images/technogym_kiosk_white_bg.png', color: '#10b981', fit: 'contain' },
                { title: <>Pheno Age<br/></>, providers: '(AWARE / Years)', desc: 'Biologisches Alter auf Basis klassischer Blutmarker', img: '/images/blood_vibrant_white_bg.png', color: '#ef4444', fit: 'contain' },
                { title: <>Molecular Age<br/></>, providers: '(MoleQlar / TruDiagnostic)', desc: 'Molekulare Alterungssignale über DNA-Methylierungsmuster oder Proteinmarker', img: '/images/dna_vibrant_white_bg.png', color: '#8b5cf6', fit: 'contain' },
                { title: 'Pace of Aging', providers: '(MoleQlar / DunedinPACE / TruDiagnostic)', desc: 'Messung der biologischen Alterungsgeschwindigkeit', img: '/images/pace_of_aging_dial2.png', color: '#f59e0b', fit: 'contain' },
                { title: 'Glycan Age', providers: '', desc: 'Immunalterung und Entzündungsniveau auf Basis von Zuckerketten', img: '/images/glycan_antibody_clean_large.png', color: '#0ea5e9', fit: 'contain' },
              ].map((item, idx) => (
                <div key={idx} className="upload-option-card">
                  <div className="upload-option-img-container">
                    <img src={item.img} alt={typeof item.title === 'string' ? item.title : 'BioAge Nachweis'} className="upload-option-img" style={{ objectFit: (item.fit || 'cover') as any, background: item.fit === 'contain' ? 'white' : 'transparent', padding: item.fit === 'contain' ? '10%' : '0' }} />
                  </div>
                  <div className="upload-option-text-container">
                    <div style={{ fontWeight: 800, color: '#1e3a5f', marginBottom: '0.2rem', fontSize: '1.3rem', lineHeight: '1.2' }}>
                      {idx + 1}. {item.title} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '1.08rem', marginLeft: '2px' }}>{item.providers}</span>
                    </div>
                    <div style={{ fontSize: '1.14rem', color: '#64748b', lineHeight: '1.3' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .upload-option-card {
          display: flex;
          align-items: stretch;
          border: 1.5px solid transparent;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          overflow: hidden;
        }
        .upload-option-text-container {
          flex: 1;
          padding: 0.4rem 1rem 0.4rem 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 0.85rem;
        }
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

        .bioage-headline-row { display: flex; align-items: center; margin-bottom: 1.5rem; justify-content: space-between; }
        .blue-bar { display: inline-block; width: 4px; height: 22px; background: #4498ca; margin-right: 12px; border-radius: 4px; }
        .bioage-headline-row h2 { font-size: 1.45rem; font-weight: 800; color: #1e3a5f; margin: 0; }

        .trends-title-group { display: flex; align-items: center; }
        .trends-title-group h2 { font-size: 1.45rem; font-weight: 800; color: #1e3a5f; margin: 0; }

        .simulation-trigger-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .simulation-trigger-btn:hover {
          background: #16a34a;
        }

        .upload-trigger-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: #4498ca;
          color: white;
          border: none;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .upload-trigger-btn:hover {
          background: #357fa8;
        }

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
          padding: 0.4rem 0.95rem; border-radius: 100px; font-size: 0.90rem; font-weight: 700;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .badge-excellent { background: rgba(34,197,94,0.1); color: #22c55e; }
        .dot-green { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
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
        .period-btn { padding: 0.45rem 1.2rem; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: calc(0.85rem + 2pt); font-weight: 700; cursor: pointer; transition: all 0.2s; }
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
        .modal-close { position: absolute; top: 1.5rem; right: 1.5rem; border: none; background: #f1f5f9; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; }
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
        
        .opt-pill-label { font-size: 0.95rem; font-weight: 750; color: #1c2b3e; line-height: 1.25; }
        .opt-pill-val { font-size: 1.1rem; font-weight: 850; letter-spacing: -0.01em; white-space: nowrap; }
        .opt-pill-val.green-text { color: #22c55e; }
        .opt-pill-val.red-text { color: #ef4444; }
        
        .opt-modal-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: #0f172a; color: white; border: none; padding: 1rem 2.5rem; border-radius: 100px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
        .opt-modal-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,23,42,0.2); }

        .upload-modal-content {
          width: 100%;
          max-width: 1000px;
          border-radius: 28px;
          padding: 1rem 2rem 1.25rem 2rem;
          background: #e0f2fe;
          position: relative;
        }

        .upload-option-img-container {
          width: 30%;
          min-width: 80px;
          max-width: 180px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }
        .upload-option-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.45rem;
        }

        /* GOALS / ACTIVITIES / JOURNEY (Shorter styles for brevity) */
        .goals-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .goals-section-header h2 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0;
        }
        .adjust-goals-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: #4498ca;
          color: white;
          border: none;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .adjust-goals-btn:hover {
          background: #357fa8;
        }
        .wochenziele-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .wochenziel-card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #f1f5f9;
          padding: 1.8rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .wzc-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .wzc-left-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }
        .wzc-left-content p {
          font-size: 1.12rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }
        .wzc-date-badge {
          background: #e0f2fe;
          border-radius: 12px;
          padding: 0.86rem 1.14rem;
          display: flex;
          align-items: center;
          gap: 0.72rem;
          color: #0369a1;
          height: fit-content;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 1.08rem;
          line-height: 1.2;
          text-align: left;
        }
        .wzc-date-badge i {
          font-size: 1.56rem;
        }
        .wzc-date-badge small {
          font-weight: 500;
          color: #0284c7;
        }
        .wzc-progress-box {
          background: #f8fafc;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wzc-circles {
          display: flex;
          gap: 0.5rem;
        }
        .wzc-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wzc-circle.done {
          background: #22c55e;
          color: white;
          font-size: 1.3rem;
        }
        .wzc-circle.empty {
          border: 2px dashed #cbd5e1;
          background: transparent;
        }
        .wzc-progress-text {
          text-align: right;
          line-height: 1.2;
        }
        .wzc-progress-text strong {
          display: block;
          font-size: 1.52rem;
          font-weight: 850;
          color: #1e293b;
        }
        .wzc-progress-text span {
          font-size: 1.17rem;
          font-weight: 600;
          color: #64748b;
        }

        /* NEXT BEST ACTIONS */
        .nba-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .nba-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .nba-card {
          background: white;
          border-radius: 16px;
          border: 1.5px solid #f1f5f9;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          transition: all 0.25s ease;
        }
        .nba-card:hover {
          border-color: #4498ca !important;
          box-shadow: 0 8px 20px rgba(68,152,202,0.08) !important;
          transform: translateY(-2px);
        }
        .nba-card.border-green {
          border-left: 4px solid #22c55e;
        }
        .nba-card.border-orange {
          border-left: 4px solid #f59e0b;
        }
        .nba-card.border-blue {
          border-left: 4px solid #3b82f6;
        }
        .nba-card-left {
          flex: 1;
        }
        .nba-title {
          font-size: 1.26rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.35rem 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-green {
          background: #22c55e;
        }
        .dot-orange {
          background: #f59e0b;
        }
        .dot-blue {
          background: #3b82f6;
        }
        .nba-desc {
          font-size: 1.06rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }
        .nba-card-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          align-self: stretch;
          flex-shrink: 0;
        }
        .nba-priority {
          font-size: 1.01rem;
          font-weight: 700;
          color: #4498ca;
        }
        .nba-pillar {
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: 100px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .nba-pillar.pillar-schlaf {
          color: #0369a1;
          background: #e0f2fe;
          border-color: #bae6fd;
        }
        .nba-pillar.pillar-schlaf:hover {
          background: #bae6fd;
          transform: translateY(-1px);
        }
        .nba-pillar.pillar-kraft {
          color: #6b21a8;
          background: #f3e8ff;
          border-color: #e9d5ff;
        }
        .nba-pillar.pillar-kraft:hover {
          background: #e9d5ff;
          transform: translateY(-1px);
        }

        .act-item { display: flex; align-items: center; gap: 1.2rem; background: white; border-radius: 20px; padding: 1.25rem; border: 1.5px solid #f1f5f9; margin-bottom: 1rem; }
        .act-icon { width: 48px; height: 48px; border-radius: 14px; background: #f0f7ff; color: #4498ca; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .act-main { flex: 1; }
        .act-type { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .act-date { font-size: 0.8rem; color: #94a3b8; }
        .act-right { text-align: right; }
        .act-dur { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .act-score { font-size: 0.85rem; font-weight: 800; color: #22c55e; }

        .rep-grid-custom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .rep-card-custom {
          background: white;
          border-radius: 28px;
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.025);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .rep-card-custom:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }
        .rep-card-top {
          padding: 1.75rem;
          color: white;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 190px;
        }
        .rep-card-top.bg-blue {
          background: #4498ca;
        }
        .rep-card-top.bg-dark {
          background: #1c2b38;
        }
        .rep-card-top.bg-green {
          background: #50b848;
        }
        .rep-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rep-meta {
          font-size: 0.95rem;
          color: #ffffff;
          opacity: 1;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        .rep-badge-aktuell {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 750;
          color: white;
        }
        .rep-month-year {
          margin-top: 0.75rem;
        }
        .rep-month-year h3 {
          font-size: 2.15rem;
          font-weight: 850;
          margin: 0;
          line-height: 1.1;
        }
        .rep-year {
          font-size: 1.15rem;
          opacity: 0.8;
          font-weight: 600;
        }
        .rep-mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 25px;
          margin-top: 1rem;
        }
        .rep-bar {
          flex: 1;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 3px;
          transition: all 0.2s;
        }
        .rep-card-custom:hover .rep-bar {
          background: rgba(255, 255, 255, 0.6);
        }
        .rep-card-bottom {
          padding: 1.5rem 1.75rem;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rep-bottom-left {
          display: flex;
          flex-direction: column;
        }
        .rep-index-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }
        .rep-score-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .rep-score-val {
          font-size: 2.3rem;
          font-weight: 850;
          color: #1e293b;
          line-height: 1;
        }
        .rep-diff-badge {
          font-size: 1.15rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
        }
        .rep-diff-badge.pos {
          color: #22c55e;
        }
        .rep-diff-badge.neg {
          color: #ef4444;
        }
        .rep-circle-wrap {
          position: relative;
          width: 56px;
          height: 56px;
        }
        .rep-circle-svg {
          width: 100%;
          height: 100%;
        }
        .rep-circle-fg {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .rep-circle-fg.stroke-blue {
          stroke: #4498ca;
        }
        .rep-circle-fg.stroke-dark {
          stroke: #1c2b38;
        }
        .rep-circle-fg.stroke-green {
          stroke: #50b848;
        }
        .rep-circle-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
        }

        /* Mobile adaptation for Reports Grid */
        @media (max-width: 1000px) {
          .rep-grid-custom {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .rep-grid-custom {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

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

        @media (max-width: 768px) {
          .entw-page {
            padding: 1rem 1rem 100px 1rem;
          }
          .entw-tabs {
            overflow-x: auto;
            padding-bottom: 0.5rem;
            scrollbar-width: none;
          }
          .entw-tabs::-webkit-scrollbar {
            display: none;
          }
          .entw-tab {
            white-space: nowrap;
          }
          .bioage-headline-row,
          .goals-section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .bioage-btn-row {
            width: 100%;
            flex-direction: column;
            gap: 0.5rem;
          }
          .simulation-trigger-btn,
          .upload-trigger-btn,
          .adjust-goals-btn {
            width: 100%;
            justify-content: center;
          }
          .bioage-card-new {
            flex-direction: column;
            padding: 1.5rem;
            gap: 1.5rem;
            align-items: center;
            text-align: center;
          }
          .bac-circle-container {
            width: 260px;
            height: 260px;
          }
          .bac-circle-val {
            font-size: 4.25rem;
          }
          .bac-circle-lab {
            font-size: 1.56rem;
          }
          .bac-badges-row {
            justify-content: center;
          }
          .bac-footer-info {
            align-items: flex-start;
            text-align: left;
          }
          .trends-opt-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            margin-top: 2rem;
          }
          .period-selector {
            width: 100%;
            display: flex;
          }
          .period-btn {
            flex: 1;
            text-align: center;
          }
          .upload-grid {
            grid-template-columns: 1fr;
          }
          .upload-modal-content {
            padding: 1.5rem;
          }
          .modal-title-custom {
            font-size: 1.5rem;
          }
          .modal-subtitle-custom {
            font-size: 0.95rem;
          }
          .modal-header-custom div {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.5rem !important;
          }
          .upload-option-card {
            align-items: stretch;
          }
          .upload-option-text-container {
            padding: 0.85rem 0.85rem 0.85rem 0;
            margin-left: 0.8rem;
          }
          .wochenziele-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .nba-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .modal-overlay {
            padding: 0.75rem;
          }
          .bac-stats-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .opt-modal-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .wzc-top {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .nba-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .nba-card-right {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            text-align: left;
            margin-top: 0.25rem;
            border-top: 1px solid #f1f5f9;
            padding-top: 0.5rem;
          }
          .goal-summary {
            gap: 1.5rem;
          }
          .rep-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .rep-btn {
            width: 100%;
            text-align: center;
          }
          .modal-content {
            padding: 1.5rem 1rem;
            border-radius: 20px;
          }
        }

        /* AKTIVITÄTEN RECONSTRUCTION */
        .act-search-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: stretch;
        }
        .act-search-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.6rem 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .act-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: #1e293b;
        }
        .act-search-input::placeholder {
          color: #94a3b8;
        }
        .act-search-clear {
          border: none;
          background: none;
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .voice-input-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          background: rgba(255,255,255,0.8);
          border: 1.5px dashed rgba(68,152,202,0.3);
          transition: all 0.2s;
        }
        .voice-input-bar:hover {
          border-color: #4498ca;
          background: white;
        }
        .voice-placeholder {
          font-size: 0.85rem;
          color: #64748b;
        }
        .voice-btn {
          padding: 0.35rem 0.8rem;
          border-radius: 8px;
          border: none;
          background: #4498ca;
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .voice-btn:hover {
          background: #357fa8;
        }
        .act-count-text {
          font-size: 1.02rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .act-cluster-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .act-cluster-card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #f1f5f9;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.015);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          transition: all 0.25s ease;
        }
        .act-cluster-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.03);
          transform: translateY(-2px);
        }
        .acc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .acc-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        .acc-status {
          font-size: 0.98rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .acc-title-box h3 {
          font-size: 1.25rem;
          font-weight: 850;
          color: #1e293b;
          margin: 0;
        }
        .acc-underline {
          height: 4px;
          width: 45px;
          border-radius: 4px;
          margin-top: 0.45rem;
        }
        .acc-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .acc-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.8rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .acc-item.checked {
          border-color: rgba(0,0,0,0.01);
        }
        .acc-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .acc-item.checked .acc-checkbox {
          color: white;
        }
        .acc-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #475569;
          line-height: 1.3;
        }
        .acc-item.checked .acc-label {
          color: #1e293b;
        }

        @media (max-width: 1000px) {
          .act-cluster-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .act-cluster-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .act-search-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .voice-input-bar {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
