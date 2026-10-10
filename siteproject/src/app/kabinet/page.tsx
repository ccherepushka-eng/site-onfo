"use client";

// ============================================================
// Личный кабинет ученика: общий прогресс, баллы, результаты
// по каждому уроку, достижения, рекомендации и сброс данных.
// Всё считается из localStorage-хранилища прогресса.
// ============================================================

import Link from "next/link";
import { useState } from "react";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Circle,
  Compass,
  GraduationCap,
  ListChecks,
  Sparkles,
  Trash2,
} from "lucide-react";
import { lessons, TOTAL_LESSONS } from "@/lib/data";
import { achievements } from "@/lib/data/extras";
import { useProgress } from "@/components/ProgressProvider";
import { ProgressRing } from "@/components/ProgressRing";
import { AchievementIcon, LessonIcon } from "@/components/Icon";

export default function CabinetPage() {
  const { state, ready, points, mastery, reset, quizPercent } = useProgress();
  const [confirming, setConfirming] = useState(false);

  const lessonsDone = ready ? state.completed.length : 0;
  const quizzesTaken = ready ? Object.keys(state.quiz).length : 0;
  const best = ready && state.examBest ? state.examBest : null;
  const recs = ready ? lessons.filter((l) => !state.completed.includes(l.slug)).slice(0, 3) : lessons.slice(0, 3);

  const stats = [
    { icon: Sparkles, label: "Баллы", value: ready ? points : 0, tint: "var(--acc-3)" },
    { icon: BookOpenCheck, label: "Уроков пройдено", value: `${lessonsDone} / ${TOTAL_LESSONS}`, tint: "var(--ok)" },
    { icon: ListChecks, label: "Тестов сдано", value: quizzesTaken, tint: "var(--acc-2)" },
    {
      icon: GraduationCap,
      label: "Лучший экзамен",
      value: best ? `${Math.round((best.correct / best.total) * 100)}%` : "—",
      tint: "var(--warn)",
    },
  ];

  return (
    <div className="wrap py-12 md:py-16">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="eyebrow">Твоя статистика</span>
          <h1 className="h1 mt-3 normal-case!" style={{ fontSize: "clamp(1.7rem,3.6vw,2.6rem)" }}>
            Личный кабинет
          </h1>
          <p className="lead mt-3 max-w-xl text-base!">
            Здесь собран весь твой путь: баллы, уроки, тесты и награды.
            Данные хранятся локально в браузере — никакой регистрации.
          </p>
        </div>
        <span className="chip chip-acc">
          <Award size={13} /> Достижений открыто: {ready ? state.achievements.length : 0} / {achievements.length}
        </span>
      </div>

      {/* Главная панель */}
      <div className="grid gap-4 lg:grid-cols-[auto_1fr] mt-10 items-stretch">
        <div className="card p-7 grid place-items-center">
          <ProgressRing value={ready ? mastery : 0} label="курса освоено" />
        </div>
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card card-hover p-5 flex flex-col justify-between gap-3">
              <s.icon size={20} style={{ color: s.tint }} />
              <div>
                <div className="font-extrabold leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem" }}>
                  {s.value}
                </div>
                <div className="text-xs soft mt-1.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Рекомендации */}
      <section className="mt-14" aria-labelledby="recs">
        <h2 id="recs" className="h2 text-xl! mb-5 flex items-center gap-2.5">
          <Compass size={21} style={{ color: "var(--acc-3)" }} />
          {recs.length > 0 ? "Что учить дальше" : "Курс пройден — дальше практика!"}
        </h2>
        {recs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recs.map((l) => (
              <Link key={l.slug} href={`/urok/${l.slug}`} className="card card-hover p-5 flex items-center gap-4 group">
                <LessonIcon icon={l.icon} hue={l.hue} size={48} iconSize={23} />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] muted">Урок {l.number}</div>
                  <div className="font-bold leading-snug truncate group-hover:text-[var(--acc-3)] transition-colors">{l.short}</div>
                  <div className="text-xs soft mt-0.5">{l.minutes} мин</div>
                </div>
                <ChevronRight size={17} className="muted flex-none transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center soft">
            Все уроки отмечены пройденными. Самое время блеснуть на{" "}
            <Link href="/ekzamen" className="font-bold" style={{ color: "var(--acc-3)" }}>
              мини-экзамене
            </Link>{" "}
            и погонять <Link href="/trenazher" className="font-bold" style={{ color: "var(--acc-3)" }}>тренажёры</Link>!
          </div>
        )}
      </section>

      {/* Результаты по урокам */}
      <section className="mt-14" aria-labelledby="results">
        <h2 id="results" className="h2 text-xl! mb-5 flex items-center gap-2.5">
          <ListChecks size={21} style={{ color: "var(--acc-3)" }} /> Успеваемость по темам
        </h2>
        <div className="card overflow-hidden">
          {lessons.map((l, i) => {
            const done = ready && state.completed.includes(l.slug);
            const pct = ready ? quizPercent(l.slug) : null;
            return (
              <Link
                key={l.slug}
                href={`/urok/${l.slug}`}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors group"
                style={{ borderBottom: i < lessons.length - 1 ? "1px solid var(--line)" : "none", background: "transparent" }}
              >
                {done ? (
                  <CheckCircle2 size={19} style={{ color: "var(--ok)" }} className="flex-none" />
                ) : (
                  <Circle size={19} className="muted flex-none" />
                )}
                <span className="mono text-xs muted w-7 flex-none">{String(l.number).padStart(2, "0")}</span>
                <span className="font-semibold flex-1 truncate group-hover:text-[var(--acc-3)] transition-colors">
                  {l.title}
                </span>
                <span className="hidden sm:block w-40">
                  <span className="pbar h-1.5! block">
                    <span style={{ width: `${done ? 100 : pct ?? 0}%` }} />
                  </span>
                </span>
                <span
                  className="chip text-[0.68rem]! w-24 justify-center flex-none"
                  style={pct !== null ? { color: pct >= 80 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--bad)" } : {}}
                >
                  {pct !== null ? `тест ${pct}%` : "тест —"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Достижения */}
      <section className="mt-14" aria-labelledby="ach">
        <h2 id="ach" className="h2 text-xl! mb-5 flex items-center gap-2.5">
          <Award size={21} style={{ color: "var(--acc-3)" }} /> Достижения и награды
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => {
            const unlocked = ready && state.achievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`card p-5 flex items-center gap-4 transition-all ${unlocked ? "" : "achieve-locked"}`}
                style={unlocked ? { borderColor: "rgba(52,211,153,.35)", boxShadow: "0 0 34px -18px rgba(52,211,153,.5)" } : {}}
              >
                <div className="achieve-badge">
                  <AchievementIcon icon={a.icon} />
                </div>
                <div>
                  <div className="font-bold leading-tight">{a.title}</div>
                  <div className="text-xs soft mt-1 leading-relaxed">{a.desc}</div>
                  <div className="text-[0.68rem] font-bold uppercase tracking-wider mt-1.5" style={{ color: unlocked ? "var(--ok)" : "var(--ink-3)" }}>
                    {unlocked ? "Открыто" : "Закрыто"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Сброс прогресса */}
      <section className="mt-14">
        <div className="card p-5 flex items-center gap-4 flex-wrap" style={{ borderColor: "rgba(251,113,133,.3)" }}>
          <Trash2 size={19} style={{ color: "var(--bad)" }} className="flex-none" />
          <div className="flex-1 min-w-[240px]">
            <div className="font-bold">Сбросить прогресс</div>
            <div className="text-xs soft mt-0.5">
              Удалит баллы, результаты тестов и достижения из этого браузера. Действие необратимо.
            </div>
          </div>
          {!confirming ? (
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(true)}>
              Начать с чистого листа
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="btn btn-sm"
                style={{ background: "var(--bad)", color: "#2b0a12" }}
                onClick={() => {
                  reset();
                  setConfirming(false);
                }}
              >
                Да, удалить всё
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
                Отмена
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
