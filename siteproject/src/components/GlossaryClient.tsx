"use client";

// ============================================================
// Глоссарий: живой поиск, фильтры по категориям,
// переворачивающиеся карточки. Учитывается в достижении
// «Знаток терминов». Поддерживает ?q= из глобального поиска.
// ============================================================

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { glossary } from "@/lib/data/extras";
import { useProgress } from "./ProgressProvider";

const CATS = ["Все", ...Array.from(new Set(glossary.map((g) => g.cat))).sort()];

export function GlossaryClient() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState("Все");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const { seeFlash, state } = useProgress();

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return glossary.filter(
      (g) =>
        (cat === "Все" || g.cat === cat) &&
        (!q || g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q))
    );
  }, [query, cat]);

  const seen = glossary.filter((g) => state.flashSeen.includes(`gl:${g.term}`)).length;

  const flip = (term: string) => {
    setFlipped((f) => ({ ...f, [term]: !f[term] }));
    seeFlash(`gl:${term}`);
  };

  return (
    <>
      {/* Панель поиска и фильтров */}
      <div className="card p-4 md:p-5 mb-8 sticky top-20 z-30" style={{ background: "var(--surface-solid)" }}>
        <div className="flex items-center gap-3">
          <Search size={18} className="muted flex-none" />
          <input
            className="flex-1 bg-transparent outline-none text-base min-w-0"
            placeholder="Найти термин: алгоритм, DNS, нейросеть…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск по глоссарию"
          />
          <span className="chip hidden! sm:inline-flex!">
            <Sparkles size={12} /> изучено {seen}/{glossary.length}
          </span>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mb-1" role="tablist" aria-label="Категории">
          {CATS.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className="chip cursor-pointer! transition-all"
              style={
                cat === c
                  ? { background: "linear-gradient(115deg,var(--acc),var(--acc-2))", color: "#fff", borderColor: "transparent" }
                  : {}
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Карточки */}
      {list.length === 0 ? (
        <p className="text-center soft py-14">
          По запросу «{query}» ничего не нашлось. Попробуйте другое слово.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => {
            const isFlipped = !!flipped[g.term];
            const isSeen = state.flashSeen.includes(`gl:${g.term}`);
            return (
              <button
                key={g.term}
                className={`flashcard ${isFlipped ? "flipped" : ""}`}
                style={{ height: 186, textAlign: "inherit", border: 0, background: "none", padding: 0 }}
                onClick={() => flip(g.term)}
                aria-pressed={isFlipped}
                aria-label={`Термин ${g.term}. Нажмите, чтобы увидеть определение`}
              >
                <div className="flashcard-inner">
                  <div className="flash-face flash-front justify-between! items-start! text-left">
                    <span className="chip text-[0.68rem]!">{g.cat}</span>
                    <span className="text-xl font-bold text-center w-full">{g.term}</span>
                    <span className="text-xs muted w-full text-center">
                      {isSeen ? "изучено ✓ · нажми, чтобы повторить" : "нажми, чтобы открыть"}
                    </span>
                  </div>
                  <div className="flash-face flash-back">
                    <span className="text-sm leading-relaxed soft">{g.def}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
