'use client';

import { useState, useMemo } from 'react';

type SubTab = 'tracker' | 'rewards' | 'trends';

interface Measure {
  id: string;
  label: string;
  cluster: string;
  effekt: number;
  wirkung: number;
  evidenz: 'A' | 'B' | 'C';
  alltag: number;
  score: number;
  stars: number;
  study: string;
}

const CLUSTER_COLORS: Record<string, string> = {
  'Erholung': '#4498ca',
  'Kraft & Ausdauer': '#22c55e',
  'Vitalität & Schutz': '#f59e0b',
  'Selbstfürsorge': '#ec4899',
  'Balance & Entlastung': '#8b5cf6',
  'Resilienz': '#06b6d4',
};

const measures: Measure[] = [
  { id:'M-01', label:'8–8,5 Std. schlafen', cluster:'Erholung', effekt:90, wirkung:90, evidenz:'A', alltag:65, score:84, stars:5, study:'Schlafdauer & Gesundheit' },
  { id:'M-02', label:'Zur Chronotyp-Zeit schlafen', cluster:'Erholung', effekt:82, wirkung:80, evidenz:'A', alltag:65, score:77, stars:4, study:'Chronotyp & Schlafqualität' },
  { id:'M-03', label:'30 Min. vor Schlafen bildschirmfrei', cluster:'Erholung', effekt:60, wirkung:58, evidenz:'B', alltag:75, score:66, stars:3, study:'Bildschirmlicht & Schlaf' },
  { id:'M-04', label:'Schlafzimmer kühl + dunkel gehalten', cluster:'Erholung', effekt:52, wirkung:50, evidenz:'B', alltag:80, score:62, stars:3, study:'Schlafumgebung & Schlafqualität' },
  { id:'M-05', label:'10 Min. Tageslicht am Morgen', cluster:'Erholung', effekt:68, wirkung:72, evidenz:'A', alltag:85, score:77, stars:4, study:'Morgenlicht + Schlaf-Wach-Rhythmus' },
  { id:'M-06', label:'Feste Aufstehzeit eingehalten', cluster:'Erholung', effekt:70, wirkung:72, evidenz:'A', alltag:72, score:73, stars:4, study:'Schlafregelmäßigkeit' },
  { id:'M-07', label:'Nach 14 Uhr kein Koffein mehr', cluster:'Erholung', effekt:50, wirkung:48, evidenz:'B', alltag:72, score:60, stars:3, study:'Koffein & Schlafqualität' },
  { id:'M-08', label:'20 Min. Power Nap gemacht', cluster:'Erholung', effekt:42, wirkung:40, evidenz:'C', alltag:55, score:47, stars:1, study:'Power Naps & Erholung' },
  { id:'M-09', label:'15 Min. Abendroutine durchgeführt', cluster:'Erholung', effekt:58, wirkung:60, evidenz:'B', alltag:78, score:65, stars:3, study:'Abendroutinen & Schlaf' },
  { id:'M-10', label:'Hohe Schlafqualität wahrgenommen', cluster:'Erholung', effekt:35, wirkung:35, evidenz:'C', alltag:85, score:49, stars:1, study:'Subjektive Schlafqualität' },
  { id:'M-11', label:'8.000 Schritte gegangen', cluster:'Kraft & Ausdauer', effekt:75, wirkung:80, evidenz:'A', alltag:75, score:79, stars:4, study:'Metaanalyse Gehen & Mortalität' },
  { id:'M-12', label:'12.000 Schritte zügig', cluster:'Kraft & Ausdauer', effekt:60, wirkung:65, evidenz:'A', alltag:85, score:73, stars:4, study:'Walking & Herz-Kreislauf' },
  { id:'M-13', label:'25 Min. joggen gegangen', cluster:'Kraft & Ausdauer', effekt:80, wirkung:75, evidenz:'A', alltag:65, score:76, stars:4, study:'Laufen & Gesamtmortalität' },
  { id:'M-14', label:'45 Min. Krafttraining', cluster:'Kraft & Ausdauer', effekt:85, wirkung:80, evidenz:'A', alltag:60, score:78, stars:4, study:'Krafttraining & Mortalität' },
  { id:'M-15', label:'10 Min. Dehnungen durchgeführt', cluster:'Kraft & Ausdauer', effekt:40, wirkung:45, evidenz:'B', alltag:85, score:58, stars:2, study:'Mobility & Beweglichkeit' },
  { id:'M-16', label:'60 Min. Rad gefahren', cluster:'Kraft & Ausdauer', effekt:78, wirkung:72, evidenz:'A', alltag:65, score:74, stars:4, study:'Radfahren & Gesundheit' },
  { id:'M-17', label:'10 Min. Treppen gestiegen', cluster:'Kraft & Ausdauer', effekt:55, wirkung:55, evidenz:'B', alltag:80, score:65, stars:3, study:'Treppensteigen & Fitness' },
  { id:'M-18', label:'15 Min. HIT-Intervalltraining', cluster:'Kraft & Ausdauer', effekt:85, wirkung:78, evidenz:'A', alltag:55, score:75, stars:3, study:'Intervalltraining & Gesundheit' },
  { id:'M-19', label:'2 Min. Dead Hang gehalten', cluster:'Kraft & Ausdauer', effekt:82, wirkung:72, evidenz:'B', alltag:60, score:80, stars:5, study:'Griffkraft, Muskelkraft & Mortalität' },
  { id:'M-20', label:'Griffkraft-Training durchgeführt', cluster:'Kraft & Ausdauer', effekt:50, wirkung:40, evidenz:'B', alltag:70, score:56, stars:2, study:'Griffkraft & Langlebigkeit' },
  { id:'M-21', label:'Cooper-Test: 2,3 km gelaufen', cluster:'Kraft & Ausdauer', effekt:76, wirkung:70, evidenz:'B', alltag:50, score:74, stars:4, study:'Kardiorespiratorische Fitness' },
  { id:'M-22', label:'Vollwertige Hauptmahlzeit gegessen', cluster:'Vitalität & Schutz', effekt:68, wirkung:70, evidenz:'A', alltag:75, score:74, stars:4, study:'Ernährungsqualität & Longevity' },
  { id:'M-23', label:'30 g Ballaststoffe aufgenommen', cluster:'Vitalität & Schutz', effekt:78, wirkung:80, evidenz:'A', alltag:65, score:77, stars:4, study:'Ballaststoffe & Gesundheit' },
  { id:'M-24', label:'2,5 Liter Wasser getrunken', cluster:'Vitalität & Schutz', effekt:38, wirkung:40, evidenz:'B', alltag:80, score:53, stars:2, study:'Hydration & Leistungsfähigkeit' },
  { id:'M-25', label:'5 Portionen Gemüse + Obst gegessen', cluster:'Vitalität & Schutz', effekt:72, wirkung:78, evidenz:'A', alltag:68, score:76, stars:4, study:'Metaanalyse Obst, Gemüse & Mortalität' },
  { id:'M-26', label:'160 g Protein aufgenommen (80 kg)', cluster:'Vitalität & Schutz', effekt:68, wirkung:65, evidenz:'A', alltag:72, score:71, stars:4, study:'Proteinaufnahme & Muskelgesundheit' },
  { id:'M-27', label:'Kein Ultra-Processed-Snacking', cluster:'Vitalität & Schutz', effekt:60, wirkung:62, evidenz:'B', alltag:72, score:66, stars:3, study:'Ultra-Processed Food & Longevity' },
  { id:'M-28', label:'Einen Tag zuckerarm gegessen', cluster:'Vitalität & Schutz', effekt:58, wirkung:60, evidenz:'B', alltag:70, score:63, stars:3, study:'Zuckerreduktion & Stoffwechsel' },
  { id:'M-29', label:'Omega-3-reiche Lebensmittel / Fischöl', cluster:'Vitalität & Schutz', effekt:60, wirkung:58, evidenz:'B', alltag:68, score:64, stars:3, study:'Omega-3 & Herzgesundheit' },
  { id:'M-30', label:'Innenraum aktiv gelüftet', cluster:'Vitalität & Schutz', effekt:35, wirkung:38, evidenz:'C', alltag:85, score:50, stars:2, study:'Raumluftqualität & Erholung' },
  { id:'M-31', label:'UV-Schutz bewusst eingehalten', cluster:'Vitalität & Schutz', effekt:55, wirkung:55, evidenz:'B', alltag:72, score:63, stars:3, study:'UV-Schutz & Hautalterung' },
  { id:'M-32', label:'12 Std. Esspause eingehalten', cluster:'Selbstfürsorge', effekt:52, wirkung:55, evidenz:'B', alltag:68, score:59, stars:2, study:'Time-Restricted Eating & Stoffwechsel' },
  { id:'M-33', label:'7 Tage keinen Alkohol konsumiert', cluster:'Selbstfürsorge', effekt:72, wirkung:75, evidenz:'A', alltag:60, score:72, stars:4, study:'Alkoholkonsum & Longevity' },
  { id:'M-34', label:'30 Min. echten sozialen Austausch', cluster:'Selbstfürsorge', effekt:62, wirkung:70, evidenz:'B', alltag:72, score:68, stars:3, study:'Soziale Verbundenheit & Wohlbefinden' },
  { id:'M-35', label:'Freund / Familienmitglied kontaktiert', cluster:'Selbstfürsorge', effekt:48, wirkung:55, evidenz:'B', alltag:88, score:63, stars:3, study:'Soziale Kontakte & Wohlbefinden' },
  { id:'M-36', label:'Mahlzeit mit Verbundenheit erlebt', cluster:'Selbstfürsorge', effekt:58, wirkung:65, evidenz:'B', alltag:72, score:64, stars:3, study:'Gemeinsame Mahlzeiten & Wohlbefinden' },
  { id:'M-37', label:'Unterstützung gegeben / angenommen', cluster:'Selbstfürsorge', effekt:50, wirkung:58, evidenz:'C', alltag:65, score:57, stars:2, study:'Soziale Unterstützung & Resilienz' },
  { id:'M-38', label:'1 Std. offline Qualitätszeit', cluster:'Selbstfürsorge', effekt:60, wirkung:68, evidenz:'B', alltag:60, score:63, stars:3, study:'Qualitätszeit & Beziehungserleben' },
  { id:'M-39', label:'Im soz. Kontext alkoholfrei geblieben', cluster:'Selbstfürsorge', effekt:58, wirkung:60, evidenz:'B', alltag:55, score:60, stars:3, study:'Alkoholverhalten im soz. Kontext' },
  { id:'M-40', label:'Einen nikotinfreien Tag geschafft', cluster:'Balance & Entlastung', effekt:88, wirkung:82, evidenz:'A', alltag:45, score:76, stars:4, study:'Rauchstopp & Mortalität' },
  { id:'M-41', label:'10 Min. Atemübung durchgeführt', cluster:'Balance & Entlastung', effekt:50, wirkung:58, evidenz:'B', alltag:85, score:65, stars:3, study:'Atemübungen & Stressregulation' },
  { id:'M-42', label:'30 Min. bewusste Auszeit in Natur', cluster:'Balance & Entlastung', effekt:58, wirkung:65, evidenz:'B', alltag:78, score:67, stars:3, study:'Naturkontakt & Stressreduktion' },
  { id:'M-43', label:'Eine Pause ohne Handy gemacht', cluster:'Balance & Entlastung', effekt:38, wirkung:42, evidenz:'C', alltag:85, score:53, stars:1, study:'Digitale Pausen & Erholung' },
  { id:'M-44', label:'Mikro-Pause von 5 Min. eingebaut', cluster:'Balance & Entlastung', effekt:35, wirkung:40, evidenz:'C', alltag:88, score:52, stars:2, study:'Mikro-Pausen & Erholung' },
  { id:'M-45', label:'4 Std. vor Schlaf keine Alk. konsumiert', cluster:'Balance & Entlastung', effekt:55, wirkung:58, evidenz:'B', alltag:65, score:62, stars:3, study:'Alkohol am Abend & Schlafqualität' },
  { id:'M-46', label:'15 Min. meditiert', cluster:'Resilienz', effekt:58, wirkung:65, evidenz:'B', alltag:70, score:66, stars:3, study:'Meditation & Stressreduktion' },
  { id:'M-47', label:'10 Min. Dankbarkeits-Journaling', cluster:'Resilienz', effekt:42, wirkung:48, evidenz:'B', alltag:82, score:58, stars:2, study:'Dankbarkeit & Wohlbefinden' },
  { id:'M-48', label:'10 Min. Fokusübung durchgeführt', cluster:'Resilienz', effekt:48, wirkung:52, evidenz:'B', alltag:78, score:60, stars:3, study:'Achtsamkeit & Aufmerksamkeit' },
  { id:'M-49', label:'Bel. Gedankenkreislauf unterbrochen', cluster:'Resilienz', effekt:42, wirkung:45, evidenz:'C', alltag:60, score:47, stars:1, study:'Kognitive Distanzierung & Grübeln' },
  { id:'M-50', label:'Social-Media-Zeit um 50% reduziert', cluster:'Resilienz', effekt:45, wirkung:50, evidenz:'C', alltag:60, score:49, stars:1, study:'Social Media & Wohlbefinden' },
];

