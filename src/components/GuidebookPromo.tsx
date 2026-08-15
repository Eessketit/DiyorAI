import React from "react";
import { useTranslation } from "@/lib/i18n";
import { GUIDEBOOK_URL } from "@/lib/config";
import { ICON_MAP } from "@/lib/iconMap";

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
    ru: "Полный цифровой справочник для подготовки к поездке: от расписания поездов Afrosiyob до этикета в чайханах и секретных горных локаций.",
    en: "Your comprehensive digital companion to Uzbekistan: from Afrosiyob train tips to teahouse etiquette and secret mountain trails.",
    uz: "Sayohatga to'liq tayyorgarlik uchun raqamli ma'lumotnoma: Afrosiyob poyezdlaridan tortib choyxona odoblari va yashirin tog' manzillarigacha.",
  };

  const ctaText = {
    ru: "Открыть полный справочник →",
    en: "Open Guidebook →",
    uz: "Qo'llanmani ochish →",
  };

  return (
    <div className="my-12 bg-gradient-to-r from-night via-ink to-night text-plaster rounded-3xl p-6 sm:p-8 shadow-xl border border-sand/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="space-y-2 max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ICON_MAP.directory}</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-sand/80 font-bold">
            Travel Guidebook · DiyorAI
          </span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-black text-plaster">
          {title[language]}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-sand/90">
          {subtitle[language]}
        </p>
        <p className="text-xs text-plaster/70 leading-relaxed">
          {description[language]}
        </p>
      </div>

      <a
        href={GUIDEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-registan hover:bg-registan/90 text-white font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-102 shrink-0 self-start md:self-center"
      >
        <span>📚</span>
        <span>{ctaText[language]}</span>
      </a>
    </div>
  );
}
