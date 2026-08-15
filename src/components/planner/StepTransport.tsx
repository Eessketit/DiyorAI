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
import { useTranslation } from "@/lib/i18n";
import { Train, Plane, Car, Clock, ArrowRight, Check } from "lucide-react";

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
  const { t } = useTranslation();
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper border border-majolica/20 text-xs font-mono font-bold text-night uppercase tracking-wider mb-2">
          Этап 1 из 3
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-night flex items-center gap-2">
          <Train className="w-6 h-6 text-majolica" />
          <span>Как добраться до места назначения?</span>
        </h2>
        <p className="text-xs sm:text-sm text-night/70 mt-1 font-light">
          Пассажиров: <span className="font-bold text-night font-mono">{passengers} чел.</span> ({travelers.adults} взр.
          {travelers.children > 0 ? `, ${travelers.children} дет.` : ""}). Выберите подходящий транспорт:
        </p>
      </div>

      {/* Transport Type Tabs (Secondary Buttons) */}
      <div className="flex items-center gap-2 p-1.5 bg-paper rounded-2xl border border-majolica/20">
        <button
          type="button"
          onClick={() => setTab("train")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === "train" ? "bg-night text-paper shadow-md" : "text-night hover:bg-majolica/10"
          }`}
        >
          <Train className="w-4 h-4 text-majolica" />
          <span>{t.planner.trainTab}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("flight")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === "flight" ? "bg-night text-paper shadow-md" : "text-night hover:bg-majolica/10"
          }`}
        >
          <Plane className="w-4 h-4 text-majolica" />
          <span>{t.planner.flightTab}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("car");
            handleSelectCar();
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === "car" ? "bg-night text-paper shadow-md" : "text-night hover:bg-majolica/10"
          }`}
        >
          <Car className="w-4 h-4 text-majolica" />
          <span>{t.planner.carTab}</span>
        </button>
      </div>

      {/* Round trip toggle */}
      {tab !== "car" && (
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-majolica/20 text-xs font-mono">
          <span className="font-semibold text-night">{t.planner.passengersCount}:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRoundTrip(false)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                !isRoundTrip ? "bg-majolica text-paper" : "bg-paper border border-majolica/20 text-night"
              }`}
            >
              {t.planner.oneWay}
            </button>
            <button
              type="button"
              onClick={() => setIsRoundTrip(true)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
                isRoundTrip ? "bg-majolica text-paper" : "bg-paper border border-majolica/20 text-night"
              }`}
            >
              {t.planner.roundTrip}
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
                    ? "border-majolica ring-2 ring-majolica/30 shadow-md bg-paper/40"
                    : "border-majolica/20 hover:border-majolica/60 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-paper border border-majolica/20 flex items-center justify-center text-majolica shrink-0">
                      <Plane className="w-6 h-6 text-majolica" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-night text-sm sm:text-base">
                          {f.airline}
                        </span>
                        <span className="text-[10px] bg-paper border border-majolica/20 px-2 py-0.5 rounded font-mono font-bold text-night/70">
                          {f.flightNumber}
                        </span>
                      </div>
                      <p className="text-xs text-night/60 mt-0.5">
                        {f.fromAirport} → {f.toAirport}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-mono font-black text-night">
                      ${totalCost}
                    </div>
                    <p className="text-[11px] text-night/60 font-mono">
                      ${singleCost}/чел. ({passengers} пасс. {isRoundTrip ? "в обе стороны" : ""})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-majolica/15 pt-3 mt-3 text-xs text-night/80 font-mono">
                  <div className="flex items-center gap-4">
                    <span>Вылет: <strong>{f.departureTime}</strong></span>
                    <span>Прибытие: <strong>{f.arrivalTime}</strong></span>
                    <span>В пути: <strong>{f.duration}</strong></span>
                  </div>
                  <span className="text-majolica font-bold text-[11px] flex items-center gap-1">
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{isSelected ? "Выбрано" : "Выбрать рейс"}</span>
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
                    ? "border-majolica ring-2 ring-majolica/30 shadow-md bg-paper/40"
                    : "border-majolica/20 hover:border-majolica/60 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-paper border border-majolica/20 flex items-center justify-center text-majolica shrink-0">
                      <Train className="w-6 h-6 text-majolica" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-night text-sm sm:text-base">
                          {t.name}
                        </span>
                        <span className="text-[10px] bg-majolica/10 border border-majolica/30 text-night px-2 py-0.5 rounded font-mono font-bold uppercase">
                          {t.trainClass}
                        </span>
                      </div>
                      <p className="text-xs text-night/60 mt-0.5">
                        {t.fromCity} → {t.toCity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg sm:text-xl font-mono font-black text-night">
                      ${totalCost}
                    </div>
                    <p className="text-[11px] text-night/60 font-mono">
                      ${singleCost}/чел. ({passengers} пасс. {isRoundTrip ? "в обе стороны" : ""})
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-majolica/15 pt-3 mt-3 text-xs text-night/80 font-mono">
                  <div className="flex items-center gap-4">
                    <span>Отправление: <strong>{t.departureTime}</strong></span>
                    <span>Прибытие: <strong>{t.arrivalTime}</strong></span>
                    <span>Время: <strong>{t.duration}</strong></span>
                  </div>
                  <span className="text-majolica font-bold text-[11px] flex items-center gap-1">
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{isSelected ? "Выбрано" : "Выбрать поезд"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Car view */}
      {tab === "car" && (
        <div className="p-6 bg-white rounded-2xl border border-majolica/20 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-paper border border-majolica/20 flex items-center justify-center text-majolica shrink-0">
              <Car className="w-7 h-7 text-majolica" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-night">
                Поездка на автомобиле (Автопутешествие)
              </h3>
              <p className="text-xs text-night/70 mt-1 leading-relaxed font-light">
                Отличный выбор для гибкого графика остановок по трассе M39/M37 (остановки у садов, арбузных развалов, чайхан).
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-2 text-center text-xs font-mono">
            <div className="p-3 bg-paper rounded-xl border border-majolica/20">
              <span className="text-night/60 block">Расстояние</span>
              <span className="font-mono font-bold text-base text-night">
                ~{region === "samarkand" ? 310 : region === "bukhara" ? 570 : region === "khiva" ? 980 : 85} км
              </span>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-majolica/20">
              <span className="text-night/60 block">Время в пути</span>
              <span className="font-mono font-bold text-base text-night">
                ~{Math.round((region === "samarkand" ? 310 : region === "bukhara" ? 570 : region === "khiva" ? 980 : 85) / 70)} ч.
              </span>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-majolica/20">
              <span className="text-night/60 block">Расход на топливо</span>
              <span className="font-mono font-bold text-base text-gold">
                ~${selectedTransport?.totalCostUsd || 35}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons: Secondary (Back) vs Primary (Next) */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-majolica/15">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-majolica/40 bg-paper text-xs sm:text-sm font-semibold text-night hover:bg-majolica/10 transition-colors"
        >
          ← Изменить параметры поездки
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-7 py-3 rounded-xl bg-majolica hover:bg-majolica/90 text-paper text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2"
        >
          <span>Далее: Трансфер и передвижение</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
