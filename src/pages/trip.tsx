import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TripPlan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { fetchWeatherForTrip, WeatherReport } from "@/lib/weather";
import WeatherWidget from "@/components/WeatherWidget";
import DayTimeline from "@/components/DayTimeline";
import SurvivalGuideModal from "@/components/SurvivalGuideModal";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function TripPage() {
  const { t, language } = useTranslation();
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("diyorai-trip");
    if (!raw) {
      setNotFound(true);
      return;
    }
    const parsedPlan: TripPlan = JSON.parse(raw);
    setPlan(parsedPlan);
  }, []);

  useEffect(() => {
    if (!plan) return;
    setWeatherLoading(true);
    fetchWeatherForTrip(plan.preferences.region, plan.preferences.days, language)
      .then(setWeather)
      .finally(() => setWeatherLoading(false));
  }, [plan, language]);

  const handleExportPdf = () => {
    window.print();
  };

  const handleShareTelegram = () => {
    if (!plan) return;
    const text = encodeURIComponent(
      `🏛️ Мой туристический маршрут DiyorAI по Узбекистану (${t.regions[plan.preferences.region]}, ${plan.preferences.days} дн.)!\nСпланируйте свой на https://diyorai.eessketit.uz`
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

  const allStops = plan.days.flatMap((d) =>
    d.stops.map((s, idx) => ({ ...s, order: idx + 1, dayNumber: d.dayNumber }))
  );
  const currentDay = plan.days.find((d) => d.dayNumber === activeDay) ?? plan.days[0];
  const interestsQuery = plan.preferences.interests.join(",");

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
        <p className="uppercase tracking-[0.2em] text-registan text-xs font-bold">
          {t.regions[plan.preferences.region]} · {plan.preferences.days} {t.trip.days}
        </p>

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

      <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-6">{t.trip.title}</h1>

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
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                    activeDay === d.dayNumber
                      ? "bg-ink text-plaster border-ink shadow-md scale-105"
                      : "border-sand hover:border-ink bg-white text-ink"
                  }`}
                >
                  {t.trip.day} {d.dayNumber}
                </button>
              ))}
            </div>

            {currentDay.estimatedTotalKm && (
              <span className="text-xs text-night/60 font-semibold bg-sand/30 px-3 py-1 rounded-full border border-sand">
                🚗 Дистанция дня: ~{currentDay.estimatedTotalKm} км
              </span>
            )}
          </div>

          {/* Smart Climate Day Timeline */}
          <DayTimeline stops={currentDay.stops} dayNumber={activeDay} />

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

          {/* Action buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
              className="bg-ink text-plaster font-bold px-7 py-4 rounded-xl hover:bg-ink/90 transition-all shadow-md text-sm uppercase tracking-wider"
            >
              {t.trip.findGuidesForRoute}
            </Link>
            <Link
              href="/"
              className="border border-sand bg-white px-7 py-4 rounded-xl text-ink font-semibold hover:border-ink transition-colors text-sm"
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
    </div>
  );
}
