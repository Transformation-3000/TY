# Anleitung für die Marktforschung: True Years Longevity-Dashboard

**Zweck:** Übersicht über alle Bereiche und Seiten der Anwendung sowie empfohlene Klickpfade, damit Marktforscher wissen, was sie Probanden zeigen können und welche User Journeys sich eignen.

---

## 1. Aufbau der Anwendung

- **Eine Web-App (Single-Page):** Es gibt keine echten URL-Wechsel; alle „Seiten“ werden über die **Sidebar** und die **Top-Leiste** eingeblendet.
- **Zwei Einstiegspunkte:**
  - **Top-Leiste (oben):** Logo, Buttons „Plan für heute“ und „Coaching starten“, Wearable-Status, Profilbild.
  - **Sidebar (links):** Vier Bereiche (01 STARTER, 02 LAB, 03 SHOP, 04 EINSTELLUNGEN), jeweils auf- und zuklappbar.

---

## 2. Top-Leiste – was sie darstellt und wohin sie führt

| Element | Darstellung | Klickpfad / Aktion |
|--------|-------------|---------------------|
| **Logo (True Years)** | Branding links | Kein Klick (rein visuell). |
| **„Plan für heute“** | Call-to-Action Mitte | Führt zur Seite **Reports** (Tagesplan / Monatsreport). |
| **„Coaching starten“** | Call-to-Action Mitte | Führt zur Seite **Coaching** (Lisa AI). |
| **Wearable-Icon** | Uhr-Symbol + Verbindungsstatus | Kein Navigations-Klick (zeigt nur Wearable-Anbindung). |
| **Profilbild** | Nutzer-Avatar rechts | Kein Navigations-Klick. |

**Für Marktforschung:** Zeigen, dass der Alltagseinstieg über „Plan für heute“ oder „Coaching starten“ erfolgt – beide führen direkt in zentrale Funktionen.

---

## 3. Sidebar – Bereiche und Seiten

### 3.1 Bereich „01 STARTER“ (Standardmäßig ausgeklappt)

| Menüpunkt | Seite / Inhalt | Was die Seite darstellt | Klickpfad |
|-----------|----------------|-------------------------|-----------|
| **Dashboard** | Vogelperspektive | **Übersicht:** 10 Longevity-Kategorien (Blüten-Darstellung) mit Status (positiv/negativ/neutral), Top-Kennzahlen (Score, Schlaf, Stress, Energie, Schritte), empfohlene Aktionen. Zeigt „wo der Nutzer steht“. | Sidebar → **Dashboard** |
| **Journey** | Longevity Journey (7 Level) | **Gamification:** 7 Stufen (Explorer → Legacy), True-Years-Score, Fortschritt, Leaderboard (Top 100), Achievements, Streaks. Zeigt Motivation und Vergleich mit anderen. | Sidebar → **Journey** |
| **Coaching** | Lisa AI Coaching | **KI-Coaching:** Sprach-/Chat-Interface, Session-Themen (z. B. Schlaf, Bewegung, Stress), Mikro-Habits, Reflexionsfragen. Zeigt persönliche Begleitung. | Sidebar → **Coaching** oder Top-Leiste „Coaching starten“ |
| **Masterclasses** | Masterclasses | **Bildung:** Video-Masterclasses (z. B. Schlaf) mit Kapiteln, Fortschrittsanzeige, „Coming soon“ für weitere (Ernährung, Bewegung). Zeigt Lernangebot. | Sidebar → **Masterclasses** |
| **Watchlist** | Blackboard | **Wissen & Events:** Wissenschaftliche News (Studien), Events (Webinare, Workshops), Experten-Updates. Zeigt Informations- und Event-Hub. | Sidebar → **Watchlist** |
| **Apps** | Micro-Habit-Apps | **Mini-Apps:** Breath, Meditation, Brain mit Stats, Sessions, Streaks. Zeigt integrierte Gewohnheits-Apps. | Sidebar → **Apps** |
| **Reports** | Reports | **Auswertungen:** Monatsreporte mit Health-Score, Kennzahlen (Schlaf, Schritte, HRV, Stress), Next Best Actions, Highlights/Blocker. Zeigt datenbasierte Rückmeldung. | Sidebar → **Reports** oder Top-Leiste „Plan für heute“ |
| **Community** | Community | **Gemeinschaft:** True-Years-Prinzipien (z. B. Verantwortung, Weitsicht, Gemeinschaft), Ranking, Experimente (z. B. Koffein-Cutoff, Protein-Frühstück), Challenges. Zeigt Vernetzung und Prinzipien. | Sidebar → **Community** |

### 3.2 Bereich „02 LAB“ (Aufklappbar)

