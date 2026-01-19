'use client';

import { useState } from 'react';

interface Supplement {
  name: string;
  category: 'Essential' | 'Performance' | 'Recovery';
  description: string;
  goal: string;
  schedule: string;
  dosage: string;
  timing: string[];
  status: 'on' | 'off';
  benefits: string[];
  interactions?: string[];
  autoRefill?: boolean;
}

const supplements: Supplement[] = [
  {
    name: 'Omega-3 (EPA/DHA)',
    category: 'Essential',
    description: 'Entzündungsmodulation, Gehirn- & Herzfunktion.',
    goal: 'Anti-Inflammation & Neuroprotektion',
    schedule: 'täglich',
    dosage: '2.000 mg EPA/DHA',
    timing: ['Morgens', 'Abends'],
    status: 'on',
    benefits: ['Triglyceride ↓', 'CRP ↓', 'Kognitive Performance ↑'],
  },
  {
    name: 'Magnesium L-Threonat',
    category: 'Recovery',
    description: 'Schlafqualität & neuronale Regeneration.',
    goal: 'Schlafoptimierung & Nervensystem',
    schedule: 'Zyklisch (3 Wochen on / 1 Woche off)',
    dosage: '2.000 mg',
    timing: ['Abends'],
    status: 'on',
    benefits: ['Tiefschlaf ↑', 'Stressresilienz ↑'],
  },
  {
    name: 'Berberin + NAC Stack',
    category: 'Performance',
    description: 'Glukosemanagement, Leberfunktion und Detox.',
    goal: 'Metabolic Reset',
    schedule: '5 Tage on / 2 Tage off',
    dosage: '500 mg + 600 mg',
    timing: ['Vor Mahlzeiten'],
    status: 'off',
    benefits: ['Blutzucker ↓', 'Leberwerte stabil'],
    interactions: ['Nicht kombinieren mit Statinen > Rücksprache Medical Team'],
    autoRefill: true,
  },
  {
    name: 'Ubiquinol (CoQ10)',
    category: 'Performance',
    description: 'Mitochondriale Energieproduktion & Herzfunktion.',
    goal: 'Energie & Herz-Kreislauf',
    schedule: 'täglich',
    dosage: '200 mg',
    timing: ['Morgens'],
    status: 'on',
    benefits: ['VO2max ↑', 'Herzleistung ↑'],
  },
  {
    name: 'Vitamin D3 + K2',
    category: 'Essential',
    description: 'Immunsystem & Knochendichte, besonders in Wintermonaten.',
    goal: 'Immune & Bone Support',
    schedule: '5 Tage on / 2 Tage off',
    dosage: '4.000 IU + 200 mcg',
    timing: ['Morgens'],
    status: 'on',
    benefits: ['Immunsystem ↑', 'Hormone stabil'],
  },
  {
    name: 'Creatine Mono',
    category: 'Performance',
    description: 'ATP-Resynthese, Neuromuskuläre Performance & Brain Health.',
    goal: 'Leistung & Cognition',
    schedule: 'täglich',
    dosage: '5 g',
    timing: ['Post-Workout'],
    status: 'on',
    benefits: ['Power Output ↑', 'Neuroprotektion'],
  },
  {
    name: 'Ashwagandha KSM-66',
    category: 'Recovery',
    description: 'Cortisol-Management und Stressresilienz.',
    goal: 'Stresssystem Reset',
    schedule: 'Zyklisch (6 Wochen on / 2 Wochen off)',
    dosage: '600 mg',
    timing: ['Abends'],
    status: 'off',
    benefits: ['Cortisol ↓', 'Schlafqualität ↑'],
  },
  {
    name: 'Resveratrol + Spermidin',
    category: 'Performance',
    description: 'Sirtuin-Aktivierung und Zellrecycling (Autophagie).',
    goal: 'Longevity Pathways',
    schedule: '3 Tage on / 2 Tage off',
    dosage: '500 mg + 10 mg',
    timing: ['Morgens nüchtern'],
    status: 'on',
    benefits: ['mTOR + AMPK Balance', 'DNA Repair'],
  },
  {
    name: 'Electrolyte Stack',
    category: 'Recovery',
    description: 'Mineral Balance für Sauna, Kälte & High Output Tage.',
    goal: 'Hydration & Performance',
    schedule: 'bei Bedarf',
    dosage: '1 Scoop',
    timing: ['Vor Sauna', 'Vor Training'],
    status: 'on',
    benefits: ['Muskelkrämpfe ↓', 'Recovery ↑'],
  },
  {
    name: 'Lion’s Mane + L-Theanin',
    category: 'Performance',
    description: 'Neurogenese & Flowzustände, Fokus ohne Crash.',
    goal: 'Cognition & Flow',
    schedule: '4 Tage on / 3 Tage off',
    dosage: '1.000 mg + 200 mg',
    timing: ['Morgens'],
    status: 'on',
    benefits: ['NGF ↑', 'Fokus ↑'],
  },
];

