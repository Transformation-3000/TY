'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

export default function ImpressumPage() {
  return (
    <div className="legal-container">
      {/* Header */}
      <header className="legal-header">
        <Link href="/">
          <Image 
            src="/images/logoneu.png" 
            alt="TrueYears Logo" 
            width={180} 
            height={60} 
            className="legal-header-logo"
            priority
          />
        </Link>
        <Link href="/" className="legal-back-btn">
          <i className="bi bi-arrow-left"></i> Zur Startseite
        </Link>
      </header>

      {/* Content */}
      <main className="legal-content-card">
        <h1 className="legal-title">Impressum</h1>
        <p className="legal-subtitle">Angaben gemäß § 5 TMG — Stand: Juni 2026</p>
        
        <div className="legal-content">
          <h2>Angaben über das Unternehmen</h2>
          <p>
            <strong>True Years Beyond Age GmbH</strong><br />
            Im Mediapark 5<br />
            50670 Köln<br />
            Deutschland
          </p>

          <h2>Vertretung</h2>
          <p>
            Die True Years Beyond Age GmbH wird gesetzlich vertreten durch ihren Geschäftsführer:<br />
            <strong>Dr. Leon Nees</strong>
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:contact@true-years.com">contact@true-years.com</a><br />
            Webseite: <Link href="/">www.true-years.com</Link>
          </p>

          <h2>Registereintrag</h2>
          <p>
            Eintragung im Handelsregister.<br />
            Registergericht: <strong>Amtsgericht Köln</strong><br />
            Registernummer: <strong>HRB 114892</strong> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>(provisorisch)</span>
          </p>

          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            <strong>DE 364890123</strong> <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>(provisorisch)</span>
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Dr. Leon Nees<br />
            Im Mediapark 5<br />
            50670 Köln<br />
            Deutschland
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:&nbsp;
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.<br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>

          <h2>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>
      </main>
    </div>
  );
}
