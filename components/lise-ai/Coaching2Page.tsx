'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

type CoachVariant = 'lisa-jung' | 'lisa-alt' | 'tom-jung' | 'tom-alt';
type FormatTab = 'text' | 'audio' | 'video';
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
  'lisa-jung': { name: 'Lisa', image: '/images/lisa.png', desc: 'Jung, modern & empathisch', voice: 'nova', greeting: 'Hallo, ich bin Lisa – dein persönlicher Coach.' },
  'lisa-alt': { name: 'Lisa', image: '/images/lisa_alt.png', desc: 'Erfahren, weise & warmherzig', voice: 'shimmer', greeting: 'Hallo, ich bin Lisa – dein persönlicher Coach.' },
  'tom-jung': { name: 'Tom', image: '/images/tom_jung.png', desc: 'Dynamisch, motivierend & direkt', voice: 'echo', greeting: 'Hallo, ich bin Tom – dein persönlicher Coach.' },
  'tom-alt': { name: 'Tom', image: '/images/tom_alt.png', desc: 'Gelassen, strukturiert & erfahren', voice: 'onyx', greeting: 'Hallo, ich bin Tom – dein persönlicher Coach.' },
};
const getPersonalityDesc = (x: number, y: number) => {
  const r = (1-x)*(1-y), ye = x*(1-y), g = x*y, b = (1-x)*y;
  const types = [
    { w: r, color: 'Rot', desc: 'direkt & entschlossen' },
    { w: ye, color: 'Gelb', desc: 'optimistisch & kommunikativ' },
    { w: g, color: 'Grün', desc: 'empathisch & geduldig' },
    { w: b, color: 'Blau', desc: 'analytisch & strukturiert' },
  ].filter(t => t.w > 0.12).sort((a, b) => b.w - a.w);
  if (!types.length) return { primary: 'Ausgewogen', desc: 'Vereint alle Qualitäten' };
  const p = types[0];
  const sec = types[1];
  if (p.w > 0.5) return { primary: p.color, desc: `Stark ${p.desc}` };
  return { primary: p.color, desc: sec ? `${p.desc}, mit Tendenz ${sec.desc}` : p.desc };
};
const focusTopics = [
  { id: 'schlaf', label: 'Schlaf', icon: '' },
  { id: 'bewegung', label: 'Bewegung', icon: '' },
  { id: 'stress', label: 'Stress', icon: '' },
  { id: 'ernaehrung', label: 'Ernährung', icon: '' },
  { id: 'motivation', label: 'Motivation & Routinen', icon: '' },
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
  { icon: '', label: 'Bewegung', loading: 'Sportdaten werden geladen...', val: '6.420', unit: 'Schritte/Tag', sub: '↓ 18% vs. Vorwoche', trend: 'down', pct: 55 },
  { icon: '', label: 'Schlaf', loading: 'Schlafdaten werden geladen...', val: '6h 12min', unit: 'Durchschnitt', sub: '↓ Qualität gesunken', trend: 'down', pct: 48 },
  { icon: '', label: 'HRV', loading: 'HRV-Daten werden geladen...', val: '38 ms', unit: 'Durchschnitt', sub: '↓ unter deinem Baseline', trend: 'down', pct: 40 },
  { icon: '', label: 'Ruhepuls', loading: 'Vitaldaten werden geladen...', val: '72 bpm', unit: 'Durchschnitt', sub: '↑ leicht erhöht', trend: 'up', pct: 62 },
];
const syncItems = [
  { label: 'Action Plan erstellt' },
  { label: 'Erinnerung: 21:15 – Atemübung starten' },
  { label: 'Erinnerung: 21:30 – Handy aus Schlafzimmer' },
  { label: 'Tracking aktiviert: Schlafqualität' },
  { label: 'Nächster Check-in: Morgen, 20:00 Uhr' },
];
const pastSessions = [
  { id: 1, date: '21. März, 14:30', focus: 'Ad-Hoc: Jetlag & Bio-Sync', summary: 'Kurzfristiges Einzelgespräch nach deinem Flug. Protokoll für Melatonin-Timing und Licht-Exposure erarbeitet.', output: 'Reise-Protokoll', duration: '12 Min.' },
  { id: 2, date: '18. März, 18:00', focus: 'Wöchentlicher Check-in', summary: 'Fokus auf Schlaf und HRV. Abendroutine optimiert – digitales Detox ab 21:30.', output: 'Schlaf-Routine erstellt', duration: '18 Min.' },
  { id: 3, date: '11. März, 18:00', focus: 'Wöchentlicher Check-in', summary: 'Entzündungshemmende Lebensmittel besprochen. Wochenplan mit Omega-3-Quellen optimiert.', output: 'Ernährungsplan', duration: '20 Min.' },
  { id: 4, date: '04. März, 18:00', focus: 'Wöchentlicher Check-in', summary: 'Baseline-Check und Monats-Zielsetzung besprochen. Mikro-Routinen in den Arbeitsalltag integriert.', output: 'Baseline definiert', duration: '25 Min.' },
];

interface Coaching2PageProps { onOpenAvatar?: () => void; }

