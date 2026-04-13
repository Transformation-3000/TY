'use client';

import { useState } from 'react';
import Image from 'next/image';
import ReelsFocusView from './ReelsFocusView';

type Tab = 'experten' | 'science' | 'events' | 'hacks' | 'gespeichert';

interface Reel {
  id: string;
  category: Tab;
  title: string;
  teaser: string;
  fullText: string;
  author: string;
  role: string;
  readTime: string;
  image: string;
  tag: string;
  tagColor: string;
  videoSrc?: string;
  saved?: boolean;
}

const reels: Reel[] = [
  {
    id: 'r1', category: 'experten',
    title: 'Warum Schlaf das mächtigste Longevity-Tool ist',
    teaser: 'Prof. Dr. Walker erklärt, wie 7–9 Stunden Schlaf Telomere schützt und die biologische Uhr verlangsamt.',
    fullText: 'Während des Schlafs repariert der Körper DNA-Schäden, leert das glymphatische System (Abfallentsorgung im Gehirn) und reguliert Entzündungsmarker. Chronischer Schlafmangel – bereits unter 6 Stunden – erhöht das Alzheimer-Risiko um bis zu 40%. Die Lösung: Schlafroutine, kühle Raumtemperatur (18–19°C) und vollständige Dunkelheit.',
    author: 'Prof. Dr. Matthew Walker', role: 'Schlafforscher, UC Berkeley', readTime: '3 Min', image: '/images/woman3.png', tag: 'EXPERTE', tagColor: '#4498ca', videoSrc: '/videos/reels/reel1.mp4', saved: true,
  },
  {
    id: 'r2', category: 'science',
    title: 'Intermittierendes Fasten & Autophagie: Was sagt die Forschung?',
    teaser: 'Neue Metaanalyse mit 47 Studien zeigt: 16:8-Fasten reduziert Entzündungsmarker um durchschnittlich 28%.',
    fullText: 'Autophagie – der zelluläre Reinigungsprozess – wird durch Fastenperioden massiv aktiviert. Bei 16:8 beginnt die Autophagie nach 12–14 Stunden ohne Nahrung. Wichtig: Kaffee (schwarz) und Wasser brechen das Fasten nicht. Voraussichtlich größter Benefit bei Kombination mit Krafttraining am Ende des Fastenfensters.',
    author: 'Nature Aging Journal', role: 'Peer-reviewed, 2024', readTime: '4 Min', image: '/images/woman3.png', tag: 'STUDIE', tagColor: '#22c55e', videoSrc: '/videos/reels/reel2.mp4', saved: false,
  },
  {
    id: 'r3', category: 'hacks',
    title: 'Cold Exposure: Der 2-Minuten-Protokoll',
    teaser: 'Tägliche 2-Minuten Kaltdusche erhöht Dopamin um bis zu 250% – laut Stanford-Studie anhaltend für mehrere Stunden.',
    fullText: 'Das Protokoll: Beginne mit 30 Sekunden kaltem Wasser am Ende deiner normalen Dusche. Steigere auf 2 Minuten in 2 Wochen. Optimal ist 14°C. Die neurochemischen Effekte: massiver Norepinephrin-Anstieg (+300%), nachhaltiger Dopaminanstieg, verbesserte Stimmung. Achtung: Nicht unmittelbar nach dem Aufwachen – erst nach 90 Minuten für optimale Cortisol-Nutzung.',
    author: 'Dr. Andrew Huberman', role: 'Neurowissenschaft, Stanford', readTime: '2 Min', image: '/images/woman3.png', tag: 'HACK', tagColor: '#f59e0b', saved: false,
  },
  {
    id: 'r4', category: 'events',
    title: 'Live-Event: Longevity & Biohacking 2025',
    teaser: 'Exklusiver Expert-Talk mit Dr. Peter Attia und Prof. Valter Longo. Nur für TrueYears Premium.',
    fullText: 'Am 15. März um 19:00 Uhr: Live Q&A mit zwei der weltweit führenden Longevity-Forscher. Thema: Praktische Protokolle für das nächste Jahrzehnt. Fragen vorab einreichen via App. Aufzeichnung für alle Teilnehmer verfügbar. Limitiert auf 500 Plätze.',
    author: 'TrueYears Events', role: 'Live · 15. März 2025', readTime: '1 Min', image: '/images/woman3.png', tag: 'EVENT', tagColor: '#8b5cf6', saved: false,
  },
  {
    id: 'r5', category: 'science',
    title: 'Resveratrol & NMN: Update 2024',
    teaser: 'Landmark-Studie von Dr. Sinclair zeigt: NMN erhöht NAD+-Spiegel signifikant – aber der Timing-Faktor ist entscheidend.',
    fullText: 'NAD+ ist der zentrale Energieträger in Zellen und sinkt mit dem Alter. NMN (Nicotinamid-Mononukleotid) ist ein direkter Vorläufer. Optimales Timing: morgens mit Nahrung. Kombination mit Resveratrol aktiviert Sirtuine. Caveat: Qualitätsunterschiede bei Supplements sind massiv – nur kristallines NMN wählen.',
    author: 'Cell Metabolism, 2024', role: 'Harvard Medical School', readTime: '5 Min', image: '/images/woman3.png', tag: 'FORSCHUNG', tagColor: '#22c55e', saved: false,
  },
  {
    id: 'r6', category: 'experten',
    title: 'Zone 2 Training: Die unterschätzte Longevity-Waffe',
    teaser: 'Dr. Peter Attia: 3-4x Stunden Zone 2 pro Woche sind wichtiger als jedes Supplement für ein langes Leben.',
    fullText: 'Zone 2 (60-70% max. Herzfrequenz) trainiert die mitochondriale Effizienz. Praktisch: Du kannst dich noch unterhalten, aber bist leicht außer Atem. 45-60 Minuten pro Session. Beste Aktivitäten: zügiges Gehen, lockeres Radfahren, Rudern. Effekt auf Longevity: verbessert Insulinsensitivität, erhöht Mitochondriendichte, reduziert kardiovaskuläres Risiko.',
    author: 'Dr. Peter Attia', role: 'Longevity-Arzt & Autor', readTime: '4 Min', image: '/images/woman3.png', tag: 'EXPERTE', tagColor: '#4498ca', saved: true,
  },
  {
    id: 'r7', category: 'hacks',
    title: 'Morgenroutine: Die ersten 90 Minuten',
    teaser: 'Neurowissenschaft-basiertes Protokoll für maximale kognitive Performance und Hormonbalance den ganzen Tag.',
    fullText: 'Protokoll nach Dr. Huberman: 1. Kein Handy für 30 Min. 2. Tageslicht innerhalb von 30-60 Min nach Aufwachen (mind. 10 Min). 3. Wasser mit Salz & Zitrone (Elektrolyte). 4. Bewegung (Zone 2, 20-30 Min). 5. Kaffee erst nach 90 Min (Adenosin-Reset abwarten). Dieser Rhythmus synchronisiert Cortisol und setzt Dopamin optimal ein.',
    author: 'Dr. Andrew Huberman', role: 'Huberman Lab Podcast', readTime: '3 Min', image: '/images/woman3.png', tag: 'PROTOKOLL', tagColor: '#f59e0b', saved: false,
  },
];

