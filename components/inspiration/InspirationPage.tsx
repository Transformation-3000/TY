'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReelsFocusView from './ReelsFocusView';

type Tab = 'experten' | 'science' | 'womens-health' | 'hacks' | 'gespeichert';

interface Reel {
  id: string;
  category: Tab;
  title: string;
  teaser: string;
  fullText: string;
  author: string;
  role: string;
  readTime: string;
  image: string;
  tag: string;
  tagColor: string;
  videoSrc?: string;
  saved?: boolean;
  authorImage?: string;
}

const reels: Reel[] = [
  {
    id: 'r_bryan', category: 'experten',
    title: 'Blueprint: Bryan Johnsons Sauna-Protokoll zur Zellreparatur',
    teaser: '4-mal wöchentlich 20 Minuten bei 90°C: Wie Bryan Johnson die Sauna gezielt zur Verlängerung seiner gesunden Lebensspanne nutzt.',
    fullText: 'In seinem berühmten "Project Blueprint" setzt Bryan Johnson die Sauna gezielt zur Aktivierung von Hitzeschockproteinen (HSPs) ein. Diese Proteine reparieren fehlerhafte zelluläre Strukturen und schützen vor altersbedingtem Verfall. Johnsons optimiertes Protokoll sieht 4 Sitzungen pro Woche bei ca. 90°C vor. Seine klinischen Messdaten belegen eine signifikante Senkung der Entzündungsmarker (hs-CRP) und eine Steigerung seiner Herzfrequenzvariabilität (HRV) um über 25%!',
    author: 'Bryan Johnson', role: 'Blueprint-Gründer & Biohacker', readTime: '3 Min', image: '/images/bryan-johnson_new.png', tag: 'SAUNA', tagColor: '#ef4444', saved: false, authorImage: '/images/bryan-johnson_new.png',
  },
  {
    id: 'r_kayla', category: 'experten',
    title: 'Weibliches Biohacking: Kayla Barnes-Lentz’ zelluläres Verjüngungs-Protokoll',
    teaser: 'Neben Bryan Johnson gilt Kayla Barnes-Lentz als einflussreichste Biohackerin der Welt. Erfahre mehr über ihr personalisiertes Zell- und Gehirnoptimierungsprogramm.',
    fullText: 'Kayla Barnes-Lentz ist die führende Stimme im weiblichen Biohacking. Ihr wissenschaftliches Protokoll konzentriert sich auf zelluläre Gesundheit, mitochondriale Optimierung und zirkadiane Langlebigkeit. Zu ihren täglichen Säulen gehören: 1. Eine nährstoffdichte, entzündungshemmende Bio-Ernährung (reich an Polyphenolen), 2. Täglich 20 Minuten Rotlicht- und Nahinfrarot-Therapie zur Anregung der mitochondrialen ATP-Produktion, 3. Hyperbare Sauerstofftherapie (HBOT) zur Reduktion von seneszenten Zellen und Verlängerung der Telomere, 4. Konsequentes Schlaf-Tracking (HRV > 100 ms). Durch ihr optimiertes Regime konnte sie ihr biologisches Alter laut epigenetischen Uhren signifikant senken.',
    author: 'Kayla Barnes-Lentz', role: 'Gründerin & Biohacking-Pionierin', readTime: '4 Min', image: '/images/kayla_barnes_lentz.png', tag: 'BIOHACKING', tagColor: '#8b5cf6', saved: false, authorImage: '/images/kayla_barnes_lentz.png',
  },
  {
    id: 'r1', category: 'experten',
    title: 'Warum Schlaf das mächtigste Longevity-Tool ist',
    teaser: 'Prof. Dr. Walker erklärt, wie 7–9 Stunden Schlaf Telomere schützt und die biologische Uhr verlangsamt.',
    fullText: 'Während des Schlafs repariert der Körper DNA-Schäden, leert das glymphatische System (Abfallentsorgung im Gehirn) und reguliert Entzündungsmarker. Chronischer Schlafmangel – bereits unter 6 Stunden – erhöht das Alzheimer-Risiko um bis zu 40%. Die Lösung: Schlafroutine, kühle Raumtemperatur (18–19°C) und vollständige Dunkelheit.',
    author: 'Prof. Dr. Matthew Walker', role: 'Schlafforscher, UC Berkeley', readTime: '3 Min', image: '/images/insights-schlaf.jpeg', tag: 'SCHLAF', tagColor: '#4498ca', videoSrc: '/videos/reels/reel1.mp4', saved: true,
  },
  {
    id: 'r2', category: 'science',
    title: 'Intermittiertes Fasten & Autophagie: Was sagt die Forschung?',
    teaser: 'Neue Metaanalyse mit 47 Studien zeigt: 16:8-Fasten reduziert Entzündungsmarker um durchschnittlich 28%.',
    fullText: 'Autophagie – der zelluläre Reinigungsprozess – wird durch Fastenperioden massiv aktiviert. Bei 16:8 beginnt die Autophagie nach 12–14 Stunden ohne Nahrung. Wichtig: Kaffee (schwarz) und Wasser brechen das Fasten nicht. Voraussichtlich größter Benefit bei Kombination mit Krafttraining am Ende des Fastenfensters.',
    author: 'Nature Aging Journal', role: 'Peer-reviewed, 2022', readTime: '4 Min', image: '/images/insights-fasten.jpeg', tag: 'ZELLEN', tagColor: '#f59e0b', videoSrc: '/videos/reels/reel2.mp4', saved: false,
  },
  {
    id: 'r3', category: 'experten',
    title: 'Cold Exposure: Der 2-Minuten-Protokoll',
    teaser: 'Tägliche 2-Minuten Kaltdusche erhöht Dopamin um bis zu 250% – laut Stanford-Studie anhaltend für mehrere Stunden.',
    fullText: 'Das Protokoll: Beginne mit 30 Sekunden kaltem Wasser am Ende deiner normalen Dusche. Steigere auf 2 Minuten in 2 Wochen. Optimal ist 14°C. Die neurochemischen Effekte: massiver Norepinephrin-Anstieg (+300%), nachhaltiger Dopaminanstieg, verbesserte Stimmung. Achtung: Nicht unmittelbar nach dem Aufwachen – erst nach 90 Minuten für optimale Cortisol-Nutzung.',
    author: 'Prof. Dr. Andrew Huberman', role: 'Neurowissenschaft, Stanford', readTime: '2 Min', image: '/images/insights-kaelte.jpeg', tag: 'IMMUN', tagColor: '#8b5cf6', saved: false,
  },
  {
    id: 'r5', category: 'science',
    title: 'Resveratrol & NMN: Der Epigenetik-Durchbruch',
    teaser: 'Landmark-Studie von Dr. Sinclair zeigt: NMN erhöht NAD+-Spiegel signifikant – aber der Timing-Faktor ist entscheidend.',
    fullText: 'NAD+ ist der zentrale Energieträger in Zellen und sinkt mit dem Alter. NMN (Nicotinamid-Mononukleotid) is ein direkter Vorläufer. Optimales Timing: morgens mit Nahrung. Kombination mit Resveratrol aktiviert Sirtuine. Caveat: Qualitätsunterschiede bei Supplements sind massiv – nur kristallines NMN wählen.',
    author: 'Cell Metabolism', role: 'Harvard Medical School, 2021', readTime: '5 Min', image: '/images/insights-nmn.jpeg', tag: 'VITALITÄT', tagColor: '#f59e0b', saved: false,
  },
  {
    id: 'r8', category: 'science',
    title: 'Epigenetische Uhr: Zellverjüngung durch Reprogrammierung',
    teaser: 'Harvard-Studie belegt: Kontrollierte Aktivierung von Yamanaka-Faktoren setzt das biologische Zellalter sicher zurück.',
    fullText: 'Durch die gezielte epigenetische Reprogrammierung gelang es Forschern, gealtertes Gewebe zu verjüngen und die Regeneration zu beschleunigen. Der Ansatz setzt die Methylierungsmuster der DNA zurück, wodurch Zellen ihre jugendliche Funktion wiedererlangen. Ein revolutionärer Meilenstein der modernen Altersforschung.',
    author: 'Cell Journal', role: 'Harvard Medical School, 2023', readTime: '3 Min', image: '/images/insights-epigenetik.png', tag: 'EPIGENETIK', tagColor: '#ef4444', saved: false,
  },
  {
    id: 'r6', category: 'experten',
    title: 'Zone 2 Training: Die unterschätzte Longevity-Waffe',
    teaser: 'Dr. Peter Attia: 3-4x Stunden Zone 2 pro Woche sind wichtiger als jedes Supplement für ein langes Leben.',
    fullText: 'Zone 2 (60-70% max. Herzfrequenz) trainiert die mitochondriale Effizienz. Praktisch: Du kannst dich noch unterhalten, aber bist leicht außer Atem. 45-60 Minuten pro Session. Beste Aktivitäten: zügiges Gehen, lockeres Radfahren, Rudern. Effekt auf Longevity: verbessert Insulinsensitivität, erhöht Mitochondriendichte, reduziert kardiovaskuläres Risiko.',
    author: 'Dr. Peter Attia', role: 'Longevity-Arzt & Autor', readTime: '4 Min', image: '/images/insights-zone2.jpeg', tag: 'KRAFT', tagColor: '#22c55e', saved: true,
  },
  {
    id: 'r7', category: 'science',
    title: 'Soziale Bindungen als Überlebensfaktor',
    teaser: 'Studien belegen: Starke soziale Netzwerke reduzieren das Sterberisiko um bis zu 50%.',
    fullText: 'Einsamkeit hat den gleichen Effekt auf die Gesundheit wie das Rauchen von 15 Zigaretten am Tag. Soziale Interaktion senkt Cortisol und stärkt das Immunsystem. Praktische Tipps: Quality-Time priorisieren, regelmäßige Treffen mit Freunden, aktives Zuhören.',
    author: 'PLOS Medicine Journal', role: 'Meta-Analysis, 2010', readTime: '3 Min', image: '/images/hero_emotional.jpg', tag: 'SOZIALES', tagColor: '#ec4899', saved: false,
  },
  {
    id: 'r_taurine', category: 'science',
    title: 'Taurin-Therapie: Signifikante Verlangsamung der zellulären Alterung',
    teaser: 'Landmark-Studie 2026 belegt: Eine gezielte Taurin-Supplementierung bremst Mitochondrien-Verfall und verlängert die gesunde Lebensspanne.',
    fullText: 'Eine im Frühjahr 2026 veröffentlichte multizentrische Studie untersuchte den Einfluss der Aminosäure Taurin auf den Alterungsprozess des Menschen. Da der Taurinspiegel im Alter um bis zu 80% sinkt, führt eine Ergänzung zur Reaktivierung geschwächter Stammzellen, reduziert DNA-Schäden und stärkt die mitochondriale Energieproduktion. Die behandelten Gruppen zeigten eine signifikant verbesserte Muskelkraft und kardiovaskuläre Elastizität.',
    author: 'Science Journal', role: 'Peer-Reviewed, 2026', readTime: '4 Min', image: '/images/lab_preview_2.png', tag: 'VITALITÄT', tagColor: '#f59e0b', saved: false, authorImage: '/images/lab_preview_2.png',
  },
  {
    id: 'r_reprogramming', category: 'science',
    title: 'Zelluläre Reprogrammierung: Durchbruch bei Gewebeverjüngung',
    teaser: 'Klinische Phase-I-Studie 2026 belegt erstmals die Sicherheit der partiellen Yamanaka-Reprogrammierung an alterndem Gewebe.',
    fullText: 'In einer bahnbrechenden klinischen Studie aus dem Jahr 2026, basierend auf der jahrelangen Grundlagenforschung von Harvard-Professor Dr. David Sinclair und seinem Team, gelang ein historischer Meilenstein: Durch eine kontrollierte, zeitlich präzise begrenzte Aktivierung der Yamanaka-Faktoren (OSKM) konnten gealterte Haut- und Gefäßzellen biologisch verjüngt werden, ohne ihre zelluläre Identität zu verlieren. Die Arbeit demonstriert erstmals die klinische Sicherheit dieser revolutionären epigenetischen Gen-Therapie beim Menschen.',
    author: 'Prof. Dr. David Sinclair', role: 'Harvard Medical School / Nature Medicine, 2026', readTime: '4 Min', image: '/images/lab_preview_3.png', tag: 'ZELLEN', tagColor: '#10b981', saved: false, authorImage: '/images/sinclair_new.jpg',
  },
  {
    id: 'r_science_neural', category: 'science',
    title: 'Epigenetische Regeneration: Wiederherstellung von geschädigtem Sehnervengewebe',
    teaser: 'Eine Landmark-Studie 2026 zeigt: Die partielle epigenetische Reprogrammierung reaktiviert das jugendliche Wachstumspotenzial von Nervenzellen.',
    fullText: 'In einer vielbeachteten Publikation in Nature (März 2026) gelang es Forschern, durch die vorübergehende Aktivierung von drei Yamanaka-Faktoren (OSK) geschädigte Sehnerven bei Säugetieren vollständig zu regenerieren. Die Behandlung verjüngt das DNA-Methylierungsmuster der Nervenzellen, wodurch diese in einen entwicklungsbiologisch aktiven Zustand zurückversetzt werden. Dieser Durchbruch ebnet den Weg für Therapien gegen Altersblindheit und degenerative Nervenerkrankungen.',
    author: 'Nature Journal', role: 'Harvard & MIT Research, 2026', readTime: '4 Min', image: '/images/science_neural_reversal.png', tag: 'REGENERATION', tagColor: '#3b82f6', saved: false, authorImage: '/images/science_neural_reversal.png',
  },
  {
    id: 'r_science_senolytics', category: 'science',
    title: 'Senolytika-Durchbruch: Gezieltes Absterben von Zombiezellen verlängert Lebensspanne',
    teaser: 'Klinische Phase-II-Studie 2026 bestätigt: Ein neuartiger Wirkstoff eliminiert seneszente Zellen hochpräzise und verjüngt das Gefäßsystem.',
    fullText: 'Seneszente Zellen, auch "Zombiezellen" genannt, sondern Entzündungsstoffe ab und schädigen umliegendes Gewebe. In einer im Mai 2026 in Cell veröffentlichten Studie konnte ein neues synthetisches Peptid (FOXO4-DRI-Derivat) diese Zellen selektiv in den programmierten Zelltod (Apoptose) treiben. Die behandelten Probanden zeigten eine signifikante Reduktion der Arteriensteifigkeit und eine regenerierte Hautstruktur.',
    author: 'Cell Journal', role: 'Klinische Studie Phase-II, 2026', readTime: '5 Min', image: '/images/science_senolytics_zombie.png', tag: 'ZELLEN', tagColor: '#10b981', saved: false, authorImage: '/images/science_senolytics_zombie.png',
  },
  {
    id: 'r_science_microbiome', category: 'science',
    title: 'Zirkadianes Mikrobiom: Wie Darmbakterien unsere Langlebigkeitsgene steuern',
    teaser: 'Neue Forschungsergebnisse 2026 belegen: Der tageszeitliche Rhythmus der Darmflora reguliert die Genexpression von Sirtuinen direkt.',
    fullText: 'Unsere Darmbakterien folgen einer strengen inneren Uhr. Eine im Januar 2026 in Science erschienene Studie zeigt, dass Metaboliten des Mikrobioms (wie kurzkettige Fettsäuren) in Abhängigkeit von Fütterungszeiten zirkadiane Schwankungen aufweisen. Diese Stoffwechselprodukte aktivieren gezielt Sirtuin-Gene (SIRT1 und SIRT3) in der Leber, was den Fettabbau optimiert und Entzündungsmarker senkt. Das Mikrobiom-Timing ist somit ein zentraler Langlebigkeitsfaktor.',
    author: 'Science Journal', role: 'Weizmann-Institut, 2026', readTime: '4 Min', image: '/images/science_gut_microbiome.png', tag: 'MIKROBIOM', tagColor: '#f59e0b', saved: false, authorImage: '/images/science_gut_microbiome.png',
  },
  {
    id: 'r_sinclair', category: 'experten',
    title: 'Harvard-Protokoll: Wie Dr. David Sinclair sein biologisches Alter senkt',
    teaser: 'Mit NMN, Resveratrol und intermittierendem Fasten: Das wissenschaftliche Langlebigkeits-Regime des berühmtesten Altersforschers.',
    fullText: 'Dr. David Sinclair, weltberühmter Harvard-Professor, erforscht die epigenetischen Ursachen des Alterns. Sein persönliches, tägliches Langlebigkeits-Protokoll umfasst: 1. 1g NMN am Morgen zur Anhebung der NAD+-Spiegel, 2. 1g Resveratrol mit etwas Joghurt zur Aktivierung der Langlebigkeitsgene (Sirtuine), 3. Ein striktes 18:6 Fastenfenster. Seine biologischen Messungen zeigen, dass sein epigenetisches Alter um über 20 Jahre unter seinem chronologischen Alter liegt!',
    author: 'Prof. Dr. David Sinclair', role: 'Harvard-Professor & Bestseller-Autor', readTime: '4 Min', image: '/images/sinclair_new.jpg', tag: 'EPIGENETIK', tagColor: '#ef4444', saved: false, authorImage: '/images/sinclair_new.jpg',
  },
  {
    id: 'r_huberman', category: 'experten',
    title: 'Huberman Lab: Das Morgen-Protokoll für maximalen Fokus & Energie',
    teaser: '10 Minuten Sonnenlicht direkt nach dem Aufwachen und gezieltes Kältebaden: Dr. Andrew Hubermans Biohacking-Routine.',
    fullText: 'Stanford-Professor Dr. Andrew Huberman hat mit seinem Podcast das Biohacking revolutioniert. Sein Morgen-Protokoll ist weltberühmt: 1. Direkt nach dem Aufwachen 10-15 Minuten in die Sonne blicken, um den circadianen Rhythmus und Cortisol-Peak zu synchronisieren, 2. Eine 3-minütige Eisbad-Session (Cold Plunge) zur Erhöhung des Dopaminspiegels um 250%. Dies steigert seinen Fokus und seine mentale Energie nachhaltig!',
    author: 'Prof. Dr. Andrew Huberman', role: 'Stanford-Professor & Podcast-Host', readTime: '4 Min', image: '/images/insights-morgen.jpeg', tag: 'FOKUS', tagColor: '#f59e0b', saved: false, authorImage: '/images/insights-morgen.jpeg',
  },
  {
    id: 'r_hamilton', category: 'experten',
    title: 'Extreme Vitalität: Laird Hamiltons Pool-Training & Kontrast-Therapie',
    teaser: 'Gewichtstraining unter Wasser und 100°C Sauna gefolgt von Eisbädern: Laird Hamiltons Protokoll für extreme zelluläre Vitalität.',
    fullText: 'Surfer-Legende Laird Hamilton gilt im Alter von über 60 Jahren als Musterbeispiel für aktive Langlebigkeit. Sein Biohacking-Protokoll umfasst extremes Unterwasser-Krafttraining mit Gewichten zur Maximierung der Lungenkapazität und Stressresistenz. Zudem schwört er auf täglichen Hitze-Kälte-Kontrast (20 Min. Sauna bei 100°C gefolgt von 3 Min. im 2°C Eisbad) zur zellulären Entgiftung und Immun-Aktivierung!',
    author: 'Laird Hamilton', role: 'Big-Wave-Surfer & Langlebigkeits-Ikone', readTime: '4 Min', image: '/images/laird_ice_bath.png', tag: 'VITALITÄT', tagColor: '#3b82f6', saved: false, authorImage: '/images/laird_ice_bath.png',
  },
  {
    id: 'r_diamandis', category: 'experten',
    title: 'Longevity-Revolution: Peter Diamandis’ Multi-Therapie-Protokoll',
    teaser: 'Von therapeutischem Plasma-Austausch bis hin zu Stammzell-Therapien: Wie Peter Diamandis modernste Medizin zur Verjüngung nutzt.',
    fullText: 'Co-Autor von "Life Force" Dr. Peter Diamandis setzt auf ein aggressives Langlebigkeits-Regime. Neben einer zuckerfreien Ernährung und intensivem Krafttraining nutzt er modernste regenerative Medizin: 1. Regelmäßiger therapeutischer Plasma-Austausch (TPE) zur Beseitigung seneszenter Proteine im Blut, 2. Stammzell- und Exosomen-Therapien zur Geweberegeneration, 3. Ganzkörper-Screenings (wie Prenuvo-MRIs) zur Früherkennung. Seine Diagnostik zeigt, dass sein biologisches Alter stetig sinkt!',
    author: 'Dr. Peter Diamandis', role: 'XPRIZE-Gründer & Bestseller-Autor', readTime: '4 Min', image: '/images/peter-diamandis.png', tag: 'DIAGNOSTIK', tagColor: '#8b5cf6', saved: false, authorImage: '/images/peter-diamandis.png',
  },
  {
    id: 'r_asprey', category: 'experten',
    title: 'Bulletproof Kaffee: Mitochondrien-Power durch MCT',
    teaser: 'Dave Asprey erklärt, wie hochwertige Fette und gezieltes Neurofeedback deine mentale Leistungsfähigkeit verdoppeln.',
    fullText: 'Der Pionier des Biohackings Dave Asprey prägte den Begriff durch die Optimierung zellulärer Energie. Sein bekanntester Hack ist der Bulletproof Coffee (Kaffee mit Weidebutter und C8-MCT-Öl) für langanhaltende Keton-Energie ohne Blutzuckerschwankungen. Asprey setzt zudem auf Rotlichttherapie, Mitochondrien-Training und tägliche Kälteexposition zur Aktivierung der Langlebigkeit.',
    author: 'Dave Asprey', role: 'Vater des Biohackings & Autor', readTime: '3 Min', image: '/images/dave-asprey.png', tag: 'FOKUS', tagColor: '#f59e0b', saved: false, authorImage: '/images/dave-asprey.png',
  },
  {
    id: 'h1', category: 'hacks',
    title: 'Was passiert, wenn du frisches Felsquellwasser trinkst?',
    teaser: 'Reines, unfiltriertes Quellwasser steckt voller natürlicher Mineralien, die deine zelluläre Hydration sofort maximieren.',
    fullText: 'Frisches Felsquellwasser ist hexagonal strukturiert und reich an essenziellen Elektrolyten wie Magnesium, Calcium und Kieselsäure. Diese natürliche Struktur ermöglicht es deinen Zellen, das Wasser viel schneller aufzunehmen als behandeltes Leitungswasser. Zudem ist es frei von Mikroplastik und Chlor-Rückständen, was deine Mitochondrien-Gesundheit schützt!',
    author: 'Lisa AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/photo_water.png', tag: 'HYDRATION', tagColor: '#3b82f6', saved: false, authorImage: '/images/lisa.png',
  },
  {
    id: 'h2', category: 'hacks',
    title: 'Was passiert, wenn du nur 6 Stunden oder weniger schläfst?',
    teaser: 'Schon eine einzige Nacht unter 6 Stunden Schlaf lässt dein Gehirn um Jahre altern und blockiert die zelluläre Entgiftung.',
    fullText: 'Wenn du unter 6 Stunden schläfst, bleibt das glymphatische System – die Müllabfuhr deines Gehirns – inaktiv. Toxische Proteine (Amyloid-Beta) können nicht abgebaut werden. Zudem sinkt deine Testosteronausschüttung und deine Genexpression für Entzündungen steigt sprunghaft an. Dauerhafter Schlafmangel verkürzt deine Telomere massiv!',
    author: 'Tom AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-schlaf.png', tag: 'REGENERATION', tagColor: '#ef4444', saved: false, authorImage: '/images/tom_jung.png',
  },
  {
    id: 'h3_steps', category: 'hacks',
    title: 'Warum 1.000 Schritte mehr pro Tag einen großen Unterschied machen',
    teaser: 'Nur 1.000 zusätzliche Schritte täglich senken dein Sterberisiko signifikant und kurbeln deine mitochondriale Energie an.',
    fullText: 'Jeder Schritt aktiviert die Muskelpumpe und verbessert den Lymphfluss. Bereits 1.000 Schritte mehr pro Tag kurbeln deine Mitochondrien an und steigern deine Insulinsensitivität. Studien zeigen: Ein kleiner Spaziergang nach dem Essen glättet Blutzuckerspitzen um bis zu 30% und verlängert deine gesunde Lebensspanne aktiv!',
    author: 'Lisa AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/photo_walk.png', tag: 'BEWEGUNG', tagColor: '#10b981', saved: false, authorImage: '/images/lisa.png',
  },
  {
    id: 'h4_coffee', category: 'hacks',
    title: 'Kaffee-Timing: Warum du morgens 90 Minuten warten solltest',
    teaser: 'Direkt nach dem Aufwachen blockiert Koffein die natürliche Cortisol-Ausschüttung und sorgt für das berüchtigte Nachmittags-Tief.',
    fullText: 'Beim Erwachen schüttet dein Körper natürliches Cortisol aus, um dich wach zu machen. Wenn du sofort Kaffee trinkst, stört das Koffein diesen Prozess und erhöht die Toleranz. Zudem blockiert es Adenosin-Rezeptoren. Sobald die Wirkung nachlässt, folgt der Crash. Die Lösung: Warte 90 bis 120 Minuten mit der ersten Tasse!',
    author: 'Lisa AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-coffee.png', tag: 'FOKUS', tagColor: '#f59e0b', saved: false, authorImage: '/images/lisa.png',
  },
  {
    id: 'h5_breath', category: 'hacks',
    title: '4-7-8 Atmung: Stress-Kill in nur 60 Sekunden',
    teaser: 'Diese einfache Atemtechnik schaltet dein vegetatives Nervensystem blitzschnell von Stress auf pure Entspannung um.',
    fullText: 'Das Protokoll: 4 Sek. durch die Nase einatmen, 7 Sek. den Atem anhalten, 8 Sek. hörbar durch den Mund ausatmen. Wiederhole das viermal. Das zwingt deinen Puls nach unten, aktiviert den Vagusnerv und signalisiert deinem Gehirn sofortige Sicherheit. Perfekt bei akutem Stress oder direkt vor dem Einschlafen!',
    author: 'Tom AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-breath.png', tag: 'REGENERATION', tagColor: '#ef4444', saved: false, authorImage: '/images/tom_jung.png',
  },
  {
    id: 'h6_light', category: 'hacks',
    title: 'Rotlicht am Abend: Der simple Trick für tieferen Schlaf',
    teaser: 'Blaues Bildschirmlicht zerstört deine nächtliche Melatoninsynthese – warmes Rotlicht schützt sie aktiv.',
    fullText: 'Unsere Netzhaut reagiert empfindlich auf blaues Licht von Displays. Es signalisiert dem Gehirn "Tag" und unterdrückt das Schlafhormon Melatonin um bis zu 90%. Wenn du ab 20:00 Uhr auf warmes, rotes Licht umsteigst, bleibt deine Melatoninsynthese intakt. Du schläfst schneller ein und steigerst deine Tiefschlafphasen spürbar!',
    author: 'Lisa AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-redlight.png', tag: 'SCHLAF', tagColor: '#3b82f6', saved: false, authorImage: '/images/lisa.png',
  },
  {
    id: 'h7_cold', category: 'hacks',
    title: 'Kalt duschen: Der 30-Sekunden Dopamin-Booster',
    teaser: 'Schon 30 Sekunden kaltes Wasser am Ende deiner Dusche steigern dein Dopamin um 250% – anhaltend für Stunden.',
    fullText: 'Das kalte Wasser aktiviert Thermorezeptoren in der Haut, was eine massive Ausschüttung von Norepinephrin (+300%) und Dopamin (+250%) triggert. Der Dopaminanstieg ist sanft und langanhaltend – ohne das anschließende Tief von Zucker oder Koffein. Zudem stärkt es dein Immunsystem durch die Anregung weißer Blutkörperchen!',
    author: 'Tom AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-cold.png', tag: 'IMMUN', tagColor: '#8b5cf6', saved: false, authorImage: '/images/tom_jung.png',
  },
  {
    id: 'h8_hiit', category: 'hacks',
    title: 'HIIT: 60 Sekunden Sprint für mehr Gehirnzellen',
    teaser: 'Ein einziger hochintensiver Sprint kurbelt das neuronale Wachstumsprotein BDNF massiv an und schützt dein Gehirn.',
    fullText: 'Bei maximaler Anstrengung schüttet das Gehirn BDNF (Brain-Derived Neurotrophic Factor) aus – eine Art "Dünger" für Nervenzellen. BDNF fördert die Neuroplastizität, verbessert das Gedächtnis und schützt vor kognitivem Verfall. Schon ein 60-sekündiger Sprint (z. B. auf dem Fahrrad) reicht aus, um den Level signifikant anzuheben!',
    author: 'Tom AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-hiit.png', tag: 'GEHIRN', tagColor: '#ec4899', saved: false, authorImage: '/images/tom_jung.png',
  },
  {
    id: 'h9_olive', category: 'hacks',
    title: 'Olivenöl: Der Autophagie-Turbo für deine Zellen',
    teaser: 'Zwei Esslöffel hochwertiges Olivenöl am Tag aktivieren Langlebigkeitsgene und kurbeln das zelluläre Recycling an.',
    fullText: 'Kaltgepresstes Olivenöl (Extra Vergine) ist extrem reich an Polyphenolen wie Oleocanthal. Diese bioaktiven Stoffe aktivieren Sirtuine (Langlebigkeitsgene) und stimulieren die zelluläre Autophagie – die Müllabfuhr deiner Zellen, die beschädigte Proteine abbaut. Zudem schützt es deine Gefäße und senkt Entzündungswerte nachhaltig!',
    author: 'Lisa AI', role: 'Longevity Snack', readTime: '30 Sek', image: '/images/hacks-olive.png', tag: 'ZELLEN', tagColor: '#10b981', saved: false, authorImage: '/images/lisa.png',
  },
  {
    id: 'w1', category: 'womens-health',
    title: 'Hormonelle Balance & Langlebigkeit: Östrogen als Beschützer',
    teaser: 'Wie die Aufrechterhaltung der hormonellen Gesundheit das Herz- und Gehirnalter bei Frauen aktiv schützt.',
    fullText: 'Östrogen spielt eine Schlüsselrolle beim Schutz der weiblichen Gefäße und Gehirnzellen. Nach der Menopause sinkt dieser Schutz drastisch, was das Risiko für Herz-Kreislauf-Erkrankungen und Demenz erhöht. Neueste Studien zeigen: Phytoöstrogene (z.B. in Leinsamen), Krafttraining und eine gezielte Unterstützung des Mikrobioms (Estrobolom) helfen, den Östrogenspiegel natürlich zu regulieren und das biologische Altern zu verzögern.',
    author: "Harvard Women's Health Watch", role: 'Forschung & Leitlinien, 2026', readTime: '3 Min', image: '/images/woman_blonde.png', tag: 'HORMONBALANCE', tagColor: '#ec4899', saved: false,
  },
  {
    id: 'w2', category: 'womens-health',
    title: 'Zyklusbasiertes Training für maximale Zellregeneration',
    teaser: 'Passe deine sportliche Belastung und Ernährung an die Zyklusphasen an – für besseren Muskelaufbau und weniger Cortisol.',
    fullText: 'In der Follikelphase (hohes Östrogen) ist der Körper optimal auf intensives Krafttraining und HIIT vorbereitet. In der Lutealphase (hohes Progesteron) steigen die Körpertemperatur und das Cortisol leichter an, weshalb moderates Ausdauertraining, Yoga und eine Erhöhung der gesunden Kohlenhydrate die Regeneration und Hormonbalance unterstützen.',
    author: 'Dr. Stacy Sims', role: 'Sportphysiologin & Autorin', readTime: '4 Min', image: '/images/womens_cycle_training.png', tag: 'ZYKLUS-BIO', tagColor: '#8b5cf6', saved: false,
  },
  {
    id: 'w3', category: 'womens-health',
    title: 'Kollagen & Hautelastizität: Wissenschaftliche Hautverjüngung',
    teaser: 'Wie die Kombination aus bioaktiven Kollagenpeptiden und Rotlichttherapie die zelluläre Hautalterung nachweislich bremst.',
    fullText: 'Kollagen ist das primäre Strukturprotein der Haut. Ab dem 25. Lebensjahr sinkt die körpereigene Produktion um ca. 1% jährlich. Klinische Studien belegen: Die Zufuhr von 2,5g bis 5g spezifischen bioaktiven Kollagenpeptiden verbessert nachweislich Hautfeuchtigkeit und -elastizität. In Kombination mit Rotlichttherapie (660nm, regt Fibroblasten an) lässt sich die zelluläre Hautalterung verlangsamen und feine Linien reduzieren.',
    author: 'Journal of Cosmetic Dermatology', role: 'Klinische Studie, 2025', readTime: '3 Min', image: '/images/collagen_redlight_beauty.png', tag: 'BEAUTY-BIO', tagColor: '#ec4899', saved: false,
  },
  {
    id: 'w4', category: 'womens-health',
    title: 'Epigenetik der Haut: Schutz vor Photoaging & Faltenbildung',
    teaser: 'Wie Antioxidantien und pflanzliche Sirtuin-Aktivatoren deine Hautzellen vor UV-induzierter Seneszenz schützen.',
    fullText: 'UV-Strahlung ist für bis zu 80% der sichtbaren Hautalterung (Photoaging) verantwortlich, indem sie DNA-Schäden und seneszente "Zombiezellen" erzeugt. Topisch und oral verabreichte Antioxidantien wie Vitamin C, E und Resveratrol neutralisieren freie Radikale und aktivieren die Sirtuin-Gene der Hautzellen. Das bewahrt die zelluläre Vitalität, stärkt die Hautbarriere und schützt das Kollagengerüst vor oxidativem Abbau.',
    author: 'Dermatological Science', role: 'Peer-reviewed, 2026', readTime: '4 Min', image: '/images/skin_epigenetics.png', tag: 'LONGEVITY-BEAUTY', tagColor: '#f59e0b', saved: false,
  },
  {
    id: 'w5', category: 'womens-health',
    title: 'Mikrobiom & Estrobolom: Die Darm-Hormon-Achse',
    teaser: 'Wie eine gesunde Darmflora die Östrogen-Metabolisierung steuert und zelluläre Entzündungen hemmt.',
    fullText: 'Das Estrobolom ist eine Gruppe von Darmbakterien, die den Östrogenspiegel im Körper regulieren, indem sie das Enzym Beta-Glucuronidase ausschütten. Ein gestörtes Mikrobiom (Dysbiose) führt entweder zu Östrogenmangel oder Östrogendominanz. Die Langlebigkeits-Strategie: Ballaststoffreiche Ernährung (mind. 30g täglich), fermentierte Lebensmittel (Kimchi, Kefir) und der Verzicht auf Emulgatoren stabilisieren das Estrobolom und schützen vor hormonabhängigen Beschwerden.',
    author: 'Microbiome Journal', role: 'Forschung & Reviews, 2026', readTime: '3 Min', image: '/images/estrobolome_gut_health.png', tag: 'MIKROBIOM', tagColor: '#10b981', saved: false,
  },
  {
    id: 'w6', category: 'womens-health',
    title: 'HRV & Weibliche Resilienz: Zyklischer Stressabbau',
    teaser: 'Warum die Herzratenvariabilität (HRV) bei Frauen zyklusabhängig schwankt und wie du dein Nervensystem schützt.',
    fullText: 'Durch den Einfluss von Progesteron sinkt die HRV in der lutealen Phase natürlicherweise ab, während der Ruhepuls leicht ansteigt. Das Nervensystem ist in dieser Zeit sensibler für Stressoren. Wer das ignoriert, riskiert chronisch erhöhte Cortisolwerte, die den Alterungsprozess beschleunigen. Durch die Anpassung des Trainings (mehr Erholung, Atemübungen) lässt sich die HRV stabilisieren und die zelluläre Resilienz stärken.',
    author: 'Stanford Medicine', role: 'Klinische Studie, 2025', readTime: '3 Min', image: '/images/hrv_female_resilience.png', tag: 'NERVENSYSTEM', tagColor: '#3b82f6', saved: false,
  },
];

