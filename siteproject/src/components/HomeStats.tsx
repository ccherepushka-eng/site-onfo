"use client";

// ============================================================
// Блок «Твой прогресс» на главной: анимированные счётчики
// (пройденные уроки, баллы, освоение) + «Продолжить обучение».
// ============================================================

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpenCheck, Gauge, GraduationCap, PlayCircle, Sparkles } from "lucide-react";
import { getLesson, lessons, TOTAL_LESSONS } from "@/lib/data";
import { LessonIcon } from "./Icon";
import { useProgress } from "./ProgressProvider";

/** Плавный отсчёт числа при появлении/изменении */
function useCountUp(target: number, duration = 900): number {
  const [val, setVal] = useState(0);
  const frame = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    cancelAnimationFrame(frame.current);
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * eased));
      if (p < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);
  return val;
}

function Stat({ icon: Icon, label, value, suffix }: { icon: typeof Gauge; label: string; value: number; suffix?: string }) {
  const v = useCountUp(value);
  return (
    <div className="card card-hover p-5 flex items-center gap-4">
      <div className="achieve-badge w-12! h-12! rounded-2xl!">
        <Icon size={22} style={{ color: "var(--acc-3)" }} />
      </div>
      <div>
        <div className="font-extrabold leading-none" style={{ fontFamily: "var(--font-display)", fontSize: "1.7rem" }}>
          {v}
          {suffix && <span className="text-sm ml-1" style={{ color: "var(--acc-3)" }}>{suffix}</span>}
        </div>
        <div className="text-xs soft mt-1">{label}</div>
      </div>
    </div>
  );
}

export function HomeStats() {
  const { state, points, mastery, ready } = useProgress();

  const lessonsDone = ready ? state.completed.length : 0;
  const exam = ready && state.examBest ? Math.round((state.examBest.correct / state.examBest.total) * 100) : null;

  // «Продолжить»: последний открытый урок или первый непройденный
  const last = ready && state.lastVisited ? getLesson(state.lastVisited.slug) : undefined;
  const firstUnfinished = lessons.find((l) => !state.completed.includes(l.slug)) ?? lessons[0];
  const rec = last ?? firstUnfinished;
  const recDone = ready && state.completed.includes(rec.slug);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Stat icon={BookOpenCheck} label={`Уроков пройдено из ${TOTAL_LESSONS}`} value={lessonsDone} />
      <Stat icon={Sparkles} label="Баллов заработано" value={ready ? points : 0} />
      <Stat icon={Gauge} label="Материала освоено" value={ready ? mastery : 0} suffix="%" />

      {/* Продолжить обучение — широкая карточка */}
      <Link
        href={`/urok/${rec.slug}`}
        className="card card-hover p-5 md:col-span-2 flex items-center gap-4 group"
      >
        <LessonIcon icon={rec.icon} hue={rec.hue} size={56} iconSize={26} rounded={18} />
        <div className="flex-1 min-w-0">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.16em] mb-1 flex items-center gap-1.5" style={{ color: "var(--acc-3)" }}>
            <PlayCircle size={14} /> {recDone ? "Повторить тему" : "Продолжить обучение"}
          </div>
          <div className="font-bold text-lg leading-tight truncate">
            Урок {rec.number}. {rec.title}
          </div>
          <div className="text-sm soft truncate">{rec.description}</div>
        </div>
        <ArrowRight size={20} className="muted flex-none transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-[var(--acc-3)]" />
      </Link>

      <Link href="/ekzamen" className="card card-hover p-5 flex items-center gap-4 group">
        <div className="achieve-badge w-12! h-12! rounded-2xl!">
          <GraduationCap size={22} style={{ color: "var(--acc-2)" }} />
        </div>
        <div className="flex-1">
          <div className="font-bold leading-tight">Мини-экзамен</div>
          <div className="text-xs soft mt-0.5">
            {exam !== null ? `Лучший результат: ${exam}%` : "Ещё не сдан — рискнёшь?"}
          </div>
        </div>
        <ArrowRight size={17} className="muted transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
