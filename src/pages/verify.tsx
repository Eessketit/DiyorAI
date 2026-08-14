import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FactVerdict, ObjectFact, TourismObject, TrustLevel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import VoiceFactCheck from "@/components/VoiceFactCheck";

interface VerifyResult {
  objectId: string;
  query: string | null;
  status: "matched" | "no-match" | "listed";
  verdict?: FactVerdict;
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

  async function performVerification(targetObjectId: string, targetQuery: string) {
    if (!targetObjectId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectId: targetObjectId, query: targetQuery }),
      });
      const data: VerifyResult = await res.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    performVerification(objectId, query);
  }

  const handleVoiceTranscript = (transcriptText: string) => {
    setQuery(transcriptText);
    performVerification(objectId, transcriptText);
  };

  const selectedObject = objects.find((o) => o.id === objectId);

  const renderVerdictBadge = (verdict?: FactVerdict) => {
    switch (verdict) {
      case "fact":
        return (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl p-5 mb-6 text-emerald-950 flex items-start gap-3.5 shadow-sm animate-fade-in">
            <span className="text-3xl shrink-0">🟢</span>
            <div>
              <p className="font-display text-lg font-bold text-emerald-900 mb-1">
                Подтвержденный исторический факт
              </p>
              <p className="text-xs sm:text-sm text-emerald-900/80 leading-relaxed">
                Утверждение полностью подтверждается академическими источниками, исследованиями Института востоковедения и ЮНЕСКО.
              </p>
            </div>
          </div>
        );
      case "legend":
        return (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 mb-6 text-amber-950 flex items-start gap-3.5 shadow-sm animate-fade-in">
            <span className="text-3xl shrink-0">🟡</span>
            <div>
              <p className="font-display text-lg font-bold text-amber-900 mb-1">
                Городская легенда / Фольклор
              </p>
              <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
                Красивое народное предание или байка гидов. Исторически не подтверждено документами, но является частью культурного фольклора.
              </p>
            </div>
          </div>
        );
      case "myth":
        return (
          <div className="bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-5 mb-6 text-red-950 flex items-start gap-3.5 shadow-sm animate-fade-in">
            <span className="text-3xl shrink-0">🔴</span>
            <div>
              <p className="font-display text-lg font-bold text-red-900 mb-1">
                Исторический миф / Искажение
              </p>
              <p className="text-xs sm:text-sm text-red-900/80 leading-relaxed">
                Данное утверждение опровергнуто историками и археологическими исследованиями. Гид допустил ошибку.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="uppercase tracking-[0.2em] text-registan text-xs font-bold mb-2">
        {t.verify.badge}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-ink font-bold mb-3">{t.verify.title}</h1>
      <p className="text-night/75 mb-8 text-sm sm:text-base leading-relaxed">{t.verify.subtitle}</p>

      {/* Voice Fact-Check Component */}
      <VoiceFactCheck onTranscript={handleVoiceTranscript} isProcessing={loading} />

      <form
        onSubmit={handleCheck}
        className="bg-white border border-sand rounded-2xl p-6 space-y-5 shadow-sm"
      >
        <div>
          <label htmlFor="object" className="block font-medium text-ink mb-2 text-sm">
            {t.verify.objectLabel}
          </label>
          <select
            id="object"
            value={objectId}
            onChange={(e) => setObjectId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-sand bg-plaster/30 focus:bg-white focus:outline-none focus:border-clay text-ink text-sm font-medium"
          >
            {objects.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {t.regions[o.region]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="query" className="block font-medium text-ink mb-2 text-sm">
            {t.verify.queryLabel}
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            placeholder={t.verify.placeholder}
            className="w-full px-4 py-3 rounded-xl border border-sand bg-plaster/30 focus:bg-white focus:outline-none focus:border-clay text-ink text-sm leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !objectId}
          className="w-full sm:w-auto bg-clay hover:bg-clay/90 disabled:opacity-60 text-plaster font-bold px-8 py-3.5 rounded-xl transition-all shadow-xs text-sm uppercase tracking-wider"
        >
          {loading ? t.verify.checking : t.verify.button}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          {/* Color Verdict Card */}
          {result.status === "matched" && renderVerdictBadge(result.verdict)}

          {result.status === "no-match" && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 text-amber-950 text-xs sm:text-sm leading-relaxed">
              <p className="font-bold mb-1">Точного совпадения не найдено в базе</p>
              <p>{t.verify.noMatchTitle}</p>
            </div>
          )}

          {result.status === "listed" && (
            <p className="text-night/70 mb-4 font-bold text-sm">
              {t.verify.listedTitle} «{selectedObject?.name}»:
            </p>
          )}

          <ul className="space-y-4">
            {result.results.map((fact) => (
              <li
                key={fact.id}
                className="bg-white border border-sand rounded-2xl p-5 sm:p-6 shadow-xs hover:border-sand/90 transition-all"
              >
                <p className="text-ink text-base leading-relaxed mb-3">{fact.factText}</p>

                {fact.explanation && (
                  <p className="text-xs text-night/70 italic bg-sand/20 p-2.5 rounded-lg mb-3">
                    💡 Экспертный комментарий: {fact.explanation}
                  </p>
                )}

                <div className="flex items-center gap-3 pt-3 border-t border-sand/40 flex-wrap text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-full border font-bold ${
                      TRUST_CLASS[fact.trustLevel]
                    }`}
                  >
                    {t.trustLevels[fact.trustLevel]}
                  </span>
                  <a
                    href={fact.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-registan font-bold hover:underline"
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
