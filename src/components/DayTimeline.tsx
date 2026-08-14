import Link from "next/link";
import { TimelineStop, TourismObject } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface DayTimelineProps {
  stops: (TourismObject & {
    score: number;
    timeSlot?: string;
    timeLabel?: string;
    transitFromPrevMin?: number;
  })[];
  dayNumber: number;
}

export default function DayTimeline({ stops, dayNumber }: DayTimelineProps) {
  const { t, language } = useTranslation();

  const getSlotIcon = (slot?: string) => {
    switch (slot) {
      case "morning":
        return "🌅";
      case "afternoon_indoor":
        return "☀️";
      case "evening":
        return "🌆";
      default:
        return "📍";
    }
  };

  const getSlotBadge = (slot?: string) => {
    switch (slot) {
      case "morning":
        return {
          title: language === "uz" ? "Ertalabki salqin" : language === "en" ? "Morning Cool" : "Утренняя прохлада",
          color: "bg-amber-500/15 text-amber-900 border-amber-500/30",
        };
      case "afternoon_indoor":
        return {
          title: language === "uz" ? "Tushki soya & Muzeylar" : language === "en" ? "Midday Shade & Museums" : "Сиеста в тени & Музеи",
          color: "bg-blue-500/15 text-blue-900 border-blue-500/30",
        };
      case "evening":
        return {
          title: language === "uz" ? "Kechki quyosh botishi" : language === "en" ? "Sunset & Illumination" : "Закат & Вечерняя подсветка",
          color: "bg-purple-500/15 text-purple-900 border-purple-500/30",
        };
      default:
        return {
          title: "Остановка",
          color: "bg-sand text-ink border-sand",
        };
    }
  };

  const verifyText = {
    ru: "Проверить факты →",
    uz: "Faktlarni tekshirish →",
    en: "Verify Facts →",
  };

  const ticketsText = {
    ru: "Билеты",
    uz: "Chiptalar",
    en: "Tickets",
  };

  const freeText = {
    ru: "Бесплатно",
    uz: "Bepul",
    en: "Free",
  };

  return (
    <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-sand/90 space-y-6 my-6">
      {stops.map((stop, idx) => {
        const slotConfig = getSlotBadge(stop.bestTimeSlot || stop.timeSlot);
        const icon = getSlotIcon(stop.bestTimeSlot || stop.timeSlot);

        return (
          <div key={stop.id} className="relative group">
            {/* Timeline node marker */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-clay text-plaster flex items-center justify-center font-bold text-xs sm:text-sm shadow-md border-2 border-white">
              {idx + 1}
            </div>

            {/* Stop Card */}
            <div className="bg-white border border-sand hover:border-registan/60 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
              {/* Slot & Time Header */}
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base">{icon}</span>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${slotConfig.color}`}
                  >
                    {slotConfig.title}
                  </span>
                  <span className="text-xs font-semibold text-night/60">
                    {stop.timeLabel || `Остановка ${idx + 1}`}
                  </span>
                </div>

                <Link
                  href={`/verify?objectId=${stop.id}`}
                  className="text-xs font-bold text-registan hover:underline flex items-center gap-1 shrink-0"
                >
                  {verifyText[language]}
                </Link>
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-xl font-bold text-ink mb-1.5 group-hover:text-clay transition-colors">
                {stop.name}
              </h3>
              <p className="text-sm text-night/75 leading-relaxed mb-4">{stop.description}</p>

              {/* Badges & Practical Info */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-sand/50 flex-wrap text-xs">
                {/* Categories */}
                <div className="flex gap-1.5 flex-wrap">
                  {stop.categories.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-full bg-plaster border border-sand text-ink text-[11px] font-medium"
                    >
                      {t.categories[c] || c}
                    </span>
                  ))}
                </div>

                {/* Ticket Price & Indoor */}
                <div className="flex items-center gap-2 text-night/70 font-medium">
                  {stop.ticketPriceUzs && (
                    <span className="bg-sand/30 px-2.5 py-1 rounded-md text-[11px]">
                      🎫 {ticketsText[language]}:{" "}
                      {stop.ticketPriceUzs.resident === 0
                        ? freeText[language]
                        : `${stop.ticketPriceUzs.resident.toLocaleString()} / ${stop.ticketPriceUzs.foreigner.toLocaleString()} UZS`}
                    </span>
                  )}
                  {stop.isIndoor && (
                    <span className="bg-blue-500/10 text-blue-900 border border-blue-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                      ❄️ Кондиционер / Тень
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
