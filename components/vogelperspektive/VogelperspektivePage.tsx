'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function VogelperspektivePage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const formattedDate = new Intl.DateTimeFormat('de-DE', dateOptions).format(new Date());
    setCurrentDate(formattedDate.toUpperCase());
  }, []);

  const [activeModal, setActiveModal] = useState<'activity' | 'voice' | 'photo' | 'diamonds' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activityValues, setActivityValues] = useState<Record<string, string>>({});
  const [quickSelected, setQuickSelected] = useState<string>('Radfahren');

  const optTimeShort = ['5 Min.', '10 Min.', '15 Min.', '20 Min.', '30 Min.', '45 Min.', '60 Min.'];
  const optTimeLong = ['5 Min.', '10 Min.', '15 Min.', '20 Min.', '30 Min.', '45 Min.', '60 Min.', '90 Min.', '120 Min.', '120+ Min.'];
  const optAbend = ['15 Min.', '30 Min.', '45 Min.', '60 Min.'];
  const optBoolean = ['Ja', 'Nein'];
  const optQuality = ['sehr hoch', 'hoch', 'mittel', 'niedrig', 'sehr niedrig'];
  const optSteps = ['2.000', '4.000', '6.000', '8.000', '10.000', '12.000+'];
  const optWater = ['0,5 L', '1,0 L', '1,5 L', '2,0 L', '2,5 L', '3,0+ L'];
  const optFood = ['1 Portion', '2 Portionen', '3 Portionen', '4 Portionen', '5 Portionen', '6+ Portionen'];
  const optGrams = ['erreicht', 'teilweise', 'nicht erreicht'];
  const optDays = ['1 Tag', '2 Tage', '3 Tage', '4 Tage', '5 Tage', '6 Tage', '7 Tage'];
  const optHang = ['15 Sek.', '30 Sek.', '60 Sek.', '90 Sek.', '120 Sek.'];
  const optFasting = ['10 Std.', '12 Std.', '14 Std.', '16+ Std.'];
  const optBreath = ['4 Min.', '6 Min.', '8 Min.', '10 Min.', '12 Min.'];

  const activityOptions = [
    { name: '8–8,5 Std. geschlafen', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 5 },
    { name: 'Zur Chronotyp-Zeit geschlafen', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Vor Schlafen bildschirmfrei', category: 'Schlaf & Erholung', options: optTimeShort, defaultOption: '30 Min.', diamonds: 2 },
    { name: 'Schlafzimmer kühl + dunkel gehalten', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Tageslicht am Morgen getankt', category: 'Mentale Resilienz & Mindset', options: optTimeShort, defaultOption: '10 Min.', diamonds: 3 },
    { name: 'Feste Aufstehzeit eingehalten', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Nach 14 Uhr kein Koffein mehr', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Power Nap gemacht', category: 'Schlaf & Erholung', options: optTimeShort, defaultOption: '20 Min.', diamonds: 1 },
    { name: 'Abendroutine durchgeführt', category: 'Schlaf & Erholung', options: optAbend, defaultOption: '15 Min.', diamonds: 1 },
    { name: 'Wahrgenommene Schlafqualität', category: 'Schlaf & Erholung', options: optQuality, defaultOption: 'hoch', diamonds: 4 },
    { name: 'Schritte gegangen', category: 'Kraft & Ausdauer', options: optSteps, defaultOption: '8.000', diamonds: 4 },
    { name: 'Zügig spazieren gegangen', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '20 Min.', diamonds: 3 },
    { name: 'Joggen gegangen', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '45 Min.', diamonds: 4 },
    { name: 'Krafttraining abgeschlossen', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '60 Min.', diamonds: 4 },
    { name: 'Dehnungen durchgeführt', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '10 Min.', diamonds: 2 },
    { name: 'Rad gefahren', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '60 Min.', diamonds: 4 },
    { name: 'Treppen gestiegen', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '10 Min.', diamonds: 3 },
    { name: 'HIT-Intervalltraining', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '15 Min.', diamonds: 5 },
    { name: 'Dead Hang gehalten', category: 'Kraft & Ausdauer', options: optHang, defaultOption: '60 Sek.', diamonds: 3 },
    { name: 'Griffkraft-Training durchgeführt', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '15 Min.', diamonds: 3 },
    { name: 'Cooper-Test: 2,3 km gelaufen', category: 'Kraft & Ausdauer', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Vollwertige Hauptmahlzeit gegessen', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Ballaststoffe (Ziel 30g) zugeführt', category: 'Immunbalance & Entlastung', options: optGrams, defaultOption: 'erreicht', diamonds: 4 },
    { name: 'Wasser getrunken', category: 'Immunbalance & Entlastung', options: optWater, defaultOption: '2,5 L', diamonds: 2 },
    { name: 'Gemüse + Obst gegessen', category: 'Immunbalance & Entlastung', options: optFood, defaultOption: '5 Portionen', diamonds: 4 },
    { name: 'Protein (Ziel 160g) aufgenommen', category: 'Zellerneuerung & Wachstum', options: optGrams, defaultOption: 'erreicht', diamonds: 4 },
    { name: 'Kein Ultra-Processed-Snacking', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Zuckerarm gegessen', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Omega-3-reiche Lebensmittel / Fischöl', category: 'Zellerneuerung & Wachstum', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Innenraum aktiv gelüftet', category: 'Immunbalance & Entlastung', options: optTimeShort, defaultOption: '10 Min.', diamonds: 1 },
    { name: 'Sonnenschutz bewusst eingehalten', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Esspause eingehalten', category: 'Zellerneuerung & Wachstum', options: optFasting, defaultOption: '12 Std.', diamonds: 2 },
    { name: 'Keinen Alkohol konsumiert', category: 'Immunbalance & Entlastung', options: optDays, defaultOption: '7 Tage', diamonds: 5 },
    { name: 'Echten sozialen Austausch erlebt', category: 'Selbstfürsorge & Soziale Bindungen', options: optTimeLong, defaultOption: '30 Min.', diamonds: 4 },
    { name: 'Freund / Familienmitglied kontaktiert', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Mahlzeit mit Verbundenheit erlebt', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Unterstützung gegeben/angenommen', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Im soz. Kontext alkoholfrei geblieben', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Nikotinfreien Tag geschafft', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 5 },
    { name: 'Atemübung durchgeführt', category: 'Mentale Resilienz & Mindset', options: optBreath, defaultOption: '10 Min.', diamonds: 2 },
    { name: 'Bewusste Auszeit in Natur', category: 'Mentale Resilienz & Mindset', options: optTimeLong, defaultOption: '30 Min.', diamonds: 3 },
    { name: 'Eine Pause ohne Handy gemacht', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 1 },
    { name: 'Mikropause 5 Min. eingebaut', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Vor Schlaf keinen Alk. konsumiert', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Meditiert', category: 'Mentale Resilienz & Mindset', options: optTimeShort, defaultOption: '15 Min.', diamonds: 3 },
    { name: 'Dankbarkeits-Journaling', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Negativen Gedankenkreislauf durchbrochen', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Social-Media-Zeit um 50% reduziert', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
  ];
  const filteredActivities = activityOptions.filter(a => a.name.toLowerCase().includes(activitySearchTerm.toLowerCase()));

  const calculateDiamonds = (act: any, value: string) => {
    if (!value) return act.diamonds;
    
    if (act.name === 'Dead Hang gehalten') {
      if (value === '15 Sek.') return 1;
      if (value === '30 Sek.') return 2;
      if (value === '60 Sek.') return 3;
      if (value === '90 Sek.') return 4;
      if (value === '120 Sek.') return 5;
    }

    if (value === 'Ja') return act.diamonds;
    if (value === 'Nein') return 0;
    if (value === 'erreicht') return act.diamonds;
    if (value === 'teilweise') return Math.max(1, Math.round(act.diamonds / 2));
    if (value === 'nicht erreicht') return 0;
    if (['sehr hoch', 'hoch', 'mittel', 'niedrig', 'sehr niedrig'].includes(value)) {
      if (value === 'sehr hoch') return Math.min(5, act.diamonds + 1);
      if (value === 'hoch') return act.diamonds;
      if (value === 'mittel') return Math.max(1, Math.round(act.diamonds / 2));
      if (value === 'niedrig') return 1;
      if (value === 'sehr niedrig') return 0;
    }

    const extractNum = (str: string) => {
      if (typeof str !== 'string') return 1;
      const cleaned = str.replace(/\./g, '').replace(',', '.');
      const match = cleaned.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 1;
    };

    const valNum = extractNum(value);
    const defNum = extractNum(act.defaultOption);

    if (defNum === 0) return act.diamonds;

    let ratio = valNum / defNum;
    let rawDiamonds = Math.round(act.diamonds * ratio);
    
    if (rawDiamonds < 1 && valNum > 0) rawDiamonds = 1;
    if (valNum === 0) rawDiamonds = 0;
    
    const maxPossible = Math.min(5, act.diamonds + 1);
    if (rawDiamonds > maxPossible) rawDiamonds = maxPossible;

    return rawDiamonds;
  };

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
                <Image src="/images/focus_landscape.png" width={84} height={84} alt="Focus" style={{ borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div className="focus-text-content">
                <h3 className="focus-title">Stress reduzieren</h3>
                <p className="focus-desc">Senke aktiv dein Cortisollevel und stärke deine Herzratenvariabilität (HRV) durch gezielte Entlastungsphasen und mentale Regeneration im Alltag.</p>
              </div>
            </div>
            <div className="focus-cards-row">
              <div className="f-card">
                <div className="f-card-img"><Image src="/images/photo_breath_v2.png" fill alt="Atem" style={{ objectFit: 'cover' }} /></div>
                <span className="f-card-label">Atemübung</span>
              </div>
              <div className="f-card">
                <div className="f-card-img"><Image src="/images/photo_walk.png" fill alt="Walk" style={{ objectFit: 'cover' }} /></div>
                <span className="f-card-label">Waldbaden</span>
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
              <Image src="/images/woman_53_blonde.png" width={288} height={288} alt="Monique" priority />
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
            <button className="add-btn" onClick={() => setActiveModal('activity')}>+</button>
            <button className="voice-btn" onClick={() => setActiveModal('voice')}><i className="bi bi-mic"></i> Sprechen</button>
            <button className="photo-btn" onClick={() => setActiveModal('photo')}><i className="bi bi-camera"></i> Foto</button>
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
          <div className="diamonds-footer-pill" onClick={() => setActiveModal('diamonds')}>
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

      {/* --- MODALS --- */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => { setActiveModal(null); setIsRecording(false); }}>
          <div className={`modal-content ${activeModal === 'activity' || activeModal === 'diamonds' ? 'large-modal' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => { setActiveModal(null); setIsRecording(false); }}><i className="bi bi-x-lg"></i></button>
            
            {activeModal === 'activity' && (
              <div className="modal-body dual-pane">
                <div className="modal-pane-left">
                  <h3 className="modal-title">Schnellauswahl</h3>
                  <div className="activity-options">
                    <div className={`act-opt-card ${quickSelected === 'Radfahren' ? 'active' : ''}`} onClick={() => setQuickSelected('Radfahren')}><i className="bi bi-bicycle"></i><span>Radfahren</span></div>
                    <div className={`act-opt-card ${quickSelected === 'Krafttraining' ? 'active' : ''}`} onClick={() => setQuickSelected('Krafttraining')}>
                      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.6rem', height: '1.6rem', marginBottom: '0.1rem', color: quickSelected === 'Krafttraining' ? '#4498ca' : '#6099cf' }}>
                        <path d="M6 7h1.5v10H6zm-2.5 2h1.5v6h-1.5zm13 0h1.5v6h-1.5zm2.5-2h1.5v10H19zm-11.5 4h10v2h-10z" />
                      </svg>
                      <span>Krafttraining</span>
                    </div>
                    <div className={`act-opt-card ${quickSelected === 'Spazieren' ? 'active' : ''}`} onClick={() => setQuickSelected('Spazieren')}><i className="bi bi-person-walking"></i><span>Spazieren</span></div>
                    <div className={`act-opt-card ${quickSelected === 'Schwimmen' ? 'active' : ''}`} onClick={() => setQuickSelected('Schwimmen')}><i className="bi bi-droplet"></i><span>Schwimmen</span></div>
                    <div className={`act-opt-card ${quickSelected === 'Yoga' ? 'active' : ''}`} onClick={() => setQuickSelected('Yoga')}><i className="bi bi-heart-pulse"></i><span>Yoga</span></div>
                    <div className={`act-opt-card ${quickSelected === 'Power Nap' ? 'active' : ''}`} onClick={() => setQuickSelected('Power Nap')}><i className="bi bi-moon-stars"></i><span>Power Nap</span></div>
                  </div>
                  <div className="input-group">
                    <label>Dauer (Minuten)</label>
                    <select className="qs-dropdown-select" style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#fff', fontSize: '1rem', color: '#1e293b', outline: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
                      <option>5 Min.</option>
                      <option>10 Min.</option>
                      <option>15 Min.</option>
                      <option>30 Min.</option>
                      <option>45 Min.</option>
                      <option>60 Min.</option>
                      <option>90 Min.</option>
                      <option>120 Min.</option>
                    </select>
                  </div>
                  <button className="save-btn" onClick={() => setActiveModal(null)}>Speichern</button>
                </div>
                
                <div className="modal-pane-right">
                  <h3 className="modal-title">Aktivität auswählen</h3>
                  <div className="search-bar-container">
                    <input 
                      type="text" 
                      placeholder="Neue Aktivität eintragen" 
                      className="search-input"
                      value={activitySearchTerm}
                      onChange={(e) => setActivitySearchTerm(e.target.value)}
                    />
                    <i className="bi bi-search search-icon"></i>
                  </div>

                  <div className="activity-list">
                    {(() => {
                      const groups: Record<string, any[]> = {};
                      filteredActivities.forEach(act => {
                        const cat = act.category || 'Sonstiges';
                        if (!groups[cat]) {
                          groups[cat] = [];
                        }
                        groups[cat].push(act);
                      });

                      const categoryOrder = [
                        'Schlaf & Erholung',
                        'Kraft & Ausdauer',
                        'Zellerneuerung & Wachstum',
                        'Immunbalance & Entlastung',
                        'Selbstfürsorge & Soziale Bindungen',
                        'Mentale Resilienz & Mindset',
                        'Sonstiges'
                      ];

                      const sortedCategoryNames = Object.keys(groups).sort((a, b) => {
                        const idxA = categoryOrder.indexOf(a);
                        const idxB = categoryOrder.indexOf(b);
                        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                        if (idxA !== -1) return -1;
                        if (idxB !== -1) return 1;
                        return a.localeCompare(b);
                      });

                      const categoryIcons: Record<string, string> = {
                        'Schlaf & Erholung': 'bi-moon-stars',
                        'Kraft & Ausdauer': 'bi-fire',
                        'Zellerneuerung & Wachstum': 'bi-dna',
                        'Immunbalance & Entlastung': 'bi-shield-check',
                        'Selbstfürsorge & Soziale Bindungen': 'bi-people',
                        'Mentale Resilienz & Mindset': 'bi-flower1'
                      };

                      return sortedCategoryNames.map(groupName => {
                        const sortedActs = [...groups[groupName]].sort((a, b) => a.name.localeCompare(b, 'de'));

                        return (
                          <div key={groupName} className="activity-group" style={{ marginBottom: '1.5rem' }}>
                            <h4 className="activity-group-title">
                              <i className={`bi ${categoryIcons[groupName] || 'bi-bookmark'} group-icon`} style={{ color: '#6099cf', fontSize: '1.05rem' }}></i>
                              <span>{groupName}</span>
                            </h4>
                            <div className="activity-group-items" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                              {sortedActs.map((act) => {
                                const isSelected = selectedActivities.includes(act.name);
                                return (
                                  <div key={act.name} className={`act-list-item ${isSelected ? 'selected' : ''}`}>
                                    <span className="act-name">{act.name}</span>
                                    <div className="act-right-group">
                                      {(() => {
                                        const currentVal = activityValues[act.name] || act.defaultOption;
                                        const currentDiamonds = calculateDiamonds(act, currentVal);
                                        return (
                                          <>
                                            <select 
                                              className="act-duration-select" 
                                              value={currentVal}
                                              onChange={(e) => setActivityValues({...activityValues, [act.name]: e.target.value})}
                                            >
                                              {act.options.map((opt) => (
                                                <option key={opt}>{opt}</option>
                                              ))}
                                            </select>
                                            <div className="diamond-preview">
                                              {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`bi bi-gem ${i < currentDiamonds ? (isSelected ? 'active-gem-green' : 'active-gem-blue') : (isSelected ? 'inactive-gem-green' : 'inactive-gem')}`}></i>
                                              ))}
                                            </div>
                                            <button 
                                              className={`add-list-btn ${isSelected ? 'checked' : ''}`}
                                              onClick={() => {
                                                if (isSelected) {
                                                  setSelectedActivities(selectedActivities.filter(a => a !== act.name));
                                                } else {
                                                  setSelectedActivities([...selectedActivities, act.name]);
                                                }
                                              }}
                                            >
                                              <i className={isSelected ? 'bi bi-check-lg' : 'bi bi-plus'}></i>
                                            </button>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="pane-right-footer">
                    <button className="btn-back-text" onClick={() => setActiveModal(null)}><i className="bi bi-arrow-left"></i> Zurück</button>
                    <button className="btn-clear-text" onClick={() => { setSelectedActivities([]); setActivitySearchTerm(''); setActivityValues({}); }}>Eingaben löschen</button>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'voice' && (
              <div className="modal-body voice-body">
                <h3 className="modal-title">Aktivität erfassen</h3>
                <p className="voice-hint">Beispiel: „Ich war gerade 30 Minuten Radfahren.“</p>
                <div className="voice-visualizer">
                  <div className={`v-bar ${isRecording ? 'active delay-1' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active delay-2' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active delay-3' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active delay-4' : ''}`}></div>
                </div>
                <div className={`mic-circle ${isRecording ? 'pulse' : ''}`}>
                  <i className="bi bi-mic-fill"></i>
                </div>
                {!isRecording ? (
                  <button className="save-btn" style={{ width: 'auto', padding: '1.2rem 4rem' }} onClick={() => setIsRecording(true)}>Jetzt aufnehmen</button>
                ) : (
                  <button className="save-btn recording" style={{ width: 'auto', padding: '1.2rem 4rem', backgroundColor: '#e21d48' }} onClick={() => { setIsRecording(false); setActiveModal(null); }}>Aufnahme beenden</button>
                )}
              </div>
            )}

            {activeModal === 'photo' && (
              <div className="modal-body" style={{ position: 'relative' }}>
                <h3 className="modal-title">Mahlzeit erfassen</h3>
                <p className="photo-hint">Fotografiere dein Essen für die KI-Analyse</p>
                <div className="camera-preview">
                  <div className="cam-image-overlay" style={{ backgroundImage: 'url(/images/meal_preview.png)' }}></div>
                  <div className="camera-grid-lines"></div>
                  <div className="camera-focus-bracket"></div>
                  <div className="camera-flash-overlay"></div>
                  
                  <div className="camera-live-badge">
                    <span className="live-dot"></span> LIVE-SUCHER
                  </div>
                  
                  {/* Dynamic camera status text */}
                  {(() => {
                    return (
                      <div className="camera-toast-container">
                        <span className="cam-text-toast"><i className="bi bi-camera-fill" style={{ marginRight: '6px' }}></i> KI-Bildoptimierung aktiv</span>
                      </div>
                    );
                  })()}
                </div>
                <div className="photo-btns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                  <button 
                    className="save-btn" 
                    style={{ width: 'auto', padding: '0.8rem 2.5rem', background: '#006EA7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 110, 167, 0.2)', textAlign: 'center' }} 
                    onClick={(e) => {
                      const flash = document.querySelector('.camera-flash-overlay');
                      if (flash) {
                        flash.classList.add('flash-active');
                        setTimeout(() => {
                          flash.classList.remove('flash-active');
                          setActiveModal(null);
                        }, 500);
                      } else {
                        setActiveModal(null);
                      }
                    }}
                  >
                    Jetzt Bild machen
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'diamonds' && (
              <div className="modal-body diamonds-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="diamonds-modal-header-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div className="diamonds-modal-badge" style={{ width: '55px', height: '55px', borderRadius: '18px', background: '#eefdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(115, 196, 128, 0.2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.8em', height: '1.8em', color: '#73c480' }}>
                      <path d="M6 3h12l4 6-10 12L2 9z"></path>
                      <path d="M11 3L8 9l3 12"></path>
                      <path d="M13 3l3 6-3 12"></path>
                      <path d="M2 9h20"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="modal-title" style={{ marginBottom: '0.2rem' }}>Diamonds Lounge</h3>
                    <p className="diamonds-modal-subtitle" style={{ fontSize: '1.05rem', color: '#64748b', margin: 0, fontWeight: 500 }}>Deine Aktivitäten der letzten 7 Tage</p>
                  </div>
                </div>

                <div className="diamonds-list-container" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '1rem', maxHeight: '480px', overflowY: 'auto' }}>
                  {(() => {
                    const getRelativeDateString = (daysAgo: number) => {
                      if (daysAgo === 0) return 'Heute';
                      if (daysAgo === 1) return 'Gestern';
                      const d = new Date();
                      d.setDate(d.getDate() - daysAgo);
                      const weekdayShort = d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
                      const dayAndMonth = d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
                      return `${weekdayShort}, ${dayAndMonth}`;
                    };

                    const mockDiamondsLoungeActivities = [
                      { name: 'Rad fahren', detail: '30 Min.', daysAgo: 0, diamonds: 2, icon: 'bi-bicycle' },
                      { name: 'Vollwertige Hauptmahlzeit gegessen', detail: 'Ja', daysAgo: 0, diamonds: 3, icon: 'bi-egg-fried' },
                      { name: 'Krafttraining abgeschlossen', detail: '60 Min.', daysAgo: 1, diamonds: 4, isBarbell: true },
                      { name: '8–8,5 Std. geschlafen', detail: 'Ja', daysAgo: 1, diamonds: 5, icon: 'bi-moon-stars' },
                      { name: 'Dead Hang gehalten', detail: '60 Sek.', daysAgo: 2, diamonds: 3, icon: 'bi-activity' },
                      { name: 'Atemübung durchgeführt', detail: '10 Min.', daysAgo: 2, diamonds: 2, icon: 'bi-wind' },
                      { name: 'Gemüse + Obst gegessen', detail: '5 Portionen', daysAgo: 3, diamonds: 4, icon: 'bi-apple' },
                      { name: 'Zügig spazieren gegangen', detail: '30 Min.', daysAgo: 4, diamonds: 4, icon: 'bi-person-walking' },
                      { name: 'Kein Ultra-Processed-Snacking', detail: 'Ja', daysAgo: 5, diamonds: 4, icon: 'bi-shield-check' },
                      { name: 'Meditiert', detail: '15 Min.', daysAgo: 6, diamonds: 3, icon: 'bi-flower1' }
                    ];

                    const totalDiamonds = mockDiamondsLoungeActivities.reduce((sum, act) => sum + act.diamonds, 0);

                    return (
                      <div className="diamonds-activities-table" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div className="diamonds-table-header" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderBottom: '2px solid #e2e8f0', fontWeight: 800, fontSize: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <span className="col-act" style={{ padding: '0.6rem 1rem', borderRight: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>Aktivität</span>
                          <span className="col-val" style={{ padding: '0.6rem 1rem', borderRight: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>Wert</span>
                          <span className="col-date" style={{ padding: '0.6rem 1rem', borderRight: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>Datum</span>
                          <span className="col-gems" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center' }}>Gewonnene Diamanten</span>
                        </div>
                        <div className="diamonds-table-body" style={{ display: 'flex', flexDirection: 'column' }}>
                          {mockDiamondsLoungeActivities.map((act, index) => (
                            <div key={index} className="diamonds-table-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderBottom: '1px solid #e2e8f0' }}>
                              <span className="col-act" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', borderRight: '1.5px solid #e2e8f0' }}>
                                <div className="diamonds-act-icon-box" style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#6099cf', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                  {act.isBarbell ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.4em', height: '1.4em', color: '#6099cf' }}>
                                      <path d="M6 7h1.5v10H6zm-2.5 2h1.5v6h-1.5zm13 0h1.5v6h-1.5zm2.5-2h1.5v10H19zm-11.5 4h10v2h-10z" />
                                    </svg>
                                  ) : (
                                    <i className={`bi ${act.icon}`}></i>
                                  )}
                                </div>
                                <div className="diamonds-act-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span className="diamonds-act-name" style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 400 }}>{act.name}</span>
                                </div>
                              </span>
                              <span className="col-val" style={{ display: 'flex', alignItems: 'center', padding: '0.8rem 1rem', borderRight: '1.5px solid #e2e8f0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 400 }}>
                                {act.detail}
                              </span>
                              <span className="col-date" style={{ display: 'flex', alignItems: 'center', padding: '0.8rem 1rem', borderRight: '1.5px solid #e2e8f0', fontSize: '1.1rem', color: '#475569', fontWeight: 400 }}>
                                {getRelativeDateString(act.daysAgo)}
                              </span>
                              <span className="col-gems" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem' }}>
                                <div className="diamond-preview" style={{ display: 'flex', gap: '3px' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`bi bi-gem ${i < act.diamonds ? 'active-gem-green' : 'inactive-gem-green'}`} style={{ fontSize: '1.15rem' }}></i>
                                  ))}
                                </div>
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* SUM ROW */}
                        <div className="diamonds-sum-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderTop: '2px solid #cbd5e1', background: '#ffffff', fontWeight: 700 }}>
                          <span className="col-act" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.15rem', color: '#1e293b', fontWeight: 400 }}>
                            Gesamt
                          </span>
                          <span className="col-val" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#94a3b8', fontWeight: 400 }}>
                            —
                          </span>
                          <span className="col-date" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>
                            Letzte 7 Tage
                          </span>
                          <span className="col-gems" style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.3em', height: '1.3em', color: '#22c55e' }}>
                              <path d="M6 3h12l4 6-10 12L2 9z"></path>
                              <path d="M11 3L8 9l3 12"></path>
                              <path d="M13 3l3 6-3 12"></path>
                              <path d="M2 9h20"></path>
                            </svg>
                            <span style={{ fontSize: '1.25rem', color: '#22c55e', fontWeight: 800 }}>{totalDiamonds} Diamanten</span>
                          </span>
                        </div>
                        {/* TREND ROW */}
                        <div className="diamonds-trend-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderTop: '1px solid #f1f5f9', background: '#ffffff', fontWeight: 700 }}>
                          <span className="col-act" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.15rem', color: '#1e293b', fontWeight: 400 }}>
                            Trend zu Vorwoche
                          </span>
                          <span className="col-val" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#94a3b8', fontWeight: 400 }}>
                            —
                          </span>
                          <span className="col-date" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#16a34a', fontWeight: 600, gap: '0.4rem' }}>
                            +12%
                          </span>
                          <span className="col-gems" style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '50px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontSize: '0.95rem', fontWeight: 700 }}>
                              Auf Longevity-Kurs
                            </div>
                          </span>
                        </div>
                        {/* LONG-TERM TREND ROW WITH CHART */}
                        <div className="diamonds-longterm-trend-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 3.7fr', padding: '0', borderTop: '1px solid #f1f5f9', background: '#ffffff', fontWeight: 700 }}>
                          <span className="col-act" style={{ padding: '1.2rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.15rem', color: '#1e293b', fontWeight: 400 }}>
                            Langzeittrend
                          </span>
                          <span style={{ padding: '0.65rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
                              {(() => {
                                const getWeekRangeString = (weeksAgo: number) => {
                                  const now = new Date();
                                  const currentDay = now.getDay();
                                  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
                                  
                                  const monday = new Date(now);
                                  monday.setDate(now.getDate() + distanceToMonday - (weeksAgo * 7));
                                  
                                  const sunday = new Date(monday);
                                  sunday.setDate(monday.getDate() + 6);
                                  
                                  const format = (d: Date) => {
                                    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
                                  };
                                  
                                  return format(sunday);
                                };

                                return (
                                  <svg viewBox="0 0 400 90" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                                    <defs>
                                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                                      </linearGradient>
                                    </defs>
                                    
                                    {/* Background grid line */}
                                    <line x1="15" y1="70" x2="385" y2="70" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <line x1="15" y1="45" x2="385" y2="45" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
                                    <line x1="15" y1="20" x2="385" y2="20" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />

                                    {/* Filled gradient area */}
                                    <path d="M 15 60 C 80 40, 100 35, 138 35 C 180 35, 220 58, 261 58 C 300 58, 350 15, 385 15 L 385 70 L 15 70 Z" fill="url(#chartGrad)" />

                                    {/* Glow line */}
                                    <path d="M 15 60 C 80 40, 100 35, 138 35 C 180 35, 220 58, 261 58 C 300 58, 350 15, 385 15" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.15" fill="none" />
                                    
                                    {/* Chart line */}
                                    <path d="M 15 60 C 80 40, 100 35, 138 35 C 180 35, 220 58, 261 58 C 300 58, 350 15, 385 15" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" />

                                    {/* Data points */}
                                    <circle cx="15" cy="60" r="4" fill="#fff" stroke="#22c55e" strokeWidth="2.5" />
                                    <circle cx="138" cy="35" r="4" fill="#fff" stroke="#22c55e" strokeWidth="2.5" />
                                    <circle cx="261" cy="58" r="4" fill="#fff" stroke="#22c55e" strokeWidth="2.5" />
                                    <circle cx="385" cy="15" r="6" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                                    <circle cx="385" cy="15" r="9" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />

                                    {/* Labels */}
                                    <text x="15" y="86" fontSize="9" fill="#94a3b8" fontWeight="600" textAnchor="middle">{getWeekRangeString(3)}</text>
                                    <text x="138" y="86" fontSize="9" fill="#94a3b8" fontWeight="600" textAnchor="middle">{getWeekRangeString(2)}</text>
                                    <text x="261" y="86" fontSize="9" fill="#94a3b8" fontWeight="600" textAnchor="middle">{getWeekRangeString(1)}</text>
                                    <text x="385" y="86" fontSize="9" fill="#22c55e" fontWeight="700" textAnchor="middle">{getWeekRangeString(0)}</text>
                                  </svg>
                                );
                              })()}
                            </div>
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="diamonds-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button className="save-btn" style={{ width: 'auto', padding: '1rem 3rem' }} onClick={() => setActiveModal(null)}>Schließen</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
        .sunflower-circle { width: 84px; height: 84px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .focus-title { font-size: 1.4rem; font-weight: 800; color: #4498ca; margin: 0; }
        .focus-desc { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; line-height: 1.4; }
        .focus-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .f-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 0.6rem; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .f-card:hover { transform: translateY(-4px); border-color: #cbd5e1; box-shadow: 0 10px 24px rgba(0,0,0,0.06); }
        .f-card-img { height: 110px; border-radius: 16px; overflow: hidden; position: relative; margin-bottom: 0.5rem; }
        .f-card-img :global(img) { transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .f-card:hover .f-card-img :global(img) { transform: scale(1.08); }
        .f-card-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; transition: color 0.2s; }
        .f-card:hover .f-card-label { color: #006ea7; }

        /* CENTER SECTION */
        .center-section { text-align: center; }
        .date-display { font-size: 1.15rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .greeting-h1 { font-size: 2.2rem; font-weight: 500; color: #1e293b; margin: 0.4rem 0 1.5rem; line-height: 1.1; }
        .name-blue { color: #4498ca; font-weight: 800; }
        .avatar-outer-circle { display: inline-block; padding: 10px; border-radius: 50%; background: #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
        .avatar-inner { width: 288px; height: 288px; border-radius: 50%; overflow: hidden; }

        /* BOX 2: TRACKER */
        .tracker-top-btns { display: grid; grid-template-columns: 55px 1fr 1fr; gap: 0.6rem; margin-bottom: 1.25rem; }
        .add-btn { height: 55px; background: #6099cf; color: #fff; border: none; border-radius: 16px; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 10px rgba(96, 153, 207, 0.25); transition: all 0.2s; }
        .add-btn:hover { background: #4498ca; transform: translateY(-2px); }
        .voice-btn, .photo-btn { 
          height: 55px; background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; 
          display: flex; align-items: center; justify-content: center; gap: 0.5rem; 
          font-weight: 700; color: #334155; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          font-size: 0.9rem; transition: all 0.2s;
        }
        .voice-btn:hover, .photo-btn:hover { 
          background: #eef7fc; 
          transform: translateY(-3px); 
          border-color: #6099cf; 
          color: #4498ca;
          box-shadow: 0 8px 20px rgba(96, 153, 207, 0.15);
        }
        .voice-btn:hover i, .photo-btn:hover i { color: #4498ca; }
        .voice-btn i, .photo-btn i { font-size: 1.1rem; color: #6099cf; transition: color 0.2s; }

        .tracker-label { font-size: 0.6rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.08em; margin-bottom: 0.75rem; text-transform: uppercase; }
        .activities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 1.25rem; }
        
        .activity-card {
          background: #fff; border: 1px solid #f1f5f9; border-radius: 18px;
          padding: 1rem 0.4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
        }
        .act-icon-wrap { font-size: 1.4rem; color: #6099cf; margin-bottom: 0.1rem; }
        .activity-card strong { font-size: 0.85rem; color: #1e293b; }
        .act-duration { font-size: 0.8rem; color: #4498ca; font-weight: 500; }

        .diamonds-footer-pill { 
          background: linear-gradient(90deg, #eefdf8 0%, #e8f4f8 100%); 
          border-radius: 20px; padding: 0.9rem 1.25rem; 
          display: flex; justify-content: space-between; align-items: center; margin-top: auto; 
          border: 1px solid rgba(115, 196, 128, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }
        .diamonds-footer-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(115, 196, 128, 0.15);
        }
        .diamonds-title { font-size: 1rem; font-weight: 800; color: #2d4a57; margin-bottom: 1px; }
        .diamonds-sub { font-size: 0.9rem; color: #64748b; font-weight: 600; }
        
        .diamonds-score-pill {
          background: #fff; border: 2.2px solid #73c480; border-radius: 50px;
          padding: 0.4rem 1.2rem; display: flex; align-items: center; gap: 0.5rem;
          font-weight: 800; color: #4498ca; font-size: 1.1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .diamonds-score-pill svg { color: #4498ca; }

        /* BOTTOM BOXES */
        .entry-items-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .entry-h-card { background: #f8fafc; border-radius: 20px; padding: 1rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s; }
        .entry-h-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .ehc-img { width: 45px; height: 45px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }

        .fg-items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .fg-h-card { background: #f8fafc; border-radius: 20px; padding: 0.75rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s; }
        .fg-h-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .fgh-img { width: 50px; height: 50px; border-radius: 14px; overflow: hidden; position: relative; flex-shrink: 0; }
        .fgh-txt { display: flex; flex-direction: column; }
        .fgh-txt strong { font-size: 0.9rem; color: #1e293b; }
        .fgh-txt span { font-size: 0.75rem; color: #64748b; }

        /* MODALS */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);
          z-index: 10000; display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
        }
        .modal-content {
          background: #fff; width: 100%; max-width: 500px; border-radius: 32px;
          padding: 2.5rem; position: relative; box-shadow: 0 40px 80px rgba(0,0,0,0.15);
        }
        .modal-content.large-modal { max-width: 1000px; }
        
        .dual-pane { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; }
        .modal-pane-left { display: flex; flex-direction: column; }
        .modal-pane-right { display: flex; flex-direction: column; border-left: 1.5px solid #f1f5f9; padding-left: 3rem; }
        
        .search-bar-container { position: relative; margin-bottom: 1.5rem; }
        .search-input { width: 100%; padding: 0.9rem 1.2rem 0.9rem 3rem; border: 1.5px solid #bae6fd; border-radius: 20px; font-size: 0.95rem; color: #1e293b; outline: none; transition: all 0.2s; }
        .search-input:focus { border-color: #6099cf; }
        .search-input::placeholder { color: #94a3b8; }
        .search-icon { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); color: #6099cf; font-size: 1.1rem; }
        
        .activity-list { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; max-height: 380px; overflow-y: auto; padding-right: 0.5rem; }
        .activity-list::-webkit-scrollbar { width: 6px; }
        .activity-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .activity-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .activity-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .activity-group-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 1.8rem 0 0.8rem 0.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .activity-group:first-of-type .activity-group-title {
          margin-top: 0.2rem;
        }
        
        .act-list-item { background: #f0f8ff; border: 1.5px solid #e0f2fe; border-radius: 12px; padding: 0.8rem 1rem; display: flex; align-items: center; justify-content: space-between; }
        .act-list-item.selected { background: #f0fdf4; border-color: #86d59b; }
        
        .act-name { font-weight: 400; color: #1e293b; font-size: 0.95rem; }
        .act-right-group { display: flex; align-items: center; gap: 1rem; }
        
        .act-duration-select { border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.3rem 0.5rem; background: #fff; outline: none; font-size: 0.8rem; color: #334155; cursor: pointer; }
        
        .diamond-preview { display: flex; gap: 2px; }
        .diamond-preview i { font-size: 0.85rem; }
        .active-gem-blue { color: #6099cf; }
        .inactive-gem { color: #d6e8f7; }
        .active-gem-green { color: #22c55e; }
        .inactive-gem-green { color: #bbf7d0; }
        
        .add-list-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #6099cf; background: transparent; color: #6099cf; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.2rem; padding: 0; }
        .add-list-btn.checked { background: #22c55e; border-color: #22c55e; color: #fff; }
        
        .pane-right-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .btn-back-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; padding: 0; }
        .btn-back-text:hover { color: #1e293b; }
        .btn-clear-text { background: none; border: none; color: #94a3b8; font-weight: 500; cursor: pointer; font-size: 0.85rem; padding: 0; }
        .btn-clear-text:hover { color: #64748b; }
        .modal-close-btn {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b;
        }
        .modal-title { font-size: 1.6rem; font-weight: 850; color: #1e293b; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        
        .activity-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .act-opt-card { 
          background: #f8fafc; border: 2px solid transparent; border-radius: 20px;
          padding: 1.25rem 0.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          cursor: pointer; transition: all 0.2s;
        }
        .act-opt-card:hover { background: #f0f8ff; border-color: #bae6fd; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .act-opt-card i { font-size: 1.6rem; color: #6099cf; }
        .act-opt-card span { font-size: 0.8rem; font-weight: 700; color: #475569; }
        .act-opt-card.active { background: #e0f2fe; border-color: #6099cf; }
        .act-opt-card.active i { color: #0369a1; }
        .act-opt-card.active span { color: #0369a1; }

        .input-group { margin-bottom: 2rem; }
        .input-group label { display: block; font-size: 0.9rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; }
        .input-group input { 
          width: 100%; padding: 1rem; border-radius: 16px; border: 1.5px solid #e2e8f0;
          font-size: 1.1rem; font-weight: 700; color: #1e293b; outline: none;
        }
        .input-group input:focus { border-color: #6099cf; }

        .save-btn {
          width: 100%; padding: 1.2rem; background: #0f172a; color: #fff; border: none;
          border-radius: 18px; font-size: 1.1rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover { background: #4498ca; transform: translateY(-2px); }

        .voice-body { text-align: center; }
        .voice-hint { color: #64748b; margin-bottom: 2.5rem; font-weight: 500; font-size: 1.15rem; }
        .voice-visualizer { display: flex; justify-content: center; gap: 4px; height: 30px; margin-bottom: 2rem; align-items: center; }
        .v-bar { width: 4px; height: 10px; background: #e2e8f0; border-radius: 2px; transition: all 0.2s; }
        .v-bar.active { height: 25px; background: #6099cf; animation: pulse-bar 1s infinite; }
        .v-bar.delay-1 { animation-delay: 0.2s; }
        .v-bar.delay-2 { animation-delay: 0.4s; }
        .v-bar.delay-3 { animation-delay: 0.6s; }
        .v-bar.delay-4 { animation-delay: 0.8s; }
        @keyframes pulse-bar { 0%, 100% { height: 15px; } 50% { height: 30px; } }
        
        .mic-circle {
          width: 80px; height: 80px; border-radius: 50%; background: #fff;
          color: #6099cf; display: flex; align-items: center; justify-content: center;
          font-size: 2.2rem; margin: 0 auto 3rem;
          border: 1.5px solid #6099cf;
          box-shadow: 0 8px 20px rgba(96, 153, 207, 0.1);
        }
        .mic-circle.pulse { animation: pulse-mic 2s infinite; }
        @keyframes pulse-mic { 0% { box-shadow: 0 0 0 0 rgba(96, 153, 207, 0.4); } 70% { box-shadow: 0 0 0 25px rgba(96, 153, 207, 0); } 100% { box-shadow: 0 0 0 0 rgba(96, 153, 207, 0); } }

        .photo-hint { color: #64748b; margin-bottom: 1.5rem; font-weight: 500; font-size: 1.15rem; text-align: center; }
        .camera-preview {
          width: 100%; aspect-ratio: 16 / 9; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 24px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: #64748b; gap: 1rem; margin-bottom: 2rem; border: 1.5px dashed #cbd5e1;
          position: relative; overflow: hidden;
        }
        @keyframes cameraPan {
          0% {
            transform: scale(1.0) translate(0px, 0px) rotate(0deg);
          }
          50% {
            transform: scale(1.12) translate(-14px, -8px) rotate(0.6deg);
          }
          100% {
            transform: scale(1.0) translate(0px, 0px) rotate(0deg);
          }
        }
        .cam-image-overlay {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 1; z-index: 0;
          animation: cameraPan 6s ease-in-out infinite;
          transform-origin: center;
        }
        
        /* Camera UI elements */
        .camera-grid-lines {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
          background: 
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px) 33.33% 0,
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px) 66.66% 0,
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px) 0 33.33%,
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px) 0 66.66%;
          background-size: 100% 100%;
        }
        
        .camera-focus-bracket {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 80px; height: 80px;
          pointer-events: none; z-index: 2;
          border: 2px dashed rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          animation: focusPulse 2s infinite ease-in-out;
        }
        @keyframes focusPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); border-color: rgba(255, 255, 255, 0.4); }
          50% { transform: translate(-50%, -50%) scale(1.05); border-color: rgba(0, 110, 167, 0.8); }
        }
        
        .camera-flash-overlay {
          position: absolute; inset: 0;
          background: #fff;
          opacity: 0; z-index: 999;
          pointer-events: none;
          transition: opacity 0.05s ease-out;
        }
        .camera-flash-overlay.flash-active {
          opacity: 1;
          transition: none;
        }
        
        .camera-live-badge {
          position: absolute; top: 1.25rem; left: 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          color: #fff; font-size: 0.7rem; font-weight: 800;
          padding: 0.4rem 0.8rem; border-radius: 50px;
          display: flex; align-items: center; gap: 0.4rem;
          letter-spacing: 0.05em; z-index: 2;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444;
          animation: blinkDot 1s infinite steps(2);
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .camera-toast-container {
          position: absolute; bottom: 1.25rem;
          left: 50%; transform: translateX(-50%);
          z-index: 2;
        }
        .cam-text-toast {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #fff; font-size: 0.8rem; font-weight: 600;
          padding: 0.5rem 1.2rem; border-radius: 12px;
          display: inline-flex; align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .photo-btns { display: flex; justify-content: center; }
        .cam-shutter { 
          width: 70px; height: 70px; border-radius: 50%; border: 4px solid #fff;
          background: transparent; position: relative; cursor: pointer;
        }
        .cam-shutter::after {
          content: ''; position: absolute; inset: 4px; border-radius: 50%; background: #fff;
          transition: transform 0.1s;
        }
        .cam-shutter:active::after { transform: scale(0.9); }
        .diamonds-table-row { transition: background-color 0.15s ease; }
        .diamonds-table-row:hover { background-color: #f1f7fc !important; }
      `}</style>
    </div>
  );
}
