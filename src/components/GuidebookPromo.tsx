import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { GUIDEBOOK_URL } from "@/lib/config";
import { BookOpen, Compass, ArrowRight } from "lucide-react";

export default function GuidebookPromo() {
  const { language } = useTranslation();

  const title = {
    ru: "🇺🇿 Всё для исследования Узбекистана",
    en: "🇺🇿 Explore Uzbekistan Guidebook",
    uz: "🇺🇿 O'zbekistonni kashf etish uchun qo'llanma",
  };

  const subtitle = {
    ru: "Города • История • Культура • Гастрономия • Природа • Транспорт",
    en: "Cities • History • Culture • Gastronomy • Nature • Logistics",
    uz: "Shaharlar • Tarix • Madaniyat • Milliy taomlar • Tabiat • Transport",
  };

  const description = {
    ru: "Полный цифровой справочник Diyorpedia для подготовки к поездке: от расписания поездов Afrosiyob до этикета в чайханах и секретных горных локаций.",
    en: "Your comprehensive digital companion Diyorpedia to Uzbekistan: from Afrosiyob train tips to teahouse etiquette and secret mountain trails.",
    uz: "Sayohatga to'liq tayyorgarlik uchun raqamli ma'lumotnoma Diyorpedia: Afrosiyob poyezdlaridan tortib choyxona odoblari va yashirin tog' manzillarigacha.",
  };

  const ctaText = {
    ru: "Открыть Diyorpedia",
    en: "Open Diyorpedia",
    uz: "Diyorpedia-ni ochish",
  };

  return (
    <div className="my-12 bg-night text-paper rounded-3xl p-6 sm:p-8 shadow-xl border border-majolica/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
      <div className="space-y-2 max-w-2xl">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-majolica" />
          <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-gold font-bold">
            Travel Guidebook · Diyorpedia
          </span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-paper">
          {title[language]}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-majolica font-mono">
          {subtitle[language]}
        </p>
        <p className="text-xs text-paper/75 leading-relaxed font-light">
          {description[language]}
        </p>
      </div>

      {/* Primary CTA Button to Diyorpedia */}
      <a
        href={GUIDEBOOK_URL}
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-majolica hover:bg-majolica/90 text-paper font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-102 shrink-0 self-start md:self-center font-mono cursor-pointer"
      >
        <BookOpen className="w-4 h-4 text-paper" />
        <span>{ctaText[language]}</span>
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
