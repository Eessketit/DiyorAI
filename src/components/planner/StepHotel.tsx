import React from "react";
import { MOCK_HOTELS } from "@/data/mockTravelData";
import {
  DurationModel,
  HotelOption,
  Region,
  SelectedHotel,
  TravelersModel,
} from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
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
  const { t, language } = useTranslation();
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-majolica/20 text-xs font-mono font-bold text-night uppercase tracking-wider mb-2">
          {language === "uz" ? "3-bosqich (3 tadan)" : language === "en" ? "Step 3 of 3" : "Этап 3 из 3"}
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-night flex items-center gap-2">
          <Building className="w-6 h-6 text-majolica" />
          <span>{language === "uz" ? "Qayerda tunashni xohlaysiz?" : language === "en" ? "Where would you like to stay?" : "Где вы хотите остановиться?"}</span>
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1 font-light">
          {language === "uz"
            ? `Davomiylik: ${duration.totalDays} kun (${nights} kecha) · Mehmonlar: ${totalGuests} kishi`
            : language === "en"
            ? `Duration: ${duration.totalDays} days (${nights} nights) · Guests: ${totalGuests} people`
            : `Продолжительность: ${duration.totalDays} дн. (${nights} ноч.) · Гостей: ${totalGuests} чел.`}
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
                  ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]/30 shadow-md bg-indigo-50/40"
                  : "border-slate-200 hover:border-indigo-300 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-paper border border-majolica/20 flex items-center justify-center text-[#1E3A8A] shrink-0">
                    <Building className="w-6 h-6 text-[#1E3A8A]" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-500 flex items-center justify-end gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{h.rating}</span>
                    </span>
                    <div className="text-lg font-mono font-black text-night">
                      ${totalCost}
                    </div>
                    <span className="text-[10px] text-night/60 font-mono block">
                      ${h.pricePerNightUsd}/{language === "uz" ? "kecha" : language === "en" ? "night" : "ночь"} ({nights} {language === "uz" ? "kecha" : language === "en" ? "nights" : "ноч."})
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

                <div className="p-2.5 bg-paper rounded-xl border border-majolica/20 text-xs mb-3 space-y-1 font-mono">
                  <div className="flex items-center justify-between text-night/80">
                    <span className="font-semibold">{h.roomType}</span>
                    <span>{language === "uz" ? `${h.roomCapacity} kishigacha` : language === "en" ? `Up to ${h.roomCapacity} guests` : `До ${h.roomCapacity} мест`}</span>
                  </div>
                  {neededRooms > 1 && (
                    <p className="text-[11px] text-amber-800 font-bold pt-1 border-t border-amber-200 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-700" />
                      <span>
                        {language === "uz"
                          ? `${totalGuests} nafar mehmon uchun ${neededRooms} ta xona kerak`
                          : language === "en"
                          ? `For ${totalGuests} guests, ${neededRooms} rooms are required`
                          : `Для ${totalGuests} гостей требуется ${neededRooms} номера`}
                      </span>
                    </p>
                  )}
                </div>

                {/* Amenities */}
                <div className="space-y-1">
                  {h.amenities.map((am, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-night/80 font-light">
                      <Check className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-majolica/15 flex items-center justify-between text-xs font-mono">
                <span className="text-night/60">
                  {neededRooms} {language === "uz" ? "ta xona" : language === "en" ? (neededRooms === 1 ? "room" : "rooms") : (neededRooms === 1 ? "номер" : "номера")}
                </span>
                <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-[#1E3A8A]" : "text-night/70"}`}>
                  {isSelected ? <Check className="w-3.5 h-3.5 text-[#1E3A8A]" /> : null}
                  <span>
                    {isSelected
                      ? (language === "uz" ? "Tanlandi" : language === "en" ? "Selected" : "Выбрано")
                      : (language === "uz" ? "Mehmonxonani tanlash" : language === "en" ? "Select hotel" : "Выбрать отель")}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons: Secondary (Back) vs Primary (Submit) */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-majolica/15">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
        >
          {language === "uz" ? "← Transfer tanlashga qaytish" : language === "en" ? "← Back to Transfer" : "← Назад к трансферу"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onNext}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#152a65] hover:to-[#1d4ed8] disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer hover:scale-102"
        >
          <Compass className="w-4 h-4 text-white" />
          <span>
            {loading
              ? (language === "uz" ? "Marshrut tuzilmoqda..." : language === "en" ? "Crafting itinerary..." : "Формируем маршрут...")
              : (language === "uz" ? "Barcha xizmatlar bilan yo'nalishni tuzish →" : language === "en" ? "Build Final Itinerary with Services →" : "Построить маршрут со всеми услугами →")}
          </span>
        </button>
      </div>
    </div>
  );
}
