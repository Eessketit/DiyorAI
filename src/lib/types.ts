export type Category =
  | "history"
  | "architecture"
  | "pilgrimage"
  | "nature"
  | "gastronomy"
  | "crafts_bazaars"
  | "nature_hiking"
  | "soviet_modernism";

export type Region =
  | "samarkand"
  | "bukhara"
  | "khiva"
  | "tashkent"
  | "tashkent_region";

export type Pace = "relaxed" | "balanced" | "packed";
export type TravelerType = "solo" | "couple" | "family" | "friends" | "group";
export type BudgetRange = "under_200" | "under_500" | "under_1000" | "over_1000";

// Backward compatibility aliases
export type GroupType = TravelerType;
export type Budget = "budget" | "medium" | "luxury" | BudgetRange;

export type TrustLevel = "high" | "medium" | "low";
export type FactVerdict = "fact" | "legend" | "myth";
export type TimeSlot = "morning" | "afternoon_indoor" | "evening" | "rest";

export interface TravelersModel {
  type: TravelerType;
  adults: number;
  children: number;
  total: number;
}

export interface DurationModel {
  totalDays: number;
  activeDays: number;
  restDays: number;
}

export interface BudgetModel {
  range: BudgetRange;
  maxAmount: number; // numeric cap for calculations e.g. 200, 500, 1000, 2500
}

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
  approxCostUsd?: number;
  isRestDayOption?: boolean;
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

export interface FlightOption {
  id: string;
  airline: string;
  airlineLogo?: string;
  flightNumber: string;
  fromCity: string;
  toCity: string;
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  pricePerPassengerUsd: number;
  isRoundTrip: boolean;
}

export interface TrainOption {
  id: string;
  name: string;
  trainNumber: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  trainClass: "economy" | "business" | "vip";
  pricePerPassengerUsd: number;
}

export interface CarOption {
  id: string;
  type: "personal" | "rental";
  title: string;
  estimatedDistanceKm: number;
  estimatedTravelHours: number;
  estimatedFuelCostUsd: number;
  rentalPerDayUsd?: number;
}

export type TransportType = "flight" | "train" | "car";

export interface SelectedTransport {
  type: TransportType;
  flight?: FlightOption;
  train?: TrainOption;
  car?: CarOption;
  isRoundTrip: boolean;
  passengers: number;
  totalCostUsd: number;
}

export type TransferClass = "economy" | "comfort" | "business" | "van";

export interface TransferVehicle {
  id: string;
  className: TransferClass;
  title: string;
  brand: string;
  model: string;
  year: number;
  passengerCapacity: number;
  luggageCapacity: number;
  photoUrl: string;
  priceOneWayUsd: number;
}

export interface SelectedTransfer {
  vehicle: TransferVehicle;
  numberOfCars: number;
  isRoundTrip: boolean;
  totalCostUsd: number;
  reasonForMultipleCars?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  region: Region;
  city: string;
  rating: number;
  location: string;
  photoUrl: string;
  pricePerNightUsd: number;
  roomType: string;
  roomCapacity: number;
  amenities: string[];
  category: "budget" | "comfort" | "boutique" | "resort";
}

export interface SelectedHotel {
  hotel: HotelOption;
  nights: number;
  numberOfRooms: number;
  totalCostUsd: number;
}

export interface CostCategoryBreakdown {
  transport: number;
  transfer: number;
  hotel: number;
  activitiesAndFood: number;
  guide: number;
  other: number;
  total: number;
}

export type PayerSplitMode = "equal" | "single_payer" | "family_share";

export interface PayerSplit {
  mode: PayerSplitMode;
  shares: {
    label: string;
    amountUsd: number;
  }[];
}

export interface TimelineStop extends TourismObject {
  score: number;
  order: number;
  dayNumber: number;
  timeSlot: TimeSlot;
  timeLabel: string;
  transitFromPrevMin?: number;
  estimatedCostUsd?: number;
}

