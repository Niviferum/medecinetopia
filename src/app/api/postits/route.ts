import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { getUserPostits, addPostit } from "@/controllers/postit.controller";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const postits = await getUserPostits(user.id);
  return NextResponse.json(postits);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { color } = await req.json().catch(() => ({}));
  const postit = await addPostit(user.id, color);
  return NextResponse.json(postit, { status: 201 });
}
