"use client";

// ============================================================
// Переключатель тёмной / светлой темы.
// Тема хранится в localStorage и атрибуте data-theme на <html>;
// начальное значение устанавливает inline-скрипт в layout.tsx,
// чтобы не было вспышки неверной темы при загрузке.
// ============================================================

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "informatika-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
      title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      className="btn-ghost btn btn-sm rounded-full! p-0!"
      style={{ width: 40, height: 40 }}
    >
      <span className="relative block" style={{ width: 18, height: 18 }}>
        <Sun
          size={18}
          className="absolute inset-0 transition-all duration-300"
          style={{ opacity: theme === "dark" ? 1 : 0, transform: theme === "dark" ? "rotate(0)" : "rotate(90deg)" }}
        />
        <Moon
          size={18}
          className="absolute inset-0 transition-all duration-300"
          style={{ opacity: theme === "light" ? 1 : 0, transform: theme === "light" ? "rotate(0)" : "rotate(-90deg)" }}
        />
      </span>
    </button>
  );
}