const tabLabels: { id: Tab; label: string; icon: string }[] = [
  { id: 'experten', label: 'Experten', icon: 'bi-person-badge' },
  { id: 'science', label: 'Science', icon: 'bi-journal-medical' },
  { id: 'events', label: 'Events', icon: 'bi-calendar-event' },
  { id: 'hacks', label: 'Hacks', icon: 'bi-lightning-charge' },
  { id: 'gespeichert', label: 'Gespeichert', icon: 'bi-bookmark-fill' },
];

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('experten');
  const [savedIds, setSavedIds] = useState<string[]>(['r1', 'r6']);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusStartIdx, setFocusStartIdx] = useState(0);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const openFocus = (startIdx: number) => {
    setFocusStartIdx(startIdx);
    setFocusOpen(true);
  };

  const filteredReels = activeTab === 'gespeichert'
    ? reels.filter(r => savedIds.includes(r.id))
    : reels.filter(r => r.category === activeTab);

  const focusReels = reels.map(r => ({
    id: r.id,
    title: r.title,
    author: r.author,
    role: r.role,
    tag: r.tag,
    tagColor: r.tagColor,
    teaser: r.teaser,
    fullText: r.fullText,
    videoSrc: r.videoSrc,
    image: r.image,
  }));

  return (
    <div className="insights-page">
      {/* Focus View */}
      {focusOpen && (
        <ReelsFocusView
          reels={focusReels}
          startIndex={focusStartIdx}
          onClose={() => setFocusOpen(false)}
        />
      )}

      {/* Header */}
      <div className="ins-header">
        <div>
          <h1 className="ins-title">Insights</h1>
          <p className="ins-subtitle">Expertenwissen · Science · Events · Hacks</p>
        </div>
        <button className="ins-badge" onClick={() => openFocus(0)} title="Reels öffnen">
          <i className="bi bi-play-circle-fill" style={{ color: '#4498ca', marginRight: '0.4rem' }} />
          Reels Format
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="ins-tabs">
        {tabLabels.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`ins-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`bi ${tab.icon}`} />
            <span>{tab.label}</span>
            {tab.id === 'gespeichert' && savedIds.length > 0 && (
              <span className="ins-tab-count">{savedIds.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Reels Grid */}
      {filteredReels.length === 0 ? (
        <div className="ins-empty">
          <i className="bi bi-bookmark" style={{ fontSize: '2rem', color: '#cbd5e1' }} />
          <p>Noch nichts gespeichert. Tippe auf das Lesezeichen-Icon, um Inhalte zu speichern.</p>
        </div>
      ) : (
        <div className="reels-grid">
          {filteredReels.map(reel => {
            const globalIdx = reels.findIndex(r => r.id === reel.id);
            return (
            <div key={reel.id} className={`reel-card ${expandedId === reel.id ? 'expanded' : ''}`}>
              {/* Thumbnail */}
              <div className="reel-thumb" onClick={() => openFocus(globalIdx)} style={{ cursor: 'pointer' }}>
                <Image src={reel.image} alt={reel.title} fill style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
                <div className="reel-thumb-overlay" />
                <span className="reel-tag" style={{ background: reel.tagColor }}>{reel.tag}</span>
                {/* Play button overlay */}
                <div className="reel-play-overlay">
                  <div className="reel-play-btn">
                    <i className={`bi ${reel.videoSrc ? 'bi-play-fill' : 'bi-book-fill'}`} />
                  </div>
                </div>
                <button
                  className={`reel-save-btn ${savedIds.includes(reel.id) ? 'saved' : ''}`}
                  onClick={e => { e.stopPropagation(); toggleSave(reel.id); }}
                  title={savedIds.includes(reel.id) ? 'Gespeichert' : 'Speichern'}
                >
                  <i className={`bi ${savedIds.includes(reel.id) ? 'bi-heart-fill' : 'bi-heart'}`} />
                </button>
              </div>

              {/* Content */}
              <div className="reel-body">
                <div className="reel-author-row">
                  <Image src={reel.image} alt={reel.author} width={28} height={28} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  <div className="reel-author-info">
                    <span className="reel-author-name">{reel.author}</span>
                    <span className="reel-author-role">{reel.role}</span>
                  </div>
                  <span className="reel-read-time">
                    <i className="bi bi-clock" style={{ marginRight: '3px' }} />{reel.readTime}
                  </span>
                </div>

                <h3 className="reel-title">{reel.title}</h3>
                <p className="reel-teaser">{reel.teaser}</p>

                {expandedId === reel.id && (
                  <div className="reel-full-text">
                    <p>{reel.fullText}</p>
                  </div>
                )}

                <div className="reel-footer">
                  <button
                    className="reel-deepdive-btn"
                    onClick={() => setExpandedId(expandedId === reel.id ? null : reel.id)}
                  >
                    {expandedId === reel.id ? (
                      <><i className="bi bi-chevron-up" /> Weniger anzeigen</>
                    ) : (
                      <><i className="bi bi-book" /> Deep Dive lesen</>
                    )}
                  </button>
                  <button className="reel-share-btn">
                    <i className="bi bi-share" />
                  </button>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      )}

      <style jsx>{`
        .insights-page {
          padding: 1.5rem 2rem 3rem;
          min-height: calc(100vh - 80px);
          background: linear-gradient(145deg, #f8fcff 0%, #eef6fb 50%, #f0fdfa 100%);
        }

        .ins-header {
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem;
        }
        .ins-title { font-size: 1.75rem; font-weight: 700; color: #1a3a50; margin: 0; }
        .ins-subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.2rem 0 0; }
        .ins-badge {
          display: flex; align-items: center; padding: 0.4rem 0.85rem; border-radius: 20px;
          background: rgba(68,152,202,0.1); border: 1px solid rgba(68,152,202,0.2);
          font-size: 0.75rem; font-weight: 600; color: #4498ca;
          cursor: pointer; transition: all 0.2s;
        }
        .ins-badge:hover {
          background: rgba(68,152,202,0.18);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(68,152,202,0.2);
        }

        .reel-play-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
        }
        .reel-thumb:hover .reel-play-overlay { opacity: 1; }
        .reel-play-btn {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; color: #006ea7;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          transform: scale(0.85); transition: transform 0.2s;
        }
        .reel-thumb:hover .reel-play-btn { transform: scale(1); }

        .ins-tabs {
          display: flex; gap: 0.4rem; margin-bottom: 1.5rem;
          border-bottom: 2px solid rgba(68,152,202,0.08); padding-bottom: 0;
          overflow-x: auto; scrollbar-width: none;
        }
        .ins-tabs::-webkit-scrollbar { display: none; }
        .ins-tab {
          display: flex; align-items: center; gap: 0.35rem; padding: 0.6rem 1rem;
          border: none; background: transparent; cursor: pointer; border-radius: 8px 8px 0 0;
          font-size: 0.82rem; font-weight: 500; color: #64748b; white-space: nowrap;
          transition: all 0.2s; position: relative; bottom: -2px;
        }
        .ins-tab.active {
          color: #4498ca; font-weight: 700;
          border-bottom: 2.5px solid #4498ca; background: rgba(68,152,202,0.05);
        }
        .ins-tab:hover:not(.active) { color: #4498ca; background: rgba(68,152,202,0.04); }
        .ins-tab-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 18px; height: 18px; border-radius: 50%;
          background: #4498ca; color: white; font-size: 0.65rem; font-weight: 700;
        }

        .ins-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1rem; padding: 4rem 2rem; color: #94a3b8; text-align: center;
        }

        .reels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .reel-card {
          background: rgba(255,255,255,0.97); border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(68,152,202,0.08), 0 2px 8px rgba(0,0,0,0.04);
          border: 1.5px solid rgba(255,255,255,0.9); transition: all 0.25s;
        }
        .reel-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(68,152,202,0.14), 0 4px 12px rgba(0,0,0,0.06);
        }
        .reel-card.expanded { box-shadow: 0 12px 40px rgba(68,152,202,0.18); }

        .reel-thumb {
          position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; flex-shrink: 0;
        }
        .reel-thumb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
        }
        .reel-tag {
          position: absolute; top: 0.75rem; left: 0.75rem;
          padding: 0.2rem 0.55rem; border-radius: 6px;
          font-size: 0.62rem; font-weight: 800; color: white; letter-spacing: 0.06em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .reel-save-btn {
          position: absolute; top: 0.65rem; right: 0.75rem;
          width: 32px; height: 32px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 0.85rem; color: #64748b; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .reel-save-btn.saved { color: #ef4444; background: rgba(239,68,68,0.12); }
        .reel-save-btn:hover { transform: scale(1.1); }

        .reel-body { padding: 1rem 1.15rem 0.85rem; }

        .reel-author-row {
          display: flex; align-items: center; gap: 0.55rem; margin-bottom: 0.65rem;
        }
        .reel-author-info { flex: 1; min-width: 0; }
        .reel-author-name { display: block; font-size: 0.75rem; font-weight: 700; color: #1a3a50; line-height: 1.2; }
        .reel-author-role { display: block; font-size: 0.65rem; color: #94a3b8; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .reel-read-time { font-size: 0.65rem; color: #94a3b8; white-space: nowrap; flex-shrink: 0; }

        .reel-title {
          font-size: 0.9rem; font-weight: 700; color: #1a3a50;
          margin: 0 0 0.45rem; line-height: 1.35;
        }
        .reel-teaser {
          font-size: 0.78rem; color: #475569; line-height: 1.5; margin: 0 0 0.85rem;
        }

        .reel-full-text {
          padding: 0.85rem; margin-bottom: 0.85rem;
          background: rgba(68,152,202,0.04); border-radius: 10px;
          border-left: 3px solid #4498ca; animation: slideDown 0.25s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .reel-full-text p { font-size: 0.78rem; color: #334155; line-height: 1.65; margin: 0; }

        .reel-footer { display: flex; align-items: center; gap: 0.5rem; }
        .reel-deepdive-btn {
          display: flex; align-items: center; gap: 0.35rem;
          padding: 0.45rem 0.85rem; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; flex: 1;
        }
        .reel-deepdive-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(68,152,202,0.3); }
        .reel-share-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid rgba(68,152,202,0.2);
          background: transparent; color: #4498ca; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .reel-share-btn:hover { background: rgba(68,152,202,0.08); }

        @media (max-width: 768px) {
          .insights-page { padding: 1rem; }
          .reels-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
