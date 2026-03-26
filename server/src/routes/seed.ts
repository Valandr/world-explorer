import { Router } from 'express';
import { getDb } from '../db/connection.js';
import { importData } from '../services/import.js';

const router = Router();

router.post('/seed', async (req, res) => {
  const secret = req.headers['x-seed-secret'];
  if (!secret || secret !== process.env.SEED_SECRET) {
    res.status(403).json({ error: 'Invalid seed secret' });
    return;
  }

  const geonamesUsername = process.env.GEONAMES_USERNAME;
  if (!geonamesUsername) {
    res.status(500).json({ error: 'GEONAMES_USERNAME not configured' });
    return;
  }

  try {
    const db = getDb();
    await importData(db, geonamesUsername);
    const count = (db.prepare('SELECT COUNT(*) as count FROM countries').get() as { count: number })
      .count;
    res.json({ message: 'Seed complete', countries: count });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ error: 'Seed failed', details: String(err) });
  }
});

export default router;
