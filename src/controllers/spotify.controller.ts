import { SpotifyTrack } from "@/types";

const SPOTIFY_API = "https://api.spotify.com/v1";

async function spotifyFetch(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${SPOTIFY_API}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return res;
}

export async function getNowPlaying(accessToken: string): Promise<SpotifyTrack | null> {
  const res = await spotifyFetch("/me/player/currently-playing", accessToken);
  if (res.status === 204 || !res.ok) return null;

  const data = await res.json();
  if (!data?.item) return null;

  return {
    name: data.item.name,
    artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
    albumArt: data.item.album?.images?.[0]?.url ?? null,
    isPlaying: data.is_playing,
    progressMs: data.progress_ms ?? 0,
    durationMs: data.item.duration_ms,
  };
}

export async function playPause(accessToken: string, isPlaying: boolean): Promise<void> {
  const endpoint = isPlaying ? "/me/player/pause" : "/me/player/play";
  await spotifyFetch(endpoint, accessToken, { method: "PUT" });
}

export async function skipTrack(accessToken: string, direction: "next" | "previous"): Promise<void> {
  await spotifyFetch(`/me/player/${direction}`, accessToken, { method: "POST" });
}
