import { useRouter } from "next/router";
import { useState } from "react";
import InterestChips from "@/components/InterestChips";
import TilePattern from "@/components/TilePattern";
import PresetCards from "@/components/PresetCards";
import SurvivalGuideModal from "@/components/SurvivalGuideModal";
import TravelDirectory from "@/components/TravelDirectory";
import StepTransport from "@/components/planner/StepTransport";
import StepTransfer from "@/components/planner/StepTransfer";
import StepHotel from "@/components/planner/StepHotel";
import BudgetBar from "@/components/planner/BudgetBar";
import { ICON_MAP } from "@/lib/iconMap";
import {
  BUDGET_RANGE_LABELS,
  BUDGET_RANGE_MAX,
  BudgetRange,
  Category,
  Pace,
  PACE_LABELS,
  Region,
  REGION_LABELS,
  SelectedHotel,
  SelectedTransfer,
  SelectedTransport,
  TRAVELER_TYPE_LABELS,
  TravelerType,
  TripPlan,
} from "@/lib/types";
import {
  createBudgetModel,
  createDurationModel,
  createTravelersModel,
  DEFAULT_TRIP_STATE,
} from "@/lib/tripState";
import { calculateTripCost } from "@/lib/costCalculator";
import { trackEvent } from "@/lib/analytics";
import { TASHKENT_REGION_HIGHLIGHTS } from "@/data/mockTravelData";
import { useTranslation } from "@/lib/i18n";

