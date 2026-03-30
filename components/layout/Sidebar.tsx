'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MainNavItem {
  id: string;
  icon: string;
  label: string;
  sublabel: string;
}

const mainNavItems: MainNavItem[] = [
  { id: 'dashboard', icon: 'bi-grid-3x3-gap-fill', label: 'Dashboard', sublabel: 'Dein Überblick' },
  { id: 'coaching', icon: 'bi-person-heart', label: 'Assistenz', sublabel: 'Lisa AI Coach' },
  { id: 'entwicklung', icon: 'bi-graph-up-arrow', label: 'Entwicklung', sublabel: 'Tracker & Trends' },
  { id: 'insights', icon: 'bi-play-circle-fill', label: 'Insights', sublabel: 'Reels & Wissen' },
];

interface SecondarySection {
  id: string;
  title: string;
  items: { id: string; icon: string; label: string }[];
}

const secondarySections: SecondarySection[] = [
  {
    id: 'lab',
    title: '02 LAB',
    items: [
      { id: 'zellalter-check', icon: 'bi-heart-pulse', label: 'Analyse Zellstatus' },
      { id: 'longevity-balance-check', icon: 'bi-clipboard2-pulse', label: 'Longevity Balance' },
      { id: 'expertengespraech', icon: 'bi-person-video3', label: 'Expertengespräch' },
    ],
  },
  {
    id: 'shop',
    title: '03 SHOP',
    items: [
      { id: 'shop', icon: 'bi-shop', label: 'Alle Produkte' },
      { id: 'shop-daily-essentials', icon: 'bi-capsule-pill', label: 'Daily Essentials' },
      { id: 'shop-performance-energy', icon: 'bi-lightning-charge', label: 'Performance + Energy' },
      { id: 'shop-schlaf-stress-erholung', icon: 'bi-moon-stars', label: 'Schlaf + Erholung' },
    ],
  },
  {
    id: 'settings',
    title: '04 EINSTELLUNGEN',
    items: [
      { id: 'settings-abos-profil', icon: 'bi-person-circle', label: 'Abos und Profil' },
      { id: 'settings-ziele', icon: 'bi-bullseye', label: 'Ziele & Präferenzen' },
      { id: 'settings-benachrichtigungen', icon: 'bi-bell', label: 'Benachrichtigungen' },
      { id: 'settings', icon: 'bi-shield-lock', label: 'Datenschutz' },
    ],
  },
];

interface SidebarProps {
  showOnlyLogo?: boolean;
  activeItem?: string | null;
  onItemClick?: (itemId: string) => void;
}

export default function Sidebar({ showOnlyLogo = false, activeItem, onItemClick }: SidebarProps) {
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>('dashboard');
  const [showSecondary, setShowSecondary] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const currentActiveItem = activeItem !== undefined ? activeItem : internalActiveItem;

  const handleItemClick = (itemId: string) => {
    if (onItemClick) {
      onItemClick(itemId);
    } else {
      setInternalActiveItem(itemId);
    }
    setShowSecondary(false);
  };

  if (showOnlyLogo) {
    return (
      <div className="sidebar-logo-container">
        <Image
          src="/images/logo.png"
          alt="TrueYears Logo"
          width={400}
          height={120}
          style={{ height: '100px', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div className="sidebar-navigation" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <div style={{ padding: '1rem 1rem 0.5rem', flexShrink: 0 }}>
        <Image
          src="/images/logo.png"
          alt="TrueYears"
          width={140}
          height={36}
          style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
        />
      </div>

      <div className="sidebar-menu-content" style={{ flex: 1, overflowY: 'auto' }}>
        {/* 4 Haupt-Navigationspunkte */}
        <div style={{ padding: '0.5rem 0.5rem 0' }}>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 0.5rem 0.4rem' }}>
            01 STARTER
          </div>
          {mainNavItems.map((item) => {
            const isActive = currentActiveItem === item.id ||
              (item.id === 'coaching' && currentActiveItem === 'lisa-test');
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.75rem',
                  borderRadius: '10px',
                  marginBottom: '0.2rem',
                  cursor: 'pointer',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(68,152,202,0.15) 0%, rgba(44,106,140,0.1) 100%)'
                    : 'transparent',
                  border: isActive ? '1.5px solid rgba(68,152,202,0.25)' : '1.5px solid transparent',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(68,152,202,0.06)';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px', borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #4498ca, #2c6a8c)',
                  }} />
                )}
                <div style={{
                  width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? 'linear-gradient(135deg, #4498ca, #2c6a8c)'
                    : 'rgba(100,116,139,0.08)',
                  transition: 'all 0.2s',
                }}>
                  <i className={`bi ${item.icon}`} style={{
                    fontSize: '1rem',
                    color: isActive ? '#fff' : '#64748b',
                  }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.82rem', fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#1a3a50' : '#475569', lineHeight: 1.2,
                  }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.2 }}>
                    {item.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Navigation Toggle */}
        <div style={{ padding: '0.75rem 0.5rem 0' }}>
          <button
            onClick={() => setShowSecondary(s => !s)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.4rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              MEHR
            </span>
            <i className={`bi ${showSecondary ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ fontSize: '0.65rem', color: '#94a3b8' }} />
          </button>

          {showSecondary && secondarySections.map((section) => (
            <div key={section.id} style={{ marginBottom: '0.25rem' }}>
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.35rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#b0bec5', letterSpacing: '0.06em' }}>
                  {section.title}
                </span>
                <i className={`bi ${expandedSection === section.id ? 'bi-chevron-up' : 'bi-chevron-right'}`} style={{ fontSize: '0.6rem', color: '#b0bec5' }} />
              </button>
              {expandedSection === section.id && (
                <ul className="menu-list" style={{ margin: 0 }}>
                  {section.items.map((item) => (
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
          ))}
        </div>
      </div>

      {/* Referral Card */}
      <div style={{
        margin: '0.5rem 0.5rem 0.75rem',
        padding: '0.65rem 0.85rem',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #e8f4ff 0%, #eaf6f0 100%)',
        border: '1.5px solid rgba(68,152,202,0.18)',
        boxShadow: '0 2px 10px rgba(68,152,202,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: 'linear-gradient(135deg,#4498ca,#2c6a8c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" />
              <line x1="12" y1="22" x2="12" y2="7" />
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1a3a50', lineHeight: 1.2 }}>Empfiehl TrueYears</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#4498ca', lineHeight: 1.2 }}>3 Monate kostenlos</div>
          </div>
        </div>
        <button style={{
          width: '100%', padding: '0.42rem 0', border: 'none', borderRadius: '8px',
          background: 'linear-gradient(135deg,#4498ca,#2c6a8c)', color: '#fff',
          fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em',
          boxShadow: '0 3px 8px rgba(68,152,202,0.22)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >
          Jetzt empfehlen →
        </button>
      </div>
    </div>
  );
}
