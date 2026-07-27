'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './landing/landing.css';

const iconList = [
  'bi-smartwatch', 'bi-record-circle', 'bi-activity', 'bi-lightning-charge', 
  'bi-heart-pulse', 'bi-droplet-half', 'bi-fingerprint', 'bi-capsule', 
  'bi-graph-up-arrow', 'bi-git-branch', 'bi-waveform', 'bi-moon-stars', 
  'bi-person-walking', 'bi-egg-fried', 'bi-water', 'bi-flower1', 
  'bi-capsule-pill', 'bi-speedometer', 'bi-shield-check', 'bi-brain', 
  'bi-battery-charging', 'bi-clipboard-pulse', 'bi-thermometer-half', 
  'bi-lungs', 'bi-eye', 'bi-sun', 'bi-hourglass-split'
];

const labels = [
  'Apple Watch', 'Oura Ring', 'Garmin', 'Whoop', 'Fitbit', 'Blutbild', 'DNA & Genetik', 'Mikrobiom',
  'CGM Glucose', 'Epigenetik', 'HRV', 'Schlaftracker', 'Schritte', 'Ernährung', 'Hydration', 'Achtsamkeit',
  'Supplemente', 'Blutdruck', 'Hormone', 'Stress-Level', 'Regeneration', 'Labortests', 'Körpertemperatur',
  'Lungenfunktion', 'Sehkraft', 'UV-Index', 'Zellalter'
];

// Generate 50 points deterministically to avoid SSR hydration mismatches
const dataSources = Array.from({ length: 50 }, (_, i) => {
  const seedX = Math.sin(i * 12.9898) * 43758.5453;
  let x = 3 + Math.abs(seedX - Math.floor(seedX)) * 94;
  
  const seedY = Math.sin(i * 78.233) * 43758.5453;
  let y = 3 + Math.abs(seedY - Math.floor(seedY)) * 94;
  
  // Push away from center (50, 50) if too close
  const dx = x - 50;
  const dy = y - 50;
  const dist = Math.hypot(dx, dy);
  if (dist < 18) {
    const scale = 18 / dist;
    x = 50 + dx * scale;
    y = 50 + dy * scale;
    x = Math.max(3, Math.min(97, x));
    y = Math.max(3, Math.min(97, y));
  }
  
  const iconIdx = i % iconList.length;
  return {
    icon: iconList[iconIdx],
    label: labels[iconIdx] || 'Gesundheitswert',
    x: parseFloat(x.toFixed(1)),
    y: parseFloat(y.toFixed(1))
  };
});

// Generate lines connecting nearby nodes (distance < 16)
const connections: [number, number][] = (() => {
  const list: [number, number][] = [];
  for (let i = 0; i < dataSources.length; i++) {
    for (let j = i + 1; j < dataSources.length; j++) {
      const p1 = dataSources[i];
      const p2 = dataSources[j];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      if (dist < 16) {
        list.push([i, j]);
      }
    }
  }
  return list;
})();

