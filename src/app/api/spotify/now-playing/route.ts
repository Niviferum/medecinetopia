import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { getNowPlaying } from "@/controllers/spotify.controller";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user?.spotify_access_token)
    return NextResponse.json({ error: "Spotify not connected" }, { status: 403 });

  const track = await getNowPlaying(user.spotify_access_token);
  return NextResponse.json(track ?? { isPlaying: false });
}
