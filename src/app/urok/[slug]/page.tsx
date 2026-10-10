// ============================================================
// Страница урока: теория, схемы, код, тренажёры, карточки,
// тест и навигация «предыдущий / следующий».
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Home, ListChecks, SignalHigh } from "lucide-react";
import { getLesson, getNeighbors, lessons, TOTAL_LESSONS } from "@/lib/data";
import { LessonIcon } from "@/components/Icon";
import { LessonRenderer } from "@/components/LessonRenderer";
import { Flashcards } from "@/components/Flashcards";
import { Quiz } from "@/components/Quiz";
import { MarkDoneButton, VisitTracker } from "@/components/LessonActions";
import { Reveal } from "@/components/Reveal";

const LEVELS = ["", "Базовый уровень", "Средний уровень", "Продвинутый уровень"];

/** Статическая генерация всех 12 страниц уроков */
export function generateStaticParams() {
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return { title: "Урок не найден" };
  return {
    title: `Урок ${lesson.number}. ${lesson.title}`,
    description: lesson.description,
  };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const { prev, next } = getNeighbors(slug);

  return (
    <div className="wrap-narrow py-10 md:py-14">
      <VisitTracker slug={slug} />

      {/* Хлебные крошки */}
      <nav className="flex items-center gap-2 text-sm muted mb-6 flex-wrap" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-[var(--ink)] transition-colors flex items-center gap-1">
          <Home size={14} /> Главная
        </Link>
        <span aria-hidden>/</span>
        <Link href="/uroki" className="hover:text-[var(--ink)] transition-colors">
          Уроки
        </Link>
        <span aria-hidden>/</span>
        <span className="soft truncate max-w-[260px]">{lesson.title}</span>
      </nav>

      {/* Шапка урока */}
      <Reveal>
        <header className="card p-6 md:p-8 mb-10 relative overflow-hidden">
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, var(--glow), transparent 70%)", filter: "blur(30px)" }}
            aria-hidden
          />
          <div className="flex items-start gap-4 md:gap-5 relative">
            <LessonIcon icon={lesson.icon} hue={lesson.hue} size={64} iconSize={30} rounded={20} />
            <div className="flex-1 min-w-0">
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "var(--acc-3)" }}>
                Урок {lesson.number} из {TOTAL_LESSONS}
              </div>
              <h1 className="h2 leading-tight!">{lesson.title}</h1>
              <p className="soft mt-2 leading-relaxed">{lesson.description}</p>
              <div className="flex gap-2 flex-wrap mt-4">
                <span className="chip">
                  <Clock size={13} /> {lesson.minutes} минут
                </span>
                <span className="chip">
                  <SignalHigh size={13} /> {LEVELS[lesson.level]}
                </span>
                <span className="chip">
                  <ListChecks size={13} /> Тест: {lesson.quiz.length} вопросов
                </span>
              </div>
              <div className="flex gap-3 flex-wrap mt-5">
                <a href="#test" className="btn btn-prime btn-sm">
                  Пройти тест
                </a>
                <MarkDoneButton slug={slug} />
              </div>
            </div>
          </div>
        </header>
      </Reveal>

      {/* Содержимое */}
      <LessonRenderer blocks={lesson.blocks} />

      {/* Карточки терминов */}
      <section className="mt-14" aria-labelledby="terms">
        <Reveal>
          <h2 id="terms" className="h2 text-xl! md:text-2xl! mb-5 flex items-center gap-3">
            <span aria-hidden style={{ width: 10, height: 26, borderRadius: 4, background: "linear-gradient(180deg,var(--acc),var(--acc-2))" }} />
            Карточки для запоминания
          </h2>
        </Reveal>
        <Flashcards terms={lesson.terms} scope={slug} />
      </section>

      {/* Тест */}
      <section className="mt-14 scroll-mt-24" id="test" aria-labelledby="test-h">
        <Reveal>
          <h2 id="test-h" className="h2 text-xl! md:text-2xl! mb-5 flex items-center gap-3">
            <span aria-hidden style={{ width: 10, height: 26, borderRadius: 4, background: "linear-gradient(180deg,var(--acc),var(--acc-2))" }} />
            Тест по теме
          </h2>
        </Reveal>
        <Quiz questions={lesson.quiz} quizId={slug} />
      </section>

      {/* Навигация: предыдущий / следующий */}
      <nav className="grid gap-4 sm:grid-cols-2 mt-14" aria-label="Навигация между уроками">
        {prev ? (
          <Link href={`/urok/${prev.slug}`} className="card card-hover p-5 group">
            <div className="text-xs muted mb-1.5 flex items-center gap-1">
              <ChevronLeft size={14} /> Предыдущий урок
            </div>
            <div className="font-bold leading-snug group-hover:text-[var(--acc-3)] transition-colors">
              {prev.number}. {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/urok/${next.slug}`} className="card card-hover p-5 group text-right sm:col-start-2">
            <div className="text-xs muted mb-1.5 flex items-center gap-1 justify-end">
              Следующий урок <ChevronRight size={14} />
            </div>
            <div className="font-bold leading-snug group-hover:text-[var(--acc-3)] transition-colors">
              {next.number}. {next.title}
            </div>
          </Link>
        ) : (
          <Link href="/ekzamen" className="card card-hover p-5 group text-right sm:col-start-2" style={{ borderColor: "rgba(251,191,36,.4)" }}>
            <div className="text-xs mb-1.5 flex items-center gap-1 justify-end" style={{ color: "var(--warn)" }}>
              Курс пройден? <ChevronRight size={14} />
            </div>
            <div className="font-bold leading-snug">Перейти к мини-экзамену</div>
          </Link>
        )}
      </nav>
    </div>
  );
}
