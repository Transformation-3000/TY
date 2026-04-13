'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type WelcomeSectionProps = {
  onNavigate?: (menuItem: string) => void;
};

const WEARABLES = [
  {
    id: 'whoop',
    name: 'Whoop Armband',
    icon: 'bi-activity',
    color: '#1a1a2e',
    accent: '#e94560',
    description: 'Kontinuierliches HRV-Tracking',
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    icon: 'bi-circle',
    color: '#2d2d2d',
    accent: '#c9a84c',
    description: 'Schlaf & Recovery Analyse',
  },
  {
    id: 'apple-watch',
    name: 'Apple Watch',
    icon: 'bi-watch',
    color: '#1c1c1e',
    accent: '#0071e3',
    description: 'Health & Fitness Tracking',
  },
  {
    id: 'garmin',
    name: 'Garmin Watch',
    icon: 'bi-compass',
    color: '#003087',
    accent: '#00b2a9',
    description: 'GPS & Sport Performance',
  },
];

const CONNECT_STEPS = [
  { label: 'Suche Gerät …', icon: 'bi-bluetooth' },
  { label: 'Verbinde …', icon: 'bi-arrow-repeat' },
  { label: 'Verbunden!', icon: 'bi-check-circle-fill' },
];

export default function WelcomeSection({ onNavigate }: WelcomeSectionProps) {
  const [isConnected] = useState(true);
  const [showWearableDialog, setShowWearableDialog] = useState(false);
  const [selectedWearable, setSelectedWearable] = useState<string | null>('apple-watch');
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connectStep, setConnectStep] = useState<number>(0); // 1,2,3
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const imageVersion = '2';

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };

  const handleWearableSelect = (id: string) => {
    clearTimers();
    setConnectingId(id);
    setConnectStep(1);
    timersRef.current.push(setTimeout(() => setConnectStep(2), 1400));
    timersRef.current.push(setTimeout(() => setConnectStep(3), 2800));
    timersRef.current.push(setTimeout(() => {
      setSelectedWearable(id);
      setShowWearableDialog(false);
      setConnectingId(null);
      setConnectStep(0);
    }, 4000));
  };

  const handleDialogClose = () => {
    clearTimers();
    setShowWearableDialog(false);
    setConnectingId(null);
    setConnectStep(0);
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <>
      <div className="top-navigation-content">
        {/* Logo - links */}
        <div className="top-nav-logo-section">
          <Image
            src="/images/logoneu.png"
            alt="True Years Logo"
            width={160}
            height={160}
            className="top-nav-logo"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Buttons in der Mitte */}
        <div className="top-nav-buttons">
          <button
            className="top-nav-button top-nav-button--daily"
            onClick={() => onNavigate?.('coaching')}
          >
            <i className="bi bi-play-circle-fill" style={{ marginRight: '0.4rem' }}></i>
            Daily starten
          </button>
          <button
            className="top-nav-button top-nav-button--weekly"
            onClick={() => onNavigate?.('coaching')}
          >
            <i className="bi bi-calendar-event" style={{ marginRight: '0.4rem' }}></i>
            Nächstes Weekly: Di, 21.07.26, 17:30–17:40
          </button>
        </div>

        {/* Wearable Icon und Profilbild - rechts */}
        <div className="top-nav-right-section">
          <button
            className="top-nav-wearable top-nav-wearable--btn"
            onClick={() => setShowWearableDialog(true)}
            title="Wearable auswählen"
          >
            <Image
              src={`/images/watch.png?v=${imageVersion}`}
              alt="Wearable Device"
              width={50}
              height={50}
              style={{ objectFit: 'contain' }}
              unoptimized
            />
            <span className={`top-nav-status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          </button>
          <div className="top-nav-profile">
            <Image
              src="/images/woman3.png"
              alt="Profile"
              width={60}
              height={60}
              className="top-nav-profile-image"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Wearable Selection Dialog – rendered at body level via portal */}
      {showWearableDialog && typeof document !== 'undefined' && createPortal(
        <div className="wearable-dialog-overlay" onClick={connectingId ? undefined : handleDialogClose}>
          <div className="wearable-dialog" onClick={e => e.stopPropagation()}>
            <div className="wearable-dialog-header">
              <h2 className="wearable-dialog-title">
                {connectingId ? WEARABLES.find(w => w.id === connectingId)?.name : 'Bitte schließe dein Wearable an.'}
              </h2>
              {!connectingId && (
                <button className="wearable-dialog-close" onClick={handleDialogClose}>
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {/* ── Connecting Screen ── */}
            {connectingId ? (() => {
              const w = WEARABLES.find(x => x.id === connectingId)!;
              return (
                <div className="wearable-connecting">
                  <div
                    className="wearable-connecting-badge"
                    style={{ background: `linear-gradient(135deg, ${w.color} 0%, ${w.accent}44 100%)` }}
                  >
                    <i className={`bi ${w.icon}`} style={{ color: w.accent, fontSize: '3.5rem' }} />
                    {/* Bluetooth pulse rings */}
                    <span className="bt-ring bt-ring-1" style={{ borderColor: w.accent }} />
                    <span className="bt-ring bt-ring-2" style={{ borderColor: w.accent }} />
                    <span className="bt-ring bt-ring-3" style={{ borderColor: w.accent }} />
                  </div>

                  <div className="wearable-steps">
                    {CONNECT_STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const done = connectStep > stepNum;
                      const active = connectStep === stepNum;
                      return (
                        <div key={i} className={`wearable-step ${active ? 'wearable-step--active' : ''} ${done ? 'wearable-step--done' : ''}`}>
                          <span className="wearable-step-icon">
                            <i className={`bi ${done ? 'bi-check-circle-fill' : step.icon} ${active && step.icon === 'bi-arrow-repeat' ? 'spin' : ''}`} />
                          </span>
                          <span className="wearable-step-label">{step.label}</span>
                          {active && connectStep < 3 && (
                            <span className="wearable-step-dots">
                              <span /><span /><span />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })() : (
              /* ── Device Grid ── */
              <div className="wearable-dialog-grid">
                {WEARABLES.map(w => (
                  <button
                    key={w.id}
                    className={`wearable-card ${selectedWearable === w.id ? 'wearable-card--selected' : ''}`}
                    onClick={() => handleWearableSelect(w.id)}
                  >
                    <div
                      className="wearable-card-image"
                      style={{ background: `linear-gradient(135deg, ${w.color} 0%, ${w.accent}33 100%)` }}
                    >
                      <i className={`bi ${w.icon} wearable-card-icon`} style={{ color: w.accent }} />
                      {selectedWearable === w.id && (
                        <span className="wearable-card-check">
                          <i className="bi bi-check-circle-fill" />
                        </span>
                      )}
                    </div>
                    <div className="wearable-card-body">
                      <span className="wearable-card-name">{w.name}</span>
                      <span className="wearable-card-desc">{w.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      , document.body)}
    </>
  );
}

