"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard, CardTitle } from "@/views/ui/GlassCard";
import { getLevelInfo, calculateSessionXP, BADGE_DEFINITIONS } from "@/lib/xp";
import { BadgesGrid } from "./BadgesGrid";
import type { User } from "@/types";

const DURATIONS = [30, 60, 90, 120];
const TIMER_END_KEY = "medecinetopia_timer_end";
const TIMER_DUR_KEY = "medecinetopia_timer_dur";

interface LeftColumnProps {
  user: User;
}

export function LeftColumn({ user: initialUser }: LeftColumnProps) {
  const [xp, setXp] = useState(initialUser.xp);
  const [streak, setStreak] = useState(initialUser.streak);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [posting, setPosting] = useState(false);
  const [lastXpEarned, setLastXpEarned] = useState<number | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const [toastBadge, setToastBadge] = useState<string | null>(null);
  const sessionDurRef = useRef(selectedMinutes);

  const level = getLevelInfo(xp);
  const isRunning = endTime !== null;

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(level.progressPercent), 100);
    return () => clearTimeout(t);
  }, [level.progressPercent]);

  useEffect(() => {
    const handler = (e: Event) => {
      const xpEarned = (e as CustomEvent<{ xpEarned: number }>).detail.xpEarned;
      if (xpEarned > 0) setXp((prev) => prev + xpEarned);
    };
    window.addEventListener("medecinetopia:xp", handler);
    return () => window.removeEventListener("medecinetopia:xp", handler);
  }, []);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((d) => setSessionCount(d.sessionCount))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const savedEnd = localStorage.getItem(TIMER_END_KEY);
    const savedDur = localStorage.getItem(TIMER_DUR_KEY);
    if (savedEnd && savedDur) {
      const end = parseInt(savedEnd);
      if (end > Date.now()) {
        sessionDurRef.current = parseInt(savedDur);
        setEndTime(end);
      } else {
        localStorage.removeItem(TIMER_END_KEY);
        localStorage.removeItem(TIMER_DUR_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (endTime === null) return;
    const tick = () => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setRemainingMs(0);
        setEndTime(null);
        localStorage.removeItem(TIMER_END_KEY);
        localStorage.removeItem(TIMER_DUR_KEY);
        postSession(sessionDurRef.current);
      } else {
        setRemainingMs(remaining);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  async function postSession(minutes: number) {
    setPosting(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes: minutes }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setXp((prev) => prev + data.xpEarned);
      setStreak(data.newStreak);
      setSessionCount((prev) => (prev ?? 0) + 1);
      setLastXpEarned(data.xpEarned);
      setTimeout(() => setLastXpEarned(null), 4000);
      if (data.newBadges?.length > 0) {
        setNewBadges((prev) => [...prev, ...data.newBadges]);
        // Toast : affiche les badges un par un
        data.newBadges.forEach((id: string, i: number) => {
          setTimeout(() => {
            setToastBadge(id);
            setTimeout(() => setToastBadge(null), 3500);
          }, i * 4000);
        });
      }
    } finally {
      setPosting(false);
    }
  }

  function startTimer() {
    const end = Date.now() + selectedMinutes * 60 * 1000;
    sessionDurRef.current = selectedMinutes;
    localStorage.setItem(TIMER_END_KEY, end.toString());
    localStorage.setItem(TIMER_DUR_KEY, selectedMinutes.toString());
    setLastXpEarned(null);
    setEndTime(end);
  }

  function cancelTimer() {
    setEndTime(null);
    localStorage.removeItem(TIMER_END_KEY);
    localStorage.removeItem(TIMER_DUR_KEY);
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const elapsed = isRunning
    ? 1 - remainingMs / (sessionDurRef.current * 60 * 1000)
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Toast badge débloqué */}
      {toastBadge && (() => {
        const def = BADGE_DEFINITIONS.find((b) => b.id === toastBadge);
        if (!def) return null;
        return (
          <div style={{
            position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
            zIndex: 200, background: "#3a1a0a", color: "#fdf8f0",
            borderRadius: 12, padding: "10px 18px",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
            animation: "fadeInDown 0.3s ease",
          }}>
            <img src={def.frame1} alt={def.name} style={{ width: 32, height: 32, objectFit: "contain", zIndex: 10}} />
            <div>
              <p style={{ fontSize: 11, color: "#c8a080", marginBottom: 2 }}>Badge débloqué !</p>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{def.name}</p>
            </div>  
          </div>
        );
      })()}
      {/* XP Card */}
      <GlassCard variant="dark">
        <CardTitle>Niveau</CardTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{
            background: "#e8e4f4",
            border: "1px solid #c4b8e8",
            color: "#6050a0",
            borderRadius: 99,
            padding: "2px 10px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}>
            Niv. {level.level}
          </span>
          <p style={{ color: "#6b3a10", fontSize: 15, fontWeight: 700, fontFamily: "var(--font-lora), serif", lineHeight: 1.2 }}>
            {level.title}
          </p>
        </div>
        <p style={{ color: "#9a7050", fontSize: 12, marginTop: 4 }}>
          {xp} XP{streak > 0 && <span style={{ marginLeft: 8 }}>🔥 {streak}j</span>}
        </p>
        <div style={{ marginTop: 10, height: 6, borderRadius: 99, background: "rgba(160,100,40,0.12)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              borderRadius: 99,
              background: "linear-gradient(90deg, #c8894a, #e07840)",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <p style={{ color: "#b09070", fontSize: 11, marginTop: 6 }}>
          {level.level === 30
            ? "Niveau max ✨"
            : `${level.nextLevelXP - xp} XP → niveau ${level.level + 1}`}
        </p>
      </GlassCard>

      {/* Session Card */}
      <GlassCard variant="dark">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <CardTitle style={{ marginBottom: 0 }}>Session</CardTitle>
          {sessionCount !== null && (
            <span style={{ color: "#9a7050", fontSize: 11 }}>
              {sessionCount} cette semaine
            </span>
          )}
        </div>

        {lastXpEarned !== null && (
          <p style={{ color: "#4a8a3a", fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: "center" }}>
            +{lastXpEarned} XP ✓
          </p>
        )}

        {isRunning ? (
          <>
            <p style={{ color: "#8b5020", fontSize: 36, fontWeight: 700, fontFamily: "var(--font-lora), serif", textAlign: "center", letterSpacing: 2, margin: "4px 0 8px" }}>
              {mm}:{ss}
            </p>
            <div style={{ height: 3, borderRadius: 99, background: "rgba(160,100,40,0.12)", overflow: "hidden", marginBottom: 12 }}>
              <div
                style={{
                  height: "100%",
                  width: `${elapsed * 100}%`,
                  background: "linear-gradient(90deg, #c8894a, #e07840)",
                  transition: "width 1s linear",
                }}
              />
            </div>
            <button
              onClick={cancelTimer}
              style={{
                width: "100%",
                padding: "7px 0",
                borderRadius: 10,
                border: "1px solid #f0b4b4",
                background: "transparent",
                color: "#c06060",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedMinutes(d)}
                  style={{
                    padding: "6px 0",
                    borderRadius: 8,
                    border: selectedMinutes === d ? "1px solid #e8c49a" : "1px solid #e8d4b4",
                    background: selectedMinutes === d ? "#f5d8b8" : "transparent",
                    color: selectedMinutes === d ? "#8b5020" : "#9a7050",
                    fontSize: 12,
                    fontWeight: selectedMinutes === d ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {d} min
                </button>
              ))}
            </div>
            <p style={{ color: "#b09070", fontSize: 11, textAlign: "center", marginBottom: 8 }}>
              ≈ {calculateSessionXP(selectedMinutes)} XP
            </p>
            <button
              onClick={startTimer}
              disabled={posting}
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #c8894a, #e07840)",
                color: "#fff8f0",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Démarrer
            </button>
          </>
        )}
      </GlassCard>

      <GlassCard variant="dark">
        <CardTitle>Badges</CardTitle>
        <BadgesGrid newlyUnlocked={newBadges} />
      </GlassCard>
    </div>
  );
}
