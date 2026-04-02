import { BadgeDefinition, LevelInfo } from "@/types";

// ── Niveaux ────────────────────────────────────────────────────────────────
// 6 titres × 5 niveaux = 30 niveaux au total
// Coût par niveau : 200 / 300 / 400 / 500 / 700 / 900 XP selon le titre
const LEVELS: { level: number; title: string; minXP: number }[] = [
  // Titre 1 — Étudiante (niv. 1–5, +200 XP chacun)
  { level:  1, title: "Étudiante",           minXP:     0 },
  { level:  2, title: "Étudiante",           minXP:   200 },
  { level:  3, title: "Étudiante",           minXP:   400 },
  { level:  4, title: "Étudiante",           minXP:   600 },
  { level:  5, title: "Étudiante",           minXP:   800 },
  // Titre 2 — Carabine Curieuse (niv. 6–10, +300 XP chacun)
  { level:  6, title: "Carabine Curieuse",   minXP:  1000 },
  { level:  7, title: "Carabine Curieuse",   minXP:  1300 },
  { level:  8, title: "Carabine Curieuse",   minXP:  1600 },
  { level:  9, title: "Carabine Curieuse",   minXP:  1900 },
  { level: 10, title: "Carabine Curieuse",   minXP:  2200 },
  // Titre 3 — Externe en Herbe (niv. 11–15, +400 XP chacun)
  { level: 11, title: "Externe en Herbe",    minXP:  2500 },
  { level: 12, title: "Externe en Herbe",    minXP:  2900 },
  { level: 13, title: "Externe en Herbe",    minXP:  3300 },
  { level: 14, title: "Externe en Herbe",    minXP:  3700 },
  { level: 15, title: "Externe en Herbe",    minXP:  4100 },
  // Titre 4 — Future Interne (niv. 16–20, +500 XP chacun)
  { level: 16, title: "Future Interne",       minXP:  4500 },
  { level: 17, title: "Future Interne",       minXP:  5000 },
  { level: 18, title: "Future Interne",       minXP:  5500 },
  { level: 19, title: "Future Interne",       minXP:  6000 },
  { level: 20, title: "Future Interne",       minXP:  6500 },
  // Titre 5 — Cheffe de Clinique (niv. 21–25, +700 XP chacun)
  { level: 21, title: "Cheffe de Clinique",  minXP:  7000 },
  { level: 22, title: "Cheffe de Clinique",  minXP:  7700 },
  { level: 23, title: "Cheffe de Clinique",  minXP:  8400 },
  { level: 24, title: "Cheffe de Clinique",  minXP:  9100 },
  { level: 25, title: "Cheffe de Clinique",  minXP:  9800 },
  // Titre 6 — Docteure (niv. 26–30, +900 XP chacun)
  { level: 26, title: "Docteure",            minXP: 10500 },
  { level: 27, title: "Docteure",            minXP: 11400 },
  { level: 28, title: "Docteure",            minXP: 12300 },
  { level: 29, title: "Docteure",            minXP: 13200 },
  { level: 30, title: "Docteure",            minXP: 14100 },
];

export function getLevelInfo(xp: number): LevelInfo {
  const idx = [...LEVELS].reverse().findIndex((l) => xp >= l.minXP);
  const current = LEVELS[LEVELS.length - 1 - idx] ?? LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(current) + 1];

  const progressPercent = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100;

  return {
    level: current.level,
    title: current.title,
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
    frame1: "/badges/frame1/C_Crown1.png",
    frame2: "/badges/frame2/CP_Crown1.png",
    secret: false,
  },
  {
    id: "streak_3",
    name: "En Feu",
    description: "Réviser 3 jours de suite",
    frame1: "/badges/frame1/C_Clock.png",
    frame2: "/badges/frame2/CP_Clock.png",
    secret: false,
  },
  {
    id: "streak_7",
    name: "Inébranlable",
    description: "Réviser 7 jours de suite",
    frame1: "/badges/frame1/C_Ray.png",
    frame2: "/badges/frame2/CP_Ray.png",
    secret: false,
  },
  {
    id: "streak_30",
    name: "Légende",
    description: "Réviser 30 jours de suite",
    frame1: "/badges/frame1/C_Trophy.png",
    frame2: "/badges/frame2/CP_Trophy.png",
    secret: false,
  },
  {
    id: "xp_2500",
    name: "Interne en Herbe",
    description: "Atteindre 2500 XP",
    frame1: "/badges/frame1/C_Star1.png",
    frame2: "/badges/frame2/CP_Star1.png",
    secret: false,
  },
  {
    id: "all_subjects",
    name: "Polyvalente",
    description: "Réviser toutes ses matières au moins une fois",
    frame1: "/badges/frame1/C_Book.png",
    frame2: "/badges/frame2/CP_Book.png",
    secret: false,
  },
  {
    id: "night_owl",
    name: "Chouette Nocturne",
    description: "Réviser après minuit",
    frame1: "/badges/frame1/C_Hourglass.png",
    frame2: "/badges/frame2/CP_Hourglass.png",
    secret: true,
  },
  {
    id: "marathon",
    name: "Marathonienne",
    description: "Faire une session de 2 heures",
    frame1: "/badges/frame1/C_Medal2.png",
    frame2: "/badges/frame2/CP_Medal2.png",
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

  check("CP_Clock", totalSessions >= 1);
  check("streak_3",      streak >= 3);
  check("streak_7",      streak >= 7);
  check("streak_30",     streak >= 30);
  check("xp_2500",       totalXP >= 2500);
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
