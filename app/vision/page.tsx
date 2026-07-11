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
            fontSize: '1.4rem', 
            color: '#64748b', 
            maxWidth: '900px', 
            margin: '0 auto', 
            lineHeight: '1.6' 
          }}>
            Wir glauben an eine Welt, in der das biologische Alter nicht länger eine unveränderliche Konstante ist, sondern eine aktiv gestaltbare Stellgröße. Dank atemberaubender Fortschritte in der Alterungsforschung können wir heute unsere Vitalität bis ins hohe Alter sichern. Deshalb bauen wir das globale Betriebssystem für gesundes Altern – eine Plattform, die dich motiviert und komplexes Wissen mühelos in messbare Energie und Lebensfreude transformiert.
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
            <div style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
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
                    width: '90px',
                    height: '90px',
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
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                      Michael Wolan
                    </h3>
                    <div style={{ fontSize: '1.05rem', color: '#4498ca', fontWeight: 700 }}>Co-Founder</div>
                  </div>
                </div>

                {/* Believe */}
                <div style={{ marginBottom: 0 }}>
                  <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.7', margin: 0 }}>
                    „Wir stehen an der Schwelle zu einer bahnbrechenden Ära: Alterung ist kein Schicksal mehr, sondern ein gestaltbarer Prozess. Meine Vision für True Years ist es, modernste Wissenschaft und künstliche Intelligenz so einfach nutzbar zu machen, dass jeder Mensch die volle Kontrolle über seine biologische Uhr gewinnt. Wir möchten dir nicht nur Jahre schenken, sondern vitale, gesunde und kraftvolle Lebensjahre voller Energie – datengetrieben, präventiv und perfekt integriert in deinen Alltag. Lass uns das Älterwerden gemeinsam neu definieren.“
                  </p>
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
                    width: '90px',
                    height: '90px',
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
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                      Daniel Haensch
                    </h3>
                    <div style={{ fontSize: '1.05rem', color: '#4498ca', fontWeight: 700 }}>Co-Founder</div>
                  </div>
                </div>

                {/* Believe */}
                <div style={{ marginBottom: 0 }}>
                  <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.7', margin: 0 }}>
                    „In meiner ärztlichen Laufbahn habe ich gelernt, dass Menschen keine Ratschläge ins Blaue hinein brauchen, sondern präzise, verlässliche Lösungen für ihre Gesundheit. Meine Vision ist es, die komplexesten biologischen Daten und Wearable-Routinen so elegant zu orchestrieren, dass sie dir als intuitiver, unsichtbarer Alltags-Kompass dienen. Wir bauen eine Plattform, die dir jeden Tag zeigt, was deine Zellen heute brauchen, um in Bestform zu bleiben. Wir machen Langlebigkeit transparent, nachweisbar und vor allem – einfach.“
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Vision Section */}
        <div style={{ padding: '5rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>

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
