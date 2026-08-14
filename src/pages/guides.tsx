import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Category, Guide, Region } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

const REGIONS: Region[] = ["samarkand", "bukhara", "khiva", "tashkent"];
const CATEGORIES: Category[] = ["history", "architecture", "pilgrimage", "nature", "gastronomy"];

export default function GuidesPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [region, setRegion] = useState<Region>("samarkand");
  const [interests, setInterests] = useState<Category[]>([]);
  const [guides, setGuides] = useState<(Guide & { matchScore: number })[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const qRegion = router.query.region;
    const qInterests = router.query.interests;
    if (typeof qRegion === "string" && REGIONS.includes(qRegion as Region)) {
      setRegion(qRegion as Region);
    }
    if (typeof qInterests === "string" && qInterests.length > 0) {
      setInterests(qInterests.split(",") as Category[]);
    }
    setReady(true);
  }, [router.isReady, router.query.region, router.query.interests]);

  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams({ region, interests: interests.join(",") });
    fetch(`/api/guides?${params.toString()}`)
      .then((r) => r.json())
      .then(setGuides);
  }, [ready, region, interests]);

  function toggleInterest(cat: Category) {
    setInterests((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <p className="uppercase tracking-[0.2em] text-registan text-xs font-semibold mb-2">
        {t.guides.badge}
      </p>
      <h1 className="font-display text-4xl text-ink mb-3">{t.guides.title}</h1>
      <p className="text-night/70 mb-8 leading-relaxed">{t.guides.subtitle}</p>

      <div className="bg-white border border-sand rounded-2xl p-6 mb-8 space-y-5 shadow-sm">
        <div>
          <p className="font-medium text-ink mb-2">{t.guides.regionFilter}</p>
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
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
          <p className="font-medium text-ink mb-2">{t.guides.specFilter}</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => toggleInterest(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  interests.includes(c)
                    ? "bg-clay text-plaster border-clay shadow-xs"
                    : "border-sand hover:border-clay text-ink"
                }`}
              >
                {t.categories[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {guides.length === 0 ? (
        <div className="border border-sand bg-white rounded-xl p-8 text-center">
          <p className="text-night/60">{t.guides.empty}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {guides.map((g) => (
            <li
              key={g.id}
              className="bg-white border border-sand rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap shadow-xs hover:border-sand/90 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-xl text-ink">{g.name}</h3>
                  {g.isDemoData && (
                    <span className="text-[10px] uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-sand/60 text-night/60 font-medium">
                      {t.guides.demoBadge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-night/60 mt-1">
                  {t.regions[g.region]} · {g.languages.join(", ").toUpperCase()} · {g.priceRange}
                </p>
                <div className="flex gap-2 mt-2.5 flex-wrap">
                  {g.specializationTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-plaster border border-sand text-ink font-medium"
                    >
                      {t.categories[tag]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display text-2xl text-clay font-bold">{g.rating.toFixed(1)}</p>
                <p className="text-xs text-night/50 uppercase tracking-wider">{t.guides.rating}</p>
                <p className="text-xs text-registan font-semibold mt-1">
                  {Math.round(g.matchScore * 100)}% {t.guides.match}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
