# WorldExplorer — Design Specification

**Date:** 2026-03-26
**Status:** Approved

## 1. Overview

WorldExplorer is a pedagogical web application for learning world geography through interactive quizzes and an explorable map. It covers countries, capitals, cities, regions, continents, population, languages (1-10 per country), and country specialties.

## 2. Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vite + React 18 + TypeScript + shadcn/ui |
| Map | Leaflet + react-leaflet |
| Animations | canvas-confetti |
| Backend | Express.js + TypeScript |
| Database | SQLite via better-sqlite3 |
| Data sources | REST Countries API + GeoNames API |
| Testing | Vitest + @testing-library/react + supertest |
| Linting | ESLint + Prettier |
| Git hooks | Husky + lint-staged |
| CI | GitHub Actions |
| Deployment | Docker (multi-stage) + docker-compose |

## 3. Architecture

Monorepo with `client/` and `server/` directories. In production, Express serves the Vite build from `client/dist/` and the API under `/api`. Single Docker container.

### 3.1 Directory Structure

```
world-explorer/
├── client/
│   ├── public/
│   │   └── sounds/                # Success sound (.mp3)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui (auto-generated)
│   │   │   ├── map/               # WorldMap, CountryLayer, MapFilters, CountryPopup
│   │   │   ├── quiz/              # QuizSetup, McqQuestion, LocateQuestion, QuizProgress, QuizFeedback, QuizResults
│   │   │   └── layout/            # AppLayout, Navbar, Sidebar
│   │   ├── hooks/                 # useQuiz, useProgress, useSound, useCountries, useConfetti
│   │   ├── lib/                   # utils, api client, constants
│   │   ├── pages/                 # Home, Explorer, Quiz, QuizPlay, Results
│   │   ├── types/
│   │   ├── __tests__/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
├── server/
│   ├── src/
│   │   ├── routes/                # countries, cities, quiz, seed, health
│   │   ├── services/              # import service (REST Countries + GeoNames)
│   │   ├── db/
│   │   │   ├── schema.sql
│   │   │   ├── seed.ts
│   │   │   └── connection.ts
│   │   ├── __tests__/
│   │   ├── types/
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
├── docker/
│   ├── Dockerfile
│   └── .dockerignore
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── .husky/
│   └── pre-commit
├── .lintstagedrc.json
├── package.json               # Root — husky, lint-staged, shared scripts
├── tsconfig.base.json
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## 4. Data Model

```sql
CREATE TABLE continents (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE,
  code  TEXT NOT NULL UNIQUE
);

CREATE TABLE regions (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  continent_id  INTEGER NOT NULL REFERENCES continents(id)
);

CREATE TABLE countries (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL,
  official_name TEXT,
  code_alpha2   TEXT NOT NULL UNIQUE,
  code_alpha3   TEXT NOT NULL UNIQUE,
  capital       TEXT,
  population    INTEGER,
  area          REAL,
  flag_emoji    TEXT,
  flag_url      TEXT,
  lat           REAL,
  lng           REAL,
  region_id     INTEGER REFERENCES regions(id),
  specialty     TEXT
);

CREATE TABLE languages (
  id    INTEGER PRIMARY KEY,
  name  TEXT NOT NULL,
  code  TEXT NOT NULL UNIQUE
);

CREATE TABLE country_languages (
  country_id   INTEGER NOT NULL REFERENCES countries(id),
  language_id  INTEGER NOT NULL REFERENCES languages(id),
  PRIMARY KEY (country_id, language_id)
);

CREATE TABLE cities (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL,
  population  INTEGER,
  lat         REAL,
  lng         REAL,
  country_id  INTEGER NOT NULL REFERENCES countries(id),
  is_capital  INTEGER DEFAULT 0
);
```

### Key decisions:
- Many-to-many for languages via pivot table `country_languages`
- `is_capital` on cities avoids data duplication
- `lat/lng` on countries and cities enables locate quizzes
- `specialty` as free text — extensible to a separate table later

## 5. API

**Base URL:** `/api`

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/countries` | List countries (filters: continent, region, language, search) |
| GET | `/api/countries/:code` | Country detail + languages + cities |
| GET | `/api/cities` | List cities (filters: country, is_capital) |
| GET | `/api/continents` | List continents |
| GET | `/api/regions` | List regions |
| GET | `/api/languages` | List languages |
| GET | `/api/quiz/generate` | Generate quiz (params: type, category, continent, count) |
| POST | `/api/seed` | Trigger data import (protected by SEED_SECRET header) |
| GET | `/api/health` | Health check |

