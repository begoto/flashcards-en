import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Composant Modal — Fenêtre modale réutilisable avec overlay
// Se ferme avec Escape ou clic sur le fond
// ─────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Largeur maximale de la modale */
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
}: ModalProps) {
  // Fermeture avec la touche Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panneau */}
      <div
        className={[
          "relative z-10 w-full bg-white rounded-2xl p-6 animate-slideUp",
          maxWidthClasses[maxWidth],
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold font-display text-neutral-ink">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-soft transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X size={18} className="text-neutral-muted" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
