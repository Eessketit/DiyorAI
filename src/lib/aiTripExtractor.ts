import {
  Category,
  DurationModel,
  Region,
  TravelersModel,
  TripPlan,
  TripPreferences,
  TourismObject,
  TripDay,
} from "./types";
import objectsData from "@/data/objects.json";
import { planTrip } from "./tripPlanner";

const OBJECTS = objectsData as TourismObject[];

export interface ParsedTripIntent {
  regions: Region[];
  primaryRegion: Region;
  totalDays: number;
  activeDays: number;
  restDays: number;
  travelers: TravelersModel;
  budgetMaxUsd: number;
  interests: Category[];
  departureCity?: string;
}

const REGION_KEYWORDS: Record<string, Region> = {
  "самарканд": "samarkand",
  "samarkand": "samarkand",
  "samarqand": "samarkand",
  "бухара": "bukhara",
  "bukhara": "bukhara",
  "buxoro": "bukhara",
  "хива": "khiva",
  "khiva": "khiva",
  "xiva": "khiva",
  "ургенч": "khiva",
  "urgench": "khiva",
  "urganch": "khiva",
  "нукус": "nukus",
  "nukus": "nukus",
  "каракалпак": "nukus",
  "karakalpak": "nukus",
  "арал": "nukus",
  "aral": "nukus",
  "ташкент": "tashkent",
  "tashkent": "tashkent",
  "toshkent": "tashkent",
  "чарвак": "tashkent_region",
  "чимган": "tashkent_region",
  "амирсой": "tashkent_region",
  "charvak": "tashkent_region",
  "chorvoq": "tashkent_region",
  "chimgan": "tashkent_region",
  "chimyon": "tashkent_region",
  "amirsoy": "tashkent_region",
  "бельдерсай": "tashkent_region",
  "фергана": "fergana",
  "fergana": "fergana",
  "farg'ona": "fergana",
  "шахрисабз": "shahrisabz",
  "shahrisabz": "shahrisabz",
  "карши": "shahrisabz",
  "термез": "termez",
  "termez": "termez",
  "termiz": "termez",
  "андижан": "andijan",
  "andijan": "andijan",
  "andijon": "andijan",
  "наманган": "namangan",
  "namangan": "namangan",
  "навои": "navoi",
  "navoi": "navoi",
  "navoiy": "navoi",
  "джизак": "jizzakh",
  "jizzakh": "jizzakh",
  "jizzax": "jizzakh",
};

/**
 * Extracts structured travel parameters from free-form user message
 */
