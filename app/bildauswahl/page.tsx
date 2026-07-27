'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const iconList = [
  { name: 'Kraft / Power 3D', file: '/images/icon_kraft_3d.png', suitableFor: 'Stärke die Faktoren / Leistungsfähigkeit' },
  { name: 'Mindset / Fokus 3D', file: '/images/icon_mindset_3d.png', suitableFor: 'Konzentration & Resilienz' },
  { name: 'Immun / Schutz 3D', file: '/images/icon_immun_3d.png', suitableFor: 'Belastung reduzieren' },
  { name: 'Schlaf / Erholung 3D', file: '/images/icon_schlaf_3d.png', suitableFor: 'Regeneration & Schlaf' },
  { name: 'Zelle / Bio-Age 3D', file: '/images/icon_zell_3d.png', suitableFor: 'Zelluläre Gesundheit' },
  { name: 'Tiefe / Deep 3D', file: '/images/icon_tief_3d.png', suitableFor: 'Tiefe Regeneration' },
  { name: 'Einfach / Habits 3D', file: '/images/icon_einfach_3d.png', suitableFor: 'Einfache Gewohnheiten' },
  { name: 'Soziokulturell / Balance 3D', file: '/images/icon_sozial_3d.png', suitableFor: 'Soziales & Wohlbefinden' },
  { name: 'Mittel / Balance 3D', file: '/images/icon_mittel_3d.png', suitableFor: 'Ausgewogenheit' },
  { name: 'Clock / Zeit 3D', file: '/images/clock_3d.png', suitableFor: 'Dauerhaftigkeit & Langlebigkeit' },
  { name: 'Insights 3D', file: '/images/inspiration_insights_3d.png', suitableFor: 'Wissen & Erkenntnisse' },
  { name: 'Tiefe Clean 3D', file: '/images/icon_tief_clean_3d.png', suitableFor: 'Tiefe Regeneration Clean' },
  { name: 'Einfach Clean 3D', file: '/images/icon_einfach_clean_3d.png', suitableFor: 'Einfache Routinen Clean' },
  { name: 'Mittel Clean 3D', file: '/images/icon_mittel_clean_3d.png', suitableFor: 'Balance Clean' }
];

