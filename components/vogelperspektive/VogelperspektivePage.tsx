'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

interface VogelperspektivePageProps {
  onNavigate?: (id: string) => void;
}

const getIconForActivity = (name: string) => {
  const lower = typeof name === 'string' ? name.toLowerCase() : '';
  if (lower.includes('rad')) return 'bi-bicycle';
  if (lower.includes('kraft') || lower.includes('hit-')) return 'bi-activity';
  if (lower.includes('joggen') || lower.includes('cooper')) return 'bi-stopwatch';
  if (lower.includes('spazieren') || lower.includes('schritte') || lower.includes('spazier')) return 'bi-person-walking';
  if (lower.includes('medit')) return 'bi-flower1';
  if (lower.includes('nap')) return 'bi-moon-stars';
  if (lower.includes('schlaf') || lower.includes('geschlafen')) return 'bi-moon';
  if (lower.includes('aufstehzeit')) return 'bi-alarm';
  if (lower.includes('koffein')) return 'bi-cup-hot';
  if (lower.includes('schläf') || lower.includes('abendroutine')) return 'bi-moon';
  if (lower.includes('schwimm')) return 'bi-droplet';
  if (lower.includes('yoga') || lower.includes('dehnung')) return 'bi-heart-pulse';
  if (lower.includes('atem')) return 'bi-wind';
  if (lower.includes('licht') || lower.includes('sonne')) return 'bi-sun';
  if (lower.includes('treppe')) return 'bi-stairs';
  if (lower.includes('hang') || lower.includes('griff')) return 'bi-award';
  if (lower.includes('wasser')) return 'bi-droplet-half';
  if (lower.includes('gemüse') || lower.includes('obst') || lower.includes('mahlzeit') || lower.includes('essen') || lower.includes('snack') || lower.includes('zucker') || lower.includes('protein') || lower.includes('omega') || lower.includes('ballast')) return 'bi-apple';
  if (lower.includes('alkohol')) return 'bi-x-circle';
  if (lower.includes('sozial') || lower.includes('freund') || lower.includes('unterstützung') || lower.includes('verbundenheit')) return 'bi-people';
  if (lower.includes('nikotin')) return 'bi-x-circle';
  if (lower.includes('journaling')) return 'bi-book';
  if (lower.includes('handy')) return 'bi-phone';
  if (lower.includes('pause')) return 'bi-clock';
  if (lower.includes('lüft')) return 'bi-wind';
  return 'bi-lightning-charge';
};

