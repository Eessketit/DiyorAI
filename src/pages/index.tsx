import { useRouter } from "next/router";
import { useState } from "react";
import InterestChips from "@/components/InterestChips";
import TilePattern from "@/components/TilePattern";
import PresetCards from "@/components/PresetCards";
import SmartTripsSection from "@/components/smartTrips/SmartTripsSection";
import GuidebookPromo from "@/components/GuidebookPromo";
import TravelDirectory from "@/components/TravelDirectory";
import StepTransport from "@/components/planner/StepTransport";
import StepTransfer from "@/components/planner/StepTransfer";
import StepHotel from "@/components/planner/StepHotel";
import BudgetBar from "@/components/planner/BudgetBar";
import BudgetRangeSlider from "@/components/planner/BudgetRangeSlider";
import { ICON_MAP } from "@/lib/iconMap";
import {
  BudgetRangeModel,
  Category,
  Pace,
  PACE_LABELS,
  Region,
  REGION_LABELS,
  SelectedHotel,
  SelectedTransfer,
  SelectedTransport,
  SmartTrip,
  TRAVELER_TYPE_LABELS,
  TravelerType,
  TripPlan,
} from "@/lib/types";
import {
  createDurationModel,
  createTravelersModel,
} from "@/lib/tripState";
import { calculateTripCost } from "@/lib/costCalculator";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { SlidersHorizontal, Coins, Compass, MapPin, Zap, Sparkles, UserCheck } from "lucide-react";

const REGIONS: Region[] = ["samarkand", "bukhara", "khiva", "tashkent", "tashkent_region"];
const PACES: Pace[] = ["relaxed", "balanced", "packed"];
const TRAVELER_TYPES: TravelerType[] = ["solo", "couple", "family", "friends", "group"];

