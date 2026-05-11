'use client';

import Image from 'next/image';

export default function WelcomeSection({ onNavigate }: { onNavigate?: (menuItem: string) => void }) {
  return (
    <div className="top-navigation-content">
      {/* Logo Left */}
      <div className="top-nav-logo-section" onClick={() => onNavigate?.('dashboard')} style={{ cursor: 'pointer' }}>
        <Image src="/images/logoneu.png" alt="True Years Logo" width={180} height={180} className="top-nav-logo" style={{ objectFit: 'contain' }} />
      </div>

      {/* 3 Areas Right */}
      <div className="top-nav-right-section">
        
        {/* AREA 1: WEARABLE / AKTIV */}
        <div className="header-area wearable-area">
          <span className="status-text-active">AKTIV</span>
          <div className="wearable-wrapper">
            <Image src="/images/whoop_v2.png" alt="Wearable" width={42} height={42} style={{ objectFit: 'contain' }} />
            <div className="status-dot-badge"></div>
          </div>
        </div>

        {/* AREA 2: PROFILE */}
        <div className="header-area profile-area" onClick={() => onNavigate?.('settings')}>
          <div className="profile-border-circle">
            <Image src="/images/woman_53_blonde.png" alt="Profile" width={48} height={48} className="profile-img-header" />
          </div>
        </div>

        {/* AREA 3: SETTINGS PILL */}
        <div className="header-area settings-area" onClick={() => onNavigate?.('settings')}>
          <div className="settings-pill">
            <i className="bi bi-gear-fill settings-icon-top"></i>
            <span className="settings-label-top">EINSTELLUNGEN</span>
          </div>
        </div>

      </div>

      <style jsx>{`
        .top-navigation-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 2rem;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          height: 80px;
        }

        .top-nav-right-section {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .header-area {
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .header-area:hover { transform: translateY(-1px); }

        /* AREA 1: WEARABLE */
        .wearable-area { gap: 0.8rem; }
        .status-text-active {
          font-size: 0.9rem;
          font-weight: 800;
          color: #7FD049;
          letter-spacing: 0.02em;
        }
        .wearable-wrapper {
          position: relative;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .status-dot-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 18px;
          height: 18px;
          background: #7FD049;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* AREA 2: PROFILE */
        .profile-border-circle {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          border: 2.5px solid #006EA7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          box-shadow: 0 4px 12px rgba(0, 110, 167, 0.15);
        }
        .profile-img-header {
          border-radius: 50%;
          object-fit: cover;
        }

        /* AREA 3: SETTINGS */
        .settings-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1.2rem;
          background: #fff;
          border: 1px solid #f1f5f9;
          border-radius: 100px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          gap: 2px;
          min-width: 110px;
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
      `}</style>
    </div>
  );
}
