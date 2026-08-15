import React from "react";
import { MOCK_HOTELS } from "@/data/mockTravelData";
import {
  DurationModel,
  HotelOption,
  Region,
  SelectedHotel,
  TravelersModel,
} from "@/lib/types";
import { Building, Star, MapPin, Check, Compass, Users } from "lucide-react";

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-sand text-xs font-mono font-bold text-night uppercase tracking-wider mb-2">
          Этап 3 из 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-night flex items-center gap-2">
          <Building className="w-6 h-6 text-majolica" />
          <span>Где вы хотите остановиться?</span>
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1 font-light">
          Продолжительность: <span className="font-bold text-night font-mono">{duration.totalDays} дн. ({nights} ноч.)</span> ·
          Гостей: <span className="font-bold text-night font-mono">{totalGuests} чел.</span>
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
                  ? "border-majolica ring-2 ring-majolica/30 shadow-md bg-paper/40"
                  : "border-sand hover:border-majolica/60 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-paper border border-sand flex items-center justify-center text-majolica shrink-0">
                    <Building className="w-6 h-6 text-majolica" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-gold flex items-center justify-end gap-1">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span>{h.rating}</span>
                    </span>
                    <div className="text-lg font-mono font-black text-night">
                      ${totalCost}
                    </div>
                    <span className="text-[10px] text-night/60 font-mono block">
                      ${h.pricePerNightUsd}/ночь ({nights} ноч.)
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-night text-base">
                  {h.name}
                </h3>
                <p className="text-xs text-night/60 mt-0.5 mb-3 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3 text-majolica" />
                  <span>{h.location}</span>
                </p>

                <div className="p-2.5 bg-paper rounded-xl border border-sand text-xs mb-3 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-night/80">
                    <span className="font-semibold">{h.roomType}</span>
                    <span>До {h.roomCapacity} мест</span>
                  </div>
                  {neededRooms > 1 && (
                    <p className="text-[11px] text-gold font-bold pt-1 border-t border-sand flex items-center gap-1">
                      <Users className="w-3 h-3 text-gold" />
                      <span>Для {totalGuests} гостей требуется {neededRooms} номера</span>
                    </p>
                  )}
                </div>

                {/* Amenities */}
                <div className="space-y-1">
                  {h.amenities.map((am, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-night/80">
                      <Check className="w-3.5 h-3.5 text-majolica shrink-0" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand/60 flex items-center justify-between text-xs font-mono">
                <span className="text-night/60">
                  {neededRooms} {neededRooms === 1 ? "номер" : "номера"}
                </span>
                <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-majolica" : "text-night/70"}`}>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isSelected ? "Выбрано" : "Выбрать отель"}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons: Secondary (Back) vs Primary (Submit) */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-sand">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-majolica/40 bg-paper text-xs sm:text-sm font-semibold text-night hover:bg-majolica/10 transition-colors"
        >
          ← Назад к трансферу
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-majolica hover:bg-majolica/90 disabled:opacity-50 text-paper text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 tracking-wider hover:scale-102"
        >
          <Compass className="w-4 h-4 text-paper" />
          <span>{loading ? "Формируем маршрут..." : "Построить маршрут со всеми услугами →"}</span>
        </button>
      </div>
    </div>
  );
}
