import objectsData from "@/data/objects.json";
import guidesData from "@/data/guides.json";
import { calculateTripCost } from "./costCalculator";
import {
  Category,
  Guide,
  PACE_PER_DAY,
  SelectedHotel,
  SelectedTransfer,
  SelectedTransport,
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
 *         + w3 * соответствие формату группы (семья, соло, пара, друзья)
 *         + w4 * бюджет и темп
 */
export function scoreObject(obj: TourismObject, prefs: TripPreferences): number {
  const W_INTEREST = 0.60;
  const W_POPULARITY = 0.20;
  const W_GROUP = 0.20;

  const matchCount = obj.categories.filter((c) => prefs.interests.includes(c)).length;
  const interestScore =
    prefs.interests.length === 0 ? 0.5 : matchCount / Math.max(prefs.interests.length, obj.categories.length);
  const popularityScore = obj.popularity / 10;

  let groupBonus = 0.5;
  const groupType = prefs.travelers?.type || prefs.groupType || "couple";

  if (groupType === "family") {
    if (obj.isIndoor) groupBonus += 0.3;
    if (prefs.travelers?.children && prefs.travelers.children > 0 && obj.categories.includes("nature")) {
      groupBonus += 0.25;
    }
  } else if (groupType === "solo") {
    if (obj.popularity >= 9) groupBonus += 0.3;
    if (obj.categories.includes("history")) groupBonus += 0.15;
  } else if (groupType === "friends") {
    if (obj.categories.includes("gastronomy") || obj.categories.includes("nature_hiking")) {
      groupBonus += 0.3;
    }
  } else if (groupType === "couple") {
    if (obj.bestTimeSlot === "evening" || obj.categories.includes("architecture")) {
      groupBonus += 0.25;
    }
  }

  // Budget bonus: for low budget, prioritize free/inexpensive entries
  const budgetRange = typeof prefs.budget === "object" ? prefs.budget?.range : prefs.budget;
  if ((budgetRange === "under_200" || budgetRange === "budget") && (obj.approxCostUsd === 0 || !obj.approxCostUsd)) {
    groupBonus += 0.2;
  }

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
    const transitMinutes = Math.max(5, Math.round(transitDist * 8));

    const approxEntryCostUsd = s.approxCostUsd ?? (s.ticketPriceUzs?.foreigner ? Math.round(s.ticketPriceUzs.foreigner / 12800) : 0);

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
      estimatedCostUsd: approxEntryCostUsd,
    };
  });
}

/**
 * Строит полный маршрут с учетом интересов, группы, бюджета, дней отдыха и выбранных услуг
 */
