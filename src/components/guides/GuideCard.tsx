import React, { useState } from "react";
import { Guide } from "@/lib/types";
import { useTranslation, Language } from "@/lib/i18n";
import { UserCheck, ShieldCheck, Target, Star, MapPin, Award, HelpCircle } from "lucide-react";
import CategoryBadge from "../common/CategoryBadge";
import GuideVerificationModal from "./GuideVerificationModal";

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
  const [modalMode, setModalMode] = useState<"trust" | "match" | null>(null);

  const displayName = getGuideDisplayName(guide.name, language);

  const trustScore = guide.trustScore ?? 94;
  const matchScore = guide.matchScore ?? 92;
  const completedTours = guide.completedTours ?? 120;
  const price = guide.pricePerTourUsd ? `$${guide.pricePerTourUsd}` : guide.priceRange;

  const visibleSpecs = guide.specializationTags.slice(0, 3);
  const extraSpecsCount = Math.max(0, guide.specializationTags.length - 3);

  return (
    <>
      <div className="bg-white border border-majolica/20 rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-majolica/70 transition-all group">
        <div>
          {/* Top Header: Avatar, Name, Location */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-paper border border-majolica/20 flex items-center justify-center text-majolica shrink-0 group-hover:scale-105 transition-transform">
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

          {/* Interactive Scores Bar: Trust & Match in IBM Plex Mono */}
          <div className="grid grid-cols-2 gap-2 my-3 p-2 bg-paper/70 border border-majolica/20 rounded-2xl">
            <button
              type="button"
              onClick={() => setModalMode("trust")}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white/80 transition-colors text-left group/trust cursor-pointer"
              title="Нажмите, чтобы узнать, почему гид проверен"
            >
              <ShieldCheck className="w-4 h-4 text-majolica shrink-0 group-hover/trust:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-mono font-bold text-night block leading-none">
                  {trustScore}/100
                </span>
                <span className="text-[9px] uppercase tracking-wider text-night/50 font-mono font-bold flex items-center gap-0.5">
                  <span>Trust Score</span>
                  <HelpCircle className="w-2.5 h-2.5 opacity-50" />
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setModalMode("match")}
              className="flex items-center gap-1.5 border-l border-majolica/15 pl-2.5 p-1 rounded-xl hover:bg-white/80 transition-colors text-left group/match cursor-pointer"
              title="Нажмите, чтобы узнать, почему гид подходит вам"
            >
              <Target className="w-4 h-4 text-gold shrink-0 group-hover/match:scale-110 transition-transform" />
              <div>
                <span className="text-xs font-mono font-bold text-gold block leading-none">
                  {matchScore}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-gold/80 font-mono font-bold flex items-center gap-0.5">
                  <span>Match</span>
                  <HelpCircle className="w-2.5 h-2.5 opacity-50" />
                </span>
              </div>
            </button>
          </div>

          {/* Verification Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {guide.verification?.identity && (
              <button
                type="button"
                onClick={() => setModalMode("trust")}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-majolica/10 hover:bg-majolica/20 text-night border border-majolica/30 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3 h-3 text-majolica" />
                <span>{t.guides.verifiedBadge}</span>
              </button>
            )}
            {guide.verification?.qualification && (
              <button
                type="button"
                onClick={() => setModalMode("trust")}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gold/10 hover:bg-gold/20 text-night border border-gold/30 text-[11px] font-mono font-semibold transition-colors cursor-pointer"
              >
                <Award className="w-3 h-3 text-gold" />
                <span>{t.guides.licenseBadge}</span>
              </button>
            )}
            <span className="text-[11px] text-night/60 font-mono font-medium ml-auto flex items-center gap-1">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span>{guide.rating.toFixed(1)} · {completedTours} {t.guides.toursCount}</span>
            </span>
          </div>

          {/* Specializations Tags */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {visibleSpecs.map((tag) => (
              <CategoryBadge
                key={tag}
                label={(t.categories as Record<string, string>)[tag] || tag}
              />
            ))}
            {extraSpecsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper text-night/50 font-mono font-bold border border-majolica/20">
                +{extraSpecsCount}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-majolica/15 mt-2">
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

      {/* Verification Breakdown Modal */}
      <GuideVerificationModal
        guide={guide}
        mode={modalMode}
        onClose={() => setModalMode(null)}
        onBook={(g) => {
          setModalMode(null);
          onBook(g);
        }}
      />
    </>
  );
}
