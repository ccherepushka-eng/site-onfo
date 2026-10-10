"use client";

// ============================================================
// Карточка урока в каталоге и на главной: номер, иконка,
// описание, мета-информация и живой статус прохождения.
// ============================================================

import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, SignalHigh } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { LessonIcon } from "./Icon";
import { useProgress } from "./ProgressProvider";

const LEVELS = ["", "Базовый", "Средний", "Продвинутый"];

export function LessonCard({ lesson, index = 0 }: { lesson: Lesson; index?: number }) {
  const { state, ready, quizPercent } = useProgress();
  const done = ready && state.completed.includes(lesson.slug);
  const pct = ready ? quizPercent(lesson.slug) : null;

  return (
    <Link
      href={`/urok/${lesson.slug}`}
      className="card card-hover p-5 flex flex-col gap-4 group relative overflow-hidden"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Статус */}
      {done && (
        <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold" style={{ color: "var(--ok)" }}>
          <CheckCircle2 size={15} /> Пройдено
        </span>
      )}

      <div className="flex items-center gap-3.5">
        <LessonIcon icon={lesson.icon} hue={lesson.hue} />
        <div>
          <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] muted">
            Урок {String(lesson.number).padStart(2, "0")}
          </div>
          <div className="font-bold leading-snug group-hover:text-[var(--acc-3)] transition-colors">
            {lesson.short}
          </div>
        </div>
      </div>

      <p className="text-sm soft leading-relaxed flex-1" style={{ minHeight: "3.6em" }}>
        {lesson.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="chip">
          <Clock size={12} /> {lesson.minutes} мин
        </span>
        <span className="chip">
          <SignalHigh size={12} /> {LEVELS[lesson.level]}
        </span>
        {pct !== null && (
          <span className="chip" style={{ color: pct >= 80 ? "var(--ok)" : "var(--warn)" }}>
            Тест: {pct}%
          </span>
        )}
        <ChevronRight size={15} className="ml-auto muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--acc-3)]" />
      </div>

      {/* Прогресс-полоса теста */}
      {pct !== null && !done && (
        <div className="pbar h-1.5!">
          <span style={{ width: `${pct}%` }} />
        </div>
      )}
    </Link>
  );
}
