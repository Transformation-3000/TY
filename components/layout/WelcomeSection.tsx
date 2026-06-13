'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Wearable {
  id: string;
  name: string;
  image: string;
  brandColor: string;
  glowColor: string;
  bgColor: string;
  lightBgColor: string;
  customScale?: string;
  headerScale?: string;
}

const wearables: Wearable[] = [
  {
    id: 'whoop',
    name: 'Whoop Armband',
    image: '/images/whoop.png',
    brandColor: '#0f172a',
    glowColor: 'rgba(15, 23, 42, 0.18)',
    bgColor: 'rgba(15, 23, 42, 0.02)',
    lightBgColor: '#f8fafc',
    customScale: 'scale(1.15) translateY(6px)',
    headerScale: 'scale(1.2) translateY(2px)'
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    image: '/images/oura_bright.png',
    brandColor: '#006EA7',
    glowColor: 'rgba(0, 110, 167, 0.18)',
    bgColor: 'rgba(0, 110, 167, 0.02)',
    lightBgColor: '#f0f7ff',
    customScale: 'scale(1.7) translateY(10px)',
    headerScale: 'scale(1.65) translateY(3.5px)'
  },
  {
    id: 'apple',
    name: 'Apple Smartwatch',
    image: '/images/apple_clean.png',
    brandColor: '#006EA7',
    glowColor: 'rgba(0, 110, 167, 0.18)',
    bgColor: 'rgba(0, 110, 167, 0.02)',
    lightBgColor: '#f0f7ff',
    customScale: 'scale(1.54) translateY(6px)',
    headerScale: 'scale(1.45) translateY(2px)'
  },
  {
    id: 'garmin',
    name: 'Garmin Smartwatch',
    image: '/images/garmin_clean.png',
    brandColor: '#4498ca',
    glowColor: 'rgba(68, 152, 202, 0.18)',
    bgColor: 'rgba(68, 152, 202, 0.02)',
    lightBgColor: '#f0f9ff',
    customScale: 'scale(1.54) translateY(6px)',
    headerScale: 'scale(1.45) translateY(2px)'
  }
];

