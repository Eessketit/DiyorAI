import { MOCK_SMART_TRIPS } from "@/data/smartTripsData";
import {
  BudgetRangeModel,
  Category,
  Pace,
  SmartTrip,
  TravelersModel,
} from "./types";

export interface SmartTripFilterOptions {
  region?: string;
  interests?: (Category | string)[];
  pace?: Pace;
  travelers?: TravelersModel;
  budgetRange?: BudgetRangeModel;
  maxBudgetFilter?: number;
  categoryFilter?: string;
}

export function calculateSmartTripGroupCost(
  trip: SmartTrip,
  travelers?: TravelersModel
): number {
  const adults = travelers?.adults ?? 2;
  const children = travelers?.children ?? 0;
  return adults * trip.pricePerAdult + children * (trip.pricePerChild || trip.pricePerAdult * 0.6);
}

export function calculateExperienceMatch(
  trip: SmartTrip,
  options?: SmartTripFilterOptions
): number {
  let score = 80;

  // 1. Region match
  if (options?.region && options.region !== "all") {
    if (trip.region === options.region) {
      score += 8;
    } else if (
      (options.region === "tashkent" && trip.region === "tashkent_region") ||
      (options.region === "tashkent_region" && trip.region === "tashkent")
    ) {
      score += 5;
    } else {
      score -= 5;
    }
  }

  // 2. Interests overlap
  if (options?.interests && options.interests.length > 0) {
    const matchedInterests = trip.interests.filter((i) =>
      options.interests?.includes(i as Category)
    );
    const ratio = matchedInterests.length / Math.max(1, options.interests.length);
    score += Math.round(ratio * 10);
  }

  // 3. Pace match
  if (options?.pace && trip.pace.includes(options.pace)) {
    score += 4;
  }

  // 4. Group type match
  if (options?.travelers && trip.suitableFor.includes(options.travelers.type)) {
    score += 4;
  }

  // 5. Budget fit
  if (options?.budgetRange) {
    const groupCost = calculateSmartTripGroupCost(trip, options.travelers);
    const maxLimit = options.budgetRange.maxBudget ?? Infinity;
    if (groupCost <= maxLimit && groupCost >= options.budgetRange.minBudget) {
      score += 4;
    } else if (groupCost > maxLimit) {
      score -= 8;
    }
  }

  return Math.min(99, Math.max(72, score));
}

export function getSmartTripRecommendations(
  options?: SmartTripFilterOptions
): SmartTrip[] {
  let list = [...MOCK_SMART_TRIPS];

  // Filter by category
  if (options?.categoryFilter && options.categoryFilter !== "all") {
    list = list.filter((t) => t.interests.includes(options.categoryFilter as any));
  }

  // Filter by Max Budget if passed (e.g. from preset buttons)
  if (options?.maxBudgetFilter && options.maxBudgetFilter > 0) {
    list = list.filter((t) => {
      const groupCost = calculateSmartTripGroupCost(t, options.travelers);
      return groupCost <= (options.maxBudgetFilter as number) * 1.15;
    });
  }

  return list
    .map((trip) => ({
      ...trip,
      matchScore: calculateExperienceMatch(trip, options),
    }))
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
}

export interface SurpriseResult {
  trip: SmartTrip;
  reasons: {
    ru: string[];
    en: string[];
    uz: string[];
  };
}

export function getSurpriseSmartTrip(
  options?: SmartTripFilterOptions
): SurpriseResult {
  const recommendations = getSmartTripRecommendations(options);
  // Pick random from top 3 for variety
  const topSlice = recommendations.slice(0, 3);
  const picked = topSlice[Math.floor(Math.random() * topSlice.length)] || recommendations[0];

  const groupCost = calculateSmartTripGroupCost(picked, options?.travelers);

  return {
    trip: picked,
    reasons: {
      ru: [
        `Идеально укладывается в бюджет (~$${groupCost} на группу)`,
        `Соответствует вашим интересам (${picked.interests.slice(0, 2).join(", ")})`,
        `Проверенная локация в пределах 1.5 часов от города`,
        `Рейтинг одобрения путешественников 98%`,
      ],
      en: [
        `Fits perfectly within budget (~$${groupCost} for the group)`,
        `Matches your travel preferences (${picked.interests.slice(0, 2).join(", ")})`,
        `Verified experience within 1.5h from city`,
        `98% traveler satisfaction score`,
      ],
      uz: [
        `Byudjetga to'liq mos keladi (guruh uchun ~$${groupCost})`,
        `Qiziqishlaringizga moslashtirilgan (${picked.interests.slice(0, 2).join(", ")})`,
        `Shahardan 1.5 soatlik masofadagi ishonchli manzil`,
        `Sayyohlarning 98% ijobiy bahosi`,
      ],
    },
  };
}

export function getCheaperAlternatives(
  targetTrip: SmartTrip,
  maxBudgetUsd: number,
  travelers?: TravelersModel
): SmartTrip[] {
  return MOCK_SMART_TRIPS.filter((t) => {
    if (t.id === targetTrip.id) return false;
    const cost = calculateSmartTripGroupCost(t, travelers);
    return cost < maxBudgetUsd;
  })
    .map((trip) => ({
      ...trip,
      matchScore: calculateExperienceMatch(trip, { travelers }),
    }))
    .sort((a, b) => a.pricePerAdult - b.pricePerAdult)
    .slice(0, 2);
}
