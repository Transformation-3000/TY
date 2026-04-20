'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface CategoryPetal {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  status: 'positive' | 'negative' | 'neutral';
  angle: number;
  stars: number;
  maxStars: number;
}

const categories: CategoryPetal[] = [
  { id: 'erholung', number: 1, title: 'Erholung', subtitle: 'Schlaf & Regeneration', status: 'positive', angle: 0, stars: 2, maxStars: 2 },
  { id: 'kraft', number: 2, title: 'Kraft & Ausdauer', subtitle: 'Bewegung & Sport', status: 'positive', angle: 60, stars: 1, maxStars: 2 },
  { id: 'vitalitaet', number: 3, title: 'Vitalität & Schutz', subtitle: 'Zellgesundheit & Ernährung', status: 'neutral', angle: 120, stars: 1, maxStars: 2 },
  { id: 'selbstfuersorge', number: 4, title: 'Selbstfürsorge', subtitle: 'Routinen & Mentales', status: 'positive', angle: 180, stars: 2, maxStars: 2 },
  { id: 'balance', number: 5, title: 'Balance & Entlastung', subtitle: 'Stress & Soziales', status: 'negative', angle: 240, stars: 0, maxStars: 2 },
  { id: 'resilienz', number: 6, title: 'Resilienz', subtitle: 'Adaptionsfähigkeit', status: 'neutral', angle: 300, stars: 1, maxStars: 2 },
];

const getCategoryIcon = (categoryId: string, color: string) => {
  const s = 18;
  const icons: Record<string, React.ReactElement> = {
    erholung: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    kraft: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <circle cx="12" cy="5" r="2" stroke={color} strokeWidth="2" />
        <path d="M12 7v4l-3 5M12 11l3 5M9 21l1.5-5M15 21l-1.5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11h3M14 11h3" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    vitalitaet: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M12 3L4 7v6c0 5.5 3.4 10.3 8 11.5 4.6-1.2 8-6 8-11.5V7l-8-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    selbstfuersorge: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    balance: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M12 3v18M3 9l9-6 9 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12l-2 6h4l-2-6zM19 12l-2 6h4l-2-6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    resilienz: (
      <svg viewBox="0 0 24 24" fill="none" width={s} height={s}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[categoryId] || icons['resilienz'];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'positive': return '#22c55e';
    case 'negative': return '#ef4444';
    default: return '#0ea5e9';
  }
};

const calculatePosition = (angle: number, distance: number) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: 50 + distance * Math.cos(rad), y: 50 + distance * Math.sin(rad) };
};

const ringRadius = 10;
const rayLength = 21;

const nbaItems = [
  {
    rank: 1,
    id: 'M-01',
    title: '8–8,5 Std. schlafen',
    cluster: 'Erholung',
    clusterColor: '#0ea5e9',
    impact: 84,
    stars: 5,
    study: 'Schlafdauer & Gesundheit',
  },
  {
    rank: 2,
    id: 'M-14',
    title: '45 Min. Krafttraining',
    cluster: 'Kraft & Ausdauer',
    clusterColor: '#22c55e',
    impact: 78,
    stars: 4,
    study: 'Krafttraining & Mortalität',
  },
  {
    rank: 3,
    id: 'M-11',
    title: '8.000 Schritte gegangen',
    cluster: 'Kraft & Ausdauer',
    clusterColor: '#22c55e',
    impact: 79,
    stars: 4,
    study: 'Metaanalyse Gehen & Mortalität',
  },
];

const quickActivities = [
  { id: 'q1', icon: '🚶', label: 'Spazieren', stars: 1 },
  { id: 'q2', icon: '🏋️', label: 'Krafttraining', stars: 2 },
  { id: 'q3', icon: '🧘', label: 'Meditation', stars: 1 },
  { id: 'q4', icon: '💧', label: 'Wasser 2,5 L', stars: 1 },
  { id: 'q5', icon: '😴', label: '8h geschlafen', stars: 2 },
  { id: 'q6', icon: '🥗', label: 'Gemüse & Protein', stars: 1 },
];

const libraryMeasures = [
  { id: 'M-41', label: '10 Min. Atemübung', cluster: 'Balance & Entlastung', clusterColor: '#8b5cf6', baseStars: 3 },
  { id: 'M-05', label: '10 Min. Tageslicht am Morgen', cluster: 'Erholung', clusterColor: '#0ea5e9', baseStars: 4 },
  { id: 'M-46', label: '15 Min. meditiert', cluster: 'Resilienz', clusterColor: '#06b6d4', baseStars: 3 },
  { id: 'M-24', label: '2,5 Liter Wasser getrunken', cluster: 'Vitalität & Schutz', clusterColor: '#f59e0b', baseStars: 2 },
  { id: 'M-13', label: '25 Min. joggen', cluster: 'Kraft & Ausdauer', clusterColor: '#22c55e', baseStars: 4 },
  { id: 'M-34', label: '30 Min. sozialer Austausch', cluster: 'Selbstfürsorge', clusterColor: '#ec4899', baseStars: 3 },
  { id: 'M-14', label: '45 Min. Krafttraining', cluster: 'Kraft & Ausdauer', clusterColor: '#22c55e', baseStars: 4 },
  { id: 'M-25', label: '5 Portionen Gemüse + Obst', cluster: 'Vitalität & Schutz', clusterColor: '#f59e0b', baseStars: 4 },
  { id: 'M-11', label: '8.000 Schritte gegangen', cluster: 'Kraft & Ausdauer', clusterColor: '#22c55e', baseStars: 4 },
  { id: 'M-01', label: '8–8,5 Std. schlafen', cluster: 'Erholung', clusterColor: '#0ea5e9', baseStars: 5 },
];

