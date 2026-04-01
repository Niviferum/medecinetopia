import { BadgeDefinition, LevelInfo } from "@/types";

// ── Niveaux ────────────────────────────────────────────────────────────────
const LEVELS = [
  { level: 1, name: "Étudiante ☕",            minXP: 0    },
  { level: 2, name: "Carabine Curieuse 📖",    minXP: 200  },
  { level: 3, name: "Externe en Herbe 🌿",     minXP: 600 },
  { level: 4, name: "Future Interne ✨",        minXP: 1200 },
  { level: 5, name: "Cheffe de Clinique 🏥",   minXP: 2000 },
  { level: 6, name: "Docteure 🎓",             minXP: 3000 },
];

export function getLevelInfo(xp: number): LevelInfo {
  const current = [...LEVELS].reverse().find((l) => xp >= l.minXP) ?? LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(current) + 1];

  const progressPercent = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;

  return {
    level: current.level,
    name: current.name,
    currentXP: xp,
    nextLevelXP: next?.minXP ?? current.minXP,
    progressPercent,
  };
}

// ── Calcul XP par session ─────────────────────────────────────────────────
// Base fixe + bonus proportionnel à la durée
export function calculateSessionXP(durationMinutes: number): number {
  const base = 30;
  const bonus = Math.floor(durationMinutes / 10) * 10;
  return base + bonus;
}

// ── Badges ────────────────────────────────────────────────────────────────
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: "first_session",
    name: "Premier Pas",
    description: "Compléter sa première session de révision",
    icon: "🌱",
    secret: false,
  },
  {
    id: "streak_3",
    name: "En Feu",
    description: "Réviser 3 jours de suite",
    icon: "🔥",
    secret: false,
  },
  {
    id: "streak_7",
    name: "Inébranlable",
    description: "Réviser 7 jours de suite",
    icon: "⚡",
    secret: false,
  },
  {
    id: "streak_30",
    name: "Légende",
    description: "Réviser 30 jours de suite",
    icon: "👑",
    secret: false,
  },
  {
    id: "xp_500",
    name: "Montée en Puissance",
    description: "Atteindre 500 XP",
    icon: "⭐",
    secret: false,
  },
  {
    id: "xp_2000",
    name: "Interne en Herbe",
    description: "Atteindre 2000 XP",
    icon: "🌟",
    secret: false,
  },
  {
    id: "all_subjects",
    name: "Polyvalente",
    description: "Réviser toutes ses matières au moins une fois",
    icon: "🏆",
    secret: false,
  },
  {
    id: "night_owl",
    name: "???",
    description: "Réviser après minuit",
    icon: "🦉",
    secret: true,
  },
  {
    id: "early_bird",
    name: "???",
    description: "Réviser avant 7h du matin",
    icon: "🌅",
    secret: true,
  },
  {
    id: "marathon",
    name: "???",
    description: "Faire une session de plus de 2 heures",
    icon: "🏃",
    secret: true,
  },
];

// Vérifie quels badges doivent être débloqués selon l'état actuel
export function checkNewBadges(params: {
  totalXP: number;
  streak: number;
  totalSessions: number;
  subjectsRevised: number;
  sessionDuration: number;
  sessionHour: number;
  existingBadgeIds: string[];
}): string[] {
  const { totalXP, streak, totalSessions, subjectsRevised, sessionDuration, sessionHour, existingBadgeIds } = params;
  const newBadges: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !existingBadgeIds.includes(id)) newBadges.push(id);
  };

  check("first_session", totalSessions >= 1);
  check("streak_3",      streak >= 3);
  check("streak_7",      streak >= 7);
  check("streak_30",     streak >= 30);
  check("xp_500",        totalXP >= 500);
  check("xp_2000",       totalXP >= 2000);
  check("all_subjects",  subjectsRevised >= 8);
  check("night_owl",     sessionHour >= 0 && sessionHour < 5);
  check("early_bird",    sessionHour >= 5 && sessionHour < 7);
  check("marathon",      sessionDuration >= 120);

  return newBadges;
}

// ── Calcul streak ─────────────────────────────────────────────────────────
export function computeNewStreak(lastSessionDate: string | null, currentStreak: number): number {
  if (!lastSessionDate) return 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = new Date(lastSessionDate);
  last.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today.getTime() - last.getTime()) / 86_400_000);

  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}
