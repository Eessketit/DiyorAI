import React from "react";
import { MOCK_HOTELS } from "@/data/mockTravelData";
import {
  DurationModel,
  HotelOption,
  Region,
  SelectedHotel,
  TravelersModel,
} from "@/lib/types";

interface StepHotelProps {
  region: Region;
  travelers: TravelersModel;
  duration: DurationModel;
  selectedHotel?: SelectedHotel;
  onSelect: (hotel: SelectedHotel) => void;
  onNext: () => void;
  onBack: () => void;
  loading?: boolean;
}

export default function StepHotel({
  region,
  travelers,
  duration,
  selectedHotel,
  onSelect,
  onNext,
  onBack,
  loading,
}: StepHotelProps) {
  const hotels = MOCK_HOTELS[region] || MOCK_HOTELS.samarkand;

  const totalGuests = travelers.total;
  const nights = Math.max(1, duration.totalDays - 1);

  const handleSelectHotel = (hotel: HotelOption) => {
    const numberOfRooms = Math.max(1, Math.ceil(totalGuests / hotel.roomCapacity));
    const totalCostUsd = numberOfRooms * hotel.pricePerNightUsd * nights;

    onSelect({
      hotel,
      nights,
      numberOfRooms,
      totalCostUsd,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Этап 3 из 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          🏨 Где вы хотите остановиться?
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1">
          Продолжительность: <span className="font-bold text-ink">{duration.totalDays} дн. ({nights} ноч.)</span> ·
          Гостей: <span className="font-bold text-ink">{totalGuests} чел.</span>
        </p>
      </div>

      {/* Hotel Cards List */}
      <div className="grid sm:grid-cols-3 gap-4">
        {hotels.map((h) => {
          const neededRooms = Math.max(1, Math.ceil(totalGuests / h.roomCapacity));
          const totalCost = neededRooms * h.pricePerNightUsd * nights;
          const isSelected = selectedHotel?.hotel.id === h.id;

          return (
            <div
              key={h.id}
              onClick={() => handleSelectHotel(h)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                isSelected
                  ? "border-registan ring-2 ring-registan/30 shadow-md bg-registan/5"
                  : "border-sand hover:border-registan/70 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-3xl p-2 rounded-xl bg-sand/30">{h.photoUrl}</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-600">★ {h.rating}</span>
                    <div className="text-lg font-display font-black text-ink">
                      ${totalCost}
                    </div>
                    <span className="text-[10px] text-night/60 block">
                      ${h.pricePerNightUsd}/ночь ({nights} ноч.)
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-ink text-base">
                  {h.name}
                </h3>
                <p className="text-xs text-night/60 mt-0.5 mb-3">
                  📍 {h.location}
                </p>

                <div className="p-2.5 bg-plaster/60 rounded-xl border border-sand/60 text-xs mb-3 space-y-1">
                  <div className="flex items-center justify-between text-night/80">
                    <span className="font-semibold">{h.roomType}</span>
                    <span>До {h.roomCapacity} мест</span>
                  </div>
                  {neededRooms > 1 && (
                    <p className="text-[11px] text-amber-800 font-bold pt-1 border-t border-sand/40">
                      👥 Для {totalGuests} гостей требуется {neededRooms} номера
                    </p>
                  )}
                </div>

                {/* Amenities */}
                <div className="space-y-1">
                  {h.amenities.map((am, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-night/70">
                      <span className="text-emerald-600">✓</span>
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand/60 flex items-center justify-between text-xs">
                <span className="text-night/60">
                  {neededRooms} {neededRooms === 1 ? "номер" : "номера"}
                </span>
                <span className={`font-bold ${isSelected ? "text-registan" : "text-emerald-700"}`}>
                  {isSelected ? "✓ Выбрано" : "Выбрать отель"}
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
          ← Назад к трансферу
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-registan hover:bg-registan/90 disabled:opacity-50 text-plaster text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 uppercase tracking-wider"
        >
          {loading ? "Формируем маршрут..." : "🗺️ Построить маршрут с учетом всех услуг →"}
        </button>
      </div>
    </div>
  );
}
