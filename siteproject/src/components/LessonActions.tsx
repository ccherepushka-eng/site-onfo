"use client";

// ============================================================
// Клиентские островки страницы урока:
//  • VisitTracker  — запоминает последний посещённый урок
//  • MarkDoneButton — отметить урок пройденным (+50 баллов)
// ============================================================

import { useEffect } from "react";
import { CheckCircle2, CircleDashed } from "lucide-react";
import { useProgress } from "./ProgressProvider";

export function VisitTracker({ slug }: { slug: string }) {
  const { visit, ready } = useProgress();
  useEffect(() => {
    if (ready) visit(slug);
  }, [ready, slug, visit]);
  return null;
}

export function MarkDoneButton({ slug }: { slug: string }) {
  const { state, toggleLesson, ready } = useProgress();
  const done = ready && state.completed.includes(slug);
  return (
    <button
      onClick={() => toggleLesson(slug)}
      className={`btn ${done ? "btn-ok" : "btn-ghost"}`}
      aria-pressed={done}
    >
      {done ? (
        <>
          <CheckCircle2 size={17} /> Урок пройден
        </>
      ) : (
        <>
          <CircleDashed size={17} /> Отметить как пройденный
        </>
      )}
    </button>
  );
}
