"use client";

import { useState, useEffect, useRef } from "react";
import type { SpotifyTrack } from "@/types";

export function SpotifyWidget() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchNowPlaying() {
    const res = await fetch("/api/spotify/now-playing");
    if (res.status === 403) { setConnected(false); return; }
    if (!res.ok) return;
    setConnected(true);
    const data = await res.json();
    setTrack(data.name ? data : null);
  }

  useEffect(() => {
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  async function control(action: string) {
    await fetch("/api/spotify/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, isPlaying: track?.isPlaying }),
    });
    setTimeout(fetchNowPlaying, 400);
  }

  if (connected === null) {
    return <p style={{ color: "#9a7050", fontSize: 11, fontStyle: "italic" }}>Chargement…</p>;
  }

  if (connected === false) {
    return (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <p style={{ color: "#9a7050", fontSize: 11, marginBottom: 10 }}>
          Spotify non connecté
        </p>
        <a
          href="/api/spotify/connect"
          style={{
            display: "inline-block",
            background: "#1db954",
            borderRadius: 20,
            padding: "7px 14px",
            color: "#fff", fontSize: 11, fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(29,185,84,0.3)",
          }}
        >
          Connecter Spotify
        </a>
      </div>
    );
  }

  if (!track || !track.isPlaying && !track.name) {
    return (
      <p style={{ color: "#9a7050", fontSize: 11, fontStyle: "italic", textAlign: "center" }}>
        Rien en lecture
      </p>
    );
  }

  const pct = track.durationMs > 0 ? (track.progressMs / track.durationMs) * 100 : 0;

  return (
    <div>
      {/* Album art */}
      {track.albumArt && (
        <img
          src={track.albumArt}
          alt="album"
          style={{ width: "100%", borderRadius: 8, display: "block", marginBottom: 10 }}
        />
      )}

      {/* Track info */}
      <p style={{
        color: "#2d1a0a", fontSize: 12, fontWeight: 600,
        lineHeight: 1.3, marginBottom: 2,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>
        {track.name}
      </p>
      <p style={{
        color: "#9a7050", fontSize: 11,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        marginBottom: 10,
      }}>
        {track.artist}
      </p>

      {/* Progress bar */}
      <div style={{ height: 3, borderRadius: 99, background: "rgba(160,100,40,0.12)", overflow: "hidden", marginBottom: 12 }}>
        <div style={{
          height: "100%", width: `${pct}%`, borderRadius: 99,
          background: "#1db954",
          transition: "width 1s linear",
        }} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <CtrlBtn onClick={() => control("previous")}>⏮</CtrlBtn>
        <CtrlBtn onClick={() => control("toggle")} size={32}>
          {track.isPlaying ? "⏸" : "▶"}
        </CtrlBtn>
        <CtrlBtn onClick={() => control("next")}>⏭</CtrlBtn>
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, children, size = 24 }: { onClick: () => void; children: React.ReactNode; size?: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: size, lineHeight: 1,
        color: hovered ? "#2d1a0a" : "#9a7050",
        transition: "color 0.15s",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}