const weekData = [
  { day: 'Mo', stars: 5, goal: 7 },
  { day: 'Di', stars: 7, goal: 7 },
  { day: 'Mi', stars: 4, goal: 7 },
  { day: 'Do', stars: 6, goal: 7 },
  { day: 'Fr', stars: 7, goal: 7 },
  { day: 'Sa', stars: 3, goal: 7 },
  { day: 'So', stars: 2, goal: 7 },
];

const pastReports = [
  { month: 'Februar 2025', score: 84, highlights: ['HRV +12%', 'Schlaf verbessert', '32 Aktivitäten'], trend: 'up' },
  { month: 'Januar 2025', score: 76, highlights: ['Starke Erholung', 'Streaks: 14 Tage', 'Neue PB: Zone 2'], trend: 'up' },
  { month: 'Dezember 2024', score: 71, highlights: ['Festtage: weniger Routine', 'Balance gut', 'Resilienz-Fokus'], trend: 'neutral' },
];

export default function EntwicklungPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('trends');
  const [checkedIds, setCheckedIds] = useState<string[]>(['M-01', 'M-05', 'M-11']);
  const [starAnim, setStarAnim] = useState<string | null>(null);
  const [filterCluster, setFilterCluster] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const clusters = ['Alle', ...Object.keys(CLUSTER_COLORS)];

  const toggleMeasure = (id: string) => {
    if (!checkedIds.includes(id)) {
      setStarAnim(id);
      setTimeout(() => setStarAnim(null), 700);
    }
    setCheckedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const todayStars = checkedIds.reduce((sum, id) => {
    const m = measures.find(a => a.id === id);
    return sum + (m?.stars || 0);
  }, 0);

  const filteredMeasures = useMemo(() => {
    let list = measures;
    if (filterCluster !== 'Alle') list = list.filter(m => m.cluster === filterCluster);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(m => m.label.toLowerCase().includes(q) || m.cluster.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
    }
    return list;
  }, [filterCluster, searchQuery]);

  const streakDays = 5;
  const weeklyStars = weekData.reduce((s, d) => s + d.stars, 0);

  return (
    <div className="entw-page">
      {/* Header */}
      <div className="entw-header">
        <div>
          <h1 className="entw-title">Entwicklung</h1>
          <p className="entw-subtitle">Maßnahmen-Bibliothek · Rewards · Trends</p>
        </div>
        <div className="entw-today-stars">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#4498ca">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>{todayStars} heute</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="entw-tabs">
        {([
          { id: 'tracker', label: 'Maßnahmen', icon: 'bi-check2-square' },
          { id: 'rewards', label: 'Rewards', icon: 'bi-trophy' },
          { id: 'trends', label: 'Trends', icon: 'bi-graph-up' },
        ] as { id: SubTab; label: string; icon: string }[]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`entw-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`bi ${tab.icon}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── MAASSNAHMEN TRACKER ── */}
      {activeTab === 'tracker' && (
        <div className="tracker-section">
          {/* Daily Progress */}
          <div className="tracker-progress-card">
            <div className="tpc-left">
              <div className="tpc-stars-count">{todayStars}</div>
              <div className="tpc-stars-label">Sterne heute</div>
            </div>
            <div className="tpc-center">
              <div className="tpc-bar-track">
                <div className="tpc-bar-fill" style={{ width: `${Math.min((todayStars / 10) * 100, 100)}%` }} />
              </div>
              <div className="tpc-goal">Tagesziel: 10 Sterne · {checkedIds.length} Maßnahmen erledigt</div>
            </div>
            <div className="tpc-right">
              <span className="tpc-streak">🔥 {streakDays} Tage</span>
              <span className="tpc-streak-label">Streak</span>
            </div>
          </div>

          {/* Search + Voice */}
          <div className="lib-search-row">
            <div className="lib-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="lib-search-input"
                placeholder="Maßnahme suchen (z.B. Schlaf, M-01, Erholung…)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="lib-search-clear" onClick={() => setSearchQuery('')}>×</button>
              )}
            </div>
            <div className="voice-input-bar">
              <i className="bi bi-mic-fill" style={{ color: '#4498ca', fontSize: '1rem' }} />
              <span className="voice-placeholder">Per Stimme eintragen</span>
              <button className="voice-btn">Sprechen</button>
            </div>
          </div>

          {/* Cluster Filter */}
          <div className="tracker-filter">
            {clusters.map(cl => (
              <button
                key={cl}
                onClick={() => setFilterCluster(cl)}
                className={`filter-chip ${filterCluster === cl ? 'active' : ''}`}
                style={filterCluster === cl && cl !== 'Alle' ? { background: `${CLUSTER_COLORS[cl]}18`, color: CLUSTER_COLORS[cl], borderColor: `${CLUSTER_COLORS[cl]}50` } : {}}
              >
                {cl !== 'Alle' && <span className="chip-dot" style={{ background: CLUSTER_COLORS[cl] }} />}
                {cl}
              </button>
            ))}
          </div>

          {/* Count */}
          <div className="lib-count">{filteredMeasures.length} Maßnahmen · Science-backed</div>

          {/* Measure List */}
          <div className="measure-list">
            {filteredMeasures.map(m => {
              const isDone = checkedIds.includes(m.id);
              const isExpanded = expandedId === m.id;
              const isAnimating = starAnim === m.id;
              const color = CLUSTER_COLORS[m.cluster] || '#4498ca';
              return (
                <div key={m.id} className={`measure-row ${isDone ? 'done' : ''}`}>
                  {isAnimating && (
                    <div className="star-burst">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="star-particle" style={{ '--i': i } as React.CSSProperties}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill={color}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="measure-row-main" onClick={() => setExpandedId(isExpanded ? null : m.id)}>
                    <button
                      className={`measure-check ${isDone ? 'checked' : ''}`}
                      style={isDone ? { background: color, borderColor: color } : {}}
                      onClick={e => { e.stopPropagation(); toggleMeasure(m.id); }}
                    >
                      {isDone && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                    <div className="measure-id" style={{ color: isDone ? color : undefined }}>{m.id}</div>
                    <div className="measure-info">
                      <div className="measure-label" style={{ color: isDone ? '#1a3a50' : undefined }}>{m.label}</div>
                      <span className="measure-cluster-tag" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{m.cluster}</span>
                    </div>
                    <div className="measure-meta">
                      <div className="measure-score-badge" style={{ color, background: `${color}12`, border: `1px solid ${color}25` }}>{m.score}</div>
                      <div className="measure-stars-mini">
                        {Array.from({ length: m.stars }).map((_, i) => (
                          <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill={isDone ? color : '#cbd5e1'}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="measure-evidenz-tag" style={{ color: m.evidenz === 'A' ? '#22c55e' : m.evidenz === 'B' ? '#f59e0b' : '#94a3b8' }}>
                      {m.evidenz}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  {isExpanded && (
                    <div className="measure-detail">
                      <div className="measure-detail-row">
                        <div className="measure-detail-item">
                          <span className="mdi-label">Effektivität</span>
                          <div className="mdi-bar-wrap">
                            <div className="mdi-bar" style={{ width: `${m.effekt}%`, background: color }} />
                          </div>
                          <span className="mdi-val">{m.effekt}</span>
                        </div>
                        <div className="measure-detail-item">
                          <span className="mdi-label">Wirkungsbreite</span>
                          <div className="mdi-bar-wrap">
                            <div className="mdi-bar" style={{ width: `${m.wirkung}%`, background: color }} />
                          </div>
                          <span className="mdi-val">{m.wirkung}</span>
                        </div>
                        <div className="measure-detail-item">
                          <span className="mdi-label">Alltagstaug.</span>
                          <div className="mdi-bar-wrap">
                            <div className="mdi-bar" style={{ width: `${m.alltag}%`, background: '#94a3b8' }} />
                          </div>
                          <span className="mdi-val">{m.alltag}</span>
                        </div>
                      </div>
                      <div className="measure-study">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                        {m.study}
                      </div>
                      <button className="measure-log-btn" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                        onClick={() => toggleMeasure(m.id)}>
                        {isDone ? '✓ Erledigt – Rückgängig?' : `+ Als erledigt markieren (+${m.stars} ★)`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── NUTRITION SCAN ── */}
      {activeTab === 'nutrition' && (
        <div className="nutrition-section">
          <div className="nutri-intro">
            <div className="nutri-intro-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div>
              <div className="nutri-intro-title">Nutrition Scan</div>
              <div className="nutri-intro-sub">Foto deines Tellers → Muster-Analyse deiner Ernährung (kein Kalorientracking)</div>
            </div>
          </div>

          {!nutritionScanDone ? (
            <div className="nutri-upload-area" onClick={() => setNutritionScanDone(true)}>
              <div className="nutri-upload-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4498ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div className="nutri-upload-title">Foto aufnehmen oder hochladen</div>
              <div className="nutri-upload-sub">Teller, Mahlzeit oder Snack fotografieren</div>
              <div className="nutri-upload-btns">
                <button className="nutri-btn-cam">📷 Kamera</button>
                <button className="nutri-btn-upload">📁 Aus Galerie</button>
              </div>
            </div>
          ) : (
            <div className="nutri-result">
              <div className="nutri-result-header">
                <div className="nutri-result-img">🍽️</div>
                <div>
                  <div className="nutri-result-title">Analyse: Mittagessen</div>
                  <div className="nutri-result-sub">Erkannte Muster · Heute 12:34 Uhr</div>
                </div>
                <button className="nutri-rescan" onClick={() => setNutritionScanDone(false)}>Neu scannen</button>
              </div>

              <div className="nutri-patterns">
                {[
                  { label: 'Proteinanteil', value: 'Gut', note: 'Gute Proteinquelle erkannt (Hähnchen / Hülsenfrüchte)', color: '#22c55e', tag: 'gut' },
                  { label: 'Ballaststoffanteil', value: 'Mittel', note: 'Wenig Gemüse / Vollkorn sichtbar – erhöhe pflanzliche Anteile', color: '#f59e0b', tag: 'mittel' },
                  { label: 'Verarbeitungsgrad', value: 'Gering', note: 'Kaum verarbeitete Lebensmittel erkannt – sehr positiv', color: '#22c55e', tag: 'gut' },
                  { label: 'Mahlzeitenvielfalt', value: 'Mittel', note: 'Wenig Farbenvielfalt – füge mehr verschiedene Gemüsesorten hinzu', color: '#f59e0b', tag: 'mittel' },
                  { label: 'Ultra-Processed-Anteil', value: 'Niedrig', note: 'Keine stark verarbeiteten Produkte sichtbar', color: '#22c55e', tag: 'gut' },
                ].map((p, i) => (
                  <div key={i} className="nutri-pattern-row">
                    <div className="nutri-pattern-left">
                      <span className={`nutri-tag nutri-tag-${p.tag}`}>{p.value}</span>
                      <span className="nutri-pattern-label">{p.label}</span>
                    </div>
                    <div className="nutri-pattern-note">{p.note}</div>
                  </div>
                ))}
              </div>

              <div className="nutri-science-note">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Musteranalyse basiert auf Ernährungsqualitäts-Forschung (NOVA-Klassifikation, Mediterranean Diet Score). Kein Kalorientracking.
              </div>

              <div className="nutri-history-title">Verlauf</div>
              <div className="nutri-history">
                {[
                  { date: 'Gestern 19:12', label: 'Abendessen', tags: ['Protein gut', 'Ballaststoffe niedrig'] },
                  { date: 'Gestern 12:30', label: 'Mittagessen', tags: ['Vielfalt gut', 'Verarbeitung gering'] },
                  { date: 'Montag 08:05', label: 'Frühstück', tags: ['Zucker erhöht', 'Vollkorn gut'] },
                ].map((h, i) => (
                  <div key={i} className="nutri-history-row">
                    <div className="nhrow-meta">
                      <span className="nhrow-date">{h.date}</span>
                      <span className="nhrow-label">{h.label}</span>
                    </div>
                    <div className="nhrow-tags">
                      {h.tags.map((t, j) => <span key={j} className="nhrow-tag">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REWARDS ── */}
      {activeTab === 'rewards' && (
        <div className="rewards-section">
          {/* Level Card */}
          <div className="level-card">
            <div className="level-badge-big">Level 3</div>
            <div className="level-info">
              <div className="level-name">Longevity Explorer</div>
              <div className="level-desc">Du hast bereits 47 Sterne diese Woche gesammelt. Noch 53 bis Level 4!</div>
              <div className="level-bar-track">
                <div className="level-bar-fill" style={{ width: '47%' }} />
              </div>
              <div className="level-bar-label">47 / 100 Sterne bis Level 4</div>
            </div>
          </div>

          {/* Week Stars Chart */}
          <div className="week-chart-card">
            <div className="wcc-title">
              <i className="bi bi-calendar-week" style={{ marginRight: '0.5rem', color: '#4498ca' }} />
              Woche im Überblick
            </div>
            <div className="wcc-total">{weeklyStars} Sterne gesamt diese Woche</div>
            <div className="week-bars">
              {weekData.map((d, i) => (
                <div key={i} className="week-bar-item">
                  <div className="wb-bar-wrap">
                    <div
                      className="wb-bar"
                      style={{ height: `${(d.stars / d.goal) * 80}px`, background: d.stars >= d.goal ? 'linear-gradient(180deg, #4498ca, #2c6a8c)' : 'linear-gradient(180deg, #93c5fd, #4498ca)' }}
                    />
                    {d.stars >= d.goal && (
                      <div className="wb-goal-star">★</div>
                    )}
                  </div>
                  <span className="wb-day">{d.day}</span>
                  <span className="wb-val">{d.stars}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="rewards-stats">
            {[
              { icon: '🔥', label: 'Login Streak', value: `${streakDays} Tage`, sub: 'Persönlicher Rekord: 14' },
              { icon: '⭐', label: 'Gesamtsterne', value: '284', sub: 'Seit Beginn' },
              { icon: '🎯', label: 'Tagesziele erfüllt', value: '12/21', sub: 'Diese Woche: 5/7' },
              { icon: '🏆', label: 'Achievements', value: '8 / 24', sub: 'Nächstes: "7 Tage Streak"' },
            ].map((stat, i) => (
              <div key={i} className="reward-stat-card">
                <span className="rsc-icon">{stat.icon}</span>
                <span className="rsc-value">{stat.value}</span>
                <span className="rsc-label">{stat.label}</span>
                <span className="rsc-sub">{stat.sub}</span>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="achievements-card">
            <div className="ac-title">Achievements</div>
            <div className="achievements-grid">
              {[
                { icon: '🌅', label: '7-Tage Streak', unlocked: false, progress: '5/7' },
                { icon: '💪', label: '10x Krafttraining', unlocked: true, progress: '10/10' },
                { icon: '🧘', label: 'Meditationsmeister', unlocked: true, progress: '20/20' },
                { icon: '🚀', label: 'Level 4 erreicht', unlocked: false, progress: '47/100 ★' },
                { icon: '❄️', label: '14x Kaltdusche', unlocked: false, progress: '7/14' },
                { icon: '📚', label: 'Wissensdurst', unlocked: true, progress: '5/5' },
              ].map((ach, i) => (
                <div key={i} className={`achievement-item ${ach.unlocked ? 'unlocked' : ''}`}>
                  <span className="ach-icon">{ach.icon}</span>
                  <span className="ach-label">{ach.label}</span>
                  <span className="ach-progress">{ach.progress}</span>
                  {ach.unlocked && <span className="ach-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TRENDS & REPORTS ── */}
      {activeTab === 'trends' && (
        <div className="trends-section">
          {/* Next Best Actions */}
          <div className="nba-card">
            <div className="nba-title">
              <i className="bi bi-lightning-charge-fill" style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
              Next Best Actions
            </div>
            <div className="nba-list">
              {[
                { priority: 'high', action: 'Schlafzeit um 30 Min vorziehen', why: 'Deine HRV war 3 Tage in Folge unter Baseline.', impact: '+2 Sterne', area: 'Erholung' },
                { priority: 'medium', action: 'Zone 2 Training heute einplanen', why: 'Letzte Einheit vor 5 Tagen. Optimum: alle 2 Tage.', impact: '+2 Sterne', area: 'Kraft & Ausdauer' },
                { priority: 'low', action: 'Omega-3 Supplement einnehmen', why: 'Konsistenz dieser Woche: 40%. Ziel: 80%.', impact: '+1 Stern', area: 'Vitalität' },
              ].map((nba, i) => (
                <div key={i} className={`nba-item nba-${nba.priority}`}>
                  <div className="nba-dot" />
                  <div className="nba-content">
                    <div className="nba-action">{nba.action}</div>
                    <div className="nba-why">{nba.why}</div>
                  </div>
                  <div className="nba-right">
                    <span className="nba-impact">{nba.impact}</span>
                    <span className="nba-area">{nba.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Charts (simplified visual) */}
          <div className="trend-charts-row">
            {[
              { label: 'HRV (ms)', values: [38, 41, 39, 44, 42, 40, 43], color: '#4498ca', unit: 'ms', trend: '+5ms' },
              { label: 'Schlaf (h)', values: [6.5, 7, 6, 7.5, 7.2, 6.8, 7.4], color: '#22c55e', unit: 'h', trend: '+0.9h' },
              { label: 'Sterne', values: [5, 7, 4, 6, 7, 3, 2], color: '#f59e0b', unit: '★', trend: '' },
            ].map((chart, ci) => {
              const max = Math.max(...chart.values);
              const min = Math.min(...chart.values);
              const range = max - min || 1;
              const points = chart.values.map((v, i) => {
                const x = (i / (chart.values.length - 1)) * 100;
                const y = 100 - ((v - min) / range) * 80;
                return `${x},${y}`;
              }).join(' ');
              return (
                <div key={ci} className="trend-chart-card">
                  <div className="tcc-header">
                    <span className="tcc-label">{chart.label}</span>
                    {chart.trend && <span className="tcc-trend" style={{ color: chart.color }}>↑ {chart.trend}</span>}
                  </div>
                  <div className="tcc-current">{chart.values[chart.values.length - 1]}{chart.unit}</div>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="tcc-svg">
                    <defs>
                      <linearGradient id={`grad-${ci}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chart.color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={chart.color} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <polyline points={points + ` 100,100 0,100`} fill={`url(#grad-${ci})`} />
                    <polyline points={points} fill="none" stroke={chart.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="tcc-days">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => <span key={d}>{d}</span>)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Past Reports */}
          <div className="reports-section">
            <div className="rep-title">Monatsberichte</div>
            {pastReports.map((rep, i) => (
              <div key={i} className="report-card">
                <div className="rc-left">
                  <div className="rc-month">{rep.month}</div>
                  <div className="rc-highlights">
                    {rep.highlights.map((h, j) => (
                      <span key={j} className="rc-highlight">{h}</span>
                    ))}
                  </div>
                </div>
                <div className="rc-right">
                  <div className="rc-score" style={{ color: rep.score >= 80 ? '#22c55e' : rep.score >= 70 ? '#4498ca' : '#f59e0b' }}>
                    {rep.score}
                  </div>
                  <div className="rc-score-label">Score</div>
                </div>
                <button className="rc-btn">
                  <i className="bi bi-file-earmark-pdf" style={{ marginRight: '0.3rem' }} />PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .entw-page {
          padding: 1.5rem 2rem 3rem;
          min-height: calc(100vh - 80px);
          background: linear-gradient(145deg, #f8fcff 0%, #eef6fb 50%, #f0fdfa 100%);
        }

        .entw-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; }
        .entw-title { font-size: 1.75rem; font-weight: 700; color: #1a3a50; margin: 0; }
        .entw-subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.2rem 0 0; }
        .entw-today-stars {
          display: flex; align-items: center; gap: 0.35rem;
          padding: 0.45rem 0.9rem; border-radius: 20px;
          background: rgba(68,152,202,0.1); border: 1.5px solid rgba(68,152,202,0.2);
          font-size: 0.82rem; font-weight: 700; color: #4498ca;
        }

        .entw-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .entw-tab {
          display: flex; align-items: center; gap: 0.45rem; padding: 0.6rem 1.1rem;
          border-radius: 10px; border: 1.5px solid rgba(68,152,202,0.12);
          background: rgba(255,255,255,0.8); color: #64748b;
          font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.2s; position: relative;
        }
        .entw-tab.active { background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(68,152,202,0.25); }
        .entw-tab:hover:not(.active) { border-color: rgba(68,152,202,0.3); color: #4498ca; }
        .tab-new-badge {
          font-size: 0.55rem; font-weight: 800; letter-spacing: 0.04em;
          background: linear-gradient(135deg, #f59e0b, #d97706); color: white;
          padding: 0.1rem 0.35rem; border-radius: 4px; margin-left: 2px;
        }

        /* TRACKER */
        .tracker-section { display: flex; flex-direction: column; gap: 1rem; }

        .tracker-progress-card {
          display: flex; align-items: center; gap: 1.5rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.97), rgba(240,249,255,0.95));
          border: 1.5px solid rgba(68,152,202,0.2); border-radius: 16px; padding: 1.1rem 1.5rem;
          box-shadow: 0 4px 20px rgba(68,152,202,0.1);
        }
        .tpc-left { text-align: center; flex-shrink: 0; }
        .tpc-stars-count { font-size: 2.2rem; font-weight: 700; color: #4498ca; line-height: 1; }
        .tpc-stars-label { font-size: 0.68rem; color: #94a3b8; margin-top: 0.2rem; }
        .tpc-center { flex: 1; }
        .tpc-bar-track { width: 100%; height: 10px; background: rgba(68,152,202,0.1); border-radius: 5px; overflow: hidden; margin-bottom: 0.4rem; }
        .tpc-bar-fill { height: 100%; background: linear-gradient(90deg, #4498ca, #2c6a8c); border-radius: 5px; transition: width 0.8s ease; }
        .tpc-goal { font-size: 0.72rem; color: #64748b; }
        .tpc-right { text-align: center; flex-shrink: 0; }
        .tpc-streak { font-size: 1.3rem; font-weight: 700; color: #f59e0b; }
        .tpc-streak-label { display: block; font-size: 0.68rem; color: #94a3b8; margin-top: 0.2rem; }

        /* Search + Voice */
        .lib-search-row { display: flex; gap: 0.75rem; align-items: stretch; }
        .lib-search-wrap {
          flex: 1; display: flex; align-items: center; gap: 0.5rem;
          background: rgba(255,255,255,0.95); border: 1.5px solid rgba(68,152,202,0.15);
          border-radius: 12px; padding: 0.6rem 0.9rem; transition: border-color 0.2s;
        }
        .lib-search-wrap:focus-within { border-color: rgba(68,152,202,0.4); box-shadow: 0 0 0 3px rgba(68,152,202,0.08); }
        .lib-search-input {
          flex: 1; border: none; outline: none; background: transparent;
          font-size: 0.82rem; color: #1a3a50;
        }
        .lib-search-input::placeholder { color: #94a3b8; }
        .lib-search-clear {
          border: none; background: none; color: #94a3b8; font-size: 1.1rem;
          cursor: pointer; padding: 0; line-height: 1; flex-shrink: 0;
        }
        .voice-input-bar {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.6rem 0.9rem; border-radius: 12px; cursor: pointer;
          background: rgba(255,255,255,0.8); border: 1.5px dashed rgba(68,152,202,0.25);
          transition: all 0.2s; flex-shrink: 0;
        }
        .voice-input-bar:hover { border-color: rgba(68,152,202,0.5); background: rgba(255,255,255,0.95); }
        .voice-placeholder { font-size: 0.75rem; color: #94a3b8; font-style: italic; white-space: nowrap; }
        .voice-btn {
          padding: 0.35rem 0.75rem; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 0.72rem; font-weight: 600; cursor: pointer; white-space: nowrap;
        }

        /* Cluster Filter */
        .tracker-filter { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .filter-chip {
          display: flex; align-items: center; gap: 0.3rem;
          padding: 0.35rem 0.75rem; border-radius: 20px; border: 1.5px solid rgba(68,152,202,0.15);
          background: rgba(255,255,255,0.8); color: #64748b; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .filter-chip.active { font-weight: 700; }
        .chip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        .lib-count { font-size: 0.72rem; color: #94a3b8; font-weight: 500; padding-left: 0.25rem; }

        /* Measure List */
        .measure-list { display: flex; flex-direction: column; gap: 0.4rem; }
        .measure-row {
          position: relative; background: rgba(255,255,255,0.95); border-radius: 12px;
          border: 1.5px solid rgba(203,213,225,0.4); overflow: hidden; transition: all 0.2s;
        }
        .measure-row:hover { border-color: rgba(68,152,202,0.25); box-shadow: 0 2px 10px rgba(68,152,202,0.07); }
        .measure-row.done { background: rgba(248,252,255,0.98); border-color: rgba(68,152,202,0.2); }

        .measure-row-main {
          display: flex; align-items: center; gap: 0.7rem;
          padding: 0.7rem 0.9rem; cursor: pointer; user-select: none;
        }
        .measure-check {
          width: 20px; height: 20px; border-radius: 6px; border: 2px solid #cbd5e1;
          background: transparent; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; cursor: pointer; transition: all 0.2s;
        }
        .measure-id { font-size: 0.68rem; font-weight: 700; color: #94a3b8; flex-shrink: 0; min-width: 32px; font-variant-numeric: tabular-nums; }
        .measure-info { flex: 1; min-width: 0; }
        .measure-label { font-size: 0.82rem; font-weight: 600; color: #334155; line-height: 1.3; margin-bottom: 0.2rem; }
        .measure-cluster-tag { display: inline-block; font-size: 0.6rem; font-weight: 600; padding: 0.1rem 0.4rem; border-radius: 5px; }
        .measure-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem; flex-shrink: 0; }
        .measure-score-badge { font-size: 0.75rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 7px; line-height: 1; }
        .measure-stars-mini { display: flex; gap: 1.5px; }
        .measure-evidenz-tag { font-size: 0.65rem; font-weight: 800; flex-shrink: 0; min-width: 14px; text-align: center; }

        /* Expanded Detail */
        .measure-detail {
          padding: 0.75rem 1rem 0.9rem; border-top: 1px solid rgba(203,213,225,0.3);
          background: rgba(248,250,252,0.6);
        }
        .measure-detail-row { display: flex; gap: 1rem; margin-bottom: 0.65rem; flex-wrap: wrap; }
        .measure-detail-item { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 140px; }
        .mdi-label { font-size: 0.65rem; color: #64748b; white-space: nowrap; flex-shrink: 0; }
        .mdi-bar-wrap { flex: 1; height: 5px; background: rgba(203,213,225,0.4); border-radius: 3px; overflow: hidden; }
        .mdi-bar { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
        .mdi-val { font-size: 0.65rem; font-weight: 700; color: #475569; flex-shrink: 0; }
        .measure-study {
          display: flex; align-items: center; gap: 0.4rem;
          font-size: 0.68rem; color: #94a3b8; margin-bottom: 0.75rem; font-style: italic;
        }
        .measure-log-btn {
          width: 100%; padding: 0.55rem; border-radius: 9px; border: none;
          color: white; font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .measure-log-btn:hover { transform: translateY(-1px); opacity: 0.9; }

        .star-burst { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 10; }
        .star-particle {
          position: absolute; animation: burst 0.7s ease-out forwards;
          transform-origin: center;
          --angle: calc(var(--i) * 60deg);
          animation-delay: calc(var(--i) * 0.05s);
        }
        @keyframes burst {
          0% { transform: rotate(var(--angle)) translateY(0) scale(0); opacity: 1; }
          100% { transform: rotate(var(--angle)) translateY(-30px) scale(1.5); opacity: 0; }
        }

        /* NUTRITION SCAN */
        .nutrition-section { display: flex; flex-direction: column; gap: 1.25rem; }
        .nutri-intro {
          display: flex; align-items: center; gap: 1rem;
          background: linear-gradient(135deg, rgba(245,158,11,0.06), rgba(255,255,255,0.95));
          border: 1.5px solid rgba(245,158,11,0.2); border-radius: 14px; padding: 1rem 1.25rem;
        }
        .nutri-intro-icon {
          width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05));
          color: #f59e0b; flex-shrink: 0; border: 1.5px solid rgba(245,158,11,0.2);
        }
        .nutri-intro-title { font-size: 1rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.2rem; }
        .nutri-intro-sub { font-size: 0.75rem; color: #64748b; }

        .nutri-upload-area {
          display: flex; flex-direction: column; align-items: center; gap: 0.85rem;
          padding: 2.5rem 2rem; border-radius: 16px; cursor: pointer;
          background: rgba(255,255,255,0.9); border: 2px dashed rgba(68,152,202,0.25);
          transition: all 0.2s; text-align: center;
        }
        .nutri-upload-area:hover { border-color: rgba(68,152,202,0.5); background: rgba(255,255,255,0.98); }
        .nutri-upload-icon { width: 70px; height: 70px; border-radius: 18px; display: flex; align-items: center; justify-content: center; background: rgba(68,152,202,0.08); }
        .nutri-upload-title { font-size: 1rem; font-weight: 700; color: #1a3a50; }
        .nutri-upload-sub { font-size: 0.78rem; color: #94a3b8; }
        .nutri-upload-btns { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
        .nutri-btn-cam, .nutri-btn-upload {
          padding: 0.55rem 1.25rem; border-radius: 10px; border: 1.5px solid rgba(68,152,202,0.25);
          background: rgba(68,152,202,0.08); color: #4498ca; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .nutri-btn-cam { background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white; border-color: transparent; }
        .nutri-btn-cam:hover, .nutri-btn-upload:hover { transform: translateY(-1px); }

        .nutri-result {
          background: rgba(255,255,255,0.97); border-radius: 16px; padding: 1.25rem 1.5rem;
          border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 4px 20px rgba(68,152,202,0.08);
        }
        .nutri-result-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
        .nutri-result-img { font-size: 2.5rem; }
        .nutri-result-title { font-size: 0.95rem; font-weight: 700; color: #1a3a50; }
        .nutri-result-sub { font-size: 0.7rem; color: #94a3b8; margin-top: 0.2rem; }
        .nutri-rescan {
          margin-left: auto; padding: 0.4rem 0.9rem; border-radius: 9px; border: 1.5px solid rgba(68,152,202,0.2);
          background: transparent; color: #4498ca; font-size: 0.75rem; font-weight: 600; cursor: pointer;
        }

        .nutri-patterns { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
        .nutri-pattern-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.65rem 0.85rem; border-radius: 10px; background: rgba(248,250,252,0.8);
          border: 1px solid rgba(203,213,225,0.3);
        }
        .nutri-pattern-left { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; min-width: 160px; }
        .nutri-tag {
          font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 5px;
        }
        .nutri-tag-gut { background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); }
        .nutri-tag-mittel { background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
        .nutri-tag-schlecht { background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
        .nutri-pattern-label { font-size: 0.78rem; font-weight: 600; color: #334155; }
        .nutri-pattern-note { font-size: 0.72rem; color: #64748b; line-height: 1.4; }

        .nutri-science-note {
          display: flex; align-items: flex-start; gap: 0.5rem;
          font-size: 0.68rem; color: #94a3b8; line-height: 1.5; font-style: italic;
          padding: 0.65rem 0.85rem; background: rgba(248,250,252,0.8); border-radius: 9px;
          border: 1px solid rgba(203,213,225,0.3); margin-bottom: 1.25rem;
        }
        .nutri-history-title { font-size: 0.82rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.6rem; }
        .nutri-history { display: flex; flex-direction: column; gap: 0.45rem; }
        .nutri-history-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.55rem 0.8rem; border-radius: 9px;
          background: rgba(248,250,252,0.7); border: 1px solid rgba(203,213,225,0.25);
        }
        .nhrow-meta { flex-shrink: 0; }
        .nhrow-date { font-size: 0.65rem; color: #94a3b8; display: block; }
        .nhrow-label { font-size: 0.75rem; font-weight: 600; color: #334155; }
        .nhrow-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
        .nhrow-tag { font-size: 0.62rem; padding: 0.12rem 0.4rem; border-radius: 5px; background: rgba(68,152,202,0.08); color: #4498ca; font-weight: 600; }

        /* REWARDS */
        .rewards-section { display: flex; flex-direction: column; gap: 1.25rem; }

        .level-card {
          display: flex; align-items: center; gap: 1.5rem;
          background: linear-gradient(135deg, rgba(68,152,202,0.08), rgba(44,106,140,0.05));
          border: 1.5px solid rgba(68,152,202,0.2); border-radius: 16px; padding: 1.5rem;
        }
        .level-badge-big {
          padding: 0.6rem 1.2rem; border-radius: 12px;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 1rem; font-weight: 800; letter-spacing: 0.03em; white-space: nowrap; flex-shrink: 0;
        }
        .level-info { flex: 1; }
        .level-name { font-size: 1.1rem; font-weight: 700; color: #1a3a50; }
        .level-desc { font-size: 0.78rem; color: #64748b; margin: 0.3rem 0 0.7rem; }
        .level-bar-track { width: 100%; height: 8px; background: rgba(68,152,202,0.1); border-radius: 4px; overflow: hidden; }
        .level-bar-fill { height: 100%; background: linear-gradient(90deg, #4498ca, #2c6a8c); border-radius: 4px; animation: progressGrow 1s ease-out; }
        @keyframes progressGrow { from { width: 0 !important; } }
        .level-bar-label { font-size: 0.68rem; color: #94a3b8; margin-top: 0.35rem; }

        .week-chart-card {
          background: rgba(255,255,255,0.97); border-radius: 16px; padding: 1.25rem 1.5rem;
          border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 4px 20px rgba(68,152,202,0.08);
        }
        .wcc-title { font-size: 0.85rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.2rem; }
        .wcc-total { font-size: 0.72rem; color: #64748b; margin-bottom: 1rem; }
        .week-bars { display: flex; align-items: flex-end; gap: 0.6rem; height: 110px; }
        .week-bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 0.2rem; }
        .wb-bar-wrap { position: relative; display: flex; align-items: flex-end; justify-content: center; height: 80px; }
        .wb-bar { width: 100%; border-radius: 4px 4px 0 0; min-height: 4px; transition: height 0.5s ease; }
        .wb-goal-star { position: absolute; top: -16px; font-size: 0.75rem; color: #4498ca; }
        .wb-day { font-size: 0.65rem; color: #94a3b8; font-weight: 500; }
        .wb-val { font-size: 0.7rem; font-weight: 700; color: #4498ca; }

        .rewards-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem; }
        .reward-stat-card {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          background: rgba(255,255,255,0.97); border-radius: 14px; padding: 1rem 0.75rem;
          border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 3px 12px rgba(68,152,202,0.07);
          text-align: center;
        }
        .rsc-icon { font-size: 1.4rem; }
        .rsc-value { font-size: 1.2rem; font-weight: 700; color: #1a3a50; }
        .rsc-label { font-size: 0.72rem; font-weight: 600; color: #475569; }
        .rsc-sub { font-size: 0.65rem; color: #94a3b8; }

        .achievements-card { background: rgba(255,255,255,0.97); border-radius: 16px; padding: 1.25rem 1.5rem; border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 4px 20px rgba(68,152,202,0.08); }
        .ac-title { font-size: 0.85rem; font-weight: 700; color: #1a3a50; margin-bottom: 1rem; }
        .achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 0.7rem; }
        .achievement-item {
          display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
          padding: 0.85rem 0.5rem; border-radius: 12px; border: 1.5px solid rgba(203,213,225,0.4);
          background: rgba(248,250,252,0.8); position: relative; text-align: center;
        }
        .achievement-item.unlocked { border-color: rgba(68,152,202,0.3); background: rgba(68,152,202,0.05); }
        .ach-icon { font-size: 1.5rem; }
        .ach-label { font-size: 0.72rem; font-weight: 600; color: #334155; }
        .ach-progress { font-size: 0.65rem; color: #94a3b8; }
        .ach-check { position: absolute; top: 0.4rem; right: 0.4rem; width: 16px; height: 16px; border-radius: 50%; background: #4498ca; color: white; font-size: 0.55rem; display: flex; align-items: center; justify-content: center; }

        /* TRENDS */
        .trends-section { display: flex; flex-direction: column; gap: 1.25rem; }

        .nba-card { background: rgba(255,255,255,0.97); border-radius: 16px; padding: 1.25rem 1.5rem; border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 4px 20px rgba(68,152,202,0.08); }
        .nba-title { font-size: 0.88rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.85rem; }
        .nba-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .nba-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem 0.85rem; border-radius: 10px; border-left: 3px solid transparent; }
        .nba-high { background: rgba(239,68,68,0.05); border-left-color: #ef4444; }
        .nba-medium { background: rgba(245,158,11,0.05); border-left-color: #f59e0b; }
        .nba-low { background: rgba(68,152,202,0.05); border-left-color: #4498ca; }
        .nba-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
        .nba-high .nba-dot { background: #ef4444; }
        .nba-medium .nba-dot { background: #f59e0b; }
        .nba-low .nba-dot { background: #4498ca; }
        .nba-content { flex: 1; }
        .nba-action { font-size: 0.82rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.2rem; }
        .nba-why { font-size: 0.72rem; color: #64748b; line-height: 1.4; }
        .nba-right { text-align: right; flex-shrink: 0; }
        .nba-impact { display: block; font-size: 0.75rem; font-weight: 700; color: #4498ca; }
        .nba-area { display: block; font-size: 0.65rem; color: #94a3b8; margin-top: 0.2rem; }

        .trend-charts-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .trend-chart-card { background: rgba(255,255,255,0.97); border-radius: 14px; padding: 1rem 1.1rem; border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 3px 12px rgba(68,152,202,0.07); }
        .tcc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem; }
        .tcc-label { font-size: 0.75rem; font-weight: 600; color: #475569; }
        .tcc-trend { font-size: 0.72rem; font-weight: 700; }
        .tcc-current { font-size: 1.5rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.5rem; }
        .tcc-svg { width: 100%; height: 60px; display: block; }
        .tcc-days { display: flex; justify-content: space-between; margin-top: 0.3rem; }
        .tcc-days span { font-size: 0.55rem; color: #94a3b8; }

        .reports-section { }
        .rep-title { font-size: 0.88rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.85rem; }
        .report-card { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.1rem; border-radius: 12px; background: rgba(255,255,255,0.97); border: 1.5px solid rgba(255,255,255,0.9); box-shadow: 0 3px 12px rgba(68,152,202,0.06); margin-bottom: 0.6rem; }
        .rc-left { flex: 1; }
        .rc-month { font-size: 0.85rem; font-weight: 700; color: #1a3a50; margin-bottom: 0.4rem; }
        .rc-highlights { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .rc-highlight { font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 5px; background: rgba(68,152,202,0.08); color: #4498ca; font-weight: 600; }
        .rc-right { text-align: center; flex-shrink: 0; }
        .rc-score { font-size: 1.6rem; font-weight: 700; line-height: 1; }
        .rc-score-label { font-size: 0.65rem; color: #94a3b8; }
        .rc-btn { display: flex; align-items: center; padding: 0.45rem 0.85rem; border-radius: 8px; border: 1.5px solid rgba(68,152,202,0.2); background: transparent; color: #4498ca; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .rc-btn:hover { background: rgba(68,152,202,0.08); }

        @media (max-width: 1000px) {
          .rewards-stats { grid-template-columns: repeat(2, 1fr); }
          .trend-charts-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .entw-page { padding: 1rem; }
          .entw-tabs { flex-wrap: wrap; }
          .lib-search-row { flex-direction: column; }
          .voice-input-bar { width: 100%; }
          .measure-row-main { gap: 0.5rem; }
          .nutri-pattern-left { min-width: 120px; }
          .measure-detail-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
