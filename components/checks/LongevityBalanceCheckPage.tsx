'use client';

import Image from 'next/image';

export default function LongevityBalanceCheckPage() {
  const features = [
    {
      icon: 'bi-pie-chart',
      text: '360°-Status deines Stoffwechsels: >250 Biomarker (Metabolite + Lipoproteine) – breiter als Standard-Labore'
    },
    {
      icon: 'bi-layout-text-sidebar',
      text: 'Strukturierte Auswertung statt Zahlenfriedhof: Funktions-Cluster mit Übersichten und Detailwerten'
    },
    {
      icon: 'bi-diagram-2',
      text: 'Muster statt Einzelwerte: Zusammenhänge erkennen, wenn mehrere Werte in dieselbe Richtung kippen'
    },
    {
      icon: 'bi-arrow-left-right',
      text: 'Baseline + Re-Test-Logik: Nach Anpassungen erneut testen und messbare Veränderungen prüfen'
    },
    {
      icon: 'bi-droplet',
      text: 'Alltagstaugliche Probe: Venöses oder kapillares Serum, Selbstentnahme mit kontrolliertem Transport möglich'
    }
  ];

  return (
    <div className="lab-check-page">
      <div className="lab-check-container lab-check-reverse">
        {/* Infobereich */}
        <div className="lab-check-info-section">
          <div className="lab-check-header">
            <h1 className="lab-check-title">Longevity Balance Check</h1>
            <p className="lab-check-subtitle">
              Umfassende Stoffwechselanalyse mit über 250 Biomarkern – 
              für ein ganzheitliches Bild deiner metabolischen Gesundheit.
            </p>
          </div>

          <div className="lab-check-features">
            {features.map((feature, index) => (
              <div key={index} className="lab-feature-item">
                <div className="lab-feature-icon">
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <span className="lab-feature-text">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="lab-check-footer">
            <div className="lab-price-info">
              <span className="lab-price-label">MetaboPRO</span>
              <span className="lab-price-note">Preis auf Anfrage</span>
            </div>
            <a 
              href="https://lifespin.health/products-and-services/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="lab-cta-button"
            >
              <i className="bi bi-box-arrow-up-right"></i>
              Mehr erfahren
            </a>
          </div>
        </div>

        {/* Bildbereich */}
        <div className="lab-check-image-section">
          <div className="lab-check-image-wrapper">
            <div className="lab-check-image-real">
              <Image
                src="/images/lifespin.webp"
                alt="Lifespin MetaboPRO"
                width={400}
                height={400}
                className="lab-check-product-image"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="lab-provider-info">
              <span className="provider-name">Powered by Lifespin Health</span>
              <span className="provider-type">MetaboPRO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
