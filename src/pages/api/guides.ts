import type { NextApiRequest, NextApiResponse } from "next";
import { scoreGuides } from "@/lib/tripPlanner";
import { Category, Guide } from "@/lib/types";

type Data = (Guide & { matchScore: number })[] | { error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { region, interests } = req.query;

  if (!region || typeof region !== "string") {
    res.status(400).json({ error: "region обязателен" });
    return;
  }

  const interestList = (
    typeof interests === "string" && interests.length > 0 ? interests.split(",") : []
  ) as Category[];

  const results = scoreGuides(region, interestList);
  res.status(200).json(results);
}
