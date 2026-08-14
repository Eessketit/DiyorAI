import React, { useState } from "react";

export interface FAQItem {
  id: string;
  category: string;
  categoryIcon: string;
  question: string;
  answer: string;
  highlight?: string;
  tag?: string;
}

export const FAQ_DATA: FAQItem[] = [
  // 1. Планирование поездки
  {
    id: "faq-plan-1",
    category: "Планирование",
    categoryIcon: "🗺️",
    question: "Как DiyorAI строит мой персональный маршрут?",
    answer:
      "DiyorAI использует умный алгоритм скоринга локаций: анализирует ваши интересы, тип путешественников (семья, соло, пара, друзья), выбранный темп и климатический график дня. Маршрут упорядочивается эвристикой наименьшего пробега (nearest neighbor), а в полуденный зной предлагает прохладные музеи и чайханы.",
    highlight: "Без спешки и переплат: климатическая сиеста в полдень и закатные панорамы вечером.",
    tag: "Алгоритм",
  },
  {
    id: "faq-plan-2",
    category: "Планирование",
    categoryIcon: "🗺️",
    question: "Что такое дни отдыха (Rest Days) и как они работают?",
    answer:
      "При выборе от 3-х дней вы можете выделить активные дни для экскурсий и дни отдыха. В дни отдыха система не перегружает вас плотным графиком, а предлагает гастрономические паузы, спа-комплексы, чайханы и неспешные прогулки.",
    highlight: "🌿 REST DAY позволяет не уставать от обилия впечатлений в длительных путешествиях.",
    tag: "Баланс",
  },

  // 2. Бюджет
  {
    id: "faq-budget-1",
    category: "Бюджет",
    categoryIcon: "💰",
    question: "Что произойдёт, если поездку превышает мой бюджет?",
    answer:
      "DiyorAI непрерывно контролирует сумму расходов в реальном времени. Если выбранные услуги превышают лимит, система показывает предупреждение 🔴 и подсказывает умные альтернативы: замену класса отеля на колоритный гостевой дом или выбор скоростного поезда вместо авиабилета.",
    highlight: "Система подсказывает, как сэкономить до $150 без потери комфорта.",
    tag: "Контроль",
  },
  {
    id: "faq-budget-2",
    category: "Бюджет",
    categoryIcon: "💰",
    question: "Как работает калькулятор «Кто сколько платит»?",
    answer:
      "Для пар доступно разделение 50/50 или режим «Один оплачивает всё». Для друзей расходы делятся строго поровну. Для семей учитывается скидка на детей или покрытие расходов родителями.",
    highlight: "Прозрачный расчет расходов на каждого участника поездки.",
    tag: "Сплит",
  },

  // 3. Транспорт
  {
    id: "faq-trans-1",
    category: "Транспорт",
    categoryIcon: "🚗",
    question: "Как выбрать транспорт до места назначения?",
    answer:
      "В шаге организации поездки вы можете сравнить скоростные поезда Afrosiyob/Sharq, прямые авиарейсы Uzbekistan Airways / Silk Avia или автопутешествие. Количество пассажиров автоматически заполняется из состава вашей группы.",
    highlight: "Билеты на Afrosiyob рекомендуем бронировать за 45 дней до поездки.",
    tag: "Логистика",
  },
  {
    id: "faq-trans-2",
    category: "Транспорт",
    categoryIcon: "🚗",
    question: "Как система рассчитывает количество автомобилей трансфера?",
    answer:
      "Если размер вашей группы превышает вместимость седана (например, 6 человек при максимуме 4), DiyorAI автоматически рассчитывает нужное количество авто (2 машины) либо сразу предлагает комфортабельный минивэн Hyundai Staria / Toyota HiAce.",
    highlight: "Гарантия, что никто из участников не останется без места и багажа.",
    tag: "Вместимость",
  },

  // 4. Отели
  {
    id: "faq-hotel-1",
    category: "Отели",
    categoryIcon: "🏨",
    question: "Как выбирается отель и количество номеров?",
    answer:
      "Система использует даты или общее количество дней: число ночей рассчитывается как totalDays - 1. Если группа большая, DiyorAI рассчитывает необходимое число комнат с учетом вместимости каждого типа номеров.",
    highlight: "От традиционных бутик-отелей внутри древней Хивы до спа-резортов в горах Амирсоя.",
    tag: "Проживание",
  },

  // 5. Группы
  {
    id: "faq-group-1",
    category: "Группы",
    categoryIcon: "🧑‍🤝‍🧑",
    question: "Чем отличается планирование для пары, семьи и компании друзей?",
    answer:
      "Для пары система автоматически фиксирует 2 взрослых без лишних вопросов. Для семей приоритет отдается семейным номерам, паркам и музеям с кондиционерами. Для друзей подбираются гастрономические центры и активности на природе.",
    highlight: "Персонализация под любой состав путешественников.",
    tag: "Состав",
  },

  // 6. DiyorAI
  {
    id: "faq-ai-1",
    category: "DiyorAI",
    categoryIcon: "🤖",
    question: "Можно ли изменить маршрут или пересчитать параметры?",
    answer:
      "Да, в любой момент на странице маршрута нажмите «Пересчитать» или воспользуйтесь быстрыми фильтрами. Вы можете экспортировать план в PDF для оффлайн-доступа в роуминге или переслать в Telegram.",
    highlight: "PDF-экспорт работает без интернета прямо во время путешествия.",
    tag: "Экспорт",
  },

  // 7. Бронирование
  {
    id: "faq-book-1",
    category: "Бронирование",
    categoryIcon: "🔒",
    question: "Что происходит после нажатия «Забронировать»?",
    answer:
      "Ваша заявка со всеми параметрами (транспорт, трансфер, отель, маршрут и расчет бюджета) мгновенно регистрируется в системе с генерацией уникального Booking ID. Команда DiyorAI связывается с вами в Telegram/WhatsApp для подтверждения деталей.",
    highlight: "Никаких скрытых платежей: все расчеты прозрачны до подтверждения.",
    tag: "Безопасность",
  },

  // 8. Путешествия по Узбекистану
  {
    id: "faq-uzb-1",
    category: "Узбекистан",
    categoryIcon: "🇺🇿",
    question: "Что посмотреть в Ташкентской области за 1–2 дня?",
    answer:
      "В Ташкентской области для уикенда до $50 идеально подходят: Чарвакское водохранилище с остановкой в «Бочке», канатная дорога на курорте Амирсой, хайкинг в Чимгане и сосновый бор Сукок со знаменитыми паркентскими шашлыками.",
    highlight: "Горы Тянь-Шаня находятся всего в 1–1.5 часах езды от центра Ташкента.",
    tag: "Таш. область",
  },
];

