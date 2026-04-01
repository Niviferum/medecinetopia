import { supabaseAdmin } from "@/lib/supabase";
import { Badge } from "@/types";

export async function findBadgesByUser(userId: string): Promise<Badge[]> {
  const { data, error } = await supabaseAdmin
    .from("badges")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at");
  if (error) throw error;
  return data;
}

export async function unlockBadge(userId: string, badgeId: string): Promise<Badge | null> {
  const { data, error } = await supabaseAdmin
    .from("badges")
    .insert({ user_id: userId, badge_id: badgeId })
    .select()
    .single();
  // Ignore l'erreur de duplicate (badge déjà débloqué)
  if (error?.code === "23505") return null;
  if (error) throw error;
  return data;
}

export async function hasBadge(userId: string, badgeId: string): Promise<boolean> {
  const { count, error } = await supabaseAdmin
    .from("badges")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("badge_id", badgeId);
  if (error) return false;
  return (count ?? 0) > 0;
}