| Menüpunkt | Seite / Inhalt | Was die Seite darstellt | Klickpfad |
|-----------|----------------|-------------------------|-----------|
| **Analyse Zellstatus** | Zellalter-Check | **Produktseite:** Analyse des biologischen Alters (Epi-Proteomics), Alterungsgeschwindigkeit, Hallmarks of Aging. Anbieter: Moleqlar. CTA „Mehr erfahren“ (extern). | Sidebar → **02 LAB** öffnen → **Analyse Zellstatus** |
| **Analyse Longevity Balance** | Longevity-Balance-Check | **Produktseite:** Ganzheitliche Stoffwechselanalyse (250+ Biomarker), 10 Systeme/Organe mit Ampelfarben. Anbieter: Lifespin (MetaboPRO). CTA „Mehr erfahren“ (extern). | Sidebar → **02 LAB** → **Analyse Longevity Balance** |
| **Integration in Starter** | Platzhalter | Kurzer Text: „Integration in Starter-Bereich“. | Sidebar → **02 LAB** → **Integration in Starter** |
| **Expertengespräch** | Expertengespräch | Platzhalter: „Expertengespräch“ mit „Inhalt folgt…“. | Sidebar → **02 LAB** → **Expertengespräch** |

*Hinweis:* Unter LAB gibt es in der App-Logik noch **Metabo** und **ProteoAge** (Platzhalter-Seiten); diese sind in der Sidebar nicht sichtbar, können aber technisch ansteuerbar sein.

### 3.3 Bereich „03 SHOP“ (Aufklappbar)

| Menüpunkt | Seite / Inhalt | Was die Seite darstellt | Klickpfad |
|-----------|----------------|-------------------------|-----------|
| **Daily Essentials** | Shop (Kategorie) | Shop-Übersicht mit Kategorie „Daily Essentials“. | Sidebar → **03 SHOP** → **Daily Essentials** |
| **Performance** | Shop (Kategorie) | Shop-Übersicht „Performance“. | Sidebar → **03 SHOP** → **Performance** |
| **Recovery** | Shop (Kategorie) | Shop-Übersicht „Recovery“. | Sidebar → **03 SHOP** → **Recovery** |
| **Beauty** | Shop (Kategorie) | Shop-Übersicht „Beauty“. | Sidebar → **03 SHOP** → **Beauty** |
| **Tech** | Shop (Kategorie) | Shop-Übersicht „Tech“. | Sidebar → **03 SHOP** → **Tech** |

**Shop-Inhalt:** Kategorie-Header (Titel, Untertitel, Beschreibung); Produktlisten sind als „Produkte werden geladen…“ angedeutet. Weitere Kategorien (z. B. Supplements, Pflege, Regeneration, Technologie) sind im Code vorhanden und können je nach Konfiguration erscheinen.

### 3.4 Bereich „04 EINSTELLUNGEN“ (Aufklappbar)

| Menüpunkt | Seite / Inhalt | Was die Seite darstellt | Klickpfad |
|-----------|----------------|-------------------------|-----------|
| **Einstellungen (Hauptseite)** | Settings | **Zentrale Einstellungen:** Benachrichtigungen (App, E-Mail, wöchentlich), Sichtbarkeit/ Datenaustausch, Sprache, Theme, Wearables (Apple Watch, Fitbit, Garmin, Oura, Auto-Sync), Einheiten, Profildaten, Zahlung/Abos. | Sidebar → **04 EINSTELLUNGEN** → ein beliebiger Unterpunkt **oder** direkter Aufruf **Einstellungen** (wenn als eigener Eintrag vorhanden). |
| **Abos und Profil** | Platzhalter | Text: „Abos und Profil“. | Sidebar → **04 EINSTELLUNGEN** → **Abos und Profil** |
| **Ziele & Präferenzen** | Platzhalter | Text: „Ziele & Präferenzen“. | Sidebar → **04 EINSTELLUNGEN** → **Ziele & Präferenzen** |
| **Benachrichtigungen** | Platzhalter | Text: „Benachrichtigungen“. | Sidebar → **04 EINSTELLUNGEN** → **Benachrichtigungen** |
| **Tracking & Metriken** | Platzhalter | Text: „Tracking & Metriken“. | Sidebar → **04 EINSTELLUNGEN** → **Tracking & Metriken** |
| **Datenschutz & Sicherheit** | Platzhalter | Text: „Datenschutz & Sicherheit“. | Sidebar → **04 EINSTELLUNGEN** → **Datenschutz & Sicherheit** |
| **Hilfe & Rechtliches** | Platzhalter | Text: „Hilfe & Rechtliches“. | Sidebar → **04 EINSTELLUNGEN** → **Hilfe & Rechtliches** |

*Hinweis:* Die **vollständige Einstellungsseite** (mit allen Toggles und Optionen) wird über den Menüpunkt **Einstellungen** geladen (sofern in der Sidebar geführt); die einzelnen Unterpunkte (Abos, Ziele, …) zeigen derzeit nur Platzhalter.

