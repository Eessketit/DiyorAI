import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { BookOpen, UserCheck, ArrowRight, MapPin } from "lucide-react";
import ExperienceIcon from "./common/ExperienceIcon";

export default function TravelDirectory() {
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("cities");

  const categories = t.directory.categories;
  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <section id="travel-directory" className="my-16 bg-white border border-sand rounded-3xl p-6 sm:p-10 shadow-xs scroll-mt-24">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-sand/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-majolica" />
            <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
              {t.directory.badge}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-night">
            {t.directory.title}
          </h2>
          <p className="text-night/70 text-sm sm:text-base mt-1 max-w-2xl leading-relaxed font-light">
            {t.directory.subtitle}
          </p>
        </div>

        {/* Primary CTA button to Guides */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs font-bold transition-all shadow-md shrink-0 self-start md:self-auto hover:scale-102"
        >
          <UserCheck className="w-4 h-4" />
          <span>{t.directory.findGuideCta}</span>
        </Link>
      </div>

      {/* Category Pills (Secondary Buttons) */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
              activeCategory === cat.id
                ? "bg-majolica text-paper shadow-md scale-102"
                : "bg-paper border border-majolica/30 text-night hover:bg-majolica/10"
            }`}
          >
            <ExperienceIcon name={cat.icon} className={`w-4 h-4 ${activeCategory === cat.id ? "text-paper" : "text-majolica"}`} />
            <span>{cat.title}</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeCategory === cat.id ? "bg-white/25 text-paper" : "bg-sand/50 text-night/60"
              }`}
            >
              {cat.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Category Description Banner */}
      <div className="bg-paper border border-sand rounded-2xl p-4 sm:p-5 mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white border border-sand flex items-center justify-center text-majolica shrink-0 shadow-2xs">
            <ExperienceIcon name={currentCat.icon} className="w-6 h-6 text-majolica" />
          </div>
          <div>
            <h3 className="font-display font-bold text-night text-lg">{currentCat.title}</h3>
            <p className="text-xs sm:text-sm text-night/70 mt-0.5 font-light">{currentCat.description}</p>
          </div>
        </div>
      </div>

      {/* Items Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCat.items.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-paper/60 border border-sand hover:bg-white hover:border-majolica/60 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="font-display font-bold text-night text-sm sm:text-base leading-snug group-hover:text-majolica transition-colors">
                  {item.name}
                </h4>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-majolica/15 text-majolica shrink-0">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-night/70 leading-relaxed font-light">{item.details}</p>
            </div>

            {item.linkUrl && (
              <div className="mt-4 pt-3 border-t border-sand/60">
                <Link
                  href={item.linkUrl}
                  className="text-xs font-bold text-majolica hover:text-majolica/80 inline-flex items-center gap-1 font-mono"
                >
                  <span>{t.directory.findGuideCta}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
