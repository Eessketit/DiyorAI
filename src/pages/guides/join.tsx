import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "@/lib/i18n";
import { Category, Guide, Region, REGION_LABELS } from "@/lib/types";
import {
  Award,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  MapPin,
  Globe,
  Upload,
  Check,
  Star,
  Users,
  Compass,
} from "lucide-react";

const ALL_LANGUAGES = [
  { code: "ru", label: "Русский" },
  { code: "uz", label: "O'zbekcha" },
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "zh", label: "中文 (Chinese)" },
  { code: "ar", label: "العربية (Arabic)" },
  { code: "tr", label: "Türkçe" },
];

const ALL_SPECIALIZATIONS: { id: Category; labelRu: string; labelUz: string; labelEn: string }[] = [
  { id: "history", labelRu: "История и цивилизации", labelUz: "Tarix va tamaddunlar", labelEn: "History & Civilizations" },
  { id: "architecture", labelRu: "Архитектура и медресе", labelUz: "Me'morchilik", labelEn: "Architecture" },
  { id: "gastronomy", labelRu: "Гастрономия и чайханы", labelUz: "Gastronomiya va osh", labelEn: "Gastronomy & Plov" },
  { id: "crafts_bazaars", labelRu: "Ремесла и базары", labelUz: "Hunarmandchilik va bozorlar", labelEn: "Crafts & Bazaars" },
  { id: "pilgrimage", labelRu: "Зиёрат и святыни", labelUz: "Ziyorat turizmi", labelEn: "Pilgrimage & Shrines" },
  { id: "nature_hiking", labelRu: "Горы, хайкинг и Чарвак", labelUz: "Tog'lar va piyoda sayohat", labelEn: "Mountains & Hiking" },
  { id: "family_travel", labelRu: "Семейные экскурсии", labelUz: "Oilaviy ekskursiyalar", labelEn: "Family Tours" },
  { id: "photography", labelRu: "Фототуры и лучшие ракурсы", labelUz: "Fototurlar", labelEn: "Photo Tours" },
];

const REGIONS_LIST: Region[] = [
  "samarkand",
  "bukhara",
  "khiva",
  "tashkent",
  "tashkent_region",
  "fergana",
  "andijan",
  "namangan",
  "shahrisabz",
  "termez",
  "nukus",
  "navoi",
  "jizzakh",
  "syrdarya",
];

