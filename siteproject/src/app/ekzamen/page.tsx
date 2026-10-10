"use client";

// ============================================================
// Мини-экзамен: 15 случайных вопросов из всех тем курса.
// Лучший результат сохраняется; 80%+ — достижение «Экзаменатор».
// ============================================================

import { useRef, useState } from "react";
import { Award, Clock3, Dices, GraduationCap, ListChecks, Sparkles } from "lucide-react";
import { sampleQuestions } from "@/lib/data";
import type { Question } from "@/lib/types";
import { Quiz } from "@/components/Quiz";
import { useProgress } from "@/components/ProgressProvider";

const EXAM_SIZE = 15;

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ExamPage() {
  const { state, ready } = useProgress();
  const [questions, setQuestions] = useState<(Question & { lesson: string })[] | null>(null);
  const [round, setRound] = useState(0);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const startRef = useRef<number>(0);

  const start = () => {
    setQuestions(sampleQuestions(EXAM_SIZE));
    setRound((r) => r + 1);
    setLastTime(null);
    startRef.current = Date.now();
  };

  const best = ready && state.examBest ? state.examBest : null;
  const bestPct = best ? Math.round((best.correct / best.total) * 100) : null;

  return (
    <div className="wrap-narrow py-12 md:py-16">
      <span className="eyebrow">Итоговая проверка</span>
      <h1 className="h1 mt-3 normal-case!" style={{ fontSize: "clamp(1.7rem,3.6vw,2.6rem)" }}>
        Мини-экзамен
      </h1>
      <p className="lead mt-4 max-w-2xl">
        {EXAM_SIZE} случайных вопросов из всех тем курса — от битов до нейросетей.
        Каждый новый вариант собирается заново, поэтому экзамен можно пересдавать сколько угодно.
      </p>

      {!questions ? (
        <div className="card p-8 mt-10 text-center">
          <div className="mx-auto mb-5 grid place-items-center" style={{ width: 78, height: 78, borderRadius: 26, background: "linear-gradient(135deg, rgba(91,140,255,.22), rgba(160,107,255,.22))" }}>
            <GraduationCap size={38} style={{ color: "var(--acc-3)" }} />
          </div>
          <h2 className="h2 text-2xl! mb-3">Правила простые</h2>
          <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto mb-7 text-left">
            {[
              { icon: ListChecks, t: `${EXAM_SIZE} вопросов`, d: "случайный набор из 60 вопросов всех тем" },
              { icon: Sparkles, t: "+10 баллов", d: "за каждый верный ответ, объяснение к каждому" },
              { icon: Award, t: "От 80%", d: "результат «отлично» и достижение «Экзаменатор»" },
            ].map((c) => (
              <div key={c.t} className="card bg-transparent! p-4">
                <c.icon size={19} className="mb-2" style={{ color: "var(--acc-3)" }} />
                <div className="font-bold">{c.t}</div>
                <div className="text-xs soft mt-1 leading-relaxed">{c.d}</div>
              </div>
            ))}
          </div>

          {best && bestPct !== null && (
            <div className="chip chip-acc mb-5 text-sm! py-2! px-4!">
              <Award size={14} /> Твой лучший результат: {bestPct}% ({best.correct} из {best.total})
            </div>
          )}

          <div>
            <button className="btn btn-prime px-9! py-4! text-base!" onClick={start}>
              <Dices size={18} /> Начать экзамен
            </button>
          </div>
          <p className="text-xs muted mt-4">Без регистрации и стресса: прогресс хранится только в твоём браузере.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {lastTime !== null && (
            <div className="card p-4 flex items-center gap-3" style={{ animation: "popIn .4s ease" }}>
              <Clock3 size={18} style={{ color: "var(--acc-3)" }} />
              <span className="text-sm">
                Вариант пройден за <strong>{formatTime(lastTime)}</strong>. Хочешь улучшить результат? Собери новый!
              </span>
              <button className="btn btn-ghost btn-sm ml-auto" onClick={start}>
                <Dices size={14} /> Новый вариант
              </button>
            </div>
          )}
          <Quiz
            key={round}
            questions={questions}
            quizId="exam"
            onFinish={() => setLastTime(Math.round((Date.now() - startRef.current) / 1000))}
          />
          {lastTime === null && (
            <p className="text-center text-xs muted">Вопросы выбраны случайно из банка всех 12 тем курса</p>
          )}
        </div>
      )}
    </div>
  );
}
