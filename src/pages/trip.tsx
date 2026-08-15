import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PayerSplitMode, TripPlan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { fetchWeatherForTrip, WeatherReport } from "@/lib/weather";
import WeatherWidget from "@/components/WeatherWidget";
import DayTimeline from "@/components/DayTimeline";
import SurvivalGuideModal from "@/components/SurvivalGuideModal";
import BookingModal from "@/components/BookingModal";
import { calculateTripCost } from "@/lib/costCalculator";
import { trackEvent } from "@/lib/analytics";
import ExperienceIcon from "@/components/common/ExperienceIcon";
import { Coins, Sparkles, Check, ShieldCheck, Users, Lightbulb, Car, Landmark } from "lucide-react";

import { TRIP_PRESETS } from "@/data/presets";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function TripPage() {
  const { t, language } = useTranslation();
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Cost Split Mode
  const [splitMode, setSplitMode] = useState<PayerSplitMode>("equal");

  useEffect(() => {
    const raw = sessionStorage.getItem("diyorai-trip");
    if (!raw) {
      // Fallback to signature Samarkand preset instead of blank redirect
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
    const region = plan.preferences.region === "tashkent_region" ? "tashkent" : plan.preferences.region;
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
        <h1 className="font-display text-3xl text-ink mb-4">{t.trip.notBuiltTitle}</h1>
        <p className="text-night/70 mb-8">{t.trip.notBuiltDesc}</p>
        <Link
          href="/"
          className="inline-block bg-clay text-plaster font-semibold px-6 py-3 rounded-lg hover:bg-clay/90 transition-colors"
        >
          {t.trip.backToForm}
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

  const handleOpenBooking = () => {
    trackEvent("booking_clicked", { destination: plan.preferences.region, totalCost: costResult.totalCostUsd });
    setIsBookingOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <p className="uppercase tracking-[0.2em] text-registan text-xs font-bold">
            {t.regions[plan.preferences.region]} · {totalDays} {t.trip.days} · {travelers.total} чел.
          </p>
          {duration.restDays > 0 && (
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              🌿 {duration.restDays} дн. отдыха
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 rounded-lg border border-sand bg-white hover:bg-sand/30 text-xs font-bold text-ink flex items-center gap-1.5 shadow-xs transition-colors"
            title="Экспорт в PDF для оффлайн использования в роуминге"
          >
            <span>📄</span> Экспорт в PDF / Печать
          </button>
          <button
            onClick={handleShareTelegram}
            className="px-3 py-1.5 rounded-lg border border-blue-400/40 bg-blue-50 hover:bg-blue-100 text-xs font-bold text-blue-700 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>✈️</span> В Telegram
          </button>
          <Link
            href="/"
            className="text-xs font-bold text-clay hover:underline uppercase tracking-wider ml-2"
          >
            ← {t.trip.recalculate}
          </Link>
        </div>
      </div>

      <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-4">
        {t.trip.title}: {t.regions[plan.preferences.region]}
      </h1>

      {/* Selected Logistics Overview Bar */}
      {(plan.transport || plan.transfer || plan.hotel) && (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-sand shadow-xs grid sm:grid-cols-3 gap-3 text-xs">
          {plan.transport && (
            <div className="p-3 bg-plaster/40 rounded-xl border border-sand/60">
              <span className="text-night/50 block text-[10px] uppercase font-bold">1. Транспорт</span>
              <p className="font-bold text-ink mt-0.5">
                {plan.transport.type === "flight"
                  ? `✈️ ${plan.transport.flight?.airline} (${plan.transport.flight?.flightNumber})`
                  : plan.transport.type === "train"
                  ? `🚆 ${plan.transport.train?.name}`
                  : "🚗 На автомобиле"}
              </p>
              <span className="text-[11px] text-night/70">
                ${plan.transport.totalCostUsd} ({plan.transport.passengers} пасс.)
              </span>
            </div>
          )}

          {plan.transfer && (
            <div className="p-3 bg-plaster/40 rounded-xl border border-sand/60">
              <span className="text-night/50 block text-[10px] uppercase font-bold">2. Трансфер</span>
              <p className="font-bold text-ink mt-0.5">
                🚕 {plan.transfer.vehicle.title}
              </p>
              <span className="text-[11px] text-night/70">
                ${plan.transfer.totalCostUsd} ({plan.transfer.numberOfCars} авто, {plan.transfer.isRoundTrip ? "в обе стороны" : "в одну сторону"})
              </span>
            </div>
          )}

          {plan.hotel && (
            <div className="p-3 bg-plaster/40 rounded-xl border border-sand/60">
              <span className="text-night/50 block text-[10px] uppercase font-bold">3. Отель</span>
              <p className="font-bold text-ink mt-0.5">
                🏨 {plan.hotel.hotel.name}
              </p>
              <span className="text-[11px] text-night/70">
                ${plan.hotel.totalCostUsd} ({plan.hotel.numberOfRooms} ном., {plan.hotel.nights} ноч.)
              </span>
            </div>
          )}
        </div>
      )}

      {/* Intercity train & transport tip */}
      {plan.intercityTip && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs sm:text-sm text-amber-950 leading-relaxed shadow-xs">
          <span className="text-xl shrink-0">🚆</span>
          <div>
            <p className="font-bold mb-0.5">Логистика путешествия</p>
            <p>{plan.intercityTip}</p>
          </div>
        </div>
      )}

      {/* Weather AI Advisor Widget */}
      <WeatherWidget weather={weather} loading={weatherLoading} />

      {allStops.length === 0 ? (
        <div className="border border-sand rounded-xl p-8 bg-white text-center">
          <p className="text-night/70">{t.trip.empty}</p>
        </div>
      ) : (
        <>
          {/* Interactive Map */}
          <MapView stops={allStops} />

          {/* Days Tabs */}
          <div className="flex items-center justify-between gap-4 mt-10 mb-6 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {plan.days.map((d) => (
                <button
                  key={d.dayNumber}
                  onClick={() => setActiveDay(d.dayNumber)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    activeDay === d.dayNumber
                      ? "bg-night text-paper border-night shadow-md scale-105"
                      : "border-majolica/30 hover:border-majolica bg-white text-night"
                  }`}
                >
                  {d.isRestDay ? <Sparkles className="w-3.5 h-3.5 text-majolica" /> : <Landmark className="w-3.5 h-3.5 text-majolica" />}
                  <span>{t.trip.day} {d.dayNumber}</span>
                  {d.isRestDay && <span className="text-[10px] opacity-80">(Отдых)</span>}
                </button>
              ))}
            </div>

            {currentDay.estimatedTotalKm && (
              <span className="text-xs font-mono text-night/70 font-semibold bg-paper px-3 py-1 rounded-full border border-sand flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-majolica" />
                <span>Маршрут дня: ~{currentDay.estimatedTotalKm} км</span>
              </span>
            )}
          </div>

          {/* Rest Day banner */}
          {currentDay.isRestDay && (
            <div className="mb-6 p-5 rounded-3xl bg-majolica/10 border border-majolica/30 flex items-start gap-4 text-night">
              <div className="w-12 h-12 rounded-2xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0">
                <Sparkles className="w-6 h-6 text-majolica" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-night">
                  {language === "uz" ? "Dam olish va erkin kun" : language === "en" ? "Rest & Relaxation Day" : "День разгрузки и отдыха"}
                </h3>
                <p className="text-xs text-night/70 mt-1 leading-relaxed font-light">
                  {currentDay.summary || "День без беготни: неспешный завтрак, дегустация узбекских сладостей, спа или чайхана в тени чинар."}
                </p>
              </div>
            </div>
          )}

          {/* Added Smart Experiences */}
          {plan.smartTrips && plan.smartTrips.length > 0 && (
            <div className="mb-8 p-6 rounded-3xl bg-paper/60 border border-sand shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-majolica" />
                  <h3 className="font-display font-bold text-night text-base sm:text-lg">
                    {language === "uz" ? "Qo'shilgan hamyonbop turlar (Smart Trips)" : language === "en" ? "Added Smart Local Experiences" : "Добавленные впечатления (Smart Trips)"}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-3 py-1 rounded-full">
                  {plan.smartTrips.length} {language === "uz" ? "ta tanlangan" : language === "en" ? "selected" : "выбрано"}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {plan.smartTrips.map((st) => (
                  <div key={st.id} className="p-4 rounded-2xl bg-white border border-sand flex items-center justify-between gap-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0">
                        <ExperienceIcon name={st.image} className="w-5 h-5 text-majolica" />
                      </div>
                      <div>
                        <span className="font-bold text-night block text-sm">{st.title[language] || st.title.ru}</span>
                        <span className="text-night/60 font-mono">📍 {st.destination} · ${st.pricePerAdult} / {t.trip.costPerPerson}</span>
                      </div>
                    </div>
                    <span className="text-majolica font-mono font-bold text-xs bg-majolica/15 px-2.5 py-1 rounded-md border border-majolica/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{language === "uz" ? "Qo'shildi" : language === "en" ? "Active" : "В плане"}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Climate Day Timeline */}
          <DayTimeline stops={currentDay.stops} dayNumber={activeDay} />

          {/* Remaining Budget Recommendations */}
          {costResult.budgetRemainingUsd > 15 && costResult.budgetRemainingUsd !== Infinity && (
            <div className="mt-8 p-6 rounded-3xl bg-majolica/10 border border-majolica/30 text-night space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-majolica" />
                  <h4 className="font-display font-bold text-base">
                    {language === "uz"
                      ? `Sizda $${costResult.budgetRemainingUsd} qoldiq mavjud — sayohatingizni boyiting`
                      : language === "en"
                      ? `You have $${costResult.budgetRemainingUsd} left — make the most of your budget`
                      : `У вас осталось $${costResult.budgetRemainingUsd} в бюджете — дополните поездку`}
                  </h4>
                </div>
                <Link
                  href="/#smart-trips"
                  className="px-4 py-2 rounded-xl bg-majolica hover:bg-majolica/90 text-paper font-bold text-xs shadow-xs transition-all"
                >
                  {language === "uz" ? "Smart Trips katalogi →" : language === "en" ? "Explore Smart Trips →" : "Выбрать впечатления →"}
                </Link>
              </div>
              <p className="text-xs text-night/75 font-light">
                {language === "uz"
                  ? "Qoldiq byudjetingizga Chorvoq bo'ylab katerda sayr, So'qoq tog' oshi yoki Toshkent shahar sayrini qo'shishingiz mumkin."
                  : language === "en"
                  ? "You can easily add a Charvak boat ride, Sukok kebab experience, or Old Tashkent walking tour within this remaining amount."
                  : "На эту сумму можно добавить катер по Чарваку, обед в Сукоке или авторскую пешую прогулку по Ташкенту."}
              </p>
            </div>
          )}
          <div className="mt-12 bg-white rounded-3xl border border-sand p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-sand">
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

            {/* Service-by-service breakdown grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-4 bg-paper rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costTransport}:</span>
                <span className="font-mono font-black text-xl text-night">
                  ${costResult.breakdown.transport}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  {plan.transport ? `${plan.transport.type}` : ""}
                </span>
              </div>

              <div className="p-4 bg-paper rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costTransfer}:</span>
                <span className="font-mono font-black text-xl text-night">
                  ${costResult.breakdown.transfer}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  {plan.transfer ? `${plan.transfer.vehicle.title}` : ""}
                </span>
              </div>

              <div className="p-4 bg-paper rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costHotel}:</span>
                <span className="font-mono font-black text-xl text-night">
                  ${costResult.breakdown.hotel}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  {plan.hotel ? `${plan.hotel.nights} ${t.planner.nightsCount}, ${plan.hotel.numberOfRooms}` : ""}
                </span>
              </div>

              <div className="p-4 bg-paper rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costActivitiesFood}:</span>
                <span className="font-mono font-black text-xl text-night">
                  ${costResult.breakdown.activitiesAndFood + costResult.breakdown.other}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  ~${Math.round((costResult.breakdown.activitiesAndFood) / totalDays)}/{t.trip.day}
                </span>
              </div>
            </div>

            {/* Total Summary Row */}
            <div className="p-5 bg-paper/80 rounded-2xl border border-sand flex items-center justify-between gap-4 flex-wrap">
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

            {/* 4. КАЛЬКУЛЯТОР "КТО СКОЛЬКО ПЛАТИТ" */}
            <div className="p-5 bg-paper/50 rounded-2xl border border-sand space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-night uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-majolica" />
                  <span>{t.trip.payerSplitTitle}</span>
                </span>

                {travelers.type === "couple" && (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-sand text-xs font-mono">
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
                    className="p-3 bg-white rounded-xl border border-sand flex items-center justify-between"
                  >
                    <span className="text-night/80 font-medium">{share.label}</span>
                    <span className="font-mono font-black text-sm text-night">
                      ${share.amountUsd}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings suggestions if over budget */}
            {costResult.isOverBudget && costResult.savingTips.length > 0 && (
              <div className="p-4 bg-gold/10 border border-gold/30 rounded-2xl text-xs text-night space-y-1.5">
                <p className="font-bold flex items-center gap-1.5 text-gold font-mono">
                  <Lightbulb className="w-4 h-4 text-gold" />
                  <span>{t.planner.budgetTipPrefix}:</span>
                </p>
                {costResult.savingTips.map((tip, i) => (
                  <p key={i} className="leading-relaxed pl-2 font-light">
                    • {tip}
                  </p>
                ))}
              </div>
            )}

            {/* ========================================================
               20. КНОПКА "ЗАБРОНИРОВАТЬ" (ГЛАВНАЯ CTA - 1 FOCAL НА ЭКРАН)
               ======================================================== */}
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

          {/* Solo traveler recommendation */}
          {plan.preferences.soloTraveler && (
            <div className="mt-8 border border-majolica/30 bg-majolica/10 rounded-2xl p-5 text-sm text-night flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-majolica shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1 text-night">Режим соло-путешественника (Безопасность)</p>
                <p className="text-xs sm:text-sm text-night/80 leading-relaxed font-light">
                  {t.trip.soloNotice}{" "}
                  <Link
                    href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
                    className="text-majolica font-bold hover:underline"
                  >
                    {t.trip.findGuidesForRoute} →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Guide matcher CTA: Primary vs Secondary */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
              className="bg-majolica hover:bg-majolica/90 text-paper font-bold px-7 py-3.5 rounded-xl transition-all shadow-md text-xs sm:text-sm tracking-wider hover:scale-102"
            >
              {t.trip.findGuidesForRoute}
            </Link>
            <Link
              href="/"
              className="border border-majolica/40 bg-paper px-7 py-3.5 rounded-xl text-night font-semibold hover:bg-majolica/10 transition-colors text-xs sm:text-sm"
            >
              {t.trip.recalculate}
            </Link>
          </div>

          {/* Survival Guide Modal Button */}
          <div className="mt-8">
            <SurvivalGuideModal />
          </div>
        </>
      )}

      {/* Booking Modal */}
      {plan && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          plan={plan}
        />
      )}
    </div>
  );
}
