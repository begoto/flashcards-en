import { type InputHTMLAttributes, forwardRef } from "react";

// ─────────────────────────────────────────────────────────────
// Composant Input — dark mode ready
// ─────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-neutral-ink dark:text-slate-200">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 w-5 h-5 flex items-center justify-center text-neutral-muted dark:text-slate-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            {...rest}
            className={[
              "w-full text-sm rounded-lg border px-4 py-2.5 outline-none transition-all duration-200",
              "bg-white dark:bg-slate-700",
              "text-neutral-ink dark:text-slate-100",
              "placeholder:text-neutral-300 dark:placeholder:text-slate-500",
              "border-neutral-line dark:border-slate-600",
              "focus:border-[#87CEEB] focus:ring-2 focus:ring-[#C9E8F6] dark:focus:ring-sky-900/40",
              error ? "border-[#EF4444] dark:border-red-500" : "",
              icon ? "pl-10" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </div>
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
