import type { NextApiRequest, NextApiResponse } from "next";
import { planTrip } from "@/lib/tripPlanner";
import { Budget, Category, GroupType, Pace, Region, TripPlan } from "@/lib/types";

type Data = TripPlan | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { region, interests, days, pace, groupType, budget, soloTraveler } = req.body ?? {};

  if (!region || !Array.isArray(interests) || !days || !pace) {
    res.status(400).json({ error: "Не хватает обязательных параметров" });
    return;
  }

  const plan = planTrip({
    region: region as Region,
    interests: interests as Category[],
    days: Math.min(Math.max(Number(days), 1), 7),
    pace: pace as Pace,
    groupType: (groupType || (soloTraveler ? "solo" : "couple")) as GroupType,
    budget: (budget || "medium") as Budget,
    soloTraveler: Boolean(soloTraveler || groupType === "solo"),
  });

  res.status(200).json(plan);
}
