"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginContent() {
  const params = useSearchParams();
  const error = params.get("error");

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <Image
        src="/bg/classroom.jpg"
        alt="Salle de classe"
        fill
        style={{ objectFit: "cover", filter: "brightness(0.7)" }}
        priority
      />

      <div style={{
        position: "relative",
        zIndex: 1,
        background: "rgba(40, 22, 6, 0.55)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 220, 160, 0.25)",
        borderRadius: 24,
        padding: "40px 48px",
        textAlign: "center",
        maxWidth: 400,
        width: "90%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,160,0.15)",
      }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>🌿</p>
        <h1 style={{
          fontFamily: "var(--font-lora)",
          fontSize: 28,
          color: "#fde68a",
          marginBottom: 8,
        }}>
          Médecinetopia
        </h1>
        <p style={{ color: "rgba(255,220,160,0.7)", fontSize: 14, marginBottom: 32 }}>
          Ton espace de révision rien qu'à toi ✨
        </p>

        {error === "unauthorized" && (
          <p style={{
            background: "rgba(220,80,60,0.2)",
            border: "1px solid rgba(220,80,60,0.3)",
            borderRadius: 10,
            padding: "10px 16px",
            color: "#ffb0a0",
            fontSize: 13,
            marginBottom: 20,
          }}>
            Cet espace est réservé 🔒
          </p>
        )}

        <button
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
          style={{
            width: "100%",
            padding: "12px 24px",
            borderRadius: 14,
            border: "none",
            background: "#5865f2",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "opacity .2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
          Connexion avec Discord
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
