import React from "react";
import { SmartTrip, TravelersModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";
import { calculateSmartTripGroupCost } from "@/lib/smartTrips";

interface SmartTripCardProps {
  trip: SmartTrip;
  travelers?: TravelersModel;
  isAdded?: boolean;
  onToggleAdd: (trip: SmartTrip) => void;
  onViewDetails: (trip: SmartTrip) => void;
}

export default function SmartTripCard({
  trip,
  travelers,
  isAdded,
  onToggleAdd,
  onViewDetails,
}: SmartTripCardProps) {
  const { t, language } = useTranslation();

  const title = trip.title[language] || trip.title.ru;
  const description = trip.description[language] || trip.description.ru;
  const tag = trip.tag ? trip.tag[language] || trip.tag.ru : "";
  const groupCost = calculateSmartTripGroupCost(trip, travelers);
  const matchScore = trip.matchScore ?? 94;

  return (
    <div
      className={`bg-white border rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group ${
        isAdded ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10" : "border-sand hover:border-sand/90"
      }`}
    >
      <div>
        {/* Top Badges & Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-sand/30 border border-sand flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
              {trip.image || "🏔"}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {tag && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-registan/10 text-registan uppercase">
                    {tag}
                  </span>
                )}
                {isAdded && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    ✓ {language === "uz" ? "Qo'shilgan" : language === "en" ? "Added" : "В маршруте"}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-ink text-base sm:text-lg leading-snug mt-1 group-hover:text-clay transition-colors">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Price & Meta info */}
        <div className="flex items-center justify-between gap-2 p-3 bg-plaster/60 rounded-2xl border border-sand/60 mb-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-lg text-ink">
                ${trip.pricePerAdult}
              </span>
              <span className="text-[10px] text-night/50 font-semibold">
                / {t.trip.costPerPerson}
              </span>
            </div>
            {travelers && (
              <span className="text-[10px] text-night/60 block">
                {language === "uz" ? `Guruh uchun (${travelers.total} kishi):` : language === "en" ? `Group total (${travelers.total} pers):` : `На группу (${travelers.total} чел):`}{" "}
                <strong className="text-ink font-black">${groupCost}</strong>
              </span>
            )}
          </div>

          <div className="text-right border-l border-sand/80 pl-3 shrink-0">
            <span className="text-xs font-black text-registan block leading-none">
              🎯 {matchScore}%
            </span>
            <span className="text-[9px] uppercase tracking-wider text-night/50 font-bold">
              {t.guides.matchScoreLabel}
            </span>
          </div>
        </div>

        {/* Short description */}
        <p className="text-xs text-night/70 line-clamp-2 leading-relaxed mb-3">
          {description}
        </p>

        {/* Highlights Preview */}
        <div className="space-y-1 mb-4 text-[11px] text-night/80">
          {trip.highlights.slice(0, 2).map((h, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-emerald-700 font-bold text-xs">✓</span>
              <span className="line-clamp-1">{h[language] || h.ru}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-sand/60 mt-1">
        <button
          type="button"
          onClick={() => onViewDetails(trip)}
          className="px-3 py-2 rounded-xl border border-sand bg-white hover:bg-sand/30 text-xs font-bold text-ink transition-colors text-center"
        >
          {language === "uz" ? "Batafsil" : language === "en" ? "Details" : "Подробнее"}
        </button>

        <button
          type="button"
          onClick={() => onToggleAdd(trip)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs text-center flex items-center justify-center gap-1.5 ${
            isAdded
              ? "bg-emerald-700 hover:bg-emerald-800 text-white"
              : "bg-registan hover:bg-registan/90 text-white"
          }`}
        >
          <span>{isAdded ? "✓" : "+"}</span>
          <span>
            {isAdded
              ? (language === "uz" ? "Qo'shildi" : language === "en" ? "Added" : "Добавлено")
              : (language === "uz" ? "Qo'shish" : language === "en" ? "Add to Trip" : "В поездку")}
          </span>
        </button>
      </div>
    </div>
  );
}
