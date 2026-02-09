'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

// 01 STARTER - Unterbereiche
const starterMenuItems: MenuItem[] = [
  { id: 'dashboard', icon: 'bi-grid-3x3-gap', label: 'Dashboard' },
  { id: 'longevity-journey', icon: 'bi-compass', label: 'Journey' },
  { id: 'coaching', icon: 'bi-person-heart', label: 'Coaching' },
  { id: 'masterclasses', icon: 'bi-mortarboard', label: 'Masterclasses' },
  { id: 'watchlist', icon: 'bi-bookmark', label: 'Watchlist' },
  { id: 'micro-habit-apps', icon: 'bi-app', label: 'Apps' },
  { id: 'reports', icon: 'bi-file-earmark-text', label: 'Reports' },
  { id: 'community', icon: 'bi-people', label: 'Community' },
];

// 02 LAB - Unterbereiche
const labItems: MenuItem[] = [
  { id: 'zellalter-check', icon: 'bi-heart-pulse', label: 'Analyse Zellstatus' },
  { id: 'longevity-balance-check', icon: 'bi-clipboard2-pulse', label: 'Analyse Longevity Balance' },
  { id: 'integration-starter', icon: 'bi-link-45deg', label: 'Integration in Starter' },
  { id: 'expertengespraech', icon: 'bi-person-video3', label: 'Expertengespräch' },
];

// 03 SHOP - Kategorien
const shopItems: MenuItem[] = [
  { id: 'shop-daily-essentials', icon: 'bi-capsule-pill', label: 'Daily Essentials' },
  { id: 'shop-performance', icon: 'bi-lightning-charge', label: 'Performance' },
  { id: 'shop-recovery', icon: 'bi-moon-stars', label: 'Recovery' },
  { id: 'shop-beauty', icon: 'bi-moisture', label: 'Beauty' },
  { id: 'shop-tech', icon: 'bi-smartwatch', label: 'Tech' },
];

// 04 EINSTELLUNGEN - Unterbereiche
const settingsItems: MenuItem[] = [
  { id: 'settings-abos-profil', icon: 'bi-person-circle', label: 'Abos und Profil' },
  { id: 'settings-ziele', icon: 'bi-bullseye', label: 'Ziele & Präferenzen' },
  { id: 'settings-benachrichtigungen', icon: 'bi-bell', label: 'Benachrichtigungen' },
  { id: 'settings-tracking', icon: 'bi-graph-up', label: 'Tracking & Metriken' },
  { id: 'settings-datenschutz', icon: 'bi-shield-lock', label: 'Datenschutz & Sicherheit' },
  { id: 'settings-hilfe', icon: 'bi-question-circle', label: 'Hilfe & Rechtliches' },
];

interface SidebarProps {
  showOnlyLogo?: boolean;
  activeItem?: string | null;
  onItemClick?: (itemId: string) => void;
}

export default function Sidebar({ showOnlyLogo = false, activeItem, onItemClick }: SidebarProps) {
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>('dashboard');
  
  // Collapsed states für die aufklappbaren Sektionen - Standardmäßig nur Starter ausgeklappt
  const [collapsedSections, setCollapsedSections] = useState({
    starter: false, // false = ausgeklappt
    lab: true,      // true = eingeklappt
    shop: true,     // true = eingeklappt
    settings: true, // true = eingeklappt
  });
  
  const currentActiveItem = activeItem !== undefined ? activeItem : internalActiveItem;
  
  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    } else {
      setInternalActiveItem(itemId);
    }
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
        {/* 01 STARTER - Standardmäßig ausgeklappt */}
        <div className="menu-section">
          <div 
            className="menu-section-title menu-section-collapsible menu-section-main"
            onClick={() => toggleSection('starter')}
          >
            <i className={`bi ${collapsedSections.starter ? 'bi-chevron-right' : 'bi-chevron-down'} section-toggle-icon`}></i>
            01 STARTER
          </div>
          {!collapsedSections.starter && (
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
          )}
        </div>

        {/* 02 LAB - aufklappbar */}
        <div className="menu-section">
          <div 
            className="menu-section-title menu-section-collapsible menu-section-main"
            onClick={() => toggleSection('lab')}
          >
            <i className={`bi ${collapsedSections.lab ? 'bi-chevron-right' : 'bi-chevron-down'} section-toggle-icon`}></i>
            02 LAB
          </div>
          {!collapsedSections.lab && (
            <ul className="menu-list">
              {labItems.map((item) => (
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
          )}
        </div>

        {/* 03 SHOP - aufklappbar */}
        <div className="menu-section">
          <div 
            className="menu-section-title menu-section-collapsible menu-section-main"
            onClick={() => toggleSection('shop')}
          >
            <i className={`bi ${collapsedSections.shop ? 'bi-chevron-right' : 'bi-chevron-down'} section-toggle-icon`}></i>
            03 SHOP
          </div>
          {!collapsedSections.shop && (
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
            </ul>
          )}
        </div>

        {/* 04 EINSTELLUNGEN - aufklappbar */}
        <div className="menu-section">
          <div 
            className="menu-section-title menu-section-collapsible menu-section-main"
            onClick={() => toggleSection('settings')}
          >
            <i className={`bi ${collapsedSections.settings ? 'bi-chevron-right' : 'bi-chevron-down'} section-toggle-icon`}></i>
            04 EINSTELLUNGEN
          </div>
          {!collapsedSections.settings && (
            <ul className="menu-list">
              {settingsItems.map((item) => (
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
          )}
        </div>
      </div>
    </div>
  );
}
