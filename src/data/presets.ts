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
              lon: 66.9758,
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
              lon: 66.9689,
              description: "Фамильная усыпальница Амира Тимура и его потомков с нефритовым надгробием.",
              popularity: 10,
              approxCostUsd: 4,
              score: 0.97,
            },
            {
              id: "samarkand-plov-center",
              name: "Самаркандский Центр плова",
              city: "Самарканд",
              region: "samarkand",
              categories: ["gastronomy"],
              lat: 39.6615,
              lon: 66.9532,
              description: "Традиционный слоеный самаркандский плов из желтой моркови и нежной баранины.",
              popularity: 10,
              approxCostUsd: 8,
              score: 0.96,
            },
          ],
        },
        {
          dayNumber: 2,
          stops: [
            {
              id: "samarkand-shahi-zinda",
              name: "Мемориальный комплекс Шахи-Зинда",
              city: "Самарканд",
              region: "samarkand",
              categories: ["architecture", "pilgrimage"],
              lat: 39.6644,
              lon: 66.9878,
              description: "Невероятная улица-некрополь из бирюзовых мавзолеев XI-XV веков и шедевр восточной майолики.",
              popularity: 10,
              approxCostUsd: 4,
              score: 0.98,
            },
            {
              id: "samarkand-bibi-khanum",
              name: "Мечеть Биби-Ханум",
              city: "Самарканд",
              region: "samarkand",
              categories: ["architecture", "history"],
              lat: 39.6582,
              lon: 66.9793,
              description: "Грандиозная соборная мечеть эпохи Тимуридов с гигантским порталом и куполом.",
              popularity: 9,
              approxCostUsd: 3,
              score: 0.95,
            },
            {
              id: "samarkand-siab-bazaar",
              name: "Сиабский базар",
              city: "Самарканд",
              region: "samarkand",
              categories: ["crafts_bazaars", "gastronomy"],
              lat: 39.6611,
              lon: 66.9819,
              description: "Аутентичный восточный базар рядом с мечетью: самаркандские лепёшки, халва и сухофрукты.",
              popularity: 9,
              approxCostUsd: 5,
              score: 0.94,
            },
          ],
        },
        {
          dayNumber: 3,
          stops: [
            {
              id: "samarkand-ulugbek-observatory",
              name: "Обсерватория Улугбека",
              city: "Самарканд",
              region: "samarkand",
              categories: ["history"],
              lat: 39.6749,
              lon: 70.0036,
              description: "Остатки гигантского секстанта XV века и музей выдающегося астронома Средневековья.",
              popularity: 8,
              approxCostUsd: 3,
              score: 0.92,
            },
            {
              id: "samarkand-konigil-paper",
              name: "Бумажная фабрика Конигил «Мерос»",
              city: "Конигил",
              region: "samarkand",
              categories: ["crafts_bazaars", "nature"],
              lat: 39.6620,
              lon: 67.0420,
              description: "Ручное производство знаменитой самаркандской шелковой бумаги по технологиям VIII века на реке Сиаб.",
              popularity: 9,
              approxCostUsd: 5,
              score: 0.95,
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
      days: [
        {
          dayNumber: 1,
          stops: [
            {
              id: "tasreg-amirsoy",
              name: "Горный курорт Амирсой (Гондольная канатка)",
              city: "Амирсой",
              region: "tashkent_region",
              categories: ["nature", "nature_hiking"],
              lat: 41.5365,
              lon: 70.0682,
              description: "Подъем в комфортабельных гондолах на пик 2290м и панорамный вид на Чаткальский хребет.",
              popularity: 10,
              approxCostUsd: 15,
              score: 0.99,
            },
            {
              id: "tasreg-beldersay",
              name: "Ущелье Бельдерсай и реликтовые арчовники",
              city: "Бельдерсай",
              region: "tashkent_region",
              categories: ["nature_hiking", "nature"],
              lat: 41.5127,
              lon: 69.9984,
              description: "Живописнейшее ущелье с целебным горным воздухом и пешими тропами.",
              popularity: 9,
              approxCostUsd: 4,
              score: 0.94,
            },
            {
              id: "tasreg-bochka-gastronomy",
              name: "Гастрономический обед в Бочке",
              city: "Бостанлык",
              region: "tashkent_region",
              categories: ["gastronomy"],
              lat: 41.6255,
              lon: 69.9670,
              description: "Свежая речная форель на углях, горный шашлык и горячий зеленый чай с травами.",
              popularity: 10,
              approxCostUsd: 12,
              score: 0.97,
            },
          ],
        },
      ],
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
      days: [
        {
          dayNumber: 1,
          stops: [
            {
              id: "bukhara-poi-kalyan",
              name: "Ансамбль Пои-Калян (Минарет и Мечеть)",
              city: "Бухара",
              region: "bukhara",
              categories: ["architecture", "history"],
              lat: 39.7758,
              lon: 64.4144,
              description: "Центральная площадь старой Бухары с 46-метровым минаретом Калян (1127 г.) и медресе Мири Араб.",
              popularity: 10,
              approxCostUsd: 4,
              score: 0.99,
            },
            {
              id: "bukhara-ark",
              name: "Крепость Арк",
              city: "Бухара",
              region: "bukhara",
              categories: ["history"],
              lat: 39.7778,
              lon: 64.4108,
              description: "Древняя цитадель эмиров Бухары и панорамный вид на старый город.",
              popularity: 9,
              approxCostUsd: 4,
              score: 0.96,
            },
            {
              id: "bukhara-bolo-hauz",
              name: "Мечеть Боло-Хауз",
              city: "Бухара",
              region: "bukhara",
              categories: ["architecture"],
              lat: 39.7766,
              lon: 64.4089,
              description: "Изящная пятничная мечеть с 20 резными колоннами из орехового дерева.",
              popularity: 9,
              approxCostUsd: 0,
              score: 0.94,
            },
          ],
        },
        {
          dayNumber: 2,
          stops: [
            {
              id: "bukhara-trading-domes",
              name: "Торговые купола (Токи Заргарон, Токи Саррафон)",
              city: "Бухара",
              region: "bukhara",
              categories: ["crafts_bazaars"],
              lat: 39.7745,
              lon: 64.4172,
              description: "Крытые торговые пассажи XVI века: бухарские ювелиры, ткачи шелка и чеканщики.",
              popularity: 9,
              approxCostUsd: 0,
              score: 0.95,
            },
            {
              id: "bukhara-lyabi-khauz",
              name: "Ансамбль Ляби-Хауз и Чайхана",
              city: "Бухара",
              region: "bukhara",
              categories: ["gastronomy", "architecture"],
              lat: 39.7731,
              lon: 64.4206,
              description: "Живописная площадь вокруг старинного водоема с вековыми тутовниками и пловом.",
              popularity: 10,
              approxCostUsd: 8,
              score: 0.98,
            },
            {
              id: "bukhara-chor-minor",
              name: "Медресе Чор-Минор",
              city: "Бухара",
              region: "bukhara",
              categories: ["architecture"],
              lat: 39.7749,
              lon: 64.4281,
              description: "Необычное здание с четырьмя бирюзовыми башнями, символизирующими 4 мировые религии.",
              popularity: 9,
              approxCostUsd: 2,
              score: 0.93,
            },
          ],
        },
        {
          dayNumber: 3,
          stops: [
            {
              id: "bukhara-sitorai-mokhi-khosa",
              name: "Дворец Ситораи Мохи-Хоса",
              city: "Бухара",
              region: "bukhara",
              categories: ["architecture", "history"],
              lat: 39.8123,
              lon: 64.4418,
              description: "Загородный летний дворец последнего эмира Бухары с зеркальным залом и павлинами в саду.",
              popularity: 9,
              approxCostUsd: 4,
              score: 0.94,
            },
            {
              id: "bukhara-bahauddin-naqshband",
              name: "Мемориал Бахауддина Накшбанда",
              city: "Касри Орифон",
              region: "bukhara",
              categories: ["pilgrimage", "history"],
              lat: 39.8005,
              lon: 64.5361,
              description: "Священный суфийский комплекс основателя ордена Накшбандия.",
              popularity: 9,
              approxCostUsd: 0,
              score: 0.92,
            },
          ],
        },
      ],
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
      days: [
        {
          dayNumber: 1,
          stops: [
            {
              id: "khiva-ichan-kala",
              name: "Крепость Ичан-Кала (Главный вход Ата-Дарваза)",
              city: "Хива",
              region: "khiva",
              categories: ["architecture", "history"],
              lat: 41.3783,
              lon: 60.3639,
              description: "Живой музей под открытым небом, объект всемирного наследия ЮНЕСКО.",
              popularity: 10,
              approxCostUsd: 10,
              score: 0.99,
            },
            {
              id: "khiva-kalta-minor",
              name: "Минарет Кальта-Минор",
              city: "Хива",
              region: "khiva",
              categories: ["architecture"],
              lat: 41.3781,
              lon: 60.3582,
              description: "Знаменитый незавершенный бирюзовый минарет диаметром 14.2 метра.",
              popularity: 10,
              approxCostUsd: 0,
              score: 0.98,
            },
            {
              id: "khiva-kunya-ark",
              name: "Цитадель Куня-Арк (Смотровая башня Ак-Шейх-Бобо)",
              city: "Хива",
              region: "khiva",
              categories: ["history", "photography"],
              lat: 41.3789,
              lon: 60.3575,
              description: "Старая крепость ханов с лучшим панорамным видом на закат над крышами Ичан-Калы.",
              popularity: 10,
              approxCostUsd: 3,
              score: 0.97,
            },
          ],
        },
        {
          dayNumber: 2,
          stops: [
            {
              id: "khiva-juma-mosque",
              name: "Джума Мечеть (218 резных колонн)",
              city: "Хива",
              region: "khiva",
              categories: ["architecture", "history"],
              lat: 41.3776,
              lon: 60.3601,
              description: "Уникальная пятничная мечеть X века с лесом резных деревянных колонн.",
              popularity: 9,
              approxCostUsd: 2,
              score: 0.96,
            },
            {
              id: "khiva-tosh-khovli",
              name: "Дворец Тош-Ховли (Каменный дворец)",
              city: "Хива",
              region: "khiva",
              categories: ["architecture"],
              lat: 41.3792,
              lon: 60.3621,
              description: "Роскошные ханские покои с уникальными синими изразцами и резными айванами.",
              popularity: 9,
              approxCostUsd: 3,
              score: 0.95,
            },
            {
              id: "khiva-shivit-osh-lunch",
              name: "Обед: Хорезмский зеленый лагман Шивит Ош",
              city: "Хива",
              region: "khiva",
              categories: ["gastronomy"],
              lat: 41.3770,
              lon: 60.3590,
              description: "Аутентичная ярко-зеленая лапша с укропом, мясной подливкой и катыком.",
              popularity: 10,
              approxCostUsd: 7,
              score: 0.98,
            },
          ],
        },
      ],
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
      days: [
        {
          dayNumber: 1,
          stops: [
            {
              id: "tashkent-chorsu-bazaar",
              name: "Базар Чорсу (Купол и обжорный ряд)",
              city: "Ташкент",
              region: "tashkent",
              categories: ["crafts_bazaars", "gastronomy"],
              lat: 41.3275,
              lon: 69.2355,
              description: "Гигантский лазурный купол базара, горячая сомса из тандыра, нарын, курт и сухофрукты.",
              popularity: 10,
              approxCostUsd: 6,
              score: 0.99,
            },
            {
              id: "tashkent-besh-qozon",
              name: "Центр плова Besh Qozon (Среднеазиатский центр плова)",
              city: "Ташкент",
              region: "tashkent",
              categories: ["gastronomy"],
              lat: 41.3458,
              lon: 69.2842,
              description: "Приготовление плова в гигантских казанах на дровах у подножия Ташкентской телебашни.",
              popularity: 10,
              approxCostUsd: 7,
              score: 0.98,
            },
            {
              id: "tashkent-metro-tour",
              name: "Ташкентский метрополитен (Космонавтов, Алишера Навои)",
              city: "Ташкент",
              region: "tashkent",
              categories: ["architecture", "history"],
              lat: 41.3111,
              lon: 69.2797,
              description: "Подземные мраморные дворцы и люстры первой ветки метро в Центральной Азии.",
              popularity: 9,
              approxCostUsd: 1,
              score: 0.95,
            },
          ],
        },
      ],
    },
  },
];
