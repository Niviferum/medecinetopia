import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserByDiscordId, updateSpotifyTokens } from "@/models/user.model";

export async function GET(req: NextRequest) {
  const base = process.env.NEXTAUTH_URL!;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect(new URL("/login", base));

  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/dashboard?error=spotify", base));

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${base}/api/spotify/callback`,
    }),
  });

  if (!tokenRes.ok) return NextResponse.redirect(new URL("/dashboard?error=spotify", base));

  const tokens = await tokenRes.json();

  const user = await findUserByDiscordId(session.user.id);
  if (!user) return NextResponse.redirect(new URL("/dashboard?error=spotify", base));

  await updateSpotifyTokens(user.id, {
    spotify_access_token: tokens.access_token,
    spotify_refresh_token: tokens.refresh_token,
    spotify_token_expires_at: Date.now() + tokens.expires_in * 1000,
  });

  return NextResponse.redirect(new URL("/dashboard", base));
}
