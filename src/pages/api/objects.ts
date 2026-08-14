import type { NextApiRequest, NextApiResponse } from "next";
import { getAllObjects } from "@/lib/tripPlanner";
import { TourismObject } from "@/lib/types";

export default function handler(req: NextApiRequest, res: NextApiResponse<TourismObject[]>) {
  const { region } = req.query;
  const all = getAllObjects();
  const filtered = typeof region === "string" && region.length > 0 ? all.filter((o) => o.region === region) : all;
  res.status(200).json(filtered);
}
