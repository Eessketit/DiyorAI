import type { NextApiRequest, NextApiResponse } from "next";
import { planTrip } from "@/lib/tripPlanner";
import { Category, Pace, Region, TripPlan } from "@/lib/types";

type Data = TripPlan | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { region, interests, days, pace, soloTraveler } = req.body ?? {};

  if (!region || !Array.isArray(interests) || !days || !pace) {
    res.status(400).json({ error: "Не хватает параметров: region, interests, days, pace обязательны" });
    return;
  }

  const plan = planTrip({
    region: region as Region,
    interests: interests as Category[],
    days: Math.min(Math.max(Number(days), 1), 7),
    pace: pace as Pace,
    soloTraveler: Boolean(soloTraveler),
  });

  res.status(200).json(plan);
}
