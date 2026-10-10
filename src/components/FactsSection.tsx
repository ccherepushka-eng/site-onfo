"use client";

// ============================================================
// Блок «Интересные факты»: сетка карточек + кнопка
// «Ещё факты» перемешивает подборку без перезагрузки.
// ============================================================

import { useState } from "react";
import { Dices, Lightbulb } from "lucide-react";
import { facts } from "@/lib/data/extras";
import { shuffle } from "@/lib/data";

export function FactsSection() {
  const [order, setOrder] = useState(() => facts.slice(0, 6));
  const [spin, setSpin] = useState(0);

  const more = () => {
    setOrder(shuffle(facts).slice(0, 6));
    setSpin((s) => s + 1);
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" key={spin}>
        {order.map((f, i) => (
          <article key={f.title + i} className="card card-hover p-5 flex gap-4" style={{ animation: `fadeUp .5s ease ${i * 70}ms both` }}>
            <div className="achieve-badge w-11! h-11! rounded-xl! flex-none" style={{ background: "linear-gradient(140deg, rgba(251,191,36,.18), rgba(251,113,133,.15))" }}>
              <Lightbulb size={20} style={{ color: "var(--warn)" }} />
            </div>
            <div>
              <h3 className="font-bold mb-1.5 leading-snug">{f.title}</h3>
              <p className="text-sm soft leading-relaxed">{f.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="text-center mt-7">
        <button className="btn btn-ghost" onClick={more}>
          <Dices size={17} /> Показать другие факты
        </button>
      </div>
    </div>
  );
}
