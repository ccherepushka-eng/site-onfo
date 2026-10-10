// ============================================================
// Единая карта иконок и градиентов курса.
// Уроки хранят только строковые ключи — здесь они превращаются
// в компоненты lucide-react и фирменные градиенты.
// ============================================================

import {
  AppWindow,
  Binary,
  BookOpen,
  Brain,
  CircuitBoard,
  Code2,
  Cpu,
  Database,
  Footprints,
  Gem,
  GraduationCap,
  Info,
  Layers,
  Map,
  Network,
  ShieldCheck,
  Shuffle,
  Star,
  Trophy,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  info: Info,
  binary: Binary,
  cpu: Cpu,
  app: AppWindow,
  flow: Workflow,
  code: Code2,
  logic: CircuitBoard,
  network: Network,
  database: Database,
  shield: ShieldCheck,
  brain: Brain,
  // достижения
  footprints: Footprints,
  map: Map,
  graduation: GraduationCap,
  star: Star,
  trophy: Trophy,
  cards: Layers,
  shuffle: Shuffle,
  gem: Gem,
};

/** Градиентные пары для каждого «оттенка» урока */
export const HUES: Record<string, [string, string]> = {
  blue: ["#3b82f6", "#60a5fa"],
  cyan: ["#06b6d4", "#38bdf8"],
  violet: ["#8b5cf6", "#c084fc"],
  green: ["#10b981", "#34d399"],
  sky: ["#0ea5e9", "#7dd3fc"],
  orange: ["#f59e0b", "#fb923c"],
  yellow: ["#eab308", "#fde047"],
  pink: ["#ec4899", "#f9a8d4"],
  red: ["#ef4444", "#fb7185"],
};

/** Квадрат с градиентом и иконкой — визитная карточка урока */
export function LessonIcon({
  icon,
  hue,
  size = 48,
  iconSize = 24,
  rounded = 16,
}: {
  icon: string;
  hue: string;
  size?: number;
  iconSize?: number;
  rounded?: number;
}) {
  const Cmp = ICONS[icon] ?? BookOpen;
  const [a, b] = HUES[hue] ?? HUES.blue;
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        background: `linear-gradient(135deg, ${a}, ${b})`,
        boxShadow: `0 8px 26px -8px ${a}88`,
        display: "grid",
        placeItems: "center",
        flex: "none",
      }}
    >
      <Cmp size={iconSize} color="#fff" strokeWidth={2.1} />
    </div>
  );
}

export function AchievementIcon({ icon, size = 26 }: { icon: string; size?: number }) {
  const Cmp = ICONS[icon] ?? Star;
  return <Cmp size={size} style={{ color: "var(--acc-3)" }} strokeWidth={2} />;
}
