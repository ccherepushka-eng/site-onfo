import type { ReactNode } from "react";

// ============================================================
// Мини-форматтер учебного текста:
//   **жирный**  →  <strong>
//   `код`       →  <code class="ic">
// Используется во всех блоках уроков, вопросах и пояснениях.
// ============================================================

const RX = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export function rich(text: string): ReactNode {
  const parts = text.split(RX);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith("`") && p.endsWith("`")) {
      return (
        <code key={i} className="ic">
          {p.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{p}</span>;
  });
}
