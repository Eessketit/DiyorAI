import React from "react";
import { Guide } from "@/lib/types";
import { useTranslation, Language } from "@/lib/i18n";
import { getGuideDisplayName } from "./GuideCard";
import { ShieldCheck, Target, CheckCircle2, Circle, X, Star, MapPin, Award, UserCheck, Calendar } from "lucide-react";

interface GuideVerificationModalProps {
  guide: Guide | null;
  mode: "trust" | "match" | null;
  onClose: () => void;
  onBook: (guide: Guide) => void;
  userContext?: {
    region?: string;
    interests?: string[];
    travelerType?: string;
    language?: string;
  };
}

export default function GuideVerificationModal({
  guide,
  mode,
  onClose,
  onBook,
  userContext,
}: GuideVerificationModalProps) {
  const { language } = useTranslation();

  if (!guide || !mode) return null;

  const displayName = getGuideDisplayName(guide.name, language);
  const trustScore = guide.trustScore ?? 94;
  const matchScore = guide.matchScore ?? 92;

  const trustChecklist = [
    {
      title: language === "uz" ? "Shaxsiyati tasdiqlangan" : language === "en" ? "Identity Verified" : "Личность подтверждена",
      description: language === "uz" ? "Davlat ID / Pasport tekshiruvidan o'tgan" : language === "en" ? "Government ID / Passport verified" : "Паспорт и личные данные проверены сервисом",
      verified: guide.verification?.identity ?? true,
    },
    {
      title: language === "uz" ? "Gidlik litsenziyasi va malaka" : language === "en" ? "Professional License & Certification" : "Квалификация и лицензия подтверждены",
      description: language === "uz" ? "Turizm qo'mitasi akkreditatsiyasi mavjud" : language === "en" ? "Tourism Committee official accreditation" : "Государственная аккредитация Комитета по туризму",
      verified: guide.verification?.qualification ?? true,
    },
    {
      title: language === "uz" ? "Kasbiy tajriba tasdiqlangan" : language === "en" ? "Experience Confirmed" : "Опыт подтверждён",
      description: `${guide.experienceYears || 5}+ ${language === "uz" ? "yillik faoliyat va 100+ o'tkazilgan sayohatlar" : language === "en" ? "years active & 100+ completed tours" : "лет практики и более 100+ проведенных экскурсий"}`,
      verified: true,
    },
    {
      title: language === "uz" ? "Haqiqiy sayyohlar sharhlari" : language === "en" ? "Real Traveler Reviews" : "Проверенные отзывы туристов",
      description: `${guide.reviews?.count || 48} ${language === "uz" ? "ta haqiqiy baho, o'rtacha reyting" : language === "en" ? "verified reviews, average rating" : "отзывов туристов со средним баллом"} ⭐ ${guide.rating.toFixed(1)}`,
      verified: true,
    },
    {
      title: language === "uz" ? "Chet tillari bilish darajasi" : language === "en" ? "Verified Languages" : "Языковые сертификаты",
      description: language === "uz" ? "Erkin va tasdiqlangan muloqot darajasi" : language === "en" ? "Fluent spoken & verified proficiency" : "Подтвержденный свободный уровень владения языками",
      verified: guide.verification?.language ?? true,
    },
  ];

  const matchChecklist = [
    {
      title: language === "uz" ? "Mavzular va qiziqishlar mos keladi" : language === "en" ? "Specialization Matches Your Interests" : "Совпадает специализация",
      description: language === "uz" ? "Tarix, me'morchilik va milliy taomlar bo'yicha chuqur bilim" : language === "en" ? "Deep expertise in history, architecture & local gastronomy" : "Глубокая экспертиза по вашим выбранным темам и интересам",
      matched: true,
    },
    {
      title: language === "uz" ? "Tanlangan hududda faoliyat yuritadi" : language === "en" ? "Operates in Your Selected City" : "Работает в выбранном городе",
      description: `${guide.city} (${guide.region})`,
      matched: true,
    },
    {
      title: language === "uz" ? "Muloqot tili sizga qulay" : language === "en" ? "Language Proficiency" : "Подходит язык экскурсии",
      description: guide.languages.map((l) => (typeof l === "string" ? l : l.label)).join(", "),
      matched: true,
    },
    {
      title: language === "uz" ? "Guruh hajmiga mos keladi" : language === "en" ? "Group Format Matches" : "Подходит формат вашей группы",
      description: `${language === "uz" ? "Guruh sig'imi" : language === "en" ? "Max capacity" : "Вместимость группы"}: до ${guide.maxGroupSize || 8} чел.`,
      matched: true,
    },
    {
      title: language === "uz" ? "Tanlangan sanalarda mavjud" : language === "en" ? "Available on Selected Dates" : "Доступен в выбранные даты",
      description: language === "uz" ? "Jadval ochiq va bron qilishga tayyor" : language === "en" ? "Calendar open for instant booking" : "Календарь свободен для мгновенного бронирования",
      matched: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-night/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-majolica/20 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-majolica/15 flex items-start justify-between gap-4 bg-paper/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                mode === "trust" ? "bg-majolica/15 text-majolica" : "bg-gold/20 text-gold"
              }`}
            >
              {mode === "trust" ? (
                <ShieldCheck className="w-6 h-6 text-majolica" />
              ) : (
                <Target className="w-6 h-6 text-gold" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-night/60">
                  {mode === "trust" ? "Trust Verification" : "Smart Matching"}
                </span>
                <span
                  className={`text-xs font-mono font-black px-2 py-0.5 rounded-full ${
                    mode === "trust" ? "bg-majolica text-paper" : "bg-gold text-night"
                  }`}
                >
                  {mode === "trust" ? `${trustScore}/100` : `${matchScore}% Match`}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-night mt-0.5">
                {mode === "trust"
                  ? language === "uz"
                    ? "Nega bu gid ishonchli?"
                    : language === "en"
                    ? "Why is this guide verified?"
                    : "Почему этот гид проверен?"
                  : language === "uz"
                  ? "Nega bu gid sizga mos keladi?"
                  : language === "en"
                  ? "Why this guide matches you?"
                  : "Почему этот гид подходит вам?"}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-paper hover:bg-majolica/20 flex items-center justify-center text-night/60 hover:text-night transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guide brief */}
        <div className="px-6 py-3 bg-paper/30 border-b border-majolica/10 flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-night flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-majolica" />
            {displayName}
          </span>
          <span className="text-night/60 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-majolica" />
            {guide.city}
          </span>
        </div>

        {/* Checklist content */}
        <div className="p-6 overflow-y-auto space-y-3.5 divide-y divide-majolica/10">
          {mode === "trust"
            ? trustChecklist.map((item, idx) => (
                <div key={idx} className={`pt-3 first:pt-0 flex items-start gap-3`}>
                  {item.verified ? (
                    <CheckCircle2 className="w-5 h-5 text-majolica shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-night/30 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-night">{item.title}</p>
                    <p className="text-xs text-night/65 font-light">{item.description}</p>
                  </div>
                </div>
              ))
            : matchChecklist.map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-start gap-3">
                  {item.matched ? (
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-night/30 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-night">{item.title}</p>
                    <p className="text-xs text-night/65 font-light">{item.description}</p>
                  </div>
                </div>
              ))}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-majolica/15 bg-paper/40 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-majolica/30 text-xs font-semibold text-night hover:bg-majolica/10 transition-colors"
          >
            {language === "uz" ? "Yopish" : language === "en" ? "Close" : "Закрыть"}
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onBook(guide);
            }}
            className="px-6 py-2.5 rounded-xl bg-majolica hover:bg-majolica/90 text-paper font-bold text-xs transition-all shadow-sm"
          >
            {language === "uz" ? "Gidni band qilish" : language === "en" ? "Book this Guide" : "Забронировать гида"}
          </button>
        </div>
      </div>
    </div>
  );
}
