import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// ─────────────────────────────────────────────────────────────
// NavProgressBar — Fine barre de progression en haut de page
// Se déclenche à chaque changement de route
// ─────────────────────────────────────────────────────────────

export function NavProgressBar() {
  const location  = useLocation();
  const [width,   setWidth]   = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading,  setFading]  = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  };

  useEffect(() => {
    clearAllTimers();
    setFading(false);
    setVisible(true);
    setWidth(0);

    // Progression en 3 étapes pour simuler un vrai chargement
    schedule(() => setWidth(30),  20);
    schedule(() => setWidth(65), 150);
    schedule(() => setWidth(85), 320);
    schedule(() => setWidth(100), 480);

    // Fade out après complétion
    schedule(() => setFading(true),  680);
    schedule(() => {
      setVisible(false);
      setWidth(0);
      setFading(false);
    }, 920);

    return clearAllTimers;
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] h-[2.5px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 relative overflow-hidden"
        style={{
          width: `${width}%`,
          transition: width === 0
            ? "none"
            : width === 100
              ? "width 0.18s cubic-bezier(0.22, 0.61, 0.36, 1)"
              : "width 0.38s cubic-bezier(0.22, 0.61, 0.36, 1)",
          opacity: fading ? 0 : 1,
          transitionProperty: fading ? "opacity, width" : "width",
          transitionDuration: fading ? "0.24s, 0.18s" : undefined,
        }}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>
    </div>
  );
}
