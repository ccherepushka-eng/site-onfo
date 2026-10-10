"use client";

// ============================================================
// Блок кода с собственной подсветкой синтаксиса (Python и SQL)
// и кнопкой «Копировать». Без внешних библиотек подсветки.
// ============================================================

import { useMemo, useState } from "react";
import { Check, Copy, TerminalSquare } from "lucide-react";

interface Tok {
  c: string; // css-класс или "" для обычного текста
  v: string; // текст токена
}

// Комментарии (1) → строки (2) → числа (3) → ключевые слова (4)
// → вызов функции (5) → операторы (6). Порядок важен.
const RX =
  /(--[^\n]*|#[^\n]*)|("""[\s\S]*?"""|f?"[^"\n]*"|f?'[^'\n]*')|\b(\d+(?:\.\d+)?)\b|\b(def|return|if|elif|else|for|while|in|import|from|as|not|and|or|is|None|True|False|break|continue|pass|lambda|with|try|except|finally|raise|class|SELECT|FROM|WHERE|ORDER|BY|GROUP|INSERT|INTO|VALUES|UPDATE|SET|DELETE|ASC|DESC|AS|AVG|COUNT|SUM|MIN|MAX|LIMIT|JOIN|LEFT|INNER|ON|AND|OR|NOT|LIKE|BETWEEN|DISTINCT|CREATE|TABLE|PRIMARY|KEY)\b|([A-Za-z_А-Яа-яЁё][\wА-Яа-яЁё]*)(?=\s*\()|(=|<>|!=|<=|>=|<|>|\+|-|\*|\/|%)/g;

function tokenize(code: string): Tok[] {
  const out: Tok[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RX.lastIndex = 0;
  while ((m = RX.exec(code)) !== null) {
    if (m.index > last) out.push({ c: "", v: code.slice(last, m.index) });
    const cls = m[1] ? "tok-c" : m[2] ? "tok-s" : m[3] ? "tok-n" : m[4] ? "tok-k" : m[5] ? "tok-f" : "tok-o";
    out.push({ c: cls, v: m[0] });
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push({ c: "", v: code.slice(last) });
  return out;
}

export function CodeBlock({ code, title, output }: { code: string; title?: string; output?: string }) {
  const [copied, setCopied] = useState(false);
  const toks = useMemo(() => tokenize(code), [code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* буфер обмена недоступен — молча пропускаем */
    }
  };

  return (
    <div className="codeblock my-4">
      <div className="codeblock-head">
        <span className="codeblock-dot" style={{ background: "#fb7185" }} />
        <span className="codeblock-dot" style={{ background: "#fbbf24" }} />
        <span className="codeblock-dot" style={{ background: "#34d399" }} />
        <span className="mono text-xs ml-2" style={{ color: "#8b96bc" }}>
          {title ?? "snippet.py"}
        </span>
        <button
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold mono transition-colors"
          style={{ color: copied ? "#34d399" : "#8b96bc" }}
          aria-label="Скопировать код"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Скопировано" : "Копировать"}
        </button>
      </div>
      <pre aria-label={title ?? "Пример кода"}>
        <code>
          {toks.map((t, i) =>
            t.c ? (
              <span key={i} className={t.c}>
                {t.v}
              </span>
            ) : (
              <span key={i}>{t.v}</span>
            )
          )}
        </code>
      </pre>
      {output && (
        <div style={{ borderTop: "1px solid rgba(140,160,255,.12)" }}>
          <div className="codeblock-head border-b-0! py-2">
            <TerminalSquare size={14} style={{ color: "#8b96bc" }} />
            <span className="mono text-xs" style={{ color: "#8b96bc" }}>Вывод программы</span>
          </div>
          <pre className="pt-0!" style={{ color: "#9fe8c6" }}>{output}</pre>
        </div>
      )}
    </div>
  );
}
