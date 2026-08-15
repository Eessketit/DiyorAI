import { useState } from "react";
import { SURVIVAL_GUIDE } from "@/data/survivalGuide";
import { useTranslation } from "@/lib/i18n";
import { Train, X, ArrowRight } from "lucide-react";
import ExperienceIcon from "./common/ExperienceIcon";

export default function SurvivalGuideModal() {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(SURVIVAL_GUIDE[0].id);

  const buttonText = {
    ru: "Логистика и памятка туриста по Узбекистану",
    uz: "O'zbekiston bo'yicha sayyoh eslatmasi va logistika",
    en: "Uzbekistan Logistics & Traveler Survival Guide",
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
        className="w-full bg-paper border border-majolica/30 rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-4 transition-all group shadow-xs my-6 text-left hover:border-majolica hover:shadow-md"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-sand flex items-center justify-center text-majolica shrink-0 group-hover:scale-105 transition-transform">
            <Train className="w-6 h-6 text-majolica" />
          </div>
          <div>
            <h4 className="font-display text-base sm:text-lg font-bold text-night group-hover:text-majolica transition-colors">
              {buttonText[language]}
            </h4>
            <p className="text-xs text-night/70 font-light">
              Поезд Afrosiyob за 45 дней, такси Yandex Go, карты Uzcard/Humo/Visa, покупка eSIM
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-night bg-white border border-majolica/40 px-3.5 py-2 rounded-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform flex items-center gap-1.5 font-mono">
          <span>Открыть памятку</span>
          <ArrowRight className="w-3.5 h-3.5 text-majolica" />
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-sand rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in text-night">
            {/* Header */}
            <div className="p-6 border-b border-sand flex items-center justify-between bg-paper">
              <div>
                <h3 className="font-display text-2xl font-bold text-night">{modalTitle[language]}</h3>
                <p className="text-xs text-night/60 mt-0.5 font-light">
                  Все нюансы транспорта, оплат и связи без лишних переплат
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-sand/40 hover:bg-sand text-night flex items-center justify-center text-xs font-bold transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-sand bg-paper/50 px-6 gap-2 overflow-x-auto">
              {SURVIVAL_GUIDE.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveTab(section.id)}
                  className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                    activeTab === section.id
                      ? "border-majolica text-majolica bg-white rounded-t-xl shadow-xs"
                      : "border-transparent text-night/60 hover:text-night"
                  }`}
                >
                  <ExperienceIcon name={section.icon} className="w-4 h-4 text-majolica" />
                  <span>{section.title[language]}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-sm text-night/70 leading-relaxed font-light">{currentSection.subtitle[language]}</p>

              <div className="space-y-3">
                {currentSection.points.map((pt, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      pt.highlight
                        ? "bg-gold/10 border-gold/30 text-night"
                        : "bg-paper border-sand text-night"
                    }`}
                  >
                    <h4 className="font-display text-sm font-bold mb-1 flex items-center gap-1.5">
                      {pt.title[language]}
                    </h4>
                    <p className="text-xs text-night/80 leading-relaxed font-light">{pt.desc[language]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-sand bg-paper flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-paper border border-majolica/40 text-night rounded-xl text-xs font-semibold hover:bg-majolica/10 transition-colors"
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
