'use client';

import { useState } from 'react';

interface MainNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: MainNavItem[] = [
  { id: 'dashboard', label: 'Heute', icon: <i className="bi bi-house-door-fill"></i> },
  { id: 'quick-wins', label: 'Quick Wins', icon: <i className="bi bi-rocket-takeoff-fill"></i> },
  { id: 'coaching', label: 'Personal Trainer', icon: <i className="bi bi-person-circle"></i> },
  { id: 'insights', label: 'Inspiration', icon: <i className="bi bi-stars"></i> },
  { id: 'entwicklung', label: 'Entwicklung', icon: <i className="bi bi-graph-up-arrow"></i> },
  { id: 'mehr', label: 'Mehr', icon: <i className="bi bi-three-dots"></i> },
  { id: 'referral', label: 'Empfehlen', icon: <i className="bi bi-gift-fill"></i>, special: true },
];

export default function Sidebar({ activeItem, onItemClick }: { activeItem?: string | null, onItemClick?: (id: string) => void }) {
  const [internalActiveItem, setInternalActiveItem] = useState<string | null>('dashboard');
  const currentActiveItem = activeItem !== undefined ? activeItem : internalActiveItem;

  return (
    <div className="sidebar-navigation">
      <nav className="sb-nav">
        {mainNavItems.map((item) => {
          const isActive = currentActiveItem === item.id;
          return (
            <button key={item.id} className={`sb-item ${isActive ? 'sb-item--active' : ''} ${item.special ? 'sb-item--special' : ''}`} onClick={() => onItemClick?.(item.id)}>
              <span className="sb-item-icon">{item.icon}</span>
              <div className="sb-item-content">
                <span className="sb-item-label">{item.label}</span>
                {item.special && <span className="sb-item-sub">1 Gratismonat</span>}
              </div>
              {isActive && <span className="sb-item-dot" />}
            </button>
          );
        })}
      </nav>

      <div className="sb-footer">
        {/* Footer is now empty or used for other things */}
      </div>

      <style jsx>{`
        .sidebar-navigation { display: flex; flex-direction: column; height: 100%; padding: 1.5rem 0.5rem 1.5rem; }
        .nav-items {
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.2rem 1.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #64748b;
          position: relative;
        }

        .nav-item i {
          font-size: 1.5rem;
        }

        .nav-item span {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.01em;
        }
        .sb-nav { display: flex; flex-direction: column; flex: 1; }
        .sb-item {
          display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem 0.75rem calc(1.5rem - 5px);
          border-radius: 0; border: none; background: transparent; cursor: pointer;
          color: #64748b; transition: all 0.2s; position: relative;
          border-bottom: 2px solid #e2eaf3;
          white-space: nowrap;
        }
        .sb-item:last-child { border-bottom: none; }
        .sb-item:hover { 
          background: #e0f0ff; 
          color: #006EA7 !important;
        }
        .sb-item:hover .sb-item-icon { color: #006EA7; }
        .sb-item--active { background: #d1e5f5 !important; color: #1e293b !important; border-radius: 12px; margin: 4px; border-bottom: none !important; }
        .sb-item--active .sb-item-icon { color: #006EA7; }
        .sb-item-icon { font-size: 1.5rem; display: flex; align-items: center; justify-content: center; width: 32px; flex-shrink: 0; }
        .sb-item-content { display: flex; flex-direction: column; align-items: flex-start; }
        .sb-item-label { font-size: 0.95rem; font-weight: 700; }
        .sb-item-sub { font-size: 0.65rem; font-weight: 800; color: #006EA7; text-transform: uppercase; margin-top: -2px; }
        .sb-item-dot { width: 4px; height: 4px; border-radius: 50%; background: #006EA7; position: absolute; right: 12px; }
        
        .sb-item--special { background: #004D77 !important; margin-top: 1rem; border-radius: 12px; border-bottom: none !important; color: #fff !important; }
        .sb-item--special .sb-item-icon { color: #fff; }
        .sb-item--special .sb-item-label { color: #fff; }
        .sb-item--special .sb-item-sub { color: rgba(255, 255, 255, 0.8); }
        
        .sb-footer { margin-top: auto; padding-top: 1rem; }
      `}</style>
    </div>
  );
}
