import type { CSSProperties } from "react";

type GlassVariant = "default" | "dark" | "warm";

const variantStyles: Record<GlassVariant, CSSProperties> = {
  default: {
    background: "#fdf8f0",
    border: "1px solid #e8d4b4",
    boxShadow: "0 2px 10px rgba(160,100,40,0.10)",
  },
  dark: {
    background: "#fde8d4",
    border: "1px solid #e8c49a",
    boxShadow: "0 3px 12px rgba(160,100,40,0.13)",
  },
  warm: {
    background: "#fce4e4",
    border: "1px solid #e8b4b4",
    boxShadow: "0 3px 12px rgba(160,60,60,0.10)",
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
        borderRadius: 14,
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
        color: "#8b5020",
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
