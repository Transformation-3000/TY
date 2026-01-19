'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function WelcomeSection() {
  const [isConnected] = useState(true);
  const imageVersion = '2';

  const handlePlanHeute = () => {
    // TODO: Implementiere "Plan für heute" Funktionalität
    console.log('Plan für heute');
  };

  const handleCoachingStart = () => {
    // TODO: Implementiere "Coaching starten" Funktionalität
    console.log('Coaching starten');
  };

  return (
    <div className="top-navigation-content">
      {/* Logo mit True Years Text - links */}
      <div className="top-nav-logo-section">
        <Image
          src="/images/true logo 2.png"
          alt="True Years Logo"
          width={120}
          height={120}
          className="top-nav-logo"
          style={{ objectFit: 'contain' }}
        />
        <span className="top-nav-logo-text">
          <span className="top-nav-logo-text-bold">True</span> Years
        </span>
      </div>

      {/* Buttons in der Mitte */}
      <div className="top-nav-buttons">
        <button className="top-nav-button" onClick={handlePlanHeute}>
          Plan für heute
        </button>
        <button className="top-nav-button" onClick={handleCoachingStart}>
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
            src="/images/profilepic.png"
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

