import {
  CostCategoryBreakdown,
  DurationModel,
  PayerSplit,
  PayerSplitMode,
  SelectedHotel,
  SelectedTransfer,
  SelectedTransport,
  TravelersModel,
} from "./types";

export interface CalculateCostParams {
  travelers: TravelersModel;
  duration: DurationModel;
  budgetMaxUsd: number;
  transport?: SelectedTransport;
  transfer?: SelectedTransfer;
  hotel?: SelectedHotel;
  splitMode?: PayerSplitMode;
  customActivitiesCostPerPersonPerDay?: number;
}

export interface CostCalculationResult {
  breakdown: CostCategoryBreakdown;
  totalCostUsd: number;
  costPerPersonUsd: number;
  budgetMaxUsd: number;
  budgetRemainingUsd: number;
  isOverBudget: boolean;
  overBudgetAmountUsd: number;
  payerSplit: PayerSplit;
  savingTips: string[];
}

export function calculateTripCost(params: CalculateCostParams): CostCalculationResult {
  const {
    travelers,
    duration,
    budgetMaxUsd,
    transport,
    transfer,
    hotel,
    splitMode = travelers.type === "couple" ? "equal" : travelers.type === "family" ? "family_share" : "equal",
    customActivitiesCostPerPersonPerDay,
  } = params;

  // 1. Transport cost
  const transportCost = transport?.totalCostUsd ?? 0;

  // 2. Transfer cost
  const transferCost = transfer?.totalCostUsd ?? 0;

  // 3. Hotel cost
  const hotelCost = hotel?.totalCostUsd ?? 0;

  // 4. Food & Activities estimation per person/day
  // Standard ~$18/person/day for authentic Uzbek food, street food, tea & museum entries
  const dailyActFoodRate = customActivitiesCostPerPersonPerDay ?? 18;
  const activitiesAndFood = Math.round(
    duration.totalDays * (travelers.adults * dailyActFoodRate + travelers.children * (dailyActFoodRate * 0.6))
  );

  // 5. Guide / Extras
  const guideCost = travelers.type === "group" ? 35 * Math.min(2, duration.activeDays) : 0;
  const otherCost = Math.round(travelers.total * 8); // SIM card, bottled mountain water, metro tokens

  const totalCostUsd = transportCost + transferCost + hotelCost + activitiesAndFood + guideCost + otherCost;
  const costPerPersonUsd = travelers.total > 0 ? Math.round(totalCostUsd / travelers.total) : totalCostUsd;

  const isInfiniteBudget = budgetMaxUsd === Infinity || !budgetMaxUsd;
  const budgetRemainingUsd = isInfiniteBudget ? Infinity : budgetMaxUsd - totalCostUsd;
  const isOverBudget = !isInfiniteBudget && budgetRemainingUsd < 0;
  const overBudgetAmountUsd = isOverBudget ? Math.abs(budgetRemainingUsd) : 0;

  // 6. Payer Split Calculation
  const payerSplit = computePayerSplit(totalCostUsd, travelers, splitMode);

  // 7. Savings recommendations if over budget or near limit
  const savingTips: string[] = [];
  if (isOverBudget) {
    if (hotel && hotel.hotel.pricePerNightUsd > 45) {
      const potentialHotelSave = Math.round((hotel.hotel.pricePerNightUsd - 35) * hotel.nights * hotel.numberOfRooms);
      if (potentialHotelSave > 0) {
        savingTips.push(`🏡 Выберите аутентичный гостевой дом вместо отеля — экономия ~$${potentialHotelSave}`);
      }
    }
    if (transfer && transfer.vehicle.className !== "economy") {
      savingTips.push(`🚗 Переключите класс трансфера на Economy — экономия ~$${Math.round(transfer.totalCostUsd * 0.35)}`);
    }
    if (transport && transport.flight && transport.type === "flight") {
      savingTips.push(`🚆 Выберите скоростной поезд Afrosiyob вместо самолета — экономия до ~$${Math.round(transport.totalCostUsd * 0.45)}`);
    }
  }

  const breakdown: CostCategoryBreakdown = {
    transport: transportCost,
    transfer: transferCost,
    hotel: hotelCost,
    activitiesAndFood,
    guide: guideCost,
    other: otherCost,
    total: totalCostUsd,
  };

  return {
    breakdown,
    totalCostUsd,
    costPerPersonUsd,
    budgetMaxUsd,
    budgetRemainingUsd,
    isOverBudget,
    overBudgetAmountUsd,
    payerSplit,
    savingTips,
  };
}

function computePayerSplit(
  totalCostUsd: number,
  travelers: TravelersModel,
  splitMode: PayerSplitMode
): PayerSplit {
  if (travelers.type === "solo") {
    return {
      mode: "single_payer",
      shares: [{ label: "👤 Путешественник", amountUsd: totalCostUsd }],
    };
  }

  if (travelers.type === "couple") {
    if (splitMode === "single_payer") {
      return {
        mode: "single_payer",
        shares: [
          { label: "💳 Плательщик (Один оплачивает всё)", amountUsd: totalCostUsd },
          { label: "👫 Партнер", amountUsd: 0 },
        ],
      };
    }
    const half = Math.round(totalCostUsd / 2);
    return {
      mode: "equal",
      shares: [
        { label: "👤 Человек 1", amountUsd: half },
        { label: "👤 Человек 2", amountUsd: totalCostUsd - half },
      ],
    };
  }

  if (travelers.type === "friends") {
    const count = Math.max(1, travelers.adults);
    const perFriend = Math.round(totalCostUsd / count);
    const shares = Array.from({ length: count }, (_, i) => ({
      label: `👥 Друг ${i + 1}`,
      amountUsd: i === count - 1 ? totalCostUsd - perFriend * (count - 1) : perFriend,
    }));
    return { mode: "equal", shares };
  }

  if (travelers.type === "family") {
    if (splitMode === "single_payer") {
      return {
        mode: "single_payer",
        shares: [{ label: "👨‍👩‍👧‍👦 Семейный бюджет (Родители)", amountUsd: totalCostUsd }],
      };
    }

    // Configurable family share: Adults pay full share, children counted as dependent
    const adults = Math.max(1, travelers.adults);
    const perAdult = Math.round(totalCostUsd / adults);
    const shares = Array.from({ length: adults }, (_, i) => ({
      label: `Взрослый ${i + 1} (${travelers.children > 0 ? "вкл. расходы на детей" : "доля"})`,
      amountUsd: i === adults - 1 ? totalCostUsd - perAdult * (adults - 1) : perAdult,
    }));
    return { mode: "family_share", shares };
  }

  // Group
  const total = Math.max(1, travelers.total);
  const perPerson = Math.round(totalCostUsd / total);
  return {
    mode: "equal",
    shares: [
      { label: `Доля на человека (всего ${total} чел.)`, amountUsd: perPerson },
    ],
  };
}
