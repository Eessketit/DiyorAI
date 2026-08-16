import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InterestChips from "@/components/InterestChips";
import TilePattern from "@/components/TilePattern";
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
  TravelerType,
  TripPlan,
} from "@/lib/types";
import {
  calculateDaysBetweenDates,
  createDurationModel,
  createTravelersModel,
  formatDateIso,
  loadConstructorState,
  saveConstructorState,
  DEFAULT_TRIP_STATE,
} from "@/lib/tripState";
import { calculateTripCost } from "@/lib/costCalculator";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import {
  SlidersHorizontal,
  Coins,
  Compass,
  MapPin,
  Zap,
  Sparkles,
  UserCheck,
  Calendar,
  Plus,
  Minus,
  AlertTriangle,
  Lightbulb,
  Building2,
  Train,
  Car,
  Check,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const REGIONS: Region[] = [
  "samarkand",
  "bukhara",
  "khiva",
  "tashkent",
  "tashkent_region",
  "fergana",
  "andijan",
  "namangan",
  "shahrisabz",
  "termez",
  "nukus",
  "navoi",
  "jizzakh",
  "syrdarya",
];
const PACES: Pace[] = ["relaxed", "balanced", "packed"];
const TRAVELER_TYPES: TravelerType[] = ["couple", "family", "solo", "friends", "group"];

const DEPARTURE_CITIES_MAP: Record<"ru" | "uz" | "en", string[]> = {
  ru: [
    "Ташкент",
    "Самарканд",
    "Бухара",
    "Ургенч / Хива",
    "Фергана",
    "Андижан",
    "Наманган",
    "Шахрисабз / Карши",
    "Термез",
    "Нукус",
    "Навои",
    "Джизак",
    "Гулистан",
    "Алматы / Астана",
    "Москва / Санкт-Петербург",
    "Другой город",
  ],
  uz: [
    "Toshkent",
    "Samarqand",
    "Buxoro",
    "Urganch / Xiva",
    "Farg'ona",
    "Andijon",
    "Namangan",
    "Shahrisabz / Qarshi",
    "Termiz",
    "Nukus",
    "Navoiy",
    "Jizzax",
    "Guliston",
    "Almati / Ostona",
    "Moskva / Sankt-Peterburg",
    "Boshqa shahar",
  ],
  en: [
    "Tashkent",
    "Samarkand",
    "Bukhara",
    "Urgench / Khiva",
    "Fergana",
    "Andijan",
    "Namangan",
    "Shahrisabz / Karshi",
    "Termez",
    "Nukus",
    "Navoi",
    "Jizzakh",
    "Gulistan",
    "Almaty / Astana",
    "Moscow / Saint Petersburg",
    "Other city",
  ],
};

const PACE_DESCRIPTIONS: Record<Pace, { ru: string; uz: string; en: string }> = {
  relaxed: {
    ru: "🌿 Спокойный (меньше спешки, больше отдыха)",
    uz: "🌿 Xotirjam (kamroq shoshilish, ko'proq hordiq)",
    en: "🌿 Relaxed (fewer stops, more leisure)",
  },
  balanced: {
    ru: "⚖️ Сбалансированный (баланс впечатлений и отдыха)",
    uz: "⚖️ Muvozanatli (taassurotlar va dam olish uyg'unligi)",
    en: "⚖️ Balanced (optimal mix of sights & rest)",
  },
  packed: {
    ru: "🔥 Насыщенный (максимум достопримечательностей)",
    uz: "🔥 Tig'iz (maksimal diqqatga sazovor joylar)",
    en: "🔥 Fast-paced (maximum attractions & activities)",
  },
};

const REGION_SUBTITLES: Record<Region, { ru: string; uz: string; en: string }> = {
  tashkent: { ru: "Центр плова, Чорсу", uz: "Osh markazi, Chorsu", en: "Plov Center, Chorsu" },
  tashkent_region: { ru: "Чарвак, Чимган, Амирсой", uz: "Chorvoq, Chimyon, Amirsoy", en: "Charvak, Chimgan, Amirsoy" },
  samarkand: { ru: "Регистан, Гур-Эмир", uz: "Registon, Go'ri Amir", en: "Registan, Gur-Emir" },
  bukhara: { ru: "Пои-Калян, Арк, Ляби-Хауз", uz: "Poi Kalon, Ark, Labi Hovuz", en: "Poi Kalyan, Ark, Lyabi-Khauz" },
  khiva: { ru: "Ичан-Кала, Кальта-Минор", uz: "Ichan Qal'a, Kalta Minor", en: "Ichan-Kala, Kalta Minor" },
  fergana: { ru: "Коканд, Риштан, Маргилан", uz: "Qo'qon, Rishton, Marg'ilon", en: "Kokand, Rishtan, Margilan" },
  andijan: { ru: "Парк Бабура, Ремесла", uz: "Bobur bog'i, Hunarmandlar", en: "Babur Park, Crafts" },
  namangan: { ru: "Долина Легенд, Ахсикент", uz: "Afsonalar vodiysi, Axsikent", en: "Valley of Legends, Akhsikent" },
  shahrisabz: { ru: "Дворец Аксарай, Темур", uz: "Oqsaroy, Amir Temur merosi", en: "Ak-Saray Palace, Timur" },
  termez: { ru: "Фаязтепа, Ат-Тирмизи", uz: "Fayoztepa, At-Termiziy", en: "Fayaztepa, Al-Hakim Termezi" },
  nukus: { ru: "Музей Савицкого, Арал", uz: "Savitskiy muzeyi, Orol dengizi", en: "Savitsky Museum, Aral Sea" },
  navoi: { ru: "Нурата, Айдаркуль", uz: "Nurota, Aydarko'l o'tovlari", en: "Nurata, Aydarkul Yurts" },
  jizzakh: { ru: "Заамин («Швейцария»)", uz: "Zomin milliy bog'i", en: "Zaamin National Park" },
  syrdarya: { ru: "Река Сырдарья, Рыбалка", uz: "Sirdaryo daryosi, Baliqchilik", en: "Syrdarya River, Fishing" },
};

export default function ConstructorPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  // 1. Travelers (КТО)
  const [travelerType, setTravelerType] = useState<TravelerType>("couple");
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);

  // 2. Dates & Duration (КОГДА)
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatDateIso(d);
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return formatDateIso(d);
  });
  const [totalDays, setTotalDays] = useState<number>(3);
  const [activeDays, setActiveDays] = useState<number>(3);
  const [restDays, setRestDays] = useState<number>(0);

  // 3. Destination & Departure (КУДА & ОТКУДА)
  const [region, setRegion] = useState<Region>("samarkand");
  const [departureCity, setDepartureCity] = useState<string>("Ташкент");

  // 4. Pace & Interests
  const [pace, setPace] = useState<Pace>("balanced");
  const [interests, setInterests] = useState<Category[]>([
    "history",
    "architecture",
    "gastronomy",
  ]);

  // 5. Budget Range
  const [budgetRange, setBudgetRange] = useState<BudgetRangeModel>({
    minBudget: 50,
    maxBudget: 500,
  });

  // Services Step Flow
  const [activeStep, setActiveStep] = useState<number>(0); // 0 = Preferences, 1 = Transport, 2 = Transfer, 3 = Hotel
  const [selectedTransport, setSelectedTransport] = useState<SelectedTransport | undefined>(undefined);
  const [selectedTransfer, setSelectedTransfer] = useState<SelectedTransfer | undefined>(undefined);
  const [selectedHotel, setSelectedHotel] = useState<SelectedHotel | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved state from sessionStorage (active AI/generated trip) or localStorage on mount
  useEffect(() => {
    // 1. Priority: check active trip from sessionStorage (e.g. from AI Concierge or Preset)
    try {
      const sessionTripRaw = sessionStorage.getItem("diyorai-trip");
      if (sessionTripRaw) {
        const tripFromSession: TripPlan = JSON.parse(sessionTripRaw);
        if (tripFromSession?.preferences) {
          const prefs = tripFromSession.preferences;
          if (prefs.region) setRegion(prefs.region);
          if (prefs.travelers) {
            setTravelerType(prefs.travelers.type);
            setAdults(prefs.travelers.adults);
            setChildrenCount(prefs.travelers.children);
          }
          if (prefs.duration) {
            const total = prefs.duration.totalDays || prefs.days || 3;
            const active = prefs.duration.activeDays || total;
            const rest = prefs.duration.restDays || 0;
            setTotalDays(total);
            setActiveDays(active);
            setRestDays(rest);
            if (prefs.duration.startDate) setStartDate(prefs.duration.startDate);
            if (prefs.duration.endDate) setEndDate(prefs.duration.endDate);
          } else if (prefs.days) {
            setTotalDays(prefs.days);
            setActiveDays(prefs.days);
            setRestDays(0);
          }
          if (prefs.pace) setPace(prefs.pace);
          if (prefs.interests && prefs.interests.length > 0) {
            setInterests(prefs.interests as Category[]);
          }
          const depCity = (prefs as any).departureCity || tripFromSession.transport?.departureCity;
          if (depCity) setDepartureCity(depCity);

          const maxBud = typeof prefs.budget === "object" ? prefs.budget.maxAmount : 600;
          setBudgetRange({ minBudget: 50, maxBudget: maxBud || 600 });

          if (tripFromSession.transport) setSelectedTransport(tripFromSession.transport);
          if (tripFromSession.transfer) setSelectedTransfer(tripFromSession.transfer);
          if (tripFromSession.hotel) setSelectedHotel(tripFromSession.hotel);
          return;
        }
      }
    } catch (e) {
      console.warn("Could not parse sessionStorage trip in constructor:", e);
    }

    // 2. Fallback to localStorage saved constructor state
    const saved = loadConstructorState();
    if (saved) {
      if (saved.travelers) {
        setTravelerType(saved.travelers.type);
        setAdults(saved.travelers.adults);
        setChildrenCount(saved.travelers.children);
      }
      if (saved.duration) {
        if (saved.duration.startDate) setStartDate(saved.duration.startDate);
        if (saved.duration.endDate) setEndDate(saved.duration.endDate);
        setTotalDays(saved.duration.totalDays);
        setActiveDays(saved.duration.activeDays);
        setRestDays(saved.duration.restDays);
      }
      if (saved.region) setRegion(saved.region);
      if (saved.departureCity) setDepartureCity(saved.departureCity);
      if (saved.pace) setPace(saved.pace);
      if (saved.interests) setInterests(saved.interests as Category[]);
      if (saved.budgetRange) setBudgetRange(saved.budgetRange);
      if (saved.transport) setSelectedTransport(saved.transport);
      if (saved.transfer) setSelectedTransfer(saved.transfer);
      if (saved.hotel) setSelectedHotel(saved.hotel);
    }
  }, []);

  // Update total days when start or end date changes
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    const days = calculateDaysBetweenDates(newStart, endDate);
    if (days > 21) {
      setError(
        language === "uz"
          ? "Sayohatning maksimal davomiyligi 21 kun. Iltimos, sanalarni o'zgartiring."
          : language === "en"
          ? "Maximum trip duration is 21 days. Please adjust your dates."
          : "Максимальная длительность поездки — 21 день. Пожалуйста, скорректируйте даты."
      );
    } else {
      setError(null);
      setTotalDays(days);
      setActiveDays(days);
      setRestDays(0);
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    const days = calculateDaysBetweenDates(startDate, newEnd);
    if (days > 21) {
      setError(
        language === "uz"
          ? "Sayohatning maksimal davomiyligi 21 kun. Iltimos, sanalarni o'zgartiring."
          : language === "en"
          ? "Maximum trip duration is 21 days. Please adjust your dates."
          : "Максимальная длительность поездки — 21 день. Пожалуйста, скорректируйте даты."
      );
    } else {
      setError(null);
      setTotalDays(days);
      setActiveDays(days);
      setRestDays(0);
    }
  };

  // Active / Rest Days Controls with Auto-Balancing
  const handleActiveDaysChange = (delta: number) => {
    const nextActive = Math.max(1, Math.min(totalDays, activeDays + delta));
    setActiveDays(nextActive);
    setRestDays(totalDays - nextActive);
    setError(null);
  };

  const handleRestDaysChange = (delta: number) => {
    const nextRest = Math.max(0, Math.min(totalDays - 1, restDays + delta));
    setRestDays(nextRest);
    setActiveDays(totalDays - nextRest);
    setError(null);
  };

  // Adults and Children Controls
  const handleAdultsChange = (delta: number) => {
    const next = adults + delta;
    if (next < 1) return;
    setAdults(next);
  };

  const handleChildrenChange = (delta: number) => {
    const next = childrenCount + delta;
    if (next < 0) return;
    setChildrenCount(next);
  };

  // Traveler Preset selection
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
  };

  // Computed Models
  const travelersModel = createTravelersModel(travelerType, adults, childrenCount);
  const durationModel = createDurationModel(totalDays, activeDays, startDate, endDate);

  // Live Cost Calculation
  const costCalculation = calculateTripCost({
    travelers: travelersModel,
    duration: durationModel,
    budgetMaxUsd: budgetRange.maxBudget === null ? Infinity : budgetRange.maxBudget,
    transport: selectedTransport,
    transfer: selectedTransfer,
    hotel: selectedHotel,
  });

  // Save state on changes
  useEffect(() => {
    saveConstructorState({
      travelers: travelersModel,
      duration: durationModel,
      region,
      departureCity,
      pace,
      interests,
      budgetRange,
      transport: selectedTransport,
      transfer: selectedTransfer,
      hotel: selectedHotel,
    });
  }, [travelersModel, durationModel, region, departureCity, pace, interests, budgetRange, selectedTransport, selectedTransfer, selectedHotel]);

  // Build Final Itinerary
  const handleBuildFinalItinerary = async () => {
    if (interests.length === 0) {
      setError(t.home.selectAtLeastOne);
      return;
    }

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="border-b border-majolica/20 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal className="w-5 h-5 text-majolica" />
          <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
            DiyorAI · Travel Planner
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-night">
          {language === "uz" ? "Sayohat konstruktori" : language === "en" ? "Custom Trip Constructor" : "Конструктор путешествия"}
        </h1>
        <p className="text-xs sm:text-sm text-night/70 mt-1 max-w-2xl font-light leading-relaxed">
          {language === "uz"
            ? "Tarkib, sanalar, shahar va byudjetni belgilang — DiyorAI to'liq hisob-kitob va marshrutni tuzib beradi."
            : language === "en"
            ? "Customize group, dates, logistics, and budget — DiyorAI creates a verified tailored itinerary."
            : "Укажите количество людей, точные даты, логистику и бюджет — DiyorAI соберет персональный тур с контролем расходов."}
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-brick/10 border border-brick/30 text-xs sm:text-sm text-brick font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Financial Header Bar */}
      <BudgetBar
        costResult={costCalculation}
        travelers={travelersModel}
      />

      {/* Prominent Over-Budget Alert Banner */}
      {costCalculation.isOverBudget && (
        <div className="p-5 rounded-3xl bg-brick/10 border-2 border-brick/40 space-y-3 animate-fade-in shadow-md">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brick text-paper flex items-center justify-center font-bold">
                ⚠️
              </div>
              <div>
                <h4 className="font-display font-bold text-base sm:text-lg text-brick">
                  {language === "uz" ? "BYUDJET CHEGARASI OSHIB KETDI" : language === "en" ? "BUDGET LIMIT EXCEEDED" : "БЮДЖЕТ ПРЕВЫШЕН"}
                </h4>
                <p className="text-xs text-night/75 font-mono">
                  {language === "uz" ? "Belgilangan byudjet" : language === "en" ? "Your budget" : "Ваш бюджет"}: <strong className="text-night">${budgetRange.maxBudget}</strong> ·{" "}
                  {language === "uz" ? "Hozirgi hisob" : language === "en" ? "Current cost" : "Текущая стоимость"}: <strong className="text-night">${costCalculation.totalCostUsd}</strong> ·{" "}
                  {language === "uz" ? "Oshish" : language === "en" ? "Over by" : "Превышение"}: <strong className="text-brick font-black">+${costCalculation.overBudgetAmountUsd}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 bg-brick hover:bg-brick/90 text-paper rounded-xl text-xs font-mono font-bold transition-all shadow-xs"
            >
              {language === "uz" ? "Qayta hisoblash" : language === "en" ? "Recalculate" : "Пересчитать тур"}
            </button>
          </div>

          {costCalculation.savingTips.length > 0 && (
            <div className="pt-2 border-t border-brick/20 text-xs space-y-1">
              <span className="font-bold text-night flex items-center gap-1 font-mono">
                <Lightbulb className="w-3.5 h-3.5 text-gold" />
                <span>{language === "uz" ? "Iqtisod qilish bo'yicha maslahatlar" : language === "en" ? "Optimization suggestions" : "Советы по оптимизации расходов"}:</span>
              </span>
              {costCalculation.savingTips.map((tip, i) => (
                <p key={i} className="text-night/80 pl-2 font-light">
                  • {tip}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MAIN STEP 0: PREFERENCES FORM */}
      {activeStep === 0 && (
        <div className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
          {/* 1. TRAVELERS CUSTOMIZATION */}
          <div>
            <label className="block text-xs uppercase font-mono font-bold tracking-wider text-night mb-3">
              1. {language === "uz" ? "Kimlar sayohat qilmoqda?" : language === "en" ? "Who is Traveling?" : "Кто путешествует?"}
            </label>

            {/* Quick Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {TRAVELER_TYPES.map((type) => {
                const active = travelerType === type;
                const labels: Record<TravelerType, string> = {
                  couple: language === "uz" ? "👫 Juftlik" : language === "en" ? "👫 Couple" : "👫 Пара",
                  family: language === "uz" ? "👨‍👩‍👧‍👦 Oila" : language === "en" ? "👨‍👩‍👧‍👦 Family" : "👨‍👩‍👧‍👦 Семья",
                  solo: language === "uz" ? "👤 Yolg'iz" : language === "en" ? "👤 Solo" : "👤 Соло",
                  friends: language === "uz" ? "👥 Do'stlar" : language === "en" ? "👥 Friends" : "👥 Друзья",
                  group: language === "uz" ? "🚌 Guruh" : language === "en" ? "🚌 Group" : "🚌 Группа",
                };
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTravelerTypeChange(type)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-md ring-2 ring-indigo-300 scale-102"
                        : "bg-white text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 border-slate-200 shadow-2xs"
                    }`}
                  >
                    {labels[type]}
                  </button>
                );
              })}
            </div>

            {/* +/- Controls for Adults and Children */}
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-paper/60 rounded-2xl border border-majolica/20">
              {/* Adults Counter */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-majolica/15">
                <div>
                  <span className="text-xs font-bold text-night block">
                    {language === "uz" ? "Kattalar (18+)" : language === "en" ? "Adults (18+)" : "Взрослые (18+)"}
                  </span>
                  <span className="text-[10px] text-night/50 font-mono">
                    {language === "uz" ? "Asosiy o'rinlar" : language === "en" ? "Standard fares" : "Полный тариф"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleAdultsChange(-1)}
                    disabled={adults <= 1}
                    className="w-8 h-8 rounded-lg bg-paper hover:bg-majolica/20 active:bg-majolica/30 disabled:opacity-30 flex items-center justify-center text-night font-black transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-black text-lg text-night w-6 text-center">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdultsChange(1)}
                    className="w-8 h-8 rounded-lg bg-paper hover:bg-majolica/20 active:bg-majolica/30 flex items-center justify-center text-night font-black transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Children Counter */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-majolica/15">
                <div>
                  <span className="text-xs font-bold text-night block">
                    {language === "uz" ? "Bolalar (14 yoshgacha)" : language === "en" ? "Children (under 14)" : "Дети (до 14 лет)"}
                  </span>
                  <span className="text-[10px] text-night/50 font-mono">
                    {language === "uz" ? "Chegirmali chiptalar" : language === "en" ? "Discounted rates" : "Скидки на билеты и отели"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleChildrenChange(-1)}
                    disabled={childrenCount <= 0}
                    className="w-8 h-8 rounded-lg bg-paper hover:bg-majolica/20 active:bg-majolica/30 disabled:opacity-30 flex items-center justify-center text-night font-black transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-black text-lg text-night w-6 text-center">
                    {childrenCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleChildrenChange(1)}
                    className="w-8 h-8 rounded-lg bg-paper hover:bg-majolica/20 active:bg-majolica/30 flex items-center justify-center text-night font-black transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DATES AND DURATION */}
          <div className="pt-6 border-t border-majolica/15">
            <label className="block text-xs uppercase font-mono font-bold tracking-wider text-night mb-3">
              2. {language === "uz" ? "Sayohat sanalari va davomiyligi" : language === "en" ? "Travel Dates & Duration" : "Даты путешествия и длительность"}
            </label>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {/* Start Date */}
              <div className="p-3 bg-paper/60 rounded-2xl border border-majolica/20">
                <span className="text-xs font-bold text-night flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-majolica" />
                  <span>{language === "uz" ? "Boshlanish sanasi" : language === "en" ? "Start Date" : "С какой даты?"}</span>
                </span>
                <input
                  type="date"
                  value={startDate}
                  min={formatDateIso(new Date())}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-majolica/25 bg-white text-xs font-mono font-bold text-night outline-none focus:border-majolica"
                />
              </div>

              {/* End Date */}
              <div className="p-3 bg-paper/60 rounded-2xl border border-majolica/20">
                <span className="text-xs font-bold text-night flex items-center gap-1.5 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-majolica" />
                  <span>{language === "uz" ? "Tugash sanasi" : language === "en" ? "End Date" : "По какую дату?"}</span>
                </span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-majolica/25 bg-white text-xs font-mono font-bold text-night outline-none focus:border-majolica"
                />
              </div>
            </div>

            {/* 3. ACTIVE DAYS & REST DAYS */}
            <div className="p-4 bg-paper/80 rounded-2xl border border-majolica/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-night uppercase tracking-wider">
                  {language === "uz" ? "Jami davomiylik" : language === "en" ? "Trip Duration" : "Продолжительность поездки"}:
                </span>
                <span className="font-mono font-black text-sm text-majolica px-2.5 py-0.5 rounded-full bg-majolica/15">
                  {totalDays} {language === "uz" ? "kun" : language === "en" ? "days" : "дней"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-1">
                {/* Active Days */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-majolica/15">
                  <div>
                    <span className="text-xs font-bold text-night block">
                      {language === "uz" ? "Faol sayohat" : language === "en" ? "Active Travel" : "Активное путешествие"}
                    </span>
                    <span className="text-[10px] text-night/50 font-mono">
                      {language === "uz" ? "Ekskursiyalar va ziyorat" : language === "en" ? "Tours & excursions" : "Экскурсии и объекты"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleActiveDaysChange(-1)}
                      disabled={activeDays <= 1}
                      className="w-7 h-7 rounded-lg bg-paper hover:bg-majolica/20 disabled:opacity-30 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-sm text-night w-5 text-center">
                      {activeDays}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleActiveDaysChange(1)}
                      className="w-7 h-7 rounded-lg bg-paper hover:bg-majolica/20 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rest Days */}
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-majolica/15">
                  <div>
                    <span className="text-xs font-bold text-night block">
                      {language === "uz" ? "Dam olish kunlari" : language === "en" ? "Rest Days" : "Дни отдыха"}
                    </span>
                    <span className="text-[10px] text-night/50 font-mono">
                      {language === "uz" ? "Erkin vaqt va hordiq" : language === "en" ? "Free time & relax" : "Свободный темп, спа"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRestDaysChange(-1)}
                      disabled={restDays <= 0}
                      className="w-7 h-7 rounded-lg bg-paper hover:bg-majolica/20 disabled:opacity-30 flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-sm text-night w-5 text-center">
                      {restDays}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRestDaysChange(1)}
                      className="w-7 h-7 rounded-lg bg-paper hover:bg-majolica/20 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DESTINATION & DEPARTURE CITY */}
          <div className="pt-6 border-t border-majolica/15">
            <label className="block text-xs uppercase font-mono font-bold tracking-wider text-night mb-3">
              3. {language === "uz" ? "Yo'nalish va jo'nash shahri" : language === "en" ? "Destination & Departure" : "Направление и город отправления"}
            </label>

            {/* Departure City */}
            <div className="mb-4">
              <span className="text-xs text-night/70 font-mono font-bold block mb-1.5">
                {language === "uz" ? "Qayerdan jo'naysiz?" : language === "en" ? "Where are you departing from?" : "Откуда вы отправляетесь?"}
              </span>
              <select
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                className="w-full sm:w-80 p-3 rounded-xl border border-sand-border bg-white text-xs font-mono font-bold text-night outline-none focus:border-primary"
              >
                {(DEPARTURE_CITIES_MAP[language] || DEPARTURE_CITIES_MAP.ru).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Region Question & Selector */}
            <div className="mb-2">
              <span className="text-xs text-night/70 font-mono font-bold block mb-2">
                {language === "uz" ? "Qayerga bormoqchisiz? (O'zbekiston hududini tanlang)" : language === "en" ? "Where do you want to go? (Select Uzbekistan region)" : "Куда вы направляетесь? (Выберите регион Узбекистана)"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {REGIONS.map((r) => {
                const active = region === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      active
                        ? "border-[#1E3A8A] bg-gradient-to-br from-indigo-50/90 to-blue-50/90 shadow-sm ring-2 ring-[#1E3A8A]/30 scale-102"
                        : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-800 shadow-2xs"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block mb-0.5">
                      {t.regions[r] || REGION_LABELS[r]}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {REGION_SUBTITLES[r]?.[language] || REGION_SUBTITLES[r]?.ru}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. BUDGET RANGE SLIDER */}
          <div className="pt-6 border-t border-majolica/15">
            <label className="block text-xs uppercase font-mono font-bold tracking-wider text-night mb-3">
              4. {language === "uz" ? "Byudjet diapazoni" : language === "en" ? "Budget Range" : "Бюджет поездки"}
            </label>
            <BudgetRangeSlider
              value={budgetRange}
              onChange={setBudgetRange}
            />
          </div>

          {/* 6. INTERESTS & PACE */}
          <div className="pt-6 border-t border-majolica/15">
            <label className="block text-xs uppercase font-mono font-bold tracking-wider text-night mb-3">
              5. {language === "uz" ? "Qiziqishlar va sayohat sur'ati" : language === "en" ? "Interests & Pace" : "Интересы и темп"}
            </label>
            <InterestChips
              selected={interests}
              onChange={setInterests}
            />

            {/* Pace */}
            <div className="grid sm:grid-cols-3 gap-2.5 mt-4">
              {PACES.map((p) => {
                const active = pace === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPace(p)}
                    className={`p-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-md ring-2 ring-indigo-300 scale-102"
                        : "bg-white text-slate-800 hover:border-indigo-400 hover:bg-indigo-50/50 border-slate-200 shadow-2xs"
                    }`}
                  >
                    {PACE_DESCRIPTIONS[p]?.[language] || PACE_DESCRIPTIONS[p]?.ru}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA: Next to Logistics & Stays */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 transition-colors shadow-2xs"
            >
              {language === "uz" ? "Bosh sahifaga qaytish" : language === "en" ? "Back to Home" : "На главную"}
            </Link>

            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#152a65] hover:to-[#1d4ed8] text-white font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <span>{language === "uz" ? "Keyingi: Transport va Logistika" : language === "en" ? "Next: Transport & Stays" : "Далее: Выбор транспорта и отеля"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: TRANSPORT SELECTION */}
      {activeStep === 1 && (
        <div className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-8 shadow-xs">
          <StepTransport
            region={region}
            travelers={travelersModel}
            selectedTransport={selectedTransport}
            onSelect={setSelectedTransport}
            onNext={() => setActiveStep(2)}
            onBack={() => setActiveStep(0)}
          />
        </div>
      )}

      {/* STEP 2: TRANSFER SELECTION */}
      {activeStep === 2 && (
        <div className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-8 shadow-xs">
          <StepTransfer
            travelers={travelersModel}
            selectedTransfer={selectedTransfer}
            onSelect={setSelectedTransfer}
            onNext={() => setActiveStep(3)}
            onBack={() => setActiveStep(1)}
          />
        </div>
      )}

      {/* STEP 3: HOTEL SELECTION & BUILD ROUTE */}
      {activeStep === 3 && (
        <div className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <StepHotel
            region={region}
            duration={durationModel}
            travelers={travelersModel}
            selectedHotel={selectedHotel}
            onSelect={setSelectedHotel}
            onNext={handleBuildFinalItinerary}
            onBack={() => setActiveStep(2)}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
