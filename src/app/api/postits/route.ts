import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPostits, addPostit } from "@/controllers/postit.controller";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const postits = await getUserPostits(session.user.id);
  return NextResponse.json(postits);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { color } = await req.json().catch(() => ({}));
  const postit = await addPostit(session.user.id, color);
  return NextResponse.json(postit, { status: 201 });
}
