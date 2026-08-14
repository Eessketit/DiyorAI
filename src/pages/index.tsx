import { useRouter } from "next/router";
import { useState } from "react";
import InterestChips from "@/components/InterestChips";
import TilePattern from "@/components/TilePattern";
import { Category, Pace, Region, TripPlan } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const REGIONS: Region[] = ["samarkand", "bukhara", "khiva", "tashkent"];
const PACES: Pace[] = ["relaxed", "balanced", "packed"];

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  const [region, setRegion] = useState<Region>("samarkand");
  const [interests, setInterests] = useState<Category[]>(["history", "architecture"]);
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState<Pace>("balanced");
  const [solo, setSolo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (interests.length === 0) {
      setError(t.home.selectAtLeastOne);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/plan-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, interests, days, pace, soloTraveler: solo }),
      });
      if (!res.ok) throw new Error("API error");
      const plan: TripPlan = await res.json();
      sessionStorage.setItem("diyorai-trip", JSON.stringify(plan));
      router.push("/trip");
    } catch {
      setError(t.home.buildError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-plaster">
        <TilePattern className="absolute -right-10 -top-10 w-72 h-72 text-plaster/10 pointer-events-none" />
        <TilePattern className="absolute -left-16 bottom-0 w-56 h-56 text-plaster/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-20 relative">
          <p className="uppercase tracking-[0.2em] text-registan text-xs font-semibold mb-4">
            {t.home.badge}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] max-w-2xl">
            {t.home.title}
          </h1>
          <p className="mt-6 text-plaster/85 max-w-xl text-base sm:text-lg leading-relaxed">
            {t.home.subtitle}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 -mt-10 relative">
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur border border-sand rounded-2xl shadow-xl shadow-ink/5 p-6 sm:p-8 space-y-8"
        >
          <div>
            <label className="block font-display text-lg text-ink mb-3">{t.home.whereTo}</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    region === r
                      ? "bg-registan text-plaster border-registan shadow-xs"
                      : "border-sand hover:border-registan text-ink"
                  }`}
                >
                  {t.regions[r]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-display text-lg text-ink mb-3">{t.home.whatInterests}</label>
            <InterestChips selected={interests} onChange={setInterests} />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-display text-lg text-ink mb-3" htmlFor="days">
                {t.home.howManyDays}
              </label>
              <input
                id="days"
                type="number"
                min={1}
                max={7}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-sand bg-plaster/40 focus:bg-white focus:outline-none focus:border-clay text-ink"
              />
            </div>
            <div>
              <label className="block font-display text-lg text-ink mb-3" htmlFor="pace">
                {t.home.pace}
              </label>
              <select
                id="pace"
                value={pace}
                onChange={(e) => setPace(e.target.value as Pace)}
                className="w-full px-4 py-3 rounded-lg border border-sand bg-plaster/40 focus:bg-white focus:outline-none focus:border-clay text-ink"
              >
                {PACES.map((p) => (
                  <option key={p} value={p}>
                    {t.paces[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={solo}
              onChange={(e) => setSolo(e.target.checked)}
              className="w-5 h-5 accent-clay cursor-pointer"
            />
            <span className="text-ink text-sm sm:text-base font-medium">{t.home.soloTraveler}</span>
          </label>

          {error && <p className="text-trust-low text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-clay hover:bg-clay/90 disabled:opacity-60 text-plaster font-semibold py-4 rounded-lg transition-all shadow-sm hover:shadow text-base"
          >
            {loading ? t.home.building : t.home.buildTrip}
          </button>
        </form>
      </section>

      {/* Features summary */}
      <section className="max-w-3xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-6 text-sm text-night/70">
        <div className="bg-white/60 p-5 rounded-xl border border-sand">
          <p className="font-display text-ink text-base mb-1.5">{t.home.features.routeTitle}</p>
          <p className="leading-relaxed">{t.home.features.routeDesc}</p>
        </div>
        <div className="bg-white/60 p-5 rounded-xl border border-sand">
          <p className="font-display text-ink text-base mb-1.5">{t.home.features.verifyTitle}</p>
          <p className="leading-relaxed">{t.home.features.verifyDesc}</p>
        </div>
        <div className="bg-white/60 p-5 rounded-xl border border-sand">
          <p className="font-display text-ink text-base mb-1.5">{t.home.features.guidesTitle}</p>
          <p className="leading-relaxed">{t.home.features.guidesDesc}</p>
        </div>
      </section>
    </div>
  );
}
