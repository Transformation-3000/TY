# Longevity Dashboard - Next.js

Modernes Longevity Dashboard, migriert von HTML/CSS/JS zu Next.js mit TypeScript.

## Features

- ✅ Next.js 16 mit App Router
- ✅ TypeScript
- ✅ Chart.js Integration
- ✅ Bootstrap Icons
- ✅ Responsive Design
- ✅ Komponentenbasierte Architektur

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

## Online Prototyp

Der Prototyp ist live unter folgender URL erreichbar:
👉 [https://trueyears-dashboard-app.vercel.app](https://trueyears-dashboard-app.vercel.app)


### Passwortschutz (optional)

Das Dashboard kann mit einem gemeinsamen Passwort geschützt werden:

1. Datei `.env.local` im Projektroot anlegen (oder `.env`).
2. Variable setzen: `LONGIVITY_DASHBOARD_PASSWORD=dein-passwort`
3. Server neu starten. Beim Aufruf der App erscheint die Login-Seite; nach korrektem Passwort bleibt der Zugriff 7 Tage gültig (Cookie).

Ohne gesetzte Variable ist die App ohne Passwort erreichbar (z. B. für lokale Entwicklung).

## Projektstruktur

```
longevity-dashboard-nextjs/
├── app/
│   ├── layout.tsx          # Root Layout
│   ├── page.tsx            # Hauptseite
│   └── globals.css         # Globale Styles
├── components/
│   ├── layout/             # Layout-Komponenten
│   │   ├── WelcomeSection.tsx
│   │   ├── Sidebar.tsx
│   │   └── WeeklyPlan.tsx
│   └── dashboard/          # Dashboard-Komponenten
│       ├── DashboardTabs.tsx
│       └── SleepCard.tsx
├── lib/
│   └── chartConfig.ts      # Chart.js Konfiguration
└── public/
    └── images/             # Statische Assets
```

## Nächste Schritte

- [ ] Weitere Dashboard-Kacheln hinzufügen (Recovery Score, Tagesschritte, Ernährung, Fitness, Mentale Gesundheit)
- [ ] Biomarker-Dashboard-Komponenten
- [ ] Modals für AI-Chat und Feedback
- [ ] Weitere Chart-Typen implementieren

## Technologien

- Next.js 16
- React 19
- TypeScript
- Chart.js
- Bootstrap Icons
- Tailwind CSS (optional)
