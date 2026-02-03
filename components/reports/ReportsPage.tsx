'use client';

import { useState } from 'react';

interface MonthlyReport {
  id: string;
  month: string;
  year: number;
  title: string;
  summary: string;
  healthScore: number;
  previousScore: number;
  keyMetrics: {
    sleep: { value: number; unit: string; trend: 'up' | 'down' | 'stable' };
    steps: { value: number; unit: string; trend: 'up' | 'down' | 'stable' };
    hrv: { value: number; unit: string; trend: 'up' | 'down' | 'stable' };
    stress: { value: number; unit: string; trend: 'up' | 'down' | 'stable' };
  };
  nextBestActions: {
    id: number;
    priority: 'high' | 'medium' | 'low';
    category: string;
    title: string;
    description: string;
    icon: string;
  }[];
  highlights: string[];
  blockers: string[];
}

const monthlyReports: MonthlyReport[] = [
  {
    id: 'jan-2026',
    month: 'Januar',
    year: 2026,
    title: 'Monatsreport Januar 2026',
    summary: 'Starker Start ins neue Jahr mit verbessertem Schlaf und gesteigerter Aktivität. Der Fokus auf Schlafhygiene zeigt erste Erfolge.',
    healthScore: 78,
    previousScore: 72,
    keyMetrics: {
      sleep: { value: 7.4, unit: 'h', trend: 'up' },
      steps: { value: 9200, unit: 'Ø', trend: 'up' },
      hrv: { value: 48, unit: 'ms', trend: 'stable' },
      stress: { value: 32, unit: '%', trend: 'down' },
    },
    nextBestActions: [
      { id: 1, priority: 'high', category: 'Schlaf', title: 'Schlafenszeit stabilisieren', description: 'Konstante Schlafenszeit um 22:30 Uhr einhalten', icon: 'bi-moon-stars' },
      { id: 2, priority: 'high', category: 'Bewegung', title: 'Krafttraining intensivieren', description: '3x pro Woche Ganzkörpertraining', icon: 'bi-lightning' },
      { id: 3, priority: 'medium', category: 'Ernährung', title: 'Proteinzufuhr erhöhen', description: 'Ziel: 1.6g/kg Körpergewicht', icon: 'bi-egg-fried' },
    ],
    highlights: ['Schlafqualität +12%', 'Durchschnitt 9.200 Schritte/Tag', 'Stresslevel gesunken'],
    blockers: ['Unregelmäßige Schlafzeiten am Wochenende', 'Zu wenig Krafttraining'],
  },
  {
    id: 'dec-2025',
    month: 'Dezember',
    year: 2025,
    title: 'Monatsreport Dezember 2025',
    summary: 'Herausfordernder Monat durch Feiertage. Trotz weniger Bewegung konnte das Stresslevel gut gemanagt werden.',
    healthScore: 72,
    previousScore: 75,
    keyMetrics: {
      sleep: { value: 6.8, unit: 'h', trend: 'down' },
      steps: { value: 7100, unit: 'Ø', trend: 'down' },
      hrv: { value: 45, unit: 'ms', trend: 'down' },
      stress: { value: 38, unit: '%', trend: 'up' },
    },
    nextBestActions: [
      { id: 1, priority: 'high', category: 'Bewegung', title: 'Tägliche Bewegung priorisieren', description: 'Mindestens 8.000 Schritte auch an Feiertagen', icon: 'bi-person-walking' },
      { id: 2, priority: 'medium', category: 'Ernährung', title: 'Zucker reduzieren', description: 'Süßigkeiten auf 1x pro Woche begrenzen', icon: 'bi-x-circle' },
      { id: 3, priority: 'medium', category: 'Mental', title: 'Atemübungen integrieren', description: '5 Min Box-Breathing morgens', icon: 'bi-wind' },
    ],
    highlights: ['Gute Stressbewältigung', 'Regelmäßige Meditation', 'Soziale Verbindungen gestärkt'],
    blockers: ['Weniger Bewegung durch Kälte', 'Erhöhter Alkoholkonsum', 'Unregelmäßige Mahlzeiten'],
  },
  {
    id: 'nov-2025',
    month: 'November',
    year: 2025,
    title: 'Monatsreport November 2025',
    summary: 'Ausgezeichneter Monat mit persönlichen Bestleistungen bei HRV und Schlafqualität. Der neue Trainingsplan zeigt Wirkung.',
    healthScore: 75,
    previousScore: 71,
    keyMetrics: {
      sleep: { value: 7.6, unit: 'h', trend: 'up' },
      steps: { value: 10500, unit: 'Ø', trend: 'up' },
      hrv: { value: 52, unit: 'ms', trend: 'up' },
      stress: { value: 28, unit: '%', trend: 'down' },
    },
    nextBestActions: [
      { id: 1, priority: 'high', category: 'Regeneration', title: 'Aktive Erholung einplanen', description: 'Nach intensiven Tagen leichte Bewegung', icon: 'bi-heart-pulse' },
      { id: 2, priority: 'medium', category: 'Schlaf', title: 'Schlafumgebung optimieren', description: 'Raumtemperatur auf 18°C senken', icon: 'bi-thermometer-half' },
      { id: 3, priority: 'low', category: 'Supplemente', title: 'Magnesium vor dem Schlaf', description: '400mg Magnesium Glycinat', icon: 'bi-capsule' },
    ],
    highlights: ['HRV Bestleistung: 52ms', 'Über 10.000 Schritte/Tag', 'Konstant 7+ Stunden Schlaf'],
    blockers: ['Gelegentliche späte Mahlzeiten', 'Screen-Time vor dem Schlaf'],
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<MonthlyReport | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'bi-arrow-up-right';
      case 'down': return 'bi-arrow-down-right';
      case 'stable': return 'bi-arrow-right';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isGoodUp: boolean = true) => {
    if (trend === 'stable') return '#7D8087';
    if (trend === 'up') return isGoodUp ? '#2D7A0F' : '#DC2626';
    return isGoodUp ? '#DC2626' : '#2D7A0F';
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' };
      case 'medium': return { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'low': return { bg: '#DCFCE7', color: '#16A34A', border: '#BBF7D0' };
    }
  };

  const openReportDetail = (report: MonthlyReport) => {
    setSelectedReport(report);
    setViewMode('detail');
  };

  const closeDetail = () => {
    setViewMode('overview');
    setSelectedReport(null);
  };

  // Detail-Ansicht
  if (viewMode === 'detail' && selectedReport) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: '#F0F4F8', 
        zIndex: 1000, 
        overflowY: 'auto',
        padding: '2rem',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <button
              onClick={closeDetail}
              style={{
                background: 'white',
                border: '1px solid #E2E3E4',
                borderRadius: '10px',
                padding: '0.625rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#374A5A',
                fontWeight: 500,
              }}
            >
              <i className="bi bi-arrow-left" /> Zurück zur Übersicht
            </button>
            <button
              style={{
                background: '#006EA7',
                border: 'none',
                borderRadius: '10px',
                padding: '0.625rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'white',
                fontWeight: 500,
              }}
            >
              <i className="bi bi-download" /> PDF herunterladen
            </button>
          </div>

          {/* Report Content */}
          <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            {/* Report Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)', 
              padding: '2rem', 
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <i className="bi bi-file-earmark-text" style={{ fontSize: '1.25rem' }} />
                  <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Persönlicher Monatsreport</span>
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
                  {selectedReport.month} {selectedReport.year}
                </h1>
                <p style={{ fontSize: '1rem', opacity: 0.85, maxWidth: '600px', margin: 0 }}>
                  {selectedReport.summary}
                </p>
              </div>
            </div>

            {/* Health Score Section */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #E2E3E4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Score Circle */}
                <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E3E4" strokeWidth="8" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="none" 
                      stroke="#006EA7" 
                      strokeWidth="8" 
                      strokeLinecap="round"
                      strokeDasharray={`${selectedReport.healthScore * 2.64} 264`}
                    />
                  </svg>
                  <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)', 
                    textAlign: 'center' 
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#006EA7', lineHeight: 1 }}>
                      {selectedReport.healthScore}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7D8087' }}>Health Score</div>
                  </div>
                </div>

                {/* Score Change */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      background: selectedReport.healthScore > selectedReport.previousScore ? '#DBF2CC' : '#FEE2E2',
                      color: selectedReport.healthScore > selectedReport.previousScore ? '#2D7A0F' : '#DC2626',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      <i className={`bi ${selectedReport.healthScore > selectedReport.previousScore ? 'bi-arrow-up' : 'bi-arrow-down'}`} />
                      {Math.abs(selectedReport.healthScore - selectedReport.previousScore)} Punkte
                    </span>
                    <span style={{ color: '#7D8087', fontSize: '0.85rem' }}>vs. Vormonat</span>
                  </div>
                  <p style={{ color: '#374A5A', fontSize: '0.95rem', margin: 0 }}>
                    {selectedReport.healthScore > selectedReport.previousScore 
                      ? 'Dein Health Score hat sich verbessert! Weiter so.'
                      : 'Dein Health Score ist leicht gesunken. Schau dir die Empfehlungen an.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #E2E3E4' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374A5A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="bi bi-graph-up" style={{ color: '#006EA7' }} />
                Wichtigste Metriken
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                {[
                  { key: 'sleep', label: 'Schlaf', icon: 'bi-moon-stars', isGoodUp: true },
                  { key: 'steps', label: 'Schritte', icon: 'bi-person-walking', isGoodUp: true },
                  { key: 'hrv', label: 'HRV', icon: 'bi-heart-pulse', isGoodUp: true },
                  { key: 'stress', label: 'Stress', icon: 'bi-emoji-neutral', isGoodUp: false },
                ].map((metric) => {
                  const data = selectedReport.keyMetrics[metric.key as keyof typeof selectedReport.keyMetrics];
                  return (
                    <div key={metric.key} style={{ 
                      background: '#F8FAFC', 
                      borderRadius: '12px', 
                      padding: '1.25rem',
                      border: '1px solid #E2E3E4',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <i className={`bi ${metric.icon}`} style={{ color: '#006EA7' }} />
                        <span style={{ fontSize: '0.85rem', color: '#7D8087' }}>{metric.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#374A5A' }}>
                          {data.value.toLocaleString('de-DE')}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#7D8087' }}>{data.unit}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem', 
                        marginTop: '0.5rem',
                        color: getTrendColor(data.trend, metric.isGoodUp),
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}>
                        <i className={`bi ${getTrendIcon(data.trend)}`} />
                        <span>{data.trend === 'up' ? 'Gestiegen' : data.trend === 'down' ? 'Gesunken' : 'Stabil'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Best Actions */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #E2E3E4' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374A5A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="bi bi-rocket-takeoff" style={{ color: '#006EA7' }} />
                Next Best Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {selectedReport.nextBestActions.map((action) => {
                  const priorityStyle = getPriorityColor(action.priority);
                  return (
                    <div key={action.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: `1px solid ${priorityStyle.border}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: priorityStyle.bg,
                        color: priorityStyle.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0,
                      }}>
                        <i className={`bi ${action.icon}`} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: '#374A5A' }}>{action.title}</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.125rem 0.5rem', 
                            borderRadius: '4px',
                            background: priorityStyle.bg,
                            color: priorityStyle.color,
                            fontWeight: 500,
                          }}>
                            {action.priority === 'high' ? 'Hohe Priorität' : action.priority === 'medium' ? 'Mittlere Priorität' : 'Niedrige Priorität'}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#7D8087' }}>{action.description}</p>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#7D8087',
                        background: '#F0F4F8',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '6px',
                      }}>
                        {action.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlights & Blockers */}
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Highlights */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2D7A0F', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="bi bi-trophy" />
                  Highlights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {selectedReport.highlights.map((highlight, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: '#F0FDF4',
                      borderRadius: '10px',
                      border: '1px solid #BBF7D0',
                    }}>
                      <i className="bi bi-check-circle-fill" style={{ color: '#16A34A' }} />
                      <span style={{ color: '#374A5A', fontSize: '0.9rem' }}>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blockers */}
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#DC2626', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="bi bi-exclamation-triangle" />
                  Verbesserungspotenzial
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {selectedReport.blockers.map((blocker, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: '#FEF2F2',
                      borderRadius: '10px',
                      border: '1px solid #FECACA',
                    }}>
                      <i className="bi bi-arrow-right-circle" style={{ color: '#DC2626' }} />
                      <span style={{ color: '#374A5A', fontSize: '0.9rem' }}>{blocker}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Übersicht mit 3 Reports nebeneinander
  return (
    <div style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#374A5A', margin: '0 0 0.5rem 0' }}>
          Deine Monatsreports
        </h1>
        <p style={{ color: '#7D8087', margin: 0, fontSize: '1rem' }}>
          Analysiere deine Fortschritte und entdecke personalisierte Empfehlungen
        </p>
      </div>

      {/* Reports Grid - 3 nebeneinander */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {monthlyReports.map((report, index) => (
          <div 
            key={report.id}
            style={{
              background: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid #E2E3E4',
            }}
            onClick={() => openReportDetail(report)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            {/* Report Preview Header - wie PDF Cover */}
            <div style={{
              background: index === 0 
                ? 'linear-gradient(135deg, #006EA7 0%, #4C99C2 100%)'
                : index === 1
                  ? 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)'
                  : 'linear-gradient(135deg, #2D7A0F 0%, #4CAF50 100%)',
              padding: '1.5rem',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '180px',
            }}>
              {/* Decorative Elements */}
              <div style={{ 
                position: 'absolute', 
                top: '-30px', 
                right: '-30px', 
                width: '120px', 
                height: '120px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '50%' 
              }} />
              <div style={{ 
                position: 'absolute', 
                bottom: '-50px', 
                left: '-20px', 
                width: '100px', 
                height: '100px', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '50%' 
              }} />

              {/* Badge */}
              {index === 0 && (
                <span style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}>
                  Aktuell
                </span>
              )}

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', opacity: 0.9 }}>
                  <i className="bi bi-file-earmark-text" />
                  <span style={{ fontSize: '0.8rem' }}>Monatsreport</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
                  {report.month}
                </h2>
                <span style={{ fontSize: '1rem', opacity: 0.9 }}>{report.year}</span>

                {/* Mini Chart Visualization */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'end', 
                  gap: '3px', 
                  marginTop: '1.25rem',
                  height: '40px',
                }}>
                  {[35, 50, 45, 60, 55, 70, 65, 80, 75, report.healthScore].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        flex: 1, 
                        height: `${h}%`, 
                        background: i === 9 ? 'white' : 'rgba(255,255,255,0.3)',
                        borderRadius: '2px',
                      }} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Report Content Preview */}
            <div style={{ padding: '1.25rem' }}>
              {/* Health Score */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#7D8087', marginBottom: '0.25rem' }}>Health Score</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#006EA7' }}>
                      {report.healthScore}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: report.healthScore > report.previousScore ? '#2D7A0F' : '#DC2626',
                      fontWeight: 500,
                    }}>
                      {report.healthScore > report.previousScore ? '+' : ''}{report.healthScore - report.previousScore}
                    </span>
                  </div>
                </div>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%',
                  background: `conic-gradient(#006EA7 ${report.healthScore * 3.6}deg, #E2E3E4 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%', 
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#006EA7',
                  }}>
                    {report.healthScore}%
                  </div>
                </div>
              </div>

              {/* Key Metrics Mini */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                    <i className="bi bi-moon-stars" style={{ fontSize: '0.75rem', color: '#006EA7' }} />
                    <span style={{ fontSize: '0.7rem', color: '#7D8087' }}>Schlaf</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#374A5A' }}>{report.keyMetrics.sleep.value}h</span>
                    <i className={`bi ${getTrendIcon(report.keyMetrics.sleep.trend)}`} style={{ fontSize: '0.7rem', color: getTrendColor(report.keyMetrics.sleep.trend) }} />
                  </div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                    <i className="bi bi-person-walking" style={{ fontSize: '0.75rem', color: '#006EA7' }} />
                    <span style={{ fontSize: '0.7rem', color: '#7D8087' }}>Schritte</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#374A5A' }}>{(report.keyMetrics.steps.value / 1000).toFixed(1)}k</span>
                    <i className={`bi ${getTrendIcon(report.keyMetrics.steps.trend)}`} style={{ fontSize: '0.7rem', color: getTrendColor(report.keyMetrics.steps.trend) }} />
                  </div>
                </div>
              </div>

              {/* Next Best Actions Preview */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#7D8087', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Top Empfehlungen
                </div>
                {report.nextBestActions.slice(0, 2).map((action) => (
                  <div key={action.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #F0F4F8',
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: getPriorityColor(action.priority).bg,
                      color: getPriorityColor(action.priority).color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      flexShrink: 0,
                    }}>
                      <i className={`bi ${action.icon}`} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#374A5A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {action.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* View Button */}
              <button style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1px solid #E2E3E4',
                background: 'white',
                color: '#006EA7',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}>
                <i className="bi bi-eye" />
                Report ansehen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Info */}
      <div style={{ 
        marginTop: '2rem', 
        padding: '1.25rem', 
        background: 'white', 
        borderRadius: '12px',
        border: '1px solid #E2E3E4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#B3E0F0',
            color: '#006EA7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
          }}>
            <i className="bi bi-calendar-event" />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#374A5A' }}>Nächster Report: 1. Februar 2026</div>
            <div style={{ fontSize: '0.85rem', color: '#7D8087' }}>Dein persönlicher Monatsreport wird automatisch erstellt</div>
          </div>
        </div>
        <button style={{
          padding: '0.625rem 1.25rem',
          borderRadius: '10px',
          border: 'none',
          background: '#006EA7',
          color: 'white',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <i className="bi bi-bell" />
          Erinnerung aktivieren
        </button>
      </div>
    </div>
  );
}
