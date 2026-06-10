'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

type CoachVariant = 'lisa-jung' | 'lisa-alt' | 'tom-jung' | 'tom-alt';
type FormatTab = 'text' | 'voice';
type SessionType = 'daily' | 'weekly' | 'quarterly';
type SessionPhase = 'entry' | 'checkin-energy' | 'checkin-stress' | 'checkin-focus' | 'data-pull' | 'verstehen' | 'fokus' | 'empfehlung' | 'commitment' | 'syncing' | 'closing';
type ViewMode = 'welcome' | 'setup' | 'preparing' | 'session';
type SetupStep = 'coach' | 'personality' | 'data';

interface ChatMsg {
  id: number;
  from: 'coach' | 'user' | 'system';
  text: string;
  widget?: 'entry-options' | 'energy' | 'stress' | 'focus' | 'data-pull' | 'data-result' | 'action-plan' | 'commitment' | 'system-sync' | 'closing';
  answered?: boolean;
}

const coachVariants: Record<CoachVariant, { name: string; image: string; desc: string; voice: string; greeting: string }> = {
  'lisa-jung': { name: 'Lisa AI, 25 Jahre', image: '/images/lisa.png', desc: 'Jung, modern & empathisch', voice: 'nova', greeting: 'Hallo, ich bin Lisa – dein persönlicher Coach.' },
  'lisa-alt': { name: 'Lisa AI, 50 Jahre', image: '/images/lisa_alt.png', desc: 'Erfahren, weise & warmherzig', voice: 'shimmer', greeting: 'Hallo, ich bin Lisa – dein persönlicher Coach.' },
  'tom-jung': { name: 'Tom AI, 25 Jahre', image: '/images/tom_jung.png', desc: 'Dynamisch, motivierend & direkt', voice: 'echo', greeting: 'Hallo, ich bin Tom – dein persönlicher Coach.' },
  'tom-alt': { name: 'Tom AI, 50 Jahre', image: '/images/tom_alt.png', desc: 'Gelassen, strukturiert & erfahren', voice: 'onyx', greeting: 'Hallo, ich bin Tom – dein persönlicher Coach.' },
};
const getPersonalityDesc = (x: number, y: number) => {
  const r = (1-x)*(1-y), ye = x*(1-y), g = x*y, b = (1-x)*y;
  const types = [
    { w: r, color: 'Rot', desc: 'kompakt' },
    { w: ye, color: 'Gelb', desc: 'inspirativ' },
    { w: g, color: 'Grün', desc: 'unterstützend' },
    { w: b, color: 'Blau', desc: 'faktenorientiert' },
  ].filter(t => t.w > 0.12).sort((a, b) => b.w - a.w);
  if (!types.length) return { primary: 'Ausgewogen', desc: 'Vereint alle Qualitäten' };
  const p = types[0];
  const sec = types[1];
  if (p.w > 0.5) return { primary: p.color, desc: `Stark ${p.desc}` };
  return { primary: p.color, desc: sec ? `${p.desc}, mit Tendenz ${sec.desc}` : p.desc };
};
const focusTopics = [
  { id: 'erholung', label: 'Schlaf & Erholung', icon: '🌙', desc: 'Schlaf & Regeneration' },
  { id: 'kraft', label: 'Kraft & Ausdauer', icon: '⚡', desc: 'Bewegung & Sport' },
  { id: 'vitalitaet', label: 'Zellerneuerung & Wachstum', icon: '🌿', desc: 'Zellgesundheit & Ernährung' },
  { id: 'balance', label: 'Immunbalance & Entlastung', icon: '🧠', desc: 'Stress & Soziales' },
  { id: 'selbstfuersorge', label: 'Selbstfürsorge & Soziale Bindungen', icon: '🎯', desc: 'Routinen & Mentales' },
  { id: 'resilienz', label: 'Mentale Resilienz & Mindset', icon: '♾️', desc: 'Adaptionsfähigkeit' },
];
const phaseLabels: Record<SessionPhase, string> = {
  'entry': 'Einstieg', 'checkin-energy': 'Check-in', 'checkin-stress': 'Check-in',
  'checkin-focus': 'Check-in', 'data-pull': 'Datenanalyse', 'verstehen': 'Verstehen',
  'fokus': 'Fokus setzen', 'empfehlung': 'Empfehlung', 'commitment': 'Commitment',
  'syncing': 'Wird übertragen', 'closing': 'Abschluss',
};
const phaseProgress: Record<SessionPhase, number> = {
  'entry': 5, 'checkin-energy': 10, 'checkin-stress': 18, 'checkin-focus': 25,
  'data-pull': 35, 'verstehen': 48, 'fokus': 60, 'empfehlung': 75,
  'commitment': 85, 'syncing': 95, 'closing': 100,
};
const dataLabels = [
  { icon: '🏃', label: 'Bewegung', loading: 'Sportdaten werden geladen...', val: '8.420', unit: 'Schritte/Tag', sub: '↑ 14% vs. Vorwoche', trend: 'good', pct: 78,
    spark: '0,24 10,22 20,18 30,15 40,12 50,8 60,4', sparkColor: 'rgba(80,200,120,.9)' },
  { icon: '😴', label: 'Schlaf', loading: 'Schlafdaten werden geladen...', val: '6h 12min', unit: 'Durchschnitt', sub: '↓ Qualität gesunken', trend: 'down', pct: 48,
    spark: '0,8 10,2 20,14 30,20 40,27 50,25 60,21', sparkColor: 'rgba(220,100,80,.9)' },
  { icon: '❤️', label: 'HRV', loading: 'HRV-Daten werden geladen...', val: '46 ms', unit: 'Durchschnitt', sub: '↑ über deiner Baseline', trend: 'good', pct: 72,
    spark: '0,22 10,20 20,16 30,14 40,10 50,7 60,3', sparkColor: 'rgba(80,200,120,.9)' },
  { icon: '💓', label: 'Ruhepuls', loading: 'Vitaldaten werden geladen...', val: '72 bpm', unit: 'Durchschnitt', sub: '↑ leicht erhöht', trend: 'up', pct: 62,
    spark: '0,26 10,18 20,14 30,10 40,2 50,6 60,10', sparkColor: 'rgba(220,140,60,.9)' },
];
const syncItems = [
  { label: 'Action Plan erstellt' },
  { label: 'Erinnerung: 21:15 – Atemübung starten' },
  { label: 'Erinnerung: 21:30 – Handy aus Schlafzimmer' },
  { label: 'Tracking aktiviert: Schlafqualität' },
  { label: 'Nächster Check-in: Morgen, 20:00 Uhr' },
];
const getRelativeDate = (daysAgo: number, timeStr: string): string => {
  if (daysAgo === 1) return `Gestern, ${timeStr}`;
  if (daysAgo < 7) return `Vor ${daysAgo} Tagen, ${timeStr}`;
  
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const day = d.getDate();
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${day}. ${months[d.getMonth()]}, ${timeStr}`;
};

const pastSessions = [
  { id: 1, date: getRelativeDate(1, '14:30'), focus: 'Tages-Check-in & Wohlbefinden', summary: 'Kurzer Austausch zu deiner heutigen Energie und Tagesverfassung. Du hast deine aktuelle Priorität auf weniger Stress im Alltag gesetzt.', output: 'Notiz: Stress-Fokus', duration: '4 Min.', type: 'Lisa AI Daily' },
  { id: 2, date: getRelativeDate(2, '18:00'), focus: 'Optimierungsfeld: Immunbalance', summary: 'Wir haben einen machbaren "Babyschritt" für den Alltag erarbeitet: 10 Minuten Spaziergang nach dem Mittagessen. Plan B bei Regen steht ebenfalls.', output: 'Gewohnheit: Spaziergang', duration: '8 Min.', type: 'Lisa AI Weekly' },
  { id: 3, date: getRelativeDate(3, '09:15'), focus: 'Kurzer Morgen-Check', summary: 'Du hast von leichtem Muskelkater nach dem Training berichtet. Wir haben kurz über ausreichende Proteinzufuhr am heutigen Tag gesprochen.', output: 'Notiz: Regeneration', duration: '3 Min.', type: 'Lisa AI Daily' },
  { id: 4, date: getRelativeDate(5, '18:45'), focus: 'Abendlicher Check-in', summary: 'Kurze Reflexion über den heutigen Stresslevel. Du bist zufrieden mit deiner Arbeitsleistung, möchtest aber heute früher schlafen.', output: 'Notiz: Früher Schlafen', duration: '5 Min.', type: 'Lisa AI Daily' },
  { id: 5, date: getRelativeDate(7, '08:00'), focus: 'Start in den Tag', summary: 'Du fühlst dich heute sehr energiegeladen. Keine besonderen Hürden für den Tag in Sicht.', output: 'Notiz: Hohe Energie', duration: '3 Min.', type: 'Lisa AI Daily' },
  { id: 6, date: getRelativeDate(9, '19:30'), focus: 'Kurzer Abend-Check', summary: 'Ein anstrengender Tag. Du hast den Spaziergang heute ausgelassen, planst ihn aber für morgen wieder fest ein.', output: 'Notiz: Spaziergang', duration: '4 Min.', type: 'Lisa AI Daily' },
  { id: 7, date: getRelativeDate(12, '08:15'), focus: 'Morgen-Motivation', summary: 'Gute Schlafqualität laut deinen Daten. Kurzer Fokus auf die wichtigsten Aufgaben des Tages.', output: 'Notiz: Fokus', duration: '5 Min.', type: 'Lisa AI Daily' },
  { id: 8, date: getRelativeDate(14, '18:00'), focus: 'Optimierungsfeld: Schlaf & Erholung', summary: 'Hindernisse für rechtzeitiges Schlafen analysiert. Als Lösung haben wir eine strikte Offline-Zeit ab 21:30 Uhr vereinbart.', output: 'Abendroutine angepasst', duration: '9 Min.', type: 'Lisa AI Weekly' },
  { id: 9, date: getRelativeDate(15, '17:45'), focus: 'Nachmittags-Check', summary: 'Kurze Meldung von dir, dass die Offline-Zeit gestern gut funktioniert hat.', output: 'Notiz: Routine klappt', duration: '2 Min.', type: 'Lisa AI Daily' },
  { id: 10, date: getRelativeDate(18, '09:00'), focus: 'Wochenstart', summary: 'Check-in zum Wochenstart. Du bist motiviert, die Abendroutine diese Woche konsequent durchzuziehen.', output: 'Notiz: Motivation', duration: '4 Min.', type: 'Lisa AI Daily' },
  { id: 11, date: getRelativeDate(21, '18:00'), focus: 'Optimierungsfeld: Kraft & Ausdauer', summary: 'Integration von 2 kurzen Krafteinheiten pro Woche besprochen. Wir haben feste Tage im Kalender geblockt.', output: 'Gewohnheit: Training', duration: '10 Min.', type: 'Lisa AI Weekly' },
  { id: 12, date: getRelativeDate(28, '18:00'), focus: 'Optimierungsfeld: Zellversorgung', summary: 'Fokus auf Proteinziele am Morgen. Wir haben ein schnelles Frühstücksrezept als Standard definiert.', output: 'Gewohnheit: Protein-Frühstück', duration: '8 Min.', type: 'Lisa AI Weekly' },
  { id: 13, date: getRelativeDate(90, '18:00'), focus: 'Standortbestimmung & Reflexion', summary: 'Blick aus der Helikopterperspektive auf die letzten Wochen. Zufriedenheit mit Fortschritten reflektiert und das nächste Hauptthema definiert.', output: 'Fokus-Shift: Ernährung', duration: '14 Min.', type: 'Lisa AI Quarterly' },
];

interface Coaching2PageProps {
  onOpenAvatar?: () => void;
  autoStartSession?: string | null;
  clearAutoStart?: () => void;
}

export default function Coaching2Page({ onOpenAvatar, autoStartSession, clearAutoStart }: Coaching2PageProps) {
  const [view, setView] = useState<ViewMode>('welcome');
  const [coachVariant, setCoachVariant] = useState<CoachVariant>('lisa-jung');
  const [setupStep, setSetupStep] = useState<SetupStep>('coach');
  const [dataVisualType, setDataVisualType] = useState('emotional');
  const [coachGender, setCoachGender] = useState<'female' | 'male' | null>(null);
  const [personalityPos, setPersonalityPos] = useState({ x: 0.5, y: 0.5 });
  const [playingVoice, setPlayingVoice] = useState<CoachVariant | null>(null);
  const [formatTab, setFormatTab] = useState<FormatTab>('text');
  const [sessionTime, setSessionTime] = useState(0);
  const [phase, setPhase] = useState<SessionPhase>('entry');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [energy, setEnergy] = useState(0);
  const [stress, setStress] = useState(0);
  const [focusTopic, setFocusTopic] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dataLoadStage, setDataLoadStage] = useState(0);
  const [dataItems, setDataItems] = useState(0);
  const [syncStage, setSyncStage] = useState(0);
  const [syncDone, setSyncDone] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [rightTab, setRightTab] = useState<'today'|'history'|'customize'>('today');
  const [sessionType, setSessionType] = useState<SessionType>('daily');
  const [showMoreRecs, setShowMoreRecs] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

  const getFormattedCurrentDate = () => {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const now = new Date();
    const dayName = days[now.getDay()];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${dayName}, ${hours}:${minutes} Uhr`;
  };

  useEffect(() => {
    setSelectedSessionId(null);
  }, [rightTab]);

  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const c = coachVariants[coachVariant];
  const focusData = focusTopics.find(t => t.id === focusTopic);

  useEffect(() => {
    if (chatRef.current) setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }), 120);
  }, [messages, isTyping, dataLoadStage, dataItems, syncStage]);

  useEffect(() => {
    let iv: NodeJS.Timeout;
    if (view === 'session') iv = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [view]);

  useEffect(() => {
    if (dataLoadStage === 1) {
      let item = 0;
      const iv = setInterval(() => { item++; setDataItems(item); if (item >= 4) { clearInterval(iv); setTimeout(() => setDataLoadStage(2), 600); } }, 700);
      return () => clearInterval(iv);
    }
  }, [dataLoadStage]);

  useEffect(() => {
    if (dataLoadStage === 2) {
      (async () => {
        await addCoachMsg('', 'data-result', 400);
        const eDesc = energy <= 2 ? 'niedrig' : energy <= 3 ? 'mittel' : 'gut';
        await addCoachMsg(
          `Deine Daten zeigen ein gemischtes Bild: Bewegung und HRV zeigen eine sehr positive Entwicklung, allerdings ist deine Schlafqualität in den letzten Tagen gesunken und dein Ruhepuls leicht erhöht. Zusammen mit deinem Energielevel (${eDesc}) und Stresslevel (${stress}/5) ergibt sich ein konkreter Ansatzpunkt. Was beschäftigt dich beim Thema ${focusData?.label} am meisten?`,
          undefined, 1800
        );
        setPhase('verstehen');
      })();
    }
  }, [dataLoadStage]);

  useEffect(() => {
    if (syncStage > 0 && syncStage <= 5) {
      const t = setTimeout(() => setSyncStage(s => s + 1), 700);
      return () => clearTimeout(t);
    }
    if (syncStage > 5) {
      setTimeout(() => {
        setSyncDone(true);
        setPhase('closing');
        addCoachMsg('Alles eingerichtet! Für heute zählt nur ein Schritt: Handy um 21:30 raus aus dem Schlafzimmer. Beim nächsten Check-in schauen wir, ob sich dein Einschlafen stabilisiert hat.', 'closing', 1000);
      }, 500);
    }
  }, [syncStage]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const speakText = async (text: string) => {
    if (!text || formatTab !== 'voice') return;
    try {
      const res = await fetch('/api/tts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice: c.voice }) });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.pause(); }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch (e) { console.error('TTS error:', e); }
  };

  const playVoiceSample = (variant: CoachVariant) => {
    if (playingVoice === variant) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setPlayingVoice(null); return;
    }
    if (audioRef.current) { audioRef.current.pause(); }
    setPlayingVoice(variant);
    const audio = new Audio(`/audio/${variant}.mp3`);
    audioRef.current = audio;
    audio.onended = () => setPlayingVoice(null);
    audio.play().catch(() => setPlayingVoice(null));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const fd = new FormData();
        fd.append('audio', blob, 'audio.webm');
        try {
          const res = await fetch('/api/whisper', { method: 'POST', body: fd });
          const data = await res.json();
          if (data.text) handleUserReply(data.text);
        } catch (e) { console.error('Whisper error:', e); }
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);
    } catch (e) { console.error('Mic error:', e); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    setIsListening(false);
  };

  const handlePfPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPersonalityPos({
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    });
  }, []);

  const addCoachMsg = (text: string, widget?: ChatMsg['widget'], delay = 800) => {
    setIsTyping(true); setIsSpeaking(true);
    return new Promise<void>(res => {
      setTimeout(() => { setMessages(p => [...p, { id: Date.now() + Math.random(), from: 'coach', text, widget }]); setIsTyping(false); setIsSpeaking(false); if (text) speakText(text); res(); }, delay);
    });
  };
  const addUserMsg = (text: string) => setMessages(p => [...p, { id: Date.now() + Math.random(), from: 'user', text }]);
  const addSystemMsg = (text: string, widget?: ChatMsg['widget']) => setMessages(p => [...p, { id: Date.now() + Math.random(), from: 'system', text, widget }]);
  const markAnswered = () => setMessages(p => { const cp = [...p]; for (let i = cp.length - 1; i >= 0; i--) { if (cp[i].widget && !cp[i].answered) { cp[i] = { ...cp[i], answered: true }; break; } } return cp; });

  const startSession = async (type: SessionType = 'daily') => {
    setSessionType(type);
    setView('preparing');
    setTimeout(async () => {
      setSessionTime(0); setMessages([]); setPhase('entry');
      setEnergy(0); setStress(0); setFocusTopic('');
      setDataLoadStage(0); setDataItems(0); setSyncStage(0); setSyncDone(false);
      setIsAnimating(true);
      setTimeout(() => { setView('session'); setIsAnimating(false); }, 50);
      await addCoachMsg('Hallo Monique! Schön, dass du dir Zeit für dich nimmst. Was möchtest du heute machen?', 'entry-options', 1200);
    }, 4500);
  };

  useEffect(() => {
    if (autoStartSession) {
      startSession(autoStartSession as SessionType);
      clearAutoStart?.();
    }
  }, [autoStartSession, clearAutoStart]);

  const handleEntryChoice = async (ch: string) => { markAnswered(); addUserMsg(ch); setPhase('checkin-energy'); await addCoachMsg('Bevor wir starten – wie ist deine Energie heute?', 'energy', 900); };
  const handleEnergy = async (v: number) => { setEnergy(v); markAnswered(); addUserMsg(`Energie: ${v}/5`); setPhase('checkin-stress'); await addCoachMsg('Und wie hoch ist dein Stress gerade?', 'stress', 700); };
  const handleStress = async (v: number) => { setStress(v); markAnswered(); addUserMsg(`Stress: ${v}/5`); setPhase('checkin-focus'); setMessages([]); await addCoachMsg('Worauf möchtest du heute schauen?', 'focus', 700); };
  const handleFocus = async (id: string) => {
    setFocusTopic(id); markAnswered();
    const t = focusTopics.find(x => x.id === id);
    addUserMsg(t?.label || '');
    setPhase('data-pull');
    await addCoachMsg(`${t?.label} – verstanden. Lass mich kurz deine aktuellen Daten anschauen...`, undefined, 800);
    addSystemMsg('', 'data-pull');
    setDataLoadStage(1);
  };
  const handleUserReply = async (text: string) => {
    addUserMsg(text);
    if (phase === 'verstehen') {
      setPhase('fokus');
      await addCoachMsg('Das bestätigt, was ich in deinen Daten sehe. Deine Schlafqualität leidet, und das zieht sich durch Energie und Stressresistenz. Lass uns darauf fokussieren, was du abends noch ändern kannst. Was passiert bei dir in der letzten Stunde vor dem Schlafen?', undefined, 1500);
    } else if (phase === 'fokus') {
      setPhase('empfehlung');
      await addCoachMsg('Das passt genau zu deinem HRV-Verlauf – die Erholungsphasen starten bei dir erst spät in der Nacht. Bildschirmzeit hält dein Nervensystem im Sympathikus-Modus. Ich habe auf Basis deiner Daten einen konkreten Plan erarbeitet:', 'action-plan', 1600);
    }
  };
  const handleShowCommitment = async () => { markAnswered(); setPhase('commitment'); await addCoachMsg('Wie klingt das für dich?', 'commitment', 500); };
  const handleCommitment = async (ch: 'accept' | 'adjust' | 'decline') => {
    markAnswered();
    if (ch === 'accept') {
      addUserMsg('Ja, das mache ich!'); setPhase('syncing');
      await addCoachMsg('Perfekt! Ich übertrage den Plan jetzt in dein System...', undefined, 600);
      addSystemMsg('', 'system-sync'); setSyncStage(1);
    } else if (ch === 'adjust') {
      addUserMsg('Ich passe es lieber an.');
      await addCoachMsg('Kein Problem! Alternative: Handy ab 22:00 auf Flugmodus stellen – gleicher Mechanismus, etwas flexibler.', undefined, 1200);
      setPhase('syncing');
      await addCoachMsg('Ich richte die angepasste Version ein...', undefined, 800);
      addSystemMsg('', 'system-sync'); setSyncStage(1);
    } else {
      addUserMsg('Heute nicht realistisch.'); setPhase('closing');
      await addCoachMsg('Völlig okay. Ich merke mir das und passe den nächsten Vorschlag an. Bis bald!', 'closing', 1200);
    }
  };
  const handleEndSession = () => { setIsAnimating(true); setTimeout(() => { setView('welcome'); setSessionTime(0); setMessages([]); setIsAnimating(false); }, 300); };

  const getQuickReplies = (): string[] => {
    if (phase === 'verstehen') return ['Ich schlafe genug, aber wache unausgeruht auf.', 'Abends komme ich schwer zur Ruhe.', 'Mein Schlafrhythmus ist durcheinander.'];
    if (phase === 'fokus') return ['Ja, ich bin abends oft noch am Handy.', 'Ich schaue meistens noch Serien.', 'Ich grüble über den nächsten Tag.'];
    return [];
  };
  const showQR = !isTyping && (phase === 'verstehen' || phase === 'fokus') && messages.length > 0 && messages[messages.length - 1].from === 'coach' && !messages[messages.length - 1].widget;

  return (
    <div className="cr">
      <div className="cr-bg"><div className="cr-g" /><div className="cr-d" /></div>
      <div className="cr-in">

        {/* WELCOME BENTO - PREMIUM */}
        {view === 'welcome' && (
          <div className="w-bento">
            <div className="wb-main">
              <div className="wb-hero-lg">
                <div className="wbl-glow"></div>
                {coachVariant === 'lisa-jung' ? (
                  <video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline className="wbl-video" onCanPlay={(e) => { e.currentTarget.playbackRate = 0.75; }} />
                ) : (
                  <img src={c.image} alt={c.name} className="wbl-video" style={{ objectFit: 'cover' }} />
                )}
              </div>
              <div className="wbl-name">{c.name.split(',')[0].trim()}</div>
              <div className="wbl-status"><span className="wbl-dot" />Online · bereit für dich</div>
              <p className="wb-tagline">
                {coachVariant.startsWith('lisa') ? 'Deine persönliche Longevity Trainerin' : 'Dein persönlicher Longevity Trainer'}
              </p>
            </div>
            
            <div className="wb-sidebar">
              <div className="wbs-header">
                <h1 className="wb-title">Wähle dein Session-Format</h1>
              </div>

              {/* Format choice: Text-Chat or Voice-Chat without heading */}
              <div className="wb-tabs-format" style={{ marginTop: '0.4rem', marginBottom: '0.8rem' }}>
                <button className={`wb-tab ${formatTab === 'text' ? 'act' : ''}`} onClick={() => setFormatTab('text')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Text-Chat
                </button>
                <button className={`wb-tab ${formatTab === 'voice' ? 'act' : ''}`} onClick={() => setFormatTab('voice')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                  Voice-Chat
                </button>
              </div>

              <div className="wb-session-btns">
                <button className="wb-stype-btn" onClick={() => startSession('daily')}>
                  <div className="wbsb-left">
                    <div className="wbsb-body">
                      <div className="wbsb-title">1. Daily</div>
                      <div className="wbsb-desc">Kurzer täglicher Check-In zur Tagesverfassung</div>
                    </div>
                  </div>
                  <div className="wbsb-right">
                    <span className="wbsb-time">5 Min</span>
                  </div>
                </button>

                <button className="wb-stype-btn" onClick={() => startSession('weekly')}>
                  <div className="wbsb-left">
                    <div className="wbsb-body">
                      <div className="wbsb-title">2. Weekly</div>
                      <div className="wbsb-desc">Wöchentliche Session zum Aufbau neuer Routinen</div>
                    </div>
                  </div>
                  <div className="wbsb-right">
                    <span className="wbsb-time">10 Min</span>
                  </div>
                </button>

                <button className="wb-stype-btn" onClick={() => startSession('quarterly')}>
                  <div className="wbsb-left">
                    <div className="wbsb-body">
                      <div className="wbsb-title">3. Quarterly</div>
                      <div className="wbsb-desc">Quartalsweise Reflexion der Longevity-Reise</div>
                    </div>
                  </div>
                  <div className="wbsb-right">
                    <span className="wbsb-time">15 Min</span>
                  </div>
                </button>
              </div>

              <div className="wb-bottom-btns">
                <button className="wb-bottom-btn btn-history" onClick={() => setRightTab('history')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Gesprächshistorie
                </button>
                <button className="wb-bottom-btn btn-config" onClick={() => setView('setup')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Konfiguration Trainer/in
                </button>
              </div>

              {rightTab === 'history' && (
                <div className="wb-history-overlay">
                  <div className="wbh-header">
                    <h3 className="wbh-title">Deine Trainings-Historie</h3>
                    <button className="wij-back-btn" onClick={() => setRightTab('today')} style={{ marginLeft: 'auto' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg> Zurück
                    </button>
                  </div>
                  <div className="wbh-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input className="wbh-inp" placeholder="Session suchen..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                  </div>
                  <div className="wbh-list">
                    {pastSessions.filter(s => !historySearch || s.focus.toLowerCase().includes(historySearch.toLowerCase())).map(s => {
                      const typeStr = s.type || 'Daily';
                      const bdgClass = typeStr.includes('Daily') ? 'bdg-daily' : typeStr.includes('Weekly') ? 'bdg-weekly' : 'bdg-quarterly';
                      const isExpanded = selectedSessionId === s.id;
                      const extendedText = s.summary + ' ' + (typeStr.includes('Daily') ? 'Zusätzlich haben wir kurz die wichtigsten To-Dos des Tages abgestimmt und einen Moment der Achtsamkeit eingebaut. Du warst sehr fokussiert.' : typeStr.includes('Weekly') ? 'Dabei haben wir auch potenzielle Hindernisse analysiert und konkrete Wenn-Dann-Pläne geschmiedet, um im Alltag konsequent zu bleiben.' : 'Die Reflexion zeigte deutlich, dass du auf einem guten Weg bist. Wir haben gemeinsam beschlossen, den Fokus im nächsten Quartal noch stärker auf Konstanz zu legen.');
                      return (
                        <div key={s.id} className={`wbh-item ${isExpanded ? 'expanded' : ''}`} onClick={() => setSelectedSessionId(isExpanded ? null : s.id)}>
                          <div className="wbhi-meta">
                            <span className={`wbhi-type ${bdgClass}`}>{typeStr}</span>
                            <span className="wbhi-date">{s.date}</span>
                            <span className="wbhi-dur">{s.duration}</span>
                          </div>
                          <div className="wbhi-focus">{s.focus}</div>
                          <div className="wbhi-sum">{isExpanded ? extendedText : s.summary}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PREPARING SCREEN - PREMIUM */}
        {view === 'preparing' && (
          <div className="prep-screen">
            <div className="p-aurora-bg">
              <div className="p-orb p-orb-1"></div>
              <div className="p-orb p-orb-2"></div>
              <div className="p-orb p-orb-3"></div>
            </div>
            <div className="prep-content">
              <div className="pc-lens">
                {coachVariant === 'lisa-jung' ? (
                  <video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline className="pc-avatar" onCanPlay={(e) => { e.currentTarget.playbackRate = 0.75; }} />
                ) : (
                  <img src={c.image} alt={c.name} className="pc-avatar" style={{ objectFit: 'cover' }} />
                )}
              </div>
              <h2 className="pc-title">Dein Mindspace wird vorbereitet</h2>
              <div className="pc-steps-container">
                <div className="pc-step" style={{animationDelay: '0.5s'}}>Synchronisiere Biosignale...</div>
                <div className="pc-step" style={{animationDelay: '1.5s'}}>Lade letzte Trainings-Erkenntnisse...</div>
                <div className="pc-step" style={{animationDelay: '2.5s'}}>Personalisiere den heutigen Fokus...</div>
              </div>
            </div>
          </div>
        )}

        {/* SETUP MODAL */}
        {view === 'setup' && (
          <div className="smod">
            <div className="smod-in" style={{ position: 'relative' }}>
              <button 
                className="smod-close"
                onClick={() => { setView('welcome'); setSetupStep('coach'); setCoachGender(null); }} 
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'white', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e293b', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s', zIndex: 10 }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
              </button>
              <div className="smod-h">
                <div style={{width:80}}></div>
                <div className="smod-steps">
                  <span className={`smod-s ${setupStep === 'coach' && !coachGender ? 'act' : 'done'}`}>
                    <span className="smod-num">1</span> Geschlecht
                  </span>
                  <span className={`smod-s ${setupStep === 'coach' && coachGender ? 'act' : (setupStep === 'personality' || setupStep === 'data' ? 'done' : '')}`}>
                    <span className="smod-num">2</span> Aussehen & Stimme
                  </span>
                  <span className={`smod-s ${setupStep === 'personality' ? 'act' : (setupStep === 'data' ? 'done' : '')}`}>
                    <span className="smod-num">3</span> Persönlichkeit
                  </span>
                  <span className={`smod-s ${setupStep === 'data' ? 'act' : ''}`}>
                    <span className="smod-num">4</span> Zusammenfassung
                  </span>
                </div>
                <div style={{width:80}} />
              </div>

              {setupStep === 'coach' && (
                <div className="smod-cnt">
                  {!coachGender ? (
                    <div className="g-sel" style={{marginTop:'1.5rem'}}>
                      <h2 className="smod-t" style={{marginBottom:'1rem'}}>Wähle dein Trainer-Geschlecht</h2>
                      <div className="ggrid">
                        <button className="gcard gcard-female" onClick={() => setCoachGender('female')}>
                          <div className="gcard-ico female">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="9" r="6" />
                              <path d="M12 15V22M9 19H15" />
                            </svg>
                          </div>
                          <span className="gcard-title">Weiblich</span>
                        </button>
                        <button className="gcard gcard-male" onClick={() => setCoachGender('male')}>
                          <div className="gcard-ico male">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="10" cy="14" r="6" />
                              <path d="M15 9l6-6M21 9V3h-6" />
                            </svg>
                          </div>
                          <span className="gcard-title">Männlich</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="v-sel">
                      <div className="cgrid" style={{gridTemplateColumns: '1fr 1fr', maxWidth: '680px', margin: '0 auto'}}>
                        {(['lisa-jung','lisa-alt','tom-jung','tom-alt'] as CoachVariant[])
                          .filter(v => coachGender === 'female' ? v.startsWith('lisa') : v.startsWith('tom'))
                          .map(v => {
                            const cv = coachVariants[v];
                            return (
                              <button key={v} className={`ccard ${coachVariant===v?'sel':''}`} onClick={() => setCoachVariant(v)}>
                                <div className="ccard-img"><Image src={cv.image} alt={cv.name} width={210} height={210} style={{objectFit:'cover',borderRadius:'50%'}} />{coachVariant===v&&<span className="ccard-chk">✓</span>}</div>
                                <div className="ccard-name">
                                  {cv.name.split(', ')[0]}
                                  {cv.name.includes(', ') && <span style={{ fontWeight: 500, color: '#64748b' }}>, {cv.name.split(', ')[1]}</span>}
                                </div>
                                <button className={`ccard-voice ${playingVoice===v?'playing':''}`} onClick={(e) => { e.stopPropagation(); playVoiceSample(v); }}>
                                  {playingVoice===v ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                                  ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                                  )}
                                  <span style={{fontSize: '0.9rem'}}>Stimme (Sample)</span>
                                </button>
                              </button>
                            );
                          })}
                      </div>
                      <div style={{display:'flex', gap:'1rem', justifyContent:'center', marginTop:'2.5rem'}}>
                        <button className="smod-next" style={{marginTop:0}} onClick={() => setSetupStep('personality')}>Weiter</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {setupStep === 'personality' && (
                <div className="smod-cnt" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5rem', flex: 1, margin: '0 auto', width: '100%', maxWidth: '850px' }}>
                    <div style={{ flex: '0 0 320px', textAlign: 'left' }}>
                      <h2 className="smod-t" style={{ textAlign: 'left', marginBottom: '1rem', fontSize: '1.4rem', lineHeight: 1.3 }}>Trainer/in Persönlichkeit<br/>nach DISC-Methodik</h2>
                      <p className="smod-sub" style={{ textAlign: 'left', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Setze den Punkt dort, wo du dich am ehesten wiederfindest.</p>
                      <button className="smod-next" onClick={() => setSetupStep('data')} style={{ marginTop: 0 }}>Weiter</button>
                    </div>
                    <div>
                      <div className="pf-wrap" style={{ margin: '2rem 0' }}>
                        <div className="pf-labels">
                          <span className="pf-l pf-tl">Rot<br/><small>Kompakt</small></span>
                          <span className="pf-l pf-tr">Gelb<br/><small>Inspirativ</small></span>
                          <span className="pf-l pf-bl">Blau<br/><small>Faktenorientiert</small></span>
                          <span className="pf-l pf-br">Grün<br/><small>Unterstützend</small></span>
                        </div>
                        <div
                          className="pf-field"
                          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handlePfPointer(e); }}
                          onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) handlePfPointer(e); }}
                        >
                          <div className="pf-dot" style={{left:`${personalityPos.x*100}%`,top:`${personalityPos.y*100}%`}} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {setupStep === 'data' && (
                <div className="smod-cnt" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Dynamic background based on personality */}
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '100%', height: '100%', zIndex: 0, opacity: 0.15, filter: 'blur(80px)', pointerEvents: 'none',
                    background: `radial-gradient(circle at ${personalityPos.x * 100}% ${personalityPos.y * 100}%, #00b4d8, #7209b7, transparent 70%)`
                  }} />

                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1, padding: 0 }}>
                    <div style={{ 
                      width: '100%', maxWidth: '800px', 
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1rem',
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))', 
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.5)', 
                      borderRadius: '20px', 
                      padding: '1rem 1.5rem', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,1)',
                      position: 'relative', overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', transform: 'translate(-30%, -30%)', borderRadius: '50%' }} />

                      {/* Left Column: Picture and Info */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                          <div style={{ position: 'absolute', inset: '-4px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '50%', opacity: 0.5, filter: 'blur(6px)', animation: 'pulse 3s infinite alternate' }} />
                          <div style={{ width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
                            <Image src={coachVariants[coachVariant].image} alt={coachVariants[coachVariant].name} width={90} height={90} style={{ objectFit: 'cover' }} />
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                              {coachVariants[coachVariant].name.split(', ')[0]}
                              {coachVariants[coachVariant].name.includes(', ') && <span style={{ fontWeight: 400, color: '#64748b' }}>, {coachVariants[coachVariant].name.split(', ')[1]}</span>}
                            </div>
                            <div style={{ padding: '0.1rem 0.4rem', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600 }}>Active</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                            {coachGender === 'female' ? 'Weibliche Stimme' : 'Männliche Stimme'}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Personality Box */}
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                        <div style={{ background: 'rgba(248,250,252,0.8)', borderRadius: '16px', padding: '1.25rem', border: '1px solid rgba(226,232,240,0.8)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Persönlichkeitsprofil</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', background: 'rgba(255,255,255,1)', padding: '0.25rem 0.75rem', borderRadius: '999px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                              {getPersonalityDesc(personalityPos.x, personalityPos.y).primary}
                            </div>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.2rem' }}><span>Kompakt (Rot)</span><span>{Math.round((1-personalityPos.x)*(1-personalityPos.y)*100)}%</span></div>
                              <div style={{ height: '5px', background: 'rgba(239,68,68,0.1)', borderRadius: '999px', overflow: 'hidden' }}><div style={{ width: `${(1-personalityPos.x)*(1-personalityPos.y)*100}%`, height: '100%', background: '#ef4444', borderRadius: '999px', transition: 'width 1s ease-out' }} /></div>
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#eab308', marginBottom: '0.2rem' }}><span>Inspirativ (Gelb)</span><span>{Math.round(personalityPos.x*(1-personalityPos.y)*100)}%</span></div>
                              <div style={{ height: '5px', background: 'rgba(234,179,8,0.1)', borderRadius: '999px', overflow: 'hidden' }}><div style={{ width: `${personalityPos.x*(1-personalityPos.y)*100}%`, height: '100%', background: '#eab308', borderRadius: '999px', transition: 'width 1s ease-out' }} /></div>
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#3b82f6', marginBottom: '0.2rem' }}><span>Faktenorientiert (Blau)</span><span>{Math.round((1-personalityPos.x)*personalityPos.y*100)}%</span></div>
                              <div style={{ height: '5px', background: 'rgba(59,130,246,0.1)', borderRadius: '999px', overflow: 'hidden' }}><div style={{ width: `${(1-personalityPos.x)*personalityPos.y*100}%`, height: '100%', background: '#3b82f6', borderRadius: '999px', transition: 'width 1s ease-out' }} /></div>
                            </div>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, color: '#22c55e', marginBottom: '0.2rem' }}><span>Unterstützend (Grün)</span><span>{Math.round(personalityPos.x*personalityPos.y*100)}%</span></div>
                              <div style={{ height: '5px', background: 'rgba(34,197,94,0.1)', borderRadius: '999px', overflow: 'hidden' }}><div style={{ width: `${personalityPos.x*personalityPos.y*100}%`, height: '100%', background: '#22c55e', borderRadius: '999px', transition: 'width 1s ease-out' }} /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                    <button className="smod-next" style={{ 
                      background: 'linear-gradient(135deg, #1e293b, #0f172a)', 
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15), 0 0 0 2px rgba(255,255,255,0.2) inset', 
                      borderRadius: '999px', padding: '0.6rem 1.5rem', fontSize: '0.95rem', fontWeight: 600, 
                      color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                      marginTop: 0
                    }} 
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2), 0 0 0 2px rgba(255,255,255,0.3) inset'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15), 0 0 0 2px rgba(255,255,255,0.2) inset'; }}
                    onClick={() => { setView('welcome'); setSetupStep('coach'); setCoachGender(null); }}>
                      Trainer/in speichern & starten
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SESSION – full screen overlay */}
        {view === 'session' && (
          <div className={`sess ${isAnimating ? 'sess-anim' : ''}`}>
            <div className="s-bg">
              <div className="p-aurora-bg" style={{opacity: 0.5}}>
                <div className="p-orb p-orb-1" />
                <div className="p-orb p-orb-2" />
                <div className="p-orb p-orb-3" />
              </div>
            </div>
            <div className="stop">
              <div className="stl">
                <div className="tav">
                  <Image src={c.image} alt={c.name} width={40} height={40} style={{objectFit:'cover',borderRadius:'50%'}} />
                  {isSpeaking && <span className="sring"/>}
                </div>
                <span className={`s-type-badge bdg-${sessionType}`}>
                  {c.name.split(',')[0].trim()} {sessionType==='daily'?'Daily':sessionType==='weekly'?'Weekly':'Quarterly'}
                </span>
              </div>
              <div className="s-center-cal">
                <span className="we-countdown-sm">{getFormattedCurrentDate()}</span>
              </div>
              <div className="str">
                <div className="stimer">
                  <span className="tval">{formatTime(sessionTime)}</span>
                </div>
                <button className="ebtn" onClick={handleEndSession}>Beenden</button>
              </div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:`${phaseProgress[phase]}%`}}/><span className="plab">{phaseLabels[phase]}</span></div>

            {/* TWO-COLUMN BODY */}
            <div className="s-body">
              {/* LEFT – Lisa presence (audio central) */}
              <div className="s-left">
 
                 {/* Lisa with wave rings */}
                 <div className="s-lisa-scene">
                  {/* Outward wave rings – visible in audio mode */}
                  {formatTab==='voice' && (<>
                    <div className={`s-wave s-wave-1 ${isListening||isSpeaking?'act':''}`} />
                    <div className={`s-wave s-wave-2 ${isListening||isSpeaking?'act':''}`} />
                    <div className={`s-wave s-wave-3 ${isListening||isSpeaking?'act':''}`} />
                  </>)}
                  <div className="s-lisa-wrap">
                    {coachVariant === 'lisa-jung' ? (
                      <video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline className="s-lisa-vid" onCanPlay={(e) => { e.currentTarget.playbackRate = 0.75; }} />
                    ) : (
                      <img src={c.image} alt={c.name} className="s-lisa-vid" style={{ objectFit: 'cover' }} />
                    )}
                    <div className="s-lisa-glow" />
                  </div>
                </div>

                {/* Name + status */}
                <div className="s-lisa-info">
                  <span className="s-lisa-name">{c.name.split(',')[0].trim()}</span>
                  <span className="s-lisa-status">{isSpeaking ? '● spricht' : isListening ? '● hört zu' : '○ bereit'}</span>
                </div>

                {/* Mic button – only in audio mode */}
                {formatTab==='voice' && (
                  <div className="s-mic-wrap">
                    <button className={`s-mbtn ${isListening?'lis':''}`} onClick={()=>{if(isListening){stopRecording();}else{startRecording();}}}>
                      <div className="s-minn">
                        {isListening
                          ? <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                          : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        }
                      </div>
                    </button>
                    <span className="s-mhint">{isListening ? 'Tippen zum Stoppen' : 'Sprechen'}</span>
                  </div>
                )}
              </div>

              {/* RIGHT – Chat */}
              <div className="s-right">
                <div className="chat" ref={chatRef}>
              {messages.map(msg => (
                <div key={msg.id} className={`crow ${msg.from}`}>
                  {msg.from==='coach'&&<div className="cav"><Image src={c.image} alt={c.name} width={32} height={32} style={{objectFit:'cover',borderRadius:'50%'}} /></div>}
                  <div className={`ccont ${msg.from}`}>
                    {msg.text&&<div className={`bub ${msg.from}`}><p>{msg.text}</p></div>}

                    {msg.widget==='entry-options'&&!msg.answered&&(
                      <div className="wcards">
                        <button className="wcd" onClick={() => handleEntryChoice('Letzte Session fortsetzen')}>
                          <div className="wcd-icon">🔄</div>
                          <div className="wcd-body"><strong>Letzte Session fortsetzen</strong><span>Schlafrhythmus stabilisieren.</span></div>
                          <svg className="wcd-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                        <button className="wcd" onClick={() => handleEntryChoice('Akutes Thema besprechen')}>
                          <div className="wcd-icon">💬</div>
                          <div className="wcd-body"><strong>Akutes Thema besprechen</strong><span>Was dich gerade bewegt.</span></div>
                          <svg className="wcd-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                        <button className="wcd" onClick={() => handleEntryChoice('Neues Thema beginnen')}>
                          <div className="wcd-icon">📊</div>
                          <div className="wcd-body"><strong>Neues Thema beginnen</strong><span>Wähle aus 6 Optimierungsfeldern aus.</span></div>
                          <svg className="wcd-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        </button>
                      </div>
                    )}
                    {msg.widget==='energy'&&!msg.answered&&(<div className="wrate">{[1,2,3,4,5].map(n=>(<button key={n} className="rbtn en" onClick={()=>handleEnergy(n)}>{n}</button>))}<div className="rlabs"><span>niedrig</span><span>hoch</span></div></div>)}
                    {msg.widget==='stress'&&!msg.answered&&(<div className="wrate">{[1,2,3,4,5].map(n=>(<button key={n} className="rbtn st" onClick={()=>handleStress(n)}>{n}</button>))}<div className="rlabs"><span>niedrig</span><span>hoch</span></div></div>)}
                    {msg.widget==='focus'&&!msg.answered&&(<div className="wpills">{focusTopics.map((t, idx)=>(<button key={t.id} className="plbtn" onClick={()=>handleFocus(t.id)}><span className="plbtn-icon">{t.icon}</span><span className="plbtn-body"><span className="plbtn-lbl">{idx + 1}. {t.label}</span></span></button>))}</div>)}

                    {msg.widget==='data-pull'&&dataLoadStage<2&&(
                      <div className="wdp">
                        <div className="dph"><div className="dpspin"/><span>{c.name} greift auf deine Daten zu...</span></div>
                        <div className="dpsrc"><span className="dps">Apple Watch</span><span className="dps">Oura Ring</span><span className="dps">TrueYears</span></div>
                        <div className="dpits">{dataLabels.map((d,i)=>(<div key={i} className={`dpi ${dataItems>i?'ld':''}`}><span className="dpil">{dataItems>i?d.label:d.loading}</span><div className="dpib"><div className={`dpif ${dataItems>i?'dn':''}`}/></div></div>))}</div>
                      </div>
                    )}

                    {msg.widget==='data-result'&&(
                      <div className="wdr">
                        <div className="drh"><span className="drt">Deine Daten der letzten 7 Tage</span><span className="drs">Wearable: Oura Ring</span></div>
                        <div className="drg">{dataLabels.map((d,i)=>(
                          <div key={i} className="drc" style={{animationDelay:`${i*0.12}s`}}>
                            <div className="drct">
                              <span className="drc-icon">{d.icon}</span>
                              <span className="drcl">{d.label}</span>
                            </div>
                            <div className="drcv">{d.val}</div>
                            <div className="drcu">{d.unit}</div>
                            <svg className="dr-spark" viewBox="0 0 60 28" preserveAspectRatio="none" width="100%" height="28">
                              <defs>
                                <linearGradient id={`sg${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={d.sparkColor} stopOpacity="0.25"/>
                                  <stop offset="100%" stopColor={d.sparkColor} stopOpacity="0"/>
                                </linearGradient>
                              </defs>
                              <polygon points={`0,28 ${d.spark} 60,28`} fill={`url(#sg${i})`}/>
                              <polyline points={d.spark} fill="none" stroke={d.sparkColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className={`drsub ${d.trend}`}>{d.sub}</div>
                          </div>
                        ))}</div>
                      </div>
                    )}

                    {msg.widget==='action-plan'&&!msg.answered&&(
                      <div className="wap">
                        <div className="apb">2 Empfehlungen auf Basis deiner Daten</div>
                        <div className="ap-rec">
                          <div className="ap-rec-num">1</div>
                          <div className="ap-rec-body">
                            <h3 className="apt">Handy ab 21:30 aus dem Schlafzimmer legen</h3>
                            <p className="apw">Dein HRV-Verlauf zeigt: deine Erholung startet erst spät. Ohne Bildschirmreize kann dein Nervensystem 30–45 Min. früher in den Erholungsmodus wechseln.</p>
                            <div className="apm"><div className="apmi"><span>Schwierigkeit</span><div className="apmbar"><div className="apmf lo" style={{width:'25%'}}/></div><strong>Leicht</strong></div><div className="apmi"><span>Wirkung</span><div className="apmbar"><div className="apmf hi" style={{width:'85%'}}/></div><strong>Hoch</strong></div></div>
                          </div>
                        </div>
                        <div className="ap-rec">
                          <div className="ap-rec-num">2</div>
                          <div className="ap-rec-body">
                            <h3 className="apt">5-Min. Box-Breathing um 21:15 Uhr</h3>
                            <p className="apw">Aktiviert deinen Parasympathikus und senkt Cortisol. In Kombination erhöhst du deine HRV innerhalb von 7 Tagen messbar.</p>
                            <div className="apm"><div className="apmi"><span>Schwierigkeit</span><div className="apmbar"><div className="apmf lo" style={{width:'15%'}}/></div><strong>Sehr leicht</strong></div><div className="apmi"><span>Wirkung</span><div className="apmbar"><div className="apmf hi" style={{width:'75%'}}/></div><strong>Mittel-Hoch</strong></div></div>
                          </div>
                        </div>
                        {!showMoreRecs&&<button className="ap-more-btn" onClick={()=>setShowMoreRecs(true)}>Weitere Empfehlungen anzeigen →</button>}
                        {showMoreRecs&&(
                          <div className="ap-rec ap-rec-extra">
                            <div className="ap-rec-num">3</div>
                            <div className="ap-rec-body">
                              <h3 className="apt">Morgens 10 Min. Tageslicht direkt nach dem Aufwachen</h3>
                              <p className="apw">Setzt deinen zirkadianen Rhythmus zurück und erhöht die Wachheit. Besonders wirksam bei spätem Einschlafen.</p>
                            </div>
                          </div>
                        )}
                        <button className="apcb" onClick={handleShowCommitment}>Klingt gut – weiter</button>
                      </div>
                    )}

                    {msg.widget==='commitment'&&!msg.answered&&(
                      <div className="wcm">
                        <p className="wcm-q">Möchtest du diese Maßnahmen für heute verbindlich einplanen?</p>
                        <div className="wcm-btns">
                          <button className="cmb ac" onClick={()=>handleCommitment('accept')}>
                            <span className="cmb-icon">✓</span> Ja, ich mache das
                          </button>
                          <button className="cmb ad" onClick={()=>handleCommitment('adjust')}>
                            <span className="cmb-icon">✎</span> Ich passe es an
                          </button>
                          <button className="cmb de" onClick={()=>handleCommitment('decline')}>
                            <span className="cmb-icon">✗</span> Heute nicht
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.widget==='system-sync'&&(
                      <div className="wsy">
                        <div className="syh">{!syncDone?<div className="dpspin"/>:<span className="syok">&#10003;</span>}<span>{syncDone?'Alles eingerichtet!':'Wird ins System übertragen...'}</span></div>
                        <div className="syis">{syncItems.map((it,i)=>(<div key={i} className={`syi ${syncStage>i?'done':''}`}><span className="syck">{syncStage>i?'\u2713':'\u00B7'}</span><span className="syil">{it.label}</span></div>))}</div>
                        {syncDone&&<div className="syft">Dein Plan ist aktiv. Du bekommst Erinnerungen zur richtigen Zeit.</div>}
                      </div>
                    )}

                    {msg.widget==='closing'&&(<div className="wclo"><div className="cloi"><span>Nächster Check-in: <strong>Morgen, 20:00 Uhr</strong></span></div><button className="clob" onClick={handleEndSession}>Session beenden</button></div>)}
                  </div>
                </div>
              ))}
              {isTyping&&(<div className="crow coach"><div className="cav"><Image src={c.image} alt={c.name} width={32} height={32} style={{objectFit:'cover',borderRadius:'50%'}}/></div><div className="ccont coach"><div className="bub coach tbub"><div className="tdots"><span/><span/><span/></div></div></div></div>)}
                </div> {/* end chat */}

                {showQR&&(<div className="qrs">{getQuickReplies().map((r,i)=>(<button key={i} className="qrb" onClick={()=>handleUserReply(r)}>{r}</button>))}</div>)}

                {/* Input area – only text mode here; audio mic is in left column */}
                {formatTab==='text' && (
                  <div className="iarea">
                    <div className="tirow"><input type="text" placeholder="Nachricht eingeben..." className="tinp" readOnly/><button className="sbtn">↑</button></div>
                  </div>
                )}
                {formatTab==='voice' && (
                  <div className="iarea">
                    <div className="vihin"><p>Sprich direkt mit {c.name} – Antworten werden live verarbeitet.</p></div>
                  </div>
                )}
                </div> {/* end s-right */}
            </div> {/* end s-body */}
          </div>
        )}
      </div>

      <style jsx>{`
        .cr{min-height:calc(100vh - 90px);position:relative;overflow-x:hidden}
        .cr-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
        .cr-in{position:relative;min-height:calc(100vh - 90px)}

        .wv{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:calc(100vh - 90px);padding:2.5rem 2rem;animation:fu .5s ease both}
        .wc{text-align:center;max-width:480px;animation:fu .5s ease both}
        @keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .wav{position:relative;display:inline-block;margin-bottom:1.25rem}
        .wav :global(video),.wav :global(img){border:4px solid rgba(68,152,202,.1);box-shadow:0 16px 48px rgba(0,60,120,.1);display:block}
        .won{position:absolute;bottom:12px;right:12px;width:20px;height:20px;background:#4CAF50;border:3px solid #fff;border-radius:50%}
        .wgreeting{font-size:1.4rem;font-weight:600;color:#2c5a7c;margin:0 0 1rem;letter-spacing:-.01em}
        .wstatus{display:flex;gap:1rem;justify-content:center;margin-bottom:.85rem}
        .wst-row{display:flex;align-items:center;gap:.35rem}
        .wst-dot{width:7px;height:7px;border-radius:50%;background:#c8d8e4;flex-shrink:0}
        .wst-dot.on{background:#4CAF50}
        .wst-dot.pulse{animation:dotpulse 2s ease-in-out infinite}
        @keyframes dotpulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(76,175,80,.4)}50%{opacity:.7;box-shadow:0 0 0 5px rgba(76,175,80,0)}}
        .wst-label{font-size:.76rem;color:#7a9ab0;font-weight:500}
        .wlimit{display:flex;align-items:center;gap:.65rem;justify-content:center;margin-bottom:1.25rem}
        .wlim-bar{width:48px;height:4px;border-radius:2px;background:rgba(68,152,202,.1);overflow:hidden;flex-shrink:0}
        .wlim-fill{display:block;height:100%;border-radius:2px;background:linear-gradient(90deg,#4498ca,#2c6a8c);transition:width .4s ease}
        .wlim-text{font-size:.76rem;color:#93a8b8;font-weight:500}
        .wtabs{margin-bottom:1.5rem;justify-content:center;max-width:280px;margin-left:auto;margin-right:auto}
        .bstart{display:inline-flex;padding:1rem 2.5rem;border:none;border-radius:16px;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:1.05rem;font-weight:600;cursor:pointer;box-shadow:0 8px 28px rgba(68,152,202,.35);transition:all .3s;margin-bottom:1.25rem}
        .bstart:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(68,152,202,.45)}
        .wv-btns{display:flex;gap:.6rem;justify-content:center}
        .wv-btn{padding:.55rem 1.1rem;border-radius:12px;border:1.5px solid rgba(68,152,202,.15);background:rgba(255,255,255,.7);color:#5a8aa8;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .25s;backdrop-filter:blur(8px)}
        .wv-btn:hover{border-color:rgba(68,152,202,.35);color:#2c5a7c;background:rgba(255,255,255,.95)}
        /* NEW WELCOME: Lisa left panel */
        .wb-hero-lg{position:relative;width:min(340px,78vw);height:min(340px,78vw);border-radius:50%;overflow:hidden;margin-bottom:0.75rem;flex-shrink:0}
        .wbl-glow{position:absolute;inset:-20%;border-radius:50%;background:conic-gradient(from 0deg,rgba(68,152,202,0.4),rgba(30,80,160,0.3),rgba(68,152,202,0.4));filter:blur(28px);opacity:0.5;animation:spin 18s linear infinite}
        .wbl-video{position:relative;z-index:2;width:100%;height:100%;border-radius:50%;object-fit:cover;border:2px solid rgba(68,152,202,0.25);box-shadow:0 16px 60px rgba(0,20,80,0.45)}
        .wbl-name{font-size:2.2rem;font-weight:300;letter-spacing:-0.02em;color:#e8f0fa;margin-bottom:0.2rem}
        .wbl-status{display:flex;align-items:center;gap:0.45rem;font-size:0.98rem;color:rgba(180,210,240,0.7);margin-bottom:0.6rem}
        .wbl-dot{width:8px;height:8px;border-radius:50%;background:#4CAF50;flex-shrink:0;box-shadow:0 0 6px rgba(76,175,80,0.8);animation:dotpulse 2s infinite}
        .wb-tagline{font-size:1.05rem;color:rgba(180,210,240,0.45);margin:0;letter-spacing:0.04em;text-transform:uppercase}
        /* NEW WELCOME: right session buttons */
        .wbs-header{margin-bottom:0.5rem;padding-top:0px}
        .wbs-header .wb-title{font-size:1.7rem;font-weight:400;letter-spacing:-0.02em}
        .wb-session-btns{display:flex;flex-direction:column;gap:0.7rem;padding:8px;margin:-8px}
        .wb-stype-btn{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0.75rem 1.15rem;border-radius:16px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);cursor:pointer;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);text-align:left;width:100%;color:#e2eaf4}
        .wb-stype-btn:hover{border-color:#fff;background:#7dd3fc;color:#091221;transform:translateY(-3px) scale(1.01);box-shadow:0 0 0 1px #fff, 0 0 0 3px #0284c7, 0 0 15px 4px rgba(125,211,252,0.45), 0 12px 32px rgba(0,20,60,0.35)}
        .wb-stype-btn:hover .wbsb-title{color:#091221}
        .wb-stype-btn:hover .wbsb-desc{color:#1e293b}
        .wb-stype-btn:hover .wbsb-num{color:#0284c7}
        .wb-stype-btn:hover .wbsb-time{color:#ffffff;background:#0284c7;border-color:#0284c7;box-shadow:0 4px 12px rgba(2,132,199,0.25)}
        .wbsb-left{display:flex;align-items:flex-start;gap:0.9rem;flex:1;min-width:0}
        .wbsb-num{font-size:1rem;font-weight:700;color:rgba(68,152,202,0.5);letter-spacing:-0.02em;flex-shrink:0;min-width:26px;font-variant-numeric:tabular-nums;padding-top:0.05rem}
        .wbsb-body{flex:1;min-width:0}
        .wbsb-title{font-size:1.38rem;font-weight:700;color:#e8f0fa;line-height:1.2;margin-bottom:0.35rem}
        .wbsb-desc{font-size:1.12rem;color:rgba(180,210,240,0.6);line-height:1.45}
        .wbsb-right{display:flex;flex-direction:row;align-items:center;gap:0.75rem;flex-shrink:0;color:rgba(68,152,202,0.6)}
        .wbsb-time{font-size:1.18rem;font-weight:600;color:rgba(68,152,202,0.8);background:rgba(68,152,202,0.1);padding:0.4rem 0.8rem;border-radius:12px;border:1px solid rgba(68,152,202,0.2);white-space:nowrap}
        /* bottom history/config buttons */
        .wb-bottom-btns{display:flex;gap:0.6rem;margin-top:2rem;margin-bottom:0px}
        .wb-bottom-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:0.5rem;height:45px;padding:0 1.2rem;border-radius:12px;font-size:0.95rem;font-weight:500;cursor:pointer;transition:all 0.25s}
        .wb-bottom-btn.btn-history{background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.06);color:#cbd5e1}
        .wb-bottom-btn.btn-history:hover{background:rgba(15,23,42,0.85);border-color:#38bdf8;color:#38bdf8;box-shadow:0 0 18px rgba(56,189,248,0.3)}
        .wb-bottom-btn.btn-config{background:rgba(15,23,42,0.6);border:1px solid rgba(255,255,255,0.06);color:#cbd5e1}
        .wb-bottom-btn.btn-config:hover{background:rgba(15,23,42,0.85);border-color:#c084fc;color:#c084fc;box-shadow:0 0 18px rgba(192,132,252,0.3)}
        /* history overlay */
        .wb-history-overlay{position:absolute;inset:0;border-radius:32px;background:rgba(11,23,48,0.96);backdrop-filter:blur(20px);padding:1.5rem;display:flex;flex-direction:column;gap:0.85rem;overflow:hidden;z-index:10}
        .wbh-header{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-bottom:0.25rem}
        .wbh-title{font-size:1.25rem;font-weight:600;color:#e8f0fa;margin:0}
        .wbh-search{display:flex;align-items:center;gap:0.6rem;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:0.6rem 1rem}
        .wbh-search svg{color:rgba(180,210,240,0.4);flex-shrink:0}
        .wbh-inp{background:transparent;border:none;outline:none;color:#e2eaf4;font-size:0.85rem;width:100%}
        .wbh-inp::placeholder{color:rgba(180,210,240,0.35)}
        .wbh-list{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:0.55rem;scrollbar-width:none}
        .wbh-list::-webkit-scrollbar{display:none}
        .wbh-item{padding:0.85rem 1rem;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);cursor:pointer;transition:all 0.2s}
        .wbh-item:hover{background:rgba(68,152,202,0.1);border-color:rgba(68,152,202,0.3)}
        .wbh-item.expanded{background:rgba(68,152,202,0.15);border-color:rgba(68,152,202,0.4)}
        .wbh-item.expanded .wbhi-sum{display:block;-webkit-line-clamp:unset;overflow:visible;color:rgba(180,210,240,0.9)}
        .wbhi-meta{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;flex-wrap:wrap}
        .wbhi-type{font-size:0.75rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:6px;text-transform:uppercase;letter-spacing:0.04em}
        .wbhi-type.bdg-daily { background: rgba(34,197,94,0.15); color: #4ade80; }
        .wbhi-type.bdg-weekly { background: rgba(56,189,248,0.15); color: #38bdf8; }
        .wbhi-type.bdg-quarterly { background: rgba(192,132,252,0.15); color: #d8b4fe; }
        .wbhi-date{font-size:0.95rem;color:rgba(180,210,240,0.6);font-weight:500}
        .wbhi-dur{font-size:0.95rem;color:rgba(180,210,240,0.6);margin-left:auto;font-weight:500}
        .wbhi-focus{font-size:1.15rem;font-weight:600;color:#e8f0fa;margin-bottom:0.2rem;margin-top:0.4rem}
        .wbhi-sum{font-size:1rem;color:rgba(180,210,240,0.7);line-height:1.45;margin-top:0.2rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

        .ps-wrap{width:100%;max-width:560px;margin-top:1.5rem;animation:fu .35s ease both}
        .ps-list{display:flex;flex-direction:column;gap:.6rem}
        .ps-card{padding:1rem 1.15rem;border-radius:14px;background:rgba(255,255,255,.9);border:1px solid rgba(68,152,202,.08);box-shadow:0 1px 8px rgba(0,60,120,.03);transition:all .25s}
        .ps-card:hover{border-color:rgba(68,152,202,.18);box-shadow:0 3px 14px rgba(0,60,120,.06)}
        .ps-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:.3rem}
        .ps-date{font-size:.74rem;color:#7a9ab0;font-weight:500}
        .ps-dur{font-size:.7rem;color:#93b3c8;background:rgba(68,152,202,.05);padding:.18rem .5rem;border-radius:6px}
        .ps-focus{font-size:.8rem;font-weight:600;color:#2c5a7c;margin-bottom:.25rem}
        .ps-sum{font-size:.8rem;color:#5a8aa8;line-height:1.45;margin:0 0 .4rem}
        .ps-output{display:inline-flex;align-items:center;padding:.25rem .6rem;border-radius:7px;background:rgba(68,152,202,.05);border:1px solid rgba(68,152,202,.07)}
        .ps-ol{font-size:.74rem;font-weight:600;color:#2c6a8c}

        .smod{position:fixed;inset:0;z-index:900;background:rgba(15,30,45,.45);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;animation:smodIn .3s ease both}
        @keyframes smodIn{from{opacity:0}to{opacity:1}}
        .smod-in{width:98%;max-width:900px;max-height:96vh;background:#fff;border-radius:24px;box-shadow:0 24px 80px rgba(0,40,80,.18);display:flex;flex-direction:column;overflow:hidden;animation:smodUp .35s ease both}
        @keyframes smodUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .smod-h{display:flex;align-items:center;justify-content:space-between;padding:2.5rem 1.5rem 1rem;border-bottom:1px solid rgba(68,152,202,.08)}
        .smod-back{background:none;border:none;color:#7a9ab0;font-size:.85rem;cursor:pointer;font-weight:500;padding:0;width:80px;text-align:left}
        .smod-back:hover{color:#4498ca}
        .smod-steps{display:flex;align-items:center;gap:1.2rem;background:#f8fafc;padding:0.6rem 1.4rem;border-radius:100px;border:1px solid #e2e8f0;box-shadow:0 4px 15px rgba(0,0,0,0.03)}
        .smod-s{font-size:0.95rem;font-weight:600;color:#94a3b8;display:flex;align-items:center;gap:0.5rem;transition:all 0.3s}
        .smod-num{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;flex-shrink:0;border-radius:50%;background:#e2e8f0;color:#64748b;font-size:1.05rem;font-weight:800}
        .smod-s.act{color:#0f172a;font-weight:700}
        .smod-s.act .smod-num{background:#4498ca;color:#fff;box-shadow:0 0 12px rgba(68,152,202,0.3)}
        .smod-s.done{color:#4498ca}
        .smod-s.done .smod-num{background:rgba(68,152,202,0.15);color:#4498ca}
        .smod-sep{width:20px;height:2px;border-radius:1px;background:#e2e8f0}
        .smod-cnt{padding:1rem 1.5rem 1.5rem;overflow-y:auto;flex:1;text-align:center}
        .smod-t{font-size:1.3rem;font-weight:700;color:#1a3a50;margin:0 0 0.75rem}
        .smod-sub{font-size:.88rem;color:#7a9ab0;margin:-.25rem 0 1rem;line-height:1.5}
        .smod-next{display:inline-flex;padding:.75rem 2rem;border:none;border-radius:14px;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(68,152,202,.3);transition:all .3s;margin-top:0.5rem}
        .smod-next:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(68,152,202,.4)}
 
        .cgrid{display:grid;grid-template-columns:repeat(4, 1fr);gap:1rem}
        .ccard{display:flex;flex-direction:column;align-items:center;gap:0.5rem;padding:1.25rem 1rem;border-radius:24px;border:2px solid rgba(68,152,202,.45);background:rgba(248,252,255,.9);cursor:pointer;transition:all .25s;position:relative}
        .ccard:hover{border-color:#4498ca;background:#fff;box-shadow:0 8px 24px rgba(0,60,120,.06);transform:translateY(-2px)}
        .ccard.sel{border-color:#4498ca;background:rgba(68,152,202,.04);box-shadow:0 4px 20px rgba(68,152,202,.12)}
        .ccard-img{position:relative;margin-bottom:0.4rem}
        .ccard-img :global(img){border:4px solid rgba(68,152,202,.12);box-shadow:0 8px 24px rgba(0,60,120,.1)}
        .ccard-chk{position:absolute;top:0;right:0;width:28px;height:28px;background:#4498ca;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;border:2px solid #fff}
        .ccard-name{font-size:1.15rem;color:#1a3a50;font-weight:700}
        .ccard-desc{font-size:0.9rem;color:#7a9ab0;line-height:1.4}
        .ccard-voice{display:inline-flex;align-items:center;gap:0.5rem;padding:0.6rem 1rem;border-radius:12px;border:1.5px solid rgba(68,152,202,.15);background:rgba(255,255,255,.9);color:#4498ca;font-size:0.85rem;font-weight:600;cursor:pointer;transition:all .2s;margin-top:0.4rem}
        .ccard-voice:hover{border-color:#4498ca;background:rgba(68,152,202,.08);transform:translateY(-1px)}
        .ccard-voice.playing{border-color:#4498ca;background:rgba(68,152,202,.1);color:#2c5a7c}
 
        .dgrid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;text-align:left}
        .dcard{display:flex;flex-direction:column;gap:0.4rem;padding:1.2rem;border-radius:20px;border:2px solid rgba(68,152,202,.45);background:rgba(255,255,255,0.8);cursor:pointer;transition:all 0.25s;position:relative;height:100%}
        .dcard:hover{border-color:#4498ca;background:#fff;box-shadow:0 6px 16px rgba(0,60,120,.06);transform:translateY(-1px)}
        .dcard.sel{border-color:#4498ca;background:rgba(68,152,202,.04);box-shadow:0 4px 20px rgba(68,152,202,.12)}
        .dc-title{font-size:0.95rem;font-weight:700;color:#1a3a50;margin:0;line-height:1.2}
        .dc-desc{font-size:0.75rem;color:#5a8aa8;line-height:1.35;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .dc-chk{position:absolute;top:0.75rem;right:0.75rem;width:20px;height:20px;background:#4498ca;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700}
 
        .ggrid{display:flex;gap:4rem;justify-content:center;margin:2.5rem 0}
        .gcard{position:relative;display:flex;flex-direction:column;align-items:center;gap:1.5rem;background:rgba(248,252,255,.9);border:2px solid rgba(68,152,202,.45);border-radius:24px;cursor:pointer;transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);padding:2rem;overflow:hidden}
        .gcard::before{content:'';position:absolute;inset:0;opacity:0;transition:opacity 0.4s;border-radius:22px;z-index:-1}
        .gcard:hover{transform:translateY(-8px);box-shadow:0 20px 40px rgba(0,60,120,0.08);background:#fff}
        .gcard:hover::before{opacity:1}
        
        .gcard-female:hover{border-color:#ec4899}
        .gcard-female::before{background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(253,232,243,0.8) 100%)}
        .gcard-male:hover{border-color:#4498ca}
        .gcard-male::before{background:linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(230,244,252,0.8) 100%)}
        
        .gcard-ico{position:relative;width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.6);border:2px solid transparent;color:#1a3a50;box-shadow:0 8px 24px rgba(0,60,120,0.05);transition:all 0.3s ease}
        .gcard:hover .gcard-ico{background:#fff;transform:scale(1.05)}
        .gcard-female:hover .gcard-ico{border-color:#ec4899;box-shadow:0 12px 32px rgba(236,72,153,0.15)}
        .gcard-male:hover .gcard-ico{border-color:#4498ca;box-shadow:0 12px 32px rgba(68,152,202,0.15)}

        .gcard-title{font-size:1.3rem;font-weight:700;color:#1a3a50;transition:all 0.3s ease;position:relative}
        .gcard:hover .gcard-title{transform:scale(1.05)}
        .gcard-female:hover .gcard-title{color:#ec4899}
        .gcard-male:hover .gcard-title{color:#4498ca}

        .dc-preview{margin-top:0.75rem;padding:0.75rem;background:linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,252,255,0.85));border-radius:12px;border:1px solid #e0f0fa;box-shadow:inset 0 2px 6px rgba(255,255,255,0.8), 0 4px 12px rgba(68,152,202,0.06);height:85px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
        .dp-numbers{display:flex;gap:0.5rem;width:100%;height:100%;align-items:center;justify-content:center}
        .dpn-card{flex:1;background:#fff;border:1px solid rgba(68,152,202,0.15);border-radius:12px;padding:0.8rem;box-shadow:0 4px 12px rgba(0,40,80,0.04);display:flex;flex-direction:column;justify-content:center}
        .dpnc-lbl{font-size:0.65rem;color:#7a9ab0;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.2rem}
        .dpnc-val{font-size:1.1rem;color:#1a3a50;font-weight:700;font-family:monospace}
        .dpnc-val span{font-size:0.75rem;color:#5a8aa8;font-weight:500}
        .dp-perf{width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:0.2rem 0}
        .dpp-top{display:flex;justify-content:space-between;align-items:center}
        .dpp-lbl{font-size:0.8rem;color:#1a3a50;font-weight:700}
        .dpp-badge{font-size:0.7rem;background:rgba(76,175,80,0.15);color:#2e7d32;padding:0.2rem 0.5rem;border-radius:10px;font-weight:700}
        .dpp-chart{position:relative;width:100%;height:40px;margin-top:auto}
        .dpp-chart svg{width:100%;height:100%;overflow:visible}
        .dpp-dot{position:absolute;right:-2px;top:0px;width:8px;height:8px;background:#fff;border:2px solid #4CAF50;border-radius:50%;box-shadow:0 0 8px rgba(76,175,80,0.6);animation:pulseDot 2s infinite}
        @keyframes pulseDot{0%,100%{transform:scale(1);box-shadow:0 0 8px rgba(76,175,80,0.6)}50%{transform:scale(1.3);box-shadow:0 0 12px rgba(76,175,80,0.9)}}
        .dp-bal{display:flex;align-items:center;gap:1.2rem;height:100%;width:100%;padding:0 0.5rem}
        .dpb-rings{position:relative;width:64px;height:64px;flex-shrink:0}
        .dpb-rings svg{width:100%;height:100%;overflow:visible;animation:spinRings 20s linear infinite}
        @keyframes spinRings{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .dpb-center-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.1rem;animation:counterRings 20s linear infinite}
        @keyframes counterRings{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        .dpb-info{display:flex;flex-direction:column;gap:0.15rem}
        .dpbi-tit{font-size:0.95rem;font-weight:700;color:#1a3a50;margin:0}
        .dpbi-sub{font-size:0.75rem;color:#7a9ab0;margin:0;line-height:1.2}
        .dp-emo{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center}
        .dpe-orb{position:absolute;border-radius:50%;filter:blur(14px);opacity:0.6;animation:floatOrb 6s ease-in-out infinite alternate}
        .dpe-orb-1{width:60px;height:60px;background:rgba(230,81,139,0.3);top:10%;left:10%}
        .dpe-orb-2{width:80px;height:80px;background:rgba(33,150,243,0.3);bottom:0;right:5%;animation-delay:-3s}
        @keyframes floatOrb{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-10px) scale(1.1)}}
        .dpe-glass{position:relative;z-index:2;padding:0.8rem;background:rgba(255,255,255,0.7);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.6);border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.04);text-align:center}
        .dpe-quote{font-size:0.85rem;color:#334155;font-style:italic;font-weight:500;line-height:1.4;display:block}

        .pf-wrap{position:relative;width:240px;margin:1.5rem auto 1.5rem}
        .pf-labels{position:relative;width:100%;margin-bottom:.4rem}
        .pf-l{position:absolute;font-size:1.02rem;font-weight:600;line-height:1.25;white-space:nowrap}
        .pf-l small{font-weight:400;color:#93a8b8;font-size:0.96rem}
        .pf-tl{top:-24px;left:-28px;color:#E53935;text-align:left}
        .pf-tr{top:-24px;right:-28px;color:#F9A825;text-align:right}
        .pf-bl{bottom:-24px;left:-28px;color:#1E88E5;text-align:left}
        .pf-br{bottom:-24px;right:-28px;color:#43A047;text-align:right}
        .pf-labels{height:240px}
        .pf-field{position:absolute;inset:28px;border-radius:20px;cursor:crosshair;touch-action:none;background:radial-gradient(ellipse at 0% 0%,rgba(229,57,53,.35) 0%,transparent 55%),radial-gradient(ellipse at 100% 0%,rgba(249,168,37,.35) 0%,transparent 55%),radial-gradient(ellipse at 0% 100%,rgba(30,136,229,.35) 0%,transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(67,160,71,.35) 0%,transparent 55%),#f5f8fa;box-shadow:inset 0 0 0 1px rgba(68,152,202,.08)}
        .pf-dot{position:absolute;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid #2c5a7c;box-shadow:0 2px 10px rgba(0,40,80,.2);transform:translate(-50%,-50%);transition:left .08s,top .08s;pointer-events:none}
        .pf-result{display:flex;align-items:center;gap:.6rem;justify-content:center;margin-top:.5rem}
        .pf-badge{padding:.3rem .75rem;border-radius:10px;font-size:.8rem;font-weight:600;color:#fff}
        .pf-rot{background:#E53935}
        .pf-gelb{background:#F9A825;color:#5a4500}
        .pf-grün{background:#43A047}
        .pf-blau{background:#1E88E5}
        .pf-ausgewogen{background:linear-gradient(135deg,#4498ca,#2c6a8c)}
        .pf-rdesc{font-size:.84rem;color:#5a8aa8;font-weight:500}

        .ftabs{display:flex;gap:.3rem;padding:.25rem;background:rgba(68,152,202,.06);border-radius:12px}
        .ftab{flex:1;padding:.5rem .7rem;border:none;border-radius:9px;background:transparent;color:#7a9ab0;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .25s;white-space:nowrap}
        .ftab.act{background:#fff;color:#2c5a7c;box-shadow:0 2px 8px rgba(0,60,120,.08);font-weight:600}

        .sess{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;display:flex;flex-direction:column;background:#060d18;opacity:1;transform:scale(1);transition:all .3s cubic-bezier(.4,0,.2,1)}
        .s-bg{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:radial-gradient(ellipse at 20% 50%,rgba(30,70,120,.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(20,50,90,.1) 0%,transparent 55%),#060d18}
        .sess-anim{opacity:0;transform:scale(.97)}
        .stop{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:.7rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.05);background:rgba(6,13,24,.75);backdrop-filter:blur(24px);gap:1rem}
        .stl{display:flex;align-items:center;gap:.8rem;flex-shrink:0}
        .s-type-badge{
          display: inline-flex; align-items: center;
          font-size: 1.05rem; font-weight: 600;
          padding: 0.5rem 1.1rem; border-radius: 100px;
          letter-spacing: .02em; margin-left: .2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .s-type-badge.bdg-daily {
          background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3);
        }
        .s-type-badge.bdg-weekly {
          background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3);
        }
        .s-type-badge.bdg-quarterly {
          background: rgba(192,132,252,0.15); color: #d8b4fe; border: 1px solid rgba(192,132,252,0.3);
        }
        .tav{position:relative;width:44px;height:44px;flex-shrink:0}
        .tav :global(img){border:1px solid rgba(255,255,255,0.1);box-shadow:0 4px 12px rgba(0,0,0,.4)}
        .sring{position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(255,255,255,.15);animation:sp 1.5s ease-in-out infinite}
        @keyframes sp{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.6;transform:scale(1.12)}}
        .tinf strong{display:none}
        .tst{display:none}
        .we-countdown-sm{font-size:1.1rem;color:#94a3b8;font-weight:500;letter-spacing:.01em}
        .sftabs{flex:0 1 280px}
        .str{display:flex;align-items:center;gap:.8rem;flex-shrink:0}
        .stimer{display:flex;align-items:center;gap:.3rem;padding:.45rem .9rem;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);font-size:1.15rem;font-weight:500;color:#e2e8f0;font-variant-numeric:tabular-nums;box-shadow:inset 0 1px 0 rgba(255,255,255,.05)}
        .ebtn{padding:.45rem 1rem;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.04);color:#cbd5e1;font-size:1.1rem;font-weight:500;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,.3)}
        .ebtn:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25);color:#f8fafc}
        .pbar{position:relative;z-index:2;height:3px;background:rgba(255,255,255,.05);overflow:hidden}
        .pfill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(100,180,255,.7),rgba(60,200,200,.6));transition:width .6s ease}
        .plab{display:none}

        /* Two-column session body */
        .s-body{position:relative;z-index:2;flex:1;display:flex;overflow:hidden}
        .s-left{width:52%;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem 1.5rem 2.5rem;border-right:1px solid rgba(255,255,255,.1);gap:1.4rem}
        .s-right{flex:1;display:flex;flex-direction:column;overflow:hidden}
        .s-fmt-tabs{display:flex;gap:.25rem;padding:.3rem;background:rgba(0,0,0,.2);border:1px solid rgba(255,255,255,.06);border-radius:12px;align-self:stretch;justify-content:center;box-shadow:inset 0 2px 10px rgba(0,0,0,.2)}
        .s-ftab{flex:1;padding:.5rem .7rem;border:none;border-radius:9px;background:transparent;color:#94a3b8;font-size:.8rem;font-weight:500;cursor:pointer;transition:all .25s;letter-spacing:.02em;display:flex;align-items:center;justify-content:center}
        .s-ftab.act{background:rgba(255,255,255,.08);color:#f8fafc;font-weight:600;border:1px solid rgba(255,255,255,.1);box-shadow:0 4px 12px rgba(0,0,0,.2)}
        .s-lisa-scene{position:relative;display:flex;align-items:center;justify-content:center;width:min(520px,44vw);height:min(520px,44vw)}
        .s-lisa-wrap{position:relative;width:min(440px,37vw);height:min(440px,37vw);border-radius:50%;overflow:hidden;flex-shrink:0;z-index:2;box-shadow:0 28px 80px rgba(0,0,0,.65),0 0 0 2px rgba(255,255,255,.1)}
        .s-lisa-vid{width:100%;height:100%;object-fit:cover;border-radius:50%}
        .s-lisa-glow{position:absolute;inset:-30px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.05),transparent 65%);animation:lg 4s ease-in-out infinite;pointer-events:none;z-index:1}
        @keyframes lg{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:.7;transform:scale(1.1)}}
        .s-wave{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.1);top:50%;left:50%;transform:translate(-50%,-50%) scale(1);opacity:0;pointer-events:none}
        .s-wave-1{width:min(390px,33vw);height:min(390px,33vw)}
        .s-wave-2{width:min(460px,39vw);height:min(460px,39vw)}
        .s-wave-3{width:min(510px,43vw);height:min(510px,43vw)}
        .s-wave.act{animation:sw 2.4s ease-out infinite}
        .s-wave-2.act{animation-delay:.65s}
        .s-wave-3.act{animation-delay:1.3s}
        @keyframes sw{0%{opacity:.4;transform:translate(-50%,-50%) scale(.92)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.18)}}
        .s-lisa-info{text-align:center;margin-top:-0.7rem}
        .s-lisa-name{display:block;font-size:1.8rem;font-weight:600;color:#f8fafc;letter-spacing:.02em;margin-bottom:.3rem}
        .s-lisa-status{display:block;font-size:1.05rem;color:#94a3b8;letter-spacing:.05em}
        .s-mic-wrap{display:flex;flex-direction:column;align-items:center;gap:.6rem}
        .s-mbtn{width:56px;height:56px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.05)}
        .s-mbtn:hover{border-color:rgba(255,255,255,.2);background:rgba(255,255,255,.08);transform:translateY(-2px)}
        .s-mbtn.lis{border-color:rgba(80,200,160,.4);animation:mp 1.8s ease-in-out infinite;background:rgba(80,200,160,.08)}
        @keyframes mp{0%,100%{box-shadow:0 0 0 0 rgba(80,200,160,.2)}50%{box-shadow:0 0 0 14px rgba(80,200,160,0)}}
        .s-minn{color:rgba(200,225,255,.8);display:flex;align-items:center;justify-content:center}
        .s-mbtn.lis .s-minn{color:rgba(80,200,160,.9)}
        .s-mhint{font-size:.72rem;color:rgba(120,165,210,.5);letter-spacing:.04em;font-weight:500}

        .vidarea{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;padding:1.5rem;background:linear-gradient(135deg,rgba(26,58,80,.8),rgba(44,90,124,.8));backdrop-filter:blur(16px);min-height:160px;border-bottom:1px solid rgba(255,255,255,.2)}
        .vov{position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:.4rem;padding:.3rem .7rem;border-radius:8px;background:rgba(0,0,0,.5);font-size:.75rem;color:#fff;font-weight:600}
        .vdot{width:8px;height:8px;background:#EF5350;border-radius:50%;animation:bl 1.5s infinite}
        @keyframes bl{0%,100%{opacity:1}50%{opacity:.4}}
        .vrbtn{position:absolute;bottom:12px;right:12px;padding:.5rem 1rem;border-radius:10px;border:none;background:rgba(255,255,255,.2);color:#fff;font-size:.8rem;cursor:pointer;backdrop-filter:blur(8px)}

        .chat{position:relative;z-index:2;flex:1;overflow-y:auto;padding:1.75rem 1.5rem;display:flex;flex-direction:column;gap:1.1rem;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.08) transparent}
        .chat::-webkit-scrollbar{width:5px}.chat::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:4px}
        .crow{display:flex;gap:.75rem;max-width:80%;animation:mi .4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both}
        .crow.coach{align-self:flex-start}.crow.user{align-self:flex-end;flex-direction:row-reverse}.crow.system{align-self:flex-start;max-width:95%;margin:.5rem auto}
        @keyframes mi{from{opacity:0;transform:translateY(12px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        .cav{width:34px;height:34px;flex-shrink:0;border-radius:50%;overflow:hidden;margin-top:4px;box-shadow:0 2px 8px rgba(0,0,0,.4);border:1.5px solid rgba(255,255,255,.12)}
        .ccont{display:flex;flex-direction:column;gap:.4rem;min-width:0}.ccont.system{width:100%}
        .bub{padding:.85rem 1.15rem;border-radius:18px;backdrop-filter:blur(16px);box-shadow:0 8px 24px rgba(0,0,0,.2)}
        .bub.coach{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-bottom-left-radius:5px}
        .bub.user{background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.15);border-bottom-right-radius:5px;box-shadow:inset 0 1px 0 rgba(255,255,255,.1), 0 8px 24px rgba(0,0,0,.2)}
        .bub p{font-size:1.05rem;line-height:1.6;margin:0;letter-spacing:0.01em;font-weight:400}.bub.coach p{color:#e2e8f0}.bub.user p{color:#f8fafc}
        .tbub{padding:.75rem 1.15rem}.tdots{display:flex;gap:5px;align-items:center}.tdots span{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.4);animation:db 1.4s ease-in-out infinite}.tdots span:nth-child(2){animation-delay:.2s;background:rgba(255,255,255,0.6)}.tdots span:nth-child(3){animation-delay:.4s;background:rgba(255,255,255,0.8)}
        @keyframes db{0%,60%,100%{transform:translateY(0) scale(1)}30%{transform:translateY(-5px) scale(1.1)}}
 
        .wcards{display:flex;flex-direction:column;gap:.55rem}
        .wcd{display:flex;align-items:center;gap:.75rem;text-align:left;padding:1rem 1.2rem;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(24px);cursor:pointer;transition:all .3s cubic-bezier(.16,1,.3,1);box-shadow:0 8px 32px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.05)}
        .wcd:hover{background:rgba(255,255,255,.06);transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.1);border-color:rgba(255,255,255,.15)}
        .wcd-icon{font-size:1.35rem;flex-shrink:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
        .wcd-body{flex:1;min-width:0}
        .wcd-body strong{display:block;font-size:1.02rem;color:#f8fafc;font-weight:600;margin-bottom:.2rem;letter-spacing:.01em}
        .wcd-body span{font-size:0.86rem;color:#94a3b8;line-height:1.4}
        .wcd-arrow{color:rgba(255,255,255,.3);flex-shrink:0;transition:transform .25s}.wcd:hover .wcd-arrow{transform:translateX(3px);color:rgba(255,255,255,.8)}
        .wrate{display:flex;flex-wrap:wrap;gap:.5rem}
        .rbtn{width:48px;height:48px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(12px);font-size:1rem;font-weight:600;color:#cbd5e1;cursor:pointer;transition:all .25s;box-shadow:0 4px 12px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.05)}
        .rbtn:hover{transform:scale(1.1);background:rgba(255,255,255,.08);box-shadow:0 8px 24px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.1);color:#f8fafc;border-color:rgba(255,255,255,.15)}
        .rlabs{width:100%;display:flex;justify-content:space-between;font-size:.8rem;color:#64748b;font-weight:500}
        .wpills{display:flex;flex-direction:column;gap:.45rem}
        .plbtn{display:flex;align-items:center;gap:.75rem;padding:.4rem 1.1rem;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(12px);font-size:.95rem;color:#e2e8f0;font-weight:500;cursor:pointer;transition:all .25s;text-align:left;width:100%;box-shadow:0 8px 24px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.05)}
        .plbtn:hover{border-color:rgba(255,255,255,.15);background:rgba(255,255,255,.06);box-shadow:0 12px 32px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.1);transform:translateY(-2px)}
        .plbtn-icon{font-size:1.15rem;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);flex-shrink:0}
        .plbtn-body{flex:1;min-width:0;display:flex;flex-direction:column}
        .plbtn-lbl{font-size:.98rem;font-weight:400;color:#f8fafc;line-height:1.25;letter-spacing:.01em}
        .plbtn-desc{font-size:.82rem;color:#94a3b8;margin-top:.1rem}
 
        .wdp{padding:1.25rem;border-radius:20px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(24px);box-shadow:0 12px 40px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.05)}
        .dph{display:flex;align-items:center;gap:.65rem;margin-bottom:.75rem;font-size:1.0rem;font-weight:600;color:#f8fafc;letter-spacing:.01em}
        .dpspin{width:16px;height:16px;border:2px solid rgba(255,255,255,.1);border-top-color:#fff;border-radius:50%;animation:sn .8s linear infinite;flex-shrink:0}
        @keyframes sn{to{transform:rotate(360deg)}}
        .dpsrc{display:flex;gap:.4rem;margin-bottom:.85rem}
        .dps{padding:.22rem .6rem;border-radius:16px;font-size:.82rem;font-weight:600;background:rgba(255,255,255,.05);color:#cbd5e1;border:1px solid rgba(255,255,255,.1)}
        .dpits{display:flex;flex-direction:column;gap:.45rem}
        .dpi{display:flex;align-items:center;gap:.6rem;padding:.5rem .65rem;border-radius:12px;background:rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.04);transition:all .5s;opacity:.45}
        .dpi.ld{opacity:1;background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.08);box-shadow:0 4px 12px rgba(0,0,0,.1)}
        .dpii{font-size:.95rem}.dpil{flex:1;font-size:.9rem;color:#94a3b8;font-weight:500}.dpi.ld .dpil{color:#e2e8f0}
        .dpib{flex:0 0 72px;height:2px;background:rgba(255,255,255,.05);border-radius:2px;overflow:hidden}
        .dpif{height:100%;width:0;background:linear-gradient(90deg,rgba(255,255,255,.4),#fff);border-radius:2px;animation:lb 1.5s ease forwards}
        .dpif.dn{width:100%!important;background:linear-gradient(90deg,rgba(80,200,120,.6),#50c878)}
        @keyframes lb{0%{width:0}50%{width:70%}100%{width:95%}}
 
        .wdr{padding:1.4rem;border-radius:20px;background:rgba(255,255,255,.03);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);box-shadow:0 12px 40px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.05)}
        .drh{margin-bottom:1rem}.drt{display:block;font-size:1.05rem;font-weight:600;color:#f8fafc;margin-bottom:.2rem;letter-spacing:.01em}.drs{font-size:.82rem;color:#94a3b8}
        .drg{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
        .drc{padding:.85rem;border-radius:14px;background:rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.04);backdrop-filter:blur(6px);animation:ci .5s cubic-bezier(.175,.885,.32,1.275) both}
        @keyframes ci{from{opacity:0;transform:scale(.96) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .drct{display:flex;align-items:center;gap:.35rem;margin-bottom:.2rem}
        .drc-icon{font-size:.85rem;line-height:1}
        .drcl{font-size:.78rem;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
        .drcv{font-size:1.35rem;font-weight:800;color:#fff;line-height:1.1;letter-spacing:-.02em}
        .drcu{font-size:.76rem;color:#64748b;margin-bottom:.35rem}
        .dr-spark{display:block;margin:.35rem 0;border-radius:4px;overflow:visible}
        .drsub{font-size:.78rem;font-weight:500;margin-top:.3rem}
        .drsub.down{color:rgba(240,120,100,.9)}.drsub.up{color:rgba(240,160,80,.9)}.drsub.stable{color:rgba(100,220,140,.9)}.drsub.good{color:rgba(80,200,120,.9)}
 
        .wap{padding:1.4rem;border-radius:20px;background:rgba(255,255,255,.03);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);box-shadow:0 12px 40px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.05);display:flex;flex-direction:column;gap:.85rem}
        .apb{display:inline-block;padding:.25rem .65rem;border-radius:16px;background:rgba(255,255,255,.06);color:#cbd5e1;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;border:1px solid rgba(255,255,255,.1)}
        .ap-rec{display:flex;gap:.85rem;align-items:flex-start;padding:.9rem 1rem;border-radius:14px;background:rgba(0,0,0,.15);border:1px solid rgba(255,255,255,.04)}
        .ap-rec-extra{border-color:rgba(255,255,255,.1);background:rgba(255,255,255,.03)}
        .ap-rec-num{font-size:.85rem;font-weight:700;color:#cbd5e1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:.2rem .5rem;flex-shrink:0;margin-top:.15rem;font-variant-numeric:tabular-nums}
        .ap-rec-body{flex:1;min-width:0}
        .apt{font-size:1.05rem;color:#f8fafc;margin:0 0 .4rem;font-weight:600;line-height:1.35;letter-spacing:.01em}
        .apw{font-size:.92rem;color:#94a3b8;line-height:1.55;margin:0 0 .65rem}
        .apm{display:flex;gap:.6rem}
        .apmi{flex:1;padding:.45rem .6rem;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);font-size:.82rem;color:#cbd5e1}
        .apmbar{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin:.3rem 0 0}.apmf{height:100%;border-radius:2px}.apmf.lo{background:rgba(80,200,120,.6)}.apmf.hi{background:rgba(255,255,255,.4)}
        .ap-more-btn{background:transparent;border:1px dashed rgba(255,255,255,.15);border-radius:12px;color:#94a3b8;font-size:.92rem;font-weight:500;padding:.65rem 1rem;cursor:pointer;transition:all .25s;text-align:center;width:100%}
        .ap-more-btn:hover{border-color:rgba(255,255,255,.3);color:#f8fafc;background:rgba(255,255,255,.04)}
        .apcb{width:100%;padding:.85rem;border:none;border-radius:14px;background:linear-gradient(135deg,rgba(255,255,255,.15),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.2);color:#fff;font-size:1.0rem;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.1);transition:all .3s}
        .apcb:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.15);background:linear-gradient(135deg,rgba(255,255,255,.2),rgba(255,255,255,.08))}
 
        .wcm{display:flex;flex-direction:column;gap:.55rem;padding:.2rem 0}
        .wcm-q{font-size:1.0rem;color:#f8fafc;font-weight:500;margin:0 0 .25rem;line-height:1.5}
        .wcm-btns{display:flex;flex-direction:column;gap:.4rem}
        .cmb{display:flex;align-items:center;gap:.65rem;padding:.85rem 1.1rem;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(12px);font-size:1.0rem;font-weight:500;color:#cbd5e1;cursor:pointer;transition:all .25s;text-align:left;box-shadow:0 8px 24px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.05)}
        .cmb:hover{background:rgba(255,255,255,.08);transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.1);border-color:rgba(255,255,255,.15);color:#f8fafc}
        .cmb.ac:hover{border-color:rgba(100,220,140,.4);background:rgba(100,220,140,.08);color:rgba(180,250,200,.9)}
        .cmb.ad:hover{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.1)}
        .cmb.de:hover{border-color:rgba(255,100,100,.3);background:rgba(255,80,80,.07);color:rgba(255,160,160,.85)}
        .cmb-icon{font-size:1.1rem;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);flex-shrink:0}
 
        .wsy{padding:1.25rem;border-radius:20px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);backdrop-filter:blur(24px);box-shadow:0 12px 40px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.05)}
        .syh{display:flex;align-items:center;gap:.65rem;margin-bottom:.8rem;font-size:1.0rem;font-weight:600;color:#f8fafc;letter-spacing:.01em}
        .syok{font-size:1.1rem;color:#50c878}
        .syis{display:flex;flex-direction:column;gap:.4rem}
        .syi{display:flex;align-items:center;gap:.5rem;padding:.55rem .75rem;border-radius:12px;background:rgba(0,0,0,.15);transition:all .6s cubic-bezier(.4,0,.2,1);opacity:.35;transform:translateX(-8px);border:1px solid rgba(255,255,255,.04)}
        .syi.done{opacity:1;background:rgba(255,255,255,.04);transform:translateX(0);border-color:rgba(255,255,255,.08)}
        .syck{font-size:.92rem;flex-shrink:0;color:#50c878}.syil{font-size:.92rem;color:#cbd5e1;font-weight:500}
        .syft{margin-top:.75rem;padding:.65rem .85rem;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);font-size:.92rem;color:#e2e8f0;font-weight:500}
 
        .wclo{margin-top:.25rem}
        .cloi{padding:.75rem 1rem;border-radius:14px;background:rgba(255,255,255,.04);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.08);font-size:.95rem;color:#cbd5e1;margin-bottom:.65rem}
        .cloi strong{color:#f8fafc;font-weight:600}
        .clob{padding:.7rem 1.5rem;border-radius:14px;border:1px solid rgba(255,255,255,.15);background:linear-gradient(135deg,rgba(255,255,255,.1),rgba(255,255,255,.03));color:#fff;font-size:1.0rem;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.1);transition:all .25s}
        .clob:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.15);background:linear-gradient(135deg,rgba(255,255,255,.15),rgba(255,255,255,.06))}
 
        .qrs{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:.5rem;padding:0.75rem 1.5rem;background:transparent;border:none}
        .qrb{padding:.5rem 1.1rem;border-radius:24px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);backdrop-filter:blur(12px);font-size:.92rem;color:#cbd5e1;font-weight:500;cursor:pointer;transition:all .3s ease;box-shadow:0 4px 12px rgba(0,0,0,.1),inset 0 1px 0 rgba(255,255,255,.05)}
        .qrb:hover{border-color:rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#f8fafc;transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.1)}
 
        .iarea{position:relative;z-index:2;padding:.85rem 1.5rem 1.2rem;border-top:1px solid rgba(255,255,255,.05);background:rgba(6,13,24,.75);backdrop-filter:blur(24px)}
        .tirow{display:flex;gap:.5rem}
        .tinp{flex:1;padding:.8rem 1.1rem;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.2);font-size:1.05rem;color:#f8fafc;outline:none;box-shadow:inset 0 2px 8px rgba(0,0,0,.2)}
        .tinp::placeholder{color:#64748b}
        .tinp:focus{border-color:rgba(255,255,255,.15);background:rgba(0,0,0,.3)}
        .sbtn{width:44px;height:44px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.08);color:#f8fafc;font-size:1.2rem;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,.15),inset 0 1px 0 rgba(255,255,255,.05)}
        .sbtn:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.25);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.1)}
        .airow{display:flex;flex-direction:column;align-items:center;gap:.6rem;padding:.5rem 0}
        .avis{display:flex;align-items:center;gap:3px;height:28px}
        .vbar{width:3px;height:6px;background:rgba(68,152,202,.2);border-radius:2px;transition:all .15s}
        .vbar.act{background:linear-gradient(180deg,#4498ca,#2c6a8c);animation:ba .6s ease-in-out infinite}
        @keyframes ba{0%,100%{height:6px}50%{height:22px}}
        .mbtn{width:60px;height:60px;border-radius:50%;border:3px solid rgba(68,152,202,.2);background:transparent;cursor:pointer;position:relative;transition:all .3s}
        .mbtn:hover{border-color:#4498ca;transform:scale(1.05)}
        .mbtn.lis{border-color:#4CAF50;animation:mp 1.5s ease-in-out infinite}
        @keyframes mp{0%,100%{box-shadow:0 0 0 0 rgba(76,175,80,.3)}50%{box-shadow:0 0 0 12px rgba(76,175,80,0)}}
        .minn{position:absolute;inset:5px;border-radius:50%;background:linear-gradient(135deg,#4498ca,#2c6a8c);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 12px rgba(68,152,202,.25)}
        .mbtn.lis .minn{background:linear-gradient(135deg,#4CAF50,#388E3C);box-shadow:0 4px 12px rgba(76,175,80,.25)}
        .mhint{font-size:.8rem;color:#7a9ab0;margin:0;font-weight:500}
        .vihin{text-align:center;padding:.5rem}.vihin p{font-size:.85rem;color:#7a9ab0;margin:0}

        @media(max-width:992px){
          .cr{min-height:calc(100vh - 90px)}
          .smod-in{width:96%;max-width:680px}
          .cgrid{grid-template-columns:1fr 1fr;gap:1.5rem}
          .dgrid{grid-template-columns:1fr 1fr}
          .ccard{padding:1.5rem 1rem}
          .ccard-img :global(img){width:110px!important;height:110px!important}
        }
        @media(max-width:768px){
          .cr{min-height:calc(100vh - 60px)}
          .cr-in{min-height:calc(100vh - 60px)}
          .wv{min-height:calc(100vh - 60px);padding:2rem 1.25rem}
          .wav :global(video),.wav :global(img){width:140px!important;height:140px!important}
          .wgreeting{font-size:1.2rem}
          .bstart{padding:.85rem 1.8rem;font-size:.95rem}
          .wv-btns{flex-direction:column;width:100%;max-width:280px}
          .wv-btn{width:100%}
          .smod{align-items:flex-end}
          .smod-in{width:100%;max-width:100%;max-height:92vh;border-radius:20px 20px 0 0;animation:smodSlide .3s ease both}
          @keyframes smodSlide{from{transform:translateY(100%)}to{transform:translateY(0)}}
          .smod-t{font-size:1.15rem}
          .ggrid{flex-direction:column;gap:1rem;margin:1rem 0}
          .gcard{padding:2rem 2rem}
          .gcard-ico{font-size:4rem}
          .gcard-lbl{font-size:1.1rem}
          .cgrid{grid-template-columns:1fr 1fr;gap:1rem}
          .dgrid{grid-template-columns:1fr;gap:1rem}
          .ccard-img :global(img){width:80px!important;height:80px!important}
          .ccard-name{font-size:.95rem}
          .ccard-desc{font-size:.8rem}
          .ccard-voice{font-size:.8rem;padding:.4rem .7rem}
          .pf-wrap{width:240px}
          .pf-labels{height:240px}
          .pf-l{font-size:.65rem}
          .smod-next{width:100%;justify-content:center}
          .crow{max-width:92%}.crow.system{max-width:98%}
          .drg{grid-template-columns:1fr}
          .sftabs{display:none}
          .stop{padding:.6rem 1rem}
          .chat{padding:1rem}
          .iarea,.qrs{padding-left:1rem;padding-right:1rem}
        }
        @media(max-width:480px){
          .cr{min-height:calc(100vh - 54px)}
          .cr-in{min-height:calc(100vh - 54px)}
          .wv{min-height:calc(100vh - 54px);padding:1.5rem 1rem}
          .wav :global(video),.wav :global(img){width:110px!important;height:110px!important}
          .wgreeting{font-size:1.05rem}
          .wstatus{flex-direction:column;gap:.4rem;align-items:center}
          .smod-cnt{padding:1rem}
          .cgrid{grid-template-columns:1fr 1fr;gap:.5rem}
          .ccard{padding:.85rem .65rem;border-radius:14px}
          .ccard-img :global(img){width:52px!important;height:52px!important}
          .pf-wrap{width:200px}
          .pf-labels{height:200px}
          .stop{padding:.5rem .75rem}
          .tav{width:32px;height:32px}
          .ebtn{font-size:1rem;padding:.4rem .9rem}
        }
        
        /* =============== ULTIMATE PREMIUM AESTHETIC (CALMING & ELEGANT) =============== */
        /* ============================================= */
        .cr {
          background: linear-gradient(160deg,#091221 0%,#0f1d33 40%,#080e1a 70%,#0a1424 100%);
          color: #f1f5f9;
          font-family: 'DM Sans', Georgia, 'Segoe UI', sans-serif;
        }
        .cr-bg { opacity: 1; background: none; }
        .cr-g {
          background: radial-gradient(circle at 10% 30%, rgba(255,255,255,0.03) 0%, transparent 45%),
                      radial-gradient(circle at 90% 70%, rgba(255,255,255,0.02) 0%, transparent 45%);
        }
        
        /* PREP SCREEN - ORGANIC FLUID MESH */
        .prep-screen {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          background: #080e1a;
          overflow: hidden;
          color: #f8fafc;
        }
        .p-aurora-bg { position: absolute; inset: 0; filter: blur(80px); opacity: 0.4; }
        .p-orb { position: absolute; border-radius: 50%; animation: fluidOrb 12s ease-in-out infinite alternate; mix-blend-mode: screen; }
        .p-orb-1 { width: 60vw; height: 60vw; background: #102a4a; top: -10%; left: -10%; }
        .p-orb-2 { width: 50vw; height: 50vw; background: #0c1f38; bottom: -20%; right: -10%; animation-delay: -3s; }
        .p-orb-3 { width: 55vw; height: 55vw; background: #14345c; top: 30%; left: 30%; animation-delay: -6s; }
        @keyframes fluidOrb { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(10vw, -10vh) scale(1.1); } }
        
        .prep-content {
          position: relative; z-index: 10; text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .pc-lens {
          width: 300px; height: 300px; border-radius: 50%; margin-bottom: 2.5rem;
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 80px rgba(255,255,255,0.05), 0 24px 70px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
          animation: lensFloat 4s ease-in-out infinite;
          overflow: hidden;
        }
        .pc-avatar { width: 300px; height: 300px; border-radius: 50%; opacity: 0.95; object-fit: cover; }
        @keyframes lensFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        
        .pc-title { font-size: 2.2rem; font-weight: 200; letter-spacing: -0.02em; margin-bottom: 3.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .pc-steps-container { display: flex; flex-direction: column; gap: 0.5rem; }
        .pc-step { 
          font-size: 1.2rem; color: #cbd5e1; font-weight: 300;
          opacity: 0; animation: stepFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes stepFadeInUp { from { opacity: 0; transform: translateY(20px); filter: blur(4px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

        /* WELCOME BENTO LAYOUT (SPACE OPTIMIZED & EXPERT UX) */
        .w-bento {
          display: grid; grid-template-columns: 1fr 1.1fr; gap: 2rem;
          max-width: 1200px; margin: 0 auto; height: auto; min-height: calc(100vh - 120px);
          padding: 2rem; color: #e2eaf4; animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .wb-main {
          background: rgba(255,255,255,0.06); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
          border-radius: 32px; border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 80px rgba(0,20,60,0.4);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 3rem; text-align: center;
        }
        .wb-hero { position: relative; width: 220px; height: 220px; margin-bottom: 2rem; border-radius: 50%; overflow: hidden; }
        .wb-video { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; position: relative; z-index: 10; box-shadow: 0 16px 40px rgba(201, 169, 110, 0.18); }
        .wav-glow-1 { position: absolute; inset: -30%; border-radius: 50%; background: conic-gradient(from 0deg, #C9A96E, #D4A0A0, #E8D5C4, #C9A96E); filter: blur(30px); opacity: 0.25; animation: spin 20s linear infinite; }
        .wav-glow-2 { position: absolute; inset: -50%; border-radius: 50%; background: radial-gradient(circle, rgba(201, 169, 110, 0.15) 0%, transparent 60%); animation: breathGlowCalm 8s alternate infinite; }
        
        .wb-title { font-size: 2.6rem; font-weight: 300; letter-spacing: -0.03em; margin: 0 0 0.5rem; color: #e8f0fa; line-height: 1.1; }
        .wb-sub { font-size: 1.15rem; color: rgba(180,210,240,0.7); font-weight: 400; margin-bottom: 2.5rem; }
        
        .wb-actions { display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 320px; margin: 0 auto; }
        .wb-start {
          position: relative; width: 100%; padding: 1.15rem; border-radius: 20px; border: none;
          background: linear-gradient(135deg, #C9A96E, #D4A0A0, #B5936B); background-size: 200% 200%; animation: gradientPremium 6s ease infinite;
          color: #ffffff; font-size: 1.15rem; font-weight: 600; cursor: pointer;
          box-shadow: 0 8px 24px rgba(201, 169, 110, 0.3); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
          letter-spacing: 0.02em;
        }
        .wb-start:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 14px 32px rgba(201, 169, 110, 0.4); }
        .wb-start-glow { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: skewX(-20deg); animation: buttonShine 5s infinite; }
        
        .wb-sidebar { display: flex; flex-direction: column; gap: 0.8rem; position: relative; overflow: visible; min-width: 0; padding-top: 0.7rem; }
        .wb-sidebar-tabs { display: none; }
        .wb-st-btn {
          flex: 1; padding: 0.75rem 0; border-radius: 14px; border: none; background: transparent;
          color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wb-st-btn:hover { color: #334155; }
        .wb-st-btn.act { background: #fff; color: #8B7355; box-shadow: 0 4px 12px rgba(201, 169, 110, 0.1); }
        
        .wb-sidebar-content { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .wb-tab-today { display: flex; flex-direction: column; gap: 1.5rem; }

        .wb-tabs-format { display: flex; gap: 0.4rem; justify-content: space-between; align-items: center; margin-top: 0.8rem;}
         .wb-tab {
           display: inline-flex; align-items: center; justify-content: center;
           padding: 0.75rem 0.9rem; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);
           background: rgba(255,255,255,0.04); color: #94a3b8; font-size: 1.15rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; flex: 1; text-align: center;
         }
         .wb-tab:hover { background: rgba(255,255,255,0.08); color: #f8fafc; }
         .wb-tab.act { background: #fff; border-color: rgba(201, 169, 110, 0.35); color: #1e293b; box-shadow: 0 4px 12px rgba(201, 169, 110, 0.15); }
        
        .wi-card {
          background: rgba(255,255,255,0.07); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 12px 40px rgba(0,20,60,0.2); padding: 1.5rem; transition: transform 0.3s ease;
        }
        .wi-card:hover { transform: translateY(-3px); box-shadow: 0 16px 50px rgba(201, 169, 110, 0.1); }
        
        .wi-hero-card { display: flex; flex-direction: column; gap: 1rem; }
        .wih-top { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.2); }
        .wih-indicator { display: flex; align-items: center; gap: 0.5rem; }
        .wih-dot { width: 8px; height: 8px; border-radius: 50%; background: #C9A96E; }
        .wih-dot.pulse { animation: pulseGold 2s infinite; }
        @keyframes pulseGold { 0% { box-shadow: 0 0 0 0 rgba(201,169,110,0.4); } 70% { box-shadow: 0 0 0 6px rgba(201,169,110,0); } 100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); } }
        .wih-lbl { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .wih-focus { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin: 0; }
        .wih-desc { font-size: 0.9rem; color: #475569; line-height: 1.5; margin: 0; }
        
        .wih-metrics { display: flex; gap: 1rem; margin-top: 0.5rem; }
        .wih-metric { flex: 1; padding: 0.8rem; background: rgba(255,255,255,0.7); border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.15); display: flex; flex-direction: column; gap: 0.3rem; }
        .wihm-val { font-size: 1.1rem; font-weight: 700; color: #8B7355; }
        .wihm-lbl { font-size: 0.75rem; color: #64748b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.02em; }
        
        .wi-status { padding: 1.5rem; }
        .wis-section { display: flex; flex-direction: column; gap: 0.8rem; }
        .wiss-title { font-size: 1.05rem; font-weight: 600; color: #334155; margin: 0; }
        .wis-row { display: flex; align-items: center; gap: 0.6rem; font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .wis-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
        .wis-dot.pulse { animation: pulseElegance 2s infinite; }
        .wis-dot.pulse-slow { animation: pulseElegance 3.5s infinite; }
        .wis-dot.on { background: #38bdf8; }
        
        .wi-customize { display: flex; flex-direction: column; gap: 2rem; }
        .wic-section { display: flex; flex-direction: column; }
        .wic-title { font-size: 1.05rem; font-weight: 600; color: #334155; margin: 0 0 0.3rem 0;}
        .wic-desc { font-size: 0.85rem; color: #64748b; margin-bottom: 0.8rem; }
        .wic-btn { padding: 0.8rem 1rem; background: linear-gradient(to right, #ffffff, #FDF8F3); border: 1px solid rgba(201, 169, 110, 0.15); border-radius: 12px; color: #8B7355; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(201, 169, 110, 0.05);}
        .wic-btn:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(201, 169, 110, 0.1); border-color: rgba(201, 169, 110, 0.3);}
        
        .wi-journey { flex: 1; display: flex; flex-direction: column; max-height: 480px; overflow: hidden; padding: 0.5rem; }
        .wij-scroll { display: flex; flex-direction: column; gap: 0.8rem; overflow-y: auto; scrollbar-width: none; padding-bottom: 1rem;}
        .wij-scroll::-webkit-scrollbar { display: none; }
        .wij-item {
          padding: 1.2rem; border-radius: 16px; background: #fff;
          border: 1px solid rgba(226, 232, 240, 0.8); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .wij-item:hover { box-shadow: 0 12px 25px rgba(201, 169, 110, 0.08); transform: translateY(-3px); border-color: rgba(201, 169, 110, 0.3); }
        .wij-item.upcoming { background: linear-gradient(to right, #ffffff, #FDF8F3); border-left: 3px solid #C9A96E; }
        .wiji-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .wiji-date { font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .wiji-dur { margin-left: 0.6rem; color: #cbd5e1; }
        .wiji-detail-btn { background: rgba(201, 169, 110, 0.08); color: #8B7355; border: 1px solid rgba(201, 169, 110, 0.15); border-radius: 8px; padding: 0.3rem 0.7rem; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .wiji-detail-btn:hover { background: #C9A96E; color: #fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(201, 169, 110, 0.2); }
        .wiji-topic { font-size: 1rem; color: #1e293b; font-weight: 600; margin-bottom: 0.4rem; }
        .wiji-summary { font-size: 0.85rem; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* Journey Detail View - Premium */
        .wij-detail-view { display: flex; flex-direction: column; gap: 1.5rem; animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 0.5rem; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .wij-back-btn { background: transparent; border: none; color: #C9A96E; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; padding: 0; margin-bottom: 0.5rem; transition: color 0.2s; }
        .wij-back-btn:hover { color: #8B7355; }
        .wij-detail-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .wijd-header { border-bottom: 2px solid #f1f5f9; padding-bottom: 1.25rem; }
        .wijd-date { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.5rem; }
        .wijd-title { font-size: 1.4rem; font-weight: 700; color: #1e293b; margin: 0 0 1rem; line-height: 1.2; }
        .wijd-badges { display: flex; gap: 0.75rem; }
        .wijd-badge { font-size: 0.7rem; font-weight: 600; padding: 0.4rem 0.75rem; border-radius: 12px; display: flex; align-items: center; gap: 0.4rem; }
        .wijd-badge.dur { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
        .wijd-badge.type { background: #f0fdf4; color: #16a34a; border: 1px solid #dcfce7; }
        .wijd-sec-title { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.6rem; }
        .wijd-sec-text { font-size: 0.95rem; color: #475569; line-height: 1.6; font-weight: 400; }
        .wijd-output-card { 
          background: linear-gradient(135deg, #FDF8F3, #FFF5EB); border: 1px solid rgba(201, 169, 110, 0.15); 
          border-radius: 20px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
          box-shadow: 0 4px 15px rgba(201, 169, 110, 0.05);
        }
        .wijd-output-card i { font-size: 1.75rem; color: #C9A96E; }
        .wijd-output-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .wijd-output-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.02em; }
        .wijd-output-val { font-size: 1rem; font-weight: 700; color: #5C4033; }
        .wijd-footer { margin-top: 0.5rem; }
        .wijd-share-btn { 
          width: 100%; padding: 1rem; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; 
          color: #475569; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .wijd-share-btn:hover { background: #FDF8F3; border-color: #C9A96E; color: #8B7355; }

        /* MEDIA QUERIES FOR ROBUST LAYOUT */
        @media (max-width: 992px) {
          .w-bento { grid-template-columns: 1fr; height: auto; padding: 1rem; }
          .wb-main { padding: 2rem 1.5rem; }
          .wb-hero-lg { width: min(265px,72vw); height: min(265px,72vw); }
          .s-body { flex-direction: column !important; }
          .s-left { width: 100% !important; padding: 1rem !important; border-right: none !important; border-bottom: 1px solid rgba(68,152,202,0.08) !important; }
          .s-lisa-scene { width: 260px !important; height: 260px !important; }
          .s-lisa-wrap { width: 210px !important; height: 210px !important; }
          .s-right { flex: 1; }
        }

      `}</style>
    </div>
  );
}
