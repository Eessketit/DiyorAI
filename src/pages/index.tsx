import { useRouter } from "next/router";
import { useState } from "react";
import InterestChips from "@/components/InterestChips";
import TilePattern from "@/components/TilePattern";
import PresetCards from "@/components/PresetCards";
import SmartTripsSection from "@/components/smartTrips/SmartTripsSection";
import GuidebookPromo from "@/components/GuidebookPromo";
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink text-plaster">
        <TilePattern className="absolute -right-10 -top-10 w-72 h-72 text-plaster/10 pointer-events-none" />
        <TilePattern className="absolute -left-16 bottom-0 w-56 h-56 text-plaster/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-registan/20 border border-registan/40 text-registan text-xs font-bold uppercase tracking-wider mb-4">
            <span>🏛️</span> DiyorAI Digital Travel Assistant
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-[1.08] max-w-3xl">
            {t.home.title}
          </h1>
          <p className="mt-5 text-plaster/85 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed">
            {t.home.subtitle}
          </p>

          {/* Quick 3 Path Nav Buttons in Hero */}
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            <a
              href="#ready-routes"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <span>⚡</span> {language === "uz" ? "Tayyor marshrutlar" : language === "en" ? "Ready Routes" : "Готовые маршруты"}
            </a>
            <a
              href="#smart-trips"
              className="px-5 py-3 rounded-2xl bg-registan hover:bg-registan/90 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>💰</span> {language === "uz" ? "Smart Trips (Hamyonbop)" : language === "en" ? "Smart Trips" : "Smart Trips (Впечатления)"}
            </a>
            <a
              href="#trip-constructor"
              className="px-5 py-3 rounded-2xl bg-white text-ink hover:bg-sand/30 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md"
            >
              <span>🛠️</span> {language === "uz" ? "Konstruktorda tuzish" : language === "en" ? "Build Custom Trip" : "Собрать в конструкторе"}
            </a>
          </div>
        </div>
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
        <section id="trip-constructor" className="bg-white border border-sand rounded-3xl p-6 sm:p-10 shadow-sm scroll-mt-24">
          <div className="mb-8 pb-6 border-b border-sand/80">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">🛠️</span>
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-registan">
                {language === "uz" ? "Shaxsiy marshrut tuzish" : language === "en" ? "Custom Itinerary Builder" : "Персональный конструктор"}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-ink">
              {language === "uz" ? "Sayohat konstruktori" : language === "en" ? "Trip Constructor" : "Конструктор путешествия"}
            </h2>
            <p className="text-xs sm:text-sm text-night/70 mt-1 max-w-2xl">
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
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block font-display text-base sm:text-lg text-ink font-bold">
                    {t.planner.stepWho}
                  </label>
                  <span className="text-xs font-bold text-registan bg-registan/10 px-2.5 py-1 rounded-full">
                    {language === "uz" ? `Jami: ${travelersModel.total} kishi` : language === "en" ? `Total: ${travelersModel.total} travelers` : `Всего: ${travelersModel.total} чел.`}
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
                {travelerType === "family" && (
                  <div className="bg-white p-4 rounded-xl border border-sand grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-ink block">{t.planner.adultsLabel}</span>
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
                        <span className="text-xs font-bold text-ink block">{t.planner.childrenLabel}</span>
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
              </div>

              {/* 2. БЛОК "СКОЛЬКО ДНЕЙ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
                  {t.planner.stepDays}
                </label>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-sand">
                    <span className="text-xs font-bold text-ink block">{t.planner.totalDaysLabel}</span>
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
                      <span className="w-8 text-center font-bold text-ink text-sm">{totalDays}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.min(14, totalDays + 1);
                          setTotalDays(next);
                          setActiveDays(next);
                        }}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-sand">
                    <span className="text-xs font-bold text-ink block">{t.planner.activeDaysLabel}</span>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setActiveDays(Math.max(1, activeDays - 1))}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-ink text-sm">{activeDays}</span>
                      <button
                        type="button"
                        onClick={() => setActiveDays(Math.min(totalDays, activeDays + 1))}
                        className="w-8 h-8 rounded-lg bg-sand/40 font-bold text-ink text-sm flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-sand/30 p-3.5 rounded-xl border border-sand/60 flex flex-col justify-center">
                    <span className="text-xs text-night/60 block">{t.planner.restDaysLabel}</span>
                    <span className="font-display font-bold text-lg text-emerald-800">
                      🌿 {durationModel.restDays} {t.trip.days}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. БЛОК "ФОРМАТ И РЕГИОН" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
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
                          ? "bg-registan text-white border-registan shadow-md scale-102"
                          : "border-sand bg-white text-ink hover:bg-sand/30"
                      }`}
                    >
                      <span className="block">{t.regions[r]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. БЛОК "ТЕМП ПОЕЗДКИ" */}
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
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
                          ? "bg-ink text-plaster border-ink shadow-md"
                          : "border-sand bg-white text-ink hover:bg-sand/30"
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
              <div className="p-5 sm:p-6 bg-plaster/30 rounded-2xl border border-sand space-y-4">
                <label className="block font-display text-base sm:text-lg text-ink font-bold">
                  {t.planner.stepInterests}
                </label>
                <InterestChips selected={interests} onChange={setInterests} />
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* 7. CTA КНОПКА "ОРГАНИЗОВАТЬ ПОЕЗДКУ" */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 bg-clay hover:bg-clay/90 text-plaster font-bold text-base sm:text-lg rounded-2xl transition-all shadow-xl hover:shadow-2xl hover:scale-102 flex items-center justify-center gap-3 mx-auto"
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

        {/* Accredited Guides Preview */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sand flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4">
            <span className="text-4xl p-3 bg-sand/30 rounded-2xl shrink-0">👨‍🏫</span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                {language === "uz" ? "25+ akkreditatsiyadan o'tgan gidlar reyestri" : language === "en" ? "25+ Accredited Guides Registry" : "Реестр аккредитованных гидов Узбекистана"}
              </h3>
              <p className="text-xs text-night/70 mt-0.5">
                {t.guides.trustGuaranteeDesc}
              </p>
            </div>
          </div>
          <Link
            href="/guides"
            className="px-6 py-3 rounded-xl bg-ink hover:bg-night text-plaster text-xs font-bold transition-all shrink-0 shadow-md"
          >
            {language === "uz" ? "Gidlarni ko'rish →" : language === "en" ? "View Guides →" : "Перейти к каталогу гидов →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
