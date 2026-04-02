import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SPOTIFY_SCOPES } from "@/lib/constants";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL!));

  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/spotify/callback`,
    scope: SPOTIFY_SCOPES,
  });

  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
