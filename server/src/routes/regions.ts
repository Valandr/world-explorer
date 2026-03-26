import { Router } from 'express';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/regions', (_req, res) => {
  const db = getDb();
  const regions = db
    .prepare(
      `SELECT r.*, c.name as continent_name
       FROM regions r
       JOIN continents c ON c.id = r.continent_id
       ORDER BY r.name`,
    )
    .all();
  res.json(regions);
});

export default router;
