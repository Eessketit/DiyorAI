import type { NextApiRequest, NextApiResponse } from "next";
import factsData from "@/data/facts.json";
import { MATCH_THRESHOLD, similarity } from "@/lib/textMatch";
import { FactVerdict, ObjectFact } from "@/lib/types";

const FACTS = factsData as ObjectFact[];

interface VerifyResponse {
  objectId: string;
  query: string | null;
  status: "matched" | "no-match" | "listed";
  verdict?: FactVerdict;
  results: (ObjectFact & { matchScore: number })[];
}

export default function handler(req: NextApiRequest, res: NextApiResponse<VerifyResponse | { error: string }>) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { objectId, query } = req.body ?? {};
  if (!objectId) {
    res.status(400).json({ error: "objectId обязателен" });
    return;
  }

  const objectFacts = FACTS.filter((f) => f.objectId === objectId);

  // Без запроса — просто отдаём все проверенные факты об объекте
  if (!query || String(query).trim().length === 0) {
    res.status(200).json({
      objectId,
      query: null,
      status: "listed",
      results: objectFacts.map((f) => ({ ...f, matchScore: 1 })),
    });
    return;
  }

  const scored = objectFacts
    .map((f) => ({ ...f, matchScore: similarity(String(query), f.factText) }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const matched = scored.filter((f) => f.matchScore >= MATCH_THRESHOLD);
  const bestMatch = matched[0];

  res.status(200).json({
    objectId,
    query: String(query),
    status: matched.length > 0 ? "matched" : "no-match",
    verdict: bestMatch ? bestMatch.verdict : undefined,
    results: matched.length > 0 ? matched : scored.slice(0, 3),
  });
}
