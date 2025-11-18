'use client';

interface DashboardTabsProps {
  activeTab: 'lifestyle' | 'biomarker';
  onTabChange: (tab: 'lifestyle' | 'biomarker') => void;
}

export default function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="dashboard-tabs">
      <button
        className={`dashboard-tab ${activeTab === 'lifestyle' ? 'active' : ''}`}
        onClick={() => onTabChange('lifestyle')}
      >
        <i className="bi bi-activity"></i>
        Lifestyle
      </button>
      <button
        className={`dashboard-tab ${activeTab === 'biomarker' ? 'active' : ''}`}
        onClick={() => onTabChange('biomarker')}
      >
        <i className="bi bi-droplet"></i>
        Biomarker
      </button>
    </div>
  );
}

