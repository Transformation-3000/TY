import React from 'react';
import Link from 'next/link';

export default function SoftwareMitgliedschaftenSection({ router }: { router: any }) {
  return (
    <section id="erfolgsprinzip" className="pricing-section">
      {/* Mitgliedschaften Section */}
      <div className="section-header">
        <h2>Wähle dein Mitgliedschaftsmodell</h2>
        <p>Finde die passende Mitgliedschaft für deine persönliche Longevity-Journey.</p>
      </div>

      <div className="pricing-grid">
        {/* Starter Plan */}
        <div 
          className="pricing-card" 
          onClick={() => router.push('/checkout?plan=basic')}
          style={{ cursor: 'pointer' }}
        >
          <div className="pricing-header">
            <h3>Starter</h3>
          </div>
          <div className="price-box">
            <span className="price">29,90 €</span>
            <span className="price-period">/ Monat</span>
          </div>
          <ul className="pricing-features">
            <li><i className="bi bi-check-circle-fill"></i> Tägliche Check-Ins</li>
            <li><i className="bi bi-check-circle-fill"></i> Persönliche Dashboards</li>
            <li><i className="bi bi-check-circle-fill"></i> Do it yourself (Basic)</li>
            <li><i className="bi bi-check-circle-fill"></i> Longevity Trainer (Basic)</li>
            <li><i className="bi bi-check-circle-fill"></i> Longevity Insights</li>
            <li><i className="bi bi-check-circle-fill"></i> Monatliche Live-Calls</li>
          </ul>
          <Link href="/checkout?plan=basic" className="btn-pricing btn-outline">
            Mitgliedschaft starten
          </Link>
        </div>

        {/* Premium Plan */}
        <div 
          className="pricing-card premium-plan" 
          onClick={() => router.push('/checkout?plan=premium')}
          style={{ cursor: 'pointer' }}
        >
          <div className="pricing-badge">Beliebt</div>
          <div className="pricing-header">
            <h3>Premium</h3>
          </div>
          <div className="price-box">
            <span className="price">49,90 €</span>
            <span className="price-period">/ Monat</span>
          </div>
          <ul className="pricing-features">
            <li><i className="bi bi-check-circle-fill"></i> Tägliche Check-Ins</li>
            <li><i className="bi bi-check-circle-fill"></i> Persönliche Dashboards</li>
            <li><i className="bi bi-check-circle-fill"></i> Do it yourself (Pro)</li>
            <li><i className="bi bi-check-circle-fill"></i> Longevity Trainer (Pro)</li>
            <li><i className="bi bi-check-circle-fill"></i> Longevity Insights</li>
            <li><i className="bi bi-check-circle-fill"></i> Monatliche Live-Calls</li>
            <li className="highlighted-feature"><i className="bi bi-check-circle-fill"></i> Wearable-Integration</li>
            <li className="highlighted-feature"><i className="bi bi-check-circle-fill"></i> BioAge-Optimizer</li>
            <li className="highlighted-feature"><i className="bi bi-check-circle-fill"></i> Feel-Good-Area</li>
          </ul>
          <Link href="/checkout?plan=premium" className="btn-pricing btn-filled">
            Mitgliedschaft starten
          </Link>
        </div>

        {/* Platin Plan */}
        <div 
          className="pricing-card platin-plan" 
          onClick={() => router.push('/checkout?plan=platin')}
          style={{ cursor: 'pointer' }}
        >
          <div className="pricing-header">
            <h3>Platin</h3>
          </div>
          <div className="price-box">
            <span className="price">89,90 €</span>
            <span className="price-period">/ Monat</span>
          </div>
          <ul className="pricing-features">
            <li><i className="bi bi-check-circle-fill"></i> Tägliche Check-Ins</li>
            <li><i className="bi bi-check-circle-fill"></i> Persönliche Dashboards</li>
            <li><i className="bi bi-check-circle-fill"></i> Do it yourself (Pro)</li>
            <li><i className="bi bi-check-circle-fill"></i> Longevity Trainer (Pro)</li>
            <li><i className="bi bi-check-circle-fill"></i> Longevity Insights</li>
            <li><i className="bi bi-check-circle-fill"></i> Monatliche Live-Calls</li>
            <li><i className="bi bi-check-circle-fill"></i> Wearable-Integration</li>
            <li><i className="bi bi-check-circle-fill"></i> BioAge-Optimizer</li>
            <li><i className="bi bi-check-circle-fill"></i> Feel-Good-Area</li>
            <li className="highlighted-feature"><i className="bi bi-check-circle-fill"></i> Biomarker-Tracking mit Lab-Analysen</li>
            <li className="highlighted-feature"><i className="bi bi-check-circle-fill"></i> Jährliches 1:1-Expertengespräch</li>
          </ul>
          <Link href="/checkout?plan=platin" className="btn-pricing btn-accent">
            Mitgliedschaft starten
          </Link>
        </div>
      </div>
    </section>
  );
}