const REGIONS: Region[] = ["samarkand", "bukhara", "khiva", "tashkent", "tashkent_region"];
const PACES: Pace[] = ["relaxed", "balanced", "packed"];
const TRAVELER_TYPES: TravelerType[] = ["solo", "couple", "family", "friends", "group"];
const BUDGET_RANGES: BudgetRange[] = ["under_200", "under_500", "under_1000", "over_1000"];

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  // 1. Travelers (КТО)
  const [travelerType, setTravelerType] = useState<TravelerType>("couple");
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // 2. Duration (СКОЛЬКО ДНЕЙ)
  const [totalDays, setTotalDays] = useState<number>(3);
  const [activeDays, setActiveDays] = useState<number>(3);

  // 3. Format / Region (ФОРМАТ)
  const [region, setRegion] = useState<Region>("samarkand");

  // 4. Pace (ТЕМП ПОЕЗДКИ)
  const [pace, setPace] = useState<Pace>("balanced");

  // 5. Budget (БЮДЖЕТ)
  const [budgetRange, setBudgetRange] = useState<BudgetRange>("under_500");

  // 6. Interests (ИНТЕРЕСЫ)
  const [interests, setInterests] = useState<Category[]>([
    "history",
    "architecture",
    "gastronomy",
  ]);

  // Organization Flow State (Step 1: Transport, Step 2: Transfer, Step 3: Hotel)
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = Form, 1 = Transport, 2 = Transfer, 3 = Hotel
  const [selectedTransport, setSelectedTransport] = useState<SelectedTransport | undefined>(undefined);
  const [selectedTransfer, setSelectedTransfer] = useState<SelectedTransfer | undefined>(undefined);
  const [selectedHotel, setSelectedHotel] = useState<SelectedHotel | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed models
  const travelersModel = createTravelersModel(travelerType, adults, childrenCount);
  const durationModel = createDurationModel(totalDays, activeDays);
  const budgetModel = createBudgetModel(budgetRange);

  // Realtime Cost Calculation
  const costCalculation = calculateTripCost({
    travelers: travelersModel,
    duration: durationModel,
    budgetMaxUsd: budgetModel.maxAmount,
    transport: selectedTransport,
    transfer: selectedTransfer,
    hotel: selectedHotel,
  });

  const handleTravelerTypeChange = (type: TravelerType) => {
    setTravelerType(type);
    if (type === "solo") {
      setAdults(1);
      setChildrenCount(0);
    } else if (type === "couple") {
      setAdults(2);
      setChildrenCount(0);
    } else if (type === "family") {
      setAdults(2);
      setChildrenCount(1);
    } else if (type === "friends") {
      setAdults(4);
      setChildrenCount(0);
    } else if (type === "group") {
      setAdults(6);
      setChildrenCount(0);
    }
    trackEvent("traveler_type_selected", { type });
  };

  const handleStartOrganization = (e: React.FormEvent) => {
    e.preventDefault();
    if (interests.length === 0) {
      setError(t.home.selectAtLeastOne);
      return;
    }
    setError(null);
    trackEvent("build_route_clicked", { region, totalDays, budgetRange });
    setActiveStep(1); // Open Transport step
  };

  const handleBuildFinalItinerary = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          interests,
          travelers: travelersModel,
          duration: durationModel,
          pace,
          budget: budgetModel,
          soloTraveler: travelerType === "solo",
          selectedServices: {
            transport: selectedTransport,
            transfer: selectedTransfer,
            hotel: selectedHotel,
          },
        }),
      });

      if (!res.ok) throw new Error("API error");
      const plan: TripPlan = await res.json();
      sessionStorage.setItem("diyorai-trip", JSON.stringify(plan));
      trackEvent("itinerary_generated", { region, totalCost: plan.costBreakdown?.total ?? 0 });
      router.push("/trip");
    } catch {
      setError(t.home.buildError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink text-plaster">
        <TilePattern className="absolute -right-10 -top-10 w-72 h-72 text-plaster/10 pointer-events-none" />
        <TilePattern className="absolute -left-16 bottom-0 w-56 h-56 text-plaster/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-16 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-registan/20 border border-registan/40 text-registan text-xs font-semibold uppercase tracking-wider mb-4">
            <span>🏛️</span> DiyorAI Digital Travel Assistant
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] max-w-3xl">
            {t.home.title}
          </h1>
          <p className="mt-5 text-plaster/85 max-w-2xl text-base sm:text-lg leading-relaxed">
            Персональный AI-ассистент по Узбекистану: подбирает транспорт, трансферы, отели, оптимизирует бюджет и формирует идеальный маршрут без спешки.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative space-y-10">
        {/* Preset Cards (1-Click Quick Launch) */}
        <div className="bg-white/95 backdrop-blur border border-sand rounded-3xl p-6 sm:p-8 shadow-xl shadow-ink/5">
          <PresetCards />

          {/* Low-Budget Discovery & Tashkent Region Highlight */}
          <div className="mt-8 pt-8 border-t border-sand/70">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-registan block">
                  💸 Low-Budget & Weekend Discovery
                </span>
                <h3 className="font-display text-xl font-bold text-ink">
                  🏔️ Откройте Ташкентскую область (туры от ~$25–40)
                </h3>
              </div>
              <span className="text-xs text-night/60 bg-sand/30 px-3 py-1 rounded-full font-medium">
                1–2 дня · Горы Тянь-Шаня
              </span>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {TASHKENT_REGION_HIGHLIGHTS.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setRegion("tashkent_region");
                    setBudgetRange("under_200");
                    setTotalDays(2);
                    setActiveDays(2);
                    setInterests(["nature", "nature_hiking", "gastronomy"]);
                  }}
                  className="p-4 rounded-2xl border border-sand bg-plaster/30 hover:bg-white hover:border-registan transition-all cursor-pointer group shadow-2xs"
                >
                  <span className="text-[10px] font-bold bg-registan/15 text-registan px-2 py-0.5 rounded uppercase">
                    {item.tag}
                  </span>
                  <h4 className="font-display font-bold text-ink text-sm mt-2 group-hover:text-registan transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-night/70 mt-3 pt-2 border-t border-sand/50">
                    <span>от ~${item.approxPricePerPersonUsd}/чел.</span>
                    <span className="text-clay font-bold group-hover:underline">Выбрать →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-step Flow Modal or Main Form */}
          {activeStep === 0 ? (
            /* ========================================================
               NEW TRIP PLANNER ORDER (1 to 7)
               1. КТО
               2. СКОЛЬКО ДНЕЙ
               3. ФОРМАТ (Регион)
               4. ТЕМП ПОЕЗДКИ
               5. БЮДЖЕТ
               6. ИНТЕРЕСЫ
               7. ПОСТРОИТЬ МАРШРУТ
               ======================================================== */
            <form onSubmit={handleStartOrganization} className="border-t border-sand/70 pt-8 mt-8 space-y-8">
              <div className="text-center sm:text-left">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-1">
                  🛠️ Новый конструктор путешествия
                </h2>
                <p className="text-xs sm:text-sm text-night/70">
                  Укажите состав группы, длительность и предпочтения — DiyorAI рассчитает бюджет и сформирует сквозной план поездки.
                </p>
              </div>

              {/* 1. БЛОК "КТО" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-base sm:text-lg text-ink font-bold">
                    1. КТО едет в путешествие?
                  </label>
                  <span className="text-xs font-bold text-registan bg-registan/10 px-2.5 py-1 rounded-full">
                    Всего: {travelersModel.total} чел.
                  </span>
                </div>

                {/* Group Type Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TRAVELER_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTravelerTypeChange(type)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        travelerType === type
                          ? "bg-ink text-plaster border-ink shadow-sm scale-102"
                          : "border-sand bg-white text-ink hover:border-ink/60"
                      }`}
                    >
                      {TRAVELER_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>

                {/* Dynamic fields based on traveler type */}
                {travelerType === "solo" && (
                  <p className="text-xs text-night/70 bg-white/80 p-3 rounded-xl border border-sand/60">
                    👤 <strong>Одиночное путешествие:</strong> 1 взрослый. Система автоматически подбирает безопасные и популярные маршруты.
                  </p>
                )}

                {travelerType === "couple" && (
                  <p className="text-xs text-night/70 bg-white/80 p-3 rounded-xl border border-sand/60">
                    👫 <strong>Пара:</strong> Автоматически 2 взрослых. Включен расчет стоимости на двоих и опция раздельной или совместной оплаты.
                  </p>
                )}

                {travelerType === "family" && (
                  <div className="bg-white p-4 rounded-xl border border-sand grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-ink block">Взрослые</span>
                        <span className="text-[11px] text-night/50">от 1 чел.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-ink text-sm">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-ink block">Дети</span>
                        <span className="text-[11px] text-night/50">до 14 лет</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-ink text-sm">{childrenCount}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {travelerType === "friends" && (
                  <div className="bg-white p-4 rounded-xl border border-sand flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink block">Количество друзей (участников)</span>
                      <span className="text-[11px] text-night/50">Все считаются отдельными плательщиками (стоимость / {adults})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(2, adults - 1))}
                        className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-ink text-sm">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {travelerType === "group" && (
                  <div className="bg-white p-4 rounded-xl border border-sand grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-ink block">Взрослые участники</span>
                        <span className="text-[11px] text-night/50">Групповой тур</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-ink text-sm">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-ink block">Дети в группе</span>
                        <span className="text-[11px] text-night/50">Детские скидки</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-ink text-sm">{childrenCount}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-8 h-8 rounded-lg bg-sand/40 hover:bg-sand font-bold text-ink text-sm flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. БЛОК "СКОЛЬКО ДНЕЙ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
                  2. СКОЛЬКО ДНЕЙ продлится поездка?
                </label>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-sand">
                    <span className="text-xs font-bold text-ink block">Общее число дней</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(1, totalDays - 1);
                          setTotalDays(next);
                          if (activeDays > next) setActiveDays(next);
                        }}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black font-display text-lg text-ink">
                        {totalDays} дн.
                      </span>
                      <button
                        type="button"
                        onClick={() => setTotalDays(Math.min(14, totalDays + 1))}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-sand">
                    <span className="text-xs font-bold text-ink block">Активные дни (экскурсии)</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveDays(Math.max(1, activeDays - 1))}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black font-display text-lg text-ink">
                        {activeDays} дн.
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveDays(Math.min(totalDays, activeDays + 1))}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 flex flex-col justify-between">
                    <span className="text-xs font-bold text-emerald-900 block">🌿 Дни отдыха (Rest days)</span>
                    <div className="text-center font-black font-display text-lg text-emerald-800 my-1">
                      {durationModel.restDays} дн.
                    </div>
                    <span className="text-[10px] text-emerald-700 text-center block">
                      {durationModel.restDays > 0 ? "Свободный релакс и чайханы" : "Без дней отдыха"}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. БЛОК "ФОРМАТ / НАПРАВЛЕНИЕ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
                  3. ФОРМАТ: Куда держим путь?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-left ${
                        region === r
                          ? "bg-registan text-plaster border-registan shadow-md scale-102"
                          : "border-sand hover:border-registan text-ink bg-white"
                      }`}
                    >
                      <span className="block font-display text-sm">{REGION_LABELS[r]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. БЛОК "ТЕМП ПОЕЗДКИ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
                  4. ТЕМП ПОЕЗДКИ
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {PACES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPace(p)}
                      className={`p-4 rounded-xl border text-xs font-bold transition-all text-left ${
                        pace === p
                          ? "bg-ink text-plaster border-ink shadow-md scale-102"
                          : "border-sand bg-white text-ink hover:border-ink"
                      }`}
                    >
                      <span className="block text-sm mb-1">{PACE_LABELS[p]}</span>
                      <span className="text-[11px] opacity-80 block font-normal">
                        {p === "relaxed"
                          ? "Меньше объектов, больше кофеен и парков"
                          : p === "balanced"
                          ? "Оптимальный баланс открытий и отдыха"
                          : "Максимум достопримечательностей"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. БЛОК "БЮДЖЕТ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-base sm:text-lg text-ink font-bold">
                    5. БЮДЖЕТ (Диапазон расходов)
                  </label>
                  <span className="text-xs text-night/70">
                    На {travelersModel.total} чел. / {totalDays} дн.
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BUDGET_RANGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudgetRange(b)}
                      className={`p-3.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        budgetRange === b
                          ? "bg-clay text-plaster border-clay shadow-md scale-102"
                          : "border-sand bg-white text-ink hover:border-clay"
                      }`}
                    >
                      <span className="block text-sm">{BUDGET_RANGE_LABELS[b].split(" (")[0]}</span>
                      <span className="text-[10px] opacity-80 block font-normal mt-0.5">
                        Лимит: {BUDGET_RANGE_MAX[b] === Infinity ? "Без лимита" : `до $${BUDGET_RANGE_MAX[b]}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. БЛОК "ИНТЕРЕСЫ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
                  6. ИНТЕРЕСЫ И ПРЕДПОЧТЕНИЯ
                </label>
                <InterestChips selected={interests} onChange={setInterests} />
              </div>

              {error && <p className="text-trust-low text-sm font-semibold text-center">{error}</p>}

              {/* 7. КНОПКА "ПОСТРОИТЬ МАРШРУТ" -> Launches Step 1 (Transport) */}
              <button
                type="submit"
                className="w-full bg-clay hover:bg-clay/90 text-plaster font-bold py-4 rounded-2xl transition-all shadow-md hover:shadow-lg text-base uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>🚀 ОРГАНИЗОВАТЬ ПОЕЗДКУ (Транспорт, Отели, Маршрут) →</span>
              </button>
            </form>
          ) : (
            /* ========================================================
               ORGANIZATION STEPS FLOW (Transport -> Transfer -> Hotel)
               ======================================================== */
            <div className="border-t border-sand/70 pt-8 mt-8 space-y-6">
              {/* Step Progress Bar */}
              <div className="flex items-center justify-between border-b border-sand pb-4 flex-wrap gap-2 text-xs font-bold text-night/70">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg ${activeStep === 1 ? "bg-registan text-plaster" : "bg-sand/40"}`}>
                    1. ✈️ Транспорт
                  </span>
                  <span>→</span>
                  <span className={`px-3 py-1 rounded-lg ${activeStep === 2 ? "bg-registan text-plaster" : "bg-sand/40"}`}>
                    2. 🚕 Трансфер
                  </span>
                  <span>→</span>
                  <span className={`px-3 py-1 rounded-lg ${activeStep === 3 ? "bg-registan text-plaster" : "bg-sand/40"}`}>
                    3. 🏨 Отель
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  className="text-clay hover:underline font-bold"
                >
                  Изменить параметры
                </button>
              </div>

              {/* Realtime Budget Bar */}
              <BudgetBar costResult={costCalculation} travelers={travelersModel} />

              {/* Step Content */}
              {activeStep === 1 && (
                <StepTransport
                  region={region}
                  travelers={travelersModel}
                  selectedTransport={selectedTransport}
                  onSelect={setSelectedTransport}
                  onNext={() => setActiveStep(2)}
                  onBack={() => setActiveStep(0)}
                />
              )}

              {activeStep === 2 && (
                <StepTransfer
                  travelers={travelersModel}
                  selectedTransfer={selectedTransfer}
                  onSelect={setSelectedTransfer}
                  onNext={() => setActiveStep(3)}
                  onBack={() => setActiveStep(1)}
                />
              )}

              {activeStep === 3 && (
                <StepHotel
                  region={region}
                  travelers={travelersModel}
                  duration={durationModel}
                  selectedHotel={selectedHotel}
                  onSelect={setSelectedHotel}
                  onNext={handleBuildFinalItinerary}
                  onBack={() => setActiveStep(2)}
                />
              )}

              {loading && (
                <div className="p-4 bg-registan/10 border border-registan/30 rounded-xl text-center text-xs font-bold text-ink animate-pulse">
                  🤖 DiyorAI формирует индивидуальный маршрут с учетом погоды и расписания...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Survival Guide Modal */}
        <SurvivalGuideModal />
      </section>

      {/* Prominent Travel Directory */}
      <TravelDirectory />
    </div>
  );
}
