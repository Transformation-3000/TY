'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../landing/landing.css';

interface TeamMember {
  name: string;
  role: string;
  quote: string;
  avatarColor: string;
  image?: string;
  imagePosition?: string;
  imageTransform?: string;
  isZoomedOut?: boolean;
}

const management: TeamMember[] = [
  {
    name: 'Michael Wolan',
    role: 'CEO & Co-Founder',
    quote: '„Meine Vision ist, Longevity so einfach und wirksam zu machen, dass Millionen Menschen jeden Tag davon profitieren.“',
    avatarColor: 'linear-gradient(135deg, #4498ca 0%, #1e40af 100%)',
    image: '/images/michael_wolan_v5.jpg',
    isZoomedOut: true,
    imagePosition: 'center 10%'
  },
  {
    name: 'Daniel Haensch',
    role: 'CDO & Co-Founder',
    quote: '„Durch die intelligente Datenanreicherung und ihre Verarbeitung schaffen wir eine neue, unvergleichliche Kundenerfahrung.“',
    avatarColor: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    image: '/images/daniel_haensch_v3.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Dr. Hermann Sikora',
    role: 'COO',
    quote: '„Mein Anspruch ist, aus wissenschaftlichen Erkenntnissen klare Lösungen zu entwickeln, die im Alltag zuverlässig funktionieren.“',
    avatarColor: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    image: '/images/hermann_sikora_v2.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Prof. Dr. Wolfgang Pree',
    role: 'CTO',
    quote: '„Unsere Deep-Tech-Architektur übersetzt wissenschaftliche Tiefe und komplexe Wechselwirkungen in präzise, alltagstaugliche Empfehlungen.“',
    avatarColor: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
    image: '/images/wolfgang_pree_v2.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Prof. Joerg Fischer',
    role: 'Legal Advisor',
    quote: '„Innovation braucht Vertrauen – und einen rechtlichen Rahmen, der Menschen, Daten und Ideen zuverlässig schützt.“',
    avatarColor: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    image: '/images/joerg_fischer_v2.jpg',
    imagePosition: 'center 10%'
  }
];

const advisoryBoard: TeamMember[] = [
  {
    name: 'Prof. Dr. Nadine Galandi',
    role: 'Stressmanagement',
    quote: '„Ein reslientes, ausbalanciertes Nervensystem ist der Schlüssel zur zellulären Regeneration und langfristigen Vitalität.“',
    avatarColor: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    image: '/images/nadine_galandi_v2.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Prof. Dr. Axel Koch',
    role: 'Verhaltenspsychologie',
    quote: '„Longevity entsteht nicht durch Wissen allein, sondern durch den erfolgreichen Transfer in dauerhaft wirksame Gewohnheiten.“',
    avatarColor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    image: '/images/axel_koch_v2.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Dr. med. Markus Zillgens',
    role: '360-Grad Longevity',
    quote: '„Ein proaktiver, ganzheitlich prakizierter Lebensstil hilft uns dabei, Vitalität nicht nur zu erhalten, sondern sie vielsetig zu optimieren.“',
    avatarColor: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
    image: '/images/markus_zillgens_v3.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Dr. Hans-Georg Sprenger',
    role: 'Altersforschung',
    quote: '„Longevity bedeutet für mich, die natürlichen Energiequellen unseres Körpers möglichst lange leistungsfähig zu halten.“',
    avatarColor: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    image: '/images/hans_georg_sprenger_v2.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Prof. Dr. med. Sandra Eifert',
    role: 'Female Longevity',
    quote: '„Frauen sind biologisch für ein langes Leben bestens ausgestattet – entscheidend ist, dieses Potenzial bewusst und frühzeitig zu stärken.“',
    avatarColor: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    image: '/images/sandra_eifert_v2.jpg',
    imagePosition: 'center 10%'
  }
];