export default function VogelperspektivePage({ onNavigate }: VogelperspektivePageProps) {
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('Guten Tag');
  const [userName, setUserName] = useState('Monique');
  const [profileImage, setProfileImage] = useState('/images/woman_53_blonde.png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = sessionStorage.getItem('ty_first_name');
      if (savedName) {
        setUserName(savedName);
      }
      const savedImage = localStorage.getItem('ty_profile_image');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, []);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProfileImage(result);
          localStorage.setItem('ty_profile_image', result);
          // Event to sync header avatar
          window.dispatchEvent(new Event('ty_profile_image_changed'));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const formattedDate = new Intl.DateTimeFormat('de-DE', dateOptions).format(new Date());
    setCurrentDate(formattedDate.toUpperCase());

    const hour = new Date().getHours();
    let calculatedGreeting = 'Guten Tag';
    if (hour < 11) {
      calculatedGreeting = 'Guten Morgen';
    } else if (hour >= 18) {
      calculatedGreeting = 'Guten Abend';
    }
    setGreeting(calculatedGreeting);
  }, []);
 
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [liveCallDateStr, setLiveCallDateStr] = useState('');
 
  useEffect(() => {
    const calculateLiveCall = () => {
      const now = new Date();
      // Add 14 days
      const futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      // Find the next Monday
      const day = futureDate.getDay();
      const daysToMonday = (1 - day + 7) % 7 || 7;
      const targetDate = new Date(futureDate.getTime() + daysToMonday * 24 * 60 * 60 * 1000);
      targetDate.setHours(18, 0, 0, 0);
 
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      };
      const formatted = new Intl.DateTimeFormat('de-DE', dateOptions).format(targetDate);
      setLiveCallDateStr(formatted);
 
      return targetDate;
    };
 
    const targetDate = calculateLiveCall();
 
    const updateTimer = () => {
      const diff = targetDate.getTime() - new Date().getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((diff % (60 * 1000)) / 1000);
      setCountdown({ days, hours, minutes, seconds });
    };
 
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
 
    return () => clearInterval(interval);
  }, []);

  const [outlookCalls, setOutlookCalls] = useState({
    call1: { dateStr: '', month: '', day: '', fullDateStr: '' },
    call2: { dateStr: '', month: '', day: '', fullDateStr: '' }
  });

  useEffect(() => {
    const getMiddleMonday = (year: number, month: number) => {
      const d = new Date(year, month, 15);
      const day = d.getDay();
      let dateNum = 15;
      if (day === 0) dateNum = 16;
      else if (day === 2) dateNum = 14;
      else if (day === 3) dateNum = 13;
      else if (day === 4) dateNum = 12;
      else if (day === 5) dateNum = 18;
      else if (day === 6) dateNum = 17;
      
      const res = new Date(year, month, dateNum);
      res.setHours(18, 0, 0, 0);
      return res;
    };

    const now = new Date();
    // Calculate the upcoming main call date
    const futureDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const day = futureDate.getDay();
    const daysToMonday = (1 - day + 7) % 7 || 7;
    const mainCallDate = new Date(futureDate.getTime() + daysToMonday * 24 * 60 * 60 * 1000);

    // Call 1 is the month after the main call (July)
    const call1Date = getMiddleMonday(mainCallDate.getFullYear(), mainCallDate.getMonth() + 1);
    // Call 2 is the month after Call 1 (August)
    const call2Date = getMiddleMonday(mainCallDate.getFullYear(), mainCallDate.getMonth() + 2);

    const monthOptions: Intl.DateTimeFormatOptions = { month: 'short' };
    const dateOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

    setOutlookCalls({
      call1: {
        dateStr: call1Date.toLocaleDateString('de-DE', dateOptions),
        month: call1Date.toLocaleDateString('de-DE', monthOptions).toUpperCase().replace('.', ''),
        day: call1Date.getDate().toString(),
        fullDateStr: `Montag, ${call1Date.getDate()}. ${call1Date.toLocaleDateString('de-DE', { month: 'long' })}`
      },
      call2: {
        dateStr: call2Date.toLocaleDateString('de-DE', dateOptions),
        month: call2Date.toLocaleDateString('de-DE', monthOptions).toUpperCase().replace('.', ''),
        day: call2Date.getDate().toString(),
        fullDateStr: `Montag, ${call2Date.getDate()}. ${call2Date.toLocaleDateString('de-DE', { month: 'long' })}`
      }
    });
  }, []);

  const [activeModal, setActiveModal] = useState<'activity' | 'voice' | 'photo' | 'diamonds' | 'jungbrunnen-selection' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [jungbrunnenSubView, setJungbrunnenSubView] = useState<'none' | 'oracle' | 'alchemist' | 'selection'>('none');
  const [oracleCardFlipped, setOracleCardFlipped] = useState(false);
  const [oracleQuestCompleted, setOracleQuestCompleted] = useState(false);
  const [oracleRating, setOracleRating] = useState<string | null>(null);
  const [selectedCardDesign, setSelectedCardDesign] = useState<'tree' | 'scifi' | 'geometry' | null>(null);

  const [oracleCardIndex, setOracleCardIndex] = useState(0);
  const [completedRituals, setCompletedRituals] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ty-completed-rituals');
      if (saved) {
        setCompletedRituals(JSON.parse(saved));
      }
    }
  }, []);

  const oracleCards = [
    {
      id: 'Cryo-Challenge',
      title: 'Cryo-Challenge',
      detail: 'Beende deine Dusche heute mit 2 Minuten eiskaltem Wasser. Atme dabei ruhig durch die Nase.',
      diamonds: 3,
      icon: '❄️',
      successText: '"Hervorragend, Monique! Genau dieser Kälte-Schock aktiviert die braunen Fettzellen. Deine Fettverbrennung läuft jetzt auf Hochtouren!"'
    },
    {
      id: 'HIIT-Booster',
      title: 'HIIT Booster',
      detail: 'Absolviere 4 Intervalle à 30 Sekunden Kniebeuge-Sprünge mit maximaler Intensität und 30 Sekunden Pause dazwischen.',
      diamonds: 3,
      icon: '🔥',
      successText: '"Spitze! Dein metabolischer Ofen brennt. Das erhöht die mitochondriale Effizienz für Stunden!"'
    },
    {
      id: 'Deep-Breath',
      title: 'Deep-Breath-Ritual',
      detail: 'Atme 5 Minuten im 4-7-8 Takt: 4 Sek. einatmen, 7 Sek. halten, 8 Sek. ausatmen, um dein Nervensystem zu entspannen.',
      diamonds: 2,
      icon: '🧘',
      successText: '"Wunderbar, der Vagusnerv ist aktiviert. Dein Herzschlag hat sich optimal harmonisiert."'
    },
    {
      id: 'Morgenlicht',
      title: 'Morgenlicht-Spaziergang',
      detail: 'Gehe innerhalb von 30 Minuten nach dem Aufwachen für 15 Minuten ohne Sonnenbrille ins Freie, um deine innere Uhr zu stellen.',
      diamonds: 3,
      icon: '☀️',
      successText: '"Perfekt! Dein Melatonin-Spiegel sinkt, Cortisol steigt gesund an. Dein Schlaf heute Nacht wird tiefer sein!"'
    },
    {
      id: 'Fasten-Sprint',
      title: 'Fasten-Sprint',
      detail: 'Halte heute ein Essensfenster von maximal 8 Stunden ein (16 Stunden Fasten) für effektives Zell-Recycling (Autophagie).',
      diamonds: 3,
      icon: '⏳',
      successText: '"Großartig! Deine Zellen recyceln unbrauchbaren Proteinmüll. Das verjüngt das Gewebe von innen heraus."'
    },
    {
      id: 'Power-Nap',
      title: 'Power-Nap',
      detail: 'Lege am frühen Nachmittag einen erfrischenden 15-minütigen Mittagsschlaf ein, um deine geistige Frische wieder aufzuladen.',
      diamonds: 2,
      icon: '😴',
      successText: '"Klasse! Dein Gehirn hat sich gereinigt, Fokus und geistige Frische sind wieder auf 100 % geladen."'
    },
    {
      id: 'Beeren-Detox',
      title: 'Beeren-Detox-Snack',
      detail: 'Iss eine Handvoll Heidelbeeren oder Brombeeren wegen der hohen Dosis Sirtuin-aktivierender Polyphenole.',
      diamonds: 2,
      icon: '🫐',
      successText: '"Hervorragend! Die enthaltenen Anthocyane schützen deine Telomere und wirken stark antioxidativ."'
    }
  ];

  const currentCard = oracleCards[oracleCardIndex];

  const getRitualDateString = (cardIdx: number) => {
    const now = new Date();
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + distanceToMonday + cardIdx);
    return targetDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getRitualDayName = (cardIdx: number) => {
    const names = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    return names[cardIdx];
  };
  
  const [alchemistSelected, setAlchemistSelected] = useState<string[]>([]);
  const [alchemistBrewed, setAlchemistBrewed] = useState(false);
  const [alchemistRating, setAlchemistRating] = useState<string | null>(null);
  const [brewingProgress, setBrewingProgress] = useState(0);
  
  const [activitySearchTerm, setActivitySearchTerm] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const handleResizeOrScroll = () => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth <= 992;
        if (jungbrunnenSubView === 'oracle' && !isMobile) {
          document.body.classList.add('oracle-scroll-lock');
        } else {
          document.body.classList.remove('oracle-scroll-lock');
        }
      }
    };

    if (typeof window !== 'undefined') {
      if (['oracle', 'selection', 'alchemist'].includes(jungbrunnenSubView)) {
        window.scrollTo(0, 0);
        const wrapper = document.querySelector('.content-wrapper');
        if (wrapper) {
          wrapper.scrollTop = 0;
        }
      }
      handleResizeOrScroll();
      window.addEventListener('resize', handleResizeOrScroll);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('oracle-scroll-lock');
        window.removeEventListener('resize', handleResizeOrScroll);
      }
    };
  }, [jungbrunnenSubView]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentMonday = (() => {
        const today = new Date();
        const day = today.getDay();
        const diffToMonday = day === 0 ? -6 : 1 - day;
        const monday = new Date(today);
        monday.setDate(today.getDate() + diffToMonday);
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
      })();

      const lastWeekStart = localStorage.getItem('ty-last-week-start');
      if (lastWeekStart && lastWeekStart !== currentMonday) {
        const defaultChecked = ['8-8,5 Std. geschlafen', 'Schritte gegangen'];
        localStorage.setItem('ty-checked-activities', JSON.stringify(defaultChecked));
        localStorage.setItem('ty-activity-counts', JSON.stringify({}));
        localStorage.removeItem('ty-cryo-dismissed');
        localStorage.setItem('ty-last-week-start', currentMonday);
        window.dispatchEvent(new Event('ty-activities-sync'));
        window.dispatchEvent(new Event('ty-counts-sync'));
      } else if (!lastWeekStart) {
        localStorage.setItem('ty-last-week-start', currentMonday);
      }
    }

    const saved = localStorage.getItem('ty-checked-activities');
    if (saved) {
      setSelectedActivities(JSON.parse(saved));
    } else {
      const defaultChecked = ['8-8,5 Std. geschlafen', 'Schritte gegangen'];
      setSelectedActivities(defaultChecked);
      localStorage.setItem('ty-checked-activities', JSON.stringify(defaultChecked));
    }

    const handleSync = () => {
      const updated = localStorage.getItem('ty-checked-activities');
      if (updated) setSelectedActivities(JSON.parse(updated));
    };

    const savedCounts = localStorage.getItem('ty-activity-counts');
    if (savedCounts) {
      setActivityCounts(JSON.parse(savedCounts));
    }

    const handleCountsSync = () => {
      const updated = localStorage.getItem('ty-activity-counts');
      if (updated) setActivityCounts(JSON.parse(updated));
    };

    window.addEventListener('ty-activities-sync', handleSync);
    window.addEventListener('ty-counts-sync', handleCountsSync);
    return () => {
      window.removeEventListener('ty-activities-sync', handleSync);
      window.removeEventListener('ty-counts-sync', handleCountsSync);
    };
  }, []);

  const updateSelectedActivities = (newSelected: string[]) => {
    setSelectedActivities(newSelected);
    localStorage.setItem('ty-checked-activities', JSON.stringify(newSelected));
    window.dispatchEvent(new Event('ty-activities-sync'));
  };

  const [activityValues, setActivityValues] = useState<Record<string, string>>({});
  const [quickSelected, setQuickSelected] = useState<string>('Rad gefahren');

  const optTimeShort = ['5 Min.', '10 Min.', '15 Min.', '20 Min.', '30 Min.', '45 Min.', '60 Min.'];
  const optTimeLong = ['5 Min.', '10 Min.', '15 Min.', '20 Min.', '30 Min.', '45 Min.', '60 Min.', '90 Min.', '120 Min.', '120+ Min.'];
  const optAbend = ['15 Min.', '30 Min.', '45 Min.', '60 Min.'];
  const optBoolean = ['Ja', 'Nein'];
  const optQuality = ['sehr hoch', 'hoch', 'mittel', 'niedrig', 'sehr niedrig'];
  const optSteps = ['2.000', '4.000', '6.000', '8.000', '10.000', '12.000+'];
  const optWater = ['0,5 L', '1,0 L', '1,5 L', '2,0 L', '2,5 L', '3,0+ L'];
  const optFood = ['1 Portion', '2 Portionen', '3 Portionen', '4 Portionen', '5 Portionen', '6+ Portionen'];
  const optGrams = ['erreicht', 'teilweise', 'nicht erreicht'];
  const optDays = ['1 Tag', '2 Tage', '3 Tage', '4 Tage', '5 Tage', '6 Tage', '7 Tage'];
  const optHang = ['15 Sek.', '30 Sek.', '60 Sek.', '90 Sek.', '120 Sek.'];
  const optFasting = ['10 Std.', '12 Std.', '14 Std.', '16+ Std.'];
  const optBreath = ['4 Min.', '6 Min.', '8 Min.', '10 Min.', '12 Min.'];

  const activityOptions = [
    { name: '8–8,5 Std. geschlafen', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 5 },
    { name: 'Zur Chronotyp-Zeit geschlafen', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Vor Schlafen bildschirmfrei', category: 'Schlaf & Erholung', options: optTimeShort, defaultOption: '30 Min.', diamonds: 2 },
    { name: 'Schlafzimmer kühl + dunkel gehalten', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Tageslicht am Morgen getankt', category: 'Mentale Resilienz & Mindset', options: optTimeShort, defaultOption: '10 Min.', diamonds: 3 },
    { name: 'Feste Aufstehzeit eingehalten', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Nach 14 Uhr kein Koffein mehr', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Power Nap gemacht', category: 'Schlaf & Erholung', options: optTimeShort, defaultOption: '20 Min.', diamonds: 1 },
    { name: 'Abendroutine durchgeführt', category: 'Schlaf & Erholung', options: optAbend, defaultOption: '15 Min.', diamonds: 1 },
    { name: 'Wahrgenommene Schlafqualität', category: 'Schlaf & Erholung', options: optQuality, defaultOption: 'hoch', diamonds: 4 },
    { name: 'Schritte gegangen', category: 'Kraft & Ausdauer', options: optSteps, defaultOption: '8.000', diamonds: 4 },
    { name: 'Zügig spazieren gegangen', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '20 Min.', diamonds: 3 },
    { name: 'Joggen gegangen', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '45 Min.', diamonds: 4 },
    { name: 'Krafttraining abgeschlossen', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '60 Min.', diamonds: 4 },
    { name: 'Dehnungen durchgeführt', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '10 Min.', diamonds: 2 },
    { name: 'Rad gefahren', category: 'Kraft & Ausdauer', options: optTimeLong, defaultOption: '60 Min.', diamonds: 4 },
    { name: 'Treppen gestiegen', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '10 Min.', diamonds: 3 },
    { name: 'HIT-Intervalltraining', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '15 Min.', diamonds: 5 },
    { name: 'Dead Hang gehalten', category: 'Kraft & Ausdauer', options: optHang, defaultOption: '60 Sek.', diamonds: 3 },
    { name: 'Griffkraft-Training durchgeführt', category: 'Kraft & Ausdauer', options: optTimeShort, defaultOption: '15 Min.', diamonds: 3 },
    { name: 'Cooper-Test: 2,3 km gelaufen', category: 'Kraft & Ausdauer', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Vollwertige Hauptmahlzeit gegessen', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Ballaststoffe (Ziel 30g) zugeführt', category: 'Immunbalance & Entlastung', options: optGrams, defaultOption: 'erreicht', diamonds: 4 },
    { name: 'Wasser getrunken', category: 'Immunbalance & Entlastung', options: optWater, defaultOption: '2,5 L', diamonds: 2 },
    { name: 'Gemüse + Obst gegessen', category: 'Immunbalance & Entlastung', options: optFood, defaultOption: '5 Portionen', diamonds: 4 },
    { name: 'Protein (Ziel 160g) aufgenommen', category: 'Zellerneuerung & Wachstum', options: optGrams, defaultOption: 'erreicht', diamonds: 4 },
    { name: 'Kein Ultra-Processed-Snacking', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Zuckerarm gegessen', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Omega-3-reiche Lebensmittel / Fischöl', category: 'Zellerneuerung & Wachstum', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Innenraum aktiv gelüftet', category: 'Immunbalance & Entlastung', options: optTimeShort, defaultOption: '10 Min.', diamonds: 1 },
    { name: 'Sonnenschutz bewusst eingehalten', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Esspause eingehalten', category: 'Zellerneuerung & Wachstum', options: optFasting, defaultOption: '12 Std.', diamonds: 2 },
    { name: 'Keinen Alkohol konsumiert', category: 'Immunbalance & Entlastung', options: optDays, defaultOption: '7 Tage', diamonds: 5 },
    { name: 'Echten sozialen Austausch erlebt', category: 'Selbstfürsorge & Soziale Bindungen', options: optTimeLong, defaultOption: '30 Min.', diamonds: 4 },
    { name: 'Freund / Familienmitglied kontaktiert', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Mahlzeit mit Verbundenheit erlebt', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Unterstützung gegeben/angenommen', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Im soz. Kontext alkoholfrei geblieben', category: 'Selbstfürsorge & Soziale Bindungen', options: optBoolean, defaultOption: 'Ja', diamonds: 3 },
    { name: 'Nikotinfreien Tag geschafft', category: 'Immunbalance & Entlastung', options: optBoolean, defaultOption: 'Ja', diamonds: 5 },
    { name: 'Atemübung durchgeführt', category: 'Mentale Resilienz & Mindset', options: optBreath, defaultOption: '10 Min.', diamonds: 2 },
    { name: 'Bewusste Auszeit in Natur', category: 'Mentale Resilienz & Mindset', options: optTimeLong, defaultOption: '30 Min.', diamonds: 3 },
    { name: 'Eine Pause ohne Handy gemacht', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 1 },
    { name: 'Mikropause 5 Min. eingebaut', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Vor Schlaf keinen Alk. konsumiert', category: 'Schlaf & Erholung', options: optBoolean, defaultOption: 'Ja', diamonds: 4 },
    { name: 'Meditiert', category: 'Mentale Resilienz & Mindset', options: optTimeShort, defaultOption: '15 Min.', diamonds: 3 },
    { name: 'Dankbarkeits-Journaling', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Negativen Gedankenkreislauf durchbrochen', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
    { name: 'Social-Media-Zeit um 50% reduziert', category: 'Mentale Resilienz & Mindset', options: optBoolean, defaultOption: 'Ja', diamonds: 2 },
  ];
  const filteredActivities = activityOptions.filter(a => a.name.toLowerCase().includes(activitySearchTerm.toLowerCase()));

  const handleCompleteRitual = (cardId: string) => {
    setOracleQuestCompleted(true);
    
    // Add to completed list
    const updated = [...completedRituals];
    if (!updated.includes(cardId)) {
      updated.push(cardId);
      setCompletedRituals(updated);
      localStorage.setItem('ty-completed-rituals', JSON.stringify(updated));
      window.dispatchEvent(new Event('ty-activities-sync'));
    }
    
    // If it's the Cryo-Challenge, also mark as cryo-dismissed so it syncs with other pages!
    if (cardId === 'Cryo-Challenge') {
      localStorage.setItem('ty-cryo-dismissed', 'true');
      window.dispatchEvent(new Event('ty-activities-sync'));
    }
    
    // Also, add this activity to the weekly checked activities so it appears in the Diamond Lounge and in the week activities!
    const activityMapping: Record<string, string> = {
      'Cryo-Challenge': 'Jungbrunnen: Cryo-Challenge',
      'HIIT-Booster': 'Krafttraining abgeschlossen',
      'Deep-Breath': 'Atemübung durchgeführt',
      'Morgenlicht': 'Bewusste Auszeit in Natur',
      'Fasten-Sprint': 'Elixier des Zell-Recyclings',
      'Power-Nap': 'Mikropause 5 Min. eingebaut',
      'Beeren-Detox': 'Vollwertige Hauptmahlzeit gegessen'
    };
    
    const activityName = activityMapping[cardId];
    if (activityName && !selectedActivities.includes(activityName)) {
      const newSelected = [...selectedActivities, activityName];
      updateSelectedActivities(newSelected);
    }
  };

  const calculateDiamonds = (act: any, value: string) => {
    if (!value) return act.diamonds;
    
    if (act.name === 'Dead Hang gehalten') {
      if (value === '15 Sek.') return 1;
      if (value === '30 Sek.') return 2;
      if (value === '60 Sek.') return 3;
      if (value === '90 Sek.') return 4;
      if (value === '120 Sek.') return 5;
    }

    if (value === 'Ja') return act.diamonds;
    if (value === 'Nein') return 0;
    if (value === 'erreicht') return act.diamonds;
    if (value === 'teilweise') return Math.max(1, Math.round(act.diamonds / 2));
    if (value === 'nicht erreicht') return 0;
    if (['sehr hoch', 'hoch', 'mittel', 'niedrig', 'sehr niedrig'].includes(value)) {
      if (value === 'sehr hoch') return Math.min(5, act.diamonds + 1);
      if (value === 'hoch') return act.diamonds;
      if (value === 'mittel') return Math.max(1, Math.round(act.diamonds / 2));
      if (value === 'niedrig') return 1;
      if (value === 'sehr niedrig') return 0;
    }

    const extractNum = (str: string) => {
      if (typeof str !== 'string') return 1;
      const cleaned = str.replace(/\./g, '').replace(',', '.');
      const match = cleaned.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : 1;
    };

    const valNum = extractNum(value);
    const defNum = extractNum(act.defaultOption);

    if (defNum === 0) return act.diamonds;

    let ratio = valNum / defNum;
    let rawDiamonds = Math.round(act.diamonds * ratio);
    
    if (rawDiamonds < 1 && valNum > 0) rawDiamonds = 1;
    if (valNum === 0) rawDiamonds = 0;
    
    const maxPossible = Math.min(5, act.diamonds + 1);
    if (rawDiamonds > maxPossible) rawDiamonds = maxPossible;

    return rawDiamonds;
  };

  const dashboardTotalDiamonds = useMemo(() => {
    let sum = 0;
    const safeSelected = Array.isArray(selectedActivities) ? selectedActivities : [];
    
    // 1. Core activities
    safeSelected.forEach(name => {
      if (name === 'alchemist-elixir') return;
      const actConfig = activityOptions.find(a => a.name === name);
      if (actConfig) {
        const detail = activityValues[name] || actConfig.defaultOption;
        sum += calculateDiamonds(actConfig, detail);
      }
    });

    // 2. Feel-Good integration
    const cryoDismissed = typeof window !== 'undefined' ? localStorage.getItem('ty-cryo-dismissed') === 'true' : false;
    if (!cryoDismissed) {
      sum += 3;
    }
    if (safeSelected.includes('alchemist-elixir')) {
      sum += 5;
    }

    // Add completed daily rituals diamonds (excluding Cryo-Challenge which is handled above via cryoDismissed)
    completedRituals.forEach(cardId => {
      if (cardId === 'Cryo-Challenge') return;
      const card = oracleCards.find(c => c.id === cardId);
      if (card) {
        sum += card.diamonds;
      }
    });

    return sum;
  }, [selectedActivities, activityValues, completedRituals]);

  if (jungbrunnenSubView === 'selection') {
    return (
      <div className="dashboard-container jungbrunnen-subpage-container selection-subpage-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'linear-gradient(160deg,#091221 0%,#0f1d33 40%,#080e1a 70%,#0a1424 100%)', minHeight: 'calc(100vh - 72px)', color: '#fff', boxSizing: 'border-box', width: '100%', maxWidth: 'none', margin: 0, padding: '1.25rem 2rem', position: 'relative', overflowY: 'auto', paddingBottom: '140px' }}>
        <button 
          className="back-btn" 
          onClick={() => setJungbrunnenSubView('none')} 
          style={{ 
            alignSelf: 'flex-start', 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.12)', 
            color: '#f8fafc', 
            padding: '0.5rem 1.1rem', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontWeight: 750,
            transition: 'all 0.2s',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        >
          <i className="bi bi-arrow-left"></i> Zurück
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', zIndex: 1 }}>
          <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: '#ffffff', border: '2.5px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontSize: '1.8rem' }}>
            <i className="bi bi-droplet-fill"></i>
          </div>
          <div>
            <h3 className="modal-title" style={{ margin: 0, color: '#fff' }}>Dein täglicher Jungbrunnen</h3>
          </div>
        </div>

        <div className="selection-options-grid" style={{ gap: '1.25rem', marginTop: '0.5rem', zIndex: 1 }}>
          {/* OPTION 1: DAS LANGLEBIGKEITS-ORAKEL */}
          <div 
            onClick={() => setJungbrunnenSubView('oracle')}
            style={{
              background: '#fff',
              border: '2px solid #e2e8f0',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
              textAlign: 'left'
            }}
          >
            {/* Left 25% Image */}
            <div style={{ width: '25%', position: 'relative', minHeight: '130px' }}>
              <Image 
                src="/images/feelgood_youth.png" 
                fill 
                alt="Orakel" 
                style={{ objectFit: 'cover' }} 
              />
            </div>
            
            {/* Right 75% Content */}
            <div style={{ width: '75%', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <strong style={{ fontSize: 'calc(1.1rem + 3pt)', color: '#1e293b' }}>1. Verjüngungskarte</strong>
              <p style={{ fontSize: 'calc(0.9rem + 2pt)', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Ziehe deine Tageskarte und enthülle deine tägliche biologische Verjüngungsaktion.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', fontWeight: 700, fontSize: 'calc(0.9rem + 2pt)' }}>
                Karte ziehen <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </div>

          {/* OPTION 2: DER LONGEVITY-ALCHEMIST */}
          <div 
            onClick={() => setJungbrunnenSubView('alchemist')}
            style={{
              background: '#fff',
              border: '2px solid #e2e8f0',
              borderRadius: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
              boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
              textAlign: 'left'
            }}
          >
            {/* Left 25% Image */}
            <div style={{ width: '25%', position: 'relative', minHeight: '130px' }}>
              <Image 
                src="/images/feelgood_energy.png" 
                fill 
                alt="Alchemist" 
                style={{ objectFit: 'cover' }} 
              />
            </div>

            {/* Right 75% Content */}
            <div style={{ width: '75%', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <strong style={{ fontSize: 'calc(1.1rem + 3pt)', color: '#1e293b' }}>2. Verjüngungselixier</strong>
              <p style={{ fontSize: 'calc(0.9rem + 2pt)', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                Mische dein tägliches Verjüngungselixier aus Langlebigkeitszutaten zusammen.
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontWeight: 700, fontSize: 'calc(0.9rem + 2pt)' }}>
                Trank brauen <i className="bi bi-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (jungbrunnenSubView === 'oracle') {
    return (
      <div className="dashboard-container jungbrunnen-subpage-container oracle-subpage-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(160deg,#091221 0%,#0f1d33 40%,#080e1a 70%,#0a1424 100%)', minHeight: 'calc(100vh - 72px)', color: '#fff', boxSizing: 'border-box', width: '100%', maxWidth: 'none', margin: 0, padding: '1.25rem 2rem', position: 'relative' }}>
         <style jsx global>{`
          .oracle-info-tooltip-container {
            position: absolute;
            top: 1.25rem;
            right: 2rem;
            z-index: 10;
          }
          .oracle-info-circle {
            transition: all 0.2s ease;
          }
          .oracle-info-circle:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
          }
          .oracle-info-tooltip-text {
            visibility: hidden;
            width: 280px;
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            text-align: left;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 0.8rem 1rem;
            position: absolute;
            z-index: 100;
            top: 40px;
            right: 0;
            opacity: 0;
            transition: opacity 0.3s, visibility 0.3s;
            font-size: 0.9rem;
            line-height: 1.4;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }
          .oracle-info-circle:hover .oracle-info-tooltip-text {
            visibility: visible;
            opacity: 1;
          }
          @media (max-width: 992px) {
            .oracle-info-tooltip-container {
              top: 1rem !important;
              right: 1rem !important;
            }
            .oracle-info-tooltip-text {
              width: 240px;
              right: -10px;
            }
          }
          @media (min-width: 993px) {
            .oracle-subpage-container {
              overflow: hidden !important;
            }
            /* Hover flip removed - flip only on click */
          }
          @media (max-width: 992px) {
            .oracle-subpage-container {
              overflow-y: auto !important;
              padding-bottom: 140px !important;
            }
            .oracle-back-btn {
              order: 999 !important;
              align-self: center !important;
              margin-top: 2.5rem !important;
              margin-bottom: 1.5rem !important;
            }
          }
          .oracle-card-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 3.5rem;
            width: 100%;
            max-width: 850px;
          }
          @media (max-width: 768px) {
            .oracle-card-row {
              flex-direction: column !important;
              gap: 1.5rem !important;
            }
          }
        `}</style>

        {/* Circular Info Tooltip */}
        <div className="oracle-info-tooltip-container">
          <div className="oracle-info-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', cursor: 'help', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'system-ui', position: 'relative' }}>
            i
            <div className="oracle-info-tooltip-text">
              Diese Karte zeigt deine tägliche biologische Verjüngungsaktion.
              Klicke nach erfolgreichem Abschluss auf „Ritual gemeistert“, um sie abzuhaken.
              Die Aktivität wird automatisch in deinen Wochenaktivitäten und in der Diamond Lounge eingetragen.
            </div>
          </div>
        </div>

        {/* Ambient Glowing Background Orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15, width: '45vw', height: '45vw', background: '#102a4a', top: '-10%', left: '-10%' }} />
          <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15, width: '40vw', height: '40vw', background: '#0c1f38', bottom: '-20%', right: '-10%' }} />
          <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.12, width: '45vw', height: '45vw', background: '#14345c', top: '30%', left: '30%' }} />
        </div>

        <button 
          className="back-btn oracle-back-btn" 
          onClick={() => {
            if (window.innerWidth <= 992) {
              setJungbrunnenSubView('selection');
            } else {
              setJungbrunnenSubView('none');
              setActiveModal('jungbrunnen-selection');
            }
            setOracleCardFlipped(false);
            setOracleQuestCompleted(false);
            setOracleRating(null);
            setSelectedCardDesign(null);
          }} 
          style={{ 
            alignSelf: 'flex-start', 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.12)', 
            color: '#f8fafc', 
            padding: '0.5rem 1.1rem', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontWeight: 750,
            transition: 'all 0.2s',
            zIndex: 2
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        >
          <i className="bi bi-arrow-left"></i> Zurück zu Jungbrunnen
        </button>

        {/* Tägliches Ritual Badge */}
        <div style={{ textAlign: 'center', margin: '0 auto 0.75rem auto', zIndex: 1 }}>
          <span style={{ background: '#16a34a', color: '#ffffff', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tägliches Ritual</span>
        </div>
        {!oracleQuestCompleted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', zIndex: 1, width: '100%' }}>
            
             {/* ONE CARD VIEW WITH SIDE WIDGETS */}
             <div className="oracle-card-row">
               
               {/* Left Widget: Date as a clock symbol */}
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '160px' }}>
                 <div style={{ 
                   width: '96px', 
                   height: '96px', 
                   position: 'relative',
                   filter: 'drop-shadow(0 12px 24px rgba(56, 189, 248, 0.45))'
                 }}>
                   <Image 
                     src="/images/clock_3d.png" 
                     fill 
                     alt="3D Clock" 
                     style={{ objectFit: 'contain' }} 
                   />
                 </div>
                 <span style={{ fontSize: '1.15rem', color: '#f8fafc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', lineHeight: '1.3', marginTop: '0.5rem' }}>
                    {getRitualDayName(oracleCardIndex)}<br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 600 }}>{getRitualDateString(oracleCardIndex)}</span>
                  </span>
               </div>

               {/* Center: The Card */}
                <div className="oracle-card-container" style={{ perspective: '1200px', width: '326px', height: '429px', cursor: 'pointer' }} onClick={() => setOracleCardFlipped(!oracleCardFlipped)}>
                  <div className={`oracle-card-inner ${oracleCardFlipped ? 'flipped' : ''}`} style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    transformStyle: 'preserve-3d',
                    transform: oracleCardFlipped ? 'rotateY(180deg)' : 'none'
                  }}>
                   {/* Front representation of choice: Bio-Hologramm */}
                   <div style={{
                     position: 'absolute',
                     width: '100%',
                     height: '100%',
                     backfaceVisibility: 'hidden',
                     background: 'url(/images/dna_helix_vibrant.png) center/cover',
                     borderRadius: '28px',
                     border: '3px solid #38bdf8',
                     boxShadow: '0 20px 40px rgba(56, 189, 248, 0.3), 0 10px 30px rgba(0,0,0,0.5), inset 0 3px 6px rgba(255,255,255,0.3)',
                     filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.35))',
                     boxSizing: 'border-box'
                   }}>
                     <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setOracleCardFlipped(true);
                       }}
                       style={{
                         position: 'absolute',
                         bottom: '20px',
                         left: '50%',
                         transform: 'translateX(-50%)',
                         background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                         color: '#fff',
                         border: 'none',
                         padding: '0.55rem 1.4rem',
                         borderRadius: '12px',
                         fontWeight: 800,
                         fontSize: '1.0rem',
                         cursor: 'pointer',
                         boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
                         transition: 'all 0.2s ease',
                         whiteSpace: 'nowrap',
                         zIndex: 10
                       }}
                     >
                       Karte umdrehen
                     </button>
                   </div>

                   {/* BACK SIDE (Enthüllt) */}
                   <div style={{
                     position: 'absolute',
                     width: '100%',
                     height: '100%',
                     backfaceVisibility: 'hidden',
                     transform: 'rotateY(180deg)',
                     background: '#ffffff',
                     borderRadius: '28px',
                     border: '2.5px solid #cbd5e1',
                     display: 'flex',
                     flexDirection: 'column',
                     padding: '1.5rem',
                     boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                     textAlign: 'center',
                     alignItems: 'center',
                     color: '#0f172a',
                     boxSizing: 'border-box'
                   }}
                   onClick={() => setOracleCardFlipped(false)}
                   >
                     {/* Centered flex wrapper for upper card content */}
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%', gap: '1rem' }}>
                       <span style={{ fontSize: '3.2rem', lineHeight: 1 }}>{currentCard.icon}</span>
                       <h3 style={{ fontSize: '1.55rem', color: '#0f172a', fontWeight: 900, margin: 0 }}>{currentCard.title}</h3>
                       <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.4', margin: '0.25rem 0.5rem 0 0.5rem' }}>
                         {currentCard.detail}
                       </p>
                     </div>

                     <button 
                       onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteRitual(currentCard.id);
                        }}
                       style={{ 
                         width: '100%', 
                         background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', 
                         color: '#fff', 
                         border: 'none', 
                         padding: '0.75rem', 
                         borderRadius: '12px', 
                         fontWeight: 800, 
                         fontSize: '1.05rem',
                         cursor: 'pointer',
                         boxShadow: '0 4px 10px rgba(34, 197, 94, 0.2)',
                         marginTop: '1rem'
                       }}
                     >
                       Ritual gemeistert
                     </button>
                   </div>

                 </div>
               </div>

               {/* Right Widget: Reward in Diamonds & Next Card */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '160px' }}>
                  <div title={`Verdiene +${currentCard.diamonds} Diamanten durch erfolgreiches Abschließen des täglichen Rituals!`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', cursor: 'help' }}>
                    <div style={{ 
                      width: '96px', 
                      height: '96px', 
                      borderRadius: '50%', 
                      background: 'radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.25) 0%, rgba(12, 74, 110, 0.6) 80%)', 
                      border: '3px solid #38bdf8', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '3.2rem', 
                      boxShadow: '0 12px 24px rgba(56, 189, 248, 0.35), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.5)', 
                      backdropFilter: 'blur(10px)',
                      filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.45))'
                    }}>
                      💎
                    </div>
                    <span style={{ display: 'block', width: '100%', fontSize: '1.15rem', color: '#f8fafc', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', lineHeight: '1.3', marginTop: '0.5rem' }}>
                      +{currentCard.diamonds} Diamanten<br />verdienen
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                    {/* Previous Card Arrow Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOracleCardFlipped(true);
                        setTimeout(() => {
                          setOracleCardIndex((prev) => (prev - 1 + 7) % 7);
                        }, 200);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        zIndex: 5
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.borderColor = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.transform = 'none';
                      }}
                      title="Vorherige Karte"
                    >
                      <i className="bi bi-arrow-left" style={{ fontSize: '1.3rem' }}></i>
                    </button>

                    {/* Next Card Arrow Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOracleCardFlipped(true);
                        setTimeout(() => {
                          setOracleCardIndex((prev) => (prev + 1) % 7);
                        }, 200);
                      }}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        zIndex: 5
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                        e.currentTarget.style.borderColor = '#ffffff';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                        e.currentTarget.style.transform = 'none';
                      }}
                      title="Nächste Karte"
                    >
                      <i className="bi bi-arrow-right" style={{ fontSize: '1.3rem' }}></i>
                    </button>
                  </div>
                </div>

             </div>
           </div>
        ) : (
          /* ORACLE SUCCESS SCREEN */
          <div className="dash-card" style={{ padding: '1.5rem 2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', maxWidth: '580px', margin: '0 auto' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid rgba(22, 163, 74, 0.25)' }}>
              <i className="bi bi-check-lg"></i>
            </div>
            
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.7rem', fontWeight: 900, marginBottom: '0.25rem', margin: 0 }}>Quest Erfolgreich Absolviert!</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Großartige Leistung! Sie haben Ihre Zellen heute erfolgreich herausgefordert.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '0.6rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                <span>💎</span>
                <span>+{currentCard.diamonds} Diamanten</span>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#60a5fa', fontSize: '1rem' }}>
                <span>✨</span>
                <span>+120 XP</span>
              </div>
            </div>

            {/* Emoji Rating Loop */}
            {!oracleRating ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                <h4 style={{ color: '#e2e8f0', margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Wie hat es sich angefühlt?</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { text: '🥶 Eiskalt', val: 'cold' },
                    { text: '⚡ Voller Energie', val: 'energy' },
                    { text: '🧘 Fokussiert', val: 'focused' },
                    { text: '🔋 Regeneriert', val: 'charged' }
                  ].map((rate) => (
                    <button 
                      key={rate.val}
                      onClick={() => setOracleRating(rate.val)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#60a5fa';
                        e.currentTarget.style.background = 'rgba(96, 165, 250, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                    >
                      {rate.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '18px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  <Image src="/images/avatar_lisa.png" fill alt="Lisa Coach" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.1rem', fontSize: '0.85rem' }}>Coach Lisa sagt:</strong>
                  <span style={{ color: '#a7f3d0', fontSize: '0.85rem', lineHeight: '1.4', fontStyle: 'italic' }}>
                    {oracleRating && currentCard.successText}
                  </span>
                </div>
              </div>
            )}

            <button 
              onClick={() => {
                setJungbrunnenSubView('none');
                setActiveModal('jungbrunnen-selection');
                setOracleCardFlipped(false);
                setOracleQuestCompleted(false);
                setOracleRating(null);
                setSelectedCardDesign(null);
              }}
              style={{
                marginTop: '0.5rem',
                background: '#fff',
                color: '#0f172a',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 750,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Zurück zu Jungbrunnen
            </button>
          </div>
        )}
      </div>
    );
  }

  if (jungbrunnenSubView === 'alchemist') {
    const isReadyToBrew = alchemistSelected.length === 2;

    const startBrewingAnimation = () => {
      setBrewingProgress(1);
      const interval = setInterval(() => {
        setBrewingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setAlchemistBrewed(true);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    };

    const getPotionName = () => {
      if (alchemistSelected.includes('physisch') && alchemistSelected.includes('ernaehrung')) {
        return {
          title: '⚡ Elixier des Zell-Recyclings',
          quest: 'Kryo-Schock & 14h Autophagie-Fasten',
          desc: 'Duschen Sie morgen 3 Minuten eiskalt und essen Sie heute 14 Std. nichts, um das zelluläre Recyclingsystem auf Maximum zu stellen.',
          diamonds: 5,
          xp: 150,
          effect: 'Autophagie-Verjüngung'
        };
      }
      if (alchemistSelected.includes('physisch') && alchemistSelected.includes('regen')) {
        return {
          title: '🧘 Trank der Tiefen-Resilienz',
          quest: 'Sauna/Kälte & 10 Min. Box-Breathing',
          desc: 'Absolvieren Sie einen Kälte- oder Hitzereiz gefolgt von 10 Minuten tiefer, kontrollierter Atmung zur Parasympathikus-Aktivierung.',
          diamonds: 4,
          xp: 120,
          effect: 'HRV-Steigerung'
        };
      }
      return {
        title: '🍏 Nektar der Zellerneuerung',
        quest: 'Polyphenol-Snack & 15 Min. Erdungs-Meditation',
        desc: 'Verzehren Sie eine Handvoll dunkler Beeren (Sirtuin-Aktivator) und meditieren Sie barfuß im Freien.',
        diamonds: 3,
        xp: 90,
        effect: 'DNA-Schutz'
      };
    };

    const potionInfo = getPotionName();

    return (
      <div className="dashboard-container jungbrunnen-subpage-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'linear-gradient(160deg,#091221 0%,#0f1d33 40%,#080e1a 70%,#0a1424 100%)', minHeight: 'calc(100vh - 72px)', color: '#fff', boxSizing: 'border-box', overflowY: 'auto', width: '100%', maxWidth: 'none', margin: 0, padding: '1.25rem 2rem' }}>
        <button 
          className="back-btn" 
          onClick={() => {
            if (window.innerWidth <= 992) {
              setJungbrunnenSubView('selection');
            } else {
              setJungbrunnenSubView('none');
              setActiveModal('jungbrunnen-selection');
            }
            setAlchemistSelected([]);
            setAlchemistBrewed(false);
            setAlchemistRating(null);
            setBrewingProgress(0);
          }} 
          style={{ 
            alignSelf: 'flex-start', 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.12)', 
            color: '#f8fafc', 
            padding: '0.5rem 1.1rem', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontWeight: 750,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.35)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
          }}
        >
          <i className="bi bi-arrow-left"></i> Zurück zu Jungbrunnen
        </button>

        {/* Alchemist Header */}
        <div style={{ textAlign: 'center', margin: '0 auto 1rem auto', maxWidth: '600px' }}>
          <span style={{ background: '#16a34a', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zell-Labor</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '0.25rem 0 0.15rem 0', color: '#fff' }}>Der Longevity-Alchemist</h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Mischen Sie zwei Langlebigkeits-Zutaten zusammen, um Ihr ganz persönliches Verjüngungselixier für heute zu kreieren!
          </p>
        </div>

        {!alchemistBrewed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            
            {/* The 3 flasks grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', width: '100%', maxWidth: '750px' }}>
              {[
                { id: 'physisch', name: 'Physischer Reiz', icon: 'bi-thermometer-snow', bg: '#e0f2fe', color: '#0284c7', borderGlow: 'rgba(2, 132, 199, 0.4)' },
                { id: 'ernaehrung', name: 'Ernährung & Fasten', icon: 'bi-apple', bg: '#dcfce7', color: '#16a34a', borderGlow: 'rgba(22, 163, 74, 0.4)' },
                { id: 'regen', name: 'Regeneration & Schlaf', icon: 'bi-moon-stars', bg: '#f3e8ff', color: '#9333ea', borderGlow: 'rgba(147, 51, 234, 0.4)' }
              ].map((item) => {
                const isSelected = alchemistSelected.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (brewingProgress > 0) return;
                      if (isSelected) {
                        setAlchemistSelected(alchemistSelected.filter(x => x !== item.id));
                      } else if (alchemistSelected.length < 2) {
                        setAlchemistSelected([...alchemistSelected, item.id]);
                      }
                    }}
                    style={{
                      background: '#ffffff',
                      border: isSelected ? '3px solid #38bdf8' : '2.5px solid #e2e8f0',
                      borderRadius: '28px',
                      padding: '2rem 1.5rem',
                      textAlign: 'center',
                      cursor: brewingProgress > 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.25s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow: isSelected ? '0 20px 40px rgba(56, 189, 248, 0.2), 0 10px 30px rgba(0,0,0,0.15), inset 0 3px 6px rgba(255,255,255,0.4)' : '0 4px 12px rgba(0,0,0,0.01)'
                    }}
                    onMouseEnter={(e) => {
                      if (brewingProgress > 0) return;
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = item.color;
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (brewingProgress > 0) return;
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem' }}>
                      <i className={`bi ${item.icon}`}></i>
                    </div>
                    <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{item.name}</strong>
                    
                    {isSelected && (
                      <span style={{ background: item.color, color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '8px', position: 'absolute', top: '12px', right: '12px' }}>
                        AKTIV
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Brewing action area */}
            <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center', marginTop: '1rem' }}>
              {brewingProgress === 0 ? (
                <div>
                  {isReadyToBrew ? (
                    <button
                      onClick={startBrewingAnimation}
                      style={{
                        background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '1.2rem 3rem',
                        borderRadius: '20px',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(22, 163, 74, 0.3)',
                        animation: 'pulse 1.8s infinite'
                      }}
                    >
                      🧪 Elixier brauen!
                    </button>
                  ) : (
                    <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '16px', color: '#475569', fontWeight: 600 }}>
                      Wählen Sie genau {2 - alchemistSelected.length} weitere Zutat{2 - alchemistSelected.length > 1 ? 'en' : ''} aus der Auswahl oben.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, color: '#16a34a', animation: 'pulse 1s infinite' }}>Trank wird gemischt... {brewingProgress}%</span>
                  <div style={{ width: '100%', height: '14px', background: '#cbd5e1', borderRadius: '7px', overflow: 'hidden' }}>
                    <div style={{ width: `${brewingProgress}%`, height: '100%', background: '#16a34a', transition: 'width 0.15s ease-out' }}></div>
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ALCHEMIST POTION SUCCESS SCREEN */
          <div className="dash-card" style={{ padding: '1.5rem 2rem', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)', maxWidth: '580px', margin: '0 auto' }}>
            
            <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', animation: 'bounce 2.5s infinite', boxShadow: '0 10px 20px rgba(22, 163, 74, 0.2)' }}>
              <i className="bi bi-droplet-fill"></i>
            </div>
            
            <div>
              <span className="badge" style={{ background: 'rgba(22, 163, 74, 0.15)', color: '#22c55e', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid rgba(22, 163, 74, 0.25)' }}>Elixier gebraut!</span>
              <h2 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '0.2rem' }}>{potionInfo.title}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Zellulärer Effekt: <strong style={{ color: '#22c55e' }}>{potionInfo.effect}</strong>
              </p>
            </div>

            <div style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', width: '100%', textAlign: 'left', boxSizing: 'border-box' }}>
              <strong style={{ display: 'block', marginBottom: '0.25rem', color: '#e2e8f0', fontSize: '0.85rem' }}>Deine Tages-Herausforderung:</strong>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.4' }}>{potionInfo.desc}</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.04)', padding: '0.6rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#fbbf24', fontSize: '1rem' }}>
                <span>💎</span>
                <span>+{potionInfo.diamonds} Diamanten</span>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#60a5fa', fontSize: '1rem' }}>
                <span>✨</span>
                <span>+{potionInfo.xp} XP</span>
              </div>
            </div>

            {/* Emoji Rating Loop */}
            {!alchemistRating ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', width: '100%' }}>
                <h4 style={{ color: '#e2e8f0', margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>Trank eingenommen? Wie fühlt sich dein Körper an?</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {[
                    { text: '⚡ Voller Energie', val: 'energy' },
                    { text: '🧘 Fokussiert', val: 'focused' },
                    { text: '🔋 Regeneriert', val: 'charged' }
                  ].map((rate) => (
                    <button 
                      key={rate.val}
                      onClick={() => setAlchemistRating(rate.val)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#f8fafc',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#60a5fa';
                        e.currentTarget.style.background = 'rgba(96, 165, 250, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                    >
                      {rate.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '18px', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                  <Image src="/images/avatar_lisa.png" fill alt="Lisa Coach" style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <strong style={{ color: '#34d399', display: 'block', marginBottom: '0.1rem', fontSize: '0.85rem' }}>Coach Lisa sagt:</strong>
                  <span style={{ color: '#a7f3d0', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {alchemistRating === 'energy' && '„Hervorragend, Monique! Deine chemischen Rezeptoren feuern jetzt Langlebigkeits-Signale an deine Muskeln. Ein perfekter Start in den Tag!“'}
                    {alchemistRating === 'focused' && '„Wunderbar, die Synergie aus Nährstoffen und Sauerstoff hat deine Alpha-Wellen im Gehirn beruhigt. Dein mentaler Fokus ist jetzt geschärft.“'}
                    {alchemistRating === 'charged' && '„Großartig! Du hast das Beste aus zwei biologischen Welten miteinander verschmolzen. Deine Zellen regenerieren nun tiefgehend.“'}
                  </span>
                </div>
              </div>
            )}

            <button 
              onClick={() => {
                setJungbrunnenSubView('none');
                setActiveModal('jungbrunnen-selection');
                setAlchemistSelected([]);
                setAlchemistBrewed(false);
                setAlchemistRating(null);
                setBrewingProgress(0);
              }}
              style={{
                marginTop: '0.5rem',
                background: '#fff',
                color: '#0f172a',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 750,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Zurück zu Jungbrunnen
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* TOP ROW: 3 COLUMNS */}
      <div className="top-row">

        {/* BOX 1: DEIN FOKUS HEUTE */}
        <div className="dash-card focus-box">
          <div className="box-header" style={{ position: 'relative' }}>
            <i className="bi bi-brightness-high focus-sun-icon"></i>
            <h2 className="box-label">Dein Fokus heute</h2>
            <div className="info-tooltip-container">
              <i className="bi bi-info-circle info-tooltip-icon"></i>
              <div className="info-tooltip-text tooltip-down">
                Tägliches gesundheitliches Hauptziel basierend auf deinen Aktivitäts-, Verhaltens- und Biodaten.
              </div>
            </div>
          </div>
          <div className="focus-main-content">
            <div className="focus-hero-row">
              <div className="sunflower-circle">
                <Image src="/images/focus_landscape.png" width={84} height={84} alt="Focus" style={{ borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div className="focus-text-content">
                <h3 className="focus-title">Stress reduzieren</h3>
                <p className="focus-desc">Senke aktiv dein Cortisollevel und stärke deine Herzratenvariabilität (HRV) durch gezielte Entlastungsphasen und mentale Regeneration im Alltag.</p>
              </div>
            </div>
            <div className="focus-cards-row">
              <div className="f-card">
                <div className="f-card-img"><Image src="/images/photo_breath_v2.png" fill alt="Atem" style={{ objectFit: 'cover' }} /></div>
                <span className="f-card-label">Atemübung</span>
              </div>
              <div className="f-card">
                <div className="f-card-img"><Image src="/images/photo_walk.png" fill alt="Walk" style={{ objectFit: 'cover' }} /></div>
                <span className="f-card-label">Waldbaden</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: GREETING & AVATAR */}
        <div className="center-section">
          <div className="greeting-block">
            <span className="date-display">{currentDate}</span>
            <h1 className="greeting-h1">{greeting}, <br /><span className="name-blue">{userName}</span></h1>
          </div>
          <div 
            className="avatar-outer-circle" 
            style={{ cursor: 'pointer', position: 'relative' }} 
            onClick={triggerFileInput}
            title="Profilbild ändern"
          >
            <div className="avatar-inner" style={{ position: 'relative' }}>
              <Image 
                src={profileImage} 
                width={288} 
                height={288} 
                alt={userName} 
                priority 
                style={{ objectFit: 'cover', borderRadius: '50%', width: '100%', height: '100%' }} 
              />
              <div className="avatar-hover-overlay">
                <i className="bi bi-camera" style={{ fontSize: '2.2rem', marginBottom: '8px' }}></i>
                <span>Foto hochladen</span>
              </div>
            </div>
            <div className="avatar-camera-badge" title="Foto hochladen">
              <i className="bi bi-camera-fill" style={{ fontSize: '1.4rem' }}></i>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>
        </div>

        {/* BOX 2: ACTIVITY TRACKER */}
        <div className="dash-card tracker-box">
          <div className="box-header" style={{ position: 'relative' }}>
            <i className="bi bi-smartwatch tracker-icon"></i>
            <h2 className="box-label">Activity Tracker</h2>
            <div className="info-tooltip-container">
              <i className="bi bi-info-circle info-tooltip-icon"></i>
              <div className="info-tooltip-text tooltip-down" style={{ width: '380px' }}>
                3 Möglichkeiten für schnelle Erfassung deiner Aktivitäten:<br/><br/>
                1. Auswahl aus Liste mit Suchfunktion<br/>
                2. Mitteilung über Sprachsteuerung<br/>
                3. Mitteilung über ein Bild der Mahlzeiten<br/><br/>
                Je mehr Daten du uns zur Verfügung stellst, desto besser lernen wir dich kennen und können Empfehlungen aus der Wissenschaft auf dein persönliches Profil zuschneiden. So bekommst du immer relevantere Informationen.
              </div>
            </div>
          </div>
          <div className="tracker-top-btns">
            <button className="add-btn" onClick={() => setActiveModal('activity')}>+</button>
            <button className="voice-btn" onClick={() => setActiveModal('voice')}><i className="bi bi-mic"></i> Sprechen</button>
            <button className="photo-btn" onClick={() => setActiveModal('photo')}><i className="bi bi-camera"></i> Foto</button>
          </div>
          <div className="tracker-label">LETZTE 3 AKTIVITÄTEN</div>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="act-icon-wrap"><i className="bi bi-bicycle"></i></div>
              <strong>Radfahren</strong>
              <span className="act-duration">30 Min.</span>
            </div>
            <div className="activity-card">
              <div className="act-icon-wrap">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.4em', height: '1.4em' }}>
                  <path d="M6 7h1.5v10H6zm-2.5 2h1.5v6h-1.5zm13 0h1.5v6h-1.5zm2.5-2h1.5v10H19zm-11.5 4h10v2h-10z" />
                </svg>
              </div>
              <strong>Fitness</strong>
              <span className="act-duration">1h 20 Min.</span>
            </div>
            <div className="activity-card">
              <div className="act-icon-wrap"><i className="bi bi-person-walking"></i></div>
              <strong>Spazieren</strong>
              <span className="act-duration">15 Min.</span>
            </div>
          </div>
          <div className="diamonds-footer-pill" onClick={() => setActiveModal('diamonds')}>
            <div className="diamonds-txt">
              <div className="diamonds-title">Diamonds Lounge</div>
              <div className="diamonds-sub">Diese Woche erreicht</div>
            </div>
            <div className="diamonds-score-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.1em', height: '1.1em' }}>
                <path d="M6 3h12l4 6-10 12L2 9z"></path>
                <path d="M11 3L8 9l3 12"></path>
                <path d="M13 3l3 6-3 12"></path>
                <path d="M2 9h20"></path>
              </svg>
              <span>{dashboardTotalDiamonds}</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: 2 COLUMNS */}
      <div className="bottom-row">

        {/* BOX 3: DIREKT-EINSTIEG (NÄCHSTER LIVE CALL) */}
        <div className="dash-card entry-box-full live-call-box">
          <div className="box-header" style={{ position: 'relative' }}>
            <i className="bi bi-display live-call-icon" style={{ color: '#4498ca', fontSize: '1.2rem' }}></i>
            <h2 className="box-label">Nächster Live Call</h2>
            <div className="info-tooltip-container">
              <i className="bi bi-info-circle info-tooltip-icon"></i>
              <div className="info-tooltip-text">
                Direkter Zugang zu monatlichen exklusiven 45-Minuten-Sessions auf Teams mit Vorträgen von Longevity-Experten und anschließenden Fragerunden.
              </div>
            </div>
          </div>
          <div className="live-call-body">
            {/* LEFT COLUMN: Main Upcoming Call */}
            <div className="lc-left-col">
              <div className="live-call-img-container">
                <Image src="/images/hacks-schlaf.png" fill alt="Schlafforschung" style={{ objectFit: 'cover', borderRadius: '14px' }} />
              </div>
              <div className="live-call-details">
                <span className="live-call-date-text">{liveCallDateStr}, <span style={{ fontWeight: 500 }}>18:00-18:45 Uhr</span></span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '1px', lineHeight: 1.4 }}>Schwerpunkt: "Neues aus der Schlafforschung: Wie du deinen Schlaf optimierst, um jeden Tag voller Energie und Fokus zu starten!"</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '8px', marginBottom: '4px' }}>
                  <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '2px solid #4498ca', flexShrink: 0, boxShadow: '0 2px 8px rgba(68,152,202,0.15)' }}>
                    <Image src="/images/albrecht_keller.png" fill alt="Dr. med. Albrecht Keller" style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experte</span>
                    <span style={{ fontSize: '0.85rem', color: '#4498ca', fontWeight: 800 }}>Schlafmediziner Dr. med. Albrecht Keller</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'fit-content', marginTop: 'auto', alignItems: 'stretch' }}>
                  <div className="live-countdown-grid">
                    <div className="live-countdown-item">
                      <span className="lc-num">{countdown.days}</span>
                      <span className="lc-label">Tage</span>
                    </div>
                    <div className="live-countdown-item">
                      <span className="lc-num">{countdown.hours}</span>
                      <span className="lc-label">Std</span>
                    </div>
                    <div className="live-countdown-item">
                      <span className="lc-num">{countdown.minutes}</span>
                      <span className="lc-label">Min</span>
                    </div>
                    <div className="live-countdown-item">
                      <span className="lc-num">{countdown.seconds}</span>
                      <span className="lc-label">Sek</span>
                    </div>
                  </div>
                  
                  <button className="live-call-join-btn" onClick={() => alert('Erfolgreich zum Live-Call angemeldet!')}>
                    Jetzt anmelden
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Outlook (Ausblick) */}
            <div className="lc-right-col">
              <h3 className="outlook-title">Vorschau auf die folgenden Live-Calls</h3>
              
              <div className="outlook-items-list">
                {/* CALL 1 */}
                <div className="outlook-item">
                  <div className="outlook-date-badge">
                    <span className="badge-month">{outlookCalls.call1.month}</span>
                    <span className="badge-day">{outlookCalls.call1.day}</span>
                  </div>
                  <div className="outlook-details">
                    <span className="outlook-date-str" style={{ whiteSpace: 'nowrap' }}>{outlookCalls.call1.fullDateStr}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '-2px' }}>18:00-18:45 Uhr</span>
                    <div className="outlook-topics">
                      <span className="topic-pill">Fastenpraxis</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Prof. Dr. Andreas Michalsen</span>
                  </div>
                </div>

                {/* CALL 2 */}
                <div className="outlook-item">
                  <div className="outlook-date-badge">
                    <span className="badge-month">{outlookCalls.call2.month}</span>
                    <span className="badge-day">{outlookCalls.call2.day}</span>
                  </div>
                  <div className="outlook-details">
                    <span className="outlook-date-str" style={{ whiteSpace: 'nowrap' }}>{outlookCalls.call2.fullDateStr}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginTop: '-2px' }}>18:00-18:45 Uhr</span>
                    <div className="outlook-topics">
                      <span className="topic-pill">HRV-Resilienz</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Stressmanagement-Expertin Prof. Dr. Nadine Galandi</span>
                  </div>
                </div>
              </div>

              <button className="live-call-calendar-btn" style={{ marginTop: 'auto' }} onClick={() => alert('Erfolgreich zum Kalender hinzugefügt!')}>
                In Kalender eintragen
              </button>
            </div>
          </div>
        </div>

        <div className="dash-card feelgood-box-full">
          <div className="box-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            <i className="bi bi-stars feelgood-star-icon"></i>
            <h2 className="box-label" style={{ margin: 0 }}>Feel-Good-Area</h2>
            <div className="info-tooltip-container">
              <i className="bi bi-info-circle info-tooltip-icon"></i>
              <div className="info-tooltip-text" style={{ bottom: '135%' }}>
                Exklusiver Premium-Bereich mit mentalen Audio-Impulsen, Entspannungsübungen und Verjüngungstipps.
              </div>
            </div>
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
          </div>
          <div className="fg-items-grid">
            {/* CARD 1: ENERGIETANKSTELLE */}
            <div className="fg-v-card">
              <div className="fgh-img-16-9"><Image src="/images/feelgood_energy.png" fill alt="Energie" style={{ objectFit: 'cover' }} /></div>
              <div className="fgh-content">
                <strong>Energietankstelle</strong>
                <span>Sofort-Impulse für mehr Energie</span>
              </div>
            </div>

            {/* CARD 2: KLARHEITSRAUM */}
            <div className="fg-v-card">
              <div className="fgh-img-16-9"><Image src="/images/feelgood_clarity.png" fill alt="Fokus" style={{ objectFit: 'cover' }} /></div>
              <div className="fgh-content">
                <strong>Klarheitsraum</strong>
                <span>Zentriere dich voller Gelassenheit</span>
              </div>
            </div>

            {/* CARD 3: JUNGBRUNNEN */}
            <div 
               className="fg-v-card" 
               onClick={() => {
                 if (window.innerWidth <= 992) {
                   setJungbrunnenSubView('selection');
                 } else {
                   setActiveModal('jungbrunnen-selection');
                 }
               }} 
               style={{ cursor: 'pointer' }}
             >
              <div className="fgh-img-16-9"><Image src="/images/feelgood_youth.png" fill alt="Regeneration" style={{ objectFit: 'cover' }} /></div>
              <div className="fgh-content">
                <strong>Jungbrunnen</strong>
                <span>Jeden Tag eine Verjüngungsaktion</span>
              </div>
            </div>

            {/* CARD 4: STRAHLKRAFT */}
            <div className="fg-v-card">
              <div className="fgh-img-16-9"><Image src="/images/feelgood_radiance.png" fill alt="Glow" style={{ objectFit: 'cover' }} /></div>
              <div className="fgh-content">
                <strong>Strahlkraft</strong>
                <span>Strahle von innen und von außen</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* --- MODALS --- */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => { setActiveModal(null); setIsRecording(false); }}>
          <div className={`modal-content ${activeModal === 'activity' || activeModal === 'diamonds' || activeModal === 'jungbrunnen-selection' ? 'large-modal' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => { setActiveModal(null); setIsRecording(false); }}><i className="bi bi-x-lg"></i></button>
            
            {activeModal === 'activity' && (
              <div className="modal-body dual-pane">
                <div className="modal-pane-left">
                  <h3 className="modal-title">Schnelleingabe letzte Aktivitäten</h3>
                  {(() => {
                    const fallbackActs = [
                      { name: 'Rad gefahren', icon: 'bi-bicycle' },
                      { name: 'Krafttraining abgeschlossen', icon: 'bi-activity' },
                      { name: 'Zügig spazieren gegangen', icon: 'bi-person-walking' },
                      { name: 'Meditiert', icon: 'bi-flower1' },
                      { name: 'Power Nap gemacht', icon: 'bi-moon-stars' }
                    ];
                    
                    const recentActs = selectedActivities
                      .filter(name => name !== '8-8,5 Std. geschlafen' && name !== 'Zur Chronotyp-Zeit geschlafen')
                      .slice(-4)
                      .reverse();

                    const displayActs = [...recentActs];
                    fallbackActs.forEach(fallback => {
                      if (displayActs.length < 4 && !displayActs.includes(fallback.name)) {
                        displayActs.push(fallback.name);
                      }
                    });

                    const finalActs = displayActs.slice(0, 4);


                    return (
                      <div className="activity-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {finalActs.map(name => {
                          const icon = getIconForActivity(name);
                          const isActive = quickSelected === name;
                          const hasLogged = selectedActivities.includes(name);
                          const count = activityCounts[name] || 0;

                          return (
                            <div 
                              key={name} 
                              className={`act-opt-card ${isActive ? 'active' : ''}`} 
                              onClick={() => setQuickSelected(name)}
                              style={{ padding: '0.8rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px', position: 'relative', gap: '0.1rem' }}
                            >
                              {hasLogged && count > 0 && (
                                <span style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  background: '#22c55e',
                                  color: 'white',
                                  fontSize: '1.05rem',
                                  fontWeight: 900,
                                  borderRadius: '50px',
                                  padding: '3px 8px',
                                  lineHeight: 1,
                                  boxShadow: '0 2px 6px rgba(34, 197, 94, 0.4)'
                                }}>
                                  x{count}
                                </span>
                              )}
                              <i className={`bi ${icon}`} style={{ fontSize: '2.8rem', marginBottom: '0.05rem' }}></i>
                              <span style={{ fontSize: '0.88rem', lineHeight: '1.2', fontWeight: 500 }}>{name}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                  {(() => {
                    const selectedActConfig = activityOptions.find(a => a.name === quickSelected);
                    const dropdownOptions = selectedActConfig ? selectedActConfig.options : ['5 Min.', '10 Min.', '15 Min.', '30 Min.', '45 Min.', '60 Min.', '90 Min.', '120 Min.'];
                    const defaultVal = selectedActConfig ? selectedActConfig.defaultOption : '30 Min.';

                    let dropdownLabel = 'Wert';
                    if (selectedActConfig) {
                      const firstOpt = selectedActConfig.options[0];
                      if (firstOpt.includes('Min.') || firstOpt.includes('Std.')) {
                        dropdownLabel = 'Dauer';
                      } else if (firstOpt.includes('L')) {
                        dropdownLabel = 'Menge';
                      } else if (firstOpt.includes('Portion')) {
                        dropdownLabel = 'Portionen';
                      } else if (firstOpt.includes('Sek.')) {
                        dropdownLabel = 'Dauer (Sekunden)';
                      } else if (selectedActConfig.name.includes('Schritte')) {
                        dropdownLabel = 'Schritte';
                      } else if (firstOpt === 'Ja' || firstOpt === 'Nein') {
                        dropdownLabel = 'Erfolgreich absolviert';
                      }
                    }

                    return (
                      <div className="input-group">
                        <label>{dropdownLabel}</label>
                        <select 
                          className="qs-dropdown-select" 
                          value={activityValues[quickSelected] || defaultVal}
                          onChange={(e) => setActivityValues({...activityValues, [quickSelected]: e.target.value})}
                          style={{ width: '100%', padding: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '10px', background: '#fff', fontSize: '1rem', color: '#1e293b', outline: 'none', cursor: 'pointer', marginTop: '0.5rem' }}
                        >
                          {dropdownOptions.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })()}
                  <button 
                    className="save-btn" 
                    onClick={() => {
                      if (quickSelected) {
                        const currentCount = activityCounts[quickSelected] || 0;
                        const nextCount = currentCount + 1;
                        
                        const nextCounts = { ...activityCounts, [quickSelected]: nextCount };
                        setActivityCounts(nextCounts);
                        localStorage.setItem('ty-activity-counts', JSON.stringify(nextCounts));
                        window.dispatchEvent(new Event('ty-counts-sync'));

                        if (!selectedActivities.includes(quickSelected)) {
                          updateSelectedActivities([...selectedActivities, quickSelected]);
                        }
                      }
                      setActiveModal(null);
                    }}
                  >
                    Speichern
                  </button>
                </div>
                
                <div className="modal-pane-right">
                  <h3 className="modal-title">Wochenaktivität auswählen</h3>
                  <div className="search-bar-container">
                    <input 
                      type="text" 
                      placeholder="Neue Aktivität eintragen" 
                      className="search-input"
                      value={activitySearchTerm}
                      onChange={(e) => setActivitySearchTerm(e.target.value)}
                    />
                    <i className="bi bi-search search-icon"></i>
                  </div>

                  <div className="activity-list">
                    {(() => {
                      const groups: Record<string, any[]> = {};
                      filteredActivities.forEach(act => {
                        const cat = act.category || 'Sonstiges';
                        if (!groups[cat]) {
                          groups[cat] = [];
                        }
                        groups[cat].push(act);
                      });

                      const categoryOrder = [
                        'Schlaf & Erholung',
                        'Kraft & Ausdauer',
                        'Zellerneuerung & Wachstum',
                        'Immunbalance & Entlastung',
                        'Selbstfürsorge & Soziale Bindungen',
                        'Mentale Resilienz & Mindset',
                        'Sonstiges'
                      ];

                      const sortedCategoryNames = Object.keys(groups).sort((a, b) => {
                        const idxA = categoryOrder.indexOf(a);
                        const idxB = categoryOrder.indexOf(b);
                        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                        if (idxA !== -1) return -1;
                        if (idxB !== -1) return 1;
                        return a.localeCompare(b);
                      });

                      const categoryIcons: Record<string, string> = {
                        'Schlaf & Erholung': 'bi-moon-stars',
                        'Kraft & Ausdauer': 'bi-fire',
                        'Zellerneuerung & Wachstum': 'bi-dna',
                        'Immunbalance & Entlastung': 'bi-shield-check',
                        'Selbstfürsorge & Soziale Bindungen': 'bi-people',
                        'Mentale Resilienz & Mindset': 'bi-flower1'
                      };

                      return sortedCategoryNames.map(groupName => {
                        const sortedActs = [...groups[groupName]].sort((a, b) => a.name.localeCompare(b, 'de'));
                        const orderIdx = categoryOrder.indexOf(groupName);
                        const prefix = orderIdx !== -1 && groupName !== 'Sonstiges' ? (orderIdx + 1) + '. ' : '';

                        return (
                          <div key={groupName} className="activity-group" style={{ marginBottom: '1.5rem' }}>
                            <h4 className="activity-group-title">
                              <i className={`bi ${categoryIcons[groupName] || 'bi-bookmark'} group-icon`} style={{ color: '#6099cf', fontSize: '1.25rem' }}></i>
                              <span>{prefix}{groupName}</span>
                            </h4>
                            <div className="activity-group-items" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                              {sortedActs.map((act) => {
                                const isSelected = selectedActivities.includes(act.name);
                                return (
                                  <div key={act.name} className={`act-list-item ${isSelected ? 'selected' : ''}`}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', color: isSelected ? '#10b981' : '#6099cf' }}>
                                        <i className={`bi ${getIconForActivity(act.name)}`}></i>
                                      </div>
                                      <span className="act-name">{act.name}</span>
                                    </div>
                                    <div className="act-right-group">
                                      {(() => {
                                        const currentVal = activityValues[act.name] || act.defaultOption;
                                        const currentDiamonds = calculateDiamonds(act, currentVal);
                                        return (
                                          <>
                                            <select 
                                              className="act-duration-select" 
                                              value={currentVal}
                                              onChange={(e) => setActivityValues({...activityValues, [act.name]: e.target.value})}
                                            >
                                              {act.options.map((opt: string) => (
                                                <option key={opt}>{opt}</option>
                                              ))}
                                            </select>
                                            <div className="diamond-preview">
                                              {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`bi bi-gem ${i < currentDiamonds ? (isSelected ? 'active-gem-green' : 'active-gem-blue') : (isSelected ? 'inactive-gem-green' : 'inactive-gem')}`}></i>
                                              ))}
                                            </div>
                                            <button 
                                              className={`add-list-btn ${isSelected ? 'checked' : ''}`}
                                              onClick={() => {
                                                const currentCount = activityCounts[act.name] || 0;
                                                const nextCount = (currentCount + 1) % 6; // cycles 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 0
                                                
                                                const nextCounts = { ...activityCounts, [act.name]: nextCount };
                                                setActivityCounts(nextCounts);
                                                localStorage.setItem('ty-activity-counts', JSON.stringify(nextCounts));
                                                window.dispatchEvent(new Event('ty-counts-sync'));

                                                if (nextCount === 0) {
                                                  updateSelectedActivities(selectedActivities.filter(a => a !== act.name));
                                                } else if (!isSelected) {
                                                  updateSelectedActivities([...selectedActivities, act.name]);
                                                }
                                              }}
                                            >
                                              {isSelected && (activityCounts[act.name] || 1) > 1 ? (
                                                <span style={{ fontSize: '1.05rem', fontWeight: 900 }}>
                                                  x{activityCounts[act.name]}
                                                </span>
                                              ) : (
                                                <i className={isSelected ? 'bi bi-check-lg' : 'bi bi-plus'} style={{ fontSize: '1.2rem' }}></i>
                                              )}
                                            </button>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="pane-right-footer">
                    <button className="btn-back-text" onClick={() => setActiveModal(null)}><i className="bi bi-arrow-left"></i> Zurück</button>
                    <button className="btn-clear-text" onClick={() => { updateSelectedActivities([]); setActivitySearchTerm(''); setActivityValues({}); }}>Eingaben löschen</button>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'voice' && (
              <div className="modal-body voice-body">
                <h3 className="modal-title">Aktivität erfassen</h3>
                <p className="voice-hint">Beispiel: „Ich war gerade 30 Minuten Radfahren.“</p>
                <div className="voice-visualizer">
                  <div className={`v-bar ${isRecording ? 'active delay-1' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active delay-2' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active delay-3' : ''}`}></div>
                  <div className={`v-bar ${isRecording ? 'active delay-4' : ''}`}></div>
                </div>
                <div className={`mic-circle ${isRecording ? 'pulse' : ''}`}>
                  <i className="bi bi-mic-fill"></i>
                </div>
                {!isRecording ? (
                  <button className="save-btn" style={{ width: 'auto', padding: '1.2rem 4rem' }} onClick={() => setIsRecording(true)}>Jetzt aufnehmen</button>
                ) : (
                  <button className="save-btn recording" style={{ width: 'auto', padding: '1.2rem 4rem', backgroundColor: '#e21d48' }} onClick={() => { setIsRecording(false); setActiveModal(null); }}>Aufnahme beenden</button>
                )}
              </div>
            )}

            {activeModal === 'photo' && (
              <div className="modal-body" style={{ position: 'relative' }}>
                <h3 className="modal-title">Mahlzeit erfassen</h3>
                <p className="photo-hint">Fotografiere dein Essen für die KI-Analyse</p>
                <div className="camera-preview">
                  <div className="cam-image-overlay" style={{ backgroundImage: 'url(/images/meal_preview.png)' }}></div>
                  <div className="camera-grid-lines"></div>
                  <div className="camera-focus-bracket"></div>
                  <div className="camera-flash-overlay"></div>
                  
                  <div className="camera-live-badge">
                    <span className="live-dot"></span> LIVE-SUCHER
                  </div>
                  
                  {/* Dynamic camera status text */}
                  {(() => {
                    return (
                      <div className="camera-toast-container">
                        <span className="cam-text-toast"><i className="bi bi-camera-fill" style={{ marginRight: '6px' }}></i> KI-Bildoptimierung aktiv</span>
                      </div>
                    );
                  })()}
                </div>
                <div className="photo-btns" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                  <button 
                    className="save-btn" 
                    style={{ width: 'auto', padding: '0.8rem 2.5rem', background: '#006EA7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0, 110, 167, 0.2)', textAlign: 'center' }} 
                    onClick={(e) => {
                      const flash = document.querySelector('.camera-flash-overlay');
                      if (flash) {
                        flash.classList.add('flash-active');
                        setTimeout(() => {
                          flash.classList.remove('flash-active');
                          setActiveModal(null);
                        }, 500);
                      } else {
                        setActiveModal(null);
                      }
                    }}
                  >
                    Jetzt Bild machen
                  </button>
                </div>
              </div>
            )}

            {activeModal === 'diamonds' && (
              <div className="modal-body diamonds-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="diamonds-modal-header-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div className="diamonds-modal-badge" style={{ width: '55px', height: '55px', borderRadius: '18px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(96, 153, 207, 0.2)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.8em', height: '1.8em', color: '#6099cf' }}>
                      <path d="M6 3h12l4 6-10 12L2 9z"></path>
                      <path d="M11 3L8 9l3 12"></path>
                      <path d="M13 3l3 6-3 12"></path>
                      <path d="M2 9h20"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="modal-title" style={{ marginBottom: '0.2rem' }}>Diamonds Lounge</h3>
                    <p className="diamonds-modal-subtitle" style={{ fontSize: '1.05rem', color: '#64748b', margin: 0, fontWeight: 500 }}>Deine Aktivitäten der letzten 7 Tage</p>
                  </div>
                </div>

                <div className="diamonds-list-container" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '1rem', maxHeight: '480px', overflowY: 'auto' }}>
                  {(() => {
                    const getRelativeDateString = (daysAgo: number) => {
                      if (daysAgo === 0) return 'Heute';
                      if (daysAgo === 1) return 'Gestern';
                      const d = new Date();
                      d.setDate(d.getDate() - daysAgo);
                      const weekdayShort = d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
                      const dayAndMonth = d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
                      return `${weekdayShort}, ${dayAndMonth}`;
                    };

                    const safeSelected = Array.isArray(selectedActivities) ? selectedActivities : [];
                    const dynamicLoungeActivities = safeSelected
                      .filter(name => typeof name === 'string' && name !== 'alchemist-elixir') // exclude raw ID so we render it as custom Feel-Good item below
                      .map(name => {
                        const actConfig = activityOptions.find(a => a.name === name);
                        if (!actConfig) return null;
                        
                        const detail = activityValues[name] || actConfig.defaultOption;
                        const diamonds = calculateDiamonds(actConfig, detail);
                        const icon = getIconForActivity(name);
                        const isBarbell = typeof name === 'string' && name.toLowerCase().includes('kraft');
                        
                        return {
                          name,
                          detail,
                          daysAgo: 0, // logged this week -> show as "Heute"
                          diamonds,
                          icon,
                          isBarbell,
                          isCustomEmoji: false
                        };
                      }).filter(Boolean) as any[];

                    // 2. Feel-Good integration
                    const cryoDismissed = typeof window !== 'undefined' ? localStorage.getItem('ty-cryo-dismissed') === 'true' : false;
                    
                    if (!cryoDismissed) {
                      dynamicLoungeActivities.push({
                        name: 'Jungbrunnen: Cryo-Challenge',
                        detail: '2 Min. Eisdusche',
                        daysAgo: 0,
                        diamonds: 3,
                        icon: '❄️',
                        isBarbell: false,
                        isCustomEmoji: true
                      });
                    }

                    if (safeSelected.includes('alchemist-elixir')) {
                      dynamicLoungeActivities.push({
                        name: 'Elixier des Zell-Recyclings',
                        detail: '14 Std. Fasten + Eisdusche',
                        daysAgo: 0,
                        diamonds: 5,
                        icon: '🧪',
                        isBarbell: false,
                        isCustomEmoji: true
                      });
                    }

                    // Fallback to sample data only if no activities have been checked/active yet
                    const displayActivities = dynamicLoungeActivities.length > 0 
                      ? dynamicLoungeActivities 
                      : [
                          { name: 'Rad gefahren', detail: '30 Min.', daysAgo: 0, diamonds: 2, icon: 'bi-bicycle', isCustomEmoji: false },
                          { name: 'Vollwertige Hauptmahlzeit gegessen', detail: 'Ja', daysAgo: 0, diamonds: 3, icon: 'bi-apple', isCustomEmoji: false },
                          { name: 'Krafttraining abgeschlossen', detail: '60 Min.', daysAgo: 1, diamonds: 4, isBarbell: true, isCustomEmoji: false }
                        ];

                    const totalDiamonds = displayActivities.reduce((sum, act) => sum + act.diamonds, 0);

                    return (
                      <div className="diamonds-activities-table" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <div className="diamonds-table-header" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderBottom: '2px solid #e2e8f0', fontWeight: 800, fontSize: '1rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <span className="col-act" style={{ padding: '0.6rem 1rem', borderRight: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>Aktivität</span>
                          <span className="col-val" style={{ padding: '0.6rem 1rem', borderRight: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>Wert</span>
                          <span className="col-date" style={{ padding: '0.6rem 1rem', borderRight: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>Datum</span>
                          <span className="col-gems" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center' }}>Gewonnene Diamanten</span>
                        </div>
                        <div className="diamonds-table-body" style={{ display: 'flex', flexDirection: 'column' }}>
                          {displayActivities.map((act, index) => (
                            <div key={index} className="diamonds-table-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderBottom: '1px solid #e2e8f0' }}>
                              <span className="col-act" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', borderRight: '1.5px solid #e2e8f0' }}>
                                <div className="diamonds-act-icon-box" style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: '#6099cf', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                  {act.isBarbell ? (
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.4em', height: '1.4em', color: '#6099cf' }}>
                                      <path d="M6 7h1.5v10H6zm-2.5 2h1.5v6h-1.5zm13 0h1.5v6h-1.5zm2.5-2h1.5v10H19zm-11.5 4h10v2h-10z" />
                                    </svg>
                                  ) : act.isCustomEmoji ? (
                                    <span>{act.icon}</span>
                                  ) : (
                                    <i className={`bi ${act.icon}`}></i>
                                  )}
                                </div>
                                <div className="diamonds-act-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span className="diamonds-act-name" style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: 400 }}>{act.name}</span>
                                </div>
                              </span>
                              <span className="col-val" style={{ display: 'flex', alignItems: 'center', padding: '0.8rem 1rem', borderRight: '1.5px solid #e2e8f0', fontSize: '1.1rem', color: '#1e293b', fontWeight: 400 }}>
                                {act.detail}
                              </span>
                              <span className="col-date" style={{ display: 'flex', alignItems: 'center', padding: '0.8rem 1rem', borderRight: '1.5px solid #e2e8f0', fontSize: '1.1rem', color: '#475569', fontWeight: 400 }}>
                                {getRelativeDateString(act.daysAgo)}
                              </span>
                              <span className="col-gems" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem' }}>
                                <div className="diamond-preview" style={{ display: 'flex', gap: '3px' }}>
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`bi bi-gem ${i < act.diamonds ? 'active-gem-blue' : 'inactive-gem'}`} style={{ fontSize: '1.15rem' }}></i>
                                  ))}
                                </div>
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* BOTTOM STATS CARD CONTAINER */}
                        <div className="diamonds-bottom-stats-card" style={{ border: '1.5px solid #cbd5e1', borderRadius: '16px', overflow: 'hidden', marginTop: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                          {/* SUM ROW */}
                          <div className="diamonds-sum-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', background: '#ffffff', fontWeight: 700 }}>
                            <span className="col-act" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.15rem', color: '#1e293b', fontWeight: 800 }}>
                              Gesamt
                            </span>
                            <span className="col-val" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#94a3b8', fontWeight: 400 }}>
                              —
                            </span>
                            <span className="col-date" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#64748b', fontWeight: 500 }}>
                              Letzte 7 Tage
                            </span>
                            <span className="col-gems" style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1.3em', height: '1.3em', color: '#22c55e' }}>
                                <path d="M6 3h12l4 6-10 12L2 9z"></path>
                                <path d="M11 3L8 9l3 12"></path>
                                <path d="M13 3l3 6-3 12"></path>
                                <path d="M2 9h20"></path>
                              </svg>
                              <span style={{ fontSize: '1.25rem', color: '#22c55e', fontWeight: 800 }}>{totalDiamonds} Diamanten</span>
                            </span>
                          </div>
                          {/* TREND ROW */}
                          <div className="diamonds-trend-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr 1.5fr', padding: '0', borderTop: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700 }}>
                            <span className="col-act" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.15rem', color: '#1e293b', fontWeight: 800 }}>
                              Trend zu Vorwoche
                            </span>
                            <span className="col-val" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#94a3b8', fontWeight: 400 }}>
                              —
                            </span>
                            <span className="col-date" style={{ padding: '0.8rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.1rem', color: '#16a34a', fontWeight: 600, gap: '0.4rem' }}>
                              +12%
                            </span>
                            <span className="col-gems" style={{ padding: '0.8rem 1rem', display: 'flex', alignItems: 'center' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 1rem', borderRadius: '50px', background: '#f0fdf4', border: '1.5px solid #bbf7d0', color: '#15803d', fontSize: '0.95rem', fontWeight: 700 }}>
                                Auf Longevity-Kurs
                              </div>
                            </span>
                          </div>
                          {/* LONG-TERM TREND ROW WITH CHART */}
                          <div className="diamonds-longterm-trend-row" style={{ display: 'grid', gridTemplateColumns: '2.2fr 3.7fr', padding: '0', borderTop: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700 }}>
                            <span className="col-act" style={{ padding: '1.2rem 1rem', borderRight: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', fontSize: '1.15rem', color: '#1e293b', fontWeight: 800 }}>
                              Langzeittrend
                            </span>
                            <span style={{ padding: '0.65rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
                                {(() => {
                                  const getWeekRangeString = (weeksAgo: number) => {
                                    const now = new Date();
                                    const currentDay = now.getDay();
                                    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
                                    
                                    const monday = new Date(now);
                                    monday.setDate(now.getDate() + distanceToMonday - (weeksAgo * 7));
                                    
                                    const sunday = new Date(monday);
                                    sunday.setDate(monday.getDate() + 6);
                                    
                                    const format = (d: Date) => {
                                      return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
                                    };
                                    
                                    return format(sunday);
                                  };

                                  return (
                                    <svg viewBox="0 0 400 90" style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                                      <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                                        </linearGradient>
                                      </defs>
                                      
                                      {/* Background grid line */}
                                      <line x1="15" y1="70" x2="385" y2="70" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
                                      <line x1="15" y1="45" x2="385" y2="45" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
                                      <line x1="15" y1="20" x2="385" y2="20" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />

                                      {/* Filled gradient area */}
                                      <path d="M 15 60 C 80 40, 100 35, 138 35 C 180 35, 220 58, 261 58 C 300 58, 350 15, 385 15 L 385 70 L 15 70 Z" fill="url(#chartGrad)" />

                                      {/* Glow line */}
                                      <path d="M 15 60 C 80 40, 100 35, 138 35 C 180 35, 220 58, 261 58 C 300 58, 350 15, 385 15" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.15" fill="none" />
                                      
                                      {/* Chart line */}
                                      <path d="M 15 60 C 80 40, 100 35, 138 35 C 180 35, 220 58, 261 58 C 300 58, 350 15, 385 15" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" fill="none" />

                                      {/* Data points */}
                                      <circle cx="15" cy="60" r="4" fill="#fff" stroke="#22c55e" strokeWidth="2.5" />
                                      <circle cx="138" cy="35" r="4" fill="#fff" stroke="#22c55e" strokeWidth="2.5" />
                                      <circle cx="261" cy="58" r="4" fill="#fff" stroke="#22c55e" strokeWidth="2.5" />
                                      <circle cx="385" cy="15" r="6" fill="#22c55e" stroke="#fff" strokeWidth="2" />
                                      <circle cx="385" cy="15" r="9" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />

                                      {/* Labels */}
                                      <text x="15" y="86" fontSize="13" fill="#94a3b8" fontWeight="600" textAnchor="middle">{getWeekRangeString(3)}</text>
                                      <text x="138" y="86" fontSize="13" fill="#94a3b8" fontWeight="600" textAnchor="middle">{getWeekRangeString(2)}</text>
                                      <text x="261" y="86" fontSize="13" fill="#94a3b8" fontWeight="600" textAnchor="middle">{getWeekRangeString(1)}</text>
                                      <text x="385" y="86" fontSize="13" fill="#22c55e" fontWeight="700" textAnchor="middle">{getWeekRangeString(0)}</text>
                                    </svg>
                                  );
                                })()}
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="diamonds-modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button className="save-btn" style={{ width: 'auto', padding: '1rem 3rem' }} onClick={() => setActiveModal(null)}>Schließen</button>
                </div>
              </div>
            )}

            {activeModal === 'jungbrunnen-selection' && (
              <div className="modal-body jungbrunnen-selection-modal" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: '55px', height: '55px', borderRadius: '18px', background: '#ffffff', border: '2.5px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontSize: '1.8rem' }}>
                    <i className="bi bi-droplet-fill"></i>
                  </div>
                  <div>
                    <h3 className="modal-title" style={{ margin: 0 }}>Dein täglicher Jungbrunnen</h3>
                  </div>
                </div>

                <div className="selection-options-grid" style={{ gap: '1.25rem', marginTop: '0.5rem' }}>
                  
                  {/* OPTION 1: DAS LANGLEBIGKEITS-ORAKEL */}
                  <div 
                    onClick={() => {
                      setJungbrunnenSubView('oracle');
                      setActiveModal(null);
                    }}
                    style={{
                      background: '#fff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'row',
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.01)';
                    }}
                  >
                    {/* Left 25% Image */}
                    <div style={{ width: '25%', position: 'relative', minHeight: '130px' }}>
                      <Image 
                        src="/images/feelgood_youth.png" 
                        fill 
                        alt="Orakel" 
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>
                    
                    {/* Right 75% Content */}
                    <div style={{ width: '75%', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <strong style={{ fontSize: 'calc(1.1rem + 3pt)', color: '#1e293b' }}>1. Verjüngungskarte</strong>
                      <p style={{ fontSize: 'calc(0.9rem + 2pt)', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                        Ziehe deine Tageskarte und enthülle deine tägliche biologische Verjüngungsaktion.
                      </p>
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', fontWeight: 700, fontSize: 'calc(0.9rem + 2pt)' }}>
                        Karte ziehen <i className="bi bi-chevron-right"></i>
                      </div>
                    </div>
                  </div>

                  {/* OPTION 2: DER LONGEVITY-ALCHEMIST */}
                  <div 
                    onClick={() => {
                      setJungbrunnenSubView('alchemist');
                      setActiveModal(null);
                    }}
                    style={{
                      background: '#fff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '24px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'row',
                      overflow: 'hidden',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.01)',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#16a34a';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(22, 163, 74, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.01)';
                    }}
                  >
                    {/* Left 25% Image */}
                    <div style={{ width: '25%', position: 'relative', minHeight: '130px' }}>
                      <Image 
                        src="/images/feelgood_energy.png" 
                        fill 
                        alt="Alchemist" 
                        style={{ objectFit: 'cover' }} 
                      />
                    </div>

                    {/* Right 75% Content */}
                    <div style={{ width: '75%', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      <strong style={{ fontSize: 'calc(1.1rem + 3pt)', color: '#1e293b' }}>2. Verjüngungselixier</strong>
                      <p style={{ fontSize: 'calc(0.9rem + 2pt)', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                        Mische dein tägliches Verjüngungselixier aus Langlebigkeitszutaten zusammen.
                      </p>
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a', fontWeight: 700, fontSize: 'calc(0.9rem + 2pt)' }}>
                        Trank brauen <i className="bi bi-chevron-right"></i>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container { padding: 2rem; min-height: 100vh; display: flex; flex-direction: column; gap: 2rem; }
        
        .top-row { display: grid; grid-template-columns: 1fr 0.8fr 1fr; gap: 1.5rem; align-items: stretch; }
        .bottom-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

        @media (max-width: 1024px) {
          .top-row { display: flex; flex-direction: column; gap: 1.5rem; }
          .center-section { order: -1; }
          .bottom-row { grid-template-columns: 1fr; gap: 1.5rem; }
          .dashboard-container { padding: 1.5rem 1.5rem 85px 1.5rem; }
          .greeting-h1 br { display: none; }
        }

        @media (max-width: 768px) {
          .dashboard-container { padding: 1rem 1rem 85px 1rem; gap: 1.25rem; }
        }

        .dash-card {
          background: #fff;
          border-radius: 28px;
          padding: 1.5rem;
          border: 1px solid #f1f5f9;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
        }

        .box-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
        .box-label { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0; }
        .focus-sun-icon { color: #4498ca; font-size: 1.2rem; }
        .tracker-icon { color: #4498ca; font-size: 1.4rem; }
        .entry-grid-icon { color: #4498ca; font-size: 1.2rem; }
        .feelgood-star-icon { color: #4498ca; font-size: 1.2rem; }

        /* BOX 1: FOCUS */
        .focus-hero-row { display: flex; gap: 1.25rem; align-items: center; margin-bottom: 1.5rem; }
        .sunflower-circle { width: 84px; height: 84px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .focus-title { font-size: 1.4rem; font-weight: 800; color: #4498ca; margin: 0; }
        .focus-desc { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; line-height: 1.4; }
        .focus-cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .f-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 0.6rem; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .f-card:hover { transform: translateY(-4px); border-color: #cbd5e1; box-shadow: 0 10px 24px rgba(0,0,0,0.06); }
        .f-card-img { height: 110px; border-radius: 16px; overflow: hidden; position: relative; margin-bottom: 0.5rem; }
        .f-card-img :global(img) { transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .f-card:hover .f-card-img :global(img) { transform: scale(1.08); }
        .f-card-label { font-size: 0.85rem; font-weight: 700; color: #1e293b; transition: color 0.2s; }
        .f-card:hover .f-card-label { color: #006ea7; }

        /* CENTER SECTION */
        .center-section { text-align: center; }
        .date-display { font-size: 1.15rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
        .greeting-h1 { font-size: 2.2rem; font-weight: 500; color: #1e293b; margin: 0.4rem 0 1.5rem; line-height: 1.1; }
        .name-blue { color: #4498ca; font-weight: 800; }
        .avatar-outer-circle { display: inline-block; padding: 10px; border-radius: 50%; background: #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.1); max-width: 100%; box-sizing: border-box; }
        .avatar-inner { width: 288px; height: 288px; max-width: 100%; aspect-ratio: 1; border-radius: 50%; overflow: hidden; position: relative; }
        .avatar-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 110, 167, 0.75);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .avatar-camera-badge {
          position: absolute;
          bottom: 15px;
          right: 15px;
          width: 52px;
          height: 52px;
          background: white;
          color: #006EA7;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 5;
        }
        .avatar-camera-badge i {
          color: #006EA7 !important;
          transition: color 0.2s ease;
        }
        .avatar-camera-badge:hover {
          background: #006EA7;
          transform: scale(1.1);
          box-shadow: 0 10px 24px rgba(0, 110, 167, 0.3);
        }
        .avatar-camera-badge:hover i {
          color: white !important;
        }

        /* BOX 2: TRACKER */
        .tracker-top-btns { display: grid; grid-template-columns: 55px 1fr 1fr; gap: 0.6rem; margin-bottom: 1.25rem; }
        .add-btn { height: 55px; background: #6099cf; color: #fff; border: none; border-radius: 16px; font-size: 1.4rem; cursor: pointer; box-shadow: 0 4px 10px rgba(96, 153, 207, 0.25); transition: all 0.2s; }
        .add-btn:hover { background: #4498ca; transform: translateY(-2px); }
        .voice-btn, .photo-btn { 
          height: 55px; background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; 
          display: flex; align-items: center; justify-content: center; gap: 0.55rem; 
          font-weight: 750; color: #334155; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          font-size: 1.05rem; transition: all 0.2s;
        }
        .voice-btn:hover, .photo-btn:hover { 
          background: #eef7fc; 
          transform: translateY(-3px); 
          border-color: #6099cf; 
          color: #4498ca;
          box-shadow: 0 8px 20px rgba(96, 153, 207, 0.15);
        }
        .voice-btn:hover i, .photo-btn:hover i { color: #4498ca; }
        .voice-btn i, .photo-btn i { font-size: 1.40rem; color: #6099cf; transition: color 0.2s; }

        .tracker-label { font-size: 0.6rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.08em; margin-bottom: 0.75rem; text-transform: uppercase; }
        .activities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; margin-bottom: 1.25rem; }
        
        .activity-card {
          background: #fff; border: 1px solid #f1f5f9; border-radius: 18px;
          padding: 1rem 0.4rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
        }
        .act-icon-wrap { font-size: 2.1rem; color: #6099cf; margin-bottom: 0.15rem; display: flex; align-items: center; justify-content: center; }
        .activity-card strong { font-size: 0.85rem; color: #1e293b; }
        .act-duration { font-size: 0.8rem; color: #4498ca; font-weight: 500; }

        .diamonds-footer-pill { 
          background: #eefdf8; 
          border-radius: 20px; padding: 0.9rem 1.25rem; 
          display: flex; justify-content: space-between; align-items: center; margin-top: auto; 
          border: 1px solid rgba(115, 196, 128, 0.2);
          cursor: pointer;
          transition: all 0.2s;
        }
        .diamonds-footer-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(115, 196, 128, 0.15);
        }
        .diamonds-title { font-size: 1rem; font-weight: 800; color: #2d4a57; margin-bottom: 1px; }
        .diamonds-sub { font-size: 0.9rem; color: #64748b; font-weight: 600; }
        
        .diamonds-score-pill {
          background: #fff; border: 2.2px solid #73c480; border-radius: 50px;
          padding: 0.4rem 1.2rem; display: flex; align-items: center; gap: 0.5rem;
          font-weight: 800; color: #4498ca; font-size: 1.1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .diamonds-score-pill svg { color: #4498ca; }

        /* BOTTOM BOXES */
        .entry-items-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .entry-h-card { background: #f8fafc; border-radius: 20px; padding: 1rem; display: flex; align-items: center; gap: 1rem; border: 1px solid #f1f5f9; cursor: pointer; transition: all 0.2s; }
        .entry-h-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .ehc-img { width: 45px; height: 45px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }

        .fg-items-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .fg-v-card {
          background: #f8fafc;
          border-radius: 20px;
          border: 1.5px solid #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,0.01);
        }
        .fg-v-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.04);
          border-color: #38bdf8;
        }
        .fgh-img-16-9 {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }
        .fgh-content {
          padding: 0.9rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
        .fgh-content strong {
          font-size: 1.05rem;
          color: #1e293b;
          font-weight: 800;
        }
        .fgh-content span {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.35;
        }
        .fg-bullets { list-style-type: disc; margin: 4px 0 0 0; padding-left: 1.15rem; display: flex; flex-direction: column; gap: 4px; }
        .fg-bullets li { font-size: 0.875rem; color: #64748b; line-height: 1.35; text-align: left; }

        /* MODALS */
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);
          z-index: 10000; display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
        }
        .modal-content {
          background: #fff; width: 100%; max-width: 500px; border-radius: 32px;
          padding: 2.5rem; position: relative; box-shadow: 0 40px 80px rgba(0,0,0,0.15);
        }
        .modal-content.large-modal { max-width: 1150px; }
        
        .dual-pane { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; }
        .modal-pane-left { display: flex; flex-direction: column; }
        .modal-pane-right { display: flex; flex-direction: column; border-left: 1.5px solid #f1f5f9; padding-left: 3rem; }
        
        .search-bar-container { position: relative; margin-bottom: 1.5rem; }
        .search-input { width: 100%; padding: 0.9rem 1.2rem 0.9rem 3rem; border: 1.5px solid #bae6fd; border-radius: 20px; font-size: 0.95rem; color: #1e293b; outline: none; transition: all 0.2s; }
        .search-input:focus { border-color: #6099cf; }
        .search-input::placeholder { color: #94a3b8; }
        .search-icon { position: absolute; left: 1.2rem; top: 50%; transform: translateY(-50%); color: #6099cf; font-size: 1.1rem; }
        
        .activity-list { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; max-height: 380px; overflow-y: auto; padding-right: 0.5rem; }
        .activity-list::-webkit-scrollbar { width: 6px; }
        .activity-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .activity-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .activity-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .activity-group-title {
          font-size: 1.05rem;
          font-weight: 900;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 1.8rem 0 0.8rem 0.2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .activity-group:first-of-type .activity-group-title {
          margin-top: 0.2rem;
        }
        
        .act-list-item { background: #f0f8ff; border: 1.5px solid #e0f2fe; border-radius: 12px; padding: 0.8rem 1rem; display: flex; align-items: center; justify-content: space-between; }
        .act-list-item.selected { background: #f0fdf4; border-color: #86d59b; }
        
        .act-name { font-weight: 400 !important; color: #1e293b; font-size: 0.95rem; }
        .act-right-group { display: flex; align-items: center; gap: 1rem; }
        
        .act-duration-select { border: 1px solid #cbd5e1; border-radius: 8px; padding: 0.3rem 0.5rem; background: #fff; outline: none; font-size: 0.8rem; color: #334155; cursor: pointer; }
        
        .diamond-preview { display: flex; gap: 2px; }
        .diamond-preview i { font-size: 0.85rem; }
        .active-gem-blue { color: #6099cf; }
        .inactive-gem { color: #d6e8f7; }
        .active-gem-green { color: #22c55e; }
        .inactive-gem-green { color: #bbf7d0; }
        
        .add-list-btn { width: 39px; height: 39px; border-radius: 50%; border: 2px solid #6099cf; background: transparent; color: #6099cf; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 1.3rem; padding: 0; }
        .add-list-btn.checked { background: #22c55e; border-color: #22c55e; color: #fff; }
        
        .pane-right-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
        .btn-back-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; padding: 0; }
        .btn-back-text:hover { color: #1e293b; }
        .btn-clear-text { background: none; border: none; color: #94a3b8; font-weight: 500; cursor: pointer; font-size: 0.85rem; padding: 0; }
        .btn-clear-text:hover { color: #64748b; }
        .modal-close-btn {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: #f1f5f9; border: none; width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b;
        }
        .modal-title { font-size: 1.6rem; font-weight: 850; color: #1e293b; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        
        .activity-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .act-opt-card { 
          background: #f8fafc; border: 2px solid transparent; border-radius: 20px;
          padding: 1.25rem 0.5rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          cursor: pointer; transition: all 0.2s;
        }
        .act-opt-card:hover { background: #f0f8ff; border-color: #bae6fd; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .act-opt-card i { font-size: 1.6rem; color: #6099cf; }
        .act-opt-card span { font-size: 0.8rem; font-weight: 700; color: #475569; }
        .act-opt-card.active { background: #e0f2fe; border-color: #6099cf; }
        .act-opt-card.active i { color: #0369a1; }
        .act-opt-card.active span { color: #0369a1; }

        .input-group { margin-bottom: 2rem; }
        .input-group label { display: block; font-size: 0.9rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; }
        .input-group input { 
          width: 100%; padding: 1rem; border-radius: 16px; border: 1.5px solid #e2e8f0;
          font-size: 1.1rem; font-weight: 700; color: #1e293b; outline: none;
        }
        .input-group input:focus { border-color: #6099cf; }

        .save-btn {
          width: 100%; padding: 1.2rem; background: #0f172a; color: #fff; border: none;
          border-radius: 18px; font-size: 1.1rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
        }
        .save-btn:hover { background: #4498ca; transform: translateY(-2px); }

        .voice-body { text-align: center; }
        .voice-hint { color: #64748b; margin-bottom: 2.5rem; font-weight: 500; font-size: 1.15rem; }
        .voice-visualizer { display: flex; justify-content: center; gap: 4px; height: 30px; margin-bottom: 2rem; align-items: center; }
        .v-bar { width: 4px; height: 10px; background: #e2e8f0; border-radius: 2px; transition: all 0.2s; }
        .v-bar.active { height: 25px; background: #6099cf; animation: pulse-bar 1s infinite; }
        .v-bar.delay-1 { animation-delay: 0.2s; }
        .v-bar.delay-2 { animation-delay: 0.4s; }
        .v-bar.delay-3 { animation-delay: 0.6s; }
        .v-bar.delay-4 { animation-delay: 0.8s; }
        @keyframes pulse-bar { 0%, 100% { height: 15px; } 50% { height: 30px; } }
        
        .mic-circle {
          width: 80px; height: 80px; border-radius: 50%; background: #fff;
          color: #6099cf; display: flex; align-items: center; justify-content: center;
          font-size: 2.2rem; margin: 0 auto 3rem;
          border: 1.5px solid #6099cf;
          box-shadow: 0 8px 20px rgba(96, 153, 207, 0.1);
        }
        .mic-circle.pulse { animation: pulse-mic 2s infinite; }
        @keyframes pulse-mic { 0% { box-shadow: 0 0 0 0 rgba(96, 153, 207, 0.4); } 70% { box-shadow: 0 0 0 25px rgba(96, 153, 207, 0); } 100% { box-shadow: 0 0 0 0 rgba(96, 153, 207, 0); } }

        .photo-hint { color: #64748b; margin-bottom: 1.5rem; font-weight: 500; font-size: 1.15rem; text-align: center; }
        .camera-preview {
          width: 100%; aspect-ratio: 16 / 9; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 24px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          color: #64748b; gap: 1rem; margin-bottom: 2rem; border: 1.5px dashed #cbd5e1;
          position: relative; overflow: hidden;
        }
        @keyframes cameraPan {
          0% {
            transform: scale(1.0) translate(0px, 0px) rotate(0deg);
          }
          50% {
            transform: scale(1.12) translate(-14px, -8px) rotate(0.6deg);
          }
          100% {
            transform: scale(1.0) translate(0px, 0px) rotate(0deg);
          }
        }
        .cam-image-overlay {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 1; z-index: 0;
          animation: cameraPan 6s ease-in-out infinite;
          transform-origin: center;
        }
        
        /* Camera UI elements */
        .camera-grid-lines {
          position: absolute; inset: 0;
          pointer-events: none; z-index: 1;
          background: 
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px) 33.33% 0,
            linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px) 66.66% 0,
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px) 0 33.33%,
            linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px) 0 66.66%;
          background-size: 100% 100%;
        }
        
        .camera-focus-bracket {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 80px; height: 80px;
          pointer-events: none; z-index: 2;
          border: 2px dashed rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          animation: focusPulse 2s infinite ease-in-out;
        }
        @keyframes focusPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); border-color: rgba(255, 255, 255, 0.4); }
          50% { transform: translate(-50%, -50%) scale(1.05); border-color: rgba(0, 110, 167, 0.8); }
        }
        
        .camera-flash-overlay {
          position: absolute; inset: 0;
          background: #fff;
          opacity: 0; z-index: 999;
          pointer-events: none;
          transition: opacity 0.05s ease-out;
        }
        .camera-flash-overlay.flash-active {
          opacity: 1;
          transition: none;
        }
        
        .camera-live-badge {
          position: absolute; top: 1.25rem; left: 1.25rem;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          color: #fff; font-size: 0.7rem; font-weight: 800;
          padding: 0.4rem 0.8rem; border-radius: 50px;
          display: flex; align-items: center; gap: 0.4rem;
          letter-spacing: 0.05em; z-index: 2;
        }
        .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #ef4444;
          animation: blinkDot 1s infinite steps(2);
        }
        @keyframes blinkDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .camera-toast-container {
          position: absolute; bottom: 1.25rem;
          left: 50%; transform: translateX(-50%);
          z-index: 2;
        }
        .cam-text-toast {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          color: #fff; font-size: 0.8rem; font-weight: 600;
          padding: 0.5rem 1.2rem; border-radius: 12px;
          display: inline-flex; align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .photo-btns { display: flex; justify-content: center; }
        .cam-shutter { 
          width: 70px; height: 70px; border-radius: 50%; border: 4px solid #fff;
          background: transparent; position: relative; cursor: pointer;
        }
        .cam-shutter::after {
          content: ''; position: absolute; inset: 4px; border-radius: 50%; background: #fff;
          transition: transform 0.1s;
        }
        .cam-shutter:active::after { transform: scale(0.9); }
        .diamonds-table-row { transition: background-color 0.15s ease; }
        .diamonds-table-row:hover { background-color: #f1f7fc !important; }
        
        /* LIVE CALL PREVIEW STYLE */
        .live-call-box { display: flex; flex-direction: column; }
        .live-badge {
          background: rgba(236, 72, 153, 0.1);
          color: #ec4899;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.3rem 0.65rem;
          border-radius: 50px;
          margin-left: auto;
          letter-spacing: 0.03em;
        }
        .live-call-body { display: flex; gap: 1.5rem; margin-top: 0.5rem; flex: 1; align-items: stretch; }
        .lc-left-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          flex: 1.1;
          align-items: stretch;
        }
        .lc-right-col {
          flex: 0.9;
          border-left: 1.5px solid #e2e8f0;
          padding-left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0;
        }
        .outlook-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.25rem 0;
        }
        .outlook-items-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .outlook-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 0.6rem;
          transition: all 0.2s ease;
        }
        .outlook-item:hover {
          transform: translateY(-2px);
          border-color: #cbd5e1;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
        }
        .outlook-date-badge {
          width: 48px;
          height: 48px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          flex-shrink: 0;
          text-align: center;
        }
        .badge-month {
          background: #4498ca;
          color: #ffffff;
          font-size: 0.55rem;
          font-weight: 900;
          padding: 1px 0;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .badge-day {
          font-size: 1.15rem;
          font-weight: 900;
          color: #1e293b;
          line-height: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
        }
        .outlook-details {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }
        .outlook-date-str {
          font-size: 0.82rem;
          font-weight: 800;
          color: #0f172a;
          white-space: nowrap;
        }
        .outlook-topics {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .topic-pill {
          background: rgba(68, 152, 202, 0.08);
          color: #4498ca;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 50px;
          border: 1px solid rgba(68, 152, 202, 0.15);
          letter-spacing: 0.01em;
        }
        .live-call-img-container {
          position: relative;
          width: 100%;
          height: 135px;
          border-radius: 14px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0,0,0,0.06);
          margin-top: 0;
        }
        .live-call-topic-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, rgba(15, 23, 42, 0.05) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0.6rem;
        }
        .live-call-tag {
          font-size: 0.6rem;
          font-weight: 800;
          color: #ec4899;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.15rem;
        }
        .live-call-topic-title {
          font-size: 0.8rem;
          font-weight: 750;
          color: white;
          margin: 0;
          line-height: 1.2;
        }
        .live-call-details {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 0.5rem;
          flex: 1;
          margin-top: 0;
        }
        .live-call-date-text {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
        }
        .live-countdown-grid {
          display: flex;
          gap: 0.5rem;
          margin: 0;
        }
        .live-countdown-item {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.3rem 0.45rem;
          min-width: 44px;
          text-align: center;
          display: flex;
          flex-direction: column;
        }
        .lc-num {
          font-size: 1rem;
          font-weight: 900;
          color: #1e3a5f;
          line-height: 1;
        }
        .lc-label {
          font-size: 0.55rem;
          font-weight: 750;
          color: #94a3b8;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .live-btn-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
          margin-top: 0.5rem;
          width: 100%;
        }
        .live-call-join-btn {
          background: #004D77;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0.5rem 1rem;
          font-size: 0.82rem;
          font-weight: 750;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          box-shadow: 0 4px 10px rgba(0, 77, 119, 0.15);
          width: 100%;
        }
        .live-call-join-btn:hover {
          background: #006EA7;
          box-shadow: 0 4px 12px rgba(0, 110, 167, 0.2);
          transform: translateY(-1px);
        }
        .live-call-calendar-btn {
          background: #ffffff;
          color: #004D77;
          border: 1.5px solid #004D77;
          border-radius: 12px;
          padding: 0.5rem 1rem;
          font-size: 0.82rem;
          font-weight: 750;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          width: 100%;
        }
        .live-call-calendar-btn:hover {
          background: #f0f7fb;
          transform: translateY(-1px);
        }
        
        /* RESPONSIVE MOBILE LAYOUT FOR LIVE CALL */
        @media (max-width: 768px) {
          .live-call-body {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }
          .lc-left-col {
            width: 100%;
          }
          .lc-right-col {
            width: 100%;
            border-left: none;
            padding-left: 0;
            margin-top: 0;
          }
        }
        
        @media (max-width: 580px) {
          .live-call-img-container {
            width: 100% !important;
            height: 150px !important;
            margin-top: 0 !important;
          }
          .live-call-details {
            margin-top: 0 !important;
            gap: 0.6rem;
          }
          .live-call-join-btn {
            align-self: stretch !important;
          }
          .lc-left-col {
            flex-direction: column;
            align-items: stretch;
          }
        }

        /* Tooltip-Styling */
        .info-tooltip-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          margin-left: 8px;
          cursor: help;
        }
        .info-tooltip-icon {
          color: #4498ca;
          font-size: 1.05rem;
          transition: transform 0.2s, color 0.2s;
          cursor: pointer;
        }
        .info-tooltip-container:hover .info-tooltip-icon {
          color: #006ea7;
          transform: scale(1.2);
        }
        .info-tooltip-text {
          visibility: hidden;
          width: 340px;
          background-color: #0f172a;
          color: #fff;
          text-align: left;
          border-radius: 12px;
          padding: 0.85rem 1rem;
          position: absolute;
          z-index: 100;
          bottom: 125%;
          right: -20px;
          left: auto;
          transform: none;
          opacity: 0;
          transition: opacity 0.2s, visibility 0.2s;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.15);
          font-size: 0.8rem;
          font-weight: 500;
          line-height: 1.45;
          white-space: normal;
        }
        .info-tooltip-text.tooltip-down {
          bottom: auto;
          top: 125%;
        }
        .info-tooltip-text strong {
          color: #38bdf8;
          font-weight: 700;
        }
        .info-tooltip-text::after {
          content: "";
          position: absolute;
          top: 100%;
          right: 24px;
          left: auto;
          margin-left: 0;
          border-width: 5px;
          border-style: solid;
          border-color: #0f172a transparent transparent transparent;
        }
        .info-tooltip-text.tooltip-down::after {
          top: auto;
          bottom: 100%;
          border-color: transparent transparent #0f172a transparent;
        }

        .info-tooltip-container:hover .info-tooltip-text {
          visibility: visible;
          opacity: 1;
        }

        .selection-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 992px) {
          .selection-options-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }

        /* Responsive Mobile Centering for Tooltips in App View */
        @media (max-width: 992px) {
          .box-header {
            position: relative;
          }
          .info-tooltip-container {
            position: static;
          }
          .info-tooltip-text {
            left: 10px !important;
            right: 10px !important;
            width: auto !important;
            transform: none !important;
            bottom: auto !important;
            top: 45px !important;
            box-sizing: border-box;
          }
          .info-tooltip-text::after {
            display: none !important;
          }
        }

        body.oracle-scroll-lock {
          overflow: hidden !important;
          height: 100% !important;
        }
      `}</style>
    </div>
  );
}
