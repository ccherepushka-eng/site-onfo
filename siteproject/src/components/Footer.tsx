import Link from "next/link";
import { Binary, BookMarked } from "lucide-react";
import { lessons } from "@/lib/data";

// ============================================================
// Футер: о проекте, полезные ссылки, быстрые темы.
// ============================================================

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", background: "var(--bg-soft)" }} className="mt-24">
      <div className="wrap py-14 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              className="grid place-items-center"
              style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, var(--acc), var(--acc-2))" }}
            >
              <Binary size={20} color="#fff" />
            </span>
            <span className="font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
              ИНФОРМАТИКА
            </span>
          </div>
          <p className="mt-4 soft text-sm leading-relaxed max-w-sm">
            Образовательный проект «Информатика — просто о сложном». Двенадцать живых уроков,
            тренажёры, тесты и мини-экзамен: от «что такое бит» до нейросетей. Учитесь в своём
            темпе — прогресс бережно хранится в вашем браузере.
          </p>
          <p className="mt-4 text-xs muted">
            Сделано с любовью к науке и аккуратному коду · {new Date().getFullYear()}
          </p>
        </div>

        <nav aria-label="Разделы сайта">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: "var(--acc-3)" }}>
            Разделы
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/uroki", "Все уроки курса"],
              ["/trenazher", "Интерактивные тренажёры"],
              ["/glosariy", "Словарь терминов"],
              ["/ekzamen", "Мини-экзамен"],
              ["/kabinet", "Личный кабинет"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="soft hover:text-[var(--ink)] transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Популярные темы">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider" style={{ color: "var(--acc-3)" }}>
            Популярные темы
          </h3>
          <ul className="space-y-2.5 text-sm">
            {[2, 6, 10, 11].map((i) => (
              <li key={lessons[i].slug}>
                <Link href={`/urok/${lessons[i].slug}`} className="soft hover:text-[var(--ink)] transition-colors">
                  {lessons[i].short}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://wikipedia.org"
                target="_blank"
                rel="noreferrer"
                className="soft hover:text-[var(--ink)] transition-colors inline-flex items-center gap-1.5"
              >
                <BookMarked size={14} /> Энциклопедия Википедия
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap py-4 flex flex-wrap items-center justify-between gap-2 text-xs muted">
          <span>Учебный проект. Материалы можно использовать свободно для обучения.</span>
          <span className="mono">01001000 01100101 01101100 01101100 01101111</span>
        </div>
      </div>
    </footer>
  );
}