const CATEGORIES = [
  "Все вопросы",
  "Планирование",
  "Бюджет",
  "Транспорт",
  "Отели",
  "Группы",
  "DiyorAI",
  "Бронирование",
  "Узбекистан",
];

export default function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState("Все вопросы");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("faq-plan-1");

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "Все вопросы" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-registan/15 text-registan text-xs font-bold uppercase tracking-wider mb-2">
          ✨ Центр знаний & Ответы
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink">
          Часто задаваемые вопросы (FAQ)
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-2">
          Всё о планировании поездки с DiyorAI, расчете бюджета, подборе транспорта и путешествиях по Узбекистану.
        </p>

        {/* Search input */}
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="🔍 Поиск по вопросам (например: бюджет, Амирсой, поезд, отель)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 rounded-2xl border border-sand bg-white shadow-sm focus:outline-none focus:border-clay text-xs sm:text-sm text-ink"
          />
          <span className="absolute left-4 top-3.5 text-night/40">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3 text-xs text-night/50 hover:text-ink font-bold"
            >
              ✕ Очистить
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-ink text-plaster border-ink shadow-sm scale-105"
                : "bg-white text-ink border-sand hover:border-ink/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-sand text-xs text-night/60">
            Ничего не найдено по запросу &quot;{searchQuery}&quot;. Попробуйте другой запрос.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "border-registan/80 shadow-md ring-1 ring-registan/20"
                    : "border-sand hover:border-sand/90 shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl shrink-0 p-1.5 bg-sand/30 rounded-xl">
                      {faq.categoryIcon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] bg-sand/60 px-2 py-0.5 rounded font-bold text-night/70 uppercase">
                          {faq.category}
                        </span>
                        {faq.tag && (
                          <span className="text-[10px] bg-registan/15 text-registan px-2 py-0.5 rounded font-bold">
                            {faq.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-ink text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full bg-sand/40 flex items-center justify-center text-xs font-bold text-ink shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-registan text-plaster" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-night/80 space-y-3 border-t border-sand/40 animate-in fade-in">
                    <p className="leading-relaxed sm:text-sm">{faq.answer}</p>
                    {faq.highlight && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-950 font-medium text-xs flex items-start gap-2">
                        <span>💡</span>
                        <span>{faq.highlight}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
