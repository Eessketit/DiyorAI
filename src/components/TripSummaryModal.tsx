import React from "react";
import { useRouter } from "next/router";
import { useTranslation } from "@/lib/i18n";
import { TripPlan } from "@/lib/types";
import { calculateTripCost } from "@/lib/costCalculator";
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Calendar,
  Users,
  Coins,
  Train,
  Building2,
  Car,
  ArrowRight,
  Sliders,
  MessageSquare,
  X,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface TripSummaryModalProps {
  plan: TripPlan;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function TripSummaryModal({
  plan,
  isOpen,
  onClose,
  onConfirm,
}: TripSummaryModalProps) {
  const router = useRouter();
  const { t, language } = useTranslation();

  if (!isOpen || !plan) return null;

  const travelers = plan.preferences.travelers || { type: "couple", adults: 2, children: 0, total: 2 };
  const totalDays = plan.preferences.duration?.totalDays || plan.preferences.days || 3;
  const activeDays = plan.preferences.duration?.activeDays || totalDays;
  const restDays = plan.preferences.duration?.restDays || Math.max(0, totalDays - activeDays);
  const budgetMax = (typeof plan.preferences.budget === "object" ? plan.preferences.budget.maxAmount : 600) || 600;

  const costResult = calculateTripCost({
    travelers,
    duration: { totalDays, activeDays, restDays },
    budgetMaxUsd: budgetMax,
    transport: plan.transport,
    transfer: plan.transfer,
    hotel: plan.hotel,
  });

  // Extract cities visited across all days
  const visitedCities: string[] = [];
  plan.days.forEach((d) => {
    d.stops.forEach((s) => {
      const city = s.city || s.region;
      if (city && !visitedCities.includes(city)) {
        visitedCities.push(city);
      }
    });
  });

  if (visitedCities.length === 0) {
    const regionName = t.regions[plan.preferences.region] || plan.preferences.region;
    visitedCities.push("Ташкент", regionName);
  }

  const handleEditInConstructor = () => {
    onClose();
    try {
      sessionStorage.setItem("diyorai-trip", JSON.stringify(plan));
    } catch (e) {
      console.warn("Failed to set sessionStorage", e);
    }
    router.push("/constructor?sync=true");
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-mono font-bold text-[#1E3A8A] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>
              {language === "uz"
                ? "Sayohat yakuniy natijalari va tekshiruv"
                : language === "en"
                ? "Generated Trip Summary & Review"
                : "Итоги тура / Проверка перед подтверждением"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-night">
            {language === "uz"
              ? "Siz uchun tuzilgan shaxsiy sayohat rejasi"
              : language === "en"
              ? "Your Tailor-Made Uzbekistan Journey"
              : "Ваш персонализированный тур по Узбекистану"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-light">
            {language === "uz"
              ? "Marshrut, logistika, mehmonxona va smeta parametrlarini tekshiring:"
              : language === "en"
              ? "Review your itinerary route, logistics, stays, and budget breakdown below:"
              : "Проверьте ключевые параметры маршрута, логистику, отели и смету:"}
          </p>
        </div>

        {/* Route Chain Visualizer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
            {language === "uz" ? "📍 Marshrut zanjiri" : language === "en" ? "📍 Route Sequence" : "📍 Маршрутная цепочка"}
          </span>
          <div className="flex items-center gap-2 flex-wrap text-sm font-semibold text-[#131E3A]">
            {visitedCities.map((city, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl shadow-2xs">
                  {city}
                </span>
                {idx < visitedCities.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-[#2563EB] shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Duration */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <Calendar className="w-5 h-5 text-[#1E3A8A] mx-auto mb-1" />
            <span className="text-[10px] text-slate-500 font-mono block">
              {language === "uz" ? "Davomiylik" : language === "en" ? "Duration" : "Длительность"}
            </span>
            <span className="text-sm font-bold text-night font-mono">
              {totalDays} {language === "uz" ? "kun" : language === "en" ? "days" : "дней"}
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
              {activeDays} {language === "uz" ? "faol" : "активных"} {restDays > 0 ? `+ ${restDays} ${language === "uz" ? "dam" : "отдых"}` : ""}
            </span>
          </div>

          {/* Group */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <Users className="w-5 h-5 text-[#1E3A8A] mx-auto mb-1" />
            <span className="text-[10px] text-slate-500 font-mono block">
              {language === "uz" ? "Sayohatchilar" : language === "en" ? "Travelers" : "Группа"}
            </span>
            <span className="text-sm font-bold text-night font-mono">
              {travelers.total} {language === "uz" ? "kishi" : language === "en" ? "pers." : "чел."}
            </span>
            <span className="text-[10px] text-slate-600 block mt-0.5">
              {travelers.adults} {language === "uz" ? "katta" : "взр."} {travelers.children > 0 ? `+ ${travelers.children} ${language === "uz" ? "bola" : "дет."}` : ""}
            </span>
          </div>

          {/* Total Cost */}
          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-200 text-center">
            <Coins className="w-5 h-5 text-[#1E3A8A] mx-auto mb-1" />
            <span className="text-[10px] text-slate-600 font-mono block">
              {language === "uz" ? "Hisoblangan narx" : language === "en" ? "Estimated Cost" : "Смета тура"}
            </span>
            <span className="text-base font-black text-[#1E3A8A] font-mono">
              ${costResult.totalCostUsd}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              ~${costResult.costPerPersonUsd}/{language === "uz" ? "kishi" : language === "en" ? "person" : "чел"}
            </span>
          </div>

          {/* Budget Limit Status */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-[10px] text-slate-500 font-mono block">
              {language === "uz" ? "Byudjet holati" : language === "en" ? "Budget Limit" : "Лимит бюджета"}
            </span>
            <span className="text-sm font-bold text-night font-mono">
              ${budgetMax}
            </span>
            <span className={`text-[10px] font-bold block mt-0.5 ${costResult.isOverBudget ? "text-rose-600" : "text-emerald-700"}`}>
              {costResult.isOverBudget
                ? `+${costResult.overBudgetAmountUsd}$ ${language === "uz" ? "ortiqcha" : "превышение"}`
                : `${language === "uz" ? "Qoldiq:" : "Остаток:"} $${costResult.budgetRemainingUsd}`}
            </span>
          </div>
        </div>

        {/* Included Services Quick Specs */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
          <span className="font-mono font-bold text-slate-700 block">
            {language === "uz" ? "📦 Paketga kiritilgan xizmatlar:" : language === "en" ? "📦 Included Services & Logistics:" : "📦 Включенные услуги и логистика:"}
          </span>
          <div className="grid sm:grid-cols-3 gap-2.5 text-slate-700">
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
              <Train className="w-4 h-4 text-[#1E3A8A] shrink-0" />
              <span className="truncate">
                {plan.transport?.train?.name || "Afrosiyob Express Rail"}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
              <Car className="w-4 h-4 text-[#1E3A8A] shrink-0" />
              <span className="truncate">
                {plan.transfer?.vehicle.title || "Comfort Transfer"}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200">
              <Building2 className="w-4 h-4 text-[#1E3A8A] shrink-0" />
              <span className="truncate">
                {plan.hotel?.hotel.name || "Boutique Heritage Hotel"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={handleEditInConstructor}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>
              {language === "uz" ? "Konstruktorda o'zgartirish" : language === "en" ? "Edit in Constructor" : "Скорректировать в конструкторе"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#152a65] hover:to-[#1d4ed8] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>
              {language === "uz" ? "✅ Reja ma'qul, tasdiqlash" : language === "en" ? "✅ Tour Looks Great, Confirm" : "✅ Всё отлично, подтвердить тур"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
