'use client';

import { useState } from 'react';
import Image from 'next/image';

interface MainNavItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const NavIcon = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const mainNavItems: MainNavItem[] = [
  {
    id: 'dashboard',
    label: 'Startseite',
    sublabel: 'Überblick',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'coaching',
    label: 'Assistenz',
    sublabel: 'Lisa AI',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    id: 'entwicklung',
    label: 'Entwicklung',
    sublabel: 'Tracker & Trends',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    sublabel: 'Reels & Wissen',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
  },
];

interface SecondarySection {
  id: string;
  label: string;
  icon: string;
  items: { id: string; icon: string; label: string }[];
}

const secondarySections: SecondarySection[] = [
  {
    id: 'lab',
    label: 'Lab & Checks',
    icon: 'bi-heart-pulse',
    items: [
      { id: 'zellalter-check', icon: 'bi-heart-pulse', label: 'Analyse Zellstatus' },
      { id: 'longevity-balance-check', icon: 'bi-clipboard2-pulse', label: 'Longevity Balance' },
      { id: 'expertengespraech', icon: 'bi-person-video3', label: 'Expertengespräch' },
    ],
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: 'bi-bag',
    items: [
      { id: 'shop', icon: 'bi-shop', label: 'Alle Produkte' },
      { id: 'shop-daily-essentials', icon: 'bi-capsule-pill', label: 'Daily Essentials' },
      { id: 'shop-performance-energy', icon: 'bi-lightning-charge', label: 'Performance + Energy' },
      { id: 'shop-schlaf-stress-erholung', icon: 'bi-moon-stars', label: 'Schlaf + Erholung' },
    ],
  },
  {
    id: 'settings',
    label: 'Einstellungen',
    icon: 'bi-gear',
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const currentActiveItem = activeItem !== undefined ? activeItem : internalActiveItem;

  const handleItemClick = (itemId: string) => {
    if (onItemClick) onItemClick(itemId);
    else setInternalActiveItem(itemId);
  };

  if (showOnlyLogo) return <div className="sidebar-logo-container" />;

  return (
    <div className="sidebar-navigation">

      {/* User Profile Chip */}
      <div className="sb-profile">
        <div className="sb-avatar">
          <Image src="/images/woman3.png" alt="Profil" width={36} height={36}
            style={{ borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 10%', width: '36px', height: '36px' }} />
          <span className="sb-avatar-online" />
        </div>
        <div className="sb-profile-text">
          <span className="sb-profile-name">Hendrik</span>
          <span className="sb-profile-sub">Level 3 · 68% zu L4</span>
        </div>
        <div className="sb-level-badge">L3</div>
      </div>

      {/* Divider */}
      <div className="sb-divider" />

      {/* Main Nav */}
      <nav className="sb-nav">
        <span className="sb-section-label">Hauptbereich</span>
        {mainNavItems.map((item) => {
          const isActive = currentActiveItem === item.id ||
            (item.id === 'coaching' && currentActiveItem === 'lisa-test');
          return (
            <button
              key={item.id}
              className={`sb-item ${isActive ? 'sb-item--active' : ''}`}
              onClick={() => handleItemClick(item.id)}
            >
              <span className="sb-item-icon">
                <NavIcon>{item.icon}</NavIcon>
              </span>
              <span className="sb-item-text">
                <span className="sb-item-label">{item.label}</span>
                <span className="sb-item-sub">{item.sublabel}</span>
              </span>
              {isActive && <span className="sb-item-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="sb-divider" />

      {/* Secondary Nav */}
      <div className="sb-secondary">
        <span className="sb-section-label">Mehr</span>
        {secondarySections.map((section) => {
          const isOpen = expandedSection === section.id;
          return (
            <div key={section.id}>
              <button
                className="sb-sec-header"
                onClick={() => setExpandedSection(isOpen ? null : section.id)}
              >
                <i className={`bi ${section.icon}`} style={{ fontSize: '0.82rem', color: '#94a3b8' }} />
                <span className="sb-sec-label">{section.label}</span>
                <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}
                  style={{ fontSize: '0.65rem', color: '#b8c4cc', marginLeft: 'auto' }} />
              </button>
              {isOpen && (
                <div className="sb-sec-items">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      className={`sb-sec-item ${currentActiveItem === item.id ? 'active' : ''}`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <i className={`bi ${item.icon}`} style={{ fontSize: '0.8rem' }} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .sb-profile {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 1rem 1rem 0.85rem;
          flex-shrink: 0;
        }
        .sb-avatar { position: relative; flex-shrink: 0; }
        .sb-avatar-online {
          position: absolute; bottom: 1px; right: 1px;
          width: 9px; height: 9px; border-radius: 50%;
          background: #22c55e; border: 2px solid #fff;
        }
        .sb-profile-text { flex: 1; min-width: 0; }
        .sb-profile-name { display: block; font-size: 0.82rem; font-weight: 700; color: #0f172a; line-height: 1.2; }
        .sb-profile-sub { display: block; font-size: 0.65rem; color: #94a3b8; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sb-level-badge {
          flex-shrink: 0; font-size: 0.62rem; font-weight: 800;
          color: #4498ca; background: rgba(68,152,202,0.1);
          border: 1.5px solid rgba(68,152,202,0.2);
          border-radius: 6px; padding: 0.2rem 0.38rem;
          letter-spacing: 0.04em;
        }

        .sb-divider {
          height: 1px; background: rgba(15,23,42,0.06);
          margin: 0 1rem;
        }

        .sb-nav {
          padding: 0.6rem 0.6rem 0.4rem;
          display: flex; flex-direction: column; gap: 0.15rem;
        }
        .sb-section-label {
          display: block; font-size: 0.58rem; font-weight: 700;
          color: #b8c4cc; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.3rem 0.5rem 0.4rem;
        }

        .sb-item {
          display: flex; align-items: center; gap: 0.7rem;
          width: 100%; padding: 0.6rem 0.65rem;
          border-radius: 10px; border: none; background: transparent;
          cursor: pointer; text-align: left; position: relative;
          transition: background 0.15s, color 0.15s;
        }
        .sb-item:hover { background: rgba(68,152,202,0.06); }
        .sb-item--active { background: rgba(68,152,202,0.1) !important; }
        .sb-item--active .sb-item-label { color: #1a3a50; font-weight: 700; }
        .sb-item--active .sb-item-icon { color: #4498ca; background: rgba(68,152,202,0.14); }

        .sb-item-icon {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8; background: rgba(100,116,139,0.07);
          flex-shrink: 0; transition: all 0.15s;
        }
        .sb-item:hover .sb-item-icon { color: #4498ca; background: rgba(68,152,202,0.1); }

        .sb-item-text { flex: 1; min-width: 0; }
        .sb-item-label { display: block; font-size: 0.8rem; font-weight: 500; color: #475569; line-height: 1.2; }
        .sb-item-sub { display: block; font-size: 0.63rem; color: #b8c4cc; margin-top: 1px; }
        .sb-item:hover .sb-item-label { color: #1e3a50; }

        .sb-item-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: linear-gradient(135deg, #4498ca, #2c6a8c);
          flex-shrink: 0;
        }

        .sb-secondary {
          padding: 0.4rem 0.6rem;
          flex: 1;
        }
        .sb-sec-header {
          display: flex; align-items: center; gap: 0.55rem;
          width: 100%; padding: 0.45rem 0.5rem; border-radius: 8px;
          border: none; background: transparent; cursor: pointer;
          transition: background 0.15s;
        }
        .sb-sec-header:hover { background: rgba(68,152,202,0.05); }
        .sb-sec-label { font-size: 0.75rem; font-weight: 500; color: #64748b; flex: 1; text-align: left; }

        .sb-sec-items { padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.1rem; margin-bottom: 0.25rem; }
        .sb-sec-item {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.4rem 0.6rem; border-radius: 7px;
          border: none; background: transparent; cursor: pointer;
          font-size: 0.74rem; color: #64748b; text-align: left; width: 100%;
          transition: background 0.15s, color 0.15s;
        }
        .sb-sec-item:hover { background: rgba(68,152,202,0.06); color: #334155; }
        .sb-sec-item.active { background: rgba(68,152,202,0.08); color: #4498ca; font-weight: 600; }

        .sb-footer { display: none; }
      `}</style>
    </div>
  );
}
