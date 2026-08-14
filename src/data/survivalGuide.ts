export interface GuideSection {
  id: string;
  icon: string;
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
  badge: {
    ru: string;
    uz: string;
    en: string;
  };
  points: {
    title: { ru: string; uz: string; en: string };
    desc: { ru: string; uz: string; en: string };
    highlight?: boolean;
  }[];
}

export const SURVIVAL_GUIDE: GuideSection[] = [
  {
    id: "intercity-transport",
    icon: "🚆",
    title: {
      ru: "Транспорт между городами (Afrosiyob & Sharq)",
      uz: "Shaharlararo transport (Afrosiyob va Sharq)",
      en: "Intercity Transport (Afrosiyob & Sharq Trains)",
    },
    subtitle: {
      ru: "Как быстро и с комфортом перемещаться между Ташкентом, Самаркандом, Бухарой и Хивой.",
      uz: "Toshkent, Samarqand, Buxoro va Xiva o'rtasida qulay va tez sayohat qilish usullari.",
      en: "How to travel fast & comfortably between Tashkent, Samarkand, Bukhara & Khiva.",
    },
    badge: {
      ru: "Критично знать",
      uz: "Muhim maslahat",
      en: "Crucial Tip",
    },
    points: [
      {
        title: {
          ru: "⚠️ Поезд Afrosiyob (Бронирование за 45 дней)",
          uz: "⚠️ Afrosiyob poyezdi (45 kun oldin bron qilish)",
          en: "⚠️ Afrosiyob Train (45-Day Advance Booking)",
        },
        desc: {
          ru: "Билеты на скоростной 'Афросиаб' (Ташкент ↔ Самарканд за 2ч 15м) открываются ровно за 45 суток на сайте railway.uz и в приложении 'Uzrailway Tickets'. Раскупаются за считанные часы!",
          uz: "Tezyurar 'Afrosiyob' chiptalari (Toshkent ↔ Samarqand 2s 15d) railway.uz sayti va 'Uzrailway Tickets' ilovasida 45 kun oldin ochiladi va sanoqli soatlarda tugaydi!",
          en: "Tickets for high-speed 'Afrosiyob' (Tashkent ↔ Samarkand in 2h 15m) go live exactly 45 days prior on railway.uz and sell out in hours!",
        },
        highlight: true,
      },
      {
        title: {
          ru: "Поезд 'Sharq' и ночные спальные экспрессы",
          uz: "'Sharq' poyezdi va tungi yotoqli poyezdlar",
          en: "'Sharq' Fast Train & Sleeper Overnight Routes",
        },
        desc: {
          ru: "Если билетов на Афросиаб нет — выбирайте комфортный дневной экспресс 'Шарк' (на 1 час дольше) или ночной спальный поезд в Хиву.",
          uz: "Agar Afrosiyobga chipta bo'lmasa — qulay kunduzgi 'Sharq' yoki Xivaga boruvchi tungi yotoqli poyezdni tanlang.",
          en: "If Afrosiyob is sold out — pick the comfortable 'Sharq' express (1 hour slower) or overnight sleeper train to Khiva.",
        },
      },
      {
        title: {
          ru: "Такси по городу: Yandex Go",
          uz: "Shahar ichida taksi: Yandex Go",
          en: "City Taxi: Yandex Go App",
        },
        desc: {
          ru: "В Ташкенте, Самарканде и Бухаре идеально работает Yandex Go. Рекомендуем тарифы 'Комфорт' (от 15 000 до 35 000 сум за поездку). Оплата картой или наличными.",
          uz: "Toshkent, Samarqand va Buxoroda Yandex Go mukammal ishlaydi. 'Komfort' tariflarini tavsiya qilamiz (15 000 dan 35 000 so'mgacha).",
          en: "Yandex Go works seamlessly in Tashkent, Samarkand and Bukhara. Recommended tiers: 'Comfort' (~$1.5 to $3 per trip).",
        },
      },
    ],
  },
  {
    id: "payments-currency",
    icon: "💳",
    title: {
      ru: "Деньги, карты и способы оплаты",
      uz: "Pul, bank kartalari va to'lov usullari",
      en: "Money, Cards & Payment Methods",
    },
    subtitle: {
      ru: "Где нужны наличные сумы (UZS) и как работают международные карты Visa/Mastercard.",
      uz: "Qayerda naqd so'm kerak va xalqaro Visa/Mastercard kartalari qanday ishlaydi.",
      en: "Where cash UZS is essential and how international Visa/Mastercard work.",
    },
    badge: {
      ru: "Финансы",
      uz: "Moliya",
      en: "Finance",
    },
    points: [
      {
        title: {
          ru: "Наличные сумы (UZS) обязательны для базаров",
          uz: "Bozorlar va mayda xaridlar uchun naqd so'm",
          en: "Cash UZS is Essential for Bazaars",
        },
        desc: {
          ru: "На базарах (Чорсу, Сиаб), в аутентичных чайханах и для покупки ремесленных сувениров всегда нужны наличные сумы. Банкоматы с выдачей сумов с карт Visa/Mastercard есть во всех отелях и банках.",
          uz: "Bozorlarda, milliy choyxonalarda va esdalik sovg'alari uchun doimo naqd so'm kerak bo'ladi. Visa/Mastercard bankomatlari barcha mehmonxonalarda mavjud.",
          en: "Bazaars (Chorsu, Siab), tea-houses and craft stalls only accept cash UZS. 24/7 ATMs dispensing local currency are widely available.",
        },
      },
      {
        title: {
          ru: "Национальные системы Uzcard и Humo",
          uz: "Uzcard va Humo milliy to'lov tizimlari",
          en: "Uzcard & Humo National Systems",
        },
        desc: {
          ru: "Практически 100% ресторанов и супермаркетов принимают карты Humo/Uzcard, а международные карты Visa/Mastercard принимаются в отелях и крупных ресторанах.",
          uz: "Deyarli barcha restoran va do'konlar Humo/Uzcard kartalarini qabul qiladi. Visa/Mastercard esa mehmonxonalarda ishlaydi.",
          en: "Almost all stores & restaurants support contactless Humo/Uzcard, while international Visa/Mastercard is accepted in hotels & major venues.",
        },
      },
    ],
  },
  {
    id: "sim-connectivity",
    icon: "📶",
    title: {
      ru: "Связь, мобильный интернет и eSIM",
      uz: "Aloqa, mobil internet va eSIM",
      en: "SIM Cards, eSIM & Internet Connectivity",
    },
    subtitle: {
      ru: "Как оставаться онлайн сразу по прилету в аэропорт.",
      uz: "Aeroportga yetib keliboq internetga ulanish yo'llari.",
      en: "How to get connected immediately upon arrival at the airport.",
    },
    badge: {
      ru: "Связь",
      uz: "Aloqa",
      en: "Connectivity",
    },
    points: [
      {
        title: {
          ru: "Туристические SIM-карты в аэропортах",
          uz: "Aeroportlarda sayyohlik SIM-kartalari",
          en: "Tourist SIM Kiosks at Airports",
        },
        desc: {
          ru: "В аэропортах Ташкента (TAS) и Самарканда (SKD) в зале прилета работают круглосуточные стойки операторов Ucell, Beeline, Mobiuz и Uztelecom. Для оформления нужен только загранпаспорт.",
          uz: "Toshkent va Samarqand aeroportlarida Ucell, Beeline, Mobiuz va Uztelecom xizmat ko'rsatish shoxobchalari 24/7 ishlaydi. Xorijiy pasport kifoya.",
          en: "24/7 operator kiosks (Ucell, Beeline, Mobiuz) are located in airport arrival halls. Only your passport is required for registration.",
        },
      },
      {
        title: {
          ru: "eSIM для путешественников (Airalo / Maya Mobile)",
          uz: "Sayyohlar uchun eSIM xizmatlari",
          en: "International eSIM (Airalo / Maya / Nomad)",
        },
        desc: {
          ru: "Если ваш телефон поддерживает eSIM — можно купить пакет данных заранее через приложения Airalo или Maya Mobile (работает через сеть Ucell/Beeline).",
          uz: "Agar telefoningiz eSIM qo'llab-quvvatlasa — Airalo yoki Maya Mobile orqali oldindan internet paketini xarid qilishingiz mumkin.",
          en: "If your smartphone supports eSIM, you can install an Airalo/Nomad eSIM profile before landing for instant 4G/5G connectivity.",
        },
      },
    ],
  },
];
