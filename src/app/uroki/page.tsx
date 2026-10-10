import type { Metadata } from "next";
import { lessons } from "@/lib/data";
import { LessonCard } from "@/components/LessonCard";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Все уроки курса",
  description: "12 разделов информатики: от основ и двоичного кода до баз данных, безопасности и искусственного интеллекта.",
};

export default function CatalogPage() {
  return (
    <div className="wrap py-12 md:py-16">
      <Reveal>
        <span className="eyebrow">Учебная программа</span>
        <h1 className="h1 mt-3 normal-case!" style={{ fontSize: "clamp(1.7rem,3.6vw,2.6rem)" }}>
          Уроки курса
        </h1>
        <p className="lead mt-4 max-w-2xl">
          Двенадцать последовательных тем. Каждая — с объяснением простыми словами, схемами,
          карточками терминов, практикой и тестом. Статус прохождения виден прямо на карточках.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="flex gap-2 flex-wrap mt-6 mb-8">
          <span className="chip chip-acc">Базовый — можно нулевым</span>
          <span className="chip">Средний — после базовых тем</span>
          <span className="chip" style={{ color: "var(--acc-2)" }}>Продвинутый — финал курса</span>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l, i) => (
          <Reveal key={l.slug} delay={Math.min(i, 8) * 60}>
            <LessonCard lesson={l} index={i} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
