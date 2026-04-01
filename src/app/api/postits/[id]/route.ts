import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { editPostit, movePostit, removePostit } from "@/controllers/postit.controller";
import { findPostitsByUser } from "@/models/postit.model";

type Params = { params: Promise<{ id: string }> };

async function ownsPostit(userId: string, postitId: string) {
  const postits = await findPostitsByUser(userId);
  return postits.some((p) => p.id === postitId);
}

export async function PUT(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!(await ownsPostit(session.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const dto = await req.json();

  if (dto.pos_x !== undefined && dto.pos_y !== undefined && Object.keys(dto).length === 2) {
    const updated = await movePostit(id, dto.pos_x, dto.pos_y);
    return NextResponse.json(updated);
  }

  const updated = await editPostit(id, dto);
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!(await ownsPostit(session.user.id, id)))
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await removePostit(id);
  return new NextResponse(null, { status: 204 });
}