export default function BildauswahlPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif',
      padding: '3rem 2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#7FD049', marginBottom: '0.5rem' }}>
              3D Icon Auswahl für Hero Bullets
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Wähle hier visuell die passenden 3D-Icons für die Aussagen oben und unten aus.
            </p>
          </div>
          <Link href="/" style={{
            background: '#006EA7',
            color: 'white',
            padding: '0.8rem 1.6rem',
            borderRadius: '100px',
            textDecoration: 'none',
            fontWeight: 700
          }}>
            ← Zurück zur Startseite
          </Link>
        </div>

        {/* Original / Bisherige 3 Hero Slider Bilder */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '2px solid #38bdf8',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '3rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: 0, marginBottom: '0.4rem' }}>
            🖼️ Die 3 bisherigen / ursprünglichen Slider-Bilder
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '1.8rem' }}>
            Hier siehst du die 3 originalen Slider-Bilder aus dem Prototypen:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem' }}>
            {/* Slider 1 Bisherig */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <Image src="/images/hero_option_1.png" alt="Bisheriger Slider 1" fill style={{ objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#38bdf8', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>SLIDER 1 (BISHER)</span>
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700 }}>Bleibe auf deinem besten Niveau</h4>
                <p style={{ margin: '0 0 0.8rem 0', color: '#94a3b8', fontSize: '0.88rem' }}>Ursprüngliches Motiv für Slider 1 (Mann auf Terrasse)</p>
                <code style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: '6px', display: 'inline-block' }}>/images/hero_option_1.png</code>
              </div>
            </div>

            {/* Slider 2 Bisherig */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(127, 208, 73, 0.5)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <Image src="/images/hero_option_2.png" alt="Bisheriger Slider 2" fill style={{ objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#7FD049', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>SLIDER 2 (BISHER)</span>
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700 }}>Vitalität & Ausstrahlung</h4>
                <p style={{ margin: '0 0 0.8rem 0', color: '#94a3b8', fontSize: '0.88rem' }}>Ursprüngliches Motiv für Slider 2 (Frau auf Rooftop)</p>
                <code style={{ fontSize: '0.78rem', color: '#7FD049', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: '6px', display: 'inline-block' }}>/images/hero_option_2.png</code>
              </div>
            </div>

            {/* Slider 3 Bisherig */}
            <div style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                <Image src="/images/hero_option_3.png" alt="Bisheriger Slider 3" fill style={{ objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#38bdf8', color: '#0f172a', fontWeight: 800, fontSize: '0.8rem', padding: '0.3rem 0.7rem', borderRadius: '6px' }}>SLIDER 3 (BISHER)</span>
              </div>
              <div style={{ padding: '1.2rem' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: '#ffffff', fontSize: '1.1rem', fontWeight: 700 }}>Bring deinen Körper in Balance</h4>
                <p style={{ margin: '0 0 0.8rem 0', color: '#94a3b8', fontSize: '0.88rem' }}>Ursprüngliches Motiv für Slider 3 (Longevity Lounge)</p>
                <code style={{ fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: '6px', display: 'inline-block' }}>/images/hero_option_3.png</code>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Brand-New 3D Icons for Slider 2 and Slider 3 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(127, 208, 73, 0.2) 0%, rgba(0, 110, 167, 0.25) 100%)',
          border: '2px solid #7FD049',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#7FD049', marginTop: 0, marginBottom: '0.5rem' }}>
            🎨 6 Brandneue 3D-Glassmorphism Icons für Slider 2 & Slider 3 (Transparenter Hintergrund)
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '1.8rem' }}>
            Speziell designt für die neuen Inhalte – mit transparentem Hintergrund und glowing #7FD049 Akzenten:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }}>
            {/* Slider 2 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(127, 208, 73, 0.4)', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', color: '#7FD049' }}>✨ Slider 2: „Vitalität, die du spürst. Ausstrahlung, die man sieht.“</h4>
              <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.88rem', color: '#94a3b8' }}>Neu zugeordnete 3D-Icons mit transparentem Hintergrund:</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(127, 208, 73, 0.3)', borderLeft: '4px solid #7FD049', borderRadius: '12px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <Image src="/images/slider2_icon1_sparkles.svg" alt="3D Icon" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Verstehe besser, was dein Körper aktuell braucht</span>
                    <code style={{ fontSize: '0.75rem', color: '#7FD049' }}>slider2_icon1_sparkles.svg</code>
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(127, 208, 73, 0.3)', borderLeft: '4px solid #7FD049', borderRadius: '12px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <Image src="/images/slider2_icon2_dna_rejuvenation.svg" alt="3D Icon" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Nutze wissenschaftliche Erkenntnisse, um dein biologisches Alter zu senken</span>
                    <code style={{ fontSize: '0.75rem', color: '#7FD049' }}>slider2_icon2_dna_rejuvenation.svg</code>
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(127, 208, 73, 0.3)', borderLeft: '4px solid #7FD049', borderRadius: '12px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <Image src="/images/slider2_icon3_radiant_glow.svg" alt="3D Icon" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Erlebe Fortschritte, die du spürst und sehen kannst</span>
                    <code style={{ fontSize: '0.75rem', color: '#7FD049' }}>slider2_icon3_radiant_glow.svg</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider 3 */}
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '16px', padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', color: '#38bdf8' }}>🧘 Slider 3: „Bring deinen Körper in Balance“</h4>
              <p style={{ margin: '0 0 1.2rem 0', fontSize: '0.88rem', color: '#94a3b8' }}>Neu zugeordnete 3D-Icons (Gelber Stern entfernt):</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderLeft: '4px solid #38bdf8', borderRadius: '12px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <Image src="/images/slider3_icon1_vital_scanner.svg" alt="3D Icon" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Verstehe besser, was dein Körper aktuell braucht</span>
                    <code style={{ fontSize: '0.75rem', color: '#38bdf8' }}>slider3_icon1_vital_scanner.svg</code>
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderLeft: '4px solid #38bdf8', borderRadius: '12px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <Image src="/images/slider3_icon2_impact_target.svg" alt="3D Icon" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Setze dort an, wo Veränderungen am meisten bewirken</span>
                    <code style={{ fontSize: '0.75rem', color: '#38bdf8' }}>slider3_icon2_impact_target.svg (Kein Stern!)</code>
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderLeft: '4px solid #38bdf8', borderRadius: '12px', padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0 }}>
                    <Image src="/images/slider3_icon3_hope_rise.svg" alt="3D Icon" fill style={{ objectFit: 'contain' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Entwickle neue Hoffnung auf mehr Lebensqualität</span>
                    <code style={{ fontSize: '0.75rem', color: '#38bdf8' }}>slider3_icon3_hope_rise.svg</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Neue Sunlit Longevity Hero Images */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 110, 167, 0.25) 0%, rgba(127, 208, 73, 0.15) 100%)',
          border: '2px solid #006ea7',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: 0, marginBottom: '0.5rem' }}>
            ☀️ 5 Neue Hero-Bilder: Modern, Zukunftsorientiert, Longevity, Blauer Himmel, Sonne & Natur
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '1.5rem' }}>
            Diese 5 brandneuen Motive wurden speziell kreiert: Modern, zukunftsorientiert, strahlend blauer Himmel, warme Sonne und grüne Natur!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { id: 1, name: 'Option 1: Alpine Longevity Retreat', desc: 'Futuristischer Terassen-Retreat mit Blick auf alpines Tal, Sonnenschein & blauer Himmel.', file: '/images/hero_longevity_new_1.png' },
              { id: 2, name: 'Option 2: Vital Ocean Jogging', desc: 'Vitales Paar beim Joggen auf Küstenweg in grüner Natur unter strahlend blauem Himmel.', file: '/images/hero_longevity_new_2.png' },
              { id: 3, name: 'Option 3: Sunlit Forest Bio-Suite', desc: 'High-Tech Glas-Suite im sonnendurchfluteten Pinienwald mit Bergen im Hintergrund.', file: '/images/hero_longevity_new_3.png' },
              { id: 4, name: 'Option 4: Mountain Sunrise Vitality', desc: 'Aktive Person auf grünem Gipfel mit weit geöffneten Armen Richtung Sonne & blauen Himmel.', file: '/images/hero_longevity_new_4.png' },
              { id: 5, name: 'Option 5: Lake Bio-Pavilion', desc: 'Moderner Glas-Pavillon an klarem Bergsee im grünen Wald bei strahlendem Tageslicht.', file: '/images/hero_longevity_new_5.png' }
            ].map(item => (
              <div key={item.id} style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}>
                <div style={{ position: 'relative', width: '100%', height: '190px' }}>
                  <Image src={item.file} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.2rem' }}>
                  <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.1rem', color: '#7FD049' }}>{item.name}</h4>
                  <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', color: '#94a3b8' }}>{item.desc}</p>
                  <code style={{ fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>{item.file}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dedicated Slider 2 Icon Set Proposals */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(127, 208, 73, 0.15) 0%, rgba(0, 110, 167, 0.25) 100%)',
          border: '2px solid #7FD049',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#7FD049', marginTop: 0, marginBottom: '0.5rem' }}>
            ✨ Neue 3D-Icon Vorschläge für Slider 2 („Vitalität, die du spürst. Ausstrahlung, die man sieht.“)
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '1.8rem' }}>
            Hier sind 4 perfekt abgestimmte 3D-Icon-Kombinationen für den 2. Hero-Slider:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                setName: 'Set A: Energy & Bio-Cell (Empfohlen)',
                tag: 'Sportlich & Zellulär',
                b1: { text: 'Verstehe besser, was dein Körper aktuell braucht', icon: '/images/hero_icon_performance_3d_v2.png' },
                b2: { text: 'Nutze wissenschaftliche Erkenntnisse, um dein biologisches Alter zu senken', icon: '/images/icon_zell_3d.png' },
                b3: { text: 'Erlebe Fortschritte, die du spürst und sehen kannst', icon: '/images/hero_icon_resilience_3d_v2.png' }
              },
              {
                setName: 'Set B: Biological Age Clock',
                tag: 'Wissenschaft & Bio-Clock',
                b1: { text: 'Verstehe besser, was dein Körper aktuell braucht', icon: '/images/inspiration_insights_3d.png' },
                b2: { text: 'Nutze wissenschaftliche Erkenntnisse, um dein biologisches Alter zu senken', icon: '/images/clock_3d.png' },
                b3: { text: 'Erlebe Fortschritte, die du spürst und sehen kannst', icon: '/images/icon_kraft_3d.png' }
              },
              {
                setName: 'Set C: Defense & Mindset',
                tag: 'Schutz & Ausstrahlung',
                b1: { text: 'Verstehe besser, was dein Körper aktuell braucht', icon: '/images/icon_einfach_3d.png' },
                b2: { text: 'Nutze wissenschaftliche Erkenntnisse, um dein biologisches Alter zu senken', icon: '/images/hero_icon_defense_3d_v2.png' },
                b3: { text: 'Erlebe Fortschritte, die du spürst und sehen kannst', icon: '/images/icon_mindset_3d.png' }
              },
              {
                setName: 'Set D: Regeneration & Glow',
                tag: 'Tiefen-Erholung & Glow',
                b1: { text: 'Verstehe besser, was dein Körper aktuell braucht', icon: '/images/icon_schlaf_3d.png' },
                b2: { text: 'Nutze wissenschaftliche Erkenntnisse, um dein biologisches Alter zu senken', icon: '/images/icon_tief_3d.png' },
                b3: { text: 'Erlebe Fortschritte, die du spürst und sehen kannst', icon: '/images/icon_sozial_3d.png' }
              }
            ].map((set, sIdx) => (
              <div key={sIdx} style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(127, 208, 73, 0.4)',
                borderRadius: '16px',
                padding: '1.4rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>{set.setName}</h4>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(127, 208, 73, 0.2)', color: '#7FD049', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                    {set.tag}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {[set.b1, set.b2, set.b3].map((b, bIdx) => (
                    <div key={bIdx} style={{
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '0.6rem 0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem'
                    }}>
                      <div style={{ width: '36px', height: '36px', position: 'relative', flexShrink: 0 }}>
                        <Image src={b.icon} alt="Icon" fill style={{ objectFit: 'contain' }} />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.3 }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Context Banner */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '3rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#38bdf8' }}>Target-Aussagen für Zielgruppe 1:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ color: '#7FD049', fontWeight: 700 }}>Aussage Oben (Bullet 1):</span>
              <p style={{ margin: '0.4rem 0 0 0' }}>„Stärke die Faktoren, die dich dauerhaft leistungsfähig halten“</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
              <span style={{ color: '#7FD049', fontWeight: 700 }}>Aussage Unten (Bullet 3):</span>
              <p style={{ margin: '0.4rem 0 0 0' }}>„Erlebe Fortschritte bei Energie, Konzentration & Resilienz“</p>
            </div>
          </div>
        </div>

        {/* Icons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.8rem'
        }}>
          {iconList.map((icon, idx) => (
            <div key={idx} style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '1.8rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              transition: 'transform 0.2s ease'
            }}>
              <div style={{
                width: '90px',
                height: '90px',
                position: 'relative',
                marginBottom: '1.2rem',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
              }}>
                <Image 
                  src={icon.file} 
                  alt={icon.name} 
                  fill 
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.15rem', color: '#ffffff' }}>{icon.name}</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>{icon.suitableFor}</p>
              <code style={{
                background: 'rgba(0,0,0,0.4)',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#7FD049',
                wordBreak: 'break-all'
              }}>
                {icon.file}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
