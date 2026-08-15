import React, { useState, useMemo } from "react";
import { SmartTrip, TravelersModel, BudgetRangeModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import SmartTripCard from "./SmartTripCard";
import SmartTripModal from "./SmartTripModal";
import ExperienceIcon from "../common/ExperienceIcon";
import {
  getSmartTripRecommendations,
  getSurpriseSmartTrip,
  getCheaperAlternatives,
  calculateSmartTripGroupCost,
  SurpriseResult,
} from "@/lib/smartTrips";
import {
  Coins,
  Dices,
  Sparkles,
  Waves,
  Mountain,
  UtensilsCrossed,
  Landmark,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Check,
  X,
  Target,
} from "lucide-react";

interface SmartTripsSectionProps {
  travelers?: TravelersModel;
  budgetRange?: BudgetRangeModel;
  currentTripCost?: number;
  addedTrips: SmartTrip[];
  onToggleAddTrip: (trip: SmartTrip) => void;
}

export default function SmartTripsSection({
  travelers,
  budgetRange,
  currentTripCost = 0,
  addedTrips,
  onToggleAddTrip,
}: SmartTripsSectionProps) {
  const { t, language } = useTranslation();

  const [budgetFilter, setBudgetFilter] = useState<number | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTripForModal, setSelectedTripForModal] = useState<SmartTrip | null>(null);

  // Surprise Me State
  const [surpriseData, setSurpriseData] = useState<SurpriseResult | null>(null);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState<boolean>(false);

  // Cheaper Alternatives State
  const [alternativeTarget, setAlternativeTarget] = useState<SmartTrip | null>(null);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return getSmartTripRecommendations({
      travelers,
      budgetRange,
      maxBudgetFilter: budgetFilter === "all" ? undefined : budgetFilter,
      categoryFilter,
    });
  }, [travelers, budgetRange, budgetFilter, categoryFilter]);

  // Handle Surprise Me
  const handleTriggerSurprise = () => {
    const result = getSurpriseSmartTrip({ travelers, budgetRange });
    setSurpriseData(result);
    setIsSurpriseOpen(true);
  };

  // Check budget impact of added trips
  const totalSmartTripsCost = useMemo(() => {
    return addedTrips.reduce((sum, tr) => sum + calculateSmartTripGroupCost(tr, travelers), 0);
  }, [addedTrips, travelers]);

  const combinedCost = currentTripCost + totalSmartTripsCost;
  const maxBudgetLimit = budgetRange?.maxBudget ?? Infinity;
  const isOverBudget = combinedCost > maxBudgetLimit;
  const remainingBudget = maxBudgetLimit === Infinity ? Infinity : maxBudgetLimit - combinedCost;

  return (
    <section id="smart-trips" className="my-16 bg-white border border-sand rounded-3xl p-6 sm:p-10 shadow-xs scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-sand/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-majolica" />
            <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica">
              {language === "uz" ? "Smart Trips · Hamyonbop sayohatlar" : language === "en" ? "Smart Trips · Local Experiences" : "Smart Trips · Локальные впечатления"}
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-night">
            {language === "uz" ? "O'zbekiston bo'ylab hamyonbop turlar" : language === "en" ? "Discover More for Less" : "Впечатления без переплат"}
          </h2>
          <p className="text-night/70 text-sm sm:text-base mt-1 max-w-2xl font-light leading-relaxed">
            {language === "uz"
              ? "Toshkent shahri va Toshkent viloyatining go'zal tog'li manzaralari, suv omborlari va milliy taomlari hamyonbop narxlarda."
              : language === "en"
              ? "Discover the best day getaways around Tashkent and Chimgan mountains with verified local guides and transparent pricing."
              : "Лучшие готовые 1-дневные выезды по Ташкенту и горам Тянь-Шаня (Чарвак, Амирсой, Чимган, Сукок) по доступным ценам."}
          </p>
        </div>

        {/* Primary CTA: Surprise Me Button */}
        <button
          type="button"
          onClick={handleTriggerSurprise}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-majolica hover:bg-majolica/90 text-paper text-xs sm:text-sm font-bold transition-all shadow-md shrink-0 self-start md:self-auto hover:scale-102"
        >
          <Dices className="w-4 h-4 text-paper" />
          <span>{language === "uz" ? "Meni hayratda qoldir" : language === "en" ? "Surprise Me" : "Удиви меня"}</span>
        </button>
      </div>

      {/* Interactive Tool: What can I do for my budget? */}
      <div className="bg-paper/70 border border-sand/80 rounded-2xl p-5 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-gold" />
            <h3 className="font-display font-bold text-night text-sm sm:text-base">
              {language === "uz" ? "Byudjetimga nimalar qilsa bo'ladi?" : language === "en" ? "What can I experience with my budget?" : "Что можно посмотреть в рамках бюджета?"}
            </h3>
          </div>

          {/* Quick budget filter pills (Secondary Buttons) */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            {[
              { id: "all", label: language === "uz" ? "Barchasi" : language === "en" ? "All" : "Все" },
              { id: 25, label: "до $25" },
              { id: 35, label: "до $35" },
              { id: 50, label: "до $50" },
              { id: 100, label: "до $100" },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudgetFilter(b.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  budgetFilter === b.id
                    ? "bg-majolica text-paper shadow-xs"
                    : "bg-paper border border-majolica/30 text-night hover:bg-majolica/10"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills (Secondary Buttons) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-sand/60">
          {[
            { id: "all", label: language === "uz" ? "Barcha mavzular" : language === "en" ? "All Themes" : "Все темы", Icon: Sparkles },
            { id: "nature", label: language === "uz" ? "Tabiat & Ko'l" : language === "en" ? "Nature & Lakes" : "Природа & Озера", Icon: Waves },
            { id: "nature_hiking", label: language === "uz" ? "Tog'lar & Xayking" : language === "en" ? "Mountains & Hiking" : "Горы & Хайкинг", Icon: Mountain },
            { id: "gastronomy", label: language === "uz" ? "Gastronomiya" : language === "en" ? "Food & Taste" : "Гастрономия & Шашлык", Icon: UtensilsCrossed },
            { id: "soviet_modernism", label: language === "uz" ? "Shahar & Metro" : language === "en" ? "City & Metro" : "Город & Модернизм", Icon: Landmark },
          ].map((cat) => {
            const IconComp = cat.Icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                  categoryFilter === cat.id
                    ? "bg-night text-paper shadow-xs"
                    : "bg-paper border border-majolica/30 text-night/80 hover:bg-majolica/10"
                }`}
              >
                <IconComp className="w-3.5 h-3.5 text-majolica" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Budget Impact Banner if trips are added (Strictly majolica or brick) */}
      {addedTrips.length > 0 && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
            isOverBudget ? "bg-brick/10 border-brick/30 text-night" : "bg-majolica/10 border-majolica/30 text-night"
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <AlertCircle className="w-5 h-5 text-brick shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-majolica shrink-0" />
              )}
              <h4 className="font-display font-bold text-sm sm:text-base">
                {isOverBudget
                  ? (language === "uz" ? `Byudjetdan $${combinedCost - maxBudgetLimit} oshib ketdi` : language === "en" ? `$${combinedCost - maxBudgetLimit} Over Selected Budget` : `Превышение бюджета на $${combinedCost - maxBudgetLimit}`)
                  : (language === "uz" ? `Byudjet doirasida (Qoldiq: $${remainingBudget === Infinity ? "∞" : remainingBudget})` : language === "en" ? `Within Budget (Remaining: $${remainingBudget === Infinity ? "∞" : remainingBudget})` : `В пределах бюджета (Остаток: $${remainingBudget === Infinity ? "Без лимита" : remainingBudget})`)}
              </h4>
            </div>
            <p className="text-xs text-night/70 mt-1 font-mono">
              {language === "uz"
                ? `Qo'shilgan turlar (${addedTrips.length} ta): +$${totalSmartTripsCost} umumiy xarajatlarga qo'shildi.`
                : language === "en"
                ? `Added smart experiences (${addedTrips.length}): +$${totalSmartTripsCost} calculated into trip total.`
                : `Добавлено впечатлений (${addedTrips.length}): +$${totalSmartTripsCost} к смете поездки.`}
            </p>
          </div>

          {isOverBudget && (
            <button
              type="button"
              onClick={() => setAlternativeTarget(addedTrips[addedTrips.length - 1])}
              className="px-4 py-2 rounded-xl bg-paper border border-brick/40 text-brick text-xs font-semibold hover:bg-brick/10 transition-colors shrink-0 flex items-center gap-1.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-brick" />
              <span>{language === "uz" ? "Tejamkor variantlar" : language === "en" ? "Find Cheaper Option" : "Подобрать экономный аналог"}</span>
            </button>
          )}
        </div>
      )}

      {/* Smart Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrips.map((trip) => {
          const isAdded = addedTrips.some((t) => t.id === trip.id);
          return (
            <SmartTripCard
              key={trip.id}
              trip={trip}
              travelers={travelers}
              isAdded={isAdded}
              onToggleAdd={onToggleAddTrip}
              onViewDetails={(t) => setSelectedTripForModal(t)}
            />
          );
        })}
      </div>

      {/* Cheaper Alternatives Modal if triggered */}
      {alternativeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-paper rounded-3xl p-6 border border-sand max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand">
              <h4 className="font-display font-bold text-night text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-gold" />
                <span>{language === "uz" ? "Hamyonbop muqobil variantlar" : language === "en" ? "Similar Budget-Friendly Alternatives" : "Релевантные экономные варианты"}</span>
              </h4>
              <button
                type="button"
                onClick={() => setAlternativeTarget(null)}
                className="w-7 h-7 rounded-full bg-sand/40 hover:bg-sand flex items-center justify-center text-xs font-bold text-night"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-night/70 font-light">
              {language === "uz"
                ? `«${alternativeTarget.title[language] || alternativeTarget.title.ru}» o'rniga qulayroq takliflar:`
                : language === "en"
                ? `More affordable alternatives for "${alternativeTarget.title[language] || alternativeTarget.title.ru}":`
                : `Доступные альтернативы для "${alternativeTarget.title[language] || alternativeTarget.title.ru}":`}
            </p>

            <div className="space-y-3">
              {getCheaperAlternatives(alternativeTarget, alternativeTarget.pricePerAdult, travelers).map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 rounded-2xl border border-sand bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0">
                      <ExperienceIcon name={alt.image} className="w-5 h-5 text-majolica" />
                    </div>
                    <div>
                      <span className="font-bold text-night block text-sm">
                        {alt.title[language] || alt.title.ru}
                      </span>
                      <span className="text-night/60 font-mono">
                        ${alt.pricePerAdult} / {t.trip.costPerPerson} (🎯 {alt.matchScore}%)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleAddTrip(alternativeTarget); // remove old
                      onToggleAddTrip(alt); // add new
                      setAlternativeTarget(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-majolica text-paper font-bold text-xs shrink-0 shadow-xs hover:bg-majolica/90 transition-colors"
                  >
                    {language === "uz" ? "Almashtirish" : language === "en" ? "Swap" : "Заменить"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Surprise Me Modal */}
      {isSurpriseOpen && surpriseData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-paper rounded-3xl p-6 sm:p-8 border border-sand max-w-lg w-full shadow-2xl space-y-5 animate-scale-in text-night">
            <div className="flex items-center justify-between pb-3 border-b border-sand">
              <div className="flex items-center gap-2">
                <Dices className="w-6 h-6 text-majolica" />
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-gold tracking-wider block">
                    {language === "uz" ? "Siz uchun maxsus tanlov" : language === "en" ? "Curated Pick for You" : "Ваш сюрприз от DiyorAI"}
                  </span>
                  <h3 className="font-display font-bold text-xl text-night">
                    {surpriseData.trip.title[language] || surpriseData.trip.title.ru}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSurpriseOpen(false)}
                className="w-8 h-8 rounded-full bg-sand/40 hover:bg-sand flex items-center justify-center text-night"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white border border-sand/70 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-paper border border-sand flex items-center justify-center text-majolica">
                  <ExperienceIcon name={surpriseData.trip.image} className="w-6 h-6 text-majolica" />
                </div>
                <div>
                  <span className="font-mono font-black text-lg text-night">
                    ${surpriseData.trip.pricePerAdult}
                  </span>
                  <span className="text-xs text-night/50 font-mono"> / {t.trip.costPerPerson}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                <span>{surpriseData.trip.matchScore || 98}% {t.guides.matchScoreLabel}</span>
              </span>
            </div>

            {/* Why we picked it */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-night/60 uppercase tracking-wider block">
                {language === "uz" ? "Nima uchun ushbu tur tanlandi:" : language === "en" ? "Why we picked this for you:" : "Почему система выбрала именно этот тур:"}
              </span>
              <ul className="space-y-1.5 text-xs text-night/80">
                {(surpriseData.reasons[language] || surpriseData.reasons.ru).map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-majolica shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Secondary button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedTripForModal(surpriseData.trip);
                  setIsSurpriseOpen(false);
                }}
                className="py-2.5 rounded-xl border border-majolica/40 bg-paper text-xs font-semibold text-night hover:bg-majolica/10 transition-colors"
              >
                {language === "uz" ? "Batafsil" : language === "en" ? "View Details" : "Подробнее"}
              </button>

              {/* Primary CTA button */}
              <button
                type="button"
                onClick={() => {
                  onToggleAddTrip(surpriseData.trip);
                  setIsSurpriseOpen(false);
                }}
                className="py-2.5 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs font-bold transition-all shadow-md"
              >
                + {language === "uz" ? "Sayohatga qo'shish" : language === "en" ? "Add to My Trip" : "Добавить в поездку"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Smart Trip Modal */}
      <SmartTripModal
        trip={selectedTripForModal}
        travelers={travelers}
        isAdded={Boolean(selectedTripForModal && addedTrips.some((t) => t.id === selectedTripForModal.id))}
        onClose={() => setSelectedTripForModal(null)}
        onToggleAdd={onToggleAddTrip}
      />
    </section>
  );
}
