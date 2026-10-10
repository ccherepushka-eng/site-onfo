"use client";

// ============================================================
// Анимированный фон первого экрана: сеть частиц, соединённых
// линиями, + всплывающие двоичные цифры. Лёгкий, < 100 частиц,
// реагирует на курсор, отключается при свёрнутой вкладке.
// ============================================================

import { useEffect, useRef } from "react";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Digit {
  x: number;
  y: number;
  v: string;
  speed: number;
  alpha: number;
  size: number;
}

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: P[] = [];
    let digits: Digit[] = [];
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(85, Math.floor((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const spawnDigit = () => {
      if (digits.length < 14 && Math.random() < 0.08) {
        digits.push({
          x: Math.random() * w,
          y: h + 20,
          v: Math.random() < 0.5 ? "0" : "1",
          speed: 0.3 + Math.random() * 0.5,
          alpha: 0.05 + Math.random() * 0.12,
          size: 12 + Math.random() * 16,
        });
      }
    };

    const tick = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // Всплывающие 0 и 1
      spawnDigit();
      ctx.textAlign = "center";
      for (const d of digits) {
        d.y -= d.speed;
        ctx.font = `${d.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = `rgba(125, 160, 255, ${d.alpha})`;
        ctx.fillText(d.v, d.x, d.y);
      }
      digits = digits.filter((d) => d.y > -30);

      // Частицы
      for (const p of particles) {
        // лёгкое притяжение к курсору
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 220 * 220 && dist2 > 25) {
          p.vx += (dx / Math.sqrt(dist2)) * 0.012;
          p.vy += (dy / Math.sqrt(dist2)) * 0.012;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.995;
        p.vy *= 0.995;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      // Линии между близкими частицами
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const max = 130 * 130;
          if (d2 < max) {
            const t = 1 - d2 / max;
            ctx.strokeStyle = `rgba(110, 140, 255, ${t * 0.28})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Сами частицы
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(140, 165, 255, 0.75)";
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("pointermove", onMove);
    canvas.parentElement?.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("pointermove", onMove);
      canvas.parentElement?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden />;
}
