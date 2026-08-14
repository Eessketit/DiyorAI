import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ObjectFact, TourismObject, TrustLevel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface VerifyResult {
  objectId: string;
  query: string | null;
  status: "matched" | "no-match" | "listed";
  results: (ObjectFact & { matchScore: number })[];
}

const TRUST_CLASS: Record<TrustLevel, string> = {
  high: "bg-trust-high/10 text-trust-high border-trust-high/30",
  medium: "bg-trust-medium/10 text-trust-medium border-trust-medium/30",
  low: "bg-trust-low/10 text-trust-low border-trust-low/30",
};

export default function VerifyPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const [objects, setObjects] = useState<TourismObject[]>([]);
  const [objectId, setObjectId] = useState<string>("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/objects")
      .then((r) => r.json())
      .then((data: TourismObject[]) => {
        setObjects(data);
        const preselect = router.query.objectId;
        if (typeof preselect === "string") {
          setObjectId(preselect);
        } else if (data.length > 0) {
          setObjectId(data[0].id);
        }
      });
  }, [router.query.objectId]);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!objectId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectId, query }),
      });
      const data: VerifyResult = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  const selectedObject = objects.find((o) => o.id === objectId);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="uppercase tracking-[0.2em] text-registan text-xs font-semibold mb-2">
        {t.verify.badge}
      </p>
      <h1 className="font-display text-4xl text-ink mb-3">{t.verify.title}</h1>
      <p className="text-night/70 mb-8 leading-relaxed">{t.verify.subtitle}</p>

      <form
        onSubmit={handleCheck}
        className="bg-white border border-sand rounded-2xl p-6 space-y-5 shadow-sm"
      >
        <div>
          <label htmlFor="object" className="block font-medium text-ink mb-2">
            {t.verify.objectLabel}
          </label>
          <select
            id="object"
            value={objectId}
            onChange={(e) => setObjectId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-sand bg-plaster/30 focus:bg-white focus:outline-none focus:border-clay text-ink"
          >
            {objects.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {t.regions[o.region]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="query" className="block font-medium text-ink mb-2">
            {t.verify.queryLabel}
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            placeholder={t.verify.placeholder}
            className="w-full px-4 py-3 rounded-lg border border-sand bg-plaster/30 focus:bg-white focus:outline-none focus:border-clay text-ink"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !objectId}
          className="bg-clay hover:bg-clay/90 disabled:opacity-60 text-plaster font-semibold px-6 py-3 rounded-lg transition-colors shadow-xs"
        >
          {loading ? t.verify.checking : t.verify.button}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          {result.status === "no-match" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4 text-amber-900 text-sm">
              <p className="font-medium">{t.verify.noMatchTitle}</p>
            </div>
          )}
          {result.status === "listed" && (
            <p className="text-night/70 mb-4 font-medium">
              {t.verify.listedTitle} «{selectedObject?.name}»
            </p>
          )}
          {result.status === "matched" && (
            <div className="bg-trust-high/10 border border-trust-high/30 rounded-xl p-4 mb-4 text-trust-high text-sm">
              <p className="font-bold">{t.verify.matchedTitle}</p>
            </div>
          )}

          <ul className="space-y-3">
            {result.results.map((fact) => (
              <li
                key={fact.id}
                className="bg-white border border-sand rounded-xl p-5 shadow-xs hover:border-sand/90 transition-all"
              >
                <p className="text-ink text-base leading-relaxed">{fact.factText}</p>
                <div className="flex items-center gap-3 mt-3.5 flex-wrap text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-full border font-medium ${
                      TRUST_CLASS[fact.trustLevel]
                    }`}
                  >
                    {t.trustLevels[fact.trustLevel]}
                  </span>
                  <a
                    href={fact.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-registan font-semibold hover:underline"
                  >
                    {t.verify.source}: {fact.sourceName}
                  </a>
                  <span className="text-night/50">
                    {t.verify.verifiedAt}: {fact.verifiedAt}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
