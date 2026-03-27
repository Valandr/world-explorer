import { Router } from 'express';
import { getDb } from '../db/connection.js';
import type { Country, McqQuestion, LocateQuestion } from '../types/index.js';

const router = Router();

router.get('/quiz/generate', (req, res) => {
  const db = getDb();
  const { type = 'mcq', category = 'capital', continent, count = '10' } = req.query;
  const numQuestions = Math.min(Math.max(parseInt(String(count), 10) || 10, 1), 50);

  let countrySql = `
    SELECT co.*, ct.name as continent_name
    FROM countries co
    LEFT JOIN regions r ON r.id = co.region_id
    LEFT JOIN continents ct ON ct.id = r.continent_id
    WHERE co.capital IS NOT NULL AND co.lat IS NOT NULL
  `;
  const params: string[] = [];

  if (continent) {
    countrySql += ' AND ct.name = ?';
    params.push(String(continent));
  }

  countrySql += ' ORDER BY RANDOM()';

  const allCountries = db.prepare(countrySql).all(...params) as (Country & {
    continent_name: string;
  })[];

  if (allCountries.length < 4) {
    res.status(400).json({ error: 'Not enough countries for quiz' });
    return;
  }

  const selected = allCountries.slice(0, numQuestions);

  if (type === 'locate') {
    const questions: LocateQuestion[] = selected.map((c, i) => ({
      id: i + 1,
      type: 'locate',
      category: String(category),
      question: buildLocateQuestion(String(category), c),
      answer: { lat: c.lat!, lng: c.lng!, name: c.name },
      toleranceKm: getToleranceKm(c.area),
    }));
    res.json({ questions });
    return;
  }

  const questions: McqQuestion[] = selected.map((country, i) => {
    const others = allCountries.filter((c) => c.id !== country.id);
    const distractors = shuffle(others).slice(0, 3);
    const { question, correct, wrong, flagUrl } = buildMcqQuestion(
      String(category),
      country,
      distractors,
      db,
    );
    const choices = shuffle([correct, ...wrong]);
    return {
      id: i + 1,
      type: 'mcq' as const,
      category: String(category),
      question,
      choices,
      correctIndex: choices.indexOf(correct),
      countryCode: country.code_alpha2,
      ...(flagUrl && { flagUrl }),
    };
  });

  res.json({ questions });
});

function buildLocateQuestion(category: string, country: Country & { continent_name: string }): string {
  switch (category) {
    case 'capital':
      return `Où se trouve ${country.capital} ?`;
    default:
      return `Où se trouve ${country.name} ?`;
  }
}

function buildMcqQuestion(
  category: string,
  country: Country & { continent_name: string },
  distractors: (Country & { continent_name: string })[],
  db: ReturnType<typeof getDb>,
): { question: string; correct: string; wrong: string[]; flagUrl?: string | null } {
  switch (category) {
    case 'capital':
      return {
        question: `Quelle est la capitale de ${country.name} ?`,
        correct: country.capital!,
        wrong: distractors.map((d) => d.capital!).filter(Boolean),
      };
    case 'country':
      return {
        question: `De quel pays ${country.capital} est-elle la capitale ?`,
        correct: country.name,
        wrong: distractors.map((d) => d.name),
      };
    case 'flag':
      return {
        question: 'À quel pays appartient ce drapeau ?',
        correct: country.name,
        wrong: distractors.map((d) => d.name),
        flagUrl: country.flag_url,
      };
    case 'population': {
      const format = (n: number | null) =>
        n ? new Intl.NumberFormat('fr-FR').format(n) : '?';
      return {
        question: `Quelle est la population approximative de ${country.name} ?`,
        correct: format(country.population),
        wrong: distractors.map((d) => format(d.population)),
      };
    }
    case 'language': {
      const langs = db
        .prepare(
          `SELECT l.name FROM languages l
           JOIN country_languages cl ON cl.language_id = l.id
           WHERE cl.country_id = ?`,
        )
        .all(country.id) as { name: string }[];
      const mainLang = langs[0]?.name ?? 'Inconnu';
      const wrongLangs = db
        .prepare('SELECT name FROM languages ORDER BY RANDOM() LIMIT 3')
        .all() as { name: string }[];
      return {
        question: `Quelle langue est parlée en ${country.name} ?`,
        correct: mainLang,
        wrong: wrongLangs.map((l) => l.name).filter((n) => n !== mainLang),
      };
    }
    default:
      return {
        question: `Quelle est la capitale de ${country.name} ?`,
        correct: country.capital!,
        wrong: distractors.map((d) => d.capital!).filter(Boolean),
      };
  }
}

function getToleranceKm(area: number | null): number {
  if (!area) return 500;
  if (area > 1_000_000) return 800;
  if (area > 100_000) return 500;
  if (area > 10_000) return 200;
  return 100;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default router;
