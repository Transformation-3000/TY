'use client';

import { useState } from 'react';

const principles = [
  { id: 1, title: 'Verantwortung', description: 'Wir übernehmen Verantwortung für unsere Lebenszeit: Langlebigkeit beginnt bei uns selbst. Wir handeln informiert und bewusst – jeden Tag.', icon: 'bi-heart-pulse-fill' },
  { id: 2, title: 'Weitsicht', description: 'Wir denken in Jahren – und handeln heute: Longevity ist kein Sprint, sondern ein intelligenter Marathon mit kleinen, klugen Entscheidungen.', icon: 'bi-hourglass-split' },
  { id: 3, title: 'Weisheit', description: 'Wir verbinden Wissenschaft mit Weisheit: Daten geben Orientierung, Erfahrung gibt Tiefe. Wir nutzen beides.', icon: 'bi-lightbulb-fill' },
  { id: 4, title: 'Ganzheit', description: 'Wir optimieren nicht nur den Körper – sondern das ganze Leben: Energie, Schlaf, Geist, Beziehungen und Sinn gehören zusammen.', icon: 'bi-infinity' },
  { id: 5, title: 'Kontinuität', description: 'Wir setzen auf Kontinuität statt Perfektion: Nicht der perfekte Tag zählt – sondern die Richtung.', icon: 'bi-compass-fill' },
  { id: 6, title: 'Gemeinschaft', description: 'Wir wachsen gemeinsam – nicht im Alleingang: Longevity entsteht im Austausch, im Spiegeln, im Miteinander. Gemeinschaft verstärkt diese Wirkung.', icon: 'bi-people-fill' },
  { id: 7, title: 'Lebensfreude', description: 'Wir gestalten Zukunft – voller Klarheit und lebendig: Longevity ist Lebensfreude mit Perspektive. Wir investieren nicht in Sorge vor dem Altern, sondern in Lust am Leben.', icon: 'bi-sun-fill' },
];

const topRanking = [
  { rank: 1, name: 'Alexander M.', score: 892, level: 7, avatar: 'AM' },
  { rank: 2, name: 'Sophie K.', score: 845, level: 7, avatar: 'SK' },
  { rank: 3, name: 'Thomas W.', score: 798, level: 6, avatar: 'TW' },
  { rank: 4, name: 'Maria L.', score: 756, level: 6, avatar: 'ML' },
  { rank: 5, name: 'Daniel F.', score: 721, level: 6, avatar: 'DF' },
  { rank: 6, name: 'Laura S.', score: 689, level: 5, avatar: 'LS' },
  { rank: 7, name: 'Michael B.', score: 654, level: 5, avatar: 'MB' },
  { rank: 8, name: 'Julia R.', score: 612, level: 5, avatar: 'JR' },
];

const experiments = [
  { id: '1', title: 'Koffein Cutoff', desc: 'nach 14:00 Uhr', icon: 'bi-cup-hot-fill' },
  { id: '2', title: 'Tageslicht am Morgen', desc: '10 Min.', icon: 'bi-sunrise-fill' },
  { id: '3', title: 'Evening-Screen Cutoff', desc: '60 Min. bildschirmfrei', icon: 'bi-phone-vibrate' },
  { id: '4', title: 'Walk-after-Meals', desc: '10 Min.', icon: 'bi-person-walking' },
  { id: '5', title: 'Protein-First Frühstück', desc: 'mit 30g+', icon: 'bi-egg-fried' },
  { id: '6', title: 'Alkohol-Pause', desc: '14 Tage', icon: 'bi-slash-circle' },
  { id: '7', title: 'Fiber-Boost', desc: 'mit 10g+ Ballaststoffe', icon: 'bi-tree-fill' },
  { id: '8', title: 'Hydration-Reset', desc: '500ml Wasser in 60 Min.', icon: 'bi-droplet-fill' },
  { id: '9', title: 'Magnesium-Abendroutine', desc: '1h vor dem Einschlafen', icon: 'bi-capsule' },
  { id: '10', title: 'Breathwork', desc: '3x 5 Min. täglich', icon: 'bi-wind' },
  { id: '11', title: 'Meal-Timing', desc: '3h+ vor Schlafengehen', icon: 'bi-clock-fill' },
];

