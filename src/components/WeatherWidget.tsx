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
      <div className="bg-white border border-sand rounded-2xl p-6 mb-8 animate-pulse">
        <div className="h-4 bg-sand/40 rounded w-1/3 mb-4"></div>
        <div className="h-16 bg-sand/20 rounded mb-4"></div>
        <div className="h-10 bg-sand/30 rounded"></div>
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
    <div className="bg-gradient-to-br from-white via-plaster/40 to-registan/5 border border-registan/30 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌤️</span>
          <div>
            <h3 className="font-display text-lg text-ink">{t.weather.title}</h3>
            <p className="text-xs text-night/60">
              {t.weather.forecast} ({t.regions[weather.region]})
            </p>
          </div>
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-registan/15 text-clay border border-registan/30">
          Smart AI Weather Advisor
        </span>
      </div>

      {/* Daily Forecast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
        {weather.days.map((d) => (
          <div
            key={d.dayNumber}
            className="bg-white/80 backdrop-blur border border-sand rounded-xl p-3 text-center shadow-sm"
          >
            <p className="text-xs font-semibold text-night/70 mb-1">
              {dayLabel} {d.dayNumber}
            </p>
            <div className="text-2xl my-1">{renderIcon(d.icon)}</div>
            <p className="font-display text-base font-bold text-ink">
              +{d.tempMax}°
              <span className="text-xs font-normal text-night/50 ml-1">+{d.tempMin}°</span>
            </p>
            <p className="text-[11px] text-night/60 mt-0.5 truncate">{d.condition}</p>
          </div>
        ))}
      </div>

      {/* Smart Advice Box */}
      <div className="bg-sand/30 border border-sand/70 rounded-xl p-4 flex items-start gap-3 text-sm text-ink leading-relaxed">
        <span className="text-lg shrink-0 mt-0.5">💡</span>
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider text-clay mb-1">
            {t.weather.smartAdvice}
          </p>
          <p className="text-night/80">{weather.advice}</p>
        </div>
      </div>
    </div>
  );
}
