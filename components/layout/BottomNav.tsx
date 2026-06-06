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
          <i className={`bi ${tab.icon}`}></i>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          padding: 0;
          padding-bottom: env(safe-area-inset-bottom); /* Support modern notches/home bars */
          overflow: hidden;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.2rem;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          flex: 1;
          height: 100%;
          border-radius: 0;
          transition: all 0.2s ease;
          padding: 0;
          margin: 0;
        }
        .nav-item i { 
          font-size: 1.5rem; 
          color: #64748b;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .nav-item:active i {
          transform: scale(0.9);
        }
        .nav-label { 
          font-size: calc(0.72rem + 2pt); 
          font-weight: 700; 
          letter-spacing: -0.01em;
          transition: color 0.2s ease;
        }
        .nav-item.active { 
          background: #006ea7 !important;
          color: white !important;
        }
        .nav-item.active i {
          color: white !important;
          transform: scale(1.05);
        }
        .nav-item.active .nav-label {
          color: white !important;
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
