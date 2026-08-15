import { Language } from "./i18n";
import { Region } from "./types";

export interface DayWeather {
  dayNumber: number;
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  condition: string;
  icon: "sun" | "cloud-sun" | "cloud" | "rain" | "hot";
}

export interface WeatherReport {
  region: Region;
  currentTemp: number;
  days: DayWeather[];
  advice: string;
  isHot: boolean;
  isRainy: boolean;
}

export const REGION_COORDINATES: Record<Region, { lat: number; lon: number }> = {
  samarkand: { lat: 39.6542, lon: 66.9597 },
  bukhara: { lat: 39.7747, lon: 64.4286 },
  khiva: { lat: 41.3783, lon: 60.3639 },
  tashkent: { lat: 41.2995, lon: 69.2401 },
  tashkent_region: { lat: 41.5273, lon: 70.0768 },
  fergana: { lat: 40.3842, lon: 71.7843 },
  andijan: { lat: 40.7821, lon: 72.3442 },
  namangan: { lat: 40.9983, lon: 71.6726 },
  shahrisabz: { lat: 39.0567, lon: 66.8286 },
  termez: { lat: 37.2242, lon: 67.2783 },
  nukus: { lat: 42.4602, lon: 59.6166 },
  navoi: { lat: 40.0844, lon: 65.3792 },
  jizzakh: { lat: 40.1158, lon: 67.8422 },
  syrdarya: { lat: 40.4897, lon: 68.7842 },
};

function getWeatherCondition(code: number, tempMax: number, lang: Language): { condition: string; icon: DayWeather["icon"] } {
  if (tempMax >= 33) {
    const titles = {
      ru: "Жарко и солнечно",
      uz: "Issiq va quyoshli",
      en: "Hot & Sunny",
    };
    return { condition: titles[lang], icon: "hot" };
  }

  if (code === 0 || code === 1) {
    const titles = {
      ru: "Ясно, солнечно",
      uz: "Ochiq, quyoshli",
      en: "Clear & Sunny",
    };
    return { condition: titles[lang], icon: "sun" };
  }

  if (code === 2) {
    const titles = {
      ru: "Переменная облачность",
      uz: "O'zgaruvchan bulutli",
      en: "Partly Cloudy",
    };
    return { condition: titles[lang], icon: "cloud-sun" };
  }

  if (code === 3) {
    const titles = {
      ru: "Пасмурно",
      uz: "Bulutli",
      en: "Overcast",
    };
    return { condition: titles[lang], icon: "cloud" };
  }

  if (code >= 51 && code <= 67) {
    const titles = {
      ru: "Возможен дождь",
      uz: "Yomg'ir yog'ishi mumkin",
      en: "Light Rain",
    };
    return { condition: titles[lang], icon: "rain" };
  }

  const defaultTitles = {
    ru: "Комфортная погода",
    uz: "Qulay ob-havo",
    en: "Pleasant Weather",
  };
  return { condition: defaultTitles[lang], icon: "sun" };
}

function generateSmartAdvice(avgTempMax: number, hasRain: boolean, lang: Language): string {
  if (avgTempMax >= 32) {
    const advice = {
      ru: "☀️ Высокая дневная температура (+32°C и выше). Рекомендуем посещать открытые ансамбли (Регистан, Ичан-Кала) утром (до 11:00) или на закате. В полуденные часы (12:00–16:00) отдайте предпочтение крытым музеям, мавзолеям и тенистым чайханам.",
      uz: "☀️ Kunduzi yuqori harorat (+32°C va undan yuqori). Ochiq maydonlarni (Registon, Ichan-Qal'a) ertalab (11:00 gacha) yoki quyosh botishida ziyorat qilishni tavsiya qilamiz. Tush paytida (12:00–16:00) yopiq muzeylar va salqin choyxonalarni tanlang.",
      en: "☀️ High daytime temperature (+32°C and above). We recommend visiting open architectural squares (Registan, Ichan-Kala) in the early morning (before 11:00) or at sunset. Visit indoor museums and shaded tea-houses during the midday heat (12:00–16:00).",
    };
    return advice[lang];
  }

  if (hasRain) {
    const advice = {
      ru: "🌧️ Возможны осадки во время поездки. Рекомендуем взять зонт и включить в дневной план больше музейных комплексов и крытых ремесленных мастерских.",
      uz: "🌧️ Sayohat davomida yomg'ir yog'ishi ehtimoli bor. Soyabon olishni va muzeylar hamda yopiq ustaxonalarga ko'proq vaqt ajratishni tavsiya etamiz.",
      en: "🌧️ Rain is possible during the trip. We recommend packing an umbrella and scheduling more indoor museum visits and covered craft workshops.",
    };
    return advice[lang];
  }

  const advice = {
    ru: "🌤️ Идеальные погодные условия для пеших экскурсий (+24…+28°C). Маршрут оптимизирован для непрерывных комфортных прогулок между объектами.",
    uz: "🌤️ Piyoda sayr qilish uchun ideal ob-havo sharoiti (+24…+28°C). Yo'nalish obyektlar o'rtasida qulay sayohat qilish uchun moslashtirilgan.",
    en: "🌤️ Ideal weather conditions for walking tours (+24…+28°C). The itinerary is well-balanced for comfortable walking between stops.",
  };
  return advice[lang];
}

