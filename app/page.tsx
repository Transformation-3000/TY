'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './landing/landing.css';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
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
          className={`nav-toggle ${menuOpen ? 'toggle-active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>
        <div className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}>
          <Link href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="#erfolgsprinzip" className="nav-link" onClick={() => setMenuOpen(false)}>Erfolgsprinzip</Link>
          <Link href="#expertise" className="nav-link" onClick={() => setMenuOpen(false)}>Expertise</Link>
          <Link href="#kundenstimmen" className="nav-link" onClick={() => setMenuOpen(false)}>Kundenstimmen</Link>
          <Link href="/login?from=/dashboard" className="btn-cta-small" onClick={() => setMenuOpen(false)}>Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-fullscreen-bg">
          <Image 
            src="/images/longevity_hero_clinic.png" 
            alt="Longevity Clinic" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <div className="hero-fullscreen-overlay" />
        
        <div className="hero-content-fullscreen">
          <h1>Dein Weg zu 100+ Jahre Vitalität.</h1>
          <p>
            TrueYears ist dein persönlicher Longevity-Assistent. Hier bringst du deine 
            biologische Daten, Aktivitäten, KI-gestütztes Coaching und wissenschaftlich 
            fundierte Routinen in einer App zusammen.
          </p>
          <div className="hero-btns">
            <Link href="/login?from=/dashboard" className="btn-primary-large">LOGIN</Link>
            <Link href="#konzept" className="btn-secondary-large">KONZEPT ENTDECKEN</Link>
          </div>
        </div>
      </header>

      {/* 1. App Features Section */}
      <section id="features" className="new-features-section">
        <div className="new-features-header">
          <h2>Deine TrueYears Features</h2>
          <p>
            Alles, was du für ein langes Leben in maximaler Vitalität benötigst, 
            vereint in einer intelligenten Plattform.
          </p>
        </div>
        <div className="new-features-grid">
          <div className="new-feature-card">
            <div className="new-feature-icon-wrapper">
              <i className="bi bi-house-door-fill"></i>
            </div>
            <h3>Tägliches Dashboard</h3>
            <p>Dein zentraler Hub. Behalte dein biologisches Alter, deine wichtigsten Biomarker und Live-Wearable-Daten von Oura, Garmin oder Apple Watch in Echtzeit im Blick.</p>
          </div>
          <div className="new-feature-card">
            <div className="new-feature-icon-wrapper">
              <i className="bi bi-rocket-takeoff-fill"></i>
            </div>
            <h3>Quick Wins</h3>
            <p>Erreiche spürbare und nachhaltige Verbesserungen im Alltag durch wissenschaftlich validierte Micro-Habits und personalisierte tägliche Gesundheitsaufgaben.</p>
          </div>
          <div className="new-feature-card">
            <div className="new-feature-icon-wrapper">
              <i className="bi bi-person-circle"></i>
            </div>
            <h3>Personal AI Trainer</h3>
            <p>Deine persönliche Longevity-Coachin Lisa AI begleitet dich rund um die Uhr, beantwortet komplexe Fragen und motiviert dich bei jedem Schritt.</p>
          </div>
          <div className="new-feature-card">
            <div className="new-feature-icon-wrapper">
              <i className="bi bi-stars"></i>
            </div>
            <h3>Inspiration & Insights</h3>
            <p>Erhalte maßgeschneiderte Lese-Empfehlungen, Lifestyle-Tipps und exklusives, aktuelles Wissen aus der internationalen Alters- und Langlebigkeitsforschung.</p>
          </div>
          <div className="new-feature-card">
            <div className="new-feature-icon-wrapper">
              <i className="bi bi-graph-up-arrow"></i>
            </div>
            <h3>Biomarker-Entwicklung</h3>
            <p>Visualisiere deine biologische Entwicklung mit detaillierten Verlaufscharts und tracke präzise die Verjüngung deines zellulären Alters.</p>
          </div>
          <div className="new-feature-card">
            <div className="new-feature-icon-wrapper">
              <i className="bi bi-gift-fill"></i>
            </div>
            <h3>Member-Vorteile</h3>
            <p>Teile deine Longevity-Journey mit Freunden. Empfiehl TrueYears weiter und sichere dir und deinen Kontakten wertvolle Gratismonate.</p>
          </div>
        </div>
      </section>

      {/* 2. Kundenstimmen Section (Testimonials) */}
      <section id="kundenstimmen" className="features" style={{ background: 'linear-gradient(to bottom, #fff, #f0f9ff)' }}>
        <div className="section-header">
          <h2>Was unsere Mitglieder sagen</h2>
          <p>Echte Ergebnisse von Menschen auf ihrer Longevity-Journey.</p>
        </div>
        <div className="features-grid">
          {[
            { name: "Monique S.", text: "Seit ich TrueYears nutze, habe ich meine Energie am Nachmittag verdoppelt. Die Insights sind lebensverändernd.", img: "/images/profile-large.png" },
            { name: "Thomas K.", text: "Endlich verstehe ich, was meine Oura-Daten wirklich bedeuten. Das AI-Coaching ist wie ein privater Biohacker.", img: "/images/tomjung.png" },
            { name: "Sarah L.", text: "Die Verbindung aus Labortests und täglichen Micro-Habits ist genau das, was mir gefehlt hat.", img: "/images/woman3.png" }
          ].map((t, i) => (
            <div key={i} className="feature-card" style={{ textAlign: 'left', padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                  <Image src={t.img} alt={t.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--landing-dark)' }}>{t.name}</h4>
                  <div style={{ color: '#ffc107', fontSize: '0.8rem' }}>★★★★★</div>
                </div>
              </div>
              <p style={{ fontStyle: 'italic', color: 'var(--landing-text)' }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Testphase Section (Final CTA) */}
      <section id="testphase" className="final-cta">
        <h2>Wissenschaftlich fundierte Langlebigkeit.</h2>
        <p>
          Übernimm die Kontrolle über dein biologisches Alter. Nutze Präzisions-Diagnostik 
          und KI-gestützte Strategien für ein längeres Leben in maximaler Vitalität.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer-new">
        <div className="footer-container-new">
          <div className="footer-top-new">
            <div className="footer-brand-new">
              <Image 
                src="/images/logoneu.png" 
                alt="TrueYears Logo" 
                width={160} 
                height={53} 
                className="footer-logo-new"
              />
              <p className="footer-description-new">
                True Years ist die am schnellsten wachsende europäische Plattform für Langlebigkeit, um das biologische Alter mit KI und Wissenschaft zurückzudrehen.
              </p>
              <div className="footer-contact-info-new">
                <p className="footer-company-name-new">True Years Beyond Age GmbH</p>
                <p>Im Mediapark 5</p>
                <p>50670 Köln</p>
                <p style={{ marginTop: '0.75rem' }}>
                  <a href="mailto:contact@true-years.com" className="footer-email-link-new">
                    contact@true-years.com
                  </a>
                </p>
              </div>
            </div>
            
            <div className="footer-nav-grid-new">
              <div className="footer-col-new">
                <h4>Features</h4>
                <Link href="#features">Dashboard</Link>
                <Link href="#features">Quick Wins</Link>
                <Link href="#features">AI Trainer</Link>
                <Link href="#features">Insights</Link>
              </div>
              
              <div className="footer-col-new">
                <h4>Rechtliches</h4>
                <Link href="/impressum">Impressum</Link>
                <Link href="/datenschutz">Datenschutz</Link>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom-new">
            <p>&copy; 2026 True Years Beyond Age GmbH. Alle Rechte vorbehalten.</p>
            <div className="footer-bottom-links-new">
              <span className="footer-badge-clean-new">Made with ♥ in Germany</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
