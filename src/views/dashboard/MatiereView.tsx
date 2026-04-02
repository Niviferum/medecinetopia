"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Background } from "@/views/layout/Background";
import type { Subject, Cours } from "@/types";

// ── Styles partagés ────────────────────────────────────────────────────────

const confirmBtnStyle: React.CSSProperties = {
  padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
  background: "linear-gradient(135deg, #c8894a, #e2b33b)", color: "#3d2e22",
  fontSize: 13, fontWeight: 700,
};
const cancelBtnStyle: React.CSSProperties = {
  padding: "8px 18px", borderRadius: 8, cursor: "pointer",
  background: "transparent", border: "1px solid #e8d4b4",
  color: "#9a7050", fontSize: 13,
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: 8,
  border: "1px solid #e8d4b4", background: "#fff8f0",
  color: "#2d1a0a", fontSize: 13, boxSizing: "border-box",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// ── Confirm modal ──────────────────────────────────────────────────────────

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(60,30,10,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onCancel}
    >
      <div
        style={{ background: "#fdf8f0", border: "1px solid #e8d4b4", borderRadius: 14, padding: 28, maxWidth: 320, width: "90%", textAlign: "center", boxShadow: "0 8px 32px rgba(160,100,40,0.20)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: 22, marginBottom: 8 }}>✅</p>
        <p style={{ color: "#2d1a0a", fontFamily: "var(--font-lora), serif", fontSize: 16, marginBottom: 6 }}>Cours validé ?</p>
        <p style={{ color: "#9a7050", fontSize: 13, marginBottom: 20 }}>Cette action ne peut pas être annulée.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={cancelBtnStyle}>Pas encore</button>
          <button onClick={onConfirm} style={confirmBtnStyle}>Oui, validé ✓</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit modal ─────────────────────────────────────────────────────────────

function EditModal({ cours, onSave, onClose }: { cours: Cours; onSave: (dto: Partial<Cours>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(cours.title);
  const [type, setType] = useState(cours.type ?? "");
  const [date, setDate] = useState(cours.date ?? "");
  const [support, setSupport] = useState(cours.support ?? "");

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(60,30,10,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fdf8f0", border: "1px solid #e8d4b4", borderRadius: 14, padding: 24, maxWidth: 360, width: "90%", boxShadow: "0 8px 32px rgba(160,100,40,0.20)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ color: "#8b5020", fontFamily: "var(--font-lora), serif", fontSize: 15, marginBottom: 16 }}>Modifier le cours</p>
        {([
          ["Titre", title, setTitle, "text"],
          ["Type (CM1, TD2…)", type, setType, "text"],
          ["Date", date, setDate, "date"],
          ["Support (vidéo, amphi…)", support, setSupport, "text"],
        ] as [string, string, (v: string) => void, string][]).map(([label, val, setter, inputType]) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <label style={{ color: "rgba(245,239,228,0.4)", fontSize: 11, display: "block", marginBottom: 4 }}>{label}</label>
            <input type={inputType} value={val} onChange={(e) => setter(e.target.value)} style={inputStyle} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={cancelBtnStyle}>Annuler</button>
          <button onClick={() => onSave({ title, type: type || null, date: date || null, support: support || null })} style={confirmBtnStyle}>
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cours card ─────────────────────────────────────────────────────────────

function CoursCard({ cours, onDone, onEdit, onDelete }: { cours: Cours; onDone: () => void; onEdit: () => void; onDelete: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#fdf8f0", border: "1px solid #e8d4b4", borderRadius: 10, padding: "10px 12px", position: "relative", boxShadow: "0 2px 6px rgba(160,100,40,0.09)" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        {!cours.done ? (
          <button
            onClick={onDone}
            title="Marquer comme fait"
            style={{ flexShrink: 0, marginTop: 2, width: 14, height: 14, borderRadius: 3, border: "1px solid rgba(255,220,160,0.3)", cursor: "pointer", padding: 0 }}
          />
        ) : (
          <span style={{ flexShrink: 0, fontSize: 12, marginTop: 2, color: "#7aad6e" }}>✓</span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {cours.type && (
            <span style={{ color: "#e9b533", fontSize: 10, fontWeight: 600, marginRight: 5 }}>{cours.type}</span>
          )}
          <span
            className={cours.done ? "cours-done" : undefined}
            style={{ color: cours.done ? "#b09070" : "#2d1a0a", fontSize: 13, lineHeight: 1.4 }}
          >
            {cours.title}
          </span>
          {(cours.date || cours.support) && (
            <p style={{ color: "#9a7050", fontSize: 11, marginTop: 4 }}>
              {formatDate(cours.date)}{cours.date && cours.support && " · "}{cours.support}
            </p>
          )}
        </div>
      </div>
      {hovered && !cours.done && (
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
          <button onClick={onEdit} style={{ background: "#fdf0e4", border: "1px solid #e8c49a", borderRadius: 6, padding: "2px 6px", cursor: "pointer", fontSize: 11 }} title="Modifier">✏️</button>
          <button onClick={onDelete} style={{ background: "#fde8e8", border: "1px solid #e8b4b4", borderRadius: 6, padding: "2px 6px", cursor: "pointer", fontSize: 11 }} title="Supprimer">🗑️</button>
        </div>
      )}
    </div>
  );
}

// ── Add cours form ─────────────────────────────────────────────────────────

function AddCoursForm({ onAdd, onCancel }: { onAdd: (title: string, type: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  function submit() {
    if (!title.trim()) return;
    onAdd(title.trim(), type.trim());
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input ref={ref} value={type} onChange={(e) => setType(e.target.value)} placeholder="CM1" style={{ ...inputStyle, width: 72, flexShrink: 0 }} />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
        placeholder="Titre du cours…"
        style={{ ...inputStyle, flex: 1 }}
      />
      <button onClick={onCancel} style={{ ...cancelBtnStyle, padding: "7px 10px", flexShrink: 0 }}>✕</button>
      <button onClick={submit} style={{ ...confirmBtnStyle, padding: "7px 12px", flexShrink: 0 }}>+</button>
    </div>
  );
}

// ── Add cours tile ─────────────────────────────────────────────────────────

function AddCoursTile({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#fdf0e4" : "#fdf0e4",
        border: `1px dashed ${hovered ? "#e8c49a" : "#d4b890"}`,
        borderRadius: 10,
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
      }}
    >
      <span style={{ color: hovered ? "#c8894a" : "#4a2e14", fontSize: 22 }}>+</span>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────────────

interface MatiereViewProps {
  subject: Subject;
  initialCours: Cours[];
}

export function MatiereView({ subject, initialCours }: MatiereViewProps) {
  const [cours, setCours] = useState<Cours[]>(initialCours);
  const [pendingDone, setPendingDone] = useState<Cours | null>(null);
  const [editing, setEditing] = useState<Cours | null>(null);
  const [adding, setAdding] = useState(false);

  const done = cours.filter((c) => c.done).length;

  function updateCours(updated: Cours) {
    setCours((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  async function handleDoneConfirm() {
    if (!pendingDone) return;
    const res = await fetch(`/api/cours/${pendingDone.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    });
    if (res.ok) {
      const { cours: updated, xpEarned } = await res.json();
      updateCours(updated);
      if (xpEarned > 0) window.dispatchEvent(new CustomEvent("medecinetopia:xp", { detail: { xpEarned } }));
    }
    setPendingDone(null);
  }

  async function handleEdit(id: string, dto: Partial<Cours>) {
    const res = await fetch(`/api/cours/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (res.ok) {
      const { cours: updated } = await res.json();
      updateCours(updated);
    }
    setEditing(null);
  }

  async function handleDelete(c: Cours) {
    await fetch(`/api/cours/${c.id}`, { method: "DELETE" });
    setCours((prev) => prev.filter((x) => x.id !== c.id));
  }

  async function handleAdd(title: string, type: string) {
    const res = await fetch("/api/cours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId: subject.id, title, type: type || null }),
    });
    if (res.ok) {
      const newCours: Cours = await res.json();
      setCours((prev) => [...prev, newCours]);
    }
    setAdding(false);
  }

  return (
    <>
      <Background />

      {pendingDone && <ConfirmModal onConfirm={handleDoneConfirm} onCancel={() => setPendingDone(null)} />}
      {editing && <EditModal cours={editing} onSave={(dto) => handleEdit(editing.id, dto)} onClose={() => setEditing(null)} />}

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/dashboard"
            style={{
              color: "#9a7050", fontSize: 13, textDecoration: "none",
              padding: "6px 12px", borderRadius: 8,
              border: "1px solid #e8d4b4",
              background: "#fdf8f0",
              boxShadow: "0 2px 6px rgba(160,100,40,0.10)",
              transition: "color 0.15s",
            }}
          >
            ← Retour
          </Link>
          <div style={{ background: "#fdf8f0", borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, border: "1px solid #e8d4b4", boxShadow: "0 2px 10px rgba(160,100,40,0.12)", flex: 1 }}>
            <span style={{ fontSize: 22 }}>{subject.icon}</span>
            <div>
              <p style={{ color: "#8b5020", fontFamily: "var(--font-lora), serif", fontSize: 16, fontWeight: 600 }}>{subject.name}</p>
              <p style={{ color: "#9a7050", fontSize: 12, marginTop: 2 }}>{done}/{cours.length} cours validés</p>
            </div>
            {/* Progress bar */}
            <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(160,100,40,0.10)", overflow: "hidden", marginLeft: 8 }}>
              <div style={{ height: "100%", width: `${cours.length ? (done / cours.length) * 100 : 0}%`, background: "linear-gradient(90deg, #c8894a, #e07840)", borderRadius: 99, transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>

        {/* Cours grid */}
        <div style={{ flex: 1, padding: "0 24px 24px", overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
            {cours.map((c) => (
              <CoursCard
                key={c.id}
                cours={c}
                onDone={() => setPendingDone(c)}
                onEdit={() => setEditing(c)}
                onDelete={() => handleDelete(c)}
              />
            ))}
            {!adding && <AddCoursTile onClick={() => setAdding(true)} />}
          </div>

          {adding && (
            <div style={{ marginTop: 8 }}>
              <AddCoursForm onAdd={handleAdd} onCancel={() => setAdding(false)} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
