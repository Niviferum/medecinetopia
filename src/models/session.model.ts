import { supabaseAdmin } from "@/lib/supabase";
import { Session, CreateSessionDTO } from "@/types";

export async function createSession(dto: CreateSessionDTO): Promise<Session> {
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .insert(dto)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function findSessionsByUser(userId: string, limit = 10): Promise<Session[]> {
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getWeeklyStats(userId: string): Promise<{
  sessionCount: number;
  totalMinutes: number;
  totalXP: number;
  subjectCount: number;
}> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("duration_minutes, xp_earned, subject_id")
    .eq("user_id", userId)
    .gte("created_at", weekAgo.toISOString());

  if (error) throw error;

  const subjectSet = new Set(data.map((s) => s.subject_id).filter(Boolean));

  return {
    sessionCount: data.length,
    totalMinutes: data.reduce((acc, s) => acc + s.duration_minutes, 0),
    totalXP: data.reduce((acc, s) => acc + s.xp_earned, 0),
    subjectCount: subjectSet.size,
  };
}
