import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { getUserSubjects, addSubject } from "@/controllers/subject.controller";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const subjects = await getUserSubjects(user.id);
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { name, icon, color } = await req.json();
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const subject = await addSubject(user.id, name, icon ?? "📚", color ?? "#f9a875");
  return NextResponse.json(subject, { status: 201 });
}
