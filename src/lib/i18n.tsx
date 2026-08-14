import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Category, Pace, Region, TrustLevel } from "./types";

export type Language = "ru" | "uz" | "en";

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    trip: string;
    verify: string;
    guides: string;
  };
  footer: {
    rights: string;
    sources: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    whereTo: string;
    whatInterests: string;
    howManyDays: string;
    pace: string;
    soloTraveler: string;
    buildTrip: string;
    building: string;
    selectAtLeastOne: string;
    buildError: string;
    features: {
      routeTitle: string;
      routeDesc: string;
      verifyTitle: string;
      verifyDesc: string;
      guidesTitle: string;
      guidesDesc: string;
    };
  };
  trip: {
    title: string;
    day: string;
    days: string;
    empty: string;
    verifyFacts: string;
    soloNotice: string;
    findGuidesForRoute: string;
    recalculate: string;
    notBuiltTitle: string;
    notBuiltDesc: string;
    backToForm: string;
    loading: string;
  };
  verify: {
    badge: string;
    title: string;
    subtitle: string;
    objectLabel: string;
    queryLabel: string;
    placeholder: string;
    button: string;
    checking: string;
    matchedTitle: string;
    noMatchTitle: string;
    listedTitle: string;
    source: string;
    verifiedAt: string;
  };
  guides: {
    badge: string;
    title: string;
    subtitle: string;
    regionFilter: string;
    specFilter: string;
    demoBadge: string;
    rating: string;
    match: string;
    empty: string;
  };
  weather: {
    title: string;
    forecast: string;
    smartAdvice: string;
    temp: string;
    condition: {
      clear: string;
      partlyCloudy: string;
      cloudy: string;
      rain: string;
      hot: string;
    };
  };
  categories: Record<Category, string>;
  regions: Record<Region, string>;
  paces: Record<Pace, string>;
  trustLevels: Record<TrustLevel, string>;
}