const team: TeamMember[] = [
  {
    name: 'Eileen Jacobs',
    role: 'Customer Success Managerin',
    quote: '„Jeder Mensch braucht etwas anderes. Ich finde heraus, was dir guttut und wie dein persönlicher Weg weitergehen kann.“',
    avatarColor: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
    image: '/images/eileen_jacobs_v2.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Monique Haensch',
    role: 'Customer Success Managerin',
    quote: '„Dein Ziel ist auch mein Ziel. Ich bleibe dran, bis die Umsetzung für dich wirklich funktioniert.“',
    avatarColor: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
    image: '/images/monique_haensch_v3.jpg',
    imagePosition: 'center 10%'
  },
  {
    name: 'Sarah Standfuss',
    role: 'Customer Success Managerin',
    quote: '„Mit offenem Ohr und Leidenschaft sorge ich dafür, dass unsere Kund:innen das Beste aus ihremTrue Years Programm herausholen.“',
    avatarColor: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
    image: '/images/sarah_standfuss_v2.jpg',
    imagePosition: 'center 10%'
  }
];

export default function UnternehmenPublicPage() {
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

  const renderGrid = (members: TeamMember[]) => (
    <div className="new-features-grid" style={{ marginBottom: '3rem' }}>
      {members.map((member, idx) => (
        <div key={idx} className="new-feature-card">
          <div className="new-feature-image-wrapper" style={{ background: member.image ? 'transparent' : member.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {member.image ? (
              member.isZoomedOut ? (
                <img 
                  src={member.image} 
                  alt={member.name} 
                  style={{
                    objectFit: 'cover',
                    objectPosition: member.imagePosition || 'center',
                    width: '125%',
                    height: '125%',
                    position: 'absolute',
                    left: '-12.5%',
                    top: '-12.5%',
                    transform: 'scale(0.8)'
                  }} 
                />
              ) : (
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  style={{
                    objectFit: 'cover',
                    objectPosition: member.imagePosition || 'center',
                    transform: member.imageTransform || 'none'
                  }} 
                />
              )
            ) : (
              <i className="bi bi-person-fill" style={{ fontSize: '4.5rem', color: 'rgba(255, 255, 255, 0.85)' }}></i>
            )}
          </div>
          <div className="new-feature-content-inner" style={{ padding: '1.5rem' }}>
            <div className="new-feature-number" style={{ fontSize: '0.98rem', color: '#4498ca', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {member.role}
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.75rem 0', fontFamily: 'DM Sans, sans-serif' }}>
              {member.name}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', fontStyle: 'italic', margin: 0, lineHeight: '1.6' }}>
              {member.quote}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

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
        <div className="content-inner" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0', fontFamily: 'DM Sans, sans-serif' }}>
              Über uns
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '1150px', margin: '0 auto', lineHeight: '1.6' }}>
              Wir verbinden führende Alterungsforschung, Verhaltenspsychologie, Personal Trainings, Education, Labordienstleistung, Wearable-Integration und Longevity Analytics zu einem integrierten, wirksamen Lösungsangebot, um deine Vitalität zu erhöhen, deine Balance zu erhalten und deine gesunde Lebensspanne zu verlängern. Lerne das Team hinter True Years kennen.
            </p>
          </div>

          {/* Management Section */}
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ display: 'inline-block', width: '5px', height: '28px', backgroundColor: '#4498ca', marginRight: '14px', borderRadius: '4px' }}></span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>Management Board</h2>
            </div>
            {renderGrid(management)}
          </section>

          {/* Advisory Board Section */}
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ display: 'inline-block', width: '5px', height: '28px', backgroundColor: '#4498ca', marginRight: '14px', borderRadius: '4px' }}></span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>Advisory Board</h2>
            </div>
            {renderGrid(advisoryBoard)}
          </section>

          {/* Team Section */}
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <span style={{ display: 'inline-block', width: '5px', height: '28px', backgroundColor: '#4498ca', marginRight: '14px', borderRadius: '4px' }}></span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>Customer Success Team</h2>
            </div>
            {renderGrid(team)}
          </section>

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
