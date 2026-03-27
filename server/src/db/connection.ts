import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = createDb();
  }
  return db;
}

function createDb(filename?: string): Database.Database {
  const dbPath = filename ?? join(__dirname, '..', '..', 'data', 'world-explorer.db');
  const instance = new Database(filename === ':memory:' ? ':memory:' : dbPath);

  instance.pragma('journal_mode = WAL');
  instance.pragma('foreign_keys = ON');

  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  instance.exec(schema);

  return instance;
}
