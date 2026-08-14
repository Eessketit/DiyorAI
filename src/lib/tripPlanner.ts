import objectsData from "@/data/objects.json";
import guidesData from "@/data/guides.json";
import {
  Category,
  Guide,
  PACE_PER_DAY,
  TimeSlot,
  TimelineStop,
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
 * Расширенный алгоритм скоринга:
 *   score = w1 * совпадение интересов
 *         + w2 * популярность
 *         + w3 * соответствие формату группы (семья, соло, пара)
 *         + w4 * бюджет
 */
export function scoreObject(obj: TourismObject, prefs: TripPreferences): number {
  const W_INTEREST = 0.65;
  const W_POPULARITY = 0.20;
  const W_GROUP = 0.15;

  const matchCount = obj.categories.filter((c) => prefs.interests.includes(c)).length;
  const interestScore =
    prefs.interests.length === 0 ? 0.4 : matchCount / Math.max(prefs.interests.length, obj.categories.length);
  const popularityScore = obj.popularity / 10;

  // Bonus for solo travelers (safety/crowdedness) or families (indoor/comfort)
  let groupBonus = 0.5;
  if (prefs.groupType === "family" && obj.isIndoor) groupBonus += 0.3;
  if (prefs.groupType === "solo" && obj.popularity >= 9) groupBonus += 0.25;
  if (prefs.groupType === "friends" && obj.categories.includes("gastronomy")) groupBonus += 0.25;

  return W_INTEREST * interestScore + W_POPULARITY * popularityScore + W_GROUP * Math.min(groupBonus, 1);
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

/** Назначает климатические тайм-слоты объектам дня */
function assignClimateSlots(stops: (TourismObject & { score: number })[], dayNumber: number): TimelineStop[] {
  const slots: { slot: TimeSlot; label: string }[] = [
    { slot: "morning", label: "09:00 - 11:30 (🌅 Утренняя прохлада)" },
    { slot: "afternoon_indoor", label: "12:30 - 15:30 (☀️ Сиеста / В тени и музеях)" },
    { slot: "evening", label: "16:30 - 19:30 (🌆 Закат и вечерняя подсветка)" },
    { slot: "evening", label: "20:00 - 21:30 (🌙 Вечерний променад и чайхана)" },
  ];

  return stops.map((s, idx) => {
    const timeConfig = slots[idx] || slots[slots.length - 1];
    const prev = idx > 0 ? stops[idx - 1] : null;
    const transitDist = prev ? distanceKm(prev, s) : 0;
    const transitMinutes = Math.max(5, Math.round(transitDist * 8)); // approx walking/taxi min

    return {
      ...s,
      order: idx + 1,
      dayNumber,
      timeSlot: s.bestTimeSlot || timeConfig.slot,
      timeLabel: s.bestTimeSlot === "morning"
        ? "09:00 - 11:30 (🌅 Утренняя прохлада)"
        : s.bestTimeSlot === "afternoon_indoor"
        ? "12:30 - 15:30 (☀️ Сиеста в тени и музеях)"
        : "16:30 - 19:30 (🌆 Закат и вечерняя подсветка)",
      transitFromPrevMin: idx > 0 ? transitMinutes : undefined,
    };
  });
}

/**
 * Строит полный маршрут с учетом интересов, группы, бюджета и климатического расписания
 */
export function planTrip(prefs: TripPreferences): TripPlan {
  const perDay = PACE_PER_DAY[prefs.pace] || 3;
  const capacity = Math.max(1, prefs.days) * perDay;

  const candidates = OBJECTS.filter((o) => o.region === prefs.region)
    .map((o) => ({ ...o, score: scoreObject(o, prefs) }))
    .sort((a, b) => b.score - a.score);

  const selected = candidates.slice(0, capacity);
  const unusedHighScoreObjects = candidates.slice(capacity);

  const ordered = orderByNearestNeighbor(selected);

  const days: TripDay[] = [];
  for (let i = 0; i < prefs.days; i++) {
    const rawStops = ordered.slice(i * perDay, (i + 1) * perDay);
    const timelineStops = assignClimateSlots(rawStops, i + 1);

    // Calculate total route km
    let dayKm = 0;
    for (let j = 1; j < rawStops.length; j++) {
      dayKm += distanceKm(rawStops[j - 1], rawStops[j]);
    }

    days.push({
      dayNumber: i + 1,
      stops: rawStops,
      timelineStops,
      estimatedTotalKm: Math.round(dayKm * 10) / 10,
    });
  }

  // Intercity tip
  let intercityTip: string | undefined;
  if (prefs.region === "samarkand" || prefs.region === "bukhara") {
    intercityTip =
      "🚆 Рекомендация по транспорту: Из Ташкента в Самарканд и Бухару удобнее всего добираться на скоростном поезде Afrosiyob (2ч 15м). Бронируйте билеты за 45 дней на railway.uz!";
  } else if (prefs.region === "tashkent") {
    intercityTip =
      "🚕 Транспорт в Ташкенте: По городу комфортно передвигаться на Yandex Go (от 15 000 сум) и на станциях метро Ташкента (особенно 'Космонавтов' и 'Алишера Навои').";
  }

  return { preferences: prefs, days, unusedHighScoreObjects, intercityTip };
}

/**
 * Скоринг гидов под маршрут
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
