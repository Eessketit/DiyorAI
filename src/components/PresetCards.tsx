import { useRouter } from "next/router";
import { TRIP_PRESETS, TripPreset } from "@/data/presets";
import { useTranslation } from "@/lib/i18n";
import { Compass, MapPin, Clock, Coins, ArrowRight } from "lucide-react";
import ExperienceIcon from "./common/ExperienceIcon";

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
    ru: "Выбрать маршрут",
    uz: "Marshrutni tanlash",
    en: "Select Route",
  };

  return (
    <section id="ready-routes" className="mb-14 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-4 h-4 text-majolica" />
            <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
              {language === "uz" ? "Tayyor yo'nalishlar" : language === "en" ? "Ready-Made Routes" : "Готовые маршруты"}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-night font-bold">
            {titleText[language]}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-night/70 max-w-xl font-light leading-relaxed">
          {subtitleText[language]}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {TRIP_PRESETS.map((p) => {
          const approxCost = p.plan.preferences.days ? p.plan.preferences.days * 65 + 40 : 120;
          return (
            <div
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="group cursor-pointer bg-white border border-sand hover:border-majolica rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Architectural Iwan Portal Arch Silhouette applied strictly to the top icon/badge preview container */}
                <div className="arch-iwan-portal bg-paper border border-gold/40 p-4 pt-5 mb-4 flex items-center justify-between gap-2 shadow-2xs relative">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-sand flex items-center justify-center text-majolica shadow-2xs group-hover:scale-105 transition-transform">
                    <ExperienceIcon name={p.icon} className="w-6 h-6 text-majolica" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${p.badgeColor}`}
                  >
                    {p.tag[language]}
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-night group-hover:text-majolica transition-colors mb-2 leading-snug">
                  {p.title[language]}
                </h3>

                <p className="text-xs text-night/70 line-clamp-2 leading-relaxed mb-4 font-light">
                  {p.subtitle[language]}
                </p>

                {/* Meta details with IBM Plex Mono figures */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-paper/60 rounded-2xl border border-sand/70 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-night/50 font-mono uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <MapPin className="w-3 h-3 text-majolica" />
                      {language === "uz" ? "Manzil" : language === "en" ? "Region" : "Локация"}
                    </span>
                    <span className="font-bold text-night">{p.region}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-night/50 font-mono uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Coins className="w-3 h-3 text-gold" />
                      {language === "uz" ? "Byudjet" : language === "en" ? "Est. Cost" : "Бюджет"}
                    </span>
                    <span className="font-mono font-bold text-gold text-xs sm:text-sm">~${approxCost} / чел</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Primary CTA button */}
              <div className="pt-3.5 border-t border-sand/60 flex items-center justify-between text-xs font-semibold">
                <span className="text-night/70 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-majolica" />
                  <span>{p.duration}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-majolica text-paper hover:bg-majolica/90 font-bold transition-all shadow-xs group-hover:scale-102">
                  <span>{clickToLaunch[language]}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
