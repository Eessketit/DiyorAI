/**
 * Лёгкий алгоритм сопоставления текста без LLM.
 * Комбинирует пересечение слов (word overlap) с символьными
 * триграммами (аналог pg_trgm), чтобы находить совпадения
 * даже при перефразировании и лёгких опечатках.
 */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()«»"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trigrams(text: string): Set<string> {
  const t = ` ${text} `;
  const grams = new Set<string>();
  for (let i = 0; i < t.length - 2; i++) {
    grams.add(t.slice(i, i + 3));
  }
  return grams;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const x of a) {
    if (b.has(x)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function wordOverlap(a: string, b: string): number {
  const aWords = new Set(normalize(a).split(" ").filter((w) => w.length > 2));
  const bWords = new Set(normalize(b).split(" ").filter((w) => w.length > 2));
  if (aWords.size === 0 || bWords.size === 0) return 0;
  let shared = 0;
  for (const w of aWords) {
    if (bWords.has(w)) shared++;
  }
  return shared / Math.min(aWords.size, bWords.size);
}

/**
 * Возвращает степень сходства двух текстов в диапазоне [0, 1].
 * 0.55 * пересечение слов + 0.45 * триграммное сходство.
 */
export function similarity(a: string, b: string): number {
  const normA = normalize(a);
  const normB = normalize(b);
  const trigramScore = jaccard(trigrams(normA), trigrams(normB));
  const wordScore = wordOverlap(normA, normB);
  return 0.55 * wordScore + 0.45 * trigramScore;
}

export const MATCH_THRESHOLD = 0.18;
