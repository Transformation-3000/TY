'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

export default function DatenschutzPage() {
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
        <Link href="/checkout" className="legal-back-btn">
          <i className="bi bi-arrow-left"></i> Zum Checkout
        </Link>
      </header>

      {/* Content */}
      <main className="legal-content-card">
        <h1 className="legal-title">Datenschutzerklärung</h1>
        <p className="legal-subtitle">Provisorische Fassung zur Orientierung — Stand: Juni 2026</p>
        
        <div className="legal-content">
          <p>
            Der Schutz Ihrer persönlichen Daten ist uns ein großes Anliegen. Nachfolgend informieren wir Sie ausführlich darüber, welche Daten wir erheben und wie wir diese im Einklang mit der Datenschutz-Grundverordnung (DSGVO) verarbeiten.
          </p>

          <h2>1. Verantwortlicher für die Datenverarbeitung</h2>
          <p>
            Verantwortlicher im Sinne des Datenschutzrechts ist die:<br />
            <strong>TrueYears GmbH</strong><br />
            Im Mediapark 5<br />
            50670 Köln<br />
            Deutschland<br />
            E-Mail: <a href="mailto:contact@true-years.com">contact@true-years.com</a>
          </p>

          <h2>2. Datenverarbeitung bei Besuch der Webseite (Server-Logfiles)</h2>
          <p>
            Bei jedem Aufruf unserer Webseite erfasst unser System automatisiert Daten und Informationen vom Computersystem des aufrufenden Rechners. Folgende Daten werden erhoben:
          </p>
          <ul>
            <li>Informationen über den Browsertyp und die verwendete Version</li>
            <li>Das Betriebssystem des Nutzers</li>
            <li>Die IP-Adresse des Nutzers</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>Webseiten, von denen das System des Nutzers auf unsere Internetseite gelangt</li>
          </ul>
          <p>
            Die Rechtsgrundlage für die vorübergehende Speicherung dieser Daten ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Gewährleistung von Systemsicherheit und Fehleranalyse).
          </p>

          <h2>3. Registrierung, Mitgliedschaft und Abrechnungsdaten</h2>
          <p>
            Wenn Sie sich für eine Mitgliedschaft registrieren, verarbeiten wir die von Ihnen eingegebenen Daten zur Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):
          </p>
          <ul>
            <li><strong>Persönliche Daten:</strong> Vorname, Nachname, E-Mail-Adresse.</li>
            <li><strong>Rechnungsadresse:</strong> Straße, Hausnummer, PLZ, Ort, Land.</li>
            <li><strong>Zahlungsdaten:</strong> Abhängig von der gewählten Zahlungsmethode verarbeiten wir Ihre Kreditkartendaten, IBAN/Kontoinhaber oder PayPal-Details. Die Zahlungsabwicklung erfolgt über gesicherte Schnittstellen unserer Zahlungsdienstleister.</li>
          </ul>

          <h2>4. Besondere Kategorien von Daten (Gesundheits- und Wearable-Daten)</h2>
          <p>
            Als Longevity-Plattform verarbeiten wir Daten, die nach Art. 9 Abs. 1 DSGVO als Gesundheitsdaten eingestuft werden. Dazu gehören:
          </p>
          <ul>
            <li>Ergebnisse aus täglichen Check-Ins und Fragebögen zum Lebensstil</li>
            <li>Biometrische Daten und Ergebnisse von Labor-/Biomarkeranalysen (insbesondere im Platin-Plan)</li>
            <li>Daten aus Wearables (z. B. Schlafdaten, Herzfrequenzvariabilität, Aktivität), sofern Sie diese aktiv mit Ihrem TrueYears-Account verknüpfen (Premium- und Platin-Plan)</li>
          </ul>
          <p>
            <strong>Rechtsgrundlage:</strong> Die Verarbeitung dieser Gesundheitsdaten erfolgt ausschließlich auf Basis Ihrer <strong>ausdrücklichen Einwilligung</strong> gemäß Art. 9 Abs. 2 lit. a DSGVO, die Sie im Rahmen des Onboardings oder der Nutzung erteilen. Sie können diese Einwilligung jederzeit mit Wirkung für die Zukunft per E-Mail an contact@true-years.com widerrufen. Der Widerruf berührt die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung nicht.
          </p>

          <h2>5. Weitergabe von Daten an Dritte</h2>
          <p>
            Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur in folgenden Fällen:
          </p>
          <ul>
            <li><strong>Zahlungsabwicklung:</strong> An unsere Zahlungsdienstleister (z.B. Stripe, PayPal, Banken) zur Abwicklung von Transaktionen.</li>
            <li><strong>Laborpartner:</strong> Zur Analyse Ihrer Blut-/Biomarkerwerte (nur im Platin-Plan und unter strenger Pseudonymisierung der Proben).</li>
            <li><strong>Auftragsverarbeiter:</strong> Hosting-Dienstleister und IT-Support im Rahmen gesetzlich vorgeschriebener Auftragsverarbeitungsverträge (Art. 28 DSGVO).</li>
          </ul>

          <h2>6. Cookies und Tracking</h2>
          <p>
            Unsere Webseite verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern und bestimmte Funktionen (wie den Warenkorb und Login-Sitzungen) bereitzustellen. Technisch notwendige Cookies werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gesetzt. Analyse- oder Tracking-Cookies werden nur nach Ihrer aktiven Zustimmung (Consent) im Cookie-Banner gesetzt.
          </p>

          <h2>7. Ihre Rechte als betroffene Person</h2>
          <p>
            Nach der DSGVO stehen Ihnen folgende Rechte bezüglich Ihrer personenbezogenen Daten zu:
          </p>
          <ul>
            <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre verarbeiteten Daten verlangen.</li>
            <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können unvollständige oder falsche Daten korrigieren lassen.</li>
            <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
            <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können verlangen, Ihre Daten in einem strukturierten, gängigen Format zu erhalten.</li>
            <li><strong>Recht auf Widerspruch (Art. 21 DSGVO):</strong> Sie können der Datenverarbeitung widersprechen.</li>
          </ul>
          <p>
            Zur Ausübung dieser Rechte wenden Sie sich bitte formlos per E-Mail an contact@true-years.com. Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
          </p>

          <h2>8. Datensicherheit</h2>
          <p>
            Wir nutzen moderne SSL/TLS-Verschlüsselungsverfahren für die Übertragung von Formulardaten auf unserer Plattform und lagern Gesundheitsdaten in hochsicheren Datenbanken, um unbefugte Zugriffe nach dem Stand der Technik zu verhindern.
          </p>
        </div>
      </main>
    </div>
  );
}
