export type Category = "history" | "architecture" | "pilgrimage" | "nature" | "gastronomy";
export type Region = "samarkand" | "bukhara" | "khiva" | "tashkent";
export type Pace = "relaxed" | "balanced" | "packed";
export type TrustLevel = "high" | "medium" | "low";

export interface TourismObject {
  id: string;
  name: string;
  city: string;
  region: Region;
  categories: Category[];
  lat: number;
  lon: number;
  description: string;
  popularity: number; // 1-10
}

export interface ObjectFact {
  id: string;
  objectId: string;
  factText: string;
  sourceName: string;
  sourceUrl: string;
  trustLevel: TrustLevel;
  verifiedAt: string;
}

export interface Guide {
  id: string;
  name: string;
  region: Region;
  languages: string[];
  specializationTags: Category[];
  rating: number;
  priceRange: string;
  isDemoData: boolean;
}

export interface TripPreferences {
  region: Region;
  interests: Category[];
  days: number;
  pace: Pace;
  soloTraveler: boolean;
}

export interface TripDay {
  dayNumber: number;
  stops: (TourismObject & { score: number })[];
}

export interface TripPlan {
  preferences: TripPreferences;
  days: TripDay[];
  unusedHighScoreObjects: TourismObject[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  history: "История",
  architecture: "Архитектура",
  pilgrimage: "Паломничество",
  nature: "Природа",
  gastronomy: "Гастрономия",
};

export const REGION_LABELS: Record<Region, string> = {
  samarkand: "Самарканд",
  bukhara: "Бухара",
  khiva: "Хива",
  tashkent: "Ташкент",
};

export const PACE_LABELS: Record<Pace, string> = {
  relaxed: "Спокойный (2 объекта в день)",
  balanced: "Сбалансированный (3 объекта в день)",
  packed: "Насыщенный (4 объекта в день)",
};

export const PACE_PER_DAY: Record<Pace, number> = {
  relaxed: 2,
  balanced: 3,
  packed: 4,
};
