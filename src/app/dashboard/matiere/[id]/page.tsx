import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { findUserByDiscordId } from "@/models/user.model";
import { findSubjectById } from "@/models/subject.model";
import { findCoursBySubjectIds } from "@/models/cours.model";
import { MatiereView } from "@/views/dashboard/MatiereView";

export default async function MatierePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  const user = await findUserByDiscordId(session.user.id);
  if (!user) redirect("/login");

  const subject = await findSubjectById(id);
  if (!subject || subject.user_id !== user.id) redirect("/dashboard");

  const cours = await findCoursBySubjectIds([id]);

  return <MatiereView subject={subject} initialCours={cours} />;
}
