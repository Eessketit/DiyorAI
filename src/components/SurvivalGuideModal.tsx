import { useState } from "react";
import { SURVIVAL_GUIDE } from "@/data/survivalGuide";
import { useTranslation } from "@/lib/i18n";

export default function SurvivalGuideModal() {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(SURVIVAL_GUIDE[0].id);

  const buttonText = {
    ru: "🚆 Логистика и памятка туриста по Узбекистану",
    uz: "🚆 O'zbekiston bo'yicha sayyoh eslatmasi va logistika",
    en: "🚆 Uzbekistan Logistics & Traveler Survival Guide",
  };

  const modalTitle = {
    ru: "Специфика и практический гид по Узбекистану",
    uz: "O'zbekiston bo'yicha amaliy qo'llanma",
    en: "Practical Traveler Guide to Uzbekistan",
  };

  const closeText = {
    ru: "Закрыть",
    uz: "Yopish",
    en: "Close",
  };

  const currentSection = SURVIVAL_GUIDE.find((s) => s.id === activeTab) || SURVIVAL_GUIDE[0];

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-amber-600/10 via-registan/15 to-clay/10 hover:from-amber-600/20 hover:to-clay/20 border border-registan/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all group shadow-xs my-6 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">🚆</span>
          <div>
            <h4 className="font-display text-base sm:text-lg font-bold text-ink group-hover:text-clay transition-colors">
              {buttonText[language]}
            </h4>
            <p className="text-xs text-night/70">
              Поезд Afrosiyob за 45 дней, такси Yandex Go, карты Uzcard/Humo/Visa, покупка eSIM
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-clay bg-white border border-sand px-3 py-1.5 rounded-lg shadow-xs shrink-0 group-hover:scale-105 transition-transform">
          Открыть справочник →
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-sand rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-sand flex items-center justify-between bg-plaster/50">
              <div>
                <h3 className="font-display text-2xl font-bold text-ink">{modalTitle[language]}</h3>
                <p className="text-xs text-night/60 mt-0.5">
                  Все нюансы транспорта, оплат и связи без лишних переплат
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-sand/60 hover:bg-sand text-ink flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-sand bg-plaster/30 px-6 gap-2 overflow-x-auto">
              {SURVIVAL_GUIDE.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveTab(section.id)}
                  className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === section.id
                      ? "border-clay text-clay bg-white rounded-t-lg shadow-xs"
                      : "border-transparent text-night/60 hover:text-ink"
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.title[language]}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-sm text-night/70 leading-relaxed">{currentSection.subtitle[language]}</p>

              <div className="space-y-3">
                {currentSection.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      pt.highlight
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-950"
                        : "bg-plaster/40 border-sand text-ink"
                    }`}
                  >
                    <h4 className="font-display text-sm font-bold mb-1 flex items-center gap-1.5">
                      {pt.title[language]}
                    </h4>
                    <p className="text-xs text-night/80 leading-relaxed">{pt.desc[language]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sand bg-plaster/30 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-ink text-plaster rounded-xl text-xs font-semibold hover:bg-ink/90 transition-colors"
              >
                {closeText[language]}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
