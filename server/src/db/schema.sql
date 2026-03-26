CREATE TABLE IF NOT EXISTS continents (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL UNIQUE,
  code  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS regions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL UNIQUE,
  continent_id  INTEGER NOT NULL REFERENCES continents(id)
);

CREATE TABLE IF NOT EXISTS countries (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  official_name TEXT,
  code_alpha2   TEXT NOT NULL UNIQUE,
  code_alpha3   TEXT NOT NULL UNIQUE,
  capital       TEXT,
  population    INTEGER,
  area          REAL,
  flag_emoji    TEXT,
  flag_url      TEXT,
  lat           REAL,
  lng           REAL,
  region_id     INTEGER REFERENCES regions(id),
  specialty     TEXT
);

CREATE TABLE IF NOT EXISTS languages (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  name  TEXT NOT NULL,
  code  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS country_languages (
  country_id   INTEGER NOT NULL REFERENCES countries(id),
  language_id  INTEGER NOT NULL REFERENCES languages(id),
  PRIMARY KEY (country_id, language_id)
);

CREATE TABLE IF NOT EXISTS cities (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  population  INTEGER,
  lat         REAL,
  lng         REAL,
  country_id  INTEGER NOT NULL REFERENCES countries(id),
  is_capital  INTEGER DEFAULT 0
);
