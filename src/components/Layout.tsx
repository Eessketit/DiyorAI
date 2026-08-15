import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import TilePattern from "./TilePattern";
import { Language, useTranslation } from "@/lib/i18n";

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { t, language, setLanguage } = useTranslation();

  const navItems = [
    { href: "/", label: t.nav.trip },
    { href: "/verify", label: t.nav.verify },
    { href: "/guides", label: t.nav.guides },
    { href: "/faq", label: "FAQ & Помощь" },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "uz", label: "UZ" },
    { code: "ru", label: "RU" },
    { code: "en", label: "EN" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-plaster text-ink">
      <header className="border-b border-sand bg-plaster/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-3 group">
            <TilePattern className="w-8 h-8 text-clay group-hover:text-registan transition-colors" />
            <div className="flex flex-col">
              <span className="font-display text-xl text-ink tracking-tight leading-tight">DiyorAI</span>
              <span className="text-[10px] text-night/50 uppercase tracking-widest -mt-0.5">TravelTech</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      active ? "bg-ink text-plaster" : "text-ink hover:bg-sand/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Language Switcher */}
            <div className="flex items-center bg-sand/50 p-1 rounded-lg border border-sand">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    language === lang.code
                      ? "bg-white text-clay shadow-xs scale-105"
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

      <footer className="border-t border-sand mt-16 bg-white/40">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-night/60">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-ink">DiyorAI TravelTech</span>
            <Link href="/" className="hover:text-registan transition-colors">Маршруты</Link>
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
