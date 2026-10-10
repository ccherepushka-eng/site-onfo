"use client";

// ============================================================
// Кольцо прогресса (для личного кабинета).
// Плавно «докручивается» до значения.
// ============================================================

import { useEffect, useState } from "react";

export function ProgressRing({ value, size = 170, stroke = 13, label }: { value: number; size?: number; stroke?: number; label: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setV(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--acc-3)" />
            <stop offset="55%" stopColor="var(--acc)" />
            <stop offset="100%" stopColor="var(--acc-2)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="ring-track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="ring-val"
          strokeDasharray={c}
          strokeDashoffset={c - (c * v) / 100}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-extrabold" style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }}>
          {v}%
        </div>
        <div className="text-xs soft">{label}</div>
      </div>
    </div>
  );
}
