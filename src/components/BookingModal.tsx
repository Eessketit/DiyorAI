import React, { useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { LeadContact, TripPlan } from "@/lib/types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: TripPlan;
}

export default function BookingModal({ isOpen, onClose, plan }: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactMethod, setContactMethod] = useState<"telegram" | "whatsapp" | "phone">("telegram");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<LeadContact | null>(null);

  if (!isOpen) return null;

  const totalCost = plan.costBreakdown?.total ?? 0;
  const travelers = plan.preferences.travelers || { type: "couple" as const, adults: 2, children: 0, total: 2 };
  const destination = plan.preferences.region;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, укажите ваше имя и контактный телефон");
      return;
    }

    setError(null);
    setLoading(true);
    trackEvent("booking_form_submitted", { destination, totalCost });

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          contactMethod,
          comments,
          destination,
          travelers,
          duration: plan.preferences.duration || { totalDays: plan.preferences.days || 3, activeDays: plan.preferences.days || 3, restDays: 0 },
          transport: plan.transport,
          transfer: plan.transfer,
          hotel: plan.hotel,
          totalCostUsd: totalCost,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ошибка бронирования");
      }

      setBookingSuccess(data.booking);
      trackEvent("booking_completed", { bookingId: data.booking.bookingId });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-sand my-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-night/50 hover:text-ink w-8 h-8 rounded-full bg-sand/30 flex items-center justify-center font-bold text-sm"
        >
          ✕
        </button>

        {bookingSuccess ? (
          /* Success Screen */
          <div className="text-center py-4 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-3xl mx-auto">
              🎉
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Поездка успешно забронирована!
              </h2>
              <p className="text-xs sm:text-sm text-night/70 mt-1 max-w-md mx-auto">
                Спасибо! Мы получили ваши данные и свяжемся с вами в течение 15 минут для подтверждения бронирования.
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-plaster/50 border border-sand rounded-2xl p-4 sm:p-5 text-left text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-sand">
                <span className="text-night/60 font-semibold">Номер бронирования (Booking ID):</span>
                <span className="font-mono font-black text-sm text-registan bg-registan/10 px-2.5 py-0.5 rounded-md">
                  {bookingSuccess.bookingId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-night/60">Направление:</span>
                <span className="font-bold text-ink uppercase">{bookingSuccess.destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-night/60">Путешественники:</span>
                <span className="font-bold text-ink">{travelers.total} чел. ({travelers.adults} взр.{travelers.children > 0 ? `, ${travelers.children} дет.` : ""})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-night/60">Продолжительность:</span>
                <span className="font-bold text-ink">{plan.preferences.duration?.totalDays || plan.preferences.days || 3} дней</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-sand">
                <span className="font-bold text-ink">Расчетная стоимость:</span>
                <span className="font-display font-black text-base text-ink">
                  ${bookingSuccess.totalCostUsd}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-sand bg-white hover:bg-sand/30 text-xs font-bold text-ink transition-colors"
              >
                Вернуться к маршруту
              </button>
              <Link
                href="/"
                className="flex-1 py-3 px-4 rounded-xl bg-clay hover:bg-clay/90 text-plaster text-xs font-bold text-center transition-colors shadow-md"
              >
                На главную
              </Link>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider text-registan font-bold block mb-1">
                🔒 Безопасное бронирование
              </span>
              <h2 className="font-display text-2xl font-bold text-ink">
                Оформление поездки DiyorAI
              </h2>
              <p className="text-xs text-night/70 mt-1">
                Все выбранные услуги и расчет маршрута уже привязаны к вашей заявке.
              </p>
            </div>

            {/* Trip summary badge */}
            <div className="bg-sand/30 rounded-xl p-3.5 mb-6 text-xs flex items-center justify-between gap-2 flex-wrap border border-sand">
              <div>
                <span className="font-bold text-ink block">
                  {destination.toUpperCase()} · {plan.preferences.duration?.totalDays || plan.preferences.days || 3} дней ({travelers.total} чел.)
                </span>
                <span className="text-[11px] text-night/60">
                  {plan.transport ? `Транспорт: ${plan.transport.type}` : "Без транспорта"} · {plan.hotel ? plan.hotel.hotel.name : "Без отеля"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-night/60 block">Итого:</span>
                <span className="font-display font-black text-lg text-ink">${totalCost}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-ink mb-1.5" htmlFor="book-name">
                  Ваше имя *
                </label>
                <input
                  id="book-name"
                  type="text"
                  required
                  placeholder="Например, Азиз Рахимов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-plaster/40 focus:bg-white text-ink text-xs focus:outline-none focus:border-clay"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-ink mb-1.5" htmlFor="book-phone">
                    Телефон (Telegram / WhatsApp) *
                  </label>
                  <input
                    id="book-phone"
                    type="tel"
                    required
                    placeholder="+998 90 123-45-67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-plaster/40 focus:bg-white text-ink text-xs focus:outline-none focus:border-clay"
                  />
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1.5" htmlFor="book-email">
                    Email (для ваучера поездки)
                  </label>
                  <input
                    id="book-email"
                    type="email"
                    placeholder="traveler@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand bg-plaster/40 focus:bg-white text-ink text-xs focus:outline-none focus:border-clay"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1.5">
                  Удобный способ связи
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["telegram", "whatsapp", "phone"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setContactMethod(method)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                        contactMethod === method
                          ? "bg-ink text-plaster border-ink"
                          : "border-sand bg-plaster/30 text-ink hover:border-sand/90"
                      }`}
                    >
                      {method === "telegram" ? "✈️ Telegram" : method === "whatsapp" ? "💬 WhatsApp" : "📞 Звонок"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-ink mb-1.5" htmlFor="book-comments">
                  Пожелания или комментарии к поездке
                </label>
                <textarea
                  id="book-comments"
                  rows={2}
                  placeholder="Детское кресло в авто, вегетарианское меню, ранний заезд в отель..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-sand bg-plaster/40 focus:bg-white text-ink text-xs focus:outline-none focus:border-clay"
                />
              </div>

              {error && <p className="text-trust-low font-bold text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-clay hover:bg-clay/90 disabled:opacity-60 text-plaster font-bold py-3.5 rounded-xl transition-all shadow-md text-sm uppercase tracking-wider mt-2"
              >
                {loading ? "Отправка заявки..." : "Подтвердить бронирование"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
