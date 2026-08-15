import React from "react";
import { CostCalculationResult } from "@/lib/costCalculator";
import { TravelersModel } from "@/lib/types";

interface BudgetBarProps {
  costResult: CostCalculationResult;
  travelers: TravelersModel;
  onApplySavingTip?: (tip: string) => void;
}

export default function BudgetBar({ costResult, travelers }: BudgetBarProps) {
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
    <div className="bg-white rounded-2xl border border-sand p-4 sm:p-5 shadow-md">
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-night/60 font-bold block">
            💰 Контроль бюджета в реальном времени
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-ink">
              ${totalCostUsd}
            </span>
            <span className="text-xs text-night/70 font-medium">
              {isInfinite ? "(Бюджет: $1,000+ Премиум)" : `из $${budgetMaxUsd} (бюджет)`}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sand/50 text-ink font-semibold">
              ~${costPerPersonUsd} / чел. ({travelers.total} чел.)
            </span>
          </div>
        </div>

        <div>
          {isOverBudget ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-pulse">
              <span>🔴</span> Превышение: +${Math.abs(budgetRemainingUsd)}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <span>🟢</span> {isInfinite ? "Премиум (Без лимита)" : `В пределах бюджета (Остаток: $${budgetRemainingUsd})`}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-sand/40 h-2.5 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isOverBudget ? "bg-red-500" : percentage > 85 ? "bg-amber-500" : "bg-emerald-600"
          }`}
          style={{ width: `${Math.min(100, Math.max(5, percentage))}%` }}
        />
      </div>

      {/* Breakdown chips */}
      <div className="flex items-center gap-2 flex-wrap text-[11px] text-night/70 pt-2 border-t border-sand/50">
        <span className="font-semibold text-ink">Включено:</span>
        <span className="bg-plaster/60 px-2 py-0.5 rounded-md border border-sand/60">
          ✈️🚆 Транспорт: ${breakdown.transport}
        </span>
        <span className="bg-plaster/60 px-2 py-0.5 rounded-md border border-sand/60">
          🚕 Трансфер: ${breakdown.transfer}
        </span>
        <span className="bg-plaster/60 px-2 py-0.5 rounded-md border border-sand/60">
          🏨 Отель: ${breakdown.hotel}
        </span>
        <span className="bg-plaster/60 px-2 py-0.5 rounded-md border border-sand/60">
          🍽️ Еда и активности: ${breakdown.activitiesAndFood}
        </span>
      </div>

      {/* Smart savings tips if over budget */}
      {isOverBudget && savingTips.length > 0 && (
        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs text-amber-950">
          <p className="font-bold flex items-center gap-1">
            <span>💡</span> Как уложиться в бюджет:
          </p>
          {savingTips.map((tip, idx) => (
            <p key={idx} className="leading-relaxed">
              • {tip}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
