# WorldExplorer

Application web de geographie interactive : explorez le monde sur une carte et testez vos connaissances avec des quiz.

## Fonctionnalites

- **Carte interactive** — Parcourez continents, pays et villes avec Leaflet et le clustering
- **Quiz** — QCM ou localisation sur la carte, par categorie (capitales, drapeaux, langues, population) et par continent
- **Suivi de progression** — Scores enregistres et confettis pour les bons resultats

## Stack technique

| Couche  | Technologies                                |
| ------- | ------------------------------------------- |
| Client  | React 18, Vite, Tailwind CSS, React-Leaflet |
| Serveur | Express, SQLite (better-sqlite3)            |
| Commun  | TypeScript, Vitest                          |

## Demarrage rapide

### Avec Docker (recommande)

```bash
cp .env.example .env
make dev
```

### Sans Docker

```bash
cp .env.example .env
npm install
npm run dev
```

Le client demarre sur `http://localhost:5173` et l'API sur `http://localhost:3000`.

## Commandes utiles

```bash
npm run dev          # Client + serveur en parallele
npm run lint         # ESLint
npm run typecheck    # Verification TypeScript
npm test             # Tests unitaires
make dev-build       # Docker avec rebuild des images
make prod            # Production Docker
```

## Structure

```
server/    API REST Express + SQLite (routes, services, db)
client/    SPA React (pages, composants, hooks)
docker/    Dockerfile multi-stage
```
