"use client";

// ============================================================
// Шапка сайта: логотип, навигация, поиск (Ctrl+K), тема,
// мобильное меню. Прогресс-бар прокрутки страницы сверху.
// ============================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Binary, Menu, Search, User, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";

const NAV = [
  { href: "/", label: "Главная" },
  { href: "/uroki", label: "Уроки" },
  { href: "/trenazher", label: "Тренажёры" },
  { href: "/glosariy", label: "Глоссарий" },
  { href: "/ekzamen", label: "Экзамен" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scroll, setScroll] = useState(0);

  // Ctrl/Cmd + K открывает поиск
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Закрываем меню при переходе
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Прогресс прокрутки
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setScroll(max > 0 ? h.scrollTop / max : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/uroki" && pathname.startsWith("/urok/"));

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          background: "color-mix(in srgb, var(--bg) 78%, transparent)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* Полоска прогресса чтения */}
        <div
          aria-hidden
          className="absolute top-0 left-0 h-[2px]"
          style={{
            width: `${scroll * 100}%`,
            background: "linear-gradient(90deg, var(--acc-3), var(--acc), var(--acc-2))",
            transition: "width .1s linear",
          }}
        />
        <div className="wrap flex items-center justify-between gap-3 h-16">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="На главную">
            <span
              className="grid place-items-center transition-transform duration-300 group-hover:rotate-12"
              style={{
                width: 38, height: 38, borderRadius: 12,
                background: "linear-gradient(135deg, var(--acc), var(--acc-2))",
                boxShadow: "0 6px 20px -6px var(--glow)",
              }}
            >
              <Binary size={20} color="#fff" />
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold tracking-wide" style={{ fontFamily: "var(--font-display)", fontSize: ".98rem" }}>
                ИНФОРМАТИКА
              </span>
              <span className="block text-[0.68rem] font-semibold tracking-[0.18em] uppercase muted">
                просто о сложном
              </span>
            </span>
          </Link>

          {/* Десктоп-навигация */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Основная навигация">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3.5 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{
                  color: isActive(n.href) ? "var(--ink)" : "var(--ink-2)",
                  background: isActive(n.href) ? "var(--surface-2)" : "transparent",
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost btn-sm hidden sm:inline-flex"
              aria-label="Поиск по сайту"
            >
              <Search size={16} />
              <span className="hidden md:inline">Поиск</span>
              <span className="kbd hidden md:inline">Ctrl K</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="btn btn-ghost btn-sm p-0! sm:hidden"
              style={{ width: 40, height: 40 }}
              aria-label="Поиск по сайту"
            >
              <Search size={17} />
            </button>
            <ThemeToggle />
            <Link href="/kabinet" className="btn btn-prime btn-sm" aria-label="Личный кабинет">
              <User size={16} />
              <span className="hidden sm:inline">Кабинет</span>
            </Link>
            <button
              className="btn btn-ghost btn-sm p-0! lg:hidden"
              style={{ width: 40, height: 40 }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {menuOpen && (
          <nav
            className="lg:hidden px-5 pb-5 pt-1"
            style={{ borderTop: "1px solid var(--line)", animation: "fadeUp .25s ease" }}
            aria-label="Мобильная навигация"
          >
            {[...NAV, { href: "/kabinet", label: "Личный кабинет" }].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block py-2.5 px-3 rounded-xl font-semibold text-base"
                style={{ color: isActive(n.href) ? "var(--ink)" : "var(--ink-2)" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
