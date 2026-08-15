import type { NextApiRequest, NextApiResponse } from "next";
import { planTrip } from "@/lib/tripPlanner";
import { createBudgetModel, createDurationModel, createTravelersModel } from "@/lib/tripState";
import {
  BudgetRange,
  Category,
  Pace,
  Region,
  SelectedHotel,
  SelectedTransfer,
  SelectedTransport,
  TravelerType,
  TripPlan,
  TripPreferences,
} from "@/lib/types";

type Data = TripPlan | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const {
    region,
    interests,
    travelers,
    duration,
    pace,
    budget,
    budgetRange,
    smartTrips,
    // Legacy support
    days,
    groupType,
    soloTraveler,
    selectedServices,
  } = req.body ?? {};

  if (!region || !Array.isArray(interests)) {
    res.status(400).json({ error: "Не хватает обязательных параметров" });
    return;
  }

  const normalizedTravelers = travelers?.type
    ? travelers
    : createTravelersModel((groupType || (soloTraveler ? "solo" : "couple")) as TravelerType);

  const totalDays = duration?.totalDays ?? (typeof days === "number" ? days : 3);
  const activeDays = duration?.activeDays ?? totalDays;
  const normalizedDuration = duration?.totalDays
    ? duration
    : createDurationModel(totalDays, activeDays);

  const normalizedBudget = budget?.maxAmount !== undefined
    ? budget
    : budget?.range
    ? budget
    : createBudgetModel((budget === "budget" ? "under_200" : budget === "luxury" ? "over_1000" : "under_500") as BudgetRange);

  const prefs: TripPreferences = {
    region: region as Region,
    interests: interests as Category[],
    travelers: normalizedTravelers,
    duration: normalizedDuration,
    pace: (pace || "balanced") as Pace,
    budget: normalizedBudget,
    budgetRange,
    smartTrips,
    soloTraveler: Boolean(soloTraveler || normalizedTravelers.type === "solo"),
  };

  const plan = planTrip(prefs, selectedServices as {
    transport?: SelectedTransport;
    transfer?: SelectedTransfer;
    hotel?: SelectedHotel;
  });

  if (smartTrips && Array.isArray(smartTrips)) {
    plan.smartTrips = smartTrips;
  }

  res.status(200).json(plan);
}
