import React, { useState } from "react";
import { MOCK_TRANSFER_VEHICLES } from "@/data/mockTravelData";
import {
  SelectedTransfer,
  TransferClass,
  TransferVehicle,
  TravelersModel,
} from "@/lib/types";
import { Car, Bus, Users, Luggage, AlertTriangle, Check, ArrowRight } from "lucide-react";

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-sand text-xs font-mono font-bold text-night uppercase tracking-wider mb-2">
          Этап 2 из 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-night flex items-center gap-2">
          <Car className="w-6 h-6 text-majolica" />
          <span>Как будете передвигаться по городу и локациям?</span>
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1 font-light">
          Размер вашей группы: <span className="font-bold text-night font-mono">{totalPeople} чел.</span> Количество автомобилей и вместимость рассчитываются автоматически:
        </p>
      </div>

      {/* Round-trip Transfer toggle */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-sand text-xs font-mono">
        <span className="font-semibold text-night">Маршрут трансфера:</span>
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
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
              !isRoundTrip ? "bg-majolica text-paper" : "bg-paper border border-sand text-night"
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
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
              isRoundTrip ? "bg-majolica text-paper" : "bg-paper border border-sand text-night"
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
                  ? "border-majolica ring-2 ring-majolica/30 shadow-md bg-paper/40"
                  : "border-sand hover:border-majolica/60 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0">
                      {v.passengerCapacity > 4 ? <Bus className="w-6 h-6 text-majolica" /> : <Car className="w-6 h-6 text-majolica" />}
                    </div>
                    <div>
                      <span className="text-[10px] bg-paper border border-sand px-2 py-0.5 rounded font-mono font-bold uppercase text-night/70">
                        {v.className}
                      </span>
                      <h3 className="font-display font-bold text-night text-sm sm:text-base mt-0.5">
                        {v.title}
                      </h3>
                      <p className="text-xs text-night/60 font-mono">
                        {v.brand} · {v.year} год
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-mono font-black text-night">
                      ${totalCost}
                    </div>
                    <span className="text-[10px] text-night/60 font-mono block">
                      ${v.priceOneWayUsd}/рейс
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 py-2 border-y border-sand/60 text-xs text-night/80 font-mono">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-majolica" /> До {v.passengerCapacity} мест</span>
                  <span className="flex items-center gap-1"><Luggage className="w-3.5 h-3.5 text-majolica" /> {v.luggageCapacity} чемодана</span>
                </div>

                {/* Multiple cars notice */}
                {isOverCapacity && (
                  <div className="mt-3 p-2.5 bg-gold/10 border border-gold/30 rounded-xl text-xs text-night leading-snug">
                    <p className="font-bold flex items-center gap-1 text-gold font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 text-gold" />
                      <span>Для вашей группы ({totalPeople} чел.) нужно {neededCars} автомобиля</span>
                    </p>
                    <p className="text-[11px] text-night/70 mt-0.5 font-mono">
                      Расчет: {neededCars} авто × ${v.priceOneWayUsd} × {multiplier} поездки = ${totalCost}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-night/60">
                  {neededCars > 1 ? `Автомобилей: ${neededCars} шт.` : "1 автомобиль"}
                </span>
                <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-majolica" : "text-night/70"}`}>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isSelected ? "Выбрано" : "Выбрать этот класс"}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons: Secondary vs Primary */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-sand">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-majolica/40 bg-paper text-xs sm:text-sm font-semibold text-night hover:bg-majolica/10 transition-colors"
        >
          ← Назад к транспорту
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
        >
          <span>Далее: Подбор отеля</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
