"use client";

// ============================================================
// Глобальный поиск (Ctrl/Cmd + K): уроки, термины глоссария,
// вопросы и темы. Навигация стрелками, выбор — Enter.
// ============================================================

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, FileQuestion, Search, Tags, X } from "lucide-react";
import { lessons } from "@/lib/data";
import { glossary } from "@/lib/data/extras";

interface Hit {
  kind: "lesson" | "term" | "question";
  title: string;
  sub: string;
  href: string;
}

// Формируем поисковый индекс один раз
function buildIndex(): Hit[] {
  const lessonHits: Hit[] = lessons.map((l) => ({
    kind: "lesson",
    title: `${l.number}. ${l.title}`,
    sub: l.description,
    href: `/urok/${l.slug}`,
  }));
  const termHits: Hit[] = glossary.map((g) => ({
    kind: "term",
    title: g.term,
    sub: g.def,
    href: `/glosariy?q=${encodeURIComponent(g.term)}`,
  }));
  const qHits: Hit[] = lessons.flatMap((l) =>
    l.quiz.map((q) => ({
      kind: "question" as const,
      title: q.q.replace(/`/g, ""),
      sub: `Вопрос теста · ${l.short}`,
      href: `/urok/${l.slug}#test`,
    }))
  );
  return [...lessonHits, ...termHits, ...qHits];
}

const INDEX = buildIndex();

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return INDEX.slice(0, 12); // популярное при пустом запросе
    return INDEX.filter(
      (h) => h.title.toLowerCase().includes(q) || h.sub.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const go = (hit: Hit) => {
    onClose();
    router.push(hit.href);
  };

  // Клавиатура: Esc, стрелки, Enter
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && results[active]) go(results[active]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, results, active]);

  if (!open) return null;

  const KindIcon = ({ kind }: { kind: Hit["kind"] }) =>
    kind === "lesson" ? (
      <BookOpen size={16} />
    ) : kind === "term" ? (
      <Tags size={16} />
    ) : (
      <FileQuestion size={16} />
    );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4"
      style={{ background: "rgba(2,6,23,.6)", backdropFilter: "blur(6px)", paddingTop: "12vh" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Поиск по сайту"
    >
      <div
        className="card w-full max-w-xl overflow-hidden"
        style={{ animation: "popIn .25s cubic-bezier(.2,.9,.3,1.2)", background: "var(--surface-solid)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
          <Search size={18} style={{ color: "var(--ink-3)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Урок, термин, вопрос…"
            className="flex-1 bg-transparent outline-none text-base"
            aria-label="Поисковый запрос"
          />
          <button onClick={onClose} aria-label="Закрыть поиск" className="chip cursor-pointer!">
            <X size={14} /> Esc
          </button>
        </div>

        <div className="max-h-[46vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <div className="p-6 text-center soft">Ничего не нашлось. Попробуйте «питон», «бит», «сети»…</div>
          )}
          {results.map((h, i) => (
            <button
              key={h.href + i}
              onClick={() => go(h)}
              onMouseEnter={() => setActive(i)}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
              style={{ background: i === active ? "var(--surface-2)" : "transparent" }}
            >
              <span className="chip px-2!" style={{ color: "var(--acc-3)" }}>
                <KindIcon kind={h.kind} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-semibold truncate">{h.title}</span>
                <span className="block text-xs soft truncate">{h.sub}</span>
              </span>
              {i === active && <ArrowRight size={15} style={{ color: "var(--acc-3)" }} />}
            </button>
          ))}
        </div>

        <div className="px-4 py-2.5 flex gap-4 text-xs muted" style={{ borderTop: "1px solid var(--line)" }}>
          <span><span className="kbd">↑↓</span> выбор</span>
          <span><span className="kbd">Enter</span> открыть</span>
          <span><span className="kbd">Esc</span> закрыть</span>
        </div>
      </div>
    </div>
  );
}
