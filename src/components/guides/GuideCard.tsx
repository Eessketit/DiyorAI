import React from "react";
import { Guide } from "@/lib/types";
import { useTranslation, Language } from "@/lib/i18n";
import { UserCheck, ShieldCheck, Target, Star, MapPin, Award } from "lucide-react";

interface GuideCardProps {
  guide: Guide;
  onViewProfile: (guide: Guide) => void;
  onBook: (guide: Guide) => void;
}

export function getGuideDisplayName(name: Guide["name"], lang: Language): string {
  if (typeof name === "string") return name;
  if (!name) return "";
  return name[lang] || name.ru || name.en || "";
}

export default function GuideCard({ guide, onViewProfile, onBook }: GuideCardProps) {
  const { t, language } = useTranslation();
  const displayName = getGuideDisplayName(guide.name, language);

  const trustScore = guide.trustScore ?? 92;
  const matchScore = guide.matchScore ?? 95;
  const completedTours = guide.completedTours ?? 120;
  const price = guide.pricePerTourUsd ? `$${guide.pricePerTourUsd}` : guide.priceRange;

  const visibleSpecs = guide.specializationTags.slice(0, 3);
  const extraSpecsCount = Math.max(0, guide.specializationTags.length - 3);

  return (
    <div className="bg-white border border-sand rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-majolica/70 transition-all group">
      <div>
        {/* Top Header: Avatar, Name, Location */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0 group-hover:scale-105 transition-transform">
              <UserCheck className="w-6 h-6 text-majolica" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-display font-bold text-night text-base sm:text-lg leading-snug">
                  {displayName}
                </h3>
              </div>
              <p className="text-xs text-night/60 flex items-center gap-1 mt-0.5 font-mono">
                <MapPin className="w-3 h-3 text-majolica" />
                <span>{guide.city}</span>
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-mono font-bold text-night block">{price}</span>
            <span className="text-[10px] text-night/50 font-mono">{t.guides.perTour}</span>
          </div>
        </div>

        {/* Scores Bar: Trust & Match in IBM Plex Mono */}
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-paper/70 border border-sand/70 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-majolica" />
            <div>
              <span className="text-xs font-mono font-bold text-night block leading-none">
                {trustScore}/100
              </span>
              <span className="text-[9px] uppercase tracking-wider text-night/50 font-mono font-bold">
                {t.guides.trustScoreLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-sand pl-2.5">
            <Target className="w-4 h-4 text-gold" />
            <div>
              <span className="text-xs font-mono font-bold text-gold block leading-none">
                {matchScore}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-gold/80 font-mono font-bold">
                {t.guides.matchScoreLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {guide.verification?.identity && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-majolica/15 text-majolica border border-majolica/30 text-[11px] font-mono font-semibold"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{t.guides.verifiedBadge}</span>
            </span>
          )}
          {guide.verification?.qualification && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gold/15 text-gold border border-gold/30 text-[11px] font-mono font-semibold"
            >
              <Award className="w-3 h-3" />
              <span>{t.guides.licenseBadge}</span>
            </span>
          )}
          <span className="text-[11px] text-night/60 font-mono font-medium ml-auto flex items-center gap-1">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span>{guide.rating.toFixed(1)} · {completedTours} {t.guides.toursCount}</span>
          </span>
        </div>

        {/* Specializations Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {visibleSpecs.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-paper border border-sand text-night/80 font-medium"
            >
              {(t.categories as Record<string, string>)[tag] || tag}
            </span>
          ))}
          {extraSpecsCount > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper text-night/50 font-mono font-bold border border-sand">
              +{extraSpecsCount}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Secondary vs Primary CTA */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-sand/60 mt-2">
        <button
          type="button"
          onClick={() => onViewProfile(guide)}
          className="px-3 py-2 rounded-xl border border-majolica/40 bg-paper hover:bg-majolica/10 text-xs font-semibold text-night transition-colors text-center"
        >
          {t.guides.viewProfileBtn}
        </button>

        <button
          type="button"
          onClick={() => onBook(guide)}
          className="px-3 py-2 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs font-bold transition-all shadow-xs text-center"
        >
          {t.guides.bookGuideBtn}
        </button>
      </div>
    </div>
  );
}
