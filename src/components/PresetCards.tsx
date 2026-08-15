import React, { useState } from "react";
import { useRouter } from "next/router";
import { TRIP_PRESETS, TripPreset } from "@/data/presets";
import { useTranslation } from "@/lib/i18n";
import {
  Compass,
  MapPin,
  Clock,
  Coins,
  ArrowRight,
  Train,
  Plane,
  Car,
  Building2,
  Users,
  Check,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import ExperienceIcon from "./common/ExperienceIcon";
import CategoryBadge from "./common/CategoryBadge";

interface PresetCardsProps {
  userBudget?: number;
}

export default function PresetCards({ userBudget }: PresetCardsProps) {
  const router = useRouter();
  const { language } = useTranslation();
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>("all");

  const handleSelectPreset = (preset: TripPreset) => {
    sessionStorage.setItem("diyorai-trip", JSON.stringify(preset.plan));
    router.push("/trip");
  };

  const titleText = {
    ru: "Готовые туры по Узбекистану",
    uz: "O'zbekiston bo'ylab tayyor turlar",
    en: "Curated Uzbekistan Tours",
  };

  const subtitleText = {
    ru: "Продуманные маршруты «всё включено»: логистика, проверенные отели, экскурсии и расчет на человека.",
    uz: "Barcha tafsilotlari o'ylangan tayyor sayohatlar: transport, mehmonxona, ekskursiyalar va shaffof narxlar.",
    en: "All-inclusive curated journeys: express logistics, handpicked stays, heritage stops & transparent pricing.",
  };

  const regions = [
    { id: "all", label: language === "uz" ? "Barcha turlar" : language === "en" ? "All Tours" : "Все туры" },
    { id: "tashkent_region", label: language === "uz" ? "Toshkent viloyati (Tog'lar)" : language === "en" ? "Tashkent Region (Mountains)" : "Ташкентская область (Горы)" },
    { id: "samarkand", label: language === "uz" ? "Samarqand" : language === "en" ? "Samarkand" : "Самарканд" },
    { id: "bukhara", label: language === "uz" ? "Buxoro" : language === "en" ? "Bukhara" : "Бухара" },
    { id: "khiva", label: language === "uz" ? "Xiva" : language === "en" ? "Khiva" : "Хива" },
  ];

  const filteredPresets = TRIP_PRESETS.filter((p) => {
    if (selectedRegionFilter === "all") return true;
    if (selectedRegionFilter === "tashkent_region") return p.plan.preferences.region === "tashkent_region";
    return p.plan.preferences.region === selectedRegionFilter;
  });

  return (
    <section id="ready-tours" className="mb-14 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-majolica" />
            <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
              {language === "uz" ? "Tayyor dasturlar" : language === "en" ? "Signature Packages" : "Готовые туры"}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-night font-bold">
            {titleText[language]}
          </h2>
          <p className="text-xs sm:text-sm text-night/70 max-w-2xl font-light leading-relaxed mt-1">
            {subtitleText[language]}
          </p>
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegionFilter(reg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all shrink-0 ${
                selectedRegionFilter === reg.id
                  ? "bg-majolica text-paper shadow-xs"
                  : "bg-paper text-night/70 hover:text-night hover:bg-majolica/10 border border-majolica/20"
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Ready Tours */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((p) => {
          const travelers = p.travelersCount || 2;
          const costPerPerson = p.pricePerPersonUsd;
          const totalCost = p.totalPriceUsd;

          // Budget evaluation
          const budgetLimit = userBudget || 500;
          const isOverBudget = totalCost > budgetLimit;
          const diffBudget = Math.abs(budgetLimit - totalCost);

          return (
            <div
              key={p.id}
              onClick={() => handleSelectPreset(p)}
              className="group cursor-pointer bg-white border border-majolica/20 hover:border-majolica rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                {/* Top Badge & Icon Banner */}
                <div className="bg-paper border border-gold/40 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-majolica/20 flex items-center justify-center text-majolica shadow-2xs group-hover:scale-105 transition-transform">
                      <ExperienceIcon name={p.icon} className="w-5 h-5 text-majolica" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-night block font-display">
                        {p.region}
                      </span>
                      <span className="text-[10px] text-night/60 font-mono">
                        {p.duration} · {travelers} {language === "uz" ? "kishilik" : language === "en" ? "travelers" : "чел."}
                      </span>
                    </div>
                  </div>
                  <CategoryBadge label={p.tag[language]} />
                </div>

                <h3 className="font-display text-lg sm:text-xl font-bold text-night group-hover:text-majolica transition-colors mb-2 leading-snug">
                  {p.title[language]}
                </h3>

                <p className="text-xs text-night/70 line-clamp-2 leading-relaxed mb-4 font-light">
                  {p.subtitle[language]}
                </p>

                {/* Stays & Transport Details */}
                <div className="space-y-2 mb-4 p-3 bg-paper/60 rounded-2xl border border-majolica/20 text-xs">
                  {/* Transport */}
                  {p.transportInfo && (
                    <div className="flex items-center gap-2 text-night/80">
                      {p.transportInfo.type === "train" && <Train className="w-3.5 h-3.5 text-majolica shrink-0" />}
                      {p.transportInfo.type === "flight" && <Plane className="w-3.5 h-3.5 text-majolica shrink-0" />}
                      {p.transportInfo.type === "car" && <Car className="w-3.5 h-3.5 text-majolica shrink-0" />}
                      {p.transportInfo.type === "none" && <MapPin className="w-3.5 h-3.5 text-majolica shrink-0" />}
                      <span className="font-mono text-[11px] truncate">
                        {p.transportInfo.label[language]}
                      </span>
                    </div>
                  )}

                  {/* Hotel */}
                  {p.hotelInfo && (
                    <div className="flex items-center gap-2 text-night/80 border-t border-majolica/10 pt-1.5">
                      <Building2 className="w-3.5 h-3.5 text-majolica shrink-0" />
                      <span className="font-mono text-[11px] truncate">
                        {p.hotelInfo.name} ({p.hotelInfo.nights} {language === "uz" ? "tun" : language === "en" ? "nights" : "ночи"})
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing Summary */}
                <div className="p-3 bg-white rounded-2xl border border-majolica/20 flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] text-night/50 uppercase font-mono font-bold block">
                      {language === "uz" ? "Kishi boshiga" : language === "en" ? "Per Person" : "На человека"}
                    </span>
                    <span className="font-mono font-black text-xl text-night">
                      ${costPerPerson}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-night/50 uppercase font-mono font-bold block">
                      {language === "uz" ? "Jami tur narxi" : language === "en" ? "Total Price" : "Итого тур"}
                    </span>
                    <span className="font-mono font-black text-xl text-gold">
                      ${totalCost}
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-1 mb-4">
                  {p.highlightsList.slice(0, 2).map((hl, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-night/75 font-light">
                      <Check className="w-3 h-3 text-majolica shrink-0" />
                      <span className="truncate">{hl[language]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer with CTA */}
              <div className="pt-3.5 border-t border-majolica/20 flex items-center justify-between text-xs font-semibold">
                <span className="text-night/70 font-mono flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-majolica" />
                  <span>{p.duration}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-majolica text-paper hover:bg-majolica/90 font-bold transition-all shadow-xs group-hover:scale-102 font-mono">
                  <span>{language === "uz" ? "Tanlash" : language === "en" ? "Select" : "Выбрать"}</span>
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
