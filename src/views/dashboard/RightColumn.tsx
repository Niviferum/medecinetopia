import { GlassCard, CardTitle } from "@/views/ui/GlassCard";

export function RightColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <GlassCard variant="dark">
        <CardTitle>Spotify</CardTitle>
        <p style={{ color: "rgba(245,239,228,0.4)", fontSize: 13, fontStyle: "italic" }}>
          — M6 à venir
        </p>
      </GlassCard>

      <GlassCard variant="dark">
        <CardTitle>Sons d'ambiance</CardTitle>
        <p style={{ color: "rgba(245,239,228,0.4)", fontSize: 13, fontStyle: "italic" }}>
          — M7 à venir
        </p>
      </GlassCard>
    </div>
  );
}