export default function WelcomeSection({ 
  onNavigate, 
  onToggleSidebar, 
  sidebarOpen 
}: { 
  onNavigate?: (menuItem: string) => void; 
  onToggleSidebar?: () => void; 
  sidebarOpen?: boolean; 
}) {
  const [activeWearableId, setActiveWearableId] = useState<string>('whoop');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempSelectedId, setTempSelectedId] = useState<string>('whoop');
  const [pairingId, setPairingId] = useState<string | null>(null);
  const [pairingTimeoutId, setPairingTimeoutId] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ty_selected_wearable');
    if (saved && wearables.some(w => w.id === saved)) {
      setActiveWearableId(saved);
      setTempSelectedId(saved);
    }
    // Cleanup timeout on unmount
    return () => {
      if (pairingTimeoutId) clearTimeout(pairingTimeoutId);
    };
  }, [pairingTimeoutId]);

  const handleSelectWearable = (id: string) => {
    if (id === activeWearableId) return;
    if (pairingId !== null) return; // Prevent clicking another card during an active pairing process
    
    // Clear active wearable immediately during pairing so the old one is deselected
    setActiveWearableId('');
    setTempSelectedId(id);
    
    // Start pairing
    setPairingId(id);
    
    // Clear any active timeout
    if (pairingTimeoutId) {
      clearTimeout(pairingTimeoutId);
    }
    
    const timeout = setTimeout(() => {
      setPairingId(null);
      // Automatically save and activate
      setActiveWearableId(id);
      localStorage.setItem('ty_selected_wearable', id);
      
      // Deliberately wait 800ms so the user can enjoy the successful "VERBUNDEN" state
      // before the modal gently disappears!
      setTimeout(() => {
        setIsModalOpen(false);
      }, 800);
    }, 3000);
    
    setPairingTimeoutId(timeout);
  };

  const handleOpenModal = () => {
    setPairingId(null);
    setIsModalOpen(true);
  };

  const activeWearable = wearables.find(w => w.id === activeWearableId) || wearables[0];

  return (
    <div className="top-navigation-content">
      {/* Logo Left */}
      <div className="top-nav-logo-section" onClick={() => onNavigate?.('website')} style={{ cursor: 'pointer' }}>
        <Image src="/images/logoneu.png" alt="True Years Logo" width={180} height={180} className="top-nav-logo" style={{ objectFit: 'contain' }} />
      </div>

      {/* 3 Areas Right */}
      <div className="top-nav-right-section">
        
        {/* WEARABLE STATUS TEXT "AKTIV" */}
        <span className="status-text-active" onClick={handleOpenModal} style={{ cursor: 'pointer' }}>AKTIV</span>

        {/* EQUALLY SPACED NAV ELEMENTS */}
        <div className="nav-elements-container">
          
          {/* AREA 1: WEARABLE */}
          <div className="header-area wearable-area" onClick={handleOpenModal}>
            <div className="wearable-wrapper" title={`Aktiviertes Wearable: ${activeWearable.name}`}>
              <div className="wearable-img-container">
                <Image 
                  src={activeWearable.image} 
                  alt={activeWearable.name} 
                  width={38} 
                  height={38} 
                  style={{ 
                    objectFit: 'contain', 
                    mixBlendMode: 'multiply',
                    transform: activeWearable.headerScale || 'none'
                  }} 
                />
              </div>
              <div className="status-dot-badge"></div>
            </div>
          </div>

          {/* AREA 2: PROFILE */}
          <div className="header-area profile-area" onClick={() => onNavigate?.('settings')}>
            <div className="profile-border-circle">
              <div className="profile-img-container">
                <Image 
                  src="/images/woman_53_blonde.png" 
                  alt="Profile" 
                  fill
                  sizes="44px"
                  className="profile-img-header" 
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>



        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button 
          className={`mobile-hamburger-btn ${sidebarOpen ? 'open' : ''}`}
          onClick={onToggleSidebar} 
          aria-label="Menü"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

      </div>

      {/* WEARABLE SELECTION MODAL */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Verbinde dein Wearable</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} aria-label="Schließen">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-wrapper" style={{ display: 'flex', gap: '1.5rem', padding: '1rem 2rem 2rem' }}>
              <div className="wearables-grid" style={{ flex: '1', padding: 0 }}>
                {wearables.map((w) => {
                  const isConnected = activeWearableId === w.id;
                  const isSelected = isConnected;
                  const isPairing = pairingId === w.id;

                  return (
                    <div 
                      key={w.id} 
                      className={`wearable-card ${isSelected ? 'selected' : ''} ${isPairing ? 'pairing-active' : ''}`}
                      onClick={() => handleSelectWearable(w.id)}
                      style={{
                        '--brand-color': w.brandColor,
                        '--glow-color': w.glowColor,
                        '--bg-color': w.bgColor,
                        '--light-bg-color': w.lightBgColor
                      } as React.CSSProperties}
                    >
                      <div className="wearable-card-selector">
                        <div className={`selector-ring ${isSelected ? 'selected' : ''} ${isPairing ? 'pairing' : ''}`}>
                          {isPairing ? (
                            <span className="selector-spinner"></span>
                          ) : (
                            isSelected && <i className="bi bi-check-lg selector-check"></i>
                          )}
                        </div>
                      </div>

                      <div className="wearable-card-img-wrapper">
                        <div className="img-glow-accent"></div>
                        <Image 
                          src={w.image} 
                          alt={w.name} 
                          width={90} 
                          height={90} 
                          style={{ objectFit: 'contain', transform: w.customScale || 'none', mixBlendMode: 'multiply' }} 
                          className="wearable-card-img"
                        />
                      </div>
                      
                      <div className="wearable-card-info">
                        <span className="wearable-card-title">{w.name}</span>
                        
                        <div className="connection-badge-wrapper">
                          {isPairing ? (
                            <span className="connection-badge pairing">
                              <span className="pairing-spinner"></span> KOPPELT...
                            </span>
                          ) : isConnected ? (
                            <span className="connection-badge">
                              <span className="connection-dot"></span> VERBUNDEN
                            </span>
                          ) : (
                            <span className="connection-badge-placeholder"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="wearable-info-box" style={{
                flex: '0 0 425px',
                padding: '1.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  So verbesserst du deine Ergebnisse über Wearable-Daten
                </h4>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '1.0rem', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.45 }}>
                  <li>
                    <strong>Tägliches Bio-Alignment:</strong> Deine Werte (wie HRV, Herzfrequenz, Bewegungs-, Stress- und Schlafphasen) fließen direkt in Lisa & Tom AI ein, um deine Empfehlungen anzupassen.
                  </li>
                  <li>
                    <strong>Echtzeit-Erfolgsmessung:</strong> Du siehst sofort, wie sich dein Schlaf, deine nächtliche Regeneration und Sport auf dein biologisches Alter und deine Vitalitäts-Scores auswirken
                  </li>
                  <li>
                    <strong>100% Datensouveränität:</strong> Deine Gesundheitsdaten werden ausschließlich verschlüsselt übertragen, niemals weiterverkauft und dienen rein deiner persönlichen Optimierung.
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

      <style jsx>{`
        .top-navigation-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 2rem;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          height: 100%;
          position: relative;
        }

        .top-nav-right-section {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .mobile-hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 44px;
          height: 44px;
          background: rgba(0, 110, 167, 0.05);
          border: 1px solid rgba(0, 110, 167, 0.1);
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s ease;
          margin-left: 0.5rem;
          padding: 0;
        }
        .mobile-hamburger-btn:hover {
          background: rgba(0, 110, 167, 0.1);
          transform: scale(1.05);
        }
        .mobile-hamburger-btn:active {
          transform: scale(0.95);
        }

        .hamburger-line {
          width: 22px;
          height: 3px;
          background-color: #006EA7;
          border-radius: 3px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        /* Animation when open */
        .mobile-hamburger-btn.open .hamburger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .mobile-hamburger-btn.open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .mobile-hamburger-btn.open .hamburger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        @media (max-width: 992px) {
          .mobile-hamburger-btn {
            display: flex;
          }
          .settings-area {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .wearable-area {
            display: none !important;
          }
          .status-text-active {
            display: none !important;
          }
        }
        .nav-elements-container {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .header-area {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .header-area:hover { transform: translateY(-1px); }

        /* AREA 1: WEARABLE */
        .wearable-area { gap: 0.6rem; }
        .status-text-active {
          font-size: 0.85rem;
          font-weight: 850;
          color: #7FD049;
          letter-spacing: 0.04em;
        }
         .wearable-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background: #f8fafc;
          border-radius: 50%;
          border: 1.8px solid #e2e8f0;
          padding: 2px;
          transition: all 0.2s ease;
        }
        .wearable-img-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .wearable-area:hover .wearable-wrapper {
          border-color: #006EA7;
          background: #f0f7ff;
          box-shadow: 0 4px 10px rgba(0, 110, 167, 0.1);
        }
        .status-dot-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background: #7FD049;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* AREA 2: PROFILE */
        .profile-border-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1.8px solid #006EA7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          box-shadow: 0 4px 10px rgba(0, 110, 167, 0.1);
        }
        .profile-img-container {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
        }
        .profile-img-header {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          object-position: center;
        }

        /* AREA 3: SETTINGS */
        .settings-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 100px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          gap: 2px;
          min-width: 105px;
        }
        .settings-icon-top {
          font-size: 1.2rem;
          color: #006EA7;
        }
        .settings-label-top {
          font-size: 0.6rem;
          font-weight: 800;
          color: #006EA7;
          letter-spacing: 0.03em;
        }

        /* MODAL BACKDROP */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(8, 15, 30, 0.6);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
          padding: 1.5rem 1rem;
        }

        /* MODAL CONTAINER */
        .modal-container {
          background: linear-gradient(180deg, #ffffff 0%, #fcfdfe 100%);
          border-radius: 28px;
          width: 95%;
          max-width: 900px;
          box-shadow: 0 35px 70px -15px rgba(8, 15, 30, 0.25), 
                      inset 0 1px 0 rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.7);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          margin: auto; /* Centers modal vertically when content is smaller than viewport */
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.25rem 2rem 0.85rem;
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
          position: relative;
        }
        
        .modal-badge-top {
          font-size: 0.62rem;
          font-weight: 950;
          color: #006EA7;
          background: #e0f2fe;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          letter-spacing: 0.06em;
          display: inline-block;
          margin-bottom: 0.35rem;
        }

        .modal-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .modal-subtitle {
          font-size: 0.82rem;
          color: #475569;
          margin: 0.2rem 0 0 0;
          font-weight: 500;
        }

        .modal-close-btn {
          background: #f1f5f9;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
        }
        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
          transform: rotate(90deg) scale(1.05);
        }

        /* WEARABLES GRID - 2x2 */
        .wearables-grid {
          padding: 1rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          max-height: 480px;
          overflow-y: auto;
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .wearables-grid::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .wearable-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 1.5rem 1rem 1rem;
          border: 1.5px solid rgba(226, 232, 240, 0.8);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          background: #ffffff;
          position: relative;
          text-align: center;
          height: 100%;
          box-shadow: 0 4px 12px rgba(8, 15, 30, 0.015);
        }
        .wearable-card:hover {
          border-color: #cbd5e1; /* Einheitliche Linienfarbe bei Mouse-over für nicht ausgewählte Karten */
          transform: translateY(-4px);
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.05);
        }
        .wearable-card.selected {
          border-color: var(--brand-color);
          background: linear-gradient(180deg, #ffffff 0%, var(--light-bg-color) 100%);
          box-shadow: 0 12px 28px -10px var(--glow-color), 
                      inset 0 0 0 1px rgba(255, 255, 255, 0.6);
        }
        .wearable-card.selected:hover {
          border-color: var(--brand-color);
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -10px var(--glow-color), 
                      inset 0 0 0 1px var(--brand-color);
        }
        .wearable-card.selected:hover .img-glow-accent {
          opacity: 0.16;
        }

        .wearable-card-img-wrapper {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #ffffff 30%, #f8fafc 100%);
          border-radius: 16px;
          padding: 8px;
          flex-shrink: 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          margin-bottom: 1.25rem;
          border: 1px solid rgba(241, 245, 249, 0.8);
          position: relative;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.01);
        }
        .img-glow-accent {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: var(--brand-color);
          opacity: 0;
          filter: blur(20px);
          border-radius: 16px;
          transition: opacity 0.35s ease;
          z-index: 0;
        }
        .wearable-card.selected .img-glow-accent {
          opacity: 0.08;
        }
        .wearable-card-img {
          z-index: 1;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wearable-card:hover .wearable-card-img {
          transform: scale(1.08) translateY(-2px);
        }

        .wearable-card-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          z-index: 1;
        }

        .wearable-card-title {
          font-weight: 850;
          font-size: 1.02rem;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.01em;
          transition: color 0.2s;
        }

        .connection-badge-wrapper {
          margin-top: 0.4rem;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .connection-badge-placeholder {
          height: 22px;
          visibility: hidden;
        }

        .connection-badge {
          background: #dcfce7;
          color: #15803d;
          font-size: 0.62rem;
          font-weight: 900;
          padding: 0.18rem 0.5rem;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.04em;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
          transition: all 0.3s ease;
        }

        .connection-badge.pairing {
          background: #fef3c7;
          color: #d97706;
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
          animation: badgePulse 1.5s ease-in-out infinite;
        }

        .pairing-spinner {
          width: 9px;
          height: 9px;
          border: 1.8px solid rgba(217, 119, 6, 0.2);
          border-radius: 50%;
          border-top-color: #d97706;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        .connection-dot {
          width: 5px;
          height: 5px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 1.6s infinite;
        }

        .wearable-card-selector {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 2;
        }

        .selector-ring {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: #ffffff;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
        }
        .selector-ring.selected {
          border-color: var(--brand-color);
          background: var(--brand-color);
          transform: scale(1.08);
          box-shadow: 0 4px 10px var(--glow-color);
        }
        .selector-ring.pairing {
          border-color: var(--brand-color);
          background: #ffffff;
          transform: scale(1.08);
        }
        .selector-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(0, 110, 167, 0.15);
          border-radius: 50%;
          border-top-color: var(--brand-color);
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        .selector-check {
          color: #fff;
          font-size: 0.9rem;
          font-weight: 900;
        }

        /* PAIRING PULSE ANIMATION FOR CARD */
        .wearable-card.pairing-active {
          animation: cardPulse 1.5s ease-in-out infinite;
          pointer-events: none; /* Disable clicking during pairing process */
        }

        @keyframes cardPulse {
          0% { transform: scale(1.0); opacity: 0.94; }
          50% { transform: scale(1.01); opacity: 1; box-shadow: 0 15px 30px -8px var(--glow-color); }
          100% { transform: scale(1.0); opacity: 0.94; }
        }

        @keyframes badgePulse {
          0% { opacity: 0.85; }
          50% { opacity: 1; }
          100% { opacity: 0.85; }
        }

        /* FOOTER */
        .modal-footer {
          padding: 1.5rem 2.5rem 1.75rem;
          border-top: 1px solid rgba(241, 245, 249, 0.8);
          display: flex;
          justify-content: flex-end;
          gap: 0.85rem;
          background: #f8fafc;
        }

        .modal-btn-cancel {
          background: #fff;
          border: 1px solid #cbd5e1;
          padding: 0.7rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.92rem;
          color: #475569;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .modal-btn-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .modal-btn-save {
          background: linear-gradient(135deg, #007bbd 0%, #005a89 100%);
          border: none;
          padding: 0.7rem 1.8rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.92rem;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(0, 110, 167, 0.25);
        }
        .modal-btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 110, 167, 0.35);
        }
        .modal-btn-save:active {
          transform: translateY(0);
        }

        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(12px); }
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.25); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 640px) {
          .wearables-grid {
            grid-template-columns: 1fr;
            padding: 1.5rem 1.5rem;
            gap: 1.25rem;
          }
          .modal-header {
            padding: 1.5rem 1.5rem 1.25rem;
          }
          .modal-footer {
            padding: 1.25rem 1.5rem 1.5rem;
          }
          .modal-title {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
}
