"use client";

import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div
      className="clock"
      style={{
        background: "#fde8d4",
        border: "1px solid #e8c49a",
        borderRadius: 16,
        padding: "10px 36px",
        boxShadow: "0 3px 12px rgba(160,100,40,0.13)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-lora), serif",
          fontSize: 96,
          fontWeight: 700,
          color: "#8b5020",
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {time}
      </span>
    </div>
  );
}
