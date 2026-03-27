import type { Country, CountryDetail, Continent, QuizQuestion } from '@/types';

const BASE = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function fetchCountries(params?: {
  continent?: string;
  region?: string;
  language?: string;
  search?: string;
}): Promise<Country[]> {
  const searchParams = new URLSearchParams();
  if (params?.continent) searchParams.set('continent', params.continent);
  if (params?.region) searchParams.set('region', params.region);
  if (params?.language) searchParams.set('language', params.language);
  if (params?.search) searchParams.set('search', params.search);
  const qs = searchParams.toString();
  return fetchJson(`${BASE}/countries${qs ? `?${qs}` : ''}`);
}

export function fetchCountry(code: string): Promise<CountryDetail> {
  return fetchJson(`${BASE}/countries/${code}`);
}

export function fetchContinents(): Promise<Continent[]> {
  return fetchJson(`${BASE}/continents`);
}

export function fetchQuiz(params: {
  type: string;
  category: string;
  continent?: string;
  count: number;
}): Promise<{ questions: QuizQuestion[] }> {
  const searchParams = new URLSearchParams({
    type: params.type,
    category: params.category,
    count: String(params.count),
  });
  if (params.continent) searchParams.set('continent', params.continent);
  return fetchJson(`${BASE}/quiz/generate?${searchParams}`);
}
