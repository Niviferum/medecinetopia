import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId } from "@/models/user.model";
import { playPause, skipTrack } from "@/controllers/spotify.controller";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findUserByDiscordId(session.user.id);
  if (!user?.spotify_access_token)
    return NextResponse.json({ error: "Spotify not connected" }, { status: 403 });

  const token = user.spotify_access_token;
  const { action, isPlaying } = await req.json();

  if (action === "toggle") {
    await playPause(token, isPlaying);
  } else if (action === "next") {
    await skipTrack(token, "next");
  } else if (action === "previous") {
    await skipTrack(token, "previous");
  } else {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  return new NextResponse(null, { status: 204 });
}
