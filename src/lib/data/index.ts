import type { Lesson, Question } from "../types";
import { lessonsA } from "./lessons-a";
import { lessonsB } from "./lessons-b";
import { lessonsC } from "./lessons-c";

/** Полный список уроков курса в порядке изучения */
export const lessons: Lesson[] = [...lessonsA, ...lessonsB, ...lessonsC].sort(
  (a, b) => a.number - b.number
);

/** Найти урок по slug */
export function getLesson(slug: string): Lesson | undefined {
  return lessons.find((l) => l.slug === slug);
}

/** Соседние уроки для навигации «назад / вперёд» */
export function getNeighbors(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = lessons.findIndex((l) => l.slug === slug);
  return { prev: lessons[i - 1], next: lessons[i + 1] };
}

/** Все вопросы курса (для экзамена и случайной самопроверки) */
export function allQuestions(): (Question & { lesson: string })[] {
  return lessons.flatMap((l) => l.quiz.map((q) => ({ ...q, lesson: l.short })));
}

/** Криптографически неважный, но качественный Фишер-Йетс shuffle */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Случайные N вопросов со всего курса */
export function sampleQuestions(n: number): (Question & { lesson: string })[] {
  return shuffle(allQuestions()).slice(0, n);
}

export const TOTAL_LESSONS = lessons.length;
/** Суммарное число вопросов в тестах курса */
export const TOTAL_QUESTIONS = lessons.reduce((s, l) => s + l.quiz.length, 0);
