import React, { useState } from "react";
import { MOCK_FLIGHTS, MOCK_TRAINS } from "@/data/mockTravelData";
import {
  FlightOption,
  Region,
  SelectedTransport,
  TrainOption,
  TransportType,
  TravelersModel,
} from "@/lib/types";

interface StepTransportProps {
  region: Region;
  travelers: TravelersModel;
  selectedTransport?: SelectedTransport;
  onSelect: (transport: SelectedTransport) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepTransport({
  region,
  travelers,
  selectedTransport,
  onSelect,
  onNext,
  onBack,
}: StepTransportProps) {
  const [tab, setTab] = useState<TransportType>(selectedTransport?.type || "train");
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(selectedTransport?.isRoundTrip ?? true);

  const flights = MOCK_FLIGHTS[region] || MOCK_FLIGHTS.samarkand;
  const trains = MOCK_TRAINS[region] || MOCK_TRAINS.samarkand;

  const passengers = travelers.total;

  const handleSelectFlight = (flight: FlightOption) => {
    const multiplier = isRoundTrip ? 2 : 1;
    const totalCostUsd = flight.pricePerPassengerUsd * passengers * multiplier;
    onSelect({
      type: "flight",
      flight,
      isRoundTrip,
      passengers,
      totalCostUsd,
    });
  };

  const handleSelectTrain = (train: TrainOption) => {
    const multiplier = isRoundTrip ? 2 : 1;
    const totalCostUsd = train.pricePerPassengerUsd * passengers * multiplier;
    onSelect({
      type: "train",
      train,
      isRoundTrip,
      passengers,
      totalCostUsd,
    });
  };

  const handleSelectCar = () => {
    const distanceKm = region === "samarkand" ? 310 : region === "bukhara" ? 570 : region === "khiva" ? 980 : 85;
    const hours = Math.round(distanceKm / 70);
    const fuelCost = Math.round((distanceKm * 2 * 0.1 * 1.1) / (passengers > 4 ? 0.5 : 1)); // approx fuel
    onSelect({
      type: "car",
      car: {
        id: "car-personal",
        type: "personal",
        title: "Личный автомобиль / Аренда авто",
        estimatedDistanceKm: distanceKm,
        estimatedTravelHours: hours,
        estimatedFuelCostUsd: fuelCost,
      },
      isRoundTrip: true,
      passengers,
      totalCostUsd: fuelCost,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/60 text-xs font-bold text-ink uppercase tracking-wider mb-2">
          Этап 1 из 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          ✈️ Как добраться до места назначения?
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1">
          Пассажиров: <span className="font-bold text-ink">{passengers} чел.</span> ({travelers.adults} взр.
          {travelers.children > 0 ? `, ${travelers.children} дет.` : ""}). Выберите подходящий транспорт:
        </p>
      </div>

      {/* Transport Type Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-sand/40 rounded-2xl border border-sand">
        <button
          type="button"
          onClick={() => setTab("train")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === "train" ? "bg-ink text-plaster shadow-md" : "text-ink hover:bg-white/60"
          }`}
        >
          <span>🚆</span> Поезд (Afrosiyob)
        </button>
        <button
          type="button"
          onClick={() => setTab("flight")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === "flight" ? "bg-ink text-plaster shadow-md" : "text-ink hover:bg-white/60"
          }`}
        >
          <span>✈️</span> Самолёт
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("car");
            handleSelectCar();
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === "car" ? "bg-ink text-plaster shadow-md" : "text-ink hover:bg-white/60"
          }`}
        >
          <span>🚗</span> На машине
        </button>
      </div>

      {/* Round trip toggle */}
      {tab !== "car" && (
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-sand text-xs">
          <span className="font-semibold text-ink">Тип билетов:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRoundTrip(false)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                !isRoundTrip ? "bg-registan text-plaster" : "bg-sand/40 text-night/80"
              }`}
            >
              В одну сторону
            </button>
            <button
              type="button"
              onClick={() => setIsRoundTrip(true)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                isRoundTrip ? "bg-registan text-plaster" : "bg-sand/40 text-night/80"
              }`}
            >
              Туда и обратно (Round trip)
            </button>
          </div>
        </div>
      )}

      {/* Flights List */}
      {tab === "flight" && (
        <div className="space-y-3">
          {flights.map((f) => {
            const isSelected = selectedTransport?.flight?.id === f.id;
            const singleCost = f.pricePerPassengerUsd * (isRoundTrip ? 2 : 1);
            const totalCost = singleCost * passengers;

            return (
              <div
                key={f.id}
                onClick={() => handleSelectFlight(f)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? "border-registan ring-2 ring-registan/30 shadow-md bg-registan/5"
                    : "border-sand hover:border-registan/70 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-sand/30">{f.airlineLogo}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-ink text-sm sm:text-base">
                          {f.airline}
                        </span>
                        <span className="text-[10px] bg-sand/60 px-2 py-0.5 rounded font-mono font-bold text-night/70">
                          {f.flightNumber}
                        </span>
                      </div>
                      <p className="text-xs text-night/60 mt-0.5">
                        {f.fromAirport} → {f.toAirport}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-display font-black text-ink">
                      ${totalCost}
                    </div>
                    <p className="text-[11px] text-night/60">
                      ${singleCost}/чел. ({passengers} пасс. {isRoundTrip ? "в обе стороны" : ""})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-sand/60 pt-3 mt-3 text-xs text-night/80">
                  <div className="flex items-center gap-4">
                    <span>🕒 Вылет: <strong>{f.departureTime}</strong></span>
                    <span>🛬 Прибытие: <strong>{f.arrivalTime}</strong></span>
                    <span>⏳ В пути: <strong>{f.duration}</strong></span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">
                    {isSelected ? "✓ Выбрано" : "Выбрать рейс"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trains List */}
      {tab === "train" && (
        <div className="space-y-3">
          {trains.map((t) => {
            const isSelected = selectedTransport?.train?.id === t.id;
            const singleCost = t.pricePerPassengerUsd * (isRoundTrip ? 2 : 1);
            const totalCost = singleCost * passengers;

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTrain(t)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? "border-registan ring-2 ring-registan/30 shadow-md bg-registan/5"
                    : "border-sand hover:border-registan/70 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-sand/30">🚆</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-ink text-sm sm:text-base">
                          {t.name}
                        </span>
                        <span className="text-[10px] bg-registan/20 text-registan px-2 py-0.5 rounded font-bold uppercase">
                          {t.trainClass}
                        </span>
                      </div>
                      <p className="text-xs text-night/60 mt-0.5">
                        {t.fromCity} → {t.toCity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-display font-black text-ink">
                      ${totalCost}
                    </div>
                    <p className="text-[11px] text-night/60">
                      ${singleCost}/чел. ({passengers} пасс. {isRoundTrip ? "в обе стороны" : ""})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-sand/60 pt-3 mt-3 text-xs text-night/80">
                  <div className="flex items-center gap-4">
                    <span>🕒 Отправление: <strong>{t.departureTime}</strong></span>
                    <span>🏁 Прибытие: <strong>{t.arrivalTime}</strong></span>
                    <span>⏳ Время: <strong>{t.duration}</strong></span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">
                    {isSelected ? "✓ Выбрано" : "Выбрать поезд"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Car view */}
      {tab === "car" && (
        <div className="p-6 bg-white rounded-2xl border border-sand space-y-4">
          <div className="flex items-start gap-4">
            <span className="text-4xl p-3 bg-sand/30 rounded-2xl">🚗</span>
            <div>
              <h3 className="font-display font-bold text-lg text-ink">
                Поездка на автомобиле (Автопутешествие)
              </h3>
              <p className="text-xs text-night/70 mt-1 leading-relaxed">
                Отличный выбор для гибкого графика остановок по трассе M39/M37 (остановки у садов, арбузных развалов, чайхан).
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-plaster/50 rounded-xl border border-sand">
              <span className="text-night/60 block">Расстояние</span>
              <span className="font-display font-bold text-base text-ink">
                ~{region === "samarkand" ? 310 : region === "bukhara" ? 570 : region === "khiva" ? 980 : 85} км
              </span>
            </div>
            <div className="p-3 bg-plaster/50 rounded-xl border border-sand">
              <span className="text-night/60 block">Время в пути</span>
              <span className="font-display font-bold text-base text-ink">
                ~{Math.round((region === "samarkand" ? 310 : region === "bukhara" ? 570 : region === "khiva" ? 980 : 85) / 70)} ч.
              </span>
            </div>
            <div className="p-3 bg-plaster/50 rounded-xl border border-sand">
              <span className="text-night/60 block">Расход на топливо</span>
              <span className="font-display font-bold text-base text-emerald-800">
                ~${selectedTransport?.totalCostUsd || 35}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-sand">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-sand bg-white text-xs sm:text-sm font-semibold text-ink hover:bg-sand/30 transition-colors"
        >
          ← Изменить параметры поездки
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-clay hover:bg-clay/90 text-plaster text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
        >
          Далее: Трансфер и передвижение →
        </button>
      </div>
    </div>
  );
}
