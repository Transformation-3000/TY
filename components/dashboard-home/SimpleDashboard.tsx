'use client';

import Image from 'next/image';
import styles from './SimpleDashboard.module.css';

type Props = {
  onNavigate?: (id: string) => void;
};

const today = () => {
  const d = new Date();
  const weekdays = ['SONNTAG', 'MONTAG', 'DIENSTAG', 'MITTWOCH', 'DONNERSTAG', 'FREITAG', 'SAMSTAG'];
  const months = ['JANUAR', 'FEBRUAR', 'MÄRZ', 'APRIL', 'MAI', 'JUNI', 'JULI', 'AUGUST', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DEZEMBER'];
  return `${weekdays[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function SimpleDashboard({ onNavigate }: Props) {
  const focusDays = [true, true, false, false];

  const recent = [
    { icon: 'bi-wind', label: '10 Min. Atmung', time: 'Heute' },
    { icon: 'bi-droplet-fill', label: 'Wasser 2,5 L', time: 'Heute' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* ========== LEFT COLUMN ========== */}
        <div className={styles.col}>
          <div>
            <div className={styles.dateLabel}>{today()}</div>
            <h1 className={styles.greeting}>
              Guten Tag, <span className={styles.greetingName}>Monique</span>
            </h1>
          </div>

          {/* Belohnungen */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>
                <i className="bi bi-gift-fill" />
              </span>
              <h3 className={styles.cardTitle}>Belohnungen</h3>
            </div>

            <div className={styles.rewardStats}>
              <div className={styles.rewardStat}>
                <i className={`bi bi-gem ${styles.diamond}`} style={{ fontSize: '1.8rem' }} />
                <span className={styles.rewardValue}>2</span>
                <span className={styles.rewardLabel}>Aktivitäten<br />erledigt</span>
              </div>
              <div className={styles.rewardStat}>
                <i className={`bi bi-gem ${styles.diamond}`} style={{ fontSize: '1.2rem' }} />
                <span className={styles.rewardValue}>14</span>
                <span className={styles.rewardLabel}>Diamanten<br />diese Woche</span>
              </div>
            </div>

            <div className={styles.rewardNote}>
              🎉 Du bist diese Woche richtig gut! Weiter so!
            </div>
          </div>

          {/* Wochen-Fokus */}
          <div className={`${styles.card} ${styles.pushBottom} ${styles.equalHeight}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>
                <i className="bi bi-bullseye" />
              </span>
              <h3 className={styles.cardTitle}>Wochen-Fokus</h3>
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
              <span>Denkblöckchen lohnt sich – schon kleine Gewohnheiten machen den Unterschied</span>
            </div>
          </div>
        </div>

        {/* ========== CENTER COLUMN ========== */}
        <div className={`${styles.col} ${styles.colCenter}`}>
          <div className={styles.profileWrap}>
            <Image
              src="/images/woman3.png"
              alt="Monique"
              width={260}
              height={260}
              className={styles.profileImg}
              priority
            />
          </div>

          {/* Tageskompass */}
          <div className={`${styles.card} ${styles.compass} ${styles.pushBottom} ${styles.equalHeight}`}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>
                <i className="bi bi-compass" />
              </span>
              <h3 className={styles.cardTitle}>Tageskompass</h3>
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
        </div>

        {/* ========== RIGHT COLUMN ========== */}
        <div className={styles.col}>
          {/* Aktivität eintragen */}
          <div className={styles.card}>
            <div className={styles.activityHeader}>
              <span className={styles.cardIcon} style={{ color: '#2563eb' }}>
                <i className="bi bi-person-walking" style={{ fontSize: '1.3rem' }} />
              </span>
              <div className={styles.activityHeaderText}>
                <h3 className={styles.cardTitle}>Aktivität eintragen</h3>
                <p className={styles.cardSubtitle}>Was tust du gerade für dich?</p>
              </div>
            </div>

            <div className={styles.activityInputWrap}>
              <input
                type="text"
                className={styles.activityInput}
                placeholder="Zum Beispiel: Spaziergang, Wasser oder Atmung …"
              />
              <button className={styles.iconBtn} aria-label="Diktieren">
                <i className="bi bi-mic-fill" />
              </button>
              <button className={`${styles.iconBtn} ${styles.iconBtnPrimary}`} aria-label="Hinzufügen">
                <i className="bi bi-plus-lg" />
              </button>
            </div>

            <div className={styles.sectionLabel}>
              <span>Zuletzt eingetragen</span>
              <a className={styles.sectionLabelLink}>Alle anzeigen</a>
            </div>
            <div className={styles.chipRow}>
              {recent.map((r) => (
                <div key={r.label} className={styles.recentChip}>
                  <span className={styles.recentChipTop}>
                    <i className={`bi ${r.icon} ${styles.chipIcon}`} />
                    {r.label}
                  </span>
                  <span className={styles.recentChipTime}>{r.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lina AI */}
          <div className={`${styles.linaCard} ${styles.pushBottom}`}>
            <div className={styles.linaImage}>
              <Image src="/images/lina-ai.png" alt="Lina AI" width={220} height={260} />
            </div>
            <div className={styles.linaContent}>
              <span className={styles.linaBadge}>
                <i className="bi bi-heart-fill" /> Lina AI
              </span>
              <h4 className={styles.linaTitle}>Ich bin hier für dich.<br />Wie geht es dir heute?</h4>
              <p className={styles.linaText}>
                Ein kurzer Check-in kann dir Klarheit, Leichtigkeit und neue Energie schenken.
              </p>
              <button
                className={styles.linaBtn}
                onClick={() => onNavigate?.('coaching')}
              >
                <i className="bi bi-heart" /> Daily Check-in starten
              </button>
              <div className={styles.linaLater}>Später daran erinnern</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