---

## 4. Empfohlene Klickpfade für die Marktforschung

### Szenario A: „Erster Eindruck & Orientierung“
- **Start:** App öffnen → **Dashboard (Vogelperspektive)** ist Standard.
- **Zeigen:** Blüte mit 10 Kategorien, Scores, empfohlene Aktionen.
- **Optional:** Sidebar **01 STARTER** kurz durchgehen (alle 8 Punkte nennen), ohne jeden anzuklicken.

**Nutzen:** Proband versteht, dass die App eine übergreifende Longevity-Übersicht bietet.

---

### Szenario B: „Tagesablauf – Plan & Coaching“
1. **Start:** Dashboard.
2. **Klick:** Top-Leiste **„Plan für heute“** → **Reports** (Monatsreport, Kennzahlen, Next Best Actions).
3. **Klick:** Top-Leiste **„Coaching starten“** → **Coaching** (Lisa AI, Themen, Chat/Sprache).

**Nutzen:** Zeigt die zwei Haupt-Einstiege für Alltagsnutzung: datengetriebener Plan und persönliches Coaching.

---

### Szenario C: „Journey & Gamification“
1. **Start:** Dashboard.
2. **Klick:** Sidebar **Journey**.
3. **Zeigen:** 7 Level, Score, Leaderboard, Achievements, Streaks.

**Nutzen:** Zeigt Motivation, Vergleich und spielerische Elemente.

---

### Szenario D: „Lernen & Wissen“
1. **Start:** Dashboard.
2. **Klick:** Sidebar **Masterclasses** → Kapitel einer Masterclass (z. B. Schlaf).
3. **Klick:** Sidebar **Watchlist** → Wissenschaft, Events, Experten.

**Nutzen:** Zeigt Bildungs- und Informationsangebot.

---

### Szenario E: „Gewohnheiten & Community“
1. **Start:** Dashboard.
2. **Klick:** Sidebar **Apps** → Breath/Meditation/Brain mit Stats.
3. **Klick:** Sidebar **Community** → Prinzipien, Ranking, Experimente, Challenges.

**Nutzen:** Zeigt Mikro-Apps und soziale/experimentelle Seite.

---

### Szenario F: „Lab & Biomarker-Produkte“
1. **Start:** Dashboard.
2. **Klick:** Sidebar **02 LAB** aufklappen.
3. **Klick:** **Analyse Zellstatus** (Moleqlar) → Inhalt + CTA.
4. **Klick:** **Analyse Longevity Balance** (Lifespin) → Inhalt + CTA.

**Nutzen:** Zeigt Verknüpfung von App mit externen Lab-/Biomarker-Anbietern.

---

### Szenario G: „Shop & Einstellungen“
1. **Start:** Dashboard.
2. **Klick:** Sidebar **03 SHOP** aufklappen → eine Kategorie (z. B. **Tech** oder **Recovery**).
3. **Klick:** Sidebar **04 EINSTELLUNGEN** aufklappen → **Einstellungen** (vollständige Seite mit Toggles, Wearables, Profil, Zahlung).

**Nutzen:** Zeigt Commerce und Kontrolle über Daten/Benachrichtigungen/Geräte.

---

## 5. Kurz-Checkliste für Marktforscher

- [ ] **Dashboard (Vogelperspektive)** als Start erklärt und gezeigt.
- [ ] **Top-Leiste:** „Plan für heute“ → Reports und „Coaching starten“ → Coaching einmal durchgespielt.
- [ ] **Starter:** Mindestens Journey, Coaching, Reports, Community gezeigt.
- [ ] **LAB:** Beide Check-Seiten (Zellstatus, Longevity Balance) gezeigt.
- [ ] **SHOP:** Mindestens eine Kategorie geöffnet.
- [ ] **Einstellungen:** Vollständige Einstellungsseite (Benachrichtigungen, Wearables, Profil) gezeigt.
- [ ] Klar gemacht: Alle „Seiten“ sind **eine App**; Wechsel nur über Sidebar/Top-Buttons, keine URL-Änderung.

---

## 6. Technische Hinweise

- **Single-Page-App:** Zustand wird über `activeMenuItem` gesteuert; es gibt keine eigenen Routen (z. B. `/reports`).
- **Platzhalter:** Datenintegration, Expertengespräch, Integration in Starter sowie einige Einstellungs-Unterpunkte zeigen nur Kurztexte.
- **Externe Links:** Auf den LAB-Check-Seiten führen „Mehr erfahren“-Buttons zu moleqlar.com bzw. lifespin.health.

---

*Stand: Februar 2025 – basierend auf der aktuellen Codebasis des Longevity-Dashboards (Next.js).*
