import React from "react";
import { SmartTrip, TravelersModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { calculateSmartTripGroupCost } from "@/lib/smartTrips";
import { Target, Check, Plus } from "lucide-react";
import ExperienceIcon from "../common/ExperienceIcon";
import CategoryBadge from "../common/CategoryBadge";

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
        isAdded ? "border-majolica ring-2 ring-majolica/25 bg-paper/40" : "border-majolica/20 hover:border-majolica/70"
      }`}
    >
      <div>
        {/* Top Badges & Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-paper border border-majolica/20 flex items-center justify-center text-majolica shrink-0 group-hover:scale-105 transition-transform">
              <ExperienceIcon name={trip.image} className="w-6 h-6 text-majolica" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {tag && <CategoryBadge label={tag} icon={trip.image} />}
                {isAdded && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-majolica bg-majolica/15 text-night flex items-center gap-1">
                    <Check className="w-3 h-3 text-majolica" />
                    <span>{language === "uz" ? "Qo'shilgan" : language === "en" ? "Added" : "В маршруте"}</span>
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-night text-base sm:text-lg leading-snug mt-1.5 group-hover:text-majolica transition-colors">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Price & Meta info with IBM Plex Mono */}
        <div className="flex items-center justify-between gap-2 p-3 bg-paper/70 rounded-2xl border border-majolica/20 mb-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-black text-lg text-night">
                ${trip.pricePerAdult}
              </span>
              <span className="text-[10px] text-night/60 font-mono">
                / {t.trip.costPerPerson}
              </span>
            </div>
            {travelers && (
              <span className="text-[10px] text-night/60 font-mono block">
                {language === "uz" ? `Guruh (${travelers.total} kishi):` : language === "en" ? `Group (${travelers.total} pers):` : `Группа (${travelers.total} чел):`}{" "}
                <strong className="text-night font-black font-mono">${groupCost}</strong>
              </span>
            )}
          </div>

          <div className="text-right border-l border-majolica/20 pl-3 shrink-0">
            <span className="text-xs font-mono font-bold text-gold flex items-center justify-end gap-1 leading-none">
              <Target className="w-3 h-3 text-gold" />
              <span>{matchScore}%</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-night/60 font-mono font-bold block mt-0.5">
              {t.guides.matchScoreLabel}
            </span>
          </div>
        </div>

        {/* Short description */}
        <p className="text-xs text-night/70 line-clamp-2 leading-relaxed mb-3 font-light">
          {description}
        </p>

        {/* Highlights Preview */}
        <div className="space-y-1 mb-4 text-[11px] text-night/80">
          {trip.highlights.slice(0, 2).map((h, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-majolica shrink-0" />
              <span className="line-clamp-1">{h[language] || h.ru}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Secondary vs Primary */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-majolica/20 mt-1">
        {/* Secondary Button */}
        <button
          type="button"
          onClick={() => onViewDetails(trip)}
          className="px-3 py-2 rounded-xl border border-majolica/40 bg-paper hover:bg-majolica/10 text-xs font-semibold text-night transition-colors text-center"
        >
          {language === "uz" ? "Batafsil" : language === "en" ? "Details" : "Подробнее"}
        </button>

        {/* Primary CTA Button */}
        <button
          type="button"
          onClick={() => onToggleAdd(trip)}
          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs text-center flex items-center justify-center gap-1.5 ${
            isAdded
              ? "bg-night border border-majolica text-majolica"
              : "bg-majolica hover:bg-majolica/90 text-paper"
          }`}
        >
          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
