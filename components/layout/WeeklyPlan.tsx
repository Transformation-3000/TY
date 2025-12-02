'use client';

import { useState } from 'react';

export default function WeeklyPlan() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  return (
    <div className="weekly-plan-container">
      <div className="weekly-plan-header">
        <h2>Deine Impulse</h2>
        <div className="plan-tabs">
          <button
            className={`plan-tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            <i className="bi bi-calendar-day"></i>
            Heute
          </button>
          <button
            className={`plan-tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            <i className="bi bi-calendar-week"></i>
            Diese Woche
          </button>
        </div>
      </div>

      {activeTab === 'daily' && (
        <div className="daily-impulses">
          <div className="daily-intro">
            <p>3 kleine Impulse für heute – zusammen in unter 10 Minuten</p>
          </div>
          <div className="weekly-actions-grid">
            <div className="action-card impulse-card">
              <div className="action-icon completed">
                <i className="bi bi-sunrise"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Morgen-Routine starten</div>
                <div className="action-description">
                  Beginne den Tag mit Klarheit und Energie
                </div>
                <div className="action-status completed">✓ Erledigt</div>
                <div className="action-footer">
                  <div className="action-progress">
                    <span className="impulse-time">⏱ 3 Min</span>
                    <span className="impulse-benefit">→ Mehr Fokus am Morgen</span>
                  </div>
                  <button className="learn-more-btn">
                    Tipp ansehen
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="action-card impulse-card">
              <div className="action-icon">
                <i className="bi bi-wind"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Atemübung: Box Breathing</div>
                <div className="action-description">
                  Perfekt vor Meetings oder Fokus-Blocken
                </div>
                <div className="action-status pending">Jetzt machen</div>
                <div className="action-footer">
                  <div className="action-progress">
                    <span className="impulse-time">⏱ 2 Min</span>
                    <span className="impulse-benefit">→ Sofort mehr Ruhe</span>
                  </div>
                  <button className="learn-more-btn">
                    Jetzt starten
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="action-card impulse-card">
              <div className="action-icon">
                <i className="bi bi-droplet"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Hydration Check</div>
                <div className="action-description">
                  Trink jetzt ein großes Glas Wasser
                </div>
                <div className="action-status pending">Kleiner Impuls</div>
                <div className="action-footer">
                  <div className="action-progress">
                    <span className="impulse-time">⏱ 1 Min</span>
                    <span className="impulse-benefit">→ Bessere Konzentration</span>
                  </div>
                  <button className="learn-more-btn">
                    Warum wichtig?
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="action-card impulse-card">
              <div className="action-icon">
                <i className="bi bi-emoji-smile"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Kurzer Selbst-Check</div>
                <div className="action-description">
                  Wie geht es dir gerade? Körper & Geist
                </div>
                <div className="action-status pending">Reflexion</div>
                <div className="action-footer">
                  <div className="action-progress">
                    <span className="impulse-time">⏱ 2 Min</span>
                    <span className="impulse-benefit">→ Mehr Selbstwahrnehmung</span>
                  </div>
                  <button className="learn-more-btn">
                    Check-in starten
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'weekly' && (
        <div className="weekly-goals">
          <div className="weekly-intro">
            <p>3 Fokus-Bereiche für diese Woche – Schritt für Schritt</p>
          </div>
          <div className="weekly-actions-grid">
            <div className="action-card goal-card">
              <div className="action-icon completed">
                <i className="bi bi-water"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Hydration aufbauen</div>
                <div className="action-description">
                  Ziel: 2,5L Wasser täglich trinken
                </div>
                <div className="action-status completed">Woche 1 von 3</div>
                <div className="action-footer">
                  <div className="goal-progress">
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: '75%' }}></div>
                    </div>
                    <span>5 von 7 Tagen erreicht</span>
                  </div>
                  <button className="learn-more-btn">
                    Strategien ansehen
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="action-card goal-card">
              <div className="action-icon">
                <i className="bi bi-activity"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Bewegung steigern</div>
                <div className="action-description">
                  Ziel: 10.000 Schritte an 5 Tagen
                </div>
                <div className="action-status pending">In Arbeit</div>
                <div className="action-footer">
                  <div className="goal-progress">
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: '60%' }}></div>
                    </div>
                    <span>3 von 5 Tagen erreicht</span>
                  </div>
                  <button className="learn-more-btn">
                    Tipps & Tricks
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="action-card goal-card">
              <div className="action-icon">
                <i className="bi bi-moon-stars"></i>
              </div>
              <div className="action-content">
                <div className="action-title">Schlaf-Routine etablieren</div>
                <div className="action-description">
                  Ziel: 7-8h Schlaf + feste Schlafenszeit
                </div>
                <div className="action-status pending">Neu gestartet</div>
                <div className="action-footer">
                  <div className="goal-progress">
                    <div className="progress-bar-container">
                      <div className="progress-bar" style={{ width: '40%' }}></div>
                    </div>
                    <span>2 von 7 Tagen erreicht</span>
                  </div>
                  <button className="learn-more-btn">
                    Routine aufbauen
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
