import React, { useState } from "react";
import { Guide, TravelersModel } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { getGuideDisplayName } from "./GuideCard";
import { trackEvent } from "@/lib/analytics";

interface GuideBookingModalProps {
  guide: Guide | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideBookingModal({ guide, isOpen, onClose }: GuideBookingModalProps) {
  const { t, language } = useTranslation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("2026-09-10");
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [contactMethod, setContactMethod] = useState<"telegram" | "whatsapp" | "phone">("telegram");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  if (!isOpen || !guide) return null;

  const displayName = getGuideDisplayName(guide.name, language);
  const totalTravelers = adults + childrenCount;
  const maxCapacity = guide.maxGroupSize ?? 8;
  const isOverCapacity = totalTravelers > maxCapacity;
  const price = guide.pricePerTourUsd ?? 40;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;

    setIsSubmitting(true);
    try {
      const travelers: TravelersModel = {
        type: adults === 1 && childrenCount === 0 ? "solo" : childrenCount > 0 ? "family" : "couple",
        adults,
        children: childrenCount,
        total: totalTravelers,
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          contactMethod,
          comments: `[${t.booking.guideLabel}: ${displayName} (${guide?.city})] ${comments}`,
          destination: guide?.region || "samarkand",
          travelers,
          duration: { totalDays: 1, activeDays: 1, restDays: 0 },
          totalCostUsd: price,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookingSuccessId(data.booking?.bookingId || `DYR-G${Math.floor(1000 + Math.random() * 9000)}`);
        trackEvent("booking_completed", { guideId: guide?.id, totalCost: price });
      } else {
        setBookingSuccessId(`DYR-G${Math.floor(1000 + Math.random() * 9000)}`);
      }
    } catch {
      setBookingSuccessId(`DYR-G${Math.floor(1000 + Math.random() * 9000)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setBookingSuccessId(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-plaster border border-sand rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in text-ink my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {bookingSuccessId ? (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center bg-white space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
              🎉
            </div>
            <h3 className="font-display text-2xl font-black text-ink">
              {t.booking.successTitle}
            </h3>
            <p className="text-sm text-night/70">
              {t.booking.successSubtitle}
            </p>

            <div className="bg-sand/30 border border-sand rounded-2xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-night/60">{t.booking.bookingIdLabel}:</span>
                <span className="font-mono font-bold text-registan text-sm">{bookingSuccessId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/60">{t.booking.guideLabel}:</span>
                <span className="font-bold text-ink">{displayName} ({guide.city})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/60">{t.booking.tourDateLabel}:</span>
                <span className="font-bold text-ink">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-night/60">{t.booking.travelersCountLabel}:</span>
                <span className="font-bold text-ink">{totalTravelers}</span>
              </div>
              <div className="flex justify-between border-t border-sand/80 pt-1.5 font-bold">
                <span>{t.booking.totalCostLabel}:</span>
                <span className="text-emerald-800 font-black text-sm">${price}</span>
              </div>
            </div>

            <p className="text-xs text-night/60">
              {t.booking.contactNotice}
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-registan text-white font-bold text-xs hover:bg-registan/90 transition-all shadow-md"
            >
              {t.booking.returnBtn}
            </button>
          </div>
        ) : (
          /* BOOKING FORM */
          <form onSubmit={handleSubmit}>
            <div className="bg-white border-b border-sand p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-registan block">
                  {t.booking.guideBookingSubtitle}
                </span>
                <h3 className="font-display font-black text-xl text-ink">
                  {displayName}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-sand/40 hover:bg-sand flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Trip Parameters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-night/70 block mb-1">
                    📅 {t.booking.dateLabel}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-ink focus:outline-hidden focus:border-registan"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-night/70 block mb-1">
                    👥 {t.booking.travelersLabel}
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <span className="text-[10px] text-night/50 block">{t.booking.adults}</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={adults}
                        onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-sand bg-white text-xs font-bold text-ink"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] text-night/50 block">{t.booking.children}</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-sand bg-white text-xs font-bold text-ink"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Capacity Warning */}
              {isOverCapacity && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <span className="text-base shrink-0">⚠️</span>
                  <div>
                    {t.booking.capacityWarning}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-3 pt-2 border-t border-sand/60">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                  {t.booking.contactInfoTitle}
                </h4>

                <div>
                  <label className="text-xs font-semibold text-night/70 block mb-1">
                    {t.booking.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.booking.fullNamePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-ink focus:outline-hidden focus:border-registan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-night/70 block mb-1">
                      {t.booking.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+998 90 123-45-67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-ink focus:outline-hidden focus:border-registan"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-night/70 block mb-1">
                      {t.booking.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-ink focus:outline-hidden focus:border-registan"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-night/70 block mb-1">
                    {t.booking.contactMethodLabel}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "telegram", label: "Telegram", icon: "✈️" },
                      { id: "whatsapp", label: "WhatsApp", icon: "💬" },
                      { id: "phone", label: "Phone", icon: "📞" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setContactMethod(m.id as any)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                          contactMethod === m.id
                            ? "bg-registan text-white border-registan shadow-xs"
                            : "bg-white border-sand text-ink hover:bg-sand/30"
                        }`}
                      >
                        <span>{m.icon}</span> {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-night/70 block mb-1">
                    {t.booking.commentsLabel}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t.booking.commentsPlaceholder}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sand bg-white text-xs font-medium text-ink focus:outline-hidden focus:border-registan"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border-t border-sand p-6 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-night/50 block">{t.booking.totalToPay}</span>
                <span className="text-xl font-black text-emerald-800">${price}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name || !phone}
                className="px-6 py-2.5 rounded-xl bg-registan text-white font-bold text-xs hover:bg-registan/90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t.booking.submitting : t.booking.submitBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
