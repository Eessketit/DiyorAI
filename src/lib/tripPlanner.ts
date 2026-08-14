import objectsData from "@/data/objects.json";
import guidesData from "@/data/guides.json";
import {
  Category,
  Guide,
  PACE_PER_DAY,
  TourismObject,
  TripDay,
  TripPlan,
  TripPreferences,
} from "./types";

const OBJECTS = objectsData as TourismObject[];
const GUIDES = guidesData as Guide[];

/** Haversine distance in km between two coordinates. */
export function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Скоринг объекта под интересы пользователя:
 *   score = w1 * совпадение категорий + w2 * популярность
 * Веса подобраны так, чтобы совпадение интересов было решающим
 * фактором, а популярность — тай-брейкером.
 */
export function scoreObject(obj: TourismObject, interests: Category[]): number {
  const W_INTEREST = 0.7;
  const W_POPULARITY = 0.3;

  const matchCount = obj.categories.filter((c) => interests.includes(c)).length;
  const interestScore = interests.length === 0 ? 0.3 : matchCount / Math.max(interests.length, obj.categories.length);
  const popularityScore = obj.popularity / 10;

  return W_INTEREST * interestScore + W_POPULARITY * popularityScore;
}

/** Упорядочивает точки эвристикой ближайшего соседа (nearest neighbor). */
function orderByNearestNeighbor<T extends { lat: number; lon: number }>(points: T[]): T[] {
  if (points.length <= 2) return points;
  const remaining = [...points];
  const route: T[] = [remaining.shift() as T];

  while (remaining.length > 0) {
    const last = route[route.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;
    remaining.forEach((p, idx) => {
      const d = distanceKm(last, p);
      if (d < nearestDist) {
        nearestDist = d;
        nearestIdx = idx;
      }
    });
    route.push(remaining.splice(nearestIdx, 1)[0]);
  }
  return route;
}

/**
 * Строит маршрут по алгоритму:
 * 1) фильтрация по региону,
 * 2) скоринг по интересам + популярности,
 * 3) отбор top-N объектов (N = days * objectsPerDay),
 * 4) упорядочивание маршрута NN-эвристикой,
 * 5) разбивка на дни блоками по objectsPerDay.
 *
 * Без LLM — чистая детерминированная логика, воспроизводимая и объяснимая.
 */
export function planTrip(prefs: TripPreferences): TripPlan {
  const perDay = PACE_PER_DAY[prefs.pace];
  const capacity = Math.max(1, prefs.days) * perDay;

  const candidates = OBJECTS.filter((o) => o.region === prefs.region)
    .map((o) => ({ ...o, score: scoreObject(o, prefs.interests) }))
    .sort((a, b) => b.score - a.score);

  const selected = candidates.slice(0, capacity);
  const unusedHighScoreObjects = candidates.slice(capacity);

  const ordered = orderByNearestNeighbor(selected);

  const days: TripDay[] = [];
  for (let i = 0; i < prefs.days; i++) {
    const stops = ordered.slice(i * perDay, (i + 1) * perDay);
    days.push({ dayNumber: i + 1, stops });
  }

  return { preferences: prefs, days, unusedHighScoreObjects };
}

/**
 * Скоринг гидов под маршрут:
 *   score = совпадение специализации с категориями маршрута
 *         + совпадение региона
 * Регион — обязательное условие (гид должен работать в регионе поездки).
 */
export function scoreGuides(region: string, interests: Category[]): (Guide & { matchScore: number })[] {
  return GUIDES.filter((g) => g.region === region)
    .map((g) => {
      const overlap = g.specializationTags.filter((t) => interests.includes(t)).length;
      const overlapRatio = interests.length === 0 ? 0.5 : overlap / interests.length;
      const matchScore = 0.75 * overlapRatio + 0.25 * (g.rating / 5);
      return { ...g, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function getAllObjects(): TourismObject[] {
  return OBJECTS;
}

export function getObjectById(id: string): TourismObject | undefined {
  return OBJECTS.find((o) => o.id === id);
}
