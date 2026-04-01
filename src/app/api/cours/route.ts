import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { getCoursForUser, addCours } from "@/controllers/cours.controller";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const cours = await getCoursForUser(user.id);
  return NextResponse.json(cours);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId, title, date, type, support } = await req.json();
  if (!subjectId || !title?.trim())
    return NextResponse.json({ error: "subjectId and title are required" }, { status: 400 });

  const cours = await addCours(subjectId, { title: title.trim(), date, type, support });
  return NextResponse.json(cours, { status: 201 });
}
