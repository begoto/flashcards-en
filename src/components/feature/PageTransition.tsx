import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────────
// PageTransition — Enveloppe le contenu de page
// Utilise key={pathname} pour forcer le remount + déclencher
// l'animation CSS page-enter sur chaque changement de route
// ─────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: Props) {
  const { pathname } = useLocation();

  return (
    <div key={pathname} className={`page-enter ${className}`}>
      {children}
    </div>
  );
}
