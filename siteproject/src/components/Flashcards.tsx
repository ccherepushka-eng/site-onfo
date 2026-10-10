"use client";

// ============================================================
// Интерактивные карточки терминов: клик → переворот.
// Каждая просмотренная карточка идёт в зачёт достижения
// «Знаток терминов».
// ============================================================

import { useState } from "react";
import { RotateCw, Sparkles } from "lucide-react";
import type { TermCard } from "@/lib/types";
import { useProgress } from "./ProgressProvider";

export function Flashcards({ terms, scope }: { terms: TermCard[]; scope: string }) {
  const { seeFlash, state } = useProgress();
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [flashAll, setFlashAll] = useState(0); // для кнопки «перемешать»

  const seenCount = terms.filter((_, i) => state.flashSeen.includes(`${scope}:${i}`)).length;

  const flip = (i: number) => {
    setFlipped((f) => ({ ...f, [i]: !f[i] }));
    seeFlash(`${scope}:${i}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <p className="text-sm soft flex items-center gap-2">
          <Sparkles size={15} style={{ color: "var(--acc-3)" }} />
          Кликни по карточке, чтобы увидеть определение. Изучено:{" "}
          <strong>{seenCount} / {terms.length}</strong>
        </p>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            setFlipped({});
            setFlashAll((v) => v + 1);
          }}
        >
          <RotateCw size={14} /> Закрыть все
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" key={flashAll}>
        {terms.map((t, i) => {
          const isFlipped = !!flipped[i];
          const seen = state.flashSeen.includes(`${scope}:${i}`);
          return (
            <button
              key={`${i}-${flashAll}`}
              className={`flashcard ${isFlipped ? "flipped" : ""}`}
              style={{ height: 168, textAlign: "inherit", border: 0, background: "none", padding: 0 }}
              onClick={() => flip(i)}
              aria-pressed={isFlipped}
              aria-label={`Карточка: ${t.term}. Нажмите, чтобы перевернуть`}
            >
              <div className="flashcard-inner">
                <div className="flash-face flash-front">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: "var(--acc-3)" }}>
                    Термин {seen && "· изучен ✓"}
                  </span>
                  <span className="text-lg font-bold">{t.term}</span>
                  <span className="text-xs muted mt-3">нажми, чтобы перевернуть</span>
                </div>
                <div className="flash-face flash-back">
                  <span className="text-sm leading-relaxed soft">{t.def}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
