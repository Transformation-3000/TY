'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Coach = 'lisa' | 'tom';
type CoachStyle = 'ruhig' | 'klar' | 'aktivierend';
type FormatTab = 'text' | 'audio' | 'video';
type SessionPhase = 'entry' | 'checkin-energy' | 'checkin-stress' | 'checkin-focus' | 'data-pull' | 'verstehen' | 'fokus' | 'empfehlung' | 'commitment' | 'syncing' | 'closing';
type ViewMode = 'welcome' | 'setup' | 'session';

interface ChatMsg {
  id: number;
  from: 'coach' | 'user' | 'system';
  text: string;
  widget?: 'entry-options' | 'energy' | 'stress' | 'focus' | 'data-pull' | 'data-result' | 'action-plan' | 'commitment' | 'system-sync' | 'closing';
  answered?: boolean;
}

const coachProfiles: Record<Coach, { name: string; image: string; desc: string }> = {
  lisa: { name: 'Lisa', image: '/images/lisa.png', desc: 'Empathisch & einfühlsam' },
  tom: { name: 'Tom', image: '/images/profile-large2.png', desc: 'Motivierend & strukturiert' },
};
const styleOptions: Record<CoachStyle, { label: string; desc: string }> = {
  ruhig: { label: 'Ruhig & besonnen', desc: 'Sanfte Begleitung mit viel Raum' },
  klar: { label: 'Klar & strukturiert', desc: 'Fokussiert und auf den Punkt' },
  aktivierend: { label: 'Aktivierend & fordernd', desc: 'Pusht dich zu deinem Besten' },
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
  { id: 1, date: 'Heute, 08:15', focus: 'Schlaf', summary: 'Abendroutine optimiert – Handy ab 21:30 aus dem Schlafzimmer. HRV-Daten analysiert.', output: 'Schlaf-Routine erstellt', duration: '8 Min.' },
  { id: 2, date: 'Gestern, 19:30', focus: 'Ernährung', summary: 'Entzündungshemmende Lebensmittel besprochen. Wochenplan mit Omega-3-Quellen erstellt.', output: 'Ernährungsplan angepasst', duration: '11 Min.' },
  { id: 3, date: '14. März, 12:00', focus: 'Stress', summary: 'HRV unter Baseline. 4-7-8 Atemtechnik eingeführt. Mittagspausen-Ritual definiert.', output: 'Atemübung aktiviert', duration: '7 Min.' },
  { id: 4, date: '12. März, 07:45', focus: 'Bewegung', summary: 'Schritte unter Ziel. Morgenspaziergang als Gewohnheit verankert. Tageslicht-Exposure geplant.', output: 'Bewegungsplan erstellt', duration: '9 Min.' },
  { id: 5, date: '10. März, 20:00', focus: 'Motivation', summary: 'Energie-Tief besprochen. Mikro-Gewohnheiten definiert. Habit-Stacking eingeführt.', output: 'Routinen-Tracker aktiviert', duration: '10 Min.' },
];

interface Coaching2PageProps { onOpenAvatar?: () => void; }

