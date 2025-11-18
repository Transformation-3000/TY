'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function WelcomeSection() {
  const [steps, setSteps] = useState(3421);
  const [stressLevel, setStressLevel] = useState(23);
  const [isLive, setIsLive] = useState(true);

  // Simuliere Live-Updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(prev => prev + Math.floor(Math.random() * 3));
      setStressLevel(prev => {
        const newValue = prev + (Math.random() > 0.5 ? 1 : -1);
        return Math.max(10, Math.min(50, newValue));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-section">
      <div className="profile-section">
        <div className="profile-image">
          <Image
            src="/images/profilepic.png"
            alt="María's Profile"
            width={80}
            height={80}
            className="rounded-full"
            style={{ objectFit: 'cover', boxShadow: '0 4px 12px rgba(68, 152, 202, 0.2)' }}
          />
        </div>
        <div className="tracking-stats">
          <div className="tracking-item">
            <div className="tracking-label">
              <i className="bi bi-activity"></i>
              <span>Schritte</span>
            </div>
            <div className="tracking-value">{steps.toLocaleString()}</div>
          </div>
          <div className="tracking-item">
            <div className="tracking-label">
              <i className="bi bi-heart-pulse"></i>
              <span>Stresslevel</span>
            </div>
            <div className="tracking-value">{stressLevel}%</div>
          </div>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

