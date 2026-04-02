"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GlassCard } from "@/views/ui/GlassCard";
import { PostitBoard } from "@/views/dashboard/PostitBoard";
import type { Subject, Cours } from "@/types";
import type { DashboardTab } from "@/views/layout/Topbar";

interface SubjectWithProgress extends Subject {
  total: number;
  done: number;
}

interface CenterColumnProps {
  activeTab: DashboardTab;
}

function AddSubjectModal({ onAdd, onClose }: { onAdd: (name: string) => void; onClose: () => void }) {
  const [name, setName] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(26,16,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fdf8f0", border: "1px solid #e8d4b4", borderRadius: 14, padding: 24, maxWidth: 320, width: "90%", boxShadow: "0 8px 32px rgba(160,100,40,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ color: "#8b5020", fontFamily: "var(--font-lora), serif", fontSize: 15, marginBottom: 16 }}>Nouvelle matière</p>
        <input
          ref={ref}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) onAdd(name.trim()); if (e.key === "Escape") onClose(); }}
          placeholder="Nom de la matière…"
          style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #e8d4b4", background: "#fff8f0", color: "#2d1a0a", fontSize: 13, boxSizing: "border-box", marginBottom: 14 }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #e8d4b4", background: "transparent", color: "#9a7050", fontSize: 12, cursor: "pointer" }}>Annuler</button>
          <button
            onClick={() => { if (name.trim()) onAdd(name.trim()); }}
            style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #c8894a, #e07840)", color: "#fff8f0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
}

export function CenterColumn({ activeTab }: CenterColumnProps) {
  const [subjects, setSubjects] = useState<SubjectWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/subjects").then((r) => r.json()),
      fetch("/api/cours").then((r) => r.json()),
    ])
      .then(([subs, allCours]: [Subject[], Cours[]]) => {
        const countMap: Record<string, { total: number; done: number }> = {};
        for (const c of allCours) {
          if (!countMap[c.subject_id]) countMap[c.subject_id] = { total: 0, done: 0 };
          countMap[c.subject_id].total++;
          if (c.done) countMap[c.subject_id].done++;
        }
        const filtered = subs
          .filter((s) => countMap[s.id])
          .map((s) => ({ ...s, ...countMap[s.id] }));
        setSubjects(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleAddSubject(name: string) {
    setShowAdd(false);
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, icon: "📚", color: "#c8894a" }),
    });
    if (res.ok) {
      const s: Subject = await res.json();
      setSubjects((prev) => [...prev, { ...s, total: 0, done: 0 }]);
    }
  }

  if (activeTab === "postits") {
    return (
      <div
        style={{
          background: "#f8f8f6",
          border: "2px solid #ddddd8",
          borderRadius: 6,
          boxShadow: "inset 0 1px 12px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.10)",
          padding: 16,
          minHeight: "calc(100vh - 90px)",
          overflow: "hidden",
        }}
      >
        <PostitBoard />
      </div>
    );
  }

  if (loading) {
    return <p style={{ color: "rgba(245,239,228,1.0)", fontSize: 13, fontStyle: "italic", padding: 16 }}>Chargement…</p>;
  }

  return (
    <>
      {showAdd && <AddSubjectModal onAdd={handleAddSubject} onClose={() => setShowAdd(false)} />}
      <div className="subjects-grid">
        {subjects.map((s, i) => {
          const pct = s.total > 0 ? (s.done / s.total) * 100 : 0;
          return (
            <Link key={s.id} href={`/dashboard/matiere/${s.id}`} style={{ textDecoration: "none" }}>
              <SubjectCard subject={s} pct={pct} index={i} />
            </Link>
          );
        })}
        <AddTile onClick={() => setShowAdd(true)} />
      </div>
    </>
  );
}

function AddTile({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fdf0e4" : "#fdf0e4",
        border: `1px dashed ${hovered ? "#e8c49a" : "#d4b890"}`,
        borderRadius: 14,
        padding: "20px 16px 16px",
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: hovered ? "#c8894a" : "#d4b890", fontSize: 28, lineHeight: 1 }}>+</span>
    </div>
  );
}

const PASTEL_CARDS = [
  { bg: "#fde8d4", border: "#e8c49a", bar: "#c8894a" },
  { bg: "#fce4e8", border: "#e8b4bc", bar: "#d4607a" },
  { bg: "#e4f0dc", border: "#b4d4a0", bar: "#5a9a3a" },
  { bg: "#e8e4f4", border: "#c4b8e8", bar: "#7060c0" },
  { bg: "#deeaf8", border: "#a8c8e8", bar: "#4080c0" },
  { bg: "#fdf0d0", border: "#e8d098", bar: "#b09020" },
  { bg: "#f4e4f0", border: "#d8b4d0", bar: "#a04880" },
  { bg: "#e4f4f0", border: "#a8d8d0", bar: "#2a9080" },
];

function SubjectCard({ subject: s, pct, index }: { subject: SubjectWithProgress; pct: number; index: number }) {
  const [hovered, setHovered] = useState(false);
  const palette = PASTEL_CARDS[index % PASTEL_CARDS.length];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 14,
        padding: "20px 16px 16px",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 6px 18px rgba(100,60,20,0.16)"
          : "0 2px 8px rgba(100,60,20,0.10)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "box-shadow 0.15s, transform 0.15s",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <span style={{ fontSize: 30, lineHeight: 1 }}>{s.icon}</span>
      <p style={{
        color: "#2d1a0a",
        fontFamily: "var(--font-lora), serif",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        flex: 1,
      }}>
        {s.name}
      </p>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ color: "#9a7050", fontSize: 10 }}>{s.done}/{s.total}</span>
          <span style={{ color: pct === 100 ? "#4a8a3a" : "#9a7050", fontSize: 10 }}>{Math.round(pct)}%</span>
        </div>
        <div style={{ height: 3, borderRadius: 99, background: "rgba(100,60,20,0.10)", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 99,
            background: pct === 100 ? "#5a9a3a" : palette.bar,
            transition: "width 0.5s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