export default function Coaching2Page({ onOpenAvatar }: Coaching2PageProps) {
  const [view, setView] = useState<ViewMode>('welcome');
  const [coach, setCoach] = useState<Coach>('lisa');
  const [coachStyle, setCoachStyle] = useState<CoachStyle>('klar');
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
  const chatRef = useRef<HTMLDivElement>(null);

  const c = coachProfiles[coach];
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

  const addCoachMsg = (text: string, widget?: ChatMsg['widget'], delay = 800) => {
    setIsTyping(true); setIsSpeaking(true);
    return new Promise<void>(res => {
      setTimeout(() => { setMessages(p => [...p, { id: Date.now() + Math.random(), from: 'coach', text, widget }]); setIsTyping(false); setIsSpeaking(false); res(); }, delay);
    });
  };
  const addUserMsg = (text: string) => setMessages(p => [...p, { id: Date.now() + Math.random(), from: 'user', text }]);
  const addSystemMsg = (text: string, widget?: ChatMsg['widget']) => setMessages(p => [...p, { id: Date.now() + Math.random(), from: 'system', text, widget }]);
  const markAnswered = () => setMessages(p => { const cp = [...p]; for (let i = cp.length - 1; i >= 0; i--) { if (cp[i].widget && !cp[i].answered) { cp[i] = { ...cp[i], answered: true }; break; } } return cp; });

  const startSession = async () => {
    setSessionTime(0); setMessages([]); setPhase('entry');
    setEnergy(0); setStress(0); setFocusTopic('');
    setDataLoadStage(0); setDataItems(0); setSyncStage(0); setSyncDone(false);
    setIsAnimating(true);
    setTimeout(() => { setView('session'); setIsAnimating(false); }, 50);
    await addCoachMsg('Hallo Hendrik! Schön, dass du dir Zeit für dich nimmst. Was möchtest du heute machen?', 'entry-options', 1200);
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

        {/* WELCOME */}
        {view === 'welcome' && (
          <div className="wv">
            <div className="wc">
              <div className="wav"><video src="/videos/lisa-avatar.mp4" autoPlay loop muted playsInline width={180} height={180} style={{ objectFit: 'cover', borderRadius: '50%' }} /></div>
              <p className="wgreeting">Hallo Hendrik</p>
              <div className="wstatus">
                <div className="wst-row"><span className="wst-dot on pulse" /><span className="wst-label">Wearable-Daten synchronisiert</span></div>
                <div className="wst-row"><span className="wst-dot on" /><span className="wst-label">Lifestyle-Daten geladen</span></div>
              </div>
              <div className="wlimit"><span className="wlim-bar"><span className="wlim-fill" style={{width:'66.6%'}} /></span><span className="wlim-text">2 von 3 Sessions diese Woche</span></div>
              <div className="ftabs wtabs">{(['text','audio','video'] as FormatTab[]).map(f => (<button key={f} className={`ftab ${formatTab===f?'act':''}`} onClick={() => setFormatTab(f)}>{f==='text'?'Text':f==='audio'?'Audio':'Video'}</button>))}</div>
              <button className="bstart" onClick={startSession}>Session mit {c.name} starten</button>
              <div className="wv-btns">
                <button className="wv-btn" onClick={() => setView('setup')}>Coach anpassen</button>
                <button className="wv-btn" onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Verlauf ausblenden' : 'Bisherige Sessions'}</button>
              </div>
            </div>
            {showHistory && (
              <div className="ps-wrap">
                <div className="ps-list">
                  {pastSessions.map(s => (
                    <div key={s.id} className="ps-card">
                      <div className="ps-top"><span className="ps-date">{s.date}</span><span className="ps-dur">{s.duration}</span></div>
                      <div className="ps-focus">{s.focus}</div>
                      <p className="ps-sum">{s.summary}</p>
                      <div className="ps-output"><span className="ps-ol">{s.output}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETUP */}
        {view === 'setup' && (
          <div className="sv">
            <button className="bback" onClick={() => setView('welcome')}>← Zurück</button>
            <h2 className="stit">Coach & Einstellungen</h2>
            <div className="ssec"><label className="slab">Dein Coach</label>
              <div className="cgrid">{(['lisa','tom'] as Coach[]).map(ci => (<button key={ci} className={`copt ${coach===ci?'sel':''}`} onClick={() => setCoach(ci)}><Image src={coachProfiles[ci].image} alt={coachProfiles[ci].name} width={72} height={72} style={{objectFit:'cover',borderRadius:'50%'}} /><strong>{coachProfiles[ci].name}</strong><span>{coachProfiles[ci].desc}</span>{coach===ci&&<span className="chk">✓</span>}</button>))}</div>
            </div>
            <div className="ssec"><label className="slab">Stil</label>
              <div className="sgrid">{(['ruhig','klar','aktivierend'] as CoachStyle[]).map(s => (<button key={s} className={`sopt ${coachStyle===s?'sel':''}`} onClick={() => setCoachStyle(s)}><strong>{styleOptions[s].label}</strong><span>{styleOptions[s].desc}</span></button>))}</div>
            </div>
            <button className="bstart" onClick={() => setView('welcome')}>Speichern</button>
          </div>
        )}

        {/* SESSION – full screen overlay */}
        {view === 'session' && (
          <div className={`sess ${isAnimating ? 'sess-anim' : ''}`}>
            <div className="stop">
              <div className="stl"><div className="tav"><Image src={c.image} alt={c.name} width={40} height={40} style={{objectFit:'cover',borderRadius:'50%'}} />{isSpeaking&&<span className="sring"/>}</div><div className="tinf"><strong>{c.name}</strong><span className="tst">{isSpeaking?'spricht...':isListening?'hört zu...':phase==='data-pull'?'analysiert Daten...':phase==='syncing'?'überträgt...':'online'}</span></div></div>
              <div className="ftabs sftabs">{(['text','audio','video'] as FormatTab[]).map(f => (<button key={f} className={`ftab ${formatTab===f?'act':''}`} onClick={() => setFormatTab(f)}>{f==='text'?'Text':f==='audio'?'Audio':'Video'}</button>))}</div>
              <div className="str"><div className="stimer"><span className="tval">{formatTime(sessionTime)}</span></div><button className="ebtn" onClick={handleEndSession}>Beenden</button></div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:`${phaseProgress[phase]}%`}}/><span className="plab">{phaseLabels[phase]}</span></div>
            {formatTab==='video'&&(<div className="vidarea"><Image src={c.image} alt={c.name} width={200} height={200} style={{objectFit:'cover',borderRadius:'20px',opacity:0.9}} /><div className="vov"><div className="vdot"/><span>Live</span></div>{onOpenAvatar&&<button className="vrbtn" onClick={onOpenAvatar}>Echten Video-Chat öffnen</button>}</div>)}

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
            </div>

            {showQR&&(<div className="qrs">{getQuickReplies().map((r,i)=>(<button key={i} className="qrb" onClick={()=>handleUserReply(r)}>{r}</button>))}</div>)}

            <div className="iarea">
              {formatTab==='text'&&(<div className="tirow"><input type="text" placeholder="Nachricht eingeben..." className="tinp" readOnly/><button className="sbtn">↑</button></div>)}
              {formatTab==='audio'&&(
                <div className="airow">
                  <div className="avis">{[...Array(16)].map((_,i)=>(<div key={i} className={`vbar ${isListening?'act':''}`} style={{animationDelay:`${i*0.05}s`}}/>))}</div>
                  <button className={`mbtn ${isListening?'lis':''}`} onClick={()=>{if(isListening){setIsListening(false);const r=getQuickReplies();if(r[0])handleUserReply(r[0]);}else setIsListening(true);}}>
                    <div className="minn">{isListening?<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}</div>
                  </button>
                  <p className="mhint">{isListening?'Ich höre zu...':'Tippe zum Sprechen'}</p>
                </div>
              )}
              {formatTab==='video'&&(<div className="vihin"><p>Sprich direkt mit {c.name} – Antworten werden live verarbeitet.</p></div>)}
            </div>
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

        .sv{padding:2rem;max-width:600px;margin:0 auto;animation:fu .4s ease both}
        .bback{background:none;border:none;color:#7a9ab0;font-size:.9rem;cursor:pointer;padding:0;margin-bottom:1.5rem;font-weight:500}
        .bback:hover{color:#4498ca}
        .stit{font-size:1.4rem;color:#1a3a50;margin:0 0 1.5rem;font-weight:700}
        .ssec{margin-bottom:1.5rem}
        .slab{display:block;font-size:.9rem;font-weight:600;color:#2c5a7c;margin-bottom:.75rem}
        .cgrid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .copt{display:flex;flex-direction:column;align-items:center;gap:.4rem;padding:1.25rem;border-radius:18px;border:2px solid rgba(68,152,202,.1);background:rgba(255,255,255,.85);cursor:pointer;transition:all .25s;position:relative}
        .copt:hover{border-color:rgba(68,152,202,.3);background:#fff}
        .copt.sel{border-color:#4498ca;background:rgba(68,152,202,.05)}
        .copt :global(img){border:2px solid rgba(68,152,202,.15)}
        .copt strong{font-size:1rem;color:#1a3a50}.copt span{font-size:.8rem;color:#7a9ab0}
        .chk{position:absolute;top:10px;right:10px;width:24px;height:24px;background:#4498ca;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700}
        .sgrid{display:flex;flex-direction:column;gap:.6rem}
        .sopt{display:flex;flex-direction:column;gap:.15rem;text-align:left;padding:1rem 1.25rem;border-radius:14px;border:2px solid rgba(68,152,202,.1);background:rgba(255,255,255,.85);cursor:pointer;transition:all .25s}
        .sopt:hover{border-color:rgba(68,152,202,.3)}.sopt.sel{border-color:#4498ca;background:rgba(68,152,202,.05)}
        .sopt strong{font-size:.9rem;color:#1a3a50}.sopt span{font-size:.8rem;color:#7a9ab0}

        .ftabs{display:flex;gap:.3rem;padding:.25rem;background:rgba(68,152,202,.06);border-radius:12px}
        .ftab{flex:1;padding:.5rem .7rem;border:none;border-radius:9px;background:transparent;color:#7a9ab0;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .25s;white-space:nowrap}
        .ftab.act{background:#fff;color:#2c5a7c;box-shadow:0 2px 8px rgba(0,60,120,.08);font-weight:600}

        .sess{position:fixed;top:0;left:0;right:0;bottom:0;z-index:1000;display:flex;flex-direction:column;background:linear-gradient(165deg,#f8fcff 0%,#eef6fb 30%,#e5f0f8 60%,#f0f7fc 100%);opacity:1;transform:scale(1);transition:all .3s cubic-bezier(.4,0,.2,1)}
        .sess-anim{opacity:0;transform:scale(.97)}
        .stop{display:flex;align-items:center;justify-content:space-between;padding:.7rem 1.5rem;border-bottom:1px solid rgba(68,152,202,.08);background:rgba(255,255,255,.75);backdrop-filter:blur(16px);gap:1rem}
        .stl{display:flex;align-items:center;gap:.6rem;flex-shrink:0}
        .tav{position:relative;width:40px;height:40px;flex-shrink:0}
        .tav :global(img){border:2px solid rgba(68,152,202,.15)}
        .sring{position:absolute;inset:-4px;border-radius:50%;border:2px solid #4498ca;animation:sp 1.5s ease-in-out infinite}
        @keyframes sp{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        .tinf strong{display:block;font-size:.88rem;color:#1a3a50}.tst{font-size:.72rem;color:#7a9ab0}
        .sftabs{flex:0 1 320px}
        .str{display:flex;align-items:center;gap:.65rem;flex-shrink:0}
        .stimer{display:flex;align-items:center;gap:.3rem;padding:.35rem .75rem;border-radius:10px;background:rgba(68,152,202,.08);font-size:.82rem;font-weight:600;color:#2c5a7c;font-variant-numeric:tabular-nums}
        .ebtn{padding:.35rem .75rem;border-radius:10px;border:1px solid rgba(239,83,80,.2);background:transparent;color:#e57373;font-size:.78rem;font-weight:500;cursor:pointer;transition:all .2s}
        .ebtn:hover{background:rgba(239,83,80,.08);border-color:#e57373}
        .pbar{position:relative;height:22px;background:rgba(68,152,202,.04);overflow:hidden}
        .pfill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(68,152,202,.1),rgba(68,152,202,.18));transition:width .6s ease}
        .plab{position:relative;z-index:1;display:flex;align-items:center;height:100%;padding:0 1.5rem;font-size:.68rem;font-weight:600;color:#93b3c8;letter-spacing:.05em;text-transform:uppercase}

        .vidarea{position:relative;display:flex;align-items:center;justify-content:center;padding:1.5rem;background:linear-gradient(135deg,#1a3a50,#2c5a7c);min-height:160px}
        .vov{position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:.4rem;padding:.3rem .7rem;border-radius:8px;background:rgba(0,0,0,.5);font-size:.75rem;color:#fff;font-weight:600}
        .vdot{width:8px;height:8px;background:#EF5350;border-radius:50%;animation:bl 1.5s infinite}
        @keyframes bl{0%,100%{opacity:1}50%{opacity:.4}}
        .vrbtn{position:absolute;bottom:12px;right:12px;padding:.5rem 1rem;border-radius:10px;border:none;background:rgba(255,255,255,.2);color:#fff;font-size:.8rem;cursor:pointer;backdrop-filter:blur(8px)}

        .chat{flex:1;overflow-y:auto;padding:1.25rem 2rem;display:flex;flex-direction:column;gap:.85rem;scrollbar-width:thin;scrollbar-color:rgba(68,152,202,.15) transparent}
        .chat::-webkit-scrollbar{width:4px}.chat::-webkit-scrollbar-thumb{background:rgba(68,152,202,.15);border-radius:4px}
        .crow{display:flex;gap:.6rem;max-width:72%;animation:mi .3s ease both}
        .crow.coach{align-self:flex-start}.crow.user{align-self:flex-end;flex-direction:row-reverse}.crow.system{align-self:flex-start;max-width:90%}
        @keyframes mi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .cav{width:32px;height:32px;flex-shrink:0;border-radius:50%;overflow:hidden;margin-top:2px}
        .ccont{display:flex;flex-direction:column;gap:.5rem;min-width:0}.ccont.system{width:100%}
        .bub{padding:.85rem 1.15rem;border-radius:18px}
        .bub.coach{background:#fff;border:1px solid rgba(68,152,202,.08);border-bottom-left-radius:6px;box-shadow:0 1px 6px rgba(0,60,120,.04)}
        .bub.user{background:linear-gradient(135deg,#4498ca,#2c6a8c);border-bottom-right-radius:6px;box-shadow:0 2px 8px rgba(68,152,202,.2)}
        .bub p{font-size:.92rem;line-height:1.6;margin:0}.bub.coach p{color:#2c5a7c}.bub.user p{color:#fff}
        .tbub{padding:.75rem 1.15rem}.tdots{display:flex;gap:4px}.tdots span{width:7px;height:7px;border-radius:50%;background:#b0c8d8;animation:db 1.2s ease-in-out infinite}.tdots span:nth-child(2){animation-delay:.15s}.tdots span:nth-child(3){animation-delay:.3s}
        @keyframes db{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}

        .wcards{display:flex;flex-direction:column;gap:.5rem}
        .wcd{display:flex;align-items:center;gap:.75rem;text-align:left;padding:.85rem 1.1rem;border-radius:14px;border:1px solid rgba(68,152,202,.1);background:#fff;cursor:pointer;transition:all .25s;border-left:3px solid rgba(68,152,202,.2)}
        .wcd:hover{border-color:rgba(68,152,202,.3);border-left-color:#4498ca;transform:translateX(3px);box-shadow:0 4px 12px rgba(0,60,120,.06)}
        .wcd strong{display:block;font-size:.86rem;color:#1a3a50}.wcd span{font-size:.76rem;color:#7a9ab0}
        .wrate{display:flex;flex-wrap:wrap;gap:.5rem}
        .rbtn{width:50px;height:50px;border-radius:14px;border:2px solid rgba(68,152,202,.15);background:#fff;font-size:1.1rem;font-weight:700;color:#5a8aa8;cursor:pointer;transition:all .25s}
        .rbtn:hover{transform:scale(1.08)}.rbtn.en:hover{border-color:#4498ca;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff}.rbtn.st:hover{border-color:#ef5350;background:linear-gradient(135deg,#ef5350,#c62828);color:#fff}
        .rlabs{width:100%;display:flex;justify-content:space-between;font-size:.7rem;color:#b0c8d8}
        .wpills{display:flex;flex-wrap:wrap;gap:.4rem}
        .plbtn{padding:.55rem 1rem;border-radius:25px;border:1.5px solid rgba(68,152,202,.15);background:#fff;font-size:.86rem;color:#2c5a7c;font-weight:500;cursor:pointer;transition:all .25s}
        .plbtn:hover{border-color:#4498ca;background:rgba(68,152,202,.06)}

        .wdp{padding:1.25rem;border-radius:16px;border:1px solid rgba(68,152,202,.15);background:linear-gradient(135deg,rgba(26,58,80,.03),rgba(68,152,202,.06))}
        .dph{display:flex;align-items:center;gap:.65rem;margin-bottom:.75rem;font-size:.88rem;font-weight:600;color:#2c5a7c}
        .dpspin{width:18px;height:18px;border:2.5px solid rgba(68,152,202,.2);border-top-color:#4498ca;border-radius:50%;animation:sn .8s linear infinite;flex-shrink:0}
        @keyframes sn{to{transform:rotate(360deg)}}
        .dpsrc{display:flex;gap:.4rem;margin-bottom:.85rem}
        .dps{padding:.25rem .6rem;border-radius:8px;font-size:.7rem;font-weight:600;background:rgba(68,152,202,.08);color:#4498ca}
        .dpits{display:flex;flex-direction:column;gap:.5rem}
        .dpi{display:flex;align-items:center;gap:.6rem;padding:.5rem .65rem;border-radius:10px;background:rgba(255,255,255,.6);transition:all .4s;opacity:.5}
        .dpi.ld{opacity:1;background:rgba(255,255,255,.9)}
        .dpii{font-size:1.1rem}.dpil{flex:1;font-size:.8rem;color:#5a8aa8;font-weight:500}.dpi.ld .dpil{color:#2c5a7c}
        .dpib{flex:0 0 80px;height:4px;background:rgba(68,152,202,.1);border-radius:2px;overflow:hidden}
        .dpif{height:100%;width:0;background:#4498ca;border-radius:2px;animation:lb 1.5s ease forwards}
        .dpif.dn{width:100%!important;background:#43A047}
        @keyframes lb{0%{width:0}50%{width:70%}100%{width:95%}}

        .wdr{padding:1.25rem;border-radius:18px;background:linear-gradient(135deg,rgba(255,255,255,.97),rgba(248,252,255,.97));border:1px solid rgba(68,152,202,.12);box-shadow:0 4px 24px rgba(0,60,120,.06)}
        .drh{margin-bottom:1rem}.drt{display:block;font-size:.95rem;font-weight:700;color:#1a3a50;margin-bottom:.2rem}.drs{font-size:.72rem;color:#93b3c8}
        .drg{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
        .drc{padding:.85rem;border-radius:14px;background:rgba(68,152,202,.04);border:1px solid rgba(68,152,202,.06);animation:ci .4s ease both}
        @keyframes ci{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        .drct{display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem}.drcl{font-size:.75rem;color:#7a9ab0;font-weight:600;text-transform:uppercase;letter-spacing:.03em}
        .drcv{font-size:1.35rem;font-weight:800;color:#1a3a50;line-height:1.2}.drcu{font-size:.72rem;color:#93b3c8;margin-bottom:.45rem}
        .drbar{height:5px;background:rgba(68,152,202,.1);border-radius:3px;overflow:hidden;margin-bottom:.35rem}
        .drfl{height:100%;border-radius:3px;transition:width .8s ease}
        .drfl.down{background:linear-gradient(90deg,#e57373,#ef5350)}.drfl.up{background:linear-gradient(90deg,#FFA726,#FB8C00)}.drfl.stable{background:linear-gradient(90deg,#81C784,#43A047)}
        .drsub{font-size:.72rem;font-weight:600}.drsub.down{color:#e57373}.drsub.up{color:#FFA726}.drsub.stable{color:#43A047}

        .wap{padding:1.25rem;border-radius:18px;background:linear-gradient(135deg,#fff,#f8fcff);border:1px solid rgba(68,152,202,.12);box-shadow:0 4px 20px rgba(0,60,120,.06)}
        .apb{display:inline-block;padding:.25rem .65rem;border-radius:8px;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;margin-bottom:.6rem}
        .apt{font-size:1.1rem;color:#1a3a50;margin:0 0 .6rem;font-weight:700;line-height:1.35}
        .apw{font-size:.85rem;color:#5a8aa8;line-height:1.55;margin:0 0 .85rem}
        .apm{display:flex;gap:.65rem;margin-bottom:.85rem}
        .apmi{flex:1;padding:.55rem;background:rgba(68,152,202,.04);border-radius:10px}
        .apmi span{display:block;font-size:.68rem;color:#7a9ab0;margin-bottom:.15rem}.apmi strong{display:block;font-size:.78rem;color:#1a3a50;margin-top:.2rem}
        .apmbar{height:4px;background:rgba(68,152,202,.1);border-radius:2px;overflow:hidden}.apmf{height:100%;border-radius:2px}.apmf.lo{background:linear-gradient(90deg,#81C784,#43A047)}.apmf.hi{background:linear-gradient(90deg,#4498ca,#2c6a8c)}
        .aps{display:flex;flex-direction:column;gap:.35rem;margin-bottom:.85rem}
        .apsi{display:flex;align-items:center;gap:.5rem;font-size:.82rem;color:#5a8aa8;padding:.4rem .6rem;background:rgba(68,152,202,.03);border-radius:8px}
        .apcb{width:100%;padding:.75rem;border:none;border-radius:12px;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:.9rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(68,152,202,.25);transition:all .25s}
        .apcb:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(68,152,202,.35)}

        .wcm{display:flex;flex-direction:column;gap:.45rem}
        .cmb{padding:.8rem 1rem;border-radius:14px;border:1.5px solid rgba(68,152,202,.12);background:#fff;font-size:.9rem;font-weight:500;color:#2c5a7c;cursor:pointer;transition:all .25s;text-align:left}
        .cmb:hover{border-color:rgba(68,152,202,.35);transform:translateX(3px)}
        .cmb.ac:hover{border-color:#43A047;background:rgba(67,160,71,.04)}.cmb.ad:hover{border-color:#FFA726;background:rgba(255,167,38,.04)}

        .wsy{padding:1.25rem;border-radius:16px;border:1px solid rgba(68,152,202,.15);background:linear-gradient(135deg,rgba(26,58,80,.02),rgba(68,152,202,.05))}
        .syh{display:flex;align-items:center;gap:.65rem;margin-bottom:.85rem;font-size:.9rem;font-weight:600;color:#2c5a7c}
        .syok{font-size:1.1rem}
        .syis{display:flex;flex-direction:column;gap:.45rem}
        .syi{display:flex;align-items:center;gap:.5rem;padding:.55rem .7rem;border-radius:10px;background:rgba(255,255,255,.5);transition:all .5s;opacity:.4;transform:translateX(-8px)}
        .syi.done{opacity:1;background:rgba(255,255,255,.9);transform:translateX(0)}
        .syck{font-size:.85rem;flex-shrink:0}.syil{font-size:.84rem;color:#2c5a7c;font-weight:500}
        .syft{margin-top:.75rem;padding:.65rem .85rem;border-radius:10px;background:rgba(67,160,71,.06);font-size:.82rem;color:#43A047;font-weight:600}

        .wclo{margin-top:.25rem}
        .cloi{padding:.75rem 1rem;border-radius:12px;background:rgba(68,152,202,.06);font-size:.85rem;color:#5a8aa8;margin-bottom:.65rem}
        .cloi strong{color:#1a3a50}
        .clob{padding:.7rem 1.5rem;border-radius:12px;border:none;background:linear-gradient(135deg,#4498ca,#2c6a8c);color:#fff;font-size:.9rem;font-weight:600;cursor:pointer;box-shadow:0 4px 16px rgba(68,152,202,.25);transition:all .25s}
        .clob:hover{transform:translateY(-1px)}

        .qrs{display:flex;flex-wrap:wrap;gap:.4rem;padding:.5rem 2rem;border-top:1px solid rgba(68,152,202,.06)}
        .qrb{padding:.55rem 1rem;border-radius:20px;border:1px solid rgba(68,152,202,.18);background:rgba(255,255,255,.85);font-size:.82rem;color:#2c5a7c;font-weight:500;cursor:pointer;transition:all .2s}
        .qrb:hover{border-color:#4498ca;background:#fff;transform:translateY(-1px)}

        .iarea{padding:.75rem 2rem;border-top:1px solid rgba(68,152,202,.08);background:rgba(255,255,255,.6)}
        .tirow{display:flex;gap:.5rem}
        .tinp{flex:1;padding:.75rem 1rem;border-radius:14px;border:1.5px solid rgba(68,152,202,.15);background:#fff;font-size:.9rem;color:#2c5a7c;outline:none}
        .tinp:focus{border-color:#4498ca}
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

        @media(max-width:768px){
          .crow{max-width:92%}.crow.system{max-width:98%}
          .drg{grid-template-columns:1fr}
          .sftabs{display:none}
          .stop{padding:.6rem 1rem}
          .chat{padding:1rem}
          .iarea,.qrs{padding-left:1rem;padding-right:1rem}
        }
      `}</style>
    </div>
  );
}
