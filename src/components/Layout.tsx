import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import TilePattern from "./TilePattern";
import { Language, useTranslation } from "@/lib/i18n";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (router.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navItems = [
    { href: "/#ready-routes", sectionId: "ready-routes", label: language === "uz" ? "Tayyor marshrutlar" : language === "en" ? "Ready Routes" : "Готовые маршруты" },
    { href: "/#smart-trips", sectionId: "smart-trips", label: language === "uz" ? "Smart Trips" : language === "en" ? "Smart Trips" : "Smart Trips" },
    { href: "/#trip-constructor", sectionId: "trip-constructor", label: language === "uz" ? "Konstruktor" : language === "en" ? "Constructor" : "Конструктор" },
    { href: "/#travel-directory", sectionId: "travel-directory", label: language === "uz" ? "Katalog" : language === "en" ? "Directory" : "Справочник" },
    { href: "/guides", label: t.nav.guides },
    { href: "/verify", label: t.nav.verify },
    { href: "/faq", label: t.nav.faq },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-plaster text-ink">
      <header className="border-b border-sand bg-plaster/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 flex-wrap">
          <Link href="/" className="flex items-center gap-2.5 group">
            <TilePattern className="w-8 h-8 text-clay group-hover:text-registan transition-colors" />
            <div className="flex flex-col">
              <span className="font-display text-xl font-black text-ink tracking-tight leading-tight">DiyorAI</span>
              <span className="text-[9px] text-night/50 uppercase tracking-widest -mt-0.5 font-bold">Travel Assistant</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <nav className="flex gap-1 overflow-x-auto scrollbar-none py-0.5">
              {navItems.map((item) => {
                const isHash = item.href.startsWith("/#");
                const active = !isHash && router.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => item.sectionId && handleScrollToSection(e, item.sectionId)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      active
                        ? "bg-ink text-plaster shadow-xs"
                        : item.sectionId === "trip-constructor"
                        ? "bg-registan/15 text-registan hover:bg-registan hover:text-white font-bold"
                        : "text-ink hover:bg-sand/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center bg-sand/50 p-0.5 sm:p-1 rounded-xl border border-sand shrink-0">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang.code
                      ? "bg-white text-clay shadow-xs scale-102"
                      : "text-night/60 hover:text-ink"
                  }`}
                  title={`Switch language to ${lang.label}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-sand mt-16 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-night/60">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-ink">DiyorAI TravelTech</span>
            <Link href="/#ready-routes" className="hover:text-registan transition-colors">Готовые маршруты</Link>
            <Link href="/#smart-trips" className="hover:text-registan transition-colors">Smart Trips</Link>
            <Link href="/#trip-constructor" className="hover:text-registan transition-colors">Конструктор</Link>
            <Link href="/guides" className="hover:text-registan transition-colors">Гиды & Trust</Link>
            <Link href="/verify" className="hover:text-registan transition-colors">Фактчек</Link>
            <Link href="/faq" className="hover:text-registan transition-colors">FAQ & Помощь</Link>
          </div>
          <span className="text-night/50">{t.footer.sources}</span>
        </div>
      </footer>
    </div>
  );
}
