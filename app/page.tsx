'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './landing/landing.css';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "Monique",
      age: "34 Jahre",
      stars: 5,
      headline: "Meine Energie am Nachmittag hat sich verdoppelt und die Insights sind absolut lebensverändernd!",
      text: "Seit ich TrueYears nutze, habe ich meine Energie am Nachmittag verdoppelt. Früher hatte ich nach dem Mittagessen immer ein extremes Tief, aber durch die gezielten Anpassungen meiner Morgenroutine schlafe ich tiefer und starte mit vollem Fokus in den Tag. Die Insights sind für mich absolut lebensverändernd!",
      img: "/images/selfie_monique.png"
    },
    {
      name: "Thomas",
      age: "42 Jahre",
      stars: 4,
      headline: "Ein privater Biohacker für jeden Tag, der meinen Schlaf und Ruhepuls extrem verbessert hat.",
      text: "Endlich verstehe ich, was meine Oura-Daten wirklich bedeuten. Das AI-Coaching ist wie ein privater Biohacker, der mir jeden Tag maßgeschneiderte Tipps gibt. Mein Ruhepuls ist um 5 Schläge gesunken und meine Konzentration tagsüber is spürbar besser.",
      img: "/images/selfie_thomas.png"
    },
    {
      name: "Sarah",
      age: "29 Jahre",
      stars: 5,
      headline: "Die perfekte Kombination aus Labortests und täglichen Habits für spürbar schnellere Regeneration.",
      text: "Die Verbindung aus Labortests und täglichen Micro-Habits ist genau das, was mir gefehlt hat. Es ist extrem motivierend zu sehen, wie mein biologisches Alter sinkt. Ich trainiere effizienter und regeneriere viel schneller nach harten Einheiten.",
      img: "/images/selfie_sarah.png"
    },
    {
      name: "Albrecht",
      age: "56 Jahre",
      stars: 5,
      headline: "Als Mediziner überzeugt mich vor allem die fundierte wissenschaftliche Basis von TrueYears.",
      text: "Als Mediziner war ich anfangs skeptisch. Doch die wissenschaftliche Fundierung der Empfehlungen bei TrueYears hat mich überzeugt. Ich nutze die App selbst, um meine kardiovaskuläre Fitness zu optimieren und meine zelluläre Gesundheit langfristig zu schützen.",
      img: "/images/selfie_albrecht.png"
    },
    {
      name: "Elena",
      age: "48 Jahre",
      stars: 5,
      headline: "Ich fühle mich heute fitter, vitaler und wohler in meiner Haut als in meinen 30ern!",
      text: "Ich fühle mich heute fitter und vitaler als in meinen 30ern. Die wöchentlichen Routinen lassen sich perfekt in einen stressigen Alltag integrieren. Besonders die Tipps zur Ernährung und Zellgesundheit haben meine Haut und mein allgemeines Wohlbefinden massiv verbessert!",
      img: "/images/selfie_elena.png"
    },
    {
      name: "Markus",
      age: "39 Jahre",
      stars: 5,
      headline: "Die täglichen kleinen Schritte bringen messbare Erfolge ohne jeglichen Druck.",
      text: "TrueYears hat meine Sichtweise auf das Älterwerden komplett verändert. Es geht nicht um Perfektion, sondern um die kleinen, täglichen Schritte. Der Quick Win Navigator erinnert mich ohne Druck an meine Ziele, und die Fortschritte sprechen für sich.",
      img: "/images/selfie_markus.png"
    }
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

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
          <Link href="#features" className="nav-link" onClick={() => setMenuOpen(false)}>Bausteine</Link>
          <Link href="#erfolgsprinzip" className="nav-link" onClick={() => setMenuOpen(false)}>Mitgliedschaften</Link>
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
          <h2>6 Bausteine, die wirken</h2>
          <p>
            Alles, was du für ein langes Leben in maximaler Vitalität benötigst, 
            vereint in einer intelligenten Plattform.
          </p>
        </div>
        <div className="new-features-grid">
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper">
              <Image 
                src="/images/checkins_logging_ui.png" 
                alt="Tägliche Check-Ins" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">01</div>
              <h3>Tägliche Check-Ins</h3>
              <p>Dein zentraler Hub. Behalte dein biologisches Alter, deine wichtigsten Biomarker und Live-Wearable-Daten von Oura, Garmin oder Apple Watch in Echtzeit im Blick.</p>
            </div>
          </div>
          
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper">
              <Image 
                src="/images/quick_win_navigator_path.png" 
                alt="Quick Win Navigator" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">02</div>
              <h3>Quick Win Navigator</h3>
              <p>Erreiche spürbare und nachhaltige Verbesserungen im Alltag durch wissenschaftlich validierte Micro-Habits und personalisierte tägliche Gesundheitsaufgaben.</p>
            </div>
          </div>
          
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper">
              <Image 
                src="/images/lisa.png" 
                alt="Personal Trainer" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">03</div>
              <h3>Personal Trainer</h3>
              <p>Deine persönliche Longevity-Coachin Lisa AI begleitet dich rund um die Uhr, beantwortet komplexe Fragen und motiviert dich bei jedem Schritt.</p>
            </div>
          </div>
          
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper">
              <Image 
                src="/images/inspiration_insights_3d.png" 
                alt="Inspiration & Insights" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">04</div>
              <h3>Inspiration & Insights</h3>
              <p>Erhalte maßgeschneiderte Lese-Empfehlungen, Lifestyle-Tipps und exklusives, aktuelles Wissen aus der internationalen Alters- und Langlebigkeitsforschung.</p>
            </div>
          </div>
          
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper">
              <Image 
                src="/images/trends_rejuvenation_chart.png" 
                alt="Entwicklung & Trends" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">05</div>
              <h3>Entwicklung & Trends</h3>
              <p>Visualisiere deine biologische Entwicklung mit detaillierten Verlaufscharts und tracke präzise die Verjüngung deines zellulären Alters.</p>
            </div>
          </div>
          
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper">
              <Image 
                src="/images/member_benefits_real_people.png" 
                alt="Member-Vorteile" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">06</div>
              <h3>Member-Vorteile</h3>
              <p>Teile deine Longevity-Journey mit Freunden. Empfiehl TrueYears weiter und sichere dir und deinen Kontakten wertvolle Gratismonate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Kundenstimmen Section (Testimonials Slider) */}
      <section id="kundenstimmen" className="testimonials-section">
        <div className="section-header">
          <h2>Was unsere Mitglieder sagen</h2>
          <p>Echte Ergebnisse von Menschen auf ihrer Longevity-Journey.</p>
        </div>
        
        <div className="testimonials-slider-outer">
          <button className="slider-arrow prev" onClick={handlePrev} aria-label="Vorheriges Testimonial">
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <div 
            className="testimonials-window"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="testimonials-track" 
              style={{ 
                // @ts-ignore
                '--index': activeIndex 
              } as React.CSSProperties}
            >
              {testimonials.map((t, idx) => (
                <div key={idx} className="testimonial-card-premium">
                  <div className="testimonial-slide-active">
                    <div className="testimonial-profile-col">
                      <div className="testimonial-image-large-wrapper">
                        <Image 
                          src={t.img} 
                          alt={t.name} 
                          width={250} 
                          height={250} 
                          className="testimonial-image-large"
                        />
                      </div>
                      <h4 className="testimonial-name-large">{t.name}</h4>
                      <span className="testimonial-age-large">{t.age}</span>
                      <div className="testimonial-stars">{"★".repeat(t.stars) + "☆".repeat(5 - t.stars)}</div>
                    </div>
                    <div className="testimonial-content-large">
                      <h3 className="testimonial-headline-large">{t.headline}</h3>
                      <p className="testimonial-text-large">"{t.text}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="slider-arrow next" onClick={handleNext} aria-label="Nächstes Testimonial">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        
        <div className="slider-dots">
          {testimonials.map((_, idx) => (
            <button 
              key={idx} 
              className={`slider-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Gehe zu Testimonial ${idx + 1}`}
            />
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
                <Link href="#features">Tägliche Check-Ins</Link>
                <Link href="#features">Quick Win Navigator</Link>
                <Link href="#features">Lisa AI</Link>
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
