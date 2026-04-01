import { supabaseAdmin } from "@/lib/supabase";
import { Subject, CreateSubjectDTO, UpdateSubjectDTO } from "@/types";

export async function findSubjectsByUser(userId: string): Promise<Subject[]> {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .select("*")
    .eq("user_id", userId)
    .order("position");
  if (error) throw error;
  return data;
}

export async function findSubjectById(id: string): Promise<Subject | null> {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function createSubject(dto: CreateSubjectDTO): Promise<Subject> {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .insert(dto)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSubject(id: string, dto: UpdateSubjectDTO): Promise<Subject> {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .update(dto)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSubject(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("subjects")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getLastSubjectPosition(userId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from("subjects")
    .select("position")
    .eq("user_id", userId)
    .order("position", { ascending: false })
    .limit(1)
    .single();
  if (error) return -1;
  return data.position;
}

export async function countDistinctSubjectsRevised(userId: string): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("sessions")
    .select("subject_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("subject_id", "is", null);
  if (error) throw error;
  return count ?? 0;
}
