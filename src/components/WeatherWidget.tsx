import React from "react";
import { WeatherReport } from "@/lib/weather";
import { useTranslation } from "@/lib/i18n";

interface WeatherWidgetProps {
  weather: WeatherReport | null;
  loading?: boolean;
}

export default function WeatherWidget({ weather, loading }: WeatherWidgetProps) {
  const { t, language } = useTranslation();

  if (loading) {
    return (
      <div className="bg-white border border-majolica/20 rounded-2xl p-6 mb-8 animate-pulse">
        <div className="h-4 bg-paper rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-paper/50 rounded mb-4"></div>
        <div className="h-10 bg-paper/70 rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  const renderIcon = (icon: string) => {
    switch (icon) {
      case "hot":
        return "☀️🔥";
      case "rain":
        return "🌧️";
      case "cloud":
        return "☁️";
      case "cloud-sun":
        return "⛅";
      default:
        return "☀️";
    }
  };

  const dayLabel = language === "uz" ? "Kun" : language === "en" ? "Day" : "День";

  return (
    <div className="bg-white border border-majolica/20 rounded-2xl p-6 mb-8 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌤️</span>
          <div>
            <h3 className="font-display text-lg text-night font-bold">{t.weather.title}</h3>
            <p className="text-xs text-night/60 font-mono">
              {t.weather.forecast} ({t.regions[weather.region]})
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-majolica/10 text-night border border-majolica/30">
          Smart AI Weather Advisor
        </span>
      </div>

      {/* Daily Forecast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
        {weather.days.map((d) => (
          <div
            key={d.dayNumber}
            className="bg-paper/70 border border-majolica/20 rounded-xl p-3 text-center shadow-2xs"
          >
            <p className="text-xs font-mono font-semibold text-night/70 mb-1">
              {dayLabel} {d.dayNumber}
            </p>
            <div className="text-2xl my-1">{renderIcon(d.icon)}</div>
            <p className="font-mono text-base font-bold text-night">
              <span className="text-gold">+{d.tempMax}°</span>
              <span className="text-xs font-normal text-night/50 ml-1">+{d.tempMin}°</span>
            </p>
            <p className="text-[11px] text-night/60 mt-0.5 truncate font-mono">{d.condition}</p>
          </div>
        ))}
      </div>

      {/* Smart Advice Box */}
      <div className="bg-paper border border-majolica/20 rounded-xl p-4 flex items-start gap-3 text-sm text-night leading-relaxed">
        <span className="text-lg shrink-0 mt-0.5">💡</span>
        <div>
          <p className="font-mono font-bold text-xs uppercase tracking-wider text-majolica mb-1">
            {t.weather.smartAdvice}
          </p>
          <p className="text-night/80 text-xs sm:text-sm font-light">{weather.advice}</p>
        </div>
      </div>
    </div>
  );
}
