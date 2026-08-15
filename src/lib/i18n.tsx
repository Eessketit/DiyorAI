import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Category, Pace, Region, TrustLevel } from "./types";

export type Language = "ru" | "uz" | "en";

export interface FAQItemTranslation {
  id: string;
  category: string;
  categoryIcon: string;
  question: string;
  answer: string;
  highlight?: string;
  tag?: string;
}

export interface DirectoryItemTranslation {
  name: string;
  tag: string;
  details: string;
  linkUrl?: string;
}

export interface DirectoryCategoryTranslation {
  id: string;
  title: string;
  icon: string;
  badge: string;
  description: string;
  items: DirectoryItemTranslation[];
}

export interface Translations {
  appName: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    trip: string;
    verify: string;
    guides: string;
    faq: string;
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
  planner: {
    stepWho: string;
    stepDays: string;
    stepFormat: string;
    stepPace: string;
    stepBudget: string;
    stepInterests: string;
    stepOrganize: string;
    organizeSubtitle: string;
    changeParams: string;
    adultsLabel: string;
    childrenLabel: string;
    totalDaysLabel: string;
    activeDaysLabel: string;
    restDaysLabel: string;
    restDayNotice: string;
    mountainWeekendTitle: string;
    mountainWeekendDesc: string;
    mountainWeekendBadge: string;
    budgetLimitLabel: string;
    unlimited: string;
    budgetBarTitle: string;
    budgetInLimit: string;
    budgetOverLimit: string;
    budgetTipPrefix: string;
    transportTitle: string;
    transferTitle: string;
    hotelTitle: string;
    flightTab: string;
    trainTab: string;
    carTab: string;
    roundTrip: string;
    oneWay: string;
    passengersCount: string;
    departure: string;
    arrival: string;
    selectBtn: string;
    selectedBtn: string;
    nextStep: string;
    backStep: string;
    finishPlan: string;
    carsNeeded: string;
    roomsNeeded: string;
    nightsCount: string;
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
    restDayTitle: string;
    restDayDesc: string;
    financialSummary: string;
    costTransport: string;
    costTransfer: string;
    costHotel: string;
    costActivitiesFood: string;
    costOther: string;
    costTotal: string;
    costPerPerson: string;
    payerSplitTitle: string;
    splitEqual: string;
    splitSingle: string;
    splitFamily: string;
    bookTripCta: string;
    exportPdf: string;
    shareTelegram: string;
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
    trustGuaranteeTitle: string;
    trustGuaranteeDesc: string;
    verifiedCountBadge: string;
    avgTrustScore: string;
    searchPlaceholder: string;
    sortLabel: string;
    locationFilter: string;
    specFilter: string;
    languageFilter: string;
    verifiedOnlyLabel: string;
    empty: string;
    resetFilters: string;
    viewProfileBtn: string;
    bookGuideBtn: string;
    trustScoreLabel: string;
    matchScoreLabel: string;
    perTour: string;
    verifiedBadge: string;
    licenseBadge: string;
    toursCount: string;
    modalOverviewTab: string;
    modalTrustTab: string;
    modalReviewsTab: string;
    modalTrustEvidenceTitle: string;
    modalTrustEvidenceDesc: string;
    modalIdentityVerified: string;
    modalIdentityDesc: string;
    modalLicenseVerified: string;
    modalLicenseDesc: string;
    modalExperienceDesc: string;
    modalPunctualityDesc: string;
    modalRadarTitle: string;
    modalKnowledge: string;
    modalCommunication: string;
    modalService: string;
    modalOrganization: string;
    modalSafety: string;
    modalStatsCompleted: string;
    modalStatsPunctuality: string;
    modalStatsResponse: string;
    modalStatsCancellation: string;
    modalWhyRecommendedTitle: string;
    modalCloseBtn: string;
    modalBookGuideBtn: string;
  };
  booking: {
    modalTitle: string;
    guideBookingSubtitle: string;
    tripBookingSubtitle: string;
    dateLabel: string;
    travelersLabel: string;
    adults: string;
    children: string;
    capacityWarning: string;
    contactInfoTitle: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    emailLabel: string;
    contactMethodLabel: string;
    commentsLabel: string;
    commentsPlaceholder: string;
    totalToPay: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successSubtitle: string;
    bookingIdLabel: string;
    guideLabel: string;
    tourDateLabel: string;
    travelersCountLabel: string;
    totalCostLabel: string;
    contactNotice: string;
    returnBtn: string;
  };
  directory: {
    badge: string;
    title: string;
    subtitle: string;
    findGuideCta: string;
    categories: DirectoryCategoryTranslation[];
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategory: string;
    emptySearch: string;
    items: FAQItemTranslation[];
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
  // ==========================================
  // RUSSIAN
  // ==========================================
  ru: {
    appName: "DiyorAI",
    appSubtitle: "Единый цифровой туристический помощник",
    tagline: "Спутник в пути по Узбекистану",
    nav: {
      trip: "Маршрут",
      verify: "Проверка факта",
      guides: "Гиды & Trust",
      faq: "FAQ & Помощь",
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
    planner: {
      stepWho: "1. КТО едет в поездку?",
      stepDays: "2. СКОЛЬКО ДНЕЙ продлится поездка?",
      stepFormat: "3. ФОРМАТ и направление",
      stepPace: "4. ТЕМП ПОЕЗДКИ",
      stepBudget: "5. БЮДЖЕТ (Диапазон расходов)",
      stepInterests: "6. ИНТЕРЕСЫ И ПРЕДПОЧТЕНИЯ",
      stepOrganize: "🚀 ОРГАНИЗОВАТЬ ПОЕЗДКУ",
      organizeSubtitle: "Пошаговый подбор логистики и проживания",
      changeParams: "Изменить параметры",
      adultsLabel: "Взрослые",
      childrenLabel: "Дети",
      totalDaysLabel: "Общее число дней",
      activeDaysLabel: "Активные дни (экскурсии)",
      restDaysLabel: "Дни отдыха (релакс & спа)",
      restDayNotice: "🌿 Дни отдыха включены в программу без плотного графика",
      mountainWeekendTitle: "Откройте Ташкентскую область (Горы & Уикенды)",
      mountainWeekendDesc: "Чарвакское водохранилище, всесезонный курорт Амирсой, Чимган, Бельдерсай и сосновый бор Сукок.",
      mountainWeekendBadge: "Уикенд под ключ от $25–40/чел",
      budgetLimitLabel: "Лимит",
      unlimited: "Без лимита",
      budgetBarTitle: "Контроль бюджета в реальном времени",
      budgetInLimit: "В пределах бюджета",
      budgetOverLimit: "Превышение бюджета",
      budgetTipPrefix: "💡 Подсказка по оптимизации",
      transportTitle: "Этап 1: Транспорт до места назначения",
      transferTitle: "Этап 2: Трансфер на месте",
      hotelTitle: "Этап 3: Проживание (Отели & Гостевые дома)",
      flightTab: "✈️ Самолёт",
      trainTab: "🚆 Поезд",
      carTab: "🚗 На машине",
      roundTrip: "Туда и обратно",
      oneWay: "В одну сторону",
      passengersCount: "Пассажиров",
      departure: "Вылет / Отправление",
      arrival: "Прибытие",
      selectBtn: "Выбрать",
      selectedBtn: "✓ Выбрано",
      nextStep: "Далее →",
      backStep: "← Назад",
      finishPlan: "Построить маршрут 🚀",
      carsNeeded: "автомобиля(ей) требуется",
      roomsNeeded: "номеров требуется",
      nightsCount: "ночей",
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
      restDayTitle: "🌿 День отдыха и восстановления",
      restDayDesc: "Свободное время для релакса, гастрономии, спа и неспешных прогулок без жесткого графика.",
      financialSummary: "Финансовый свод поездки (Trip Summary)",
      costTransport: "Транспорт (междугородний)",
      costTransfer: "Трансферы на месте",
      costHotel: "Проживание (отель/шале)",
      costActivitiesFood: "Питание, музеи и активности",
      costOther: "SIM-карта, вода, транспорт по городу",
      costTotal: "Итоговая стоимость",
      costPerPerson: "на человека",
      payerSplitTitle: "Калькулятор: Кто сколько платит",
      splitEqual: "Поровну (между всеми)",
      splitSingle: "Один оплачивает всё",
      splitFamily: "Семейный сплит (родители покрывают детей)",
      bookTripCta: "🔒 ЗАБРОНИРОВАТЬ ЭТУ ПОЕЗДКУ",
      exportPdf: "Экспорт в PDF",
      shareTelegram: "Поделиться в Telegram",
    },
    verify: {
      badge: "Проверка информации & Анти-мифы",
      title: "Что на самом деле рассказал гид?",
      subtitle: "Выберите туристический объект и проверьте факты по открытым достоверным источникам.",
      objectLabel: "Объект",
      queryLabel: "Что рассказал гид? (необязательно)",
      placeholder: "Например: минарет пережил монгольское нашествие в 1220 году",
      button: "Проверить факт",
      checking: "Сверяем с источниками…",
      matchedTitle: "Найдено подтверждение в базе проверенных фактов:",
      noMatchTitle: "Прямого совпадения не найдено. Ниже представлены наиболее близкие факты об объекте:",
      listedTitle: "Все проверенные факты об объекте:",
      source: "Источник",
      verifiedAt: "Сверено",
    },
    guides: {
      badge: "Аккредитованные гиды Узбекистана · Trust & Verification",
      title: "Найдите проверенного гида для вашего путешествия",
      subtitle: "Каждый гид в DiyorAI проходит аудит личности, лицензии и профессиональной надёжности.",
      trustGuaranteeTitle: "Гарантия надёжности DiyorAI (Trust Guarantee)",
      trustGuaranteeDesc: "100% аккредитация Комитета по туризму · Проверка биометрии · Прозрачный рейтинг",
      verifiedCountBadge: "✓ 25+ проверенных гидов",
      avgTrustScore: "🛡 Средний Trust Score: 94/100",
      searchPlaceholder: "Поиск по имени гида или городу...",
      sortLabel: "Сортировка",
      locationFilter: "Локация / Город",
      specFilter: "Тематика экскурсии",
      languageFilter: "Язык гида",
      verifiedOnlyLabel: "Только 100% проверенные гиды",
      empty: "По выбранным фильтрам гиды не найдены.",
      resetFilters: "Сбросить фильтры",
      viewProfileBtn: "🔍 Профиль и аудит",
      bookGuideBtn: "🔒 Забронировать",
      trustScoreLabel: "Trust Score",
      matchScoreLabel: "Совпадение",
      perTour: "за тур",
      verifiedBadge: "Проверен",
      licenseBadge: "Лицензия",
      toursCount: "туров",
      modalOverviewTab: "📋 Обзор и специализация",
      modalTrustTab: "🛡 Аудит доверия (Trust Breakdown)",
      modalReviewsTab: "💬 Отзывы",
      modalTrustEvidenceTitle: "Доказательства надёжности гида (Trust Evidence)",
      modalTrustEvidenceDesc: "Система строгой верификации и аудита каждого специалиста",
      modalIdentityVerified: "Личность подтверждена",
      modalIdentityDesc: "Паспортные данные и биометрия проверены по госреестру",
      modalLicenseVerified: "Лицензия Комитета по туризму",
      modalLicenseDesc: "Действующий государственный сертификат гида-экскурсовода",
      modalExperienceDesc: "проверенных туров с реальными туристами",
      modalPunctualityDesc: "Прибытие на место встречи точно в назначенное время",
      modalRadarTitle: "Оценки по ключевым критериям (Customer Experience)",
      modalKnowledge: "📚 Глубина исторических знаний",
      modalCommunication: "🗣 Коммуникация и подача материала",
      modalService: "😊 Забота и уровень сервиса",
      modalOrganization: "⏱ Организация тайминга и логистики",
      modalSafety: "🛡 Безопасность и сопровождение",
      modalStatsCompleted: "Завершение туров",
      modalStatsPunctuality: "Вовремя",
      modalStatsResponse: "Ответ на заявку",
      modalStatsCancellation: "Отмены гидом",
      modalWhyRecommendedTitle: "Почему DiyorAI рекомендует этого гида",
      modalCloseBtn: "Закрыть",
      modalBookGuideBtn: "🔒 Забронировать гида",
    },
    booking: {
      modalTitle: "Бронирование поездки",
      guideBookingSubtitle: "Бронирование экскурсии с аккредитованным гидом",
      tripBookingSubtitle: "Бронирование маршрута, транспорта и отеля",
      dateLabel: "Дата поездки / экскурсии",
      travelersLabel: "Участников",
      adults: "Взрослые",
      children: "Дети",
      capacityWarning: "Большая группа: для вашего удобства гид может предоставить индивидуальные аудиогиды.",
      contactInfoTitle: "Контактные данные для связи",
      fullNameLabel: "Ваше имя и фамилия *",
      fullNamePlaceholder: "Например: Азиз Рахимов",
      phoneLabel: "Телефон (с кодом) *",
      emailLabel: "Email (для подтверждения)",
      contactMethodLabel: "Предпочтительный способ связи",
      commentsLabel: "Пожелания к маршруту (необязательно)",
      commentsPlaceholder: "Например: удобное время встречи, детское кресло в авто...",
      totalToPay: "Итого к оплате",
      submitBtn: "✓ Подтвердить бронирование",
      submitting: "Отправка заявки...",
      successTitle: "Поездка успешно забронирована!",
      successSubtitle: "Ваша заявка принята и зарегистрирована в системе DiyorAI.",
      bookingIdLabel: "Номер бронирования",
      guideLabel: "Гид",
      tourDateLabel: "Дата",
      travelersCountLabel: "Участников",
      totalCostLabel: "Стоимость",
      contactNotice: "Наш специалист свяжется с вами в течение 10–15 минут для подтверждения деталей.",
      returnBtn: "Отлично, вернуться назад",
    },
    directory: {
      badge: "Travel Directory · Справочник DiyorAI",
      title: "Всё для исследования Узбекистана",
      subtitle: "Интерактивный путеводитель по городам, горным курортам Ташкентской области, гастрономии и гидам.",
      findGuideCta: "Найти проверенного гида →",
      categories: [
        {
          id: "cities",
          title: "Города и регионы",
          icon: "🏙",
          badge: "12 локаций",
          description: "От легендарных куполов Шелкового пути до оазисов Ферганской долины и пустынных сокровищ Каракалпакстана.",
          items: [
            { name: "Ташкент", tag: "Столица", details: "Современный мегаполис, мраморное метро, парки и крупнейший базар Чорсу." },
            { name: "Самарканд", tag: "Жемчужина", details: "Величественный Регистан, мавзолей Гур-Эмир и некрополь Шахи-Зинда." },
            { name: "Бухара", tag: "Священная", details: "Крепость Арк, минарет Калян, торговые купола и суфийские обители." },
            { name: "Хива", tag: "Музей под открытым небом", details: "Крепость Ичан-Кала, минарет Кальта-Минор, дворец Тош-Ховли." },
            { name: "Шахрисабз", tag: "Родина Амира Тимура", details: "Грандиозный дворец Аксарай и горный перевал Тахтакарача." },
            { name: "Фергана & Риштан", tag: "Ремесла", details: "Знаменитая риштанская керамика и шелковая фабрика 'Ёдгорлик'." },
            { name: "Андижан", tag: "Долина", details: "Родина Бабура, парковые комплексы и восточные гастрономические базары." },
            { name: "Наманган", tag: "Сады & Цветы", details: "Город цветов, ремесленные центры ножей Чуста и парки отдыха." },
            { name: "Нукус & Муйнак", tag: "Искусство & Арал", details: "Музей Савицкого (русский авангард), плато Устюрт и Аральское море." },
            { name: "Термез", tag: "Древний Буддизм", details: "Буддийские комплексы Фаязтепа, Каратепа и памятники Бактрии." },
            { name: "Джизак", tag: "Заамин", details: "Узбекская Швейцария: хвойные леса Зааминского национального парка." },
            { name: "Гулистан", tag: "Сырдарья", details: "Сырдарьинские рыбные ресторанчики и бескрайние степные просторы." },
          ],
        },
        {
          id: "tashkent_region",
          title: "Ташкентская область & Горы",
          icon: "🏔",
          badge: "Горы & Уикенды",
          description: "Всесезонные курорты, чистейшие горные водохранилища, альпийские луга и сосновые леса в 1–2 часах от столицы.",
          items: [
            { name: "Чарвакское водохранилище", tag: "Озеро & Пляжи", details: "Водные прогулки на катерах, пляжные зоны, комплекс 'Бочка' с шашлыками." },
            { name: "Курорт Амирсой", tag: "Премиум Resort", details: "Гондольный подъемник на 2290м, горнолыжные трассы мирового класса, шале." },
            { name: "Большой Чимган", tag: "Альпинизм & Хайкинг", details: "Вершина 3309м, ущелья, альпийские луга и катание на лошадях." },
            { name: "Бельдерсай", tag: "Природа", details: "Длинная кресельная канатная дорога (3 км), ущелье Мраморной речки, петроглифы." },
            { name: "Угам-Чаткальский нацпарк", tag: "Заповедник ЮНЕСКО", details: "Гулькамские теснины, водопады, чистейшие горные реки Пскем и Коксу." },
            { name: "Сукок & Паркент", tag: "Гастрономия & Лес", details: "Заповедный сосновый бор, фирменный сукокский шашлык и винодельни Chateau Hamkor." },
          ],
        },
        {
          id: "history",
          title: "Исторические шедевры",
          icon: "🏛",
          badge: "ЮНЕСКО",
          description: "Памятники мировой архитектуры, включенные во всемирное наследие человечества.",
          items: [
            { name: "Ансамбль Регистан (Самарканд)", tag: "XV-XVII вв.", details: "Три грандиозных медресе с лазурными куполами и золоченой росписью." },
            { name: "Крепость Ичан-Кала (Хива)", tag: "XVIII-XIX вв.", details: "Полностью сохранившийся средневековый город за глиняными стенами." },
            { name: "Цитадель Арк (Бухара)", tag: "V в.", details: "Древнейший дворец бухарских эмиров, возвышающийся над Регистаном Бухары." },
            { name: "Некрополь Шахи-Зинда (Самарканд)", tag: "XI-XV вв.", details: "Улица шедевральных мавзолеев с уникальной резной майоликой." },
            { name: "Дворец Худояр-хана (Коканд)", tag: "1871 г.", details: "Жемчужина Ферганской долины, покрытая яркими геометрическими изразцами." },
          ],
        },
        {
          id: "food",
          title: "Гастрономия Узбекистана",
          icon: "🍽",
          badge: "Вкусы Востока",
          description: "Легендарные чайханы, гастрономические центры и традиционные рецепты каждого вилоята.",
          items: [
            { name: "Ташкентский праздничный плов", tag: "Besh Qozon", details: "Желтая морковь, изюм, баранина, казы и перепелиные яйца." },
            { name: "Самаркандский слоеный плов", tag: "Ош-Марказ", details: "Плов, который подается слоями с мягчайшим мясом и сочной морковью." },
            { name: "Бухарский Оши-Софи", tag: "Диетический", details: "Традиционный плов, варящийся в медном казане без обжарки." },
            { name: "Хорезмский Шивит Ош", tag: "Зеленая лапша", details: "Лапша на настое свежего укропа с тушеным мясом и кислым молоком." },
            { name: "Джизакская самса", tag: "XXL", details: "Гигантская сочная тандырная самса с рубленым мясом и луком." },
          ],
        },
        {
          id: "guides",
          title: "Аккредитованные гиды",
          icon: "👨‍🏫",
          badge: "Trust System",
          description: "Проверенные специалисты с оценками по 10 критериям надёжности и безопасности.",
          items: [
            { name: "Каталог проверенных гидов", tag: "25+ специалистов", details: "Историки, архитекторы, гастро-эксперты и горные спасатели.", linkUrl: "/guides" },
            { name: "Аудит надёжности (Trust Score)", tag: "94/100 avg", details: "Проверка дипломов, биометрии и 100% реальных отзывов туристов." },
            { name: "Персональный Match Score", tag: "AI подбор", details: "Точный подбор гида под язык, формат поездки (семья, пара, соло) и темп." },
          ],
        },
        {
          id: "transport",
          title: "Транспорт и логистика",
          icon: "🚗",
          badge: "Междугородний",
          description: "Скоростные поезда, внутренние перелеты, такси и трансферы по городам Узбекистана.",
          items: [
            { name: "Скоростной поезд Afrosiyob", tag: "250 км/ч", details: "Ташкент ↔ Самарканд (2ч 15м), Самарканд ↔ Бухара (1ч 30м). Бронь за 45 дней!" },
            { name: "Внутренние рейсы Silk Avia", tag: "Авиа", details: "Быстрые перелеты на ATR-72 в Термез, Нукус, Фергану, Бухару и Самарканд." },
            { name: "Yandex Go и авто-трансферы", tag: "Такси & Минивэны", details: "Удобные поездки по городам и комфортабельные минивэны в горы Чимгана." },
          ],
        },
        {
          id: "crafts",
          title: "Культура и ремёсла",
          icon: "🎭",
          badge: "Мастерские",
          description: "Древние ремесленные династии, передающие секреты мастерства из поколения в поколение.",
          items: [
            { name: "Риштанская лазурная керамика", tag: "Фергана", details: "Знаменитая посуда с глазурью 'ишкор' из натуральных горных трав." },
            { name: "Маргиланский шёлк и хан-атлас", tag: "Ткачество", details: "Ручное шелкоткачество по старинным технологиям на фабрике 'Ёдгорлик'." },
            { name: "Бухарское золотое шитьё", tag: "Ювелирное", details: "Традиция парадных бархатных халатов, расшитых золотой и серебряной нитью." },
            { name: "Самаркандская шелковая бумага", tag: "Конигил", details: "Ручное производство долговечной бумаги из коры тутового дерева." },
          ],
        },
      ],
    },
    faq: {
      badge: "База знаний & Часто задаваемые вопросы",
      title: "Часто задаваемые вопросы (FAQ)",
      subtitle: "Ответы на все вопросы о планировании маршрутов, контроле бюджета, гидах и логистике.",
      searchPlaceholder: "Поиск по вопросам и ответам...",
      allCategory: "Все вопросы",
      emptySearch: "По вашему запросу вопросов не найдено.",
      items: [
        {
          id: "faq-plan-1",
          category: "Планирование",
          categoryIcon: "🗺️",
          question: "Как DiyorAI строит мой персональный маршрут?",
          answer: "DiyorAI использует умный алгоритм скоринга: анализирует ваши интересы, состав группы (семья, пара, соло, друзья), темп и климатический график дня. Маршрут упорядочивается эвристикой наименьшего пробега (nearest neighbor).",
          highlight: "Без спешки: климатическая сиеста в полдень и закатные панорамы вечером.",
          tag: "Алгоритм",
        },
        {
          id: "faq-plan-2",
          category: "Планирование",
          categoryIcon: "🗺️",
          question: "Что такое дни отдыха (Rest Days) и как они работают?",
          answer: "В дни отдыха система не перегружает вас экскурсиями, а предлагает гастрономические паузы, спа-комплексы, чайханы и неспешные прогулки.",
          highlight: "🌿 REST DAY позволяет не уставать от обилия впечатлений в длительных поездках.",
          tag: "Баланс",
        },
        {
          id: "faq-budget-1",
          category: "Бюджет",
          categoryIcon: "💰",
          question: "Что произойдёт, если поездка превышает мой бюджет?",
          answer: "DiyorAI непрерывно контролирует сумму расходов в реальном времени. Если выбранные услуги превышают лимит, система показывает предупреждение и подсказывает альтернативы.",
          highlight: "Экономия до $150 без потери комфорта.",
          tag: "Контроль",
        },
        {
          id: "faq-budget-2",
          category: "Бюджет",
          categoryIcon: "💰",
          question: "Как работает калькулятор «Кто сколько платит»?",
          answer: "Для пар доступно разделение 50/50 или режим «Один оплачивает всё». Для друзей расходы делятся строго поровну. Для семей учитываются скидки на детей.",
          highlight: "Прозрачный расчет расходов на каждого участника.",
          tag: "Сплит",
        },
        {
          id: "faq-trans-1",
          category: "Транспорт",
          categoryIcon: "🚗",
          question: "Как система рассчитывает количество автомобилей трансфера?",
          answer: "Система автоматически сопоставляет число пассажиров с вместимостью класса авто. Если группа превышает лимит, система добавляет необходимое число авто.",
          highlight: "Автоматический расчет для любых групп.",
          tag: "Вместимость",
        },
        {
          id: "faq-hotel-1",
          category: "Отели",
          categoryIcon: "🏨",
          question: "Как рассчитывается количество номеров и ночей?",
          answer: "Количество ночей равно (дней - 1). Число номеров рассчитывается исходя из вместимости выбранного номера и общего числа гостей.",
          highlight: "Никаких переплат за лишние комнаты.",
          tag: "Проживание",
        },
        {
          id: "faq-guides-1",
          category: "Гриды & Trust",
          categoryIcon: "👨‍🏫",
          question: "Чем подтверждается надёжность гида (Trust Score)?",
          answer: "Trust Score формируется на основе государственной аккредитации, биометрической проверки личности, истории туров, пунктуальности и проверенных отзывов.",
          highlight: "🛡 100% доказательная надёжность.",
          tag: "Trust",
        },
        {
          id: "faq-book-1",
          category: "Бронирование",
          categoryIcon: "🔒",
          question: "Что происходит после нажатия «Забронировать»?",
          answer: "Формируется уникальный номер бронирования (Booking ID). Данные направляются специалисту, который связывается с вами в течение 10–15 минут.",
          highlight: "Мгновенное подтверждение и персональный менеджер.",
          tag: "Безопасность",
        },
      ],
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
      architecture: "Исламская архитектура",
      pilgrimage: "Паломничество и святыни",
      nature: "Природа",
      gastronomy: "Гастрономия (плов, чайханы)",
      crafts_bazaars: "Ремесла и базары",
      nature_hiking: "Горы и хайкинг",
      soviet_modernism: "Советский модернизм и арт",
      photography: "Фотография и панорамы",
      archaeology: "Археология и раскопки",
      night_tours: "Ночные туры и огни",
      eco_tourism: "Экотуризм и ущелья",
      skiing: "Горные лыжи и спорт",
      family_travel: "Семейный отдых с детьми",
    },
    regions: {
      samarkand: "Самарканд",
      bukhara: "Бухара",
      khiva: "Хива",
      tashkent: "Ташкент (Город)",
      tashkent_region: "Ташкентская область (Горы / Чарвак / Амирсой)",
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

  // ==========================================
  // UZBEK
  // ==========================================
  uz: {
    appName: "DiyorAI",
    appSubtitle: "Yagona raqamli sayyohlik yordamchisi",
    tagline: "O'zbekiston bo'ylab sayohatingiz hamrohi",
    nav: {
      trip: "Yo'nalish",
      verify: "Faktlarni tekshirish",
      guides: "Gidlar & Trust",
      faq: "FAQ & Yordam",
    },
    footer: {
      rights: "DiyorAI — raqamli sayyohlik yordamchisi. NEXUS30 Hakaton (TravelTech).",
      sources: "Ma'lumotlar: OpenStreetMap, Wikidata, Wikipedia (ochiq manbalar)",
    },
    home: {
      badge: "Turizm qo'mitasi & TravelTech",
      title: "O'zbekiston bo'ylab sayohatingiz hamrohi",
      subtitle:
        "Uchta alohida xizmat o'rniga bitta raqamli yordamchi: ob-havoni inobatga olgan holda shaxsiy yo'nalish tuzadi, gid aytgan ma'lumotlarni tekshiradi va ishonchli mutaxassislarni topadi.",
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
    planner: {
      stepWho: "1. KIMLAR sayohat qiladi?",
      stepDays: "2. Sayohat NECHA KUN davom etadi?",
      stepFormat: "3. FORMAT va yo'nalish",
      stepPace: "4. SAYOHAT SUR'ATI",
      stepBudget: "5. BYUDJET (Xarajatlar ko'lami)",
      stepInterests: "6. QIZIQISHLAR VA AFZALLIKLAR",
      stepOrganize: "🚀 SAYOHATNI TASHKIL QILISH",
      organizeSubtitle: "Logistika va turar joyni bosqichma-bosqich tanlash",
      changeParams: "Parametrlarni o'zgartirish",
      adultsLabel: "Kattalar",
      childrenLabel: "Bolalar",
      totalDaysLabel: "Jami kunlar soni",
      activeDaysLabel: "Faol kunlar (ekskursiyalar)",
      restDaysLabel: "Dam olish kunlari (relaks va spa)",
      restDayNotice: "🌿 Dam olish kunlari dasturga tig'iz jadvalsiz kiritiladi",
      mountainWeekendTitle: "Toshkent viloyatini kashf eting (Tog'lar va dam olish)",
      mountainWeekendDesc: "Chorvoq suv ombori, Amirsoy tog'-chang'i kurorti, Chimgan, Beldersoy va So'qoq qarag'ayzorlari.",
      mountainWeekendBadge: "Tayyor uikend: 25–40$/kishi",
      budgetLimitLabel: "Cheklov",
      unlimited: "Cheklovsiz",
      budgetBarTitle: "Xarajatlarni real vaqtda nazorat qilish",
      budgetInLimit: "Byudjet doirasida",
      budgetOverLimit: "Byudjetdan oshib ketdi",
      budgetTipPrefix: "💡 Tejash bo'yicha maslahat",
      transportTitle: "1-bosqich: Manzilgacha transport",
      transferTitle: "2-bosqich: Joydagi transfer",
      hotelTitle: "3-bosqich: Turar joy (Mehmonxonalar va kottejlar)",
      flightTab: "✈️ Samolyot",
      trainTab: "🚆 Poyezd",
      carTab: "🚗 Avtomobilda",
      roundTrip: "Borish va qaytish",
      oneWay: "Bir tomonga",
      passengersCount: "Yo'lovchilar soni",
      departure: "Jo'nash",
      arrival: "Yetib borish",
      selectBtn: "Tanlash",
      selectedBtn: "✓ Tanlandi",
      nextStep: "Keyingisi →",
      backStep: "← Orqaga",
      finishPlan: "Yo'nalishni tuzish 🚀",
      carsNeeded: "ta avtomobil talab etiladi",
      roomsNeeded: "ta xona talab etiladi",
      nightsCount: "kecha",
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
      restDayTitle: "🌿 Dam olish va hordiq kuni",
      restDayDesc: "Shoshilmasdan taomlanish, choyxonalar, spa va sayr uchun bo'sh vaqt.",
      financialSummary: "Sayohat moliyaviy hisob-kitobi (Trip Summary)",
      costTransport: "Transport (shaharlararo)",
      costTransfer: "Joydagi transferlar",
      costHotel: "Turar joy (mehmonxona)",
      costActivitiesFood: "Ovqatlanish, muzeylar va chiptalar",
      costOther: "SIM-karta, ichimlik suvi va shahar ichi xarajatlari",
      costTotal: "Umumiy qiymat",
      costPerPerson: "bir kishi uchun",
      payerSplitTitle: "Kalkulyator: Kim qancha to'laydi",
      splitEqual: "Teng bo'lish (hamma o'z ulushini)",
      splitSingle: "Barchasini bir kishi to'laydi",
      splitFamily: "Oilaviy taqsimot (bolalar xarajatini ota-ona qoplaydi)",
      bookTripCta: "🔒 USHBU SAYOHATNI BAND QILISH",
      exportPdf: "PDF shaklida yuklab olish",
      shareTelegram: "Telegramda ulashish",
    },
    verify: {
      badge: "Ma'lumotlar tekshiruvi & Anti-afsonalar",
      title: "Gid aslida nimalarni aytib berdi?",
      subtitle: "Turistik obyektni tanlang va ma'lumotlarni ishonchli manbalar orqali tekshiring.",
      objectLabel: "Obyekt",
      queryLabel: "Gid nima dedi? (ixtiyoriy)",
      placeholder: "Masalan: minora 1220-yildagi mo'g'ullar hujumidan omon qolgan",
      button: "Faktni tekshirish",
      checking: "Manbalar solishtirilmoqda…",
      matchedTitle: "Tasdiqlangan faktlar bazasidan moslik topildi:",
      noMatchTitle: "To'g'ridan-to'g'ri moslik topilmadi. Obyekt bo'yicha eng yaqin faktlar:",
      listedTitle: "Obyekt bo'yicha barcha tekshirilgan faktlar:",
      source: "Manba",
      verifiedAt: "Tekshirilgan sana",
    },
    guides: {
      badge: "O'zbekiston akkreditatsiyadan o'tgan gidlari · Trust & Verification",
      title: "Sayohatingiz uchun ishonchli gidni toping",
      subtitle: "DiyorAI tizimidagi har bir gid shaxsiyati, davlat litsenziyasi va ishonchliligi bo'yicha to'liq auditdan o'tgan.",
      trustGuaranteeTitle: "DiyorAI ishonchlilik kafolati (Trust Guarantee)",
      trustGuaranteeDesc: "Turizm qo'mitasi litsenziyasi · Biometrik tekshiruv · Shaffof baholash",
      verifiedCountBadge: "✓ 25+ tekshirilgan gid",
      avgTrustScore: "🛡 O'rtacha Trust Score: 94/100",
      searchPlaceholder: "Gid ismi yoki shahar bo'yicha qidiruv...",
      sortLabel: "Saralash",
      locationFilter: "Manzil / Shahar",
      specFilter: "Ekskursiya mavzusi",
      languageFilter: "Gid tili",
      verifiedOnlyLabel: "Faqat 100% tekshirilgan gidlar",
      empty: "Tanlangan filtrlar bo'yicha gidlar topilmadi.",
      resetFilters: "Filtrlarni tozalash",
      viewProfileBtn: "🔍 Profil va audit",
      bookGuideBtn: "🔒 Band qilish",
      trustScoreLabel: "Trust Score",
      matchScoreLabel: "Moslik",
      perTour: "tur uchun",
      verifiedBadge: "Tekshirilgan",
      licenseBadge: "Litsenziya",
      toursCount: "ta tur",
      modalOverviewTab: "📋 Umumiy ma'lumot",
      modalTrustTab: "🛡 Ishonchlilik auditi (Trust Breakdown)",
      modalReviewsTab: "💬 Sharhlar",
      modalTrustEvidenceTitle: "Gid ishonchliligini tasdiqlovchi dalillar (Trust Evidence)",
      modalTrustEvidenceDesc: "Har bir mutaxassisning qat'iy tekshiruv va audit tizimi",
      modalIdentityVerified: "Shaxsiyat tasdiqlangan",
      modalIdentityDesc: "Pasport va biometrik ma'lumotlar davlat reyestri orqali tekshirilgan",
      modalLicenseVerified: "Turizm qo'mitasi litsenziyasi",
      modalLicenseDesc: "Ekskursiya yetakchisining amaldagi davlat sertifikati",
      modalExperienceDesc: "haqiqiy sayyohlar bilan o'tkazilgan turlar",
      modalPunctualityDesc: "Belgilangan uchrashuv joyiga o'z vaqtida yetib kelish",
      modalRadarTitle: "Asosiy mezonlar bo'yicha baholar (Customer Experience)",
      modalKnowledge: "📚 Tarixiy bilimlarning chuqurligi",
      modalCommunication: "🗣 Muloqot va tushunarli yetkazish",
      modalService: "😊 G'amxo'rlik va servis darajasi",
      modalOrganization: "⏱ Vaqt va logistika tashkiliyoti",
      modalSafety: "🛡 Xavfsizlik va yo'l-yo'riq",
      modalStatsCompleted: "Turlarni yakunlash",
      modalStatsPunctuality: "Vaqtida",
      modalStatsResponse: "Javob berish vaqti",
      modalStatsCancellation: "Gid tomonidan bekor qilish",
      modalWhyRecommendedTitle: "Nima uchun DiyorAI bu gidni tavsiya qiladi",
      modalCloseBtn: "Yopish",
      modalBookGuideBtn: "🔒 Gidni band qilish",
    },
    booking: {
      modalTitle: "Sayoxatni band qilish",
      guideBookingSubtitle: "Akkreditatsiyadan o'tgan gid bilan ekskursiyani band qilish",
      tripBookingSubtitle: "Yo'nalish, transport va mehmonxonani to'liq band qilish",
      dateLabel: "Sayohat / Ekskursiya sanasi",
      travelersLabel: "Qatnashuvchilar",
      adults: "Kattalar",
      children: "Bolalar",
      capacityWarning: "Katta guruh: gid qulaylik uchun individual audiogidlardan foydalanishni taklif etadi.",
      contactInfoTitle: "Bog'lanish uchun ma'lumotlar",
      fullNameLabel: "Ism va familiyangiz *",
      fullNamePlaceholder: "Masalan: Aziz Rahimov",
      phoneLabel: "Telefon raqami (kod bilan) *",
      emailLabel: "Email (tasdiqlash uchun)",
      contactMethodLabel: "Afzal ko'rilgan aloqa usuli",
      commentsLabel: "Qo'shimcha istaklar (ixtiyoriy)",
      commentsPlaceholder: "Masalan: qulay uchrashuv vaqti, bolalar o'rindig'i...",
      totalToPay: "To'lov uchun jami",
      submitBtn: "✓ Band qilishni tasdiqlash",
      submitting: "Yuborilmoqda...",
      successTitle: "Sayohat muvaffaqiyatli band qilindi!",
      successSubtitle: "Arizangiz qabul qilindi va DiyorAI tizimida ro'yxatga olindi.",
      bookingIdLabel: "Buyurtma raqami",
      guideLabel: "Gid",
      tourDateLabel: "Sana",
      travelersCountLabel: "Qatnashuvchilar",
      totalCostLabel: "Qiymati",
      contactNotice: "Mutaxassisimiz 10–15 daqiqa ichida barcha tafsilotlarni tasdiqlash uchun siz bilan bog'lanadi.",
      returnBtn: "Ajoyib, ortga qaytish",
    },
    directory: {
      badge: "Sayohatchi ma'lumotnomasi · DiyorAI",
      title: "O'zbekistonni kashf etish uchun barchasi",
      subtitle: "Shaharlar, Toshkent viloyati tog' kurortlari, milliy taomlar va tekshirilgan gidlar bo'yicha interaktiv qo'llanma.",
      findGuideCta: "Ishonchli gidni topish →",
      categories: [
        {
          id: "cities",
          title: "Shaharlar va viloyatlar",
          icon: "🏙",
          badge: "12 ta manzil",
          description: "Ipak yo'lining qadimiy gumbazlaridan tortib, Farg'ona vodiysi va Qoraqalpog'istonning betakror manzaralarigacha.",
          items: [
            { name: "Toshkent", tag: "Poytaxt", details: "Zamonaviy megapolis, marmar metro bekatlari, xiyobonlar va Chorsu bozori." },
            { name: "Samarqand", tag: "Durdonasi", details: "Muazzam Registon maydoni, Go'ri Amir maqbarasi va Shohi Zinda majmuasi." },
            { name: "Buxoro", tag: "Muqaddas", details: "Ark qal'asi, Minorai Kalon, savdo toqlari va qadimiy madrasalar." },
            { name: "Xiva", tag: "Ochiq osmon ostidagi muzey", details: "Ichan-Qal'a, Kalta Minor va Tosh-Hovli xon saroyi." },
            { name: "Shahrisabz", tag: "Amir Temur vatani", details: "Oqsaroy qoldiqlari va Taxtaqoracha go'zal tog' dovoni." },
            { name: "Farg'ona & Rishton", tag: "Hunarmandchilik", details: "Mashhur Rishton sirlangan sopol idishlari va Yodgorlik ipak fabrikasi." },
            { name: "Andijon", tag: "Vodiy gavhari", details: "Bobur memorial bog'i, qadimiy hunarmandlar ko'chasi va mashhur oshxona." },
            { name: "Namangan", tag: "Gullar shahri", details: "Chust pichoqchilik markazlari va go'zal bog'lar." },
            { name: "Nukus & Mo'ynoq", tag: "San'at & Orol", details: "Savitskiy nomidagi tasviriy san'at muzeyi va kemalar qabristoni." },
            { name: "Termiz", tag: "Qadimgi Buddizm", details: "Fayoztepa, Qoratepa qadimiy budda ibodatxonalari va Baqtriya yodgorliklari." },
            { name: "Jizzax", tag: "Zomin", details: "O'zbekiston Shveytsariyasi: Zomin milliy bog'ining archazor tog'lari." },
            { name: "Guliston", tag: "Sirdaryo", details: "Sirdaryo baliq taomlari va keng dasht manzaralari." },
          ],
        },
        {
          id: "tashkent_region",
          title: "Toshkent viloyati & Tog'lar",
          icon: "🏔",
          badge: "Tog'lar va dam olish",
          description: "Har faslda faol kurortlar, tiniq ko'llar va qarag'ayzorlar poytaxtdan 1-2 soatlik masofada.",
          items: [
            { name: "Chorvoq suv ombori", tag: "Ko'l & Plyajlar", details: "Katerlarda sayr, tog' plyajlari va mashhur 'Bo'chka' shashlik markazi." },
            { name: "Amirsoy kurorti", tag: "Premium Resort", details: "2290m balandlikdagi gondola dor yo'li, xalqaro darajadagi chang'i trassalari." },
            { name: "Katta Chimgan", tag: "Alpinizm & Xayking", details: "3309m cho'qqi, sharsharalar, alp o'tloqlari va otda sayr." },
            { name: "Beldersoy", tag: "Tabiat", details: "3 km uzunlikdagi o'rindiqli dor yo'li, Marmar daryosi va qoyatosh rasmlari." },
            { name: "Ugom-Chotqol milliy bog'i", tag: "YUNESKO merosi", details: "Gulkam daralari, sharsharalar va Pskem hamda Ko'ksuv daryolari." },
            { name: "So'qoq & Parkent", tag: "Gastronomiya & O'rmon", details: "So'qoq qarag'ayzorlari, mashhur shashlik va Chateau Hamkor uzumzorlari." },
          ],
        },
        {
          id: "history",
          title: "Tarixiy durdonalar",
          icon: "🏛",
          badge: "YUNESKO",
          description: "Butunjahon insoniyat merosi ro'yxatiga kiritilgan me'moriy yodgorliklar.",
          items: [
            { name: "Registon ansambli (Samarqand)", tag: "XV-XVII asrlar", details: "Uch buyuk madrasa: Ulug'bek, Sherdor va Tillakori." },
            { name: "Ichan-Qal'a (Xiva)", tag: "XVIII-XIX asrlar", details: "Loyi devorlar bilan o'ralgan yaxlit saqlanib qolgan o'rta asr shahri." },
            { name: "Ark qo'rg'oni (Buxoro)", tag: "V asr", details: "Buxoro amirlarining qadimiy qarorgohi." },
            { name: "Shohi Zinda (Samarqand)", tag: "XI-XV asrlar", details: "Moviy naqshlar bilan bezatilgan muqaddas maqbaralar xiyoboni." },
            { name: "Xudoyorxon saroyi (Qo'qon)", tag: "1871-yil", details: "Farg'ona vodiysining eng hashamatli xon saroyi." },
          ],
        },
        {
          id: "food",
          title: "O'zbek milliy taomlari",
          icon: "🍽",
          badge: "Sharq lazzatlari",
          description: "Har bir viloyatning o'ziga xos pazandachilik sirlari va milliy choyxonalari.",
          items: [
            { name: "Toshkent to'y oshi", tag: "Besh Qozon", details: "Sariq sabzi, mayiz, qo'y go'shti, qazi va bedana tuxumlari bilan." },
            { name: "Samarqand oshi", tag: "Osh-Markaz", details: "Qavatma-qavat suziladigan, mayin go'shtli mashhur Samarqand palovi." },
            { name: "Buxoro Oshi-Sofisi", tag: "Parhezbop", details: "Mis qozonda yog'siz qaynatib tayyorlanadigan qadimiy taom." },
            { name: "Xorazm Shivit Oshi", tag: "Yashil lag'mon", details: "Shivit sharbati bilan qorilgan xamir va qatiqli qayla." },
            { name: "Jizzax somsasi", tag: "XXL", details: "Tandirda pishiriladigan ulkan va sersuv go'shtli somsa." },
          ],
        },
        {
          id: "guides",
          title: "Akkreditatsiyadan o'tgan gidlar",
          icon: "👨‍🏫",
          badge: "Trust System",
          description: "10 ta xavfsizlik va ishonchlilik mezonlari asosida tekshirilgan mutaxassislar.",
          items: [
            { name: "Gidlar to'liq katalogi", tag: "25+ mutaxassis", details: "Tarixchilar, me'morlar va tog' yo'l-yo'riqchilari.", linkUrl: "/guides" },
            { name: "Trust Score auditi", tag: "94/100 o'rtacha", details: "Diplomlar, biometriya va 100% haqiqiy sayyohlar sharhlari." },
            { name: "Match Score saralashi", tag: "AI yordamida", details: "Til, sayohat formati va sur'atingizga moslashtirilgan tanlov." },
          ],
        },
        {
          id: "transport",
          title: "Transport va logistika",
          icon: "🚗",
          badge: "Shaharlararo",
          description: "Afrosiyob tezyurar poyezdlari, ichki aviaqatnovlar va qulay transferlar.",
          items: [
            { name: "Afrosiyob tezyurar poyezdi", tag: "250 km/soat", details: "Toshkent ↔ Samarqand (2s 15m), Samarqand ↔ Buxoro (1s 30m). 45 kun oldin chipta oling!" },
            { name: "Silk Avia ichki reyslari", tag: "Avia", details: "Termiz, Nukus, Farg'ona, Buxoro va Samarqandga qulay parvozlar." },
            { name: "Yandex Go va tog' transferlari", tag: "Taksi va mikroavtobus", details: "Shahar ichida va Chimgan tog'lariga qulay avtomashinalar." },
          ],
        },
        {
          id: "crafts",
          title: "Madaniyat va hunarmandchilik",
          icon: "🎭",
          badge: "Ustaxonalar",
          description: "Avloddan-avlodga o'tib kelayotgan qadimiy xalq amaliy san'ati.",
          items: [
            { name: "Rishton lojuvard kulolchiligi", tag: "Farg'ona", details: "Tog' o'simliklari kulidan tayyorlangan tabiiy 'ishqor' siri." },
            { name: "Marg'ilon xon-atlasi va shoyisi", tag: "To'qimachilik", details: "Yodgorlik fabrikasida qo'lda to'qiladigan tabiiy ipak matolar." },
            { name: "Buxoro zardo'zlik san'ati", tag: "Zargarlik", details: "Zar va kumush iplar bilan baxmalga tikilgan saroy choponlari." },
            { name: "Konigil ipak qog'ozi (Samarqand)", tag: "Qo'lda tayyorlangan", details: "Tut daraxti po'stlog'idan ming yil saqlanuvchi qog'oz ishlab chiqarish." },
          ],
        },
      ],
    },
    faq: {
      badge: "Bilimlar bazasi & Ko'p so'raladigan savollar",
      title: "Ko'p so'raladigan savollar (FAQ)",
      subtitle: "Yo'nalish tuzish, byudjet nazorati, gidlar va logistika bo'yicha barcha savollarga aniq javoblar.",
      searchPlaceholder: "Savollar va javoblar bo'yicha qidiruv...",
      allCategory: "Barcha savollar",
      emptySearch: "So'rovingiz bo'yicha savollar topilmadi.",
      items: [
        {
          id: "faq-plan-1",
          category: "Rejalashtirish",
          categoryIcon: "🗺️",
          question: "DiyorAI mening shaxsiy yo'nalishimni qanday tuzadi?",
          answer: "DiyorAI aqlli tahlil algoritmidan foydalanadi: qiziqishlaringiz, guruh tarkibi (oila, juftlik, do'stlar, solo), sur'at va kunlik ob-havoni inobatga oladi.",
          highlight: "Shoshilmasdan: tush payti salqin muzeylar va choyxonalar, kechqurun go'zal panoramalar.",
          tag: "Algoritm",
        },
        {
          id: "faq-plan-2",
          category: "Rejalashtirish",
          categoryIcon: "🗺️",
          question: "Dam olish kunlari (Rest Days) nima va u qanday ishlaydi?",
          answer: "Dam olish kunlarida tizim sizni qat'iy ekskursiyalar bilan charchatmaydi, balki mazali taomlanish, choyxona va hordiq chiqarishni taklif etadi.",
          highlight: "🌿 REST DAY uzoq safarlarda ortiqcha toliqishning oldini oladi.",
          tag: "Muvozanat",
        },
        {
          id: "faq-budget-1",
          category: "Byudjet",
          categoryIcon: "💰",
          question: "Sayohat byudjetimdan oshib ketsa nima bo'ladi?",
          answer: "DiyorAI xarajatlarni real vaqtda nazorat qiladi. Agar tanlangan xizmatlar belgilangan byudjetdan oshsa, ogohlantirish beradi va muqobil tejash yo'llarini ko'rsatadi.",
          highlight: "Qulaylikni yo'qotmagan holda 150$ gacha tejash imkoniyati.",
          tag: "Nazorat",
        },
        {
          id: "faq-budget-2",
          category: "Byudjet",
          categoryIcon: "💰",
          question: "«Kim qancha to'laydi» kalkulyatori qanday ishlaydi?",
          answer: "Juftliklar uchun 50/50 yoki bir kishi to'lash rejimi, do'stlar uchun teng taqsimot, oilalar uchun bolalar chegirmasi inobatga olinadi.",
          highlight: "Har bir ishtirokchi uchun shaffof hisob-kitob.",
          tag: "Taqsimot",
        },
        {
          id: "faq-trans-1",
          category: "Transport",
          categoryIcon: "🚗",
          question: "Transfer avtomobillari soni qanday hisoblanadi?",
          answer: "Tizim yo'lovchilar sonini avtomobil sig'imi bilan avtomatik taqqoslaydi va zarurat bo'lsa kerakli miqdorda avtomobil qo'shadi.",
          highlight: "Har qanday guruh uchun avtomatik to'g'ri hisob-kitob.",
          tag: "Sig'im",
        },
        {
          id: "faq-hotel-1",
          category: "Mehmonxonalar",
          categoryIcon: "🏨",
          question: "Xonalar va kechalar soni qanday belgilanadi?",
          answer: "Kechalar soni (kunlar - 1) ga teng. Xonalar soni esa tanlangan xona sig'imi va mehmonlar soniga qarab hisoblanadi.",
          highlight: "Ortiqcha xonalar uchun ortiqcha to'lovsiz.",
          tag: "Turar joy",
        },
        {
          id: "faq-guides-1",
          category: "Gidlar & Trust",
          categoryIcon: "👨‍🏫",
          question: "Gidning ishonchliligi (Trust Score) nimaga asoslangan?",
          answer: "Trust Score davlat litsenziyasi, biometrik tekshiruv, o'tkazilgan turlar tarixi, vaqtga rioya qilish va sayyohlar sharhlari asosida shakllanadi.",
          highlight: "🛡 100% dalillarga asoslangan ishonchlilik.",
          tag: "Ishonch",
        },
        {
          id: "faq-book-1",
          category: "Band qilish",
          categoryIcon: "🔒",
          question: "«Band qilish» tugmasi bosilgandan so'ng nima sodir bo'ladi?",
          answer: "Noyob buyurtma raqami (Booking ID) yaratiladi. Ma'lumotlar mutaxassisga yuboriladi va u 10–15 daqiqa ichida siz bilan bog'lanadi.",
          highlight: "Tezkor tasdiq va shaxsiy menejer.",
          tag: "Xavfsizlik",
        },
      ],
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
      architecture: "Islom me'morchiligi",
      pilgrimage: "Ziyoratgohlar va qadamjolar",
      nature: "Tabiat",
      gastronomy: "Gastronomiya (osh, choyxonalar)",
      crafts_bazaars: "Hunarmandchilik va bozorlar",
      nature_hiking: "Tog'lar va piyoda sayr",
      soviet_modernism: "Sovet modernizmi va san'at",
      photography: "Fotosessiya va manzaralar",
      archaeology: "Arxeologiya va qazilmalar",
      night_tours: "Tungi sayohatlar",
      eco_tourism: "Ekoturizm va daralar",
      skiing: "Tog' chang'isi va sport",
      family_travel: "Bolali oilaviy sayohat",
    },
    regions: {
      samarkand: "Samarqand",
      bukhara: "Buxoro",
      khiva: "Xiva",
      tashkent: "Toshkent shahri",
      tashkent_region: "Toshkent viloyati (Tog'lar / Chorvoq / Amirsoy)",
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

  // ==========================================
  // ENGLISH
  // ==========================================
  en: {
    appName: "DiyorAI",
    appSubtitle: "Unified Digital Tourism Assistant",
    tagline: "Your Travel Companion Across Uzbekistan",
    nav: {
      trip: "Itinerary",
      verify: "Fact Checker",
      guides: "Guides & Trust",
      faq: "FAQ & Help",
    },
    footer: {
      rights: "DiyorAI — Digital Tourism Assistant. NEXUS30 Hackathon (TravelTech).",
      sources: "Data: OpenStreetMap, Wikidata, Wikipedia (Open Sources)",
    },
    home: {
      badge: "Uzbekistan Tourism Committee & TravelTech",
      title: "Your Travel Companion Across Uzbekistan",
      subtitle:
        "One intelligent assistant replacing multiple services: creates weather-aware personalized itineraries, verifies tour guide facts against trusted sources, and matches expert certified guides.",
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
    planner: {
      stepWho: "1. WHO is traveling?",
      stepDays: "2. HOW MANY DAYS?",
      stepFormat: "3. FORMAT & Destination",
      stepPace: "4. TRAVEL PACE",
      stepBudget: "5. BUDGET (Expense Range)",
      stepInterests: "6. INTERESTS & PREFERENCES",
      stepOrganize: "🚀 ORGANIZE TRIP",
      organizeSubtitle: "Step-by-step logistics and accommodation selection",
      changeParams: "Change parameters",
      adultsLabel: "Adults",
      childrenLabel: "Children",
      totalDaysLabel: "Total trip days",
      activeDaysLabel: "Active touring days",
      restDaysLabel: "Rest days (relax & spa)",
      restDayNotice: "🌿 Rest days included in itinerary for leisure and wellness",
      mountainWeekendTitle: "Explore Tashkent Region (Mountains & Weekends)",
      mountainWeekendDesc: "Charvak Reservoir, Amirsoy Mountain Resort, Greater Chimgan, Beldersay, and Sukok pine forests.",
      mountainWeekendBadge: "All-in Weekend Tour from $25–40/person",
      budgetLimitLabel: "Limit",
      unlimited: "Unlimited",
      budgetBarTitle: "Real-time Budget Tracker",
      budgetInLimit: "Within Budget",
      budgetOverLimit: "Over Budget",
      budgetTipPrefix: "💡 Optimization Tip",
      transportTitle: "Step 1: Intercity Transportation",
      transferTitle: "Step 2: Local Transfers & Ground Travel",
      hotelTitle: "Step 3: Stays (Hotels & Heritage Guesthouses)",
      flightTab: "✈️ Flight",
      trainTab: "🚆 Train",
      carTab: "🚗 By Car",
      roundTrip: "Round Trip",
      oneWay: "One Way",
      passengersCount: "Passengers",
      departure: "Departure",
      arrival: "Arrival",
      selectBtn: "Select",
      selectedBtn: "✓ Selected",
      nextStep: "Next →",
      backStep: "← Back",
      finishPlan: "Generate Itinerary 🚀",
      carsNeeded: "car(s) required",
      roomsNeeded: "room(s) required",
      nightsCount: "nights",
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
      restDayTitle: "🌿 Rest & Leisure Day",
      restDayDesc: "Free time for relaxation, tea houses, wellness, spa, and leisurely strolls without fixed schedules.",
      financialSummary: "Trip Financial Breakdown (Trip Summary)",
      costTransport: "Intercity Transport",
      costTransfer: "Ground Transfers",
      costHotel: "Accommodation (Hotel/Chalet)",
      costActivitiesFood: "Dining, Museums & Activities",
      costOther: "SIM card, water & city transit",
      costTotal: "Total Estimated Cost",
      costPerPerson: "per person",
      payerSplitTitle: "Cost Split Calculator: Who Pays What",
      splitEqual: "Split Equally (among all)",
      splitSingle: "One Pays All",
      splitFamily: "Family Share (parents cover kids)",
      bookTripCta: "🔒 BOOK THIS TRIP",
      exportPdf: "Export to PDF",
      shareTelegram: "Share via Telegram",
    },
    verify: {
      badge: "Fact Checker & Anti-Myth Engine",
      title: "What did the guide actually tell you?",
      subtitle: "Select a tourist site and verify claims against reliable open sources.",
      objectLabel: "Tourist Attraction",
      queryLabel: "What did the guide claim? (optional)",
      placeholder: "E.g.: Minaret survived the Mongol invasion in 1220",
      button: "Verify Fact",
      checking: "Checking sources…",
      matchedTitle: "Verified match found in knowledge base:",
      noMatchTitle: "No direct match found. Related verified facts about this site:",
      listedTitle: "All verified facts for this attraction:",
      source: "Source",
      verifiedAt: "Verified on",
    },
    guides: {
      badge: "Accredited Guides of Uzbekistan · Trust & Verification",
      title: "Find a Verified Guide for Your Journey",
      subtitle: "Every guide on DiyorAI undergoes identity verification, license audit, and reliability scoring.",
      trustGuaranteeTitle: "DiyorAI Trust Guarantee",
      trustGuaranteeDesc: "100% Tourism Committee Accreditation · Biometric Verification · Transparent Scoring",
      verifiedCountBadge: "✓ 25+ Verified Guides",
      avgTrustScore: "🛡 Average Trust Score: 94/100",
      searchPlaceholder: "Search by guide name or city...",
      sortLabel: "Sort by",
      locationFilter: "Location / City",
      specFilter: "Tour Specialty",
      languageFilter: "Guide Language",
      verifiedOnlyLabel: "100% Verified Guides Only",
      empty: "No guides found matching the selected filters.",
      resetFilters: "Reset Filters",
      viewProfileBtn: "🔍 Profile & Audit",
      bookGuideBtn: "🔒 Book Guide",
      trustScoreLabel: "Trust Score",
      matchScoreLabel: "Match Score",
      perTour: "per tour",
      verifiedBadge: "Verified",
      licenseBadge: "Licensed",
      toursCount: "tours",
      modalOverviewTab: "📋 Overview & Specialties",
      modalTrustTab: "🛡 Trust Breakdown Audit",
      modalReviewsTab: "💬 Reviews",
      modalTrustEvidenceTitle: "Why You Can Trust This Guide (Trust Evidence)",
      modalTrustEvidenceDesc: "Rigorous vetting system backing every certified professional",
      modalIdentityVerified: "Identity Verified",
      modalIdentityDesc: "Government registry and biometric verification passed",
      modalLicenseVerified: "State Tourism Committee License",
      modalLicenseDesc: "Active official excursion guide credential",
      modalExperienceDesc: "verified tours completed with real travelers",
      modalPunctualityDesc: "Punctual arrival at meeting points",
      modalRadarTitle: "Customer Experience Scores",
      modalKnowledge: "📚 Depth of Historical Knowledge",
      modalCommunication: "🗣 Communication & Storytelling",
      modalService: "😊 Hospitality & Care",
      modalOrganization: "⏱ Timing & Logistics",
      modalSafety: "🛡 Safety & Guidance",
      modalStatsCompleted: "Tour Completion",
      modalStatsPunctuality: "On-Time",
      modalStatsResponse: "Response Time",
      modalStatsCancellation: "Guide Cancellations",
      modalWhyRecommendedTitle: "Why DiyorAI Recommends This Guide",
      modalCloseBtn: "Close",
      modalBookGuideBtn: "🔒 Book This Guide",
    },
    booking: {
      modalTitle: "Book Your Journey",
      guideBookingSubtitle: "Book an excursion with an accredited local guide",
      tripBookingSubtitle: "Complete booking for route, transport and lodging",
      dateLabel: "Tour / Travel Date",
      travelersLabel: "Travelers",
      adults: "Adults",
      children: "Children",
      capacityWarning: "Large Group: Guide can provide individual wireless audio headsets for comfortable touring.",
      contactInfoTitle: "Contact Details",
      fullNameLabel: "Full Name *",
      fullNamePlaceholder: "E.g.: John Smith",
      phoneLabel: "Phone Number (with country code) *",
      emailLabel: "Email (for confirmation)",
      contactMethodLabel: "Preferred Contact Method",
      commentsLabel: "Tour Wishes & Preferences (optional)",
      commentsPlaceholder: "E.g.: preferred meeting spot, baby car seat...",
      totalToPay: "Total to Pay",
      submitBtn: "✓ Confirm Booking Request",
      submitting: "Submitting…",
      successTitle: "Trip Booked Successfully!",
      successSubtitle: "Your request has been received and logged in the DiyorAI system.",
      bookingIdLabel: "Booking ID",
      guideLabel: "Guide",
      tourDateLabel: "Date",
      travelersCountLabel: "Travelers",
      totalCostLabel: "Total Price",
      contactNotice: "Our specialist will reach out to you within 10–15 minutes to confirm details.",
      returnBtn: "Great, back to catalog",
    },
    directory: {
      badge: "Travel Directory · DiyorAI",
      title: "Everything You Need to Explore Uzbekistan",
      subtitle: "Interactive handbook to cities, Tashkent mountain getaways, gastronomy, and verified guides.",
      findGuideCta: "Find a Verified Guide →",
      categories: [
        {
          id: "cities",
          title: "Cities & Regions",
          icon: "🏙",
          badge: "12 Locations",
          description: "From legendary Silk Road domes to Fergana Valley craft oases and Aral Sea landscapes.",
          items: [
            { name: "Tashkent", tag: "Capital", details: "Modern metropolis, marble metro stations, lush parks and historic Chorsu bazaar." },
            { name: "Samarkand", tag: "Jewel", details: "Majestic Registan, Gur-Emir mausoleum, and Shah-i Zinda avenue of tombs." },
            { name: "Bukhara", tag: "Sacred", details: "Ark fortress, Kalyan minaret, medieval trading domes, and Sufi shrines." },
            { name: "Khiva", tag: "Open-Air Museum", details: "Walled Ichan-Kala fortress, Kalta Minor, and Tosh-Hovli royal palace." },
            { name: "Shahrisabz", tag: "Birthplace of Timur", details: "Monumental Ak-Saray ruins and picturesque Takhtakaracha pass." },
            { name: "Fergana & Rishtan", tag: "Crafts", details: "World-famous Rishtan glazed ceramics and Yodgorlik silk factory." },
            { name: "Andijan", tag: "Valley", details: "Birthplace of Babur, memorial park, and vibrant eastern street food bazaars." },
            { name: "Namangan", tag: "City of Flowers", details: "Traditional knife forging masters in Chust and beautiful flower parks." },
            { name: "Nukus & Muynak", tag: "Art & Aral", details: "Savitsky Museum (world-class avant-garde art), Ustyurt plateau, and Aral Sea." },
            { name: "Termez", tag: "Ancient Buddhism", details: "Greco-Buddhist archaeological sites Fayaztepa, Karatepa, and Bactrian heritage." },
            { name: "Jizzakh", tag: "Zaamin", details: "Uzbek Switzerland: pristine pine forests of Zaamin National Park." },
            { name: "Gulistan", tag: "Syr Darya", details: "Syr Darya river fish dining and open scenic steppes." },
          ],
        },
        {
          id: "tashkent_region",
          title: "Tashkent Region & Mountains",
          icon: "🏔",
          badge: "Mountains & Weekends",
          description: "All-season mountain resorts, turquoise reservoirs, alpine meadows, and pine forests 1-2 hours from the capital.",
          items: [
            { name: "Charvak Reservoir", tag: "Lake & Beaches", details: "Speedboat tours, lakeside beaches, and famous 'Bochka' mountain dining." },
            { name: "Amirsoy Resort", tag: "Premium Resort", details: "Gondola lift to 2,290m, world-class ski slopes, luxury alpine chalets." },
            { name: "Greater Chimgan", tag: "Climbing & Hiking", details: "3,309m peak, waterfalls, alpine meadows, and horseback riding." },
            { name: "Beldersay", tag: "Nature", details: "Scenic 3 km chairlift, Marble River gorge, and ancient petroglyphs." },
            { name: "Ugam-Chatkal National Park", tag: "UNESCO Biosphere", details: "Gulkam canyons, mountain streams, and pristine Pskem valley." },
            { name: "Sukok & Parkent", tag: "Food & Forest", details: "Protected pine forests, signature Sukok skewers, and Chateau Hamkor vineyards." },
          ],
        },
        {
          id: "history",
          title: "Historical Masterpieces",
          icon: "🏛",
          badge: "UNESCO",
          description: "World Heritage architectural wonders along the ancient Silk Road.",
          items: [
            { name: "Registan Ensemble (Samarkand)", tag: "15th-17th c.", details: "Three monumental madrasahs with azure majolica and gilded ceilings." },
            { name: "Ichan-Kala (Khiva)", tag: "18th-19th c.", details: "Pristine medieval oasis enclosed by massive sun-dried mudbrick walls." },
            { name: "Ark of Bukhara", tag: "5th c.", details: "Ancient fortress palace of Bukhara emirs standing above Registan square." },
            { name: "Shah-i Zinda (Samarkand)", tag: "11th-15th c.", details: "Breathtaking avenue of royal mausoleums in vibrant blue tiles." },
            { name: "Palace of Khudayar Khan (Kokand)", tag: "1871", details: "Splendid palace of the Kokand Khanate with intricate geometric tiling." },
          ],
        },
        {
          id: "food",
          title: "Uzbek Gastronomy",
          icon: "🍽",
          badge: "Eastern Flavors",
          description: "Legendary teahouses, plov centers, and distinctive regional dishes.",
          items: [
            { name: "Tashkent Wedding Plov", tag: "Besh Qozon", details: "Yellow carrots, raisins, tender lamb, kazy horse sausage, and quail eggs." },
            { name: "Samarkand Layered Plov", tag: "Osh-Markaz", details: "Slow-cooked layered rice served with juicy meat and succulent carrots." },
            { name: "Bukhara Oshi-Sofi", tag: "Dietary", details: "Ancient ceremonial plov simmered in copper cauldrons with zero frying." },
            { name: "Khorezm Shivit Osh", tag: "Green Noodles", details: "Fresh dill-infused green pasta served with beef stew and sour yogurt." },
            { name: "Jizzakh Somsa", tag: "XXL", details: "Giant tandoor-baked pastry loaded with chopped beef and fragrant onions." },
          ],
        },
        {
          id: "guides",
          title: "Accredited Guides",
          icon: "👨‍🏫",
          badge: "Trust System",
          description: "Vetted local experts evaluated across 10 reliability and quality criteria.",
          items: [
            { name: "Verified Guide Registry", tag: "25+ Experts", details: "Historians, architects, food experts, and alpine guides.", linkUrl: "/guides" },
            { name: "Trust Score Audit", tag: "94/100 avg", details: "State credential verification, biometrics, and 100% verified traveler reviews." },
            { name: "Personalized Match Score", tag: "AI Matched", details: "Precise matching by languages, group format (family, couple, solo), and pace." },
          ],
        },
        {
          id: "transport",
          title: "Transport & Logistics",
          icon: "🚗",
          badge: "Intercity",
          description: "High-speed rail, regional domestic flights, taxis, and private transfers.",
          items: [
            { name: "Afrosiyob High-Speed Train", tag: "250 km/h", details: "Tashkent ↔ Samarkand (2h 15m), Samarkand ↔ Bukhara (1h 30m). Book 45 days in advance!" },
            { name: "Silk Avia Regional Flights", tag: "Aviation", details: "ATR-72 domestic flights to Termez, Nukus, Fergana, Bukhara, and Samarkand." },
            { name: "Yandex Go & Mountain Transfers", tag: "Taxi & Minivan", details: "Reliable city rides and comfortable mountain vans to Chimgan." },
          ],
        },
        {
          id: "crafts",
          title: "Culture & Living Crafts",
          icon: "🎭",
          badge: "Guilds",
          description: "Generational artisan dynasties keeping ancient crafts alive.",
          items: [
            { name: "Rishtan Blue Ceramics", tag: "Fergana", details: "Signature turquoise pottery made with natural mountain herb ash glaze." },
            { name: "Margilan Handwoven Silk", tag: "Weaving", details: "Pure natural silk and vibrant ikat weaving at historic Yodgorlik mill." },
            { name: "Bukhara Gold Embroidery", tag: "Royal Craft", details: "Opulent velvet robes embroidered with metallic gold and silver threads." },
            { name: "Samarkand Mulberry Paper", tag: "Konigil", details: "Millennium-durable paper hand-crafted from mulberry bark." },
          ],
        },
      ],
    },
    faq: {
      badge: "Knowledge Base & Frequently Asked Questions",
      title: "Frequently Asked Questions (FAQ)",
      subtitle: "Comprehensive answers on itinerary planning, budget tracking, guides, and Uzbekistan travel.",
      searchPlaceholder: "Search questions and answers...",
      allCategory: "All Questions",
      emptySearch: "No questions found matching your search.",
      items: [
        {
          id: "faq-plan-1",
          category: "Planning",
          categoryIcon: "🗺️",
          question: "How does DiyorAI build my customized itinerary?",
          answer: "DiyorAI uses an intelligent scoring algorithm: it analyzes your interests, group composition (family, couple, solo, friends), travel pace, and daily weather conditions. Stops are optimized using nearest-neighbor routing.",
          highlight: "Relaxed pacing: cool indoor museums during afternoon heat and sunset views in the evening.",
          tag: "Algorithm",
        },
        {
          id: "faq-plan-2",
          category: "Planning",
          categoryIcon: "🗺️",
          question: "What are Rest Days and how do they work?",
          answer: "On trips of 3+ days, you can choose active tour days vs rest days. On rest days, the system schedules gastronomy stops, spa visits, and tea houses without rushing.",
          highlight: "🌿 REST DAYS prevent travel fatigue on longer journeys.",
          tag: "Balance",
        },
        {
          id: "faq-budget-1",
          category: "Budget",
          categoryIcon: "💰",
          question: "What happens if selected services exceed my budget?",
          answer: "DiyorAI tracks total expenses in real time. If selected services exceed your limit, the system alerts you and recommends smart money-saving alternatives.",
          highlight: "Save up to $150 without sacrificing comfort.",
          tag: "Tracking",
        },
        {
          id: "faq-budget-2",
          category: "Budget",
          categoryIcon: "💰",
          question: "How does the 'Who Pays What' cost split calculator work?",
          answer: "Couples can choose 50/50 or single payer mode. Friends groups split expenses equally. Families can allocate child discounts.",
          highlight: "Transparent financial breakdown for every traveler.",
          tag: "Split",
        },
        {
          id: "faq-trans-1",
          category: "Transport",
          categoryIcon: "🚗",
          question: "How does the system calculate transfer vehicles needed?",
          answer: "The system matches total travelers against vehicle passenger capacity. If your group exceeds one car, it calculates additional vehicles automatically.",
          highlight: "Automatic calculation for groups of any size.",
          tag: "Capacity",
        },
        {
          id: "faq-hotel-1",
          category: "Hotels",
          categoryIcon: "🏨",
          question: "How are rooms and nights calculated?",
          answer: "Nights equal (totalDays - 1). Room count is calculated based on room capacity and total guests.",
          highlight: "Zero overpaying for redundant rooms.",
          tag: "Stays",
        },
        {
          id: "faq-guides-1",
          category: "Guides & Trust",
          categoryIcon: "👨‍🏫",
          question: "What evidence backs a guide's Trust Score?",
          answer: "Trust Scores are computed from state tourism accreditation, identity verification, verified tour history, on-time punctuality, and authentic traveler reviews.",
          highlight: "🛡 100% evidence-backed reliability.",
          tag: "Trust",
        },
        {
          id: "faq-book-1",
          category: "Booking",
          categoryIcon: "🔒",
          question: "What happens after clicking 'Book'?",
          answer: "A unique Booking ID is generated. Details are sent to our team and local guide, who reaches out within 10–15 minutes to confirm logistics.",
          highlight: "Instant confirmation and dedicated manager.",
          tag: "Security",
        },
      ],
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
      architecture: "Islamic Architecture",
      pilgrimage: "Pilgrimage & Holy Sites",
      nature: "Nature",
      gastronomy: "Gastronomy (Plov & Tea-Houses)",
      crafts_bazaars: "Crafts & Bazaars",
      nature_hiking: "Mountains & Hiking",
      soviet_modernism: "Soviet Modernism & Art",
      photography: "Photography & Viewpoints",
      archaeology: "Archaeology & Excavations",
      night_tours: "Night Tours & Lights",
      eco_tourism: "Eco-Tourism & Gorges",
      skiing: "Mountain Skiing & Winter Sports",
      family_travel: "Family Travel with Children",
    },
    regions: {
      samarkand: "Samarkand",
      bukhara: "Bukhara",
      khiva: "Khiva",
      tashkent: "Tashkent City",
      tashkent_region: "Tashkent Region (Mountains / Charvak / Amirsoy)",
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