const tabLabels: { id: Tab; label: string; icon: string }[] = [
  { id: 'hacks', label: 'Longevity Snacks', icon: 'bi-lightning-charge' },
  { id: 'experten', label: 'Biohacking', icon: 'bi-star-fill' },
  { id: 'science', label: 'Wissenschaft', icon: 'bi-journal-medical' },
  { id: 'womens-health', label: "Female Vitality", icon: 'bi-gender-female' },
  { id: 'gespeichert', label: 'Gespeichert', icon: 'bi-bookmark-fill' },
];

export default function InspirationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('hacks');
  const [savedIds, setSavedIds] = useState<string[]>(['r1', 'r6']);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusStartIdx, setFocusStartIdx] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('ty_saved_reels');
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved reels', e);
      }
    }
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('ty_saved_reels', JSON.stringify(next));
      return next;
    });
  };

  const openFocus = (startIdx: number) => {
    setFocusStartIdx(startIdx);
    setFocusOpen(true);
  };

  const filteredReels = activeTab === 'gespeichert'
    ? reels.filter(r => savedIds.includes(r.id))
    : reels.filter(r => r.category === activeTab);

  const focusReels = reels.map(r => ({
    id: r.id,
    title: r.title,
    author: r.author,
    role: r.role,
    tag: r.tag,
    tagColor: r.tagColor,
    teaser: r.teaser,
    fullText: r.fullText,
    videoSrc: r.videoSrc,
    image: r.image,
    authorImage: r.authorImage,
  }));

  return (
    <div className="inspiration-page">
      {/* Focus View */}
      {focusOpen && (
        <ReelsFocusView
          reels={focusReels}
          startIndex={focusStartIdx}
          onClose={() => setFocusOpen(false)}
        />
      )}

      {/* Header */}
      <div className="ins-header">
        <div>
          <h1 className="ins-title">Inspiration</h1>

        </div>
        <button className="ins-badge" onClick={() => openFocus(0)} title="Reels öffnen">
          <i className="bi bi-play-circle-fill" style={{ color: '#4498ca', marginRight: '0.4rem' }} />
          Reels Format
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="ins-tabs">
        {tabLabels.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`ins-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <i className={`bi ${tab.icon}`} />
            <span>{tab.label}</span>
            {tab.id === 'gespeichert' && savedIds.length > 0 && (
              <span className="ins-tab-count">{savedIds.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Reels Grid */}
      {filteredReels.length === 0 ? (
        <div className="ins-empty">
          <i className="bi bi-bookmark" style={{ fontSize: '2rem', color: '#cbd5e1' }} />
          <p>Noch nichts gespeichert. Tippe auf das Lesezeichen-Icon, um Inhalte zu speichern.</p>
        </div>
      ) : (
        <div className="reels-grid">
          {filteredReels.map(reel => {
            const globalIdx = reels.findIndex(r => r.id === reel.id);
            return (
              <div key={reel.id} className={`reel-card ${expandedId === reel.id ? 'expanded' : ''}`}>
                {/* Thumbnail */}
                <div className="reel-thumb" onClick={() => openFocus(globalIdx)} style={{ cursor: 'pointer' }}>
                  <Image src={reel.image} alt={reel.title} fill style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
                  <div className="reel-thumb-overlay" />
                  <span className="reel-tag" style={{ background: reel.tagColor }}>{reel.tag}</span>
                  {/* Play button overlay */}
                  <div className="reel-play-overlay">
                    <div className="reel-play-btn">
                      <i className={`bi ${reel.videoSrc ? 'bi-play-fill' : 'bi-book-fill'}`} />
                    </div>
                  </div>
                  <button
                    className={`reel-save-btn ${savedIds.includes(reel.id) ? 'saved' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleSave(reel.id); }}
                    title={savedIds.includes(reel.id) ? 'Gespeichert' : 'Speichern'}
                  >
                    <i className={`bi ${savedIds.includes(reel.id) ? 'bi-heart-fill' : 'bi-heart'}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="reel-body">
                  <div className="reel-author-row">
                    <Image src={reel.authorImage || reel.image} alt={reel.author} width={34} height={34} style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    <div className="reel-author-info">
                      <span className="reel-author-name">{reel.author}</span>
                      <span className="reel-author-role">{reel.role}</span>
                    </div>
                    <span className="reel-read-time">
                      <i className="bi bi-clock" style={{ marginRight: '3px' }} />{reel.readTime}
                    </span>
                  </div>

                  <h3 className="reel-title">{reel.title}</h3>
                  <p className="reel-teaser">{reel.teaser}</p>

                  {expandedId === reel.id && (
                    <div className="reel-full-text">
                      <p>{reel.fullText}</p>
                    </div>
                  )}

                  <div className="reel-footer">
                    <button
                      className="reel-deepdive-btn"
                      onClick={() => setExpandedId(expandedId === reel.id ? null : reel.id)}
                    >
                      {expandedId === reel.id ? (
                        <>Weniger anzeigen</>
                      ) : (
                        <>Mehr erfahren</>
                      )}
                    </button>
                    <button className="reel-share-btn">
                      <i className="bi bi-share" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .inspiration-page {
          padding: 1.5rem 2rem 3rem;
          min-height: calc(100vh - 80px);
          background: linear-gradient(145deg, #f8fcff 0%, #eef6fb 50%, #f0fdfa 100%);
        }

        .ins-header {
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem;
        }
        .ins-title { font-size: 1.75rem; font-weight: 700; color: #1a3a50; margin: 0; }
        .ins-subtitle { font-size: 0.8rem; color: #94a3b8; margin: 0.2rem 0 0; }
        .ins-badge {
          display: flex; align-items: center; padding: 0.4rem 0.85rem; border-radius: 20px;
          background: rgba(68,152,202,0.1); border: 1px solid rgba(68,152,202,0.2);
          font-size: 0.75rem; font-weight: 600; color: #4498ca;
          cursor: pointer; transition: all 0.2s;
        }
        .ins-badge:hover {
          background: rgba(68,152,202,0.18);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(68,152,202,0.2);
        }

        .reel-play-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.2s;
        }
        .reel-thumb:hover .reel-play-overlay { opacity: 1; }
        .reel-play-btn {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; color: #006ea7;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          transform: scale(0.85); transition: transform 0.2s;
        }
        .reel-thumb:hover .reel-play-btn { transform: scale(1); }

        .ins-tabs {
          display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .ins-tab {
          display: flex; align-items: center; gap: 0.45rem; padding: 0.8rem 1.6rem;
          border-radius: 12px; border: 1.5px solid rgba(68,152,202,0.12);
          background: rgba(255,255,255,0.8); color: #64748b;
          font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: all 0.2s; position: relative;
        }
        .ins-tab.active {
          background: linear-gradient(135deg, #4498ca, #2c6a8c);
          color: white; border-color: transparent;
          box-shadow: 0 4px 12px rgba(68,152,202,0.25);
        }
        .ins-tab.active i {
          color: white;
        }
        .ins-tab:hover:not(.active) {
          border-color: rgba(68,152,202,0.3);
          color: #4498ca;
        }
        .ins-tab:hover:not(.active) i {
          color: #4498ca;
        }
        .ins-tab-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          background: #ef4444; color: white; font-size: 0.7rem; font-weight: 700;
          margin-left: 4px;
        }

        .ins-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 1rem; padding: 4rem 2rem; color: #94a3b8; text-align: center;
        }

        .reels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.25rem;
        }

        .reel-card {
          background: rgba(255,255,255,0.97); border-radius: 16px; overflow: hidden;
          box-shadow: 0 4px 20px rgba(68,152,202,0.08), 0 2px 8px rgba(0,0,0,0.04);
          border: 1.5px solid rgba(255,255,255,0.9); transition: all 0.25s;
        }
        .reel-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 35px rgba(68,152,202,0.14), 0 4px 12px rgba(0,0,0,0.06);
        }
        .reel-card.expanded { box-shadow: 0 12px 40px rgba(68,152,202,0.18); }

        .reel-thumb {
          position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden; flex-shrink: 0;
        }
        .reel-thumb-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
        }
        .reel-tag {
          position: absolute; top: 0.75rem; left: 0.75rem;
          padding: 0.2rem 0.55rem; border-radius: 6px;
          font-size: 0.62rem; font-weight: 800; color: white; letter-spacing: 0.06em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .reel-save-btn {
          position: absolute; top: 0.65rem; right: 0.75rem;
          width: 32px; height: 32px; border-radius: 50%; border: none;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 0.85rem; color: #64748b; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .reel-save-btn.saved {
          background: rgba(239, 68, 68, 0.12);
          font-size: 1.3rem;
        }
        .reel-save-btn.saved i {
          color: #ef4444 !important;
        }
        .reel-save-btn:hover { transform: scale(1.1); }

        .reel-body { padding: 1rem 1.15rem 0.85rem; }

        .reel-author-row {
          display: flex; align-items: center; gap: 0.55rem; margin-bottom: 0.65rem;
        }
        .reel-author-info { flex: 1; min-width: 0; }
        .reel-author-name { display: block; font-size: 0.9rem; font-weight: 700; color: #1a3a50; line-height: 1.2; }
        .reel-author-role { display: block; font-size: 0.8rem; color: #94a3b8; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .reel-read-time { font-size: 0.8rem; color: #94a3b8; white-space: nowrap; flex-shrink: 0; }

        .reel-title {
          font-size: 1.15rem; font-weight: 700; color: #1a3a50;
          margin: 0 0 0.45rem; line-height: 1.35;
        }
        .reel-teaser {
          font-size: 0.95rem; color: #475569; line-height: 1.5; margin: 0 0 0.85rem;
        }

        .reel-full-text {
          padding: 0.85rem; margin-bottom: 0.85rem;
          background: rgba(68,152,202,0.04); border-radius: 10px;
          border-left: 3px solid #4498ca; animation: slideDown 0.25s ease;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .reel-full-text p { font-size: 0.95rem; color: #334155; line-height: 1.65; margin: 0; }

        .reel-footer { display: flex; align-items: center; gap: 0.5rem; }
        .reel-deepdive-btn {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.45rem 1rem; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #4498ca, #2c6a8c); color: white;
          font-size: 0.75rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s;
        }
        .reel-deepdive-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(68,152,202,0.3); }
        .reel-share-btn {
          width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid rgba(68,152,202,0.2);
          background: transparent; color: #4498ca; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .reel-share-btn:hover { background: rgba(68,152,202,0.08); }

        @media (max-width: 768px) {
          .insights-page { padding: 1rem; }
          .reels-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
