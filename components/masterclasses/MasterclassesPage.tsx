'use client';

import { useState } from 'react';

type ElementStatus = 'offen' | 'in-bearbeitung' | 'erledigt';

interface Kapitel {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  status: ElementStatus;
}

interface Masterclass {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
  kapitelCount: number;
  progress: number;
  status: 'verfügbar' | 'coming-soon' | 'gesperrt';
}

const schlafKapitel: Kapitel[] = [
  { id: 1, title: 'Grundlagen Schlaf', subtitle: 'Warum Schlaf der Schlüssel zu Longevity ist', duration: '25 Min', status: 'in-bearbeitung' },
  { id: 2, title: 'Schlafzyklen', subtitle: 'REM, Tiefschlaf & wie du sie optimierst', duration: '30 Min', status: 'erledigt' },
  { id: 3, title: 'Circadianer Rhythmus', subtitle: 'Deine innere Uhr verstehen', duration: '28 Min', status: 'offen' },
  { id: 4, title: 'Schlafumgebung', subtitle: 'Das perfekte Schlafzimmer', duration: '20 Min', status: 'offen' },
  { id: 5, title: 'Abendroutine', subtitle: 'Wind-down Rituale', duration: '22 Min', status: 'offen' },
  { id: 6, title: 'Licht & Melatonin', subtitle: 'Natürliche Schlafhormone', duration: '25 Min', status: 'offen' },
  { id: 7, title: 'Ernährung & Schlaf', subtitle: 'Was du wann essen solltest', duration: '24 Min', status: 'offen' },
  { id: 8, title: 'Stress & Schlaf', subtitle: 'Entspannungstechniken', duration: '30 Min', status: 'offen' },
  { id: 9, title: 'Schlaf-Tracking', subtitle: 'Daten nutzen & optimieren', duration: '26 Min', status: 'offen' },
  { id: 10, title: 'Langzeit-Gewohnheiten', subtitle: 'Routinen die bleiben', duration: '20 Min', status: 'offen' },
];

const masterclasses: Masterclass[] = [
  {
    id: 'schlaf',
    title: 'Masterclass Schlaf',
    subtitle: 'Optimiere deinen Schlaf für mehr Energie und Langlebigkeit',
    icon: 'bi-moon-stars',
    color: '#006EA7',
    gradient: 'linear-gradient(135deg, #006EA7 0%, #4C99C2 100%)',
    kapitelCount: 10,
    progress: 15,
    status: 'verfügbar',
  },
  {
    id: 'ernaehrung',
    title: 'Masterclass Ernährung',
    subtitle: 'Longevity Nutrition für zelluläre Gesundheit',
    icon: 'bi-apple',
    color: '#4C99C2',
    gradient: 'linear-gradient(135deg, #4C99C2 0%, #A0C9DE 100%)',
    kapitelCount: 12,
    progress: 0,
    status: 'coming-soon',
  },
  {
    id: 'bewegung',
    title: 'Masterclass Bewegung',
    subtitle: 'Kraft, Ausdauer & Mobilität für ein langes Leben',
    icon: 'bi-activity',
    color: '#1a365d',
    gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
    kapitelCount: 8,
    progress: 0,
    status: 'coming-soon',
  },
];

