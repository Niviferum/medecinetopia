"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard, CardTitle } from "@/views/ui/GlassCard";
import { getLevelInfo, calculateSessionXP } from "@/lib/xp";
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
      {/* XP Card */}
      <GlassCard variant="dark">
        <CardTitle>Niveau</CardTitle>
        <p style={{ color: "#e8c87a", fontSize: 18, fontWeight: 700, fontFamily: "var(--font-lora), serif", lineHeight: 1.2 }}>
          {level.name}
        </p>
        <p style={{ color: "rgba(245,239,228,0.45)", fontSize: 12, marginTop: 4 }}>
          {xp} XP{streak > 0 && <span style={{ marginLeft: 8 }}>🔥 {streak}j</span>}
        </p>
        <div style={{ marginTop: 10, height: 6, borderRadius: 99, background: "rgba(255,220,160,0.1)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              borderRadius: 99,
              background: "linear-gradient(90deg, #c8894a, #e8c87a)",
              transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>
        <p style={{ color: "rgba(245,239,228,0.3)", fontSize: 11, marginTop: 6 }}>
          {level.progressPercent === 100
            ? "Niveau max ✨"
            : `${level.nextLevelXP - xp} XP jusqu'au prochain niveau`}
        </p>
      </GlassCard>

      {/* Session Card */}
      <GlassCard variant="dark">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <CardTitle style={{ marginBottom: 0 }}>Session</CardTitle>
          {sessionCount !== null && (
            <span style={{ color: "rgba(245,239,228,0.35)", fontSize: 11 }}>
              {sessionCount} cette semaine
            </span>
          )}
        </div>

        {lastXpEarned !== null && (
          <p style={{ color: "#7aad6e", fontSize: 13, fontWeight: 600, marginBottom: 10, textAlign: "center" }}>
            +{lastXpEarned} XP ✓
          </p>
        )}

        {isRunning ? (
          <>
            <p style={{ color: "#e8c87a", fontSize: 36, fontWeight: 700, fontFamily: "var(--font-lora), serif", textAlign: "center", letterSpacing: 2, margin: "4px 0 8px" }}>
              {mm}:{ss}
            </p>
            <div style={{ height: 3, borderRadius: 99, background: "rgba(255,220,160,0.1)", overflow: "hidden", marginBottom: 12 }}>
              <div
                style={{
                  height: "100%",
                  width: `${elapsed * 100}%`,
                  background: "linear-gradient(90deg, #c8894a, #e8c87a)",
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
                border: "1px solid rgba(255,100,100,0.2)",
                background: "transparent",
                color: "rgba(255,150,150,0.5)",
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
                    border: "none",
                    background: selectedMinutes === d
                      ? "rgba(232,200,122,0.18)"
                      : "rgba(255,220,160,0.06)",
                    color: selectedMinutes === d ? "#e8c87a" : "rgba(245,239,228,0.4)",
                    fontSize: 12,
                    fontWeight: selectedMinutes === d ? 600 : 400,
                    cursor: "pointer",
                    outline: selectedMinutes === d ? "1px solid rgba(232,200,122,0.3)" : "none",
                  }}
                >
                  {d} min
                </button>
              ))}
            </div>
            <p style={{ color: "rgba(245,239,228,0.3)", fontSize: 11, textAlign: "center", marginBottom: 8 }}>
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
                background: "linear-gradient(135deg, #c8894a, #e8c87a)",
                color: "#3d2e22",
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
        <p style={{ color: "rgba(245,239,228,0.4)", fontSize: 13, fontStyle: "italic" }}>
          — M8 à venir
        </p>
      </GlassCard>
    </div>
  );
}
