# InstaCare

> Real-time ER wait time prediction to help patients get seen faster when every minute matters.

![InstaCare hero preview](public/placeholder.svg)

## Highlights

- **🏆 Hackathon-winning prototype** built in 48 hours with clinicians and first responders.
- **⏱️ Context-aware wait-time predictions** combining curated datasets with dynamic factors and user reports.
- **🗺️ Location-aware experience** that surfaces nearby hospitals with map-based visualization.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Data Pipeline](#data-pipeline)
- [Architecture](#architecture)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## Overview

Emergency rooms are overwhelmed and patients often face hours-long waits without knowing faster options nearby. `InstaCare` ships with curated hospital datasets, factors in contextual signals, and lets the community submit updates so families can choose the quickest path to care.

The project took home first place at a regional health-tech hackathon thanks to its patient-centered UX and practical data strategy. Work continues to evolve the prototype using the same data sources included in this repository.

## Features

- **Predictive wait times:** Combines historical wait-time aggregates with contextual adjustments (traffic, weather, local events) to surface estimates for each facility.
- **Confidence-aware UI:** Displays confidence scores and factors behind every prediction so medical staff can validate assumptions quickly.
- **Interactive map:** Renders nearby ERs on Google Maps with color-coded wait-time markers and routing shortcuts.
- **Crowdsourced verification:** Lets patients anonymously submit actual wait experiences to continuously improve accuracy.
- **Accessibility-first design:** Built with responsive layouts, keyboard navigation, and mindful color contrast for critical scenarios.

## Live Demo

- **URL:** https://instant-waitwise.vercel.app/

If you want a private walkthrough or demo credentials, feel free to reach out via Issues or the contact email below.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript + React 18
- **UI Toolkit:** Tailwind CSS, shadcn/ui, Radix UI, lucide-react
- **State/Data:** TanStack Query, React Hook Form, Zod
- **Maps & Geolocation:** Google Maps JavaScript API

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (or pnpm/bun if you prefer)
- Google Maps JavaScript API key with Maps JavaScript enabled

### Installation

```bash
git clone https://github.com/<your-org>/InstaCare.git
cd InstaCare
npm install
npm run dev
```

Visit `http://localhost:3000` to explore the app.

## Environment Variables

Create a `.env.local` file in the project root and set the required keys:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

If you are contributing additional APIs or analytics, document them here as well.

## Data & Scripts

The app serves hospital estimates from JSON files in `data/`, backed by the CSV datasets checked into the repo. To regenerate the real-data aggregates:

```bash
npm run process-real-data
```

This executes `src/scripts/processRealERData.ts`, reading `Real ER Wait Time Dataset.csv` and writing updated `real-processed-visits.json` and `real-hospital-features.json`. Predictions merge those outputs with the synthetic set in `hospital-features.json`, and user feedback is persisted to `data/feedback.json` via the `/api/feedback` route.

## Architecture

```
src/
├─ app/
│  ├─ page.tsx               # Marketing landing page
│  ├─ hospitals/             # Interactive hospital finder + map
│  └─ report/                # Crowdsourced feedback form
├─ components/               # Reusable UI primitives and feature blocks
├─ lib/                      # Data utilities (formatters, helpers)
├─ utils/                    # Client-side helpers (e.g., location)
└─ scripts/                  # Data ingestion + transformation scripts
```

Predictions are currently generated client-side from seeded data, but the interfaces are designed to plug into a live inference API.

## Roadmap

- Integrate live feeds from participating hospital systems
- Deploy the prediction service as a serverless API endpoint
- Add SMS/email alerts for status changes
- Launch pilot programs with EMS partners for field testing

## Contributing

Community contributions are welcome. Please:

- Fork the repo and create a feature branch.
- Add or update tests where relevant.
- Run `npm run lint` before opening a pull request.
- Describe the motivation and UX impact of your change.

## Acknowledgements

- Hackathon organizers and mentors who helped shape the original product vision.
- Open-source maintainers behind the libraries that power InstaCare.

---

Want to collaborate or explore partnerships? Open an issue or email the maintainers at `team@instacare.health`.
