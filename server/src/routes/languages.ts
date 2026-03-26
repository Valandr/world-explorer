import { Router } from 'express';
import { getDb } from '../db/connection.js';

const router = Router();

router.get('/languages', (_req, res) => {
  const db = getDb();
  const languages = db.prepare('SELECT * FROM languages ORDER BY name').all();
  res.json(languages);
});

export default router;
