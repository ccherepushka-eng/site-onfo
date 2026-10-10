// ============================================================
// Главная страница: эффектный первый экран, прогресс ученика,
// карточки 12 разделов, интерактив, факты и призыв к экзамену.
// ============================================================

import Link from "next/link";
import { ArrowRight, CircuitBoard, FlaskConical, Sparkles, Target, Trophy } from "lucide-react";
import { lessons, TOTAL_QUESTIONS } from "@/lib/data";
import { glossary } from "@/lib/data/extras";
import { HeroCanvas } from "@/components/HeroCanvas";
import { Reveal } from "@/components/Reveal";
import { LessonCard } from "@/components/LessonCard";
import { HomeStats } from "@/components/HomeStats";
import { FactsSection } from "@/components/FactsSection";

const MARQUEE_TERMS = [
  "алгоритмы", "двоичный код", "python", "нейросети", "sql", "биты и байты",
  "логика", "кибербезопасность", "базы данных", "интернет", "программирование", "данные",
];

export default function HomePage() {
  return (
    <>
      {/* ======================= ПЕРВЫЙ ЭКРАН ======================= */}
      <section className="relative overflow-hidden" style={{ minHeight: "92vh" }}>
        {/* Декоративные слои */}
        <div className="absolute inset-0 bg-grid" aria-hidden />
        <div className="orb" style={{ width: 480, height: 480, top: "-10%", left: "-8%", background: "rgba(79,103,255,.45)" }} aria-hidden />
        <div className="orb" style={{ width: 420, height: 420, top: "8%", right: "-10%", background: "rgba(160,107,255,.4)", animationDelay: "-6s" }} aria-hidden />
        <div className="orb" style={{ width: 300, height: 300, bottom: "-14%", left: "32%", background: "rgba(56,189,248,.32)", animationDelay: "-11s" }} aria-hidden />
        <HeroCanvas />

        <div className="wrap relative z-10 flex flex-col items-center justify-center text-center py-24 md:py-32" style={{ minHeight: "92vh" }}>
          <Reveal>
            <span className="chip chip-acc py-2! px-4! text-xs!">
              <CircuitBoard size={14} /> Образовательная платформа по информатике
            </span>
          </Reveal>

          <Reveal delay={110}>
            <h1 className="h1 mt-6 max-w-4xl">
              Информатика —{" "}
              <span className="grad-text">просто о&nbsp;сложном</span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="lead mt-6 max-w-2xl mx-auto">
              Изучай технологии, понимай алгоритмы, создавай будущее.
              Двенадцать живых уроков: от «что такое бит» до нейросетей — с тренажёрами,
              тестами и мини-экзаменом.
            </p>
          </Reveal>

          <Reveal delay={330}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
              <Link href="/uroki" className="btn btn-prime px-8! py-4! text-base!">
                <Sparkles size={18} /> Начать обучение
              </Link>
              <Link href="/ekzamen" className="btn btn-ghost px-8! py-4! text-base!">
                <Target size={18} /> Проверить знания
              </Link>
            </div>
          </Reveal>

          <Reveal delay={440}>
            <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
              {[
                [`${lessons.length}`, "тем курса"],
                [`${TOTAL_QUESTIONS}+`, "вопросов с объяснениями"],
                [`${glossary.length}`, "терминов в словаре"],
                ["4", "интерактивных тренажёра"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="font-extrabold grad-text" style={{ fontFamily: "var(--font-display)", fontSize: "1.65rem" }}>
                    {n}
                  </div>
                  <div className="text-xs muted mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Бегущая строка терминов */}
        <div className="absolute bottom-0 inset-x-0 py-4 overflow-hidden" style={{ borderTop: "1px solid var(--line)", background: "color-mix(in srgb, var(--bg) 55%, transparent)", backdropFilter: "blur(8px)" }} aria-hidden>
          <div className="marquee">
            {[...MARQUEE_TERMS, ...MARQUEE_TERMS].map((t, i) => (
              <span key={i} className="mono text-xs uppercase tracking-[0.22em] muted flex items-center gap-2.5">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--acc-3)", display: "inline-block" }} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= ТВОЙ ПРОГРЕСС ======================= */}
      <section className="wrap mt-16 md:mt-24">
        <Reveal>
          <span className="eyebrow">Обучение</span>
          <h2 className="h2 mt-2 mb-7">Твой путь по курсу</h2>
        </Reveal>
        <Reveal delay={120}>
          <HomeStats />
        </Reveal>
      </section>

      {/* ======================= РАЗДЕЛЫ КУРСА ======================= */}
      <section className="wrap mt-20 md:mt-28">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap mb-7">
            <div>
              <span className="eyebrow">Программа</span>
              <h2 className="h2 mt-2">12 разделов — от основ до ИИ</h2>
            </div>
            <Link href="/uroki" className="btn btn-ghost btn-sm">
              Все уроки <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lessons.map((l, i) => (
            <Reveal key={l.slug} delay={Math.min(i, 7) * 70}>
              <LessonCard lesson={l} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================= ИНТЕРАКТИВ ======================= */}
      <section className="wrap mt-20 md:mt-28">
        <Reveal>
          <span className="eyebrow">Практика</span>
          <h2 className="h2 mt-2 mb-7">Учиться — значит делать</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              href: "/trenazher",
              title: "Двоичный и логический тренажёры",
              text: "Переводи числа между системами и вычисляй логические выражения — серии, очки и достижения.",
              chips: ["Перевод чисел", "И / ИЛИ / НЕ", "Серии ответов"],
            },
            {
              href: "/trenazher#random",
              title: "Случайный вопрос",
              text: "Быстрая самопроверка по всем темам курса. Ответь на 10 вопросов — получишь достижение.",
              chips: ["60 вопросов", "Объяснения", "Самопроверка"],
            },
            {
              href: "/urok/python-osnovy",
              title: "Python с подсветкой кода",
              text: "Реальные программы в уроках: переменные, циклы, функции и мини-игра «Угадай число».",
              chips: ["Примеры кода", "Вывод программ", "Ошибки новичков"],
            },
          ].map((c, i) => (
            <Reveal key={c.href + i} delay={i * 90}>
              <Link href={c.href} className="card card-hover p-6 flex flex-col gap-3 h-full group">
                <FlaskConical size={22} style={{ color: "var(--acc-3)" }} />
                <h3 className="font-bold text-lg leading-snug group-hover:text-[var(--acc-3)] transition-colors">{c.title}</h3>
                <p className="text-sm soft leading-relaxed flex-1">{c.text}</p>
                <div className="flex gap-2 flex-wrap">
                  {c.chips.map((ch) => (
                    <span key={ch} className="chip text-[0.7rem]!">{ch}</span>
                  ))}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ======================= ФАКТЫ ======================= */}
      <section className="wrap mt-20 md:mt-28">
        <Reveal>
          <span className="eyebrow">А ты знал?</span>
          <h2 className="h2 mt-2 mb-7">Интересные факты о технологиях</h2>
        </Reveal>
        <Reveal delay={100}>
          <FactsSection />
        </Reveal>
      </section>

      {/* ======================= ПРИЗЫВ К ЭКЗАМЕНУ ======================= */}
      <section className="wrap mt-20 md:mt-28">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-[28px] p-8 md:p-14 text-center"
            style={{
              background: "linear-gradient(130deg, rgba(91,140,255,.2), rgba(160,107,255,.18))",
              border: "1px solid var(--line-2)",
            }}
          >
            <div className="orb" style={{ width: 320, height: 320, top: "-40%", right: "-5%", background: "rgba(160,107,255,.5)" }} aria-hidden />
            <Trophy size={40} className="mx-auto mb-4 animate-float" style={{ color: "var(--warn)" }} />
            <h2 className="h2 max-w-2xl mx-auto">Готов проверить себя по всему курсу?</h2>
            <p className="lead mt-4 max-w-xl mx-auto text-base!">
              Мини-экзамен: 15 случайных вопросов из всех тем, обратная связь к каждому
              и отдельное достижение за результат от 80%.
            </p>
            <Link href="/ekzamen" className="btn btn-prime px-9! py-4! text-base! mt-8">
              <Target size={18} /> Начать мини-экзамен
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
