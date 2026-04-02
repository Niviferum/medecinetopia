import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { editSubject, removeSubject } from "@/controllers/subject.controller";
import { findSubjectById } from "@/models/subject.model";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;

  const subject = await findSubjectById(id);
  if (!subject || subject.user_id !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const dto = await req.json();
  const updated = await editSubject(id, dto);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id } = await params;

  const subject = await findSubjectById(id);
  if (!subject || subject.user_id !== user.id)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removeSubject(id);
  return new NextResponse(null, { status: 204 });
}
