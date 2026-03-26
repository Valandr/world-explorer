import { Router } from 'express';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/continents', (_req, res) => {
  const db = getDb();
  const continents = db.prepare('SELECT * FROM continents ORDER BY name').all();
  res.json(continents);
});

export default router;
