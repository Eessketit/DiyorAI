import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import { Guide, Category } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";
import GuideCard from "@/components/guides/GuideCard";
import GuideProfileModal from "@/components/guides/GuideProfileModal";
import GuideBookingModal from "@/components/guides/GuideBookingModal";
import { MOCK_EXTENDED_GUIDES } from "@/data/guidesData";

const LOCATIONS = [
  { id: "all", label: "Все локации" },
  { id: "samarkand", label: "Самарканд" },
  { id: "bukhara", label: "Бухара" },
  { id: "khiva", label: "Хива" },
  { id: "tashkent", label: "Ташкент (Город)" },
  { id: "tashkent_region", label: "Ташкентская обл. (Чимган/Амирсой)" },
  { id: "shahrisabz", label: "Шахрисабз" },
  { id: "fergana", label: "Фергана & Риштан" },
  { id: "andijan", label: "Андижан" },
  { id: "nukus", label: "Нукус & Арал" },
  { id: "termez", label: "Термез" },
];

const SPECIALIZATIONS = [
  { id: "all", label: "Все темы" },
  { id: "history", label: "🏛 История" },
  { id: "architecture", label: "🕌 Архитектура" },
  { id: "gastronomy", label: "🍽 Гастрономия" },
  { id: "crafts_bazaars", label: "🏺 Ремесла" },
  { id: "nature_hiking", label: "🏔 Горы & Хайкинг" },
  { id: "photography", label: "📸 Фотография" },
  { id: "night_tours", label: "🌙 Ночные туры" },
  { id: "family_travel", label: "👨‍👩‍👧 Семейные туры" },
  { id: "archaeology", label: "🏺 Археология" },
  { id: "culture", label: "🎨 Культура" },
];

const LANGUAGES = [
  { id: "all", label: "Все языки" },
  { id: "ru", label: "🇷🇺 Русский" },
  { id: "en", label: "🇬🇧 English" },
  { id: "uz", label: "🇺🇿 O'zbek" },
  { id: "fr", label: "🇫🇷 Français" },
  { id: "de", label: "🇩🇪 Deutsch" },
];

const SORT_OPTIONS = [
  { id: "recommended", label: "✨ Рекомендуемые DiyorAI" },
  { id: "trust", label: "🛡 Наивысший Trust Score" },
  { id: "match", label: "🎯 Лучшее совпадение (Match)" },
  { id: "rating", label: "⭐ Высокий рейтинг" },
  { id: "experience", label: "🧭 Наибольший опыт" },
  { id: "price_asc", label: "💰 Сначала доступные" },
];

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
      switch (sortBy) {
        case "trust":
          return (b.trustScore ?? 0) - (a.trustScore ?? 0);
        case "match":
          return (b.matchScore ?? 95) - (a.matchScore ?? 95);
        case "rating":
          return b.rating - a.rating;
        case "experience":
          return (b.experienceYears ?? 0) - (a.experienceYears ?? 0);
        case "price_asc":
          return (a.pricePerTourUsd ?? 40) - (b.pricePerTourUsd ?? 40);
        case "recommended":
        default:
          return (b.trustScore ?? 90) * 0.5 + b.rating * 10 - ((a.trustScore ?? 90) * 0.5 + a.rating * 10);
      }
    });

    return list;
  }, [selectedLocation, selectedSpec, selectedLanguage, sortBy, verifiedOnly, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <p className="uppercase tracking-[0.2em] text-registan text-xs font-bold mb-2">
          {ICON_MAP.guide} Аккредитованные гиды Узбекистана · Trust & Verification
        </p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink font-black mb-3">
          Найдите проверенного гида для вашего путешествия
        </h1>
        <p className="text-night/70 text-sm sm:text-base leading-relaxed">
          Каждый гид в DiyorAI проходит аудит личности, лицензии и профессиональной надёжности.
          Изучайте подтверждённые отзывы и бронируйте без наценок.
        </p>
      </div>

      {/* Trust Guarantee Banner */}
      <div className="bg-white border border-sand rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold shrink-0">
            {ICON_MAP.trust}
          </div>
          <div>
            <h4 className="font-display font-bold text-ink text-sm">
              Гарантия надёжности DiyorAI (Trust Guarantee)
            </h4>
            <p className="text-xs text-night/60">
              100% аккредитация Комитета по туризму · Проверка биометрии · Прозрачный рейтинг
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            ✓ 25+ проверенных гидов
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-sand/40 text-ink font-bold">
            🛡 Средний Trust Score: 94/100
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white border border-sand rounded-3xl p-6 mb-8 space-y-5 shadow-xs">
        {/* Search input and Sort dropdown */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-night/40 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Поиск по имени гида или городу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-sand bg-plaster/50 text-xs text-ink focus:outline-hidden focus:border-registan transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-night/60 shrink-0">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-sand bg-white text-xs font-bold text-ink focus:outline-hidden focus:border-registan shadow-xs"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location selector pills */}
        <div>
          <span className="text-xs font-bold text-night/70 block mb-2">📍 Локация / Город:</span>
          <div className="flex gap-2 flex-wrap">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedLocation === loc.id
                    ? "bg-registan text-white border-registan shadow-xs"
                    : "border-sand bg-white text-ink hover:bg-sand/30"
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Specialization pills & Language dropdown & Verified checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-sand/60">
          <div className="md:col-span-2">
            <span className="text-xs font-bold text-night/70 block mb-2">
              🎯 Тематика экскурсии:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpec(spec.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                    selectedSpec === spec.id
                      ? "bg-sand text-ink border-sand-dark font-bold"
                      : "border-sand/70 bg-white text-night/70 hover:bg-sand/20"
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-night/70 block mb-1">🗣 Язык гида:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-sand bg-white text-xs font-semibold text-ink"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-registan focus:ring-registan"
              />
              <span className="text-xs font-bold text-ink flex items-center gap-1">
                <span>{ICON_MAP.verified}</span> Только 100% проверенные гиды
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="bg-white border border-sand rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <span className="text-4xl block">🔍</span>
          <h3 className="font-display text-xl font-bold text-ink">
            По выбранным фильтрам гиды не найдены
          </h3>
          <p className="text-xs text-night/60 max-w-md mx-auto">
            Попробуйте выбрать «Все локации» или сбросить фильтры тематики.
          </p>
          <button
            onClick={() => {
              setSelectedLocation("all");
              setSelectedSpec("all");
              setSelectedLanguage("all");
              setVerifiedOnly(false);
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-sand/50 text-ink font-bold text-xs hover:bg-sand"
          >
            Сбросить фильтры
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

      {/* Guide Modals */}
      <GuideProfileModal
        guide={selectedGuideForProfile}
        onClose={() => setSelectedGuideForProfile(null)}
        onBook={(g) => setSelectedGuideForBooking(g)}
      />

      <GuideBookingModal
        guide={selectedGuideForBooking}
        isOpen={Boolean(selectedGuideForBooking)}
        onClose={() => setSelectedGuideForBooking(null)}
      />
    </div>
  );
}
