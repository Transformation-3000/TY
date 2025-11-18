'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

const lifestyleItems: MenuItem[] = [
  { id: 'schlafleistung', icon: 'bi-moon-stars', label: 'Schlafleistung' },
  { id: 'recovery-score', icon: 'bi-heart-pulse', label: 'Recovery Score' },
  { id: 'tagesschritte', icon: 'bi-activity', label: 'Tagesschritte' },
  { id: 'ernährung', icon: 'bi-apple', label: 'Ernährung' },
  { id: 'fitness', icon: 'bi-lightning-charge', label: 'Fitness' },
  { id: 'mentale-gesundheit', icon: 'bi-emoji-smile', label: 'Mentale Gesundheit' },
];

const biomarkerItems: MenuItem[] = [
  { id: 'telomerlängenmessung', icon: 'bi-clipboard-data', label: 'Telomere' },
  { id: 'hormon-balance', icon: 'bi-droplet', label: 'Hormon-Balance' },
  { id: 'kognition', icon: 'bi-cpu', label: 'Kognition' },
  { id: 'entzündungen', icon: 'bi-shield-exclamation', label: 'Entzündungen' },
];

interface SidebarProps {
  showOnlyLogo?: boolean;
}

export default function Sidebar({ showOnlyLogo = false }: SidebarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isGoldUnlocked, setIsGoldUnlocked] = useState(false);

  if (showOnlyLogo) {
    return (
      <div className="sidebar-logo-container">
        <Image
          src="/images/logo.png"
          alt="Longevity Logo"
          width={400}
          height={120}
          style={{ height: '100px', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div className="sidebar-navigation">
      <div className="sidebar-menu-content">
        <div className="menu-section">
          <div className="menu-section-title">Lifestyle</div>
          <ul className="menu-list">
            {lifestyleItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-section">
          <div className="menu-section-title">
            Biomarker
            {!isGoldUnlocked && (
              <span className="gold-badge">Gold</span>
            )}
          </div>
          <ul className="menu-list">
            {biomarkerItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${activeItem === item.id ? 'active' : ''} ${!isGoldUnlocked ? 'locked' : ''}`}
                onClick={() => {
                  if (isGoldUnlocked) {
                    setActiveItem(item.id);
                  }
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
                {!isGoldUnlocked && (
                  <i 
                    className="bi bi-lock-fill lock-icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGoldUnlocked(true);
                    }}
                  ></i>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

