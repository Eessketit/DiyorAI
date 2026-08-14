import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TripPlan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { fetchWeatherForTrip, WeatherReport } from "@/lib/weather";
import WeatherWidget from "@/components/WeatherWidget";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function TripPage() {
  const { t, language } = useTranslation();
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("diyorai-trip") || sessionStorage.getItem("yoldosh-trip");
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
      <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
        <p className="uppercase tracking-[0.2em] text-registan text-xs font-semibold">
          {t.regions[plan.preferences.region]} · {plan.preferences.days} {t.trip.days}
        </p>
        <Link
          href="/"
          className="text-xs font-semibold text-clay hover:underline uppercase tracking-wider"
        >
          ← {t.trip.recalculate}
        </Link>
      </div>

      <h1 className="font-display text-4xl text-ink mb-6">{t.trip.title}</h1>

      {/* Weather AI Advisor Widget */}
      <WeatherWidget weather={weather} loading={weatherLoading} />

      {allStops.length === 0 ? (
        <div className="border border-sand rounded-xl p-8 bg-white">
          <p className="text-night/70">{t.trip.empty}</p>
        </div>
      ) : (
        <>
          <MapView stops={allStops} />

          <div className="flex gap-2 mt-8 mb-6 flex-wrap">
            {plan.days.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setActiveDay(d.dayNumber)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeDay === d.dayNumber
                    ? "bg-ink text-plaster border-ink shadow-xs"
                    : "border-sand hover:border-ink bg-white text-ink"
                }`}
              >
                {t.trip.day} {d.dayNumber}
              </button>
            ))}
          </div>

          <ol className="space-y-4">
            {currentDay.stops.map((stop, idx) => (
              <li
                key={stop.id}
                className="flex gap-4 bg-white border border-sand rounded-xl p-5 shadow-xs hover:border-sand/90 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-clay text-plaster flex items-center justify-center font-semibold shrink-0 text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h3 className="font-display text-xl text-ink">{stop.name}</h3>
                    <Link
                      href={`/verify?objectId=${stop.id}`}
                      className="text-sm text-registan font-medium hover:underline shrink-0"
                    >
                      {t.trip.verifyFacts}
                    </Link>
                  </div>
                  <p className="text-night/70 mt-1 text-sm leading-relaxed">{stop.description}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {stop.categories.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-full bg-plaster border border-sand text-ink font-medium"
                      >
                        {t.categories[c]}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {plan.preferences.soloTraveler && (
            <div className="mt-8 border border-registan/40 bg-registan/10 rounded-xl p-5 text-sm text-ink flex items-start gap-3">
              <span className="text-xl shrink-0">🛡️</span>
              <div>
                <p className="font-semibold mb-1 text-ink">{t.home.soloTraveler}</p>
                <p className="text-night/80">
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

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/guides?region=${plan.preferences.region}&interests=${interestsQuery}`}
              className="bg-ink text-plaster font-semibold px-6 py-3.5 rounded-lg hover:bg-ink/90 transition-colors shadow-xs"
            >
              {t.trip.findGuidesForRoute}
            </Link>
            <Link
              href="/"
              className="border border-sand bg-white px-6 py-3.5 rounded-lg text-ink hover:border-ink transition-colors"
            >
              {t.trip.recalculate}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
