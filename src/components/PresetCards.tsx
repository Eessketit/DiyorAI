import { useRouter } from "next/router";
import { TRIP_PRESETS, TripPreset } from "@/data/presets";
import { useTranslation } from "@/lib/i18n";

export default function PresetCards() {
  const router = useRouter();
  const { language } = useTranslation();

  const handleSelectPreset = (preset: TripPreset) => {
    sessionStorage.setItem("diyorai-trip", JSON.stringify(preset.plan));
    router.push("/trip");
  };

  const titleText = {
    ru: "⚡ Быстрый старт: Готовые маршруты в 1 клик",
    uz: "⚡ Tezkor start: 1 bosishda tayyor yo'nalishlar",
    en: "⚡ Quick Start: Ready-to-Go 1-Click Itineraries",
  };

  const subtitleText = {
    ru: "Выберите один из кураторских маршрутов или настройте свой персональный ниже",
    uz: "Ekspertlar tomonidan tuzilgan yo'nalishni tanlang yoki quyida o'zingiznikini yarating",
    en: "Choose a curated signature route or customize your own itinerary below",
  };

  const clickToLaunch = {
    ru: "Открыть маршрут →",
    uz: "Yo'nalishni ochish →",
    en: "Open Itinerary →",
  };

  return (
    <div className="mb-10">
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl text-ink font-bold mb-2">
          {titleText[language]}
        </h2>
        <p className="text-sm text-night/70 max-w-xl mx-auto">{subtitleText[language]}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {TRIP_PRESETS.map((p) => (
          <div
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className="group cursor-pointer bg-white/90 hover:bg-white border border-sand hover:border-registan rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-3xl">{p.icon}</span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${p.badgeColor}`}
                >
                  {p.tag[language]}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-ink group-hover:text-clay transition-colors mb-2 leading-snug">
                {p.title[language]}
              </h3>
              <p className="text-xs text-night/70 line-clamp-3 leading-relaxed mb-4">
                {p.subtitle[language]}
              </p>
            </div>

            <div className="pt-3 border-t border-sand/60 flex items-center justify-between text-xs font-semibold text-clay group-hover:translate-x-1 transition-transform">
              <span>{p.duration}</span>
              <span className="flex items-center gap-1">{clickToLaunch[language]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