export default function GuideJoinPage() {
  const router = useRouter();
  const { t, language } = useTranslation();

  // Wizard Step (0: Calculator/Landing, 1: Profile, 2: Qualification, 3: Documents, 4: Success)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Income Calculator
  const [toursPerWeek, setToursPerWeek] = useState<number>(4);
  const [ratePerTour, setRatePerTour] = useState<number>(65);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    telegram: "",
    region: "samarkand" as Region,
    experienceYears: 4,
    languages: ["ru", "uz", "en"] as string[],
    specializations: ["history", "architecture"] as Category[],
    dayRateUsd: 65,
    bio: "",
    licenseNumber: "",
    licenseYear: "2023",
    certificateUploaded: false,
    agreedToEthics: true,
  });

  // Success State
  const [submittedGuideId, setSubmittedGuideId] = useState<string>("");
  const [calculatedTrustScore, setCalculatedTrustScore] = useState<number>(94);

  const toggleLanguage = (code: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(code);
      if (exists) {
        if (prev.languages.length <= 1) return prev; // Keep at least one
        return { ...prev, languages: prev.languages.filter((l) => l !== code) };
      }
      return { ...prev, languages: [...prev.languages, code] };
    });
  };

  const toggleSpec = (spec: Category) => {
    setFormData((prev) => {
      const exists = prev.specializations.includes(spec);
      if (exists) {
        if (prev.specializations.length <= 1) return prev;
        return { ...prev, specializations: prev.specializations.filter((s) => s !== spec) };
      }
      return { ...prev, specializations: [...prev.specializations, spec] };
    });
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();

    const randomId = `guide-reg-${Date.now().toString().slice(-4)}`;
    const displayAppId = `#DIYOR-GUIDE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedGuideId(displayAppId);

    // Calculate realistic dynamic trust score
    let score = 85;
    if (formData.licenseNumber) score += 5;
    if (formData.certificateUploaded) score += 3;
    if (formData.experienceYears >= 5) score += 3;
    if (formData.languages.length >= 3) score += 2;
    score = Math.min(99, score);
    setCalculatedTrustScore(score);

    // Create full guide object
    const newGuide: Guide = {
      id: randomId,
      name: `${formData.firstName} ${formData.lastName}`.trim() || "Проверенный гид DiyorAI",
      avatar: "👨‍🏫",
      city: REGION_LABELS[formData.region] || "Самарканд",
      region: formData.region,
      rating: 4.9,
      experienceYears: formData.experienceYears,
      trustScore: score,
      matchScore: 95,
      languages: formData.languages,
      specializationTags: formData.specializations,
      priceRange: `$${formData.dayRateUsd}/день`,
      pricePerTourUsd: formData.dayRateUsd,
      completedTours: 12,
      maxGroupSize: 10,
      isDemoData: true,
      verification: {
        identity: true,
        qualification: !!formData.licenseNumber,
        language: true,
        status: "verified",
      },
      badges: ["Новый гид", "Лицензия РУз", "100% Trust"],
      about: {
        ru: formData.bio || `Лицензированный гид по направлению ${REGION_LABELS[formData.region]}. Опыт работы ${formData.experienceYears} лет. Индивидуальный подход и глубокое знание традиций.`,
        uz: `Litsenziyalangan gid. Ish tajribasi ${formData.experienceYears} yil.`,
        en: `Licensed guide in Uzbekistan with ${formData.experienceYears} years of experience.`,
      },
      whyRecommended: {
        ru: [
          `Лицензия гида № ${formData.licenseNumber || "UZ-2026-ACC"}`,
          `Специализация: ${formData.specializations.join(", ")}`,
          `Языки: ${formData.languages.join(", ").toUpperCase()}`,
        ],
        uz: [
          `Gid litsenziyasi № ${formData.licenseNumber || "UZ-2026-ACC"}`,
        ],
        en: [
          `Licensed Guide № ${formData.licenseNumber || "UZ-2026-ACC"}`,
        ],
      },
    };

    // Save to localStorage for demo persistence in /guides catalog
    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("diyorai_custom_guides") || "[]");
        localStorage.setItem("diyorai_custom_guides", JSON.stringify([newGuide, ...existing]));
      } catch (err) {
        console.error("Could not save to localStorage", err);
      }
    }

    setCurrentStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-night/70 hover:text-majolica transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Вернуться в каталог гидов</span>
        </Link>
      </div>

      {/* Header Promo Banner */}
      <div className="bg-night text-paper rounded-3xl p-6 sm:p-10 border border-majolica/30 shadow-2xl relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-majolica/30 text-gold text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-gold/30">
            <Award className="w-3.5 h-3.5" />
            <span>Партнерская программа для гидов</span>
          </span>
          <h1 className="font-display text-2xl sm:text-4xl font-black text-paper tracking-tight leading-tight mb-3">
            Станьте аккредитованным гидом DiyorAI
          </h1>
          <p className="text-sm sm:text-base text-paper/80 font-light leading-relaxed mb-6">
            Получайте прямой поток туристов со всего мира, подтверждайте свой <strong>Trust Score</strong> и управляйте бронированиями с прозрачной комиссией 0% на этапе запуска.
          </p>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 bg-paper/10 backdrop-blur-md rounded-2xl border border-paper/15">
              <span className="text-gold font-bold block mb-0.5">💰 0% Комиссии</span>
              <span className="text-paper/70 text-[11px]">Бесплатное размещение на весь сезон 2026</span>
            </div>
            <div className="p-3 bg-paper/10 backdrop-blur-md rounded-2xl border border-paper/15">
              <span className="text-gold font-bold block mb-0.5">🛡️ Бейдж Trust Score</span>
              <span className="text-paper/70 text-[11px]">Официальная верификация лицензии</span>
            </div>
            <div className="p-3 bg-paper/10 backdrop-blur-md rounded-2xl border border-paper/15">
              <span className="text-gold font-bold block mb-0.5">🎯 Умный Match</span>
              <span className="text-paper/70 text-[11px]">Подбор туристов под ваши темы и языки</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP WIZARD FORM */}
      {currentStep < 4 && (
        <div className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Wizard Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-2">
              <span className={currentStep >= 1 ? "text-majolica font-black" : "text-night/40"}>
                1. Контакты
              </span>
              <span className={currentStep >= 2 ? "text-majolica font-black" : "text-night/40"}>
                2. Квалификация и языки
              </span>
              <span className={currentStep >= 3 ? "text-majolica font-black" : "text-night/40"}>
                3. Документы и лицензия
              </span>
            </div>
            <div className="w-full bg-paper h-2 rounded-full overflow-hidden border border-majolica/20">
              <div
                className="h-full bg-majolica transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmitApplication}>
            {/* STEP 1: CONTACTS & CITY */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-majolica/15 pb-4">
                  <h2 className="font-display text-lg font-bold text-night">
                    Шаг 1: Личные данные и регион работы
                  </h2>
                  <p className="text-xs text-night/60 font-mono mt-0.5">
                    Укажите ваши актуальные контактные данные для связи с туристами и координатором.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Имя *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Например: Сардор"
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm text-night outline-none focus:border-majolica"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Фамилия *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Например: Рахимов"
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm text-night outline-none focus:border-majolica"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Номер телефона *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+998 90 123-45-67"
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm text-night outline-none focus:border-majolica font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Telegram Username
                    </label>
                    <input
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      placeholder="@username"
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm text-night outline-none focus:border-majolica font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                    Основной город / Регион проведения экскурсий *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value as Region })}
                    className="w-full p-3 rounded-xl border border-majolica/25 bg-white text-xs sm:text-sm font-mono font-bold text-night outline-none focus:border-majolica"
                  >
                    {REGIONS_LIST.map((r) => (
                      <option key={r} value={r}>
                        {REGION_LABELS[r]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.firstName || !formData.lastName || !formData.phone) {
                        alert("Пожалуйста, заполните обязательные поля (Имя, Фамилия, Телефон)");
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-majolica text-paper font-mono font-bold text-xs hover:bg-majolica/90 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Далее: Квалификация</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: QUALIFICATIONS & LANGUAGES */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-majolica/15 pb-4">
                  <h2 className="font-display text-lg font-bold text-night">
                    Шаг 2: Опыт, языки и специализации
                  </h2>
                  <p className="text-xs text-night/60 font-mono mt-0.5">
                    Эти данные помогут алгоритму подбирать подходящих туристов в разделе «Подходящие гиды».
                  </p>
                </div>

                {/* Experience & Rate */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Опыт работы гидом (в годах) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={formData.experienceYears}
                      onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm font-mono font-bold text-night outline-none focus:border-majolica"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Дневная ставка ($ USD / день) *
                    </label>
                    <input
                      type="number"
                      min={20}
                      max={500}
                      value={formData.dayRateUsd}
                      onChange={(e) => setFormData({ ...formData, dayRateUsd: Number(e.target.value) })}
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm font-mono font-bold text-night outline-none focus:border-majolica"
                    />
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-xs font-mono font-bold text-night uppercase mb-2">
                    Языки ведения экскурсий (выберите все подходящие) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_LANGUAGES.map((l) => {
                      const selected = formData.languages.includes(l.code);
                      return (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => toggleLanguage(l.code)}
                          className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center justify-between ${
                            selected
                              ? "bg-majolica text-paper border-majolica shadow-xs"
                              : "bg-paper/60 text-night/70 border-majolica/20 hover:bg-majolica/10"
                          }`}
                        >
                          <span>{l.label}</span>
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-xs font-mono font-bold text-night uppercase mb-2">
                    Основные темы и специализации *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ALL_SPECIALIZATIONS.map((s) => {
                      const selected = formData.specializations.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSpec(s.id)}
                          className={`p-3 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                            selected
                              ? "bg-majolica/15 text-night border-majolica font-bold ring-1 ring-majolica/40"
                              : "bg-paper/40 text-night/70 border-majolica/20 hover:bg-majolica/5"
                          }`}
                        >
                          <span>{s.labelRu}</span>
                          {selected && <Check className="w-4 h-4 text-majolica" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Short Bio */}
                <div>
                  <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                    Кратко о себе и стиле проведения туров
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Расскажите о вашем подходе, любимых локациях и чем ваши экскурсии запоминаются туристам..."
                    className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm text-night outline-none focus:border-majolica font-sans"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-paper text-night font-mono font-bold text-xs hover:bg-majolica/10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Назад</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-majolica text-paper font-mono font-bold text-xs hover:bg-majolica/90 transition-all shadow-xs cursor-pointer"
                  >
                    <span>Далее: Документы</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: DOCUMENTS & VERIFICATION */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-majolica/15 pb-4">
                  <h2 className="font-display text-lg font-bold text-night">
                    Шаг 3: Верификация и лицензия
                  </h2>
                  <p className="text-xs text-night/60 font-mono mt-0.5">
                    DiyorAI гарантирует туристам высокий Trust Score на основе проверенных документов Комитета по туризму Республики Узбекистан.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Номер лицензии / сертификата гида *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      placeholder="Например: UZ-GUIDE-2024-884"
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm font-mono font-bold text-night outline-none focus:border-majolica"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                      Год выдачи лицензии
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={2026}
                      value={formData.licenseYear}
                      onChange={(e) => setFormData({ ...formData, licenseYear: e.target.value })}
                      className="w-full p-3 rounded-xl border border-majolica/25 bg-paper/30 text-xs sm:text-sm font-mono font-bold text-night outline-none focus:border-majolica"
                    />
                  </div>
                </div>

                {/* Upload Certificate / Badge Simulation */}
                <div>
                  <label className="block text-xs font-mono font-bold text-night uppercase mb-1.5">
                    Скан или фото бейджа / сертификата
                  </label>
                  <div
                    onClick={() => setFormData({ ...formData, certificateUploaded: !formData.certificateUploaded })}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      formData.certificateUploaded
                        ? "border-majolica bg-majolica/10"
                        : "border-majolica/30 hover:bg-majolica/5"
                    }`}
                  >
                    <Upload className="w-8 h-8 text-majolica mx-auto mb-2" />
                    {formData.certificateUploaded ? (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-majolica flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Документ прикреплен: certificate_uz_tour.jpg
                        </span>
                        <span className="text-[10px] text-night/50 font-mono block">
                          Нажмите для изменения
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-night block">
                          Нажмите или перетащите фото сертификата гида
                        </span>
                        <span className="text-[10px] text-night/50 font-mono block">
                          JPG, PNG, PDF до 10MB (Демо-режим: прикрепляется в 1 клик)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ethics agreement */}
                <div className="p-4 bg-paper/60 rounded-2xl border border-majolica/20 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ethics"
                    checked={formData.agreedToEthics}
                    onChange={(e) => setFormData({ ...formData, agreedToEthics: e.target.checked })}
                    className="mt-1 w-4 h-4 text-majolica rounded border-majolica/30"
                  />
                  <label htmlFor="ethics" className="text-xs text-night/80 leading-relaxed cursor-pointer">
                    Я подтверждаю достоверность предоставленных сведений и обязуюсь соблюдать профессиональный кодекс гида DiyorAI (пунктуальность, уважение к культуре, анти-мифы и фактическая точность).
                  </label>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-paper text-night font-mono font-bold text-xs hover:bg-majolica/10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Назад</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-majolica hover:bg-majolica/90 text-paper font-mono font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Отправить заявку на верификацию</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* STEP 4: SUCCESS SCREEN */}
      {currentStep === 4 && (
        <div className="bg-white border border-majolica/20 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6 animate-scale-up">
          <div className="w-16 h-16 rounded-full bg-majolica/15 border border-majolica/30 flex items-center justify-center text-majolica mx-auto">
            <CheckCircle2 className="w-8 h-8 text-majolica" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-paper border border-majolica/20 text-night font-mono font-bold text-xs mb-3">
              Заявка: {submittedGuideId}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-night">
              Поздравляем! Ваша анкета принята
            </h2>
            <p className="text-xs sm:text-sm text-night/70 font-light max-w-md mx-auto mt-2">
              Ваш профиль гида успешно создан и добавлен в систему. Предварительная верификация пройдена!
            </p>
          </div>

          {/* Generated Trust Card */}
          <div className="max-w-md mx-auto p-5 bg-paper/60 border border-majolica/25 rounded-2xl text-left space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-night">
                  {formData.firstName} {formData.lastName}
                </h3>
                <p className="text-[11px] text-night/60 font-mono">
                  {REGION_LABELS[formData.region]} · Стаж {formData.experienceYears} лет
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-night/50 block">Trust Score</span>
                <span className="font-mono font-black text-lg text-majolica">
                  {calculatedTrustScore} / 100 🛡️
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-majolica/15 flex items-center justify-between text-xs font-mono text-night/80">
              <span>Ставка: <strong>${formData.dayRateUsd}/день</strong></span>
              <span>Языки: {formData.languages.map((l) => l.toUpperCase()).join(", ")}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/guides"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-majolica text-paper font-mono font-bold text-xs sm:text-sm hover:bg-majolica/90 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Посмотреть меня в каталоге гидов →</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-paper text-night font-mono font-bold text-xs sm:text-sm hover:bg-majolica/10 transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
