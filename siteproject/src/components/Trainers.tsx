"use client";

// ============================================================
// Интерактивные тренажёры:
//  • BinaryTrainer — перевод чисел десятичная ⇄ двоичная
//  • LogicTrainer — вычисление логических выражений
// Верные ответы идут в прогресс и достижения.
// ============================================================

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Binary as BinaryIcon, Check, ChevronRight, CircuitBoard, Flame, X } from "lucide-react";
import { useProgress } from "./ProgressProvider";

// ------------------ ДВОИЧНЫЙ ТРЕНАЖЁР ------------------

type BinMode = "to2" | "to10";

function newBinTask(mode: BinMode): { value: number; question: string; answer: string } {
  const value = 2 + Math.floor(Math.random() * 29); // 2..30 — удобно устно
  return mode === "to2"
    ? { value, question: `${value}₁₀`, answer: value.toString(2) }
    : { value, question: `${value.toString(2)}₂`, answer: String(value) };
}

/** Разбор числа по степеням двойки для обучающей подсказки */
function decompose(n: number): string {
  const powers: string[] = [];
  let p = 0;
  let rest = n;
  while (rest > 0) {
    if (rest % 2 === 1) powers.unshift(`2^${p}`);
    rest = Math.floor(rest / 2);
    p++;
  }
  return powers.join(" + ") || "0";
}

