import React, { useState, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";

export default function FAQSection() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-plan-1": true,
  });

  const faqItems = t.faq.items;

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqItems.map((item) => item.category)));
    return ["all", ...cats];
  }, [faqItems]);

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.tag && item.tag.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [faqItems, selectedCategory, searchQuery]);

  function toggleItem(id: string) {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-registan block mb-2">
          {t.faq.badge}
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-black text-ink mb-3">
          {t.faq.title}
        </h2>
        <p className="text-night/70 text-sm sm:text-base leading-relaxed">
          {t.faq.subtitle}
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto mb-8 relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-night/40 text-base">
          🔍
        </span>
        <input
          type="text"
          placeholder={t.faq.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-sand bg-white text-xs sm:text-sm text-ink placeholder:text-night/40 focus:outline-hidden focus:border-registan shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-night/40 hover:text-ink font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 justify-start sm:justify-center scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCategory === cat
                ? "bg-registan text-white shadow-xs scale-102"
                : "bg-white border border-sand text-ink hover:bg-sand/30"
            }`}
          >
            {cat === "all" ? `✨ ${t.faq.allCategory}` : cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-sand p-6">
          <span className="text-3xl block mb-2">🔍</span>
          <p className="text-night/60 text-sm">{t.faq.emptySearch}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isOpen = Boolean(openItems[item.id]);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isOpen ? "border-registan/50 shadow-sm" : "border-sand hover:border-sand/90 shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl sm:text-2xl shrink-0 p-1.5 bg-sand/30 rounded-xl">
                      {item.categoryIcon}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] bg-sand/60 px-2 py-0.5 rounded font-bold text-night/70 uppercase">
                          {item.category}
                        </span>
                        {item.tag && (
                          <span className="text-[10px] bg-registan/15 text-registan px-2 py-0.5 rounded font-bold">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-ink text-sm sm:text-base leading-snug">
                        {item.question}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`w-7 h-7 rounded-full bg-sand/40 flex items-center justify-center text-xs font-bold text-ink shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-registan/20 text-registan" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-night/80 border-t border-sand/40 space-y-3 animate-fade-in">
                    <p className="leading-relaxed">{item.answer}</p>
                    {item.highlight && (
                      <div className="p-3 bg-sand/20 border-l-3 border-registan rounded-r-xl text-xs font-medium text-ink/90">
                        {item.highlight}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
