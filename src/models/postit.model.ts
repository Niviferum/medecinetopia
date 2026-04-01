import { supabaseAdmin } from "@/lib/supabase";
import { Postit, CreatePostitDTO, UpdatePostitDTO } from "@/types";

export async function findPostitsByUser(userId: string): Promise<Postit[]> {
  const { data, error } = await supabaseAdmin
    .from("postits")
    .select("*")
    .eq("user_id", userId)
    .order("created_at");
  if (error) throw error;
  return data;
}

export async function createPostit(dto: CreatePostitDTO): Promise<Postit> {
  const { data, error } = await supabaseAdmin
    .from("postits")
    .insert(dto)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePostit(id: string, dto: UpdatePostitDTO): Promise<Postit> {
  const { data, error } = await supabaseAdmin
    .from("postits")
    .update(dto)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePostit(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("postits")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
