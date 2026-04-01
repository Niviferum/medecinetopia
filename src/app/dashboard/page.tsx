import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { upsertUser } from "@/models/user.model";
import { seedDefaultSubjects } from "@/controllers/subject.controller";
import { syncCours } from "@/lib/sync";
import { DashboardLayout } from "@/views/layout/DashboardLayout";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await upsertUser({
    discord_id: session.user.id,
    username: session.user.name ?? "Jade",
    avatar_url: session.user.image ?? "",
  });

  await seedDefaultSubjects(user.id);
  await syncCours(user.id);

  return <DashboardLayout user={user} />;
}