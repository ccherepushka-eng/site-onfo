"use client";

// ============================================================
// Хранилище прогресса ученика.
// Всё состояние живёт в localStorage браузера (без регистрации),
// достижения проверяются автоматически при каждом изменении.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { achievements as ACHIEVEMENTS } from "@/lib/data/extras";
import { TOTAL_LESSONS } from "@/lib/data";
import type { AchievementDef } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "informatika-progress-v1";

export interface QuizResult {
  correct: number;
  total: number;
  date: number;
}

export interface ProgressState {
  /** slug пройденных уроков */
  completed: string[];
  /** лучшие результаты тестов уроков */
  quiz: Record<string, QuizResult>;
  /** лучший результат мини-экзамена */
  examBest: QuizResult | null;
  /** верные ответы в тренажёрах */
  trainer: { binary: number; logic: number };
  /** id просмотренных карточек терминов */
  flashSeen: string[];
  /** сколько случайных вопросов отвечено (верно) */
  randomAnswered: number;
  /** последняя открытая тема */
  lastVisited: { slug: string; at: number } | null;
  /** id разблокированных достижений */
  achievements: string[];
}

const DEFAULT_STATE: ProgressState = {
  completed: [],
  quiz: {},
  examBest: null,
  trainer: { binary: 0, logic: 0 },
  flashSeen: [],
  randomAnswered: 0,
  lastVisited: null,
  achievements: [],
};

// ---------- Баллы и освоение (чистые функции от состояния) ----------

export function computePoints(s: ProgressState): number {
  const lessonsPts = s.completed.length * 50;
  const quizPts = Object.values(s.quiz).reduce((sum, r) => sum + r.correct * 10, 0);
  const examPts = s.examBest ? s.examBest.correct * 10 : 0;
  const trainerPts = Math.min(s.trainer.binary, 30) * 2 + Math.min(s.trainer.logic, 30) * 2;
  const randomPts = Math.min(s.randomAnswered, 50) * 2;
  return lessonsPts + quizPts + examPts + trainerPts + randomPts;
}

export function computeMastery(s: ProgressState): number {
  const done = s.completed.length;
  const tested = Object.keys(s.quiz).length;
  return Math.min(100, Math.round(((done + tested) / (2 * TOTAL_LESSONS)) * 100));
}

// ---------- Контекст ----------

interface ProgressApi {
  state: ProgressState;
  ready: boolean;
  points: number;
  mastery: number;
  toggleLesson: (slug: string) => void;
  saveQuiz: (slug: string, correct: number, total: number) => void;
  saveExam: (correct: number, total: number) => void;
  addTrainer: (kind: "binary" | "logic") => void;
  seeFlash: (id: string) => void;
  addRandom: () => void;
  visit: (slug: string) => void;
  reset: () => void;
  quizPercent: (slug: string) => number | null;
}

const Ctx = createContext<ProgressApi | null>(null);

export function useProgress(): ProgressApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress должен использоваться внутри <ProgressProvider>");
  return ctx;
}

