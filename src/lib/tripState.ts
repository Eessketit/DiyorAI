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
 * Creates duration model with validation:
 * totalDays >= 1, 0 <= activeDays <= totalDays, restDays = totalDays - activeDays
 */
export function createDurationModel(totalDaysInput: number, activeDaysInput?: number): DurationModel {
  const totalDays = Math.max(1, Math.min(14, totalDaysInput));
  const activeDays = Math.max(
    1,
    Math.min(totalDays, activeDaysInput !== undefined ? activeDaysInput : totalDays)
  );
  const restDays = Math.max(0, totalDays - activeDays);
  return { totalDays, activeDays, restDays };
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
  transport?: SelectedTransport;
  transfer?: SelectedTransfer;
  hotel?: SelectedHotel;
  smartTrips?: any[];
  itineraryPlan?: TripPlan;
}

export const DEFAULT_TRIP_STATE: TripState = {
  travelers: createTravelersModel("couple"),
  duration: createDurationModel(3, 3),
  region: "samarkand",
  pace: "balanced",
  budget: createBudgetModel("under_500"),
  budgetRange: { minBudget: 50, maxBudget: 500 },
  interests: ["history", "architecture", "gastronomy"],
};
