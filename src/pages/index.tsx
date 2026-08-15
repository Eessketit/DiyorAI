import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import PresetCards from "@/components/PresetCards";
import {
  SlidersHorizontal,
  Compass,
  MapPin,
  Zap,
  ShieldCheck,
  Coins,
  Sparkles,
  UserCheck,
  Calendar,
  CloudSun,
  CheckCircle2,
  ArrowRight,
  Target,
  Award,
} from "lucide-react";

export default function Home() {
  const { t, language } = useTranslation();

  return (
    <div>
      {/* 1. HERO & VALUE PROPOSITION */}
      <section className="relative overflow-hidden bg-night text-paper border-b border-majolica/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-majolica/15 border border-majolica/30 text-majolica text-xs font-mono font-semibold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-majolica animate-ping" />
                <span>DiyorAI · TravelTech Uzbekistan</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.06] text-paper tracking-tight">
                {t.home.title}
              </h1>

              <p className="text-paper/80 max-w-xl text-base sm:text-lg leading-relaxed font-light">
                {t.home.subtitle}
              </p>

              {/* Main CTAs */}
              <div className="flex items-center gap-3 pt-2 flex-wrap">
                <Link
                  href="/constructor"
                  className="px-7 py-4 rounded-2xl bg-brick hover:bg-brick/90 text-paper font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-brick/30 hover:scale-102 flex items-center gap-2.5"
                >
                  <SlidersHorizontal className="w-5 h-5 text-paper shrink-0" />
                  <span>{language === "uz" ? "Konstruktorni ochish" : language === "en" ? "Open Constructor" : "Открыть конструктор"}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="#ready-tours"
                  className="px-6 py-4 rounded-2xl bg-paper/10 hover:bg-paper/15 border border-paper/20 text-paper font-semibold text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-majolica shrink-0" />
                  <span>{language === "uz" ? "Tayyor turlar" : language === "en" ? "Ready Tours" : "Готовые туры"}</span>
                </a>
              </div>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 text-xs font-mono border-t border-paper/15">
                <div className="flex items-center gap-1.5 text-paper/80">
                  <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Personalized</span>
                </div>
                <div className="flex items-center gap-1.5 text-paper/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-majolica shrink-0" />
                  <span>Verified</span>
                </div>
                <div className="flex items-center gap-1.5 text-paper/80">
                  <Coins className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>Budget-Aware</span>
                </div>
                <div className="flex items-center gap-1.5 text-paper/80">
                  <UserCheck className="w-3.5 h-3.5 text-majolica shrink-0" />
                  <span>Human-Assisted</span>
                </div>
              </div>
            </div>

            {/* Right Signature Silk Road Route Vector */}
            <div className="lg:col-span-5 relative">
              <div className="bg-night/90 border border-majolica/30 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-majolica/20 text-xs font-mono text-gold font-semibold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-majolica" />
                    <span>Шёлковый Путь · The Silk Road</span>
                  </span>
                  <span className="text-majolica">UZB-2026</span>
                </div>

                <svg viewBox="0 0 400 220" className="w-full h-auto mt-2 overflow-visible">
                  <defs>
                    <linearGradient id="silkGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C99A45" />
                      <stop offset="50%" stopColor="#2FA89B" />
                      <stop offset="100%" stopColor="#C99A45" />
                    </linearGradient>
                  </defs>

                  {/* Smooth curved bezier Silk Road path */}
                  <path
                    d="M 55 175 C 110 160, 130 145, 155 135 C 190 120, 215 105, 245 95 C 290 80, 310 55, 340 45"
                    fill="none"
                    stroke="url(#silkGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    className="opacity-85"
                  />

                  {/* 1. Khiva */}
                  <g transform="translate(55, 175)">
                    <circle r="10" className="fill-gold/25 silk-node-pulse" />
                    <circle r="4.5" fill="#C99A45" />
                    <text x="0" y="20" className="fill-paper font-mono text-[10px] font-bold" textAnchor="middle">Хива</text>
                    <text x="0" y="30" className="fill-gold text-[8px] font-mono hidden sm:block" textAnchor="middle">Ичан-Кала</text>
                  </g>

                  {/* 2. Bukhara */}
                  <g transform="translate(155, 135)">
                    <circle r="10" className="fill-majolica/30 silk-node-pulse" />
                    <circle r="5" fill="#2FA89B" />
                    <text x="0" y="20" className="fill-paper font-mono text-[10px] font-bold" textAnchor="middle">Бухара</text>
                    <text x="0" y="30" className="fill-majolica text-[8px] font-mono hidden sm:block" textAnchor="middle">Пои-Калян</text>
                  </g>

                  {/* 3. Samarkand */}
                  <g transform="translate(245, 95)">
                    <circle r="13" className="fill-gold/35 silk-node-pulse" />
                    <circle r="6" fill="#C99A45" />
                    <text x="0" y="-12" className="fill-paper font-display text-[11px] font-bold" textAnchor="middle">Самарканд</text>
                    <text x="0" y="20" className="fill-gold text-[8px] font-mono hidden sm:block" textAnchor="middle">Регистан 360°</text>
                  </g>

                  {/* 4. Tashkent */}
                  <g transform="translate(340, 45)">
                    <circle r="10" className="fill-majolica/30 silk-node-pulse" />
                    <circle r="5" fill="#2FA89B" />
                    <text x="0" y="-10" className="fill-paper font-mono text-[10px] font-bold" textAnchor="middle">Ташкент</text>
                    <text x="0" y="18" className="fill-majolica text-[8px] font-mono hidden sm:block" textAnchor="middle">Хаб & Чорсу</text>
                  </g>
                </svg>

                <div className="mt-3 pt-3 border-t border-majolica/20 flex items-center justify-between text-[11px] font-mono text-paper/70">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-gold" />
                    <span>Afrosiyob Express Rail</span>
                  </span>
                  <span className="text-gold font-bold">250 km/h · 4 Hubs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-20">
        {/* 2. READY TOURS (ГОТОВЫЕ ТУРЫ) */}
        <PresetCards />

        {/* 3. KEY PRODUCT ADVANTAGES */}
        <section className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase font-mono font-bold tracking-[0.2em] text-majolica block mb-1.5">
              {language === "uz" ? "Nega aynan DiyorAI?" : language === "en" ? "Why DiyorAI?" : "Почему DiyorAI?"}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-night">
              {language === "uz"
                ? "Shunchaki sayt emas — to'liq sayohat hamkori"
                : language === "en"
                ? "More Than Booking — Your Intelligent Travel Co-Pilot"
                : "Не просто бронирование — персональный travel-помощник"}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Customization */}
            <div className="p-5 rounded-2xl bg-paper/60 border border-majolica/15 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-majolica/15 text-majolica flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-night">
                {language === "uz" ? "To'liq moslashuvchanlik" : language === "en" ? "True Customization" : "Гибкая кастомизация"}
              </h3>
              <p className="text-xs text-night/70 leading-relaxed font-light">
                {language === "uz"
                  ? "Kattalar, bolalar, aniq sanalar, faol va dam olish kunlari — har bir parametr marshrutga ta'sir qiladi."
                  : language === "en"
                  ? "Adults, kids, specific calendar dates, active vs rest pace — each input reshapes the plan."
                  : "Взрослые, дети, точные даты, активные дни и дни отдыха — каждый параметр влияет на расчёт."}
              </p>
            </div>

            {/* 2. Budget Control */}
            <div className="p-5 rounded-2xl bg-paper/60 border border-majolica/15 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-night">
                {language === "uz" ? "Qat'iy byudjet nazorati" : language === "en" ? "Strict Budget Control" : "Строгий контроль бюджета"}
              </h3>
              <p className="text-xs text-night/70 leading-relaxed font-light">
                {language === "uz"
                  ? "Mehmonxona, transport, transfer va gid narxi oldindan ko'rinadi. Yashirin xarajatlarsiz."
                  : language === "en"
                  ? "Hotels, high-speed rail, transfer fleet and guide fees calculated upfront. Zero hidden markups."
                  : "Отели, транспорт, трансфер и гид рассчитываются прозрачно до копейки без скрытых наценок."}
              </p>
            </div>

            {/* 3. Trust Score */}
            <div className="p-5 rounded-2xl bg-paper/60 border border-majolica/15 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-majolica/15 text-majolica flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-night">
                {language === "uz" ? "Trust Score & Litsenziya" : language === "en" ? "Verified Trust Score" : "Trust Score и верификация"}
              </h3>
              <p className="text-xs text-night/70 leading-relaxed font-light">
                {language === "uz"
                  ? "Har bir gidning shaxsiyati, akkreditatsiyasi va haqiqiy sayyohlar sharhlari tekshirilgan."
                  : language === "en"
                  ? "Every guide's ID, tourism committee license, language proficiency and reviews verified."
                  : "Паспорт, лицензия Комитета по туризму, опыт и реальные отзывы проверены вручную."}
              </p>
            </div>

            {/* 4. Weather Intelligence */}
            <div className="p-5 rounded-2xl bg-paper/60 border border-majolica/15 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
                <CloudSun className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-base text-night">
                {language === "uz" ? "Ob-havo muqobillari" : language === "en" ? "Weather Adaptive" : "Погодные альтернативы"}
              </h3>
              <p className="text-xs text-night/70 leading-relaxed font-light">
                {language === "uz"
                  ? "Yomg'ir yoki jazirama issiqda DiyorAI yopiq muzey va gastro-lokatsiyalarni taklif qiladi."
                  : language === "en"
                  ? "If rain or extreme heat strikes, DiyorAI instantly proposes climate-controlled cultural stops."
                  : "При дожде или жаре DiyorAI автоматически предложит замену на комфортные крытые музеи."}
              </p>
            </div>
          </div>
        </section>

        {/* 4. FINAL CTA TO CONSTRUCTOR */}
        <section className="bg-night text-paper rounded-3xl p-8 sm:p-12 border border-majolica/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs uppercase font-mono tracking-[0.2em] text-gold font-bold">
                {language === "uz" ? "Shaxsiy sayohatni boshlang" : language === "en" ? "Start Your Custom Trip" : "Создайте своё путешествие"}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-paper">
              {language === "uz"
                ? "O'zingizga mos sayohatni 2 daqiqada tuzing"
                : language === "en"
                ? "Build your tailored Uzbekistan journey in 2 minutes"
                : "Соберите идеальное путешествие за 2 минуты"}
            </h2>
            <p className="text-xs sm:text-sm text-paper/75 font-light leading-relaxed">
              {language === "uz"
                ? "Guruh tarkibini kiriting, sanalarni tanlang va o'zingizga mos byudjetda unutilmas taassurotlarga ega bo'ling."
                : language === "en"
                ? "Select your group size, travel dates, transport and budget to get a complete verified plan."
                : "Укажите количество людей, выберите даты и получите продуманный маршрут с проверенными гидами."}
            </p>
          </div>

          <Link
            href="/constructor"
            className="px-8 py-4.5 rounded-2xl bg-brick hover:bg-brick/90 text-paper font-bold text-sm sm:text-base transition-all shadow-xl hover:shadow-brick/30 hover:scale-102 flex items-center gap-3 shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5 text-paper" />
            <span>{language === "uz" ? "Konstruktorni ochish" : language === "en" ? "Open Constructor" : "Открыть конструктор"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
