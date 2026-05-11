'use client';

import { useState, useEffect } from 'react';
import '@/lib/chartConfig'; // Chart.js initialisieren
import WelcomeSection from '@/components/layout/WelcomeSection';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import MicroHabitsPage from '@/components/microhabits/MicroHabitsPage';
import BlackBoardPage from '@/components/blackboard/BlackBoardPage';
import InsightsPage from '@/components/insights/InsightsPage';
import EntwicklungPage from '@/components/entwicklung/EntwicklungPage';
import SettingsPage from '@/components/settings/SettingsPage';
import LongevityJourneyPage from '@/components/longevity/LongevityJourneyPage';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';
import ShopPage from '@/components/shop/ShopPage';
import VogelperspektivePage from '@/components/vogelperspektive/VogelperspektivePage';
import Coaching2Page from '@/components/lise-ai/Coaching2Page';
import TrueYearsPrinzipienPage from '@/components/true-years/TrueYearsPrinzipienPage';
import ZellalterCheckPage from '@/components/checks/ZellalterCheckPage';
import LongevityBalanceCheckPage from '@/components/checks/LongevityBalanceCheckPage';
import DatenintegrationPage from '@/components/service/DatenintegrationPage';
import ExpertengespraechPage from '@/components/service/ExpertengespraechPage';
import MasterclassesPage from '@/components/masterclasses/MasterclassesPage';
import CommunityPage from '@/components/community/CommunityPage';
import ReportsPage from '@/components/reports/ReportsPage';
import MehrPage from '@/components/mehr/MehrPage';
import WachstumPage from '@/components/wachstum/WachstumPage';
import Image from 'next/image';

export default function Dashboard() {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 992) setSidebarOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigate = (id: string) => {
    if (id === 'website') {
      window.location.href = '/';
      return;
    }
    setActiveMenuItem(id);
    setSidebarOpen(false);
  };

  return (
    <main className={sidebarOpen ? 'sidebar-open' : ''}>
      <div className="top-menu-bar">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(o => !o)} aria-label="Menü">
          <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>
        <WelcomeSection onNavigate={navigate} />
      </div>

      <div className="main-content">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar activeItem={activeMenuItem} onItemClick={navigate} />
        <div className="content-wrapper content-with-bottom-nav">
          {activeMenuItem === 'dashboard' && (
            <VogelperspektivePage />
          )}

          {activeMenuItem === 'longevity-journey' && (
            <WachstumPage />
          )}

          {activeMenuItem === 'coaching' && (
            <Coaching2Page onOpenAvatar={() => setActiveMenuItem('lisa-test')} />
          )}

          {activeMenuItem === 'lisa-test' && (
            <div className="lisa-test-container">
              <button
                type="button"
                className="lisa-test-back"
                onClick={() => setActiveMenuItem('coaching')}
              >
                ← Zurück zum Personal Assistant
              </button>
              <iframe
                src="https://embed.liveavatar.com/v1/95a58601-22c4-4146-be6a-6423a8406cd6"
                allow="microphone"
                title="LiveAvatar Embed"
                style={{ aspectRatio: '16/9', width: '100%', maxWidth: '900px', border: 'none', borderRadius: '12px' }}
              />
            </div>
          )}

          {activeMenuItem === 'masterclasses' && (
            <MasterclassesPage />
          )}

          {activeMenuItem === 'watchlist' && (
            <BlackBoardPage />
          )}

          {activeMenuItem === 'insights' && (
            <InsightsPage />
          )}

          {activeMenuItem === 'entwicklung' && (
            <EntwicklungPage />
          )}

          {activeMenuItem === 'micro-habit-apps' && (
            <MicroHabitsPage />
          )}

          {activeMenuItem === 'reports' && (
            <ReportsPage />
          )}

          {activeMenuItem === 'community' && (
            <CommunityPage />
          )}

          {activeMenuItem === 'zellalter-check' && (
            <ZellalterCheckPage />
          )}

          {activeMenuItem === 'longevity-balance-check' && (
            <LongevityBalanceCheckPage />
          )}

          {activeMenuItem === 'metabo' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Metabo Test</h2>
              <p>Metabolische Biomarker-Analyse</p>
            </div>
          )}

          {activeMenuItem === 'proteoage' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>ProteoAge Test</h2>
              <p>Protein-basierte Altersbestimmung</p>
            </div>
          )}

          {activeMenuItem === 'shop' && (
            <ShopPage onNavigate={setActiveMenuItem} />
          )}

          {activeMenuItem === 'shop-daily-essentials' && (
            <ShopPage category="daily-essentials" />
          )}

          {activeMenuItem === 'shop-performance-energy' && (
            <ShopPage category="performance-energy" />
          )}

          {activeMenuItem === 'shop-schlaf-stress-erholung' && (
            <ShopPage category="schlaf-stress-erholung" />
          )}

          {activeMenuItem === 'shop-hautcremes' && (
            <ShopPage category="hautcremes" />
          )}

          {activeMenuItem === 'shop-high-tech' && (
            <ShopPage category="high-tech" />
          )}

          {activeMenuItem === 'datenintegration' && (
            <DatenintegrationPage />
          )}

          {activeMenuItem === 'integration-starter' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Integration in Starter</h2>
              <p>Datenintegration in Starter-Bereich</p>
            </div>
          )}

          {activeMenuItem === 'expertengespraech' && (
            <ExpertengespraechPage />
          )}

          {activeMenuItem === 'settings' && (
            <SettingsPage />
          )}

          {activeMenuItem === 'settings-abos-profil' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Abos und Profil</h2>
            </div>
          )}

          {activeMenuItem === 'settings-ziele' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Ziele & Präferenzen</h2>
            </div>
          )}

          {activeMenuItem === 'settings-benachrichtigungen' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Benachrichtigungen</h2>
            </div>
          )}

          {activeMenuItem === 'settings-tracking' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Tracking & Metriken</h2>
            </div>
          )}

          {activeMenuItem === 'settings-datenschutz' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Datenschutz & Sicherheit</h2>
            </div>
          )}

          {activeMenuItem === 'settings-hilfe' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Hilfe & Rechtliches</h2>
            </div>
          )}

          {activeMenuItem === 'mehr' && (
            <MehrPage onNavigate={navigate} />
          )}
        </div>
      </div>
      <BottomNav activeItem={activeMenuItem} onItemClick={navigate} />

      {/* Sticky Referral Button */}
      <button className="sticky-referral-btn" title="True Years empfehlen">
        <i className="bi bi-gift-fill sticky-referral-icon"></i>
        <span className="sticky-referral-text">
          <span className="sticky-referral-main">Empfehle mich weiter</span>
          <span className="sticky-referral-sub">Erhalte 1 Gratismonat</span>
        </span>
      </button>
    </main>
  );
}
