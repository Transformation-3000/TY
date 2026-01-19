'use client';

import { useState } from 'react';
import '@/lib/chartConfig'; // Chart.js initialisieren
import WelcomeSection from '@/components/layout/WelcomeSection';
import Sidebar from '@/components/layout/Sidebar';
import MicroHabitsPage from '@/components/microhabits/MicroHabitsPage';
import BlackBoardPage from '@/components/blackboard/BlackBoardPage';
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
import Image from 'next/image';

export default function Home() {
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');

  return (
    <main>
      <div className="top-menu-bar">
        <WelcomeSection />
      </div>
      
      <div className="main-content">
        <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
        <div className="content-wrapper">
          {activeMenuItem === 'dashboard' && (
            <VogelperspektivePage />
          )}

          {activeMenuItem === 'longevity-journey' && (
            <LongevityJourney7LevelsPage />
          )}

          {activeMenuItem === 'coaching' && (
            <Coaching2Page />
          )}

          {activeMenuItem === 'watchlist' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Watchlist</h2>
              <p>Science | Experts | Events</p>
            </div>
          )}

          {activeMenuItem === 'micro-habit-apps' && (
            <MicroHabitsPage />
          )}

          {activeMenuItem === 'reports' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Reports</h2>
              <p>Next Best Actions & Blocker</p>
            </div>
          )}

          {activeMenuItem === 'community' && (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>Community</h2>
              <p>Leitprinzipien | Top100 | Features</p>
            </div>
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

          {activeMenuItem === 'shop-supplements' && (
            <ShopPage category="supplements" />
          )}

          {activeMenuItem === 'shop-pflege' && (
            <ShopPage category="pflege" />
          )}

          {activeMenuItem === 'shop-regeneration' && (
            <ShopPage category="regeneration" />
          )}

          {activeMenuItem === 'shop-technologie' && (
            <ShopPage category="technologie" />
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

          {activeMenuItem === 'shop-daily-essentials' && (
            <ShopPage category="daily-essentials" />
          )}

          {activeMenuItem === 'shop-performance' && (
            <ShopPage category="performance" />
          )}

          {activeMenuItem === 'shop-recovery' && (
            <ShopPage category="recovery" />
          )}

          {activeMenuItem === 'shop-beauty' && (
            <ShopPage category="beauty" />
          )}

          {activeMenuItem === 'shop-tech' && (
            <ShopPage category="tech" />
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
        </div>
      </div>
    </main>
  );
}
