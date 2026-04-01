import coursData from "@/data/cours.json";
import { findSubjectsByUser, createSubject } from "@/models/subject.model";
import { findCoursBySubjectIds, createCours, getLastCoursPosition } from "@/models/cours.model";

type CoursEntry = { title: string; type?: string; date?: string; support?: string };
type SubjectEntry = { subject: string; icon?: string; color?: string; cours: CoursEntry[] };

export async function syncCours(userId: string): Promise<void> {
  const payload = coursData as SubjectEntry[];
  const subjects = await findSubjectsByUser(userId);
  const subjectMap = new Map(subjects.map((s) => [s.name.toLowerCase(), s]));

  for (const entry of payload) {
    let subject = subjectMap.get(entry.subject.toLowerCase());
    if (!subject) {
      subject = await createSubject({
        user_id: userId,
        name: entry.subject,
        icon: entry.icon ?? "📚",
        color: entry.color ?? "#c8894a",
        position: subjectMap.size,
      });
      subjectMap.set(entry.subject.toLowerCase(), subject);
    }

    const existing = await findCoursBySubjectIds([subject.id]);
    const existingTitles = new Set(existing.map((c) => c.title.toLowerCase()));

    let position = (await getLastCoursPosition(subject.id)) + 1;
    for (const c of entry.cours) {
      if (existingTitles.has(c.title.toLowerCase())) continue;
      await createCours({
        subject_id: subject.id,
        title: c.title,
        type: c.type ?? null,
        date: c.date ?? null,
        support: c.support ?? null,
        position: position++,
      });
    }
  }
}
