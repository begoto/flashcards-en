import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────────
// Composant Badge — Étiquette colorée pour niveaux, catégories, scores
// ─────────────────────────────────────────────────────────────

type BadgeVariant = "sky" | "correct" | "wrong" | "gold" | "gray" | "ink";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantMap: Record<BadgeVariant, string> = {
  sky:     "bg-[#C9E8F6] text-[#1A7BAD]",
  correct: "bg-green-100 text-green-700",
  wrong:   "bg-red-100 text-red-600",
  gold:    "bg-yellow-100 text-yellow-700",
  gray:    "bg-gray-100 text-gray-600",
  ink:     "bg-neutral-ink text-white",
};

const sizeMap = {
  sm: "text-xs px-2 py-0.5 rounded-md",
  md: "text-sm px-2.5 py-1 rounded-lg",
};

export function Badge({ children, variant = "sky", size = "sm" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 font-semibold whitespace-nowrap",
        variantMap[variant],
        sizeMap[size],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
