'use client';

import Image from 'next/image';

export default function LongevityBalanceCheckPage() {
  return (
    <div className="lab-check-page">
      <div className="lab-check-container lab-check-split lab-check-reverse">
        {/* Text 1/3 links */}
        <div className="lab-check-info-section">
          <div className="lab-check-header">
            <h1 className="lab-check-title">Longevity-Balance</h1>
            <p className="lab-check-subtitle">
              Ganzheitliche Stoffwechselanalyse mit über 250 Biomarkern – für ein ganzheitliches Bild deiner metabolischen Gesundheit. Die Ampelfarben zeigen an, in welchem Status sich deine wichtigsten 10 Systeme und Organe aktuell befinden.
            </p>
          </div>

          <div className="lab-check-footer">
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

        {/* Bild 2/3 rechts */}
        <div className="lab-check-image-section">
          <div className="lab-check-image-wrapper">
            <div className="lab-check-image-real">
              <Image
                src="/images/molecular.jpeg"
                alt="Lifespin MetaboPRO"
                width={950}
                height={950}
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
