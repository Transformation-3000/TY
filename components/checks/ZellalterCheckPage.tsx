'use client';

import Image from 'next/image';

export default function ZellalterCheckPage() {
  return (
    <div className="lab-check-page">
      <div className="lab-check-container lab-check-split">
        {/* Text 1/3 links */}
        <div className="lab-check-info-section">
          <div className="lab-check-header">
            <h1 className="lab-check-title">Analyse Zell-Alter</h1>
            <p className="lab-check-subtitle">
              Messe dein biologisches Alter auf Basis Tausender Proteine. Und bekomme einen Eindruck zu deiner aktuellen Alterungsgeschwindigkeit und wo du bei den Hallmarks of Aging stehst.
            </p>
          </div>

          <div className="lab-check-footer">
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

        {/* Bild 2/3 rechts */}
        <div className="lab-check-image-section">
          <div className="lab-check-image-wrapper">
            <div className="lab-check-image-real">
              <Image
                src="/images/agespeed.jpeg"
                alt="Moleqlar Epi-Proteomics Test"
                width={950}
                height={950}
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
      </div>
    </div>
  );
}
