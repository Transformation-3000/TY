'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './landing/landing.css';

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="nav">
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
        <div className="nav-links">
          <Link href="#features" className="nav-link">Features</Link>
          <Link href="#erfolgsprinzip" className="nav-link">Erfolgsprinzip</Link>
          <Link href="#expertise" className="nav-link">Expertise</Link>
          <Link href="#kundenstimmen" className="nav-link">Kundenstimmen</Link>
          <Link href="#testphase" className="nav-link">Testphase</Link>
          <Link href="/login?from=/dashboard" className="btn-cta-small">Login</Link>
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
          <div className="hero-badge">TrueYears Longevity Companion</div>
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

      {/* 1. Erfolgsprinzip Section (New Centered Science Design) */}
      <section id="erfolgsprinzip" className="flower-section">
        <div className="flower-content">
          <h2>Die Wissenschaft der Langlebigkeit</h2>
          <p>
            Wir nutzen präzise Biomarker-Analysen und KI-gestützte Diagnostik, um die 
            biologischen Alterungsprozesse deines Körpers zu entschlüsseln. Unser 
            Framework basiert auf den 10 wissenschaftlich anerkannten Säulen der 
            Longevity – für eine datenbasierte Optimierung deiner Gesundheit.
          </p>
        </div>
        <div className="science-grid">
          <div className="science-card">
            <span className="science-card-icon">🧬</span>
            <h4>Zelluläre Gesundheit</h4>
            <p>Analyse von DNA-Methylierung und epigenetischen Markern zur Bestimmung des biologischen Alters.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">⚙️</span>
            <h4>Metabolische Effizienz</h4>
            <p>Optimierung des Stoffwechsels und der Insulinsensitivität für maximale energy level.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">🌙</span>
            <h4>Chronobiologie</h4>
            <p>Wissenschaftlich fundierte Schlafphasen-Optimierung und zirkadiane Rhythmus-Anpassung.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">🧠</span>
            <h4>Kognitive Performance</h4>
            <p>Neuroprotektive Strategien und Nootropika-Management für lebenslange geistige Schärfe.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">🛡️</span>
            <h4>Immun-Resilienz</h4>
            <p>Stärkung der körpereigenen Abwehrkräfte und Kontrolle von Entzündungsprozessen (Inflammaging).</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">❤️</span>
            <h4>Kardiovaskuläre Kapazität</h4>
            <p>Präzise Überwachung von VO2max, HRV und Gefäßgesundheit für ein starkes Herz.</p>
          </div>
        </div>
      </section>

      {/* 2. Expertise Section */}
      <section id="expertise" className="features" style={{ backgroundColor: '#fff' }}>
        <div className="section-header">
          <h2>Wissenschaftliche Expertise</h2>
          <p>Wir bringen die Labordaten in deinen Alltag.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-img">
              <Image src="/images/usp_vitality.png" alt="Vitality" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="feature-card-content">
              <h3>Vitalitäts-Tracking</h3>
              <p>Analysiere deine Blutwerte und Biomarker auf einer völlig neuen Ebene.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-card-img">
              <Image src="/images/usp_lisa.png" alt="Lisa AI" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="feature-card-content">
              <h3>KI-Coaching</h3>
              <p>Lisa, deine Longevity-Expertin, begleitet dich 24/7 bei jeder Entscheidung.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-card-img">
              <Image src="/images/usp_exclusive.png" alt="Exclusive" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="feature-card-content">
              <h3>Exklusive Insights</h3>
              <p>Erhalte Zugriff auf Strategien, die normalerweise nur in Longevity-Kliniken verfügbar sind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kundenstimmen Section (Testimonials) */}
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

      {/* 4. Testphase Section (Final CTA) */}
      <section id="testphase" className="final-cta">
        <h2>Wissenschaftlich fundierte Langlebigkeit.</h2>
        <p>
          Übernimm die Kontrolle über dein biologisches Alter. Nutze Präzisions-Diagnostik 
          und KI-gestützte Strategien für ein längeres Leben in maximaler Vitalität.
        </p>
        <Link href="/login?from=/dashboard" className="btn-primary-large" style={{ fontSize: '1.4rem', padding: '1.5rem 4rem' }}>
          JETZT DIAGNOSTIK STARTEN
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/images/logoneu.png" alt="TrueYears Logo" width={150} height={50} style={{ filter: 'brightness(0) invert(1)' }} />
            <p className="footer-tagline">Dein Weg zu 100+ Jahren Vitalität.</p>
          </div>
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Produkt</h4>
              <Link href="#features">Features</Link>
              <Link href="#erfolgsprinzip">Methode</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-col">
              <h4>Rechtliches</h4>
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 TrueYears. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
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
          <div className="hero-badge">TrueYears Longevity Companion</div>
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

      {/* 1. Erfolgsprinzip Section (New Centered Science Design) */}
      <section id="erfolgsprinzip" className="flower-section">
        <div className="flower-content">
          <h2>Die Wissenschaft der Langlebigkeit</h2>
          <p>
            Wir nutzen präzise Biomarker-Analysen und KI-gestützte Diagnostik, um die 
            biologischen Alterungsprozesse deines Körpers zu entschlüsseln. Unser 
            Framework basiert auf den 10 wissenschaftlich anerkannten Säulen der 
            Longevity – für eine datenbasierte Optimierung deiner Gesundheit.
          </p>
        </div>
        <div className="science-grid">
          <div className="science-card">
            <span className="science-card-icon">🧬</span>
            <h4>Zelluläre Gesundheit</h4>
            <p>Analyse von DNA-Methylierung und epigenetischen Markern zur Bestimmung des biologischen Alters.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">⚙️</span>
            <h4>Metabolische Effizienz</h4>
            <p>Optimierung des Stoffwechsels und der Insulinsensitivität für maximale Energielevel.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">🌙</span>
            <h4>Chronobiologie</h4>
            <p>Wissenschaftlich fundierte Schlafphasen-Optimierung und zirkadiane Rhythmus-Anpassung.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">🧠</span>
            <h4>Kognitive Performance</h4>
            <p>Neuroprotektive Strategien und Nootropika-Management für lebenslange geistige Schärfe.</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">🛡️</span>
            <h4>Immun-Resilienz</h4>
            <p>Stärkung der körpereigenen Abwehrkräfte und Kontrolle von Entzündungsprozessen (Inflammaging).</p>
          </div>
          <div className="science-card">
            <span className="science-card-icon">❤️</span>
            <h4>Kardiovaskuläre Kapazität</h4>
            <p>Präzise Überwachung von VO2max, HRV und Gefäßgesundheit für ein starkes Herz.</p>
          </div>
        </div>
      </section>

      {/* 2. Expertise Section */}
      <section id="expertise" className="features" style={{ backgroundColor: '#fff' }}>
        <div className="section-header">
          <h2>Wissenschaftliche Expertise</h2>
          <p>Wir bringen die Labordaten in deinen Alltag.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-card-img">
              <Image src="/images/usp_vitality.png" alt="Vitality" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="feature-card-content">
              <h3>Vitalitäts-Tracking</h3>
              <p>Analysiere deine Blutwerte und Biomarker auf einer völlig neuen Ebene.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-card-img">
              <Image src="/images/usp_lisa.png" alt="Lisa AI" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="feature-card-content">
              <h3>KI-Coaching</h3>
              <p>Lisa, deine Longevity-Expertin, begleitet dich 24/7 bei jeder Entscheidung.</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-card-img">
              <Image src="/images/usp_exclusive.png" alt="Exclusive" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="feature-card-content">
              <h3>Exklusive Insights</h3>
              <p>Erhalte Zugriff auf Strategien, die normalerweise nur in Longevity-Kliniken verfügbar sind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Kundenstimmen Section (Testimonials) */}
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

      {/* 4. Testphase Section (Final CTA) */}
      <section id="testphase" className="final-cta">
        <h2>Wissenschaftlich fundierte Langlebigkeit.</h2>
        <p>
          Übernimm die Kontrolle über dein biologisches Alter. Nutze Präzisions-Diagnostik 
          und KI-gestützte Strategien für ein längeres Leben in maximaler Vitalität.
        </p>
        <Link href="/login?from=/dashboard" className="btn-primary-large" style={{ fontSize: '1.4rem', padding: '1.5rem 4rem' }}>
          JETZT DIAGNOSTIK STARTEN
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Image src="/images/logoneu.png" alt="TrueYears Logo" width={150} height={50} style={{ filter: 'brightness(0) invert(1)' }} />
            <p className="footer-tagline">Dein Weg zu 100+ Jahren Vitalität.</p>
          </div>
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Produkt</h4>
              <Link href="#features">Features</Link>
              <Link href="#erfolgsprinzip">Methode</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
            <div className="footer-col">
              <h4>Rechtliches</h4>
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 TrueYears. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
}
