import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BADGE_DEFINITIONS } from "../../mocks/badges";
import { getAudioVolume } from "../../context/SettingsContext";

// ─────────────────────────────────────────────────────────────
// BadgeToast — Son + vibration haptique · volume depuis Settings
// ─────────────────────────────────────────────────────────────

interface ToastItem {
  key: string;
  badgeId: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
  visible: boolean;
}

const AUTO_DISMISS_MS = 4500;

// ── Son de célébration — volume depuis SettingsContext ──
function playCelebrationSound() {
  const vol = getAudioVolume();
  if (vol === 0) return;
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22 * vol, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.type = "triangle";
    shimmer.frequency.value = 1320;
    const t = ctx.currentTime + 0.5;
    shimmerGain.gain.setValueAtTime(0, t);
    shimmerGain.gain.linearRampToValueAtTime(0.12 * vol, t + 0.04);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    shimmer.start(t);
    shimmer.stop(t + 0.5);
  } catch (_e) {
    // AudioContext non disponible — silencieux
  }
}

// ── Vibration haptique mobile ──
function triggerHaptic() {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate([80, 40, 120, 40, 80]);
    }
  } catch (_e) {
    // Vibration non supportée
  }
}

export function BadgeToast() {
  const { newlyUnlockedBadges, clearNewBadges } = useAuth();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (newlyUnlockedBadges.length === 0) return;

    const newToasts: ToastItem[] = newlyUnlockedBadges
      .map((ub) => {
        const def = BADGE_DEFINITIONS.find((d) => d.id === ub.id);
        if (!def) return null;
        return {
          key: `${ub.id}_${ub.unlockedAt}`,
          badgeId: ub.id,
          emoji: def.emoji,
          label: def.label,
          description: def.description,
          color: def.color,
          visible: true,
        } satisfies ToastItem;
      })
      .filter(Boolean) as ToastItem[];

    if (newToasts.length === 0) return;

    // Son + haptique au premier badge
    playCelebrationSound();
    triggerHaptic();

    setToasts((prev) => [...prev, ...newToasts]);
    clearNewBadges();
  }, [newlyUnlockedBadges, clearNewBadges]);

  // Auto-dismiss
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts
      .filter((t) => t.visible)
      .map((t) =>
        setTimeout(() => {
          setToasts((prev) =>
            prev.map((x) => (x.key === t.key ? { ...x, visible: false } : x))
          );
          setTimeout(() => {
            setToasts((prev) => prev.filter((x) => x.key !== t.key));
          }, 400);
        }, AUTO_DISMISS_MS)
      );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  const dismiss = useCallback((key: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.key === key ? { ...t, visible: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.key !== key));
    }, 400);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.key}
          className={[
            "pointer-events-auto flex items-center gap-3 pr-3 pl-2 py-2.5 rounded-2xl",
            "border border-white/40 dark:border-white/10",
            "min-w-[250px] max-w-[310px]",
            "transition-all duration-400",
            toast.visible
              ? "opacity-100 translate-x-0 scale-100"
              : "opacity-0 translate-x-10 scale-95",
          ].join(" ")}
          style={{ backgroundColor: toast.color }}
        >
          {/* Shimmer ring autour de l'emoji */}
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping opacity-30" />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-white/60 relative z-10">
              {toast.emoji}
            </div>
          </div>

          {/* Texte */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 leading-none mb-0.5">
              🏆 Badge débloqué !
            </p>
            <p className="text-sm font-bold text-neutral-900 truncate">{toast.label}</p>
            <p className="text-xs text-neutral-600 leading-tight mt-0.5 line-clamp-1">
              {toast.description}
            </p>
          </div>

          {/* Fermer */}
          <button
            onClick={() => dismiss(toast.key)}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/15 transition-colors cursor-pointer shrink-0 ml-1"
            aria-label="Fermer"
          >
            <X size={12} className="text-neutral-600" />
          </button>
        </div>
      ))}
    </div>
  );
}
