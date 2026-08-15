import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Guide, PayerSplitMode, TripPlan, TourismObject } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { fetchWeatherForTrip, WeatherReport, getWeatherAlternatives, WeatherAlternative } from "@/lib/weather";
import WeatherWidget from "@/components/WeatherWidget";
import DayTimeline from "@/components/DayTimeline";
import SurvivalGuideModal from "@/components/SurvivalGuideModal";
import BookingModal from "@/components/BookingModal";
import GuideCard from "@/components/guides/GuideCard";
import GuideProfileModal from "@/components/guides/GuideProfileModal";
import GuideBookingModal from "@/components/guides/GuideBookingModal";
import { calculateTripCost } from "@/lib/costCalculator";
import { scoreGuides } from "@/lib/tripPlanner";
import { trackEvent } from "@/lib/analytics";
import ExperienceIcon from "@/components/common/ExperienceIcon";
import CategoryBadge from "@/components/common/CategoryBadge";
import {
  Coins,
  Sparkles,
  Check,
  ShieldCheck,
  Users,
  Lightbulb,
  Car,
  Landmark,
  CloudSun,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  RefreshCw,
} from "lucide-react";

import { TRIP_PRESETS } from "@/data/presets";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function TripPage() {
  const { t, language } = useTranslation();
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Weather Alternatives
  const [acceptedAlternative, setAcceptedAlternative] = useState<WeatherAlternative | null>(null);
  const [dismissWeatherAlert, setDismissWeatherAlert] = useState(false);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Guide Modals State
  const [selectedGuideForProfile, setSelectedGuideForProfile] = useState<Guide | null>(null);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<Guide | null>(null);

  // Cost Split Mode
  const [splitMode, setSplitMode] = useState<PayerSplitMode>("equal");

  useEffect(() => {
    const raw = sessionStorage.getItem("diyorai-trip");
    if (!raw) {
      const defaultPlan = TRIP_PRESETS[0]?.plan;
      if (defaultPlan) {
        setPlan(defaultPlan);
        if (defaultPlan.preferences.travelers?.type === "family") {
          setSplitMode("family_share");
        }
      } else {
        setNotFound(true);
      }
      return;
    }
    try {
      const parsedPlan: TripPlan = JSON.parse(raw);
      setPlan(parsedPlan);
      if (parsedPlan.preferences.travelers?.type === "family") {
        setSplitMode("family_share");
      }
    } catch {
      const defaultPlan = TRIP_PRESETS[0]?.plan;
      if (defaultPlan) {
        setPlan(defaultPlan);
      } else {
        setNotFound(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!plan) return;
    setWeatherLoading(true);
    const region = plan.preferences.region === "tashkent_region" ? "tashkent_region" : plan.preferences.region;
    const days = plan.preferences.duration?.totalDays || plan.preferences.days || 3;
    fetchWeatherForTrip(region, days, language)
      .then(setWeather)
      .finally(() => setWeatherLoading(false));
  }, [plan, language]);

  const handleExportPdf = () => {
    window.print();
  };

  const handleShareTelegram = () => {
    if (!plan) return;
    const regionName = t.regions[plan.preferences.region] || plan.preferences.region;
    const days = plan.preferences.duration?.totalDays || plan.preferences.days || 3;
    const text = encodeURIComponent(
      `🏛️ Мой туристический маршрут DiyorAI по Узбекистану (${regionName}, ${days} дн., ${plan.preferences.travelers?.total || 2} чел.)!\nСпланируйте свой на https://diyorai.eessketit.uz`
    );
    window.open(`https://t.me/share/url?url=https://diyorai.eessketit.uz&text=${text}`, "_blank");
  };

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-night mb-4">{t.trip.notBuiltTitle}</h1>
        <p className="text-night/70 mb-8">{t.trip.notBuiltDesc}</p>
        <Link
          href="/constructor"
          className="inline-block bg-majolica text-paper font-semibold px-6 py-3 rounded-lg hover:bg-majolica/90 transition-colors"
        >
          {language === "uz" ? "Konstruktorga o'tish" : language === "en" ? "Open Constructor" : "Перейти в конструктор"}
        </Link>
      </div>
    );
  }

  if (!plan) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-night/60">{t.trip.loading}</div>;
  }

  const totalDays = plan.preferences.duration?.totalDays || plan.preferences.days || 3;
  const travelers = plan.preferences.travelers || { type: "couple" as const, adults: 2, children: 0, total: 2 };
  const duration = plan.preferences.duration || { totalDays, activeDays: totalDays, restDays: 0 };
  const budgetMax = (typeof plan.preferences.budget === "object" ? plan.preferences.budget.maxAmount : 500) || 500;

  // Realtime calculated financial result with interactive splitMode
  const costResult = calculateTripCost({
    travelers,
    duration,
    budgetMaxUsd: budgetMax,
    transport: plan.transport,
    transfer: plan.transfer,
    hotel: plan.hotel,
    splitMode,
  });

  const allStops = plan.days.flatMap((d) =>
    d.stops.map((s, idx) => ({ ...s, order: idx + 1, dayNumber: d.dayNumber }))
  );
  const currentDay = plan.days.find((d) => d.dayNumber === activeDay) ?? plan.days[0];
  const interestsQuery = plan.preferences.interests.join(",");

  // Guides matching directly for this trip
  const matchedGuides = scoreGuides(plan.preferences.region, plan.preferences.interests, {
    travelerType: travelers.type,
    language: language === "uz" ? "uz" : language === "en" ? "en" : "ru",
  }).slice(0, 3);

  // Weather Alternatives
  const weatherAlternatives = weather
    ? getWeatherAlternatives(plan.preferences.region, weather.isRainy, weather.isHot)
    : [];

  const handleApplyAlternative = (alt: WeatherAlternative) => {
    setAcceptedAlternative(alt);
    if (plan.days.length > 0 && plan.days[0].stops.length > 0) {
      const newStop: TourismObject & { score: number; timeSlot?: any; timeLabel?: string; estimatedCostUsd?: number } = {
        id: alt.id,
        name: alt.replacementName[language] || alt.replacementName.ru,
        city: plan.preferences.region,
        region: plan.preferences.region,
        categories: [alt.category === "museum" ? "history" : alt.category === "gastronomy" ? "gastronomy" : "crafts_bazaars"],
        lat: plan.days[0].stops[0].lat + 0.005,
        lon: plan.days[0].stops[0].lon + 0.005,
        description: alt.replacementDesc[language] || alt.replacementDesc.ru,
        popularity: 10,
        isIndoor: true,
        score: 0.98,
        timeLabel: "14:00 - 16:30 (Крытая комфортная локация)",
      };
      const updatedDays = [...plan.days];
      updatedDays[0] = {
        ...updatedDays[0],
        stops: [newStop, ...updatedDays[0].stops.slice(1)],
      };
      const updatedPlan = { ...plan, days: updatedDays };
      setPlan(updatedPlan);
      sessionStorage.setItem("diyorai-trip", JSON.stringify(updatedPlan));
    }
  };

  const handleOpenBooking = () => {
    trackEvent("booking_clicked", { destination: plan.preferences.region, totalCost: costResult.totalCostUsd });
    setIsBookingOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="uppercase tracking-[0.2em] text-majolica text-xs font-bold font-mono">
            {t.regions[plan.preferences.region]} · {totalDays} {t.trip.days} · {travelers.total} чел.
          </p>
          {duration.restDays > 0 && (
            <CategoryBadge label={`${duration.restDays} дн. отдыха`} icon="🌿" />
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-lg border border-majolica/40 bg-paper hover:bg-majolica/10 text-xs font-bold text-night flex items-center gap-1.5 shadow-xs transition-colors"
            title="Экспорт в PDF для оффлайн использования в роуминге"
          >
            <span>📄</span> Экспорт PDF / Печать
          </button>
          <button
            onClick={handleShareTelegram}
            className="px-3 py-1.5 rounded-lg border border-majolica/40 bg-paper hover:bg-majolica/10 text-xs font-bold text-night flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>✈️</span> В Telegram
          </button>
          <Link
            href="/constructor"
            className="text-xs font-bold text-majolica hover:underline uppercase tracking-wider ml-2 font-mono"
          >
            ← {t.trip.recalculate}
          </Link>
        </div>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl text-night font-bold mb-4">
        {t.trip.title}: {t.regions[plan.preferences.region]}
      </h1>

      {/* Selected Logistics Overview Bar */}
      {(plan.transport || plan.transfer || plan.hotel) && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-majolica/20 shadow-xs grid sm:grid-cols-3 gap-3 text-xs">
          {plan.transport && (
            <div className="p-3 bg-paper/60 rounded-xl border border-majolica/15">
              <span className="text-night/50 block text-[10px] uppercase font-bold font-mono">1. Транспорт</span>
              <p className="font-bold text-night mt-0.5">
                {plan.transport.type === "flight"
                  ? `✈️ ${plan.transport.flight?.airline} (${plan.transport.flight?.flightNumber})`
                  : plan.transport.type === "train"
                  ? `🚆 ${plan.transport.train?.name}`
                  : "🚗 На автомобиле"}
              </p>
              <span className="text-[11px] text-night/70 font-mono">
                ${plan.transport.totalCostUsd} ({plan.transport.passengers} пасс.)
              </span>
            </div>
          )}

          {plan.transfer && (
            <div className="p-3 bg-paper/60 rounded-xl border border-majolica/15">
              <span className="text-night/50 block text-[10px] uppercase font-bold font-mono">2. Трансфер</span>
              <p className="font-bold text-night mt-0.5">
                🚕 {plan.transfer.vehicle.title} ({plan.transfer.numberOfCars} авто)
              </p>
              <span className="text-[11px] text-night/70 font-mono">
                ${plan.transfer.totalCostUsd} (вместимость {plan.transfer.vehicle.passengerCapacity * plan.transfer.numberOfCars} чел.)
              </span>
            </div>
          )}

          {plan.hotel && (
            <div className="p-3 bg-paper/60 rounded-xl border border-majolica/15">
              <span className="text-night/50 block text-[10px] uppercase font-bold font-mono">3. Проживание</span>
              <p className="font-bold text-night mt-0.5 truncate">
                🏨 {plan.hotel.hotel.name}
              </p>
              <span className="text-[11px] text-night/70 font-mono">
                ${plan.hotel.totalCostUsd} ({plan.hotel.nights} ночей, {plan.hotel.numberOfRooms} комн.)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Weather Widget */}
      <div className="mb-6">
        <WeatherWidget
          weather={weather}
          loading={weatherLoading}
        />
      </div>

      {/* WEATHER ADAPTIVE ALERT & ALTERNATIVES */}
      {weather && (weather.isRainy || weather.isHot) && !dismissWeatherAlert && (
        <div className="mb-8 p-5 rounded-3xl bg-gold/10 border-2 border-gold/40 shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold text-night flex items-center justify-center text-lg shrink-0">
                {weather.isRainy ? "🌧️" : "☀️"}
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-night">
                  {weather.isRainy
                    ? language === "uz"
                      ? "Yomg'irli ob-havo kutilmoqda: Yopiq lokatsiyalarni tavsiya qilamiz"
                      : language === "en"
                      ? "Rain Forecasted: Recommended Indoor Cultural Stops"
                      : "🌧 В этот день ожидаются осадки: рекомендуем крытые объекты"
                    : language === "uz"
                    ? "Yuqori harorat (+32°C): Salqin joylar tavsiya etiladi"
                    : language === "en"
                    ? "High Daytime Heat (+32°C): Shaded & Indoor Stops Recommended"
                    : "☀️ Высокая дневная температура: рекомендуем крытые залы и мастер-классы"}
                </h3>
                <p className="text-xs text-night/75 font-light mt-0.5 leading-relaxed">
                  {language === "uz"
                    ? "DiyorAI ochiq havoda noqulaylik sezmasligingiz uchun qulay muqobil variantlarni tayyorladi:"
                    : language === "en"
                    ? "To ensure maximum comfort, DiyorAI suggests replacing outdoor stops with verified indoor gems:"
                    : "Чтобы поездка была комфортной, DiyorAI подобрал проверенные крытые музеи и гастрономические точки:"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDismissWeatherAlert(true)}
              className="text-xs text-night/50 hover:text-night font-mono"
            >
              ✕
            </button>
          </div>

          {/* Alternatives Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
            {weatherAlternatives.map((alt) => {
              const isApplied = acceptedAlternative?.id === alt.id;
              return (
                <div
                  key={alt.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isApplied
                      ? "bg-majolica/15 border-majolica ring-1 ring-majolica/30"
                      : "bg-white border-majolica/20 hover:border-majolica/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{alt.icon}</span>
                    <h4 className="font-display font-bold text-xs text-night leading-snug truncate">
                      {alt.replacementName[language] || alt.replacementName.ru}
                    </h4>
                  </div>
                  <p className="text-[11px] text-night/70 font-light line-clamp-2 leading-relaxed mb-3">
                    {alt.replacementDesc[language] || alt.replacementDesc.ru}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleApplyAlternative(alt)}
                    disabled={isApplied}
                    className={`w-full py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isApplied
                        ? "bg-majolica text-paper cursor-default"
                        : "bg-paper hover:bg-majolica hover:text-paper border border-majolica/30 text-night"
                    }`}
                  >
                    {isApplied
                      ? language === "uz" ? "✓ Marshrutga kiritildi" : language === "en" ? "✓ Applied to Route" : "✓ Включено в маршрут"
                      : language === "uz" ? "Almashtirishni qabul qilish" : language === "en" ? "Accept Alternative" : "Принять замену"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Map and Timeline */}
      <div className="space-y-6">
        <MapView stops={allStops} />

        {/* Day tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
          {plan.days.map((d) => (
            <button
              key={d.dayNumber}
              onClick={() => setActiveDay(d.dayNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeDay === d.dayNumber
                  ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-md ring-2 ring-indigo-300 scale-102"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50/50 hover:border-indigo-300 shadow-2xs"
              }`}
            >
              {language === "uz" ? `${d.dayNumber}-kun` : language === "en" ? `Day ${d.dayNumber}` : `День ${d.dayNumber}`}
            </button>
          ))}
        </div>

        <DayTimeline
          stops={currentDay.stops}
          dayNumber={activeDay}
        />
      </div>

      {/* ========================================================
         18. ПОДХОДЯЩИЕ ГИДЫ СРАЗУ ПОСЛЕ МАРШРУТА (MATCHED GUIDES)
         ======================================================== */}
      <section className="mt-14 bg-paper/50 border border-majolica/20 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-majolica/15 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-majolica" />
              <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
                Verified Local Experts
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-night">
              {language === "uz"
                ? "Sizning marshrutingiz uchun tavsiya etilgan gidlar"
                : language === "en"
                ? "Matched Guides for Your Itinerary"
                : "🛡 Подходящие гиды для вашего маршрута"}
            </h2>
            <p className="text-xs text-night/70 font-light mt-0.5">
              {language === "uz"
                ? "Tanlangan shahar, qiziqishlar va sanalar bo'yicha moslashtirilgan litsenziyali mutaxassislar"
                : language === "en"
                ? "Verified licensed guides matched with your destination, interests, language and group size"
                : "Проверенные гиды, подобранные под выбранное направление, интересы, язык и размер группы"}
            </p>
          </div>

          <Link
            href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
            className="px-4 py-2 rounded-xl border border-majolica/30 text-xs font-mono font-bold text-night hover:bg-majolica/10 transition-colors"
          >
            {language === "uz" ? "Barcha gidlarni ko'rish →" : language === "en" ? "View All Guides →" : "Все гиды каталога →"}
          </Link>
        </div>

        {/* Top Matched Guides Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {matchedGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onViewProfile={setSelectedGuideForProfile}
              onBook={setSelectedGuideForBooking}
            />
          ))}
        </div>
      </section>

      {/* Financial Summary & Split Calculator */}
      <div className="mt-12 bg-white rounded-3xl border border-majolica/20 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-majolica/15">
          <div>
            <span className="text-xs uppercase font-mono tracking-wider text-majolica font-bold flex items-center gap-1.5 mb-1">
              <Coins className="w-4 h-4 text-majolica" />
              <span>{t.trip.financialSummary}</span>
            </span>
            <h2 className="text-2xl font-display font-bold text-night">
              {t.planner.stepBudget}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-night/50 font-mono font-semibold block">{t.trip.costTotal}:</span>
            <span className="font-mono font-black text-2xl sm:text-3xl text-night">
              ${costResult.totalCostUsd}
            </span>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-4 bg-paper rounded-2xl border border-majolica/20">
            <span className="text-night/50 block">{t.trip.costTransport}:</span>
            <span className="font-mono font-black text-xl text-night">
              ${costResult.breakdown.transport}
            </span>
            <span className="text-[10px] text-night/60 block mt-0.5">
              {plan.transport ? `${plan.transport.type}` : "Без транспорта"}
            </span>
          </div>

          <div className="p-4 bg-paper rounded-2xl border border-majolica/20">
            <span className="text-night/50 block">{t.trip.costTransfer}:</span>
            <span className="font-mono font-black text-xl text-night">
              ${costResult.breakdown.transfer}
            </span>
            <span className="text-[10px] text-night/60 block mt-0.5">
              {plan.transfer ? `${plan.transfer.vehicle.title}` : "Без трансфера"}
            </span>
          </div>

          <div className="p-4 bg-paper rounded-2xl border border-majolica/20">
            <span className="text-night/50 block">{t.trip.costHotel}:</span>
            <span className="font-mono font-black text-xl text-night">
              ${costResult.breakdown.hotel}
            </span>
            <span className="text-[10px] text-night/60 block mt-0.5">
              {plan.hotel ? `${plan.hotel.nights} ночей` : "Без отеля"}
            </span>
          </div>

          <div className="p-4 bg-paper rounded-2xl border border-majolica/20">
            <span className="text-night/50 block">{t.trip.costActivitiesFood}:</span>
            <span className="font-mono font-black text-xl text-night">
              ${costResult.breakdown.activitiesAndFood + costResult.breakdown.other}
            </span>
            <span className="text-[10px] text-night/60 block mt-0.5">
              ~${Math.round(costResult.breakdown.activitiesAndFood / totalDays)}/день
            </span>
          </div>
        </div>

        {/* Total Summary Row */}
        <div className="p-5 bg-paper/80 rounded-2xl border border-majolica/20 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs text-night/60 font-mono block font-semibold">
              {t.trip.costTotal}:
            </span>
            <span className="font-mono font-black text-3xl sm:text-4xl text-night">
              ${costResult.totalCostUsd}
            </span>
            <span className="text-xs text-night/70 font-mono block mt-1">
              {costResult.budgetMaxUsd === Infinity ? t.planner.unlimited : `${t.planner.budgetLimitLabel}: $${costResult.budgetMaxUsd}`}
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-night/60 font-mono block font-semibold">
              {t.trip.costPerPerson}:
            </span>
            <span className="font-mono font-black text-2xl text-gold">
              ~${costResult.costPerPersonUsd}
            </span>
            <span className="text-xs text-night/70 font-mono block mt-0.5">
              {travelers.total} {t.booking.travelersLabel}
            </span>
          </div>
        </div>

        {/* Payer Split Calculator */}
        <div className="p-5 bg-paper/50 rounded-2xl border border-majolica/20 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-night uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-majolica" />
              <span>{t.trip.payerSplitTitle}</span>
            </span>

            {travelers.type === "couple" && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-majolica/20 text-xs font-mono">
                <button
                  onClick={() => setSplitMode("equal")}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    splitMode === "equal" ? "bg-majolica text-paper" : "text-night/70"
                  }`}
                >
                  {t.trip.splitEqual}
                </button>
                <button
                  onClick={() => setSplitMode("single_payer")}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    splitMode === "single_payer" ? "bg-majolica text-paper" : "text-night/70"
                  }`}
                >
                  {t.trip.splitSingle}
                </button>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs pt-1">
            {costResult.payerSplit.shares.map((share, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-majolica/20 flex items-center justify-between"
              >
                <span className="text-night/80 font-medium">{share.label}</span>
                <span className="font-mono font-black text-sm text-night">
                  ${share.amountUsd}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="pt-4 text-center">
          <button
            type="button"
            onClick={handleOpenBooking}
            className="w-full sm:w-auto px-10 py-4 bg-brick hover:bg-brick/90 text-paper font-semibold text-base sm:text-lg rounded-2xl transition-all shadow-lg hover:shadow-brick/30 hover:scale-102 flex items-center justify-center gap-3 mx-auto"
          >
            <span>{t.trip.bookTripCta} (${costResult.totalCostUsd})</span>
          </button>
          <p className="text-[11px] text-night/50 mt-2 font-light">
            Мгновенное оформление · Персональный менеджер свяжется с вами в Telegram/WhatsApp
          </p>
        </div>
      </div>

      {/* Recalculate CTA Bar */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/constructor"
          className="bg-majolica hover:bg-majolica/90 text-paper font-bold px-7 py-3.5 rounded-xl transition-all shadow-md text-xs sm:text-sm tracking-wider hover:scale-102 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === "uz" ? "Parametrlarni o'zgartirish" : language === "en" ? "Edit Trip in Constructor" : "Изменить параметры в конструкторе"}</span>
        </Link>
        <SurvivalGuideModal />
      </div>

      {/* Booking Modals */}
      {plan && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          plan={plan}
        />
      )}

      {/* Guide Modals */}
      {selectedGuideForProfile && (
        <GuideProfileModal
          guide={selectedGuideForProfile}
          onClose={() => setSelectedGuideForProfile(null)}
          onBook={(g) => {
            setSelectedGuideForProfile(null);
            setSelectedGuideForBooking(g);
          }}
        />
      )}

      {selectedGuideForBooking && (
        <GuideBookingModal
          guide={selectedGuideForBooking}
          isOpen={true}
          onClose={() => setSelectedGuideForBooking(null)}
        />
      )}
    </div>
  );
}
