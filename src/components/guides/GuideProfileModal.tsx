import React, { useState } from "react";
import { Guide, Category } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";
import { getGuideDisplayName } from "./GuideCard";

interface GuideProfileModalProps {
  guide: Guide | null;
  onClose: () => void;
  onBook: (guide: Guide) => void;
}

export default function GuideProfileModal({ guide, onClose, onBook }: GuideProfileModalProps) {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<"overview" | "trust" | "reviews">("overview");

  if (!guide) return null;

  const displayName = getGuideDisplayName(guide.name, language);
  const trustScore = guide.trustScore ?? 94;
  const matchScore = guide.matchScore ?? 96;
  const price = guide.pricePerTourUsd ? `$${guide.pricePerTourUsd}` : guide.priceRange;

  const aboutText = guide.about
    ? guide.about[language] || guide.about.ru || guide.about.en
    : "";

  const whyRecList = guide.whyRecommended
    ? guide.whyRecommended[language] || guide.whyRecommended.ru || []
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-plaster border border-sand rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl animate-scale-in text-ink max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-white border-b border-sand p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sand/30 border border-sand flex items-center justify-center text-3xl shrink-0">
              {guide.avatar || "👨‍🏫"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl font-black text-ink">{displayName}</h2>
                {guide.verification?.status === "verified" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <span>{ICON_MAP.verified}</span> {t.guides.verifiedBadge} DiyorAI
                  </span>
                )}
              </div>
              <p className="text-sm text-night/70 mt-1 flex items-center gap-2 flex-wrap">
                <span>📍 {guide.city}</span>
                <span>·</span>
                <span>🧭 {guide.experienceYears ?? 7} {t.trip.days}</span>
                <span>·</span>
                <span>⭐ {guide.rating.toFixed(1)} ({guide.completedTours ?? 150} {t.guides.toursCount})</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-sand/40 hover:bg-sand flex items-center justify-center text-sm font-bold text-ink transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 border-b border-sand px-6 py-2 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "overview"
                ? "bg-registan text-white shadow-xs"
                : "text-night/70 hover:bg-sand/30"
            }`}
          >
            {t.guides.modalOverviewTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("trust")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === "trust"
                ? "bg-registan text-white shadow-xs"
                : "text-night/70 hover:bg-sand/30"
            }`}
          >
            <span>{ICON_MAP.trust}</span> {t.guides.modalTrustTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === "reviews"
                ? "bg-registan text-white shadow-xs"
                : "text-night/70 hover:bg-sand/30"
            }`}
          >
            {t.guides.modalReviewsTab} ({guide.reviews?.count ?? guide.reviewsList?.length ?? 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "overview" && (
            <>
              {/* Dual Scores Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-sand shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-night/60 uppercase tracking-wider">
                      🛡 {t.guides.trustScoreLabel}
                    </span>
                    <span className="text-xl font-black text-ink">{trustScore}/100</span>
                  </div>
                  <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${trustScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-night/60 mt-2">
                    {t.guides.modalTrustEvidenceDesc}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-sand shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-registan uppercase tracking-wider">
                      🎯 {t.guides.matchScoreLabel}
                    </span>
                    <span className="text-xl font-black text-registan">{matchScore}%</span>
                  </div>
                  <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-registan h-full rounded-full"
                      style={{ width: `${matchScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-night/60 mt-2">
                    {t.guides.subtitle}
                  </p>
                </div>
              </div>

              {/* About text */}
              {aboutText && (
                <div className="bg-white rounded-2xl p-5 border border-sand">
                  <h4 className="font-display font-bold text-ink text-sm mb-2">{t.guides.modalOverviewTab}</h4>
                  <p className="text-sm text-night/80 leading-relaxed">{aboutText}</p>
                </div>
              )}

              {/* Specializations & Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-sand">
                  <h4 className="font-display font-bold text-ink text-sm mb-3">
                    {t.guides.specFilter}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {guide.specializationTags.map((spec) => (
                      <span
                        key={spec}
                        className="text-xs px-3 py-1 rounded-full bg-sand/30 border border-sand text-ink font-medium"
                      >
                        {(t.categories as Record<string, string>)[spec] || spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-sand">
                  <h4 className="font-display font-bold text-ink text-sm mb-3">{t.guides.languageFilter}</h4>
                  <div className="space-y-2">
                    {guide.languages.map((lang, idx) => {
                      const label = typeof lang === "string" ? lang.toUpperCase() : lang.label;
                      const level = typeof lang === "object" ? lang.level : "verified";
                      return (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ink">{label}</span>
                          <span className="px-2 py-0.5 rounded-full bg-sand/40 text-night/70 text-[10px] font-bold uppercase">
                            {level}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Why DiyorAI Recommends */}
              {whyRecList.length > 0 && (
                <div className="bg-sand/20 border border-sand/80 rounded-2xl p-5">
                  <h4 className="font-display font-bold text-ink text-sm mb-3 flex items-center gap-2">
                    <span>{ICON_MAP.match}</span> {t.guides.modalWhyRecommendedTitle}
                  </h4>
                  <ul className="space-y-2 text-xs text-night/80">
                    {whyRecList.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === "trust" && (
            <div className="space-y-6">
              {/* Trust Evidence Box */}
              <div className="bg-white border border-sand rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold">
                    {ICON_MAP.trust}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-ink text-base">
                      {t.guides.modalTrustEvidenceTitle}
                    </h3>
                    <p className="text-xs text-night/60">
                      {t.guides.modalTrustEvidenceDesc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                    <span className="text-lg">🪪</span>
                    <div>
                      <h5 className="font-bold text-xs text-emerald-950">{t.guides.modalIdentityVerified}</h5>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        {t.guides.modalIdentityDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
                    <span className="text-lg">🎓</span>
                    <div>
                      <h5 className="font-bold text-xs text-blue-950">{t.guides.modalLicenseVerified}</h5>
                      <p className="text-[11px] text-blue-800 mt-0.5">
                        {t.guides.modalLicenseDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand/30 border border-sand flex items-start gap-3">
                    <span className="text-lg">🧭</span>
                    <div>
                      <h5 className="font-bold text-xs text-ink">
                        {guide.completedTours ?? 200}+ {t.guides.toursCount}
                      </h5>
                      <p className="text-[11px] text-night/60 mt-0.5">
                        {t.guides.modalExperienceDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand/30 border border-sand flex items-start gap-3">
                    <span className="text-lg">⏱</span>
                    <div>
                      <h5 className="font-bold text-xs text-ink">
                        {guide.performance?.punctualityRate ?? 99}% {t.guides.modalStatsPunctuality}
                      </h5>
                      <p className="text-[11px] text-night/60 mt-0.5">
                        {t.guides.modalPunctualityDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Experience Radar Breakdown */}
              {guide.reviews && (
                <div className="bg-white border border-sand rounded-2xl p-6 shadow-xs">
                  <h4 className="font-display font-bold text-ink text-sm mb-4">
                    {t.guides.modalRadarTitle}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{t.guides.modalKnowledge}</span>
                        <span>{guide.reviews.knowledge.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-registan h-full rounded-full"
                          style={{ width: `${(guide.reviews.knowledge / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{t.guides.modalCommunication}</span>
                        <span>{guide.reviews.communication.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-registan h-full rounded-full"
                          style={{ width: `${(guide.reviews.communication / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{t.guides.modalService}</span>
                        <span>{guide.reviews.service.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-registan h-full rounded-full"
                          style={{ width: `${(guide.reviews.service / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{t.guides.modalOrganization}</span>
                        <span>{guide.reviews.organization.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-registan h-full rounded-full"
                          style={{ width: `${(guide.reviews.organization / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{t.guides.modalSafety}</span>
                        <span>{guide.reviews.safety.toFixed(1)} / 5.0</span>
                      </div>
                      <div className="w-full bg-sand/40 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-registan h-full rounded-full"
                          style={{ width: `${(guide.reviews.safety / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reliability Stats */}
              {guide.performance && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white border border-sand rounded-xl">
                    <span className="text-xl font-black text-ink block">
                      {guide.performance.completionRate}%
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-night/50 font-bold">
                      {t.guides.modalStatsCompleted}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-sand rounded-xl">
                    <span className="text-xl font-black text-ink block">
                      {guide.performance.punctualityRate}%
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-night/50 font-bold">
                      {t.guides.modalStatsPunctuality}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-sand rounded-xl">
                    <span className="text-xl font-black text-ink block">
                      {guide.performance.responseTime}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-night/50 font-bold">
                      {t.guides.modalStatsResponse}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-sand rounded-xl">
                    <span className="text-xl font-black text-ink block">
                      {guide.performance.cancellationRate}%
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-night/50 font-bold">
                      {t.guides.modalStatsCancellation}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {guide.reviewsList && guide.reviewsList.length > 0 ? (
                guide.reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white border border-sand rounded-2xl shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="font-bold text-ink text-sm">{rev.author}</span>
                        <span className="text-xs text-night/50 ml-2">({rev.date})</span>
                      </div>
                      <span className="text-xs text-amber-600 font-bold">
                        {"⭐".repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-night/80 leading-relaxed mb-2">"{rev.text}"</p>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sand/30 text-night/60 font-medium">
                      {rev.tourType}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white border border-sand rounded-2xl text-night/60 text-xs">
                  {guide.completedTours ?? 100}+ {t.guides.toursCount}. ⭐ {guide.rating.toFixed(1)} / 5.0
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="bg-white border-t border-sand p-6 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-night/60 block">{t.booking.totalCostLabel}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-ink">{price}</span>
              <span className="text-xs text-night/50 font-medium">/ {t.guides.perTour}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-sand text-xs font-bold text-ink hover:bg-sand/30 transition-colors"
            >
              {t.guides.modalCloseBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(guide);
              }}
              className="px-6 py-2.5 rounded-xl bg-registan hover:bg-registan/90 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <span>🔒</span> {t.guides.modalBookGuideBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
