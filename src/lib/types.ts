export type Category =
  | "history"
  | "architecture"
  | "pilgrimage"
  | "nature"
  | "gastronomy"
  | "crafts_bazaars"
  | "nature_hiking"
  | "soviet_modernism";

export type Region = "samarkand" | "bukhara" | "khiva" | "tashkent";
export type Pace = "relaxed" | "balanced" | "packed";
export type GroupType = "solo" | "couple" | "family" | "friends";
export type Budget = "budget" | "medium" | "luxury";
export type TrustLevel = "high" | "medium" | "low";
export type FactVerdict = "fact" | "legend" | "myth";
export type TimeSlot = "morning" | "afternoon_indoor" | "evening";

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
  isIndoor?: boolean;
  bestTimeSlot?: TimeSlot;
  approxDurationMin?: number;
  ticketPriceUzs?: {
    resident: number;
    foreigner: number;
  };
}

export interface ObjectFact {
  id: string;
  objectId: string;
  factText: string;
  sourceName: string;
  sourceUrl: string;
  trustLevel: TrustLevel;
  verdict: FactVerdict;
  verifiedAt: string;
  explanation?: string;
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
  groupType: GroupType;
  budget: Budget;
  soloTraveler: boolean;
}

export interface TimelineStop extends TourismObject {
  score: number;
  order: number;
  dayNumber: number;
  timeSlot: TimeSlot;
  timeLabel: string;
  transitFromPrevMin?: number;
}

export interface TripDay {
  dayNumber: number;
  date?: string;
  stops: (TourismObject & { score: number; timeSlot?: TimeSlot; timeLabel?: string })[];
  timelineStops?: TimelineStop[];
  estimatedTotalKm?: number;
}

export interface TripPlan {
  preferences: TripPreferences;
  days: TripDay[];
  unusedHighScoreObjects: TourismObject[];
  intercityTip?: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  history: "История",
  architecture: "Исламская архитектура",
  pilgrimage: "Паломничество и святыни",
  nature: "Природа",
  gastronomy: "Гастрономия (плов, чайханы)",
  crafts_bazaars: "Ремесла и базары",
  nature_hiking: "Горы и хайкинг",
  soviet_modernism: "Советский модернизм и арт",
};

export const REGION_LABELS: Record<Region, string> = {
  samarkand: "Самарканд",
  bukhara: "Бухара",
  khiva: "Хива",
  tashkent: "Ташкент",
};

export const PACE_LABELS: Record<Pace, string> = {
  relaxed: "В расслабленном темпе (2 объекта / день)",
  balanced: "Сбалансированный (3 объекта / день)",
  packed: "Максимум впечатлений (4 объекта / день)",
};

export const PACE_PER_DAY: Record<Pace, number> = {
  relaxed: 2,
  balanced: 3,
  packed: 4,
};

export const GROUP_LABELS: Record<GroupType, string> = {
  solo: "Один / Одна (Соло)",
  couple: "Пара",
  family: "Семья с детьми",
  friends: "Группа друзей",
};

export const BUDGET_LABELS: Record<Budget, string> = {
  budget: "Бюджетный (хостелы, стритфуд)",
  medium: "Комфорт (отели 3-4*, рестораны, Yandex Go)",
  luxury: "Премиум (бутик-отели, частный гид/трансфер)",
};