const heroSlides = [
  { 
    id: 1, 
    image: '/images/longevity_hero_clinic.png', 
    alt: 'Longevity Clinic',
    title: 'Dein Weg zu mehr Lebensqualität',
    description: 'TrueYears ist dein persönlicher, empathischer Longevity-Begleiter. Hier bringst du deine biologische Daten, Aktivitäten und wissenschaftlich fundierte Routinen in einer Lösung zusammen: einfach, motivierend und wirksam.'
  },
  { 
    id: 2, 
    image: '/images/hero_option_2.png', 
    alt: 'Longevity Performance',
    title: 'Maximale Leistung & Energie im Alltag',
    description: 'Optimiere deine körperliche und mentale Performance mit maßgeschneiderten KI-Trainings, Schlaf-Analytics und wissenschaftlich fundierten Routinen.'
  },
  { 
    id: 3, 
    image: '/images/hero_option_3.png', 
    alt: 'Longevity Vitality',
    title: 'Zelluläre Verjüngung & Prävention',
    description: 'Verlangsame dein biologisches Alter und erhalte deine volle Vitalität bis ins hohe Alter mit gezielter Diagnostik und evidenzbasierten Biohacks.'
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeCyclePlan, setActiveCyclePlan] = useState<'starter' | 'premium' | 'platin'>('premium');
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Auto-slide hero background every 9 seconds
  useEffect(() => {
    const heroTimer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 9000);
    return () => clearInterval(heroTimer);
  }, []);

  const currentCycleColor = {
    starter: '#006ea7',
    premium: '#7fd049',
    platin: '#8a99ad'
  }[activeCyclePlan];

  // Interactive Video Player State
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0); 
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [lastTickPlayed, setLastTickPlayed] = useState(-1);
  const [hasPlayedOutro, setHasPlayedOutro] = useState(false);
  const [hasPlayedRejuv, setHasPlayedRejuv] = useState(false);
  const [hasPlayedMerge, setHasPlayedMerge] = useState(false);
  const [hasPlayedLisa, setHasPlayedLisa] = useState(false);

  // Web Audio synth triggers
  const playIntroChime = (muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playTone = (freq: number, startTime: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(196.00, now, 2.5, 0.15); // G3
      playTone(293.66, now + 0.1, 2.5, 0.12); // D4
      playTone(392.00, now + 0.2, 2.5, 0.1); // G4
      playTone(493.88, now + 0.3, 2.5, 0.08); // B4
      playTone(587.33, now + 0.4, 2.5, 0.06); // D5
      playTone(783.99, now + 0.5, 1.5, 0.04); // G5
      playTone(987.77, now + 0.6, 1.5, 0.04); // B5
      playTone(1174.66, now + 0.7, 2.0, 0.04); // D6
    } catch (e) {}
  };

  const playPillarTick = (index: number, muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;

      const playChimeNode = (freq: number, vol: number, decay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.02); // very soft attack
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay); // smooth ring out
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay + 0.05);
      };

      // Play a beautiful, sparkling, warm C major chord chime (C5 + E5 + G5)
      playChimeNode(523.25, 0.03, 0.6); // C5
      playChimeNode(659.25, 0.02, 0.8); // E5
      playChimeNode(783.99, 0.02, 1.0); // G5
    } catch (e) {}
  };

  const playHoverSound = (muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4 - warm, atmospheric
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const playRejuvChime = (muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playTone = (freq: number, startTime: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(523.25, now, 1.2, 0.08); // C5
      playTone(659.25, now + 0.1, 1.2, 0.06); // E5
      playTone(783.99, now + 0.2, 1.2, 0.06); // G5
      playTone(1046.50, now + 0.3, 1.5, 0.05); // C6
    } catch (e) {}
  };

  const playMergeChime = (muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playTone = (freq: number, startTime: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      
      // Futuristic merge chord sweep
      playTone(392.00, now, 1.2, 0.05); // G4
      playTone(523.25, now + 0.1, 1.2, 0.05); // C5
      playTone(659.25, now + 0.2, 1.2, 0.04); // E5
      playTone(783.99, now + 0.3, 1.5, 0.04); // G5
    } catch (e) {}
  };

  const playLisaNotification = (muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      const playTone = (freq: number, startTime: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      playTone(880.00, now, 0.4, 0.05); // A5
      playTone(1109.73, now + 0.08, 0.6, 0.04); // C#6
    } catch (e) {}
  };

  const playOutroChime = (muted: boolean) => {
    if (muted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const playTone = (freq: number, startTime: number, duration: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(261.63, now, 3.0, 0.1); // C4
      playTone(329.63, now + 0.1, 3.0, 0.08); // E4
      playTone(392.00, now + 0.2, 3.0, 0.08); // G4
      playTone(523.25, now + 0.3, 3.0, 0.06); // C5
    } catch (e) {}
  };

  useEffect(() => {
    let interval: any = null;
    if (isVideoPlaying) {
      if (videoTime === 0) {
        playIntroChime(isVideoMuted);
        setLastTickPlayed(-1);
        setHasPlayedOutro(false);
        setHasPlayedRejuv(false);
        setHasPlayedMerge(false);
        setHasPlayedLisa(false);
      }
      
      interval = setInterval(() => {
        setVideoTime(prev => {
          const nextTime = Math.min(prev + 0.1, 33.0);
          
          if (nextTime >= 5.0 && nextTime < 10.0) {
            const pillarIndex = Math.floor((nextTime - 5.0) / 0.83);
            if (pillarIndex !== lastTickPlayed && pillarIndex >= 0 && pillarIndex < 6) {
              setLastTickPlayed(pillarIndex);
              playPillarTick(pillarIndex, isVideoMuted);
            }
          }
          
          if (nextTime >= 13.5 && !hasPlayedRejuv) {
            setHasPlayedRejuv(true);
            playRejuvChime(isVideoMuted);
          }
          
          if (nextTime >= 17.5 && !hasPlayedMerge) {
            setHasPlayedMerge(true);
            playMergeChime(isVideoMuted);
          }
          
          if (nextTime >= 21.2 && !hasPlayedLisa) {
            setHasPlayedLisa(true);
            playLisaNotification(isVideoMuted);
          }
          
          if (nextTime >= 28.0 && !hasPlayedOutro) {
            setHasPlayedOutro(true);
            playOutroChime(isVideoMuted);
          }
          
          if (nextTime >= 33.0) {
            clearInterval(interval);
            setIsVideoPlaying(false);
          }
          return nextTime;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVideoPlaying, isVideoMuted, lastTickPlayed, hasPlayedOutro, hasPlayedRejuv, hasPlayedMerge, hasPlayedLisa]);

  const startVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoTime >= 33.0) {
      setVideoTime(0);
    }
    setIsVideoPlaying(true);
  };

  const pauseVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsVideoPlaying(false);
  };

  const replayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVideoTime(0);
    setLastTickPlayed(-1);
    setHasPlayedOutro(false);
    setHasPlayedRejuv(false);
    setHasPlayedMerge(false);
    setHasPlayedLisa(false);
    setIsVideoPlaying(true);
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsVideoMuted(!isVideoMuted);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const nextTime = Math.max(0, Math.min(percentage * 33.0, 33.0));
    setVideoTime(nextTime);
    if (nextTime < 5.0) {
      setLastTickPlayed(-1);
    }
    if (nextTime < 13.5) {
      setHasPlayedRejuv(false);
    }
    if (nextTime < 17.5) {
      setHasPlayedMerge(false);
    }
    if (nextTime < 21.2) {
      setHasPlayedLisa(false);
    }
    if (nextTime < 28.0) {
      setHasPlayedOutro(false);
    }
  };

  // Clear checkout dynamic data when visiting/reloading landing page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ty_first_name');
      sessionStorage.removeItem('ty_email');
      sessionStorage.removeItem('ty_just_purchased');
      localStorage.removeItem('ty_first_name');
      localStorage.removeItem('ty_email');
    }
  }, []);

  const testimonials = [
    {
      name: "Petra",
      age: "47 Jahre",
      stars: 5,
      headline: "Energie am Nachmittag verdoppelt",
      text: "Seit ich TrueYears nutze, habe ich meine Energie am Nachmittag verdoppelt. Früher hatte ich nach dem Mittagessen immer ein extremes Tief, aber durch die gezielten Anpassungen meiner Morgenroutine schlafe ich tiefer und starte mit vollem Fokus in den Tag. Die Insights sind für mich absolut lebensverändernd!",
      img: "/images/woman2.png",
      badge: "-4,2 Jahre biologisches Alter"
    },
    {
      name: "Thomas",
      age: "42 Jahre",
      stars: 4,
      headline: "Ruhepuls stark verbessert",
      text: "Endlich verstehe ich, was meine Oura-Daten wirklich bedeuten. Das AI-Training ist wie ein privater Biohacker, der mir jeden Tag maßgeschneiderte Tipps gibt. Mein Ruhepuls ist um 5 Schläge gesunken und meine Konzentration tagsüber is spürbar besser.",
      img: "/images/selfie_thomas.png",
      badge: "+50% tieferer Schlaf"
    },
    {
      name: "Sarah",
      age: "29 Jahre",
      stars: 5,
      headline: "Perfekte Kombination aus Labortests und täglichen Habits",
      text: "Die Verbindung aus Labortests und täglichen Micro-Habits ist genau das, was mir gefehlt hat. Es ist extrem motivierend zu sehen, wie mein biologisches Alter sinkt. Ich trainiere effizienter und regeneriere viel schneller nach harten Einheiten.",
      img: "/images/selfie_sarah.png",
      badge: "-3,5 Jahre biologisches Alter"
    },
    {
      name: "Albrecht",
      age: "63 Jahre",
      stars: 5,
      headline: "Als Mediziner überzeugt mich die wissenschaftliche Basis",
      text: "Als Mediziner war ich anfangs skeptisch. Doch die wissenschaftliche Fundierung der Empfehlungen bei TrueYears hat mich überzeugt. Ich nutze die App selbst, um meine kardiovaskuläre Fitness zu optimieren und meine zelluläre Gesundheit langfristig zu schützen.",
      img: "/images/selfie_albrecht.png",
      badge: "-5,1 Jahre biologisches Alter"
    },
    {
      name: "Elena",
      age: "48 Jahre",
      stars: 5,
      headline: "Ich fühle mich fitter und vitaler wie in meinen 30ern",
      text: "Ich fühle mich heute fitter und vitaler als in meinen 30ern. Die wöchentlichen Routinen lassen sich perfekt in einen stressigen Alltag integrieren. Besonders die Tipps zur Ernährung und Zellgesundheit haben meine Haut und mein allgemeines Wohlbefinden massiv verbessert!",
      img: "/images/selfie_elena.png",
      badge: "+40% Fokus im Alltag"
    },
    {
      name: "Markus",
      age: "39 Jahre",
      stars: 5,
      headline: "Tägliche kleine Schritte bringen messbare Erfolge",
      text: "TrueYears hat meine Sichtweise auf das Älterwerden komplett verändert. Es geht nicht um Perfektion, sondern um die kleinen, täglichen Schritte. Do it yourself erinnert mich ohne Druck an meine Ziele, und die Fortschritte sprechen für sich.",
      img: "/images/selfie_markus.png",
      badge: "-2,8 Jahre biologisches Alter"
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
      <nav className={`landing-nav ${menuOpen ? 'landing-nav-open' : ''}`}>
        <div className="landing-nav-container">
          <Link 
            href="/" 
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMenuOpen(false);
            }}
          >
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
            <Link href="#features" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Bausteine</Link>
            <Link href="#erfolgsprinzip" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Mitgliedschaften</Link>
            <Link href="#testphase" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Wissenschaft</Link>
            <Link href="#kundenstimmen" className="landing-nav-link" onClick={() => setMenuOpen(false)}>Kundenstimmen</Link>
            <Link href="/checkout" className="landing-nav-link" onClick={() => setMenuOpen(false)} aria-label="Warenkorb" style={{ display: 'flex', alignItems: 'center' }}>
              <i className="bi bi-cart3" style={{ fontSize: '1.5rem' }}></i>
            </Link>
            <Link href="/dashboard" className="btn-cta-small" onClick={() => setMenuOpen(false)}>Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-fullscreen-bg">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`hero-slide ${index === currentHeroSlide ? 'active' : ''}`}
            >
              <Image 
                src={slide.image} 
                alt={slide.alt} 
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <div className="hero-fullscreen-overlay" />
        
        {/* Navigation Arrows */}
        <button 
          className="hero-slider-arrow prev" 
          onClick={() => setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          aria-label="Vorheriges Bild"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button 
          className="hero-slider-arrow next" 
          onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Nächstes Bild"
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Indicators */}
        <div className="hero-slider-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator-dot ${index === currentHeroSlide ? 'active' : ''}`}
              onClick={() => setCurrentHeroSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="hero-content-fullscreen">
          {heroSlides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`hero-text-slide ${index === currentHeroSlide ? 'active' : ''}`}
            >
              <h1>{slide.title}</h1>
              <p>{slide.description}</p>
              <div className="hero-btns">
                <Link href="/dashboard" className="btn-primary-large">LOGIN</Link>
                <Link href="#konzept" className="btn-secondary-large">KONZEPT ENTDECKEN</Link>
              </div>
            </div>
          ))}
        </div>
      </header>



      {/* Video Concept Section */}
      <section id="konzept" className="video-section">
        <div className="video-section-container">
          <div className="video-section-header">
            <span className="video-section-badge">Das Konzept</span>
            <h2>True Years in 30 Sekunden</h2>
            <p>
              Entdecke im interaktiven Video, wie wir wissenschaftliche Diagnostik, Live-Wearable-Tracking<br className="desktop-only" />
              und KI-gestütztes Training vereinen, um deine biologische Verjüngung zu aktivieren.
            </p>
          </div>
          
          <div className="video-player-wrapper" style={{ padding: isVideoPlaying || videoTime > 0 ? '0px' : '8px' }}>
            {(!isVideoPlaying && videoTime === 0) ? (
              // Standard static placeholder
              <div className="video-placeholder-container" onClick={startVideo}>
                <Image 
                  src="/images/video_preview_option_5.png" 
                  alt="True Years Video Erklärung" 
                  fill 
                  className="video-placeholder-image"
                  priority
                />
                
                <button className="video-play-btn" aria-label="Video abspielen">
                  <div className="play-icon-pulse"></div>
                  <div className="play-btn-glass">
                    <i className="bi bi-play-fill"></i>
                  </div>
                </button>
                
                <div className="video-duration-badge">
                  <i className="bi bi-clock-history"></i> 33 Sek
                </div>
              </div>
            ) : (
              // Interactive Video Experience
              <div className="interactive-video-container">
                {/* Scene 1: Intro (0s - 5.0s) */}
                <div className={`video-scene scene-intro ${videoTime >= 0 && videoTime < 5.0 ? 'active' : ''}`}>
                  <div className="scene-intro-left">
                    <div className="scene-intro-image-container">
                      <Image 
                        src="/images/video_preview_option_5.png" 
                        alt="Longevity Sanctuary" 
                        fill 
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  </div>
                  <div className="scene-intro-right">
                    <div className="intro-logo-wrapper">
                      <Image 
                        src="/images/logoneu.png" 
                        alt="TrueYears Logo" 
                        width={440} 
                        height={146} 
                        style={{ objectFit: 'contain' }}
                        priority
                      />
                    </div>
                    <p className="intro-subtitle">
                      Dein Einstieg in ein Leben<br />
                      mit höherer Vitalität und mehr Lebensfreude
                    </p>
                  </div>
                </div>

                {/* Scene 2: 6 Bausteine (5.0s - 10.0s) */}
                <div className={`video-scene scene-pillars ${videoTime >= 5.0 && videoTime < 10.0 ? 'active' : ''}`}>
                  <div className="pillars-grid-container">
                    <h3 className="pillars-video-title">6 Bausteine für deine Vitalität</h3>
                    <div className="pillars-video-circle">
                      <div className={`pillar-video-node ${videoTime >= 5.0 + 0 * 0.83 && videoTime < 5.0 + 1 * 0.83 ? 'highlighted' : ''}`} onMouseEnter={() => playHoverSound(isVideoMuted)}>
                        <i className="bi bi-check2-circle pillar-video-icon"></i>
                        <span className="pillar-video-name">01 Check-Ins</span>
                      </div>
                      <div className={`pillar-video-node ${videoTime >= 5.0 + 1 * 0.83 && videoTime < 5.0 + 2 * 0.83 ? 'highlighted green-node' : ''}`} onMouseEnter={() => playHoverSound(isVideoMuted)}>
                        <i className="bi bi-compass pillar-video-icon"></i>
                        <span className="pillar-video-name">02 Neue Gewohnheiten</span>
                      </div>
                      <div className={`pillar-video-node ${videoTime >= 5.0 + 2 * 0.83 && videoTime < 5.0 + 3 * 0.83 ? 'highlighted' : ''}`} onMouseEnter={() => playHoverSound(isVideoMuted)}>
                        <i className="bi bi-chat-left-dots pillar-video-icon"></i>
                        <span className="pillar-video-name">03 Personal Trainer</span>
                      </div>
                      <div className={`pillar-video-node ${videoTime >= 5.0 + 3 * 0.83 && videoTime < 5.0 + 4 * 0.83 ? 'highlighted green-node' : ''}`} onMouseEnter={() => playHoverSound(isVideoMuted)}>
                        <i className="bi bi-journal-text pillar-video-icon"></i>
                        <span className="pillar-video-name">04 Insights</span>
                      </div>
                      <div className={`pillar-video-node ${videoTime >= 5.0 + 4 * 0.83 && videoTime < 5.0 + 5 * 0.83 ? 'highlighted' : ''}`} onMouseEnter={() => playHoverSound(isVideoMuted)}>
                        <i className="bi bi-graph-up-arrow pillar-video-icon"></i>
                        <span className="pillar-video-name">05 Trends</span>
                      </div>
                      <div className={`pillar-video-node ${videoTime >= 5.0 + 5 * 0.83 && videoTime <= 10.0 ? 'highlighted green-node' : ''}`} onMouseEnter={() => playHoverSound(isVideoMuted)}>
                        <i className="bi bi-patch-check pillar-video-icon"></i>
                        <span className="pillar-video-name">06 Benefits</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scene 3: Biologisches Alter (10.0s - 15.0s) */}
                <div className={`video-scene scene-age-rejuvenation ${videoTime >= 10.0 && videoTime < 15.0 ? 'active' : ''}`}>
                  <div className="age-tracker-container">
                    <h3 className="age-tracker-title">Der biologische Verjüngungs-Rechner</h3>
                    <div className="age-tracker-display">
                      <div className="age-number-card chronological">
                        <span className="age-label">Kalendarisch</span>
                        <span className="age-value">45</span>
                        <span className="age-unit">Jahre</span>
                      </div>
                      <div className="age-divider-arrow">
                        <i className="bi bi-chevron-right"></i>
                      </div>
                      <div className={`age-number-card biological ${videoTime >= 13.5 ? 'rejuvenated' : ''}`}>
                        <span className="age-label">Biologisch</span>
                        <span className="age-value">
                          {videoTime < 11.5 
                            ? "45.0" 
                            : videoTime >= 13.5 
                              ? "39.8" 
                              : (45.0 - ((videoTime - 11.5) / 2) * 5.2).toFixed(1)}
                        </span>
                        <span className="age-unit">Jahre</span>
                      </div>
                    </div>
                    <p className="age-tracker-subtitle">
                      {videoTime < 13.5 ? "Kalkuliere biologisches Alter..." : "Reduziere dein biologisches Alter nachweisbar."}
                    </p>
                  </div>
                </div>

                {/* Scene 4: Wearable Fusion (15.0s - 20.0s) */}
                <div className={`video-scene scene-wearable-fusion ${videoTime >= 15.0 && videoTime < 20.0 ? 'active' : ''}`}>
                  <div className="fusion-container">
                    <h3 className="fusion-title">Die Datenquellen-Fusion</h3>
                    <div className="fusion-display">
                      {/* Neural network background lines */}
                      <svg 
                        className="neural-network-svg" 
                        viewBox="0 0 100 100" 
                        preserveAspectRatio="none"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          opacity: videoTime >= 17.5 ? 0 : 0.18,
                          transform: videoTime >= 17.5 ? 'scale(0)' : 'scale(1)',
                          transition: 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)',
                          transformOrigin: '50% 50%',
                        }}
                      >
                        {connections.map((conn, cidx) => {
                          const n1 = dataSources[conn[0]];
                          const n2 = dataSources[conn[1]];
                          return (
                            <line 
                              key={cidx}
                              x1={n1.x}
                              y1={n1.y}
                              x2={n2.x}
                              y2={n2.y}
                              stroke="url(#synapse-gradient)"
                              strokeWidth="0.4"
                            />
                          );
                        })}
                        <defs>
                          <linearGradient id="synapse-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#7fd049" />
                          </linearGradient>
                        </defs>
                      </svg>

                      {dataSources.map((ds, idx) => {
                        return (
                          <div 
                            key={idx}
                            className={`fusion-icon-source ${videoTime >= 17.5 ? 'merged' : ''}`}
                            style={{
                              left: `${ds.x}%`,
                              top: `${ds.y}%`,
                              transform: videoTime >= 17.5 
                                ? 'translate(-50%, -50%) scale(0)' 
                                : 'translate(-50%, -50%) scale(1)',
                              transitionDelay: videoTime >= 17.5 
                                ? `${(idx % 6) * 40}ms` 
                                : '0ms',
                              background: idx % 3 === 0 
                                ? 'rgba(56, 189, 248, 0.15)' 
                                : idx % 3 === 1 
                                  ? 'rgba(127, 208, 73, 0.15)' 
                                  : 'rgba(168, 85, 247, 0.15)',
                              borderColor: idx % 3 === 0 
                                ? 'rgba(56, 189, 248, 0.4)' 
                                : idx % 3 === 1 
                                  ? 'rgba(127, 208, 73, 0.4)' 
                                  : 'rgba(168, 85, 247, 0.4)',
                              color: idx % 3 === 0 
                                ? '#38bdf8' 
                                : idx % 3 === 1 
                                  ? '#7fd049' 
                                  : '#c084fc',
                            }}
                            title={ds.label}
                          >
                            <i className={`bi ${ds.icon}`}></i>
                          </div>
                        );
                      })}
                      
                      <div className={`fusion-center-target ${videoTime >= 17.5 ? 'active' : ''}`}>
                        <i className="bi bi-shield-fill-check"></i>
                      </div>
                    </div>
                    <p className="fusion-subtitle">
                      {videoTime < 17.5 ? "Verbinde über 20 Datenquellen..." : "Deine Daten vereint in einer intelligenten Plattform."}
                    </p>
                  </div>
                </div>

                {/* Scene 5: Lisa AI Live-Coaching (20.0s - 28.0s) */}
                <div className={`video-scene scene-lisa-chat ${videoTime >= 20.0 && videoTime < 28.0 ? 'active' : ''}`}>
                  <h3 className="lisa-video-title">Deine Longevity Trainer</h3>
                  
                  <div className="coaches-side-by-side">
                    {/* Left: Lisa AI */}
                    <div className="coach-presentation-column lisa">
                      <div className="coach-avatar-large-wrapper">
                        <Image 
                          src="/images/lisa.png" 
                          alt="Lisa AI" 
                          width={260} 
                          height={260} 
                          className="coach-avatar-large"
                          priority
                        />
                        <div className="coach-status-dot-active"></div>
                      </div>
                      <h4 className="coach-name-video">Lisa AI</h4>
                      {videoTime >= 21.0 ? (
                        <div className="coach-tip-bubble lisa-tip">
                          <p>Dein Schlaf war etwas unruhig. Probiere heute Abend 10 Min. Atemübung vor dem Schlaf.</p>
                        </div>
                      ) : (
                        <div className="coach-tip-placeholder">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      )}
                    </div>

                    {/* Right: Tom AI */}
                    <div className="coach-presentation-column tom">
                      <div className="coach-avatar-large-wrapper">
                        <Image 
                          src="/images/tom_jung.png" 
                          alt="Tom AI" 
                          width={260} 
                          height={260} 
                          className="coach-avatar-large"
                          priority
                        />
                        <div className="coach-status-dot-active"></div>
                      </div>
                      <h4 className="coach-name-video">Tom AI</h4>
                      {videoTime >= 24.5 ? (
                        <div className="coach-tip-bubble tom-tip">
                          <p>Du warst heute viel im Sitzen. Geh heute Abend noch 10 Min. spazieren für deine Zellregeneration.</p>
                        </div>
                      ) : (
                        <div className="coach-tip-placeholder">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="lisa-chat-caption">Rund um die Uhr.</p>
                </div>

                {/* Scene 6: Outro / Botschaft (28.0s - 33.0s) */}
                <div className={`video-scene scene-outro ${videoTime >= 28.0 && videoTime < 33.0 ? 'active' : ''}`}>
                  <span className="outro-badge">Deine Entscheidung</span>
                  <h3 className="outro-message">VERJÜNGE DEINE ZELLEN JETZT.</h3>
                  <p className="outro-sub">Wissenschaftlich fundierte Langlebigkeit in einer Plattform.</p>
                  <button className="outro-cta-btn" onClick={() => router.push('/checkout?plan=premium')}>
                    Jetzt starten <i className="bi bi-arrow-right-short" style={{ fontSize: '1.4rem' }}></i>
                  </button>
                </div>

                {/* Replay Overlay */}
                <div className={`video-replay-overlay ${videoTime >= 33.0 ? 'active' : ''}`}>
                  <h3 className="replay-title">True Years erleben</h3>
                  <p className="replay-text">Starte deine persönliche Longevity-Reise noch heute mit unserem Premium-Plan.</p>
                  <div className="replay-buttons-row">
                    <button className="btn-replay-action" onClick={replayVideo}>
                      <i className="bi bi-arrow-counterclockwise"></i> Erneut abspielen
                    </button>
                    <button className="btn-replay-cta" onClick={() => router.push('/checkout?plan=premium')}>
                      Jetzt Mitgliedschaft wählen <i className="bi bi-arrow-right-short"></i>
                    </button>
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="video-controls-overlay">
                  <div className="video-progress-bar" onClick={handleProgressBarClick}>
                    <div className="video-progress-played" style={{ width: `${(videoTime / 33.0) * 100}%` }}></div>
                    <div className="video-progress-scrubber" style={{ left: `${(videoTime / 33.0) * 100}%` }}></div>
                  </div>
                  <div className="video-controls-row">
                    <div className="video-controls-left">
                      {isVideoPlaying ? (
                        <button className="control-btn" type="button" aria-label="Pause" onClick={pauseVideo}><i className="bi bi-pause-fill"></i></button>
                      ) : (
                        <button className="control-btn" type="button" aria-label="Play" onClick={startVideo}><i className="bi bi-play-fill"></i></button>
                      )}
                      
                      <button className="control-btn" type="button" aria-label="Mute" onClick={toggleMute}>
                        {isVideoMuted ? <i className="bi bi-volume-mute-fill"></i> : <i className="bi bi-volume-up-fill"></i>}
                      </button>
                      
                      <span className="video-time">
                        0:{Math.floor(videoTime).toString().padStart(2, '0')} / 0:33
                      </span>
                    </div>
                    
                    <div className="video-controls-right">
                      <span className="video-quality">1080p HD</span>
                      <button className="control-btn" type="button" aria-label="Fullscreen" onClick={(e) => {
                        e.stopPropagation();
                        const container = e.currentTarget.closest('.interactive-video-container');
                        if (container) {
                          if (!document.fullscreenElement) {
                            container.requestFullscreen().catch(() => {});
                          } else {
                            document.exitFullscreen().catch(() => {});
                          }
                        }
                      }}>
                        <i className="bi bi-fullscreen"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

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
                alt="Do it yourself" 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">02</div>
              <h3>Do it yourself</h3>
              <p>Erreiche spürbare und nachhaltige Verbesserungen im Alltag durch wissenschaftlich validierte Micro-Habits und personalisierte tägliche Gesundheitsaufgaben.</p>
            </div>
          </div>
          
          <div className="new-feature-card">
            <div className="new-feature-image-wrapper split-image-wrapper">
              <div className="split-image-left">
                <Image 
                  src="/images/lisa.png" 
                  alt="Lisa AI Coach" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  priority
                />
              </div>
              <div className="split-image-right">
                <Image 
                  src="/images/tom_jung.png" 
                  alt="Tom AI Coach" 
                  fill 
                  style={{ objectFit: 'cover' }} 
                  priority
                />
              </div>
            </div>
            <div className="new-feature-content-inner">
              <div className="new-feature-number">03</div>
              <h3>Personal Trainer</h3>
              <p>Deine persönlichen Longevity-Coaches Lisa AI und Tom AI begleiten dich rund um die Uhr, beantworten komplexe Fragen und motivieren dich bei jedem Schritt.</p>
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
              <p>Visualisiere deine biologische Entwicklung mit detaillierten Verlaufscharts und tracke präzise die Verjüngung deines biologischen Alters.</p>
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

      {/* 2.5 Longevity Cycle Section */}
      <section className="longevity-cycle-section">
        <div className="section-header" style={{ maxWidth: '100%', width: '100%', marginBottom: '1rem' }}>
          <h2 className="cycle-main-title" style={{ whiteSpace: 'nowrap' }}>Wähle dein Mitgliedschaftsmodell</h2>
          <p style={{ maxWidth: '1080px', margin: '0 auto', lineHeight: '1.6' }}>
            True Years ist keine gewöhnliche App oder reine Software-Plattform. Als ganzheitlicher Longevity Solution Provider verbinden wir führende Wissenschaft, intelligente Datenanalyse, Wearables, Labordiagnostik, personalisierte Services und 360-Grad-Begleitung zu einem integrierten System - individuell auf dich abgestimmt und aus einer Hand.{' '}
            <span 
              onClick={() => setShowOfferModal(true)} 
              className="mehr-erfahren-link"
            >
              → Mehr erfahren
            </span>
          </p>
        </div>

        {showOfferModal && (
          <div className="video-modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShowOfferModal(false)}>
            <div 
              className="video-modal-container" 
              style={{ 
                maxWidth: '1020px', 
                width: '95%',
                padding: '1.5rem', 
                background: '#ffffff', 
                borderRadius: '24px', 
                color: '#334155',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                maxHeight: '95vh',
                overflow: 'hidden',
                border: '1.5px solid rgba(0, 110, 167, 0.1)'
              }} 
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowOfferModal(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'color 0.2s'
                }}
                aria-label="Schließen"
              >
                <i className="bi bi-x-lg"></i>
              </button>

              <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                <h3 style={{ 
                  fontSize: '1.6rem', 
                  fontWeight: '800', 
                  color: '#006ea7', 
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.02em'
                }}>
                  Wie du unsere Deep-Tech-Plattform für dich nutzen kannst
                </h3>
                <div style={{ 
                  width: '60px', 
                  height: '4px', 
                  background: 'linear-gradient(90deg, #006ea7, #7fd049)', 
                  margin: '0 auto', 
                  borderRadius: '2px' 
                }}></div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '0.65rem',
                margin: '0 auto'
              }}>
                {[
                  {
                    text: "Personalisierte Standortbestimmung und Zielsetzung",
                    emoji: "🎯",
                    color: "rgba(0, 110, 167, 0.08)"
                  },
                  {
                    text: "Activity Tracking und Longevity Analytics",
                    emoji: "🏃",
                    color: "rgba(13, 148, 136, 0.08)"
                  },
                  {
                    text: "Intelligente personalisierte Empfehlungen aus >35.000 Studien Alterungsforschung",
                    emoji: "🧬",
                    color: "rgba(124, 58, 237, 0.08)"
                  },
                  {
                    text: "Verhaltenspsychologie zum Aufbau von nachhaltigen Routinen",
                    emoji: "🧘",
                    color: "rgba(217, 119, 6, 0.08)"
                  },
                  {
                    text: <span>Personal Trainings mit<br />Tom AI & Lisa AI</span>,
                    emoji: "👥",
                    color: "rgba(37, 99, 235, 0.08)"
                  },
                  {
                    text: "Konfigurierbare Informationstiefe und Trainer",
                    emoji: "🛠️",
                    color: "rgba(79, 70, 229, 0.08)"
                  },
                  {
                    text: "Integration von Wearables und externe BioAge-Reports",
                    emoji: "⌚",
                    color: "rgba(22, 163, 74, 0.08)"
                  },
                  {
                    text: "Laufendes Fortschrittsmonitoring",
                    emoji: "🚀",
                    color: "rgba(219, 39, 119, 0.08)"
                  },
                  {
                    text: "Orchestration aller Leistungen unter einem Dach",
                    emoji: "📲",
                    color: "rgba(51, 65, 85, 0.08)"
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="offer-grid-card"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      border: '1.5px solid rgba(0, 110, 167, 0.08)',
                      borderRadius: '16px',
                      padding: '1.2rem 0.9rem 0.9rem 0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      gap: '0.65rem',
                      boxShadow: '0 6px 15px rgba(0, 110, 167, 0.03)',
                      position: 'relative',
                      minHeight: '120px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      marginBottom: '0.2rem',
                      height: '44px'
                    }}>
                      <span style={{
                        fontSize: '1.5rem',
                        fontWeight: '400',
                        color: 'rgba(0, 110, 167, 0.55)',
                        letterSpacing: '0.05em'
                      }}>
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      {idx === 4 ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', position: 'relative', width: '70px', height: '42px', marginLeft: '4px' }}>
                          <img 
                            src="/images/tom_jung.png" 
                            alt="Tom AI" 
                            style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1.5px solid white', position: 'absolute', left: '0px', zIndex: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transform: 'scale(1.25)', objectFit: 'cover' }}
                          />
                          <img 
                            src="/images/lisa.png" 
                            alt="Lisa AI" 
                            style={{ width: '42px', height: '42px', borderRadius: '50%', border: '1.5px solid white', position: 'absolute', right: '0px', zIndex: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.85rem' }}>
                          {item.emoji}
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '0.92rem', 
                      lineHeight: '1.35', 
                      color: '#1e293b', 
                      fontWeight: '400',
                      maxWidth: '220px',
                      margin: '0 auto'
                    }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="cycle-container">
          {/* The Cycle Circle Visual */}
          <div className="cycle-loop-wrapper">
            <svg className="cycle-svg" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Gradients */}
                {/* Gradients for Three-Sector Loop */}
                <linearGradient id="top-arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#006ea7" />
                  <stop offset="30%" stopColor="#006ea7" />
                  <stop offset="70%" stopColor="#7fd049" />
                  <stop offset="100%" stopColor="#7fd049" />
                </linearGradient>
                <linearGradient id="br-arc-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7fd049" />
                  <stop offset="30%" stopColor="#7fd049" />
                  <stop offset="70%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="bl-arc-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1" />
                  <stop offset="30%" stopColor="#cbd5e1" />
                  <stop offset="70%" stopColor="#006ea7" />
                  <stop offset="100%" stopColor="#006ea7" />
                </linearGradient>
                <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                {/* Node glows */}
                <radialGradient id="starter-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#006ea7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#006ea7" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="premium-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#7fd049" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7fd049" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="platin-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#64748b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Outer slowly rotating dashed border in current active color */}
              <circle cx="250" cy="250" r="190" stroke={currentCycleColor} strokeWidth="2.5" strokeDasharray="8 12" fill="none" opacity="0.45" className="rotating-ring" style={{ transition: 'stroke 0.6s ease' }} />
              
              {/* Perfect Solid circular cycle line split into three sectors */}
              <path d="M 80,250 A 170,170 0 0,1 420,250" stroke="url(#top-arc-gradient)" strokeWidth="6" fill="none" />
              <path d="M 420,250 A 170,170 0 0,1 250,420" stroke="url(#br-arc-gradient)" strokeWidth="6" fill="none" />
              <path d="M 250,420 A 170,170 0 0,1 80,250" stroke="url(#bl-arc-gradient)" strokeWidth="6" fill="none" />
              
              {/* Flowing animated light beam */}
              <circle cx="250" cy="250" r="170" stroke="url(#beam-gradient)" strokeWidth="8" fill="none" className="cycle-flow-line" strokeLinecap="round" />
              
              {/* Starter Node (Left) */}
              <g className={`pulse-node ${activeCyclePlan === 'starter' ? 'active-node' : ''}`} onClick={() => setActiveCyclePlan('starter')} style={{ cursor: 'pointer' }}>
                <circle cx="80" cy="250" r="38" fill="url(#starter-glow)" />
                <circle cx="80" cy="250" r="26" fill="#e0f2fe" stroke="#93c5fd" strokeWidth="2.5" />
                <text x="80" y="250" dy="0.05em" fill="#006ea7" fontSize="25" fontWeight="900" textAnchor="middle" dominantBaseline="central">1</text>
              </g>
              
              {/* Premium Node (Right) */}
              <g className={`pulse-node ${activeCyclePlan === 'premium' ? 'active-node' : ''}`} style={{ animationDelay: '1s', cursor: 'pointer' }} onClick={() => setActiveCyclePlan('premium')}>
                <circle cx="420" cy="250" r="38" fill="url(#premium-glow)" />
                <circle cx="420" cy="250" r="26" fill="#7fd049" stroke="white" strokeWidth="2.5" />
                <text x="420" y="250" dy="0.05em" fill="white" fontSize="25" fontWeight="900" textAnchor="middle" dominantBaseline="central">2</text>
              </g>
              
              {/* Platin Node (Bottom Center) */}
              <g className={`pulse-node ${activeCyclePlan === 'platin' ? 'active-node' : ''}`} style={{ animationDelay: '2s', cursor: 'pointer' }} onClick={() => setActiveCyclePlan('platin')}>
                <circle cx="250" cy="420" r="38" fill="url(#platin-glow)" />
                <circle cx="250" cy="420" r="26" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2.5" />
                <text x="250" y="420" dy="0.05em" fill="#334155" fontSize="25" fontWeight="900" textAnchor="middle" dominantBaseline="central">3</text>
              </g>
            </svg>
            <div className="loop-center-badge">
              <div className="signet-crop-container">
                <Image 
                  src="/images/logoneu.png" 
                  alt="True Years Signet" 
                  width={300} 
                  height={100} 
                  className="signet-crop-image"
                />
              </div>
            </div>
          </div>

          {/* The Three Cards */}
          <div className="cycle-cards-grid">
            <div 
              className={`cycle-card starter-card ${activeCyclePlan === 'starter' ? 'highlighted' : ''}`}
              onClick={() => setActiveCyclePlan('starter')}
              style={{ cursor: 'pointer' }}
            >
              <div className="cycle-card-header">
                <div className="cycle-card-header-top">
                  <div className="cycle-price" style={{ margin: 0 }}>29,90 €<span className="cycle-period">/ Monat</span></div>
                  <div className="cycle-plan-pill pill-starter">STARTER</div>
                </div>
                <div className="plan-intro" style={{ marginTop: '0.4rem' }}>
                  <strong>Einstiegsmodell</strong>
                </div>
              </div>
              <ul className="cycle-features-list">
                <li><i className="bi bi-list-check"></i> <span>Alle 5 Leistungen abrufbar</span></li>
                <li><i className="bi bi-lock-fill"></i> <span>Eingeschränkte Funktionen</span></li>
                <li><i className="bi bi-display"></i> <span>Monatliche Live-Calls</span></li>
                <li><i className="bi bi-signpost-split"></i> <span>Personalisierte Reise</span></li>
              </ul>
              <div className="cycle-card-footer">
                <Link href="/checkout?plan=basic" className="btn-pricing-mini">
                  auswählen
                </Link>
              </div>
            </div>

            <div 
              className={`cycle-card premium-card ${activeCyclePlan === 'premium' ? 'highlighted' : ''}`}
              onClick={() => setActiveCyclePlan('premium')}
              style={{ cursor: 'pointer' }}
            >
              <div className="cycle-card-header">
                <div className="cycle-card-header-top">
                  <div className="cycle-price" style={{ margin: 0 }}>49,90 €<span className="cycle-period">/ Monat</span></div>
                  <div className="cycle-plan-pill pill-premium">PREMIUM</div>
                </div>
                <div className="plan-intro" style={{ marginTop: '0.4rem' }}>
                  <strong>Professional-Modell</strong>
                </div>
              </div>
              <ul className="cycle-features-list">
                <li><i className="bi bi-check-circle-fill"></i> <span>Alle Starter-Leistungen nutzbar</span></li>
                <li><i className="bi bi-smartwatch"></i> <span>+ Wearable-Integration</span></li>
                <li><i className="bi bi-cpu"></i> <span>+ BioAge Optimizer</span></li>
                <li><i className="bi bi-heart-fill"></i> <span>+ Feel-Good-Area</span></li>
                <li><i className="bi bi-rocket-takeoff"></i> <span>+ Zugriff auf neue Beta-Features</span></li>
              </ul>
              <div className="cycle-card-footer">
                <Link href="/checkout?plan=premium" className="btn-pricing-mini">
                  auswählen
                </Link>
              </div>
            </div>

            <div 
              className={`cycle-card platin-card ${activeCyclePlan === 'platin' ? 'highlighted' : ''}`}
              onClick={() => setActiveCyclePlan('platin')}
              style={{ cursor: 'pointer' }}
            >
              <div className="cycle-card-header">
                <div className="cycle-card-header-top">
                  <div className="cycle-price" style={{ margin: 0 }}>89,90 €<span className="cycle-period">/ Monat</span></div>
                  <div className="cycle-plan-pill pill-platin">PLATIN</div>
                </div>
                <div className="plan-intro" style={{ marginTop: '0.4rem' }}>
                  <strong>Concierge-Modell</strong>
                </div>
              </div>
              <ul className="cycle-features-list">
                <li><i className="bi bi-gem"></i> <span>Alle Premium-Leistungen nutzbar</span></li>
                <li><i className="bi bi-droplet-half"></i> <span>+ Labordiagnostik (3x jährlich)</span></li>
                <li><i className="bi bi-chat-square-text-fill"></i> <span>+ Expertengespräch (1x jährlich)</span></li>
                <li><i className="bi bi-person-fill-check"></i> <span>+ Persönlicher Ansprechpartner</span></li>
              </ul>
              <div className="cycle-card-footer">
                <Link href="/checkout?plan=platin" className="btn-pricing-mini">
                  auswählen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Testphase Section (Final CTA) */}
      <section id="testphase" className="final-cta-new">
        <div className="section-header final-cta-header">
          <h2>Wissenschaftlich fundierte Langlebigkeit</h2>
        </div>

        <div className="final-cta-card">
          <div className="final-cta-grid">
            <div className="final-cta-text-col">
              <p>
                Dein biologisches Alter ist ein dynamischer Wert, den du aktiv steuern kannst. Durch Kombination aus wissenschaftlich validierten Gewohnheiten, personalisierten Maßnahmen, Wearable-Tracking und Labor-Diagnostik lässt sich dein Alterungsprozess nachweisbar verlangsamen.
              </p>
              <p>
                Während der normale Lebensweg zu einem stetigen, unkontrollierten Verlust an Zellvitalität führt, ermöglicht dir unser Ansatz eine signifikante Verjüngung. So sicherst du dir viele zusätzliche vitale & kraftvolle Lebensjahre voller Lebensfreude.
              </p>
              <div className="final-cta-btns">
                <Link href="#erfolgsprinzip" className="btn-primary-large final-cta-btn">
                  Jetzt BioAge berechnen
                </Link>
              </div>
            </div>
            
            <div className="final-cta-visual-col">
              <div className="longevity-chart-wrapper">
                <svg className="longevity-chart-svg" viewBox="0 0 500 315" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="75" y1="40" x2="475" y2="40" stroke="rgba(0,0,0,0.15)" />
                  <line x1="75" y1="115" x2="475" y2="115" stroke="rgba(0,0,0,0.15)" />
                  <line x1="75" y1="190" x2="475" y2="190" stroke="rgba(0,0,0,0.15)" />
                  <line x1="75" y1="265" x2="475" y2="265" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" />
                  
                  {/* Y Axis line */}
                  <line x1="75" y1="20" x2="75" y2="265" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                  
                  {/* Diverging area fill gradient */}
                  <path d="M 75 190 Q 245 170 475 90 L 475 210 Q 245 210 75 190 Z" fill="url(#diverge-gradient)" />
                  
                  {/* Normal Curve (Red/Orange) */}
                  <path d="M 75 190 Q 245 170 475 90" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" />
                  {/* TrueYears Curve (Green) */}
                  <path d="M 75 190 Q 245 210 475 210" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Anchor Point (Start of Intervention) */}
                  <circle cx="75" cy="190" r="6" fill="#ffffff" stroke="#004b75" strokeWidth="2.5" />
                  
                  {/* Endpoints indicators */}
                  <circle cx="475" cy="90" r="5" fill="#f43f5e" />
                  <circle cx="475" cy="210" r="5" fill="#10b981" />
                  
                  {/* Labels on curves */}
                  <text x="245" y="105" fill="#f43f5e" fontSize="16" fontWeight="600">Standard-Alterung</text>
                  <text x="245" y="240" fill="#10b981" fontSize="16" fontWeight="700">TrueYears Longevity-Pfad</text>
                  
                  {/* Rejuvenation Gap Text (Styled as a Button/Badge) */}
                  <rect x="321" y="150" width="108" height="38" rx="19" ry="19" fill="rgba(255, 255, 255, 0.8)" stroke="#006EA7" strokeWidth="1.5" />
                  <text x="375" y="166" fill="#006EA7" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">Vitalitäts-</text>
                  <text x="375" y="180" fill="#006EA7" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">Gewinn</text>
                  
                  {/* Axis Labels */}
                  <text x="35" y="150" fill="rgba(15,23,42,0.85)" fontSize="16" transform="rotate(-90 35 150)" textAnchor="middle">Dein biologisches Alter</text>
                  <text x="275" y="300" fill="rgba(15,23,42,0.85)" fontSize="16" textAnchor="middle">Dein chronologisches Alter</text>
                  
                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="diverge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#cbeeff" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.45" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Kundenstimmen Section (Testimonials Slider) */}
      <section id="kundenstimmen" className="testimonials-section">
        <div className="section-header">
          <h2>Was unsere Mitglieder sagen</h2>
          <p>Erfahrungsberichte von Mitgliedern auf ihrer Longevity-Reise.</p>
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
                    </div>
                    <div className="testimonial-content-large">
                      {t.badge && <span className="testimonial-result-badge">{t.badge}</span>}
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

      {/* Video Modal Placeholder */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setShowVideoModal(false)}>
              <i className="bi bi-x"></i>
            </button>
            <div className="video-modal-body">
              <div className="video-modal-icon">
                <i className="bi bi-camera-video"></i>
              </div>
              <h3>Video kommt bald!</h3>
              <p>
                Wir drehen aktuell ein professionelles Intro-Video, in dem wir dir True Years und unsere Vision einer zellulären Verjüngung bis ins kleinste Detail erklären.
              </p>
              <div className="video-modal-bullets">
                <div className="video-bullet">
                  <i className="bi bi-check-circle-fill"></i>
                  <span><strong>Wissenschaft:</strong> Erfahre mehr über zelluläre & biologische Uhren.</span>
                </div>
                <div className="video-bullet">
                  <i className="bi bi-check-circle-fill"></i>
                  <span><strong>AI-Training:</strong> Lerne Lisa AI als deine Begleiterin kennen.</span>
                </div>
                <div className="video-bullet">
                  <i className="bi bi-check-circle-fill"></i>
                  <span><strong>Habits:</strong> Wie wirkungsvoll tägliche Routinen für dich sind.</span>
                </div>
              </div>
              <button className="btn-modal-primary" onClick={() => setShowVideoModal(false)}>
                Verstanden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
