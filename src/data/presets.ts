import { TripPlan } from "@/lib/types";

export interface PresetHotelInfo {
  name: string;
  category: "budget" | "comfort" | "boutique" | "resort";
  nights: number;
  approxCostUsd: number;
}

export interface PresetTransportInfo {
  type: "train" | "flight" | "car" | "none";
  label: {
    ru: string;
    uz: string;
    en: string;
  };
  included: boolean;
}

export interface PresetTransferInfo {
  vehicleType: string;
  capacity: number;
  approxCostUsd: number;
}

export interface TripPreset {
  id: string;
  title: {
    ru: string;
    uz: string;
    en: string;
  };
  subtitle: {
    ru: string;
    uz: string;
    en: string;
  };
  tag: {
    ru: string;
    uz: string;
    en: string;
  };
  duration: string;
  durationDays: number;
  region: string;
  icon: string;
  travelersCount: number;
  pricePerPersonUsd: number;
  totalPriceUsd: number;
  hotelInfo?: PresetHotelInfo;
  transportInfo?: PresetTransportInfo;
  transferInfo?: PresetTransferInfo;
  isLowBudget?: boolean;
  highlightsList: {
    ru: string;
    uz: string;
    en: string;
  }[];
  plan: TripPlan;
}

export const TRIP_PRESETS: TripPreset[] = [
  {
    id: "charvak-chimgan-lowbudget",
    title: {
      ru: "Чарвак и Чимган: Горный релакс & Катера",
      uz: "Chorvoq va Chimyon: Tog' dam olishi va katerlar",
      en: "Charvak & Chimgan: Low-Budget Mountain Escape",
    },
    subtitle: {
      ru: "Бирюзовое водохранилище, прогулка на катере, сочный шашлык в Бочке и панорама Большого Чимгана.",
      uz: "Moviy suv ombori, katerda sayr, Bo'chkada milliy shashlik va Katta Chimyon manzaralari.",
      en: "Turquoise water reservoir, speedboat ride, famous charcoal skewers at Bochka & Chimgan peaks.",
    },
    tag: {
      ru: "🔥 Low-Budget · 1 День",
      uz: "🔥 Hamyonbop · 1 Kun",
      en: "🔥 Low-Budget · 1 Day",
    },
    duration: "1 день",
    durationDays: 1,
    region: "Ташкентская область",
    icon: "🌊",
    travelersCount: 2,
    pricePerPersonUsd: 35,
    totalPriceUsd: 70,
    isLowBudget: true,
    hotelInfo: {
      name: "Однодневный тур (без ночёвки)",
      category: "budget",
      nights: 0,
      approxCostUsd: 0,
    },
    transportInfo: {
      type: "car",
      label: {
        ru: "Трансфер из Ташкента (1ч 20м)",
        uz: "Toshkentdan transfer (1s 20d)",
        en: "Direct transfer from Tashkent (1h 20m)",
      },
      included: true,
    },
    transferInfo: {
      vehicleType: "Комфортный седан / Минивэн",
      capacity: 4,
      approxCostUsd: 25,
    },
    highlightsList: [
      { ru: "Купание и катер на Чарваке", uz: "Chorvoqda cho'milish va kater", en: "Charvak speedboat & swim" },
      { ru: "Горный шашлык и горячие лепешки", uz: "Tog' shashligi va issiq non", en: "Mountain kebabs & hot bread" },
      { ru: "Смотровые площадки Чимгана", uz: "Chimyon kuzatuv maydonchalari", en: "Scenic Chimgan viewpoints" },
    ],
    plan: {
      preferences: {
        region: "tashkent_region",
        interests: ["nature", "gastronomy", "nature_hiking"],
        duration: { totalDays: 1, activeDays: 1, restDays: 0 },
        travelers: { type: "couple", adults: 2, children: 0, total: 2 },
        pace: "balanced",
        budget: "under_200",
        soloTraveler: false,
      },
      days: [
        {
          dayNumber: 1,
          stops: [
            {
              id: "charvak-viewpoint",
              name: "Смотровая площадка Чарвакского водохранилища",
              city: "Чарвак",
              region: "tashkent_region",
              categories: ["nature", "photography"],
              lat: 41.6315,
              lon: 70.0435,
              description: "Главная точка с видом на бирюзовое зеркало Чарвака и Чаткальский хребет.",
              popularity: 10,
              approxCostUsd: 0,
              score: 0.98,
            },
            {
              id: "charvak-speedboat",
              name: "Катание на скоростном катере по Чарваку",
              city: "Чарвак",
              region: "tashkent_region",
              categories: ["nature_hiking", "nature"],
              lat: 41.642,
              lon: 70.021,
              description: "30 минут по волнам горного озера с остановкой в уединенных бухтах.",
              popularity: 9,
              approxCostUsd: 15,
              score: 0.95,
            },
            {
              id: "bochka-lunch",
              name: "Гастрономический комплекс «Бочка»",
              city: "Чарвак",
              region: "tashkent_region",
              categories: ["gastronomy"],
              lat: 41.615,
              lon: 69.988,
              description: "Знаменитый горный шашлык из свежей баранины, жареная форель и горный чай.",
              popularity: 10,
              approxCostUsd: 12,
              score: 0.96,
            },
          ],
        },
      ],
    },
  },
  {
    id: "samarkand-classic-3d",
    title: {
      ru: "Самарканд: Жемчужина Востока за 3 дня",
      uz: "Samarqand: Sharq durdonasi (3 kun)",
      en: "Samarkand: Heart of the Silk Road (3 Days)",
    },
    subtitle: {
      ru: "Грандиозный Регистан, усыпальница Гур-Эмир, лазурный Шахи-Зинда, скоростной Afrosiyob и аутентичный плов.",
      uz: "Muazzam Registon, Go'ri Amir maqbarasi, Shohi Zinda, tezyurar Afrosiyob va mashhur Samarqand oshi.",
      en: "Iconic Registan Square, Gur-e-Amir, azure Shah-i-Zinda necropolis, Afrosiyob express & night illuminations.",
    },
    tag: {
      ru: "⭐ Бестселлер · 3 Дня",
      uz: "⭐ Eng ommabop · 3 Kun",
      en: "⭐ Bestseller · 3 Days",
    },
    duration: "3 дня",
    durationDays: 3,
    region: "Самарканд",
    icon: "🕌",
    travelersCount: 2,
    pricePerPersonUsd: 175,
    totalPriceUsd: 350,
    hotelInfo: {
      name: "Boutique Hotel Registan Plaza 3*",
      category: "comfort",
      nights: 2,
      approxCostUsd: 110,
    },
    transportInfo: {
      type: "train",
      label: {
        ru: "Скоростной поезд Afrosiyob (Ташкент ↔ Самарканд)",
        uz: "Tezyurar Afrosiyob poyezdi (Toshkent ↔ Samarqand)",
        en: "Afrosiyob High-Speed Train (Tashkent ↔ Samarkand)",
      },
      included: true,
    },
    transferInfo: {
      vehicleType: "Индивидуальный седан Comfort",
      capacity: 4,
      approxCostUsd: 30,
    },
    highlightsList: [
      { ru: "Вечернее световое шоу на Регистане", uz: "Registonda kechki chiroqlar shousi", en: "Registan evening light show" },
      { ru: "Майолика и мозаики Шахи-Зинда", uz: "Shohi Zinda koshinlari", en: "Shah-i-Zinda azure tiles" },
      { ru: "Самаркандский плов в Центре плова", uz: "Samarqand markazida haqiqiy osh", en: "Signature Samarkand plov" },
    ],
    plan: {
      preferences: {
        region: "samarkand",
        interests: ["history", "architecture", "gastronomy"],
        duration: { totalDays: 3, activeDays: 3, restDays: 0 },
        travelers: { type: "couple", adults: 2, children: 0, total: 2 },
        pace: "balanced",
        budget: "under_500",
        soloTraveler: false,
      },
      days: [
        {
          dayNumber: 1,
          stops: [
            {
              id: "samarkand-registan",
              name: "Ансамбль площади Регистан",
              city: "Самарканд",
              region: "samarkand",
              categories: ["architecture", "history"],
              lat: 39.6547,
              lon: 66.9757,
              description: "Сердце древнего Самарканда. Три медресе XV–XVII веков: Улугбека, Шердор и Тилля-Кари.",
              popularity: 10,
              approxCostUsd: 6,
              score: 0.99,
            },
            {
              id: "samarkand-gur-emir",
              name: "Мавзолей Гур-Эмир",
              city: "Самарканд",
              region: "samarkand",
              categories: ["history", "architecture"],
              lat: 39.6486,
              lon: 66.9686,
              description: "Фамильная усыпальница Амира Тимура и его потомков с нефритовым надгробием.",
              popularity: 10,
              approxCostUsd: 4,
              score: 0.97,
            },
          ],
        },
      ],
    },
  },
  {
    id: "amirsoy-alpine-resort",
    title: {
      ru: "Амирсой & Бельдерсай: Альпийский курорт",
      uz: "Amirsoy va Beldirsoy: Tog' kurorti",
      en: "Amirsoy & Beldersay: Mountain Resort Experience",
    },
    subtitle: {
      ru: "Современные гондольные канатки Doppelmayr, захватывающие виды Тянь-Шаня, горные рестораны и чистый воздух.",
      uz: "Zamonaviy Doppelmayr dor yo'llari, Tyan-Shan tog'lari panoramasi va milliy taomlar.",
      en: "State-of-the-art Doppelmayr cableways, Tien Shan mountain panoramas, alpine restaurants & fresh air.",
    },
    tag: {
      ru: "🏔️ Горы · 1 День",
      uz: "🏔️ Tog'lar · 1 Kun",
      en: "🏔️ Mountains · 1 Day",
    },
    duration: "1 день",
    durationDays: 1,
    region: "Ташкентская область",
    icon: "🚠",
    travelersCount: 2,
    pricePerPersonUsd: 45,
    totalPriceUsd: 90,
    isLowBudget: true,
    hotelInfo: {
      name: "Однодневный выезд из Ташкента",
      category: "resort",
      nights: 0,
      approxCostUsd: 0,
    },
    transportInfo: {
      type: "car",
      label: {
        ru: "Комфорт-трансфер из Ташкента (1ч 15м)",
        uz: "Toshkentdan qulay transfer (1s 15d)",
        en: "Direct mountain transfer (1h 15m)",
      },
      included: true,
    },
    transferInfo: {
      vehicleType: "Минивэн / Внедорожник",
      capacity: 6,
      approxCostUsd: 35,
    },
    highlightsList: [
      { ru: "Подъем на вершину 2290м на гондоле", uz: "2290m balandlikka dor yo'lida ko'tarilish", en: "Cable car ride to 2290m peak" },
      { ru: "Обед с панорамным видом на горы", uz: "Tog' manzarali restoranda tushlik", en: "Panoramic alpine lunch" },
      { ru: "Прогулка по можжевеловым рощам", uz: "Archa bog'larida toza havo", en: "Juniper grove walk & fresh air" },
    ],
    plan: {
      preferences: {
        region: "tashkent_region",
        interests: ["nature", "nature_hiking", "skiing"],
        duration: { totalDays: 1, activeDays: 1, restDays: 0 },
        travelers: { type: "couple", adults: 2, children: 0, total: 2 },
        pace: "relaxed",
        budget: "under_200",
        soloTraveler: false,
      },
      days: [],
    },
  },
  {
    id: "bukhara-fairytale-3d",
    title: {
      ru: "Бухара: Живой средневековый город",
      uz: "Buxoro: Qadimiy tirik shahar (3 kun)",
      en: "Bukhara: The Living Medieval Tale (3 Days)",
    },
    subtitle: {
      ru: "Минарет Калян, крепость Арк, торговые купола с коврами и чеканкой, уютный Ляби-Хауз и чаепитие у пруда.",
      uz: "Minorai Kalon, Ark qal'asi, qadimiy toqilar, Labi Hovuz va xushbo'y ko'k choy.",
      en: "Kalyan Minaret, Ark Citadel, ancient trading domes, Lyabi-Khauz teahouses by the pond.",
    },
    tag: {
      ru: "✨ Атмосфера · 3 Дня",
      uz: "✨ Muhit · 3 Kun",
      en: "✨ Heritage · 3 Days",
    },
    duration: "3 дня",
    durationDays: 3,
    region: "Бухара",
    icon: "🏺",
    travelersCount: 2,
    pricePerPersonUsd: 195,
    totalPriceUsd: 390,
    hotelInfo: {
      name: "Boutique Hotel Old Bukhara Courtyard",
      category: "boutique",
      nights: 2,
      approxCostUsd: 120,
    },
    transportInfo: {
      type: "train",
      label: {
        ru: "Скоростной поезд Afrosiyob (Ташкент ↔ Бухара)",
        uz: "Tezyurar Afrosiyob (Toshkent ↔ Buxoro)",
        en: "Afrosiyob High-Speed Train (Tashkent ↔ Bukhara)",
      },
      included: true,
    },
    transferInfo: {
      vehicleType: "Индивидуальный трансфер вокзал ↔ отель",
      capacity: 4,
      approxCostUsd: 20,
    },
    highlightsList: [
      { ru: "Закат на ансамбле Пои-Калян", uz: "Poi Kalon ansamblida quyosh botishi", en: "Poi Kalyan magical sunset" },
      { ru: "Пряный чай с шафраном у Ляби-Хауза", uz: "Labi Hovuzda za'faronli choy", en: "Saffron tea at Lyabi-Khauz" },
      { ru: "Ремесленные мастерские чеканки", uz: "Zardo'zlik va temirchilik ustaxonalari", en: "Artisan engraving & coppersmiths" },
    ],
    plan: {
      preferences: {
        region: "bukhara",
        interests: ["history", "crafts_bazaars", "architecture"],
        duration: { totalDays: 3, activeDays: 3, restDays: 0 },
        travelers: { type: "couple", adults: 2, children: 0, total: 2 },
        pace: "balanced",
        budget: "under_500",
        soloTraveler: false,
      },
      days: [],
    },
  },
  {
    id: "khiva-thousand-nights-2d",
    title: {
      ru: "Хива: Музей под открытым небом Ичан-Кала",
      uz: "Xiva: Ochiq osmon ostidagi Ichan-Qal'a (2 kun)",
      en: "Khiva: 1000 & 1 Nights in Ichan-Kala (2 Days)",
    },
    subtitle: {
      ru: "Глиняные крепостные стены, минарет Кальта-Минор, дворец Тош-Ховли и незабываемые закаты с башен.",
      uz: "Loy devorli qadimiy qal'a, Kalta Minor, Tosh Hovli saroyi va minoralardan ajoyib manzara.",
      en: "Mud-brick citadel walls, turquoise Kalta Minor, Tosh-Khovli palace & mesmerizing sunsets from towers.",
    },
    tag: {
      ru: "🏰 Сказка · 2 Дня",
      uz: "🏰 Afsona · 2 Kun",
      en: "🏰 Fairy Tale · 2 Days",
    },
    duration: "2 дня",
    durationDays: 2,
    region: "Хива",
    icon: "🧱",
    travelersCount: 2,
    pricePerPersonUsd: 220,
    totalPriceUsd: 440,
    hotelInfo: {
      name: "Hotel Orient Star Khiva (inside Madrasah)",
      category: "boutique",
      nights: 1,
      approxCostUsd: 70,
    },
    transportInfo: {
      type: "flight",
      label: {
        ru: "Авиаперелет Ташкент ↔ Ургенч + трансфер",
        uz: "Aviaparvoz Toshkent ↔ Urganch + transfer",
        en: "Flight Tashkent ↔ Urgench + shuttle to Khiva",
      },
      included: true,
    },
    transferInfo: {
      vehicleType: "Трансфер Аэропорт Ургенч ↔ Хива",
      capacity: 4,
      approxCostUsd: 25,
    },
    highlightsList: [
      { ru: "Ночевка внутри древнего медресе", uz: "Qadimiy madrasa ichida tunash", en: "Stay inside historical madrasah" },
      { ru: "Панорама Ичан-Калы со смотровой вышки", uz: "Kuzatuv minorasidan butun shahar manzarasi", en: "360° panoramic tower view" },
      { ru: "Традиционная хорезмская кухня: шивит ош", uz: "Xorazm milliy taomi: shivit oshi", en: "Khorezm green dill pasta (Shivit Osh)" },
    ],
    plan: {
      preferences: {
        region: "khiva",
        interests: ["history", "architecture", "photography"],
        duration: { totalDays: 2, activeDays: 2, restDays: 0 },
        travelers: { type: "couple", adults: 2, children: 0, total: 2 },
        pace: "packed",
        budget: "under_500",
        soloTraveler: false,
      },
      days: [],
    },
  },
  {
    id: "tashkent-gastro-24h",
    title: {
      ru: "Ташкент гастрономический за 24 часа",
      uz: "Toshkent gastronomik sayohati (24 soat)",
      en: "Tashkent Gastro Tour in 24 Hours",
    },
    subtitle: {
      ru: "Легендарный Центр плова Besh Qozon, аутентичный базар Чорсу, уличная тандырная самса и метро-музей.",
      uz: "Afsonaviy Oshi markazi Besh Qozon, qadimiy Chorsu bozori, tandir somsa va ko'rkam metro.",
      en: "Legendary Central Asian Plov Center Besh Qozon, ancient Chorsu Bazaar, tandoor somsa & metro stations.",
    },
    tag: {
      ru: "🍲 Гастро · 1 День",
      uz: "🍲 Gastro · 1 Kun",
      en: "🍲 Gastro · 1 Day",
    },
    duration: "1 день",
    durationDays: 1,
    region: "Ташкент",
    icon: "🥘",
    travelersCount: 2,
    pricePerPersonUsd: 40,
    totalPriceUsd: 80,
    isLowBudget: true,
    hotelInfo: {
      name: "Однодневный городской тур",
      category: "budget",
      nights: 0,
      approxCostUsd: 0,
    },
    transportInfo: {
      type: "none",
      label: {
        ru: "Городское метро и такси (внутри города)",
        uz: "Shahar metrosi va taksi",
        en: "Metro & city taxi throughout Tashkent",
      },
      included: true,
    },
    transferInfo: {
      vehicleType: "Yandex Go Comfort / Метро",
      capacity: 4,
      approxCostUsd: 15,
    },
    highlightsList: [
      { ru: "Дегустация свадебного плова из гигантского казана", uz: "Ulkan qozondan to'y oshi tatib ko'rish", en: "Wedding plov tasting from giant cauldron" },
      { ru: "Купольный базар Чорсу: курт, халва, нарын", uz: "Chorsu bozorida qurt, holva va norin", en: "Chorsu Bazaar delicacies: qurt, naryn" },
      { ru: "Самые красивые станции метро (Космонавтов, Навои)", uz: "Metro go'zal bekatlari (Kosmonavtlar, Navoiy)", en: "Most beautiful marble subway stations" },
    ],
    plan: {
      preferences: {
        region: "tashkent",
        interests: ["gastronomy", "crafts_bazaars", "history"],
        duration: { totalDays: 1, activeDays: 1, restDays: 0 },
        travelers: { type: "couple", adults: 2, children: 0, total: 2 },
        pace: "balanced",
        budget: "under_200",
        soloTraveler: false,
      },
      days: [],
    },
  },
];
