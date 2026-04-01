import { DefaultSession } from "next-auth";

// ── Augmentation NextAuth ──────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      spotifyAccessToken?: string;
    } & DefaultSession["user"];
  }
}

// ── Entités base de données ────────────────────────────────────────────────
export interface User {
  id: string;
  discord_id: string;
  username: string | null;
  avatar_url: string | null;
  xp: number;
  streak: number;
  last_session_date: string | null;
  created_at: string;
}

export interface Subject {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  position: number;
  created_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  subject_id: string | null;
  duration_minutes: number;
  xp_earned: number;
  created_at: string;
}

export interface Postit {
  id: string;
  user_id: string;
  content: string;
  color: string;
  pos_x: number;
  pos_y: number;
  rotation: number;
  created_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

// ── DTOs (Data Transfer Objects) ──────────────────────────────────────────
export interface CreateSubjectDTO {
  user_id: string;
  name: string;
  icon: string;
  color: string;
  position: number;
}

export interface UpdateSubjectDTO {
  name?: string;
  icon?: string;
  color?: string;
  position?: number;
}

export interface CreateSessionDTO {
  user_id: string;
  subject_id: string | null;
  duration_minutes: number;
  xp_earned: number;
}

export interface CreatePostitDTO {
  user_id: string;
  content: string;
  color: string;
  pos_x: number;
  pos_y: number;
  rotation: number;
}

export interface UpdatePostitDTO {
  content?: string;
  color?: string;
  pos_x?: number;
  pos_y?: number;
  rotation?: number;
}

// ── Gamification ──────────────────────────────────────────────────────────
export interface LevelInfo {
  level: number;
  name: string;
  currentXP: number;
  nextLevelXP: number;
  progressPercent: number;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  secret: boolean;
}

// ── Cours ─────────────────────────────────────────────────────────────────
export interface Cours {
  id: string;
  subject_id: string;
  title: string;
  date: string | null;
  type: string | null;
  support: string | null;
  position: number;
  done: boolean;
  created_at: string;
}

export interface CreateCoursDTO {
  subject_id: string;
  title: string;
  date?: string | null;
  type?: string | null;
  support?: string | null;
  position: number;
}

export interface UpdateCoursDTO {
  title?: string;
  date?: string | null;
  type?: string | null;
  support?: string | null;
  position?: number;
  done?: boolean;
}

// ── Spotify ───────────────────────────────────────────────────────────────
export interface SpotifyTrack {
  name: string;
  artist: string;
  albumArt: string | null;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}
