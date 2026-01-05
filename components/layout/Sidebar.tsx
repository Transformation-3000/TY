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
  { id: 'longevity-journey', icon: 'bi-compass', label: 'Longevity Journey' },
  { id: 'vogelperspektive', icon: 'bi-eye', label: 'Vogelperspektive' },
  { id: 'lisa-ai-voice-coach', icon: 'bi-mic', label: 'Lisa AI' },
  { id: 'black-board', icon: 'bi-chat-square-text', label: 'Black Board' },
  { id: 'micro-habit-apps', icon: 'bi-app', label: 'Micro Habit Apps' },
];

const labItems: MenuItem[] = [
  { id: 'metabo', icon: 'bi-clipboard-data', label: 'Metabo' },
  { id: 'proteoage', icon: 'bi-droplet', label: 'ProteoAge' },
];

const shopItems: MenuItem[] = [
  { id: 'shop-supplements', icon: 'bi-capsule-pill', label: 'Supplements' },
  { id: 'shop-pflege', icon: 'bi-moisture', label: 'Pflege' },
  { id: 'shop-regeneration', icon: 'bi-moon-stars', label: 'Regeneration' },
  { id: 'shop-technologie', icon: 'bi-smartwatch', label: 'Technologie' },
];

interface SidebarProps {
  showOnlyLogo?: boolean;
  activeItem?: string | null;
  onItemClick?: (itemId: string) => void;
}

export default function Sidebar({ showOnlyLogo = false, activeItem, onItemClick }: SidebarProps) {
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>('dashboard');
  const [isLabUnlocked, setIsLabUnlocked] = useState(false);
  
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
            LAB
            {!isLabUnlocked && (
              <i className="bi bi-plus-circle gold-info-icon"></i>
            )}
          </div>
          <ul className="menu-list">
            {labItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${currentActiveItem === item.id ? 'active' : ''} ${!isLabUnlocked ? 'locked' : ''}`}
                onClick={() => {
                  if (isLabUnlocked) {
                    handleItemClick(item.id);
                  }
                }}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
                {!isLabUnlocked && (
                  <i 
                    className="bi bi-lock-fill lock-icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLabUnlocked(true);
                    }}
                  ></i>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="menu-section menu-section-bottom">
          <div className="menu-section-title">
            SHOP
          </div>
          <ul className="menu-list">
            {shopItems.map((item) => (
              <li
                key={item.id}
                className={`menu-item ${currentActiveItem === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item.id)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </li>
            ))}
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

