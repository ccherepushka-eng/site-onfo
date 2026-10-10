import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { BinaryTrainer, LogicTrainer } from "@/components/Trainers";
import { SorterDemo } from "@/components/SorterDemo";
import { RandomQuiz } from "@/components/RandomQuiz";

export const metadata: Metadata = {
  title: "Интерактивные тренажёры",
  description:
    "Двоичный тренажёр, тренажёр логики, демонстрация сортировки пузырьком и случайные вопросы по всему курсу информатики.",
};

export default function TrainersPage() {
  return (
    <div className="wrap-narrow py-12 md:py-16">
      <Reveal>
        <span className="eyebrow">Практика</span>
        <h1 className="h1 mt-3 normal-case!" style={{ fontSize: "clamp(1.7rem,3.6vw,2.6rem)" }}>
          Тренажёры
        </h1>
        <p className="lead mt-4 max-w-2xl">
          Здесь знания превращаются в навык. Каждый верный ответ засчитывается в общий прогресс
          и приближает к достижениям «Двоичный мастер» и «Логик».
        </p>
      </Reveal>

      <div className="mt-10 space-y-8">
        <Reveal>
          <BinaryTrainer />
        </Reveal>
        <Reveal delay={80}>
          <LogicTrainer />
        </Reveal>
        <Reveal delay={80}>
          <SorterDemo />
        </Reveal>
        <Reveal delay={80}>
          <RandomQuiz />
        </Reveal>
      </div>
    </div>
  );
}