const trendData = [
  { label: 'Erholung', unit: 'Pkt', color: '#0ea5e9', values: [70, 65, 72, 68, 78, 74], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '+6%', up: true },
  { label: 'Kraft & Ausdauer', unit: 'Pkt', color: '#22c55e', values: [65, 72, 58, 78, 75, 82], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '+26%', up: true },
  { label: 'Vitalität & Schutz', unit: 'Pkt', color: '#f59e0b', values: [58, 62, 55, 68, 72, 76], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '+31%', up: true },
  { label: 'Selbstfürsorge', unit: 'Pkt', color: '#ec4899', values: [45, 50, 48, 55, 62, 65], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '+44%', up: true },
  { label: 'Balance & Entlastung', unit: 'Pkt', color: '#8b5cf6', values: [80, 75, 60, 65, 55, 50], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '-37%', up: false },
  { label: 'Resilienz', unit: 'Pkt', color: '#06b6d4', values: [60, 65, 62, 70, 75, 72], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '+20%', up: true },
];

export default function VogelperspektivePage() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [loggedIds, setLoggedIds] = useState<string[]>(['q1', 'q4']);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [nutritionReady, setNutritionReady] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalStep, setModalStep] = useState<'search' | 'detail'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeasure, setSelectedMeasure] = useState<typeof libraryMeasures[0] | null>(null);
  const [intensity, setIntensity] = useState<'leicht' | 'mittel' | 'intensiv'>('mittel');
  const [durationMin, setDurationMin] = useState(30);
  const [isListening, setIsListening] = useState(false);
  const [customActivities, setCustomActivities] = useState<{ id: string; label: string; stars: number }[]>([]);
  const modalInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (showAddModal) setTimeout(() => modalInputRef.current?.focus(), 80);
  }, [showAddModal]);

  useEffect(() => {
    if (showNutritionModal) {
      setNutritionReady(false);
      const t = setTimeout(() => setNutritionReady(true), 1400);
      return () => clearTimeout(t);
    }
  }, [showNutritionModal]);

  const allActivities = [...quickActivities, ...customActivities];
  const loggedActivities = allActivities.filter(a => loggedIds.includes(a.id));

  const filteredMeasures = libraryMeasures.filter(m =>
    m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.cluster.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const earnedStars = selectedMeasure
    ? intensity === 'leicht' ? Math.max(1, selectedMeasure.baseStars - 1)
    : intensity === 'intensiv' ? Math.min(5, selectedMeasure.baseStars + 1)
    : selectedMeasure.baseStars
    : 0;

  const openModal = () => {
    setModalStep('search');
    setSearchQuery('');
    setSelectedMeasure(null);
    setIntensity('mittel');
    setDurationMin(30);
    setShowAddModal(true);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'de-DE';
    rec.interimResults = false;
    rec.onresult = (e: any) => { setSearchQuery(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
    if (!showAddModal) openModal();
  };

  const confirmLog = () => {
    if (!selectedMeasure) return;
    const id = `c${Date.now()}`;
    setCustomActivities(prev => [...prev, { id, label: selectedMeasure.label, stars: earnedStars }]);
    setLoggedIds(prev => [...prev, id]);
    setShowAddModal(false);
  };

  const todayStars = categories.reduce((sum, c) => sum + c.stars, 0);
  const maxStars = categories.reduce((sum, c) => sum + c.maxStars, 0);
  const loggedStars = loggedIds.reduce((sum, id) => {
    const a = quickActivities.find(x => x.id === id);
    return sum + (a?.stars || 0);
  }, 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Guten Morgen';
    if (h < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  const getCurrentDate = () =>
    new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const toggleLog = (id: string) =>
    setLoggedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="bird-view-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-gradient-orb bg-gradient-orb-1" />
        <div className="bg-gradient-orb bg-gradient-orb-2" />
        <div className="bg-gradient-orb bg-gradient-orb-3" />
      </div>

      {/* ── Compact Page Header ── */}
      <div className="page-header">
        <div className="ph-left">
          <span className="welcome-date-badge">{getCurrentDate()}</span>
          <h1 className="welcome-greeting">{getGreeting()}, <span className="user-name">Hendrik</span></h1>
        </div>
        <div className="ph-right">
          <div className="ph-stars-card">
            <div className="ph-stars-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#4498ca" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="ph-stars-value">{todayStars}<span className="ph-stars-max">/{maxStars}</span></span>
              <span className="ph-level-tag">Level 3</span>
            </div>
            <div className="ph-bar-track">
              <div className="ph-bar-fill" style={{ width: `${(todayStars / maxStars) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="main-grid">

        {/* ── LEFT COLUMN: Daily Successes + Trends ── */}
        <div className="left-col">
          <div className="daily-success-card">
            <h2 className="section-heading">Tagesbilanz</h2>
            <div className="ds-circles-grid">
              <div className="ds-circle-wrap">
                <svg viewBox="0 0 36 36" className="ds-circular-chart">
                  <path className="ds-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ds-circle" strokeDasharray="78, 100" stroke="#38bdf8" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="ds-percentage">78%</text>
                </svg>
                <div className="ds-label">SCHLAF &gt;</div>
              </div>
              <div className="ds-circle-wrap">
                <svg viewBox="0 0 36 36" className="ds-circular-chart">
                  <path className="ds-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ds-circle" strokeDasharray="75, 100" stroke="#22c55e" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="ds-percentage">75%</text>
                </svg>
                <div className="ds-label">ERHOLUNG &gt;</div>
              </div>
              <div className="ds-circle-wrap">
                <svg viewBox="0 0 36 36" className="ds-circular-chart">
                  <path className="ds-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="ds-circle" strokeDasharray="12, 100" stroke="#38bdf8" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="ds-percentage">12,5</text>
                </svg>
                <div className="ds-label">BELASTUNG &gt;</div>
              </div>
            </div>
          </div>

          {/* Trends Dashboard */}
          <div className="trends-card">
            <div className="trends-header">
              <h2 className="section-heading" style={{ margin: 0 }}>Trend-Analyse</h2>
              <span className="trends-period">Letzte 6 Wochen</span>
            </div>
            <div className="trends-grid">
              {trendData.map((td, ci) => {
                const W = 220, H = 74;
                const n = td.values.length;
                const minV = Math.min(...td.values) * 0.9;
                const maxV = Math.max(...td.values) * 1.05;
                const padL = 2, padR = 2, padT = 8, padB = 20;
                const cH = H - padT - padB;
                const xs = td.values.map((_, i) => padL + (i / (n - 1)) * (W - padL - padR));
                const ys = td.values.map(v => padT + cH - ((v - minV) / (maxV - minV)) * cH);
                let linePath = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
                for (let i = 1; i < n; i++) {
                  const cpx = ((xs[i - 1] + xs[i]) / 2).toFixed(1);
                  linePath += ` C ${cpx} ${ys[i-1].toFixed(1)}, ${cpx} ${ys[i].toFixed(1)}, ${xs[i].toFixed(1)} ${ys[i].toFixed(1)}`;
                }
                const areaPath = linePath + ` L ${xs[n-1].toFixed(1)} ${(H - padB).toFixed(1)} L ${xs[0].toFixed(1)} ${(H - padB).toFixed(1)} Z`;
                const gid = `tg${ci}`;
                return (
                  <div key={ci} className="tmc">
                    <div className="tmc-top">
                      <span className="tmc-label">{td.label}</span>
                      <span className="tmc-trend" style={{ color: td.up ? '#22c55e' : '#ef4444' }}>
                        {td.up ? '↑' : '↓'} {td.trend}
                      </span>
                    </div>
                    <div className="tmc-value" style={{ color: td.color }}>
                      {td.values[td.values.length - 1]}<span className="tmc-unit"> {td.unit}</span>
                    </div>
                    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
                      <defs>
                        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={td.color} stopOpacity="0.22"/>
                          <stop offset="100%" stopColor={td.color} stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill={`url(#${gid})`}/>
                      <path d={linePath} fill="none" stroke={td.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      {xs.map((x, i) => (
                        <text key={i} x={x.toFixed(1)} y={H - 4} textAnchor="middle" fontSize="8" fill="#64748b" fontFamily="inherit">
                          {td.weeks[i].replace('KW', '')}
                        </text>
                      ))}
                      <circle cx={xs[n-1].toFixed(1)} cy={ys[n-1].toFixed(1)} r="3.5" fill={td.color} stroke="white" strokeWidth="2"/>
                    </svg>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CENTER COLUMN: Avatar & Stars ── */}
        <div className="center-col">
          <div className="center-avatar-wrapper">
            <Image src="/images/woman3.png" alt="Profile" width={220} height={220} 
              style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', border: '4px solid #ffffff', display: 'block', boxShadow: '0 8px 25px rgba(0,0,0,0.08)' }} />
            <div className="center-stars-overlay">
              <div className="c-stars-row">
                {Array.from({ length: 12 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                    fill={i < 7 ? '#0ea5e9' : 'rgba(0,0,0,0.08)'}
                    style={{ filter: i < 7 ? 'drop-shadow(0 0 4px rgba(14,165,233,0.4))' : 'none' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="c-stars-text">7/12 Heute</span>
            </div>
          </div>

          <h2 className="center-title">Heutige Erfolge</h2>
          <div className="center-subtitle">Erreichte Meilensteine & Aktivitäten</div>
          <div className="center-measures-list">
            <div className="center-measure-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>10 Min. Atemübung</span>
            </div>
            <div className="center-measure-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>2,5 Liter Wasser getrunken</span>
            </div>
            <div className="center-measure-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>8.000 Schritte gegangen</span>
            </div>
            {loggedActivities.filter(a => !['q1', 'q4', 'M-41', 'M-24', 'M-11'].includes(a.id)).map(act => (
              <div key={act.id} className="center-measure-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#0ea5e9" style={{ flexShrink: 0 }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>{act.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Quick Tracker + Lisa Daily + NBA ── */}
        <div className="right-col">
          
          {/* Quick Tracker */}
          <div className="qt-card">
            <div className="qt-header">
              <h2 className="section-heading" style={{ margin: 0 }}>Aktivität eintragen</h2>
              <div className="qt-header-actions">
                <button className={`qt-mic-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="Spracheingabe">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                    <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                </button>
                <button className="qt-add-btn" onClick={openModal} title="Aktivität hinzufügen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="qt-activity-list" style={{ marginTop: '0.5rem' }}>
              <div className="qt-activity-row">
                <div className="qt-activity-dot" />
                <span className="qt-activity-label">Spazieren</span>
                <div className="qt-activity-stars">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <button className="qt-activity-remove"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="qt-activity-row">
                <div className="qt-activity-dot" />
                <span className="qt-activity-label">Wasser 2,5 L</span>
                <div className="qt-activity-stars">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <button className="qt-activity-remove"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="qt-activity-row">
                <div className="qt-activity-dot" />
                <span className="qt-activity-label">10 Min. Atemübung</span>
                <div className="qt-activity-stars">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <button className="qt-activity-remove"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
            </div>
          </div>

          {/* Lisa Daily */}
          <div className="lisa-card" style={{ marginTop: '0.5rem' }}>
            <div className="lisa-card-top">
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <video
                  src="/videos/lisa-avatar.mp4"
                  className="lisa-avatar-video"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="lisa-online-dot" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="lisa-name">Lisa Daily</div>
                <div className="lisa-quote">„Heute ist ein guter Tag für deinen Check-in."</div>
              </div>
              <div className="lisa-duration-badge">-5 Min</div>
            </div>
            <div className="lisa-actions">
              <button className="lisa-primary-btn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.4rem' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Tägliches Gespräch starten
              </button>
              <button className="lisa-secondary-btn">Wöchentlich →</button>
            </div>
          </div>

          {/* NBA Widget (Was diese Woche wichtig ist) */}
          <h2 className="section-heading" style={{ marginTop: '0.5rem', marginBottom: 0 }}>Wochen-Fokus</h2>
          <div className="nba-simple-list">
            {nbaItems.map(item => (
              <div key={item.id} className="qt-activity-row">
                <div className="qt-activity-dot" style={{ background: item.clusterColor }} />
                <span className="qt-activity-label">{item.title}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="mobile-dashboard">
        <div className="mob-header">
          <div className="mob-profile">
            <Image src="/images/woman3.png" alt="Profile" width={48} height={48}
              style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', border: '2px solid rgba(14,165,233,0.3)', display: 'block' }} />
            <div>
              <div className="mob-greeting">{getGreeting()}, <span className="mob-name">Hendrik</span></div>
              <div className="mob-date">{getCurrentDate()}</div>
            </div>
          </div>
          <div className="mob-stars-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            {todayStars}/{maxStars}
          </div>
        </div>
        <div className="mob-progress-wrap">
          <div className="mob-progress-track">
            <div className="mob-progress-fill" style={{ width: `${(todayStars / maxStars) * 100}%` }} />
          </div>
          <span className="mob-progress-label">{maxStars - todayStars === 0 ? 'Tagesziel erreicht' : `Noch ${maxStars - todayStars} Sterne bis Tagesziel`}</span>
        </div>
        <div className="lisa-card" style={{ marginBottom: '0.85rem' }}>
          <div className="lisa-card-top">
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <video
                src="/videos/lisa-avatar.mp4"
                className="lisa-avatar-video"
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="lisa-online-dot" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="lisa-name">Lisa Daily</div>
              <div className="lisa-quote">„Heute ist ein guter Tag für deinen Check-in."</div>
            </div>
          </div>
          <button className="lisa-primary-btn" style={{ marginTop: '0.6rem', width: '100%' }}>Gespräch starten</button>
        </div>
        <div className="mob-cat-grid">
          {categories.map(cat => {
            const statusColor = getStatusColor(cat.status);
            return (
              <div key={cat.id} className="mob-cat-card" style={{ '--mob-color': statusColor } as React.CSSProperties}>
                <div className="mob-cat-icon-wrap" style={{ background: `${statusColor}18` }}>
                  {getCategoryIcon(cat.id, statusColor)}
                </div>
                <div className="mob-cat-body">
                  <div className="mob-cat-title">{cat.title}</div>
                  <div className="mob-cat-sub">{cat.subtitle}</div>
                  <div className="mob-cat-stars">
                    {Array.from({ length: cat.maxStars }).map((_, i) => (
                      <svg key={i} width="10" height="10" viewBox="0 0 24 24"
                        fill={i < cat.stars ? '#0ea5e9' : 'rgba(0,0,0,0.06)'}
                        style={{ filter: i < cat.stars ? 'drop-shadow(0 0 2px rgba(14,165,233,0.3))' : 'none' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="mob-cat-status-dot" style={{ background: statusColor }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Add Activity Modal ── */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                {modalStep === 'detail' && (
                  <button className="modal-back-btn" onClick={() => setModalStep('search')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>
                )}
                <span className="modal-title">
                  {modalStep === 'search' ? 'Maßnahme wählen' : 'Intensität & Dauer'}
                </span>
              </div>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {modalStep === 'search' && (
              <>
                <div className="modal-input-row">
                  <input
                    ref={modalInputRef}
                    className="modal-input"
                    type="text"
                    placeholder="Maßnahme suchen…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Escape' && setShowAddModal(false)}
                  />
                  <button className={`modal-mic-btn ${isListening ? 'listening' : ''}`} onClick={startListening} title="Spracheingabe">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                    </svg>
                  </button>
                </div>
                {isListening && <p className="modal-listening-hint">Höre zu…</p>}
                <div className="modal-measure-list">
                  {filteredMeasures.map(m => (
                    <button key={m.id} className="modal-measure-item"
                      onClick={() => { setSelectedMeasure(m); setModalStep('detail'); }}>
                      <div className="modal-measure-body">
                        <span className="modal-measure-label">{m.label}</span>
                        <span className="modal-measure-cluster" style={{ color: m.clusterColor, background: `${m.clusterColor}14` }}>{m.cluster}</span>
                      </div>
                      <div className="modal-measure-stars">
                        {Array.from({ length: m.baseStars }).map((_, i) => (
                          <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#0ea5e9">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                    </button>
                  ))}
                  {filteredMeasures.length === 0 && (
                    <p className="modal-empty">Keine Maßnahme gefunden.</p>
                  )}
                </div>
              </>
            )}

            {modalStep === 'detail' && selectedMeasure && (
              <>
                <div className="modal-selected-card">
                  <span className="modal-selected-label">{selectedMeasure.label}</span>
                  <span className="modal-cluster-tag" style={{ color: selectedMeasure.clusterColor, background: `${selectedMeasure.clusterColor}14` }}>
                    {selectedMeasure.cluster}
                  </span>
                </div>

                <p className="modal-section-label">Intensität</p>
                <div className="modal-intensity-row">
                  {(['leicht', 'mittel', 'intensiv'] as const).map(lvl => (
                    <button key={lvl}
                      className={`modal-intensity-btn ${intensity === lvl ? 'active' : ''}`}
                      style={intensity === lvl ? { borderColor: selectedMeasure.clusterColor, color: selectedMeasure.clusterColor, background: `${selectedMeasure.clusterColor}12` } : {}}
                      onClick={() => setIntensity(lvl)}>
                      {lvl === 'leicht' ? 'Leicht' : lvl === 'mittel' ? 'Mittel' : 'Intensiv'}
                    </button>
                  ))}
                </div>

                <p className="modal-section-label">Dauer</p>
                <div className="modal-duration-row">
                  <input
                    className="modal-duration-input"
                    type="number" min="1" max="300"
                    value={durationMin}
                    onChange={e => setDurationMin(Math.max(1, Number(e.target.value)))}
                  />
                  <span className="modal-duration-unit">Min.</span>
                </div>

                <div className="modal-stars-preview">
                  <span className="modal-stars-preview-label">Du erhältst</span>
                  <div className="modal-stars-earned">
                    {Array.from({ length: earnedStars }).map((_, i) => (
                      <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#0ea5e9">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="modal-stars-text">{earnedStars} Stern{earnedStars !== 1 ? 'e' : ''}</span>
                </div>

                <div className="modal-actions">
                  <button className="modal-confirm-btn" onClick={confirmLog}>Eintragen</button>
                  <button className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Abbrechen</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Nutrition Tracker Modal ── */}
      {showNutritionModal && (
        <div className="modal-backdrop" onClick={() => setShowNutritionModal(false)}>
          <div className="modal-card nutr-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <span className="modal-title">Nutrition Tracker</span>
              </div>
              <button className="modal-close" onClick={() => setShowNutritionModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {!nutritionReady ? (
              <div className="nutr-loading">
                <div className="nutr-spinner" />
                <p className="nutr-loading-text">Analysiere deine Ernährung…</p>
              </div>
            ) : (
              <div className="nutr-content">
                <div className="nutr-kcal-row">
                  <div className="nutr-kcal-main">
                    <span className="nutr-kcal-val">1 842</span>
                    <span className="nutr-kcal-unit">kcal</span>
                  </div>
                  <div className="nutr-kcal-meta">
                    <span className="nutr-kcal-label">von 2 200 kcal Ziel</span>
                    <div className="nutr-kcal-bar-track">
                      <div className="nutr-kcal-bar-fill" style={{ width: '84%' }} />
                    </div>
                  </div>
                </div>

                <div className="nutr-macro-grid">
                  {[
                    { label: 'Protein', val: 142, unit: 'g', goal: 160, color: '#4498ca', pct: 89 },
                    { label: 'Kohlenhydrate', val: 198, unit: 'g', goal: 250, color: '#22c55e', pct: 79 },
                    { label: 'Fette', val: 68, unit: 'g', goal: 80, color: '#f59e0b', pct: 85 },
                    { label: 'Ballaststoffe', val: 22, unit: 'g', goal: 30, color: '#8b5cf6', pct: 73 },
                  ].map(m => (
                    <div key={m.label} className="nutr-macro-card">
                      <div className="nutr-macro-top">
                        <span className="nutr-macro-label">{m.label}</span>
                        <span className="nutr-macro-pct" style={{ color: m.color }}>{m.pct}%</span>
                      </div>
                      <div className="nutr-macro-val">{m.val}<span className="nutr-macro-unit"> {m.unit}</span></div>
                      <div className="nutr-macro-track">
                        <div className="nutr-macro-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                      </div>
                      <div className="nutr-macro-goal">Ziel: {m.goal} {m.unit}</div>
                    </div>
                  ))}
                </div>

                <div className="nutr-micro-row">
                  {[
                    { label: 'Vitamin D', val: '12 µg', ok: true },
                    { label: 'Omega-3', val: '1,2 g', ok: true },
                    { label: 'Magnesium', val: '280 mg', ok: false },
                    { label: 'Zink', val: '9 mg', ok: true },
                  ].map(m => (
                    <div key={m.label} className={`nutr-micro-chip ${m.ok ? 'ok' : 'warn'}`}>
                      <span className="nutr-micro-dot" style={{ background: m.ok ? '#22c55e' : '#f59e0b' }} />
                      <span className="nutr-micro-label">{m.label}</span>
                      <span className="nutr-micro-val">{m.val}</span>
                    </div>
                  ))}
                </div>

                <button className="nutr-log-btn" onClick={() => setShowNutritionModal(false)}>
                  Mahlzeit eintragen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* =============== ULTIMATE PREMIUM AESTHETIC (LIGHT MODE) =============== */
        .bird-view-container {
          width: 100%; min-height: calc(100vh - 80px);
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #0f172a;
          position: relative; overflow-x: hidden; display: flex; flex-direction: column;
          padding: 2rem 2.5rem 3rem;
          font-family: 'DM Sans', 'Inter', sans-serif;
        }

        /* Animated Background Orbs for Premium feel */
        .animated-background { display: block; position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
        .bg-gradient-orb { position: absolute; filter: blur(120px); border-radius: 50%; opacity: 0.6; }
        .bg-gradient-orb-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(224,242,254,1) 0%, transparent 70%); }
        .bg-gradient-orb-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: radial-gradient(circle, rgba(240,253,244,1) 0%, transparent 70%); }
        .bg-gradient-orb-3 { top: 40%; left: 30%; width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(236,254,255,0.8) 0%, transparent 70%); }

        /* ── Page Header ── */
        .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2.5rem; z-index: 10; position: relative; gap: 1rem; }
        .ph-left { display: flex; flex-direction: column; gap: 0.3rem; }
        .welcome-date-badge { display: inline-block; font-size: 0.7rem; color: #64748b; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
        .welcome-greeting { font-size: 2.2rem; font-weight: 300; color: #0f172a; margin: 0; letter-spacing: -0.02em; line-height: 1.2; }
        .user-name { font-weight: 600; color: #0284c7; }
        .ph-right { flex-shrink: 0; }
        .ph-stars-card {
          background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(12px); border-radius: 16px; padding: 0.8rem 1.2rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1);
          min-width: 180px; position: relative; overflow: hidden;
        }
        .ph-stars-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.6rem; }
        .ph-stars-value { font-size: 1.4rem; font-weight: 600; color: #0f172a; line-height: 1; text-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .ph-stars-max { font-size: 0.85rem; font-weight: 400; color: #64748b; }
        .ph-level-tag { margin-left: auto; font-size: 0.65rem; font-weight: 700; color: #0284c7; background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(56,189,248,0.02)); border: 1px solid rgba(56,189,248,0.2); border-radius: 6px; padding: 0.2rem 0.5rem; box-shadow: 0 2px 8px rgba(56,189,248,0.1); }
        .ph-bar-track { height: 4px; background: rgba(0,0,0,0.05); border-radius: 2px; overflow: hidden; }
        .ph-bar-fill { height: 100%; background: linear-gradient(90deg, #0284c7, #22c55e); border-radius: 2px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px rgba(2, 132, 199, 0.3); }

        /* ── Main 3-column grid ── */
        .main-grid { display: grid; grid-template-columns: 1fr 380px 1fr; gap: 2rem; z-index: 5; position: relative; align-items: start; }
        .left-col, .right-col { display: flex; flex-direction: column; gap: 1.5rem; }
        .center-col { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem 0; position: relative; }

        /* Cards Base */
        .daily-success-card, .trends-card, .lisa-card, .qt-card {
          background: rgba(255, 255, 255, 0.85); border-radius: 20px; padding: 1.8rem;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 12px 35px -12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1);
          backdrop-filter: blur(20px); transition: transform 0.3s, box-shadow 0.3s;
        }
        .daily-success-card:hover, .trends-card:hover, .lisa-card:hover, .qt-card:hover {
          box-shadow: 0 16px 40px -12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,1); transform: translateY(-2px);
        }

        .section-heading { font-size: 1.1rem; font-weight: 600; color: #0f172a; margin-bottom: 1.5rem; letter-spacing: 0.02em; display: flex; align-items: center; gap: 0.6rem; }
        .section-heading::before { content: ''; display: block; width: 4px; height: 16px; background: linear-gradient(180deg, #0ea5e9, #0284c7); border-radius: 4px; box-shadow: 0 0 8px rgba(14, 165, 233, 0.4); }
        
        /* ── Daily Successes ── */
        .ds-circles-grid { display: flex; justify-content: space-between; gap: 1.5rem; }
        .ds-circle-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; flex: 1; }
        .ds-circular-chart { display: block; margin: 0 auto; max-width: 95px; max-height: 95px; width: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.06)); }
        .ds-circle-bg { fill: none; stroke: rgba(0,0,0,0.04); stroke-width: 3.5; }
        .ds-circle { fill: none; stroke-width: 3.5; stroke-linecap: round; animation: progress 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; filter: drop-shadow(0 0 3px currentColor); }
        .ds-percentage { fill: #0f172a; font-family: inherit; font-size: 0.65em; text-anchor: middle; font-weight: 600; letter-spacing: -0.02em; }
        .ds-label { font-size: 0.65rem; font-weight: 600; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; }
        @keyframes progress { 0% { stroke-dasharray: 0 100; } }

        /* ── Center Column ── */
        .center-avatar-wrapper { position: relative; width: 260px; height: 260px; margin-bottom: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .center-avatar-wrapper::before { content:''; position:absolute; inset: -20px; border-radius: 50%; background: radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%); }
        .center-stars-overlay {
          position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 0.6rem 1.5rem;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1); border: 1px solid rgba(0,0,0,0.05);
          backdrop-filter: blur(16px);
          display: flex; flex-direction: column; align-items: center; gap: 0.3rem; white-space: nowrap; z-index: 10;
        }
        .c-stars-row { display: flex; gap: 4px; }
        .c-stars-text { font-size: 0.75rem; font-weight: 600; color: #334155; letter-spacing: 0.05em; margin-top: 0.2rem; }
        .center-title { font-size: 1.5rem; font-weight: 500; color: #0f172a; margin-bottom: 0.35rem; text-align: center; letter-spacing: 0.01em; }
        .center-subtitle { font-size: 0.95rem; font-weight: 400; color: #64748b; text-align: center; margin-bottom: 2rem; }
        .center-measures-list { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 340px; }
        .center-measure-item {
          font-size: 0.95rem; font-weight: 500; color: #334155;
          padding: 0.85rem 1.1rem; border-radius: 12px; background: rgba(255,255,255,0.7);
          border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 0.85rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03); backdrop-filter: blur(8px);
          transition: transform 0.2s, background 0.2s; cursor: default;
        }
        .center-measure-item:hover { transform: translateY(-2px); background: #ffffff; border-color: rgba(0,0,0,0.08); box-shadow: 0 6px 14px rgba(0,0,0,0.05); }
        
        .nba-simple-list { display: flex; flex-direction: column; gap: 0.6rem; }

        /* ── RIGHT COLUMN CARDS ── */
        .lisa-avatar-video {
          width: 56px; height: 56px; border-radius: 50%;
          object-fit: cover; display: block;
          border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .lisa-card-top { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.2rem; }
        .lisa-online-dot { position: absolute; bottom: 2px; right: 2px; width: 12px; height: 12px; border-radius: 50%; background: #22c55e; border: 2px solid #ffffff; box-shadow: 0 0 6px rgba(34,197,94,0.4); }
        .lisa-name { font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 0.2rem; }
        .lisa-quote { font-size: 0.75rem; color: #64748b; line-height: 1.4; font-style: italic; }
        .lisa-duration-badge { background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.2); border-radius: 8px; padding: 0.25rem 0.6rem; font-size: 0.7rem; font-weight: 600; color: #0284c7; white-space: nowrap; flex-shrink: 0; }
        .lisa-actions { display: flex; gap: 0.75rem; }
        .lisa-primary-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 0.7rem 1rem; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white;
          font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
        }
        .lisa-primary-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35); }
        .lisa-secondary-btn { padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08); background: #ffffff; color: #334155; font-size: 0.85rem; font-weight: 500; cursor: pointer; white-space: nowrap; transition: background 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .lisa-secondary-btn:hover { background: #f8fafc; }

        /* Deine Aktivitäten */
        .qt-card { display: flex; flex-direction: column; gap: 0.75rem; padding-bottom: 1.25rem; }
        .qt-header { display: flex; align-items: center; justify-content: space-between; }
        .qt-header-actions { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
        .qt-mic-btn, .qt-add-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08);
          background: #ffffff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }
        .qt-mic-btn:hover { background: #f8fafc; color: #0f172a; border-color: rgba(0,0,0,0.12); }
        .qt-add-btn { background: #0284c7; border-color: #0284c7; color: white; }
        .qt-add-btn:hover { background: #0369a1; border-color: #0369a1; }
        .qt-mic-btn.listening { border-color: #ef4444; color: #ef4444; animation: micPulse 1s ease-in-out infinite; }
        @keyframes micPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); } 50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); } }
        .qt-activity-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .qt-activity-row {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 0.8rem; border-radius: 10px;
          background: #ffffff; border: 1px solid rgba(0,0,0,0.04); transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .qt-activity-row:hover { background: #f8fafc; border-color: rgba(0,0,0,0.08); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .qt-activity-dot { width: 8px; height: 8px; border-radius: 50%; background: #0ea5e9; flex-shrink: 0; box-shadow: 0 0 6px rgba(14,165,233,0.4); }
        .qt-activity-label { flex: 1; font-size: 0.85rem; font-weight: 500; color: #334155; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .qt-activity-stars { display: flex; gap: 2px; flex-shrink: 0; }
        .qt-activity-remove {
          width: 24px; height: 24px; border-radius: 6px; border: none; background: transparent;
          color: #94a3b8; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: all 0.2s; padding: 0;
        }
        .qt-activity-remove:hover { background: rgba(239,68,68,0.1); color: #ef4444; }

        /* Modal */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-card {
          background: rgba(255, 255, 255, 0.98); border-radius: 24px; padding: 1.5rem 1.8rem;
          width: 100%; max-width: 440px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,1);
          border: 1px solid rgba(0,0,0,0.08);
          color: #0f172a; backdrop-filter: blur(20px);
        }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.2rem; }
        .modal-header-left { display: flex; align-items: center; gap: 0.5rem; }
        .modal-back-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); background: #ffffff; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .modal-back-btn:hover { background: #f1f5f9; color: #0f172a; }
        .modal-title { font-size: 1.05rem; font-weight: 600; color: #0f172a; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s, color 0.2s; flex-shrink: 0; }
        .modal-close:hover { background: #e2e8f0; color: #0f172a; }

        /* Step 1: search */
        .modal-input-row { display: flex; gap: 0.5rem; margin-bottom: 0.8rem; }
        .modal-input {
          flex: 1; padding: 0.7rem 1rem; border-radius: 10px;
          background: #f8fafc; border: 1px solid rgba(0,0,0,0.08);
          font-size: 0.95rem; color: #0f172a;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s; font-family: inherit;
        }
        .modal-input:focus { border-color: #0ea5e9; background: #ffffff; box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }
        .modal-input::placeholder { color: #94a3b8; }
        .modal-mic-btn {
          width: 44px; height: 44px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08);
          background: #ffffff; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; flex-shrink: 0; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .modal-mic-btn:hover { border-color: rgba(0,0,0,0.15); color: #0f172a; background: #f8fafc; }
        .modal-listening-hint { font-size: 0.75rem; color: #ef4444; margin: 0 0 0.8rem; font-weight: 500; }
        .modal-measure-list { display: flex; flex-direction: column; gap: 0.4rem; max-height: 280px; overflow-y: auto; padding-right: 0.2rem; }
        .modal-measure-list::-webkit-scrollbar { width: 6px; }
        .modal-measure-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
        .modal-measure-item {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.05);
          background: #ffffff; cursor: pointer; text-align: left; transition: all 0.2s;
          gap: 0.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .modal-measure-item:hover { background: #f8fafc; border-color: rgba(0,0,0,0.1); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .modal-measure-body { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; min-width: 0; }
        .modal-measure-label { font-size: 0.9rem; font-weight: 500; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .modal-measure-cluster { font-size: 0.65rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 6px; width: fit-content; text-transform: uppercase; letter-spacing: 0.05em; }
        .modal-empty { font-size: 0.85rem; color: #64748b; text-align: center; padding: 1.5rem 0; margin: 0; }

        /* Step 2: detail */
        .modal-selected-card {
          display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
          background: #f8fafc; border-radius: 12px; padding: 0.8rem 1rem;
          border: 1px solid rgba(0,0,0,0.05); margin-bottom: 1.5rem;
        }
        .modal-selected-label { font-size: 0.95rem; font-weight: 500; color: #0f172a; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .modal-cluster-tag { font-size: 0.65rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 6px; white-space: nowrap; flex-shrink: 0; text-transform: uppercase; }
        .modal-section-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 0.6rem; }
        .modal-intensity-row { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        .modal-intensity-btn {
          flex: 1; padding: 0.6rem 0; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08);
          background: #ffffff; font-size: 0.85rem; font-weight: 500; color: #64748b;
          cursor: pointer; transition: all 0.2s; font-family: inherit; box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .modal-intensity-btn:hover { background: #f8fafc; color: #0f172a; }
        .modal-duration-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
        .modal-duration-input {
          width: 90px; padding: 0.6rem; border-radius: 10px;
          background: #ffffff; border: 1px solid rgba(0,0,0,0.1); font-size: 1rem; font-weight: 600; color: #0f172a;
          outline: none; text-align: center; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s;
        }
        .modal-duration-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 3px rgba(14,165,233,0.15); }
        .modal-duration-unit { font-size: 0.95rem; color: #64748b; font-weight: 500; }
        .modal-stars-preview {
          display: flex; align-items: center; justify-content: center; flex-direction: column;
          gap: 0.5rem; background: linear-gradient(135deg, rgba(14,165,233,0.05), rgba(2,132,199,0.02)); border-radius: 12px;
          padding: 1.2rem; margin-bottom: 1.5rem; border: 1px solid rgba(14,165,233,0.15);
        }
        .modal-stars-preview-label { font-size: 0.75rem; color: #0284c7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .modal-stars-earned { display: flex; gap: 0.35rem; }
        .modal-stars-text { font-size: 0.9rem; font-weight: 600; color: #0369a1; margin-top: 0.2rem; }
        .modal-actions { display: flex; gap: 0.75rem; }
        .modal-confirm-btn {
          flex: 1; padding: 0.7rem 1rem; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; font-size: 0.9rem; font-weight: 600;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; font-family: inherit;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
        }
        .modal-confirm-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35); }
        .modal-cancel-btn { padding: 0.7rem 1rem; border-radius: 10px; border: 1px solid rgba(0,0,0,0.08); background: #ffffff; color: #64748b; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: background 0.2s; font-family: inherit; box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .modal-cancel-btn:hover { background: #f8fafc; color: #0f172a; }

        /* Nutrition Modal */
        .nutr-modal { max-width: 480px; }
        .nutr-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.2rem; padding: 3rem 1rem; }
        .nutr-spinner { width: 44px; height: 44px; border-radius: 50%; border: 3px solid rgba(0,0,0,0.05); border-top-color: #0ea5e9; animation: spin 0.8s linear infinite; }
        .nutr-loading-text { font-size: 0.9rem; color: #64748b; font-weight: 500; margin: 0; }
        .nutr-content { display: flex; flex-direction: column; gap: 1.25rem; }
        .nutr-kcal-row { display: flex; align-items: center; gap: 1.2rem; background: #ffffff; border-radius: 16px; padding: 1.2rem 1.5rem; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
        .nutr-kcal-main { display: flex; align-items: baseline; gap: 0.4rem; flex-shrink: 0; }
        .nutr-kcal-val { font-size: 2.2rem; font-weight: 400; color: #0f172a; line-height: 1; letter-spacing: -0.02em; }
        .nutr-kcal-unit { font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .nutr-kcal-meta { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .nutr-kcal-label { font-size: 0.75rem; color: #64748b; font-weight: 500; letter-spacing: 0.02em; }
        .nutr-kcal-bar-track { height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden; }
        .nutr-kcal-bar-fill { height: 100%; background: linear-gradient(90deg, #0ea5e9, #22c55e); border-radius: 3px; animation: growBar 1s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px rgba(34,197,94,0.3); }
        .nutr-macro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        .nutr-macro-card { background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; padding: 0.85rem 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .nutr-macro-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem; }
        .nutr-macro-label { font-size: 0.7rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .nutr-macro-pct { font-size: 0.75rem; font-weight: 700; text-shadow: 0 0 4px rgba(255,255,255,0.8); }
        .nutr-macro-val { font-size: 1.3rem; font-weight: 600; color: #0f172a; margin-bottom: 0.5rem; }
        .nutr-macro-unit { font-size: 0.75rem; font-weight: 500; color: #64748b; }
        .nutr-macro-track { height: 4px; background: rgba(0,0,0,0.05); border-radius: 2px; overflow: hidden; margin-bottom: 0.4rem; }
        .nutr-macro-fill { height: 100%; border-radius: 2px; animation: growBar 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .nutr-macro-goal { font-size: 0.65rem; color: #64748b; }
        .nutr-micro-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .nutr-micro-chip { display: flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.75rem; border-radius: 8px; font-size: 0.75rem; background: #ffffff; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .nutr-micro-chip.ok { background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.15); }
        .nutr-micro-chip.warn { background: rgba(245,158,11,0.05); border-color: rgba(245,158,11,0.15); }
        .nutr-micro-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 4px currentColor; }
        .nutr-micro-label { font-weight: 500; color: #334155; }
        .nutr-micro-val { color: #64748b; font-weight: 500; }
        .nutr-log-btn { width: 100%; padding: 0.8rem; border-radius: 12px; border: none; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; font-family: inherit; box-shadow: 0 4px 15px rgba(2,132,199,0.25); }
        .nutr-log-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(2,132,199,0.35); }

        /* Trends */
        .trends-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .trends-title-row { display: flex; align-items: center; gap: 0.4rem; }
        .trends-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .trends-period { font-size: 0.75rem; color: #64748b; font-weight: 500; }
        .trends-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .tmc { background: #ffffff; border-radius: 12px; padding: 1rem 1rem 0.5rem; border: 1px solid rgba(0,0,0,0.05); overflow: hidden; transition: background 0.2s, box-shadow 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .tmc:hover { background: #f8fafc; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
        .tmc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; }
        .tmc-label { font-size: 0.7rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .tmc-trend { font-size: 0.75rem; font-weight: 600; }
        .tmc-value { font-size: 1.5rem; font-weight: 500; line-height: 1; margin-bottom: 0.8rem; letter-spacing: -0.02em; color: #0f172a; }
        .tmc-unit { font-size: 0.8rem; font-weight: 500; color: #64748b; }

        /* Mobile layout */
        .mobile-dashboard { display: none; }
        .mob-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .mob-profile { display: flex; align-items: center; gap: 0.85rem; }
        .mob-greeting { font-size: 1.15rem; font-weight: 500; color: #0f172a; }
        .mob-name { color: #0284c7; font-weight: 600; }
        .mob-date { font-size: 0.7rem; color: #64748b; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }
        .mob-stars-pill { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem; border-radius: 8px; background: rgba(2,132,199,0.1); border: 1px solid rgba(2,132,199,0.15); font-size: 0.85rem; font-weight: 600; color: #0284c7; box-shadow: 0 2px 8px rgba(2,132,199,0.1); }
        .mob-progress-wrap { margin-bottom: 1.5rem; background: #ffffff; padding: 1rem; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .mob-progress-track { width: 100%; height: 6px; background: rgba(0,0,0,0.05); border-radius: 3px; overflow: hidden; margin-bottom: 0.6rem; }
        .mob-progress-fill { height: 100%; background: linear-gradient(90deg, #0ea5e9, #22c55e); border-radius: 3px; transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 8px rgba(34,197,94,0.3); }
        .mob-progress-label { font-size: 0.75rem; color: #64748b; font-weight: 600; }
        .mob-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1.5rem; }
        .mob-cat-card {
          display: flex; align-items: center; gap: 0.75rem;
          background: #ffffff; border-radius: 12px; padding: 0.85rem 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04); position: relative;
          border: 1px solid rgba(0,0,0,0.04);
        }
        .mob-cat-icon-wrap { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
        .mob-cat-body { flex: 1; min-width: 0; }
        .mob-cat-title { font-size: 0.8rem; font-weight: 600; color: #0f172a; line-height: 1.2; }
        .mob-cat-sub { font-size: 0.65rem; color: #64748b; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
        .mob-cat-stars { display: flex; gap: 3px; margin-top: 6px; }
        .mob-cat-status-dot { position: absolute; top: 0.6rem; right: 0.6rem; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 4px currentColor; }

        @media (max-width: 1250px) {
          .main-grid { grid-template-columns: 1fr 340px 1fr; gap: 1.5rem; }
        }
        @media (max-width: 1024px) {
          .main-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .center-col { grid-column: span 2; order: -1; padding-top: 0; }
          .center-avatar-wrapper { width: 220px; height: 220px; margin-bottom: 2rem; }
        }
        @media (max-width: 850px) {
          .main-grid { grid-template-columns: 1fr; }
          .center-col { grid-column: span 1; }
        }
        @media (max-width: 600px) {
          .bird-view-container { padding: 1.5rem 1rem 2rem; background: #f8fafc; }
          .main-grid { display: none; }
          .mobile-dashboard { display: block; }
          .page-header { display: none; }
        }
      `}</style>
    </div>
  );
}
