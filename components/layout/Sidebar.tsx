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
        /* ===== Profile chip ===== */
        .sb-profile {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 0.85rem 0.8rem;
          flex-shrink: 0;
        }
        .sb-avatar { position: relative; flex-shrink: 0; }
        .sb-avatar img {
          box-shadow: 0 2px 6px -2px rgba(15, 23, 42, 0.15);
        }
        .sb-avatar-online {
          position: absolute; bottom: 1px; right: 1px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #22c55e; border: 2px solid #fff;
          box-shadow: 0 0 0 1px rgba(34,197,94,0.3);
        }
        .sb-profile-text { flex: 1; min-width: 0; }
        .sb-profile-name {
          display: block;
          font-size: 0.85rem; font-weight: 600;
          color: #0f172a; line-height: 1.2;
          letter-spacing: -0.005em;
        }
        .sb-profile-sub {
          display: block;
          font-size: 0.7rem; color: #64748b;
          margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .sb-level-badge {
          flex-shrink: 0;
          font-size: 0.62rem; font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 0.2rem 0.4rem;
          letter-spacing: 0.04em;
        }

        /* ===== Divider ===== */
        .sb-divider {
          height: 1px;
          background: #edf0f5;
          margin: 0.2rem 0.85rem;
        }

        /* ===== Main nav ===== */
        .sb-nav {
          padding: 0.5rem 0.5rem 0.3rem;
          display: flex; flex-direction: column; gap: 0.1rem;
        }
        .sb-section-label {
          display: block;
          font-size: 0.58rem; font-weight: 600;
          color: #b4bdc8;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 0.3rem 0.55rem 0.4rem;
        }

        .sb-item {
          display: flex; align-items: center; gap: 0.6rem;
          width: 100%;
          padding: 0.5rem 0.6rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer; text-align: left;
          position: relative;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .sb-item:hover {
          background: #f6f8fb;
        }
        .sb-item--active {
          background: #f1f5f9 !important;
        }
        .sb-item--active .sb-item-label {
          color: #0f172a;
          font-weight: 600;
        }
        .sb-item--active .sb-item-icon {
          color: #4498ca;
          background: transparent;
        }

        .sb-item-icon {
          width: 26px; height: 26px; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: #94a3b8;
          background: transparent;
          flex-shrink: 0;
          transition: color 0.15s ease;
        }
        .sb-item:hover .sb-item-icon {
          color: #64748b;
        }

        .sb-item-text { flex: 1; min-width: 0; }
        .sb-item-label {
          display: block;
          font-size: 0.82rem; font-weight: 500;
          color: #475569; line-height: 1.2;
        }
        .sb-item:hover .sb-item-label { color: #1e293b; }

        .sb-item-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #4498ca;
          flex-shrink: 0;
        }

        /* ===== Secondary nav ===== */
        .sb-secondary {
          padding: 0.25rem 0.5rem 1rem;
          flex: 1;
        }
        .sb-sec-header {
          display: flex; align-items: center; gap: 0.5rem;
          width: 100%;
          padding: 0.45rem 0.6rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .sb-sec-header:hover { background: #f6f8fb; }
        .sb-sec-header :global(i:first-child) {
          color: #94a3b8 !important;
          font-size: 0.85rem !important;
        }
        .sb-sec-header:hover :global(i:first-child) { color: #64748b !important; }
        .sb-sec-label {
          font-size: 0.78rem; font-weight: 500;
          color: #64748b; flex: 1; text-align: left;
        }

        .sb-sec-items {
          padding-left: 1.75rem;
          display: flex; flex-direction: column; gap: 0.05rem;
          margin-bottom: 0.25rem;
          margin-top: 0.05rem;
        }
        .sb-sec-item {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 0.76rem; color: #64748b;
          text-align: left; width: 100%;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .sb-sec-item:hover {
          background: #f6f8fb;
          color: #0f172a;
        }
        .sb-sec-item.active {
          background: #f1f5f9;
          color: #0f172a;
          font-weight: 600;
        }

        .sb-footer { display: none; }
      `}</style>
    </div>
  );
}
