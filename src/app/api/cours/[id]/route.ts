import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { findCoursById } from "@/models/cours.model";
import { findSubjectById } from "@/models/subject.model";
import { editCours, removeCours } from "@/controllers/cours.controller";

type Params = { params: Promise<{ id: string }> };

async function resolveOwnership(discordId: string, coursId: string) {
  const user = await findUserByDiscordId(discordId);
  if (!user) return null;
  const cours = await findCoursById(coursId);
  if (!cours) return null;
  const subject = await findSubjectById(cours.subject_id);
  if (!subject || subject.user_id !== user.id) return null;
  return { user, cours };
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await resolveOwnership(session.user.id, id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const dto = await req.json();
  const result = await editCours(id, dto);
  return NextResponse.json(result);
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await resolveOwnership(session.user.id, id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeCours(id);
  return new NextResponse(null, { status: 204 });
}
