// ============================================================
// Рендерер содержимого урока: превращает массив блоков
// в красиво оформленные секции (серверный компонент,
// виджеты — клиентские островки внутри).
// ============================================================

import { BookMarked, CheckCheck, ClipboardList, Lightbulb, Quote, MoveRight } from "lucide-react";
import type { LessonBlock, WidgetKind } from "@/lib/types";
import { rich } from "@/lib/richtext";
import { CodeBlock } from "./CodeBlock";
import { BinaryTrainer, LogicTrainer } from "./Trainers";
import { SorterDemo } from "./SorterDemo";
import { RandomQuiz } from "./RandomQuiz";

function Widget({ kind }: { kind: WidgetKind }) {
  switch (kind) {
    case "binary":
      return <BinaryTrainer />;
    case "logic":
      return <LogicTrainer />;
    case "sorter":
      return <SorterDemo />;
    case "random":
      return <RandomQuiz />;
    default:
      return null;
  }
}

export function LessonRenderer({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "intro":
            return (
              <div
                key={i}
                className="card p-6 md:p-7 relative overflow-hidden"
                style={{ borderLeft: "4px solid", borderImage: "linear-gradient(180deg,var(--acc),var(--acc-2)) 1" }}
              >
                <Quote size={60} className="absolute -top-2 right-3 opacity-[0.07]" aria-hidden />
                <p className="lead text-base! md:text-lg!">{rich(b.text)}</p>
              </div>
            );

          case "heading":
            return (
              <h2 key={i} className="h2 text-xl! md:text-2xl! pt-4 flex items-center gap-3">
                <span aria-hidden style={{ width: 10, height: 26, borderRadius: 4, background: "linear-gradient(180deg,var(--acc),var(--acc-2))", flex: "none" }} />
                {b.text}
              </h2>
            );

          case "text":
            return (
              <p key={i} className="text-body">
                {rich(b.text)}
              </p>
            );

          case "definition":
            return (
              <div key={i} className="card p-5 md:p-6 card-hover">
                <div className="flex items-center gap-2 mb-2">
                  <BookMarked size={17} style={{ color: "var(--acc-3)" }} />
                  <span className="font-bold" style={{ color: "var(--acc-3)" }}>
                    {b.term}
                  </span>
                  <span className="chip text-[0.68rem]! ml-auto">определение</span>
                </div>
                <p className="text-body text-[0.98rem]!">{rich(b.text)}</p>
              </div>
            );

          case "example":
            return (
              <div
                key={i}
                className="p-5 md:p-6 rounded-[22px] card-hover"
                style={{ background: "linear-gradient(130deg, rgba(52,211,153,.1), rgba(56,189,248,.08))", border: "1px solid rgba(52,211,153,.25)" }}
              >
                <div className="flex items-center gap-2 mb-2 font-bold" style={{ color: "var(--ok)" }}>
                  <Lightbulb size={17} /> {b.title}
                </div>
                <p className="text-body text-[0.98rem]!">{rich(b.text)}</p>
              </div>
            );

          case "tip":
            return (
              <div
                key={i}
                className="p-5 rounded-[22px] flex gap-3"
                style={{ background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.3)" }}
              >
                <Lightbulb size={20} className="flex-none mt-0.5" style={{ color: "var(--warn)" }} />
                <p className="text-body text-[0.95rem]!">{rich(b.text)}</p>
              </div>
            );

          case "list":
            return (
              <div key={i} className="card p-5 md:p-6 card-hover">
                {b.title && <h3 className="font-bold mb-3">{b.title}</h3>}
                {b.ordered ? (
                  <ol className="space-y-2.5 list-none counter-reset">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex gap-3 text-body text-[0.97rem]!">
                        <span className="quiz-letter rounded-lg! flex-none">{j + 1}</span>
                        <span>{rich(it)}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <ul className="space-y-2.5">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex gap-3 text-body text-[0.97rem]!">
                        <span className="flex-none mt-[0.55rem]" style={{ width: 8, height: 8, borderRadius: 3, background: "linear-gradient(135deg,var(--acc-3),var(--acc-2))" }} aria-hidden />
                        <span>{rich(it)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );

          case "table":
            return (
              <div key={i}>
                {b.title && <h3 className="font-bold mb-3">{b.title}</h3>}
                <div className="ctable-wrap card bg-transparent! rounded-2xl!">
                  <table className="ctable">
                    <thead>
                      <tr>
                        {b.headers.map((h, j) => (
                          <th key={j}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, j) => (
                        <tr key={j}>
                          {r.map((c, k) => (
                            <td key={k}>{rich(c)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );

          case "scheme":
            return (
              <div key={i} className="card p-5 md:p-6 card-hover">
                {b.title && <h3 className="font-bold mb-4">{b.title}</h3>}
                <div className="scheme">
                  {b.steps.map((s, j) => (
                    <span key={j} className="contents">
                      <span className="scheme-step">{rich(s)}</span>
                      {j < b.steps.length - 1 && (
                        <span className="scheme-arrow" aria-hidden>
                          <MoveRight size={18} />
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );

          case "code":
            return <CodeBlock key={i} code={b.code} title={b.title} output={b.output} />;

          case "widgets":
            return (
              <div key={i} className="space-y-6">
                {b.kinds.map((k) => (
                  <Widget key={k} kind={k} />
                ))}
              </div>
            );

          case "remember":
            return (
              <div
                key={i}
                className="p-6 md:p-7 rounded-[22px] relative overflow-hidden"
                style={{
                  background: "linear-gradient(130deg, rgba(91,140,255,.16), rgba(160,107,255,.14))",
                  border: "1px solid rgba(140,160,255,.35)",
                  boxShadow: "0 0 50px -20px var(--glow)",
                }}
              >
                <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                  <CheckCheck size={20} style={{ color: "var(--acc-3)" }} /> Запомни главное
                </h3>
                <ul className="space-y-2.5">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3 text-body text-[0.97rem]!">
                      <span className="quiz-letter flex-none" style={{ background: "rgba(91,140,255,.2)", color: "var(--acc-3)", borderColor: "transparent" }}>
                        ✓
                      </span>
                      <span>{rich(it)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "tasks":
            return (
              <div key={i} className="card p-5 md:p-6 card-hover" style={{ borderStyle: "dashed", borderWidth: 1.5 }}>
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: "var(--acc-2)" }}>
                  <ClipboardList size={18} /> Практические задания
                </h3>
                <ol className="space-y-2.5">
                  {b.items.map((it, j) => (
                    <li key={j} className="flex gap-3 text-body text-[0.95rem]!">
                      <span className="quiz-letter flex-none">{j + 1}</span>
                      <span>{rich(it)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
