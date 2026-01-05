'use client';

import { useState } from 'react';
import '@/lib/chartConfig'; // Chart.js initialisieren
import WelcomeSection from '@/components/layout/WelcomeSection';
import Sidebar from '@/components/layout/Sidebar';
import WeeklyPlan from '@/components/layout/WeeklyPlan';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import SleepCard from '@/components/dashboard/SleepCard';
import RecoveryCard from '@/components/dashboard/RecoveryCard';
import StepsCard from '@/components/dashboard/StepsCard';
import NutritionCard from '@/components/dashboard/NutritionCard';
import FitnessCard from '@/components/dashboard/FitnessCard';
import MentalHealthCard from '@/components/dashboard/MentalHealthCard';
import BiomarkerDashboard from '@/components/dashboard/biomarker/BiomarkerDashboard';
import MicroHabitsPage from '@/components/microhabits/MicroHabitsPage';
import BlackBoardPage from '@/components/blackboard/BlackBoardPage';
import SettingsPage from '@/components/settings/SettingsPage';
import LongevityJourneyPage from '@/components/longevity/LongevityJourneyPage';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';
import ShopPage from '@/components/shop/ShopPage';
import VogelperspektivePage from '@/components/vogelperspektive/VogelperspektivePage';
import LiseAIPage from '@/components/lise-ai/LiseAIPage';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'lifestyle' | 'biomarker'>('lifestyle');
  const [activeMenuItem, setActiveMenuItem] = useState<string>('dashboard');

  return (
    <main>
      <div className="top-menu-bar">
        <Sidebar showOnlyLogo={true} />
        <WelcomeSection />
      </div>
      
      <div className="main-content">
        <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
        <div className="content-wrapper">
          {activeMenuItem === 'dashboard' && (
            <>
          <div className="dashboard-container">
            <WeeklyPlan />
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            {activeTab === 'lifestyle' && (
              <div className="dashboard-grid">
                <SleepCard />
                <RecoveryCard />
                <StepsCard />
                <NutritionCard />
                <FitnessCard />
                <MentalHealthCard />
              </div>
            )}
            
            {activeTab === 'biomarker' && (
              <div style={{ width: '100%' }}>
                <BiomarkerDashboard />
              </div>
            )}
          </div>
            </>
          )}

          {activeMenuItem === 'longevity-journey' && (
            <LongevityJourney7LevelsPage />
          )}

          {activeMenuItem === 'vogelperspektive' && (
            <VogelperspektivePage />
          )}

          {activeMenuItem === 'lisa-ai-voice-coach' && (
            <LiseAIPage />
          )}

          {activeMenuItem === 'black-board' && (
            <BlackBoardPage />
          )}

          {activeMenuItem === 'micro-habit-apps' && (
            <MicroHabitsPage />
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

          {activeMenuItem === 'settings' && (
            <SettingsPage />
          )}
        </div>
      </div>
    </main>
  );
}
