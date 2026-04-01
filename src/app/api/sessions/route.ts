import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { completeSession } from "@/controllers/session.controller";
import { getWeeklyStats } from "@/models/session.model";
import { findUserByDiscordId } from "@/models/user.model";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const stats = await getWeeklyStats(user.id);
  return NextResponse.json({ sessionCount: stats.sessionCount });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { subjectId, durationMinutes } = await req.json();
  if (!durationMinutes || durationMinutes < 1)
    return NextResponse.json({ error: "durationMinutes is required" }, { status: 400 });

  const result = await completeSession({
    userId: user.id,
    subjectId: subjectId ?? null,
    durationMinutes,
  });

  return NextResponse.json(result, { status: 201 });
}
