'use client';

interface NavItem {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    sublabel: 'Überblick',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'coaching',
    label: 'Assistenz',
    sublabel: 'Lisa AI',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    id: 'entwicklung',
    label: 'Entwicklung',
    sublabel: 'Tracker',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    id: 'insights',
    label: 'Insights',
    sublabel: 'Reels',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

interface BottomNavProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

export default function BottomNav({ activeItem, onItemClick }: BottomNavProps) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Hauptnavigation">
      {navItems.map(item => {
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            className={`bn-item ${isActive ? 'active' : ''}`}
            onClick={() => onItemClick(item.id)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="bn-icon-wrap">
              <span className={`bn-icon ${isActive ? 'active' : ''}`}>
                {item.icon}
              </span>
              {isActive && <span className="bn-dot" />}
            </span>
            <span className="bn-label">{item.label}</span>
          </button>
        );
      })}

      <style jsx>{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 500;
          height: calc(64px + env(safe-area-inset-bottom, 0px));
          padding-bottom: env(safe-area-inset-bottom, 0px);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-top: 1px solid rgba(68, 152, 202, 0.12);
          box-shadow: 0 -4px 24px rgba(0, 40, 80, 0.08);
          flex-direction: row;
          align-items: stretch;
        }

        /* Show on mobile ≤992px */
        @media (max-width: 992px) {
          .bottom-nav {
            display: flex;
          }
        }

        .bn-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 6px 4px 4px;
          transition: all 0.2s ease;
          color: #94a3b8;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        .bn-item:active {
          transform: scale(0.94);
        }

        .bn-item.active {
          color: #4498ca;
        }

        .bn-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 26px;
        }

        .bn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s;
        }

        .bn-icon.active {
          transform: translateY(-2px) scale(1.1);
          color: #4498ca;
          filter: drop-shadow(0 2px 6px rgba(68, 152, 202, 0.35));
        }

        .bn-dot {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4498ca;
          animation: dotPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes dotPop {
          from { transform: translateX(-50%) scale(0); }
          to   { transform: translateX(-50%) scale(1); }
        }

        .bn-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
          line-height: 1;
          transition: color 0.2s;
        }

        .bn-item.active .bn-label {
          color: #4498ca;
        }
      `}</style>
    </nav>
  );
}