export async function fetchWeatherForTrip(
  region: Region,
  daysCount: number,
  lang: Language = "ru"
): Promise<WeatherReport> {
  const coords = REGION_COORDINATES[region] || REGION_COORDINATES.samarkand;
  const count = Math.min(Math.max(daysCount, 1), 7);

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API failed");
    const data = await res.json();

    const daily = data.daily;
    const days: DayWeather[] = [];

    let totalMax = 0;
    let hasRain = false;

    for (let i = 0; i < count; i++) {
      const tempMax = Math.round(daily.temperature_2m_max[i] ?? 31);
      const tempMin = Math.round(daily.temperature_2m_min[i] ?? 19);
      const code = daily.weather_code[i] ?? 0;
      const { condition, icon } = getWeatherCondition(code, tempMax, lang);

      if (code >= 51 && code <= 67) hasRain = true;
      totalMax += tempMax;

      days.push({
        dayNumber: i + 1,
        date: daily.time[i] ?? `День ${i + 1}`,
        tempMax,
        tempMin,
        weatherCode: code,
        condition,
        icon,
      });
    }

    const avgMax = Math.round(totalMax / count);

    return {
      region,
      currentTemp: days[0]?.tempMax ?? 30,
      days,
      advice: generateSmartAdvice(avgMax, hasRain, lang),
      isHot: avgMax >= 32,
      isRainy: hasRain,
    };
  } catch {
    // Stable Fallback with realistic climate averages for Uzbekistan
    const fallbackTemps: Record<Region, { max: number; min: number }> = {
      samarkand: { max: 32, min: 19 },
      bukhara: { max: 34, min: 21 },
      khiva: { max: 35, min: 20 },
      tashkent: { max: 31, min: 18 },
      tashkent_region: { max: 26, min: 14 },
      fergana: { max: 30, min: 18 },
      andijan: { max: 29, min: 17 },
      namangan: { max: 30, min: 17 },
      shahrisabz: { max: 33, min: 19 },
      termez: { max: 37, min: 23 },
      nukus: { max: 34, min: 19 },
      navoi: { max: 34, min: 20 },
      jizzakh: { max: 28, min: 16 },
      syrdarya: { max: 32, min: 19 },
    };

    const climate = fallbackTemps[region] || { max: 31, min: 19 };
    const days: DayWeather[] = [];

    for (let i = 0; i < count; i++) {
      const tempMax = climate.max + (i % 2 === 0 ? 0 : 1);
      const tempMin = climate.min + (i % 2 === 0 ? 0 : 1);
      const { condition, icon } = getWeatherCondition(0, tempMax, lang);

      days.push({
        dayNumber: i + 1,
        date: `2026-08-${15 + i}`,
        tempMax,
        tempMin,
        weatherCode: 0,
        condition,
        icon,
      });
    }

    return {
      region,
      currentTemp: climate.max,
      days,
      advice: generateSmartAdvice(climate.max, false, lang),
      isHot: climate.max >= 32,
      isRainy: false,
    };
  }
}

export interface WeatherAlternative {
  id: string;
  originalType: "mountain" | "outdoor";
  replacementName: { ru: string; uz: string; en: string };
  replacementDesc: { ru: string; uz: string; en: string };
  category: "museum" | "gastronomy" | "crafts" | "indoor";
  icon: string;
}

export function getWeatherAlternatives(region: Region, isRainy: boolean, isHot: boolean): WeatherAlternative[] {
  if (!isRainy && !isHot) return [];

  const alternatives: WeatherAlternative[] = [
    {
      id: "alt-museum-art",
      originalType: "mountain",
      replacementName: {
        ru: "Государственный музей искусств & Исторические залы",
        uz: "Davlat san'at muzeyi va tarix zallari",
        en: "State Museum of Fine Arts & Heritage Halls",
      },
      replacementDesc: {
        ru: "Комфортная крытая экспозиция с климат-контролем: редкие образцы согдийской живописи, чеканка и текстиль.",
        uz: "Iqlim nazorati bilan qulay yopiq ko'rgazma: so'g'd san'ati durdonalari, zardo'zlik va qadimiy matolar.",
        en: "Climate-controlled indoor gallery: rare Sogdian frescoes, copper engraving & oriental textiles.",
      },
      category: "museum",
      icon: "🏛️",
    },
    {
      id: "alt-gastro-masterclass",
      originalType: "outdoor",
      replacementName: {
        ru: "Гастрономический мастер-класс по плову & чайная церемония",
        uz: "Osh tayyorlash mahorat darsi va choy marosimi",
        en: "Authentic Plov Masterclass & Traditional Tea Ceremony",
      },
      replacementDesc: {
        ru: "Уютный крытый мастер-класс от потомственного ошпаза в традиционном дворике с дегустацией сладостей.",
        uz: "Tajribali oshpazdan an'anaviy shinam hovlida osh damlash sirlari va milliy shirinliklar degustatsiyasi.",
        en: "Cozy indoor culinary workshop with a master chef in a shaded courtyard with halva tasting.",
      },
      category: "gastronomy",
      icon: "🥘",
    },
    {
      id: "alt-ceramics-workshop",
      originalType: "outdoor",
      replacementName: {
        ru: "Гончарная мастерская & Керамика Риштана/Гиждувана",
        uz: "Kulolchilik ustaxonasi & Rishton/G'ijduvon sopol san'ati",
        en: "Artisan Ceramics Studio & Pottery Masterclass",
      },
      replacementDesc: {
        ru: "Создание собственного глиняного кувшина на гончарном круге в аутентичной мастерской ремесленников.",
        uz: "Haqiqiy hunarmandlar ustaxonasida charxda o'z qo'lingiz bilan sopol ko'za yasash amaliyoti.",
        en: "Hands-on pottery on the potter's wheel inside an authentic craftsman studio.",
      },
      category: "crafts",
      icon: "🏺",
    },
  ];

  return alternatives;
}

