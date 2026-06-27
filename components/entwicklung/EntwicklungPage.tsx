'use client';

import { useState, useMemo, useEffect } from 'react';
import LongevityJourney7LevelsPage from '@/components/longevity/LongevityJourney7LevelsPage';
import OnboardingHebelPage from './OnboardingHebelPage';

type SubTab = 'hebel' | 'trends' | 'goals' | 'reports' | 'journey';
type TrendPeriod = '3m' | '6m' | '12m';

interface ActivityItem {
  id: string;
  label: string;
  cluster: string;
}

const wochenAktivitaeten: ActivityItem[] = [
  // Schlaf & Erholung (10 items)
  { id: '8–8,5 Std. geschlafen', label: '8–8,5 Std. geschlafen', cluster: 'Schlaf & Erholung' },
  { id: 'Zur Chronotyp-Zeit geschlafen', label: 'Zur Chronotyp-Zeit geschlafen', cluster: 'Schlaf & Erholung' },
  { id: 'Vor Schlafen bildschirmfrei', label: 'Vor Schlafen bildschirmfrei', cluster: 'Schlaf & Erholung' },
  { id: 'Schlafzimmer kühl + dunkel gehalten', label: 'Schlafzimmer kühl + dunkel gehalten', cluster: 'Schlaf & Erholung' },
  { id: 'Feste Aufstehzeit eingehalten', label: 'Feste Aufstehzeit eingehalten', cluster: 'Schlaf & Erholung' },
  { id: 'Nach 14 Uhr kein Koffein mehr', label: 'Nach 14 Uhr kein Koffein mehr', cluster: 'Schlaf & Erholung' },
  { id: 'Power Nap gemacht', label: 'Power Nap gemacht', cluster: 'Schlaf & Erholung' },
  { id: 'Abendroutine durchgeführt', label: 'Abendroutine durchgeführt', cluster: 'Schlaf & Erholung' },
  { id: 'Wahrgenommene Schlafqualität', label: 'Wahrgenommene Schlafqualität', cluster: 'Schlaf & Erholung' },
  { id: 'Vor Schlaf keinen Alk. konsumiert', label: 'Vor Schlaf keinen Alk. konsumiert', cluster: 'Schlaf & Erholung' },

  // Kraft & Ausdauer (11 items)
  { id: 'Schritte gegangen', label: 'Schritte gegangen', cluster: 'Kraft & Ausdauer' },
  { id: 'Zügig spazieren gegangen', label: 'Zügig spazieren gegangen', cluster: 'Kraft & Ausdauer' },
  { id: 'Joggen gegangen', label: 'Joggen gegangen', cluster: 'Kraft & Ausdauer' },
  { id: 'Krafttraining abgeschlossen', label: 'Krafttraining abgeschlossen', cluster: 'Kraft & Ausdauer' },
  { id: 'Dehnungen durchgeführt', label: 'Dehnungen durchgeführt', cluster: 'Kraft & Ausdauer' },
  { id: 'Rad gefahren', label: 'Rad gefahren', cluster: 'Kraft & Ausdauer' },
  { id: 'Treppen gestiegen', label: 'Treppen gestiegen', cluster: 'Kraft & Ausdauer' },
  { id: 'HIT-Intervalltraining', label: 'HIT-Intervalltraining', cluster: 'Kraft & Ausdauer' },
  { id: 'Dead Hang gehalten', label: 'Dead Hang gehalten', cluster: 'Kraft & Ausdauer' },
  { id: 'Griffkraft-Training durchgeführt', label: 'Griffkraft-Training durchgeführt', cluster: 'Kraft & Ausdauer' },
  { id: 'Cooper-Test: 2,3 km gelaufen', label: 'Cooper-Test: 2,3 km gelaufen', cluster: 'Kraft & Ausdauer' },

  // Zellerneuerung & Wachstum (10 items)
  { id: 'Protein (Ziel 160g) aufgenommen', label: 'Protein (Ziel 160g) aufgenommen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Omega-3-reiche Lebensmittel / Fischöl', label: 'Omega-3-reiche Lebensmittel / Fischöl', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Esspause eingehalten', label: 'Esspause eingehalten', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Vollwertige Hauptmahlzeit gegessen', label: 'Vollwertige Hauptmahlzeit gegessen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Ballaststoffe (Ziel 30g) zugeführt', label: 'Ballaststoffe (Ziel 30g) zugeführt', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Wasser getrunken', label: 'Wasser getrunken', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Gemüse + Obst gegessen', label: 'Gemüse + Obst gegessen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Kein Ultra-Processed-Snacking', label: 'Kein Ultra-Processed-Snacking', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Zuckerarm gegessen', label: 'Zuckerarm gegessen', cluster: 'Zellerneuerung & Wachstum' },
  { id: 'Keinen Alkohol konsumiert', label: 'Keinen Alkohol konsumiert', cluster: 'Zellerneuerung & Wachstum' },

  // Immunbalance & Entlastung (6 items)
  { id: 'Innenraum aktiv gelüftet', label: 'Innenraum aktiv gelüftet', cluster: 'Immunbalance & Entlastung' },
  { id: 'Sonnenschutz bewusst eingehalten', label: 'Sonnenschutz bewusst eingehalten', cluster: 'Immunbalance & Entlastung' },
  { id: 'Nikotinfreien Tag geschafft', label: 'Nikotinfreien Tag geschafft', cluster: 'Immunbalance & Entlastung' },
  { id: 'Atemübung durchgeführt', label: 'Atemübung durchgeführt', cluster: 'Immunbalance & Entlastung' },
  { id: 'Bewusste Auszeit in Natur', label: 'Bewusste Auszeit in Natur', cluster: 'Immunbalance & Entlastung' },
  { id: 'Eine Pause ohne Handy gemacht', label: 'Eine Pause ohne Handy gemacht', cluster: 'Immunbalance & Entlastung' },

  // Selbstfürsorge & Soziale Bindungen (5 items)
  { id: 'Echten sozialen Austausch erlebt', label: 'Echten sozialen Austausch erlebt', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Freund / Familienmitglied kontaktiert', label: 'Freund / Familienmitglied kontaktiert', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Mahlzeit mit Verbundenheit erlebt', label: 'Mahlzeit mit Verbundenheit erlebt', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Unterstützung gegeben/angenommen', label: 'Unterstützung gegeben/angenommen', cluster: 'Selbstfürsorge & Soziale Bindungen' },
  { id: 'Im soz. Kontext alkoholfrei geblieben', label: 'Im soz. Kontext alkoholfrei geblieben', cluster: 'Selbstfürsorge & Soziale Bindungen' },

  // Mentale Resilienz (6 items)
  { id: 'Tageslicht am Morgen getankt', label: 'Tageslicht am Morgen getankt', cluster: 'Mentale Resilienz' },
  { id: 'Mikropause 5 Min. eingebaut', label: 'Mikropause 5 Min. eingebaut', cluster: 'Mentale Resilienz' },
  { id: 'Meditiert', label: 'Meditiert', cluster: 'Mentale Resilienz' },
  { id: 'Dankbarkeits-Journaling', label: 'Dankbarkeits-Journaling', cluster: 'Mentale Resilienz' },
  { id: 'Negativen Gedankenkreislauf durchbrochen', label: 'Negativen Gedankenkreislauf durchbrochen', cluster: 'Mentale Resilienz' },
  { id: 'Social-Media-Zeit um 50% reduziert', label: 'Social-Media-Zeit um 50% reduziert', cluster: 'Mentale Resilienz' }
];

const CLUSTER_CONFIGS: Record<string, { icon: string; color: string; bgColor: string; borderColor: string; lightBg: string }> = {
  'Schlaf & Erholung': {
    icon: 'bi-moon-stars-fill',
    color: '#4498ca',
    bgColor: 'rgba(68, 152, 202, 0.1)',
    borderColor: 'rgba(68, 152, 202, 0.2)',
    lightBg: '#f0f9ff'
  },
  'Kraft & Ausdauer': {
    icon: 'bi-lightning-charge-fill',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    borderColor: 'rgba(34, 197, 94, 0.2)',
    lightBg: '#f0fdf4'
  },
  'Zellerneuerung & Wachstum': {
    icon: 'bi-apple',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    lightBg: '#fffbeb'
  },
  'Immunbalance & Entlastung': {
    icon: 'bi-yin-yang',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    borderColor: 'rgba(6, 182, 212, 0.2)',
    lightBg: '#ecfeff'
  },
  'Selbstfürsorge & Soziale Bindungen': {
    icon: 'bi-heart-fill',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.2)',
    lightBg: '#fdf2f8'
  },
  'Mentale Resilienz': {
    icon: 'bi-sun-fill',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    borderColor: 'rgba(139, 92, 246, 0.2)',
    lightBg: '#f5f3ff'
  }
};

const clusterNames = [
  'Schlaf & Erholung',
  'Kraft & Ausdauer',
  'Zellerneuerung & Wachstum',
  'Immunbalance & Entlastung',
  'Selbstfürsorge & Soziale Bindungen',
  'Mentale Resilienz'
];

const coachConfigs = {
  'lisa-jung': { name: 'Lisa AI', image: '/images/lisa.png' },
  'lisa-alt': { name: 'Lisa AI', image: '/images/lisa_alt.png' },
  'tom-jung': { name: 'Tom AI', image: '/images/tom_jung.png' },
  'tom-alt': { name: 'Tom AI', image: '/images/tom_alt.png' },
};

const wearablesList = [
  { id: 'whoop', name: 'Whoop Armband', image: '/images/whoop.png' },
  { id: 'oura', name: 'Oura Ring', image: '/images/oura_bright.png' },
  { id: 'apple', name: 'Apple Smartwatch', image: '/images/apple_clean.png' },
  { id: 'garmin', name: 'Garmin Smartwatch', image: '/images/garmin_clean.png' }
];

const ACTIVITY_DIAMONDS: Record<string, number> = {
  '8–8,5 Std. geschlafen': 5,
  'Zur Chronotyp-Zeit geschlafen': 3,
  'Vor Schlafen bildschirmfrei': 2,
  'Schlafzimmer kühl + dunkel gehalten': 2,
  'Feste Aufstehzeit eingehalten': 3,
  'Nach 14 Uhr kein Koffein mehr': 2,
  'Power Nap gemacht': 1,
  'Abendroutine durchgeführt': 1,
  'Wahrgenommene Schlafqualität': 4,
  'Vor Schlaf keinen Alk. konsumiert': 2,

  'Schritte gegangen': 4,
  'Zügig spazieren gegangen': 3,
  'Joggen gegangen': 4,
  'Krafttraining abgeschlossen': 4,
  'Dehnungen durchgeführt': 2,
  'Rad gefahren': 4,
  'Treppen gestiegen': 3,
  'HIT-Intervalltraining': 5,
  'Dead Hang gehalten': 3,
  'Griffkraft-Training durchgeführt': 3,
  'Cooper-Test: 2,3 km gelaufen': 4,

  'Protein (Ziel 160g) aufgenommen': 4,
  'Omega-3-reiche Lebensmittel / Fischöl': 3,
  'Esspause eingehalten': 2,
  'Vollwertige Hauptmahlzeit gegessen': 3,
  'Ballaststoffe (Ziel 30g) zugeführt': 4,
  'Wasser getrunken': 2,
  'Gemüse + Obst gegessen': 4,
  'Kein Ultra-Processed-Snacking': 4,
  'Zuckerarm gegessen': 4,
  'Keinen Alkohol konsumiert': 5,

  'Innenraum aktiv gelüftet': 1,
  'Sonnenschutz bewusst eingehalten': 2,
  'Nikotinfreien Tag geschafft': 4,
  'Atemübung durchgeführt': 2,
  'Bewusste Auszeit in Natur': 3,
  'Eine Pause ohne Handy gemacht': 2,

  'Echten sozialen Austausch erlebt': 4,
  'Freund / Familienmitglied kontaktiert': 2,
  'Mahlzeit mit Verbundenheit erlebt': 2,
  'Unterstützung gegeben/angenommen': 3,
  'Im soz. Kontext alkoholfrei geblieben': 3,

  'Tageslicht am Morgen getankt': 3,
  'Mikropause 5 Min. eingebaut': 1,
  'Meditiert': 3,
  'Dankbarkeits-Journaling': 3,
  'Negativen Gedankenkreislauf durchbrochen': 4,
  'Social-Media-Zeit um 50% reduziert': 3
};

interface EntwicklungPageProps {
  onStartSimulation?: () => void;
  onNavigate?: (tab: string) => void;
}

export default function EntwicklungPage({ onStartSimulation, onNavigate }: EntwicklungPageProps) {
  const [activeTab, setActiveTab] = useState<SubTab>('trends');
  const [selectedMetric, setSelectedMetric] = useState<'chronological' | 'difference' | 'dna'>('difference');
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>('12m');
  const [showBioAgeDetails, setShowBioAgeDetails] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [coachVariant, setCoachVariant] = useState<'lisa-jung' | 'lisa-alt' | 'tom-jung' | 'tom-alt'>('lisa-jung');
  const [activeWearableId, setActiveWearableId] = useState<string>('whoop');

  const [calendarAge, setCalendarAge] = useState<number>(46.7);
  const [bioAge, setBioAge] = useState<number>(42.5);
  const [savedYears, setSavedYears] = useState<number>(4.2);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ty-coach-variant');
      if (saved) setCoachVariant(saved as any);

      const savedWearable = localStorage.getItem('ty_selected_wearable');
      if (savedWearable) setActiveWearableId(savedWearable);

      const loadAges = () => {
        const savedCal = localStorage.getItem('ty_onboarding_calendar_age');
        const savedBio = localStorage.getItem('ty_onboarding_bio_age');
        const savedDiff = localStorage.getItem('ty_onboarding_saved_years');
        
        if (savedCal && savedBio && savedDiff) {
          setCalendarAge(parseFloat(savedCal));
          setBioAge(parseFloat(savedBio));
          setSavedYears(parseFloat(savedDiff));
          return;
        }

        // Dynamic fallback: compute age parameters directly if ty_onboarding_answers exists
        const savedAnswersStr = localStorage.getItem('ty_onboarding_answers');
        if (savedAnswersStr) {
          try {
            const answers = JSON.parse(savedAnswersStr);
            const categories = ['Einstieg', 'Schlaf', 'Kraft', 'Zellversorgung', 'Immunbalance', 'Soziale Bindungen', 'Mindset'];
            let totalSaved = 0;

            categories.forEach(cat => {
              if (cat === 'Einstieg') return;
              
              let score = 50;
              if (cat === 'Schlaf') score = 85;
              else if (cat === 'Kraft') score = 48;
              else if (cat === 'Zellversorgung') score = 56;
              else if (cat === 'Immunbalance') score = 52;
              else if (cat === 'Soziale Bindungen') score = 80;
              else if (cat === 'Mindset') score = 36;

              const categoryAnswerKeys = Object.keys(answers).filter(key => {
                const id = parseInt(key);
                if (cat === 'Schlaf' && id >= 21 && id <= 30) return true;
                if (cat === 'Kraft' && id >= 31 && id <= 40) return true;
                if (cat === 'Zellversorgung' && id >= 41 && id <= 50) return true;
                if (cat === 'Immunbalance' && id >= 51 && id <= 60) return true;
                if (cat === 'Soziale Bindungen' && id >= 61 && id <= 70) return true;
                if (cat === 'Mindset' && id >= 71 && id <= 80) return true;
                return false;
              });

              if (categoryAnswerKeys.length > 0) {
                let totalVal = 0;
                categoryAnswerKeys.forEach(k => {
                  const val = answers[parseInt(k)];
                  if (Array.isArray(val)) {
                    totalVal += val.length > 2 ? 80 : 50;
                  } else {
                    const lower = val.toLowerCase();
                    if (lower.includes('sehr gut') || lower.includes('täglich') || lower.includes('sehr hoch') || lower.includes('stark') || lower.includes('nie')) {
                      totalVal += 90;
                    } else if (lower.includes('gut') || lower.includes('oft') || lower.includes('hoch') || lower.includes('selten')) {
                      totalVal += 75;
                    } else if (lower.includes('mittel') || lower.includes('manchmal') || lower.includes('gelegentlich')) {
                      totalVal += 55;
                    } else if (lower.includes('schlecht') || lower.includes('kaum') || lower.includes('wenig')) {
                      totalVal += 35;
                    } else {
                      totalVal += 15;
                    }
                  }
                });
                score = Math.round(totalVal / categoryAnswerKeys.length);
              }

              const savedYearsForCat = parseFloat(((score / 100) * 0.5).toFixed(1));
              totalSaved += savedYearsForCat;
            });

            totalSaved = parseFloat(totalSaved.toFixed(1));
            const calAge = 53;
            const bAge = parseFloat((calAge - totalSaved).toFixed(1));

            setCalendarAge(calAge);
            setBioAge(bAge);
            setSavedYears(totalSaved);

            // Save computed fallback in localStorage for persistence
            localStorage.setItem('ty_onboarding_calendar_age', calAge.toString());
            localStorage.setItem('ty_onboarding_bio_age', bAge.toString());
            localStorage.setItem('ty_onboarding_saved_years', totalSaved.toString());
          } catch (e) {
            console.error('Error parsing answers in fallback', e);
          }
        }
      };
      loadAges();

      const handleSync = () => {
        const updated = localStorage.getItem('ty-coach-variant');
        if (updated) setCoachVariant(updated as any);
      };
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'ty_selected_wearable' && e.newValue) {
          setActiveWearableId(e.newValue);
        }
        if (e.key === 'ty_onboarding_bio_age' || e.key === 'ty_onboarding_calendar_age' || e.key === 'ty_onboarding_saved_years') {
          loadAges();
        }
      };
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('storage', handleSync);
      window.addEventListener('ty-coach-sync', handleSync);
      window.addEventListener('ty-onboarding-age-sync', loadAges);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('storage', handleSync);
        window.removeEventListener('ty-coach-sync', handleSync);
        window.removeEventListener('ty-onboarding-age-sync', loadAges);
      };
    }
  }, []);

  const [checkedActivities, setCheckedActivities] = useState<string[]>([]);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [wochenziel1Progress, setWochenziel1Progress] = useState(2);
  const [wochenziel2Progress, setWochenziel2Progress] = useState(1);
  const [cryoDismissed, setCryoDismissed] = useState(false);
  const [logTimeStr, setLogTimeStr] = useState('20:55 Uhr');
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedCounts = localStorage.getItem('ty-activity-counts');
    if (savedCounts) {
      setActivityCounts(JSON.parse(savedCounts));
    }

    const handleCountsSync = () => {
      const updated = localStorage.getItem('ty-activity-counts');
      if (updated) setActivityCounts(JSON.parse(updated));
    };
    window.addEventListener('ty-counts-sync', handleCountsSync);
    return () => window.removeEventListener('ty-counts-sync', handleCountsSync);
  }, []);

  useEffect(() => {
    const today = new Date();
    const hrs = String(today.getHours()).padStart(2, '0');
    const mins = String(today.getMinutes()).padStart(2, '0');
    setLogTimeStr(`${hrs}:${mins} Uhr`);
  }, []);

  const handleRemoveFeelGood = (id: string) => {
    if (id === 'Cryo-Challenge') {
      setCryoDismissed(true);
    } else {
      toggleActivity(id);
    }
  };

  const currentWeekRange = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    };
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ty-checked-activities');
    if (saved) {
      setCheckedActivities(JSON.parse(saved));
    } else {
      const defaultChecked = ['8–8,5 Std. geschlafen', 'Schritte gegangen'];
      setCheckedActivities(defaultChecked);
      localStorage.setItem('ty-checked-activities', JSON.stringify(defaultChecked));
    }

    const handleSync = () => {
      const updated = localStorage.getItem('ty-checked-activities');
      if (updated) setCheckedActivities(JSON.parse(updated));
    };
    window.addEventListener('ty-activities-sync', handleSync);
    return () => window.removeEventListener('ty-activities-sync', handleSync);
  }, []);

  const filteredActivities = useMemo(() => {
    if (!activitySearchQuery.trim()) return wochenAktivitaeten;
    const q = activitySearchQuery.toLowerCase();
    return wochenAktivitaeten.filter(act => act.label.toLowerCase().includes(q));
  }, [activitySearchQuery]);

  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {
      'Schlaf & Erholung': [],
      'Kraft & Ausdauer': [],
      'Zellerneuerung & Wachstum': [],
      'Immunbalance & Entlastung': [],
      'Selbstfürsorge & Soziale Bindungen': [],
      'Mentale Resilienz': [],
    };
    filteredActivities.forEach(act => {
      if (groups[act.cluster]) {
        groups[act.cluster].push(act);
      }
    });
    return groups;
  }, [filteredActivities]);

  const toggleActivity = (id: string) => {
    const currentCount = activityCounts[id] || 0;
    const nextCount = (currentCount + 1) % 6; // cycles 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0
    
    const nextCounts = { ...activityCounts, [id]: nextCount };
    setActivityCounts(nextCounts);
    localStorage.setItem('ty-activity-counts', JSON.stringify(nextCounts));
    window.dispatchEvent(new Event('ty-counts-sync'));

    let nextChecked = [...checkedActivities];
    if (nextCount === 0) {
      nextChecked = nextChecked.filter(x => x !== id);
    } else if (!nextChecked.includes(id)) {
      nextChecked.push(id);
    }
    setCheckedActivities(nextChecked);
    localStorage.setItem('ty-checked-activities', JSON.stringify(nextChecked));
    window.dispatchEvent(new Event('ty-activities-sync'));
  };

  const handleGeneratePDF = () => {
    if (typeof window === 'undefined') return;
    const button = document.querySelector('.rep-download-btn');
    if (button) button.innerHTML = '<i class="bi bi-hourglass-split"></i> Generiere...';

    const win = window as any;

    const generate = () => {
      const element = document.querySelector('.report-detail-subpage');
      if (!element) return;

      const nav = element.querySelector('.rep-detail-nav');
      if (nav) (nav as HTMLElement).style.display = 'none';

      element.classList.add('pdf-render-mode');

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Monatsreport_${selectedReport?.monthName || 'Report'}_${selectedReport?.year || '2026'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }
      };

      win.html2pdf().set(opt).from(element).toPdf().get('pdf').then((pdfObj: any) => {
        // Add footer dynamically at bottom right of each page
        const totalPages = pdfObj.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdfObj.setPage(i);
          pdfObj.setFontSize(8);
          pdfObj.setTextColor(148, 163, 184); // Slate 400
          
          const userText = `True Years Monatsreport ${selectedReport?.monthName || 'Report'} - Seite ${i}`;
          
          const pageWidth = pdfObj.internal.pageSize.getWidth();
          const pageHeight = pdfObj.internal.pageSize.getHeight();
          
          pdfObj.text(userText, pageWidth - 10, pageHeight - 6, { align: 'right' });
        }

        const blobUrl = pdfObj.output('bloburl');
        window.open(blobUrl, '_blank');
        
        element.classList.remove('pdf-render-mode');
        if (nav) (nav as HTMLElement).style.display = 'flex';
        if (button) button.innerHTML = '<i class="bi bi-file-pdf-fill" style="color: #ef4444; font-size: 1.25rem;"></i> PDF anzeigen';
      }).catch((err: any) => {
        console.error(err);
        element.classList.remove('pdf-render-mode');
        if (nav) (nav as HTMLElement).style.display = 'flex';
        if (button) button.innerHTML = '<i class="bi bi-file-pdf-fill" style="color: #ef4444; font-size: 1.25rem;"></i> PDF anzeigen';
      });
    };

    if (win.html2pdf) {
      generate();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = generate;
      document.body.appendChild(script);
    }
  };

  const [todayStr, setTodayStr] = useState('');
  const [goalDaysLeftLabel, setGoalDaysLeftLabel] = useState('Letzter Tag');
  useEffect(() => {
    const today = new Date();
    const day = today.getDay();
    const dateNum = today.getDate();
    const months = ['JAN', 'FEB', 'MÄR', 'APR', 'MAI', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEZ'];
    const month = months[today.getMonth()];
    setTodayStr(`${dateNum}. ${month}`);

    if (day === 0) {
      setGoalDaysLeftLabel('Letzter Tag');
    } else {
      const daysLeft = 8 - day;
      setGoalDaysLeftLabel(`Noch ${daysLeft} Tage`);
    }
  }, []);



  const trendData = [
    { title: 'Schlaf & Erholung', data: [62, 60, 68, 64, 70, 67, 72, 70, 75, 72, 78, 75] },
    { title: 'Kraft & Ausdauer', data: [55, 58, 60, 63, 67, 70, 72, 75, 78, 80, 83, 84] },
    { title: 'Zellerneuerung & Wachstum', data: [64, 66, 63, 68, 70, 72, 71, 75, 77, 76, 82, 81] },
    { title: 'Immunbalance & Entlastung', data: [82, 78, 80, 74, 76, 70, 72, 65, 68, 60, 64, 62] },
    { title: 'Selbstfürsorge & Soziale Bindungen', data: [72, 71, 73, 72, 72, 74, 73, 71, 72, 73, 72, 73] },
    { title: 'Mentale Resilienz', data: [56, 55, 57, 56, 55, 56, 57, 55, 56, 57, 56, 57] },
  ];

  const activities = [
    { type: 'Krafttraining', date: 'Heute, 17:30', dur: '45 Min', cal: '340 kcal', icon: 'bi-lightning-charge', score: '+12' },
    { type: 'Dead Hang', date: 'Heute, 16:15', dur: '2:30 Min', cal: '25 kcal', icon: 'bi-hand-index-thumb', score: '+4' },
    { type: 'Griffkraft-Test', date: 'Gestern, 18:00', dur: '5 Min', cal: '10 kcal', icon: 'bi-activity', score: '+8' },
    { type: 'Joggen', date: 'Gestern, 08:15', dur: '32 Min', cal: '410 kcal', icon: 'bi-bicycle', score: '+22' },
    { type: 'Atemübung', date: '08. Mai, 22:00', dur: '10 Min', cal: '5 kcal', icon: 'bi-wind', score: '+5' },
    { type: 'Spaziergang', date: '08. Mai, 12:30', dur: '45 Min', cal: '180 kcal', icon: 'bi-person-walking', score: '+9' },
  ];

  const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

  const mockReportsData = useMemo(() => {
    const dynamicAchievements: string[] = [];
    if (checkedActivities.includes('8–8,5 Std. geschlafen')) {
      dynamicAchievements.push('Schlafdauer-Ziel (8–8,5 Std.) regelmäßig eingehalten');
    }
    if (checkedActivities.includes('Zur Chronotyp-Zeit geschlafen')) {
      dynamicAchievements.push('Schlafrhythmus erfolgreich an den Chronotyp angepasst');
    }
    if (checkedActivities.includes('Vor Schlafen bildschirmfrei')) {
      dynamicAchievements.push('Abendliche Bildschirm-Auszeit konsequent umgesetzt');
    }
    if (checkedActivities.includes('Schritte gegangen')) {
      dynamicAchievements.push('Tägliches Schrittziel von über 9.000 Schritten erreicht');
    }
    if (checkedActivities.includes('Krafttraining abgeschlossen')) {
      dynamicAchievements.push('Krafttraining-Einheiten planmäßig absolviert');
    }
    if (checkedActivities.includes('Protein (Ziel 160g) aufgenommen')) {
      dynamicAchievements.push('Optimale Proteinzufuhr (160g) für Muskelregeneration gesichert');
    }
    if (checkedActivities.includes('Esspause eingehalten')) {
      dynamicAchievements.push('Esspausen zur Aktivierung der Autophagie eingehalten');
    }
    if (checkedActivities.includes('Keinen Alkohol konsumiert')) {
      dynamicAchievements.push('Alkoholfreie Phasen zur optimalen Regeneration genutzt');
    }
    if (checkedActivities.includes('Meditiert') || checkedActivities.includes('Atemübung durchgeführt')) {
      dynamicAchievements.push('Mentale Resilienz durch Meditation/Atemübungen gestärkt');
    }
    if (checkedActivities.includes('Tageslicht am Morgen getankt')) {
      dynamicAchievements.push('Morgenlicht-Routine zur Stabilisierung des Biorhythmus etabliert');
    }

    // Default fallbacks if less than 3 matched
    const defaults = [
      '3x Kälteexposition (Eisbad) erfolgreich durchgeführt',
      '22 Tage ohne industriellen Zucker gemeistert',
      'Wochenziel Kraftaufbau zu 100% erfüllt'
    ];
    while (dynamicAchievements.length < 3) {
      const nextDef = defaults.find(d => !dynamicAchievements.includes(d));
      if (nextDef) {
        dynamicAchievements.push(nextDef);
      } else {
        break;
      }
    }

    return [
      {
        monthName: 'Mai',
        year: 2026,
        score: 78,
        diff: '+11',
        isPos: true,
        summary: 'Im Mai hast du herausragende Fortschritte erzielt. Dein Schlaf-Rhythmus hat sich stabilisiert und deine HRV stieg um durchschnittlich 8ms, was auf eine hervorragende Aktivierung des Parasympathikus hindeutet. Deine größte Stellschraube für Juni ist die Reduzierung von späten Mahlzeiten. Versuche, mindestens 3 Stunden vor dem Schlafen nichts mehr zu essen, um deine Tiefschlafphasen weiter zu verlängern und die nächtliche Zellregeneration optimal zu unterstützen.',
        pillars: [
          { name: 'Schlaf & Erholung', score: 78, change: '+8%', status: 'Exzellent', desc: 'Regelmäßige Zubettgehzeiten haben deinen Tiefschlaf stabilisiert.' },
          { name: 'Kraft & Ausdauer', score: 84, change: '+5%', status: 'Exzellent', desc: 'Du hast 85% deiner geplanten HIIT- und Krafteinheiten absolviert.' },
          { name: 'Zellerneuerung & Wachstum', score: 81, change: '+9%', status: 'Gut', desc: 'Gesteigerte Proteinzufuhr hat den Muskelaufbau ideal unterstützt.' },
          { name: 'Immunbalance & Entlastung', score: 62, change: '-4%', status: 'Ausbaufähig', desc: 'Wenig Entlastungstage. Autophagie-Fastenzeiten wurden selten eingehalten.' },
          { name: 'Selbstfürsorge & Soziale Bindungen', score: 73, change: '+1%', status: 'Gut', desc: 'Gute Balance und sozialer Austausch während der Wochenenden.' },
          { name: 'Mentale Resilienz', score: 57, change: '+2%', status: 'Mittel', desc: 'Kurze Mikropausen am Bildschirmarbeitsplatz zeigten erste Entlastung.' },
        ],
        biomarkers: [
          { label: 'HRV', val: '68 ms', change: '+6 ms (Besser)', status: 'better' },
          { label: 'Schlafqualität', val: '91%', change: '+3% (Besser)', status: 'better' },
          { label: 'Ruhepuls', val: '57 bpm', change: '+3 bpm (Schlechter)', status: 'worse' },
          { label: 'Schritte', val: '9.420 / Tag', change: '+840 (Besser)', status: 'better' },
        ],
        achievements: dynamicAchievements,
        nextMonthFokus: [
          'Eiweißzufuhr konstant über 1.5g/kg halten',
          'Späte Mahlzeiten min. 3 Stunden vor dem Schlafen beenden',
          '10 Min. Morgenlicht direkt nach dem Aufstehen tanken'
        ]
      },
      {
        monthName: 'April',
        year: 2026,
        score: 67,
        diff: '-8',
        isPos: false,
        summary: 'Der April war von erhöhten beruflichen Belastungen geprägt, was sich in einer leicht reduzierten Schlafqualität und weniger Trainingseinheiten widerspiegelt. Dein Fokus sollte darauf liegen, die Alltagsbewegung und das Schrittziel im Mai wieder konsequent anzuheben. Versuche zudem, feste Entlastungstage einzubauen und späte Bildschirmarbeit zu meiden, um das Stressniveau am Abend zu senken und die Regeneration deines Nervensystems zu unterstützen.',
        pillars: [
          { name: 'Schlaf & Erholung', score: 70, change: '-5%', status: 'Gut', desc: 'Erhöhte Einschlafzeit durch späte Bildschirmarbeit.' },
          { name: 'Kraft & Ausdauer', score: 79, change: '-3%', status: 'Gut', desc: 'Nur 2 Trainingseinheiten pro Woche im Durchschnitt geschafft.' },
          { name: 'Zellerneuerung & Wachstum', score: 72, change: '+6%', status: 'Gut', desc: 'Ernährungsqualität blieb trotz Stress stabil hoch.' },
          { name: 'Immunbalance & Entlastung', score: 66, change: '+2%', status: 'Gut', desc: 'Erfolgreich mehrere alkoholfreie Wochenenden absolviert.' },
          { name: 'Selbstfürsorge & Soziale Bindungen', score: 72, change: '0%', status: 'Gut', desc: 'Stabiles soziales Umfeld gab Rückhalt in Stressphasen.' },
          { name: 'Mentale Resilienz', score: 55, change: '-2%', status: 'Mittel', desc: 'Cortisol-Niveau durch Stress gefühlt leicht erhöht.' },
        ],
        biomarkers: [
          { label: 'HRV', val: '62 ms', change: '-4 ms', status: 'worse' },
          { label: 'Schlafqualität', val: '88%', change: '-2%', status: 'worse' },
          { label: 'Ruhepuls', val: '56 bpm', change: '+1 bpm', status: 'worse' },
          { label: 'Schritte', val: '8.580 / Tag', change: '-420', status: 'worse' },
        ],
        achievements: [
          'Trotz Stress 80% Nährstoffdichte in der Ernährung gehalten',
          '15 Tage am Stück Schrittziel von 8k Schritten geschafft'
        ],
        nextMonthFokus: [
          'Schlafzimmer kühl und vollkommen dunkel halten',
          'Bildschirmfreie Zeit ab 21 Uhr etablieren',
          'Koffein strikt ab 14 Uhr meiden'
        ]
      },
      {
        monthName: 'März',
        year: 2026,
        score: 75,
        diff: '+4',
        isPos: true,
        summary: 'Ein solider Einstieg im März. Du konntest deine Alltagsbewegung spürbar steigern und hast erste regenerative Atemübungen erfolgreich in deinen Arbeitsalltag integriert. Für den April empfehlen wir, den Fokus verstärkt auf die Schlafhygiene zu legen und Koffein strikt ab 14 Uhr zu meiden. Dies wird dir helfen, die Einschlafzeit zu verkürzen und deine Tiefschlafphasen für eine spürbar bessere Erholung am Morgen weiter zu stabilisieren.',
        pillars: [
          { name: 'Schlaf & Erholung', score: 75, change: '+3%', status: 'Gut', desc: 'Erste positive Effekte durch den Chronotyp-Tagesplaner.' },
          { name: 'Kraft & Ausdauer', score: 82, change: '+7%', status: 'Exzellent', desc: 'Hohe Motivation zu Beginn der Trainingszyklen.' },
          { name: 'Zellerneuerung & Wachstum', score: 66, change: '0%', status: 'Mittel', desc: 'Ernährungsumstellung läuft planmäßig an.' },
          { name: 'Immunbalance & Entlastung', score: 64, change: '+1%', status: 'Mittel', desc: 'Regelmäßiges Lüften und Hydration gesteigert.' },
          { name: 'Selbstfürsorge & Soziale Bindungen', score: 72, change: '+2%', status: 'Gut', desc: 'Gemeinsame gesunde Abendessen mit der Familie etabliert.' },
          { name: 'Mentale Resilienz', score: 57, change: '+4%', status: 'Mittel', desc: 'Tageslicht am Morgen stabilisiert Stimmung.' },
        ],
        biomarkers: [
          { label: 'HRV', val: '66 ms', change: '+3 ms (Besser)', status: 'better' },
          { label: 'Schlafqualität', val: '90%', change: '+1% (Besser)', status: 'better' },
          { label: 'Ruhepuls', val: '55 bpm', change: '-1 bpm (Besser)', status: 'better' },
          { label: 'Schritte', val: '9.000 / Tag', change: '+150 (Besser)', status: 'better' },
        ],
        achievements: [
          'Erfolgreicher Programmstart mit vollständiger Baseline-Diagnostik',
          'Meditation 3x wöchentlich etabliert'
        ],
        nextMonthFokus: [
          'Ausdauerwerte durch HIIT-Training weiter reizen',
          'Esspausen von 12 Stunden auf 14 Stunden steigern',
          'Sozialen Austausch auch unter der Woche aktiv suchen'
        ]
      }
    ];
  }, [checkedActivities]);

  const lastThreeMonths = useMemo(() => {
    const fullMonths = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    const results = [];
    const date = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
      results.push({
        monthName: fullMonths[d.getMonth()],
        year: d.getFullYear(),
      });
    }
    return results;
  }, []);

  // --- DYNAMIC METRICS FOR CIRCLE ---
  const circleValue = useMemo(() => {
    if (selectedMetric === 'chronological') {
      return calendarAge.toFixed(1).replace('.', ',');
    } else if (selectedMetric === 'difference') {
      return bioAge.toFixed(1).replace('.', ',');
    } else {
      return '0,82';
    }
  }, [selectedMetric, calendarAge, bioAge]);

  const circleLabel = selectedMetric === 'dna' ? 'DNA' : 'Jahre';

  // activeDashoffset determines the active stroke outline of the circle based on selected metric.
  // 100% of the circle corresponds to 111 years.
  const activeDashoffset = useMemo(() => {
    if (selectedMetric === 'difference') {
      const P = bioAge / 111;
      return 257.6 * (1 - P);
    } else if (selectedMetric === 'chronological') {
      const P = calendarAge / 111;
      return 257.6 * (1 - P);
    } else {
      // DNA aging rate 0.82x -> 82% fill
      return 257.6 * 0.18;
    }
  }, [selectedMetric, bioAge, calendarAge]);

  return (
    <div className="entw-page">
      {/* Header */}
      <div className="entw-header">
        <h1 className="entw-title">Entwicklung</h1>
      </div>

      {/* Main Tabs */}
      <div className="entw-tabs">
        {[
          { id: 'goals', label: 'Wochenaktivitäten' },
          { id: 'reports', label: 'Monatsreports' },
          { id: 'trends', label: 'Trends' },
          { id: 'hebel', label: 'Lifestyle-Hebel' },
          { id: 'journey', label: 'Journey' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubTab)}
            className={`entw-tab ${activeTab === tab.id ? 'active' : ''}`}
            style={tab.id === 'journey' ? { display: 'inline-flex', alignItems: 'center', gap: '6px' } : undefined}
          >
            {tab.label}
            {tab.id === 'journey' && (
              <span className="premium-badge" style={{
                marginLeft: '4px',
                fontSize: '0.65rem',
                background: 'linear-gradient(135deg, #006ea7 0%, #3b82f6 100%)',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                <i className="bi bi-lock-fill" style={{ fontSize: '0.65rem', color: 'white' }}></i> Premium
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── HEBEL TAB ── */}
      {activeTab === 'hebel' && (
        <OnboardingHebelPage onNavigate={onNavigate || (() => {})} />
      )}

      {/* ── TRENDS TAB ── */}
      {activeTab === 'trends' && (
        <div className="trends-view">
          {/* Aktuelles True Years BioAge Headline */}
          <div className="bioage-headline-row">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Dein True Years BioAge</h2>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} className="bioage-btn-row">
              <button 
                type="button"
                className="upload-trigger-btn" 
                onClick={() => setShowUploadModal(true)}
              >
                <span>BioAge-Optimizer</span>
                <span className="premium-badge" style={{
                  marginLeft: '6px',
                  fontSize: '0.65rem',
                  background: 'linear-gradient(135deg, #006ea7 0%, #3b82f6 100%)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontWeight: 800,
                  textTransform: 'uppercase'
                }}>
                  <i className="bi bi-lock-fill" style={{ fontSize: '0.65rem', color: 'white' }}></i> Premium
                </span>
              </button>
            </div>
          </div>

          {/* BioAge Card */}
          <div className="bioage-card-new">
            <div className="bac-left">
              <div className="bac-circle-container">
                <svg className="bac-circle-svg" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="ageScoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#4498ca" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="41" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                  {/* Active Arc with Rounded Caps */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="41" 
                    fill="none" 
                    stroke="url(#ageScoreGrad)" 
                    strokeWidth="6.5" 
                    strokeDasharray="257.6" 
                    strokeDashoffset={activeDashoffset} 
                    strokeLinecap="round" 
                    filter="url(#softGlow)"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dashoffset 0.4s ease-out' }}
                  />
                </svg>
                <div className="bac-circle-text-box">
                  <span className="bac-circle-val">{circleValue}</span>
                  <span className="bac-circle-lab">{circleLabel}</span>
                </div>
              </div>
            </div>
            
            <div className="bac-right">
              <div className="bac-badges-row">
                <span className="badge-pill badge-excellent">
                  <span className="dot-green"></span>{savedYears >= 5 ? 'Exzellenter Status' : 'Guter Status'}
                </span>
                <span className="badge-pill badge-top5">
                  {savedYears >= 5 ? 'Top 5%' : 'Top 25%'} deiner Altersgruppe
                </span>
              </div>
              
              <div className="bac-stats-grid">
                <div 
                  className={`bac-stat-card ${selectedMetric === 'chronological' ? 'active-metric' : ''}`}
                  onClick={() => setSelectedMetric('chronological')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="bac-stat-label">CHRONOLOGISCH</span>
                  <span className="bac-stat-val" style={{ fontSize: '1.3rem' }}>{calendarAge.toFixed(1).replace('.', ',')} Jahre</span>
                </div>
                <div 
                  className={`bac-stat-card ${selectedMetric === 'difference' ? 'active-metric-green' : ''}`}
                  onClick={() => {
                    setSelectedMetric('difference');
                    setShowBioAgeDetails(true);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="bac-stat-label">DIFFERENZ</span>
                  <span className="bac-stat-val" style={{ fontSize: '1.3rem' }}>-{savedYears.toFixed(1).replace('.', ',')} Jahre jünger</span>
                </div>
                <div 
                  className={`bac-stat-card ${selectedMetric === 'dna' ? 'active-metric' : ''}`}
                  onClick={() => setSelectedMetric('dna')}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="bac-stat-label">DNA-ALTERUNG</span>
                  <span className="bac-stat-val" style={{ fontSize: '1.3rem' }}>0.82x</span>
                </div>
              </div>

              <h3 className="bac-main-text" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                Du alterst aktuell <strong>18,0% langsamer</strong> als der Durchschnitt.
              </h3>
              
              <div className="bac-footer-info">
                <i className="bi bi-info-circle" style={{ marginRight: '8px', color: '#3b82f6', fontSize: '1.15rem', flexShrink: 0 }}></i>
                <span><strong>Datengrundlage Auswertung:</strong> Fragebogen bei Programmstart, Whoop Age, Epi-Proteomic-Age</span>
              </div>
            </div>
          </div>

          {/* Tacho Gauges in development view */}
          {(() => {
            const speedVal = 0.82;
            const speedPercent = Math.max(0, Math.min(1, speedVal / 2.0));
            const speedAngle = Math.PI - (speedPercent * Math.PI);
            const xSpeed = 100 + 80 * Math.cos(speedAngle);
            const ySpeed = 100 - 80 * Math.sin(speedAngle);
            const xNeedleSpeed = 100 + 65 * Math.cos(speedAngle);
            const yNeedleSpeed = 100 - 65 * Math.sin(speedAngle);
            
            const gaugeMin = 30;
            const gaugeMax = 60;
            const percentBio = Math.max(0, Math.min(1, (bioAge - gaugeMin) / (gaugeMax - gaugeMin)));
            const percentCal = Math.max(0, Math.min(1, (calendarAge - gaugeMin) / (gaugeMax - gaugeMin)));
            const angleBio = Math.PI - (percentBio * Math.PI);
            const angleCal = Math.PI - (percentCal * Math.PI);
            const xBio = 100 + 80 * Math.cos(angleBio);
            const yBio = 100 - 80 * Math.sin(angleBio);
            const xCal = 100 + 80 * Math.cos(angleCal);
            const yCal = 100 - 80 * Math.sin(angleCal);
            const xNeedleBio = 100 + 65 * Math.cos(angleBio);
            const yNeedleBio = 100 - 65 * Math.sin(angleBio);
            const isYounger = bioAge <= calendarAge;
            const arcPath = isYounger
              ? `M ${xBio},${yBio} A 80,80 0 0,1 ${xCal},${yCal}`
              : `M ${xCal},${yCal} A 80,80 0 0,1 ${xBio},${yBio}`;
            const arcColor = isYounger ? '#7FD049' : '#ef4444';
            const diffYears = Math.abs(calendarAge - bioAge);
            
            return (
              <div className="gauges-row dev-gauges" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.25rem' }}>
                {/* Card 1: Age Speed */}
                <div className="gauge-card" style={{ position: 'relative', flex: 1 }}>
                  <div className="gauge-tooltip-container">
                    <i className="bi bi-info-circle tooltip-trigger"></i>
                    <div className="gauge-tooltip-text">
                      Das Alterungstempo (Age Speed) gibt an, wie viele biologische Jahre du pro kalendarischem Jahr alterst. Ein Wert von 0,82 bedeutet beispielsweise, dass du in einem normalen Jahr biologisch nur um 0,82 Jahre alterst. Ein Wert unter 1,0 verlangsamt den Alterungsprozess.
                    </div>
                  </div>
                  <div className="gauge-title-wrapper">
                    <h3>True Years Age Speed</h3>
                    <span className="gauge-subtitle">Wie schnell alterst du?</span>
                  </div>
                  <div className="gauge-main-val" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div>{speedVal.toFixed(2).replace('.', ',')} <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#64748b' }}>Bio-Jahre / Jahr</span></div>
                    <span className="speed-badge" style={{ fontSize: '0.95rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: '#e8f7ee', color: '#15803d' }}>
                      Verlangsamte Alterung (Ziel: &lt; 1,0)
                    </span>
                  </div>
                  <div className="gauge-visual-wrapper">
                    <svg viewBox="0 0 200 120" className="gauge-svg-element">
                      <defs>
                        <filter id="speedGlowDev" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#22c55e" floodOpacity="0.4" />
                        </filter>
                        <linearGradient id="speedGradDev" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4498ca" />
                          <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                      </defs>
                      {/* Background track */}
                      <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
                      {/* Ticks */}
                      <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="1,6" style={{ opacity: 0.7 }} />
                      <path d="M26,100 A74,74 0 0,1 174,100" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                      {/* Active colored arc */}
                      <path d={`M20,100 A80,80 0 0,1 ${xSpeed},${ySpeed}`} fill="none" stroke="url(#speedGradDev)" strokeWidth="12" strokeLinecap="round" filter="url(#speedGlowDev)" />
                      {/* Needle */}
                      <line x1="100" y1="100" x2={xNeedleSpeed} y2={yNeedleSpeed} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="100" cy="100" r="8" fill="#1e293b" />
                      <circle cx="100" cy="100" r="3" fill="#ffffff" />
                      {/* Scale labels */}
                      <text x="20" y="118" className="gauge-scale-label">0,0</text>
                      <text x="180" y="118" className="gauge-scale-label" textAnchor="end">2,0</text>
                    </svg>
                  </div>
                  <div className="gauge-bottom-info" style={{ marginTop: '5px' }}>
                    <span className="gauge-bottom-val" style={{ color: '#475569' }}>0,95</span>
                    <span className="gauge-bottom-label">Durchschnitt der letzten 3 Monate</span>
                  </div>
                </div>

                {/* Card 2: BioAge */}
                <div className="gauge-card" style={{ position: 'relative', flex: 1 }}>
                  <div className="gauge-tooltip-container">
                    <i className="bi bi-info-circle tooltip-trigger"></i>
                    <div className="gauge-tooltip-text">
                      Dein biologisches Alter (BioAge) zeigt den Zustand deiner Zellen und deiner allgemeinen Gesundheit im Vergleich zu deinem tatsächlichen (kalendarischen) Alter. Da dein biologisches Alter unter deinem kalendarischen Alter liegt, alterst du gesünder und langsamer.
                    </div>
                  </div>
                  <div className="gauge-title-wrapper">
                    <h3>True Years BioAge</h3>
                    <span className="gauge-subtitle">Wie ist dein inneres biologisches Alter?</span>
                  </div>
                  <div className="gauge-main-val" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div>{bioAge.toFixed(1).replace('.', ',')} <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#64748b' }}>Jahre</span></div>
                    {bioAge <= calendarAge ? (
                      <span className="speed-badge" style={{ fontSize: '0.95rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: '#e8f7ee', color: '#15803d' }}>
                        Biologisch verjüngt um -{diffYears.toFixed(1).replace('.', ',')} Jahre
                      </span>
                    ) : (
                      <span className="speed-badge" style={{ fontSize: '0.95rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: '#fef2f2', color: '#b91c1c' }}>
                        Biologisch gealtert um +{diffYears.toFixed(1).replace('.', ',')} Jahre
                      </span>
                    )}
                  </div>
                  <div className="gauge-visual-wrapper">
                    <svg viewBox="0 0 200 120" className="gauge-svg-element">
                      <defs>
                        <filter id="bioGlowDev" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={arcColor} floodOpacity="0.4" />
                        </filter>
                      </defs>
                      {/* Background track */}
                      <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
                      {/* Ticks */}
                      <path d="M20,100 A80,80 0 0,1 180,100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="1,6" style={{ opacity: 0.7 }} />
                      <path d="M26,100 A74,74 0 0,1 174,100" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                      {/* Active colored arc */}
                      {bioAge !== calendarAge && (
                        <path d={arcPath} fill="none" stroke={arcColor} strokeWidth="12" strokeLinecap="round" filter="url(#bioGlowDev)" />
                      )}
                      <line x1="100" y1="100" x2={xCal} y2={yCal} stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                      {/* Needle */}
                      <line x1="100" y1="100" x2={xNeedleBio} y2={yNeedleBio} stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
                      <circle cx="100" cy="100" r="8" fill="#1e293b" />
                      <circle cx="100" cy="100" r="3" fill="#ffffff" />
                      {/* Scale labels */}
                      <text x="20" y="118" className="gauge-scale-label">30</text>
                      <text x="180" y="118" className="gauge-scale-label" textAnchor="end">60</text>
                    </svg>
                  </div>
                  <div className="gauge-bottom-info" style={{ marginTop: '5px' }}>
                    <span className="gauge-bottom-val" style={{ color: '#475569' }}>{calendarAge.toFixed(1).replace('.', ',')}</span>
                    <span className="gauge-bottom-label">Dein kalendarisches Alter</span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Headline & Period Selector Row */}
          <div className="trends-opt-header">
            <div className="trends-title-group">
              <span className="blue-bar"></span>
              <h2>Trends Optimierungsfelder</h2>
            </div>
            
            <div className="period-selector">
              {(['3m', '6m', '12m'] as TrendPeriod[]).map(p => (
                <button 
                  key={p} 
                  className={`period-btn ${trendPeriod === p ? 'active' : ''}`}
                  onClick={() => setTrendPeriod(p)}
                >
                  {p === '3m' ? '3 Monate' : p === '6m' ? '6 Monate' : '12 Monate'}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Optimization Fields Grid */}
          <div className="tac-grid">
            {trendData.map((t, i) => {
              const periodLen = trendPeriod === '3m' ? 3 : trendPeriod === '6m' ? 6 : 12;
              const displayData = t.data.slice(-periodLen);
              const baseline = displayData[0];
              
              // Dynamic month generation ending in May (index 4)
              const currentMonthIdx = 4; // Mai (2026)
              const labels = Array.from({ length: periodLen }, (_, idx) => {
                const mIdx = (currentMonthIdx - (periodLen - 1 - idx) + 12) % 12;
                const name = monthNames[mIdx];
                return periodLen === 12 ? name.charAt(0) : name;
              });
              
              const currentVal = displayData[displayData.length - 1];
              const changePct = Math.round(((currentVal - baseline) / baseline) * 100);
              
              const isPositive = changePct >= 0;
              const color = isPositive ? '#22c55e' : '#ef4444';
              const trendIcon = isPositive ? '↗' : '↘';
              const formattedPct = `${trendIcon} ${isPositive ? '+' : ''}${changePct}%`;

              const dataMin = Math.min(...displayData);
              const dataMax = Math.max(...displayData);
              const dataRange = dataMax - dataMin || 1;
              
              // Add a bit of padding to top and bottom so the line doesn't hit the absolute edges
              const min = Math.max(0, dataMin - dataRange * 0.1);
              const max = Math.min(100, dataMax + dataRange * 0.1);
              const range = max - min || 1;
              
              // Sparkline points
              const points = displayData.map((v, idx) => {
                const x = (idx / (displayData.length - 1)) * 100;
                const y = 75 - ((v - min) / range) * 60; // Keep slightly away from borders
                return `${x},${y}`;
              }).join(' ');

              // Area fill polygon points
              const areaPoints = `${points} 100,80 0,80`;

              const gradId = `sparkGrad-${i}`;

              return (
                <div key={i} className={`tac-item ${isPositive ? 'pos' : 'neg'}`}>
                  <div className="taci-header" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <span className="taci-label">
                        {t.title.split(' & ').map((part, idx, arr) => (
                          <span key={idx} style={{ display: 'block', lineHeight: '1.25' }}>
                            {idx === 0 ? `${i + 1}. ` : ''}{part}{idx < arr.length - 1 ? ' &' : ''}
                          </span>
                        ))}
                      </span>
                      <div className="taci-score-row" style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                        <span className="taci-score">{Math.round(currentVal)}</span>
                        <span className="taci-unit">Pkt</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        border: '2px solid #4498ca',
                        background: '#f0f9ff',
                        color: '#4498ca',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}>
                        <i className={`bi ${CLUSTER_CONFIGS[t.title]?.icon || 'bi-question-circle'}`}></i>
                      </div>
                      <span className="taci-trend" style={{ color }}>{formattedPct}</span>
                    </div>
                  </div>
                  <div className="taci-sparkline">
                    <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                          <stop offset="100%" stopColor={color} stopOpacity="0.00" />
                        </linearGradient>
                      </defs>
                      {/* Area Fill */}
                      <polygon points={areaPoints} fill={`url(#${gradId})`} />
                      {/* Line */}
                      <polyline points={points} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                  <div className="taci-labels">
                    {labels.map((l, idx) => (
                      <span key={idx} className="visible">{l}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── WOCHENZIELE ── */}
      {activeTab === 'goals' && (
        <div className="goals-view">
          <div className="goals-section-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Deine Wochenziele: <span style={{ fontWeight: 'normal' }}>{currentWeekRange}</span></h2>
            </div>
            <button className="adjust-goals-btn">
              <i className="bi bi-sliders" style={{ marginRight: '6px', color: 'white' }}></i>
              Wochenziele anpassen
            </button>
          </div>

          <div className="wochenziele-grid">
            {/* Card 1 */}
            <div className="wochenziel-card" style={{ paddingBottom: '1.25rem' }}>
              <div className="wzc-top">
                <div className="wzc-left-content">
                  <div className="wzc-badge-container" style={{ marginBottom: '0.4rem' }}><span className="wzc-badge" style={{ background: '#e0f2fe', color: '#0369a1', border: '1.5px solid #bae6fd', fontSize: 'calc(0.68rem + 2pt)', fontWeight: 850, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block' }}>Wochenziel 1</span></div>
                  <h3>Schlafrhythmus stabilisieren</h3>
                  <p>Stelle 4x in Folge regelmäßige Einschlafzeiten sicher (+/- 30 Min.), um maximale Regeneration und vollen Fokus am Tag zu erreichen.</p>
                </div>
                <div className="wzc-date-badge">
                  <i className="bi bi-calendar3"></i>
                  <span>{todayStr}<br/><small>{goalDaysLeftLabel}</small></span>
                </div>
              </div>
              <div className="wzc-progress-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div className="wzc-circles">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`wzc-circle ${i < wochenziel1Progress ? 'done' : 'empty'}`}>
                      {i < wochenziel1Progress && <i className="bi bi-check"></i>}
                    </div>
                  ))}
                </div>
                
                {/* Interactive Controls to the left of progress text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', marginRight: '0.5rem' }}>
                  <button 
                    onClick={() => setWochenziel1Progress(prev => Math.min(4, prev + 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(2, 132, 199, 0.25)',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0369a1'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#0284c7'; e.currentTarget.style.transform = 'none'; }}
                    title="Ereignis hinzufügen"
                  >
                    <i className="bi bi-plus-lg" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}></i>
                  </button>
                  
                  <button 
                    onClick={() => setWochenziel1Progress(prev => Math.max(0, prev - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#fff',
                      color: '#ef4444',
                      border: '2px solid #ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(239, 68, 68, 0.15)',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
                    title="Ereignis löschen"
                  >
                    <i className="bi bi-x-lg" style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 900 }}></i>
                  </button>
                </div>

                <div className="wzc-progress-text" style={{ flexShrink: 0 }}>
                  <strong>{Math.round((wochenziel1Progress / 4) * 100)}%</strong>
                  <span>{wochenziel1Progress}/4 Tagen</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="wochenziel-card" style={{ paddingBottom: '1.25rem' }}>
              <div className="wzc-top">
                <div className="wzc-left-content">
                  <div className="wzc-badge-container" style={{ marginBottom: '0.4rem' }}><span className="wzc-badge" style={{ background: '#dcfce7', color: '#15803d', border: '1.5px solid #bbf7d0', fontSize: 'calc(0.68rem + 2pt)', fontWeight: 850, padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block' }}>Wochenziel 2</span></div>
                  <h3>Kraftaufbau</h3>
                  <p>Absolviere diese Woche 3 Trainingseinheiten, um deinen Bewegungsapparat und deine Haltung nachhaltig zu stärken.</p>
                </div>
                <div className="wzc-date-badge">
                  <i className="bi bi-calendar3"></i>
                  <span>{todayStr}<br/><small>{goalDaysLeftLabel}</small></span>
                </div>
              </div>
              <div className="wzc-progress-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <div className="wzc-circles">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`wzc-circle ${i < wochenziel2Progress ? 'done' : 'empty'}`}>
                      {i < wochenziel2Progress && <i className="bi bi-check"></i>}
                    </div>
                  ))}
                </div>
                
                {/* Interactive Controls to the left of progress text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto', marginRight: '0.5rem' }}>
                  <button 
                    onClick={() => setWochenziel2Progress(prev => Math.min(3, prev + 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(2, 132, 199, 0.25)',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0369a1'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#0284c7'; e.currentTarget.style.transform = 'none'; }}
                    title="Ereignis hinzufügen"
                  >
                    <i className="bi bi-plus-lg" style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 800 }}></i>
                  </button>
                  
                  <button 
                    onClick={() => setWochenziel2Progress(prev => Math.max(0, prev - 1))}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#fff',
                      color: '#ef4444',
                      border: '2px solid #ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 5px rgba(239, 68, 68, 0.15)',
                      transition: 'all 0.2s',
                      padding: 0
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
                    title="Ereignis löschen"
                  >
                    <i className="bi bi-x-lg" style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 900 }}></i>
                  </button>
                </div>

                <div className="wzc-progress-text" style={{ flexShrink: 0 }}>
                  <strong>{Math.round((wochenziel2Progress / 3) * 100)}%</strong>
                  <span>{wochenziel2Progress}/3 Einheiten</span>
                </div>
              </div>
            </div>
          </div>

          <div className="goals-section-header" style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="blue-bar"></span>
              <h2>Deine Next Best Actions bei Wochenzielen</h2>
            </div>
          </div>

          <div className="nba-grid">
            {/* Linke Spalte (passend zum linken Wochenziel: Schlafrhythmus) */}
            <div className="nba-column">
              {/* Action 1 */}
              <div className="nba-card border-green">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-green"></span>Koffein-Sperrzeit ab 14 Uhr</h4>
                  <p className="nba-desc">Verbessert die Schlafqualität und hilft, die Einschlafzeit am Abend stabil zu halten.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Hoch</span>
                  <span className="nba-pillar pillar-schlaf">Schlafrhythmus</span>
                </div>
              </div>

              {/* Action 2 */}
              <div className="nba-card border-orange">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-orange"></span>15 Min. Morgenlicht</h4>
                  <p className="nba-desc">Triggert die Serotonin-Produktion für besseren Schlaf am Abend.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Mittel</span>
                  <span className="nba-pillar pillar-schlaf">Schlafrhythmus</span>
                </div>
              </div>

              {/* Action 3 */}
              <div className="nba-card border-blue">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-blue"></span>Kein Blaulicht ab 21 Uhr</h4>
                  <p className="nba-desc">Verhindert die Blockade der Melatonin-Ausschüttung durch Bildschirme.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Niedrig</span>
                  <span className="nba-pillar pillar-schlaf">Schlafrhythmus</span>
                </div>
              </div>
            </div>

            {/* Rechte Spalte (passend zum rechten Wochenziel: Kraftaufbau) */}
            <div className="nba-column">
              {/* Action 3 */}
              <div className="nba-card border-green">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-green"></span>Protein-Intake optimieren</h4>
                  <p className="nba-desc">Strebe täglich 1,5–2 g Protein je kg Körpergewicht an, um den Muskelaufbau optimal zu unterstützen.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Hoch</span>
                  <span className="nba-pillar pillar-kraft">Kraftaufbau</span>
                </div>
              </div>

              {/* Action 4 */}
              <div className="nba-card border-orange">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-orange"></span>15 Kniebeugen (Squats)</h4>
                  <p className="nba-desc">Stärkt die Gesäß- und Oberschenkelmuskulatur für eine stabile Haltung.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Mittel</span>
                  <span className="nba-pillar pillar-kraft">Kraftaufbau</span>
                </div>
              </div>

              {/* Action 5 */}
              <div className="nba-card border-blue">
                <div className="nba-card-left">
                  <h4 className="nba-title"><span className="dot dot-blue"></span>Griffkraft-Übung</h4>
                  <p className="nba-desc">Fördert die funktionelle Kraft und ist ein starker Langlebigkeits-Indikator.</p>
                </div>
                <div className="nba-card-right">
                  <span className="nba-priority">Niedrig</span>
                  <span className="nba-pillar pillar-kraft">Kraftaufbau</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── EMBEDDED WOCHENAKTIVITÄTEN ── */}
          <div className="activities-view" style={{ marginTop: '3rem' }}>
            <div className="goals-section-header">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="blue-bar"></span>
                <h2>Deine erfassten Wochenaktivitäten: <span style={{ fontWeight: 'normal' }}>{currentWeekRange}</span></h2>
              </div>
            </div>

            <div className="act-search-row">
              <div className="act-search-wrap">
                <i className="bi bi-search" style={{ color: '#94a3b8', marginRight: '8px' }}></i>
                <input
                  type="text"
                  placeholder="Aktivität suchen (z.B. Yoga, Spaziergang, Fokus...)"
                  value={activitySearchQuery}
                  onChange={e => setActivitySearchQuery(e.target.value)}
                  className="act-search-input"
                />
                {activitySearchQuery && (
                  <button className="act-search-clear" onClick={() => setActivitySearchQuery('')}>&times;</button>
                )}
              </div>
            </div>

            <div className="act-count-text">
              49 Aktivitäten in 6 Clustern
            </div>

            <div className="act-cluster-grid">
              {clusterNames.map((clusterName, idx) => {
                const config = CLUSTER_CONFIGS[clusterName];
                const items = groupedActivities[clusterName] || [];
                const totalCount = wochenAktivitaeten.filter(act => act.cluster === clusterName).length;
                const doneCount = wochenAktivitaeten.filter(act => act.cluster === clusterName && checkedActivities.includes(act.id)).length;
                
                return (
                  <div key={clusterName} className="act-cluster-card">
                    <div className="acc-header">
                      <div className="acc-icon-box" style={{ background: config.bgColor, color: config.color }}>
                        <i className={`bi ${config.icon}`} style={{ color: config.color }}></i>
                      </div>
                      <span className="acc-status" style={{ color: config.color }}>
                        {doneCount}/{totalCount} Erledigt
                      </span>
                    </div>
                    
                    <div className="acc-title-box">
                      <h3>{idx + 1}. {clusterName}</h3>
                      <div className="acc-underline" style={{ background: config.color }}></div>
                    </div>
                    
                    <div className="acc-list">
                      {items.length === 0 ? (
                        <div style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.85rem', padding: '0.5rem 0' }}>Keine Treffer</div>
                      ) : (
                        items.map(act => {
                          const isChecked = checkedActivities.includes(act.id);
                          return (
                            <div
                              key={act.id}
                              className={`acc-item ${isChecked ? 'checked' : ''}`}
                              onClick={() => toggleActivity(act.id)}
                              style={isChecked ? { background: config.lightBg } : {}}
                            >
                              <div className="acc-checkbox" style={isChecked ? { background: config.color, borderColor: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}>
                                {isChecked && (
                                  (activityCounts[act.id] || 1) > 1 ? (
                                    <span style={{ color: 'white', fontSize: '0.62rem', fontWeight: 900, lineHeight: 1 }}>
                                      {activityCounts[act.id]}x
                                    </span>
                                  ) : (
                                    <i className="bi bi-check-lg" style={{ color: 'white', fontSize: '0.8rem' }}></i>
                                  )
                                )}
                              </div>
                              <span className="acc-label">
                                {act.label}
                                {isChecked && (
                                  <span style={{ color: '#0284c7', marginLeft: '6px', fontSize: '0.85rem', fontWeight: 800 }}>
                                    (💎 +{(ACTIVITY_DIAMONDS[act.id] || 2) * (activityCounts[act.id] || 1)})
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── FEEL GOOD AREA AKTIVITÄTEN ── */}
            <div className="feelgood-activities-section" style={{ marginTop: '3rem', width: '100%' }}>
              <div className="goals-section-header" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="blue-bar" style={{ background: '#38bdf8' }}></span>
                  <h2>Deine Feel-Good-Aktivitäten: <span style={{ fontWeight: 'normal' }}>{currentWeekRange}</span></h2>
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '24px', border: '1.5px solid #cbd5e1', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                {(() => {
                  const feelGoodActivitiesList = [
                    { id: 'Cryo-Challenge', name: 'Cryo-Challenge', detail: '2 Min. Eisdusche', diamonds: 5, icon: '❄️' },
                    { id: 'alchemist-elixir', name: 'Elixier des Zell-Recyclings', detail: '14 Std. Fasten + Eisdusche', diamonds: 5, icon: '🧪' },
                    { id: 'Tageslicht am Morgen getankt', name: 'Morgenlicht getankt', detail: '15 Min. Sonne', diamonds: 3, icon: '☀️' },
                    { id: 'Meditiert', name: 'Tiefen-Resilienz Meditation', detail: '15 Min. Atem & Geist', diamonds: 3, icon: '🧘' }
                  ];

                  const completedFeelGood = feelGoodActivitiesList.filter(act => {
                    if (act.id === 'Cryo-Challenge') return !cryoDismissed;
                    return checkedActivities.includes(act.id);
                  });

                  if (completedFeelGood.length === 0) {
                    return <div style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>Noch keine Feel Good Aktivitäten absolviert.</div>;
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {completedFeelGood.map((act, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1rem 1.25rem', transition: 'all 0.2s ease', flexWrap: 'wrap', gap: '1rem' }} className="fg-activity-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                              {act.icon}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <strong style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>{act.name}</strong>
                              <span style={{ fontSize: 'calc(0.85rem + 2pt)', color: '#64748b', fontWeight: 500 }}>{act.detail}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 'calc(0.85rem + 2pt)', color: '#64748b', fontWeight: 500 }}>Eingetragen: Heute, {logTimeStr}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.5rem 1rem', borderRadius: '12px', color: '#0369a1', fontWeight: 800, fontSize: '0.95rem' }}>
                              <span>💎</span>
                              <span>+{act.diamonds} Diamanten verdient</span>
                            </div>
                            
                            {/* Round X Delete Button */}
                            <button 
                              onClick={() => handleRemoveFeelGood(act.id)}
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: '#fff',
                                color: '#ef4444',
                                border: '2px solid #ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(239, 68, 68, 0.15)',
                                transition: 'all 0.2s',
                                padding: 0,
                                flexShrink: 0
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
                              title="Aktivität löschen"
                            >
                              <i className="bi bi-x-lg" style={{ color: '#ef4444', fontSize: '1rem', fontWeight: 900 }}></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {activeTab === 'reports' && (
        <div className="reports-view">
          {!selectedReport ? (
            <>
              <div className="goals-section-header" style={{ marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="blue-bar"></span>
                  <h2>Deine Monatsreports</h2>
                </div>
              </div>
              <p style={{ color: '#64748b', fontSize: '1.25rem', margin: '0 0 2rem 0', fontWeight: 500 }}>
                Analysiere deine Fortschritte und entdecke personalisierte Empfehlungen
              </p>

              <div className="rep-grid-custom">
                {mockReportsData.map((m, idx) => {
                  let bgClass = "bg-blue";
                  let strokeClass = "stroke-blue";
                  let barHeights = ['8px', '8px', '16px', '12px', '18px', '10px', '14px', '22px'];

                  if (idx === 1) {
                    bgClass = "bg-dark";
                    strokeClass = "stroke-dark";
                    barHeights = ['14px', '8px', '16px', '14px', '14px', '14px', '22px', '16px'];
                  } else if (idx === 2) {
                    bgClass = "bg-green";
                    strokeClass = "stroke-green";
                    barHeights = ['12px', '8px', '14px', '14px', '18px', '14px', '20px', '16px'];
                  }

                  return (
                    <div 
                      key={idx} 
                      className="rep-card-custom" 
                      onClick={() => setSelectedReport(m)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={`rep-card-top ${bgClass}`}>
                        <div className="rep-top-header">
                          <span className="rep-meta" style={{ color: '#ffffff', opacity: 1 }}>
                            <i className="bi bi-file-earmark-text" style={{ marginRight: '6.5px', color: '#ffffff' }}></i>
                            Monatsreport
                          </span>
                        </div>
                        <div className="rep-month-year">
                          <h3>{m.monthName}</h3>
                          <span className="rep-year">{m.year}</span>
                        </div>
                        <div className="rep-mini-chart">
                          {barHeights.map((h, bIdx) => (
                            <div key={bIdx} className="rep-bar" style={{ height: h }}></div>
                          ))}
                        </div>
                      </div>
                      <div className="rep-card-bottom">
                        <div className="rep-bottom-left">
                          <span className="rep-index-label">LIFESTYLE INDEX</span>
                          <div className="rep-score-row">
                            <span className="rep-score-val">{m.score}</span>
                            <span className={`rep-diff-badge ${m.isPos ? 'pos' : 'neg'}`}>{m.diff}</span>
                          </div>
                        </div>
                        <div className="rep-bottom-right">
                          <div className="rep-circle-wrap">
                            <svg className="rep-circle-svg" viewBox="0 0 36 36">
                              <path
                                className="rep-circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="3.5"
                              />
                              <path
                                className={`rep-circle-fg ${strokeClass}`}
                                strokeDasharray={`${m.score}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="rep-circle-text">{m.score}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* REPORT DETAIL SUB-PAGE */
            <div className="report-detail-subpage animate-fadeIn">
              {/* Navigation Back & Download */}
              <div className="rep-detail-nav">
                <button className="rep-back-btn" onClick={() => setSelectedReport(null)}>
                  <i className="bi bi-chevron-left"></i> Zurück zur Monatsübersicht
                </button>
                <button className="rep-download-btn" onClick={handleGeneratePDF}>
                  <i className="bi bi-file-pdf-fill" style={{ color: '#ef4444', fontSize: '1.25rem' }}></i> PDF anzeigen
                </button>
              </div>

              {/* Branding Header at the top of the report/PDF */}
              <div className="rep-detail-branding">
                <div className="rep-branding-left">
                  <img src="/images/logoneu.png" alt="True Years Logo" className="rep-branding-logo-img" />
                </div>
              </div>

              {/* Chronotyp Banner Image */}
              <div className="rep-detail-banner-wrap">
                <img 
                  src="/images/sleep_option_16.jpg" 
                  alt="Circadianer Rhythmus" 
                  className="rep-detail-banner-img"
                />
              </div>

              {/* Header Title Info */}
              <div className="rep-detail-header-row">
                <div>
                  <h2 className="rep-detail-title">Monatsreport {selectedReport.monthName} {selectedReport.year}</h2>
                  <p className="rep-detail-subtitle">Auswertung deiner Lebensstil-Metriken</p>
                </div>
                
                {/* Score badge next to title */}
                <div className="rep-detail-score-box">
                  <div className="rep-detail-score-circle">
                    <span className="rdsc-val">{selectedReport.score}</span>
                    <span className="rdsc-label">Pkt.</span>
                  </div>
                  <div className="rep-detail-score-info">
                    <span className="rdsi-label">Lifestyle Index</span>
                    <span className={`rdsi-change ${selectedReport.isPos ? 'pos' : 'neg'}`}>
                      {selectedReport.isPos ? '↗' : '↘'} {selectedReport.diff} Pkt. <span style={{ fontWeight: 'normal', color: '#64748b' }}>im Vergleich zum Vormonat</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="rep-summary-card">
                <div className="rsc-header">
                  <div className="rsc-coach-avatar-wrap">
                    <img 
                      src={coachConfigs[coachVariant]?.image || '/images/lisa.png'} 
                      alt={coachConfigs[coachVariant]?.name || 'Lisa AI'} 
                      className="rsc-coach-avatar"
                    />
                    <span className="rsc-coach-badge">AI</span>
                  </div>
                  <div>
                    <h3 className="rsc-coach-title">Zusammenfassung &amp; Empfehlung</h3>
                    <span className="rsc-coach-subtitle">Feedback von {coachConfigs[coachVariant]?.name || 'Lisa AI'}</span>
                  </div>
                </div>
                <p className="rsc-text">{selectedReport.summary}</p>
              </div>

              {/* Biomarkers snapshot */}
              <div className="rep-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="blue-bar"></span>
                  <h3>Monatsdurchschnitt auf Basis deiner Wearable-Daten</h3>
                </div>
                {/* Source Badge with Image */}
                <div className="rep-wearable-source-badge">
                  <span className="rwsb-label">Quelle:</span>
                  <div className="rwsb-wrapper">
                    <img 
                      src={wearablesList.find(w => w.id === activeWearableId)?.image || '/images/whoop.png'} 
                      alt={wearablesList.find(w => w.id === activeWearableId)?.name || 'Whoop Armband'} 
                      className="rwsb-img"
                    />
                    <span className="rwsb-name">{wearablesList.find(w => w.id === activeWearableId)?.name || 'Whoop Armband'}</span>
                    <span className="rwsb-status-dot"></span>
                  </div>
                </div>
              </div>
              
              <div className="rep-biomarker-grid">
                {selectedReport.biomarkers.map((bio: any, bIdx: number) => {
                  const statusClass = bio.status === 'better' ? 'pos' : bio.status === 'worse' ? 'neg' : 'neutral';
                  return (
                    <div key={bIdx} className="rep-bio-card">
                      <span className="rbc-label">{bio.label}</span>
                      <span className="rbc-value">{bio.val}</span>
                      <span className={`rbc-change ${statusClass}`}>
                        {bio.change}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pillars Score */}
              <div className="rep-section-title rep-pillars-section-title">
                <span className="blue-bar"></span>
                <h3>Auswertung der 6 Optimierungsfelder</h3>
              </div>

              <div className="rep-pillars-grid">
                {selectedReport.pillars.map((pillar: any, pIdx: number) => {
                  const isPos = !pillar.change.includes('-');
                  const statusClass = pillar.status === 'Exzellent' ? 'excellent' : pillar.status === 'Gut' ? 'gut' : 'middle';
                  return (
                    <div key={pIdx} className="rep-pillar-detail-card">
                      <div className="rpdc-header">
                        <div className="rpdc-title-group">
                          <span className="rpdc-num">{pIdx + 1}</span>
                          <h4>{pillar.name}</h4>
                        </div>
                        <span className={`rpdc-status ${statusClass}`}>
                          {pillar.status === 'Ausbaufähig' ? (
                            <>Ausbau-<br />fähig</>
                          ) : (
                            pillar.status
                          )}
                        </span>
                      </div>
                      <div className="rpdc-score-row">
                        <div className="rpdc-score-num">
                          <span className="rpdc-score-val">{pillar.score}</span>
                          <span className="rpdc-score-lbl">Pkt.</span>
                        </div>
                        <span className={`rpdc-change ${isPos ? 'pos' : 'neg'}`}>
                          {pillar.change}
                        </span>
                      </div>
                      <p className="rpdc-desc">{pillar.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Achievements & Next Month Focus */}
              <div className="rep-goals-comparison">
                <div className="rep-goals-col">
                  <div className="rgc-header bg-green-tint">
                    <i className="bi bi-trophy-fill text-green"></i>
                    <h3>Erfolge im {selectedReport.monthName}</h3>
                  </div>
                  <div className="rgc-body">
                    {selectedReport.achievements.map((ach: string, aIdx: number) => (
                      <div key={aIdx} className="rgc-item">
                        <i className="bi bi-check-circle-fill text-green"></i>
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rep-goals-col">
                  <div className="rgc-header bg-blue-tint">
                    <i className="bi bi-compass-fill text-blue"></i>
                    <h3>Fokus für {selectedReport.monthName === 'Mai' ? 'Juni' : selectedReport.monthName === 'April' ? 'Mai' : 'April'}</h3>
                  </div>
                  <div className="rgc-body">
                    {selectedReport.nextMonthFokus.map((fok: string, fIdx: number) => (
                      <div key={fIdx} className="rgc-item">
                        <i className="bi bi-arrow-right-circle-fill text-blue"></i>
                        <span>{fok}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── JOURNEY ── */}
      {activeTab === 'journey' && (
        <LongevityJourney7LevelsPage />
      )}

      {/* ── BIO AGE DETAILS MODAL ── */}
      {showBioAgeDetails && (
        <div className="modal-overlay" onClick={() => setShowBioAgeDetails(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '740px', borderRadius: '28px', padding: '2.5rem' }}>
            <button className="modal-close" onClick={() => setShowBioAgeDetails(false)} style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
            </button>
            
            <div className="modal-header-custom">
              <h2 className="modal-title-custom">BioAge Optimierungsfelder</h2>
              <p className="modal-subtitle-custom">Diese 6 Säulen bestimmen dein aktuelles biologisches Alter</p>
            </div>

            <div className="opt-modal-grid">
              {[
                { title: 'Schlaf & Erholung', val: '-1.5 J.', icon: 'bi-moon-stars', type: 'green' },
                { title: 'Kraft & Ausdauer', val: '-1.2 J.', icon: 'bi-lightning-charge', type: 'green' },
                { title: 'Zellerneuerung & Wachstum', val: '-0.9 J.', icon: 'bi-cup-hot', type: 'green' },
                { title: 'Immunbalance & Entlastung', val: '+0.5 J.', icon: 'bi-wind', type: 'red' },
                { title: 'Selbstfürsorge & Soziale Bindungen', val: '-0.6 J.', icon: 'bi-people', type: 'green' },
                { title: 'Mentale Resilienz', val: '-0.5 J.', icon: 'bi-stars', type: 'green' },
              ].map((item, idx) => (
                <div key={idx} className={`opt-pill-card ${item.type === 'green' ? 'green-tint' : 'red-tint'}`}>
                  <div className="opt-pill-left">
                    <div className="opt-pill-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <span className="opt-pill-label">{item.title}</span>
                  </div>
                  <span className={`opt-pill-val ${item.type === 'green' ? 'green-text' : 'red-text'}`}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="opt-modal-btn"
                onClick={() => {
                  setActiveTab('journey');
                  setShowBioAgeDetails(false);
                }}
              >
                Zur Longevity Reise <i className="bi bi-arrow-right" style={{ marginLeft: '4px' }}></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL ── */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content upload-modal-content" onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '1000px', borderRadius: '28px', padding: '2.05rem 2rem 2.25rem 2rem', background: '#e0f2fe' }}>
            <button className="modal-close" onClick={() => setShowUploadModal(false)} style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', top: '1.5rem', right: '1.5rem' }}>
              <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
            </button>
            
            <div className="modal-header-custom" style={{ marginBottom: '0.35rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(68,152,202,0.12)' }}>
                  <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '1.0rem', color: '#4498ca' }}></i>
                </div>
                <h2 className="modal-title-custom" style={{ margin: 0, fontSize: '1.55rem' }}>BioAge Nachweise hochladen</h2>
              </div>
              <p className="modal-subtitle-custom" style={{ fontSize: '1.18rem', margin: '5px 0', lineHeight: '1.3' }}>Wähle einen BioAge-Nachweis aus, den du deinem Profil hinzufügen möchtest,<br/>damit dein biologisches Alter präziser eingeschätzt werden kann.</p>
            </div>

            <div className="upload-grid">
              {[
                { title: <>Wearable Age<br/></>, providers: '(WHOOP / Oura / Garmin)', desc: 'Alterseinschätzung über Schlaf, HRV, Erholung und Aktivität', img: '/images/four_wearables.png', color: '#3b82f6', fit: 'contain' },
                { title: <>Functional Fitness Age<br/></>, providers: '(Technogym / EGYM)', desc: 'Funktionelles Alter über Kraft, Ausdauer, Balance & Körperbau', img: '/images/technogym_kiosk_white_bg.png', color: '#10b981', fit: 'contain' },
                { title: <>Pheno Age<br/></>, providers: '(AWARE / Years)', desc: 'Biologisches Alter auf Basis klassischer Blutmarker', img: '/images/blood_vibrant_white_bg.png', color: '#ef4444', fit: 'contain' },
                { title: <>Molecular Age<br/></>, providers: '(MoleQlar / TruDiagnostic)', desc: 'Molekulare Alterungssignale über DNA-Methylierungsmuster oder Proteinmarker', img: '/images/dna_vibrant_white_bg.png', color: '#8b5cf6', fit: 'contain' },
                { title: 'Pace of Aging', providers: '(MoleQlar / DunedinPACE / TruDiagnostic)', desc: 'Messung der biologischen Alterungsgeschwindigkeit', img: '/images/pace_of_aging_dial2.png', color: '#f59e0b', fit: 'contain' },
                { title: 'Glycan Age', providers: '', desc: 'Immunalterung und Entzündungsniveau auf Basis von Zuckerketten', img: '/images/glycan_antibody_clean_large.png', color: '#0ea5e9', fit: 'contain' },
              ].map((item, idx) => (
                <div key={idx} className="upload-option-card">
                  <div className="upload-option-img-container">
                    <img src={item.img} alt={typeof item.title === 'string' ? item.title : 'BioAge Nachweis'} className="upload-option-img" style={{ objectFit: (item.fit || 'cover') as any, background: item.fit === 'contain' ? 'white' : 'transparent', padding: item.fit === 'contain' ? '10%' : '0' }} />
                  </div>
                  <div className="upload-option-text-container">
                    <div style={{ fontWeight: 800, color: '#1e3a5f', marginBottom: '0.2rem', fontSize: '1.3rem', lineHeight: '1.2' }}>
                      {idx + 1}. {item.title} <span style={{ fontWeight: 500, color: '#64748b', fontSize: '1.08rem', marginLeft: '2px' }}>{item.providers}</span>
                    </div>
                    <div style={{ fontSize: '1.14rem', color: '#64748b', lineHeight: '1.3' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .upload-option-card {
          display: flex;
          align-items: stretch;
          border: 1.5px solid transparent;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          overflow: hidden;
        }
        .upload-option-text-container {
          flex: 1;
          padding: 0.4rem 1rem 0.4rem 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 0.85rem;
        }
        .upload-option-card:hover { 
          border-color: #4498ca !important; 
          box-shadow: 0 10px 25px rgba(68,152,202,0.15) !important; 
          transform: translateY(-4px); 
          background: #bae6fd !important;
        }
        .entw-page { padding: 2rem 2.5rem; max-width: 1200px; margin: 0 auto; color: #1e293b; }
        .entw-header { margin-bottom: 2rem; }
        .entw-title { font-size: 2.4rem; font-weight: 850; letter-spacing: -0.04em; color: #0f172a; margin: 0; }

        /* TABS */
        .entw-tabs { display: flex; gap: 0.75rem; margin-bottom: 2.5rem; }
        .entw-tab { 
          padding: 0.8rem 1.6rem; border-radius: 14px; border: 1.5px solid rgba(68,152,202,0.1);
          background: #f8fafc; color: #64748b; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
        }
        .entw-tab:hover { background: #fff; border-color: #4498ca; color: #4498ca; }
        .entw-tab.active { background: #4498ca; color: white; border-color: #4498ca; box-shadow: 0 4px 15px rgba(68,152,202,0.3); }

        .bioage-headline-row { display: flex; align-items: center; margin-bottom: 1.5rem; justify-content: space-between; }
        .blue-bar { display: inline-block; width: 4px; height: 22px; background: #4498ca; margin-right: 12px; border-radius: 4px; }
        .bioage-headline-row h2 { font-size: 1.45rem; font-weight: 800; color: #1e3a5f; margin: 0; }

        .trends-title-group { display: flex; align-items: center; }
        .trends-title-group h2 { font-size: 1.45rem; font-weight: 800; color: #1e3a5f; margin: 0; }

        .simulation-trigger-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .simulation-trigger-btn:hover {
          background: #16a34a;
        }

        .upload-trigger-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: #4498ca;
          color: white;
          border: none;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .upload-trigger-btn:hover {
          background: #357fa8;
        }

        .bioage-card-new {
          background: white; border-radius: 28px; padding: 2.25rem;
          box-shadow: 0 10px 30px rgba(68,152,202,0.06), 0 1px 8px rgba(0,0,0,0.02);
          border: 1px solid #f1f5f9; display: flex; gap: 2.5rem; align-items: center; margin-bottom: 2.25rem;
        }
        .bac-left { display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .bac-circle-container {
          position: relative; width: 210px; height: 210px;
          display: flex; align-items: center; justify-content: center;
        }
        .bac-circle-svg {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        }
        .bac-circle-text-box {
          position: relative; z-index: 2; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
        }
        .bac-circle-val { font-size: 3.4rem; font-weight: 900; color: #1c2b3e; line-height: 1; letter-spacing: -0.02em; }
        .bac-circle-lab { font-size: 1.25rem; font-weight: 700; color: #8fa0b5; margin-top: 2px; }

        .bac-right { flex: 1; }
        .bac-badges-row { display: flex; gap: 0.75rem; margin-bottom: 0.85rem; flex-wrap: wrap; }
        .badge-pill {
          padding: 0.4rem 0.95rem; border-radius: 100px; font-size: 0.90rem; font-weight: 700;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .badge-excellent { background: rgba(34,197,94,0.1); color: #22c55e; }
        .dot-green { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
        .badge-top5 { background: rgba(68,152,202,0.1); color: #4498ca; }

        .bac-main-text { font-size: 1.45rem; font-weight: 700; color: #1e293b; margin: 0 0 1.25rem 0; line-height: 1.3; }
        .bac-main-text strong { font-weight: 850; color: #0f172a; }

        .bac-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.25rem; }
        .bac-stat-card {
          background: #f8fafc; border-radius: 16px; padding: 1rem 1.25rem;
          border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.25rem;
        }
        .bac-stat-card.active-metric { background: #4498ca; border-color: #4498ca; color: white; transition: all 0.2s; }
        .bac-stat-card.active-metric-green { background: #22c55e; border-color: #22c55e; color: white; transition: all 0.2s; }
        .bac-stat-label { font-size: calc(0.72rem + 2pt); font-weight: 750; color: #94a3b8; letter-spacing: 0.05em; }
        .bac-stat-card.active-metric .bac-stat-label,
        .bac-stat-card.active-metric-green .bac-stat-label { color: rgba(255,255,255,0.85); }
        .bac-stat-val { font-size: 1.4rem; font-weight: 900; color: #0f172a; }
        .bac-stat-card.active-metric .bac-stat-val,
        .bac-stat-card.active-metric-green .bac-stat-val { color: white; }

        .bac-footer-info { display: flex; align-items: center; font-size: 0.95rem; color: #64748b; font-weight: 500; line-height: 1.4; }

        /* Tacho gauge styles */
        .gauge-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .gauge-title-wrapper {
          margin-bottom: 0.75rem;
        }
        .gauge-title-wrapper h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 2px 0;
        }
        .gauge-subtitle {
          font-size: 0.82rem;
          color: #64748b;
        }
        .gauge-main-val {
          font-size: 1.8rem;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .gauge-visual-wrapper {
          width: 100%;
          max-width: 200px;
          height: auto;
        }
        .gauge-svg-element {
          width: 100%;
          height: auto;
        }
        .gauge-scale-label {
          font-size: 10px;
          font-weight: 700;
          fill: #64748b;
        }
        .gauge-bottom-info {
          margin-top: 0.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.3;
        }
        .gauge-bottom-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
        }
        .gauge-bottom-label {
          font-size: 0.8rem;
          color: #64748b;
          text-align: center;
        }
        .speed-badge {
          display: inline-block;
          margin-top: 2px;
        }
        .gauge-tooltip-container {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 10;
        }
        .tooltip-trigger {
          font-size: 1.1rem;
          color: #94a3b8;
          cursor: pointer;
        }
        .gauge-tooltip-text {
          visibility: hidden;
          width: 220px;
          background-color: #1e293b;
          color: #fff;
          text-align: left;
          border-radius: 8px;
          padding: 8px 10px;
          position: absolute;
          z-index: 20;
          bottom: 125%;
          right: 0;
          margin-right: -10px;
          opacity: 0;
          transition: opacity 0.2s ease, visibility 0.2s ease;
          font-size: 0.78rem;
          font-weight: 500;
          line-height: 1.35;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .gauge-tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%;
          right: 14px;
          border-width: 5px;
          border-style: solid;
          border-color: #1e293b transparent transparent transparent;
        }
        .gauge-tooltip-container:hover .gauge-tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        .trends-opt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
        }

        /* PERIOD SELECTOR */
        .period-selector { display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.35rem; border-radius: 12px; width: fit-content; }
        .period-btn { padding: 0.45rem 1.2rem; border-radius: 9px; border: none; background: transparent; color: #64748b; font-size: calc(0.85rem + 2pt); font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .period-btn.active { background: white; color: #1e293b; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

        /* TAC GRID */
        .tac-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .tac-item { 
          background: white; border-radius: 24px; padding: 1.8rem; border: 1.5px solid #f1f5f9;
          transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .tac-item:hover { border-color: #4498ca; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .taci-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.6rem; }
        .taci-label { font-size: 1.25rem; font-weight: 800; color: #1e3a5f; }
        .taci-trend { font-size: 1.2rem; font-weight: 900; margin-top: 2px; }
        .taci-score-row { display: flex; align-items: baseline; gap: 0.3rem; margin-bottom: 1.2rem; }
        .taci-score { font-size: 2.4rem; font-weight: 900; color: #1c2b3e; }
        .taci-unit { font-size: 0.9rem; font-weight: 700; color: #94a3b8; margin-left: 2px; }
        .taci-sparkline { height: 70px; margin-bottom: 1.25rem; }
        .taci-labels { display: flex; justify-content: space-between; padding: 0 0.25rem; }
        .taci-labels span { font-size: 0.75rem; font-weight: 700; color: #a1b0cb; opacity: 1 !important; }

        /* MODAL */
        .modal-overlay { 
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.8);
          backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem;
        }
        .modal-content { 
          background: white; border-radius: 32px; width: 100%; max-width: 600px; max-height: 90vh;
          overflow-y: auto; position: relative; padding: 3rem; box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }
        .modal-close { position: absolute; top: 1.5rem; right: 1.5rem; border: none; background: #f1f5f9; width: 40px; height: 40px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; }
        .modal-header-custom { margin-bottom: 2rem; text-align: left; }
        .modal-title-custom { font-size: 2.1rem; font-weight: 850; color: #1e2b3e; letter-spacing: -0.03em; margin: 0 0 0.4rem 0; }
        .modal-subtitle-custom { color: #70849e; font-size: 1.15rem; font-weight: 600; margin: 0; }
 
        .opt-modal-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.1rem; margin: 2rem 0; }
        .opt-pill-card { display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1.25rem; border-radius: 20px; border: 1.5px solid #f1f5f9; background: #f8fafc; transition: all 0.2s; }
        .opt-pill-card.green-tint { background: #f4fbf7; border-color: rgba(34,197,94,0.1); }
        .opt-pill-card.red-tint { background: #fdf4f4; border-color: rgba(239,68,68,0.1); }
        
        .opt-pill-left { display: flex; align-items: center; gap: 0.95rem; }
        .opt-pill-icon { width: 44px; height: 44px; border-radius: 12px; background: white; border: 1.5px solid #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #2e3e5c; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }
        .opt-pill-card.green-tint .opt-pill-icon { color: #2e3e5c; }
        .opt-pill-card.red-tint .opt-pill-icon { color: #2e3e5c; }
        
        .opt-pill-label { font-size: 0.95rem; font-weight: 750; color: #1c2b3e; line-height: 1.25; }
        .opt-pill-val { font-size: 1.1rem; font-weight: 850; letter-spacing: -0.01em; white-space: nowrap; }
        .opt-pill-val.green-text { color: #22c55e; }
        .opt-pill-val.red-text { color: #ef4444; }
        
        .opt-modal-btn { display: inline-flex; align-items: center; gap: 0.5rem; background: #0f172a; color: white; border: none; padding: 1rem 2.5rem; border-radius: 100px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.15); }
        .opt-modal-btn:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15,23,42,0.2); }

        .upload-modal-content {
          width: 100%;
          max-width: 1000px;
          border-radius: 28px;
          padding: 1rem 2rem 1.25rem 2rem;
          background: #e0f2fe;
          position: relative;
        }

        .upload-option-img-container {
          width: 30%;
          min-width: 80px;
          max-width: 180px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }
        .upload-option-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.45rem;
        }

        /* GOALS / ACTIVITIES / JOURNEY (Shorter styles for brevity) */
        .goals-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .goals-section-header h2 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0;
        }
        .adjust-goals-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: #4498ca;
          color: white;
          border: none;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.2s;
        }
        .adjust-goals-btn:hover {
          background: #357fa8;
        }
        .wochenziele-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .wochenziel-card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #f1f5f9;
          padding: 1.8rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .wzc-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .wzc-left-content h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }
        .wzc-left-content p {
          font-size: 1.12rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }
        .wzc-date-badge {
          background: #e0f2fe;
          border-radius: 12px;
          padding: 0.86rem 1.14rem;
          display: flex;
          align-items: center;
          gap: 0.72rem;
          color: #0369a1;
          height: fit-content;
          flex-shrink: 0;
          font-weight: 700;
          font-size: 1.08rem;
          line-height: 1.2;
          text-align: left;
        }
        .wzc-date-badge i {
          font-size: 1.56rem;
        }
        .wzc-date-badge small {
          font-weight: 500;
          color: #0284c7;
        }
        .wzc-progress-box {
          background: #f8fafc;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .wzc-circles {
          display: flex;
          gap: 0.5rem;
        }
        .wzc-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wzc-circle.done {
          background: #22c55e;
          color: white;
          font-size: 1.3rem;
        }
        .wzc-circle.empty {
          border: 2px dashed #cbd5e1;
          background: transparent;
        }
        .wzc-progress-text {
          text-align: right;
          line-height: 1.2;
        }
        .wzc-progress-text strong {
          display: block;
          font-size: 1.52rem;
          font-weight: 850;
          color: #1e293b;
        }
        .wzc-progress-text span {
          font-size: 1.17rem;
          font-weight: 600;
          color: #64748b;
        }

        /* NEXT BEST ACTIONS */
        .nba-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        .nba-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .nba-card {
          background: white;
          border-radius: 16px;
          border: 1.5px solid #f1f5f9;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          transition: all 0.25s ease;
        }
        .nba-card:hover {
          border-color: #4498ca !important;
          box-shadow: 0 8px 20px rgba(68,152,202,0.08) !important;
          transform: translateY(-2px);
        }
        .nba-card.border-green {
          border-left: 4px solid #22c55e;
        }
        .nba-card.border-orange {
          border-left: 4px solid #f59e0b;
        }
        .nba-card.border-blue {
          border-left: 4px solid #3b82f6;
        }
        .nba-card-left {
          flex: 1;
        }
        .nba-title {
          font-size: 1.26rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 0.35rem 0;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }
        .dot-green {
          background: #22c55e;
        }
        .dot-orange {
          background: #f59e0b;
        }
        .dot-blue {
          background: #3b82f6;
        }
        .nba-desc {
          font-size: 1.06rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }
        .nba-card-right {
          text-align: right;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          align-self: stretch;
          flex-shrink: 0;
        }
        .nba-priority {
          font-size: 1.01rem;
          font-weight: 700;
          color: #4498ca;
        }
        .nba-pillar {
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: 100px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .nba-pillar.pillar-schlaf {
          color: #0369a1;
          background: #e0f2fe;
          border-color: #bae6fd;
        }
        .nba-pillar.pillar-schlaf:hover {
          background: #bae6fd;
          transform: translateY(-1px);
        }
        .nba-pillar.pillar-kraft {
          color: #6b21a8;
          background: #f3e8ff;
          border-color: #e9d5ff;
        }
        .nba-pillar.pillar-kraft:hover {
          background: #e9d5ff;
          transform: translateY(-1px);
        }

        .act-item { display: flex; align-items: center; gap: 1.2rem; background: white; border-radius: 20px; padding: 1.25rem; border: 1.5px solid #f1f5f9; margin-bottom: 1rem; }
        .act-icon { width: 48px; height: 48px; border-radius: 14px; background: #f0f7ff; color: #4498ca; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
        .act-main { flex: 1; }
        .act-type { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .act-date { font-size: 0.8rem; color: #94a3b8; }
        .act-right { text-align: right; }
        .act-dur { font-size: 1rem; font-weight: 700; color: #0f172a; }
        .act-score { font-size: 0.85rem; font-weight: 800; color: #22c55e; }

        .rep-grid-custom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .rep-card-custom {
          background: white;
          border-radius: 28px;
          border: 1.5px solid #f1f5f9;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.025);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .rep-card-custom:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.06);
        }
        .rep-card-top {
          padding: 1.75rem;
          color: white;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 190px;
        }
        .rep-card-top.bg-blue {
          background: #4498ca;
        }
        .rep-card-top.bg-dark {
          background: #1c2b38;
        }
        .rep-card-top.bg-green {
          background: #50b848;
        }
        .rep-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rep-meta {
          font-size: 0.95rem;
          color: #ffffff;
          opacity: 1;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
        .rep-badge-aktuell {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 750;
          color: white;
        }
        .rep-month-year {
          margin-top: 0.75rem;
        }
        .rep-month-year h3 {
          font-size: 2.15rem;
          font-weight: 850;
          margin: 0;
          line-height: 1.1;
        }
        .rep-year {
          font-size: 1.15rem;
          opacity: 0.8;
          font-weight: 600;
        }
        .rep-mini-chart {
          display: flex;
          align-items: flex-end;
          gap: 5px;
          height: 25px;
          margin-top: 1rem;
        }
        .rep-bar {
          flex: 1;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 3px;
          transition: all 0.2s;
        }
        .rep-card-custom:hover .rep-bar {
          background: rgba(255, 255, 255, 0.6);
        }
        .rep-card-bottom {
          padding: 1.5rem 1.75rem;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rep-bottom-left {
          display: flex;
          flex-direction: column;
        }
        .rep-index-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }
        .rep-score-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }
        .rep-score-val {
          font-size: 2.3rem;
          font-weight: 850;
          color: #1e293b;
          line-height: 1;
        }
        .rep-diff-badge {
          font-size: 1.15rem;
          font-weight: 800;
          display: inline-flex;
          align-items: center;
        }
        .rep-diff-badge.pos {
          color: #22c55e;
        }
        .rep-diff-badge.neg {
          color: #ef4444;
        }
        .rep-circle-wrap {
          position: relative;
          width: 56px;
          height: 56px;
        }
        .rep-circle-svg {
          width: 100%;
          height: 100%;
        }
        .rep-circle-fg {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .rep-circle-fg.stroke-blue {
          stroke: #4498ca;
        }
        .rep-circle-fg.stroke-dark {
          stroke: #1c2b38;
        }
        .rep-circle-fg.stroke-green {
          stroke: #50b848;
        }
        .rep-circle-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
        }

        /* ── REPORT DETAIL SUBPAGE ── */
        .report-detail-subpage {
          background: #f8fafc;
          border-radius: 28px;
          padding: 2rem;
          border: 1px solid #e2e8f0;
          margin-top: 1.5rem;
        }
        /* --- PDF Render-Mode Scaling (-25%) --- */
        .report-detail-subpage.pdf-render-mode {
          font-size: 9.7px !important;
          margin-top: 0 !important;
          padding-top: 0 !important;
          padding-left: 1.25rem !important;
          padding-right: 1.25rem !important;
          padding-bottom: 0px !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-summary-card,
        .report-detail-subpage.pdf-render-mode .rep-bio-card,
        .report-detail-subpage.pdf-render-mode .rep-pillar-detail-card,
        .report-detail-subpage.pdf-render-mode .rep-goals-col {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-nav {
          display: none !important;
          margin: 0 !important;
          padding: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-branding {
          display: flex !important;
          justify-content: flex-start !important;
          align-items: center !important;
          margin-top: 0px !important;
          padding-top: 0 !important;
          margin-bottom: 0.6rem !important;
          padding-bottom: 0.3rem !important;
          border-bottom: none !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-branding-left {
          display: block !important;
          text-align: left !important;
          margin: 0 !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-branding-logo-img {
          height: 44px !important;
          width: auto !important;
          margin: 0 !important;
          display: block !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-banner-wrap {
          display: block !important;
          height: 95px !important;
          margin-bottom: 0.85rem !important;
          border-radius: 12px !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-header-row {
          margin-bottom: 0.85rem !important;
          gap: 0.8rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-title {
          font-size: 1.15rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-subtitle {
          font-size: 0.7rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-score-box {
          padding: 0.4rem 0.7rem !important;
          border-radius: 12px !important;
          gap: 0.6rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-detail-score-circle {
          width: 44px !important;
          height: 44px !important;
          border-width: 1.5px !important;
        }
        .report-detail-subpage.pdf-render-mode .rdsc-val {
          font-size: 1.15rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rdsc-label {
          font-size: 0.55rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rdsi-label {
          font-size: 0.55rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rdsi-change {
          font-size: 0.68rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-summary-card {
          padding: 0.9rem !important;
          border-radius: 14px !important;
          margin-bottom: 0.85rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rsc-header {
          margin-bottom: 0.55rem !important;
          gap: 0.55rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rsc-coach-avatar-wrap {
          width: 36px !important;
          height: 36px !important;
        }
        .report-detail-subpage.pdf-render-mode .rsc-coach-title {
          font-size: 0.92rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rsc-coach-subtitle {
          font-size: 0.65rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rsc-text {
          font-size: 0.78rem !important;
          line-height: 1.35 !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-section-title {
          margin-top: 1.1rem !important;
          margin-bottom: 0.65rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-section-title h3 {
          font-size: 0.92rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-pillars-section-title {
          page-break-before: avoid !important;
          break-before: avoid !important;
          margin-top: 1.1rem !important;
        }
        .report-detail-subpage.pdf-render-mode .blue-bar {
          height: 14px !important;
          width: 3px !important;
          margin-right: 8px !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-wearable-source-badge {
          transform: none !important;
          padding: 0.2rem 0.5rem !important;
          border-radius: 8px !important;
          gap: 0.35rem !important;
          border-width: 1px !important;
        }
        .report-detail-subpage.pdf-render-mode .rwsb-label {
          font-size: 0.62rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rwsb-img {
          width: 16px !important;
          height: 16px !important;
        }
        .report-detail-subpage.pdf-render-mode .rwsb-name {
          font-size: 0.65rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rwsb-status-dot {
          width: 6px !important;
          height: 6px !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-biomarker-grid {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
          justify-content: space-between !important;
          margin-bottom: 0.9rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-bio-card {
          width: 23.5% !important;
          box-sizing: border-box !important;
          padding: 0.55rem !important;
          border-radius: 10px !important;
        }
        .report-detail-subpage.pdf-render-mode .rbc-label {
          font-size: 0.6rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rbc-value {
          font-size: 1.05rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rbc-change {
          font-size: 0.68rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-pillars-grid {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
          justify-content: space-between !important;
          margin-bottom: 0.9rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-pillar-detail-card {
          width: 32% !important;
          box-sizing: border-box !important;
          padding: 0.75rem !important;
          border-radius: 12px !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-header {
          margin-bottom: 0.5rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-num {
          width: 28px !important;
          height: 28px !important;
          font-size: 0.9rem !important;
          border-width: 1px !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-title-group h4 {
          font-size: 0.85rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-status {
          font-size: 0.62rem !important;
          padding: 0.18rem 0.4rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-score-row {
          margin-bottom: 0.4rem !important;
          padding-bottom: 0.4rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-score-num .rpdc-score-val {
          font-size: 1.15rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-score-num .rpdc-score-lbl {
          font-size: 0.62rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-change {
          font-size: 0.72rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rpdc-desc {
          font-size: 0.7rem !important;
          line-height: 1.25 !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-goals-comparison {
          gap: 0.5rem !important;
          margin-top: 0.9rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rep-goals-col {
          border-radius: 10px !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-header {
          padding: 0.45rem 0.75rem !important;
          gap: 0.35rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-header h3 {
          font-size: 0.82rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-header i {
          font-size: 0.95rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-body {
          padding: 0.5rem 0.75rem !important;
          gap: 0.4rem !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-item {
          line-height: 1.2 !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-item span {
          font-size: 0.65rem !important;
          line-height: 1.2 !important;
        }
        .report-detail-subpage.pdf-render-mode .rgc-item i {
          font-size: 0.8rem !important;
          margin-top: 1px !important;
        }
        .rep-detail-branding {
          display: none;
        }
        .rep-detail-banner-wrap {
          width: 100%;
          height: 260px;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          border: 1px solid #e2e8f0;
        }
        .rep-detail-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
        }
        .rep-detail-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .rep-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1.5px solid #e2e8f0;
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          color: #64748b;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rep-back-btn:hover {
          border-color: #3b7a24;
          color: #3b7a24;
          background: #f4faf2;
        }
        .rep-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          border: 1.5px solid #e2e8f0;
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          color: #1e293b;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rep-download-btn:hover {
          border-color: #ef4444;
          background: #fdf2f2;
          color: #b91c1c;
        }
        .rep-detail-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          gap: 1.5rem;
        }
        .rep-detail-title {
          font-size: calc(1.6rem + 2pt);
          font-weight: 850;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.03em;
        }
        .rep-detail-subtitle {
          color: #64748b;
          font-size: calc(0.95rem + 2pt);
          margin: 0.25rem 0 0 0;
        }
        .rep-detail-score-box {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: white;
          padding: 0.85rem 1.25rem;
          border-radius: 20px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
        }
        .rep-detail-score-circle {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #e0f2fe;
          border: 2.5px solid #bae6fd;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rdsc-val {
          font-size: 1.95rem;
          font-weight: 900;
          color: #0369a1;
          line-height: 1.05;
        }
        .rdsc-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #0284c7;
          text-transform: uppercase;
        }
        .rep-detail-score-info {
          display: flex;
          flex-direction: column;
        }
        .rdsi-label {
          font-size: 0.9rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .rdsi-change {
          font-size: 1.2rem;
          font-weight: 750;
          margin-top: 3px;
        }
        .rdsi-change.pos { color: #22c55e; }
        .rdsi-change.neg { color: #ef4444; }

        /* EXECUTIVE SUMMARY WITH COACH */
        .rep-summary-card {
          background: white;
          border-radius: 24px;
          padding: 1.8rem;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.01);
          margin-bottom: 2.5rem;
        }
        .rsc-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .rsc-coach-avatar-wrap {
          position: relative;
          width: 52px;
          height: 52px;
          flex-shrink: 0;
        }
        .rsc-coach-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #3b7a24;
          box-shadow: 0 4px 10px rgba(59,122,36,0.15);
        }
        .rsc-coach-badge {
          position: absolute;
          bottom: -2px;
          right: -2px;
          background: #3b7a24;
          color: white;
          font-size: 0.55rem;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 4px;
          border: 1.5px solid white;
        }
        .rsc-coach-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }
        .rsc-coach-subtitle {
          font-size: calc(0.85rem + 2pt);
          color: #64748b;
          font-weight: 600;
          display: block;
          margin-top: 2px;
        }
        .rsc-text {
          font-size: 1.15rem;
          line-height: 1.6;
          color: #475569;
          margin: 0;
          font-weight: 550;
        }

        /* BIOMARKER SNAPSHOT */
        .rep-section-title {
          display: flex;
          align-items: center;
          margin-bottom: 1.25rem;
          margin-top: 2.5rem;
        }
        .rep-section-title h3 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #1e3a5f;
          margin: 0;
        }
        .rep-wearable-source-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          padding: 0.4rem 0.85rem;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.01);
        }
        .rwsb-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748b;
        }
        .rwsb-wrapper {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          position: relative;
        }
        .rwsb-img {
          width: 26px;
          height: 26px;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .rwsb-name {
          font-size: 0.85rem;
          font-weight: 800;
          color: #1e293b;
        }
        .rwsb-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          display: inline-block;
          box-shadow: 0 0 6px rgba(34,197,94,0.4);
        }
        .rep-biomarker-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .rep-bio-card {
          background: white;
          border-radius: 20px;
          padding: 1.25rem;
          border: 1.5px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
        }
        .rbc-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .rbc-value {
          font-size: 1.5rem;
          font-weight: 850;
          color: #0f172a;
        }
        .rbc-change {
          font-size: calc(0.85rem + 2pt);
          font-weight: 700;
          margin-top: 2px;
        }
        .rbc-change.pos { color: #22c55e; }
        .rbc-change.neg { color: #ef4444; }
        .rbc-change.neutral { color: #64748b; }

        /* PILLARS GRID */
        .rep-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .rep-pillar-detail-card {
          background: white;
          border-radius: 22px;
          padding: 1.5rem;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.01);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .rpdc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .rpdc-title-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .rpdc-num {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #f0f9ff;
          border: 2.5px solid #bae6fd;
          color: #0369a1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .rpdc-title-group h4 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
          line-height: 1.25;
        }
        .rpdc-status {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .rpdc-status.excellent { background: #dcfce7; color: #15803d; }
        .rpdc-status.gut { background: #ecfdf5; color: #047857; }
        .rpdc-status.middle { 
          background: #fef3c7; 
          color: #b45309; 
          padding: 0.35rem 0.6rem;
          min-width: 65px;
          border-radius: 8px;
        }

        .rpdc-score-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.75rem;
        }
        .rpdc-score-num {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
        }
        .rpdc-score-val {
          font-size: 1.8rem;
          font-weight: 850;
          color: #0f172a;
          line-height: 1;
        }
        .rpdc-score-lbl {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 700;
        }
        .rpdc-change {
          font-size: 0.9rem;
          font-weight: 750;
        }
        .rpdc-change.pos { color: #22c55e; }
        .rpdc-change.neg { color: #ef4444; }
        .rpdc-desc {
          font-size: 0.95rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
          font-weight: 500;
        }

        /* GOALS COMPARISON */
        .rep-goals-comparison {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .rep-goals-col {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.015);
        }
        .rgc-header {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .rgc-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }
        .rgc-header.bg-green-tint { background: #f4fbf7; }
        .rgc-header.bg-blue-tint { background: #f0f9ff; }
        .text-green { color: #22c55e; font-size: 1.2rem; }
        .text-blue { color: #3b82f6; font-size: 1.2rem; }
        .rgc-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .rgc-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .rgc-item i {
          font-size: 1.1rem;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .rgc-item span {
          font-size: 1.05rem;
          color: #475569;
          line-height: 1.4;
          font-weight: 550;
        }

        .animate-fadeIn {
          animation: fadeInEffect 0.4s ease-out forwards;
        }
        @keyframes fadeInEffect {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Mobile adaptation for Reports Grid */
        @media (max-width: 1000px) {
          .rep-grid-custom {
            grid-template-columns: repeat(2, 1fr);
          }
          .rep-biomarker-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .rep-pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .rep-grid-custom {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .rep-detail-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .rep-detail-score-box {
            width: 100%;
          }
          .rep-biomarker-grid {
            grid-template-columns: 1fr;
          }
          .rep-pillars-grid {
            grid-template-columns: 1fr;
          }
          .rep-goals-comparison {
            grid-template-columns: 1fr;
          }
        }

        .journey-hero { background: linear-gradient(135deg, #4498ca 0%, #2563eb 100%); border-radius: 24px; padding: 2rem; color: white; display: flex; align-items: center; gap: 2rem; margin-bottom: 3rem; }
        .jh-badge { width: 80px; height: 80px; background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; border: 2px solid rgba(255,255,255,0.3); }
        .jh-info h2 { font-size: 1.5rem; font-weight: 800; margin: 0; }
        .jh-info p { opacity: 0.9; margin: 0.3rem 0 0 0; }
        .journey-map { display: flex; justify-content: space-between; padding: 0 1rem; position: relative; }
        .journey-map::after { content: ''; position: absolute; top: 22px; left: 0; right: 0; height: 4px; background: #f1f5f9; z-index: 0; }
        .map-node { position: relative; z-index: 1; text-align: center; }
        .node-num { width: 44px; height: 44px; border-radius: 50%; background: white; border: 3px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #cbd5e1; margin-bottom: 0.8rem; transition: all 0.3s; }
        .map-node.active .node-num { background: #4498ca; border-color: #4498ca; color: white; box-shadow: 0 0 20px rgba(68,152,202,0.4); }
        .node-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; }
        .map-node.active .node-label { color: #1e293b; }

        @media (max-width: 1000px) { .tac-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) { .tac-grid { grid-template-columns: 1fr; } }

        @media (max-width: 768px) {
          .entw-page {
            padding: 1rem 1rem 100px 1rem;
          }
          .entw-tabs {
            overflow-x: auto;
            padding-bottom: 0.5rem;
            scrollbar-width: none;
          }
          .entw-tabs::-webkit-scrollbar {
            display: none;
          }
          .entw-tab {
            white-space: nowrap;
          }
          .bioage-headline-row,
          .goals-section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .bioage-btn-row {
            width: 100%;
            flex-direction: column;
            gap: 0.5rem;
          }
          .simulation-trigger-btn,
          .upload-trigger-btn,
          .adjust-goals-btn {
            width: 100%;
            justify-content: center;
          }
          .bioage-card-new {
            flex-direction: column;
            padding: 1.5rem;
            gap: 1.5rem;
            align-items: center;
            text-align: center;
          }
          .bac-circle-container {
            width: 260px;
            height: 260px;
          }
          .bac-circle-val {
            font-size: 4.25rem;
          }
          .bac-circle-lab {
            font-size: 1.56rem;
          }
          .bac-badges-row {
            justify-content: center;
          }
          .bac-footer-info {
            align-items: flex-start;
            text-align: left;
          }
          .trends-opt-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            margin-top: 2rem;
          }
          .period-selector {
            width: 100%;
            display: flex;
          }
          .period-btn {
            flex: 1;
            text-align: center;
          }
          .upload-grid {
            grid-template-columns: 1fr;
          }
          .upload-modal-content {
            padding: 1.5rem;
          }
          .modal-title-custom {
            font-size: 1.5rem;
          }
          .modal-subtitle-custom {
            font-size: 0.95rem;
          }
          .modal-header-custom div {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0.5rem !important;
          }
          .upload-option-card {
            align-items: stretch;
          }
          .upload-option-text-container {
            padding: 0.85rem 0.85rem 0.85rem 0;
            margin-left: 0.8rem;
          }
          .wochenziele-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .nba-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 576px) {
          .modal-overlay {
            padding: 0.75rem;
          }
          .bac-stats-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .opt-modal-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
          .nba-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .nba-card-right {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            text-align: left;
            margin-top: 0.25rem;
            border-top: 1px solid #f1f5f9;
            padding-top: 0.5rem;
          }
          .goal-summary {
            gap: 1.5rem;
          }
          .rep-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .rep-btn {
            width: 100%;
            text-align: center;
          }
          .modal-content {
            padding: 1.5rem 1rem;
            border-radius: 20px;
          }
        }

        /* AKTIVITÄTEN RECONSTRUCTION */
        .act-search-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          align-items: stretch;
        }
        .act-search-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.6rem 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .act-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: #1e293b;
        }
        .act-search-input::placeholder {
          color: #94a3b8;
        }
        .act-search-clear {
          border: none;
          background: none;
          color: #94a3b8;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }
        .voice-input-bar {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          background: rgba(255,255,255,0.8);
          border: 1.5px dashed rgba(68,152,202,0.3);
          transition: all 0.2s;
        }
        .voice-input-bar:hover {
          border-color: #4498ca;
          background: white;
        }
        .voice-placeholder {
          font-size: 0.85rem;
          color: #64748b;
        }
        .voice-btn {
          padding: 0.35rem 0.8rem;
          border-radius: 8px;
          border: none;
          background: #4498ca;
          color: white;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .voice-btn:hover {
          background: #357fa8;
        }
        .act-count-text {
          font-size: 1.02rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }
        .act-cluster-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .act-cluster-card {
          background: white;
          border-radius: 24px;
          border: 1.5px solid #f1f5f9;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.015);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          transition: all 0.25s ease;
        }
        .act-cluster-card:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.03);
          transform: translateY(-2px);
        }
        .acc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .acc-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
        }
        .acc-status {
          font-size: 0.98rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .acc-title-box h3 {
          font-size: 1.25rem;
          font-weight: 850;
          color: #1e293b;
          margin: 0;
        }
        .acc-underline {
          height: 4px;
          width: 45px;
          border-radius: 4px;
          margin-top: 0.45rem;
        }
        .acc-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .acc-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.8rem;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .acc-item.checked {
          border-color: rgba(0,0,0,0.01);
        }
        .acc-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .acc-item.checked .acc-checkbox {
          color: white;
        }
        .acc-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #475569;
          line-height: 1.3;
        }
        .acc-item.checked .acc-label {
          color: #1e293b;
        }

        @media (max-width: 1000px) {
          .act-cluster-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
        .wzc-controls-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          flex-shrink: 0;
        }
        @media (max-width: 992px) {
          .wzc-controls-wrapper {
            flex-direction: row !important;
            align-items: center !important;
            gap: 1.5rem !important;
            margin-top: 0.5rem !important;
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
          .act-cluster-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .act-search-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .voice-input-bar {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
