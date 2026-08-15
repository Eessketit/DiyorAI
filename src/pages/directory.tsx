import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  UserCheck,
  Sparkles,
  MapPin,
  X,
} from "lucide-react";
import ExperienceIcon from "@/components/common/ExperienceIcon";
import SurvivalGuideModal from "@/components/SurvivalGuideModal";

export default function DirectoryPage() {
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = t.directory.categories;

  // Flatten all items across categories or filter by active category
  const filteredItems = useMemo(() => {
    let itemsList: {
      categoryId: string;
      categoryTitle: string;
      categoryIcon: string;
      name: string;
      tag: string;
      details: string;
      linkUrl?: string;
    }[] = [];

    categories.forEach((cat) => {
      if (activeCategory === "all" || activeCategory === cat.id) {
        cat.items.forEach((item) => {
          itemsList.push({
            categoryId: cat.id,
            categoryTitle: cat.title,
            categoryIcon: cat.icon,
            ...item,
          });
        });
      }
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      itemsList = itemsList.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.tag.toLowerCase().includes(q) ||
          i.details.toLowerCase().includes(q) ||
          i.categoryTitle.toLowerCase().includes(q)
      );
    }

    return itemsList;
  }, [categories, activeCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-night text-gold border border-gold/30 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 text-gold" />
          <span>Diyorpedia · Цифровой путеводитель</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-night mb-3 tracking-tight">
          {t.directory.title}
        </h1>
        <p className="text-night/70 text-sm sm:text-base leading-relaxed font-light">
          {t.directory.subtitle}
        </p>

        {/* Quick CTA back to AI Planner */}
        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brick hover:bg-brick/90 text-paper text-xs font-bold transition-all shadow-md hover:scale-102 font-mono"
          >
            <Sparkles className="w-4 h-4" />
            <span>Спланировать поездку в DiyorAI →</span>
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs font-bold transition-all shadow-md hover:scale-102 font-mono"
          >
            <UserCheck className="w-4 h-4" />
            <span>Каталог гидов →</span>
          </Link>
        </div>
      </div>

      {/* Logistics & Survival Guide Banner */}
      <SurvivalGuideModal />

      {/* Search & Category Filter Toolbar */}
      <div className="bg-white border border-sand rounded-3xl p-5 sm:p-6 mb-8 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-night/40" />
          <input
            type="text"
            placeholder="Поиск по городам, горам, истории, блюдам и достопримечательностям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl border border-sand bg-paper text-xs sm:text-sm font-medium text-night placeholder:text-night/40 focus:outline-hidden focus:border-majolica focus:bg-white"
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

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all font-mono ${
              activeCategory === "all"
                ? "bg-night text-paper shadow-xs"
                : "bg-paper border border-majolica/30 text-night hover:bg-majolica/10"
            }`}
          >
            Все разделы ({categories.reduce((acc, c) => acc + c.items.length, 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? "bg-majolica text-paper shadow-xs"
                  : "bg-paper border border-majolica/30 text-night hover:bg-majolica/10"
              }`}
            >
              <ExperienceIcon
                name={cat.icon}
                className={`w-3.5 h-3.5 ${activeCategory === cat.id ? "text-paper" : "text-majolica"}`}
              />
              <span>{cat.title}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeCategory === cat.id ? "bg-white/20 text-paper" : "bg-sand/60 text-night/60"
                }`}
              >
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-sand rounded-3xl p-8">
          <Search className="w-10 h-10 text-majolica mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-night mb-1">Ничего не найдено</h3>
          <p className="text-xs text-night/60 max-w-md mx-auto mb-6 font-light">
            Попробуйте изменить поисковый запрос или выбрать другой раздел.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="px-5 py-2.5 rounded-xl bg-majolica text-paper text-xs font-bold hover:bg-majolica/90 transition-all"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-sand hover:border-majolica/60 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-majolica uppercase flex items-center gap-1.5">
                    <ExperienceIcon name={item.categoryIcon} className="w-3.5 h-3.5 text-majolica" />
                    <span>{item.categoryTitle}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-gold/15 text-gold shrink-0">
                    {item.tag}
                  </span>
                </div>
                <h4 className="font-display font-bold text-night text-base sm:text-lg mb-2 group-hover:text-majolica transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-night/70 leading-relaxed font-light">{item.details}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-sand flex items-center justify-between gap-2">
                <Link
                  href="/guides"
                  className="text-xs font-mono font-bold text-majolica hover:text-majolica/80 inline-flex items-center gap-1"
                >
                  <span>Найти гида</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  href="/"
                  className="text-[11px] font-mono text-night/50 hover:text-night inline-flex items-center gap-1"
                >
                  <span>В маршрут</span>
                  <Sparkles className="w-3 h-3 text-gold" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