export const translations: Record<Language, Translations> = {
  ru: {
    appName: "DiyorAI",
    appSubtitle: "Единый цифровой туристический помощник",
    tagline: "Спутник в пути по Узбекистану",
    nav: {
      trip: "Маршрут",
      verify: "Проверка факта",
      guides: "Гиды",
    },
    footer: {
      rights: "DiyorAI — цифровой туристический помощник. Хакатон NEXUS30 (TravelTech).",
      sources: "Данные: OpenStreetMap, Wikidata, Wikipedia (открытые источники)",
    },
    home: {
      badge: "Комитет по туризму Узбекистана & TravelTech",
      title: "Спутник в пути по Узбекистану",
      subtitle:
        "Один цифровой помощник вместо трёх сервисов: собирает персонализированный маршрут с учетом погоды, проверяет достоверность фактов гида и находит проверенных экспертов.",
      whereTo: "Куда едем?",
      whatInterests: "Что вам интересно?",
      howManyDays: "Сколько дней?",
      pace: "Темп поездки",
      soloTraveler: "Я путешествую один / одна (соло-путешественник)",
      buildTrip: "Построить маршрут",
      building: "Формируем маршрут…",
      selectAtLeastOne: "Выберите хотя бы один интерес — без этого маршрут строить не из чего.",
      buildError: "Не удалось построить маршрут. Попробуйте ещё раз.",
      features: {
        routeTitle: "1. Умный маршрут",
        routeDesc: "Алгоритмический подбор с учетом погоды, плотности и порядка посещения объектов по дням.",
        verifyTitle: "2. Проверка фактов",
        verifyDesc: "Сверяйте утверждения гида с базой подтвержденных первоисточников без выдумок.",
        guidesTitle: "3. Подбор гида",
        guidesDesc: "Поиск сертифицированных специалистов с максимальным совпадением под ваш маршрут.",
      },
    },
    trip: {
      title: "Ваш маршрут",
      day: "День",
      days: "дней",
      empty: "Под выбранные интересы в этом регионе пока нет объектов в базе. Попробуйте другой регион.",
      verifyFacts: "Проверить факты →",
      soloNotice:
        "Вы путешествуете в одиночку — для вечерних прогулок и удалённых локаций система рекомендует проверенное сопровождение гида.",
      findGuidesForRoute: "Найти гида под этот маршрут",
      recalculate: "Пересчитать маршрут",
      notBuiltTitle: "Маршрут ещё не построен",
      notBuiltDesc: "Заполните форму на главной, чтобы получить персональный маршрут.",
      backToForm: "Вернуться к форме",
      loading: "Загрузка маршрута…",
    },
    verify: {
      badge: "Проверка информации & Анти-мифы",
      title: "Что на самом деле рассказал гид?",
      subtitle:
        "Выберите туристический объект и проверьте факты по открытым достоверным источникам.",
      objectLabel: "Объект",
      queryLabel: "Что рассказал гид? (необязательно)",
      placeholder: "Например: минарет пережил монгольское нашествие в 1220 году",
      button: "Проверить факт",
      checking: "Сверяем с источниками…",
      matchedTitle: "Найдено подтверждение в базе проверенных фактов:",
      noMatchTitle:
        "Прямого совпадения не найдено. Ниже представлены наиболее близкие факты об объекте:",
      listedTitle: "Все проверенные факты об объекте:",
      source: "Источник",
      verifiedAt: "Сверено",
    },
    guides: {
      badge: "Реестр гидов & Умный скоринг",
      title: "Подходящий гид под ваш маршрут",
      subtitle:
        "Каталог специалистов со скорингом соответствия вашим предпочтениям и выбранному городу.",
      regionFilter: "Регион",
      specFilter: "Специализация",
      demoBadge: "Демо-данные",
      rating: "рейтинг",
      match: "совпадение",
      empty: "В этом регионе пока нет гидов в демо-базе. Попробуйте другой регион.",
    },
    weather: {
      title: "Прогноз погоды и умные рекомендации",
      forecast: "Прогноз на время поездки",
      smartAdvice: "Рекомендация по маршруту",
      temp: "Температура",
      condition: {
        clear: "Ясно, солнечно",
        partlyCloudy: "Переменная облачность",
        cloudy: "Пасмурно",
        rain: "Возможен дождь",
        hot: "Жаркая погода",
      },
    },
    categories: {
      history: "История",
      architecture: "Архитектура",
      pilgrimage: "Паломничество",
      nature: "Природа",
      gastronomy: "Гастрономия",
    },
    regions: {
      samarkand: "Самарканд",
      bukhara: "Бухара",
      khiva: "Хива",
      tashkent: "Ташкент",
    },
    paces: {
      relaxed: "Спокойный (2 объекта в день)",
      balanced: "Сбалансированный (3 объекта в день)",
      packed: "Насыщенный (4 объекта в день)",
    },
    trustLevels: {
      high: "Высокая достоверность",
      medium: "Средняя достоверность",
      low: "Требует перепроверки",
    },
  },
  uz: {
    appName: "DiyorAI",
    appSubtitle: "Yagona raqamli sayyohlik yordamchisi",
    tagline: "O'zbekiston bo'ylab sayohatingiz hamrohi",
    nav: {
      trip: "Yo'nalish",
      verify: "Faktlarni tekshirish",
      guides: "Gidlar",
    },
    footer: {
      rights: "DiyorAI — raqamli sayyohlik yordamchisi. NEXUS30 Hakaton (TravelTech).",
      sources: "Ma'lumotlar: OpenStreetMap, Wikidata, Wikipedia (ochiq manbalar)",
    },
    home: {
      badge: "Turizm qo'mitasi & TravelTech",
      title: "O'zbekiston bo'ylab sayohatingiz hamrohi",
      subtitle:
        "Uchta alohida xizmat o'rniga bitta raqamli yordamchi: ob-havoni inobatga olgan holda shaxsiy yo'nalish tuzadi, gid aytgan ma'lumotlarni tekshiradi va mos gidni topadi.",
      whereTo: "Qayerga boramiz?",
      whatInterests: "Qiziqishlaringiz qanday?",
      howManyDays: "Necha kun?",
      pace: "Sayohat sur'ati",
      soloTraveler: "Yolg'iz sayohat qiluvchi (Solo sayohatchi)",
      buildTrip: "Yo'nalishni tuzish",
      building: "Yo'nalish tuzilmoqda…",
      selectAtLeastOne: "Kamida bitta qiziqish turini tanlang.",
      buildError: "Yo'nalish tuzishda xatolik yuz berdi. Qaytadan urinib ko'ring.",
      features: {
        routeTitle: "1. Aqlli yo'nalish",
        routeDesc: "Ob-havo, qulaylik va kunlik obyektlar ketma-ketligini hisobga oluvchi algoritm.",
        verifyTitle: "2. Faktlarni tekshirish",
        verifyDesc: "Gidlar so'zlarini ishonchli ochiq manbalar bilan solishtirish.",
        guidesTitle: "3. Mos gidni topish",
        guidesDesc: "Yo'nalishingiz va tillaringizga to'liq mos keladigan sertifikatlangan mutaxassislar.",
      },
    },
    trip: {
      title: "Sizning yo'nalishingiz",
      day: "Kun",
      days: "kun",
      empty: "Tanlangan hududda bu qiziqishlarga mos obyektlar topilmadi. Boshqa viloyatni tanlang.",
      verifyFacts: "Faktlarni tekshirish →",
      soloNotice:
        "Siz yolg'iz sayohat qilmoqdasiz — kechki payt va uzoq manzillar uchun ishonchli gid hamrohligidan foydalanish tavsiya etiladi.",
      findGuidesForRoute: "Ushbu yo'nalish uchun gid topish",
      recalculate: "Yo'nalishni o'zgartirish",
      notBuiltTitle: "Yo'nalish hali tuzilmadi",
      notBuiltDesc: "Shaxsiy marshrut olish uchun bosh sahifadagi shaklni to'ldiring.",
      backToForm: "Shaklga qaytish",
      loading: "Yo'nalish yuklanmoqda…",
    },
    verify: {
      badge: "Ma'lumotlar tekshiruvi & Anti-afsonalar",
      title: "Gid aslida nimalarni aytib berdi?",
      subtitle:
        "Turistik obyektni tanlang va ma'lumotlarni ishonchli manbalar orqali tekshiring.",
      objectLabel: "Obyekt",
      queryLabel: "Gid nima dedi? (ixtiyoriy)",
      placeholder: "Masalan: minora 1220-yildagi mo'g'ullar hujumidan omon qolgan",
      button: "Faktni tekshirish",
      checking: "Manbalar solishtirilmoqda…",
      matchedTitle: "Tasdiqlangan faktlar bazasidan moslik topildi:",
      noMatchTitle:
        "To'g'ridan-to'g'ri moslik topilmadi. Obyekt bo'yicha eng yaqin faktlar:",
      listedTitle: "Obyekt bo'yicha barcha tekshirilgan faktlar:",
      source: "Manba",
      verifiedAt: "Tekshirilgan sana",
    },
    guides: {
      badge: "Gidlar reyestri & Aqlli saralash",
      title: "Yo'nalishingizga mos gidlar",
      subtitle:
        "Sizning qiziqishlaringiz va tanlangan shahringizga moslashtirilgan mutaxassislar.",
      regionFilter: "Hudud",
      specFilter: "Ixtisoslik",
      demoBadge: "Demo-ma'lumot",
      rating: "reyting",
      match: "moslik",
      empty: "Ushbu hududda demo-bazada gidlar mavjud emas. Boshqa hududni tanlang.",
    },
    weather: {
      title: "Ob-havo ma'lumoti va aqlli tavsiyalar",
      forecast: "Sayohat kunlari ob-havosi",
      smartAdvice: "Yo'nalish bo'yicha tavsiya",
      temp: "Harorat",
      condition: {
        clear: "Ochiq, quyoshli",
        partlyCloudy: "O'zgaruvchan bulutli",
        cloudy: "Bulutli",
        rain: "Yomg'ir yog'ishi mumkin",
        hot: "Issiq ob-havo",
      },
    },
    categories: {
      history: "Tarix",
      architecture: "Me'morchilik",
      pilgrimage: "Ziyorat",
      nature: "Tabiat",
      gastronomy: "Gastronomiya",
    },
    regions: {
      samarkand: "Samarqand",
      bukhara: "Buxoro",
      khiva: "Xiva",
      tashkent: "Toshkent",
    },
    paces: {
      relaxed: "Xotirjam (kuniga 2 ta obyekt)",
      balanced: "Muvozanatli (kuniga 3 ta obyekt)",
      packed: "Tig'iz (kuniga 4 ta obyekt)",
    },
    trustLevels: {
      high: "Yuqori ishonchlilik",
      medium: "O'rtacha ishonchlilik",
      low: "Qayta tekshirish talab etiladi",
    },
  },
  en: {
    appName: "DiyorAI",
    appSubtitle: "Unified Digital Tourism Assistant",
    tagline: "Your Travel Companion Across Uzbekistan",
    nav: {
      trip: "Trip Plan",
      verify: "Fact Checker",
      guides: "Guides",
    },
    footer: {
      rights: "DiyorAI — Digital Tourism Assistant. NEXUS30 Hackathon (TravelTech).",
      sources: "Data: OpenStreetMap, Wikidata, Wikipedia (Open Sources)",
    },
    home: {
      badge: "Uzbekistan Tourism Committee & TravelTech",
      title: "Your Travel Companion Across Uzbekistan",
      subtitle:
        "One intelligent assistant replacing multiple services: creates weather-aware personalized itineraries, verifies tour guide facts against trusted sources, and matches expert guides.",
      whereTo: "Where are we heading?",
      whatInterests: "What are your interests?",
      howManyDays: "How many days?",
      pace: "Travel pace",
      soloTraveler: "I am traveling alone (Solo traveler mode)",
      buildTrip: "Generate Itinerary",
      building: "Crafting itinerary…",
      selectAtLeastOne: "Please select at least one category of interest.",
      buildError: "Failed to generate itinerary. Please try again.",
      features: {
        routeTitle: "1. Smart Routing",
        routeDesc: "Algorithmic scheduling with weather adaptation and nearest-neighbor route optimization.",
        verifyTitle: "2. Fact Verification",
        verifyDesc: "Verify tour guide statements against verified open data without hallucinations.",
        guidesTitle: "3. Guide Matching",
        guidesDesc: "Find certified guides matching your specific route interests and languages.",
      },
    },
    trip: {
      title: "Your Itinerary",
      day: "Day",
      days: "days",
      empty: "No objects found in this region matching your interests. Try another city.",
      verifyFacts: "Verify facts →",
      soloNotice:
        "You are traveling solo — for evening tours and remote locations, our system recommends certified guide accompaniment.",
      findGuidesForRoute: "Find Guides for This Itinerary",
      recalculate: "Recalculate Route",
      notBuiltTitle: "No Itinerary Found",
      notBuiltDesc: "Fill in the form on the homepage to generate your personalized route.",
      backToForm: "Back to form",
      loading: "Loading itinerary…",
    },
    verify: {
      badge: "Fact Checker & Anti-Myth Engine",
      title: "What did the guide actually tell you?",
      subtitle:
        "Select a tourist site and verify claims against reliable open sources.",
      objectLabel: "Tourist Attraction",
      queryLabel: "What did the guide claim? (optional)",
      placeholder: "E.g.: Minaret survived the Mongol invasion in 1220",
      button: "Verify Fact",
      checking: "Checking sources…",
      matchedTitle: "Verified match found in knowledge base:",
      noMatchTitle:
        "No direct match found. Related verified facts about this site:",
      listedTitle: "All verified facts for this attraction:",
      source: "Source",
      verifiedAt: "Verified on",
    },
    guides: {
      badge: "Guide Registry & Intelligent Matching",
      title: "Find the Best Guide for Your Route",
      subtitle:
        "Certified guides ranked by compatibility with your itinerary preferences and destination.",
      regionFilter: "Region",
      specFilter: "Specialization",
      demoBadge: "Demo Data",
      rating: "rating",
      match: "match",
      empty: "No demo guides available for this region yet. Try another city.",
    },
    weather: {
      title: "Weather Forecast & Smart Recommendations",
      forecast: "Forecast for Trip Days",
      smartAdvice: "Itinerary Advice",
      temp: "Temperature",
      condition: {
        clear: "Clear & Sunny",
        partlyCloudy: "Partly Cloudy",
        cloudy: "Overcast",
        rain: "Light Rain Possible",
        hot: "High Temperature",
      },
    },
    categories: {
      history: "History",
      architecture: "Architecture",
      pilgrimage: "Pilgrimage",
      nature: "Nature",
      gastronomy: "Gastronomy",
    },
    regions: {
      samarkand: "Samarkand",
      bukhara: "Bukhara",
      khiva: "Khiva",
      tashkent: "Tashkent",
    },
    paces: {
      relaxed: "Relaxed (2 stops / day)",
      balanced: "Balanced (3 stops / day)",
      packed: "Packed (4 stops / day)",
    },
    trustLevels: {
      high: "High Confidence",
      medium: "Medium Confidence",
      low: "Needs Cross-Check",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "ru",
  setLanguage: () => {},
  t: translations.ru,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    const saved = localStorage.getItem("diyorai-lang") as Language;
    if (saved && (saved === "ru" || saved === "uz" || saved === "en")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("diyorai-lang", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