export function planTrip(
  prefs: TripPreferences,
  selectedServices?: {
    transport?: SelectedTransport;
    transfer?: SelectedTransfer;
    hotel?: SelectedHotel;
  }
): TripPlan {
  const totalDays = prefs.duration?.totalDays || prefs.days || 3;
  const activeDays = prefs.duration?.activeDays || totalDays;
  const restDays = prefs.duration?.restDays || Math.max(0, totalDays - activeDays);

  const perDay = PACE_PER_DAY[prefs.pace] || 3;
  const capacity = Math.max(1, activeDays) * perDay;

  // Filter candidates by region (or fallback to tashkent if region is tashkent_region and list is short)
  let candidates = OBJECTS.filter((o) => o.region === prefs.region)
    .map((o) => ({ ...o, score: scoreObject(o, prefs) }))
    .sort((a, b) => b.score - a.score);

  if (candidates.length === 0) {
    candidates = OBJECTS.map((o) => ({ ...o, score: scoreObject(o, prefs) })).sort((a, b) => b.score - a.score);
  }

  const selected = candidates.slice(0, capacity);
  const unusedHighScoreObjects = candidates.slice(capacity);
  const ordered = orderByNearestNeighbor(selected);

  // Distribute active days and rest days
  const days: TripDay[] = [];
  let activeCursor = 0;

  // Schedule template: if restDays > 0, insert rest days naturally
  // e.g. for 5 days with 2 rest days: Active (1), Active (2), Rest (3), Active (4), Rest (5)
  const isRestDayMap: boolean[] = [];
  if (restDays === 0) {
    for (let d = 0; d < totalDays; d++) isRestDayMap.push(false);
  } else {
    const interval = Math.max(2, Math.floor(totalDays / (restDays + 1)));
    let restAssigned = 0;
    for (let d = 1; d <= totalDays; d++) {
      if (d % interval === 0 && restAssigned < restDays && d < totalDays) {
        isRestDayMap.push(true);
        restAssigned++;
      } else {
        isRestDayMap.push(false);
      }
    }
    // If some rest days remain, place them towards the end
    while (restAssigned < restDays) {
      for (let i = totalDays - 1; i >= 0; i--) {
        if (!isRestDayMap[i]) {
          isRestDayMap[i] = true;
          restAssigned++;
          break;
        }
      }
    }
  }

  for (let i = 0; i < totalDays; i++) {
    const isRest = isRestDayMap[i] || false;
    const dayNum = i + 1;

    if (isRest) {
      // Rest Day representation
      const restStops: (TourismObject & { score: number })[] = [
        {
          id: `rest-day-${dayNum}-morning`,
          name: "🌿 Утро релакса: Неспешный завтрак и восточная чайхана",
          city: prefs.region === "tashkent_region" ? "Горы" : "Старый город",
          region: prefs.region,
          categories: ["gastronomy", "nature"],
          lat: 0,
          lon: 0,
          description: "Время без спешки: свежеиспеченные лепешки, душистый зеленый чай с шафраном и восточные сладости.",
          popularity: 9,
          bestTimeSlot: "morning",
          score: 1,
          approxCostUsd: 6,
        },
        {
          id: `rest-day-${dayNum}-evening`,
          name: "🍵 Вечерний спа / Променад и сувенирные лавки",
          city: prefs.region === "tashkent_region" ? "Горы" : "Центр",
          region: prefs.region,
          categories: ["crafts_bazaars"],
          lat: 0,
          lon: 0,
          description: "Неспешная вечерняя прогулка, покупка керамики и шелка ручной работы, отдых в спа или у бассейна.",
          popularity: 9,
          bestTimeSlot: "evening",
          score: 1,
          approxCostUsd: 10,
        },
      ];

      days.push({
        dayNumber: dayNum,
        isRestDay: true,
        title: "🌿 День отдыха и восстановления",
        summary: "Свободное время для релакса, гастрономии, спа и неспешных прогулок.",
        stops: restStops,
        timelineStops: assignClimateSlots(restStops, dayNum),
        estimatedTotalKm: 5,
      });
    } else {
      const rawStops = ordered.slice(activeCursor * perDay, (activeCursor + 1) * perDay);
      activeCursor++;
      const timelineStops = assignClimateSlots(rawStops, dayNum);

      let dayKm = 0;
      for (let j = 1; j < rawStops.length; j++) {
        dayKm += distanceKm(rawStops[j - 1], rawStops[j]);
      }

      days.push({
        dayNumber: dayNum,
        isRestDay: false,
        title: `День ${dayNum}: Активные экскурсии и открытия`,
        stops: rawStops,
        timelineStops,
        estimatedTotalKm: Math.round(dayKm * 10) / 10,
      });
    }
  }

  // Calculate financial cost
  const budgetMax = (typeof prefs.budget === "object" ? prefs.budget?.maxAmount : 500) || 500;
  const travelers = prefs.travelers || {
    type: (prefs.groupType || (prefs.soloTraveler ? "solo" : "couple")) as any,
    adults: prefs.soloTraveler ? 1 : 2,
    children: 0,
    total: prefs.soloTraveler ? 1 : 2,
  };
  const duration = prefs.duration || {
    totalDays,
    activeDays,
    restDays,
  };

  const costCalc = calculateTripCost({
    travelers,
    duration,
    budgetMaxUsd: budgetMax,
    transport: selectedServices?.transport,
    transfer: selectedServices?.transfer,
    hotel: selectedServices?.hotel,
  });

  // Intercity & regional tips
  let intercityTip: string | undefined;
  if (prefs.region === "samarkand" || prefs.region === "bukhara") {
    intercityTip =
      "🚆 Рекомендация по транспорту: Из Ташкента в Самарканд и Бухару удобнее всего добираться на скоростном поезде Afrosiyob (2ч 15м). Бронируйте билеты за 45 дней на railway.uz!";
  } else if (prefs.region === "tashkent") {
    intercityTip =
      "🚕 Транспорт в Ташкенте: По городу комфортно передвигаться на Yandex Go (от 15 000 сум) и на станциях метро Ташкента (особенно 'Космонавтов' и 'Алишера Навои').";
  } else if (prefs.region === "tashkent_region") {
    intercityTip =
      "🏔️ Транспорт в горы: До Чарвака и Амирсоя легко добраться на индивидуальном комфорт-трансфере или электропоезде до Ходжикента. В горах рекомендуем иметь легкую ветровку и удобную обувь.";
  }

  return {
    preferences: prefs,
    days,
    unusedHighScoreObjects,
    intercityTip,
    transport: selectedServices?.transport,
    transfer: selectedServices?.transfer,
    hotel: selectedServices?.hotel,
    costBreakdown: costCalc.breakdown,
    payerSplit: costCalc.payerSplit,
    isOverBudget: costCalc.isOverBudget,
    budgetRemainingUsd: costCalc.budgetRemainingUsd,
    costPerPersonUsd: costCalc.costPerPersonUsd,
  };
}

/** Скоринг гидов под маршрут */
export function scoreGuides(region: string, interests: Category[]): (Guide & { matchScore: number })[] {
  const queryRegion = region === "tashkent_region" ? "tashkent" : region;
  return GUIDES.filter((g) => g.region === queryRegion)
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
