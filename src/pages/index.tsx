import { useRouter } from "next/router";
import { useState } from "react";
import InterestChips from "@/components/InterestChips";
import TilePattern from "@/components/TilePattern";
import PresetCards from "@/components/PresetCards";
import SurvivalGuideModal from "@/components/SurvivalGuideModal";
import {
  BUDGET_LABELS,
  Budget,
  Category,
  GROUP_LABELS,
  GroupType,
  Pace,
  Region,
  TripPlan,
} from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const REGIONS: Region[] = ["samarkand", "bukhara", "khiva", "tashkent"];
const PACES: Pace[] = ["relaxed", "balanced", "packed"];
const GROUPS: GroupType[] = ["solo", "couple", "family", "friends"];
const BUDGETS: Budget[] = ["budget", "medium", "luxury"];

export default function Home() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const [region, setRegion] = useState<Region>("samarkand");
  const [interests, setInterests] = useState<Category[]>([
    "history",
    "architecture",
    "gastronomy",
  ]);
  const [days, setDays] = useState(3);
  const [pace, setPace] = useState<Pace>("balanced");
  const [groupType, setGroupType] = useState<GroupType>("couple");
  const [budget, setBudget] = useState<Budget>("medium");
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
        body: JSON.stringify({
          region,
          interests,
          days,
          pace,
          groupType,
          budget,
          soloTraveler: groupType === "solo",
        }),
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

  const groupLabelText = {
    ru: "Кто путешествует?",
    uz: "Kim bilan sayohat qilasiz?",
    en: "Who is traveling?",
  };

  const budgetLabelText = {
    ru: "Формат бюджета",
    uz: "Byudjet formati",
    en: "Budget Preference",
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink text-plaster">
        <TilePattern className="absolute -right-10 -top-10 w-72 h-72 text-plaster/10 pointer-events-none" />
        <TilePattern className="absolute -left-16 bottom-0 w-56 h-56 text-plaster/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-20 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-registan/20 border border-registan/40 text-registan text-xs font-semibold uppercase tracking-wider mb-4">
            <span>🏛️</span> {t.home.badge}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.08] max-w-2xl">
            {t.home.title}
          </h1>
          <p className="mt-6 text-plaster/85 max-w-xl text-base sm:text-lg leading-relaxed">
            {t.home.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-4xl mx-auto px-6 -mt-10 relative space-y-10">
        {/* Preset Cards (1-Click Launch) */}
        <div className="bg-white/95 backdrop-blur border border-sand rounded-3xl p-6 sm:p-8 shadow-xl shadow-ink/5">
          <PresetCards />

          {/* Interactive Onboarding Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-sand/70 pt-8 mt-8 space-y-8"
          >
            <div className="text-center sm:text-left mb-4">
              <h2 className="font-display text-2xl font-bold text-ink mb-1">
                🛠️ Индивидуальный конструктор поездки
              </h2>
              <p className="text-xs text-night/70">
                Настройте детали маршрута с учетом состава группы, бюджета и темпа
              </p>
            </div>

            {/* Region Selection */}
            <div>
              <label className="block font-display text-base sm:text-lg text-ink mb-3 font-bold">
                {t.home.whereTo}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegion(r)}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      region === r
                        ? "bg-registan text-plaster border-registan shadow-sm scale-[1.02]"
                        : "border-sand hover:border-registan text-ink bg-plaster/30 hover:bg-white"
                    }`}
                  >
                    {t.regions[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests Chips */}
            <div>
              <label className="block font-display text-base sm:text-lg text-ink mb-3 font-bold">
                {t.home.whatInterests}
              </label>
              <InterestChips selected={interests} onChange={setInterests} />
            </div>

            {/* Group Type & Budget */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-display text-base sm:text-lg text-ink mb-3 font-bold">
                  {groupLabelText[language]}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GROUPS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGroupType(g)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                        groupType === g
                          ? "bg-clay text-plaster border-clay shadow-xs"
                          : "border-sand bg-plaster/30 text-ink hover:border-clay"
                      }`}
                    >
                      {GROUP_LABELS[g]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-display text-base sm:text-lg text-ink mb-3 font-bold">
                  {budgetLabelText[language]}
                </label>
                <div className="space-y-1.5">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBudget(b)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${
                        budget === b
                          ? "bg-ink text-plaster border-ink shadow-xs"
                          : "border-sand bg-plaster/30 text-ink hover:border-ink"
                      }`}
                    >
                      {BUDGET_LABELS[b]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Days & Pace */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-display text-base sm:text-lg text-ink mb-3 font-bold" htmlFor="days">
                  {t.home.howManyDays}
                </label>
                <input
                  id="days"
                  type="number"
                  min={1}
                  max={7}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-plaster/40 focus:bg-white focus:outline-none focus:border-clay text-ink font-medium"
                />
              </div>
              <div>
                <label className="block font-display text-base sm:text-lg text-ink mb-3 font-bold" htmlFor="pace">
                  {t.home.pace}
                </label>
                <select
                  id="pace"
                  value={pace}
                  onChange={(e) => setPace(e.target.value as Pace)}
                  className="w-full px-4 py-3 rounded-xl border border-sand bg-plaster/40 focus:bg-white focus:outline-none focus:border-clay text-ink font-medium"
                >
                  {PACES.map((p) => (
                    <option key={p} value={p}>
                      {t.paces[p]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-trust-low text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-clay hover:bg-clay/90 disabled:opacity-60 text-plaster font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-base uppercase tracking-wider"
            >
              {loading ? t.home.building : t.home.buildTrip}
            </button>
          </form>
        </div>

        {/* Survival Guide Modal */}
        <SurvivalGuideModal />
      </section>

      {/* Features summary */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-6 text-sm text-night/70">
        <div className="bg-white/70 p-6 rounded-2xl border border-sand shadow-xs">
          <span className="text-2xl mb-2 block">🗺️</span>
          <p className="font-display text-ink text-base font-bold mb-1.5">{t.home.features.routeTitle}</p>
          <p className="leading-relaxed text-xs">{t.home.features.routeDesc}</p>
        </div>
        <div className="bg-white/70 p-6 rounded-2xl border border-sand shadow-xs">
          <span className="text-2xl mb-2 block">🎙️</span>
          <p className="font-display text-ink text-base font-bold mb-1.5">{t.home.features.verifyTitle}</p>
          <p className="leading-relaxed text-xs">{t.home.features.verifyDesc}</p>
        </div>
        <div className="bg-white/70 p-6 rounded-2xl border border-sand shadow-xs">
          <span className="text-2xl mb-2 block">🤝</span>
          <p className="font-display text-ink text-base font-bold mb-1.5">{t.home.features.guidesTitle}</p>
          <p className="leading-relaxed text-xs">{t.home.features.guidesDesc}</p>
        </div>
      </section>
    </div>
  );
}
