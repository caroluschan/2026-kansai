# AGENTS.md — Kansai Tourist Guide PWA

## Project Overview
A Progressive Web App (PWA) tourist guide for Kansai, Japan (Wakayama, Nara, Kyoto, Osaka, Sakai). Deployed to GitHub Pages via `docs/`.

## Architecture

### Tech Stack
- **Framework**: Vite 6 + React 19 + TypeScript
- **Map**: Leaflet 1.9.4 with OpenStreetMap tiles
- **i18n**: i18next 24 + react-i18next + browser language detection
- **Storage**: Dexie.js 4 (IndexedDB wrapper) for user favorites
- **CSS**: Tailwind CSS 4
- **PWA**: vite-plugin-pwa with Workbox

### Data Flow
```
resource/kansai_trip_dataset_2026-11_KIX.json (source of truth)
  → bundled into app at build time
  → app reads as static data
  → user favorites stored in IndexedDB (browser-local)
```

### Directory Structure
```
/
├── AGENTS.md                    # This file
├── .gitignore
├── resource/
│   └── kansai_trip_dataset_2026-11_KIX.json   # Trip data (5 regions, 6 categories, ~160 locations)
├── src/                         # React app source
│   ├── components/              # React components
│   ├── locales/                 # i18n translation files (en.json, zh-TW.json, ja.json)
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utilities, DB, data helpers
│   ├── types/                   # TypeScript type definitions
│   ├── App.tsx                  # Root component
│   └── main.tsx                 # Entry point
├── docs/                        # Built output for GitHub Pages
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── index.html
└── package.json
```

### Key Features
1. **Multi-language**: Traditional Chinese (zh-TW), English (en), Japanese (ja)
2. **List View**: Filterable by region, category, search text; star/unstar locations
3. **Map View**: Leaflet map with category-colored pins, starred indicators, layer toggles
4. **Location Detail**: Full info display + Google Maps link
5. **Favorites**: Star locations saved to IndexedDB, shortlist filter in both views
6. **PWA**: Offline-capable, installable

### Conventions
- Components: PascalCase (`LocationCard.tsx`)
- Hooks: camelCase with `use` prefix (`useFavorites.ts`)
- Utils: camelCase (`filterLocations.ts`)
- i18n keys: dot-separated namespaces (`nav.listView`, `filter.category`)
- All data types defined in `src/types/`

### Categories (from JSON)
- `restaurants` — Dining spots
- `theme_parks` — Amusement/theme parks
- `zoos` — Zoos, aquariums, animal attractions
- `malls` — Shopping malls, department stores
- `cafes` — Coffee shops, specialty cafes
- `tourist_spots` — Sightseeing, landmarks, activities

### Regions
- Wakayama, Nara, Kyoto, Osaka, Sakai