export default function MasterclassesPage() {
  const [focusMode, setFocusMode] = useState(false);
  const [activeMasterclass, setActiveMasterclass] = useState<Masterclass | null>(null);
  const [activeKapitelId, setActiveKapitelId] = useState<number>(1);
  const [kapitelData, setKapitelData] = useState<Kapitel[]>(schlafKapitel);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Content progress states für Kapitel 1
  const [videoWatched, setVideoWatched] = useState(false);
  const [textRead, setTextRead] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});

  const startFocusSession = (mc: Masterclass) => {
    if (mc.status !== 'verfügbar') return;
    setActiveMasterclass(mc);
    setActiveKapitelId(1);
    setIsAnimating(true);
    setTimeout(() => {
      setFocusMode(true);
      setIsAnimating(false);
    }, 50);
  };

  const closeFocusMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setFocusMode(false);
      setActiveMasterclass(null);
      setIsAnimating(false);
    }, 300);
  };

  const getKapitelStatus = (k: Kapitel): ElementStatus => k.status;

  const totalProgress = Math.round((kapitelData.filter(k => k.status === 'erledigt').length / kapitelData.length) * 100);

  const activeKapitel = kapitelData.find(k => k.id === activeKapitelId);

  const quizQuestions = [
    {
      id: 1,
      question: 'Wie viele Stunden Schlaf pro Nacht werden für optimale Longevity empfohlen?',
      options: ['4-5 Stunden', '6-7 Stunden', '7-9 Stunden', '10+ Stunden'],
      correct: 2,
    },
    {
      id: 2,
      question: 'Welches Hormon wird hauptsächlich während des Tiefschlafs ausgeschüttet?',
      options: ['Cortisol', 'Wachstumshormon (HGH)', 'Adrenalin', 'Insulin'],
      correct: 1,
    },
    {
      id: 3,
      question: 'Was passiert mit den Telomeren bei chronischem Schlafmangel?',
      options: ['Sie werden länger', 'Sie bleiben gleich', 'Sie verkürzen sich schneller', 'Sie verschwinden'],
      correct: 2,
    },
  ];

  // ==================== ÜBERSICHT ====================
  if (!focusMode) {
    return (
      <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {masterclasses.map((mc) => (
            <div
              key={mc.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                opacity: mc.status === 'coming-soon' ? 0.7 : 1,
              }}
            >
              <div style={{ background: mc.gradient, padding: '1.75rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontSize: '1.5rem' }}>
                  <i className={`bi ${mc.icon}`} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>{mc.title}</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>{mc.subtitle}</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: mc.color }}>{mc.kapitelCount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>Kapitel</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: mc.color }}>{mc.progress}%</div>
                    <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>Fortschritt</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: mc.color }}>{mc.status === 'verfügbar' ? '~4h' : '—'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>Dauer</div>
                  </div>
                </div>
                {mc.status === 'verfügbar' && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ height: '8px', background: '#E2E3E4', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${mc.progress}%`, background: mc.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => startFocusSession(mc)}
                  disabled={mc.status !== 'verfügbar'}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: mc.status === 'verfügbar' ? mc.color : '#E2E3E4',
                    color: mc.status === 'verfügbar' ? 'white' : '#7D8087',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: mc.status === 'verfügbar' ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {mc.status === 'verfügbar' ? (<><i className="bi bi-play-circle-fill" /> Fokus-Session starten</>) : (<><i className="bi bi-clock" /> Coming Soon</>)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ==================== FOKUS-MODUS ====================
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#F0F4F8',
        zIndex: 1000,
        display: 'flex',
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Sidebar */}
      <div style={{ width: '300px', background: 'white', borderRight: '1px solid #E2E3E4', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Sidebar Header */}
        <div style={{ background: activeMasterclass?.gradient, padding: '1.25rem', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button
              onClick={closeFocusMode}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '10px', padding: '0.5rem 0.75rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem' }}
            >
              <i className="bi bi-x-lg" /> Schließen
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className={`bi ${activeMasterclass?.icon}`} style={{ fontSize: '1.5rem' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{activeMasterclass?.title}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>{totalProgress}% abgeschlossen</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E3E4' }}>
          <div style={{ height: '6px', background: '#E2E3E4', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${totalProgress}%`, background: activeMasterclass?.color, borderRadius: '3px' }} />
          </div>
        </div>

        {/* Kapitel Liste */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
          {kapitelData.map((k) => {
            const status = getKapitelStatus(k);
            const isActive = k.id === activeKapitelId;

            return (
              <div
                key={k.id}
                onClick={() => setActiveKapitelId(k.id)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  marginBottom: '0.375rem',
                  cursor: 'pointer',
                  background: isActive ? '#B3E0F0' : 'transparent',
                  border: isActive ? `2px solid ${activeMasterclass?.color}` : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: status === 'erledigt' ? '#DBF2CC' : status === 'in-bearbeitung' ? '#B3E0F0' : '#E2E3E4',
                      color: status === 'erledigt' ? '#2D7A0F' : status === 'in-bearbeitung' ? '#006EA7' : '#7D8087',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {status === 'erledigt' ? <i className="bi bi-check-lg" /> : k.id}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, color: '#374A5A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {k.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#7D8087' }}>{k.duration}</div>
                  </div>
                  {isActive && <i className="bi bi-chevron-right" style={{ color: activeMasterclass?.color, fontSize: '0.8rem' }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Content Header */}
        <div style={{ padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #E2E3E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>Kapitel {activeKapitel?.id} von {kapitelData.length}</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#374A5A', margin: 0 }}>{activeKapitel?.title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveKapitelId(Math.max(1, activeKapitelId - 1))}
              disabled={activeKapitelId === 1}
              style={{ padding: '0.5rem 0.875rem', borderRadius: '8px', border: '1px solid #E2E3E4', background: 'white', color: activeKapitelId === 1 ? '#A0A4A8' : '#374A5A', cursor: activeKapitelId === 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}
            >
              <i className="bi bi-chevron-left" /> Zurück
            </button>
            <button
              onClick={() => setActiveKapitelId(Math.min(kapitelData.length, activeKapitelId + 1))}
              disabled={activeKapitelId === kapitelData.length}
              style={{ padding: '0.5rem 0.875rem', borderRadius: '8px', border: 'none', background: activeKapitelId === kapitelData.length ? '#E2E3E4' : activeMasterclass?.color, color: activeKapitelId === kapitelData.length ? '#A0A4A8' : 'white', cursor: activeKapitelId === kapitelData.length ? 'not-allowed' : 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
            >
              Weiter <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>

        {/* Content Body - KAPITEL 1 CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', background: '#F8FAFC' }}>
          {activeKapitelId === 1 ? (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              
              {/* Hero Section */}
              <div style={{ background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '100%', opacity: 0.1 }}>
                  <i className="bi bi-moon-stars" style={{ fontSize: '200px', position: 'absolute', top: '-20px', right: '-30px' }} />
                </div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.375rem 0.875rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500 }}>
                    Kapitel 1 · Grundlagen
                  </span>
                  <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '1rem 0 0.5rem' }}>
                    Warum Schlaf der Schlüssel zu Longevity ist
                  </h1>
                  <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '600px', lineHeight: 1.6 }}>
                    Entdecke die wissenschaftlichen Grundlagen, warum optimaler Schlaf die wichtigste Säule für ein langes, gesundes Leben ist.
                  </p>
                </div>
              </div>

              {/* Video Section */}
              <div style={{ background: 'white', borderRadius: '16px', marginBottom: '1.5rem', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <div
                      onClick={() => setVideoWatched(true)}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: videoWatched ? '#7FD049' : 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '1rem',
                      }}
                    >
                      <i className={`bi ${videoWatched ? 'bi-check-lg' : 'bi-play-fill'}`} style={{ fontSize: '2rem', marginLeft: videoWatched ? 0 : '4px' }} />
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      {videoWatched ? 'Video abgeschlossen' : 'Video starten'}
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Dr. Sarah Müller · 12:34 Min</div>
                  </div>
                  {videoWatched && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#7FD049' }} />
                  )}
                </div>
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #E2E3E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#374A5A' }}>Die Wissenschaft des Schlafs</div>
                    <div style={{ fontSize: '0.85rem', color: '#7D8087' }}>Experten-Video mit Dr. Sarah Müller</div>
                  </div>
                  {videoWatched && <span style={{ background: '#DBF2CC', color: '#2D7A0F', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}><i className="bi bi-check-circle-fill" /> Angesehen</span>}
                </div>
              </div>

              {/* Text Content */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#B3E0F0', color: '#006EA7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-book" style={{ fontSize: '1.1rem' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#374A5A' }}>Lernmaterial</div>
                    <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>Lesezeit: ca. 8 Minuten</div>
                  </div>
                  {textRead && <span style={{ marginLeft: 'auto', background: '#DBF2CC', color: '#2D7A0F', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 500 }}><i className="bi bi-check-circle-fill" /> Gelesen</span>}
                </div>

                <div style={{ color: '#374A5A', lineHeight: 1.8, fontSize: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1a365d' }}>
                    Schlaf als Fundament der Longevity
                  </h3>
                  <p style={{ marginBottom: '1.25rem' }}>
                    Während wir schlafen, passiert in unserem Körper Erstaunliches: Zellen werden repariert, Giftstoffe aus dem Gehirn gespült, Erinnerungen gefestigt und Hormone reguliert. <strong>Schlaf ist keine passive Erholung</strong> – er ist eine der aktivsten Phasen für Regeneration und Heilung.
                  </p>
                  
                  <div style={{ background: '#F0F9FF', border: '1px solid #B3E0F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <i className="bi bi-lightbulb" style={{ color: '#006EA7', fontSize: '1.25rem', marginTop: '2px' }} />
                      <div>
                        <div style={{ fontWeight: 600, color: '#006EA7', marginBottom: '0.375rem' }}>Wichtige Erkenntnis</div>
                        <div style={{ color: '#374A5A' }}>
                          Menschen, die regelmäßig 7-9 Stunden schlafen, haben ein <strong>um 30% niedrigeres Risiko</strong> für Herz-Kreislauf-Erkrankungen und zeigen langsamere Telomerverkürzung.
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem' }}>
                    Die 4 Säulen des erholsamen Schlafs
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                    {[
                      { icon: 'bi-clock', title: 'Dauer', desc: '7-9 Stunden pro Nacht' },
                      { icon: 'bi-graph-up', title: 'Qualität', desc: 'Tiefschlaf & REM optimal' },
                      { icon: 'bi-calendar-check', title: 'Regelmäßigkeit', desc: 'Konstante Schlafzeiten' },
                      { icon: 'bi-sunrise', title: 'Timing', desc: 'Mit dem Biorhythmus' },
                    ].map((item, i) => (
                      <div key={i} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#006EA7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className={`bi ${item.icon}`} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem' }}>
                    Was passiert bei Schlafmangel?
                  </h4>
                  <p style={{ marginBottom: '1rem' }}>
                    Chronischer Schlafmangel beschleunigt die biologische Alterung messbar. Studien zeigen:
                  </p>
                  <ul style={{ paddingLeft: '1.25rem', marginBottom: '1.25rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Erhöhte Entzündungsmarker (CRP, IL-6)</li>
                    <li style={{ marginBottom: '0.5rem' }}>Beschleunigte Telomerverkürzung</li>
                    <li style={{ marginBottom: '0.5rem' }}>Gestörte Glukoseregulation</li>
                    <li style={{ marginBottom: '0.5rem' }}>Beeinträchtigte Immunfunktion</li>
                  </ul>
                </div>
              </div>

              {/* Playbook Download */}
              <div style={{ background: 'linear-gradient(135deg, #006EA7 0%, #4C99C2 100%)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-file-earmark-pdf" style={{ fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Schlaf-Grundlagen Playbook</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>PDF · 12 Seiten · Checklisten & Tipps</div>
                  </div>
                </div>
                <button style={{ background: 'white', color: '#006EA7', border: 'none', borderRadius: '10px', padding: '0.75rem 1.5rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="bi bi-download" /> Download PDF
                </button>
              </div>

              {/* Live Session Info */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#FFF3CD', color: '#856404', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-camera-video" style={{ fontSize: '1.5rem' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#374A5A', fontSize: '1.05rem' }}>Live Q&A Session</div>
                    <div style={{ fontSize: '0.85rem', color: '#7D8087' }}>Replay verfügbar · 45 Min mit Dr. Sarah Müller</div>
                  </div>
                  <button style={{ background: '#006EA7', color: 'white', border: 'none', borderRadius: '10px', padding: '0.75rem 1.25rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-play-circle" /> Replay ansehen
                  </button>
                </div>
              </div>

              {/* Quiz Section */}
              <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ background: quizCompleted ? '#DBF2CC' : '#F8FAFC', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E3E4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: quizCompleted ? '#7FD049' : '#006EA7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`bi ${quizCompleted ? 'bi-trophy' : 'bi-patch-question'}`} style={{ fontSize: '1.1rem' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#374A5A' }}>Wissens-Quiz</div>
                      <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>{quizCompleted ? 'Bestanden! 3/3 richtig' : '3 Fragen · Teste dein Wissen'}</div>
                    </div>
                  </div>
                  {quizCompleted && <span style={{ background: '#7FD049', color: 'white', padding: '0.375rem 0.875rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}><i className="bi bi-check-circle-fill" /> Bestanden</span>}
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  {!quizStarted && !quizCompleted ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <i className="bi bi-patch-question" style={{ fontSize: '3rem', color: '#006EA7', marginBottom: '1rem', display: 'block' }} />
                      <h4 style={{ fontWeight: 600, color: '#374A5A', marginBottom: '0.5rem' }}>Bereit für das Quiz?</h4>
                      <p style={{ color: '#7D8087', marginBottom: '1.5rem' }}>Teste dein Wissen aus diesem Kapitel mit 3 kurzen Fragen.</p>
                      <button
                        onClick={() => setQuizStarted(true)}
                        style={{ background: '#006EA7', color: 'white', border: 'none', borderRadius: '10px', padding: '0.875rem 2rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                      >
                        Quiz starten
                      </button>
                    </div>
                  ) : quizCompleted ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#DBF2CC', color: '#7FD049', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2.5rem' }}>
                        <i className="bi bi-trophy-fill" />
                      </div>
                      <h4 style={{ fontWeight: 600, color: '#374A5A', marginBottom: '0.5rem' }}>Hervorragend!</h4>
                      <p style={{ color: '#7D8087', marginBottom: '1rem' }}>Du hast alle 3 Fragen richtig beantwortet.</p>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        {[1,2,3].map(n => (
                          <div key={n} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#7FD049', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600 }}>
                            <i className="bi bi-check-lg" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {quizQuestions.map((q, qi) => (
                        <div key={q.id} style={{ marginBottom: qi < quizQuestions.length - 1 ? '1.5rem' : 0, paddingBottom: qi < quizQuestions.length - 1 ? '1.5rem' : 0, borderBottom: qi < quizQuestions.length - 1 ? '1px solid #E2E3E4' : 'none' }}>
                          <div style={{ fontWeight: 600, color: '#374A5A', marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: '#006EA7' }}>{qi + 1}.</span> {q.question}
                          </div>
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: oi }))}
                                style={{
                                  padding: '0.875rem 1rem',
                                  borderRadius: '10px',
                                  border: selectedAnswers[q.id] === oi ? '2px solid #006EA7' : '2px solid #E2E3E4',
                                  background: selectedAnswers[q.id] === oi ? '#B3E0F0' : 'white',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                }}
                              >
                                <div style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: selectedAnswers[q.id] === oi ? '2px solid #006EA7' : '2px solid #A0A4A8',
                                  background: selectedAnswers[q.id] === oi ? '#006EA7' : 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}>
                                  {selectedAnswers[q.id] === oi && <i className="bi bi-check-lg" style={{ color: 'white', fontSize: '0.8rem' }} />}
                                </div>
                                <span style={{ color: '#374A5A', fontSize: '0.95rem' }}>{opt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => setQuizCompleted(true)}
                        disabled={Object.keys(selectedAnswers).length < 3}
                        style={{
                          width: '100%',
                          marginTop: '1.5rem',
                          padding: '0.875rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: Object.keys(selectedAnswers).length < 3 ? '#E2E3E4' : '#7FD049',
                          color: Object.keys(selectedAnswers).length < 3 ? '#7D8087' : 'white',
                          fontWeight: 600,
                          cursor: Object.keys(selectedAnswers).length < 3 ? 'not-allowed' : 'pointer',
                          fontSize: '1rem',
                        }}
                      >
                        Quiz abschließen
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Spacing */}
              <div style={{ height: '2rem' }} />
            </div>
          ) : (
            /* Placeholder für andere Kapitel */
            <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#B3E0F0', color: '#006EA7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem' }}>
                <i className="bi bi-book" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#374A5A', marginBottom: '0.75rem' }}>
                {activeKapitel?.title}
              </h2>
              <p style={{ color: '#7D8087', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto' }}>
                {activeKapitel?.subtitle}
              </p>
              <p style={{ color: '#A0A4A8', fontSize: '0.9rem' }}>
                Inhalt für dieses Kapitel wird noch aufbereitet...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
