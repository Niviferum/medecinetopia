"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/views/ui/GlassCard";
import type { Subject, Cours } from "@/types";
import type { DashboardTab } from "@/views/layout/Topbar";

interface CenterColumnProps {
  activeTab: DashboardTab;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

// ── Confirmation modal ─────────────────────────────────────────────────────

function ConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(26,16,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "rgba(40,22,6,0.95)", border: "1px solid rgba(255,220,160,0.2)",
          borderRadius: 16, padding: 28, maxWidth: 320, width: "90%",
          textAlign: "center",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ fontSize: 22, marginBottom: 8 }}>✅</p>
        <p style={{ color: "#f5efe4", fontFamily: "var(--font-lora), serif", fontSize: 16, marginBottom: 6 }}>
          Cours validé ?
        </p>
        <p style={{ color: "rgba(245,239,228,0.45)", fontSize: 13, marginBottom: 20 }}>
          Cette action ne peut pas être annulée.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={cancelBtnStyle}>Pas encore</button>
          <button onClick={onConfirm} style={confirmBtnStyle}>Oui, validé ✓</button>
        </div>
      </div>
    </div>
  );
}

const confirmBtnStyle: React.CSSProperties = {
  padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
  background: "linear-gradient(135deg, #c8894a, #e8c87a)", color: "#3d2e22",
  fontSize: 13, fontWeight: 700,
};
const cancelBtnStyle: React.CSSProperties = {
  padding: "8px 18px", borderRadius: 10, cursor: "pointer",
  background: "transparent", border: "1px solid rgba(255,220,160,0.2)",
  color: "rgba(245,239,228,0.5)", fontSize: 13,
};

// ── Edit modal ─────────────────────────────────────────────────────────────

