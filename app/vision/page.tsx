'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../landing/landing.css';

export default function VisionPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className={`landing-nav ${navScrolled ? 'landing-nav-scrolled' : ''} ${menuOpen ? 'landing-nav-open' : ''}`}>
        <div className="landing-nav-container">
          <Link href="/" className="logo">
            <Image 
              src="/images/logoneu.png" 
              alt="TrueYears Logo" 
              width={180} 
              height={60} 
              className="landing-header-logo"
              priority
            />
          </Link>
          <button 
            className={`landing-nav-toggle ${menuOpen ? 'toggle-active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="hamburger"></span>
          </button>
          <div className={`landing-nav-links ${menuOpen ? 'landing-nav-links-open' : ''}`}>
            <Link href="/#features" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Bausteine</Link>
            <Link href="/#erfolgsprinzip" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Mitgliedschaften</Link>
            <Link href="/#testphase" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Wissenschaft</Link>
            <Link href="/#kundenstimmen" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Kundenstimmen</Link>
            <Link href="/checkout" className="landing-nav-link" onClick={() => setMenuOpen(false)} aria-label="Warenkorb" style={{ display: 'flex', alignItems: 'center' }}>
              <i className="bi bi-cart3" style={{ fontSize: '1.5rem' }}></i>
            </Link>
            <Link href="/dashboard" className="btn-cta-small" onClick={() => setMenuOpen(false)}>Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ paddingTop: '100px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        
        {/* Hero Section */}
        <div style={{ padding: '6rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>

          <h1 style={{ 
            fontSize: '3.2rem', 
            fontWeight: 800, 
            color: '#0f172a', 
            margin: '0 0 1.5rem 0', 
            fontFamily: 'DM Sans, sans-serif',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          }}>
            Das Leben neu definieren:<br />Mehr gesunde Lebensjahre für alle
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#64748b', 
            maxWidth: '900px', 
            margin: '0 auto', 
            lineHeight: '1.6' 
          }}>
            Wir glauben an eine Welt, in der das biologische Alter nicht länger eine unveränderliche Konstante ist, sondern eine aktiv gestaltbare Stellgröße.
          </p>
        </div>

        {/* Pillars Grid */}
        <div style={{ padding: '2rem 2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="new-features-grid" style={{ marginBottom: '4rem' }}>
            
            {/* Card 1 */}
            <div className="new-feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '220px', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src="/images/member_benefits_real_people.png" 
                  alt="Prävention statt Reaktion" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="new-feature-content-inner" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '0.98rem', color: '#4498ca', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Fokus 01
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0', fontFamily: 'DM Sans, sans-serif' }}>
                  Prävention statt Reaktion
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                  Die traditionelle Medizin reagiert meist erst bei Krankheit. Unsere Vision verschiebt diesen Fokus radikal hin zu einer proaktiven Langlebigkeit. Durch die kontinuierliche Erfassung und Optimierung von molekularen Biomarkern fangen wir Alterungsprozesse ab, bevor sie zu Einschränkungen führen.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="new-feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '220px', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src="/images/checkins_logging_ui.png" 
                  alt="Intelligente Technologien" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="new-feature-content-inner" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '0.98rem', color: '#16a34a', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Fokus 02
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0', fontFamily: 'DM Sans, sans-serif' }}>
                  Intelligente Technologien
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                  Jeder Körper ist einzigartig. Wir nutzen modernste KI, Labor- und Wearable-Daten, um maßgeschneiderte Langlebigkeits-Protokolle zu erstellen. Unsere Technologie lernt kontinuierlich aus deinen Gewohnheiten und passt Empfehlungen dynamisch an deinen Alltag an.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="new-feature-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '220px', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src="/images/trends_rejuvenation_chart.png" 
                  alt="Wissenschaftliche Exzellenz" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="new-feature-content-inner" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '0.98rem', color: '#db2777', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Fokus 03
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0', fontFamily: 'DM Sans, sans-serif' }}>
                  Wissenschaftliche Exzellenz
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                  Langlebigkeit ist kein Zufallsprodukt, sondern das Ergebnis evidenzbasierter Alterungs- und Verhaltensforschung. Wir arbeiten eng mit führenden Medizinern, Wissenschaftlern und Forschern zusammen, um die neuesten wissenschaftlichen Durchbrüche direkt in verständliche, alltagstaugliche Habits zu übersetzen.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Vision 1.0: Gründermotivation */}
        <div style={{ backgroundColor: '#ffffff', padding: '5rem 2rem', borderTop: '1px solid rgba(0, 110, 167, 0.05)', borderBottom: '1px solid rgba(0, 110, 167, 0.05)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-block', width: '5px', height: '32px', backgroundColor: '#4498ca', marginRight: '14px', borderRadius: '4px' }}></span>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                  Unsere Motivation: <span style={{ fontWeight: 400 }}>Warum wir True Years gegründet haben</span>
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              
              {/* Column Michael (M) */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '20px', 
                padding: '2.5rem', 
                border: '1px solid rgba(0, 110, 167, 0.03)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Image 
                      src="/images/michael_wolan_v5.jpg" 
                      alt="Michael Wolan" 
                      fill 
                      style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                      Michael Wolan
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#4498ca', fontWeight: 700 }}>CEO & Co-Founder</div>
                  </div>
                </div>

                {/* Pain */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-lightning-charge-fill" style={{ color: '#ef4444' }}></i> Der Schmerzpunkt (Pains)
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    „2020 – Als mir erstmalig bewusst geworden ist, wie anspruchsvoll und energiezehrend Strategieberatung ist. Die Kunden haben zurecht hohe Ansprüche an Zusammenarbeit und Ergebnis. Und dieses hängt sehr stark an meiner Person (Eintausch Zeit gegen Geld), die nicht richtig skalierbar ist.“
                  </p>
                </div>

                {/* Believe */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-patch-check-fill" style={{ color: '#16a34a' }}></i> Die Überzeugung (Believe)
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    „Richtiger Zeitpunkt: Longevity auf dem Weg zum Mainstream. Noch nie zuvor hatten wir so viel Wissen über unsere Biologie & Tech, sie zu beeinflussen. Wir treten ein in ein neues Zeitalter der Selbstwirksamkeit: datengetrieben, präventiv und persönlich.“
                  </p>
                </div>

                {/* Vision */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-eye-fill" style={{ color: '#3b82f6' }}></i> Das Motivationsziel (Vision)
                  </h4>
                  <ul style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0, paddingLeft: '1.2rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>Nur noch <strong>am System</strong> zu bauen, nicht mehr im System selbst zu arbeiten („Pure AI Player“).</li>
                    <li style={{ marginBottom: '0.5rem' }}>True Years auch <strong>für mich</strong> nutzen, als Orientierungssystem, um 111+ Jahre alt zu werden.</li>
                    <li style={{ marginBottom: '0.5rem' }}>Mit <strong>KI als größte Technologie</strong> der Menschheit werden wir schon bald Alterungsprozesse viel präziser verstehen – und sie durch personalisierte Programme verlangsamen.</li>
                    <li>Ich glaube fest daran, dass wir mit True Years einen <strong>international bedeutsamen Player</strong> aufbauen können.</li>
                  </ul>
                </div>
              </div>

              {/* Column Daniel (D) */}
              <div style={{ 
                background: '#f8fafc', 
                borderRadius: '20px', 
                padding: '2.5rem', 
                border: '1px solid rgba(0, 110, 167, 0.03)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Image 
                      src="/images/daniel_haensch_v3.jpg" 
                      alt="Daniel Haensch" 
                      fill 
                      style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
                    />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                      Daniel Haensch
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#4498ca', fontWeight: 700 }}>CDO & Co-Founder</div>
                  </div>
                </div>

                {/* Pain */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-lightning-charge-fill" style={{ color: '#ef4444' }}></i> Der Schmerzpunkt (Pains)
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    „Vor ca. 5 Jahren hatte ich verstärkt das Gefühl, es müsste noch etwas mehr geben im beruflichen Sinne als das bisher erreichte. Der Wunsch mit Menschen zusammen zu arbeiten, die einen eigenen inneren Antrieb haben, um Ziele zu erreichen wuchs zusehends. Ich hatte für mich erkannt, dass Größeres zu erreichen, nur in einem Umfeld stattfinden kann, in dem Ideen und Leistungen auf einen fruchtbaren Boden fallen (Alle ziehen an 1 Strang).“
                  </p>
                </div>

                {/* Believe */}
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-patch-check-fill" style={{ color: '#16a34a' }}></i> Die Überzeugung (Believe)
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    „Im Laufe meiner beruflichen Tätigkeit hat sich ein Bild der Dinge ergeben, die die Bevölkerung wirklich braucht, um echte Verbesserung ihres Gesundheitszustandes zu erreichen. Das soll mit diesem Programm erreicht werden.“
                  </p>
                </div>

                {/* Vision */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="bi bi-eye-fill" style={{ color: '#3b82f6' }}></i> Das Motivationsziel (Vision)
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                    „Die Idee, dass wir mittels solch eines Programms sehr viele Menschen erreichen können (Skalierbarkeit) und dass der hohe Automatisierungsgrad ein gewisses Maß an Unabhängigkeit in der Leistungserbringung verspricht.“
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Vision Section */}
        <div style={{ padding: '5rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.04)',
            border: '1px solid rgba(0, 110, 167, 0.05)',
            marginBottom: '4rem'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
              Unser Beitrag zur Langlebigkeits-Revolution
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              Die Alterungsforschung macht atemberaubende Fortschritte. Wir stehen an der Schwelle einer Ära, in der wir nicht nur die Jahre unseres Lebens verlängern, sondern die Vitalität und Strahlkraft innerhalb dieser Jahre sichern können.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', margin: 0 }}>
              Unsere Vision geht über die reine Bereitstellung von Software hinaus: Wir bauen das globale Betriebssystem für gesundes Altern. Ein System, das motiviert, belohnt und fundiertes Wissen mühelos in Freude und Energie transformiert.
            </p>
          </div>

          {/* CTA Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)',
            borderRadius: '24px',
            padding: '4rem 3rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 1rem', fontFamily: 'DM Sans, sans-serif', color: 'white' }}>
              Bereit, deine Zukunft zu gestalten?
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.9)', maxWidth: '700px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
              Warte nicht auf morgen. Starte noch heute dein persönliches TrueYears Programm und aktiviere dein gesundes Langlebigkeits-Potenzial.
            </p>
            <Link href="/#mitgliedschaften" style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'white',
              color: '#1e3a8a',
              fontWeight: 700,
              borderRadius: '30px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Jetzt starten
            </Link>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="footer-new">
        <div className="footer-container-new">
          <div className="footer-top-new">
            <div className="footer-brand-new">
              <Image 
                src="/images/logoneu.png" 
                alt="TrueYears Logo" 
                width={180} 
                height={60} 
                className="footer-logo-new"
              />
              <p className="footer-description-new">
                TrueYears ist die am schnellsten wachsende Deep-Tech-Plattform für Langlebigkeit in Europa, die führende Alterungs- und Verhaltensforschung sowie intelligente Technologien und Services zu einer integrierten Lösung aus einer Hand verbindet.
              </p>
              <div className="footer-socials-new" style={{ marginBottom: '1.5rem' }}>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon-new" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon-new" aria-label="Instagram">
                  <i className="bi bi-instagram" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon-new" aria-label="Youtube">
                  <i className="bi bi-youtube" />
                </a>
              </div>
              <div className="footer-partner-logo-new dlg-logo" style={{ marginTop: '1rem' }}>
                <Image 
                  src="/images/dlg_logo.png" 
                  alt="Deutsche Longevity Gesellschaft" 
                  width={150} 
                  height={45} 
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            
            <div className="footer-col-new">
              <h4>Features</h4>
              <Link href="/#features"><i className="bi bi-check2-circle" /> Tägliche Check-Ins</Link>
              <Link href="/#features"><i className="bi bi-compass" /> Do it yourself</Link>
              <Link href="/#features"><i className="bi bi-chat-left-dots" /> Personal Trainer</Link>
              <Link href="/#features"><i className="bi bi-journal-text" /> Inspiration & Insights</Link>
              <Link href="/#features"><i className="bi bi-graph-up-arrow" /> Entwicklung & Trends</Link>
              <Link href="/#features"><i className="bi bi-patch-check" /> Member-Vorteile</Link>
            </div>
            
            <div className="footer-col-new">
              <h4>Mitgliedschaft</h4>
              <Link href="/#konzept"><i className="bi bi-arrow-right-short" /> Wie es funktioniert</Link>
              <Link href="/#features"><i className="bi bi-arrow-right-short" /> Diagnostik & Labortests</Link>
              <Link href="/#erfolgsprinzip"><i className="bi bi-arrow-right-short" /> Preise & Pakete</Link>
              <Link href="/#kundenstimmen"><i className="bi bi-arrow-right-short" /> Erfolgsgeschichten</Link>
              <span style={{ color: '#94a3b8', fontSize: '1.03rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'default' }}>
                <i className="bi bi-arrow-right-short" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }} /> Wearables & Integration
              </span>
            </div>
            
            <div className="footer-col-new">
              <h4>Unternehmen</h4>
              <Link href="/unternehmen"><i className="bi bi-arrow-right-short" /> Über uns</Link>
              <Link href="/vision"><i className="bi bi-arrow-right-short" /> Unsere Vision</Link>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px', marginBottom: '1.5rem' }}>
                {/* Address */}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                    <i className="bi bi-geo-alt-fill" style={{ color: 'var(--landing-accent)', fontSize: '1.05rem' }} />
                  </div>
                  <div style={{ flex: 1, paddingLeft: '10px' }}>
                    <p className="footer-company-name-new" style={{ margin: '0 0 2px', lineHeight: '1.2' }}>True Years Beyond Age GmbH</p>
                    <p className="footer-company-name-new" style={{ margin: '0 0 2px', lineHeight: '1.2' }}>Im Mediapark 5</p>
                    <p className="footer-company-name-new" style={{ margin: '0 0 2px', lineHeight: '1.2' }}>D-50670 Köln</p>
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                    <i className="bi bi-envelope-fill" style={{ color: 'var(--landing-accent)', fontSize: '0.98rem' }} />
                  </div>
                  <a href="mailto:contact@true-years.com" className="footer-email-link-new" style={{ paddingLeft: '10px' }}>
                    contact (at) true-years.com
                  </a>
                </div>
              </div>
              
              <div className="footer-legal-links-new">
                <Link href="/impressum">Impressum</Link>
                <span className="footer-legal-sep-new">|</span>
                <Link href="/datenschutz">Datenschutz</Link>
                <span className="footer-legal-sep-new">|</span>
                <Link href="/image-preview.html">Bildauswahl</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom-new">
            <div className="footer-bottom-container-new">
              <p className="footer-copyright-new" style={{ margin: 0 }}>
                &copy; {new Date().getFullYear()} True Years. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