/** Проверяет, какие достижения уже выполнены по состоянию */
function earnedAchievements(s: ProgressState, points: number): string[] {
  const anyPerfect = Object.values(s.quiz).some((r) => r.total > 0 && r.correct === r.total);
  const examOk = s.examBest !== null && s.examBest.correct / s.examBest.total >= 0.8;
  const checks: Record<string, boolean> = {
    "first-lesson": s.completed.length >= 1,
    "half-course": s.completed.length >= 6,
    "full-course": s.completed.length >= TOTAL_LESSONS,
    "binary-master": s.trainer.binary >= 10,
    logician: s.trainer.logic >= 10,
    "perfect-quiz": anyPerfect,
    "exam-pass": examOk,
    "card-collector": s.flashSeen.length >= 20,
    "self-check": s.randomAnswered >= 10,
    "rich-mind": points >= 500,
  };
  return ACHIEVEMENTS.filter((a) => checks[a.id]).map((a) => a.id);
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<AchievementDef | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1) Загрузка из localStorage после монтирования (избегаем рассинхрона SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ProgressState>;
        setState({ ...DEFAULT_STATE, ...parsed, trainer: { ...DEFAULT_STATE.trainer, ...parsed.trainer } });
      }
    } catch {
      /* повреждённое хранилище — начинаем с чистого листа */
    }
    setReady(true);
  }, []);

  // 2) Сохранение при каждом изменении (после загрузки)
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* переполнение хранилища — игнорируем */
    }
  }, [state, ready]);

  const points = useMemo(() => computePoints(state), [state]);
  const mastery = useMemo(() => computeMastery(state), [state]);

  // 3) Автопроверка достижений
  useEffect(() => {
    if (!ready) return;
    const earned = earnedAchievements(state, points);
    const fresh = earned.filter((id) => !state.achievements.includes(id));
    if (fresh.length > 0) {
      setState((s) => ({ ...s, achievements: [...s.achievements, ...fresh] }));
      const def = ACHIEVEMENTS.find((a) => a.id === fresh[0]);
      if (def) {
        setToast(def);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 4500);
      }
    }
  }, [state, ready, points]);

  // ---------- Действия ----------
  const toggleLesson = useCallback((slug: string) => {
    setState((s) => ({
      ...s,
      completed: s.completed.includes(slug)
        ? s.completed.filter((x) => x !== slug)
        : [...s.completed, slug],
    }));
  }, []);

  const saveQuiz = useCallback((slug: string, correct: number, total: number) => {
    setState((s) => {
      const prev = s.quiz[slug];
      // храним лучший результат
      if (prev && prev.correct >= correct) return s;
      return { ...s, quiz: { ...s.quiz, [slug]: { correct, total, date: Date.now() } } };
    });
  }, []);

  const saveExam = useCallback((correct: number, total: number) => {
    setState((s) => {
      const prev = s.examBest;
      const better = !prev || correct / total > prev.correct / prev.total;
      return better ? { ...s, examBest: { correct, total, date: Date.now() } } : s;
    });
  }, []);

  const addTrainer = useCallback((kind: "binary" | "logic") => {
    setState((s) => ({ ...s, trainer: { ...s.trainer, [kind]: s.trainer[kind] + 1 } }));
  }, []);

  const seeFlash = useCallback((id: string) => {
    setState((s) => (s.flashSeen.includes(id) ? s : { ...s, flashSeen: [...s.flashSeen, id] }));
  }, []);

  const addRandom = useCallback(() => {
    setState((s) => ({ ...s, randomAnswered: s.randomAnswered + 1 }));
  }, []);

  const visit = useCallback((slug: string) => {
    setState((s) => ({ ...s, lastVisited: { slug, at: Date.now() } }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const quizPercent = useCallback(
    (slug: string) => {
      const r = state.quiz[slug];
      return r ? Math.round((r.correct / r.total) * 100) : null;
    },
    [state.quiz]
  );

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      ready,
      points,
      mastery,
      toggleLesson,
      saveQuiz,
      saveExam,
      addTrainer,
      seeFlash,
      addRandom,
      visit,
      reset,
      quizPercent,
    }),
    [state, ready, points, mastery, toggleLesson, saveQuiz, saveExam, addTrainer, seeFlash, addRandom, visit, reset, quizPercent]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {/* Всплывающее уведомление о новом достижении */}
      {toast && (
        <div className="toast-achieve card p-4 flex items-center gap-3 max-w-xs" role="status" aria-live="polite">
          <div className="achieve-badge">
            <CheckCircle2 size={26} style={{ color: "var(--ok)" }} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--acc-3)" }}>
              Достижение открыто!
            </div>
            <div className="font-bold">{toast.title}</div>
            <div className="text-sm soft">{toast.desc}</div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
