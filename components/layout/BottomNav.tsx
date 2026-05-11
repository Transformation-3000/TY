'use client';

import { useState } from 'react';

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) {
  const tabs = [
    { id: 'dashboard', label: 'Heute', icon: 'bi-house-door' },
    { id: 'longevity-journey', label: 'Wachstum', icon: 'bi-rocket-takeoff' },
    { id: 'coaching', label: 'Befähigung', icon: 'bi-person-badge' },
    { id: 'entwicklung', label: 'Entwicklung', icon: 'bi-graph-up-arrow' },
    { id: 'mehr', label: 'Mehr', icon: 'bi-three-dots' },
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
          height: 70px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid #e2e8f0;
          z-index: 1000;
          padding: 0 1rem;
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          flex: 1;
        }
        .nav-item i { font-size: 1.4rem; }
        .nav-label { font-size: 0.7rem; font-weight: 700; }
        .nav-item.active { color: #4498ca; }
      `}</style>
    </div>
  );
}
