import Link from "next/link";
import { TimelineStop, TourismObject } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import CategoryBadge from "./common/CategoryBadge";
import { Snowflake, ShieldCheck } from "lucide-react";

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

  const getSlotTitle = (slot?: string) => {
    switch (slot) {
      case "morning":
        return language === "uz" ? "Ertalabki salqin" : language === "en" ? "Morning Cool" : "Утренняя прохлада";
      case "afternoon_indoor":
        return language === "uz" ? "Tushki soya & Muzeylar" : language === "en" ? "Midday Shade & Museums" : "Сиеста в тени & Музеи";
      case "evening":
        return language === "uz" ? "Kechki quyosh botishi" : language === "en" ? "Sunset & Illumination" : "Закат & Вечерняя подсветка";
      default:
        return language === "uz" ? "To'xtash joyi" : language === "en" ? "Stop" : "Остановка";
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
    <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-majolica/30 space-y-6 my-6">
      {stops.map((stop, idx) => {
        const slotTitle = getSlotTitle(stop.bestTimeSlot || stop.timeSlot);

        return (
          <div key={stop.id} className="relative group">
            {/* Timeline node marker */}
            <div className="absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-night text-paper flex items-center justify-center font-bold text-xs sm:text-sm shadow-md border-2 border-majolica font-mono">
              {idx + 1}
            </div>

            {/* Stop Card */}
            <div className="bg-white border border-majolica/20 hover:border-majolica/60 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all">
              {/* Slot & Time Header */}
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <CategoryBadge label={slotTitle} icon={stop.bestTimeSlot === "morning" ? "🌅" : stop.bestTimeSlot === "afternoon_indoor" ? "🏛️" : "🌆"} />
                  <span className="text-xs font-mono font-semibold text-gold">
                    {stop.timeLabel || `Остановка ${idx + 1}`}
                  </span>
                </div>

                <Link
                  href={`/verify?objectId=${stop.id}`}
                  className="text-xs font-bold text-majolica hover:underline flex items-center gap-1 shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{verifyText[language]}</span>
                </Link>
              </div>

              {/* Title & Description */}
              <h3 className="font-display text-xl font-bold text-night mb-1.5 group-hover:text-majolica transition-colors">
                {stop.name}
              </h3>
              <p className="text-sm text-night/75 leading-relaxed mb-4">{stop.description}</p>

              {/* Badges & Practical Info */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-majolica/15 flex-wrap text-xs">
                {/* Categories */}
                <div className="flex gap-1.5 flex-wrap">
                  {stop.categories.map((c) => (
                    <CategoryBadge key={c} label={t.categories[c] || c} />
                  ))}
                </div>

                {/* Ticket Price & Indoor */}
                <div className="flex items-center gap-2 text-night/70 font-medium font-mono text-xs">
                  {stop.ticketPriceUzs && (
                    <span className="bg-paper border border-majolica/20 px-2.5 py-1 rounded-md text-[11px]">
                      🎫 {ticketsText[language]}:{" "}
                      {stop.ticketPriceUzs.resident === 0
                        ? freeText[language]
                        : `${stop.ticketPriceUzs.resident.toLocaleString()} / ${stop.ticketPriceUzs.foreigner.toLocaleString()} UZS`}
                    </span>
                  )}
                  {stop.isIndoor && (
                    <span className="bg-majolica/10 text-night border border-majolica/30 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <Snowflake className="w-3 h-3 text-majolica" />
                      <span>Кондиционер / Тень</span>
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
