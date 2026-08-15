import React, { useState } from "react";
import Link from "next/link";
import { ICON_MAP } from "@/lib/iconMap";

interface DirectoryCategory {
  id: string;
  title: string;
  icon: string;
  badge: string;
  description: string;
  items: {
    name: string;
    tag: string;
    details: string;
    linkUrl?: string;
  }[];
}

const DIRECTORY_DATA: DirectoryCategory[] = [
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
];

export default function TravelDirectory() {
  const [activeCategory, setActiveCategory] = useState<string>("cities");

  const currentCat = DIRECTORY_DATA.find((c) => c.id === activeCategory) || DIRECTORY_DATA[0];

  return (
    <section className="my-16 bg-white border border-sand rounded-3xl p-6 sm:p-10 shadow-sm">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-sand/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{ICON_MAP.directory}</span>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-registan">
              Travel Directory · Справочник DiyorAI
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-ink">
            Всё для исследования Узбекистана
          </h2>
          <p className="text-night/70 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
            Интерактивный путеводитель по городам, горным курортам Ташкентской области, гастрономии,
            логистике и проверенным гидам.
          </p>
        </div>

        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-registan text-white text-xs font-bold hover:bg-registan/90 transition-all shadow-md shrink-0 self-start md:self-auto"
        >
          <span>{ICON_MAP.guide}</span> Найти проверенного гида →
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {DIRECTORY_DATA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeCategory === cat.id
                ? "bg-registan text-white shadow-md scale-102"
                : "bg-plaster border border-sand text-ink hover:bg-sand/40"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.title}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeCategory === cat.id ? "bg-white/20 text-white" : "bg-sand/50 text-night/60"
              }`}
            >
              {cat.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Category Description Banner */}
      <div className="bg-sand/20 border border-sand/70 rounded-2xl p-4 sm:p-5 mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-white rounded-xl shadow-xs shrink-0">{currentCat.icon}</span>
          <div>
            <h3 className="font-display font-bold text-ink text-lg">{currentCat.title}</h3>
            <p className="text-xs sm:text-sm text-night/70 mt-0.5">{currentCat.description}</p>
          </div>
        </div>
      </div>

      {/* Items Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCat.items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-plaster/50 border border-sand hover:bg-white hover:border-sand/90 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-display font-bold text-ink text-sm sm:text-base leading-snug">
                  {item.name}
                </h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-sand/40 text-registan shrink-0">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-night/70 leading-relaxed">{item.details}</p>
            </div>

            {item.linkUrl && (
              <div className="mt-4 pt-3 border-t border-sand/60">
                <Link
                  href={item.linkUrl}
                  className="text-xs font-bold text-registan hover:underline inline-flex items-center gap-1"
                >
                  Перейти в каталог гидов →
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
