import React, { useState } from "react";
import Link from "next/link";
import { ICON_MAP } from "@/lib/iconMap";
import { useTranslation } from "@/lib/i18n";

export default function TravelDirectory() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("cities");

  const categories = t.directory.categories;
  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <section className="my-16 bg-white border border-sand rounded-3xl p-6 sm:p-10 shadow-sm">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-sand/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{ICON_MAP.directory}</span>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-registan">
              {t.directory.badge}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-ink">
            {t.directory.title}
          </h2>
          <p className="text-night/70 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed">
            {t.directory.subtitle}
          </p>
        </div>

        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-registan text-white text-xs font-bold hover:bg-registan/90 transition-all shadow-md shrink-0 self-start md:self-auto"
        >
          <span>{ICON_MAP.guide}</span> {t.directory.findGuideCta}
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeCategory === cat.id
                ? "bg-registan text-white shadow-md scale-102"
                : "bg-plaster border border-sand text-ink hover:bg-sand/40"
            }`}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.title}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeCategory === cat.id ? "bg-white/20 text-white" : "bg-sand/50 text-night/60"
              }`}
            >
              {cat.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Category Description Banner */}
      <div className="bg-sand/20 border border-sand/70 rounded-2xl p-4 sm:p-5 mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-white rounded-xl shadow-xs shrink-0">{currentCat.icon}</span>
          <div>
            <h3 className="font-display font-bold text-ink text-lg">{currentCat.title}</h3>
            <p className="text-xs sm:text-sm text-night/70 mt-0.5">{currentCat.description}</p>
          </div>
        </div>
      </div>

      {/* Items Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCat.items.map((item, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded-2xl bg-plaster/50 border border-sand hover:bg-white hover:border-sand/90 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-display font-bold text-ink text-sm sm:text-base leading-snug">
                  {item.name}
                </h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-sand/40 text-registan shrink-0">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-night/70 leading-relaxed">{item.details}</p>
            </div>

            {item.linkUrl && (
              <div className="mt-4 pt-3 border-t border-sand/60">
                <Link
                  href={item.linkUrl}
                  className="text-xs font-bold text-registan hover:underline inline-flex items-center gap-1"
                >
                  {t.directory.findGuideCta}
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
