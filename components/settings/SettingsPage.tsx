'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SettingsPage() {
  const [selectedStyle, setSelectedStyle] = useState<number>(2);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ty_selected_style');
      if (saved) {
        setSelectedStyle(parseInt(saved, 10));
      }
    }
  }, []);

  const handleStyleChange = (level: number) => {
    setSelectedStyle(level);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ty_selected_style', level.toString());
      window.dispatchEvent(new Event('ty_selected_style_changed'));
    }
  };

  const handleEditField = (fieldKey: keyof typeof profileData, label: string) => {
    const currentValue = profileData[fieldKey];
    const newValue = window.prompt(`${label} bearbeiten:`, currentValue);
    
    if (newValue !== null && newValue.trim() !== '' && newValue !== currentValue) {
      const confirmChange = window.confirm(`Bist du sicher, dass du das Feld "${label}" auf "${newValue}" ändern möchtest?`);
      if (confirmChange) {
        setProfileData(prev => {
          const updated = { ...prev, [fieldKey]: newValue.trim() };
          if (fieldKey === 'firstName') {
            sessionStorage.setItem('ty_first_name', newValue.trim());
            window.dispatchEvent(new Event('ty_first_name_changed'));
          } else if (fieldKey === 'email') {
            sessionStorage.setItem('ty_email', newValue.trim());
          }
          return updated;
        });
      }
    }
  };
  const [notifications, setNotifications] = useState({
    program: true,
    aiCoach: true,
    newFeatures: false,
    email: true,
    monthly: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
    biometricLock: false,
    marketingConsent: false,
    researchSharing: false,
  });

  const [language, setLanguage] = useState('de');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('monday');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('normal');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [wearables, setWearables] = useState({
    whoop: true,
    oura: false,
    appleWatch: false,
    garmin: false,
    autoSync: true,
  });  const [wearableModels, setWearableModels] = useState({
    whoop: 'Whoop 4.0',
    oura: 'Oura Ring Gen 4',
    appleWatch: 'Apple Watch Series 10',
    garmin: 'Garmin Fenix 8',
  });  const [onboardingProfileType, setOnboardingProfileType] = useState('Youthful Vitality Optimizer');

  const [units, setUnits] = useState({
    distance: 'km',
    weight: 'kg',
    temperature: 'celsius',
  });

  const [profileData, setProfileData] = useState({
    firstName: 'Monique',
    lastName: 'Müller',
    email: 'monique.mueller@gmx.de',
    phone: '0163-3024747',
    birthDate: '1985-05-15',
    gender: 'weiblich',
    street: 'Theresienhöhe 12',
    zip: '80339',
    city: 'München',
    country: 'Deutschland',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = sessionStorage.getItem('ty_first_name');
      const savedEmail = sessionStorage.getItem('ty_email');
      if (savedName || savedEmail) {
        setProfileData(prev => ({
          ...prev,
          firstName: savedName || prev.firstName,
          email: savedEmail || prev.email,
        }));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePlanChange = () => {
        const saved = localStorage.getItem('ty_selected_plan');
        if (saved) {
          let planName = 'Premium';
          if (saved === 'basic') planName = 'Starter';
          else if (saved === 'platin') planName = 'Platin';
          setPayment(prev => ({ ...prev, plan: planName }));
        }
      };
      window.addEventListener('ty_selected_plan_changed', handlePlanChange);
      window.addEventListener('storage', handlePlanChange);
      return () => {
        window.removeEventListener('ty_selected_plan_changed', handlePlanChange);
        window.removeEventListener('storage', handlePlanChange);
      };
    }
  }, []);

  const [payment, setPayment] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear() + 2; // Dynamically sets year to 2028 when current year is 2026
    const initialPlan = typeof window !== 'undefined' 
      ? (() => {
          const saved = localStorage.getItem('ty_selected_plan');
          if (saved === 'basic') return 'Starter';
          if (saved === 'platin') return 'Platin';
          return 'Premium';
        })()
      : 'Premium';

    return {
      paymentMethod: 'credit-card',
      cardNumber: '**** **** **** 1234',
      expiryDate: `${mm}/${yyyy}`,
      autoRenewal: true,
      plan: initialPlan,
      startDate: '15.05.2025',
      interval: 'jährlich',
    };
  });

  return (
    <div className="settings-container">
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ display: 'inline-block', width: '4px', height: '22px', backgroundColor: '#4498ca', marginRight: '12px', borderRadius: '4px' }}></span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Deine Präferenz Informationstiefe</h2>
        </div>
        <div style={{ display: 'block', border: 'none', background: 'transparent', padding: 0 }}>
          <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Wähle einen Informationsstil aus, der am besten zu dir passt. Dies beeinflusst, wie detailliert Erklärungen und biologische Zusammenhänge dargestellt werden.
          </p>
          <div className="segmented-control" style={{
            display: 'flex',
            background: 'transparent',
            borderRadius: 0,
            padding: 0,
            gap: '1.25rem',
            width: '100%',
            maxWidth: '100%',
            border: 'none',
            boxShadow: 'none'
          }}>
            {[
              { level: 1, name: 'Einfach', desc: 'Minimaler Aufwand: Fokus auf die wirkungsvollsten Gewohnheiten mit simplen Schritt-für-Schritt-Anleitungen.', image: '/images/icon_einfach_clean_3d.png?v=3' },
              { level: 2, name: 'Mittel', desc: 'Gezielte Optimierung: Smarte Gewohnheiten kombiniert mit leicht verständlichen Hintergrundinformationen.', image: '/images/icon_mittel_clean_3d.png?v=3' },
              { level: 3, name: 'Tiefgründig', desc: 'Hohe Tiefe: Voller Einblick in die dahinterliegenden biochemischen Prozesse und wissenschaftliche Evidenz.', image: '/images/icon_tief_clean_3d.png?v=3' }
            ].map(item => (
              <button
                key={item.level}
                onClick={() => handleStyleChange(item.level)}
                type="button"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  padding: '1.25rem 1.5rem',
                  border: selectedStyle === item.level ? '2.5px solid #4498ca' : '1px solid #e2e8f0',
                  background: '#ffffff',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  boxShadow: selectedStyle === item.level ? '0 8px 24px rgba(0, 110, 167, 0.08)' : '0 4px 12px rgba(0, 0, 0, 0.02)',
                  transform: selectedStyle === item.level ? 'translateY(-2px)' : 'none',
                  opacity: selectedStyle === item.level ? 1 : 0.65
                }}
              >
                <div className="style-header-row" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.375rem',
                  marginBottom: '8px',
                  width: '100%'
                }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{
                      width: '45px',
                      height: '45px',
                      marginRight: '6px',
                      objectFit: 'contain',
                      filter: selectedStyle === item.level ? 'none' : 'grayscale(100%) opacity(60%)'
                    }}
                  />
                  <span className="style-name" style={{
                    fontSize: '1.25rem',
                    fontWeight: 850,
                    color: selectedStyle === item.level ? '#4498ca' : '#1e293b',
                    transition: 'color 0.3s',
                    letterSpacing: '-0.015em'
                  }}>{item.name}</span>
                </div>
                <p className="style-desc" style={{
                  fontSize: '1.03rem',
                  color: selectedStyle === item.level ? '#1e293b' : '#64748b',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  margin: 0,
                  textAlign: 'left'
                }}>{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-content">
        {/* GROUP 1: PROFIL, PAYMENT & SICHERHEIT */}
        <div style={{ display: 'flex', alignItems: 'center', gridColumn: '1 / -1', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ display: 'inline-block', width: '4px', height: '22px', backgroundColor: '#4498ca', marginRight: '12px', borderRadius: '4px' }}></span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Profil, Payment & Sicherheit</h2>
        </div>

        {/* 1. Stammdaten */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-person"></i>
            <h2>Stammdaten</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Geschlecht</h3>
                <p>{profileData.gender}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('gender', 'Geschlecht')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Vorname</h3>
                <p>{profileData.firstName}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('firstName', 'Vorname')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Nachname</h3>
                <p>{profileData.lastName}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('lastName', 'Nachname')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>E-Mail</h3>
                <p>{profileData.email}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('email', 'E-Mail')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Telefon</h3>
                <p>{profileData.phone}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('phone', 'Telefon')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Geburtsdatum</h3>
                <p>{(() => {
                  if (!profileData.birthDate || !profileData.birthDate.includes('-')) return profileData.birthDate;
                  const [y, m, d] = profileData.birthDate.split('-');
                  return `${d}.${m}.${y}`;
                })()}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('birthDate', 'Geburtsdatum (Format: YYYY-MM-DD)')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Straße & Hausnr.</h3>
                <p>{profileData.street}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('street', 'Straße & Hausnr.')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>PLZ</h3>
                <p>{profileData.zip}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('zip', 'PLZ')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Ort</h3>
                <p>{profileData.city}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('city', 'Ort')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Land</h3>
                <p>{profileData.country}</p>
              </div>
              <button className="settings-edit-btn" onClick={() => handleEditField('country', 'Land')}>
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Abo & Payment */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-credit-card"></i>
            <h2>Abo & Payment</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Aktuelles Programm</h3>
                <p>Ändere dein aktives Abo</p>
              </div>
              <select
                className="settings-select"
                value={payment.plan}
                onChange={(e) => {
                  const val = e.target.value;
                  setPayment({ ...payment, plan: val });
                  if (typeof window !== 'undefined') {
                    let key = 'premium';
                    if (val === 'Starter') key = 'basic';
                    else if (val === 'Platin') key = 'platin';
                    localStorage.setItem('ty_selected_plan', key);
                    window.dispatchEvent(new Event('ty_selected_plan_changed'));
                  }
                }}
              >
                <option value="Starter">Starter</option>
                <option value="Premium">Premium</option>
                <option value="Platin">Platin</option>
              </select>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Programmbeginn</h3>
                <p>{payment.startDate}</p>
              </div>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Zahlungsmethode</h3>
                <p>Abrechnungszeitraum deines Abos</p>
              </div>
              <select
                className="settings-select"
                value={payment.interval}
                onChange={(e) => setPayment({ ...payment, interval: e.target.value })}
              >
                <option value="monatlich">monatlich</option>
                <option value="quartalsweise">quartalsweise</option>
                <option value="jährlich">jährlich</option>
                <option value="zweijährig">zweijährig</option>
              </select>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Zahlungsmittel</h3>
                <p>{payment.cardNumber}</p>
              </div>
              <button className="settings-action-btn-small" onClick={() => setIsPaymentModalOpen(true)}>
                Bearbeiten
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Ablaufdatum</h3>
                <p>{payment.expiryDate}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Automatische Verlängerung</h3>
                <p>Abo verlängert sich automatisch um ein weiteres Jahr. Ich werde 2 Wochen vor Ablauf darüber informiert.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={payment.autoRenewal}
                  onChange={(e) => setPayment({ ...payment, autoRenewal: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Konto pausieren</h3>
                <p>Pausiere deine Mitgliedschaft und Datensynchronisation vorübergehend</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-pause-circle"></i>
                Pausieren
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Konto löschen</h3>
                <p>Alle Daten werden unwiderruflich gelöscht</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-trash"></i>
                Löschen
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Support kontaktieren</h3>
                <p>Bei Fragen oder Problemen mit deinem Abo hilft dir unser Support-Team</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-headset"></i>
                Support
              </button>
            </div>
          </div>
        </div>

        {/* 3. Datenschutz & Sicherheit */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-shield-lock"></i>
            <h2>Datenschutz & Sicherheit</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Profil sichtbar</h3>
                <p>Erlaube anderen Nutzern, dein Profil zu sehen</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>KI-Analysen optimieren</h3>
                <p>Erlaube anonymisierte Daten für unsere KI, damit deine persönlichen Trainings und Empfehlungen kontinuierlich präziser werden.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.dataSharing}
                  onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3 style={{ whiteSpace: 'nowrap' }}>Biometrische Sperre (Face/Touch/PIN)</h3>
                <p>Sichere Zugriff auf dein Profil über Gesichtserkennung, Fingerabdruck oder PIN</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.biometricLock}
                  onChange={(e) => setPrivacy({ ...privacy, biometricLock: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Werbe- & Marketing-Einwilligung</h3>
                <p>Auskunft & Widerspruch gemäß Art. 21 DSGVO: Erhalte Infos zu Angeboten und personalisierten Aktionen</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.marketingConsent}
                  onChange={(e) => setPrivacy({ ...privacy, marketingConsent: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Datenweitergabe für Forschung</h3>
                <p>Einwilligung gemäß Art. 9 DSGVO: Unterstütze anonymisiert wissenschaftliche Studien mit unseren Forschungspartnern</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={privacy.researchSharing}
                  onChange={(e) => setPrivacy({ ...privacy, researchSharing: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Datenschutzbeauftragter (DPO)</h3>
                <p>Art. 37 DSGVO: Kontaktiere unseren Datenschutzbeauftragten direkt bei Fragen zu deinen Rechten</p>
              </div>
              <a href="mailto:dpo@trueyears.com?subject=DSGVO Anfrage" className="settings-action-btn-small" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-envelope" style={{ marginRight: '4px' }}></i> dpo@trueyears.com
              </a>
            </div>
          </div>
        </div>

        {/* GROUP 2: ANZEIGE & MAßEINHEITEN */}
        <div style={{ display: 'flex', alignItems: 'center', gridColumn: '1 / -1', marginTop: '1.5rem', marginBottom: '0.25rem' }}>
          <span style={{ display: 'inline-block', width: '4px', height: '22px', backgroundColor: '#4498ca', marginRight: '12px', borderRadius: '4px' }}></span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Anzeige & Maßeinheiten</h2>
        </div>

        {/* 4. Darstellung */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-palette"></i>
            <h2>Darstellung</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Design</h3>
                <p>Wähle dein bevorzugtes Design</p>
              </div>
              <select
                className="settings-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="light">Hell</option>
                <option value="dark">Dunkel</option>
              </select>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Textgröße</h3>
                <p>Passe die Textgröße der App für eine optimale Lesbarkeit an</p>
              </div>
              <select
                className="settings-select"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="small">Kleiner</option>
                <option value="normal">Normal</option>
                <option value="large">Größer</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. Metriken */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-rulers"></i>
            <h2>Metriken</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Distanz</h3>
                <p>Wähle deine bevorzugte Distanzeinheit</p>
              </div>
              <select
                className="settings-select"
                value={units.distance}
                onChange={(e) => setUnits({ ...units, distance: e.target.value })}
              >
                <option value="km">Kilometer</option>
                <option value="miles">Meilen</option>
              </select>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Gewicht</h3>
                <p>Wähle deine bevorzugte Gewichtseinheit</p>
              </div>
              <select
                className="settings-select"
                value={units.weight}
                onChange={(e) => setUnits({ ...units, weight: e.target.value })}
              >
                <option value="kg">Kilogramm</option>
                <option value="lbs">Pfund</option>
              </select>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Temperatur</h3>
                <p>Wähle deine bevorzugte Temperatureinheit</p>
              </div>
              <select
                className="settings-select"
                value={units.temperature}
                onChange={(e) => setUnits({ ...units, temperature: e.target.value })}
              >
                <option value="celsius">Celsius</option>
                <option value="fahrenheit">Fahrenheit</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6. Sprache & Wochentag */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-globe"></i>
            <h2>Sprache & Wochentag</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Sprache</h3>
                <p>Wähle deine bevorzugte Sprache</p>
              </div>
              <select
                className="settings-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Erster Wochentag</h3>
                <p>Wähle aus, ob deine Wochenpläne montags oder sonntags starten sollen.</p>
              </div>
              <select
                className="settings-select"
                value={firstDayOfWeek}
                onChange={(e) => setFirstDayOfWeek(e.target.value)}
              >
                <option value="monday">Montag</option>
                <option value="sunday">Sonntag</option>
              </select>
            </div>
          </div>
        </div>

        {/* GROUP 3: KOMMUNIKATION, INTEGRATIONEN UND DATENKONTROLLE */}
        <div style={{ display: 'flex', alignItems: 'center', gridColumn: '1 / -1', marginTop: '1.5rem', marginBottom: '0.25rem' }}>
          <span style={{ display: 'inline-block', width: '4px', height: '22px', backgroundColor: '#4498ca', marginRight: '12px', borderRadius: '4px' }}></span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Kommunikation, Integrationen und Datenkontrolle</h2>
        </div>

        {/* 7. Benachrichtigungen */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-bell"></i>
            <h2>Benachrichtigungen</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Push-Nachrichten True Years Programm</h3>
                <p>Erhalte Benachrichtigungen zum Ablauf deines Programms</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.program}
                  onChange={(e) => setNotifications({ ...notifications, program: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Push-Nachrichten Lisa / Tom AI</h3>
                <p>Erhalte Nachrichten von deinem persönlichen KI-Coach</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.aiCoach}
                  onChange={(e) => setNotifications({ ...notifications, aiCoach: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Push-Nachrichten bei neuen Features</h3>
                <p>Bleibe über neue App-Funktionen auf dem Laufenden</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.newFeatures}
                  onChange={(e) => setNotifications({ ...notifications, newFeatures: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>E-Mail Benachrichtigungen</h3>
                <p>Erhalte Benachrichtigungen per E-Mail</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Monatsreports</h3>
                <p>Erhalte eine monatliche Zusammenfassung deiner Fortschritte</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.monthly}
                  onChange={(e) => setNotifications({ ...notifications, monthly: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 8. Wearables */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-smartwatch"></i>
            <h2>Wearables & Synchronisation</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="settings-option-info">
                  <h3>Whoop Armband</h3>
                  <p>Daten von Whoop Armband synchronisieren</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={wearables.whoop}
                    onChange={(e) => setWearables({ ...wearables, whoop: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {wearables.whoop && (
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Gekoppeltes Modell:</span>
                  <select
                    className="settings-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem', height: 'auto', borderRadius: '8px' }}
                    value={wearableModels.whoop}
                    onChange={(e) => setWearableModels({ ...wearableModels, whoop: e.target.value })}
                  >
                    <option value="Whoop 5.0">Whoop 5.0</option>
                    <option value="Whoop 4.0">Whoop 4.0</option>
                    <option value="Whoop 3.0">Whoop 3.0</option>
                  </select>
                </div>
              )}
            </div>
            <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="settings-option-info">
                  <h3>Oura Ring</h3>
                  <p>Daten von Oura Ring synchronisieren</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={wearables.oura}
                    onChange={(e) => setWearables({ ...wearables, oura: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {wearables.oura && (
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Gekoppeltes Modell:</span>
                  <select
                    className="settings-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem', height: 'auto', borderRadius: '8px' }}
                    value={wearableModels.oura}
                    onChange={(e) => setWearableModels({ ...wearableModels, oura: e.target.value })}
                  >
                    <option value="Oura Ring Gen 4">Oura Ring Gen 4</option>
                    <option value="Oura Ring Gen 3">Oura Ring Gen 3</option>
                    <option value="Oura Ring Gen 2">Oura Ring Gen 2</option>
                  </select>
                </div>
              )}
            </div>
            <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="settings-option-info">
                  <h3>Apple Watch</h3>
                  <p>Daten von Apple Watch synchronisieren</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={wearables.appleWatch}
                    onChange={(e) => setWearables({ ...wearables, appleWatch: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {wearables.appleWatch && (
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Gekoppeltes Modell:</span>
                  <select
                    className="settings-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem', height: 'auto', borderRadius: '8px' }}
                    value={wearableModels.appleWatch}
                    onChange={(e) => setWearableModels({ ...wearableModels, appleWatch: e.target.value })}
                  >
                    <option value="Apple Watch Series 10">Apple Watch Series 10</option>
                    <option value="Apple Watch Series 9">Apple Watch Series 9</option>
                    <option value="Apple Watch Ultra 2">Apple Watch Ultra 2</option>
                  </select>
                </div>
              )}
            </div>
            <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="settings-option-info">
                  <h3>Garmin Watch</h3>
                  <p>Daten von Garmin Watch synchronisieren</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={wearables.garmin}
                    onChange={(e) => setWearables({ ...wearables, garmin: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {wearables.garmin && (
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Gekoppeltes Modell:</span>
                  <select
                    className="settings-select"
                    style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem', height: 'auto', borderRadius: '8px' }}
                    value={wearableModels.garmin}
                    onChange={(e) => setWearableModels({ ...wearableModels, garmin: e.target.value })}
                  >
                    <option value="Garmin Fenix 8">Garmin Fenix 8</option>
                    <option value="Garmin Fenix 7">Garmin Fenix 7</option>
                    <option value="Garmin Forerunner 965">Garmin Forerunner 965</option>
                  </select>
                </div>
              )}
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Automatische Synchronisation</h3>
                <p>Daten automatisch im Hintergrund synchronisieren</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={wearables.autoSync}
                  onChange={(e) => setWearables({ ...wearables, autoSync: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* 9. Daten */}
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-download"></i>
            <h2>Datenkontrolle</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="settings-option-info">
                  <h3>Profiltyp bei Onboarding</h3>
                  <p>Wähle deinen Langlebigkeits-Profiltyp</p>
                </div>
                <select
                  className="settings-select"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.85rem', height: 'auto', borderRadius: '8px' }}
                  value={onboardingProfileType}
                  onChange={(e) => setOnboardingProfileType(e.target.value)}
                >
                  <option value="Resilient Performer">Resilient Performer</option>
                  <option value="Youthful Vitality Optimizer">Youthful Vitality Optimizer</option>
                  <option value="Balance Rebuilder">Balance Rebuilder</option>
                  <option value="Biohacker">Biohacker</option>
                  <option value="Forever Active">Forever Active</option>
                </select>
              </div>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Laborwerte & Biomarker</h3>
                <p>PDF-Bericht deiner Laborergebnisse</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-download"></i>
                Export
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Trainings- & Aktivitätsdaten</h3>
                <p>GPX/FIT-Dateien deiner Trainingseinheiten</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-download"></i>
                Export
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>KI-Empfehlungen</h3>
                <p>JSON-Export deiner personalisierten Berichte</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-download"></i>
                Export
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Gewohnheits- & Habit-Logs</h3>
                <p>CSV-Export deiner erledigten Tagesgewohnheiten</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-download"></i>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="bi bi-credit-card" style={{ color: '#4498ca' }}></i> Hinterlegte Zahlungsinformationen
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Zahlungsmethode</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="bi bi-credit-card-2-front"></i> Visa Card
                </span>
              </div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Karteninhaber</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{profileData.firstName} {profileData.lastName}</span>
              </div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Kartennummer</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>{payment.cardNumber}</span>
              </div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Gültig bis</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{payment.expiryDate}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Rechnungsadresse</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', lineHeight: '1.4', display: 'block' }}>
                  {profileData.street}<br />
                  {profileData.zip} {profileData.city}<br />
                  {profileData.country}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#4498ca',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

