'use client';

import { useState } from 'react';

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  const tabs = [
    { id: 'quick-wins', label: 'Quick Wins', icon: 'bi-rocket-takeoff' },
    { id: 'coaching', label: 'Personal Trainer', icon: 'bi-person-circle' },
    { id: 'insights', label: 'Inspiration', icon: 'bi-stars' },
    { id: 'entwicklung', label: 'Entwicklung', icon: 'bi-graph-up-arrow' },
  ];

  return (
    <div className="bottom-nav">
      {tabs.map(tab => (
        <button 
          key={tab.id} 
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`bi ${tab.icon}${activeTab === tab.id ? '-fill' : ''}`}></i>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 72px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          padding: 0 1rem;
          padding-bottom: env(safe-area-inset-bottom); /* Support modern notches/home bars */
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          flex: 1;
          transition: all 0.2s ease;
          padding: 6px 0;
        }
        .nav-item i { 
          font-size: 1.45rem; 
          transition: transform 0.2s ease;
        }
        .nav-item:active i {
          transform: scale(0.9);
        }
        .nav-label { 
          font-size: 0.72rem; 
          font-weight: 700; 
          letter-spacing: -0.01em;
        }
        .nav-item.active { 
          color: #006ea7; 
        }
        .nav-item.active i {
          transform: scale(1.05);
        }

        @media (min-width: 993px) {
          .bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
