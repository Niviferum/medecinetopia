import { updateSpotifyTokens } from "@/models/user.model";
import type { User } from "@/types";

/**
 * Retourne un access token valide.
 * Si le token est expiré (ou expire dans moins de 60s), le rafraîchit
 * automatiquement et sauvegarde les nouveaux tokens en DB.
 */
export async function getValidSpotifyToken(user: User): Promise<string | null> {
  if (!user.spotify_access_token || !user.spotify_refresh_token) return null;

  const expiresAt = user.spotify_token_expires_at ?? 0;
  const needsRefresh = Date.now() >= expiresAt - 60_000;

  if (!needsRefresh) return user.spotify_access_token;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: user.spotify_refresh_token,
    }),
  });

  if (!res.ok) return null;

  const tokens = await res.json();

  await updateSpotifyTokens(user.id, {
    spotify_access_token: tokens.access_token,
    spotify_refresh_token: tokens.refresh_token ?? user.spotify_refresh_token,
    spotify_token_expires_at: Date.now() + tokens.expires_in * 1000,
  });

  return tokens.access_token;
}
