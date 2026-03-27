import type Database from 'better-sqlite3';

interface RestCountry {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  capital?: string[];
  population: number;
  area: number;
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  latlng: [number, number];
  flag: string;
  flags: { svg: string; png: string };
}

interface GeoNamesCity {
  geonameId: number;
  name: string;
  population: number;
  lat: string;
  lng: string;
  countryCode: string;
  fcode: string;
}

const CONTINENT_MAP: Record<string, string> = {
  Africa: 'AF',
  Americas: 'AM',
  Asia: 'AS',
  Europe: 'EU',
  Oceania: 'OC',
  Antarctic: 'AN',
};

export async function importData(db: Database.Database, geonamesUsername: string): Promise<void> {
  console.log('Fetching countries from REST Countries API...');
  const mainFields = 'name,cca2,cca3,capital,population,region,languages,latlng,flag,flags';
  const response = await fetch(`https://restcountries.com/v3.1/all?fields=${mainFields}`);
  if (!response.ok) throw new Error(`REST Countries API error: ${response.status}`);
  const rawCountries = await response.json() as Omit<RestCountry, 'area' | 'subregion'>[];

  const extraFields = 'cca2,area,subregion';
  const extraRes = await fetch(`https://restcountries.com/v3.1/all?fields=${extraFields}`);
  const extraData = extraRes.ok ? await extraRes.json() as { cca2: string; area: number; subregion?: string }[] : [];
  const extraMap = new Map(extraData.map((e) => [e.cca2, e]));

  const countries: RestCountry[] = rawCountries.map((c) => {
    const extra = extraMap.get(c.cca2);
    return { ...c, area: extra?.area ?? 0, subregion: extra?.subregion };
  });

  console.log(`Fetched ${countries.length} countries. Importing...`);

  const insertContinent = db.prepare(
    'INSERT OR IGNORE INTO continents (name, code) VALUES (?, ?)',
  );
  const insertRegion = db.prepare(
    'INSERT OR IGNORE INTO regions (name, continent_id) VALUES (?, ?)',
  );
  const insertCountry = db.prepare(`
    INSERT OR IGNORE INTO countries (name, official_name, code_alpha2, code_alpha3, capital, population, area, flag_emoji, flag_url, lat, lng, region_id, specialty)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertLanguage = db.prepare('INSERT OR IGNORE INTO languages (name, code) VALUES (?, ?)');
  const insertCountryLanguage = db.prepare(
    'INSERT OR IGNORE INTO country_languages (country_id, language_id) VALUES (?, ?)',
  );
  const insertCity = db.prepare(`
    INSERT OR IGNORE INTO cities (name, population, lat, lng, country_id, is_capital)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const getContinent = db.prepare('SELECT id FROM continents WHERE code = ?');
  const getRegion = db.prepare('SELECT id FROM regions WHERE name = ?');
  const getCountry = db.prepare('SELECT id FROM countries WHERE code_alpha2 = ?');
  const getLanguage = db.prepare('SELECT id FROM languages WHERE code = ?');

  const importAll = db.transaction(() => {
    for (const [name, code] of Object.entries(CONTINENT_MAP)) {
      insertContinent.run(name, code);
    }

    for (const c of countries) {
      const continentCode = CONTINENT_MAP[c.region] ?? 'AM';
      const continent = getContinent.get(continentCode) as { id: number } | undefined;

      const regionName = c.subregion || c.region;
      if (regionName) {
        insertRegion.run(regionName, continent?.id ?? 1);
      }

      const region = regionName
        ? (getRegion.get(regionName) as { id: number } | undefined)
        : null;

      insertCountry.run(
        c.name.common,
        c.name.official,
        c.cca2,
        c.cca3,
        c.capital?.[0] ?? null,
        c.population,
        c.area,
        c.flag,
        c.flags.svg,
        c.latlng[0],
        c.latlng[1],
        region?.id ?? null,
        null,
      );

      const countryRow = getCountry.get(c.cca2) as { id: number } | undefined;
      if (!countryRow) continue;

      if (c.languages) {
        for (const [code, name] of Object.entries(c.languages)) {
          insertLanguage.run(name, code);
          const langRow = getLanguage.get(code) as { id: number } | undefined;
          if (langRow) {
            insertCountryLanguage.run(countryRow.id, langRow.id);
          }
        }
      }

      if (c.capital?.[0]) {
        insertCity.run(c.capital[0], null, c.latlng[0], c.latlng[1], countryRow.id, 1);
      }
    }
  });

  importAll();
  console.log('Countries imported successfully.');

  console.log('Fetching cities from GeoNames API...');
  await importCities(db, geonamesUsername);
  console.log('Import complete!');
}

async function importCities(db: Database.Database, username: string): Promise<void> {
  const insertCity = db.prepare(`
    INSERT OR IGNORE INTO cities (name, population, lat, lng, country_id, is_capital)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const getCountry = db.prepare('SELECT id FROM countries WHERE code_alpha2 = ?');
  const existingCapital = db.prepare(
    'SELECT id FROM cities WHERE country_id = ? AND is_capital = 1',
  );

  const countryCodes = (
    db.prepare('SELECT code_alpha2 FROM countries').all() as { code_alpha2: string }[]
  ).map((r) => r.code_alpha2);

  let processed = 0;
  for (const code of countryCodes) {
    try {
      const url = `http://api.geonames.org/searchJSON?country=${code}&featureClass=P&maxRows=10&orderby=population&username=${encodeURIComponent(username)}`;
      const res = await fetch(url);
      if (!res.ok) continue;

      const data = (await res.json()) as { geonames?: GeoNamesCity[] };
      const countryRow = getCountry.get(code) as { id: number } | undefined;
      if (!countryRow || !data.geonames) continue;

      for (const city of data.geonames) {
        const isCapital = city.fcode === 'PPLC' ? 1 : 0;

        if (isCapital) {
          const existing = existingCapital.get(countryRow.id) as { id: number } | undefined;
          if (existing) continue;
        }

        insertCity.run(
          city.name,
          city.population || null,
          parseFloat(city.lat),
          parseFloat(city.lng),
          countryRow.id,
          isCapital,
        );
      }

      processed++;
      if (processed % 50 === 0) {
        console.log(`  Processed ${processed}/${countryCodes.length} countries...`);
      }

      await new Promise((r) => setTimeout(r, 100));
    } catch {
      continue;
    }
  }
}
