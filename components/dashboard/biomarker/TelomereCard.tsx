'use client';

export default function TelomereCard() {
  return (
    <div className="dashboard-card" style={{ gridColumn: 'span 3' }}>
      <div className="telomere-container">
        <div className="telomere-header" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2e6ca3', marginBottom: '0.5rem' }}>
            Telomerlängenmessung - Befundinterpretation
          </h2>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Telomere sind die Schutzkappen an den Enden der Chromosomen. Ihre Länge ist ein wichtiger Indikator für das biologische Alter und die Zellgesundheit.
          </p>
        </div>

        <div className="telomere-gradient-bar" style={{ position: 'relative' }}>
          {/* Gradient Bar */}
          <div
            className="gradient-bar"
            style={{
              height: '40px',
              background: 'linear-gradient(to right, #D32F2F 0%, #FFA726 25%, #4CAF50 50%, #FFA726 75%, #D32F2F 100%)',
              borderRadius: '20px',
              position: 'relative',
              marginBottom: '3rem',
            }}
          >
            {/* Aktuelle Position */}
            <div
              className="current-position"
              style={{
                position: 'absolute',
                left: '75%',
                top: '-30px',
                transform: 'translateX(-50%)',
                background: '#2e6ca3',
                color: 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              1.13
            </div>

            {/* Verbindungslinie */}
            <div
              className="connection-line"
              style={{
                position: 'absolute',
                left: '75%',
                top: '-20px',
                width: '2px',
                height: '20px',
                background: '#2e6ca3',
              }}
            />

            {/* Vertikale Linie */}
            <div
              className="current-value-line"
              style={{
                position: 'absolute',
                left: '75%',
                top: '0',
                width: '3px',
                height: '100%',
                background: '#2e6ca3',
                borderRadius: '2px',
              }}
            />
          </div>

          {/* Skala-Markierungen */}
          <div
            className="scale-markers-below"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              position: 'relative',
              marginTop: '0.5rem',
            }}
          >
            {[0, 20, 40, 60, 80, 100].map((value) => (
              <div
                key={value}
                className="scale-marker-below"
                style={{
                  fontSize: '0.85rem',
                  color: '#666',
                }}
              >
                {value}
              </div>
            ))}
          </div>

          {/* Aktueller Wert */}
          <div
            className="current-value"
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#f8fbff',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <div
              className="value"
              style={{
                fontSize: '2rem',
                fontWeight: 600,
                color: '#2e6ca3',
                marginBottom: '0.5rem',
              }}
            >
              1.13
            </div>
            <div
              className="description"
              style={{
                fontSize: '0.95rem',
                color: '#666',
                lineHeight: '1.6',
              }}
            >
              Die relative mittlere Telomerlänge der Leukozyten beträgt 1.13 (T/S Ratio).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

