'use client';

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    monthly: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
    biometricLock: false,
  });

  const [language, setLanguage] = useState('de');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('monday');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('normal');

  const [wearables, setWearables] = useState({
    whoop: true,
    oura: false,
    appleWatch: false,
    garmin: false,
    autoSync: true,
  });

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

  const [payment, setPayment] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear() + 2; // Dynamically sets year to 2028 when current year is 2026
    return {
      paymentMethod: 'credit-card',
      cardNumber: '**** **** **** 1234',
      expiryDate: `${mm}/${yyyy}`,
      autoRenewal: true,
      plan: 'Starter',
      startDate: '15.05.2025',
    };
  });

  return (
    <div className="settings-container">
      <div className="settings-content">
        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-bell"></i>
            <h2>Benachrichtigungen</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>App-Benachrichtigungen</h3>
                <p>Erhalte Benachrichtungen in der App</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
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
          </div>
        </div>

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
                <option value="fr">Français</option>
                <option value="es">Español</option>
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

        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-smartwatch"></i>
            <h2>Wearables</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
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
            <div className="settings-option">
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
            <div className="settings-option">
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
            <div className="settings-option">
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

        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-person"></i>
            <h2>Stammdaten</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Vorname</h3>
                <p>{profileData.firstName}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Nachname</h3>
                <p>{profileData.lastName}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>E-Mail</h3>
                <p>{profileData.email}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Telefon</h3>
                <p>{profileData.phone}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Geburtsdatum</h3>
                <p>{profileData.birthDate}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Geschlecht</h3>
                <p>{profileData.gender}</p>
              </div>
              <button className="settings-edit-btn">
                <i className="bi bi-pencil"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-credit-card"></i>
            <h2>Abo & Payment</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Aktuelles Paket</h3>
                <p>Ändere dein aktives Abo</p>
              </div>
              <select
                className="settings-select"
                value={payment.plan}
                onChange={(e) => setPayment({ ...payment, plan: e.target.value })}
              >
                <option value="Starter">Starter</option>
                <option value="Premium">Premium</option>
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
                <p>{payment.cardNumber}</p>
              </div>
              <button className="settings-action-btn-small">
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
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-download"></i>
            <h2>Daten</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Monatsreports herunterladen</h3>
                <p>Lade deine monatlichen Langlebigkeitsberichte <br /> als PDF herunter</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-download"></i>
                Herunterladen
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Support kontaktieren</h3>
                <p>Bei Fragen oder Problemen mit deinen Daten hilft dir unser Support-Team</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-headset"></i>
                Support
              </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}

