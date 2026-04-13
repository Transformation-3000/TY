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
    default: return '#4498ca';
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
    clusterColor: '#4498ca',
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
  { id: 'M-05', label: '10 Min. Tageslicht am Morgen', cluster: 'Erholung', clusterColor: '#4498ca', baseStars: 4 },
  { id: 'M-46', label: '15 Min. meditiert', cluster: 'Resilienz', clusterColor: '#06b6d4', baseStars: 3 },
  { id: 'M-24', label: '2,5 Liter Wasser getrunken', cluster: 'Vitalität & Schutz', clusterColor: '#f59e0b', baseStars: 2 },
  { id: 'M-13', label: '25 Min. joggen', cluster: 'Kraft & Ausdauer', clusterColor: '#22c55e', baseStars: 4 },
  { id: 'M-34', label: '30 Min. sozialer Austausch', cluster: 'Selbstfürsorge', clusterColor: '#ec4899', baseStars: 3 },
  { id: 'M-14', label: '45 Min. Krafttraining', cluster: 'Kraft & Ausdauer', clusterColor: '#22c55e', baseStars: 4 },
  { id: 'M-25', label: '5 Portionen Gemüse + Obst', cluster: 'Vitalität & Schutz', clusterColor: '#f59e0b', baseStars: 4 },
  { id: 'M-11', label: '8.000 Schritte gegangen', cluster: 'Kraft & Ausdauer', clusterColor: '#22c55e', baseStars: 4 },
  { id: 'M-01', label: '8–8,5 Std. schlafen', cluster: 'Erholung', clusterColor: '#4498ca', baseStars: 5 },
];

