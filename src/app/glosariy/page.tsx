import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal } from "@/components/Reveal";
import { GlossaryClient } from "@/components/GlossaryClient";
import { glossary } from "@/lib/data/extras";

export const metadata: Metadata = {
  title: "Глоссарий терминов",
  description: `Словарь по информатике: ${glossary.length} терминов с понятными определениями — от «алгоритма» до «нейросети».`,
};

export default function GlossaryPage() {
  return (
    <div className="wrap py-12 md:py-16">
      <Reveal>
        <span className="eyebrow">Словарь</span>
        <h1 className="h1 mt-3 normal-case!" style={{ fontSize: "clamp(1.7rem,3.6vw,2.6rem)" }}>
          Глоссарий информатики
        </h1>
        <p className="lead mt-4 max-w-2xl">
          {glossary.length} ключевых терминов курса в формате карточек. Переворачивай,
          запоминай и собирай достижение «Знаток терминов».
        </p>
      </Reveal>

      <div className="mt-8">
        <Suspense fallback={<div className="pbar"><span style={{ width: "30%" }} /></div>}>
          <GlossaryClient />
        </Suspense>
      </div>
    </div>
  );
}
