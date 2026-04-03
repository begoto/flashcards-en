import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────
// Confetti — animation CSS pluie de confettis (score parfait)
// ─────────────────────────────────────────────────────────────

interface Piece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
  isCircle: boolean;
  rotateDir: number;
}

const COLORS = [
  "#FF6B6B", "#FFE66D", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FFEAA7", "#F8A5C2", "#A8E6CF",
  "#FFB347", "#87CEEB", "#DDA0DD", "#98FB98",
];

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }

    const newPieces: Piece[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2.5,
      size: 6 + Math.floor(Math.random() * 10),
      isCircle: Math.random() > 0.55,
      rotateDir: Math.random() > 0.5 ? 1 : -1,
    }));
    setPieces(newPieces);

    const t = setTimeout(() => setPieces([]), 6000);
    return () => clearTimeout(t);
  }, [active]);

  if (!pieces.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
        overflow: "hidden",
      }}
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