export default function SupplementsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleCardClick = (name: string) => {
    setExpanded((prev) => (prev === name ? null : name));
  };

  return (
    <div className="supplements-container">
      <div className="supplements-header">
        <div>
          <h1>Deine Supplements</h1>
          <p>Aktuelle Stacks mit Einnahmezyklen, Timing und Wirkung</p>
        </div>
        <button className="supplement-add-btn">
          <i className="bi bi-plus-lg"></i>
          Neues Supplement
        </button>
      </div>

      <div className="supplement-shop-banner">
        <div>
          <h3>Supplement Shop</h3>
          <p>Individuelle Stacks, Medical Review & Auto-Reorder Services.</p>
        </div>
        <a href="https://shop.longevity.example" target="_blank" rel="noreferrer">
          Zum Longevity Shop <i className="bi bi-arrow-up-right"></i>
        </a>
      </div>

      <div className="supplements-grid">
        {supplements.map((supplement) => {
          const isExpanded = expanded === supplement.name;
          return (
            <div
              key={supplement.name}
              className={`supplement-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => handleCardClick(supplement.name)}
              role="button"
            >
              <div className="supplement-card-header">
                <div>
                  <div className="supplement-category">{supplement.category}</div>
                  <h2>{supplement.name}</h2>
                  <p>{supplement.description}</p>
                </div>
                <div className="supplement-card-tags">
                  {supplement.autoRefill && (
                    <span className="supplement-autorefill">
                      <i className="bi bi-arrow-repeat"></i>
                      Auto-Reorder
                    </span>
                  )}
                  <div className={`supplement-status ${supplement.status}`}>
                    {supplement.status === 'on' ? (
                      <>
                        <i className="bi bi-lightning-charge-fill"></i>
                        Aktiv
                      </>
                    ) : (
                      <>
                        <i className="bi bi-pause-circle-fill"></i>
                        Pausiert
                      </>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <>
                  <div className="supplement-meta-row">
                    <div>
                      <span className="meta-label">Ziel</span>
                      <span className="meta-value">{supplement.goal}</span>
                    </div>
                    <div>
                      <span className="meta-label">Dosierung</span>
                      <span className="meta-value">{supplement.dosage}</span>
                    </div>
                    <div>
                      <span className="meta-label">Schedule</span>
                      <span className="meta-value">{supplement.schedule}</span>
                    </div>
                  </div>

                  <div className="supplement-timing">
                    <span className="meta-label">Einnahmezeiten</span>
                    <div className="timing-chips">
                      {supplement.timing.map((slot) => (
                        <span key={slot} className="timing-chip">
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="supplement-benefits">
                    <h3>
                      <i className="bi bi-stars"></i>
                      Wirkung
                    </h3>
                    <ul>
                      {supplement.benefits.map((benefit) => (
                        <li key={benefit}>
                          <i className="bi bi-check-circle"></i>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {supplement.interactions && (
                    <div className="supplement-alert">
                      <i className="bi bi-exclamation-triangle-fill"></i>
                      {supplement.interactions.join(' • ')}
                    </div>
                  )}

                  <div className="supplement-actions">
                    <button className="supplement-action-btn" onClick={(e) => e.stopPropagation()}>
                      <i className="bi bi-pencil"></i>
                      Protokoll anpassen
                    </button>
                    <button className="supplement-action-btn ghost" onClick={(e) => e.stopPropagation()}>
                      <i className="bi bi-clock-history"></i>
                      Historie / Labs
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

