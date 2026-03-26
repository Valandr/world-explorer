import { Router } from 'express';
import { getDb } from '../db/connection.js';
import type { Country, Language, City } from '../types/index.js';

const router = Router();

router.get('/countries', (req, res) => {
  const db = getDb();
  const { continent, region, language, search } = req.query;

  let sql = `
    SELECT DISTINCT co.*,
      r.name as region_name,
      ct.name as continent_name
    FROM countries co
    LEFT JOIN regions r ON r.id = co.region_id
    LEFT JOIN continents ct ON ct.id = r.continent_id
  `;
  const joins: string[] = [];
  const conditions: string[] = [];
  const params: string[] = [];

  if (language) {
    joins.push(
      'JOIN country_languages cl ON cl.country_id = co.id JOIN languages l ON l.id = cl.language_id',
    );
    conditions.push('(l.code = ? OR l.name = ?)');
    params.push(String(language), String(language));
  }

  if (continent) {
    conditions.push('ct.name = ?');
    params.push(String(continent));
  }

  if (region) {
    conditions.push('r.name = ?');
    params.push(String(region));
  }

  if (search) {
    conditions.push('(co.name LIKE ? OR co.official_name LIKE ? OR co.capital LIKE ?)');
    const term = `%${String(search)}%`;
    params.push(term, term, term);
  }

  if (joins.length) sql += ' ' + joins.join(' ');
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY co.name';

  const countries = db.prepare(sql).all(...params);
  res.json(countries);
});

router.get('/countries/:code', (req, res) => {
  const db = getDb();
  const { code } = req.params;

  const country = db
    .prepare(
      `SELECT co.*,
        r.name as region_name,
        ct.name as continent_name
      FROM countries co
      LEFT JOIN regions r ON r.id = co.region_id
      LEFT JOIN continents ct ON ct.id = r.continent_id
      WHERE co.code_alpha2 = ? OR co.code_alpha3 = ?`,
    )
    .get(code.toUpperCase(), code.toUpperCase()) as (Country & { region_name: string; continent_name: string }) | undefined;

  if (!country) {
    res.status(404).json({ error: 'Country not found' });
    return;
  }

  const languages = db
    .prepare(
      `SELECT l.* FROM languages l
       JOIN country_languages cl ON cl.language_id = l.id
       WHERE cl.country_id = ?`,
    )
    .all(country.id) as Language[];

  const cities = db
    .prepare('SELECT * FROM cities WHERE country_id = ? ORDER BY is_capital DESC, population DESC')
    .all(country.id) as City[];

  res.json({
    ...country,
    continent: country.continent_name,
    region: country.region_name,
    languages,
    cities,
  });
});

export default router;
