"use client";

// ============================================================
// Тест с автоматической проверкой:
//  • выбор ответа → мгновенная проверка + объяснение
//  • прогресс-бар, итог с баллами и разбором ошибок
//  • результат сохраняется в прогресс (лучшая попытка)
// ============================================================

import { useMemo, useState } from "react";
import {
  Award,
  BadgeCheck,
  BookOpenCheck,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { Question } from "@/lib/types";
import { useProgress } from "./ProgressProvider";
import { rich } from "@/lib/richtext";

const LETTERS = ["А", "Б", "В", "Г", "Д"];

export function Quiz({
  questions,
  quizId,
  onFinish,
  compact = false,
}: {
  questions: Question[];
  quizId: string; // slug урока или "exam"
  onFinish?: (correct: number, total: number) => void;
  compact?: boolean;
}) {
  const { saveQuiz, saveExam } = useProgress();
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const correctCount = useMemo(
    () => answers.filter((a, i) => a === questions[i].answer).length,
    [answers, questions]
  );

  const pick = (i: number) => {
    if (picked !== null) return; // ответ уже зафиксирован
    setPicked(i);
    setAnswers((a) => [...a, i]);
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      const final = answers.filter((a, i) => a === questions[i].answer).length;
      if (quizId === "exam") saveExam(final, questions.length);
      else saveQuiz(quizId, final, questions.length);
      onFinish?.(final, questions.length);
      setDone(true);
    }
  };

  const restart = () => {
    setStarted(true);
    setIdx(0);
    setPicked(null);
    setAnswers([]);
    setDone(false);
  };

  // ---------- Стартовый экран ----------
  if (!started && !done) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 grid place-items-center" style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, rgba(91,140,255,.2), rgba(160,107,255,.2))" }}>
          <BookOpenCheck size={30} style={{ color: "var(--acc-3)" }} />
        </div>
        <h3 className="h2 text-xl! mb-2">Проверь себя</h3>
        <p className="soft mb-6 max-w-md mx-auto">
          {questions.length} вопросов по теме. За каждый верный ответ —{" "}
          <strong style={{ color: "var(--acc-3)" }}>10 баллов</strong>. Сразу после ответа увидишь объяснение.
        </p>
        <button className="btn btn-prime" onClick={() => setStarted(true)}>
          Пройти тест <ChevronRight size={17} />
        </button>
      </div>
    );
  }

  // ---------- Экран результатов ----------
  if (done) {
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);
    const verdict =
      pct === 100
        ? "Идеально! Тема освоена блестяще."
        : pct >= 80
          ? "Отличный результат — почти безупречно."
          : pct >= 60
            ? "Хорошо! Повтори моменты, где были ошибки."
            : "Тема требует повторения — вернись к уроку и попробуй снова.";
    return (
      <div className="card p-8" style={{ animation: "popIn .4s ease" }}>
        <div className="text-center">
          <div
            className="mx-auto mb-4 grid place-items-center"
            style={{
              width: 72, height: 72, borderRadius: 24,
              background: pct >= 60 ? "linear-gradient(135deg, rgba(52,211,153,.25), rgba(56,189,248,.25))" : "linear-gradient(135deg, rgba(251,191,36,.2), rgba(251,113,133,.2))",
            }}
          >
            <Award size={34} style={{ color: pct >= 60 ? "var(--ok)" : "var(--warn)" }} />
          </div>
          <div className="h2 text-3xl! grad-text mb-1">
            {correctCount} из {total}
          </div>
          <div className="soft mb-2">{pct}% · +{correctCount * 10} баллов</div>
          <p className="max-w-md mx-auto mb-6">{verdict}</p>
          <button className="btn btn-ghost" onClick={restart}>
            <RotateCcw size={16} /> Пройти ещё раз
          </button>
        </div>

        {/* Разбор ошибок */}
        {correctCount < total && (
          <div className="mt-8">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Lightbulb size={17} style={{ color: "var(--warn)" }} /> Разбор ошибок
            </h4>
            <div className="space-y-4">
              {questions.map((qq, qi) => {
                const userA = answers[qi];
                if (userA === qq.answer) return null;
                return (
                  <div key={qi} className="card bg-transparent! p-4 text-sm">
                    <div className="font-semibold mb-2">{rich(qq.q)}</div>
                    <div className="flex items-start gap-2 mb-1" style={{ color: "var(--bad)" }}>
                      <XCircle size={16} className="mt-0.5 flex-none" />
                      <span>Твой ответ: {userA !== null && userA !== undefined ? rich(qq.options[userA]) : "—"}</span>
                    </div>
                    <div className="flex items-start gap-2 mb-2" style={{ color: "var(--ok)" }}>
                      <BadgeCheck size={16} className="mt-0.5 flex-none" />
                      <span>Верно: {rich(qq.options[qq.answer])}</span>
                    </div>
                    <div className="soft text-xs leading-relaxed">{rich(qq.explain)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Вопрос ----------
  return (
    <div className="card p-6 md:p-8">
      {/* Прогресс */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="chip chip-acc">
          Вопрос {idx + 1} / {questions.length}
        </span>
        <span className="text-sm soft">Верно: {correctCount}</span>
      </div>
      <div className="pbar mb-6">
        <span style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      <h3 className="text-lg md:text-xl font-bold leading-snug mb-5">{rich(q.q)}</h3>

      <div className="space-y-2.5" role="radiogroup" aria-label="Варианты ответа">
        {q.options.map((opt, i) => {
          const isPicked = picked === i;
          const isRight = i === q.answer;
          let cls = "quiz-opt";
          if (picked !== null) {
            if (isRight) cls += " correct";
            else if (isPicked) cls += " wrong";
          }
          return (
            <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
              <span className="quiz-letter">{LETTERS[i]}</span>
              <span className="flex-1">{rich(opt)}</span>
              {picked !== null && isRight && <BadgeCheck size={18} style={{ color: "var(--ok)" }} className="flex-none mt-0.5" />}
              {picked !== null && isPicked && !isRight && <XCircle size={18} style={{ color: "var(--bad)" }} className="flex-none mt-0.5" />}
            </button>
          );
        })}
      </div>

      {/* Объяснение после ответа */}
      {picked !== null && (
        <div
          className="mt-5 p-4 rounded-2xl text-sm leading-relaxed"
          style={{ background: "rgba(91,140,255,.09)", border: "1px solid var(--line-2)", animation: "fadeUp .3s ease" }}
        >
          <div className="flex items-center gap-2 font-bold mb-1" style={{ color: "var(--acc-3)" }}>
            <Lightbulb size={16} /> Пояснение
          </div>
          <div className="soft">{rich(q.explain)}</div>
          <div className="mt-4 text-right">
            <button className="btn btn-prime btn-sm" onClick={next}>
              {idx + 1 < questions.length ? "Следующий вопрос" : "Показать результат"}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
      {compact && null}
    </div>
  );
}
