"use client";

import { useState, useEffect, useRef } from "react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Postit } from "@/types";

const COLORS = ["#fde99a", "#f9c4ca", "#b8e8b0", "#b8d8f8", "#d8c8f8", "#ffd4a8"];

// ── Draggable post-it ──────────────────────────────────────────────────────

function DraggablePostit({
  postit,
  onContentSave,
  onDelete,
  onColorChange,
}: {
  postit: Postit;
  onContentSave: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: postit.id,
  });
  const [content, setContent] = useState(postit.content);
  const [showColors, setShowColors] = useState(false);
  const [hovered, setHovered] = useState(false);

  const tx = transform?.x ?? 0;
  const ty = transform?.y ?? 0;

  let shadow = "0 3px 14px rgba(100,60,20,0.14)";
  if (isDragging) shadow = "0 14px 36px rgba(100,60,20,0.22)";
  else if (hovered) shadow = "0 0 0 3px rgba(255,255,255,0.9), 0 6px 24px rgba(255,255,255,0.6), 0 3px 14px rgba(100,60,20,0.14)";

  return (
    <div
      ref={setNodeRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: `${postit.pos_x}%`,
        top: `${postit.pos_y}%`,
        minWidth: 160,
        minHeight: 140,
        width: 190,
        resize: "both",
        overflow: "hidden",
        transform: `translate3d(${tx}px,${ty}px,0) rotate(${postit.rotation}deg)`,
        zIndex: isDragging ? 1000 : hovered ? 10 : 2,
        opacity: isDragging ? 0.88 : 1,
        boxShadow: shadow,
        borderRadius: 10,
        transition: isDragging ? "none" : "box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        {...attributes}
        style={{
          background: postit.color,
          borderRadius: "10px 10px 0 0",
          padding: "6px 8px 4px",
          cursor: isDragging ? "grabbing" : "grab",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setShowColors((v) => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: "0 2px", opacity: 0.6 }}
        >
          🎨
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(postit.id)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1, color: "#a06040", opacity: 0.6, padding: "0 2px" }}
        >
          ×
        </button>
      </div>

      {/* Color picker */}
      {showColors && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute", top: 32, left: 0, zIndex: 10,
            background: "#fdf8f0", border: "1px solid #e8d4b4", borderRadius: 8,
            padding: "6px 8px", display: "flex", gap: 6,
            boxShadow: "0 4px 12px rgba(160,100,40,0.15)",
          }}
        >
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => { onColorChange(postit.id, c); setShowColors(false); }}
              style={{
                width: 20, height: 20, borderRadius: 4, background: c, border: "none",
                cursor: "pointer", outline: postit.color === c ? "2px solid #c8894a" : "none",
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => onContentSave(postit.id, content)}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder="Écris ici…"
        style={{
          flex: 1,
          width: "100%",
          background: postit.color,
          border: "none",
          borderRadius: "0 0 10px 10px",
          padding: "6px 10px 10px",
          fontFamily: "var(--font-rounded), sans-serif",
          fontSize: 13, color: "#3d2010", resize: "none",
          boxSizing: "border-box", outline: "none",
          lineHeight: 1.5,
        }}
      />
    </div>
  );
}

// ── Board ──────────────────────────────────────────────────────────────────

export function PostitBoard() {
  const [postits, setPostits] = useState<Postit[]>([]);
  const [loading, setLoading] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/postits")
      .then((r) => r.json())
      .then((data: Postit[]) => { setPostits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const postit = postits.find((p) => p.id === active.id);
    if (!postit) return;

    const newX = Math.max(0, Math.min(88, postit.pos_x + (delta.x / rect.width) * 100));
    const newY = Math.max(0, Math.min(85, postit.pos_y + (delta.y / rect.height) * 100));

    setPostits((prev) => prev.map((p) => p.id === postit.id ? { ...p, pos_x: newX, pos_y: newY } : p));

    fetch(`/api/postits/${postit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pos_x: newX, pos_y: newY }),
    });
  }

  async function handleAdd() {
    const res = await fetch("/api/postits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color: COLORS[Math.floor(Math.random() * COLORS.length)] }),
    });
    if (res.ok) {
      const p: Postit = await res.json();
      setPostits((prev) => [...prev, p]);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/postits/${id}`, { method: "DELETE" });
    setPostits((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleContentSave(id: string, content: string) {
    const res = await fetch(`/api/postits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    if (res.ok) {
      const updated: Postit = await res.json();
      setPostits((prev) => prev.map((p) => p.id === id ? updated : p));
    }
  }

  async function handleColorChange(id: string, color: string) {
    const res = await fetch(`/api/postits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
    if (res.ok) {
      const updated: Postit = await res.json();
      setPostits((prev) => prev.map((p) => p.id === id ? updated : p));
    }
  }

  return (
    <div style={{ position: "relative", height: "calc(100vh - 130px)" }}>
      <button
        onClick={handleAdd}
        style={{
          position: "absolute", top: 0, right: 0, zIndex: 10,
          background: "#fde8d4", border: "1px solid #e8c49a",
          borderRadius: 10, padding: "7px 16px",
          color: "#8b5020", fontSize: 13, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(160,100,40,0.12)",
        }}
      >
        + Post-it
      </button>

      <DndContext onDragEnd={handleDragEnd}>
        <div
          ref={boardRef}
          style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
        >
          {loading && (
            <p style={{ color: "#9a7050", fontSize: 13, fontStyle: "italic", padding: 16 }}>Chargement…</p>
          )}
          {!loading && postits.length === 0 && (
            <p style={{ color: "#bbb", fontSize: 13, fontStyle: "italic", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
              Aucun post-it — clique sur + pour commencer
            </p>
          )}
          {postits.map((p) => (
            <DraggablePostit
              key={p.id}
              postit={p}
              onContentSave={handleContentSave}
              onDelete={handleDelete}
              onColorChange={handleColorChange}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