export function BinaryTrainer() {
  const { addTrainer, state } = useProgress();
  const [mode, setMode] = useState<BinMode>("to2");
  const [task, setTask] = useState(() => newBinTask("to2"));
  const [input, setInput] = useState("");
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const [streak, setStreak] = useState(0);
  const [localScore, setLocalScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const check = () => {
    const clean = input.trim();
    if (!clean || verdict !== null) return;
    const ok = mode === "to2" ? clean === task.answer : clean === task.answer;
    setVerdict(ok);
    if (ok) {
      addTrainer("binary");
      setStreak((s) => s + 1);
      setLocalScore((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setTask(newBinTask(mode));
    setInput("");
    setVerdict(null);
    setTimeout(() => inputRef.current?.focus(), 30);
  };

  const switchMode = (m: BinMode) => {
    setMode(m);
    setTask(newBinTask(m));
    setInput("");
    setVerdict(null);
  };

  return (
    <div className="card p-6 md:p-8 card-hover">
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#8b5cf6,#6366f1)", boxShadow: "0 8px 20px -6px rgba(139,92,246,.5)" }}>
            <BinaryIcon size={22} color="#fff" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Двоичный тренажёр</h3>
            <p className="text-sm soft">Переводи числа между системами</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="chip">Счёт: <strong className="ml-1">{localScore}</strong></span>
          <span className="chip" style={streak >= 3 ? { color: "var(--warn)" } : {}}>
            <Flame size={13} /> Серия: {streak}
          </span>
        </div>
      </div>

      {/* Переключатель режима */}
      <div className="flex rounded-xl p-1 mb-6" style={{ background: "var(--surface-2)", border: "1px solid var(--line)" }} role="tablist">
        {(
          [
            ["to2", "Из десятичной → в двоичную"],
            ["to10", "Из двоичной → в десятичную"],
          ] as [BinMode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: mode === m ? "linear-gradient(115deg,var(--acc),var(--acc-2))" : "transparent",
              color: mode === m ? "#fff" : "var(--ink-2)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="text-center mb-5">
        <div className="text-xs uppercase tracking-widest muted mb-1">
          {mode === "to2" ? "Переведи в двоичную систему" : "Переведи в десятичную систему"}
        </div>
        <div className="mono font-extrabold" style={{ fontSize: "2.6rem", letterSpacing: "0.06em" }}>
          {task.question}
        </div>
      </div>

      <div className="flex gap-2 max-w-sm mx-auto">
        <input
          ref={inputRef}
          className="input mono text-center text-lg!"
          placeholder={mode === "to2" ? "Например: 1011" : "Например: 11"}
          value={input}
          inputMode="numeric"
          onChange={(e) => setInput(e.target.value.replace(mode === "to2" ? /[^01]/g : /[^0-9]/g, ""))}
          onKeyDown={(e) => {
            if (e.key === "Enter") (verdict === null ? check : next)();
          }}
          aria-label="Твой ответ"
        />
        {verdict === null ? (
          <button className="btn btn-prime" onClick={check} disabled={!input.trim()}>
            Проверить
          </button>
        ) : (
          <button className="btn btn-prime" onClick={next} autoFocus>
            Дальше <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Вердикт и разбор */}
      {verdict !== null && (
        <div
          className="mt-5 p-4 rounded-2xl text-sm"
          style={{
            animation: "popIn .3s ease",
            background: verdict ? "rgba(52,211,153,.1)" : "rgba(251,113,133,.09)",
            border: `1px solid ${verdict ? "rgba(52,211,153,.4)" : "rgba(251,113,133,.4)"}`,
          }}
        >
          {verdict ? (
            <p className="flex items-center gap-2 font-bold" style={{ color: "var(--ok)" }}>
              <Check size={17} /> Верно! {task.question.replace(/[₁₂]/g, "")} = {task.answer}
              {mode === "to2" ? "₂" : "₁₀"}
            </p>
          ) : (
            <div>
              <p className="flex items-center gap-2 font-bold mb-1" style={{ color: "var(--bad)" }}>
                <X size={17} /> Пока нет. Правильный ответ: {task.answer}
              </p>
              <p className="soft text-xs leading-relaxed">
                Разбор: {mode === "to10" ? (
                  <>складываем степени двойки: {decompose(task.value)} = <strong>{task.value}</strong></>
                ) : (
                  <>делим {task.value} на 2 и собираем остатки снизу вверх → <strong>{task.answer}</strong></>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs muted mt-4 text-center">
        Верные ответы всего за всё время: {state.trainer.binary}. Достижение «Двоичный мастер» — за 10.
      </p>
    </div>
  );
}

// ------------------ ЛОГИЧЕСКИЙ ТРЕНАЖЁР ------------------

interface LogicTask {
  expr: string; // красивое выражение
  a: boolean;
  b: boolean;
  result: boolean;
  reason: string;
}

function newLogicTask(): LogicTask {
  const a = Math.random() < 0.5;
  const b = Math.random() < 0.5;
  const kind = Math.floor(Math.random() * 6);
  const A = a ? "1" : "0";
  const B = b ? "1" : "0";
  switch (kind) {
    case 0:
      return { expr: `${A} И ${B}`, a, b, result: a && b, reason: `И истинно, только когда оба истинны. Здесь ${a} и ${b} → ${a && b}.` };
    case 1:
      return { expr: `${A} ИЛИ ${B}`, a, b, result: a || b, reason: `ИЛИ ложно, только когда оба ложны. Здесь ${a} или ${b} → ${a || b}.` };
    case 2:
      return { expr: `НЕ ${A}`, a, b, result: !a, reason: `НЕ переворачивает значение: НЕ ${a} → ${!a}.` };
    case 3:
      return { expr: `${A} И НЕ ${B}`, a, b, result: a && !b, reason: `Сначала НЕ: НЕ ${b} = ${!b}. Затем И: ${a} ∧ ${!b} → ${a && !b}.` };
    case 4:
      return { expr: `${A} XOR ${B}`, a, b, result: a !== b, reason: `XOR истинен, когда значения различны: ${a} ≠ ${b} → ${a !== b}.` };
    default:
      return { expr: `НЕ (${A} ИЛИ ${B})`, a, b, result: !(a || b), reason: `В скобках: ${a} ∨ ${b} = ${a || b}. Отрицание: ¬(${a || b}) = ${!(a || b)} (закон де Моргана).` };
  }
}

export function LogicTrainer() {
  const { addTrainer, state } = useProgress();
  const [task, setTask] = useState<LogicTask | null>(null);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [localScore, setLocalScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Генерируем первое задание только на клиенте (нет рассинхрона SSR)
  useEffect(() => {
    setTask(newLogicTask());
  }, []);

  const answer = (v: boolean) => {
    if (!task || picked !== null) return;
    setPicked(v);
    if (v === task.result) {
      addTrainer("logic");
      setLocalScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setTask(newLogicTask());
    setPicked(null);
  };

  return (
    <div className="card p-6 md:p-8 card-hover">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#ec4899,#a855f7)", boxShadow: "0 8px 20px -6px rgba(236,72,153,.5)" }}>
            <CircuitBoard size={22} color="#fff" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Тренажёр логики</h3>
            <p className="text-sm soft">Вычисли: истина (1) или ложь (0)?</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="chip">Счёт: <strong className="ml-1">{localScore}</strong></span>
          <span className="chip" style={streak >= 3 ? { color: "var(--warn)" } : {}}>
            <Flame size={13} /> Серия: {streak}
          </span>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-xs uppercase tracking-widest muted mb-2">Чему равно выражение?</div>
        <div className="mono font-extrabold" style={{ fontSize: "clamp(1.5rem,4vw,2.3rem)", letterSpacing: "0.04em", minHeight: "3rem" }}>
          {task ? task.expr : "…"}
        </div>
      </div>

      <div className="flex gap-3 max-w-xs mx-auto">
        {[true, false].map((v) => {
          let style: CSSProperties = {};
          if (picked !== null && task) {
            if (v === task.result) style = { borderColor: "var(--ok)", background: "rgba(52,211,153,.12)", color: "var(--ink)" };
            else if (v === picked) style = { borderColor: "var(--bad)", background: "rgba(251,113,133,.1)" };
          }
          return (
            <button
              key={String(v)}
              onClick={() => answer(v)}
              disabled={picked !== null}
              className="quiz-opt justify-center! text-xl! mono font-bold flex-1"
              style={style}
            >
              {v ? "1 (истина)" : "0 (ложь)"}
            </button>
          );
        })}
      </div>

      {picked !== null && task && (
        <div className="mt-5 p-4 rounded-2xl text-sm" style={{ background: "rgba(91,140,255,.09)", border: "1px solid var(--line-2)", animation: "fadeUp .3s ease" }}>
          <p className="font-bold mb-1" style={{ color: picked === task.result ? "var(--ok)" : "var(--bad)" }}>
            {picked === task.result ? "Точно!" : `Неверно: ответ ${task.result ? "1" : "0"}.`}
          </p>
          <p className="soft">{task.reason}</p>
          <div className="mt-3 text-right">
            <button className="btn btn-prime btn-sm" onClick={next} autoFocus>
              Следующее выражение <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <p className="text-xs muted mt-4 text-center">
        Верных ответов всего: {state.trainer.logic}. Достижение «Логик» — за 10.
      </p>
    </div>
  );
}
