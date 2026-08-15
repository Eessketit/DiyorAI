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
      setNotFound(true);
      return;
    }
    try {
      const parsedPlan: TripPlan = JSON.parse(raw);
      setPlan(parsedPlan);
      if (parsedPlan.preferences.travelers?.type === "family") {
        setSplitMode("family_share");
      }
    } catch {
      setNotFound(true);
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                    activeDay === d.dayNumber
                      ? "bg-ink text-plaster border-ink shadow-md scale-105"
                      : "border-sand hover:border-ink bg-white text-ink"
                  }`}
                >
                  {d.isRestDay ? "🌿" : "🏛️"} {t.trip.day} {d.dayNumber}
                  {d.isRestDay && <span className="text-[10px] opacity-80">(Отдых)</span>}
                </button>
              ))}
            </div>

            {currentDay.estimatedTotalKm && (
              <span className="text-xs text-night/60 font-semibold bg-sand/30 px-3 py-1 rounded-full border border-sand">
                🚗 Маршрут дня: ~{currentDay.estimatedTotalKm} км
              </span>
            )}
          </div>

          {/* Rest Day Highlight Banner */}
          {currentDay.isRestDay && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-4 shadow-sm">
              <span className="text-3xl shrink-0">🌿</span>
              <div>
                <h3 className="font-display font-bold text-base text-emerald-900">
                  {currentDay.title || "🌿 REST DAY — День отдыха и гастрономического релакса"}
                </h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  {currentDay.summary || "День без беготни: неспешный завтрак, дегустация узбекских сладостей, спа или чайхана в тени чинар."}
                </p>
              </div>
            </div>
          )}

          {/* Smart Climate Day Timeline */}
          <DayTimeline stops={currentDay.stops} dayNumber={activeDay} />

          {/* ========================================================
             19. ИТОГОВЫЙ ФИНАНСОВЫЙ БЛОК & КАЛЬКУЛЯТОР СПЛИТА
             ======================================================== */}
          <div className="mt-12 bg-white rounded-3xl border border-sand p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-sand">
              <div>
                <span className="text-xs uppercase tracking-wider text-registan font-bold block">
                  💰 {t.trip.financialSummary}
                </span>
                <h2 className="text-2xl font-display font-bold text-ink">
                  {t.planner.stepBudget}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-night/50 font-semibold block">{t.trip.costTotal}:</span>
                <span className="font-display font-black text-2xl sm:text-3xl text-emerald-800">
                  ${costResult.totalCostUsd}
                </span>
              </div>
            </div>

            {/* Service-by-service breakdown grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-plaster/40 rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costTransport}:</span>
                <span className="font-display font-black text-xl text-ink">
                  ${costResult.breakdown.transport}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  {plan.transport ? `${plan.transport.type}` : ""}
                </span>
              </div>

              <div className="p-4 bg-plaster/40 rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costTransfer}:</span>
                <span className="font-display font-black text-xl text-ink">
                  ${costResult.breakdown.transfer}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  {plan.transfer ? `${plan.transfer.vehicle.title}` : ""}
                </span>
              </div>

              <div className="p-4 bg-plaster/40 rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costHotel}:</span>
                <span className="font-display font-black text-xl text-ink">
                  ${costResult.breakdown.hotel}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  {plan.hotel ? `${plan.hotel.nights} ${t.planner.nightsCount}, ${plan.hotel.numberOfRooms}` : ""}
                </span>
              </div>

              <div className="p-4 bg-plaster/40 rounded-2xl border border-sand">
                <span className="text-night/50 block">{t.trip.costActivitiesFood}:</span>
                <span className="font-display font-black text-xl text-ink">
                  ${costResult.breakdown.activitiesAndFood + costResult.breakdown.other}
                </span>
                <span className="text-[10px] text-night/60 block mt-0.5">
                  ~${Math.round((costResult.breakdown.activitiesAndFood) / totalDays)}/{t.trip.day}
                </span>
              </div>
            </div>

            {/* Total Summary Row */}
            <div className="p-5 bg-sand/30 rounded-2xl border border-sand flex items-center justify-between gap-4 flex-wrap">
              <div>
                <span className="text-xs text-night/60 block font-semibold">
                  {t.trip.costTotal}:
                </span>
                <span className="font-display font-black text-3xl sm:text-4xl text-ink">
                  ${costResult.totalCostUsd}
                </span>
                <span className="text-xs text-night/70 block mt-1">
                  {costResult.budgetMaxUsd === Infinity ? t.planner.unlimited : `${t.planner.budgetLimitLabel}: $${costResult.budgetMaxUsd}`}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-night/60 block font-semibold">
                  {t.trip.costPerPerson}:
                </span>
                <span className="font-display font-black text-2xl text-registan">
                  ~${costResult.costPerPersonUsd}
                </span>
                <span className="text-xs text-night/70 block mt-0.5">
                  {travelers.total} {t.booking.travelersLabel}
                </span>
              </div>
            </div>

            {/* 4. КАЛЬКУЛЯТОР "КТО СКОЛЬКО ПЛАТИТ" */}
            <div className="p-5 bg-plaster/30 rounded-2xl border border-sand space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-ink uppercase tracking-wider">
                  👥 {t.trip.payerSplitTitle}
                </span>

                {travelers.type === "couple" && (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-sand text-xs">
                    <button
                      onClick={() => setSplitMode("equal")}
                      className={`px-2.5 py-1 rounded font-semibold ${
                        splitMode === "equal" ? "bg-registan text-plaster" : "text-night/70"
                      }`}
                    >
                      {t.trip.splitEqual}
                    </button>
                    <button
                      onClick={() => setSplitMode("single_payer")}
                      className={`px-2.5 py-1 rounded font-semibold ${
                        splitMode === "single_payer" ? "bg-registan text-plaster" : "text-night/70"
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
                    <span className="font-display font-black text-sm text-ink">
                      ${share.amountUsd}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings suggestions if over budget */}
            {costResult.isOverBudget && costResult.savingTips.length > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-950 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <span>💡</span> {t.planner.budgetTipPrefix}:
                </p>
                {costResult.savingTips.map((tip, i) => (
                  <p key={i} className="leading-relaxed pl-2">
                    • {tip}
                  </p>
                ))}
              </div>
            )}

            {/* ========================================================
               20. КНОПКА "ЗАБРОНИРОВАТЬ" (ГЛАВНАЯ CTA)
               ======================================================== */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleOpenBooking}
                className="w-full sm:w-auto px-10 py-4 bg-clay hover:bg-clay/90 text-plaster font-bold text-base sm:text-lg rounded-2xl transition-all shadow-lg hover:shadow-xl uppercase tracking-wider flex items-center justify-center gap-3 mx-auto"
              >
                <span>{t.trip.bookTripCta} (${costResult.totalCostUsd})</span>
              </button>
              <p className="text-[11px] text-night/50 mt-2">
                Мгновенное оформление · Персональный менеджер свяжется с вами в Telegram/WhatsApp
              </p>
            </div>
          </div>

          {/* Solo traveler recommendation */}
          {plan.preferences.soloTraveler && (
            <div className="mt-8 border border-registan/40 bg-registan/10 rounded-2xl p-5 text-sm text-ink flex items-start gap-3">
              <span className="text-2xl shrink-0">🛡️</span>
              <div>
                <p className="font-bold mb-1 text-ink">Режим соло-путешественника (Безопасность)</p>
                <p className="text-xs sm:text-sm text-night/80 leading-relaxed">
                  {t.trip.soloNotice}{" "}
                  <Link
                    href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
                    className="text-registan font-bold hover:underline"
                  >
                    {t.trip.findGuidesForRoute} →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Guide matcher CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
              className="bg-ink text-plaster font-bold px-7 py-3.5 rounded-xl hover:bg-ink/90 transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider"
            >
              {t.trip.findGuidesForRoute}
            </Link>
            <Link
              href="/"
              className="border border-sand bg-white px-7 py-3.5 rounded-xl text-ink font-semibold hover:border-ink transition-colors text-xs sm:text-sm"
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
