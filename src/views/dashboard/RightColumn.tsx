import { GlassCard, CardTitle } from "@/views/ui/GlassCard";
import { SpotifyWidget } from "./SpotifyWidget";

export function RightColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <GlassCard variant="dark">
        <CardTitle>Spotify</CardTitle>
        <SpotifyWidget />
      </GlassCard>

      <GlassCard variant="dark">
        <CardTitle>Sons d'ambiance</CardTitle>
        <p style={{ color: "#9a7050", fontSize: 13, fontStyle: "italic" }}>
          — M7 à venir
        </p>
      </GlassCard>
    </div>
  );
}
