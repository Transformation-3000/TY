'use client';

import { useState, useEffect } from 'react';
import '@/lib/chartConfig'; // Chart.js initialisieren
import WelcomeSection from '@/components/layout/WelcomeSection';
import Sidebar from '@/components/layout/Sidebar';
import MicroHabitsPage from '@/components/microhabits/MicroHabitsPage';
import BlackBoardPage from '@/components/blackboard/BlackBoardPage';
import InsightsPage from '@/components/insights/InsightsPage';
import EntwicklungPage from '@/components/entwicklung/EntwicklungPage';
import SettingsPage from '@/components/settings/SettingsPage';
import LongevityJourneyPage from '@/components/longevity/LongevityJourneyPage';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';
import ShopPage from '@/components/shop/ShopPage';
import VogelperspektivePage from '@/components/vogelperspektive/VogelperspektivePage';
import Coaching2Page from '@/components/lisa-ai/Coaching2Page';
import TrueYearsPrinzipienPage from '@/components/true-years/TrueYearsPrinzipienPage';
import ZellalterCheckPage from '@/components/checks/ZellalterCheckPage';
import ZellalterSimulationPage from '@/components/checks/ZellalterSimulationPage';
import LongevityBalanceCheckPage from '@/components/checks/LongevityBalanceCheckPage';
import DatenintegrationPage from '@/components/service/DatenintegrationPage';
import ExpertengespraechPage from '@/components/service/ExpertengespraechPage';
import MasterclassesPage from '@/components/masterclasses/MasterclassesPage';
import CommunityPage from '@/components/community/CommunityPage';
import ReportsPage from '@/components/reports/ReportsPage';
import MehrPage from '@/components/mehr/MehrPage';
import WachstumPage from '@/components/wachstum/WachstumPage';
import InspirationPage from '@/components/inspiration/InspirationPage';
import BiomarkerDashboard from '@/components/dashboard/biomarker/BiomarkerDashboard';
import BottomNav from '@/components/layout/BottomNav';
import Image from 'next/image';

export default function Dashboard() {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autoStartSessionType, setAutoStartSessionType] = useState<string | null>(null);

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
        <WelcomeSection 
          onNavigate={navigate} 
          onToggleSidebar={() => setSidebarOpen(o => !o)} 
          sidebarOpen={sidebarOpen} 
        />
      </div>

      <div className="main-content">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar activeItem={activeMenuItem} onItemClick={navigate} />
        <div className="content-wrapper">
          {activeMenuItem === 'dashboard' && (
            <VogelperspektivePage onNavigate={navigate} />
          )}

          {activeMenuItem === 'quick-wins' && (
            <WachstumPage 
              onNavigate={navigate} 
              onStartLisaDaily={() => {
                setAutoStartSessionType('daily');
                setActiveMenuItem('coaching');
              }} 
              onStartSimulation={() => setActiveMenuItem('zellalter-simulation')}
              onStartAutophagy={() => setActiveMenuItem('autophagy-timer')}
            />
          )}

          {activeMenuItem === 'longevity-journey' && (
            <WachstumPage 
              onNavigate={navigate} 
              onStartLisaDaily={() => {
                setAutoStartSessionType('daily');
                setActiveMenuItem('coaching');
              }} 
              onStartSimulation={() => setActiveMenuItem('zellalter-simulation')}
              onStartAutophagy={() => setActiveMenuItem('autophagy-timer')}
            />
          )}

          {activeMenuItem === 'coaching' && (
            <Coaching2Page 
              onOpenAvatar={() => setActiveMenuItem('lisa-test')} 
              autoStartSession={autoStartSessionType}
              clearAutoStart={() => setAutoStartSessionType(null)}
            />
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
            <InspirationPage />
          )}

          {activeMenuItem === 'entwicklung' && (
            <EntwicklungPage onStartSimulation={() => setActiveMenuItem('zellalter-simulation')} />
          )}

          {activeMenuItem === 'zellalter-simulation' && (
            <ZellalterSimulationPage onBack={() => setActiveMenuItem('quick-wins')} />
          )}

          {activeMenuItem === 'autophagy-timer' && (
            <div style={{ padding: '2.5rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.03)', maxWidth: '900px', margin: '0 auto' }}>
              <button 
                onClick={() => setActiveMenuItem('quick-wins')} 
                style={{ background: 'none', border: 'none', color: '#006ea7', cursor: 'pointer', fontWeight: 700, fontSize: '1.05rem', float: 'left', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                ← Zurück zu Do it yourself
              </button>
              <div style={{ clear: 'both' }} />
              <h2 style={{ fontSize: '2rem', fontWeight: 850, color: '#1c2b3e', marginBottom: '1rem' }}>Autophagie & Fasten-Timer</h2>
              <p style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
                Konfiguriere dein Fastenfenster (z.B. 16:8 oder 18:6) und verfolge live, ab wann dein Körper die zelluläre Müllentsorgung (Autophagie) aktiviert, Wachstumshormone ausschüttet und die Zellerneuerung anspringt.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '220px', height: '220px', borderRadius: '50%', border: '4px solid #4498ca', background: '#f0f9ff', color: '#4498ca', fontSize: '3rem', fontWeight: 900, marginBottom: '2.5rem' }}>
                16:8
              </div>
              <div>
                <button style={{ background: '#006ea7', color: 'white', border: 'none', borderRadius: '100px', padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 110, 167, 0.25)' }}>
                  Fasten-Timer starten
                </button>
              </div>
            </div>
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



          {activeMenuItem === 'mehr' && (
            <MehrPage onNavigate={navigate} />
          )}
        </div>
      </div>
      <BottomNav activeTab={activeMenuItem} onTabChange={navigate} />
    </main>
  );
}
