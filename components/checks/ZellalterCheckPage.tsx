'use client';

import Image from 'next/image';

export default function ZellalterCheckPage() {
  const features = [
    {
      icon: 'bi-clock-history',
      text: 'Biologisches Alter aus tausenden Proteinen präzise bestimmen'
    },
    {
      icon: 'bi-speedometer2',
      text: 'Alterungsgeschwindigkeit (Pace of Aging) objektiv messen'
    },
    {
      icon: 'bi-hand-index',
      text: 'Einfacher Wangenabstrich – keine Blutentnahme nötig'
    },
    {
      icon: 'bi-heart-pulse',
      text: 'Sport- und Ernährungsprofil für deinen Lebensstil'
    },
    {
      icon: 'bi-diagram-3',
      text: 'Hallmarks of Aging: Einblick in zelluläre Alterungsprozesse'
    },
    {
      icon: 'bi-lightbulb',
      text: 'Personalisierte Empfehlungen zur Optimierung deines Proteoms'
    },
    {
      icon: 'bi-arrow-repeat',
      text: 'Wiederholbar – Fortschritte über Zeit tracken und vergleichen'
    }
  ];

  return (
    <div className="lab-check-page">
      <div className="lab-check-container">
        {/* Bildbereich */}
        <div className="lab-check-image-section">
          <div className="lab-check-image-wrapper">
            <div className="lab-check-image-real">
              <Image
                src="/images/molecular.webp"
                alt="Moleqlar Epi-Proteomics Test"
                width={400}
                height={400}
                className="lab-check-product-image"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className="lab-provider-info">
              <span className="provider-name">Powered by Moleqlar Analytics</span>
              <span className="provider-type">Epi-Proteomics Test</span>
            </div>
          </div>
        </div>

        {/* Infobereich */}
        <div className="lab-check-info-section">
          <div className="lab-check-header">
            <h1 className="lab-check-title">Zellalter Check</h1>
            <p className="lab-check-subtitle">
              Entdecke dein biologisches Alter und verstehe, wie dein Lebensstil 
              deine zelluläre Gesundheit beeinflusst.
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
              <span className="lab-price-label">Ab</span>
              <span className="lab-price">€249,90</span>
            </div>
            <a 
              href="https://moleqlar.com/products/epi-proteomics-test" 
              target="_blank" 
              rel="noopener noreferrer"
              className="lab-cta-button"
            >
              <i className="bi bi-box-arrow-up-right"></i>
              Mehr erfahren
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
