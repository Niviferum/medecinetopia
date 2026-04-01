import type { CSSProperties } from "react";

type GlassVariant = "default" | "dark" | "warm";

const variantStyles: Record<GlassVariant, CSSProperties> = {
  default: {
    background: "rgba(255, 248, 235, 0.18)",
    border: "1px solid rgba(255, 220, 160, 0.28)",
  },
  dark: {
    background: "rgba(40, 22, 6, 0.42)",
    border: "1px solid rgba(255, 200, 120, 0.2)",
  },
  warm: {
    background: "rgba(200, 130, 60, 0.24)",
    border: "1px solid rgba(255, 190, 100, 0.32)",
  },
};

interface GlassCardProps {
  variant?: GlassVariant;
  children: React.ReactNode;
  style?: CSSProperties;
}

export function GlassCard({ variant = "default", children, style }: GlassCardProps) {
  return (
    <div
      style={{
        ...variantStyles[variant],
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderRadius: 16,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

export function CardTitle({ children, style }: CardTitleProps) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-lora), serif",
        fontSize: 14,
        fontWeight: 600,
        color: "#e8c87a",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}
