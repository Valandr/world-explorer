import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

import healthRouter from './routes/health.js';
import continentsRouter from './routes/continents.js';
import regionsRouter from './routes/regions.js';
import languagesRouter from './routes/languages.js';
import countriesRouter from './routes/countries.js';
import citiesRouter from './routes/cities.js';
import quizRouter from './routes/quiz.js';
import seedRouter from './routes/seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Ensure data directory exists
const dataDir = join(__dirname, '..', 'data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// API routes
app.use('/api', healthRouter);
app.use('/api', continentsRouter);
app.use('/api', regionsRouter);
app.use('/api', languagesRouter);
app.use('/api', countriesRouter);
app.use('/api', citiesRouter);
app.use('/api', quizRouter);
app.use('/api', seedRouter);

// Serve client in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = join(__dirname, '..', '..', 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