export default function Coaching2Page({ onOpenAvatar }: Coaching2PageProps) {
  const [view, setView] = useState<ViewMode>('welcome');
  const [coachVariant, setCoachVariant] = useState<CoachVariant>('lisa-jung');
  const [setupStep, setSetupStep] = useState<SetupStep>('coach');
  const [dataVisualType, setDataVisualType] = useState('emotional');
  const [coachGender, setCoachGender] = useState<'female' | 'male' | null>(null);
  const [personalityPos, setPersonalityPos] = useState({ x: 0.65, y: 0.7 });
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
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

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
          `Deine Daten zeigen ein klares Bild: Deine Schlafqualität ist in den letzten Tagen gesunken, die HRV deutet auf erhöhte Belastung hin, und deine Bewegung war unterdurchschnittlich. Zusammen mit deinem Energielevel (${eDesc}) und Stresslevel (${stress}/5) ergibt sich ein konkreter Ansatzpunkt. Was beschäftigt dich beim Thema ${focusData?.label} am meisten?`,
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
    if (!text || formatTab !== 'audio') return;
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

  const startSession = async () => {
    setView('preparing');
    setTimeout(async () => {
      setSessionTime(0); setMessages([]); setPhase('entry');
      setEnergy(0); setStress(0); setFocusTopic('');
      setDataLoadStage(0); setDataItems(0); setSyncStage(0); setSyncDone(false);
      setIsAnimating(true);
      setTimeout(() => { setView('session'); setIsAnimating(false); }, 50);
      await addCoachMsg('Hallo Hendrik! Schön, dass du dir Zeit für dich nimmst. Was möchtest du heute machen?', 'entry-options', 1200);
    }, 4500);
  };
  const handleEntryChoice = async (ch: string) => { markAnswered(); addUserMsg(ch); setPhase('checkin-energy'); await addCoachMsg('Bevor wir starten – wie ist deine Energie heute?', 'energy', 900); };
  const handleEnergy = async (v: number) => { setEnergy(v); markAnswered(); addUserMsg(`Energie: ${v}/5`); setPhase('checkin-stress'); await addCoachMsg('Und wie hoch ist dein Stress gerade?', 'stress', 700); };
  const handleStress = async (v: number) => { setStress(v); markAnswered(); addUserMsg(`Stress: ${v}/5`); setPhase('checkin-focus'); await addCoachMsg('Worauf möchtest du heute schauen?', 'focus', 700); };
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
              <div className="wb-hero">
                <div className="wav-glow-1"></div>
                <div className="wav-glow-2"></div>
                <video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline className="wb-video" />
              </div>
              
              <div className="wb-content">
                <h1 className="wb-title">Willkommen zurück, Hendrik.</h1>
                <p className="wb-sub">Deine nächste Journey ist bereit.</p>
                
                <div className="wb-actions">
                  <button className="wb-start" onClick={startSession}>Session starten <span className="wb-start-glow"></span></button>
                </div>
              </div>
            </div>
            
            <div className="wb-sidebar">
              <div className="wb-sidebar-tabs">
                <button className={`wb-st-btn ${rightTab==='today'?'act':''}`} onClick={()=>setRightTab('today')}>Heute</button>
                <button className={`wb-st-btn ${rightTab==='history'?'act':''}`} onClick={()=>setRightTab('history')}>Journey</button>
                <button className={`wb-st-btn ${rightTab==='customize'?'act':''}`} onClick={()=>setRightTab('customize')}>Anpassen</button>
              </div>

              <div className="wb-sidebar-content">
                {rightTab === 'today' && (
                  <div className="wb-tab-today">
                    <div className="wi-card wi-hero-card">
                      <div className="wih-top">
                        <div className="wih-indicator">
                          <span className="wih-dot pulse"></span>
                          <span className="wih-lbl">Live heute, 18:00 Uhr</span>
                        </div>
                      </div>
                      <h3 className="wih-focus">Deep Dive: Schlaf & Erholung</h3>
                      <p className="wih-desc">Basierend auf deinen jüngsten Vitaldaten liegt dein Fokus heute auf der Stabilisierung deiner Tiefschlafphasen und der HRV-Regulation.</p>
                      
                      <div className="wih-metrics">
                        <div className="wih-metric">
                          <span className="wihm-val">6h 12m</span>
                          <span className="wihm-lbl">Ø Schlaf</span>
                        </div>
                        <div className="wih-metric">
                          <span className="wihm-val">38 ms</span>
                          <span className="wihm-lbl">HRV Trend</span>
                        </div>
                        <div className="wih-metric">
                          <span className="wihm-val">72 bpm</span>
                          <span className="wihm-lbl">Ruhepuls</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="wi-card wi-status">
                      <div className="wis-section">
                        <div className="wis-row"><span className="wis-dot pulse"></span><span>Oura-Live-Sync aktiv</span></div>
                        <div className="wis-row"><span className="wis-dot pulse-slow"></span><span>Neuro-Kontext geladen</span></div>
                        <div className="wis-row"><span className="wis-dot on"></span><span>Apple Health verknüpft</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {rightTab === 'history' && (
                  <div className="wi-card wi-journey">
                    <div className="wij-scroll">
                      {selectedSessionId !== null ? (
                        <div className="wij-detail-view">
                          <button className="wij-back-btn" onClick={() => setSelectedSessionId(null)}>
                            <i className="bi bi-chevron-left"></i> Zurück zur Übersicht
                          </button>
                          
                          {(() => {
                            const s = pastSessions.find(sess => sess.id === selectedSessionId);
                            if (!s) return null;
                            return (
                              <div className="wij-detail-content">
                                <div className="wijd-header">
                                  <div className="wijd-date">{s.date}</div>
                                  <h3 className="wijd-title">{s.focus}</h3>
                                  <div className="wijd-badges">
                                    <span className="wijd-badge dur"><i className="bi bi-clock"></i> {s.duration}</span>
                                    <span className="wijd-badge type"><i className="bi bi-record-circle"></i> Abgeschlossen</span>
                                  </div>
                                </div>

                                <div className="wijd-section">
                                  <h4 className="wijd-sec-title">Zusammenfassung</h4>
                                  <p className="wijd-sec-text">{s.summary}</p>
                                </div>

                                <div className="wijd-section">
                                  <h4 className="wijd-sec-title">Ergebnis & Action Points</h4>
                                  <div className="wijd-output-card">
                                    <i className="bi bi-journal-check"></i>
                                    <div className="wijd-output-info">
                                      <div className="wijd-output-label">Wichtigstes Ergebnis:</div>
                                      <div className="wijd-output-val">{s.output}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="wijd-footer">
                                  <button className="wijd-share-btn">E-Mail Protokoll senden</button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      ) : (
                        <>
                          <div className="wij-item upcoming">
                            <div className="wiji-date">Freitag, 18:00 – Geplant</div>
                            <div className="wiji-topic">Deep Dive & Wochenabschluss</div>
                          </div>
                          {pastSessions.map(s => (
                            <div key={s.id} className="wij-item">
                              <div className="wiji-top">
                                <div className="wiji-date">{s.date} <span className="wiji-dur">{s.duration}</span></div>
                                <button className="wiji-detail-btn" onClick={() => setSelectedSessionId(s.id)}>Details</button>
                              </div>
                              <div className="wiji-topic">{s.focus}</div>
                              <div className="wiji-summary">{s.summary}</div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {rightTab === 'customize' && (
                  <div className="wi-card wi-customize">
                    <div className="wic-section">
                      <h4 className="wic-title">Coach Setup</h4>
                      <p className="wic-desc">Passe Lisa an dich an.</p>
                      <button className="wic-btn" onClick={() => setView('setup')}>Persönlichkeit anpassen</button>
                    </div>

                    <div className="wic-section">
                      <h4 className="wic-title">Format</h4>
                      <div className="wb-tabs-format">
                        {(['text','audio','video'] as FormatTab[]).map(f => (
                          <button key={f} className={`wb-tab ${formatTab===f?'act':''}`} onClick={() => setFormatTab(f)}>
                            {f==='text'?'Text':f==='audio'?'Audio':'Video'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                <video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline className="pc-avatar" />
              </div>
              <h2 className="pc-title">Mindspace wird vorbereitet</h2>
              <div className="pc-steps-container">
                <div className="pc-step" style={{animationDelay: '0.5s'}}>Synchronisiere Biosignale...</div>
                <div className="pc-step" style={{animationDelay: '1.5s'}}>Lade letzte Coaching-Erkenntnisse...</div>
                <div className="pc-step" style={{animationDelay: '2.5s'}}>Personalisiere den heutigen Fokus...</div>
              </div>
            </div>
          </div>
        )}

        {/* SETUP MODAL */}
        {view === 'setup' && (
          <div className="smod">
            <div className="smod-in">
              <div className="smod-h">
                <button className="smod-back" onClick={() => { if (setupStep === 'data') setSetupStep('personality'); else if (setupStep === 'personality') setSetupStep('coach'); else { setView('welcome'); setSetupStep('coach'); setCoachGender(null); } }}>
                  {setupStep !== 'coach' ? '← Zurück' : '← Abbrechen'}
                </button>
                <div className="smod-steps">
                  <span className={`smod-s ${setupStep === 'coach' ? 'act' : 'done'}`}>1 Coach</span>
                  <span className="smod-sep" />
                  <span className={`smod-s ${setupStep === 'personality' ? 'act' : (setupStep === 'data' ? 'done' : '')}`}>2 Persönlichkeit</span>
                  <span className="smod-sep" />
                  <span className={`smod-s ${setupStep === 'data' ? 'act' : ''}`}>3 Daten-Ansicht</span>
                </div>
                <div style={{width:80}} />
              </div>

              {setupStep === 'coach' && (
                <div className="smod-cnt">
                  {!coachGender ? (
                    <div className="g-sel" style={{marginTop:'2rem'}}>
                      <h2 className="smod-t" style={{marginBottom:'0.5rem'}}>Wähle deinen Coach</h2>
                      <p className="smod-sub" style={{marginBottom:'2.5rem'}}>Möchtest du lieber von einer weiblichen oder männlichen Stimme gecoacht werden?</p>
                      <div className="ggrid">
                        <button className="gcard" onClick={() => setCoachGender('female')}>
                          <div className="gcard-ico female">
                            <div className="gcard-aura"></div>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="9" r="6" />
                              <path d="M12 15V22M9 19H15" />
                            </svg>
                          </div>
                          <span className="gcard-lbl">Weiblich</span>
                        </button>
                        <button className="gcard" onClick={() => setCoachGender('male')}>
                          <div className="gcard-ico male">
                            <div className="gcard-aura"></div>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="10" cy="14" r="6" />
                              <path d="M15 9l6-6M21 9V3h-6" />
                            </svg>
                          </div>
                          <span className="gcard-lbl">Männlich</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="v-sel">
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',maxWidth:'600px',margin:'0 auto 2rem'}}>
                        <button className="ebtn" style={{fontSize:'0.85rem',padding:'0.4rem 0.8rem'}} onClick={() => setCoachGender(null)}>← Geschlecht ändern</button>
                        <h2 className="smod-t" style={{margin:0,fontSize:'1.1rem'}}>Welche Nuance passt besser zu dir?</h2>
                        <div style={{width:100}}></div>
                      </div>
                      <div className="cgrid" style={{gridTemplateColumns: '1fr 1fr', maxWidth: '680px', margin: '0 auto'}}>
                        {(['lisa-jung','lisa-alt','tom-jung','tom-alt'] as CoachVariant[])
                          .filter(v => coachGender === 'female' ? v.startsWith('lisa') : v.startsWith('tom'))
                          .map(v => {
                            const cv = coachVariants[v];
                            return (
                              <button key={v} className={`ccard ${coachVariant===v?'sel':''}`} onClick={() => setCoachVariant(v)}>
                                <div className="ccard-img"><Image src={cv.image} alt={cv.name} width={140} height={140} style={{objectFit:'cover',borderRadius:'50%'}} />{coachVariant===v&&<span className="ccard-chk">✓</span>}</div>
                                <strong className="ccard-name">{cv.name}</strong>
                                <span className="ccard-desc">{cv.desc}</span>
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
                <div className="smod-cnt">
                  <h2 className="smod-t">Deine Persönlichkeit</h2>
                  <p className="smod-sub">Setze den Punkt dort, wo du dich am ehesten wiederfindest.</p>
                  <div className="pf-wrap">
                    <div className="pf-labels">
                      <span className="pf-l pf-tl">Rot<br/><small>Dominant</small></span>
                      <span className="pf-l pf-tr">Gelb<br/><small>Inspirierend</small></span>
                      <span className="pf-l pf-bl">Blau<br/><small>Gewissenhaft</small></span>
                      <span className="pf-l pf-br">Grün<br/><small>Stetig</small></span>
                    </div>
                    <div
                      className="pf-field"
                      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handlePfPointer(e); }}
                      onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) handlePfPointer(e); }}
                    >
                      <div className="pf-dot" style={{left:`${personalityPos.x*100}%`,top:`${personalityPos.y*100}%`}} />
                    </div>
                  </div>
                  <div className="pf-result">
                    <span className={`pf-badge pf-${getPersonalityDesc(personalityPos.x, personalityPos.y).primary.toLowerCase()}`}>{getPersonalityDesc(personalityPos.x, personalityPos.y).primary}</span>
                    <span className="pf-rdesc">{getPersonalityDesc(personalityPos.x, personalityPos.y).desc}</span>
                  </div>
                  <button className="smod-next" onClick={() => setSetupStep('data')}>Weiter</button>
                </div>
              )}

              {setupStep === 'data' && (
                <div className="smod-cnt">
                  <h2 className="smod-t">Daten-Präsentation</h2>
                  <p className="smod-sub">Wähle, wie Lisa deine Vitaldaten visualisieren soll.</p>
                  <div className="dgrid">
                    {[
                      { id: 'numbers', title: 'Zahlen & Fakten', desc: 'Fokus auf exakte Metriken, Tabellen und direkte Auswertungen.', 
                        preview: <div className="dp-numbers"><div className="dpn-card"><span className="dpnc-lbl">HRV Baseline</span><strong className="dpnc-val">42 <span>ms</span></strong></div><div className="dpn-card"><span className="dpnc-lbl">Deep Sleep</span><strong className="dpnc-val">1h 45m</strong></div></div> },
                      { id: 'performance', title: 'Performance & Trends', desc: 'Kombiniert Daten mit dynamischen Trendlinien und Balken.', 
                        preview: <div className="dp-perf"><div className="dpp-top"><span className="dpp-lbl">Recovery Score</span><span className="dpp-badge">+12%</span></div><div className="dpp-chart"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M0,25 C20,25 30,10 50,15 C70,20 80,5 100,5" fill="none" stroke="url(#perfGrad)" strokeWidth="3" strokeLinecap="round"/><defs><linearGradient id="perfGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#4CAF50" stopOpacity="0.4"/><stop offset="100%" stopColor="#4CAF50" stopOpacity="1"/></linearGradient></defs></svg><div className="dpp-dot"></div></div></div> },
                      { id: 'balanced', title: 'Balance & Wohlbefinden', desc: 'Warme Farbcodes und ausgewogene, verständliche Diagramme.', 
                        preview: <div className="dp-bal"><div className="dpb-rings"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="rgba(68,152,202,0.15)" strokeWidth="8"/><circle cx="50" cy="50" r="40" fill="none" stroke="#4498ca" strokeWidth="8" strokeLinecap="round" strokeDasharray="180 251" transform="rotate(-90 50 50)"/><circle cx="50" cy="50" r="28" fill="none" stroke="rgba(76,175,80,0.15)" strokeWidth="8"/><circle cx="50" cy="50" r="28" fill="none" stroke="#4CAF50" strokeWidth="8" strokeLinecap="round" strokeDasharray="120 175" transform="rotate(-90 50 50)"/></svg><div className="dpb-center-icon">✨</div></div><div className="dpb-info"><span className="dpbi-tit">In Balance</span><span className="dpbi-sub">Beide Systeme aktiv</span></div></div> },
                      { id: 'emotional', title: 'Emotional & Narrativ', desc: 'Fokussiert auf das Körpergefühl mit weichen Verlaufskurven.', 
                        preview: <div className="dp-emo"><div className="dpe-orb dpe-orb-1"></div><div className="dpe-orb dpe-orb-2"></div><div className="dpe-glass"><span className="dpe-quote">"Dein Körper sucht nach Ruhe. Nimm dir heute Zeit zum Atmen."</span></div></div> }
                    ].map(d => (
                      <button key={d.id} className={`dcard ${dataVisualType === d.id ? 'sel' : ''}`} onClick={() => setDataVisualType(d.id)}>
                        <h4 className="dc-title">{d.title}</h4>
                        <p className="dc-desc">{d.desc}</p>
                        <div className="dc-preview">{d.preview}</div>
                        {dataVisualType === d.id && <span className="dc-chk">✓</span>}
                      </button>
                    ))}
                  </div>
                  <button className="smod-next" onClick={() => { setView('welcome'); setSetupStep('coach'); setCoachGender(null); }}>Coach speichern</button>
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
              <div className="stl"><div className="tav"><Image src={c.image} alt={c.name} width={40} height={40} style={{objectFit:'cover',borderRadius:'50%'}} />{isSpeaking&&<span className="sring"/>}</div><div className="tinf"><strong>{c.name}</strong><span className="tst">{isSpeaking?'spricht...':isListening?'hört zu...':phase==='data-pull'?'analysiert Daten...':phase==='syncing'?'überträgt...':'online'}</span></div></div>
              <div className="s-center-cal"><span className="we-countdown-sm">Live heute, 18:00 Uhr</span></div>
              <div className="str"><div className="stimer"><span className="tval">{formatTime(sessionTime)}</span></div><button className="ebtn" onClick={handleEndSession}>Beenden</button></div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:`${phaseProgress[phase]}%`}}/><span className="plab">{phaseLabels[phase]}</span></div>

            {/* TWO-COLUMN BODY */}
            <div className="s-body">
              {/* LEFT – Lisa presence (audio central) */}
              <div className="s-left">

                {/* Format tab bar – small, at top */}
                <div className="s-fmt-tabs">
                  {(['text','audio','video'] as FormatTab[]).map(f => (
                    <button key={f} className={`s-ftab ${formatTab===f?'act':''}`} onClick={() => setFormatTab(f)}>
                      {f==='text'?'Text':f==='audio'?'Sprache':'Video'}
                    </button>
                  ))}
                </div>

                {/* Lisa with wave rings */}
                <div className="s-lisa-scene">
                  {/* Outward wave rings – visible in audio mode */}
                  {formatTab==='audio' && (<>
                    <div className={`s-wave s-wave-1 ${isListening||isSpeaking?'act':''}`} />
                    <div className={`s-wave s-wave-2 ${isListening||isSpeaking?'act':''}`} />
                    <div className={`s-wave s-wave-3 ${isListening||isSpeaking?'act':''}`} />
                  </>)}
                  <div className="s-lisa-wrap">
                    <video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline className="s-lisa-vid" />
                    <div className="s-lisa-glow" />
                  </div>
                </div>

                {/* Name + status */}
                <div className="s-lisa-info">
                  <span className="s-lisa-name">{c.name}</span>
                  <span className="s-lisa-status">{isSpeaking ? '● spricht' : isListening ? '● hört zu' : '○ bereit'}</span>
                </div>

                {/* Mic button – only in audio mode */}
                {formatTab==='audio' && (
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
                        <button className="wcd" onClick={() => handleEntryChoice('Letzte Session fortsetzen')}><div><strong>Letzte Session fortsetzen</strong><span>Beim letzten Commitment weitermachen.</span></div></button>
                        <button className="wcd" onClick={() => handleEntryChoice('Akutes Thema besprechen')}><div><strong>Akutes Thema besprechen</strong><span>Was dich gerade bewegt.</span></div></button>
                        <button className="wcd" onClick={() => handleEntryChoice('Neuer Check-in')}><div><strong>Neuer Check-in</strong><span>Strukturierter Coaching-Flow.</span></div></button>
                      </div>
                    )}
                    {msg.widget==='energy'&&!msg.answered&&(<div className="wrate">{[1,2,3,4,5].map(n=>(<button key={n} className="rbtn en" onClick={()=>handleEnergy(n)}>{n}</button>))}<div className="rlabs"><span>niedrig</span><span>hoch</span></div></div>)}
                    {msg.widget==='stress'&&!msg.answered&&(<div className="wrate">{[1,2,3,4,5].map(n=>(<button key={n} className="rbtn st" onClick={()=>handleStress(n)}>{n}</button>))}<div className="rlabs"><span>niedrig</span><span>hoch</span></div></div>)}
                    {msg.widget==='focus'&&!msg.answered&&(<div className="wpills">{focusTopics.map(t=>(<button key={t.id} className="plbtn" onClick={()=>handleFocus(t.id)}>{t.label}</button>))}</div>)}

                    {msg.widget==='data-pull'&&dataLoadStage<2&&(
                      <div className="wdp">
                        <div className="dph"><div className="dpspin"/><span>{c.name} greift auf deine Daten zu...</span></div>
                        <div className="dpsrc"><span className="dps">Apple Watch</span><span className="dps">Oura Ring</span><span className="dps">TrueYears</span></div>
                        <div className="dpits">{dataLabels.map((d,i)=>(<div key={i} className={`dpi ${dataItems>i?'ld':''}`}><span className="dpil">{dataItems>i?d.label:d.loading}</span><div className="dpib"><div className={`dpif ${dataItems>i?'dn':''}`}/></div></div>))}</div>
                      </div>
                    )}

                    {msg.widget==='data-result'&&(
                      <div className="wdr">
                        <div className="drh"><span className="drt">Deine Daten der letzten 3 Tage</span><span className="drs">Apple Watch · Oura Ring · TrueYears</span></div>
                        <div className="drg">{dataLabels.map((d,i)=>(<div key={i} className="drc" style={{animationDelay:`${i*0.12}s`}}><div className="drct"><span className="drcl">{d.label}</span></div><div className="drcv">{d.val}</div><div className="drcu">{d.unit}</div><div className="drbar"><div className={`drfl ${d.trend}`} style={{width:`${d.pct}%`}}/></div><div className={`drsub ${d.trend}`}>{d.sub}</div></div>))}</div>
                      </div>
                    )}

                    {msg.widget==='action-plan'&&!msg.answered&&(
                      <div className="wap">
                        <div className="apb">Empfehlung auf Basis deiner Daten</div>
                        <h3 className="apt">Handy ab 21:30 aus dem Schlafzimmer legen</h3>
                        <p className="apw">Dein HRV-Verlauf zeigt: deine Erholung startet erst spät. Ohne Bildschirmreize ab 21:30 kann dein Nervensystem 30–45 Min. früher in den Erholungsmodus wechseln.</p>
                        <div className="apm"><div className="apmi"><span>Schwierigkeit</span><div className="apmbar"><div className="apmf lo" style={{width:'25%'}}/></div><strong>Leicht</strong></div><div className="apmi"><span>Wirkung</span><div className="apmbar"><div className="apmf hi" style={{width:'85%'}}/></div><strong>Hoch</strong></div></div>
                        <div className="aps"><div className="apsi"><span>5-Min. Atemübung um 21:15</span></div><div className="apsi"><span>Morgen 10 Min. Tageslicht am Morgen</span></div></div>
                        <button className="apcb" onClick={handleShowCommitment}>Klingt gut – weiter</button>
                      </div>
                    )}

                    {msg.widget==='commitment'&&!msg.answered&&(
                      <div className="wcm"><button className="cmb ac" onClick={()=>handleCommitment('accept')}>Ja, mache ich heute</button><button className="cmb ad" onClick={()=>handleCommitment('adjust')}>Anpassen</button><button className="cmb de" onClick={()=>handleCommitment('decline')}>Nicht realistisch</button></div>
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
                {formatTab==='video' && (
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
        .cr{min-height:calc(100vh - 90px);position:relative;overflow-x:hidden;background:linear-gradient(165deg,#f8fcff 0%,#eef6fb 30%,#e5f0f8 60%,#f0f7fc 100%)}
        .cr-bg{position:absolute;inset:0;pointer-events:none;overflow:hidden}
        .cr-g{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(68,152,202,.08) 0%,transparent 50%),radial-gradient(ellipse at 70% 80%,rgba(176,224,240,.12) 0%,transparent 40%)}
        .cr-d{position:absolute;inset:0;opacity:.03;background-image:radial-gradient(circle at 1px 1px,rgba(68,152,202,.5) 1px,transparent 0);background-size:32px 32px}
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
        .smod-in{width:96%;max-width:860px;max-height:92vh;background:#fff;border-radius:24px;box-shadow:0 24px 80px rgba(0,40,80,.18);display:flex;flex-direction:column;overflow:hidden;animation:smodUp .35s ease both}
        @keyframes smodUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .smod-h{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-bottom:1px solid rgba(68,152,202,.08)}
        .smod-back{background:none;border:none;color:#7a9ab0;font-size:.85rem;cursor:pointer;font-weight:500;padding:0;width:80px;text-align:left}
        .smod-back:hover{color:#4498ca}
        .smod-steps{display:flex;align-items:center;gap:.6rem}
        .smod-s{font-size:.8rem;color:#b0c4d0;font-weight:500;transition:color .2s}
        .smod-s.act{color:#2c5a7c;font-weight:600}
        .smod-s.done{color:#4498ca}
        .smod-sep{width:20px;height:2px;background:rgba(68,152,202,.15);border-radius:1px}
        .smod-cnt{padding:1.5rem;overflow-y:auto;flex:1;text-align:center}
        .smod-t{font-size:1.3rem;font-weight:700;color:#1a3a50;margin:0 0 1.25rem}
        .smod-sub{font-size:.88rem;color:#7a9ab0;margin:-.75rem 0 1.5rem;line-height:1.5}
        .smod-next{display:inline-flex;padding:.85rem 2.2rem;border:none;border-radius:14px;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:1rem;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(68,152,202,.3);transition:all .3s;margin-top:1.25rem}
        .smod-next:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(68,152,202,.4)}

        .cgrid{display:grid;grid-template-columns:repeat(4, 1fr);gap:1.5rem}
        .ccard{display:flex;flex-direction:column;align-items:center;gap:0.75rem;padding:2rem 1.5rem;border-radius:24px;border:2px solid rgba(68,152,202,.08);background:rgba(248,252,255,.9);cursor:pointer;transition:all .25s;position:relative}
        .ccard:hover{border-color:rgba(68,152,202,.35);background:#fff;box-shadow:0 12px 30px rgba(0,60,120,.08);transform:translateY(-4px)}
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
        .dcard{display:flex;flex-direction:column;gap:0.4rem;padding:1.2rem;border-radius:20px;border:2px solid rgba(68,152,202,.08);background:rgba(255,255,255,0.8);cursor:pointer;transition:all 0.25s;position:relative;height:100%}
        .dcard:hover{border-color:rgba(68,152,202,.35);background:#fff;box-shadow:0 8px 24px rgba(0,60,120,.08);transform:translateY(-2px)}
        .dcard.sel{border-color:#4498ca;background:rgba(68,152,202,.04);box-shadow:0 4px 20px rgba(68,152,202,.12)}
        .dc-title{font-size:0.95rem;font-weight:700;color:#1a3a50;margin:0;line-height:1.2}
        .dc-desc{font-size:0.75rem;color:#5a8aa8;line-height:1.35;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .dc-chk{position:absolute;top:0.75rem;right:0.75rem;width:20px;height:20px;background:#4498ca;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700}

        .ggrid{display:flex;gap:4rem;justify-content:center;margin:4rem 0}
        .gcard{display:flex;flex-direction:column;align-items:center;gap:1.5rem;background:transparent;border:none;cursor:pointer;transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);padding:1rem}
        .gcard:hover{transform:translateY(-10px)}
        .gcard-ico{position:relative;width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.4);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.6);color:#1a3a50;box-shadow:0 10px 30px rgba(0,60,120,0.05);transition:all 0.4s}
        .gcard:hover .gcard-ico{background:rgba(255,255,255,0.8);border-color:#4498ca;box-shadow:0 15px 45px rgba(68,152,202,0.15)}
        .gcard-aura{position:absolute;inset:10px;border-radius:50%;filter:blur(20px);opacity:0;transition:all 0.4s;z-index:-1}
        .gcard-ico.female .gcard-aura{background:radial-gradient(circle, #f472b6, transparent 70%)}
        .gcard-ico.male .gcard-aura{background:radial-gradient(circle, #60a5fa, transparent 70%)}
        .gcard:hover .gcard-aura{opacity:0.4;inset:-10px}
        .gcard-lbl{font-size:1.1rem;font-weight:600;color:#1a3a50;letter-spacing:0.05em;text-transform:uppercase;opacity:0.8;transition:all 0.4s}
        .gcard:hover .gcard-lbl{opacity:1;color:#4498ca;transform:scale(1.05)}

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

        .pf-wrap{position:relative;width:280px;margin:0 auto 1rem}
        .pf-labels{position:relative;width:100%;margin-bottom:.4rem}
        .pf-l{position:absolute;font-size:.72rem;font-weight:600;line-height:1.25;white-space:nowrap}
        .pf-l small{font-weight:400;color:#93a8b8;font-size:.68rem}
        .pf-tl{top:-4px;left:-4px;color:#E53935;text-align:left}
        .pf-tr{top:-4px;right:-4px;color:#F9A825;text-align:right}
        .pf-bl{bottom:-4px;left:-4px;color:#1E88E5;text-align:left}
        .pf-br{bottom:-4px;right:-4px;color:#43A047;text-align:right}
        .pf-labels{height:280px}
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

        .sess{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;display:flex;flex-direction:column;background:#07111e;opacity:1;transform:scale(1);transition:all .3s cubic-bezier(.4,0,.2,1)}
        .s-bg{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;background:radial-gradient(ellipse at 20% 50%,rgba(30,60,100,.6) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(50,30,80,.4) 0%,transparent 55%),#07111e}
        .sess-anim{opacity:0;transform:scale(.97)}
        .stop{position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:.7rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.07);background:rgba(10,20,35,.7);backdrop-filter:blur(24px);gap:1rem}
        .stl{display:flex;align-items:center;gap:.6rem;flex-shrink:0}
        .tav{position:relative;width:44px;height:44px;flex-shrink:0}
        .tav :global(img){border:2px solid rgba(255,255,255,0.15);box-shadow:0 4px 12px rgba(0,0,0,.3)}
        .sring{position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(100,200,255,.6);animation:sp 1.5s ease-in-out infinite}
        @keyframes sp{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.12)}}
        .tinf strong{display:block;font-size:.9rem;color:rgba(255,255,255,.9)}.tst{font-size:.75rem;color:rgba(180,210,240,.5)}
        .sftabs{flex:0 1 280px}
        .str{display:flex;align-items:center;gap:.65rem;flex-shrink:0}
        .stimer{display:flex;align-items:center;gap:.3rem;padding:.35rem .75rem;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);font-size:.82rem;font-weight:600;color:rgba(255,255,255,.7);font-variant-numeric:tabular-nums}
        .ebtn{padding:.35rem .8rem;border-radius:10px;border:1px solid rgba(255,100,100,.2);background:transparent;color:rgba(255,120,120,.7);font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s}
        .ebtn:hover{background:rgba(255,80,80,.1);border-color:rgba(255,100,100,.5)}
        .pbar{position:relative;z-index:2;height:2px;background:rgba(255,255,255,.05);overflow:hidden}
        .pfill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(80,160,255,.6),rgba(120,80,255,.6));transition:width .6s ease}
        .plab{display:none}

        /* Two-column session body */
        .s-body{position:relative;z-index:2;flex:1;display:flex;overflow:hidden}
        .s-left{width:46%;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.5rem 2rem 2.5rem;border-right:1px solid rgba(255,255,255,.05);gap:1.4rem}
        .s-right{flex:1;display:flex;flex-direction:column;overflow:hidden}
        .s-fmt-tabs{display:flex;gap:.25rem;padding:.3rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:12px;align-self:stretch;justify-content:center}
        .s-ftab{flex:1;padding:.4rem .6rem;border:none;border-radius:9px;background:transparent;color:rgba(180,210,240,.5);font-size:.78rem;font-weight:500;cursor:pointer;transition:all .25s;letter-spacing:.02em}
        .s-ftab.act{background:rgba(255,255,255,.1);color:rgba(220,240,255,.9);font-weight:600}
        .s-lisa-scene{position:relative;display:flex;align-items:center;justify-content:center;width:300px;height:300px}
        .s-lisa-wrap{position:relative;width:240px;height:240px;border-radius:50%;overflow:hidden;flex-shrink:0;z-index:2}
        .s-lisa-vid{width:100%;height:100%;object-fit:cover;border-radius:50%}
        .s-lisa-glow{position:absolute;inset:-30px;border-radius:50%;background:radial-gradient(circle,rgba(80,160,255,.2),transparent 65%);animation:lg 4s ease-in-out infinite;pointer-events:none;z-index:1}
        @keyframes lg{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.9;transform:scale(1.1)}}
        .s-wave{position:absolute;border-radius:50%;border:1.5px solid rgba(80,160,255,.25);top:50%;left:50%;transform:translate(-50%,-50%) scale(1);opacity:0;pointer-events:none}
        .s-wave-1{width:260px;height:260px}
        .s-wave-2{width:292px;height:292px}
        .s-wave-3{width:324px;height:324px}
        .s-wave.act{animation:sw 2.4s ease-out infinite}
        .s-wave-2.act{animation-delay:.65s}
        .s-wave-3.act{animation-delay:1.3s}
        @keyframes sw{0%{opacity:.55;transform:translate(-50%,-50%) scale(.92)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.18)}}
        .s-lisa-info{text-align:center}
        .s-lisa-name{display:block;font-size:1.15rem;font-weight:600;color:rgba(255,255,255,.85);letter-spacing:.02em;margin-bottom:.3rem}
        .s-lisa-status{display:block;font-size:.8rem;color:rgba(120,180,240,.55);letter-spacing:.05em}
        .s-mic-wrap{display:flex;flex-direction:column;align-items:center;gap:.6rem}
        .s-mbtn{width:56px;height:56px;border-radius:50%;border:1.5px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);cursor:pointer;transition:all .3s;display:flex;align-items:center;justify-content:center}
        .s-mbtn:hover{border-color:rgba(100,180,255,.3);background:rgba(100,180,255,.1)}
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
        .bub{padding:.85rem 1.15rem;border-radius:18px;backdrop-filter:blur(16px)}
        .bub.coach{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1);border-bottom-left-radius:5px}
        .bub.user{background:rgba(80,140,200,.25);border:1px solid rgba(100,160,255,.2);border-bottom-right-radius:5px}
        .bub p{font-size:.93rem;line-height:1.6;margin:0;letter-spacing:0.01em}.bub.coach p{color:rgba(220,235,255,.9)}.bub.user p{color:rgba(200,225,255,.95)}
        .tbub{padding:.75rem 1.15rem}.tdots{display:flex;gap:5px;align-items:center}.tdots span{width:6px;height:6px;border-radius:50%;background:rgba(68,152,202,0.4);animation:db 1.4s ease-in-out infinite}.tdots span:nth-child(2){animation-delay:.2s;background:rgba(68,152,202,0.6)}.tdots span:nth-child(3){animation-delay:.4s;background:rgba(68,152,202,0.8)}
        @keyframes db{0%,60%,100%{transform:translateY(0) scale(1)}30%{transform:translateY(-5px) scale(1.1)}}

        .wcards{display:flex;flex-direction:column;gap:.55rem}
        .wcd{display:flex;align-items:center;gap:.75rem;text-align:left;padding:.9rem 1.15rem;border-radius:16px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.5);backdrop-filter:blur(16px);cursor:pointer;transition:all .3s;box-shadow:0 1px 6px rgba(0,0,0,.03)}
        .wcd:hover{background:rgba(255,255,255,.85);transform:translateX(4px);box-shadow:0 6px 18px rgba(68,152,202,.08);border-color:rgba(68,152,202,.25)}
        .wcd strong{display:block;font-size:.87rem;color:#1a3a50;font-weight:700;margin-bottom:.1rem}.wcd span{font-size:.76rem;color:#7a9ab0}
        .wrate{display:flex;flex-wrap:wrap;gap:.5rem}
        .rbtn{width:50px;height:50px;border-radius:14px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.5);backdrop-filter:blur(12px);font-size:1rem;font-weight:600;color:#3a6a8c;cursor:pointer;transition:all .25s;box-shadow:0 1px 6px rgba(0,0,0,.04)}
        .rbtn:hover{transform:scale(1.08);background:rgba(255,255,255,.9);box-shadow:0 4px 14px rgba(68,152,202,.12)}.rbtn.en:hover{border-color:rgba(68,152,202,.4);background:rgba(68,152,202,.12)}.rbtn.st:hover{border-color:rgba(148,163,184,.5);background:rgba(148,163,184,.12)}
        .rlabs{width:100%;display:flex;justify-content:space-between;font-size:.7rem;color:#94a3b8;font-weight:500}
        .wpills{display:flex;flex-wrap:wrap;gap:.45rem}
        .plbtn{padding:.55rem 1rem;border-radius:22px;border:1px solid rgba(255,255,255,.55);background:rgba(255,255,255,.5);backdrop-filter:blur(12px);font-size:.84rem;color:#2c5a7c;font-weight:500;cursor:pointer;transition:all .25s}
        .plbtn:hover{border-color:rgba(68,152,202,.35);background:rgba(255,255,255,.85);box-shadow:0 4px 12px rgba(68,152,202,.08);transform:translateY(-1px)}

        .wdp{padding:1.25rem;border-radius:18px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.4);backdrop-filter:blur(16px)}
        .dph{display:flex;align-items:center;gap:.65rem;margin-bottom:.75rem;font-size:.88rem;font-weight:600;color:#1a3a50}
        .dpspin{width:16px;height:16px;border:2px solid rgba(68,152,202,.2);border-top-color:#4498ca;border-radius:50%;animation:sn .8s linear infinite;flex-shrink:0}
        @keyframes sn{to{transform:rotate(360deg)}}
        .dpsrc{display:flex;gap:.4rem;margin-bottom:.85rem}
        .dps{padding:.22rem .6rem;border-radius:16px;font-size:.7rem;font-weight:600;background:rgba(68,152,202,.08);color:#4498ca;border:1px solid rgba(68,152,202,.12)}
        .dpits{display:flex;flex-direction:column;gap:.45rem}
        .dpi{display:flex;align-items:center;gap:.6rem;padding:.5rem .65rem;border-radius:10px;background:rgba(255,255,255,.3);border:1px solid rgba(255,255,255,.2);transition:all .5s;opacity:.4}
        .dpi.ld{opacity:1;background:rgba(255,255,255,.65);border-color:rgba(255,255,255,.5)}
        .dpii{font-size:.95rem}.dpil{flex:1;font-size:.8rem;color:#5a8aa8;font-weight:500}.dpi.ld .dpil{color:#1a3a50}
        .dpib{flex:0 0 72px;height:2px;background:rgba(68,152,202,.08);border-radius:2px;overflow:hidden}
        .dpif{height:100%;width:0;background:linear-gradient(90deg,rgba(68,152,202,.5),#4498ca);border-radius:2px;animation:lb 1.5s ease forwards}
        .dpif.dn{width:100%!important;background:linear-gradient(90deg,#81C784,#43A047)}
        @keyframes lb{0%{width:0}50%{width:70%}100%{width:95%}}

        .wdr{padding:1.4rem;border-radius:20px;background:rgba(255,255,255,.55);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.65);box-shadow:0 4px 20px rgba(0,40,80,.05)}
        .drh{margin-bottom:1rem}.drt{display:block;font-size:.92rem;font-weight:700;color:#1a3a50;margin-bottom:.2rem}.drs{font-size:.72rem;color:#7a9ab0}
        .drg{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
        .drc{padding:.85rem;border-radius:14px;background:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.55);backdrop-filter:blur(6px);animation:ci .5s cubic-bezier(.175,.885,.32,1.275) both}
        @keyframes ci{from{opacity:0;transform:scale(.96) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
        .drct{display:flex;align-items:center;gap:.4rem;margin-bottom:.3rem}.drcl{font-size:.7rem;color:#7a9ab0;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
        .drcv{font-size:1.35rem;font-weight:800;color:#1a3a50;line-height:1.1;letter-spacing:-.02em}.drcu{font-size:.7rem;color:#93b3c8;margin-bottom:.4rem}
        .drbar{height:3px;background:rgba(68,152,202,.08);border-radius:2px;overflow:hidden;margin-bottom:.3rem}
        .drfl{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.4,0,.2,1)}
        .drfl.down{background:rgba(200,100,80,.5)}.drfl.up{background:rgba(180,150,60,.5)}.drfl.stable{background:rgba(80,160,100,.5)}
        .drsub{font-size:.7rem;font-weight:600}.drsub.down{color:#b06050}.drsub.up{color:#9a8040}.drsub.stable{color:#4a9060}

        .wap{padding:1.4rem;border-radius:20px;background:rgba(255,255,255,.55);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.65);box-shadow:0 4px 20px rgba(0,40,80,.05)}
        .apb{display:inline-block;padding:.25rem .65rem;border-radius:16px;background:rgba(68,152,202,.08);color:#4498ca;font-size:.67rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.65rem;border:1px solid rgba(68,152,202,.15)}
        .apt{font-size:1rem;color:#1a3a50;margin:0 0 .5rem;font-weight:700;line-height:1.35}
        .apw{font-size:.86rem;color:#5a8aa8;line-height:1.6;margin:0 0 .9rem}
        .apm{display:flex;gap:.6rem;margin-bottom:.8rem}
        .apmi{flex:1;padding:.6rem;background:rgba(255,255,255,.45);border:1px solid rgba(255,255,255,.55);border-radius:12px}
        .apmi span{display:block;font-size:.67rem;color:#7a9ab0;margin-bottom:.15rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em}.apmi strong{display:block;font-size:.8rem;color:#1a3a50;margin-top:.15rem;font-weight:700}
        .apmbar{height:3px;background:rgba(68,152,202,.08);border-radius:2px;overflow:hidden;margin:.3rem 0 0}.apmf{height:100%;border-radius:2px}.apmf.lo{background:rgba(80,160,100,.6)}.apmf.hi{background:rgba(68,152,202,.5)}
        .aps{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.9rem}
        .apsi{display:flex;align-items:center;gap:.6rem;font-size:.83rem;color:#5a8aa8;padding:.45rem .7rem;background:rgba(255,255,255,.4);border-radius:10px;border:1px solid rgba(255,255,255,.5)}
        .apcb{width:100%;padding:.8rem;border:none;border-radius:14px;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:.9rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(68,152,202,.25);transition:all .3s}
        .apcb:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(68,152,202,.35)}

        .wcm{display:flex;flex-direction:column;gap:.45rem}
        .cmb{padding:.8rem 1.1rem;border-radius:14px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.5);backdrop-filter:blur(12px);font-size:.9rem;font-weight:500;color:#1a3a50;cursor:pointer;transition:all .25s;text-align:left}
        .cmb:hover{background:rgba(255,255,255,.82);transform:translateX(3px);box-shadow:0 4px 14px rgba(68,152,202,.08);border-color:rgba(68,152,202,.2)}
        .cmb.ac:hover{border-color:rgba(80,160,100,.35);background:rgba(240,250,244,.7)}.cmb.ad:hover{border-color:rgba(180,150,60,.35);background:rgba(250,248,235,.7)}

        .wsy{padding:1.25rem;border-radius:18px;border:1px solid rgba(255,255,255,.6);background:rgba(255,255,255,.4);backdrop-filter:blur(16px)}
        .syh{display:flex;align-items:center;gap:.65rem;margin-bottom:.8rem;font-size:.9rem;font-weight:600;color:#1a3a50}
        .syok{font-size:1rem}
        .syis{display:flex;flex-direction:column;gap:.4rem}
        .syi{display:flex;align-items:center;gap:.5rem;padding:.55rem .75rem;border-radius:12px;background:rgba(255,255,255,.3);transition:all .6s cubic-bezier(.4,0,.2,1);opacity:.4;transform:translateX(-8px);border:1px solid rgba(255,255,255,.2)}
        .syi.done{opacity:1;background:rgba(255,255,255,.65);transform:translateX(0)}
        .syck{font-size:.82rem;flex-shrink:0}.syil{font-size:.82rem;color:#2c5a7c;font-weight:500}
        .syft{margin-top:.75rem;padding:.65rem .85rem;border-radius:10px;background:rgba(68,152,202,.04);border:1px solid rgba(68,152,202,.1);font-size:.82rem;color:#2c6a8c;font-weight:600}

        .wclo{margin-top:.25rem}
        .cloi{padding:.75rem 1rem;border-radius:14px;background:rgba(255,255,255,.45);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.55);font-size:.85rem;color:#5a8aa8;margin-bottom:.65rem}
        .cloi strong{color:#1a3a50;font-weight:700}
        .clob{padding:.7rem 1.5rem;border-radius:14px;border:none;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:.9rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(68,152,202,.25);transition:all .25s}
        .clob:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(68,152,202,.35)}

        .qrs{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:.5rem;padding:0.75rem 1.5rem;background:transparent;border:none}
        .qrb{padding:.5rem 1.1rem;border-radius:24px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);backdrop-filter:blur(8px);font-size:.82rem;color:rgba(220,235,255,.8);font-weight:500;cursor:pointer;transition:all .3s ease;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
        .qrb:hover{border-color:rgba(129,140,248,.4);background:rgba(129,140,248,.1);color:#fff;transform:translateY(-2px);box-shadow:0 4px 12px rgba(99,102,241,.2)}

        .iarea{position:relative;z-index:2;padding:.85rem 1.5rem 1.2rem;border-top:1px solid rgba(255,255,255,.05);background:rgba(10,20,35,.6);backdrop-filter:blur(24px)}
        .tirow{display:flex;gap:.5rem}
        .tinp{flex:1;padding:.8rem 1.1rem;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);font-size:.93rem;color:rgba(220,240,255,.9);outline:none}
        .tinp::placeholder{color:rgba(150,180,210,.4)}
        .tinp:focus{border-color:rgba(100,160,255,.3);background:rgba(255,255,255,.09)}
        .sbtn{width:44px;height:44px;border-radius:14px;border:none;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:1.2rem;font-weight:700;cursor:pointer}
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
          .ebtn{font-size:.75rem;padding:.35rem .7rem}
        }
        
        /* =============== ULTIMATE PREMIUM AESTHETIC (CALMING & ELEGANT) =============== */
        .cr {
          background: #F8FAFC;
          color: #0f172a;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .cr-bg {
          opacity: 0.9;
          background: linear-gradient(140deg, #F1F5F9 0%, #FFFFFF 100%);
        }
        .cr-g {
          background: radial-gradient(circle at 10% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 45%),
                      radial-gradient(circle at 90% 70%, rgba(129, 140, 248, 0.08) 0%, transparent 45%),
                      radial-gradient(circle at 50% 50%, rgba(192, 132, 252, 0.05) 0%, transparent 50%);
        }
        
        /* PREP SCREEN - ORGANIC FLUID MESH */
        .prep-screen {
          position: fixed; inset: 0; z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          background: #0B1120;
          overflow: hidden;
          color: #f8fafc;
        }
        .p-aurora-bg { position: absolute; inset: 0; filter: blur(90px); opacity: 0.6; }
        .p-orb { position: absolute; border-radius: 50%; animation: fluidOrb 12s ease-in-out infinite alternate; mix-blend-mode: screen; }
        .p-orb-1 { width: 60vw; height: 60vw; background: #38bdf8; top: -10%; left: -10%; }
        .p-orb-2 { width: 50vw; height: 50vw; background: #818cf8; bottom: -20%; right: -10%; animation-delay: -3s; }
        .p-orb-3 { width: 55vw; height: 55vw; background: #c084fc; top: 30%; left: 30%; animation-delay: -6s; }
        @keyframes fluidOrb { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(10vw, -10vh) scale(1.1); } }
        
        .prep-content {
          position: relative; z-index: 10; text-align: center;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .pc-lens {
          width: 130px; height: 130px; border-radius: 50%; margin-bottom: 2.5rem;
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(129, 140, 248, 0.3);
          animation: lensFloat 4s ease-in-out infinite;
          overflow: hidden;
        }
        .pc-avatar { width: 110px; height: 110px; border-radius: 50%; opacity: 0.9; object-fit: cover; }
        @keyframes lensFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        
        .pc-title { font-size: 2.2rem; font-weight: 200; letter-spacing: -0.02em; margin-bottom: 3.5rem; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .pc-steps-container { display: flex; flex-direction: column; gap: 0.5rem; }
        .pc-step { 
          font-size: 1.05rem; color: #cbd5e1; font-weight: 300;
          opacity: 0; animation: stepFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes stepFadeInUp { from { opacity: 0; transform: translateY(20px); filter: blur(4px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }

        /* WELCOME BENTO LAYOUT (SPACE OPTIMIZED & EXPERT UX) */
        .w-bento {
          display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem;
          max-width: 1200px; margin: 0 auto; height: auto; min-height: calc(100vh - 120px);
          padding: 2rem; color: #0f172a; animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .wb-main {
          background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px);
          border-radius: 32px; border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 24px 80px rgba(129, 140, 248, 0.15);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 3rem; text-align: center;
        }
        .wb-hero { position: relative; width: 220px; height: 220px; margin-bottom: 2rem; }
        .wb-video { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; position: relative; z-index: 10; box-shadow: 0 16px 40px rgba(129, 140, 248, 0.2); }
        .wav-glow-1 { position: absolute; inset: -30%; border-radius: 50%; background: conic-gradient(from 0deg, #38bdf8, #818cf8, #c084fc, #38bdf8); filter: blur(30px); opacity: 0.3; animation: spin 16s linear infinite; }
        .wav-glow-2 { position: absolute; inset: -50%; border-radius: 50%; background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 60%); animation: breathGlowCalm 6s alternate infinite; }
        
        .wb-title { font-size: 2.6rem; font-weight: 300; letter-spacing: -0.03em; margin: 0 0 0.5rem; color: #0f172a; line-height: 1.1; }
        .wb-sub { font-size: 1.15rem; color: #64748b; font-weight: 400; margin-bottom: 2.5rem; }
        
        .wb-actions { display: flex; flex-direction: column; gap: 1rem; width: 100%; max-width: 320px; margin: 0 auto; }
        .wb-start {
          position: relative; width: 100%; padding: 1.15rem; border-radius: 20px; border: none;
          background: linear-gradient(135deg, #38bdf8, #818cf8, #c084fc); background-size: 200% 200%; animation: gradientPremium 6s ease infinite;
          color: #ffffff; font-size: 1.15rem; font-weight: 600; cursor: pointer;
          box-shadow: 0 8px 24px rgba(129, 140, 248, 0.3); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
        }
        .wb-start:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 14px 32px rgba(129, 140, 248, 0.4); }
        .wb-start-glow { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transform: skewX(-20deg); animation: buttonShine 4s infinite; }
        
        .wb-sidebar { display: flex; flex-direction: column; gap: 1rem; }
        .wb-sidebar-tabs { display: flex; gap: 0.5rem; background: rgba(255, 255, 255, 0.4); padding: 0.5rem; border-radius: 20px; box-shadow: 0 4px 20px rgba(129, 140, 248, 0.05); }
        .wb-st-btn {
          flex: 1; padding: 0.75rem 0; border-radius: 14px; border: none; background: transparent;
          color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wb-st-btn:hover { color: #334155; }
        .wb-st-btn.act { background: #fff; color: #6366f1; box-shadow: 0 4px 12px rgba(129, 140, 248, 0.1); }
        
        .wb-sidebar-content { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
        .wb-tab-today { display: flex; flex-direction: column; gap: 1.5rem; }

        .wb-tabs-format { display: flex; gap: 0.4rem; justify-content: space-between; align-items: center; margin-top: 0.8rem;}
        .wb-tab {
          padding: 0.6rem 0.8rem; border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.15);
          background: rgba(255,255,255,0.4); color: #64748b; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; flex: 1; text-align: center;
        }
        .wb-tab:hover { background: #fff; color: #334155; }
        .wb-tab.act { background: #fff; border-color: rgba(129, 140, 248, 0.4); color: #6366f1; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08); }
        
        .wi-card {
          background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-radius: 24px; border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 12px 40px rgba(129, 140, 248, 0.08); padding: 1.5rem; transition: transform 0.3s ease;
        }
        .wi-card:hover { transform: translateY(-3px); box-shadow: 0 16px 50px rgba(129, 140, 248, 0.12); }
        
        .wi-hero-card { display: flex; flex-direction: column; gap: 1rem; }
        .wih-top { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.2); }
        .wih-indicator { display: flex; align-items: center; gap: 0.5rem; }
        .wih-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; }
        .wih-dot.pulse { animation: pulseIndigo 2s infinite; }
        @keyframes pulseIndigo { 0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); } 70% { box-shadow: 0 0 0 6px rgba(99,102,241,0); } 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); } }
        .wih-lbl { font-size: 0.8rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .wih-focus { font-size: 1.3rem; font-weight: 600; color: #1e293b; margin: 0; }
        .wih-desc { font-size: 0.9rem; color: #475569; line-height: 1.5; margin: 0; }
        
        .wih-metrics { display: flex; gap: 1rem; margin-top: 0.5rem; }
        .wih-metric { flex: 1; padding: 0.8rem; background: rgba(255,255,255,0.7); border-radius: 16px; border: 1px solid rgba(148, 163, 184, 0.15); display: flex; flex-direction: column; gap: 0.3rem; }
        .wihm-val { font-size: 1.1rem; font-weight: 700; color: #6366f1; }
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
        .wic-btn { padding: 0.8rem 1rem; background: linear-gradient(to right, #ffffff, #f8fafc); border: 1px solid rgba(129, 140, 248, 0.15); border-radius: 12px; color: #6366f1; font-weight: 600; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(129, 140, 248, 0.05);}
        .wic-btn:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(129, 140, 248, 0.1); border-color: rgba(129, 140, 248, 0.3);}
        
        .wi-journey { flex: 1; display: flex; flex-direction: column; max-height: 480px; overflow: hidden; padding: 0.5rem; }
        .wij-scroll { display: flex; flex-direction: column; gap: 0.8rem; overflow-y: auto; scrollbar-width: none; padding-bottom: 1rem;}
        .wij-scroll::-webkit-scrollbar { display: none; }
        .wij-item {
          padding: 1.2rem; border-radius: 16px; background: #fff;
          border: 1px solid rgba(226, 232, 240, 0.8); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .wij-item:hover { box-shadow: 0 12px 25px rgba(129, 140, 248, 0.08); transform: translateY(-3px); border-color: rgba(129, 140, 248, 0.3); }
        .wij-item.upcoming { background: linear-gradient(to right, #ffffff, #f8fafc); border-left: 3px solid #818cf8; }
        .wiji-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .wiji-date { font-size: 0.72rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .wiji-dur { margin-left: 0.6rem; color: #cbd5e1; }
        .wiji-detail-btn { background: rgba(99, 102, 241, 0.08); color: #6366f1; border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 8px; padding: 0.3rem 0.7rem; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .wiji-detail-btn:hover { background: #6366f1; color: #fff; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
        .wiji-topic { font-size: 1rem; color: #1e293b; font-weight: 600; margin-bottom: 0.4rem; }
        .wiji-summary { font-size: 0.85rem; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        /* Journey Detail View - Premium */
        .wij-detail-view { display: flex; flex-direction: column; gap: 1.5rem; animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); padding: 0.5rem; }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .wij-back-btn { background: transparent; border: none; color: #6366f1; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; padding: 0; margin-bottom: 0.5rem; transition: color 0.2s; }
        .wij-back-btn:hover { color: #4f46e5; }
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
          background: linear-gradient(135deg, #f0f7ff, #f5f3ff); border: 1px solid rgba(99, 102, 241, 0.15); 
          border-radius: 20px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.05);
        }
        .wijd-output-card i { font-size: 1.75rem; color: #6366f1; }
        .wijd-output-info { display: flex; flex-direction: column; gap: 0.2rem; }
        .wijd-output-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.02em; }
        .wijd-output-val { font-size: 1rem; font-weight: 700; color: #312e81; }
        .wijd-footer { margin-top: 0.5rem; }
        .wijd-share-btn { 
          width: 100%; padding: 1rem; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px; 
          color: #475569; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .wijd-share-btn:hover { background: #f8fafc; border-color: #6366f1; color: #6366f1; }

        /* SESSION VIEW UNDO DARK MODE */
        .sess { background: #F8FAFC; }
        .stop { background: rgba(255,255,255,0.9); border-bottom-color: rgba(226,232,240,0.8); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .tinf strong { color: #0f172a; }
        .tst { color: #64748b; }
        .s-center-cal { text-align: center; font-size: 0.85rem; color: #64748b; }
        .s-center-cal span span { font-weight: 600; color: #6366f1; }
        .ebtn { color: #818cf8; border-color: rgba(129,140,248,0.25); background: transparent; }
        .ebtn:hover { background: rgba(129,140,248,0.08); border-color: #818cf8; }
        .chat { background: transparent; }
        .bub.coach { background: #ffffff; border: 1px solid rgba(226,232,240,0.8); box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        .bub.coach p { color: #334155; }
        .bub.user { background: linear-gradient(135deg, #38bdf8, #818cf8); box-shadow: 0 4px 12px rgba(99,102,241,0.15); }
        .bub.user p { color: #ffffff; }
        .iarea { background: rgba(248, 250, 252, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(226, 232, 240, 0.4); padding: 1rem 1.75rem; }
        .tirow { display: flex; gap: 0.85rem; align-items: center; }
        .tinp { 
          background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(203, 213, 225, 0.4); 
          color: #1e293b; border-radius: 32px; padding: 0.9rem 1.5rem; font-size: 0.95rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex: 1;
        }
        .tinp:focus { 
          background: #fff; border-color: #818cf8; 
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05); 
          outline: none; 
        }
        .sbtn { 
          width: 48px; height: 48px; border-radius: 50%; border: none;
          background: linear-gradient(135deg, #6366f1, #818cf8); color: white;
          display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
          cursor: pointer; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25); transition: all 0.3s;
          flex-shrink: 0;
        }
        .sbtn:hover { transform: scale(1.08) translateY(-2px); box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3); }
        .sbtn:active { transform: scale(0.92); }
        .wcd { background: #ffffff; border-color: rgba(226,232,240,0.8); border-left-color: #818cf8; }
        .wcd strong { color: #1e293b; }
        .qrs { background: transparent; border: none; padding: 0.5rem 1.75rem; }
        .qrb { background: rgba(255, 255, 255, 0.7); border: 1px solid rgba(203, 213, 225, 0.4); color: #475569; border-radius: 24px; padding: 0.5rem 1.1rem; font-size: 0.85rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); transition: all 0.2s ease; }
        .qrb:hover { background: #fff; border-color: #818cf8; color: #6366f1; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08); }

        /* MEDIA QUERIES FOR ROBUST LAYOUT */
        @media (max-width: 992px) {
          .w-bento { grid-template-columns: 1fr; height: auto; padding: 1rem; }
          .wb-main { padding: 2rem 1.5rem; }
        }

      `}</style>
    </div>
  );
}