export interface TripDay {
  dayNumber: number;
  isRestDay?: boolean;
  date?: string;
  title?: string;
  summary?: string;
  stops: (TourismObject & { score: number; timeSlot?: TimeSlot; timeLabel?: string; estimatedCostUsd?: number })[];
  timelineStops?: TimelineStop[];
  estimatedTotalKm?: number;
}

export interface TripPreferences {
  region: Region;
  interests: Category[];
  travelers?: TravelersModel;
  duration?: DurationModel;
  pace: Pace;
  budget: BudgetModel | string;
  soloTraveler: boolean;
  // Legacy fields for backward compatibility
  days?: number;
  groupType?: GroupType;
}

export interface TripPlan {
  preferences: TripPreferences;
  days: TripDay[];
  unusedHighScoreObjects?: TourismObject[];
  intercityTip?: string;
  transport?: SelectedTransport;
  transfer?: SelectedTransfer;
  hotel?: SelectedHotel;
  costBreakdown?: CostCategoryBreakdown;
  payerSplit?: PayerSplit;
  isOverBudget?: boolean;
  budgetRemainingUsd?: number;
  costPerPersonUsd?: number;
}

export interface LeadContact {
  bookingId: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: "telegram" | "whatsapp" | "phone";
  comments?: string;
  destination: Region;
  travelers: TravelersModel;
  duration: DurationModel;
  transport?: SelectedTransport;
  transfer?: SelectedTransfer;
  hotel?: SelectedHotel;
  totalCostUsd: number;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  history: "История и памятники",
  architecture: "Исламская архитектура",
  pilgrimage: "Паломничество и святыни",
  nature: "Природа и заповедники",
  gastronomy: "Гастрономия (плов, чайханы)",
  crafts_bazaars: "Ремесла и базары",
  nature_hiking: "Горы, озера и хайкинг",
  soviet_modernism: "Советский модернизм и арт",
};

export const REGION_LABELS: Record<Region, string> = {
  samarkand: "Самарканд",
  bukhara: "Бухара",
  khiva: "Хива",
  tashkent: "Ташкент (Город)",
  tashkent_region: "Ташкентская область (Горы, Чарвак, Амирсой)",
};

export const PACE_LABELS: Record<Pace, string> = {
  relaxed: "🌿 Спокойный (меньше активностей, больше отдыха)",
  balanced: "⚖️ Сбалансированный (баланс впечатлений и отдыха)",
  packed: "🔥 Насыщенный (максимум достопримечательностей)",
};

export const PACE_PER_DAY: Record<Pace, number> = {
  relaxed: 2,
  balanced: 3,
  packed: 4,
};

export const TRAVELER_TYPE_LABELS: Record<TravelerType, string> = {
  solo: "👤 Один (Соло)",
  couple: "👫 Пара",
  family: "👨‍👩‍👧‍👦 Семья",
  friends: "👥 Друзья",
  group: "🚌 Группа",
};

export const GROUP_LABELS: Record<GroupType, string> = TRAVELER_TYPE_LABELS;

export const BUDGET_RANGE_LABELS: Record<BudgetRange, string> = {
  under_200: "💵 До $200 (Бюджетный / Day Trips)",
  under_500: "💵 До $500 (Оптимальный)",
  under_1000: "💵 До $1,000 (Комфорт)",
  over_1000: "💎 $1,000+ (Премиум)",
};

export const BUDGET_RANGE_MAX: Record<BudgetRange, number> = {
  under_200: 200,
  under_500: 500,
  under_1000: 1000,
  over_1000: 2500,
};

export const BUDGET_LABELS: Record<string, string> = {
  budget: "Бюджетный (до $200)",
  medium: "Комфорт ($500 - $1000)",
  luxury: "Премиум ($1000+)",
  ...BUDGET_RANGE_LABELS,
};
