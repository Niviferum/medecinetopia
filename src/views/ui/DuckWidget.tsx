"use client";

import { useState } from "react";

const PHRASES = [
  "T'es une machine Choupette, continue ! 💪",
  "Tu as pensé à boire de l'eau ? C'est super bon l'eau ! 💧",
  "Je crois en toi même quand tu n'y crois pas 🌟",
  "Pause ? Jamais entendu ce mot. 😤",
  "En avant ma reine, slay moi ces cours ! 👑",
  "Un cours de plus, une future vie sauvée 💛",
  "Tu es plus forte que tu ne le penses 🌸",
  "Allez, encore un petit effort ! Courage !🔥",
  "Continue ma chérie, je t'aime 💛",
  "Fier de toi. Vraiment. 🦆❤️",
];

export function DuckWidget() {
  const [phrase, setPhrase] = useState<string | null>(null);
  const [lastIndex, setLastIndex] = useState(-1);

  function handleClick() {
    if (phrase) { setPhrase(null); return; }
    let idx;
    do { idx = Math.floor(Math.random() * PHRASES.length); } while (idx === lastIndex);
    setLastIndex(idx);
    setPhrase(PHRASES[idx]);
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
      }}
    >
      {/* Bulle — positionnée au-dessus du canard sans le déplacer */}
      {phrase && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 12px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fdf8f0",
            border: "1px solid #e8d4b4",
            borderRadius: 12,
            padding: "10px 14px",
            width: 210,
            fontSize: 12,
            color: "#5a3010",
            lineHeight: 1.5,
            boxShadow: "0 4px 16px rgba(160,100,40,0.15)",
            textAlign: "center",
          }}
        >
          {phrase}
          <div style={{
            position: "absolute",
            bottom: -7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "7px solid #e8d4b4",
          }} />
          <div style={{
            position: "absolute",
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid #fdf8f0",
          }} />
        </div>
      )}

      {/* Canard — ne bouge pas */}
      <img
        src="/duck.gif"
        alt="Duck"
        onClick={handleClick}
        style={{
          width: 72,
          height: 72,
          objectFit: "contain",
          cursor: "pointer",
          display: "block",
          filter: "drop-shadow(5px 10px 6px rgba(0,0,0,0.45)) drop-shadow(2px 4px 2px rgba(0,0,0,0.25))",
        }}
      />
    </div>
  );
}
