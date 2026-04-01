import {
  findSubjectsByUser,
  createSubject,
  updateSubject,
  deleteSubject,
  getLastSubjectPosition,
} from "@/models/subject.model";
import { DEFAULT_SUBJECTS } from "@/lib/constants";
import { Subject, UpdateSubjectDTO } from "@/types";

export async function getUserSubjects(userId: string): Promise<Subject[]> {
  return findSubjectsByUser(userId);
}

export async function addSubject(
  userId: string,
  name: string,
  icon: string,
  color: string
): Promise<Subject> {
  const lastPosition = await getLastSubjectPosition(userId);
  return createSubject({ user_id: userId, name, icon, color, position: lastPosition + 1 });
}

export async function editSubject(
  subjectId: string,
  dto: UpdateSubjectDTO
): Promise<Subject> {
  return updateSubject(subjectId, dto);
}

export async function removeSubject(subjectId: string): Promise<void> {
  return deleteSubject(subjectId);
}

// Appelé à la première connexion de Jade pour pré-remplir ses matières
export async function seedDefaultSubjects(userId: string): Promise<void> {
  const existing = await findSubjectsByUser(userId);
  if (existing.length > 0) return;

  await Promise.all(
    DEFAULT_SUBJECTS.map((s, i) =>
      createSubject({ user_id: userId, ...s, position: i })
    )
  );
}