const challenges = [
  { id: '1', title: '30 Tage Schlaf-Optimierung', desc: 'Verbessere deine Schlafqualität', participants: 247, progress: 45, active: true, icon: 'bi-moon-stars-fill' },
  { id: '2', title: 'Protein Challenge', desc: '30g Protein zum Frühstück', participants: 189, active: false, icon: 'bi-egg-fried' },
  { id: '3', title: 'Digital Detox Abend', desc: '60 Min. bildschirmfrei', participants: 312, active: false, icon: 'bi-phone-vibrate' },
];

export default function CommunityPage() {
  const [activeExperiments, setActiveExperiments] = useState<Set<string>>(new Set());
  const [hoveredPrinciple, setHoveredPrinciple] = useState<number | null>(null);
  const [currentExperiment, setCurrentExperiment] = useState(0);

  const toggleExperiment = (id: string) => {
    const newSet = new Set(activeExperiments);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setActiveExperiments(newSet);
  };

  const nextExperiment = () => {
    setCurrentExperiment((prev) => (prev + 1) % experiments.length);
  };

  const prevExperiment = () => {
    setCurrentExperiment((prev) => (prev - 1 + experiments.length) % experiments.length);
  };

  const currentExp = experiments[currentExperiment];

  return (
    <div className="community-page">
      {/* Leitprinzipien */}
      <div className="section">
        <div className="section-title">Leitprinzipien</div>
        <div className="principles-row">
          {principles.map((p) => (
            <div 
              key={p.id} 
              className="principle-chip"
              onMouseEnter={() => setHoveredPrinciple(p.id)}
              onMouseLeave={() => setHoveredPrinciple(null)}
            >
              <span className="principle-num">{p.id}</span>
              <span className="principle-title">{p.title}</span>
              {hoveredPrinciple === p.id && (
                <div className="principle-tooltip">
                  {p.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Zwei Spalten */}
      <div className="two-columns">
        {/* Challenges */}
        <div className="section">
          <div className="section-title">Challenges</div>
          <div className="list">
            {challenges.map((c) => (
              <div key={c.id} className={`list-item ${c.active ? 'active' : ''}`}>
                <div className="item-icon">
                  <i className={`bi ${c.icon}`}></i>
                </div>
                <div className="item-content">
                  <div className="item-title">{c.title}</div>
                  <div className="item-meta">
                    {c.participants} Teilnehmer
                    {c.active && <span className="tag-active">Aktiv · {c.progress}%</span>}
                  </div>
                </div>
                {!c.active && (
                  <button className="btn-secondary">Beitreten</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ranking */}
        <div className="section">
          <div className="section-title">Top 25 Ranking</div>
          
          {/* Mein Platz */}
          <div className="my-rank">
            <div className="my-rank-num">#12</div>
            <div className="my-rank-info">
              <span className="my-rank-label">Dein Platz</span>
              <span className="my-rank-stats">321 Punkte · Level 3</span>
            </div>
            <div className="my-rank-trend">↑ 5</div>
          </div>

          {/* Liste */}
          <div className="ranking-list">
            {topRanking.map((person) => (
              <div key={person.rank} className={`ranking-row ${person.rank <= 3 ? 'top-three' : ''}`}>
                <span className={`ranking-pos ${person.rank <= 3 ? 'medal' : ''}`}>{person.rank}</span>
                <div className="ranking-avatar">{person.avatar}</div>
                <span className="ranking-name">{person.name}</span>
                <span className="ranking-score">{person.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Experimente Karussell */}
      <div className="section experiments-section">
        <div className="section-header-row">
          <div className="section-title">Experimente</div>
          {activeExperiments.size > 0 && (
            <button className="btn-primary">
              {activeExperiments.size} Experiment{activeExperiments.size > 1 ? 'e' : ''} starten
            </button>
          )}
        </div>
        
        <div className="carousel">
          <button className="carousel-btn prev" onClick={prevExperiment}>
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <div className="carousel-content">
            <div className="carousel-indicator">
              {currentExperiment + 1} / {experiments.length}
            </div>
            
            <div 
              className={`carousel-card ${activeExperiments.has(currentExp.id) ? 'selected' : ''}`}
              onClick={() => toggleExperiment(currentExp.id)}
            >
              <div className="carousel-icon">
                <i className={`bi ${currentExp.icon}`}></i>
              </div>
              <div className="carousel-text">
                <h3>{currentExp.title}</h3>
                <p>{currentExp.desc}</p>
              </div>
              <div className="carousel-action">
                {activeExperiments.has(currentExp.id) ? (
                  <div className="check-badge">
                    <i className="bi bi-check-lg"></i>
                    Ausgewählt
                  </div>
                ) : (
                  <button className="btn-add">
                    <i className="bi bi-plus"></i>
                    Hinzufügen
                  </button>
                )}
              </div>
            </div>

            <div className="carousel-dots">
              {experiments.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`dot ${idx === currentExperiment ? 'active' : ''} ${activeExperiments.has(experiments[idx].id) ? 'selected' : ''}`}
                  onClick={() => setCurrentExperiment(idx)}
                />
              ))}
            </div>
          </div>
          
          <button className="carousel-btn next" onClick={nextExperiment}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <style jsx>{`
        .community-page {
          min-height: calc(100vh - 80px);
          background: #f8f9fa;
          padding: 1.5rem 2rem;
        }

        /* Section */
        .section {
          background: #fff;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          border: 1px solid #eee;
        }

        .section-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1rem;
        }

        .section-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .section-header-row .section-title {
          margin-bottom: 0;
        }

        /* Leitprinzipien */
        .principles-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .principle-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.7rem;
          background: #f5f5f5;
          border-radius: 6px;
          cursor: default;
          position: relative;
          transition: all 0.15s;
          border: 1px solid transparent;
        }

        .principle-chip:hover {
          background: #e8f4f8;
          border-color: #b8d4e3;
        }

        .principle-num {
          font-size: 0.65rem;
          font-weight: 600;
          color: #0d7377;
        }

        .principle-title {
          font-size: 0.75rem;
          font-weight: 500;
          color: #333;
        }

        .principle-tooltip {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          width: 280px;
          padding: 0.85rem;
          background: #14506c;
          color: #fff;
          font-size: 0.72rem;
          line-height: 1.5;
          border-radius: 8px;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }

        .principle-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #14506c;
        }

        /* Two Columns */
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .two-columns .section {
          margin-bottom: 0;
        }

        /* List */
        .list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #fafafa;
          border-radius: 8px;
          transition: all 0.15s;
          border: 1px solid transparent;
        }

        .list-item:hover {
          background: #f5f5f5;
        }

        .list-item.active {
          background: #e8f4f8;
          border-color: #b8d4e3;
        }

        .item-icon {
          width: 36px;
          height: 36px;
          background: #eee;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 0.95rem;
        }

        .list-item.active .item-icon {
          background: #14506c;
          color: #fff;
        }

        .item-content {
          flex: 1;
        }

        .item-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .item-meta {
          font-size: 0.7rem;
          color: #888;
          margin-top: 0.15rem;
        }

        .tag-active {
          margin-left: 0.5rem;
          color: #0d7377;
          font-weight: 600;
        }

        /* Buttons */
        .btn-secondary {
          padding: 0.4rem 0.75rem;
          background: transparent;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 500;
          color: #666;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-secondary:hover {
          background: #f5f5f5;
          border-color: #14506c;
          color: #14506c;
        }

        .btn-primary {
          padding: 0.5rem 1rem;
          background: #14506c;
          border: none;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #fff;
          cursor: pointer;
          transition: background 0.15s;
        }

        .btn-primary:hover {
          background: #0d7377;
        }

        /* My Rank */
        .my-rank {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%);
          border: 1px solid #b8d4e3;
          border-radius: 8px;
          margin-bottom: 0.75rem;
        }

        .my-rank-num {
          font-size: 1.1rem;
          font-weight: 700;
          color: #14506c;
        }

        .my-rank-info {
          flex: 1;
        }

        .my-rank-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: #14506c;
        }

        .my-rank-stats {
          font-size: 0.7rem;
          color: #5a8a9a;
        }

        .my-rank-trend {
          font-size: 0.75rem;
          font-weight: 600;
          color: #0d7377;
        }

        /* Ranking List */
        .ranking-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .ranking-row {
          display: flex;
          align-items: center;
          padding: 0.4rem 0.5rem;
          border-radius: 4px;
        }

        .ranking-row:hover {
          background: #fafafa;
        }

        .ranking-row.top-three {
          background: #fafafa;
        }

        .ranking-pos {
          width: 24px;
          font-size: 0.7rem;
          font-weight: 600;
          color: #999;
        }

        .ranking-pos.medal {
          color: #14506c;
          font-weight: 700;
        }

        .ranking-avatar {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          font-weight: 600;
          color: #14506c;
          margin-right: 0.5rem;
        }

        .ranking-row.top-three .ranking-avatar {
          background: linear-gradient(135deg, #14506c 0%, #0d7377 100%);
          color: #fff;
        }

        .ranking-name {
          flex: 1;
          font-size: 0.75rem;
          color: #333;
        }

        .ranking-score {
          font-size: 0.7rem;
          color: #888;
        }

        /* Experiments Carousel */
        .experiments-section {
          margin-top: 1.5rem;
          margin-bottom: 0;
        }

        .carousel {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .carousel-btn {
          width: 40px;
          height: 40px;
          background: #f5f5f5;
          border: 1px solid #eee;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s;
          color: #666;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .carousel-btn:hover {
          background: #14506c;
          border-color: #14506c;
          color: #fff;
        }

        .carousel-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .carousel-indicator {
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 0.75rem;
        }

        .carousel-card {
          width: 100%;
          max-width: 400px;
          padding: 1.5rem;
          background: #fafafa;
          border: 2px solid #eee;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .carousel-card:hover {
          border-color: #b8d4e3;
          background: #f5f5f5;
        }

        .carousel-card.selected {
          background: #e8f4f8;
          border-color: #14506c;
        }

        .carousel-icon {
          width: 60px;
          height: 60px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
          color: #14506c;
        }

        .carousel-card.selected .carousel-icon {
          background: #14506c;
          border-color: #14506c;
          color: #fff;
        }

        .carousel-text h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.3rem;
        }

        .carousel-text p {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
        }

        .carousel-action {
          margin-top: 1.25rem;
        }

        .btn-add {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: #fff;
          border: 1px solid #14506c;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #14506c;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-add:hover {
          background: #14506c;
          color: #fff;
        }

        .check-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: #14506c;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #fff;
        }

        .carousel-dots {
          display: flex;
          gap: 0.4rem;
          margin-top: 1rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #ddd;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s;
          padding: 0;
        }

        .dot:hover {
          background: #bbb;
        }

        .dot.active {
          background: #14506c;
          width: 20px;
          border-radius: 4px;
        }

        .dot.selected {
          background: #0d7377;
        }

        .dot.active.selected {
          background: #14506c;
        }

        /* Responsive */
        @media (max-width: 800px) {
          .two-columns {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 500px) {
          .community-page {
            padding: 1rem;
          }

          .carousel-card {
            padding: 1rem;
          }

          .carousel-btn {
            width: 32px;
            height: 32px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
