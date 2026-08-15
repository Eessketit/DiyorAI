import type { NextApiRequest, NextApiResponse } from "next";
import { scoreGuides } from "@/lib/tripPlanner";
import { Category, Guide } from "@/lib/types";

type Data = Guide[] | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { region, interests, language, sortBy } = req.query;

  const targetRegion = typeof region === "string" ? region : "all";
  const interestList = (
    typeof interests === "string" && interests.length > 0 ? interests.split(",") : []
  ) as Category[];

  let results = scoreGuides(targetRegion, interestList, {
    language: typeof language === "string" ? language : undefined,
  });

  if (typeof sortBy === "string") {
    switch (sortBy) {
      case "trust":
        results.sort((a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0));
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "experience":
        results.sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0));
        break;
      case "match":
        results.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        break;
      case "price_asc":
        results.sort((a, b) => (a.pricePerTourUsd ?? 40) - (b.pricePerTourUsd ?? 40));
        break;
      case "recommended":
      default:
        // Already scored by default recommended mix
        break;
    }
  }

  res.status(200).json(results);
}
