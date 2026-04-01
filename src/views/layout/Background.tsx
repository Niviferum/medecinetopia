import Image from "next/image";

const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E";

export function Background() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#1a1000",
      }}
    >
      <Image
        src="/bg/classroom.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(26, 16, 0, 0.22)",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("${GRAIN_SVG}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.04,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
