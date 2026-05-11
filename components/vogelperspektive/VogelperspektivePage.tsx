'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VogelperspektivePage() {
  const [currentDate] = useState('SONNTAG, 10. MAI 2026');

  return (
    <div className="dashboard-container">
      {/* TOP ROW: 3 COLUMNS */}
      <div className="top-row">

        {/* BOX 1: DEIN FOKUS HEUTE */}
        <div className="dash-card focus-box">
          <div className="box-header">
            <i className="bi bi-brightness-high focus-sun-icon"></i>
            <h2 className="box-label">Dein Fokus heute</h2>
          </div>
          <div className="focus-main-content">
            <div className="focus-hero-row">
              <div className="sunflower-circle">
                <Image src="/images/photo_sunflower.png" width={60} height={60} alt="Focus" />
              </div>
              <div className="focus-text-content">
                <h3 className="focus-title">Stress reduzieren</h3>
                <p className="focus-desc">Komm kurz runter und finde zurück in Ruhe. Gönn dir eine kleine Auszeit für mehr Energie. Jeder Moment der Achtsamkeit bringt dich deinem Ziel näher.</p>
              </div>
            </div>
            <div className="focus-cards-row">
              <div className="f-card">
                <div className="f-card-img"><Image src="/images/photo_meditation.png" fill alt="Atem" style={{ objectFit: 'cover' }} /></div>
                <span className="f-card-label">Atemübung</span>
              </div>
              <div className="f-card">
                <div className="f-card-img"><Image src="/images/photo_walk.png" fill alt="Walk" style={{ objectFit: 'cover' }} /></div>
                <span className="f-card-label">Spaziergang</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: GREETING & AVATAR */}
        <div className="center-section">
          <div className="greeting-block">
            <span className="date-display">{currentDate}</span>
            <h1 className="greeting-h1">Guten Tag,<br /><span className="name-blue">Monique</span></h1>
          </div>
          <div className="avatar-outer-circle">
            <div className="avatar-inner">
              <Image src="/images/woman_53_blonde.png" width={240} height={240} alt="Monique" priority />
            </div>
          </div>
        </div>

        {/* BOX 2: ACTIVITY TRACKER */}
        <div className="dash-card tracker-box">
          <div className="box-header">
            <i className="bi bi-smartwatch tracker-icon"></i>
            <h2 className="box-label">Activity Tracker</h2>
          </div>
          <div className="tracker-top-btns">
            <button className="add-btn">+</button>
            <button className="voice-btn"><i className="bi bi-mic"></i> Sprechen</button>
            <button className="photo-btn"><i className="bi bi-camera"></i> Foto</button>
          </div>
          <div className="tracker-label">LETZTE 3 AKTIVITÄTEN</div>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="act-icon-wrap"><i className="bi bi-bicycle"></i></div>
              <strong>Radfahren</strong>
              <span className="act-duration">30 Min.</span>
            </div>
            <div className="activity-card">
              <div className="act-icon-wrap">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.4em', height: '1.4em' }}>
                  <path d="M6 7h1.5v10H6zm-2.5 2h1.5v6h-1.5zm13 0h1.5v6h-1.5zm2.5-2h1.5v10H19zm-11.5 4h10v2h-10z" />
                </svg>
              </div>
              <strong>Fitness</strong>
              <span className="act-duration">1h 20 Min.</span>
            </div>
            <div className="activity-card">
              <div className="act-icon-wrap"><i className="bi bi-person-walking"></i></div>
              <strong>Spazieren</strong>
              <span className="act-duration">15 Min.</span>
            </div>
          </div>
          <div className="diamonds-footer-pill">
            <div className="diamonds-txt">
              <div className="diamonds-title">Diamonds Lounge</div>
              <div className="diamonds-sub">Diese Woche erreicht</div>
            </div>
            <div className="diamonds-score-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.1em', height: '1.1em' }}>
                <path d="M6 3h12l4 6-10 12L2 9z"></path>
                <path d="M11 3L8 9l3 12"></path>
                <path d="M13 3l3 6-3 12"></path>
                <path d="M2 9h20"></path>
              </svg>
              <span>18</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 2 COLUMNS */}
      <div className="bottom-row">

        {/* BOX 3: DIREKT-EINSTIEG */}
        <div className="dash-card entry-box-full">
          <div className="box-header">
            <i className="bi bi-grid-fill entry-grid-icon"></i>
            <h2 className="box-label">Direkt-Einstieg</h2>
          </div>
          <div className="entry-items-row">
            <div className="entry-h-card">
              <div className="ehc-img"><Image src="/images/longevity_sphere_final.png" width={40} height={40} alt="Lab" /></div>
              <span>Longevity Lab</span>
            </div>
            <div className="entry-h-card">
              <div className="ehc-img"><Image src="/images/photo_sunflower.png" width={40} height={40} alt="Shop" /></div>
              <span>Longevity Shop</span>
            </div>
          </div>
        </div>

        {/* BOX 4: FEEL-GOOD-AREA */}
        <div className="dash-card feelgood-box-full">
          <div className="box-header">
            <i className="bi bi-stars feelgood-star-icon"></i>
            <h2 className="box-label">Feel-Good-Area</h2>
          </div>
          <div className="fg-items-grid">
            <div className="fg-h-card">
              <div className="fgh-img green"><Image src="/images/photo_walk.png" fill alt="Nature" style={{ objectFit: 'cover' }} /></div>
              <div className="fgh-txt"><strong>Nature Break</strong><span>30-Sek. Natur-Clips</span></div>
            </div>
            <div className="fg-h-card">
              <div className="fgh-img orange"><Image src="/images/photo_sunflower.png" fill alt="Mindful" style={{ objectFit: 'cover' }} /></div>
              <div className="fgh-txt"><strong>Mindful Eating</strong><span>Bewussteres Essen</span></div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .dashboard-container { padding: 2rem; min-height: 100vh; display: flex; flex-direction: column; gap: 2rem; }
        
        .top-row { display: grid; grid-template-columns: 1fr 0.8fr 1fr; gap: 1.5rem; align-items: stretch; }
        .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        .dash-card {
          background: #fff;
          border-radius: 28px;
          padding: 1.5rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }

        .box-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
        .box-label { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
        .focus-sun-icon { color: #4498ca; font-size: 1.2rem; }
        .tracker-icon { color: #4498ca; font-size: 1.4rem; }
        .entry-grid-icon { color: #4498ca; font-size: 1.2rem; }
        .feelgood-star-icon { color: #4498ca; font-size: 1.2rem; }

        /* BOX 1: FOCUS */
        .focus-hero-row { display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.5rem; }
        .sunflower-circle { width: 70px; height: 70px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .focus-title { font-size: 1.4rem; font-weight: 800; color: #4498ca; margin: 0; }
        .focus-desc { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; line-height: 1.4; }
        .focus-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .f-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 0.6rem; text-align: center; }
        .f-card-img { height: 110px; border-radius: 16px; overflow: hidden; position: relative; margin-bottom: 0.5rem; }
        .f-card-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; }

        /* CENTER SECTION */
        .center-section { text-align: center; }
        .date-display { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .greeting-h1 { font-size: 2.2rem; font-weight: 500; color: #1e293b; margin: 0.4rem 0 1.5rem; line-height: 1.1; }
        .name-blue { color: #4498ca; font-weight: 800; }
        .avatar-outer-circle { display: inline-block; padding: 10px; border-radius: 50%; background: #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
        .avatar-inner { width: 240px; height: 240px; border-radius: 50%; overflow: hidden; }

        /* BOX 2: TRACKER */
        .tracker-top-btns { display: grid; grid-template-columns: 55px 1fr 1fr; gap: 0.6rem; margin-bottom: 1.25rem; }
        .add-btn { height: 55px; background: #6099cf; color: #fff; border: none; border-radius: 16px; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 10px rgba(96, 153, 207, 0.25); }
        .voice-btn, .photo-btn { 
          height: 55px; background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; 
          display: flex; align-items: center; justify-content: center; gap: 0.5rem; 
          font-weight: 700; color: #334155; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          font-size: 0.9rem;
        }
        .voice-btn i, .photo-btn i { font-size: 1.1rem; color: #6099cf; }

        .tracker-label { font-size: 0.6rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.08em; margin-bottom: 0.75rem; text-transform: uppercase; }
        .activities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 1.25rem; }
        
        .activity-card {
          background: #fff; border: 1px solid #f1f5f9; border-radius: 18px;
          padding: 1rem 0.4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
        }
        .act-icon-wrap { font-size: 1.4rem; color: #6099cf; margin-bottom: 0.1rem; }
        .activity-card strong { font-size: 0.8rem; color: #1e293b; }
        .act-duration { font-size: 0.7rem; color: #94a3b8; font-weight: 600; }

        .diamonds-footer-pill { 
          background: linear-gradient(90deg, #eefdf8 0%, #e8f4f8 100%); 
          border-radius: 20px; padding: 0.9rem 1.25rem; 
          display: flex; justify-content: space-between; align-items: center; margin-top: auto; 
          border: 1px solid rgba(115, 196, 128, 0.1);
        }
        .diamonds-title { font-size: 1rem; font-weight: 800; color: #2d4a57; margin-bottom: 1px; }
        .diamonds-sub { font-size: 0.75rem; color: #64748b; font-weight: 600; }
        
        .diamonds-score-pill {
          background: #fff; border: 2.2px solid #73c480; border-radius: 50px;
          padding: 0.4rem 1.2rem; display: flex; align-items: center; gap: 0.5rem;
          font-weight: 800; color: #4498ca; font-size: 1.1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .diamonds-score-pill svg { color: #4498ca; }

        /* BOTTOM BOXES */
        .entry-items-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .entry-h-card { background: #f8fafc; border-radius: 20px; padding: 1rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #f1f5f9; cursor: pointer; }
        .ehc-img { width: 45px; height: 45px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }

        .fg-items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .fg-h-card { background: #f8fafc; border-radius: 20px; padding: 0.75rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #f1f5f9; cursor: pointer; }
        .fgh-img { width: 50px; height: 50px; border-radius: 14px; overflow: hidden; position: relative; flex-shrink: 0; }
        .fgh-txt { display: flex; flex-direction: column; }
        .fgh-txt strong { font-size: 0.9rem; color: #1e293b; }
        .fgh-txt span { font-size: 0.75rem; color: #64748b; }
      `}</style>
    </div>
  );
}
