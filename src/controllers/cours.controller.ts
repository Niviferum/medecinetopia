import {
  findCoursBySubjectIds,
  findCoursById,
  createCours,
  updateCours,
  deleteCours,
  getLastCoursPosition,
} from "@/models/cours.model";
import { findSubjectsByUser, findSubjectById, createSubject } from "@/models/subject.model";
import { findUserById } from "@/models/user.model";
import { updateUserXPAndStreak } from "@/models/user.model";
import type { Cours, UpdateCoursDTO } from "@/types";

const XP_PER_COURS = 30;

export async function getCoursForUser(userId: string): Promise<Cours[]> {
  const subjects = await findSubjectsByUser(userId);
  return findCoursBySubjectIds(subjects.map((s) => s.id));
}

export async function addCours(
  subjectId: string,
  dto: { title: string; date?: string | null; type?: string | null; support?: string | null }
): Promise<Cours> {
  const position = (await getLastCoursPosition(subjectId)) + 1;
  return createCours({ subject_id: subjectId, position, ...dto });
}

export async function editCours(coursId: string, dto: UpdateCoursDTO): Promise<{ cours: Cours; xpEarned: number }> {
  const existing = await findCoursById(coursId);
  if (!existing) throw new Error("Cours not found");

  const cours = await updateCours(coursId, dto);

  if (dto.done === true && !existing.done) {
    const subject = await findSubjectById(existing.subject_id);
    if (subject) {
      const user = await findUserById(subject.user_id);
      if (user) {
        await updateUserXPAndStreak(
          user.id,
          user.xp + XP_PER_COURS,
          user.streak,
          user.last_session_date ?? new Date().toISOString().split("T")[0]
        );
        return { cours, xpEarned: XP_PER_COURS };
      }
    }
  }

  return { cours, xpEarned: 0 };
}

export async function removeCours(coursId: string): Promise<void> {
  return deleteCours(coursId);
}

export async function importCours(
  userId: string,
  payload: Array<{ subject: string; cours: Array<{ title: string; date?: string; type?: string; support?: string }> }>
): Promise<void> {
  const subjects = await findSubjectsByUser(userId);
  const subjectMap = new Map(subjects.map((s) => [s.name.toLowerCase(), s]));

  for (const entry of payload) {
    let subject = subjectMap.get(entry.subject.toLowerCase());
    if (!subject) {
      subject = await createSubject({
        user_id: userId,
        name: entry.subject,
        icon: "📚",
        color: "#c8894a",
        position: subjects.length + subjectMap.size,
      });
      subjectMap.set(entry.subject.toLowerCase(), subject);
    }

    let position = (await getLastCoursPosition(subject.id)) + 1;
    for (const c of entry.cours) {
      await createCours({
        subject_id: subject.id,
        title: c.title,
        date: c.date ?? null,
        type: c.type ?? null,
        support: c.support ?? null,
        position: position++,
      });
    }
  }
}
