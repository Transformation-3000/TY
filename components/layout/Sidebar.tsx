'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

const starterMenuItems: MenuItem[] = [
  { id: 'dashboard', icon: 'bi-grid-3x3-gap', label: 'Dashboard' },
  { id: 'longevity-journey', icon: 'bi-compass', label: 'Deine Longevity Reise' },
  { id: 'longevity-journey-2', icon: 'bi-triangle', label: 'Deine Longevity Reise 2' },
  { id: 'lisa-ai-voice-coach', icon: 'bi-mic', label: 'Lisa AI Voice-Coach' },
  { id: 'black-board', icon: 'bi-chat-square-text', label: 'Black Board' },
  { id: 'micro-habit-apps', icon: 'bi-app', label: 'Micro Habit Apps' },
];

const biomarkerItems: MenuItem[] = [
  { id: 'supplements', icon: 'bi-capsule-pill', label: 'Supplements' },
  { id: 'telomerlängenmessung', icon: 'bi-clipboard-data', label: 'Telomere' },
  { id: 'hormon-balance', icon: 'bi-droplet', label: 'Hormon-Balance' },
  { id: 'kognition', icon: 'bi-cpu', label: 'Kognition' },
  { id: 'entzündungen', icon: 'bi-shield-exclamation', label: 'Entzündungen' },
];

interface SidebarProps {
  showOnlyLogo?: boolean;
  activeItem?: string | null;
  onItemClick?: (itemId: string) => void;
}

export default function Sidebar({ showOnlyLogo = false, activeItem, onItemClick }: SidebarProps) {
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>('dashboard');
  const [isGoldUnlocked, setIsGoldUnlocked] = useState(false);
  
  const currentActiveItem = activeItem !== undefined ? activeItem : internalActiveItem;
  
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    } else {
      setInternalActiveItem(itemId);
    }
  };

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
          <div className="menu-section-title">
            Starter Paket
          </div>
          <ul className="menu-list">
            {starterMenuItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${currentActiveItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-section">
          <div className="menu-section-title">
            Gold Paket
            {!isGoldUnlocked && (
              <i className="bi bi-plus-circle gold-info-icon"></i>
            )}
          </div>
          <ul className="menu-list">
            {biomarkerItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${currentActiveItem === item.id ? 'active' : ''} ${!isGoldUnlocked ? 'locked' : ''}`}
                onClick={() => {
                  if (isGoldUnlocked) {
                    handleItemClick(item.id);
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
        <div className="menu-section menu-section-bottom">
          <ul className="menu-list">
            <li
              className={`menu-item ${currentActiveItem === 'settings' ? 'active' : ''}`}
              onClick={() => handleItemClick('settings')}
            >
              <i className="bi bi-gear"></i>
              <span>Einstellungen</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

