import React from "react";
import { Guide } from "@/lib/types";
import { useTranslation, Language } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";

interface GuideCardProps {
  guide: Guide;
  onViewProfile: (guide: Guide) => void;
  onBook: (guide: Guide) => void;
}

export function getGuideDisplayName(name: Guide["name"], lang: Language): string {
  if (typeof name === "string") return name;
  if (!name) return "Аккредитованный гид";
  return name[lang] || name.ru || name.en || "";
}

export default function GuideCard({ guide, onViewProfile, onBook }: GuideCardProps) {
  const { language } = useTranslation();
  const displayName = getGuideDisplayName(guide.name, language);

  const trustScore = guide.trustScore ?? 92;
  const matchScore = guide.matchScore ?? 95;
  const completedTours = guide.completedTours ?? 120;
  const price = guide.pricePerTourUsd ? `$${guide.pricePerTourUsd}` : guide.priceRange;

  const visibleSpecs = guide.specializationTags.slice(0, 3);
  const extraSpecsCount = Math.max(0, guide.specializationTags.length - 3);

  return (
    <div className="bg-white border border-sand rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-sand/90 transition-all group">
      <div>
        {/* Top Header: Avatar, Name, Location */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-sand/30 border border-sand flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
              {guide.avatar || "👨‍🏫"}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display font-bold text-ink text-base sm:text-lg leading-snug">
                  {displayName}
                </h3>
              </div>
              <p className="text-xs text-night/60 flex items-center gap-1 mt-0.5">
                <span>📍</span> {guide.city}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-bold text-ink block">{price}</span>
            <span className="text-[10px] text-night/50 font-medium">за тур</span>
          </div>
        </div>

        {/* Scores Bar: Trust & Match */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-plaster/70 border border-sand/60 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{ICON_MAP.trust}</span>
            <div>
              <span className="text-xs font-black text-ink block leading-none">
                {trustScore}/100
              </span>
              <span className="text-[9px] uppercase tracking-wider text-night/50 font-bold">
                Trust Score
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-sand pl-2.5">
            <span className="text-sm">{ICON_MAP.match}</span>
            <div>
              <span className="text-xs font-black text-registan block leading-none">
                {matchScore}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-registan/70 font-bold">
                Совпадение
              </span>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {guide.verification?.identity && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold"
              title="Личность подтверждена по паспорту"
            >
              <span>{ICON_MAP.verified}</span> Проверен
            </span>
          )}
          {guide.verification?.qualification && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-semibold"
              title="Аккредитация Комитета по туризму"
            >
              <span>{ICON_MAP.qualification}</span> Лицензия
            </span>
          )}
          <span className="text-[11px] text-night/60 font-medium ml-auto">
            ⭐ {guide.rating.toFixed(1)} · {completedTours} туров
          </span>
        </div>

        {/* Specializations Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {visibleSpecs.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-sand/30 text-ink/80 font-medium"
            >
              {tag}
            </span>
          ))}
          {extraSpecsCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-plaster text-night/50 font-bold border border-sand">
              +{extraSpecsCount}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-sand/60 mt-2">
        <button
          type="button"
          onClick={() => onViewProfile(guide)}
          className="px-3 py-2 rounded-xl border border-sand bg-white hover:bg-sand/30 text-xs font-bold text-ink transition-colors text-center"
        >
          🔍 Профиль и аудит
        </button>

        <button
          type="button"
          onClick={() => onBook(guide)}
          className="px-3 py-2 rounded-xl bg-registan hover:bg-registan/90 text-white text-xs font-bold transition-all shadow-xs text-center"
        >
          🔒 Забронировать
        </button>
      </div>
    </div>
  );
}
