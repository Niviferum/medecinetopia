"use client";

import { useState, useEffect } from "react";
import { BADGE_DEFINITIONS } from "@/lib/xp";
import type { BadgeDefinition } from "@/types";

const FRAME_INTERVAL_MS = 600;

interface BadgesGridProps {
  newlyUnlocked?: string[];
}

export function BadgesGrid({ newlyUnlocked = [] }: BadgesGridProps) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [frame, setFrame] = useState<1 | 2>(1);

  useEffect(() => {
    fetch("/api/badges")
      .then((r) => r.json())
      .then((ids: string[]) => setUnlockedIds(ids))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (newlyUnlocked.length === 0) return;
    setUnlockedIds((prev) => [...new Set([...prev, ...newlyUnlocked])]);
  }, [newlyUnlocked]);

  // Intervalle partagé pour toute la grille
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f === 1 ? 2 : 1)), FRAME_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const visibleBadges = BADGE_DEFINITIONS.filter(
    (b) => !b.secret || unlockedIds.includes(b.id)
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 4 }}>
      {visibleBadges.map((badge) => (
        <BadgeTile
          key={badge.id}
          badge={badge}
          unlocked={unlockedIds.includes(badge.id)}
          fresh={newlyUnlocked.includes(badge.id)}
          frame={frame}
          tooltipOpen={tooltip === badge.id}
          onToggleTooltip={(id) => setTooltip((prev) => (prev === id ? null : id))}
        />
      ))}
    </div>
  );
}

function BadgeTile({
  badge,
  unlocked,
  fresh,
  frame,
  tooltipOpen,
  onToggleTooltip,
}: {
  badge: BadgeDefinition;
  unlocked: boolean;
  fresh: boolean;
  frame: 1 | 2;
  tooltipOpen: boolean;
  onToggleTooltip: (id: string) => void;
}) {
  const src = unlocked
    ? (frame === 1 ? badge.frame1 : badge.frame2)
    : badge.frame1; // pas d'animation si verrouillé

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => onToggleTooltip(badge.id)}
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 10,
          border: unlocked ? "1.5px solid #e8c49a" : "1.5px solid #e8d4b4",
          background: unlocked ? "#fdf0e0" : "#f5f0ea",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          filter: unlocked ? "none" : "grayscale(1) opacity(0.35)",
          boxShadow: fresh ? "0 0 0 2px #e07840, 0 2px 8px rgba(224,120,64,0.4)" : "none",
          transition: "box-shadow 0.3s, filter 0.3s",
        }}
      >
        <img
          src={src}
          alt={unlocked ? badge.name : "???"}
          style={{ width: "75%", height: "75%", objectFit: "contain" }}
          onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
        />
      </button>

      {tooltipOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#3a1a0a",
            color: "#fdf8f0",
            borderRadius: 8,
            padding: "6px 10px",
            fontSize: 11,
            whiteSpace: "nowrap",
            zIndex: 100,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <p style={{ fontWeight: 700, marginBottom: 2 }}>
            {unlocked ? badge.name : "???"}
          </p>
          <p style={{ color: "#c8a080" }}>{badge.description}</p>
        </div>
      )}
    </div>
  );
}
