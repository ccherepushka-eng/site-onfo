// ============================================================
// Общие типы учебного контента платформы
// ============================================================

/** Вопрос теста с автоматической проверкой */
export interface Question {
  /** Текст вопроса (поддерживает `код`) */
  q: string;
  /** Варианты ответов */
  options: string[];
  /** Индекс правильного варианта */
  answer: number;
  /** Объяснение правильного ответа */
  explain: string;
}

/** Термин для интерактивных карточек урока */
export interface TermCard {
  term: string;
  def: string;
}

/** Блоки, из которых состоит текст урока */
export type LessonBlock =
  | { type: "intro"; text: string }
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "definition"; term: string; text: string }
  | { type: "example"; title: string; text: string }
  | { type: "tip"; text: string }
  | { type: "list"; title?: string; ordered?: boolean; items: string[] }
  | { type: "table"; title?: string; headers: string[]; rows: string[][] }
  | { type: "scheme"; title?: string; steps: string[] }
  | { type: "code"; title?: string; code: string; output?: string }
  /** Встроенные интерактивные виджеты прямо в теле урока */
  | { type: "widgets"; kinds: WidgetKind[] }
  | { type: "remember"; items: string[] }
  | { type: "tasks"; items: string[] };

export type WidgetKind = "binary" | "logic" | "sorter" | "random";

/** Учебный урок (тема курса) */
export interface Lesson {
  /** URL-адрес: /urok/<slug> */
  slug: string;
  /** Порядковый номер в курсе (1..12) */
  number: number;
  title: string;
  /** Короткое название для карточек и навигации */
  short: string;
  /** Описание для карточки и метаданных */
  description: string;
  /** Примерное время изучения, минут */
  minutes: number;
  /** Сложность: 1 — база, 2 — средне, 3 — продвинуто */
  level: 1 | 2 | 3;
  /** Ключ иконки в ICONS — см. components/Icon.tsx */
  icon: string;
  /** Ключ градиента для карточки — см. components/Icon.tsx */
  hue: string;
  blocks: LessonBlock[];
  /** Карточки терминов урока */
  terms: TermCard[];
  /** Тест по уроку */
  quiz: Question[];
}

/** Интересный факт */
export interface Fact {
  title: string;
  text: string;
}

/** Термин глоссария */
export interface GlossaryItem {
  term: string;
  def: string;
  cat: string; // категория для фильтра
}

/** Описание достижения */
export interface AchievementDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
}
