'use client';

import Image from 'next/image';
import { useState } from 'react';

type WelcomeSectionProps = {
  onNavigate?: (menuItem: string) => void;
};

export default function WelcomeSection({ onNavigate }: WelcomeSectionProps) {
  const [isConnected] = useState(true);
  const imageVersion = '2';

  return (
    <div className="top-navigation-content">
      {/* Logo mit True Years Text - links */}
      <div className="top-nav-logo-section">
        <Image
          src="/images/logoneu.png"
          alt="True Years Logo"
          width={160}
          height={160}
          className="top-nav-logo"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Buttons in der Mitte: Reports | Lisa AI (Coaching) */}
      <div className="top-nav-buttons">
        <button
          className="top-nav-button"
          onClick={() => onNavigate?.('reports')}
        >
          Plan für heute
        </button>
        <button
          className="top-nav-button"
          onClick={() => onNavigate?.('coaching')}
        >
          Coaching starten
        </button>
      </div>

      {/* Wearable Icon und Profilbild - rechts */}
      <div className="top-nav-right-section">
        <div className="top-nav-wearable">
          <Image
            src={`/images/watch.png?v=${imageVersion}`}
            alt="Wearable Device"
            width={50}
            height={50}
            style={{ objectFit: 'contain' }}
            unoptimized
          />
          <span className={`top-nav-status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
        </div>
        <div className="top-nav-profile">
          <Image
            src="/images/woman3.png"
            alt="Profile"
            width={60}
            height={60}
            className="top-nav-profile-image"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}