export default function Home() {
  const router = useRouter();
  const { t, language } = useTranslation();

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

  // 5. Budget Range (БЮДЖЕТ: Min & Max Slider)
  const [budgetRange, setBudgetRange] = useState<BudgetRangeModel>({
    minBudget: 50,
    maxBudget: 500,
  });

  // 6. Interests (ИНТЕРЕСЫ)
  const [interests, setInterests] = useState<Category[]>([
    "history",
    "architecture",
    "gastronomy",
  ]);

  // Added Smart Trips from Smart / Low-Budget section
  const [addedSmartTrips, setAddedSmartTrips] = useState<SmartTrip[]>([]);

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

  // Realtime Cost Calculation
  const costCalculation = calculateTripCost({
    travelers: travelersModel,
    duration: durationModel,
    budgetMaxUsd: budgetRange.maxBudget === null ? Infinity : budgetRange.maxBudget,
    transport: selectedTransport,
    transfer: selectedTransfer,
    hotel: selectedHotel,
    smartTrips: addedSmartTrips,
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

  const handleToggleAddSmartTrip = (trip: SmartTrip) => {
    setAddedSmartTrips((prev) => {
      const exists = prev.some((t) => t.id === trip.id);
      if (exists) {
        return prev.filter((t) => t.id !== trip.id);
      } else {
        return [...prev, trip];
      }
    });
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
          budget: {
            minAmount: budgetRange.minBudget,
            maxAmount: budgetRange.maxBudget === null ? Infinity : budgetRange.maxBudget,
          },
          budgetRange,
          soloTraveler: travelerType === "solo",
          smartTrips: addedSmartTrips,
          selectedServices: {
            transport: selectedTransport,
            transfer: selectedTransfer,
            hotel: selectedHotel,
          },
        }),
      });

      if (!res.ok) throw new Error("API error");
      const plan: TripPlan = await res.json();
      plan.smartTrips = addedSmartTrips;
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
      {/* Signature Hero Section with Silk Road Topographic Vector */}
      <section className="relative overflow-hidden bg-night text-paper border-b border-majolica/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-14 sm:pt-18 sm:pb-22 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-majolica/15 border border-majolica/30 text-majolica text-xs font-mono font-semibold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-majolica animate-ping" />
                <span>DiyorAI · TravelTech Uzbekistan</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.06] text-paper tracking-tight">
                {t.home.title}
              </h1>

              <p className="text-paper/80 max-w-xl text-base sm:text-lg leading-relaxed font-light">
                {t.home.subtitle}
              </p>

              {/* 3 Path Quick Navigation Buttons with Lucide Icons */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <a
                  href="#trip-constructor"
                  className="px-6 py-3.5 rounded-2xl bg-brick hover:bg-brick/90 text-paper font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-brick/30 hover:scale-102 flex items-center gap-2.5"
                >
                  <SlidersHorizontal className="w-4 h-4 text-paper shrink-0" />
                  <span>{language === "uz" ? "Konstruktorda tuzish" : language === "en" ? "Build Custom Trip" : "Собрать в конструкторе"}</span>
                </a>

                <a
                  href="#smart-trips"
                  className="px-5 py-3.5 rounded-2xl bg-majolica/15 hover:bg-majolica/25 border border-majolica/40 text-majolica font-semibold text-xs sm:text-sm transition-all flex items-center gap-2.5"
                >
                  <Coins className="w-4 h-4 text-majolica shrink-0" />
                  <span>{language === "uz" ? "Smart Trips (Hamyonbop)" : language === "en" ? "Smart Trips" : "Smart Trips (Впечатления)"}</span>
                </a>

                <a
                  href="#ready-routes"
                  className="px-5 py-3.5 rounded-2xl bg-paper/10 hover:bg-paper/15 border border-paper/20 text-paper/90 font-medium text-xs sm:text-sm transition-all flex items-center gap-2.5"
                >
                  <Compass className="w-4 h-4 text-majolica shrink-0" />
                  <span>{language === "uz" ? "Tayyor marshrutlar" : language === "en" ? "Ready Routes" : "Готовые маршруты"}</span>
                </a>
              </div>
            </div>

            {/* Right Signature Silk Road Route Vector */}
            <div className="lg:col-span-5 relative">
              <div className="bg-night/90 border border-majolica/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-majolica/20 text-xs font-mono text-gold font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-majolica" />
                    <span>Шёлковый Путь · The Silk Road</span>
                  </span>
                  <span className="text-majolica">UZB-2026</span>
                </div>

                <svg viewBox="0 0 400 220" className="w-full h-auto mt-2 overflow-visible">
                  <defs>
                    <linearGradient id="silkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C99A45" />
                      <stop offset="50%" stopColor="#2FA89B" />
                      <stop offset="100%" stopColor="#C99A45" />
                    </linearGradient>
                  </defs>

                  {/* Smooth curved bezier Silk Road path */}
                  <path
                    d="M 55 175 C 110 160, 130 145, 155 135 C 190 120, 215 105, 245 95 C 290 80, 310 55, 340 45"
                    fill="none"
                    stroke="url(#silkGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    className="opacity-85"
                  />

                  {/* 1. Khiva (West) */}
                  <g transform="translate(55, 175)">
                    <circle r="10" className="fill-gold/25 silk-node-pulse" />
                    <circle r="4.5" fill="#C99A45" />
                    <text x="0" y="20" className="fill-paper font-mono text-[10px] font-bold" textAnchor="middle">Хива</text>
                    <text x="0" y="30" className="fill-gold text-[8px] font-mono hidden sm:block" textAnchor="middle">Ичан-Кала</text>
                  </g>

                  {/* 2. Bukhara */}
                  <g transform="translate(155, 135)">
                    <circle r="10" className="fill-majolica/30 silk-node-pulse" />
                    <circle r="5" fill="#2FA89B" />
                    <text x="0" y="20" className="fill-paper font-mono text-[10px] font-bold" textAnchor="middle">Бухара</text>
                    <text x="0" y="30" className="fill-majolica text-[8px] font-mono hidden sm:block" textAnchor="middle">Пои-Калян</text>
                  </g>

                  {/* 3. Samarkand (Capital of Timurid Empire) */}
                  <g transform="translate(245, 95)">
                    <circle r="13" className="fill-gold/35 silk-node-pulse" />
                    <circle r="6" fill="#C99A45" />
                    <text x="0" y="-12" className="fill-paper font-display text-[11px] font-bold" textAnchor="middle">Самарканд</text>
                    <text x="0" y="20" className="fill-gold text-[8px] font-mono hidden sm:block" textAnchor="middle">Регистан 360°</text>
                  </g>

                  {/* 4. Tashkent (East Hub) */}
                  <g transform="translate(340, 45)">
                    <circle r="10" className="fill-majolica/30 silk-node-pulse" />
                    <circle r="5" fill="#2FA89B" />
                    <text x="0" y="-10" className="fill-paper font-mono text-[10px] font-bold" textAnchor="middle">Ташкент</text>
                    <text x="0" y="18" className="fill-majolica text-[8px] font-mono hidden sm:block" textAnchor="middle">Хаб & Чорсу</text>
                  </g>
                </svg>

                <div className="mt-3 pt-3 border-t border-majolica/20 flex items-center justify-between text-[11px] font-mono text-paper/70">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-gold" />
                    <span>Afrosiyob High-Speed Rail</span>
                  </span>
                  <span className="text-gold font-bold">250 km/h · 4 Hubs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Ikat Pattern Divider Bar */}
        <div className="ikat-divider" />
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* ========================================================
           SCENARIO A: READY-MADE ROUTES (ГОТОВЫЕ МАРШРУТЫ)
           ======================================================== */}
        <PresetCards />

        {/* ========================================================
           SCENARIO B: SMART / LOW-BUDGET TOURS (ЛОКАЛЬНЫЕ ВПЕЧАТЛЕНИЯ)
           ======================================================== */}
        <SmartTripsSection
          travelers={travelersModel}
          budgetRange={budgetRange}
          currentTripCost={costCalculation.totalCostUsd}
          addedTrips={addedSmartTrips}
          onToggleAddTrip={handleToggleAddSmartTrip}
        />

        {/* ========================================================
           SCENARIO C: TRIP CONSTRUCTOR (КОНСТРУКТОР ПУТЕШЕСТВИЯ)
           ======================================================== */}
        <section id="trip-constructor" className="bg-white border border-sand rounded-3xl p-6 sm:p-10 shadow-xs scroll-mt-24">
          <div className="mb-8 pb-6 border-b border-sand/80">
            <div className="flex items-center gap-2 mb-1.5">
              <SlidersHorizontal className="w-4 h-4 text-majolica" />
              <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
                {language === "uz" ? "Shaxsiy marshrut tuzish" : language === "en" ? "Custom Itinerary Builder" : "Персональный конструктор"}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-night">
              {language === "uz" ? "Sayohat konstruktori" : language === "en" ? "Trip Constructor" : "Конструктор путешествия"}
            </h2>
            <p className="text-xs sm:text-sm text-night/70 mt-1 max-w-2xl font-light leading-relaxed">
              {language === "uz"
                ? "Guruh tarkibi, kunlar soni va byudjet diapazonini tanlang — DiyorAI shaxsiy reja va xarajatlar hisobini shakllantiradi."
                : language === "en"
                ? "Specify travelers, duration, and flexible budget range — DiyorAI will optimize your routing, stays, and transit."
                : "Укажите состав группы, длительность и гибкий диапазон бюджета — DiyorAI рассчитает затраты и сформирует персональный план."}
            </p>
          </div>

          {/* Form or Step Flow */}
          {activeStep === 0 ? (
            <form onSubmit={handleStartOrganization} className="space-y-8">
              {/* 1. БЛОК "КТО" */}
              <div className="p-5 sm:p-6 bg-paper/50 rounded-2xl border border-sand space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-base sm:text-lg text-night font-bold">
                    {t.planner.stepWho}
                  </label>
                  <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                    {language === "uz" ? `Jami: ${travelersModel.total} kishi` : language === "en" ? `Total: ${travelersModel.total} travelers` : `Всего: ${travelersModel.total} чел.`}
                  </span>
                </div>

                {/* Group Type Selector (Secondary Buttons) */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TRAVELER_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTravelerTypeChange(type)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        travelerType === type
                          ? "bg-night text-paper border-night shadow-sm scale-102"
                          : "border-majolica/30 bg-white text-night hover:bg-majolica/10"
                      }`}
                    >
                      {TRAVELER_TYPE_LABELS[type]}
                    </button>
                  ))}
                </div>

                {/* Dynamic fields based on traveler type */}
                {travelerType === "family" && (
                  <div className="bg-white p-4 rounded-xl border border-sand grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-night block">{t.planner.adultsLabel}</span>
                        <span className="text-[11px] text-night/50 font-mono">от 1 чел.</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-night text-sm">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-night block">{t.planner.childrenLabel}</span>
                        <span className="text-[11px] text-night/50 font-mono">до 14 лет</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-night text-sm">{childrenCount}</span>
                        <button
                          type="button"
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 2. БЛОК "СКОЛЬКО ДНЕЙ" */}
              <div className="p-5 sm:p-6 bg-paper/50 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-night font-bold">
                  {t.planner.stepDays}
                </label>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-sand">
                    <span className="text-xs font-bold text-night block">{t.planner.totalDaysLabel}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(1, totalDays - 1);
                          setTotalDays(next);
                          if (activeDays > next) setActiveDays(next);
                        }}
                        className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-night text-sm">{totalDays}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(14, totalDays + 1);
                          setTotalDays(next);
                          setActiveDays(next);
                        }}
                        className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-sand">
                    <span className="text-xs font-bold text-night block">{t.planner.activeDaysLabel}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveDays(Math.max(1, activeDays - 1))}
                        className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-night text-sm">{activeDays}</span>
                      <button
                        type="button"
                        onClick={() => setActiveDays(Math.min(totalDays, activeDays + 1))}
                        className="w-8 h-8 rounded-lg bg-paper border border-sand font-bold text-night text-sm flex items-center justify-center hover:bg-sand/40"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-paper p-3.5 rounded-xl border border-majolica/30 flex flex-col justify-center">
                    <span className="text-xs text-night/60 font-mono block">{t.planner.restDaysLabel}</span>
                    <span className="font-display font-bold text-base text-majolica flex items-center gap-1 mt-0.5">
                      <Sparkles className="w-4 h-4 text-majolica" />
                      <span>{durationModel.restDays} {t.trip.days}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. БЛОК "ФОРМАТ И РЕГИОН" */}
              <div className="p-5 sm:p-6 bg-paper/50 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-night font-bold">
                  {t.planner.stepFormat}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {REGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegion(r)}
                      className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold text-left transition-all ${
                        region === r
                          ? "bg-majolica text-paper border-majolica shadow-md scale-102"
                          : "border-sand bg-white text-night hover:bg-majolica/10"
                      }`}
                    >
                      <span className="block">{t.regions[r]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. БЛОК "ТЕМП ПОЕЗДКИ" */}
              <div className="p-5 sm:p-6 bg-paper/50 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-night font-bold">
                  {t.planner.stepPace}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPace(p)}
                      className={`p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        pace === p
                          ? "bg-night text-paper border-night shadow-md"
                          : "border-sand bg-white text-night hover:bg-majolica/10"
                      }`}
                    >
                      <span>{t.paces[p]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. БЛОК "БЮДЖЕТ (RANGE SLIDER)" */}
              <BudgetRangeSlider
                value={budgetRange}
                onChange={(newVal) => setBudgetRange(newVal)}
                title={t.planner.stepBudget}
              />

              {/* 6. БЛОК "ИНТЕРЕСЫ" */}
              <div className="p-5 sm:p-6 bg-paper/50 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-night font-bold">
                  {t.planner.stepInterests}
                </label>
                <InterestChips selected={interests} onChange={setInterests} />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-brick/10 border border-brick/30 text-brick text-xs font-bold">
                  {error}
                </div>
              )}

              {/* 7. FOCAL CTA КНОПКА "ПОСТРОИТЬ МАРШРУТ" (ЕДИНСТВЕННАЯ BRICK НА ЭКРАНЕ) */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-brick hover:bg-brick/90 text-paper font-semibold text-base sm:text-lg rounded-2xl transition-all shadow-xl hover:shadow-brick/30 hover:scale-102 flex items-center justify-center gap-3 mx-auto"
                >
                  <span>{t.planner.finishPlan}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Multi-step Logistics Selector */
            <div className="space-y-6">
              <BudgetBar
                costResult={costCalculation}
                travelers={travelersModel}
              />

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
                  loading={loading}
                />
              )}
            </div>
          )}
        </section>

        {/* ========================================================
           SCENARIO D: COMPACT EXPLORE UZBEKISTAN GUIDEBOOK BLOCK
           ======================================================== */}
        <GuidebookPromo />

        {/* Travel Directory by Categories (Cities, Nature, History, Food, etc.) */}
        <TravelDirectory />

        {/* Accredited Guides Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sand flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0">
              <UserCheck className="w-7 h-7 text-majolica" />
            </div>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-night">
                {language === "uz" ? "25+ akkreditatsiyadan o'tgan gidlar reyestri" : language === "en" ? "25+ Accredited Guides Registry" : "Реестр аккредитованных гидов Узбекистана"}
              </h3>
              <p className="text-xs text-night/70 mt-0.5 font-light">
                {t.guides.trustGuaranteeDesc}
              </p>
            </div>
          </div>

          {/* Primary CTA Button */}
          <Link
            href="/guides"
            className="px-6 py-3 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs font-bold transition-all shrink-0 shadow-md hover:scale-102"
          >
            {language === "uz" ? "Gidlarni ko'rish →" : language === "en" ? "View Guides →" : "Перейти к каталогу гидов →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
