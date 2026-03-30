'use client';

import { useState } from 'react';

type SubTab = 'tracker' | 'rewards' | 'trends';

interface Activity {
  id: string;
  icon: string;
  label: string;
  stars: number;
  category: string;
  duration?: string;
  science: string;
}

const activities: Activity[] = [
  { id: 'a1', icon: '🚶', label: 'Spazieren gehen', stars: 1, category: 'Bewegung', duration: '20 Min', science: 'Senkt Cortisol, fördert Kreativität' },
  { id: 'a2', icon: '🏋️', label: 'Krafttraining', stars: 2, category: 'Bewegung', duration: '45 Min', science: 'Erhöht mTOR, Muskelproteinsynthese' },
  { id: 'a3', icon: '🧘', label: 'Meditation', stars: 1, category: 'Selbstfürsorge', duration: '10 Min', science: 'Reduziert Amygdala-Aktivität, -28% Cortisol' },
  { id: 'a4', icon: '💧', label: '2,5 L Wasser', stars: 1, category: 'Vitalität', science: 'Optimale Zellfunktion, Detox' },
  { id: 'a5', icon: '🥗', label: 'Gemüse & Protein', stars: 1, category: 'Ernährung', science: 'Antioxidantien, Aminosäuren für Reparatur' },
  { id: 'a6', icon: '☀️', label: 'Tageslicht morgens', stars: 1, category: 'Erholung', duration: '10 Min', science: 'Cortisol-Rhythmus, Melatonin-Reset' },
  { id: 'a7', icon: '🛁', label: 'Sauna / Wärme', stars: 2, category: 'Erholung', duration: '20 Min', science: 'HSP-Proteine, kardiovaskuläre Gesundheit' },
  { id: 'a8', icon: '🚴', label: 'Zone 2 Cardio', stars: 2, category: 'Bewegung', duration: '40 Min', science: 'Mitochondriendichte, Insulinsensitivität' },
  { id: 'a9', icon: '📵', label: 'Digitale Auszeit', stars: 1, category: 'Selbstfürsorge', duration: '1 Std', science: 'Dopamin-Reset, fokussiertes Denken' },
  { id: 'a10', icon: '🐟', label: 'Omega-3 eingenommen', stars: 1, category: 'Vitalität', science: 'EPA/DHA: Entzündungshemmend, Neuroprotektiv' },
  { id: 'a11', icon: '🌡️', label: 'Kaltdusche', stars: 2, category: 'Vitalität', duration: '2 Min', science: '+250% Dopamin, Norepinephrin-Boost' },
  { id: 'a12', icon: '📖', label: 'Lesen / Lernen', stars: 1, category: 'Selbstfürsorge', duration: '20 Min', science: 'Neuroplastizität, kognitive Reserve' },
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
  const [activeTab, setActiveTab] = useState<SubTab>('tracker');
  const [checkedActivities, setCheckedActivities] = useState<string[]>(['a1', 'a4', 'a6']);
  const [starAnim, setStarAnim] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('Alle');

  const categories = ['Alle', 'Bewegung', 'Erholung', 'Vitalität', 'Selbstfürsorge', 'Ernährung'];

  const toggleActivity = (id: string) => {
    if (!checkedActivities.includes(id)) {
      setStarAnim(id);
      setTimeout(() => setStarAnim(null), 700);
    }
    setCheckedActivities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const todayStars = checkedActivities.reduce((sum, id) => {
    const act = activities.find(a => a.id === id);
    return sum + (act?.stars || 0);
  }, 0);

  const filteredActivities = filterCategory === 'Alle'
    ? activities
    : activities.filter(a => a.category === filterCategory);

  const streakDays = 5;
  const weeklyStars = weekData.reduce((s, d) => s + d.stars, 0);

  return (
    <div className="entw-page">
      {/* Header */}
      <div className="entw-header">
        <div>
          <h1 className="entw-title">Entwicklung</h1>
          <p className="entw-subtitle">Activity Tracker · Rewards · Trends</p>
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
          { id: 'tracker', label: 'Activity Tracker', icon: 'bi-check2-square' },
          { id: 'rewards', label: 'Rewards', icon: 'bi-trophy' },
          { id: 'trends', label: 'Trends & Reports', icon: 'bi-graph-up' },
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

      {/* ── ACTIVITY TRACKER ── */}
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
                <div className="tpc-bar-fill" style={{ width: `${Math.min((todayStars / 7) * 100, 100)}%` }} />
              </div>
              <div className="tpc-goal">Tagesziel: 7 Sterne</div>
            </div>
            <div className="tpc-right">
              <span className="tpc-streak">🔥 {streakDays} Tage</span>
              <span className="tpc-streak-label">Streak</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="tracker-filter">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`filter-chip ${filterCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Activity Grid */}
          <div className="activity-grid">
            {filteredActivities.map(act => {
              const isDone = checkedActivities.includes(act.id);
              const isAnimating = starAnim === act.id;
              return (
                <div
                  key={act.id}
                  className={`activity-card ${isDone ? 'done' : ''}`}
                  onClick={() => toggleActivity(act.id)}
                >
                  {isAnimating && (
                    <div className="star-burst">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="star-particle" style={{ '--i': i } as React.CSSProperties}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="#4498ca">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="act-top">
                    <span className="act-icon">{act.icon}</span>
                    <div className={`act-check ${isDone ? 'checked' : ''}`}>
                      {isDone && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="act-label">{act.label}</div>
                  {act.duration && <div className="act-duration">{act.duration}</div>}
                  <div className="act-science">{act.science}</div>
                  <div className="act-stars-row">
                    {Array.from({ length: act.stars }).map((_, i) => (
                      <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={isDone ? '#4498ca' : '#cbd5e1'} style={{ filter: isDone ? 'drop-shadow(0 0 2px rgba(68,152,202,0.6))' : 'none', transition: 'all 0.3s' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="act-star-label">+{act.stars} ★</span>
                  </div>
                  <span className={`act-category-tag cat-${act.category.toLowerCase()}`}>{act.category}</span>
                </div>
              );
            })}
          </div>

          {/* Voice Input */}
          <div className="voice-input-bar">
            <i className="bi bi-mic-fill" style={{ color: '#4498ca', fontSize: '1.1rem' }} />
            <span className="voice-placeholder">„Ich war heute 30 Minuten joggen..." – Aktivität per Stimme eintragen</span>
            <button className="voice-btn">Sprechen</button>
          </div>
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

        .entw-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
        .entw-tab {
          display: flex; align-items: center; gap: 0.45rem; padding: 0.6rem 1.15rem;
          border-radius: 10px; border: 1.5px solid rgba(68,152,202,0.12);
          background: rgba(255,255,255,0.8); color: #64748b;
          font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .entw-tab.active { background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(68,152,202,0.25); }
        .entw-tab:hover:not(.active) { border-color: rgba(68,152,202,0.3); color: #4498ca; }

        /* TRACKER */
        .tracker-section { display: flex; flex-direction: column; gap: 1.25rem; }

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

        .tracker-filter { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .filter-chip {
          padding: 0.35rem 0.75rem; border-radius: 20px; border: 1.5px solid rgba(68,152,202,0.15);
          background: rgba(255,255,255,0.8); color: #64748b; font-size: 0.75rem; font-weight: 500; cursor: pointer; transition: all 0.2s;
        }
        .filter-chip.active { background: rgba(68,152,202,0.12); color: #4498ca; border-color: rgba(68,152,202,0.3); font-weight: 700; }

        .activity-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.85rem;
        }
        .activity-card {
          position: relative; background: rgba(255,255,255,0.95); border-radius: 14px;
          padding: 0.9rem 0.95rem; border: 1.5px solid rgba(203,213,225,0.5);
          cursor: pointer; transition: all 0.2s; overflow: hidden;
        }
        .activity-card:hover { border-color: rgba(68,152,202,0.3); box-shadow: 0 4px 14px rgba(68,152,202,0.1); transform: translateY(-2px); }
        .activity-card.done { background: rgba(68,152,202,0.05); border-color: rgba(68,152,202,0.25); }

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

        .act-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
        .act-icon { font-size: 1.4rem; line-height: 1; }
        .act-check {
          width: 20px; height: 20px; border-radius: 6px; border: 2px solid #cbd5e1;
          background: transparent; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .act-check.checked { background: #4498ca; border-color: #4498ca; }
        .act-label { font-size: 0.8rem; font-weight: 700; color: #1a3a50; line-height: 1.25; margin-bottom: 0.2rem; }
        .act-duration { font-size: 0.68rem; color: #94a3b8; margin-bottom: 0.3rem; }
        .act-science { font-size: 0.65rem; color: #64748b; line-height: 1.4; margin-bottom: 0.5rem; }
        .act-stars-row { display: flex; align-items: center; gap: 3px; margin-bottom: 0.4rem; }
        .act-star-label { font-size: 0.62rem; font-weight: 700; color: #4498ca; margin-left: 4px; }
        .act-category-tag {
          display: inline-block; font-size: 0.6rem; font-weight: 700; padding: 0.15rem 0.45rem;
          border-radius: 4px; letter-spacing: 0.04em; text-transform: uppercase;
          background: rgba(68,152,202,0.1); color: #4498ca;
        }

        .voice-input-bar {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.85rem 1.1rem; border-radius: 12px; cursor: pointer;
          background: rgba(255,255,255,0.8); border: 2px dashed rgba(68,152,202,0.25);
          transition: all 0.2s;
        }
        .voice-input-bar:hover { border-color: rgba(68,152,202,0.5); background: rgba(255,255,255,0.95); }
        .voice-placeholder { flex: 1; font-size: 0.8rem; color: #94a3b8; font-style: italic; }
        .voice-btn {
          padding: 0.4rem 0.85rem; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
        }

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
          .activity-grid { grid-template-columns: repeat(2, 1fr); }
          .entw-tabs { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
