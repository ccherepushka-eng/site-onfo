import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Unbounded, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

// Дисплейный и текстовый шрифты с поддержкой кириллицы
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800"],
  variable: "--f-display",
});
const body = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--f-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--f-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Информатика — просто о сложном",
    template: "%s · Информатика — просто о сложном",
  },
  description:
    "Образовательная платформа по информатике: 12 живых уроков, интерактивные тренажёры, тесты с объяснениями, глоссарий и мини-экзамен. Изучай технологии, понимай алгоритмы, создавай будущее.",
  keywords: ["информатика", "обучение", "алгоритмы", "python", "двоичный код", "уроки"],
};

// Тема применяется до первой отрисовки — без «вспышки»
const themeInit = `(function(){try{var t=localStorage.getItem('informatika-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
        <a href="#content" className="skip-link">
          К содержанию
        </a>
        <ProgressProvider>
          <Header />
          <main id="content" className="pt-16 min-h-[70vh]">
            {children}
          </main>
          <Footer />
        </ProgressProvider>
        <Analytics />
      </body>
    </html>
  );
}
