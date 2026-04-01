import { supabaseAdmin } from "@/lib/supabase";
import { User } from "@/types";

export async function findUserById(id: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function findUserByDiscordId(discordId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("discord_id", discordId)
    .single();
  if (error) return null;
  return data;
}

export async function upsertUser(params: {
  discord_id: string;
  username: string;
  avatar_url: string;
}): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(params, { onConflict: "discord_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUserXPAndStreak(
  userId: string,
  xp: number,
  streak: number,
  lastSessionDate: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("users")
    .update({ xp, streak, last_session_date: lastSessionDate })
    .eq("id", userId);
  if (error) throw error;
}
