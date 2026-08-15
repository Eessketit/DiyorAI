import React from "react";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";
import { BudgetRangeModel } from "@/lib/types";

interface BudgetRangeSliderProps {
  value: BudgetRangeModel;
  onChange: (value: BudgetRangeModel) => void;
  title?: string;
  subtitle?: string;
}

const PRESETS = [
  { label: "$30", min: 0, max: 30 },
  { label: "$50", min: 0, max: 50 },
  { label: "$100", min: 0, max: 100 },
  { label: "$200", min: 0, max: 200 },
  { label: "$500", min: 100, max: 500 },
  { label: "$1,000", min: 200, max: 1000 },
  { label: "$2,500", min: 500, max: 2500 },
  { label: "$5,000+", min: 1000, max: null },
];

export default function BudgetRangeSlider({
  value,
  onChange,
  title,
  subtitle,
}: BudgetRangeSliderProps) {
  const { t, language } = useTranslation();

  const min = value.minBudget ?? 0;
  const max = value.maxBudget ?? 5000;
  const isUnlimited = value.maxBudget === null || value.maxBudget === Infinity || value.maxBudget >= 5000;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value) || 0, (max === Infinity ? 5000 : max) - 10);
    onChange({
      minBudget: newMin,
      maxBudget: isUnlimited ? null : max,
    });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = parseInt(e.target.value) || 5000;
    const newMax = Math.max(rawVal, min + 10);
    onChange({
      minBudget: min,
      maxBudget: newMax >= 5000 ? null : newMax,
    });
  };

  const handleApplyPreset = (presetMin: number, presetMax: number | null) => {
    onChange({
      minBudget: presetMin,
      maxBudget: presetMax,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-sand p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header with Title & Current Value */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="font-display text-base font-bold text-ink flex items-center gap-2">
            <span>{ICON_MAP.budget}</span>
            <span>{title || t.planner.stepBudget}</span>
          </label>
          <p className="text-xs text-night/60 mt-0.5">
            {subtitle || (language === "uz" ? "Xarajatlar ko'lamini belgilang" : language === "en" ? "Set your minimum and maximum spending range" : "Укажите минимальный и максимальный диапазон расходов")}
          </p>
        </div>

        <div className="text-left sm:text-right shrink-0 bg-sand/20 border border-sand/60 px-3.5 py-1.5 rounded-xl">
          <span className="text-[10px] text-night/50 uppercase tracking-wider font-bold block">
            {language === "uz" ? "Tanlangan byudjet" : language === "en" ? "Selected Range" : "Выбранный диапазон"}
          </span>
          <span className="font-display font-black text-ink text-base sm:text-lg">
            ${min} — {isUnlimited ? (language === "uz" ? "$5,000+ (Cheklovsiz)" : language === "en" ? "$5,000+ (Unlimited)" : "$5,000+ (Без лимита)") : `$${max}`}
          </span>
        </div>
      </div>

      {/* Dual Slider Visual Controls */}
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Min Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-night/70">
              <span>{language === "uz" ? "Minimal byudjet:" : language === "en" ? "Minimum budget:" : "Минимум:"}</span>
              <span className="font-bold text-ink">${min}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="10"
              value={min}
              onChange={handleMinChange}
              aria-label="Minimum budget"
              className="w-full h-2 bg-sand/50 rounded-lg appearance-none cursor-pointer accent-clay focus:outline-hidden"
            />
          </div>

          {/* Max Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-night/70">
              <span>{language === "uz" ? "Maksimal byudjet:" : language === "en" ? "Maximum budget:" : "Максимум:"}</span>
              <span className="font-bold text-registan">
                {isUnlimited ? "$5,000+ 💎" : `$${max}`}
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={isUnlimited ? 5000 : max}
              onChange={handleMaxChange}
              aria-label="Maximum budget"
              className="w-full h-2 bg-sand/50 rounded-lg appearance-none cursor-pointer accent-registan focus:outline-hidden"
            />
          </div>
        </div>

        {/* Visual Track Representation */}
        <div className="w-full bg-sand/30 h-2 rounded-full overflow-hidden relative">
          <div
            className="absolute top-0 bottom-0 bg-gradient-to-r from-clay to-registan rounded-full"
            style={{
              left: `${Math.min(95, (min / 5000) * 100)}%`,
              right: `${isUnlimited ? 0 : Math.max(0, 100 - (max / 5000) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Quick Presets Pills */}
      <div>
        <span className="text-[10px] text-night/50 uppercase tracking-wider font-bold block mb-1.5">
          {language === "uz" ? "Tezkor tanlov:" : language === "en" ? "Quick Presets:" : "Быстрые варианты:"}
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {PRESETS.map((p, idx) => {
            const isSelected =
              min === p.min && (p.max === null ? isUnlimited : max === p.max);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p.min, p.max)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-registan text-white shadow-xs scale-102"
                    : "bg-plaster border border-sand text-ink hover:bg-sand/40"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