function EditModal({
  cours, onSave, onClose,
}: {
  cours: Cours;
  onSave: (dto: Partial<Cours>) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(cours.title);
  const [type, setType] = useState(cours.type ?? "");
  const [date, setDate] = useState(cours.date ?? "");
  const [support, setSupport] = useState(cours.support ?? "");

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(26,16,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(40,22,6,0.95)", border: "1px solid rgba(255,220,160,0.2)",
          borderRadius: 16, padding: 24, maxWidth: 360, width: "90%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ color: "#e8c87a", fontFamily: "var(--font-lora), serif", fontSize: 15, marginBottom: 16 }}>
          Modifier le cours
        </p>
        {([
          ["Titre", title, setTitle, "text"],
          ["Type (CM1, TD2…)", type, setType, "text"],
          ["Date", date, setDate, "date"],
          ["Support (vidéo, amphi…)", support, setSupport, "text"],
        ] as [string, string, (v: string) => void, string][]).map(([label, val, setter, inputType]) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <label style={{ color: "rgba(245,239,228,0.4)", fontSize: 11, display: "block", marginBottom: 4 }}>
              {label}
            </label>
            <input
              type={inputType}
              value={val}
              onChange={(e) => setter(e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={cancelBtnStyle}>Annuler</button>
          <button
            onClick={() => onSave({ title, type: type || null, date: date || null, support: support || null })}
            style={confirmBtnStyle}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px", borderRadius: 8,
  border: "1px solid rgba(255,220,160,0.2)", background: "rgba(255,248,235,0.05)",
  color: "#f5efe4", fontSize: 13, boxSizing: "border-box",
};

// ── Cours card ─────────────────────────────────────────────────────────────

function CoursCard({
  cours,
  onDone,
  onEdit,
  onDelete,
}: {
  cours: Cours;
  onDone: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(40,22,6,0.38)", border: "1px solid rgba(255,220,160,0.1)",
        borderRadius: 10, padding: "9px 11px", position: "relative",
        opacity: cours.done ? 0.5 : 1, transition: "opacity 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        {!cours.done && (
          <button
            onClick={onDone}
            title="Marquer comme fait"
            style={{
              flexShrink: 0, marginTop: 1,
              width: 14, height: 14, borderRadius: 3,
              border: "1px solid rgba(255,220,160,0.3)",
              background: "transparent", cursor: "pointer", padding: 0,
            }}
          />
        )}
        {cours.done && (
          <span style={{ flexShrink: 0, fontSize: 12, marginTop: 1 }}>✓</span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {cours.type && (
            <span style={{ color: "#e8c87a", fontSize: 10, fontWeight: 600, marginRight: 4 }}>
              {cours.type}
            </span>
          )}
          <span
            className={cours.done ? "cours-done" : undefined}
            style={{ color: "#f5efe4", fontSize: 12, lineHeight: 1.4, wordBreak: "break-word" }}
          >
            {cours.title}
          </span>
          {(cours.date || cours.support) && (
            <p style={{ color: "rgba(245,239,228,0.35)", fontSize: 10, marginTop: 3 }}>
              {formatDate(cours.date)}
              {cours.date && cours.support && " · "}
              {cours.support}
            </p>
          )}
        </div>
      </div>

      {hovered && !cours.done && (
        <div style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 4 }}>
          <button onClick={onEdit} style={iconBtnStyle} title="Modifier">✏️</button>
          <button onClick={onDelete} style={iconBtnStyle} title="Supprimer">🗑️</button>
        </div>
      )}
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: "rgba(40,22,6,0.8)", border: "none", borderRadius: 6,
  padding: "2px 5px", cursor: "pointer", fontSize: 11,
};

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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <input
        ref={ref}
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="CM1"
        style={{ ...inputStyle, fontSize: 11 }}
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
        placeholder="Titre du cours…"
        style={{ ...inputStyle, fontSize: 12 }}
      />
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onCancel} style={{ ...cancelBtnStyle, flex: 1, padding: "6px 0", fontSize: 11 }}>✕</button>
        <button onClick={submit} style={{ ...confirmBtnStyle, flex: 1, padding: "6px 0", fontSize: 11 }}>Ajouter</button>
      </div>
    </div>
  );
}

// ── Subject column ─────────────────────────────────────────────────────────

function SubjectColumn({
  subject, cours, onDone, onEdit, onDelete, onAdd,
}: {
  subject: Subject;
  cours: Cours[];
  onDone: (c: Cours) => void;
  onEdit: (c: Cours) => void;
  onDelete: (c: Cours) => void;
  onAdd: (subjectId: string, title: string, type: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const done = cours.filter((c) => c.done).length;

  return (
    <div style={{ minWidth: 210, maxWidth: 210, display: "flex", flexDirection: "column", gap: 8 }}>
      <GlassCard variant="dark" style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 14 }}>{subject.icon}</span>
            <span style={{ color: "#e8c87a", fontSize: 13, fontWeight: 600, marginLeft: 6, fontFamily: "var(--font-lora), serif" }}>
              {subject.name}
            </span>
          </div>
          <span style={{ color: "rgba(245,239,228,0.3)", fontSize: 10 }}>{done}/{cours.length}</span>
        </div>
      </GlassCard>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {cours.map((c) => (
          <CoursCard
            key={c.id}
            cours={c}
            onDone={() => onDone(c)}
            onEdit={() => onEdit(c)}
            onDelete={() => onDelete(c)}
          />
        ))}
        {adding ? (
          <div style={{ background: "rgba(40,22,6,0.38)", border: "1px solid rgba(255,220,160,0.1)", borderRadius: 10, padding: "9px 11px" }}>
            <AddCoursForm
              onAdd={(title, type) => { onAdd(subject.id, title, type); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              background: "transparent", border: "1px dashed rgba(255,220,160,0.15)",
              borderRadius: 10, padding: "7px 0", color: "rgba(245,239,228,0.25)",
              fontSize: 12, cursor: "pointer", width: "100%",
            }}
          >
            + Ajouter un cours
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function CenterColumn({ activeTab }: CenterColumnProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [coursMap, setCoursMap] = useState<Record<string, Cours[]>>({});
  const [loading, setLoading] = useState(true);
  const [pendingDone, setPendingDone] = useState<Cours | null>(null);
  const [editing, setEditing] = useState<Cours | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/subjects").then((r) => r.json()),
      fetch("/api/cours").then((r) => r.json()),
    ]).then(([subs, allCours]: [Subject[], Cours[]]) => {
      setSubjects(subs);
      const map: Record<string, Cours[]> = {};
      for (const s of subs) map[s.id] = [];
      for (const c of allCours) {
        if (map[c.subject_id]) map[c.subject_id].push(c);
      }
      setCoursMap(map);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function updateCoursInMap(updated: Cours) {
    setCoursMap((prev) => ({
      ...prev,
      [updated.subject_id]: (prev[updated.subject_id] ?? []).map((c) =>
        c.id === updated.id ? updated : c
      ),
    }));
  }

  async function handleDoneConfirm() {
    if (!pendingDone) return;
    const res = await fetch(`/api/cours/${pendingDone.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    });
    if (res.ok) {
      const { cours, xpEarned } = await res.json();
      updateCoursInMap(cours);
      if (xpEarned > 0) {
        window.dispatchEvent(new CustomEvent("medecinetopia:xp", { detail: { xpEarned } }));
      }
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
      const { cours } = await res.json();
      updateCoursInMap(cours);
    }
    setEditing(null);
  }

  async function handleDelete(c: Cours) {
    await fetch(`/api/cours/${c.id}`, { method: "DELETE" });
    setCoursMap((prev) => ({
      ...prev,
      [c.subject_id]: (prev[c.subject_id] ?? []).filter((x) => x.id !== c.id),
    }));
  }

  async function handleAdd(subjectId: string, title: string, type: string) {
    const res = await fetch("/api/cours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId, title, type: type || null }),
    });
    if (res.ok) {
      const cours: Cours = await res.json();
      setCoursMap((prev) => ({
        ...prev,
        [subjectId]: [...(prev[subjectId] ?? []), cours],
      }));
    }
  }

  if (activeTab === "postits") {
    return (
      <GlassCard style={{ minHeight: 400 }}>
        <p style={{ color: "rgba(61,46,34,0.5)", fontSize: 13, fontStyle: "italic" }}>— M5 à venir</p>
      </GlassCard>
    );
  }

  return (
    <>
      {pendingDone && <ConfirmModal onConfirm={handleDoneConfirm} onCancel={() => setPendingDone(null)} />}
      {editing && <EditModal cours={editing} onSave={(dto) => handleEdit(editing.id, dto)} onClose={() => setEditing(null)} />}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, height: "100%" }}>
        {loading ? (
          <p style={{ color: "rgba(61,46,34,0.4)", fontSize: 13, fontStyle: "italic" }}>Chargement…</p>
        ) : (
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, flex: 1, alignItems: "flex-start" }}>
            {subjects.map((s) => (
              <SubjectColumn
                key={s.id}
                subject={s}
                cours={coursMap[s.id] ?? []}
                onDone={setPendingDone}
                onEdit={setEditing}
                onDelete={handleDelete}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
