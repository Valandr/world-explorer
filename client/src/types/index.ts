export interface Continent {
  id: number;
  name: string;
  code: string;
}

export interface Region {
  id: number;
  name: string;
  continent_id: number;
  continent_name: string;
}

export interface Country {
  id: number;
  name: string;
  official_name: string | null;
  code_alpha2: string;
  code_alpha3: string;
  capital: string | null;
  population: number | null;
  area: number | null;
  flag_emoji: string | null;
  flag_url: string | null;
  lat: number | null;
  lng: number | null;
  region_id: number | null;
  specialty: string | null;
  region_name?: string;
  continent_name?: string;
}

export interface Language {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  name: string;
  population: number | null;
  lat: number | null;
  lng: number | null;
  country_id: number;
  is_capital: number;
}

export interface CountryDetail extends Country {
  continent: string | null;
  region: string | null;
  languages: Language[];
  cities: City[];
}

export interface McqQuestion {
  id: number;
  type: 'mcq';
  category: string;
  question: string;
  choices: string[];
  correctIndex: number;
  countryCode: string;
  flagUrl?: string;
}

export interface LocateQuestion {
  id: number;
  type: 'locate';
  category: string;
  question: string;
  answer: { lat: number; lng: number; name: string };
  toleranceKm: number;
}

export type QuizQuestion = McqQuestion | LocateQuestion;

export interface QuizConfig {
  type: 'mcq' | 'locate';
  category: string;
  continent: string;
  count: number;
}

export interface QuizResult {
  date: string;
  config: QuizConfig;
  score: number;
  total: number;
  answers: { questionId: number; correct: boolean }[];
}
