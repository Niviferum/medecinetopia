"use client";

import { signOut } from "next-auth/react";
import type { CSSProperties } from "react";

export type DashboardTab = "revisions" | "postits";

interface TopbarProps {
  username: string;
  avatarUrl: string | null;
  streak: number;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const TABS: { id: DashboardTab; label: string }[] = [
  { id: "revisions", label: "Révisions" },
  { id: "postits", label: "Post-its" },
];

export function Topbar({ username, avatarUrl, streak, activeTab, onTabChange }: TopbarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background: "rgba(40, 22, 6, 0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255, 220, 160, 0.12)",
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-lora), serif",
          fontSize: 16,
          fontWeight: 600,
          color: "#e8c87a",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Médecinetopia 🌿
      </span>

      <nav style={{ display: "flex", gap: 4 }}>
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const style: CSSProperties = {
            padding: "6px 16px",
            borderRadius: 20,
            border: "none",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            background: isActive ? "rgba(232, 200, 122, 0.2)" : "transparent",
            color: isActive ? "#e8c87a" : "rgba(245, 239, 228, 0.5)",
            outline: isActive ? "1px solid rgba(232, 200, 122, 0.35)" : "none",
          };
          return (
            <button key={tab.id} style={style} onClick={() => onTabChange(tab.id)}>
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        {streak > 0 && (
          <span
            style={{
              fontSize: 13,
              color: "#e8c87a",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            🔥 {streak}j
          </span>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={username}
              width={32}
              height={32}
              style={{ borderRadius: "50%", border: "2px solid rgba(232, 200, 122, 0.4)" }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(232, 200, 122, 0.2)",
                border: "2px solid rgba(232, 200, 122, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🌿
            </div>
          )}
          <span style={{ fontSize: 13, color: "rgba(245, 239, 228, 0.8)" }}>{username}</span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            padding: "5px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255, 200, 120, 0.2)",
            background: "transparent",
            color: "rgba(245, 239, 228, 0.5)",
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Déco
        </button>
      </div>
    </header>
  );
}
