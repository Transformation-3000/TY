'use client';

export default function WeeklyPlan() {
  return (
    <div className="weekly-plan-container">
      <div className="weekly-plan-header">
        <h2>Was diese Woche wichtig ist</h2>
        <div className="week-progress">
          <div className="progress">
            <div className="progress-bar" style={{ width: '60%' }}></div>
          </div>
          <span>1 von 3 Aufgaben erledigt</span>
        </div>
      </div>
      <div className="weekly-actions-grid">
        <div className="action-card">
          <div className="action-icon completed">
            <i className="bi bi-water"></i>
          </div>
          <div className="action-content">
            <div className="action-title">Mehr Wasser trinken</div>
            <div className="action-description">Ziel: 2,5L täglich</div>
            <div className="action-status completed">Erledigt</div>
            <div className="action-footer">
              <div className="action-progress">2,5L / 2,5L heute</div>
              <button className="learn-more-btn">
                Mehr erfahren
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <i className="bi bi-activity"></i>
          </div>
          <div className="action-content">
            <div className="action-title">Mehr bewegen</div>
            <div className="action-description">Ziel: 10.000 Schritte täglich</div>
            <div className="action-status pending">Neu</div>
            <div className="action-footer">
              <div className="action-progress">8.547 / 10.000 Schritte</div>
              <button className="learn-more-btn">
                Mehr erfahren
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

