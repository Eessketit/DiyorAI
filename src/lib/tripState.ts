import {
  BudgetModel,
  BudgetRange,
  BUDGET_RANGE_MAX,
  DurationModel,
  Region,
  SelectedHotel,
  SelectedTransfer,
  SelectedTransport,
  TravelersModel,
  TravelerType,
  TripPlan,
  TripPreferences,
} from "./types";

/**
 * Creates a valid TravelersModel ensuring business logic consistency:
 * - solo: adults = 1, children = 0
 * - couple: adults = 2, children = 0
 * - family: adults >= 1, children >= 0
 * - friends: adults >= 1, children = 0 (separate individual payers)
 * - group: adults >= 1, children >= 0
 */
export function createTravelersModel(
  type: TravelerType,
  adultsInput?: number,
  childrenInput?: number
): TravelersModel {
  switch (type) {
    case "solo":
      return { type: "solo", adults: 1, children: 0, total: 1 };
    case "couple":
      return { type: "couple", adults: 2, children: 0, total: 2 };
    case "family": {
      const adults = Math.max(1, adultsInput ?? 2);
      const children = Math.max(0, childrenInput ?? 1);
      return { type: "family", adults, children, total: adults + children };
    }
    case "friends": {
      const count = Math.max(2, adultsInput ?? 4);
      return { type: "friends", adults: count, children: 0, total: count };
    }
    case "group": {
      const adults = Math.max(1, adultsInput ?? 6);
      const children = Math.max(0, childrenInput ?? 0);
      return { type: "group", adults, children, total: adults + children };
    }
    default:
      return { type: "solo", adults: 1, children: 0, total: 1 };
  }
}

/**
 * Formats a Date object to YYYY-MM-DD string for HTML date input
 */
export function formatDateIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculates days between two date strings (inclusive)
 * e.g. 2026-08-12 to 2026-08-18 = 7 days
 */
export function calculateDaysBetweenDates(startIso?: string, endIso?: string): number {
  if (!startIso || !endIso) return 3;
  const start = new Date(startIso);
  const end = new Date(endIso);
  const diffTime = end.getTime() - start.getTime();
  if (isNaN(diffTime) || diffTime < 0) return 1;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(21, diffDays));
}

/**
 * Creates duration model with validation:
 * totalDays >= 1, 0 <= activeDays <= totalDays, restDays = totalDays - activeDays
 */
export function createDurationModel(
  totalDaysInput: number,
  activeDaysInput?: number,
  startDate?: string,
  endDate?: string
): DurationModel {
  const totalDays = Math.max(1, Math.min(21, totalDaysInput));
  const activeDays = Math.max(
    1,
    Math.min(totalDays, activeDaysInput !== undefined ? activeDaysInput : totalDays)
  );
  const restDays = Math.max(0, totalDays - activeDays);
  return { totalDays, activeDays, restDays, startDate, endDate };
}

export function createBudgetModel(range: BudgetRange): BudgetModel {
  return {
    range,
    minAmount: 0,
    maxAmount: BUDGET_RANGE_MAX[range] || 500,
  };
}

export function createBudgetRangeModel(minBudget = 0, maxBudget: number | null = 500): BudgetModel {
  return {
    minAmount: minBudget,
    maxAmount: maxBudget === null ? Infinity : maxBudget,
  };
}

export interface TripState {
  travelers: TravelersModel;
  duration: DurationModel;
  region: Region;
  pace: "relaxed" | "balanced" | "packed";
  budget: BudgetModel;
  budgetRange?: { minBudget: number; maxBudget: number | null };
  interests: string[];
  departureCity?: string;
  transport?: SelectedTransport;
  transfer?: SelectedTransfer;
  hotel?: SelectedHotel;
  smartTrips?: any[];
  itineraryPlan?: TripPlan;
}

const defaultStart = new Date();
defaultStart.setDate(defaultStart.getDate() + 7);
const defaultEnd = new Date(defaultStart);
defaultEnd.setDate(defaultEnd.getDate() + 2);

export const DEFAULT_TRIP_STATE: TripState = {
  travelers: createTravelersModel("couple", 2, 0),
  duration: createDurationModel(3, 3, formatDateIso(defaultStart), formatDateIso(defaultEnd)),
  region: "samarkand",
  pace: "balanced",
  budget: createBudgetModel("under_500"),
  budgetRange: { minBudget: 50, maxBudget: 500 },
  interests: ["history", "architecture", "gastronomy"],
  departureCity: "Ташкент",
};

const STORAGE_KEY = "diyorai_constructor_state";

export function saveConstructorState(state: Partial<TripState>): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (err) {
    console.warn("Could not save constructor state to localStorage", err);
  }
}

export function loadConstructorState(): Partial<TripState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Could not load constructor state from localStorage", err);
    return null;
  }
}

