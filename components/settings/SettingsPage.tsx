'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    dataSharing: false,
  });

  const [language, setLanguage] = useState('de');
  const [theme, setTheme] = useState('light');

  const [wearables, setWearables] = useState({
    appleWatch: true,
    fitbit: false,
    garmin: false,
    oura: false,
    autoSync: true,
  });

  const [units, setUnits] = useState({
    distance: 'km',
    weight: 'kg',
    temperature: 'celsius',
  });

  const [profileData, setProfileData] = useState({
    firstName: 'Maria',
    lastName: 'Schmidt',
    email: 'maria.schmidt@example.com',
    phone: '+49 123 456789',
    birthDate: '1985-05-15',
    gender: 'weiblich',
  });

  const [payment, setPayment] = useState({
    paymentMethod: 'credit-card',
    cardNumber: '**** **** **** 1234',
    expiryDate: '12/25',
    autoRenewal: true,
    plan: 'Starter Paket',
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
                <p>Erhalte Benachrichtigungen in der App</p>
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
                <h3>E-Mail-Benachrichtigungen</h3>
                <p>Erhalte wichtige Updates per E-Mail</p>
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
                <h3>Wöchentliche Zusammenfassung</h3>
                <p>Erhalte eine wöchentliche Übersicht deiner Fortschritte</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.weekly}
                  onChange={(e) => setNotifications({ ...notifications, weekly: e.target.checked })}
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
                <h3>Daten teilen</h3>
                <p>Erlaube anonymisierte Daten für Forschungszwecke</p>
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
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <i className="bi bi-globe"></i>
            <h2>Sprache & Region</h2>
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
                <option value="auto">Automatisch</option>
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
                <h3>Fitbit</h3>
                <p>Daten von Fitbit synchronisieren</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={wearables.fitbit}
                  onChange={(e) => setWearables({ ...wearables, fitbit: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Garmin</h3>
                <p>Daten von Garmin synchronisieren</p>
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
            <h2>Einheiten</h2>
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
            <h2>Payment</h2>
          </div>
          <div className="settings-options">
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Aktuelles Paket</h3>
                <p>{payment.plan}</p>
              </div>
              <button className="settings-action-btn-small">
                Ändern
              </button>
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
                <p>Paket automatisch verlängern</p>
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
                <h3>Daten exportieren</h3>
                <p>Lade alle deine Daten herunter</p>
              </div>
              <button className="settings-action-btn-small">
                <i className="bi bi-download"></i>
                Exportieren
              </button>
            </div>
            <div className="settings-option">
              <div className="settings-option-info">
                <h3>Konto löschen</h3>
                <p>Alle Daten werden unwiderruflich gelöscht</p>
              </div>
              <button className="settings-action-btn-small settings-action-btn-danger">
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

