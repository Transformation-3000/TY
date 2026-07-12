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
            <span style={{ fontWeight: 400 }}>Unsere Vision:</span> Longevity for all
          </h1>
          <p style={{ 
            fontSize: '1.4rem', 
            color: '#64748b', 
            maxWidth: '1100px', 
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
                width: '100%',
                height: '220px', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src="/images/vision_praevention_v1.png" 
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
                width: '100%',
                height: '220px', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src="/images/vision_technologie_v1.png" 
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
                width: '100%',
                height: '220px', 
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image 
                  src="/images/vision_wissenschaft_v1.png" 
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
                <h2 style={{ fontSize: '2.4rem', fontWeight: 400, color: '#0f172a', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
                  Unsere Motivation: <span style={{ fontWeight: 800 }}>Warum wir True Years gegründet haben</span>
                </h2>
              </div>
              <blockquote style={{ 
                fontSize: '1.3rem', 
                fontStyle: 'normal',
                color: '#1e3a5f', 
                lineHeight: '1.65', 
                margin: '1.5rem 0 0 0',
                padding: '1.5rem 2rem',
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderLeft: '5px solid #4498ca',
                borderRadius: '0 16px 16px 0',
                fontWeight: 500,
                boxShadow: '0 4px 15px rgba(0, 110, 167, 0.02)'
              }}>
                „Wir haben uns gefragt – warum gibt es weltweit keine wissenschaftlich orientierte Longevity-Plattform, die alles für mich Relevante einfach zusammenführt und mich dabei an die Hand nimmt? Da wir keine gefunden haben, haben wir uns entschlossen selber eine zu bauen :-)“
              </blockquote>
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
                    „Ich träume davon, dass TrueYears das Leben von Millionen Menschen jeden Tag ein Stück besser macht – damit wir spüren: Mein Leben wird besser. Ich habe mehr Energie, mehr Klarheit, mehr Frische und mehr Lebensfreude. Ich möchte dazu beitragen, dass wir das Älterwerden völlig neu denken: nicht als Begrenzung, sondern als gestaltbare Lebensphase – als ein Meer voller Möglichkeiten. Wir sollen länger das tun können, was unser Leben lebenswert macht: lieben, lernen, gestalten, geniessen, entdecken und für andere da sein.“
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
                    „Was wäre, wenn unsere Daten nicht nur erzählen, wo wir stehen, sondern uns jeden Tag zeigen, was als Nächstes zählt? Genau das ist meine Vision für TrueYears: Wir verwandeln komplexe Langlebigkeitsdaten, Wearables und wissenschaftliche Erkenntnisse in einen persönlichen Kompass – verständlich, präzise und direkt umsetzbar. Eine Plattform, die sichtbar macht, was deine Zellen heute brauchen, um langfristig in Bestform zu bleiben. So wird aus Komplexität Klarheit – und Langlebigkeit transparent, messbar und überraschend einfach.“
                  </p>
                </div>
              </div>

            </div>
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
              <div className="footer-partners-logos-new" style={{ marginTop: '1.5rem' }}>
                <div className="footer-partner-logo-new dlg-logo">
                  <Image 
                    src="/images/dlg_logo.png" 
                    alt="Deutsche Longevity Gesellschaft" 
                    width={150} 
                    height={45} 
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="footer-partner-logo-new lifespin-logo">
                  <Image 
                    src="/images/lifespin_logo.png" 
                    alt="Lifespin" 
                    width={120} 
                    height={38} 
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div className="footer-partner-logo-new tuv-logo">
                  <Image 
                    src="/images/tuv_logo.png" 
                    alt="TÜV Rheinland" 
                    width={75} 
                    height={53} 
                    style={{ objectFit: 'contain' }}
                  />
                </div>
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
              <Link href="/unternehmen" style={{ display: 'flex', alignItems: 'center', gap: 0, paddingLeft: 0 }}>
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginRight: '10px' }}>
                  <i className="bi bi-people-fill" style={{ fontSize: '0.98rem', color: 'var(--landing-accent)' }} />
                </div>
                Über uns
              </Link>
              <Link href="/vision" style={{ display: 'flex', alignItems: 'center', gap: 0, paddingLeft: 0 }}>
                <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginRight: '10px' }}>
                  <i className="bi bi-eye" style={{ fontSize: '0.98rem', color: 'var(--landing-accent)' }} />
                </div>
                Unsere Vision
              </Link>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0px', marginBottom: '1.5rem' }}>
                {/* Unternehmen Address Row (Sitz der Gesellschaft) */}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginTop: '3px' }}>
                    <i className="bi bi-geo-alt-fill" style={{ color: 'var(--landing-accent)', fontSize: '1.05rem' }} />
                  </div>
                  <div style={{ flex: 1, paddingLeft: '10px' }}>
                    <p className="footer-company-name-new" style={{ margin: '0 0 2px', lineHeight: '1.2' }}>True Years Beyond Age GmbH</p>
                    <p className="footer-company-name-new" style={{ margin: 0, lineHeight: '1.2' }}>Im Mediapark 5, D-50670 Köln</p>
                  </div>
                </div>
                
                {/* Contact Email Row */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
                    <i className="bi bi-envelope-fill" style={{ color: 'var(--landing-accent)', fontSize: '0.98rem' }} />
                  </div>
                  <a href="mailto:contact@true-years.com" className="footer-email-link-new" style={{ paddingLeft: '10px' }}>
                    contact (at) true-years.com
                  </a>
                </div>
                
                {/* Legal Links (Impressum, Datenschutz, Bildauswahl) under contact email */}
                <div className="footer-legal-links-new" style={{ paddingLeft: '34px', marginTop: '5px' }}>
                  <Link href="/impressum">Impressum</Link>
                  <span className="footer-legal-sep-new">|</span>
                  <Link href="/datenschutz">Datenschutz</Link>
                  <span className="footer-legal-sep-new">|</span>
                  <Link href="/image-preview.html">Bildauswahl</Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom-new">
            <div className="footer-bottom-container-new" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', width: '100%', gap: '1rem' }}>
              <p className="footer-copyright-new" style={{ margin: 0 }}>
                &copy; {new Date().getFullYear()} True Years. Alle Rechte vorbehalten.
              </p>
              <div className="footer-bottom-links-new">
                <span className="footer-security-badge-new">
                  <i className="bi bi-shield-lock-fill" style={{ marginRight: '5px' }} /> DSGVO Konform
                </span>
                <span className="footer-badge-clean-new">Made with <span style={{ color: '#ff4d4d', display: 'inline-block', transform: 'scale(1.15)', margin: '0 2px' }}>♥</span> in Germany</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

