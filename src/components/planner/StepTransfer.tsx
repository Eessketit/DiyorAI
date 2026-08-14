import React, { useState } from "react";
import { MOCK_TRANSFER_VEHICLES } from "@/data/mockTravelData";
import {
  SelectedTransfer,
  TransferClass,
  TransferVehicle,
  TravelersModel,
} from "@/lib/types";

interface StepTransferProps {
  travelers: TravelersModel;
  selectedTransfer?: SelectedTransfer;
  onSelect: (transfer: SelectedTransfer) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTransfer({
  travelers,
  selectedTransfer,
  onSelect,
  onNext,
  onBack,
}: StepTransferProps) {
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(selectedTransfer?.isRoundTrip ?? true);

  const totalPeople = travelers.total;

  const handleSelectVehicle = (vehicle: TransferVehicle) => {
    const neededCars = Math.max(1, Math.ceil(totalPeople / vehicle.passengerCapacity));
    const multiplier = isRoundTrip ? 2 : 1;
    const totalCostUsd = neededCars * vehicle.priceOneWayUsd * multiplier;

    let reasonForMultipleCars: string | undefined;
    if (neededCars > 1) {
      reasonForMultipleCars = `Для группы из ${totalPeople} чел. требуется ${neededCars} авто (вместимость 1 авто: до ${vehicle.passengerCapacity} пасс.)`;
    }

    onSelect({
      vehicle,
      numberOfCars: neededCars,
      isRoundTrip,
      totalCostUsd,
      reasonForMultipleCars,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Этап 2 из 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          🚕 Как будете передвигаться по городу и локациям?
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1">
          Размер вашей группы: <span className="font-bold text-ink">{totalPeople} чел.</span> Количество автомобилей и вместимость рассчитываются автоматически:
        </p>
      </div>

      {/* Round-trip Transfer toggle */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-sand text-xs">
        <span className="font-semibold text-ink">Маршрут трансфера:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsRoundTrip(false);
              if (selectedTransfer) {
                const totalCostUsd = selectedTransfer.numberOfCars * selectedTransfer.vehicle.priceOneWayUsd * 1;
                onSelect({ ...selectedTransfer, isRoundTrip: false, totalCostUsd });
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              !isRoundTrip ? "bg-registan text-plaster" : "bg-sand/40 text-night/80"
            }`}
          >
            В одну сторону (Вокзал → Отель)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRoundTrip(true);
              if (selectedTransfer) {
                const totalCostUsd = selectedTransfer.numberOfCars * selectedTransfer.vehicle.priceOneWayUsd * 2;
                onSelect({ ...selectedTransfer, isRoundTrip: true, totalCostUsd });
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              isRoundTrip ? "bg-registan text-plaster" : "bg-sand/40 text-night/80"
            }`}
          >
            Туда и обратно (Round trip)
          </button>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {MOCK_TRANSFER_VEHICLES.map((v) => {
          const neededCars = Math.max(1, Math.ceil(totalPeople / v.passengerCapacity));
          const multiplier = isRoundTrip ? 2 : 1;
          const totalCost = neededCars * v.priceOneWayUsd * multiplier;
          const isSelected = selectedTransfer?.vehicle.id === v.id;

          const isOverCapacity = neededCars > 1;

          return (
            <div
              key={v.id}
              onClick={() => handleSelectVehicle(v)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                isSelected
                  ? "border-registan ring-2 ring-registan/30 shadow-md bg-registan/5"
                  : "border-sand hover:border-registan/70 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl p-2 bg-sand/30 rounded-xl">{v.photoUrl}</span>
                    <div>
                      <span className="text-[10px] bg-sand/60 px-2 py-0.5 rounded font-bold uppercase text-night/70">
                        {v.className}
                      </span>
                      <h3 className="font-display font-bold text-ink text-sm sm:text-base mt-0.5">
                        {v.title}
                      </h3>
                      <p className="text-xs text-night/60">
                        {v.brand} · {v.year} год
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-display font-black text-ink">
                      ${totalCost}
                    </div>
                    <span className="text-[10px] text-night/60 block">
                      ${v.priceOneWayUsd}/рейс
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 py-2 border-y border-sand/60 text-xs text-night/80">
                  <span>👥 До {v.passengerCapacity} мест</span>
                  <span>🧳 {v.luggageCapacity} чемодана</span>
                </div>

                {/* Multiple cars notice */}
                {isOverCapacity && (
                  <div className="mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 leading-snug">
                    <p className="font-bold">⚠️ Для вашей группы ({totalPeople} чел.) нужно {neededCars} автомобиля</p>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      Расчет: {neededCars} авто × ${v.priceOneWayUsd} × {multiplier} поездки = ${totalCost}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                <span className="text-night/60">
                  {neededCars > 1 ? `Автомобилей: ${neededCars} шт.` : "1 автомобиль"}
                </span>
                <span className={`font-bold ${isSelected ? "text-registan" : "text-emerald-700"}`}>
                  {isSelected ? "✓ Выбрано" : "Выбрать этот класс"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-sand">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-sand bg-white text-xs sm:text-sm font-semibold text-ink hover:bg-sand/30 transition-colors"
        >
          ← Назад к транспорту
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-clay hover:bg-clay/90 text-plaster text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
        >
          Далее: Подбор отеля →
        </button>
      </div>
    </div>
  );
}