const trendData = [
  { label: 'Erholung', unit: 'Pkt', color: '#4498ca', values: [70, 65, 72, 68, 78, 74], weeks: ['KW8','KW9','KW10','KW11','KW12','KW13'], trend: '+6%', up: true },
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
                  <path className="ds-circle" strokeDasharray="78, 100" stroke="#4498ca" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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
                  <path className="ds-circle" strokeDasharray="12, 100" stroke="#4498ca" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
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
                        <text key={i} x={x.toFixed(1)} y={H - 4} textAnchor="middle" fontSize="8" fill="#cbd5e1" fontFamily="inherit">
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
              style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', border: '6px solid white', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', display: 'block' }} />
            <div className="center-stars-overlay">
              <div className="c-stars-row">
                {Array.from({ length: 12 }).map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                    fill={i < 7 ? '#4498ca' : '#e2e8f0'}
                    style={{ filter: i < 7 ? 'drop-shadow(0 0 4px rgba(68,152,202,0.8))' : 'none' }}>
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#4498ca" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>10 Min. Atemübung</span>
            </div>
            <div className="center-measure-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#4498ca" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>2,5 Liter Wasser getrunken</span>
            </div>
            <div className="center-measure-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#4498ca" style={{ flexShrink: 0 }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>8.000 Schritte gegangen</span>
            </div>
            {loggedActivities.filter(a => !['q1', 'q4', 'M-41', 'M-24', 'M-11'].includes(a.id)).map(act => (
              <div key={act.id} className="center-measure-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#4498ca" style={{ flexShrink: 0 }}>
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
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#4498ca"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <button className="qt-activity-remove"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="qt-activity-row">
                <div className="qt-activity-dot" />
                <span className="qt-activity-label">Wasser 2,5 L</span>
                <div className="qt-activity-stars">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#4498ca"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
                <button className="qt-activity-remove"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
              </div>
              <div className="qt-activity-row">
                <div className="qt-activity-dot" />
                <span className="qt-activity-label">10 Min. Atemübung</span>
                <div className="qt-activity-stars">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#4498ca"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#4498ca"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
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
              style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 15%', border: '2.5px solid rgba(68,152,202,0.4)', display: 'block' }} />
            <div>
              <div className="mob-greeting">{getGreeting()}, <span className="mob-name">Hendrik</span></div>
              <div className="mob-date">{getCurrentDate()}</div>
            </div>
          </div>
          <div className="mob-stars-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#4498ca"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
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
                        fill={i < cat.stars ? '#4498ca' : '#e2e8f0'}
                        style={{ filter: i < cat.stars ? 'drop-shadow(0 0 2px rgba(68,152,202,0.6))' : 'none' }}>
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
                          <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#4498ca">
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
                      <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#4498ca">
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
        .bird-view-container {
          width: 100%; min-height: calc(100vh - 80px);
          background: #f8fafc;
          position: relative; overflow-x: hidden; display: flex; flex-direction: column;
          padding: 1.5rem 1.75rem 2.5rem;
        }
        .animated-background { display: none; }

        /* ── Page Header ── */
        .page-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem; z-index: 10; position: relative; gap: 1rem;
        }
        .ph-left { display: flex; flex-direction: column; gap: 0.18rem; }
        .welcome-date-badge {
          display: inline-block; font-size: 0.63rem; color: #94a3b8;
          font-weight: 500; letter-spacing: 0.02em;
        }
        .welcome-greeting { font-size: 1.65rem; font-weight: 300; color: #334155; margin: 0; letter-spacing: -0.01em; line-height: 1.2; }
        .user-name { font-weight: 700; color: #1e293b; }
        .ph-right { flex-shrink: 0; }
        .ph-stars-card {
          background: white; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 0.6rem 0.9rem 0.65rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05); min-width: 160px;
        }
        .ph-stars-row { display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.45rem; }
        .ph-stars-value { font-size: 1.1rem; font-weight: 700; color: #1e293b; line-height: 1; }
        .ph-stars-max { font-size: 0.75rem; font-weight: 400; color: #94a3b8; }
        .ph-level-tag { margin-left: auto; font-size: 0.6rem; font-weight: 700; color: #4498ca; background: #eff8ff; border: 1px solid #bae6fd; border-radius: 4px; padding: 0.1rem 0.4rem; }
        .ph-bar-track { height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
        .ph-bar-fill { height: 100%; background: linear-gradient(90deg, #4498ca, #22c55e); border-radius: 2px; transition: width 0.6s ease; }

        /* ── Main 3-column grid ── */
        .main-grid {
          display: grid; grid-template-columns: 1fr 340px 1fr; gap: 1.5rem;
          z-index: 5; position: relative; align-items: start;
        }
        .left-col { display: flex; flex-direction: column; gap: 1.25rem; background: #e2e8f015; padding: 1.25rem; border-radius: 20px; }
        .center-col { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.5rem 0; }
        .right-col { display: flex; flex-direction: column; gap: 1.25rem; background: #e2e8f015; padding: 1.25rem; border-radius: 20px; }

        /* ── Daily Successes ── */
        .section-heading { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 1.2rem; letter-spacing: -0.01em; display: flex; align-items: center; gap: 0.5rem; }
        .section-heading::before { content: ''; display: block; width: 4px; height: 16px; background: #4498ca; border-radius: 4px; }
        
        .daily-success-card {
          background: white; border-radius: 16px; padding: 1.6rem 1.5rem;
          border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .daily-success-card .section-heading { color: #0f172a; margin-bottom: 1.5rem; }
        .ds-circles-grid { display: flex; justify-content: space-between; gap: 1rem; }
        .ds-circle-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.85rem; flex: 1; }
        .ds-circular-chart { display: block; margin: 0 auto; max-width: 90px; max-height: 90px; width: 100%; }
        .ds-circle-bg { fill: none; stroke: #f1f5f9; stroke-width: 3.5; }
        .ds-circle { fill: none; stroke-width: 3.5; stroke-linecap: round; animation: progress 1s ease-out forwards; }
        .ds-percentage { fill: #1e293b; font-family: inherit; font-size: 0.65em; text-anchor: middle; font-weight: 800; }
        .ds-label { font-size: 0.65rem; font-weight: 700; color: #64748b; letter-spacing: 0.05em; text-transform: uppercase; }
        @keyframes progress { 0% { stroke-dasharray: 0 100; } }

        /* ── Center Column ── */
        .center-avatar-wrapper { position: relative; width: 220px; height: 220px; margin-bottom: 2rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .center-stars-overlay {
          position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%);
          background: white; border-radius: 20px; padding: 0.5rem 1.25rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.08); border: 1px solid #f1f5f9;
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem; white-space: nowrap; z-index: 10;
        }
        .c-stars-row { display: flex; gap: 3px; }
        .c-stars-text { font-size: 0.7rem; font-weight: 800; color: #4498ca; }
        .center-title { font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem; text-align: center; letter-spacing: -0.02em; }
        .center-subtitle { font-size: 0.9rem; font-weight: 500; color: #64748b; text-align: center; margin-bottom: 1.5rem; }
        .center-measures-list { display: flex; flex-direction: column; gap: 0.6rem; width: 100%; max-width: 320px; }
        .center-measure-item {
          font-size: 0.9rem; font-weight: 600; color: #334155;
          padding: 0.75rem 1rem; border-radius: 12px; background: white;
          border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .center-measure-item:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
        
        .nba-simple-list { display: flex; flex-direction: column; gap: 0.5rem; }

        /* ── RIGHT COLUMN CARDS ── */
        .lisa-card {
          background: white; border-radius: 16px; padding: 1.25rem;
          border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .lisa-avatar-video {
          width: 52px; height: 52px; border-radius: 50%;
          object-fit: cover; display: block;
          border: 2px solid #e2e8f0;
        }
        .lisa-card-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .lisa-online-dot { position: absolute; bottom: 1px; right: 1px; width: 9px; height: 9px; border-radius: 50%; background: #22c55e; border: 2px solid white; }
        .lisa-name { font-size: 0.82rem; font-weight: 600; color: #1e293b; margin-bottom: 0.12rem; }
        .lisa-quote { font-size: 0.7rem; color: #64748b; line-height: 1.4; }
        .lisa-duration-badge { background: #f1f5f9; border-radius: 6px; padding: 0.2rem 0.5rem; font-size: 0.63rem; font-weight: 600; color: #64748b; white-space: nowrap; flex-shrink: 0; }
        .lisa-actions { display: flex; gap: 0.5rem; }
        .lisa-primary-btn {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 0.5rem 0.85rem; border-radius: 8px; border: none;
          background: #4498ca; color: white;
          font-size: 0.76rem; font-weight: 600; cursor: pointer; transition: background 0.15s;
        }
        .lisa-primary-btn:hover { background: #3585b8; }
        .lisa-secondary-btn { padding: 0.5rem 0.85rem; border-radius: 8px; border: 1px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.74rem; font-weight: 500; cursor: pointer; white-space: nowrap; transition: border-color 0.15s; }
        .lisa-secondary-btn:hover { border-color: #cbd5e1; color: #475569; }

        /* Deine Aktivitäten */
        .qt-card {
          background: white; border-radius: 12px; padding: 1rem 1.1rem;
          border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .qt-header { display: flex; align-items: center; justify-content: space-between; }
        .qt-title { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
        .qt-sub { font-size: 0.67rem; color: #94a3b8; margin-top: 0.1rem; }
        .qt-header-actions { display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0; }
        .qt-mic-btn, .qt-add-btn, .qt-nutrition-btn {
          width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e2e8f0;
          background: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; transition: all 0.15s;
        }
        .qt-mic-btn:hover, .qt-nutrition-btn:hover { border-color: #94a3b8; color: #334155; background: #f8fafc; }
        .qt-nutrition-btn { color: #22c55e; border-color: #dcfce7; background: #f0fdf4; }
        .qt-nutrition-btn:hover { background: #dcfce7; border-color: #86efac; color: #16a34a; }
        .qt-add-btn { background: #4498ca; border-color: #4498ca; color: white; }
        .qt-add-btn:hover { background: #3585b8; border-color: #3585b8; color: white; }
        .qt-mic-btn.listening { border-color: #ef4444; color: #ef4444; animation: micPulse 0.8s ease-in-out infinite; }
        @keyframes micPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); } 50% { box-shadow: 0 0 0 5px rgba(239,68,68,0); } }
        .qt-empty-state {
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
          padding: 0.9rem 0; color: #94a3b8; font-size: 0.72rem; font-weight: 400;
        }
        .qt-activity-list { display: flex; flex-direction: column; gap: 0.3rem; }
        .qt-activity-row {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.45rem 0.6rem; border-radius: 8px;
          background: #f8fafc; border: 1px solid #f1f5f9; transition: background 0.13s;
        }
        .qt-activity-row:hover { background: #f1f5f9; }
        .qt-activity-dot { width: 6px; height: 6px; border-radius: 50%; background: #4498ca; flex-shrink: 0; }
        .qt-activity-label { flex: 1; font-size: 0.76rem; font-weight: 500; color: #334155; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .qt-activity-stars { display: flex; gap: 2px; flex-shrink: 0; }
        .qt-activity-remove {
          width: 20px; height: 20px; border-radius: 5px; border: none; background: transparent;
          color: #cbd5e1; display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: all 0.13s; padding: 0;
        }
        .qt-activity-remove:hover { background: #fee2e2; color: #ef4444; }

        /* Modal */
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(15,23,42,0.38); backdrop-filter: blur(5px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .modal-card {
          background: white; border-radius: 16px; padding: 1.25rem 1.4rem 1.3rem;
          width: 100%; max-width: 400px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.9rem; }
        .modal-header-left { display: flex; align-items: center; gap: 0.4rem; }
        .modal-back-btn { width: 26px; height: 26px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; }
        .modal-back-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .modal-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; }
        .modal-close { width: 28px; height: 28px; border-radius: 6px; border: none; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
        .modal-close:hover { background: #e2e8f0; }

        /* Step 1: search */
        .modal-input-row { display: flex; gap: 0.45rem; margin-bottom: 0.55rem; }
        .modal-input {
          flex: 1; padding: 0.5rem 0.7rem; border-radius: 8px;
          border: 1px solid #e2e8f0; font-size: 0.82rem; color: #1e293b;
          outline: none; transition: border-color 0.15s; font-family: inherit;
        }
        .modal-input:focus { border-color: #4498ca; box-shadow: 0 0 0 3px rgba(68,152,202,0.1); }
        .modal-mic-btn {
          width: 36px; height: 36px; border-radius: 8px; border: 1px solid #e2e8f0;
          background: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; flex-shrink: 0; transition: all 0.15s;
        }
        .modal-mic-btn:hover { border-color: #94a3b8; color: #334155; }
        .modal-mic-btn.listening { border-color: #ef4444; color: #ef4444; animation: micPulse 0.8s ease-in-out infinite; }
        .modal-listening-hint { font-size: 0.7rem; color: #ef4444; margin: 0 0 0.5rem; font-weight: 500; }
        .modal-measure-list { display: flex; flex-direction: column; gap: 0.3rem; max-height: 260px; overflow-y: auto; }
        .modal-measure-item {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          padding: 0.55rem 0.7rem; border-radius: 8px; border: 1px solid #f1f5f9;
          background: #fafafa; cursor: pointer; text-align: left; transition: all 0.13s;
          gap: 0.5rem;
        }
        .modal-measure-item:hover { background: #f0f9ff; border-color: #bae6fd; }
        .modal-measure-body { display: flex; flex-direction: column; gap: 0.18rem; flex: 1; min-width: 0; }
        .modal-measure-label { font-size: 0.78rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .modal-measure-cluster { font-size: 0.6rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 4px; width: fit-content; }
        .modal-measure-stars { display: flex; gap: 2px; flex-shrink: 0; }
        .modal-empty { font-size: 0.76rem; color: #94a3b8; text-align: center; padding: 1rem 0; margin: 0; }

        /* Step 2: detail */
        .modal-selected-card {
          display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
          background: #f8fafc; border-radius: 9px; padding: 0.6rem 0.75rem;
          border: 1px solid #e2e8f0; margin-bottom: 1rem;
        }
        .modal-selected-label { font-size: 0.8rem; font-weight: 600; color: #1e293b; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .modal-cluster-tag { font-size: 0.6rem; font-weight: 700; padding: 0.12rem 0.45rem; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
        .modal-section-label { font-size: 0.68rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.45rem; }
        .modal-intensity-row { display: flex; gap: 0.4rem; margin-bottom: 1rem; }
        .modal-intensity-btn {
          flex: 1; padding: 0.45rem 0; border-radius: 8px; border: 1px solid #e2e8f0;
          background: white; font-size: 0.76rem; font-weight: 500; color: #64748b;
          cursor: pointer; transition: all 0.15s; font-family: inherit;
        }
        .modal-intensity-btn:hover { border-color: #94a3b8; color: #334155; }
        .modal-duration-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.1rem; }
        .modal-duration-input {
          width: 80px; padding: 0.45rem 0.6rem; border-radius: 8px;
          border: 1px solid #e2e8f0; font-size: 0.9rem; font-weight: 600; color: #1e293b;
          outline: none; text-align: center; font-family: inherit; transition: border-color 0.15s;
        }
        .modal-duration-input:focus { border-color: #4498ca; box-shadow: 0 0 0 3px rgba(68,152,202,0.1); }
        .modal-duration-unit { font-size: 0.82rem; color: #64748b; font-weight: 500; }
        .modal-stars-preview {
          display: flex; align-items: center; justify-content: center; flex-direction: column;
          gap: 0.35rem; background: #f0f9ff; border-radius: 10px;
          padding: 0.9rem 1rem; margin-bottom: 1rem; border: 1px solid #bae6fd;
        }
        .modal-stars-preview-label { font-size: 0.7rem; color: #0369a1; font-weight: 600; }
        .modal-stars-earned { display: flex; gap: 0.25rem; }
        .modal-stars-text { font-size: 0.78rem; font-weight: 700; color: #0369a1; }
        .modal-actions { display: flex; gap: 0.5rem; }
        .modal-confirm-btn {
          flex: 1; padding: 0.55rem 1rem; border-radius: 8px; border: none;
          background: #4498ca; color: white; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s; font-family: inherit;
        }
        .modal-confirm-btn:hover { background: #3585b8; }
        .modal-cancel-btn { padding: 0.55rem 1rem; border-radius: 8px; border: 1px solid #e2e8f0; background: transparent; color: #64748b; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: border-color 0.15s; font-family: inherit; }
        .modal-cancel-btn:hover { border-color: #cbd5e1; }

        /* Nutrition Modal */
        .nutr-modal { max-width: 440px; }
        .nutr-loading {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1rem; padding: 2.5rem 1rem;
        }
        .nutr-spinner {
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid #e2e8f0; border-top-color: #4498ca;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .nutr-loading-text { font-size: 0.78rem; color: #94a3b8; font-weight: 500; margin: 0; }
        .nutr-content { display: flex; flex-direction: column; gap: 1rem; }
        .nutr-kcal-row {
          display: flex; align-items: center; gap: 1rem;
          background: #f8fafc; border-radius: 10px; padding: 0.8rem 1rem;
          border: 1px solid #e2e8f0;
        }
        .nutr-kcal-main { display: flex; align-items: baseline; gap: 0.3rem; flex-shrink: 0; }
        .nutr-kcal-val { font-size: 1.8rem; font-weight: 700; color: #1e293b; line-height: 1; }
        .nutr-kcal-unit { font-size: 0.8rem; color: #64748b; font-weight: 500; }
        .nutr-kcal-meta { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
        .nutr-kcal-label { font-size: 0.68rem; color: #94a3b8; font-weight: 500; }
        .nutr-kcal-bar-track { height: 5px; background: #e2e8f0; border-radius: 3px; overflow: hidden; }
        .nutr-kcal-bar-fill { height: 100%; background: linear-gradient(90deg, #4498ca, #22c55e); border-radius: 3px; animation: growBar 0.8s ease-out; }
        @keyframes growBar { from { width: 0 !important; } }
        .nutr-macro-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
        .nutr-macro-card {
          background: #fafafa; border: 1px solid #f1f5f9; border-radius: 10px;
          padding: 0.65rem 0.75rem;
        }
        .nutr-macro-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.1rem; }
        .nutr-macro-label { font-size: 0.63rem; font-weight: 600; color: #64748b; }
        .nutr-macro-pct { font-size: 0.65rem; font-weight: 700; }
        .nutr-macro-val { font-size: 1.1rem; font-weight: 700; color: #1e293b; line-height: 1.1; margin-bottom: 0.4rem; }
        .nutr-macro-unit { font-size: 0.65rem; font-weight: 400; color: #94a3b8; }
        .nutr-macro-track { height: 3px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-bottom: 0.3rem; }
        .nutr-macro-fill { height: 100%; border-radius: 2px; animation: growBar 0.9s ease-out; }
        .nutr-macro-goal { font-size: 0.58rem; color: #94a3b8; }
        .nutr-micro-row { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .nutr-micro-chip {
          display: flex; align-items: center; gap: 0.35rem;
          padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.65rem;
        }
        .nutr-micro-chip.ok { background: #f0fdf4; border: 1px solid #bbf7d0; }
        .nutr-micro-chip.warn { background: #fffbeb; border: 1px solid #fde68a; }
        .nutr-micro-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .nutr-micro-label { font-weight: 600; color: #374151; }
        .nutr-micro-val { color: #6b7280; }
        .nutr-log-btn {
          width: 100%; padding: 0.6rem; border-radius: 9px; border: none;
          background: #4498ca; color: white; font-size: 0.82rem; font-weight: 600;
          cursor: pointer; transition: background 0.15s; font-family: inherit;
        }
        .nutr-log-btn:hover { background: #3585b8; }

        /* Trends */
        .trends-card {
          background: white; border-radius: 12px; padding: 1rem 1.1rem;
          border: 1px solid #e2e8f0; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .trends-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }
        .trends-title-row { display: flex; align-items: center; gap: 0.4rem; }
        .trends-title { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
        .trends-period { font-size: 0.65rem; color: #94a3b8; }
        .trends-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.65rem; }
        .tmc { background: #f8fafc; border-radius: 10px; padding: 0.7rem 0.75rem 0.4rem; border: 1px solid #f1f5f9; overflow: hidden; }
        .tmc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.15rem; }
        .tmc-label { font-size: 0.62rem; font-weight: 500; color: #64748b; }
        .tmc-trend { font-size: 0.6rem; font-weight: 600; }
        .tmc-value { font-size: 1.15rem; font-weight: 700; line-height: 1; margin-bottom: 0.45rem; }
        .tmc-unit { font-size: 0.65rem; font-weight: 400; color: #94a3b8; }

        /* Mobile layout */
        .mobile-dashboard { display: none; }
        .mob-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; }
        .mob-profile { display: flex; align-items: center; gap: 0.75rem; }
        .mob-greeting { font-size: 1rem; font-weight: 600; color: #1e293b; }
        .mob-name { color: #4498ca; }
        .mob-date { font-size: 0.63rem; color: #94a3b8; margin-top: 1px; }
        .mob-stars-pill { display: flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.65rem; border-radius: 6px; background: #f0f9ff; border: 1px solid #bae6fd; font-size: 0.75rem; font-weight: 600; color: #0369a1; white-space: nowrap; flex-shrink: 0; }
        .mob-progress-wrap { margin-bottom: 1rem; }
        .mob-progress-track { width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; margin-bottom: 0.35rem; }
        .mob-progress-fill { height: 100%; background: #4498ca; border-radius: 2px; transition: width 0.8s ease; }
        .mob-progress-label { font-size: 0.67rem; color: #94a3b8; }
        .mob-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
        .mob-cat-card {
          display: flex; align-items: center; gap: 0.55rem;
          background: white; border-radius: 10px; padding: 0.65rem 0.7rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05); position: relative;
          border: 1px solid #e2e8f0;
        }
        .mob-cat-icon-wrap { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .mob-cat-body { flex: 1; min-width: 0; }
        .mob-cat-title { font-size: 0.7rem; font-weight: 600; color: #1e293b; line-height: 1.2; }
        .mob-cat-sub { font-size: 0.58rem; color: #94a3b8; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mob-cat-stars { display: flex; gap: 2px; margin-top: 4px; }
        .mob-cat-status-dot { position: absolute; top: 0.5rem; right: 0.5rem; width: 6px; height: 6px; border-radius: 50%; }

        @media (max-width: 1150px) {
          .main-grid { grid-template-columns: 1fr 1fr; gap: 1.25rem; }
          .center-col { grid-column: span 2; order: -1; }
        }
        @media (max-width: 950px) {
          .main-grid { grid-template-columns: 1fr; }
          .center-col { grid-column: span 1; }
        }
        @media (max-width: 700px) {
          .bird-view-container { padding: 0.75rem 1rem 2rem; }
          .main-grid { display: none; }
          .mobile-dashboard { display: block; padding-top: 0.5rem; }
          .page-header { flex-direction: column; gap: 0.4rem; }
        }
        @media (max-width: 480px) {
          .nba-cards { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