export function extractTripIntentFromText(text: string): ParsedTripIntent | null {
  const lower = text.toLowerCase();

  // Check if message is a planning intent
  const planKeywords = [
    "тур", "маршрут", "поездк", "план", "хочу поеха", "составь", "путешеств", "хочу тур", "спланируй",
    "trip", "tour", "itinerary", "plan", "travel", "vacation",
    "sayohat", "tur", "reja", "borish", "bormoqchiman"
  ];
  const hasPlanIntent = planKeywords.some((k) => lower.includes(k));

  // Extract identified regions
  const matchedRegions: Region[] = [];
  Object.entries(REGION_KEYWORDS).forEach(([kw, reg]) => {
    if (lower.includes(kw) && !matchedRegions.includes(reg)) {
      matchedRegions.push(reg);
    }
  });

  if (!hasPlanIntent && matchedRegions.length === 0) {
    return null;
  }

  // 1. Duration (days / weeks)
  let totalDays = 3;
  if (lower.includes("недел") || lower.includes("week") || lower.includes("hafta") || lower.includes("7 дн") || lower.includes("7 дней")) {
    totalDays = 7;
  } else if (lower.includes("2 недел") || lower.includes("2 weeks") || lower.includes("14 дн") || lower.includes("14 дней")) {
    totalDays = 14;
  } else {
    const daysMatch = lower.match(/(\d+)\s*(?:дней|дня|день|days|day|kun)/i);
    if (daysMatch) {
      const parsed = parseInt(daysMatch[1], 10);
      if (parsed > 0 && parsed <= 30) totalDays = parsed;
    }
  }

  // 2. Rest days extraction
  let restDays = 0;
  const restMatch = lower.match(/(?:отдых\w*|rest\w*|dam\s*olish\w*)\s*(\d+)\s*(?:дн|day|kun)/i) ||
                    lower.match(/(\d+)\s*(?:дн|day|kun)\s*(?:отдых\w*|релакс|rest|dam)/i);
  if (restMatch) {
    restDays = Math.min(parseInt(restMatch[1], 10), Math.max(0, totalDays - 1));
  } else if (totalDays >= 7) {
    // Default sensible rest day ratio for weekly trips
    restDays = Math.max(1, Math.floor(totalDays * 0.25));
  }
  const activeDays = Math.max(1, totalDays - restDays);

  // 3. Travelers (adults + children + type)
  let adults = 2;
  let children = 0;
  let travelerType: TravelersModel["type"] = "couple";

  const hasChild = lower.includes("ребенок") || lower.includes("ребёнок") || lower.includes("дети") ||
                   lower.includes("детям") || lower.includes("дочь") || lower.includes("сын") ||
                   lower.includes("child") || lower.includes("kid") || lower.includes("bola");

  const hasWifeOrHusband = lower.includes("жена") || lower.includes("муж") || lower.includes("супруг") ||
                           lower.includes("семь") || lower.includes("family") || lower.includes("oila");

  // People count matches
  const peopleMatch = lower.match(/(\d+)\s*(?:человек|чел|людей|people|kishi|pers)/i);
  if (peopleMatch) {
    const count = parseInt(peopleMatch[1], 10);
    if (hasChild) {
      children = 1;
      adults = Math.max(1, count - 1);
    } else {
      adults = count;
    }
  } else if (lower.includes("я один") || lower.includes("одна") || lower.includes("solo") || lower.includes("yolg'iz")) {
    adults = 1;
    children = 0;
    travelerType = "solo";
  }

  if (hasChild || (hasWifeOrHusband && adults >= 2)) {
    travelerType = "family";
    if (children === 0 && hasChild) children = 1;
  } else if (adults === 2 && children === 0) {
    travelerType = "couple";
  } else if (adults > 2) {
    travelerType = "friends";
  }

  const totalTravelers = adults + children;

  // 4. Budget
  let budgetMaxUsd = 600;
  const budgetMatch = lower.match(/(?:\$|доллар\w*|usd|бюджет\w*|budget\w*)\s*(\d+)/i) ||
                      lower.match(/(\d+)\s*(?:\$|usd|доллар|дол)/i);
  if (budgetMatch) {
    const val = parseInt(budgetMatch[1], 10);
    if (val >= 50 && val <= 50000) budgetMaxUsd = val;
  } else if (totalDays >= 7) {
    budgetMaxUsd = 1200;
  }

  // 5. Interests
  const interests: Category[] = ["history", "architecture", "gastronomy"];
  if (lower.includes("природ") || lower.includes("гор") || lower.includes("горы") || lower.includes("nature") || lower.includes("mountain")) {
    interests.push("nature", "nature_hiking");
  }
  if (lower.includes("еда") || lower.includes("плов") || lower.includes("шашлык") || lower.includes("gastro") || lower.includes("taom")) {
    if (!interests.includes("gastronomy")) interests.push("gastronomy");
  }
  if (lower.includes("базар") || lower.includes("ремесл") || lower.includes("сувенир") || lower.includes("bazaar") || lower.includes("bozor")) {
    interests.push("crafts_bazaars");
  }

  const primaryRegion = matchedRegions[0] || "samarkand";

  return {
    regions: matchedRegions.length > 0 ? matchedRegions : ["samarkand"],
    primaryRegion,
    totalDays,
    activeDays,
    restDays,
    travelers: {
      type: travelerType,
      adults,
      children,
      total: totalTravelers,
    },
    budgetMaxUsd,
    interests,
    departureCity: lower.includes("ташкент") ? "Ташкент" : "Ташкент",
  };
}

/**
 * Builds a multi-city or single-region TripPlan object from ParsedTripIntent
 */
