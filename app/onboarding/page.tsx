'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import WelcomeSection from '@/components/layout/WelcomeSection';

interface Question {
  id: number;
  category: 'Einstieg' | 'Schlaf' | 'Kraft' | 'Zellversorgung' | 'Immunbalance' | 'Soziale Bindungen' | 'Mindset';
  text: string;
  options: string[];
  isMultiSelect?: boolean;
}

const RUBRICS = [
  { id: 'Einstieg', label: 'Einstieg', icon: 'bi-rocket-takeoff' },
  { id: 'Schlaf', label: 'Schlaf', icon: 'bi-moon-stars' },
  { id: 'Kraft', label: 'Kraft', icon: 'bi-lightning' },
  { id: 'Zellversorgung', label: 'Zelle', icon: 'bi-apple' },
  { id: 'Immunbalance', label: 'Immun', icon: 'bi-yin-yang' },
  { id: 'Soziale Bindungen', label: 'Soziales', icon: 'bi-heart' },
  { id: 'Mindset', label: 'Resilienz', icon: 'bi-sun' }
];

// All 80 questions from the PDF, categorized
const QUESTION_POOL: Record<string, Question[]> = {
  Einstieg: [
    { id: 1, category: 'Einstieg', text: 'Was ist aktuell dein Hauptziel mit True Years?', options: ['Mehr Energie', 'Besser schlafen', 'Fitter werden', 'Routinen verbessern', 'Langfristige Lifestyle-Optimierung'] },
    { id: 2, category: 'Einstieg', text: 'Was ist dein wichtigstes Zweitziel?', options: ['Mehr Fokus', 'Stress besser managen', 'Ernährung verbessern', 'Mehr Bewegung', 'Bessere Regeneration'] },
    { id: 3, category: 'Einstieg', text: 'Was ist deine Hauptmotivation mitzumachen?', options: ['Akuter Anlass', 'Präventiv', 'Leistungsfähigkeit steigern', 'Alltag verbessern', 'Langfristig vorsorgen'] },
    { id: 4, category: 'Einstieg', text: 'Was erwartest du von True Years?', options: ['Orientierung', 'Klare Prioritäten', 'Konkrete Schritte', 'Bessere Routinen', 'Langfristige Begleitung'] },
    { id: 5, category: 'Einstieg', text: 'In welchem Zeitraum möchtest du erste Verbesserungen spüren?', options: ['4 Wochen', '3 Monate', '6 Monate', '12 Monate'] },
    { id: 6, category: 'Einstieg', text: 'Wie schätzt du deine aktuelle Ausgangslage ein?', options: ['Sehr schwach', 'Eher ausbaufähig', 'Mittel', 'Eher gut', 'Gut'] },
    { id: 7, category: 'Einstieg', text: 'Warum ist jetzt der richtige Zeitpunkt für dich?', options: ['Konkreter Auslöser', 'Wachsendes Bewusstsein', 'Unzufriedenheit', 'Neue Lebensphase', 'Schon länger geplant'] },
    { id: 8, category: 'Einstieg', text: 'Woran würdest du nach 3 Monaten merken, dass True Years für dich wirkt?', options: ['Mehr Energie', 'Bessere Routinen', 'Mehr Klarheit', 'Bessere Erholung', 'Spürbar besserer Alltag'] },
    { id: 9, category: 'Einstieg', text: 'Was ist dir bei deiner Entwicklung am wichtigsten?', options: ['Einfachheit', 'Schnelligkeit', 'Nachhaltigkeit', 'Klare Struktur', 'Persönliche Passung'] },
    { id: 10, category: 'Einstieg', text: 'Wie groß ist dein Wunsch, alte Muster zu verändern?', options: ['Sehr gering', 'Gering', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 11, category: 'Einstieg', text: 'Wie bereit bist du aktuell, wirklich etwas zu verändern?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 12, category: 'Einstieg', text: 'Wie sicher bist du, dass du Veränderungen umsetzen kannst?', options: ['Gar nicht sicher', 'Eher unsicher', 'Mittel', 'Eher sicher', 'Sehr sicher'] },
    { id: 13, category: 'Einstieg', text: 'Wie oft hast du in der Vergangenheit gute Vorsätze nicht gehalten?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 14, category: 'Einstieg', text: 'Was hat dich bisher am meisten ausgebramst?', options: ['Zeit', 'Fehlende Energie', 'Fehlende Klarheit', 'Fehlende Konsequenz', 'Zu viel Alltag'] },
    { id: 15, category: 'Einstieg', text: 'Wie offen bist du für neue Routinen in kleinen Schritten?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 16, category: 'Einstieg', text: 'Was ist aktuell dein größter innerer Antreiber?', options: ['Leistungsfähigkeit', 'Lebensqualität', 'Vorsorge', 'Selbstwirksamkeit', 'Wohlbefinden'] },
    { id: 17, category: 'Einstieg', text: 'Wie klar ist dir aktuell, was du zuerst verändern solltest?', options: ['Gar nicht klar', 'Eher unklar', 'Mittel', 'Eher klar', 'Sehr klar'] },
    { id: 18, category: 'Einstieg', text: 'Wie viel Zeit kannst du realistisch pro Tag für deine Entwicklung investieren?', options: ['Unter 5 Min.', '5–10 Min.', '10–20 Min.', '20–30 Min.', 'Mehr als 30 Min.'] },
    { id: 19, category: 'Einstieg', text: 'Wie möchtest du von True Years am liebsten begleitet werden?', options: ['Sanft erinnernd', 'Motivierend', 'Kurz und direkt', 'Ausführlicher und nachvollziehbarer'] },
    { id: 20, category: 'Einstieg', text: 'Was würde dich am ehesten dazu bringen, langfristig dranzubleiben?', options: ['Sichtbare Fortschritte', 'Einfache Routinen', 'Persönliche Relevanz', 'Gutes Gefühl', 'Klare nächste Schritte'] }
  ],
  Schlaf: [
    { id: 21, category: 'Schlaf', text: 'Wie viele Stunden schläfst du durchschnittlich pro Nacht?', options: ['Unter 5 Stunden', '5 bis 6 Stunden', '6 bis 7 Stunden', '7 bis 8 Stunden', 'Mehr als 8 Stunden'] },
    { id: 22, category: 'Schlaf', text: 'Wie schätzt du deine Schlafqualität ein?', options: ['Sehr schlecht', 'Eher schlecht', 'Mittel', 'Eher gut', 'Sehr gut'] },
    { id: 23, category: 'Schlaf', text: 'Wie lange brauchst du meist zum Einschlafen?', options: ['Unter 15 Min.', '15–30 Min.', '30–60 Min.', 'Mehr als 60 Min.'] },
    { id: 24, category: 'Schlaf', text: 'Wie oft wachst du nachts auf?', options: ['Nie', '1 Mal', '2 bis 3 Mal', 'Häufiger'] },
    { id: 25, category: 'Schlaf', text: 'Welches Schlafmuster passt aktuell am ehesten zu dir?', options: ['Schweres Einschlafen', 'Häufiges Aufwachen', 'Zu kurze Nächte', 'Wechselnder Rhythmus', 'Morgens müde', 'Stabiler Schlaf'] },
    { id: 26, category: 'Schlaf', text: 'Wie regelmäßig ist dein Schlafrhythmus?', options: ['Sehr unregelmäßig', 'Eher unregelmäßig', 'Teils-teils', 'Eher regelmäßig', 'Sehr regelmäßig'] },
    { id: 27, category: 'Schlaf', text: 'Wie ist dein Energielevel normalerweise direkt nach dem Aufstehen?', options: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 28, category: 'Schlaf', text: 'Wie gut gelingt es dir tagsüber, kurze Erholungspausen einzubauen?', options: ['Gar nicht', 'Selten', 'Manchmal', 'Regelmäßig', 'Sehr regelmäßig'] },
    { id: 29, category: 'Schlaf', text: 'Wie gut kannst du nach Arbeit, Familie oder Verpflichtungen abschalten?', options: ['Gar nicht', 'Schlecht', 'Mittel', 'Gut', 'Sehr gut'] },
    { id: 30, category: 'Schlaf', text: 'Welche Erholungsroutinen passen aktuell am besten zu dir?', options: ['Morgenlicht', 'Atemübungen', 'Meditation', 'Body Scan', 'Faszienrolle', 'Yoga', 'Leichtes Stretching', 'Sauna', 'Spaziergänge', 'Naturzeit', 'Waldbaden', 'Lesen', 'Musik', 'Digital Detox', 'Handy aus Schlafzimmer'], isMultiSelect: true }
  ],
  Kraft: [
    { id: 31, category: 'Kraft', text: 'Wie aktiv bist du im Alltag?', options: ['Kaum aktiv', 'Eher wenig aktiv', 'Mittel', 'Aktiv', 'Sehr aktiv'] },
    { id: 32, category: 'Kraft', text: 'An wie vielen Tagen pro Woche bewegst du dich bewusst?', options: ['0 Tage', '1–2 Tage', '3–4 Tage', '5–6 Tage', 'Täglich'] },
    { id: 33, category: 'Kraft', text: 'Wie schätzt du deine körperliche Fitness ein?', options: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Gut', 'Sehr gut'] },
    { id: 34, category: 'Kraft', text: 'Wie oft machst du Krafttraining?', options: ['Nie', '1x pro Woche', '2x pro Woche', '3x pro Woche', '4x oder öfter'] },
    { id: 35, category: 'Kraft', text: 'Wie oft machst du Ausdauertraining?', options: ['Nie', '1x pro Woche', '2x pro Woche', '3x pro Woche', '4x oder öfter'] },
    { id: 36, category: 'Kraft', text: 'Wie oft machst du Dehnübungen?', options: ['Nie', 'Selten', 'Manchmal', 'Regelmäßig'] },
    { id: 37, category: 'Kraft', text: 'Wie lange sitzt du durchschnittlich pro Tag?', options: ['Unter 4 Stunden', '4–6 Stunden', '6–8 Stunden', 'Über 8 Stunden'] },
    { id: 38, category: 'Kraft', text: 'Was motiviert dich am meisten zu Bewegung?', options: ['Besseres Körpergefühl', 'Mehr Energie', 'Stressabbau', 'Figur', 'Leistungsfähigkeit', 'Soziale Aktivität'] },
    { id: 39, category: 'Kraft', text: 'Was ist deine größte Hürde für regelmäßige Bewegung?', options: ['Zeit', 'Energie', 'Motivation', 'Körperliche Einschränkung', 'Fehlende Routine'] },
    { id: 40, category: 'Kraft', text: 'Welche Art von Bewegung passt am besten zu dir?', options: ['Spazieren', 'Radfahren', 'Joggen', 'Wandern', 'Schwimmen', 'Krafttraining', 'Yoga', 'Pilates', 'Tanz', 'Fußball', 'Tennis', 'Keine'], isMultiSelect: true }
  ],
  Zellversorgung: [
    { id: 41, category: 'Zellversorgung', text: 'Welcher Ernährungsstil trifft am ehesten auf dich zu?', options: ['Klassisch gemischt', 'Eiweißorientiert', 'Vegetarisch / Vegan', 'Kohlenhydratreduziert'] },
    { id: 42, category: 'Zellversorgung', text: 'Wie regelmäßig sind deine Mahlzeiten?', options: ['Sehr unregelmäßig', 'Eher unregelmäßig', 'Teils-teils', 'Eher regelmäßig', 'Sehr regelmäßig'] },
    { id: 43, category: 'Zellversorgung', text: 'Wie schätzt du deine Eiweißzufuhr ein?', options: ['Sehr niedrig', 'Eher niedrig', 'Ausreichend', 'Gut', 'Sehr gut'] },
    { id: 44, category: 'Zellversorgung', text: 'Wie hoch ist dein Gemüse- und Frischkostanteil?', options: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 45, category: 'Zellversorgung', text: 'Wie oft hast du Heißhunger oder Snackphasen?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 46, category: 'Zellversorgung', text: 'Wie häufig kommen stark verarbeitete Lebensmittel (Fast Food) vor?', options: ['Nie', 'Selten', 'Manchmal', 'Regelmäßig', 'Sehr häufig'] },
    { id: 47, category: 'Zellversorgung', text: 'Wie wichtig sind dir Lebensmittelqualität, Frische und Bio-Qualität?', options: ['Unwichtig', 'Eher unwichtig', 'Mittel', 'Wichtig', 'Sehr wichtig'] },
    { id: 48, category: 'Zellversorgung', text: 'Reagierst du empfindlich auf bestimmte Lebensmittel?', options: ['Nein', 'Selten', 'Manchmal', 'Häufig', 'Sehr deutlich'] },
    { id: 49, category: 'Zellversorgung', text: 'Wie oft trinkst du Alkohol?', options: ['Nie', 'Selten', '1–2x pro Woche', '3–4x pro Woche', 'Häufiger'] },
    { id: 50, category: 'Zellversorgung', text: 'Wie würdest du deine Vitalität einschätzen?', options: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'] }
  ],
  Immunbalance: [
    { id: 51, category: 'Immunbalance', text: 'Wie stark beeinflussen Schlaf, Stress oder Ernährung deine Widerstandskraft?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Stark', 'Sehr stark'] },
    { id: 52, category: 'Immunbalance', text: 'Wie häufig fühlst du dich in typischen Infektzeiten besonders anfällig?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 53, category: 'Immunbalance', text: 'Wie regelmäßig funktioniert deine Verdauung im Alltag?', options: ['Sehr unregelmäßig', 'Eher unregelmäßig', 'Mittel', 'Eher regelmäßig', 'Sehr regelmäßig'] },
    { id: 54, category: 'Immunbalance', text: 'Wann isst du gewöhnlich deine letzte Mahlzeit des Tages?', options: ['Vor 18 Uhr', '18–20 Uhr', '20–22 Uhr', 'Nach 22 Uhr'] },
    { id: 55, category: 'Immunbalance', text: 'Welche Routinen nutzt du bereits zur Unterstützung deiner Widerstandskraft?', options: ['Schlaf', 'Bewegung', 'Frische Luft', 'Tageslicht', 'Vitamin D', 'Ausgewogene Ernährung', 'Gemüse & Kräuter', 'Fasten / Essenspausen', 'Keine'], isMultiSelect: true },
    { id: 56, category: 'Immunbalance', text: 'Wie häufig bist du im Alltag schlechter Luft, Abgasen oder Feinstaub ausgesetzt?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 57, category: 'Immunbalance', text: 'Wie häufig nutzt du Plastikbehälter oder Plastikflaschen für Essen und Trinken?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 58, category: 'Immunbalance', text: 'Wie häufig nutzt du parfümierte Kosmetik- oder Reinigungsprodukte?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 59, category: 'Immunbalance', text: 'Wie häufig nutzt du beim Kochen Alufolie oder beschichtete Pfannen?', options: ['Nie', 'Selten', 'Manchmal', 'Häufig', 'Sehr häufig'] },
    { id: 60, category: 'Immunbalance', text: 'In welchen Bereichen achtest du bereits auf schadstoffarme Alternativen?', options: ['Lebensmittel', 'Wasser', 'Kosmetik', 'Reinigungsmittel', 'Küchenmaterialien', 'Trinkflaschen', 'Keine'], isMultiSelect: true }
  ],
  'Soziale Bindungen': [
    { id: 61, category: 'Soziale Bindungen', text: 'Wie oft nimmst du dir bewusst Zeit für Dinge, die dir guttun?', options: ['Nie', 'Selten', 'Manchmal', 'Oft', 'Sehr oft'] },
    { id: 62, category: 'Soziale Bindungen', text: 'Wie viel Zeit hast du realistisch für dich selbst?', options: ['Fast keine', 'Wenig', 'Etwas', 'Ausreichend', 'Viel'] },
    { id: 63, category: 'Soziale Bindungen', text: 'Wie oft hast du gute Gespräche oder echten Austausch?', options: ['Nie', 'Selten', 'Manchmal', 'Oft', 'Sehr oft'] },
    { id: 64, category: 'Soziale Bindungen', text: 'Wie regelmäßig verbringst du bewusst Zeit mit Menschen, die dir guttun?', options: ['Nie', 'Selten', 'Manchmal', 'Oft', 'Sehr oft'] },
    { id: 65, category: 'Soziale Bindungen', text: 'Wie leicht fällt es dir, soziale Kontakte aktiv zu pflegen?', options: ['Sehr schwer', 'Eher schwer', 'Mittel', 'Eher leicht', 'Sehr leicht'] },
    { id: 66, category: 'Soziale Bindungen', text: 'Wie stark erlebst du in deinem Alltag Sinn und Zugehörigkeit?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Stark', 'Sehr stark'] },
    { id: 67, category: 'Soziale Bindungen', text: 'Wie ausgewogen ist das Geben und Nehmen in deinen wichtigsten Beziehungen?', options: ['Sehr unausgewogen', 'Eher unausgewogen', 'Mittel', 'Eher ausgewogen', 'Sehr ausgewogen'] },
    { id: 68, category: 'Soziale Bindungen', text: 'Wie sehr geben dir deine sozialen Kontakte Energie statt Kraft zu kosten?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Stark', 'Sehr stark'] },
    { id: 69, category: 'Soziale Bindungen', text: 'Was ist im Umfeld aktuell deine größte Herausforderung?', options: ['Zeit', 'Familie', 'Beruf', 'Fehlende Unterstützung', 'Soziale Belastung'] },
    { id: 70, category: 'Soziale Bindungen', text: 'Welche sozialen Aktivitäten passen aktuell am besten zu dir?', options: ['Treffen mit Freunden', 'Gemeinsam Kochen', 'Sport mit anderen', 'Spieleabend', 'Reisen', 'Hobbys', 'Keine'], isMultiSelect: true }
  ],
  Mindset: [
    { id: 71, category: 'Mindset', text: 'Wie hoch ist dein aktuelles Stresslevel?', options: ['Sehr niedrig', 'Niedrig', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 72, category: 'Mindset', text: 'Wie gut kannst du nach Belastung wieder runterfahren?', options: ['Sehr schlecht', 'Eher schlecht', 'Mittel', 'Eher gut', 'Sehr gut'] },
    { id: 73, category: 'Mindset', text: 'Wie gut gelingt es dir, dranzubleiben, auch wenn Fortschritte nicht sofort sichtbar sind?', options: ['Gar nicht', 'Eher schlecht', 'Mittel', 'Eher gut', 'Sehr gut'] },
    { id: 74, category: 'Mindset', text: 'Wie stabil ist deine Stimmung im Alltag?', options: ['Sehr instabil', 'Eher instabil', 'Mittel', 'Eher stabil', 'Sehr stabil'] },
    { id: 75, category: 'Mindset', text: 'Wie offen bist du für einfache Routinen zur mentalen Stabilisierung?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Hoch', 'Sehr hoch'] },
    { id: 76, category: 'Mindset', text: 'Wie gut gelingt es dir, kleine Fortschritte wertzuschätzen?', options: ['Gar nicht', 'Eher schlecht', 'Mittel', 'Eher gut', 'Sehr gut'] },
    { id: 77, category: 'Mindset', text: 'Wie stark glaubst du daran, dass dein Verhalten langfristig einen Unterschied macht?', options: ['Gar nicht', 'Wenig', 'Mittel', 'Stark', 'Sehr stark'] },
    { id: 78, category: 'Mindset', text: 'Wie gut gelingt es dir, nach Rückschlägen wieder in deine Kraft zu kommen?', options: ['Gar nicht', 'Eher schlecht', 'Mittel', 'Eher gut', 'Sehr gut'] },
    { id: 79, category: 'Mindset', text: 'Wie gut gelingt es dir, fokussiert zu bleiben?', options: ['Gar nicht', 'Eher schlecht', 'Mittel', 'Eher gut', 'Sehr gut'] },
    { id: 80, category: 'Mindset', text: 'Welche mentalen Routinen passen aktuell am besten zu dir?', options: ['Atemübungen', 'Meditation', 'Dankbarkeit', 'Visualisierung', 'Naturzeit', 'Achtsamkeit', 'Prioritäten setzen', 'Keine'], isMultiSelect: true }
  ]
};

const SELECTED_ONBOARDING_FLOW: Question[] = [
  ...QUESTION_POOL.Einstieg,
  ...QUESTION_POOL.Schlaf,
  ...QUESTION_POOL.Kraft,
  ...QUESTION_POOL.Zellversorgung,
  ...QUESTION_POOL.Immunbalance,
  ...QUESTION_POOL['Soziale Bindungen'],
  ...QUESTION_POOL.Mindset
];

export default function OnboardingPage() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({});
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ty_onboarding_answers', JSON.stringify(selectedAnswers));
    }
  }, [selectedAnswers]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ty_onboarding_finished', JSON.stringify(finished));
    }
  }, [finished]);

  const currentQuestion = SELECTED_ONBOARDING_FLOW[currentIdx];
  
  // Calculate progress relative to the current category
  const categoryQuestions = SELECTED_ONBOARDING_FLOW.filter(q => q.category === currentQuestion.category);
  const categoryCurrentIdx = categoryQuestions.indexOf(currentQuestion) + 1;
  const categoryTotalCount = categoryQuestions.length;
  const categoryProgressPercent = Math.round((categoryCurrentIdx / categoryTotalCount) * 100);

  const handleSelectOption = (option: string) => {
    if (currentQuestion.isMultiSelect) {
      const currentSelected = (selectedAnswers[currentQuestion.id] as string[]) || [];
      if (currentSelected.includes(option)) {
        setSelectedAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: currentSelected.filter(item => item !== option)
        }));
      } else {
        setSelectedAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: [...currentSelected, option]
        }));
      }
    } else {
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: option
      }));
    }
  };

  const handleNext = () => {
    if (currentIdx < SELECTED_ONBOARDING_FLOW.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRubricJump = (rubricId: string) => {
    const targetIdx = SELECTED_ONBOARDING_FLOW.findIndex(q => q.category === rubricId);
    if (targetIdx !== -1) {
      setCurrentIdx(targetIdx);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  // Helper to determine the rubric state
  const getRubricStatus = (rubricId: string, index: number) => {
    const currentCategory = currentQuestion.category;
    const currentRubricIndex = RUBRICS.findIndex(r => r.id === currentCategory);
    
    if (index < currentRubricIndex) return 'completed';
    if (index === currentRubricIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="onboarding-page theme-playful">
      {/* TOP MENU BAR (same as Heute) */}
      <div className="top-menu-bar">
        <div style={{ width: '40px' }}></div>
        <WelcomeSection 
          isOnboarding={true}
          onboardingCategory={currentQuestion.category}
          onRubricClick={handleRubricJump}
          onNavigate={(id) => {
            if (id === 'website') window.location.href = '/';
            else window.location.href = `/dashboard?tab=${id}`;
          }}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="onboarding-container">
        {!finished ? (
          <>
            {/* PROGRESS BLOCK */}
            <div className="progress-section">
              <div className="progress-info">
                <span className="category-badge">
                  {RUBRICS.find(r => r.id === currentQuestion.category)?.label || currentQuestion.category}
                </span>
                <span className="step-counter">Frage {categoryCurrentIdx} von {categoryTotalCount}</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${categoryProgressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* QUESTION CARD */}
            <div className="question-card">
              <h2 className="question-text">{currentQuestion.text}</h2>
              {currentQuestion.isMultiSelect && <p className="multiselect-hint">Mehrfachauswahl möglich</p>}

              <div className="options-grid">
                {currentQuestion.options.map((option, idx) => {
                  const answers = selectedAnswers[currentQuestion.id];
                  const isSelected = currentQuestion.isMultiSelect 
                    ? Array.isArray(answers) && answers.includes(option)
                    : answers === option;

                  return (
                    <button
                      key={idx}
                      className={`option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(option)}
                    >
                      <span className="option-indicator">
                        {isSelected && <i className="bi bi-check-lg"></i>}
                      </span>
                      <span className="option-label">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="card-actions">
                <button 
                  className="action-btn back-btn"
                  onClick={handleBack}
                  disabled={currentIdx === 0}
                >
                  Zurück
                </button>
                <button 
                  className="action-btn next-btn"
                  onClick={handleNext}
                  disabled={
                    currentQuestion.isMultiSelect 
                      ? !selectedAnswers[currentQuestion.id] || (selectedAnswers[currentQuestion.id] as string[]).length === 0
                      : !selectedAnswers[currentQuestion.id]
                  }
                >
                  {currentIdx === SELECTED_ONBOARDING_FLOW.length - 1 ? 'Auswerten' : 'Weiter'}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* OUTRO / RESULTS SUMMARY */
          <div className="question-card results-card">
            <div className="results-header">
              <div className="icon-success"><i className="bi bi-check-circle-fill"></i></div>
              <h2>Onboarding abgeschlossen!</h2>
              <p>Vielen Dank für deine Antworten. Lisa AI Coach hat dein persönliches Profil analysiert.</p>
            </div>

            <div className="scores-grid">
              <div className="score-item">
                <span className="score-name">Schlaf & Erholung</span>
                <div className="score-bar-track"><div className="score-bar-fill" style={{ width: '85%', background: '#4498ca' }}></div></div>
                <span className="score-val">Sehr gut</span>
              </div>
              <div className="score-item">
                <span className="score-name">Kraft & Ausdauer</span>
                <div className="score-bar-track"><div className="score-bar-fill" style={{ width: '60%', background: '#22c55e' }}></div></div>
                <span className="score-val">Mittel</span>
              </div>
              <div className="score-item">
                <span className="score-name">Mentale Resilienz</span>
                <div className="score-bar-track"><div className="score-bar-fill" style={{ width: '45%', background: '#06b6d4' }}></div></div>
                <span className="score-val">Ausbaufähig</span>
              </div>
            </div>

            <div className="coach-advice-box">
              <div className="coach-avatar">
                <div className="avatar-img-wrap"><img src="/images/lisa.png" alt="Lisa AI" onError={(e) => { e.currentTarget.src = "/images/woman_53_blonde.png" }} /></div>
                <strong>Lisa AI Coach</strong>
              </div>
              <div className="coach-text">
                <p>„Hallo! Basierend auf deinen Antworten habe ich deinen Plan optimiert. Dein Schlaf ist bereits eine starke Säule. Wir werden uns in den ersten Wochen vor allem auf **einfache Stressabbau-Routinen** (Mentale Resilienz) konzentrieren. Ich freue mich auf die Zusammenarbeit!“</p>
              </div>
            </div>

            <Link href="/dashboard" className="action-btn next-btn finish-btn">
              Zum Dashboard & Plan starten
            </Link>
          </div>
        )}
      </div>

      <style jsx global>{`
        /* GENERAL BASE STYLES */
        .onboarding-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 130px 1rem 2rem;
          transition: background-color 0.5s ease, color 0.5s ease;
          font-family: 'DM Sans', sans-serif;
          background-color: #f2f9f5;
          color: #1e3a2b;
        }

        .onboarding-container {
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: auto 0;
        }

        /* ---------------------------------
           THEME 3: PLAYFUL & BIO-FOCUSED
        --------------------------------- */
        .question-card {
          background: #ffffff;
          border: 2px solid #e1f0e7;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 8px 30px rgba(30, 58, 43, 0.04);
        }
        .category-badge {
          background: #e8f7ee;
          color: #22c55e;
          font-size: calc(0.8rem + 3pt);
          font-weight: 700;
          padding: 0.3rem 0.75rem;
          border-radius: 50px;
          margin-left: -10px;
        }
        .step-counter {
          color: #6b8875;
          font-size: calc(0.85rem + 3pt);
          font-weight: 600;
        }
        .progress-section {
          margin-bottom: 1.5rem;
        }
        .progress-bar-track {
          height: 14px;
          background: #e8f7ee;
          border-radius: 7px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e 0%, #10b981 100%);
          border-radius: 7px;
          transition: width 0.4s ease;
        }
        .question-text {
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: #1e3a2b;
          font-family: 'DM Sans', sans-serif;
        }
        .multiselect-hint {
          font-size: 0.85rem;
          color: #6b8875;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .option-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.5rem;
          background: #ffffff;
          border: 2px solid #e2ebd5;
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 600;
          color: #3b5c47;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          margin-bottom: 0.75rem;
        }
        .option-card:hover {
          border-color: #22c55e;
          background: #f7fdf9;
          transform: translateY(-2px);
        }
        .option-card.selected {
          border-color: #22c55e;
          background: #eafbf1;
          color: #1b4d3e;
          font-weight: 700;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08);
        }
        .option-indicator {
          width: 22px;
          height: 22px;
          border: 2.5px solid #d1e2d4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
        }
        .option-card.selected .option-indicator {
          border-color: #22c55e;
          background: #22c55e;
          color: #ffffff;
        }
        .action-btn {
          padding: 0.75rem 1.75rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .back-btn {
          background: transparent;
          border: 2px solid #e1f0e7;
          color: #6b8875;
        }
        .back-btn:hover:not(:disabled) {
          background: #e8f7ee;
        }
        .back-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .next-btn {
          background: #22c55e;
          border: 2px solid #22c55e;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(34, 197, 94, 0.2);
        }
        .next-btn:hover:not(:disabled) {
          background: #16a34a;
          box-shadow: 0 6px 15px rgba(34, 197, 94, 0.3);
        }
        .next-btn:disabled {
          background: #d1e2d4;
          border-color: #d1e2d4;
          color: #8fa093;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* ACTIONS ROW */
        .card-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* RUBRICS TRACKER STYLES */
        .rubrics-tracker {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          background: #ffffff;
          border-radius: 16px;
          padding: 1rem;
          border: 2px solid #e1f0e7;
          box-shadow: 0 4px 15px rgba(30, 58, 43, 0.02);
        }
        .rubric-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          gap: 10px;
          position: relative;
          text-align: center;
        }
        .rubric-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          background: #f1f5f9;
          color: #94a3b8;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          position: relative;
        }
        .rubric-label {
          font-size: calc(0.72rem + 4pt);
          font-weight: 700;
          color: #94a3b8;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .rubric-label {
            display: none;
          }
        }
        
        /* ACTIVE STATUS */
        .rubric-step.active .rubric-icon-wrap {
          background: #86efac;
          color: #166534;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(134, 239, 172, 0.3);
          transform: scale(1.1);
        }
        .rubric-step.active .rubric-label {
          color: #1e3a2b;
          font-weight: 800;
        }

        /* COMPLETED STATUS */
        .rubric-step.completed .rubric-icon-wrap {
          background: #e8f7ee;
          color: #22c55e;
          border-color: #22c55e;
        }
        .rubric-step.completed .rubric-label {
          color: #6b8875;
        }
        .check-badge {
          position: absolute;
          bottom: -3px;
          right: -3px;
          background: #22c55e;
          color: white;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          border: 1px solid white;
        }

        /* RESULTS VIEW STYLES */
        .results-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .icon-success {
          font-size: 3.5rem;
          color: #22c55e;
          margin-bottom: 1rem;
        }
        .scores-grid {
          width: 100%;
          margin: 2rem 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .score-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 1.5rem;
        }
        .score-name {
          font-weight: 700;
          font-size: 0.95rem;
          width: 140px;
          text-align: left;
        }
        .score-bar-track {
          flex: 1;
          height: 12px;
          background: #f1f5f9;
          border-radius: 6px;
          overflow: hidden;
        }
        .score-bar-fill {
          height: 100%;
          border-radius: 6px;
        }
        .score-val {
          font-weight: 700;
          font-size: 0.9rem;
          width: 90px;
          text-align: right;
          color: #3b5c47;
        }
        .coach-advice-box {
          display: flex;
          gap: 1.5rem;
          background: #f2f9f5;
          border: 1px solid #e1f0e7;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }
        .coach-avatar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .avatar-img-wrap {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #22c55e;
        }
        .avatar-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .coach-avatar strong {
          font-size: 0.75rem;
          color: #3b5c47;
        }
        .coach-text p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #1e3a2b;
        }
        .finish-btn {
          width: 100%;
          display: inline-block;
          text-align: center;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
