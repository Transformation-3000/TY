'use client';

import React, { useState, useEffect } from 'react';

interface CardioSimulationPageProps {
  onBack: () => void;
}

interface WeekData {
  vo2: number;
  msg: string;
  color: string;
}

export default function CardioSimulationPage({ onBack }: CardioSimulationPageProps) {
  // Inputs (Mischpult ganz unten)
  const [simZone2, setSimZone2] = useState(90);
  const [simHIIT, setSimHIIT] = useState(1);
  const [simRegen, setSimRegen] = useState(70);

  // Manual & Playback state
  const [simWeek, setSimWeek] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lisaReport, setLisaReport] = useState<string | null>(null);
  const [activeFactors, setActiveFactors] = useState<string[]>([]);
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const [userWeight, setUserWeight] = useState<number>(80);
  const [targetWeight, setTargetWeight] = useState<number>(76);
  const [selectedInfoFactor, setSelectedInfoFactor] = useState<string>('zone2');
  const [currentZone2, setCurrentZone2] = useState<number>(45);
  const [targetZone2, setTargetZone2] = useState<number>(150);
  const [currentHIIT, setCurrentHIIT] = useState<number>(0);
  const [targetHIIT, setTargetHIIT] = useState<number>(2);
  const [currentSleep, setCurrentSleep] = useState<number>(6.0);
  const [targetSleep, setTargetSleep] = useState<number>(8.0);

  // Simulation B States (Decisions on Mount Longevitus)
  const [simWeekB, setSimWeekB] = useState(0);
  const [isSimulatingB, setIsSimulatingB] = useState(false);
  const [vo2B, setVo2B] = useState(35.0);
  const [lastChangeB, setLastChangeB] = useState<number | null>(null);
  const [decisionB, setRawDecisionB] = useState<{
    week: number;
    title: string;
    options: { key: string; text: string; change: number; effect: () => void; logText: string; type: 'good' | 'bad' }[];
  } | null>(null);

  const setDecisionB = (val: typeof decisionB) => {
    if (val) {
      // Shuffle options and re-assign key 'A' and 'B'
      const shuffledOptions = [...val.options].sort(() => Math.random() - 0.5);
      shuffledOptions[0] = { ...shuffledOptions[0], key: 'A' };
      shuffledOptions[1] = { ...shuffledOptions[1], key: 'B' };
      setRawDecisionB({ ...val, options: shuffledOptions });
    } else {
      setRawDecisionB(null);
    }
  };
  const [historyB, setHistoryB] = useState<{ week: number; type: 'good' | 'bad' | 'neutral'; text: string }[]>([]);

  const startSimulationB = () => {
    setSimWeekB(0);
    setVo2B(35.0);
    setDecisionB(null);
    setLastChangeB(null);
    setHistoryB([{ week: 0, type: 'neutral', text: 'W0: Start bei VO2max 35,0' }]);
    setIsSimulatingB(true);
  };

  const handleDecisionChoice = (effect: () => void, logText: string, type: 'good' | 'bad', week: number, changeVal: number) => {
    effect();
    setLastChangeB(changeVal);
    setHistoryB((prev) => {
      if (prev.some((h) => h.week === week)) {
        return prev;
      }
      return [
        { week, type, text: logText },
        ...prev
      ];
    });
    setDecisionB(null);
    setSimWeekB(week);
  };

  useEffect(() => {
    if (!isSimulatingB || decisionB !== null) return;

    if (simWeekB >= 12) {
      setIsSimulatingB(false);
      return;
    }

    const nextWeek = simWeekB + 1;

    // Check for decision points
    if (nextWeek === 1) {
      setDecisionB({
        week: 1,
        title: '🏃‍♂️ Das Ausdauer-Fundament: Trainierst du deine Grundlagenausdauer bei einem entspannten Tempo (Zone 2 – du kannst dich noch locker unterhalten) oder läufst du immer so schnell du kannst?',
        options: [
          {
            key: 'A',
            text: 'Entspanntes Grundlagen-Laufen (stärkt das Herz und verbessert die Fettverbrennung effektiv)',
            change: 0.4,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.4)),
            logText: 'W1: Zone 2 priorisiert (+0,4)',
            type: 'good'
          },
          {
            key: 'B',
            text: 'Immer am Limit laufen (macht schnell müde und bringt weniger Ausdauer-Grundlage)',
            change: -0.1,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.1)),
            logText: 'W1: Grauzonen-Training gewählt (-0,1)',
            type: 'bad'
          }
        ]
      });
      return;
    }

    if (nextWeek === 2) {
      setDecisionB({
        week: 2,
        title: '⚡ Ausdauerschub durch Intervalle: Machst du ein strukturiertes Intervalltraining (4 Minuten intensiv laufen, 3 Minuten locker gehen, 4-mal wiederholt) oder läufst du einfach planlos drauflos?',
        options: [
          {
            key: 'A',
            text: 'Kurze, planlose Sprints ohne Pause (verbrennt nur Energie, stärkt aber das Herz kaum)',
            change: -0.15,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.15)),
            logText: 'W2: Planlose Sprints gewählt (-0,15)',
            type: 'bad'
          },
          {
            key: 'B',
            text: '4x4-Minuten-Intervalle zur maximalen Stärkung der Pumpleistung deines Herzens',
            change: 0.5,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.5)),
            logText: 'W2: 4x4-Intervalle durchgeführt (+0,5)',
            type: 'good'
          }
        ]
      });
      return;
    }

    if (nextWeek === 3) {
      setDecisionB({
        week: 3,
        title: '🥦 Energie vor dem Training: Trainierst du bei langen, lockeren Einheiten ab und zu mit nüchternem Magen, um den Fettstoffwechsel anzukurbeln, oder isst du vorher immer einen süßen Energieriegel?',
        options: [
          {
            key: 'A',
            text: 'Training ohne vorherige Zucker-Zufuhr zur Gewöhnung des Körpers an Fettverbrennung',
            change: 0.3,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.3)),
            logText: 'W3: Nüchtern-Training genutzt (+0,3)',
            type: 'good'
          },
          {
            key: 'B',
            text: 'Ständige Zucker-Zufuhr direkt vor dem Sport (blockiert die Fettverbrennung)',
            change: -0.15,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.15)),
            logText: 'W3: Zuckerzufuhr vor Sport (-0,15)',
            type: 'bad'
          }
        ]
      });
      return;
    }

    if (nextWeek === 4) {
      setDecisionB({
        week: 4,
        title: '📈 Auf den Körper hören: Deine Fitness-Uhr zeigt einen erhöhten Ruhepuls und du fühlst dich schlapp. Ziehst du dein hartes Training trotzdem durch oder ruhst du dich aus?',
        options: [
          {
            key: 'A',
            text: 'Trotz starker Erschöpfung das harte Intervalltraining voll durchdrücken',
            change: -0.2,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.2)),
            logText: 'W4: Überlastung riskiert (-0,2)',
            type: 'bad'
          },
          {
            key: 'B',
            text: 'Einen Gang zurückschalten und dem Körper einen Tag aktive Erholung gönnen',
            change: 0.5,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.5)),
            logText: 'W4: Erholung vorgezogen (+0,5)',
            type: 'good'
          }
        ]
      });
      return;
    }

    if (nextWeek === 5) {
      setDecisionB({
        week: 5,
        title: '🫁 Richtige Atmung: Achtest du beim Sport auf eine tiefe Bauchatmung durch die Nase oder atmest du flach und schnell durch den Mund?',
        options: [
          {
            key: 'A',
            text: 'Bewusste, tiefe Nasen- und Bauchatmung zur optimalen Sauerstoffversorgung deiner Muskeln',
            change: 0.4,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.4)),
            logText: 'W5: Atemtechnik optimiert (+0,4)',
            type: 'good'
          },
          {
            key: 'B',
            text: 'Flache Mundatmung (führt schneller zu Seitenstechen, Atemnot und Erschöpfung)',
            change: -0.2,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.2)),
            logText: 'W5: Flache Atmung genutzt (-0,2)',
            type: 'bad'
          }
        ]
      });
      return;
    }

    if (nextWeek === 6) {
      setDecisionB({
        week: 6,
        title: '🩸 Transportmittel für Sauerstoff: Achtest du in deiner Ernährung auf ausreichend Eisen und Vitamin C (z. B. Haferflocken mit Beeren), damit dein Blut Sauerstoff optimal transportieren kann?',
        options: [
          {
            key: 'A',
            text: 'Eisenwerte ignorieren und wenig frisches Gemüse, Nüsse oder Vollkorn essen',
            change: -0.4,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.4)),
            logText: 'W6: Eisenmangel ignoriert (-0,4)',
            type: 'bad'
          },
          {
            key: 'B',
            text: 'Ernährung gezielt mit eisenreichen Lebensmitteln und Vitamin C optimieren',
            change: 0.6,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.6)),
            logText: 'W6: Eisenaufnahme verbessert (+0,6)',
            type: 'good'
          }
        ]
      });
      return;
    }

    if (nextWeek === 7) {
      setDecisionB({
        week: 7,
        title: '🛌 Schlaf zur Erholung: Sorgst du vor dem Schlafengehen für ein kühles, dunkles Zimmer ohne Handylicht, um deinen Tiefschlaf zu verbessern, oder schaust du bis zum Einschlafen Serien?',
        options: [
          {
            key: 'A',
            text: 'Bildschirmfreie Routine vor dem Schlafen für die beste nächtliche Regeneration',
            change: 0.35,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.35)),
            logText: 'W7: Schlafhygiene optimiert (+0,35)',
            type: 'good'
          },
          {
            key: 'B',
            text: 'Bis spät in die Nacht fernsehen und am Smartphone tippen (stört die Erholung des Herzens)',
            change: -0.15,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.15)),
            logText: 'W7: Schlaf gestört (-0,15)',
            type: 'bad'
          }
        ]
      });
      return;
    }

    if (nextWeek === 8) {
      setDecisionB({
        week: 8,
        title: '🥤 Natürlicher Leistungsbooster: Trinkst du vor dem Sport Rote-Bete-Saft, der deine Gefäße weitet und dem Körper hilft, den Sauerstoff effizienter zu nutzen, oder verzichtest du darauf?',
        options: [
          {
            key: 'A',
            text: 'Keine Beachtung schenken und stattdessen zuckerhaltige Energydrinks trinken',
            change: -0.3,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.3)),
            logText: 'W8: Auf künstliche Wachmacher gesetzt (-0,3)',
            type: 'bad'
          },
          {
            key: 'B',
            text: 'Rote-Bete-Saft vor intensiven Einheiten zur natürlichen Steigerung der Ausdauer nutzen',
            change: 0.7,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.7)),
            logText: 'W8: Rote-Bete-Saft genutzt (+0,7)',
            type: 'good'
          }
        ]
      });
      return;
    }

    if (nextWeek === 9) {
      setDecisionB({
        week: 9,
        title: '❄️ Kälte zur Regeneration: Springst du direkt nach dem Sport ins eiskalte Wasser (was den Trainingseffekt blockieren kann) oder nutzt du Kälte erst am Tag danach zur Erholung?',
        options: [
          {
            key: 'A',
            text: 'Eisbad erst am Regenerationstag nutzen (mindestens 24 Stunden nach dem Training)',
            change: 0.3,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.3)),
            logText: 'W9: Kälte richtig getaktet (+0,3)',
            type: 'good'
          },
          {
            key: 'B',
            text: 'Sofort nach dem Training ins Eisbad springen (unterdrückt den Muskel-Aufbaureiz des Körpers)',
            change: -0.1,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.1)),
            logText: 'W9: Zu frühes Eisbad genutzt (-0,1)',
            type: 'bad'
          }
        ]
      });
      return;
    }

    if (nextWeek === 10) {
      setDecisionB({
        week: 10,
        title: '🚴 Rhythmus beim Laufen/Radfahren: Achtest du auf eine hohe, gleichmäßige Schritt- oder Trittfrequenz (z. B. kurze, schnelle Schritte beim Laufen) oder machst du lange, anstrengende Riesenschritte?',
        options: [
          {
            key: 'A',
            text: 'Mit schweren, langsamen Schritten stampfen (ermüdet die Muskeln extrem schnell)',
            change: -0.2,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.2)),
            logText: 'W10: Unökonomischer Rhythmus (-0,2)',
            type: 'bad'
          },
          {
            key: 'B',
            text: 'Kurze, schnelle Schritte machen (schont Gelenke und spart Muskelkraft für mehr Ausdauer)',
            change: 0.5,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.5)),
            logText: 'W10: Schrittfrequenz optimiert (+0,5)',
            type: 'good'
          }
        ]
      });
      return;
    }

    if (nextWeek === 11) {
      setDecisionB({
        week: 11,
        title: '🔥 Sauna nach dem Sport: Gehst du nach einem leichten Training ab und zu in die Sauna, damit dein Körper lernt, mehr Blutvolumen für den Sauerstofftransport zu bilden, oder verzichtest du darauf?',
        options: [
          {
            key: 'A',
            text: 'Saunagang nach dem Training zur Erhöhung des Blutvolumens und besseren Durchblutung nutzen',
            change: 0.5,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.5)),
            logText: 'W11: Post-Workout Sauna genutzt (+0,5)',
            type: 'good'
          },
          {
            key: 'B',
            text: 'Sofort kalt abduschen und Hitze-Erholung komplett meiden',
            change: -0.25,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.25)),
            logText: 'W11: Hitze-Effekt ungenutzt (-0,25)',
            type: 'bad'
          }
        ]
      });
      return;
    }

    if (nextWeek === 12) {
      setDecisionB({
        week: 12,
        title: '🏔️ Die Test-Vorbereitung: Wie gestaltest du die letzte Woche vor deinem Ausdauertest, um am Testtag deine maximale Leistung abrufen zu können?',
        options: [
          {
            key: 'A',
            text: 'Bis zum letzten Tag voll durchtrainieren (du gehst mit müden Beinen in den Test)',
            change: -0.1,
            effect: () => setVo2B((prev) => Math.max(30.0, prev - 0.1)),
            logText: 'W12: Keine Erholung vor Test (-0,1)',
            type: 'bad'
          },
          {
            key: 'B',
            text: 'Trainingsmenge halbieren, aber kurze, schnelle Sprints einbauen (Körper erholt sich, bleibt aber wach)',
            change: 0.7,
            effect: () => setVo2B((prev) => Math.min(48.5, prev + 0.7)),
            logText: 'W12: Richtiges Tapering genutzt (+0,7)',
            type: 'good'
          }
        ]
      });
      return;
    }
  }, [isSimulatingB, simWeekB, decisionB]);

  const toggleFactor = (factor: string) => {
    setActiveFactors(prev => 
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const baseVO2 = 35.0;

  // 1. Generate the complete 12-week trajectory reactively based on current Mischpult configurations
  const getTrajectory = (): WeekData[] => {
    const data: WeekData[] = [{ vo2: baseVO2, msg: 'Woche 0: Starte Trainingszyklus...', color: '#64748b' }];
    let current = baseVO2;

    for (let w = 1; w <= 12; w++) {
      if (activeFactors.length === 0) {
        data.push({ 
          vo2: baseVO2, 
          msg: `Woche ${w}: Keine Hebel aktiviert. Schalte einen VO2max-Hebel ein, um deine Entwicklung zu starten.`, 
          color: '#64748b' 
        });
        continue;
      }

      let weeklyChange = 0;
      const regenFactor = (simRegen - 30) / 70; // 0 to 1

      const isExtremeHIITNoRegen = simHIIT >= 3 && simRegen < 60;
      const isModerateHIITNoRegen = simHIIT >= 2 && simRegen < 50;
      const isCriticalSleepDeprived = simRegen < 40;
      const isNoBaseOnlyHIIT = simZone2 < 45 && simHIIT >= 2;

      let msg = '';
      let color = '';

      if (isCriticalSleepDeprived) {
        weeklyChange = -0.3;
        msg = `Woche ${w}: Systemischer Schlafmangel! Deine Zellen können sich nicht regenerieren.`;
        color = '#ef4444';
      } else if (isExtremeHIITNoRegen && w > 4) {
        weeklyChange = -0.5;
        msg = `Woche ${w}: Übertraining! Chronische Entzündung und Muskelkater bremsen dich aus.`;
        color = '#ef4444';
      } else if (isModerateHIITNoRegen && w > 3) {
        weeklyChange = -0.3;
        msg = `Woche ${w}: Erschöpfung! Dein Körper fordert dringend Ruhetage.`;
        color = '#f97316';
      } else if (isNoBaseOnlyHIIT && w > 5) {
        weeklyChange = -0.15;
        msg = `Woche ${w}: Mitochondrien-Kollaps! Dir fehlt die aerobe Basis.`;
        color = '#f97316';
      } else {
        const z2Adaptation = (simZone2 / 240) * 0.3;
        let hiitAdaptation = (simHIIT / 4) * 0.4;
        
        if (simZone2 < 90 && w > 4) {
          hiitAdaptation *= 0.5;
        }

        weeklyChange = (z2Adaptation + hiitAdaptation) * (0.3 + 0.7 * regenFactor);
        
        if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
          msg = `Woche ${w}: Perfect Flow! Optimale Balance aus aerober Basis und Intervallen.`;
          color = '#22c55e';
        } else if (simHIIT > 0 && simRegen >= 70) {
          msg = `Woche ${w}: Guter Reiz! Dein Herzschlagvolumen passt sich an.`;
          color = '#4C99C2';
        } else if (simZone2 > 0 && simHIIT === 0) {
          msg = `Woche ${w}: Grundlagen-Aufbau. Du vermehrst deine Mitochondrien.`;
          color = '#eab308';
        } else {
          msg = `Woche ${w}: Kaum Trainingsreize gesetzt. Dein VO2-Max stagniert.`;
          color = '#64748b';
        }
      }

      // Hebel-Effekt: Realistische Zuwächse je nach Hebel (HIIT: +2,0 | Zone 2: +1,5 | Gewicht: +1,2 | Erholung: +0,8)
      let factorBonus = 0;
      if (activeFactors.includes('zone2')) factorBonus += 1.5 / 12;
      if (activeFactors.includes('hiit')) factorBonus += 2.0 / 12;
      if (activeFactors.includes('regen')) factorBonus += 0.8 / 12;
      if (activeFactors.includes('weight')) factorBonus += 1.2 / 12;

      weeklyChange += factorBonus;

      current = Math.min(48.5, Math.max(30.0, current + weeklyChange));
      data.push({ vo2: current, msg, color });
    }

    return data;
  };

  const trajectory = getTrajectory();

  // Active state derived from trajectory and current week index
  const currentWeekData = trajectory[simWeek] || trajectory[0];
  const currentVO2 = currentWeekData.vo2;
  const simMessage = currentWeekData.msg;
  const simStatusColor = currentWeekData.color;

  // 2. Playback simulation loop (much slower: 1800ms)
  useEffect(() => {
    if (!isSimulating) return;

    if (simWeek >= 12) {
      setIsSimulating(false);
      generateLisaReport(trajectory[12].vo2);
      return;
    }

    const timer = setTimeout(() => {
      setSimWeek((prev) => prev + 1);
    }, 1800); // 1.8 seconds per week (much slower, highly readable)

    return () => clearTimeout(timer);
  }, [isSimulating, simWeek]);

  // Start automation
  const startSimulation = () => {
    setLisaReport(null);
    setSimWeek(0);
    setIsSimulating(true);
  };

  // Generate the final analysis report from Lisa AI
  const generateLisaReport = (finalVO2: number) => {
    const isExtremeHIITNoRegen = simHIIT >= 3 && simRegen < 60;
    const isNoBaseOnlyHIIT = simZone2 < 45 && simHIIT >= 2;
    const isCriticalSleepDeprived = simRegen < 40;

    if (isCriticalSleepDeprived) {
      setLisaReport(
        "❌ **Rennen abgebrochen: Systemischer Kollaps.**\nDu hast versucht zu trainieren, aber dein Schlaf- und Regenerationsniveau liegt im kritischen Bereich. Ohne Erholung führen Trainingsreize zu Muskelabbau und zellulärem Stress. Erhöhe deine Regeneration auf mindestens 70 %, um Fortschritte zu erzielen."
      );
    } else if (isExtremeHIITNoRegen) {
      setLisaReport(
        "⚠️ **Übertrainings-Crash in Woche 5.**\nDein Plan war zu intensiv für deine Erholungsfähigkeit. HIIT-Intervalle ohne ausreichenden Schlaf führen zu chronisch erhöhten Entzündungswerten (Cortisol) und überlasten dein zentrales Nervensystem. Dein VO2-Max ist nach anfänglichen Gewinnen wieder eingebrochen. *Empfehlung:* Reduziere HIIT auf 1x pro Woche und erhöhe den Schlaf."
      );
    } else if (isNoBaseOnlyHIIT) {
      setLisaReport(
        "📉 **Mitochondrien-Kollaps ab Woche 6.**\nDu hast zwar intensive Intervalle gesetzt, aber dir fehlt die aerobe Basis (Zone 2). Ohne Mitochondrien können deine Muskelzellen den bereitgestellten Sauerstoff nicht verwerten. Dein Training verpufft und führt zu schneller Ermüdung. *Empfehlung:* Mindestens 90–120 Minuten lockeres Zone-2-Training pro Woche einbauen."
      );
    } else if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
      setLisaReport(
        "🏆 **Perfect Flow erreicht! Herausragendes Ergebnis.**\nDu hast das wissenschaftlich erprobte Polarized-Training perfekt umgesetzt. 80 % ruhige Ausdauer (Zone 2) gepaart mit 20 % Spitzenintensität (Zone 5) und exzellenter Regeneration. Deine Mitochondrien arbeiten hocheffizient und dein Schlagvolumen hat sich maximiert. Dein Herzalter hat sich signifikant verjüngt!"
      );
    } else if (simZone2 > 0 && simHIIT === 0) {
      setLisaReport(
        "ℹ️ **Solide Basis, aber kein Spitzen-Reiz.**\nDu hast ein hervorragendes aerobes Fundament gebaut. Deine Mitochondriendichte ist gestiegen, was deine zelluläre Gesundheit schützt. Allerdings fehlt dir der HIIT-Intensitätsreiz, um dein Herzschlagvolumen maximal auszuweiten. *Empfehlung:* Integriere 1x pro Woche ein 4x4-Minuten-Intervalltraining."
      );
    } else if (simZone2 === 0 && simHIIT === 0) {
      setLisaReport(
        "💤 **Keine Anpassungen.**\nOhne Trainingsreize baut der Körper ungenutzte Kapazitäten ab. Dein VO2-Max ist über die 12 Wochen leicht gesunken. Langlebigkeit ist ein aktiver Prozess – fange klein an, z. B. mit 45 Minuten zügigem Gehen in Zone 2."
      );
    } else {
      setLisaReport(
        "📈 **Guter Fortschritt.**\nDu hast spürbare Fortschritte erzielt. Dein Herzkreislauf-System ist fitter und dein Langlebigkeits-Score hat sich verbessert. Um das Maximum herauszuholen (Perfect Flow), versuche das Verhältnis von Ausdauer zu HIIT noch feiner abzustimmen."
      );
    }
  };

  // Live outcomes
  const bioAgeDiff = (currentVO2 - baseVO2) * 0.45;
  const healthspanBonus = (currentVO2 - baseVO2) * 0.35;

  // Mountain climb elevations
  const isBaseCamp = currentVO2 < 35.0;
  const isWaldgrenze = currentVO2 >= 35.0 && currentVO2 < 40.0;
  const isFelsstufe = currentVO2 >= 40.0 && currentVO2 < 45.0;
  const isGipfel = currentVO2 >= 45.0;

  // Mischpult-Status ableiten für UI
  let cardMixerStatus = "Gute Balance. Erhöhe Zone-2 oder HIIT für stärkere Langlebigkeits-Effekte.";
  let cardMixerColor = "#eab308"; // gelb
  let cardMixerIcon = "bi-shield-shaded";
  let pulseSpeed = "2s";
  
  if (simHIIT >= 3 && simRegen < 70) {
    cardMixerStatus = "Systemwarnung: Übertraining! Du trainierst zu hart für deine Regeneration. Schontage einlegen!";
    cardMixerColor = "#ef4444"; // rot
    cardMixerIcon = "bi-exclamation-triangle-fill";
    pulseSpeed = "0.4s";
  } else if (simZone2 >= 120 && simHIIT >= 1 && simRegen >= 75) {
    cardMixerStatus = "Perfect Flow! Dein Herzschlag-Rhythmus klingt kraftvoll und harmonisch. Maximaler Fortschritt!";
    cardMixerColor = "#22c55e"; // grün
    cardMixerIcon = "bi-check-circle-fill";
    pulseSpeed = "1.2s";
  } else if (simZone2 < 60 && simHIIT === 0) {
    cardMixerStatus = "Systemstatus: Träge. Erhöhe Zone-2-Einheiten, um deine zelluläre Akkuladung zu starten.";
    cardMixerColor = "#64748b"; // grau
    cardMixerIcon = "bi-info-circle-fill";
    pulseSpeed = "3s";
  }

  return (
    <div className="sim-container">
      <style dangerouslySetInnerHTML={{__html: `
        .sim-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .sim-header {
          margin-bottom: 3rem;
        }
        .sim-header-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .sim-title {
          font-size: 2.4rem;
          font-weight: 800;
          color: #1e3a5f;
          margin-bottom: 0;
        }
        .sim-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          line-height: 1.55;
        }
        .sim-back-btn {
          background: transparent;
          border: 1.5px solid #4498ca;
          border-radius: 12px;
          color: #4498ca;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.15rem;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(68, 152, 202, 0.02);
        }
        .sim-back-btn:hover {
          background: #ffffff;
          border-color: #006ea7;
          color: #006ea7;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(68, 152, 202, 0.12);
        }
        .sim-back-btn:active {
          transform: translateY(0);
        }
        .sim-section-card {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 30px;
          padding: 2.5rem 2rem;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.03);
          margin-bottom: 2rem;
        }
        .sim-sec-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0 0 0.5rem 0;
        }
        .sim-sec-desc {
          font-size: 0.95rem;
          color: #64748b;
          margin: 0 0 2rem 0;
        }
        .sim-divider {
          border: none;
          border-top: 1px solid rgba(0, 110, 167, 0.08);
          margin: 2.5rem 0;
        }
        @keyframes heartbeat-sim {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1.18); }
          100% { transform: scale(1); }
        }

        /* Styling the timeline timeline-slider */
        .timeline-slider-input {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          border-radius: 10px;
          background: #e2e8f0;
          outline: none;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: background 0.15s ease-in-out;
        }
        .timeline-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #006ea7;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0, 110, 167, 0.4);
          cursor: pointer;
          transition: transform 0.1s;
          margin-top: -14px; /* Align thumb center with track center */
        }
        .timeline-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .tacho-btns-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 4px;
        }
        .tacho-btn-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .tacho-circle-btn {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          font-size: 2.1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.03);
        }
        .tacho-circle-btn:hover {
          background: #f8fafc;
          border-color: #006ea7;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 110, 167, 0.08);
        }
        .tacho-circle-btn.active {
          background: #006ea7 !important;
          border-color: #006ea7 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 15px rgba(0, 110, 167, 0.25);
          transform: translateY(-2px);
        }
        .tacho-circle-btn.active span {
          filter: brightness(0) invert(1);
        }
        .tacho-info-icon-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: help;
          padding: 4px;
        }
        .tacho-info-icon {
          color: #94a3b8;
          font-size: 0.82rem;
          transition: color 0.2s ease;
        }
        .tacho-info-icon-wrapper:hover .tacho-info-icon {
          color: #006ea7;
        }
        .tacho-tooltip {
          visibility: hidden;
          width: 210px;
          background-color: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(4px);
          color: #fff;
          text-align: left;
          border-radius: 10px;
          padding: 10px 12px;
          position: absolute;
          z-index: 99;
          top: 135%;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-size: 0.75rem;
          line-height: 1.35;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          pointer-events: none;
          white-space: normal;
          font-weight: normal;
        }
        .tacho-tooltip::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent rgba(15, 23, 42, 0.95) transparent;
        }
         .tacho-info-icon-wrapper:hover .tacho-tooltip {
           visibility: visible;
           opacity: 1;
           transform: translateX(-50%) translateY(2px);
         }

         .sim-grid {
           display: grid;
           grid-template-columns: 1.2fr 0.8fr;
           gap: 2.5rem;
           align-items: flex-start;
         }
         .sim-left-col {
           padding-right: 2rem;
           padding-top: 5.5rem;
         }
         .sim-right-col {
           display: flex;
           flex-direction: column;
           gap: 1rem;
         }
         .sim-slider-card {
           margin-top: 1.5rem;
           background: #fafcff;
           border: 1px solid #e2eef8;
           border-radius: 20px;
           padding: 1.5rem;
         }
         .sim-ref-table-card {
           margin-top: 1.25rem;
           background: #ffffff;
           border: 1.5px solid #e2e8f0;
           border-radius: 20px;
           padding: 1.25rem;
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
         }
         .sim-header-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            gap: 2rem;
          }

         @media (max-width: 992px) {
           .sim-grid {
             grid-template-columns: 1fr;
             gap: 2rem;
           }
           .sim-left-col {
             padding-right: 0;
             padding-top: 1rem;
           }
         }
         @media (max-width: 768px) {
           .sim-container {
             padding: 1rem;
           }
           .sim-section-card {
             padding: 1.75rem 1.25rem;
             border-radius: 20px;
           }
           .sim-title {
             font-size: 1.8rem;
           }
            .sim-header-row {
               flex-direction: column;
               align-items: stretch;
               gap: 1rem;
               margin-bottom: 2.75rem !important;
             }
         }
         @media (max-width: 576px) {
           .sim-container {
             padding: 1rem;
           }
           .sim-section-card {
             padding: 1.75rem 1.25rem;
             border-radius: 20px;
           }
           .sim-header-title-row {
             flex-direction: column-reverse;
             align-items: flex-start;
             gap: 1rem;
           }
           .sim-back-btn {
             align-self: flex-start;
           }
         }

          .sim-avatar-box {
            position: absolute;
            top: -65px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .sim-base-camp {
            left: 0%;
            transform: translateX(0%);
          }
          .sim-target-trophy {
            left: 100%;
            transform: translateX(-100%);
          }
          .sim-runner-avatar {
            left: calc(var(--sim-progress) * 100%);
            transform: translateX(calc(-1 * var(--sim-progress) * 100%));
          }
          .sim-progression-track {
            margin: 0.25rem 48px 1.5rem 48px;
          }
          .sim-avatar-emoji {
            font-size: 4.8rem;
            line-height: 1;
          }
          @media (max-width: 576px) {
            .sim-avatar-box {
              top: -45px;
            }
            .sim-target-trophy {
              left: 100%;
              transform: translateX(-100%);
            }
            .sim-runner-avatar {
              left: calc(var(--sim-progress) * 100%);
              transform: translateX(calc(-1 * var(--sim-progress) * 100%));
            }
            .sim-progression-track {
              margin: 0.25rem 36px 1.5rem 36px !important;
            }
            .sim-avatar-emoji {
              font-size: 2.8rem;
            }
            .sim-ref-table-card table {
              font-size: 0.64rem !important;
            }
            .sim-ref-table-card th, 
            .sim-ref-table-card td {
              padding: 4px 6px !important;
            }
            .sim-hebel-detail-card {
              width: 100% !important;
              align-self: stretch !important;
              max-width: 100% !important;
            }
          }

          /* Dynamic Hebel Detail Card Styles */
          .sim-hebel-detail-card {
            margin-top: 1rem;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 10px 30px rgba(68, 152, 202, 0.04);
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            width: 330px;
            max-width: 100%;
            box-sizing: border-box;
            text-align: left;
          }
          .sim-hebel-info-header {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }
          .sim-hebel-title {
            font-size: 1.1rem;
            font-weight: 800;
            color: #1e3a5f;
          }
          .sim-hebel-desc {
            font-size: 0.88rem;
            color: #64748b;
            line-height: 1.45;
          }
          .sim-hebel-input-grid {
            display: flex;
            gap: 1rem;
            width: 100%;
            justify-content: space-between;
          }
          .sim-hebel-input-box {
            background: #fafcff;
            border: 1px solid #e2eef8;
            border-radius: 14px;
            padding: 0.5rem 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            max-width: 145px;
            width: 100%;
            box-sizing: border-box;
          }
          .sim-hebel-input-label {
            font-size: 0.75rem;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }
          .sim-hebel-input-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .sim-hebel-number-input {
            width: 62px;
            height: 34px;
            border: 1.5px solid #cbd5e1;
            border-radius: 8px;
            text-align: center;
            font-weight: 800;
            font-size: 0.9rem;
            color: #0f172a;
            outline: none;
            transition: border-color 0.2s;
            background: #ffffff;
          }
          .sim-hebel-number-input:focus {
            border-color: #006ea7;
          }
          .sim-hebel-unit {
            font-size: 0.8rem;
            font-weight: 700;
            color: #475569;
          }
          .sim-hebel-prognosis-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1.5px solid #bae6fd;
            border-radius: 14px;
            padding: 1rem 1.25rem;
            font-size: 0.85rem;
            line-height: 1.5;
            color: #0369a1;
            font-weight: 500;
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .sim-hebel-prognosis-icon {
            font-size: 1.15rem;
            color: #0284c7;
            flex-shrink: 0;
            margin-top: 1px;
          }
          .sim-hebel-prognosis-highlight {
            color: #006ea7;
            font-weight: 700;
          }

           .tacho-wrapper {
             position: relative;
             max-width: 360px;
             width: 100%;
             margin: 0 auto;
           }

         .sim-week-btn-row {
           display: flex;
           justify-content: space-between;
           margin-top: 0.8rem;
           padding: 0 4px;
         }
         .sim-week-btn {
           background: transparent;
           border: none;
           width: 32px;
           height: 32px;
           border-radius: 50%;
           font-size: 0.95rem;
           font-weight: 800;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           transition: all 0.2s;
           color: #64748b;
           flex-shrink: 0;
         }
         .sim-week-btn.active {
            background: #006ea7 !important;
            color: #ffffff !important;
            box-shadow: 0 2px 6px rgba(0, 110, 167, 0.3) !important;
          }
          @media (max-width: 768px) {
            .sim-week-btn-row {
              overflow-x: auto !important;
              scrollbar-width: none !important;
              -webkit-overflow-scrolling: touch !important;
              justify-content: flex-start !important;
              gap: 8px !important;
              padding: 4px 0 !important;
            }
            .sim-week-btn-row::-webkit-scrollbar {
              display: none !important;
            }
            .sim-week-btn {
              width: 28px !important;
              height: 28px !important;
              font-size: 0.85rem !important;
            }
            .tacho-circle-btn {
              width: 58px !important;
              height: 58px !important;
              font-size: 1.55rem !important;
            }
            .tacho-btn-container span {
              font-size: 0.7rem !important;
              padding: 2px 4px !important;
            }
            .tacho-btns-row {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 16px 8px !important;
              justify-items: center !important;
            }
            .sim-hebel-input-grid {
              flex-direction: column !important;
              align-items: center !important;
              gap: 0.75rem !important;
            }
            .sim-hebel-input-box {
              max-width: 100% !important;
            }
          }
      `}} />

      {/* Header */}
      <div className="sim-header">
        <div className="sim-header-title-row">
          <h1 className="sim-title">Cardio- & VO2-Max-Simulator</h1>
          <button className="sim-back-btn" onClick={onBack}>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9L1 5L5 1" />
            </svg>
            Zurück
          </button>
        </div>
        <p className="sim-subtitle">
          Verstehe spielerisch, wie sich deine wöchentlichen Trainings- und Erholungseinheiten direkt auf deine Langlebigkeit auswirken.
        </p>
      </div>

      <div className="sim-section-card">

        {/* I. DAS LANGLEBIGKEITS-RENNEN */}
        <div>
          <div className="sim-header-row">
            <div>
              <h2 className="sim-sec-title" style={{ margin: 0 }}>I. Langlebigkeits-Rennen</h2>
              <p className="sim-sec-desc" style={{ margin: '0.2rem 0 0 0', fontSize: '1.15rem' }}>
                Klicke rechts unterhalb des Tachos bis zu 4 VO2max Hebel an und drücke auf Start oder schiebe den Wochenregler, um die Leistungsentwicklung zu steuern.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              {isSimulating && (
                <button
                  onClick={() => setIsSimulating(false)}
                  style={{
                    background: '#cbd5e1',
                    color: '#334155',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                >
                  Pause
                </button>
              )}
              <button
                onClick={startSimulation}
                style={{
                  background: 'linear-gradient(135deg, #006ea7, #4c99c2)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 110, 167, 0.25)'
                }}
              >
                {isSimulating ? `Woche ${simWeek}...` : 'Simulation starten'}
              </button>
            </div>
          </div>



          <div className="sim-grid">
            <div className="sim-left-col">
              
              {/* Dynamic weekly progression track */}
              <div 
                className="sim-progression-track"
                style={{
                  background: '#f1f5f9',
                  height: '24px',
                  borderRadius: '12px',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  ['--sim-progress' as any]: simWeek / 12
                }}
              >
                {/* Grid Marks */}
                {/* Grid Marks */}
                {[0, 25, 50, 75, 100].map((mark) => (
                  <span 
                    key={mark}
                    style={{
                      position: 'absolute',
                      left: `${mark}%`,
                      top: '5px',
                      width: '2px',
                      height: '14px',
                      background: '#cbd5e1'
                    }}
                  />
                ))}

                {/* Avatar A: Aktuelles Ich (static baseline) */}
                 <div className="sim-avatar-box sim-base-camp">
                   <span className="sim-avatar-emoji" style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>🏃‍♂️</span>
                   <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '8px', whiteSpace: 'nowrap', marginTop: '2px' }}>
                     Basis 35
                   </span>
                 </div>

                 {/* Finish Line Trophy (Target at the far right end) */}
                 <div className="sim-avatar-box sim-target-trophy">
                   <span className="sim-avatar-emoji">🏆</span>
                   <span 
                     style={{
                       fontSize: '0.75rem',
                       fontWeight: 700,
                       color: '#a855f7',
                       background: '#faf5ff',
                       border: '1px solid #e2e8f0',
                       padding: '2px 6px',
                       borderRadius: '8px',
                       whiteSpace: 'nowrap',
                       marginTop: '2px'
                     }}
                   >
                     Ziel (48,5)
                   </span>
                 </div>

                {/* Avatar B: Zukünftiges Ich (moves weekly during sim) */}
                 <div 
                   className="sim-avatar-box sim-runner-avatar"
                   style={{
                     transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                   }}
                 >
                   <span className="sim-avatar-emoji" style={{ display: 'inline-block', transform: 'scaleX(-1)', filter: 'drop-shadow(0 2px 5px rgba(34, 197, 94, 0.4))' }}>
                     🏃‍♂️
                   </span>
                  <span 
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: currentVO2 > baseVO2 ? '#22c55e' : currentVO2 < baseVO2 ? '#ef4444' : '#64748b',
                      background: currentVO2 > baseVO2 ? '#f0fdf4' : currentVO2 < baseVO2 ? '#fef2f2' : '#f1f5f9',
                      border: `1px solid ${currentVO2 > baseVO2 ? '#bbf7d0' : currentVO2 < baseVO2 ? '#fecaca' : '#cbd5e1'}`,
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}
                  >
                    Woche {simWeek} ({currentVO2.toFixed(1).replace('.', ',')})
                  </span>
                </div>
              </div>

              {/* Wochen timeline & slider (DRAGGABLE SLIDER) */}
              <div className="sim-slider-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e3a5f' }}>Wochen-Zeitleiste</span>
                  <span style={{ background: '#006ea7', color: '#ffffff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800 }}>Woche {simWeek} / 12</span>
                </div>
                
                {/* Drag range slider */}
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={simWeek}
                  onChange={(e) => {
                    setSimWeek(parseInt(e.target.value));
                    setIsSimulating(false);
                    setLisaReport(null);
                  }}
                  className="timeline-slider-input"
                />

                {/* Week Labels under slider */}
                 <div className="sim-week-btn-row">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((wk) => {
                    const isActive = wk === simWeek;
                    return (
                      <button
                        key={wk}
                        onClick={() => {
                          setSimWeek(wk);
                          setIsSimulating(false);
                          setLisaReport(null);
                        }}
                        className={`sim-week-btn ${isActive ? 'active' : ''}`}
                      >
                        {wk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VO2max Reference Values Table */}
              <div className="sim-ref-table-card">
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a5f', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📊 <span>VO2max Altersreferenzwerte (Normalbereiche)</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid #cbd5e1', color: '#64748b', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        <th style={{ padding: '6px 8px' }}>Alter</th>
                        <th style={{ padding: '6px 8px' }}>Frauen (Schnitt)</th>
                        <th style={{ padding: '6px 8px' }}>Männer (Schnitt)</th>
                        <th style={{ padding: '6px 8px' }}>Fitness-Niveau</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: '#334155' }}>
                      {[
                        { age: '20–24', w: '37–41', m: '44–48', level: 'Gut / Athletisch' },
                        { age: '25–29', w: '35–39', m: '42–46', level: 'Gut / Durchschnitt' },
                        { age: '30–34', w: '34–38', m: '40–45', level: 'Durchschnitt' },
                        { age: '35–39', w: '33–37', m: '39–43', level: 'Durchschnitt' },
                        { age: '40–44', w: '32–35', m: '37–41', level: 'Durchschnitt' },
                        { age: '45–49', w: '31–34', m: '35–39', level: 'Mäßig / Normal' },
                        { age: '50–54', w: '29–32', m: '34–38', level: 'Mäßig / Normal' },
                        { age: '55–59', w: '27–30', m: '32–35', level: 'Mäßig' },
                        { age: '60–64', w: '25–28', m: '30–33', level: 'Einsteiger' },
                        { age: '65–69', w: '23–26', m: '28–31', level: 'Einsteiger' },
                        { age: '70+', w: '< 23', m: '< 26', level: 'Basis-Camp' }
                      ].map((row, idx) => (
                        <tr 
                          key={idx} 
                          style={{ 
                            borderBottom: '1px solid #f1f5f9', 
                            background: idx % 2 === 0 ? '#f8fafc' : 'transparent',
                            transition: 'background 0.15s ease',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <td style={{ padding: '6px 8px', fontWeight: 700, color: '#1e3a5f' }}>{row.age}</td>
                          <td style={{ padding: '6px 8px' }}>{row.w} ml/kg/min</td>
                          <td style={{ padding: '6px 8px' }}>{row.m} ml/kg/min</td>
                          <td style={{ padding: '6px 8px', fontWeight: 600, color: '#4c99c2' }}>{row.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* VO2-Max Analytics Box */}
            <div className="sim-right-col">
              <div 
                style={{
                  background: '#fafcff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '24px',
                  padding: '0.85rem 1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 110, 167, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <div style={{ textAlign: 'center', borderBottom: '1px solid #e2effa', paddingBottom: '1rem' }}>
                  <div className="tacho-wrapper">
                    {(() => {
                      const needleAngle = Math.min(405, Math.max(135, 200 + (currentVO2 - 35.0) * 17.57));
                      const activeArcPct = (needleAngle - 135) / 270;
                      return (
                        <svg width="100%" height="100%" viewBox="0 0 220 190" style={{ display: 'block' }}>
                          <defs>
                            <linearGradient id="tachoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#ef4444" />
                              <stop offset="30%" stopColor="#f97316" />
                              <stop offset="52%" stopColor="#f97316" />
                              <stop offset="70%" stopColor="#eab308" />
                              <stop offset="86%" stopColor="#22c55e" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                              <feGaussianBlur stdDeviation="3.5" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                            <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#1e293b" />
                              <stop offset="80%" stopColor="#0f172a" />
                              <stop offset="100%" stopColor="#020617" />
                            </radialGradient>
                          </defs>
                          
                          {/* Background Track Arc */}
                          <path 
                            d="M 46 164 A 85 85 0 1 1 174 164" 
                            fill="none" 
                            stroke="#cbd5e1" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                            opacity="0.3"
                          />

                          {/* Colored Active Arc with Glow */}
                          <path 
                            d="M 46 164 A 85 85 0 1 1 174 164" 
                            fill="none" 
                            stroke="url(#tachoGrad)" 
                            strokeWidth="11" 
                            strokeLinecap="round" 
                            strokeDasharray="400"
                            strokeDashoffset={400 - (activeArcPct * 400)}
                            style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
                          />

                          {/* Futuristic Cyber-Grid Tick Marks */}
                          <path 
                            d="M 46 164 A 85 85 0 1 1 174 164" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="3" 
                            strokeDasharray="2, 6" 
                            opacity="0.4"
                          />

                          {/* Tacho Hub (Dark Glass Center Circle) */}
                          <circle cx="110" cy="110" r="48" fill="url(#hubGrad)" stroke="#334155" strokeWidth="2" />
                          
                          {/* Glowing inner cyan laser ring */}
                          <circle cx="110" cy="110" r="44" fill="none" stroke="#00f2fe" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.8" />
                          
                          {/* Futuristic Laser Needle - Glow Outer Layer */}
                          <line 
                            x1={110 + 48 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y1={110 + 48 * Math.sin((needleAngle * Math.PI) / 180)} 
                            x2={110 + 82 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y2={110 + 82 * Math.sin((needleAngle * Math.PI) / 180)} 
                            stroke="#00f2fe" 
                            strokeWidth="6" 
                            strokeLinecap="round"
                            filter="url(#neonGlow)"
                            opacity="0.85"
                            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                          />
                          {/* Futuristic Laser Needle - Bright White Core */}
                          <line 
                            x1={110 + 48 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y1={110 + 48 * Math.sin((needleAngle * Math.PI) / 180)} 
                            x2={110 + 82 * Math.cos((needleAngle * Math.PI) / 180)} 
                            y2={110 + 82 * Math.sin((needleAngle * Math.PI) / 180)} 
                            stroke="#ffffff" 
                            strokeWidth="2.5" 
                            strokeLinecap="round"
                            style={{ transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)' }}
                          />
                        </svg>
                      );
                    })()}

                    {/* Values inside the Center Circle */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: '57.89%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        lineHeight: 1
                      }}
                    >
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>VO2max</span>
                      <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: 0, padding: 0 }}>
                        {currentVO2.toFixed(1).replace('.', ',')}
                      </div>
                      <span style={{ fontSize: '0.94rem', fontWeight: 800, color: currentVO2 >= baseVO2 ? '#4ade80' : '#f87171', marginTop: '5px' }}>
                        {currentVO2 >= baseVO2 ? '▲' : '▼'} {Math.abs(currentVO2 - baseVO2).toFixed(1).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* VO2-Max Hebel Card (Eigener Kasten) */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: '1.5px solid #bae6fd',
                  borderRadius: '24px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 15px rgba(0, 110, 167, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.22rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem', textAlign: 'center' }}>
                    VO2max Hebel
                  </div>
                    <div className="tacho-btns-row">
                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('zone2') ? 'active' : ''}`}
                          onClick={() => { toggleFactor('zone2'); setSelectedInfoFactor('zone2'); }}
                        >
                          <span>🏃‍♂️</span>
                        </button>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                        >
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 800, 
                            color: selectedInfoFactor === 'zone2' ? '#0284c7' : '#64748b',
                            background: selectedInfoFactor === 'zone2' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}>
                            Zone 2
                          </span>
                        </div>
                      </div>

                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('hiit') ? 'active' : ''}`}
                          onClick={() => { toggleFactor('hiit'); setSelectedInfoFactor('hiit'); }}
                        >
                          <span>⚡</span>
                        </button>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                        >
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 800, 
                            color: selectedInfoFactor === 'hiit' ? '#0284c7' : '#64748b',
                            background: selectedInfoFactor === 'hiit' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}>
                            HIIT
                          </span>
                        </div>
                      </div>

                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('regen') ? 'active' : ''}`}
                          onClick={() => { toggleFactor('regen'); setSelectedInfoFactor('regen'); }}
                        >
                          <span>🛌</span>
                        </button>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                        >
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 800, 
                            color: selectedInfoFactor === 'regen' ? '#0284c7' : '#64748b',
                            background: selectedInfoFactor === 'regen' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}>
                            Erholung
                          </span>
                        </div>
                      </div>

                      <div className="tacho-btn-container">
                        <button 
                          className={`tacho-circle-btn ${activeFactors.includes('weight' ) ? 'active' : ''}`}
                          onClick={() => { toggleFactor('weight'); setSelectedInfoFactor('weight'); }}
                        >
                          <span>🏋️</span>
                        </button>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '6px', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                        >
                          <span style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 800, 
                            color: selectedInfoFactor === 'weight' ? '#0284c7' : '#64748b',
                            background: selectedInfoFactor === 'weight' ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                          }}>
                            Gewicht
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Tooltip Info Box (Kasten unterhalb der Buttons) */}
                    {(() => {
                      const activeKey = selectedInfoFactor;
                      let content = null;
                      
                      if (activeKey === 'zone2') {
                        content = (
                          <>
                            <div className="sim-hebel-info-header">
                              <div className="sim-hebel-title">🏃‍♂️ Zone 2</div>
                              <div className="sim-hebel-desc">
                                Verbessert die Sauerstoffverarbeitung in den Muskelzellen und bildet das aerobe Fundament.
                              </div>
                            </div>
                            
                            <div className="sim-hebel-input-grid">
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Aktuell</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    value={currentZone2 || ''} 
                                    onChange={(e) => setCurrentZone2(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">Min. /<br/>Woche</span>
                                </div>
                              </div>
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Ziel</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    value={targetZone2 || ''} 
                                    onChange={(e) => setTargetZone2(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">Min. /<br/>Woche</span>
                                </div>
                              </div>
                            </div>

                            {(() => {
                              const curZ2 = currentZone2 >= 0 ? currentZone2 : 0;
                              const tarZ2 = targetZone2 >= 0 ? targetZone2 : 0;
                              const diff = tarZ2 - curZ2;
                              if (diff <= 0) {
                                return (
                                  <div className="sim-hebel-prognosis-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <i className="bi bi-info-circle sim-hebel-prognosis-icon" style={{ color: '#94a3b8' }}></i>
                                    <div>
                                      Gib ein Zone 2-Ziel ein, das über deinem aktuellen Wert liegt, um den VO2max-Effekt zu berechnen.
                                    </div>
                                  </div>
                                );
                              }
                              const bonus = (diff * 0.01).toFixed(1).replace('.', ',');
                              return (
                                <div className="sim-hebel-prognosis-box">
                                  <i className="bi bi-graph-up-arrow sim-hebel-prognosis-icon"></i>
                                  <div>
                                    Du erhöhst dein wöchentliches Training um <span className="sim-hebel-prognosis-highlight">+{diff} Min.</span> – Deine relative VO2max steigt am Ende von Woche 12 rechnerisch um ca. <span className="sim-hebel-prognosis-highlight">+{bonus} Punkte</span>!
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        );
                      } else if (activeKey === 'hiit') {
                        content = (
                          <>
                            <div className="sim-hebel-info-header">
                              <div className="sim-hebel-title">⚡ HIT</div>
                              <div className="sim-hebel-desc">
                                Vergrößert das Herzminutenvolumen, sodass pro Herzschlag mehr sauerstoffreiches Blut gepumpt wird.
                              </div>
                            </div>
                            
                            <div className="sim-hebel-input-grid">
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Aktuell</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    value={currentHIIT === 0 ? 0 : (currentHIIT || '')} 
                                    onChange={(e) => setCurrentHIIT(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">Units /<br/>Woche</span>
                                </div>
                              </div>
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Ziel</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    value={targetHIIT || ''} 
                                    onChange={(e) => setTargetHIIT(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">Units /<br/>Woche</span>
                                </div>
                              </div>
                            </div>

                            {(() => {
                              const curH = currentHIIT >= 0 ? currentHIIT : 0;
                              const tarH = targetHIIT >= 0 ? targetHIIT : 0;
                              const diff = tarH - curH;
                              if (diff <= 0) {
                                return (
                                  <div className="sim-hebel-prognosis-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <i className="bi bi-info-circle sim-hebel-prognosis-icon" style={{ color: '#94a3b8' }}></i>
                                    <div>
                                      Gib ein HIIT-Ziel ein, das über deinem aktuellen Wert liegt, um den VO2max-Effekt zu berechnen.
                                    </div>
                                  </div>
                                );
                              }
                              const bonus = (diff * 1.0).toFixed(1).replace('.', ',');
                              return (
                                <div className="sim-hebel-prognosis-box">
                                  <i className="bi bi-graph-up-arrow sim-hebel-prognosis-icon"></i>
                                  <div>
                                    Du steigerst dein HIIT-Training um <span className="sim-hebel-prognosis-highlight">+{diff} Units/Woche</span> – Deine relative VO2max steigt rechnerisch um ca. <span className="sim-hebel-prognosis-highlight">+{bonus} Punkte</span>!
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        );
                      } else if (activeKey === 'regen') {
                        content = (
                          <>
                            <div className="sim-hebel-info-header">
                              <div className="sim-hebel-title">🛌 Erholung</div>
                              <div className="sim-hebel-desc">
                                Ausreichend Schlaf und Trainingspausen erlauben es Herz und Muskeln, sich an gesetzte Reize anzupassen.
                              </div>
                            </div>
                            
                            <div className="sim-hebel-input-grid">
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Aktuell</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    step="0.5"
                                    value={currentSleep || ''} 
                                    onChange={(e) => setCurrentSleep(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">Std. /<br/>Nacht</span>
                                </div>
                              </div>
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Ziel</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    step="0.5"
                                    value={targetSleep || ''} 
                                    onChange={(e) => setTargetSleep(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">Std. /<br/>Nacht</span>
                                </div>
                              </div>
                            </div>

                            {(() => {
                              const curS = currentSleep > 0 ? currentSleep : 6.0;
                              const tarS = targetSleep > 0 ? targetSleep : 8.0;
                              const diff = tarS - curS;
                              if (diff <= 0) {
                                return (
                                  <div className="sim-hebel-prognosis-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <i className="bi bi-info-circle sim-hebel-prognosis-icon" style={{ color: '#94a3b8' }}></i>
                                    <div>
                                      Gib ein Schlafziel ein, das über deinem aktuellen Wert liegt, um den VO2max-Effekt zu berechnen.
                                    </div>
                                  </div>
                                );
                              }
                              const bonus = (diff * 0.4).toFixed(1).replace('.', ',');
                              return (
                                <div className="sim-hebel-prognosis-box">
                                  <i className="bi bi-graph-up-arrow sim-hebel-prognosis-icon"></i>
                                  <div>
                                    Du erhöhst deinen Schlaf um <span className="sim-hebel-prognosis-highlight">+{diff.toFixed(1).replace('.', ',')} Std.</span> pro Nacht – Deine VO2max steigt rechnerisch um ca. <span className="sim-hebel-prognosis-highlight">+{bonus} Punkte</span>!
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        );
                      } else if (activeKey === 'weight') {
                        content = (
                          <>
                            <div className="sim-hebel-info-header">
                              <div className="sim-hebel-title">🏋️ Gewicht</div>
                              <div className="sim-hebel-desc">
                                Da die relative VO2max pro Kilogramm Körpergewicht gemessen wird, erhöht Fettabbau deinen Wert rechnerisch sofort.
                              </div>
                            </div>
                            
                            <div className="sim-hebel-input-grid">
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Aktuell</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    value={userWeight || ''} 
                                    onChange={(e) => setUserWeight(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">kg</span>
                                </div>
                              </div>
                              <div className="sim-hebel-input-box">
                                <span className="sim-hebel-input-label">Ziel</span>
                                <div className="sim-hebel-input-row">
                                  <input 
                                    type="number" 
                                    value={targetWeight || ''} 
                                    onChange={(e) => setTargetWeight(Number(e.target.value))}
                                    className="sim-hebel-number-input"
                                  />
                                  <span className="sim-hebel-unit">kg</span>
                                </div>
                              </div>
                            </div>

                            {(() => {
                              const curW = userWeight > 10 ? userWeight : 80;
                              const targetW = targetWeight > 10 ? targetWeight : 76;
                              const weightLoss = curW - targetW;
                              if (weightLoss <= 0) {
                                return (
                                  <div className="sim-hebel-prognosis-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                    <i className="bi bi-info-circle sim-hebel-prognosis-icon" style={{ color: '#94a3b8' }}></i>
                                    <div>
                                      Gib ein Zielgewicht ein, das unter deinem aktuellen Gewicht liegt, um den VO2max-Effekt zu berechnen.
                                    </div>
                                  </div>
                                );
                              }
                              const newVO2Val = ((35.0 * curW) / targetW).toFixed(1).replace('.', ',');
                              return (
                                <div className="sim-hebel-prognosis-box">
                                  <i className="bi bi-graph-up-arrow sim-hebel-prognosis-icon"></i>
                                  <div>
                                    Durch die Reduktion um <span className="sim-hebel-prognosis-highlight">-{weightLoss} kg</span> steigt deine relative VO2max rechnerisch sofort auf <span className="sim-hebel-prognosis-highlight">{newVO2Val} ml/kg/min</span>!
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        );
                      }

                      return (
                        <div className="sim-hebel-detail-card">
                          {content}
                        </div>
                      );
                    })()}
                  </div>
                </div>


            </div>

          </div>
        </div>

        <hr className="sim-divider" />

        {/* II. LEBENSSTIL-ENTSCHEIDUNGEN AM MOUNT LONGEVITUS */}
        <div>
          <h2 className="sim-sec-title">II. VO2-Trainings-Entscheidungen 3-Monats-Plan</h2>
          <p className="sim-sec-desc" style={{ fontSize: '1.15rem' }}>
            Triff im Aufstiegsverlauf 12 wichtige Alltagsentscheidungen und beobachte live, wie sich jede Wahl positiv oder negativ auf deine VO2max-Kurve und deine Position am Berg auswirkt.
          </p>

          <div className="mount-longev-grid">
            
            {/* SPALTE LINKS: DEINE ENTSCHEIDUNGSZENTRALE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0 0.5rem', color: '#1e3a5f', fontSize: '1.2rem', fontWeight: 800 }}>Entscheidungszentrale</h3>
              <div style={{ background: '#fcfdff', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, flex: 1 }}>

              {(() => {
                const minVo2 = 35.0;
                const maxVo2 = 48.5;
                const t = Math.min(1, Math.max(0, (vo2B - minVo2) / (maxVo2 - minVo2)));
                const positionPercent = 100 - (t * 100);
                const objectPositionB = `center ${positionPercent.toFixed(0)}%`;
                return (
                  <img 
                    src="/images/photorealistic_mountain.png" 
                    alt="Mount Longevitus Preview" 
                    style={{
                      width: '100%',
                      height: '140px',
                      objectFit: 'cover',
                      objectPosition: objectPositionB,
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                      transform: 'scale(1.0)',
                      transition: 'object-position 0.8s ease'
                    }}
                  />
                );
              })()}

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '0.8rem', marginTop: '0.2rem' }}>
                {decisionB ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div style={{ 
                      display: 'inline-block', 
                      alignSelf: 'flex-start', 
                      background: decisionB.week === 12 ? '#dcfce7' : '#f3e8ff', 
                      color: decisionB.week === 12 ? '#166534' : '#7e22ce', 
                      padding: '10px 18px', 
                      borderRadius: '12px', 
                      fontSize: '1.4rem', 
                      fontWeight: 900, 
                      letterSpacing: '0.05em' 
                    }}>
                      WOCHE {decisionB.week} / 12
                    </div>
                     <div style={{ color: '#1e3a5f', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {(() => {
                        const parts = decisionB.title.split(':');
                        if (parts.length > 1) {
                          return (
                            <>
                              <strong style={{ fontWeight: 800 }}>{parts[0]}:</strong>
                              <span style={{ fontWeight: 500 }}>{parts.slice(1).join(':')}</span>
                            </>
                          );
                        }
                        return <span style={{ fontWeight: 700 }}>{decisionB.title}</span>;
                      })()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {decisionB.options.map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleDecisionChoice(opt.effect, opt.logText, opt.type, decisionB.week, opt.change)}
                          style={{
                            background: '#ffffff',
                            border: decisionB.week === 12 ? '2px solid #bbf7d0' : '2px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            fontSize: '0.85rem',
                            color: '#334155',
                            cursor: 'pointer',
                            textAlign: 'left',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.border = decisionB.week === 12 ? '2px solid #22c55e' : '2px solid #7e22ce';
                            e.currentTarget.style.background = decisionB.week === 12 ? '#f0fdf4' : '#fdfaff';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.border = decisionB.week === 12 ? '2px solid #bbf7d0' : '2px solid #e2e8f0';
                            e.currentTarget.style.background = '#ffffff';
                          }}
                        >
                          <strong style={{ fontWeight: 800, color: decisionB.week === 12 ? '#166534' : '#7e22ce', marginRight: '6px' }}>
                            {opt.key === 'A' ? 'Antwort 1:' : 'Antwort 2:'}
                          </strong>
                          <span style={{ fontWeight: 500 }}>
                            {opt.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '0px' }}>
                    {isSimulatingB ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
                        <div style={{ display: 'inline-block', background: '#f3e8ff', color: '#7e22ce', padding: '10px 20px', borderRadius: '12px', fontSize: '1.4rem', fontWeight: 900 }}>
                          WOCHE {simWeekB} / 12
                        </div>
                        <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Kletterer steigt auf... Bitte warten.</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center' }}>
                        <span style={{ width: '100%', fontSize: '1.2rem', color: '#334155', fontWeight: 500, textAlign: 'center', lineHeight: '1.4' }}>
                          Bereit für den Aufstieg? Triff deine Lifestyle-Entscheidungen.
                        </span>
                        <button
                          onClick={startSimulationB}
                          style={{
                            background: simWeekB === 12
                              ? 'linear-gradient(135deg, #166534, #22c55e)'
                              : 'linear-gradient(135deg, #7e22ce, #a855f7)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '16px',
                            fontWeight: 800,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: simWeekB === 12
                              ? '0 4px 15px rgba(22, 101, 52, 0.25)'
                              : '0 4px 15px rgba(126, 34, 206, 0.25)',
                            transition: 'transform 0.2s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.background = simWeekB === 12
                              ? 'linear-gradient(135deg, #15803d, #4ade80)'
                              : 'linear-gradient(135deg, #6b21a8, #c084fc)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = simWeekB === 12
                              ? 'linear-gradient(135deg, #166534, #22c55e)'
                              : 'linear-gradient(135deg, #7e22ce, #a855f7)';
                          }}
                        >
                          {simWeekB === 12 ? 'Erneut starten' : 'Simulation starten'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div> {/* Ende SPALTE LINKS Wrapper */}

            {/* SPALTE MITTE: AUFSTIEG */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0 0.5rem', color: '#1e3a5f', fontSize: '1.2rem', fontWeight: 800 }}>Aufstieg Mount Longevitus</h3>
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', flex: 1 }}>

              {/* Graphic Mountain area */}
              <div style={{ 
                flex: 1, 
                position: 'relative', 
                borderRadius: '20px', 
                overflow: 'hidden',
                minHeight: '350px',
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.15)',
                backgroundImage: "url('/images/photorealistic_mountain.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                <svg width="100%" height="100%" viewBox="0 0 300 400" preserveAspectRatio="none" style={{ display: 'block', background: 'transparent' }}>
                  <path d="M 60 370 Q 110 290 170 200 T 150 70" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="6,6" style={{ filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.9))' }} />
                  <line x1="10" y1="70" x2="290" y2="70" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="4,4" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.9))' }} />
                  <line x1="10" y1="200" x2="290" y2="200" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="4,4" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.9))' }} />
                  <line x1="10" y1="290" x2="290" y2="290" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="4,4" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.9))' }} />
                  <line x1="10" y1="370" x2="290" y2="370" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeDasharray="4,4" style={{ filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.9))' }} />
                </svg>

                {/* Peak Label */}
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(5px)', padding: '2px 8px', borderRadius: '8px', color: '#fff', fontSize: '0.7rem', fontWeight: 800, border: '1px solid rgba(255,255,255,0.15)', zIndex: 3 }}>
                  🏔️ Mount Longevitus
                </div>

                {/* Height Stage Markers on the mountain side */}
                <div style={{ position: 'absolute', top: '13%', left: '10px', color: '#d8b4fe', fontSize: '0.9rem', fontWeight: 800, zIndex: 3, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  🏁 Gipfel (VO2max 45+)
                </div>
                <div style={{ position: 'absolute', top: '46%', left: '10px', color: '#93c5fd', fontSize: '0.9rem', fontWeight: 800, zIndex: 3, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  🧗‍♂️ Felsstufe (40-44)
                </div>
                <div style={{ position: 'absolute', top: '69%', left: '10px', color: '#86efac', fontSize: '0.9rem', fontWeight: 800, zIndex: 3, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  🌲 Waldgrenze (35-39)
                </div>
                <div style={{ position: 'absolute', top: '89%', left: '10px', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 800, zIndex: 3, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  ⛺ Basis-Camp (&lt;35)
                </div>

                {/* Climber Position Indicator */}
                {(() => {
                  const minVo2 = 35.0;
                  const maxVo2 = 48.5;
                  const t = Math.min(1, Math.max(0, (vo2B - minVo2) / (maxVo2 - minVo2)));
                  
                  // Winding path interpolation matching the SVG path Q/T curves:
                  let x = 60;
                  let y = 370;
                  
                  if (t < 0.5) {
                    const localT = t / 0.5;
                    const x1 = 60 + (110 - 60) * localT;
                    const y1 = 370 + (290 - 370) * localT;
                    const x2 = 110 + (170 - 110) * localT;
                    const y2 = 290 + (200 - 290) * localT;
                    x = x1 + (x2 - x1) * localT;
                    y = y1 + (y2 - y1) * localT;
                  } else {
                    const localT = (t - 0.5) / 0.5;
                    const cx = 230;
                    const cy = 110;
                    const x1 = 170 + (cx - 170) * localT;
                    const y1 = 200 + (cy - 200) * localT;
                    const x2 = cx + (150 - cx) * localT;
                    const y2 = cy + (70 - cy) * localT;
                    x = x1 + (x2 - x1) * localT;
                    y = y1 + (y2 - y1) * localT;
                  }

                  // Translate svg viewBox coords (300 x 400) to percentage
                  const leftPercent = (x / 300) * 100;
                  const topPercent = (y / 400) * 100;

                  return (
                    <div 
                      style={{
                        position: 'absolute',
                        top: `${topPercent}%`,
                        left: `${leftPercent}%`,
                        zIndex: 10,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)'
                      }}
                    >
                      <img 
                        src="/images/climber_fluent.svg"
                        alt="Climber"
                        style={{ 
                          width: '90px', 
                          height: '90px',
                          filter: 'drop-shadow(0 0 16px #ffffff) drop-shadow(0 0 8px #ffffff) drop-shadow(0 4px 6px rgba(0,0,0,0.4))',
                          animation: isSimulatingB && !decisionB ? 'heartbeat-sim 1.5s infinite ease-in-out' : 'none',
                          background: 'transparent',
                          backgroundColor: 'transparent',
                          display: 'block'
                        }}
                      />
                      <div style={{ 
                        background: 'rgba(30, 41, 59, 0.85)', 
                        backdropFilter: 'blur(5px)',
                        color: '#fff', 
                        padding: '2px 8px', 
                        borderRadius: '10px', 
                        fontSize: '0.65rem', 
                        fontWeight: 800, 
                        marginTop: '4px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        Woche {simWeekB}: {vo2B.toFixed(1)} ml
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
            </div> {/* Ende SPALTE MITTE Wrapper */}

            {/* SPALTE RECHTS: VO2-MAX ENTWICKLUNG */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: '0 0 0 0.5rem', color: '#1e3a5f', fontSize: '1.2rem', fontWeight: 800 }}>Entwicklung VO2max</h3>
              <div style={{ background: '#fcfdff', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '2rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0, flex: 1 }}>

              {/* Huge current value display */}
              <div style={{ background: '#fdfaff', border: '2px solid #7e22ce', borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#0f172a', margin: '0.2rem 0' }}>
                  {vo2B.toFixed(1).replace('.', ',')}
                  <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#64748b', marginLeft: '4px' }}>ml/kg/min</span>
                </div>
                {simWeekB === 12 ? (
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    marginTop: '0.6rem',
                    background: (vo2B - 35.0) >= 0 ? 'linear-gradient(135deg, #059669, #10b981)' : 'linear-gradient(135deg, #dc2626, #f87171)',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    boxShadow: (vo2B - 35.0) >= 0 ? '0 4px 14px rgba(16, 185, 129, 0.4)' : '0 4px 14px rgba(220, 38, 38, 0.4)',
                    border: 'none',
                    letterSpacing: '0.01em',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    whiteSpace: 'nowrap'
                  }}>
                    Finales Ergebnis: {(vo2B - 35.0) >= 0 ? '+' : ''}{(vo2B - 35.0).toFixed(1).replace('.', ',')}
                  </div>
                ) : (
                  lastChangeB !== null && (
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: lastChangeB >= 0 ? '#166534' : '#dc2626',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '0.2rem',
                      background: lastChangeB >= 0 ? '#f0fdf4' : '#fef2f2',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      border: lastChangeB >= 0 ? '1px solid #bbf7d0' : '1px solid #fca5a5'
                    }}>
                      {lastChangeB >= 0 ? '▲ +' : '▼ '}{lastChangeB.toFixed(2).replace('.', ',')}
                    </div>
                  )
                )}
              </div>

              {/* Log area with red/green conditional styling */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto' }}>
                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {historyB.map((log, idx) => {
                    let color = '#475569';
                    let bg = '#f8fafc';
                    let border = '1px solid #e2e8f0';
                    
                    if (log.type === 'good') {
                      color = '#166534';
                      bg = '#f0fdf4';
                      border = '1px solid #bbf7d0';
                    } else if (log.type === 'bad') {
                      color = '#991b1b';
                      bg = '#fef2f2';
                      border = '1px solid #fca5a5';
                    }

                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          color, 
                          background: bg, 
                          border, 
                          padding: '6px 6px', 
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          lineHeight: '1.2',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={log.text}
                      >
                        {log.type === 'good' && '✅ '}
                        {log.type === 'bad' && '❌ '}
                        {log.text}
                      </div>
                    );
                  })}
              </div>
            </div>
            </div>
            </div> {/* Ende SPALTE RECHTS Wrapper */}

          </div>
        </div>

      </div>
    </div>
  );
}
