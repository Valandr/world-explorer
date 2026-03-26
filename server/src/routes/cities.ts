import { Router } from 'express';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/cities', (req, res) => {
  const db = getDb();
  const { country, is_capital } = req.query;

  let sql = `
    SELECT ci.*, co.name as country_name, co.code_alpha2 as country_code
    FROM cities ci
    JOIN countries co ON co.id = ci.country_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (country) {
    sql += ' AND (co.code_alpha2 = ? OR co.code_alpha3 = ?)';
    params.push(String(country), String(country));
  }

  if (is_capital !== undefined) {
    sql += ' AND ci.is_capital = ?';
    params.push(Number(is_capital));
  }

  sql += ' ORDER BY ci.population DESC NULLS LAST';

  const cities = db.prepare(sql).all(...params);
  res.json(cities);
});

export default router;
