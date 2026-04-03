import { type ButtonHTMLAttributes, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────
// Composant Button — Bouton réutilisable avec variantes de style
// Couleurs définies par la palette FlashCards EN
// ─────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "correct" | "wrong" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#87CEEB] hover:bg-[#5BAED6] text-white font-semibold shadow-sm hover:shadow-md",
  secondary:
    "bg-white border border-neutral-200 hover:bg-neutral-soft text-neutral-ink font-medium",
  correct:
    "bg-[#22C55E] hover:bg-green-600 text-white font-semibold shadow-sm",
  wrong:
    "bg-[#EF4444] hover:bg-red-600 text-white font-semibold shadow-sm",
  ghost:
    "bg-transparent hover:bg-neutral-soft text-neutral-muted font-medium",
  outline:
    "bg-transparent border border-[#87CEEB] hover:bg-[#C9E8F6] text-[#5BAED6] font-semibold",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-7 py-3.5 text-base rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
