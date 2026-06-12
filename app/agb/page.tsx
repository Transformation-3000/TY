'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

export default function AGBPage() {
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
        <h1 className="legal-title">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="legal-subtitle">Provisorische Fassung zur Orientierung — Stand: Juni 2026</p>
        
        <div className="legal-content">
          <p>
            Willkommen bei TrueYears. Die folgenden Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der TrueYears-Plattform sowie die Inanspruchnahme unserer Mitgliedschaften.
          </p>

          <h2>§ 1 Geltungsbereich und Vertragspartner</h2>
          <p>
            (1) Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Bereitstellung von digitalen Dienstleistungen, Analysen und Beratungsangeboten, die zwischen der <strong>TrueYears GmbH, Im Mediapark 5, 50670 Köln</strong> (nachfolgend „TrueYears“ oder „Anbieter“) und dem Kunden (nachfolgend „Nutzer“ oder „Mitglied“) geschlossen werden.
          </p>
          <p>
            (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).
          </p>

          <h2>§ 2 Leistungsgegenstand und Gesundheitshinweis</h2>
          <p>
            (1) TrueYears stellt dem Nutzer eine webbasierte Plattform zur Erfassung, Analyse und Visualisierung von gesundheitsbezogenen Daten (z. B. biologisches Alter, Check-Ins, Wearable-Daten) zur Verfügung. Je nach gewählter Mitgliedschaft (Basic, Premium, Platin) umfasst das Angebot:
          </p>
          <ul>
            <li>Digitale Dashboards und tägliche Check-Ins</li>
            <li>Wearable-Integration und Analysen zum biologischen Alter</li>
            <li>Biomarker-Tracking inklusive Labor-Analysen (Platin-Plan)</li>
            <li>Coaching-Inhalte, Live-Calls und Beratung (Platin-Plan)</li>
          </ul>
          <p>
            <strong>(2) WICHTIGER GESUNDHEITSHINWEIS:</strong> Die von TrueYears bereitgestellten Informationen, Berichte, Biomarker-Analysen und Coaching-Empfehlungen stellen <strong>keine medizinische Diagnose, Behandlung, Therapie oder ärztliche Beratung</strong> dar. Die Dienste ersetzen nicht den Besuch bei einem qualifizierten Arzt. Der Nutzer sollte medizinische Entscheidungen stets mit seinem Arzt besprechen.
          </p>

          <h2>§ 3 Registrierung und Vertragsschluss</h2>
          <p>
            (1) Die Nutzung der Plattform setzt eine Registrierung und den Abschluss eines kostenpflichtigen Abonnements voraus.
          </p>
          <p>
            (2) Die Präsentation der Mitgliedschaften auf der Webseite stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Durch Klicken auf den Button „Jetzt zahlungspflichtig bestellen“ im Checkout-Prozess gibt der Nutzer ein verbindliches Angebot zum Abschluss des Abonnement-Vertrages ab.
          </p>
          <p>
            (3) Der Vertrag kommt mit der Aktivierung der Mitgliedschaft und der Zusendung einer Bestätigungs-E-Mail durch TrueYears zustande.
          </p>

          <h2>§ 4 Preise und Zahlungsbedingungen</h2>
          <p>
            (1) Es gelten die zum Zeitpunkt des Vertragsschlusses angegebenen Preise. Alle Preise verstehen sich als monatliche Gebühren inklusive der gesetzlichen deutschen Umsatzsteuer (derzeit 19%).
          </p>
          <p>
            (2) Die Zahlung erfolgt wiederkehrend im Voraus über das vom Nutzer ausgewählte Zahlungsmittel (Kreditkarte, Lastschrift oder PayPal).
          </p>
          <p>
            (3) Befindet sich der Nutzer im Zahlungsverzug, behält sich TrueYears das Recht vor, den Zugang zur Plattform bis zur vollständigen Zahlung zu sperren.
          </p>

          <h2>§ 5 Widerrufsrecht für Verbraucher</h2>
          <p>
            (1) Verbrauchern steht grundsätzlich ein gesetzliches 14-tägiges Widerrufsrecht zu.
          </p>
          <p>
            (2) <strong>Widerrufsbelehrung:</strong> Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses. Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (TrueYears GmbH, Im Mediapark 5, 50670 Köln, E-Mail: contact@true-years.com) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>
          <p>
            (3) <strong>Vorzeitiges Erlöschen des Widerrufsrechts:</strong> Das Widerrufsrecht erlischt vorzeitig bei Verträgen über die Bereitstellung von digitalen Dienstleistungen oder Inhalten, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.
          </p>

          <h2>§ 6 Laufzeit und Kündigung</h2>
          <p>
            (1) Die Verträge werden als Abonnement mit monatlicher Laufzeit geschlossen.
          </p>
          <p>
            (2) Das Abonnement verlängert sich automatisch um jeweils einen weiteren Monat, sofern es nicht von einer der Parteien gekündigt wird. Die Kündigung kann jederzeit zum Ende des laufenden Abrechnungszeitraums erfolgen und direkt im Nutzerkonto oder per E-Mail erklärt werden.
          </p>

          <h2>§ 7 Haftung</h2>
          <p>
            (1) TrueYears haftet unbeschränkt bei Vorsatz oder grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder Gesundheit sowie nach den Vorschriften des Produkthaftungsgesetzes.
          </p>
          <p>
            (2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) ist die Haftung der Höhe nach auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt. Wesentliche Vertragspflichten sind solche, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Nutzer regelmäßig vertrauen darf.
          </p>
          <p>
            (3) Im Übrigen ist die Haftung von TrueYears ausgeschlossen.
          </p>

          <h2>§ 8 Schlussbestimmungen und Streitbeilegung</h2>
          <p>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Bei Verbrauchern gilt diese Rechtswahl nur insoweit, als nicht der gewährte Schutz durch zwingende Bestimmungen des Rechts des Staates, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, entzogen wird.
          </p>
          <p>
            (2) Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a> finden. Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </main>
    </div>
  );
}
