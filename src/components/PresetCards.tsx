import { useRouter } from "next/router";
import { TRIP_PRESETS, TripPreset } from "@/data/presets";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";

export default function PresetCards() {
  const router = useRouter();
  const { language } = useTranslation();

  const handleSelectPreset = (preset: TripPreset) => {
    sessionStorage.setItem("diyorai-trip", JSON.stringify(preset.plan));
    router.push("/trip");
  };

  const titleText = {
    ru: "Готовые маршруты по Узбекистану",
    uz: "O'zbekiston bo'ylab tayyor marshrutlar",
    en: "Curated Signature Itineraries",
  };

  const subtitleText = {
    ru: "Кураторские авторские путешествия с готовой логистикой, отелями и таймингом — выберите готовый вариант в 1 клик",
    uz: "Logistika, mehmonxonalar va vaqt taqsimoti bilan mutaxassislar tuzgan tayyor sayohatlar — 1 bosishda tanlang",
    en: "Curated travel packages with pre-calculated logistics, stays, and day schedules — select in 1 click",
  };

  const clickToLaunch = {
    ru: "Выбрать маршрут →",
    uz: "Marshrutni tanlash →",
    en: "Select Route →",
  };

  return (
    <section id="ready-routes" className="mb-14 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🗺️</span>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-registan">
              {language === "uz" ? "Tayyor yo'nalishlar" : language === "en" ? "Ready-Made Routes" : "Готовые маршруты"}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink font-black">
            {titleText[language]}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-night/70 max-w-xl">
          {subtitleText[language]}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {TRIP_PRESETS.map((p) => {
          const approxCost = p.plan.preferences.days ? p.plan.preferences.days * 65 + 40 : 120;
          return (
            <div
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="group cursor-pointer bg-white border border-sand hover:border-registan rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-sand/30 border border-sand/70 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    {p.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${p.badgeColor}`}
                  >
                    {p.tag[language]}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-ink group-hover:text-clay transition-colors mb-1.5 leading-snug">
                  {p.title[language]}
                </h3>

                <p className="text-xs text-night/70 line-clamp-2 leading-relaxed mb-4">
                  {p.subtitle[language]}
                </p>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-2 p-2.5 bg-plaster/60 rounded-xl border border-sand/60 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-night/50 block">📍 {language === "uz" ? "Manzil" : language === "en" ? "Region" : "Локация"}</span>
                    <span className="font-bold text-ink">{p.region}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-night/50 block">{ICON_MAP.budget} {language === "uz" ? "Taxminiy byudjet" : language === "en" ? "Est. Budget" : "Бюджет"}</span>
                    <span className="font-bold text-ink">~${approxCost}/чел</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-sand/60 flex items-center justify-between text-xs font-bold text-registan group-hover:translate-x-1 transition-transform">
                <span className="text-night/60 font-medium">📅 {p.duration}</span>
                <span className="flex items-center gap-1 bg-registan/10 hover:bg-registan hover:text-white px-3 py-1.5 rounded-xl transition-colors">
                  {clickToLaunch[language]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