export function generateAiTripPlan(intent: ParsedTripIntent): TripPlan {
  const { regions, totalDays, activeDays, restDays, travelers, budgetMaxUsd, interests, primaryRegion } = intent;

  // Base preferences
  const prefs: TripPreferences = {
    region: primaryRegion,
    interests,
    duration: {
      totalDays,
      activeDays,
      restDays,
    },
    travelers,
    pace: "balanced",
    budget: {
      maxAmount: budgetMaxUsd,
    },
    soloTraveler: travelers.type === "solo",
  };

  // If multi-city, distribute days across regions
  if (regions.length > 1) {
    const days: TripDay[] = [];
    const daysPerCity = Math.max(1, Math.floor(activeDays / regions.length));
    let dayCounter = 1;

    regions.forEach((reg, regIdx) => {
      const cityDaysCount = regIdx === regions.length - 1
        ? Math.max(1, activeDays - (dayCounter - 1))
        : daysPerCity;

      // Filter objects for this specific region
      const cityObjects = OBJECTS.filter((o) => o.region === reg)
        .slice(0, cityDaysCount * 3);

      for (let d = 0; d < cityDaysCount; d++) {
        const stopsForDay = cityObjects.slice(d * 3, (d + 1) * 3).map((obj) => ({
          ...obj,
          score: 0.95,
          approxCostUsd: obj.approxCostUsd || (obj.ticketPriceUzs?.foreigner ? Math.round(obj.ticketPriceUzs.foreigner / 12800) : 4),
        }));

        days.push({
          dayNumber: dayCounter++,
          stops: stopsForDay.length > 0 ? stopsForDay : [
            {
              id: `${reg}-hub-${d}`,
              name: `Исторический центр (${reg.toUpperCase()})`,
              city: reg,
              region: reg,
              categories: ["history", "architecture"],
              lat: 39.6547 + (regIdx * 0.1),
              lon: 66.9758 + (regIdx * 0.1),
              description: `Экскурсионная программа по знаковым местам региона ${reg}.`,
              popularity: 10,
              approxCostUsd: 5,
              score: 0.95,
            },
          ],
        });
      }
    });

    // Insert rest days if any
    if (restDays > 0) {
      for (let r = 0; r < restDays; r++) {
        days.splice(Math.min(days.length, Math.floor((days.length + 1) / 2)), 0, {
          dayNumber: 0, // will renumber
          isRestDay: true,
          stops: [],
        });
      }
      // Renumber
      days.forEach((day, idx) => {
        day.dayNumber = idx + 1;
      });
    }

    return {
      preferences: prefs,
      days: days.slice(0, totalDays),
      transport: {
        type: "train",
        departureCity: "Ташкент",
        destinationCity: regions[0] === "samarkand" ? "Самарканд" : "Бухара",
        train: {
          id: "train-afrosiyob-multi",
          name: "Скоростной поезд Afrosiyob",
          trainNumber: "762Ф",
          fromCity: "Ташкент",
          toCity: regions[0] === "samarkand" ? "Самарканд" : "Бухара",
          departureTime: "08:00",
          arrivalTime: "10:15",
          duration: "2ч 15м",
          trainClass: "economy",
          pricePerPassengerUsd: 22,
        },
        isRoundTrip: true,
        passengers: travelers.total,
        totalCostUsd: travelers.total * 22 * regions.length,
      },
      transfer: {
        vehicle: {
          id: "tr-sedan-standard",
          className: "comfort",
          title: "Комфортный семейный седан / Минивэн",
          brand: "Chevrolet",
          model: "Cobalt / Lacetti",
          year: 2024,
          passengerCapacity: 4,
          luggageCapacity: 3,
          photoUrl: "🚗",
          priceOneWayUsd: 20,
        },
        numberOfCars: travelers.total > 4 ? 2 : 1,
        isRoundTrip: true,
        totalCostUsd: 35 * regions.length * (travelers.total > 4 ? 2 : 1),
      },
      hotel: {
        hotel: {
          id: "ht-heritage-boutique",
          name: "Boutique Heritage Silk Road Hotel 3-4*",
          region: primaryRegion,
          city: primaryRegion,
          rating: 4.8,
          location: "Исторический центр, рядом с главными памятниками",
          photoUrl: "🏨",
          pricePerNightUsd: 55,
          roomType: "Family Suite / Double Deluxe",
          roomCapacity: Math.max(3, travelers.total),
          amenities: ["Завтрак включен", "Wi-Fi", "Кондиционер", "Детская кроватка"],
          category: "comfort",
        },
        nights: Math.max(1, totalDays - 1),
        numberOfRooms: travelers.total > 3 ? 2 : 1,
        totalCostUsd: 55 * Math.max(1, totalDays - 1) * (travelers.total > 3 ? 2 : 1),
      },
    };
  }

  // Single region generation via standard tripPlanner
  return planTrip(prefs);
}
