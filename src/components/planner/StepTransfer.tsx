import React, { useState } from "react";
import { MOCK_TRANSFER_VEHICLES } from "@/data/mockTravelData";
import {
  SelectedTransfer,
  TransferClass,
  TransferVehicle,
  TravelersModel,
} from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
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
  const { t, language } = useTranslation();
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(selectedTransfer?.isRoundTrip ?? true);

  const totalPeople = travelers.total;

  const handleSelectVehicle = (vehicle: TransferVehicle) => {
    const neededCars = Math.max(1, Math.ceil(totalPeople / vehicle.passengerCapacity));
    const multiplier = isRoundTrip ? 2 : 1;
    const totalCostUsd = neededCars * vehicle.priceOneWayUsd * multiplier;

    let reasonForMultipleCars: string | undefined;
    if (neededCars > 1) {
      reasonForMultipleCars =
        language === "uz"
          ? `${totalPeople} kishilik guruh uchun ${neededCars} ta avtomobil talab etiladi (1 ta avto sig'imi: ${vehicle.passengerCapacity} kishi)`
          : language === "en"
          ? `For a group of ${totalPeople} people, ${neededCars} vehicles are required (1 car capacity: up to ${vehicle.passengerCapacity} pass.)`
          : `Для группы из ${totalPeople} чел. требуется ${neededCars} авто (вместимость 1 авто: до ${vehicle.passengerCapacity} пасс.)`;
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-majolica/20 text-xs font-mono font-bold text-night uppercase tracking-wider mb-2">
          {language === "uz" ? "2-bosqich (3 tadan)" : language === "en" ? "Step 2 of 3" : "Этап 2 из 3"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-night flex items-center gap-2">
          <Car className="w-6 h-6 text-majolica" />
          <span>{language === "uz" ? "Shahar ichida qanday harakatlanasiz?" : language === "en" ? "How will you get around locally?" : "Как будете передвигаться по городу и локациям?"}</span>
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1 font-light">
          {language === "uz" ? "Guruh tarkibi:" : language === "en" ? "Your group size:" : "Размер вашей группы:"}{" "}
          <span className="font-bold text-night font-mono">{totalPeople} {language === "uz" ? "kishi" : language === "en" ? "people" : "чел."}</span>.{" "}
          {language === "uz"
            ? "Avtomobillar soni va sig'imi avtomatik hisoblanadi:"
            : language === "en"
            ? "Number of cars and luggage capacity are automatically calculated:"
            : "Количество автомобилей и вместимость рассчитываются автоматически:"}
        </p>
      </div>

      {/* Round-trip Transfer toggle */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-majolica/20 text-xs font-mono">
        <span className="font-semibold text-night">
          {language === "uz" ? "Transfer yo'nalishi:" : language === "en" ? "Transfer route:" : "Маршрут трансфера:"}
        </span>
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
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              !isRoundTrip ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-xs" : "bg-paper border border-majolica/20 text-night"
            }`}
          >
            {language === "uz" ? "Bir tomonga (Vokzal → Mehmonxona)" : language === "en" ? "One way (Station → Hotel)" : "В одну сторону (Вокзал → Отель)"}
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
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              isRoundTrip ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-xs" : "bg-paper border border-majolica/20 text-night"
            }`}
          >
            {language === "uz" ? "Borish va qaytish (Round trip)" : language === "en" ? "Round trip" : "Туда и обратно (Round trip)"}
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
                  ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/30 shadow-md bg-indigo-50/40"
                  : "border-slate-200 hover:border-indigo-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-paper border border-majolica/20 flex items-center justify-center text-[#1E3A8A] shrink-0">
                      {v.passengerCapacity > 4 ? <Bus className="w-6 h-6 text-[#1E3A8A]" /> : <Car className="w-6 h-6 text-[#1E3A8A]" />}
                    </div>
                    <div>
                      <span className="text-[10px] bg-paper border border-majolica/20 px-2 py-0.5 rounded font-mono font-bold uppercase text-night/70">
                        {v.className}
                      </span>
                      <h3 className="font-display font-bold text-night text-sm sm:text-base mt-0.5">
                        {v.title}
                      </h3>
                      <p className="text-xs text-night/60 font-mono">
                        {v.brand} · {v.year} {language === "uz" ? "yil" : language === "en" ? "yr" : "год"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-mono font-black text-night">
                      ${totalCost}
                    </div>
                    <span className="text-[10px] text-night/60 font-mono block">
                      ${v.priceOneWayUsd}/{language === "uz" ? "reys" : language === "en" ? "trip" : "рейс"}
                    </span>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-4 py-2 border-y border-majolica/15 text-xs text-night/80 font-mono">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#1E3A8A]" /> {v.passengerCapacity} {language === "uz" ? "o'ringacha" : language === "en" ? "seats" : "мест"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Luggage className="w-3.5 h-3.5 text-[#1E3A8A]" /> {v.luggageCapacity} {language === "uz" ? "ta chamadon" : language === "en" ? "bags" : "чемодана"}
                  </span>
                </div>

                {/* Multiple cars notice */}
                {isOverCapacity && (
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 leading-snug">
                    <p className="font-bold flex items-center gap-1 text-amber-800 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {language === "uz"
                          ? `${totalPeople} kishilik guruh uchun ${neededCars} ta avtomobil kerak`
                          : language === "en"
                          ? `For a group of ${totalPeople}, ${neededCars} vehicles are required`
                          : `Для вашей группы (${totalPeople} чел.) нужно ${neededCars} автомобиля`}
                      </span>
                    </p>
                    <p className="text-[11px] text-amber-700/80 mt-0.5 font-mono">
                      {neededCars} × ${v.priceOneWayUsd} × {multiplier} = ${totalCost}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-night/60">
                  {neededCars > 1
                    ? `${language === "uz" ? "Avtomobillar soni:" : language === "en" ? "Vehicles:" : "Автомобилей:"} ${neededCars}`
                    : `1 ${language === "uz" ? "avtomobil" : language === "en" ? "vehicle" : "автомобиль"}`}
                </span>
                <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-[#1E3A8A]" : "text-night/70"}`}>
                  {isSelected ? <Check className="w-3.5 h-3.5 text-[#1E3A8A]" /> : null}
                  <span>
                    {isSelected
                      ? (language === "uz" ? "Tanlandi" : language === "en" ? "Selected" : "Выбрано")
                      : (language === "uz" ? "Ushbu klassni tanlash" : language === "en" ? "Select this class" : "Выбрать этот класс")}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons: Secondary vs Primary */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-majolica/15">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
        >
          {language === "uz" ? "← Transport tanlashga qaytish" : language === "en" ? "← Back to Transport" : "← Назад к транспорту"}
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#152a65] hover:to-[#1d4ed8] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-102"
        >
          <span>{language === "uz" ? "Keyingi: Mehmonxona tanlash" : language === "en" ? "Next: Hotel Selection" : "Далее: Подбор отеля"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
