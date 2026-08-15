import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import TilePattern from "./TilePattern";
import { Language, useTranslation } from "@/lib/i18n";
import { SlidersHorizontal, UserCheck, ShieldCheck, HelpCircle } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();

  const navItems = [
    {
      href: "/",
      label: language === "uz" ? "Bosh sahifa" : language === "en" ? "Home" : "Главная",
    },
    {
      href: "/constructor",
      label: language === "uz" ? "Konstruktor" : language === "en" ? "Constructor" : "Конструктор",
      isHighlight: true,
    },
    {
      href: "/guides",
      label: language === "uz" ? "Gidlar" : language === "en" ? "Guides" : "Гиды",
    },
    {
      href: "/verify",
      label: language === "uz" ? "Faktchek" : language === "en" ? "Fact Check" : "Фактчек",
    },
    {
      href: "/faq",
      label: language === "uz" ? "FAQ" : language === "en" ? "FAQ" : "FAQ",
    },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-night">
      {/* Horizontal Header */}
      <header className="border-b border-majolica/20 bg-paper/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo on the left */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <TilePattern className="w-8 h-8 text-majolica group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-display text-xl font-black text-night tracking-tight leading-tight">DiyorAI</span>
              <span className="text-[9px] text-night/50 uppercase tracking-widest -mt-0.5 font-bold font-mono">Travel Assistant</span>
            </div>
          </Link>

          {/* Navigation and Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {navItems.map((item) => {
                const active = router.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                      active
                        ? "bg-night text-paper shadow-xs"
                        : item.isHighlight
                        ? "bg-majolica/15 text-night hover:bg-majolica hover:text-paper font-bold"
                        : "text-night/80 hover:text-night hover:bg-majolica/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center bg-white p-0.5 rounded-xl border border-majolica/20 shrink-0">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    language === lang.code
                      ? "bg-majolica text-paper shadow-xs scale-102"
                      : "text-night/60 hover:text-night"
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

      {/* Footer */}
      <footer className="border-t border-majolica/20 mt-16 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-night/60">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-night">DiyorAI · TravelTech Uzbekistan</span>
            <Link href="/" className="hover:text-majolica transition-colors">
              {language === "uz" ? "Bosh sahifa" : language === "en" ? "Home" : "Главная"}
            </Link>
            <Link href="/constructor" className="hover:text-majolica transition-colors font-bold text-majolica">
              {language === "uz" ? "Konstruktor" : language === "en" ? "Constructor" : "Конструктор"}
            </Link>
            <Link href="/guides" className="hover:text-majolica transition-colors">
              {language === "uz" ? "Gidlar" : language === "en" ? "Guides" : "Гиды"}
            </Link>
            <Link href="/verify" className="hover:text-majolica transition-colors">
              {language === "uz" ? "Faktchek" : language === "en" ? "Fact Check" : "Фактчек"}
            </Link>
            <Link href="/faq" className="hover:text-majolica transition-colors">
              {language === "uz" ? "FAQ & Yordam" : language === "en" ? "FAQ & Help" : "FAQ & Помощь"}
            </Link>
          </div>
          <span className="text-night/50 font-mono">{t.footer.sources}</span>
        </div>
      </footer>
    </div>
  );
}
