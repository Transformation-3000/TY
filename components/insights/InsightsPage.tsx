'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState('Alle');

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h1 className="insights-title">Inspiration & Wissen</h1>
        <p className="insights-subtitle">Entdecke neue Wege für deine Langlebigkeit</p>
      </div>

      <div className="insights-categories">
        {['Alle', 'Ernährung', 'Schlaf', 'Bewegung', 'Mindset', 'Wissenschaft'].map(cat => (
          <button 
            key={cat} 
            className={`cat-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="insights-grid">
        <div className="insight-card large">
          <div className="insight-image">
            <Image src="/images/longevity_sphere_final.png" fill alt="Inspiration" style={{ objectFit: 'cover' }} />
            <div className="insight-tag">Neu</div>
          </div>
          <div className="insight-body">
            <h2 className="insight-card-title">Das Geheimnis der Blue Zones</h2>
            <p className="insight-card-desc">Warum Menschen in bestimmten Regionen der Welt über 100 Jahre alt werden und dabei gesund bleiben.</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-image">
            <Image src="/images/photo_meditation.png" fill alt="Mindset" style={{ objectFit: 'cover' }} />
          </div>
          <div className="insight-body">
            <h2 className="insight-card-title">Meditation & Telomere</h2>
            <p className="insight-card-desc">Wie regelmäßige Achtsamkeit deine Zellen auf biologischer Ebene schützt.</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-image">
            <Image src="/images/photo_sunflower.png" fill alt="Vitalität" style={{ objectFit: 'cover' }} />
          </div>
          <div className="insight-body">
            <h2 className="insight-card-title">Spermidin: Zell-Recycling</h2>
            <p className="insight-card-desc">Alles über Autophagie und wie du sie durch Ernährung aktivieren kannst.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .insights-container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
        .insights-header { margin-bottom: 2.5rem; }
        .insights-title { font-size: 2.2rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; }
        .insights-subtitle { font-size: 1.1rem; color: #64748b; }

        .insights-categories { display: flex; gap: 0.75rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .cat-pill {
          padding: 0.6rem 1.25rem; border-radius: 100px; border: 1px solid #e2e8f0;
          background: #fff; color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .cat-pill:hover { border-color: #4498ca; color: #4498ca; }
        .cat-pill.active { background: #4498ca; color: #fff; border-color: #4498ca; }

        .insights-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        .insight-card {
          background: #fff; border-radius: 24px; overflow: hidden;
          border: 1px solid #f1f5f9; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: transform 0.3s;
        }
        .insight-card:hover { transform: translateY(-5px); }
        .insight-card.large { grid-column: span 2; display: flex; }
        
        .insight-image { position: relative; height: 240px; min-width: 300px; width: 100%; }
        .insight-card.large .insight-image { height: 320px; flex: 1.2; }
        .insight-card.large .insight-body { flex: 1; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center; }
        
        .insight-tag {
          position: absolute; top: 1.25rem; left: 1.25rem;
          background: #4498ca; color: #fff; padding: 0.4rem 1rem;
          border-radius: 100px; font-size: 0.8rem; font-weight: 700;
        }
        
        .insight-body { padding: 1.5rem; }
        .insight-card-title { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin-bottom: 0.75rem; }
        .insight-card-desc { font-size: 1rem; color: #64748b; line-height: 1.6; }
      `}</style>
    </div>
  );
}
