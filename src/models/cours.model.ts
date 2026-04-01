import { supabaseAdmin } from "@/lib/supabase";
import type { Cours, CreateCoursDTO, UpdateCoursDTO } from "@/types";

export async function findCoursBySubjectIds(subjectIds: string[]): Promise<Cours[]> {
  if (subjectIds.length === 0) return [];
  const { data, error } = await supabaseAdmin
    .from("cours")
    .select("*")
    .in("subject_id", subjectIds)
    .order("position");
  if (error) throw error;
  return data;
}

export async function findCoursById(id: string): Promise<Cours | null> {
  const { data, error } = await supabaseAdmin
    .from("cours")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function createCours(dto: CreateCoursDTO): Promise<Cours> {
  const { data, error } = await supabaseAdmin
    .from("cours")
    .insert(dto)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCours(id: string, dto: UpdateCoursDTO): Promise<Cours> {
  const { data, error } = await supabaseAdmin
    .from("cours")
    .update(dto)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCours(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from("cours").delete().eq("id", id);
  if (error) throw error;
}

export async function getLastCoursPosition(subjectId: string): Promise<number> {
  const { data } = await supabaseAdmin
    .from("cours")
    .select("position")
    .eq("subject_id", subjectId)
    .order("position", { ascending: false })
    .limit(1)
    .single();
  return data?.position ?? -1;
}
