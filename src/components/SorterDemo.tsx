"use client";

// ============================================================
// Живая демонстрация алгоритма «сортировка пузырьком»:
// шаг за шагом видны сравнения, обмены и отсортированный «хвост».
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Pause, Play, RotateCcw, StepForward } from "lucide-react";

interface Snap {
  a: number[];
  j: number;        // индекс сравниваемой пары
  swapped: boolean; // был ли обмен на этом шаге
  sortedFrom: number; // отсюда и правее — уже отсортировано
  done: boolean;
}

/** Генератор шагов пузырьковой сортировки */
function* bubble(arr: number[]): Generator<Snap> {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      yield { a: [...a], j, swapped: false, sortedFrom: n - i, done: false };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { a: [...a], j, swapped: true, sortedFrom: n - i, done: false };
      }
    }
  }
  yield { a: [...a], j: -1, swapped: false, sortedFrom: 0, done: true };
}

function randomArray(): number[] {
  const n = 11;
  const set = new Set<number>();
  while (set.size < n) set.add(15 + Math.floor(Math.random() * 85));
  return [...set];
}

export function SorterDemo() {
  const [initial, setInitial] = useState<number[]>([]);
  const [snap, setSnap] = useState<Snap | null>(null);
  const [playing, setPlaying] = useState(false);
  const [steps, setSteps] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const genRef = useRef<Generator<Snap> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    const arr = randomArray();
    setInitial(arr);
    genRef.current = bubble(arr);
    setSnap({ a: [...arr], j: -1, swapped: false, sortedFrom: arr.length, done: false });
    setSteps(0);
    setSwaps(0);
    setPlaying(false);
  };

  // Первое наполнение — только на клиенте
  useEffect(() => {
    reset();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = (): boolean => {
    const g = genRef.current;
    if (!g) return false;
    const r = g.next();
    if (r.done || !r.value || r.value.done) {
      if (r.value) setSnap(r.value);
      setPlaying(false);
      return false;
    }
    setSnap(r.value);
    setSteps((s) => s + 1);
    if (r.value.swapped) setSwaps((s) => s + 1);
    return true;
  };

  // Автопрокрутка
  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        const cont = step();
        if (!cont && timerRef.current) clearInterval(timerRef.current);
      }, 380);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const bars = snap?.a ?? initial;
  const max = useMemo(() => Math.max(...initial, 100), [initial]);

  return (
    <div className="card p-6 md:p-8 card-hover">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="grid place-items-center" style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg,#f59e0b,#fb7185)", boxShadow: "0 8px 20px -6px rgba(245,158,11,.5)" }}>
            <BarChart3 size={22} color="#fff" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Алгоритм в действии</h3>
            <p className="text-sm soft">Сортировка пузырьком · сравнений: {steps} · обменов: {swaps}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-ghost btn-sm" onClick={step} disabled={playing || snap?.done}>
            <StepForward size={15} /> Шаг
          </button>
          <button
            className="btn btn-prime btn-sm"
            onClick={() => (snap?.done ? reset() : setPlaying((p) => !p))}
          >
            {snap?.done ? (<><RotateCcw size={15} /> Заново</>) : playing ? (<><Pause size={15} /> Пауза</>) : (<><Play size={15} /> Пуск</>)}
          </button>
          <button className="btn btn-ghost btn-sm" onClick={reset} aria-label="Новый массив">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Полосы */}
      <div className="flex items-end gap-1.5 justify-center" style={{ height: 190, padding: "1rem .5rem .25rem" }}>
        {bars.map((v, i) => {
          const comparing = snap && (i === snap.j || i === snap.j + 1);
          const isSorted = snap ? i >= snap.sortedFrom : false;
          const bg = snap?.done
            ? "linear-gradient(180deg,#34d399,#10b981)"
            : comparing
              ? snap.swapped
                ? "linear-gradient(180deg,#fb7185,#e11d48)"
                : "linear-gradient(180deg,#7dd3fc,#3b82f6)"
              : isSorted
                ? "linear-gradient(180deg,#34d399,#059669)"
                : "linear-gradient(180deg,rgba(140,160,255,.5),rgba(120,110,255,.35))";
          return (
            <div key={i} className="flex flex-col items-center gap-1" style={{ flex: "1 1 0", maxWidth: 44 }}>
              <span className="mono text-[0.68rem]" style={{ color: comparing ? "var(--ink)" : "var(--ink-3)" }}>{v}</span>
              <div
                className="sort-bar w-full"
                style={{ height: `${(v / max) * 140}px`, background: bg }}
                aria-hidden
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 justify-center text-xs muted">
        <span className="flex items-center gap-1.5"><i className="inline-block w-3 h-3 rounded" style={{ background: "#3b82f6" }} /> сравниваем</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-3 h-3 rounded" style={{ background: "#fb7185" }} /> меняем местами</span>
        <span className="flex items-center gap-1.5"><i className="inline-block w-3 h-3 rounded" style={{ background: "#34d399" }} /> на своём месте</span>
      </div>

      <p className="mt-4 text-sm soft leading-relaxed text-center">
        {snap?.done
          ? "Готово! Массив отсортирован. Большие числа «всплывали» вправо, как пузырьки воздуха — отсюда и название."
          : "Идём слева направо, сравниваем соседей и меняем их местами, если левый больше правого. После каждого прохода самое большое число «всплывает» в конец."}
      </p>
    </div>
  );
}
