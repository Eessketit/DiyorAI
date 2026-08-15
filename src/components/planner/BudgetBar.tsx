import React from "react";
import { CostCalculationResult } from "@/lib/costCalculator";
import { TravelersModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import {
  Coins,
  AlertCircle,
  CheckCircle,
  Check,
  Lightbulb,
  Train,
  Car,
  Building,
  UtensilsCrossed,
} from "lucide-react";

interface BudgetBarProps {
  costResult: CostCalculationResult;
  travelers: TravelersModel;
  onApplySavingTip?: (tip: string) => void;
}

export default function BudgetBar({ costResult, travelers }: BudgetBarProps) {
  const { t } = useTranslation();
  const {
    totalCostUsd,
    budgetMaxUsd,
    budgetRemainingUsd,
    isOverBudget,
    costPerPersonUsd,
    savingTips,
    breakdown,
  } = costResult;

  const isInfinite = budgetMaxUsd === Infinity || !budgetMaxUsd;
  const percentage = isInfinite ? 35 : Math.min(100, Math.round((totalCostUsd / (budgetMaxUsd || 1)) * 100));

  return (
    <div className="bg-white rounded-2xl border border-majolica/20 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-night/60 font-mono font-bold flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-majolica" />
            <span>{t.planner.budgetBarTitle}</span>
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-mono font-black text-night">
              ${totalCostUsd}
            </span>
            <span className="text-xs text-night/70 font-mono">
              {isInfinite ? `(${t.planner.unlimited})` : `/ $${budgetMaxUsd}`}
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-paper border border-majolica/20 text-night font-mono font-semibold">
              ~${costPerPersonUsd} / {t.trip.costPerPerson} ({travelers.total})
            </span>
          </div>
        </div>

        <div>
          {isOverBudget ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brick/10 border border-brick/30 text-brick text-xs font-mono font-bold">
              <AlertCircle className="w-4 h-4 text-brick shrink-0" />
              <span>{t.planner.budgetOverLimit}: +${Math.abs(budgetRemainingUsd)}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-majolica/15 border border-majolica/30 text-majolica text-xs font-mono font-bold">
              <CheckCircle className="w-4 h-4 text-majolica shrink-0" />
              <span>{isInfinite ? t.planner.unlimited : `${t.planner.budgetInLimit} ($${budgetRemainingUsd})`}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-paper border border-majolica/20 h-2 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isOverBudget ? "bg-brick" : percentage > 85 ? "bg-gold" : "bg-majolica"
          }`}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        />
      </div>

      {/* Breakdown chips */}
      <div className="flex items-center gap-2 flex-wrap text-[11px] text-night/70 pt-2 border-t border-majolica/15 font-mono">
        <Check className="w-3.5 h-3.5 text-majolica" />
        <span className="bg-paper px-2 py-0.5 rounded-md border border-majolica/20 flex items-center gap-1">
          <Train className="w-3 h-3 text-majolica" /> {t.trip.costTransport}: ${breakdown.transport}
        </span>
        <span className="bg-paper px-2 py-0.5 rounded-md border border-majolica/20 flex items-center gap-1">
          <Car className="w-3 h-3 text-majolica" /> {t.trip.costTransfer}: ${breakdown.transfer}
        </span>
        <span className="bg-paper px-2 py-0.5 rounded-md border border-majolica/20 flex items-center gap-1">
          <Building className="w-3 h-3 text-majolica" /> {t.trip.costHotel}: ${breakdown.hotel}
        </span>
        <span className="bg-paper px-2 py-0.5 rounded-md border border-majolica/20 flex items-center gap-1">
          <UtensilsCrossed className="w-3 h-3 text-majolica" /> {t.trip.costActivitiesFood}: ${breakdown.activitiesAndFood}
        </span>
      </div>

      {/* Smart savings tips if over budget */}
      {isOverBudget && savingTips.length > 0 && (
        <div className="mt-3 p-3 bg-gold/10 border border-gold/30 rounded-xl space-y-1 text-xs text-night">
          <p className="font-bold flex items-center gap-1 text-gold font-mono">
            <Lightbulb className="w-3.5 h-3.5 text-gold" />
            <span>{t.planner.budgetTipPrefix}:</span>
          </p>
          {savingTips.map((tip, idx) => (
            <p key={idx} className="leading-relaxed font-light">
              • {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
