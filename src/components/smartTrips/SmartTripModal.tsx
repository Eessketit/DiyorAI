import React from "react";
import { SmartTrip, TravelersModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { ICON_MAP } from "@/lib/iconMap";
import { calculateSmartTripGroupCost } from "@/lib/smartTrips";
import { MOCK_EXTENDED_GUIDES } from "@/data/guidesData";
import { getGuideDisplayName } from "../guides/GuideCard";

interface SmartTripModalProps {
  trip: SmartTrip | null;
  travelers?: TravelersModel;
  isAdded?: boolean;
  onClose: () => void;
  onToggleAdd: (trip: SmartTrip) => void;
  onSelectGuide?: (guideId: string) => void;
}

export default function SmartTripModal({
  trip,
  travelers,
  isAdded,
  onClose,
  onToggleAdd,
}: SmartTripModalProps) {
  const { t, language } = useTranslation();

  if (!trip) return null;

  const title = trip.title[language] || trip.title.ru;
  const description = trip.description[language] || trip.description.ru;
  const groupCost = calculateSmartTripGroupCost(trip, travelers);

  // Find linked guides from guidesData
  const linkedGuides = (trip.guideIds || [])
    .map((id) => MOCK_EXTENDED_GUIDES.find((g) => g.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-plaster border border-sand rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-scale-in text-ink max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-white border-b border-sand p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-sand/30 border border-sand flex items-center justify-center text-3xl shrink-0">
              {trip.image || "🏔"}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-registan/15 text-registan uppercase">
                  {trip.tag ? trip.tag[language] || trip.tag.ru : "Smart Trip"}
                </span>
                <span className="text-xs text-night/50">📍 {trip.destination}</span>
              </div>
              <h2 className="font-display text-2xl font-black text-ink">{title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-sand/40 hover:bg-sand flex items-center justify-center text-sm font-bold text-ink transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Price & Group Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-sand shadow-xs">
            <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-sand/70">
              <div>
                <span className="text-night/50 text-xs block font-semibold">
                  {language === "uz" ? "Bir kishi uchun narx:" : language === "en" ? "Price per adult:" : "Стоимость на взрослого:"}
                </span>
                <span className="font-display font-black text-2xl text-ink">
                  ${trip.pricePerAdult}
                </span>
              </div>

              {travelers && (
                <div className="text-right">
                  <span className="text-night/50 text-xs block font-semibold">
                    {language === "uz" ? `Guruh uchun jami (${travelers.total} kishi):` : language === "en" ? `Total for group (${travelers.total} pers):` : `Итого на группу (${travelers.total} чел):`}
                  </span>
                  <span className="font-display font-black text-2xl text-emerald-800">
                    ${groupCost}
                  </span>
                  <span className="text-[10px] text-night/50 block">
                    ({travelers.adults} {t.booking.adults}{travelers.children > 0 ? `, ${travelers.children} ${t.booking.children}` : ""})
                  </span>
                </div>
              )}
            </div>

            <p className="text-night/80 leading-relaxed pt-3 text-xs sm:text-sm">
              {description}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl p-5 border border-sand">
            <h4 className="font-display font-bold text-ink text-sm mb-3">
              ✨ {language === "uz" ? "Asosiy qulayliklar va afzalliklar" : language === "en" ? "Highlights & Best Experiences" : "Ключевые впечатления"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-night/80">
              {trip.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-plaster/50 border border-sand/60">
                  <span className="text-emerald-700 font-bold">✓</span>
                  <span>{h[language] || h.ru}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Optionals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-200/70">
              <h5 className="font-bold text-emerald-950 text-xs uppercase tracking-wider mb-2">
                🟢 {language === "uz" ? "Narxga kiritilgan" : language === "en" ? "Included in Price" : "Включено в стоимость"}
              </h5>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {trip.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">✓</span>
                    <span>{item[language] || item.ru}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-200/70">
              <h5 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-2">
                💡 {language === "uz" ? "Qo'shimcha variantlar" : language === "en" ? "Optional Add-ons" : "По желанию (дополнительно)"}
              </h5>
              <ul className="space-y-1.5 text-xs text-amber-900">
                {trip.optional.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{item[language] || item.ru}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Linked Certified Guides */}
          {linkedGuides.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-sand">
              <h4 className="font-display font-bold text-ink text-sm mb-3 flex items-center gap-2">
                <span>{ICON_MAP.guide}</span>
                <span>
                  {language === "uz" ? "Tavsiya etilgan akkreditatsiyalangan gidlar" : language === "en" ? "Recommended Accredited Guides" : "Рекомендуемые гиды для этой локации"}
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedGuides.map((g) => (
                  <div
                    key={g!.id}
                    className="p-3 rounded-xl bg-plaster/60 border border-sand flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{g!.avatar || "👨‍🏫"}</span>
                      <div>
                        <span className="font-bold text-ink block">
                          {getGuideDisplayName(g!.name, language)}
                        </span>
                        <span className="text-[10px] text-night/60">
                          🛡 Trust: {g!.trustScore}/100 · ⭐ {g!.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-registan bg-registan/10 px-2 py-0.5 rounded">
                      🎯 {g!.matchScore || 96}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-white border-t border-sand p-6 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-night/50 block font-semibold">
              {language === "uz" ? "Umumiy qiymat" : language === "en" ? "Total Price" : "Итоговая стоимость"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-ink">
                ${travelers ? groupCost : trip.pricePerAdult}
              </span>
              <span className="text-xs text-night/50">
                {travelers ? `(${travelers.total} чел)` : `/ ${t.trip.costPerPerson}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-sand text-xs font-bold text-ink hover:bg-sand/30 transition-colors"
            >
              {t.guides.modalCloseBtn}
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleAdd(trip);
                onClose();
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                isAdded
                  ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                  : "bg-registan hover:bg-registan/90 text-white"
              }`}
            >
              <span>{isAdded ? "✓" : "+"}</span>
              <span>
                {isAdded
                  ? (language === "uz" ? "Marshrutda mavjud" : language === "en" ? "In Itinerary" : "В маршруте")
                  : (language === "uz" ? "Sayohatga qo'shish" : language === "en" ? "Add to My Trip" : "Добавить в поездку")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