### Quiz types
- **mcq** — Multiple choice, 4 options, 1 correct
- **locate** — Click on map within tolerance radius

### Quiz categories
- capital, country, flag, population, language

### MCQ response format
```json
{
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "category": "capital",
      "question": "Quelle est la capitale de la France ?",
      "choices": ["Paris", "Lyon", "Berlin", "Madrid"],
      "correctIndex": 0,
      "countryCode": "FR"
    }
  ]
}
```

### Locate response format
```json
{
  "questions": [
    {
      "id": 1,
      "type": "locate",
      "category": "country",
      "question": "Ou se trouve le Bresil ?",
      "answer": { "lat": -14.24, "lng": -51.93, "name": "Brazil" },
      "toleranceKm": 500
    }
  ]
}
```

## 6. Frontend

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page, quick access to quiz and map |
| `/explorer` | Explorer | Interactive map + info panel + visual filters |
| `/quiz` | Quiz | Quiz setup (type, category, continent, count) |
| `/quiz/:id` | QuizPlay | Active quiz (MCQ or locate) |
| `/results` | Results | Score, answer recap, confetti on good score |

### Key components

**Map:**
- `WorldMap` — Leaflet map with click events
- `CountryLayer` — GeoJSON layer colored by active filter
- `MapFilters` — continent/population/language selectors
- `CountryPopup` — hover tooltip (name + flag)

**Quiz:**
- `QuizSetup` — type, category, continent, count selection
- `McqQuestion` — question + 4 answer buttons
- `LocateQuestion` — question + clickable map
- `QuizProgress` — progress bar (shadcn Progress)
- `QuizFeedback` — green/red visual + confetti + sound
- `QuizResults` — final score, answer detail, restart button

**Shared:**
- `CountryCard` — country summary card
- `LanguageBadge` — language badge

### Hooks
- `useQuiz` — quiz state, navigation, scoring, answer checking
- `useProgress` — localStorage read/write (scores, completed quizzes)
- `useSound` — plays success sound
- `useCountries` — fetch + cache country data from API
- `useConfetti` — triggers confetti animation

### Frontend libraries
- `react-leaflet` — interactive map
- `canvas-confetti` — confetti animation
- `react-router-dom` — routing
- shadcn/ui components: Button, Card, Progress, Select, Slider, Badge, Dialog, Tabs

## 7. User progression

Stored in localStorage (no authentication):
- Quiz scores history
- Completed quizzes
- Best scores per category

## 8. DevOps

### Docker
- **Multi-stage Dockerfile:** deps → build → production (Node alpine)
- **docker-compose.yml (dev):** volume mounts, hot-reload, ports 3000 + 5173
- **docker-compose.prod.yml:** single container, port 80, restart unless-stopped, healthcheck

### Environments

| File | Purpose | Committed |
|------|---------|-----------|
| `.env.example` | Template with placeholders | Yes |
| `.env.development` | Local dev | No |
| `.env.preproduction` | Staging VPS | No |
| `.env.production` | Production VPS | No |

### Environment variables
```
NODE_ENV=development|preproduction|production
PORT=3000
GEONAMES_USERNAME=your_username
SEED_SECRET=your_secret
CLIENT_URL=http://localhost:5173
```

### GitHub Actions CI (`.github/workflows/ci.yml`)
- **Triggers:** push to main/develop, pull requests
- **Jobs:** lint → typecheck → test → build (+ Docker build verification)

### Deployment (VPS OVH)
- SSH + Docker Compose
- `docker compose -f docker-compose.prod.yml up -d --build`
- Healthcheck on `/api/health`

## 9. Security

- `.env.*` files never committed (only `.env.example`)
- SQLite database files in `.gitignore`
- `SEED_SECRET` header required for import endpoint
- No user authentication (localStorage only) — no sensitive data stored server-side

## 10. Testing

### Backend (Vitest + supertest)
- Route tests: HTTP endpoints with simulated requests
- Service tests: data transformation from REST Countries / GeoNames
- DB tests: SQL queries with in-memory SQLite (`:memory:`)

### Frontend (Vitest + Testing Library)
- Component tests: quiz rendering, answer selection, feedback display
- Map components: info panel, filter changes
- Hook tests: `useQuiz`, `useProgress`
