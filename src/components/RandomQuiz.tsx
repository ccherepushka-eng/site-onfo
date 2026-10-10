"use client";

// ============================================================
// Случайный вопрос для самопроверки — из любого из 60 вопросов
// курса. Засчитывается в достижение «Самопроверка».
// ============================================================

import { useEffect, useState } from "react";
import { Dices, Lightbulb, ChevronRight } from "lucide-react";
import { allQuestions, shuffle } from "@/lib/data";
import type { Question } from "@/lib/types";
import { useProgress } from "./ProgressProvider";
import { rich } from "@/lib/richtext";

const LETTERS = ["А", "Б", "В", "Г"];

export function RandomQuiz() {
  const { addRandom, state } = useProgress();
  const [deck, setDeck] = useState<(Question & { lesson: string })[]>([]);
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  // Перетасованная колода генерируется на клиенте
  useEffect(() => {
    setDeck(shuffle(allQuestions()));
  }, []);

  const q = deck[pos % Math.max(deck.length, 1)];

  const pick = (i: number) => {
    if (!q || picked !== null) return;
    setPicked(i);
    addRandom();
    if (i === q.answer) setSessionCorrect((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    if (pos + 1 >= deck.length) {
      setDeck(shuffle(allQuestions())); // колода кончилась — перемешаем заново
      setPos(0);
    } else {
      setPos(pos + 1);
    }
  };

  return (
    <div className="card p-6 md:p-8 card-hover" id="random">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#38bdf8,#818cf8)", boxShadow: "0 8px 20px -6px rgba(56,189,248,.5)" }}>
            <Dices size={22} color="#fff" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Случайный вопрос</h3>
            <p className="text-sm soft">Самопроверка по всему курсу · верно за сессию: {sessionCorrect}</p>
          </div>
        </div>
        <span className="chip">Отвечено всего: {state.randomAnswered} / 10 до достижения</span>
      </div>

      {q ? (
        <>
          <div className="chip chip-acc mb-3">Тема: {q.lesson}</div>
          <h4 className="font-bold text-lg leading-snug mb-4">{rich(q.q)}</h4>
          <div className="space-y-2.5">
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
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <div className="mt-4 p-4 rounded-2xl text-sm" style={{ background: "rgba(91,140,255,.09)", border: "1px solid var(--line-2)", animation: "fadeUp .3s ease" }}>
              <div className="flex items-center gap-2 font-bold mb-1" style={{ color: "var(--acc-3)" }}>
                <Lightbulb size={15} /> {picked === q.answer ? "Верно!" : "Не совсем."}
              </div>
              <p className="soft">{rich(q.explain)}</p>
              <div className="mt-3 text-right">
                <button className="btn btn-prime btn-sm" onClick={next} autoFocus>
                  Ещё вопрос <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="pbar"><span style={{ width: "40%" }} /></div>
      )}
    </div>
  );
}
