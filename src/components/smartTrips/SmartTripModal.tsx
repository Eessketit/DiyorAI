import React from "react";
import { SmartTrip, TravelersModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { calculateSmartTripGroupCost } from "@/lib/smartTrips";
import { MOCK_EXTENDED_GUIDES } from "@/data/guidesData";
import { getGuideDisplayName } from "../guides/GuideCard";
import ExperienceIcon from "../common/ExperienceIcon";
import {
  Sparkles,
  CheckCircle,
  Lightbulb,
  ShieldCheck,
  Star,
  Target,
  UserCheck,
  Check,
  X,
  MapPin,
} from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-paper border border-majolica/30 rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-scale-in text-night max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-white border-b border-majolica/15 p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-paper border border-majolica/20 flex items-center justify-center text-majolica shrink-0">
              <ExperienceIcon name={trip.image} className="w-8 h-8 text-majolica" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-majolica/30 bg-majolica/5 text-night uppercase">
                  {trip.tag ? trip.tag[language] || trip.tag.ru : "Smart Trip"}
                </span>
                <span className="text-xs text-night/60 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-majolica" />
                  <span>{trip.destination}</span>
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-night">{title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-paper border border-majolica/30 hover:bg-majolica/10 flex items-center justify-center text-night transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Price & Group Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-majolica/20 shadow-xs">
            <div className="flex items-center justify-between gap-3 flex-wrap pb-3 border-b border-majolica/15">
              <div>
                <span className="text-night/50 font-mono text-xs block">
                  {language === "uz" ? "Bir kishi uchun narx:" : language === "en" ? "Price per adult:" : "Стоимость на взрослого:"}
                </span>
                <span className="font-mono font-black text-2xl text-night">
                  ${trip.pricePerAdult}
                </span>
              </div>

              {travelers && (
                <div className="text-right">
                  <span className="text-night/50 font-mono text-xs block">
                    {language === "uz" ? `Guruh uchun jami (${travelers.total} kishi):` : language === "en" ? `Total for group (${travelers.total} pers):` : `Итого на группу (${travelers.total} чел):`}
                  </span>
                  <span className="font-mono font-black text-2xl text-gold">
                    ${groupCost}
                  </span>
                  <span className="text-[10px] text-night/50 font-mono block">
                    ({travelers.adults} {t.booking.adults}{travelers.children > 0 ? `, ${travelers.children} ${t.booking.children}` : ""})
                  </span>
                </div>
              )}
            </div>

            <p className="text-night/80 leading-relaxed pt-3 text-xs sm:text-sm font-light">
              {description}
            </p>
          </div>

          {/* Highlights */}
          <div className="bg-white rounded-2xl p-5 border border-majolica/20">
            <h4 className="font-display font-bold text-night text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>{language === "uz" ? "Asosiy qulayliklar va afzalliklar" : language === "en" ? "Highlights & Best Experiences" : "Ключевые впечатления"}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-night/80">
              {trip.highlights.map((h, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-paper/60 border border-majolica/20">
                  <Check className="w-3.5 h-3.5 text-majolica shrink-0 mt-0.5" />
                  <span>{h[language] || h.ru}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Optionals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-majolica/10 rounded-2xl p-4 border border-majolica/30">
              <h5 className="font-mono font-bold text-majolica text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{language === "uz" ? "Narxga kiritilgan" : language === "en" ? "Included in Price" : "Включено в стоимость"}</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-night/85">
                {trip.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-majolica shrink-0 mt-0.5" />
                    <span>{item[language] || item.ru}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gold/10 rounded-2xl p-4 border border-gold/30">
              <h5 className="font-mono font-bold text-gold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{language === "uz" ? "Qo'shimcha variantlar" : language === "en" ? "Optional Add-ons" : "По желанию (дополнительно)"}</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-night/85">
                {trip.optional.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-gold font-bold">•</span>
                    <span>{item[language] || item.ru}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Linked Certified Guides */}
          {linkedGuides.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-majolica/20">
              <h4 className="font-display font-bold text-night text-sm mb-3 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-majolica" />
                <span>
                  {language === "uz" ? "Tavsiya etilgan akkreditatsiyalangan gidlar" : language === "en" ? "Recommended Accredited Guides" : "Рекомендуемые гиды для этой локации"}
                </span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedGuides.map((g) => (
                  <div
                    key={g!.id}
                    className="p-3 rounded-xl bg-paper/60 border border-majolica/20 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-majolica/15 border border-majolica/30 flex items-center justify-center text-majolica shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-night block">
                          {getGuideDisplayName(g!.name, language)}
                        </span>
                        <span className="text-[10px] text-night/60 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-majolica" />
                          <span>Trust: {g!.trustScore}/100 · ⭐ {g!.rating.toFixed(1)}</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Target className="w-3 h-3 text-gold" />
                      <span>{g!.matchScore || 96}%</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="bg-white border-t border-majolica/15 p-6 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] text-night/50 font-mono block">
              {language === "uz" ? "Umumiy qiymat" : language === "en" ? "Total Price" : "Итоговая стоимость"}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-mono font-black text-night">
                ${travelers ? groupCost : trip.pricePerAdult}
              </span>
              <span className="text-xs text-night/50 font-mono">
                {travelers ? `(${travelers.total} чел)` : `/ ${t.trip.costPerPerson}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Secondary Button */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-majolica/40 bg-paper text-xs font-semibold text-night hover:bg-majolica/10 transition-colors"
            >
              {t.guides.modalCloseBtn}
            </button>

            {/* Primary CTA Button */}
            <button
              type="button"
              onClick={() => {
                onToggleAdd(trip);
                onClose();
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                isAdded
                  ? "bg-night border border-majolica text-majolica"
                  : "bg-majolica hover:bg-majolica/90 text-paper"
              }`}
            >
              {isAdded ? <Check className="w-3.5 h-3.5" /> : <span>+</span>}
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
