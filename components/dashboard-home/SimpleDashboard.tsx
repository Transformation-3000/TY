'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './SimpleDashboard.module.css';

type Props = {
  onNavigate?: (id: string) => void;
};

const ACTIVITY_LIBRARY = [
  'Atemübung', 'Achtsamkeit', 'Aufwärmen',
  'Cardio', 'Dehnen',
  'Entspannung', 'Gehen', 'Joggen', 'Kaltduschen',
  'Krafttraining', 'Lesen', 'Meditation',
  'Pilates', 'Radfahren', 'Sauna',
  'Schwimmen', 'Spazieren', 'Wasser trinken',
  'Yoga', '10 Min. frische Luft',
].sort((a, b) => a.localeCompare(b, 'de'));

export default function SimpleDashboard({ onNavigate }: Props) {
  const [activityMode, setActivityMode] = useState<'default' | 'add' | 'voice'>('default');
  const [search, setSearch] = useState('');
  const focusDays = [true, true, false, false];

  const rewards = [
    { icon: 'bi-moon-stars-fill', label: 'Schlafrhythmus 2 Tage gehalten', points: 8 },
    { icon: 'bi-wind', label: '3× Atemübung diese Woche', points: 6 },
    { icon: 'bi-droplet-fill', label: 'Wasser-Ziel erreicht', points: 4 },
  ];
  const totalDiamonds = rewards.reduce((s, r) => s + r.points, 0);

  const recentShortcuts = [
    { icon: 'bi-wind', label: 'Atmung' },
    { icon: 'bi-droplet-fill', label: 'Wasser' },
    { icon: 'bi-person-walking', label: 'Spazieren' },
    { icon: 'bi-moon-stars-fill', label: 'Schlafen' },
    { icon: 'bi-heart-pulse', label: 'Yoga' },
  ];

  const filteredLibrary = ACTIVITY_LIBRARY.filter(
    (a) => !search.trim() || a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.grid4}>
        {/* ========== TOP-LEFT: Dein Tag (Kompass) ========== */}
        <div className={`${styles.card} ${styles.compass}`}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <i className="bi bi-compass" />
            </span>
            <h3 className={styles.cardTitle}>Dein Tag</h3>
          </div>

          <div className={styles.compassBody}>
            <div className={styles.compassSunWrap}>
              <span className={styles.compassSun}>☀️</span>
            </div>
            <div className={styles.compassText}>
              <p className={styles.compassQuestion}>Was ist heute wirklich wichtig?</p>
              <h4 className={styles.compassTitle}>Heute wichtig:<br />Regeneration</h4>
              <p className={styles.compassDesc}>
                Dein Körper hat gearbeitet – heute geht es um Erholung &amp; neue Energie.
              </p>
            </div>
          </div>

          <button type="button" className={styles.compassStep}>
            <span className={styles.compassStepBody}>
              <span className={styles.compassStepLabel}>Nächster Schritt</span>
              <span className={styles.compassStepValue}>10 Min. frische Luft</span>
            </span>
            <i className={`bi bi-chevron-right ${styles.compassStepChevron}`} />
          </button>
        </div>

        {/* ========== TOP-RIGHT: Deine Aktivitäten ========== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <i className="bi bi-lightning-charge-fill" />
            </span>
            <h3 className={styles.cardTitle}>Deine Aktivitäten</h3>
          </div>

          {activityMode === 'default' && (
            <>
              <div className={styles.activityActions}>
                <button
                  className={`${styles.actBtn} ${styles.actBtnPrimary}`}
                  onClick={() => setActivityMode('add')}
                  aria-label="Aktivität hinzufügen"
                >
                  <i className="bi bi-plus-lg" />
                  <span>Hinzufügen</span>
                </button>
                <button
                  className={styles.actBtn}
                  onClick={() => setActivityMode('voice')}
                  aria-label="Aktivität per Sprache"
                >
                  <i className="bi bi-mic-fill" />
                  <span>Sprechen</span>
                </button>
              </div>

              <div className={styles.sectionLabel}>
                <span>Letzte 5 Aktivitäten</span>
              </div>
              <div className={styles.shortcutGrid}>
                {recentShortcuts.map((r) => (
                  <button key={r.label} className={styles.shortcut} type="button">
                    <i className={`bi ${r.icon}`} />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {activityMode === 'add' && (
            <>
              <div className={styles.searchWrap}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="neue aktivität eintragen"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
                <i className={`bi bi-search ${styles.searchIcon}`} />
              </div>

              <div className={styles.activityList}>
                {filteredLibrary.map((a) => (
                  <button
                    key={a}
                    className={styles.activityListItem}
                    type="button"
                    onClick={() => {
                      setActivityMode('default');
                      setSearch('');
                    }}
                  >
                    <span>{a}</span>
                    <i className="bi bi-plus-circle" />
                  </button>
                ))}
              </div>

              <button
                className={styles.actBack}
                type="button"
                onClick={() => { setActivityMode('default'); setSearch(''); }}
              >
                <i className="bi bi-arrow-left" /> Zurück
              </button>
            </>
          )}

          {activityMode === 'voice' && (
            <div className={styles.voiceState}>
              <div className={styles.voiceIcon}>
                <span className={styles.voicePulse} />
                <span className={styles.voicePulse2} />
                <i className="bi bi-mic-fill" />
              </div>
              <p className={styles.voiceText}>Aktivität reinsprechen</p>
              <p className={styles.voiceHint}>Ich höre dir zu …</p>
              <button
                className={styles.actBack}
                type="button"
                onClick={() => setActivityMode('default')}
              >
                <i className="bi bi-arrow-left" /> Abbrechen
              </button>
            </div>
          )}
        </div>

        {/* ========== CENTER: Lisa AI Video + CTA im Kreis ========== */}
        <div className={styles.centerHero}>
          <div className={styles.linaRing}>
            <video
              src="/videos/lisa-avatar.mp4"
              autoPlay
              loop
              muted
              playsInline
              className={styles.linaImgRound}
            />

            {/* Overlay im unteren Bereich des Kreises */}
            <div className={styles.linaOverlay}>
              <button
                className={styles.linaHeroBtn}
                onClick={() => onNavigate?.('coaching')}
              >
                <i className="bi bi-heart" /> Daily starten
              </button>
            </div>
          </div>

        </div>

        {/* ========== BOTTOM-LEFT: Deine Woche ========== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <i className="bi bi-bullseye" />
            </span>
            <h3 className={styles.cardTitle}>Deine Woche</h3>
          </div>

          <h4 className={styles.focusTitle}>Schlafrhythmus stabilisieren</h4>
          <p className={styles.focusDesc}>Ruhiger schlafen, erholter aufwachen.</p>

          <div className={styles.focusProgress}>
            <div className={styles.focusDots}>
              {focusDays.map((done, i) => (
                <span key={i} className={`${styles.dot} ${done ? styles.dotDone : styles.dotOpen}`}>
                  {done && <i className="bi bi-check-lg" />}
                </span>
              ))}
            </div>
            <span className={styles.focusCount}>
              {focusDays.filter(Boolean).length} von {focusDays.length} Tagen<br />geschafft
            </span>
          </div>

          <div className={styles.focusHint}>
            <i className="bi bi-moon-stars-fill" />
            <span>Schon kleine Gewohnheiten machen den Unterschied</span>
          </div>
        </div>

        {/* ========== BOTTOM-RIGHT: Deine Diamanten ========== */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardIcon}>
              <i className="bi bi-gem" />
            </span>
            <h3 className={styles.cardTitle}>Deine Diamanten</h3>
            <span className={styles.rewardTotal}>
              <i className="bi bi-gem" /> {totalDiamonds}
            </span>
          </div>

          <ul className={styles.rewardList}>
            {rewards.map((r) => (
              <li key={r.label} className={styles.rewardItem}>
                <span className={styles.rewardItemIcon}>
                  <i className={`bi ${r.icon}`} />
                </span>
                <span className={styles.rewardItemLabel}>{r.label}</span>
                <span className={styles.rewardItemPoints}>+{r.points}</span>
              </li>
            ))}
          </ul>

          <div className={styles.rewardNote}>
            🎉 Du bist diese Woche richtig gut! Weiter so!
          </div>
        </div>
      </div>
    </div>
  );
}
