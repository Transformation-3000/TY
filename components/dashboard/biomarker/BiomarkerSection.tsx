'use client';

interface Biomarker {
  name: string;
  description: string;
  status: 'low' | 'optimal' | 'high' | 'no-data';
  value: string;
}

interface BiomarkerSectionProps {
  title: string;
  description: string;
  biomarkers: Biomarker[];
}

export default function BiomarkerSection({ title, description, biomarkers }: BiomarkerSectionProps) {
  const getStatusStyle = (status: Biomarker['status']) => {
    switch (status) {
      case 'low':
        return { background: '#B71C1C', color: 'white' };
      case 'optimal':
        return { background: '#E8F5E9', color: '#2E7D32' };
      case 'high':
        return { background: '#FFA726', color: '#E65100' };
      case 'no-data':
        return { background: '#ECEFF1', color: '#666' };
      default:
        return { background: '#ECEFF1', color: '#666' };
    }
  };

  const getStatusText = (status: Biomarker['status']) => {
    switch (status) {
      case 'low':
        return 'Niedrig';
      case 'optimal':
        return 'Optimiert';
      case 'high':
        return 'Erhöht';
      case 'no-data':
        return 'Keine Daten';
      default:
        return 'Keine Daten';
    }
  };

  return (
    <section
      className="biomarker-section"
      style={{
        marginBottom: '3rem',
        padding: '2rem',
        background: 'linear-gradient(145deg, #ffffff, #f8fbff)',
        borderRadius: '16px',
        boxShadow: '0 6px 30px rgba(0, 0, 0, 0.12)',
      }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2e6ca3', marginBottom: '0.5rem' }}>
        {title}
      </h2>
      <p style={{ color: '#444', lineHeight: '1.6', marginBottom: '1.5rem' }}>{description}</p>
      <div
        className="biomarker-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {biomarkers.map((biomarker) => {
          const statusStyle = getStatusStyle(biomarker.status);
          return (
            <div
              key={biomarker.name}
              className="biomarker-card"
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.2rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '1rem', color: '#2e6ca3', marginBottom: '0.3rem' }}>
                {biomarker.name}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {biomarker.description}
              </div>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    background: statusStyle.background,
                    color: statusStyle.color,
                    borderRadius: '16px',
                    padding: '0.2rem 0.9rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                >
                  {getStatusText(biomarker.status)}
                </span>
                <span
                  style={{
                    fontSize: '1.1rem',
                    color: '#1d1d1f',
                    fontWeight: 600,
                  }}
                >
                  {biomarker.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

