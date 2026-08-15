import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { Guide } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import GuideCard from "@/components/guides/GuideCard";
import GuideProfileModal from "@/components/guides/GuideProfileModal";
import GuideBookingModal from "@/components/guides/GuideBookingModal";
import { MOCK_EXTENDED_GUIDES } from "@/data/guidesData";
import {
  UserCheck,
  ShieldCheck,
  Award,
  Star,
  Search,
  Compass,
  MapPin,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function GuidesPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSpec, setSelectedSpec] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [selectedGuideForProfile, setSelectedGuideForProfile] = useState<Guide | null>(null);
  const [selectedGuideForBooking, setSelectedGuideForBooking] = useState<Guide | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof router.query.region === "string") {
      setSelectedLocation(router.query.region);
    }
  }, [router.isReady, router.query.region]);

  const LOCATIONS = useMemo(() => [
    { id: "all", label: language === "uz" ? "Barcha manzillar" : language === "en" ? "All Locations" : "Все локации" },
    { id: "samarkand", label: t.regions.samarkand },
    { id: "bukhara", label: t.regions.bukhara },
    { id: "khiva", label: t.regions.khiva },
    { id: "tashkent", label: t.regions.tashkent },
    { id: "tashkent_region", label: t.regions.tashkent_region },
    { id: "shahrisabz", label: "Шахрисабз" },
    { id: "fergana", label: "Фергана & Риштан" },
    { id: "andijan", label: "Андижан" },
    { id: "nukus", label: "Нукус & Арал" },
    { id: "termez", label: "Термез" },
  ], [language, t.regions]);

  const SPECIALIZATIONS = useMemo(() => [
    { id: "all", label: language === "uz" ? "Barcha mavzular" : language === "en" ? "All Specialties" : "Все темы" },
    { id: "history", label: t.categories.history },
    { id: "architecture", label: t.categories.architecture },
    { id: "gastronomy", label: t.categories.gastronomy },
    { id: "crafts_bazaars", label: t.categories.crafts_bazaars },
    { id: "nature_hiking", label: t.categories.nature_hiking },
    { id: "photography", label: t.categories.photography },
    { id: "night_tours", label: t.categories.night_tours },
    { id: "family_travel", label: t.categories.family_travel },
    { id: "archaeology", label: t.categories.archaeology },
  ], [language, t.categories]);

  const LANGUAGES = useMemo(() => [
    { id: "all", label: language === "uz" ? "Barcha tillar" : language === "en" ? "All Languages" : "Все языки" },
    { id: "ru", label: "🇷🇺 Русский" },
    { id: "en", label: "🇬🇧 English" },
    { id: "uz", label: "🇺🇿 O'zbek" },
    { id: "fr", label: "🇫🇷 Français" },
    { id: "de", label: "🇩🇪 Deutsch" },
  ], [language]);

  const SORT_OPTIONS = useMemo(() => [
    { id: "recommended", label: language === "uz" ? "DiyorAI tavsiya qilganlar" : language === "en" ? "Recommended by DiyorAI" : "Рекомендуемые DiyorAI" },
    { id: "trust", label: language === "uz" ? "Eng yuqori Trust Score" : language === "en" ? "Highest Trust Score" : "Наивысший Trust Score" },
    { id: "match", label: language === "uz" ? "Eng yaxshi moslik (Match)" : language === "en" ? "Best Match" : "Лучшее совпадение (Match)" },
    { id: "rating", label: language === "uz" ? "Yuqori reyting" : language === "en" ? "Highest Rated" : "Высокий рейтинг" },
    { id: "experience", label: language === "uz" ? "Eng tajribali" : language === "en" ? "Most Experienced" : "Наибольший опыт" },
    { id: "price_asc", label: language === "uz" ? "Avval arzonroq" : language === "en" ? "Lowest Price" : "Сначала доступные" },
  ], [language]);

  const filteredGuides = useMemo(() => {
    let list = [...MOCK_EXTENDED_GUIDES];

    // Location filter
    if (selectedLocation !== "all") {
      list = list.filter(
        (g) =>
          g.region === selectedLocation ||
          (selectedLocation === "tashkent_region" && g.region === "tashkent_region")
      );
    }

    // Specialization filter
    if (selectedSpec !== "all") {
      list = list.filter((g) => g.specializationTags.includes(selectedSpec as any));
    }

    // Language filter
    if (selectedLanguage !== "all") {
      list = list.filter((g) =>
        g.languages.some((l) => (typeof l === "string" ? l === selectedLanguage : l.code === selectedLanguage))
      );
    }

    // Verified only
    if (verifiedOnly) {
      list = list.filter((g) => g.verification?.status === "verified");
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((g) => {
        const nameRu = typeof g.name === "object" ? g.name.ru.toLowerCase() : g.name.toLowerCase();
        const nameEn = typeof g.name === "object" ? g.name.en.toLowerCase() : "";
        const city = g.city.toLowerCase();
        return nameRu.includes(q) || nameEn.includes(q) || city.includes(q);
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "trust") return (b.trustScore ?? 90) - (a.trustScore ?? 90);
      if (sortBy === "match") return (b.matchScore ?? 90) - (a.matchScore ?? 90);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "experience") return (b.experienceYears ?? 5) - (a.experienceYears ?? 5);
      if (sortBy === "price_asc") return (a.pricePerTourUsd ?? 40) - (b.pricePerTourUsd ?? 40);
      // Default: recommended
      return (b.trustScore ?? 90) * 0.5 + (b.matchScore ?? 90) * 0.5 - ((a.trustScore ?? 90) * 0.5 + (a.matchScore ?? 90) * 0.5);
    });

    return list;
  }, [selectedLocation, selectedSpec, selectedLanguage, verifiedOnly, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-paper border border-majolica/20 text-xs font-mono font-bold text-majolica uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.guides.badge}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-night mb-3 tracking-tight">
          {t.guides.title}
        </h1>
        <p className="text-night/70 text-sm sm:text-base leading-relaxed font-light">
          {t.guides.subtitle}
        </p>

        {/* Trust Guarantee Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-left">
          <div className="p-4 bg-white border border-majolica/20 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-majolica/15 text-majolica flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-night block">{t.guides.modalIdentityVerified}</span>
              <span className="text-[11px] text-night/60 font-light">{t.guides.modalIdentityDesc}</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-majolica/20 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-night block">{t.guides.modalLicenseVerified}</span>
              <span className="text-[11px] text-night/60 font-light">{t.guides.modalLicenseDesc}</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-majolica/20 rounded-2xl flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-paper border border-majolica/20 text-majolica flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-gold text-gold" />
            </div>
            <div>
              <span className="text-xs font-bold text-night block">100% Verified Reviews</span>
              <span className="text-[11px] text-night/60 font-light">{t.guides.avgTrustScore}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-majolica/20 rounded-3xl p-5 sm:p-6 mb-8 shadow-xs space-y-4">
        {/* Search Bar & Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-night/40" />
            <input
              type="text"
              placeholder={t.guides.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-majolica/20 bg-paper text-xs sm:text-sm font-medium text-night placeholder:text-night/40 focus:outline-hidden focus:border-majolica focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-night/40 hover:text-night"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 font-mono">
            <span className="text-xs text-night/60 font-semibold hidden sm:inline">{t.guides.sortLabel}:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-majolica/20 bg-white text-xs font-bold text-night focus:outline-hidden focus:border-majolica font-mono"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Pills (Secondary Buttons) */}
        <div>
          <span className="text-[11px] uppercase font-mono tracking-wider font-bold text-night/60 block mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-majolica" />
            <span>{t.guides.locationFilter}</span>
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all font-mono ${
                  selectedLocation === loc.id
                    ? "bg-majolica text-paper shadow-xs"
                    : "bg-paper border border-majolica/30 text-night hover:bg-majolica/10"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specialty Pills & Additional Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-majolica/15">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
            {SPECIALIZATIONS.map((spec) => (
              <button
                key={spec.id}
                onClick={() => setSelectedSpec(spec.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                  selectedSpec === spec.id
                    ? "bg-night text-paper shadow-xs"
                    : "bg-paper border border-majolica/30 text-night/80 hover:bg-majolica/10"
                }`}
              >
                {spec.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            {/* Language dropdown */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-majolica/20 bg-white text-xs font-semibold text-night"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>

            {/* Verified only toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-night font-mono">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-majolica focus:ring-majolica"
              />
              <span>{t.guides.verifiedOnlyLabel}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="text-center py-16 bg-white border border-majolica/20 rounded-3xl p-8">
          <Search className="w-10 h-10 text-majolica mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-night mb-1">
            {t.guides.empty}
          </h3>
          <p className="text-xs text-night/60 max-w-md mx-auto mb-6 font-light">
            {t.guides.subtitle}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedLocation("all");
              setSelectedSpec("all");
              setSelectedLanguage("all");
              setVerifiedOnly(false);
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-xl bg-majolica text-paper text-xs font-bold hover:bg-majolica/90 transition-all shadow-xs"
          >
            {t.guides.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onViewProfile={(g) => setSelectedGuideForProfile(g)}
              onBook={(g) => setSelectedGuideForBooking(g)}
            />
          ))}
        </div>
      )}

      {/* Guide Profile Modal */}
      <GuideProfileModal
        guide={selectedGuideForProfile}
        onClose={() => setSelectedGuideForProfile(null)}
        onBook={(g) => {
          setSelectedGuideForProfile(null);
          setSelectedGuideForBooking(g);
        }}
      />

      {/* Guide Booking Modal */}
      <GuideBookingModal
        guide={selectedGuideForBooking}
        isOpen={Boolean(selectedGuideForBooking)}
        onClose={() => setSelectedGuideForBooking(null)}
      />
    </div>
  );
}
