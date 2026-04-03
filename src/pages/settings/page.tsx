import { useState, useCallback } from "react";
import {
  Palette, Volume2, Globe, Database, Info,
  Sun, Moon, VolumeX, Volume1, Check, RefreshCw,
  AlertTriangle, ChevronRight, Play, Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/base/Button";
import { Modal } from "../../components/base/Modal";
import { useTheme } from "../../context/ThemeContext";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────────────────────
// Page Paramètres — Apparence · Sons · Langue · Données
// ─────────────────────────────────────────────────────────────

// ── Toggle switch ──────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={[
        "relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed",
        checked ? "bg-[#87CEEB] dark:bg-sky-500" : "bg-neutral-300 dark:bg-slate-600",
      ].join(" ")}
    >
      <span className={[
        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200",
        checked ? "translate-x-5" : "translate-x-0",
      ].join(" ")} />
    </button>
  );
}

// ── Section card ───────────────────────────────────────────
function Section({
  icon: Icon, title, iconColor, iconBg, children,
}: {
  icon: React.ElementType;
  title: string;
  iconColor: string;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-neutral-line dark:border-slate-700 overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-line dark:border-slate-700">
        <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${iconBg}`}>
          <Icon size={16} className={iconColor} />
        </div>
        <h2 className="text-sm font-bold text-neutral-ink dark:text-slate-200">{title}</h2>
      </div>
      <div className="divide-y divide-neutral-line dark:divide-slate-700">{children}</div>
    </div>
  );
}

// ── Row setting ────────────────────────────────────────────
function SettingRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200">{label}</p>
        {sub && <p className="text-xs text-neutral-muted dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ── Preview son ────────────────────────────────────────────
function playPreviewSound(volume: number) {
  if (volume === 0) return;
  try {
    const ctx = new AudioContext();
    const notes: [number, number][] = [[523.25, 0], [659.25, 0.12], [783.99, 0.24]];
    notes.forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18 * volume, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch (_e) { /* ignore */ }
}

// ── Types reset ────────────────────────────────────────────
type ResetTarget =
  | "examScores"
  | "quizScores"
  | "cardStats"
  | "badges"
  | "dailyChallenges"
  | "all";

interface ResetOption {
  key: ResetTarget;
  label: string;
  sub: string;
  color: string;
  targets: Array<"examScores" | "quizScores" | "cardStats" | "badges" | "dailyChallenges">;
}

const RESET_OPTIONS: ResetOption[] = [
  { key: "examScores",      label: "Scores d'examen",         sub: "Efface tout l'historique des examens",                     color: "text-orange-600",  targets: ["examScores"] },
  { key: "quizScores",      label: "Scores de quiz",          sub: "Efface tout l'historique des quiz et récompenses",          color: "text-amber-600",   targets: ["quizScores"] },
  { key: "cardStats",       label: "Progression des cartes",  sub: "Réinitialise la maîtrise et révision intelligente",         color: "text-violet-600",  targets: ["cardStats"] },
  { key: "dailyChallenges", label: "Défis du jour",           sub: "Efface l'historique des défis quotidiens",                  color: "text-emerald-600", targets: ["dailyChallenges"] },
  { key: "badges",          label: "Badges & Récompenses",    sub: "Supprime tous les badges débloqués",                        color: "text-rose-600",    targets: ["badges"] },
  { key: "all",             label: "Tout réinitialiser",      sub: "Supprime TOUTES les données — action irréversible",         color: "text-red-600",     targets: ["examScores", "quizScores", "cardStats", "badges", "dailyChallenges"] },
];

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { volume, soundEnabled, setVolume, setSoundEnabled } = useSettings();
  const { user, resetUserData } = useAuth();

  const [resetTarget, setResetTarget] = useState<ResetOption | null>(null);
  const [resetDone,   setResetDone]   = useState<string | null>(null);

  const confirmReset = useCallback(() => {
    if (!resetTarget) return;
    resetUserData(resetTarget.targets);
    setResetDone(resetTarget.label);
    setResetTarget(null);
    setTimeout(() => setResetDone(null), 3000);
  }, [resetTarget, resetUserData]);

  const volumePct = Math.round(volume * 100);

  const VolumeIcon = volume === 0 || !soundEnabled ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-ink dark:text-slate-100">Paramètres</h1>
          <p className="text-sm text-neutral-muted dark:text-slate-400 mt-0.5">Personnalisez votre expérience</p>
        </div>
      </div>

      {/* Toast de confirmation reset */}
      {resetDone && (
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-xl px-4 py-3 mb-5">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/50 shrink-0">
            <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            « {resetDone} » réinitialisé avec succès.
          </p>
        </div>
      )}

      {/* ── Section Apparence ── */}
      <Section icon={Palette} title="Apparence" iconColor="text-violet-600" iconBg="bg-violet-100 dark:bg-violet-900/30">
        <SettingRow label="Mode sombre" sub="Réduit la luminosité pour travailler le soir">
          <Toggle checked={isDark} onChange={() => toggleTheme()} />
        </SettingRow>
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200">Thème actuel</p>
            <p className="text-xs text-neutral-muted dark:text-slate-500 mt-0.5">
              {isDark ? "Mode sombre activé" : "Mode clair activé"}
            </p>
          </div>
          <div className={[
            "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold",
            isDark
              ? "bg-slate-700 text-yellow-400"
              : "bg-[#C9E8F6] text-[#1A7BAD]",
          ].join(" ")}>
            {isDark ? <Moon size={13} /> : <Sun size={13} />}
            {isDark ? "Sombre" : "Clair"}
          </div>
        </div>
      </Section>

      {/* ── Section Sons ── */}
      <Section icon={Volume2} title="Sons" iconColor="text-[#1A7BAD]" iconBg="bg-[#EDF7FD] dark:bg-sky-900/30">
        <SettingRow label="Activer les sons" sub="Sons de réponse et notifications de badge">
          <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
        </SettingRow>

        {/* Volume slider */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={["text-sm font-semibold", !soundEnabled ? "text-neutral-muted dark:text-slate-500" : "text-neutral-ink dark:text-slate-200"].join(" ")}>
                Volume
              </p>
              <p className="text-xs text-neutral-muted dark:text-slate-500 mt-0.5">
                {!soundEnabled ? "Activez les sons pour régler le volume" : `${volumePct}%`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <VolumeIcon size={16} className={soundEnabled ? "text-neutral-muted dark:text-slate-400" : "text-neutral-300 dark:text-slate-600"} />
              </div>
              <button
                onClick={() => playPreviewSound(soundEnabled ? volume : 0)}
                disabled={!soundEnabled}
                className={[
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap",
                  soundEnabled
                    ? "bg-[#C9E8F6] dark:bg-sky-900/40 text-[#1A7BAD] dark:text-sky-400 hover:bg-[#87CEEB] dark:hover:bg-sky-800/40"
                    : "bg-neutral-100 dark:bg-slate-700 text-neutral-300 dark:text-slate-600 cursor-not-allowed",
                ].join(" ")}
                aria-label="Tester le son"
              >
                <Play size={11} /> Test
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={volumePct}
              disabled={!soundEnabled}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: soundEnabled
                  ? `linear-gradient(to right, #87CEEB ${volumePct}%, ${isDark ? "#334155" : "#E5E7EB"} ${volumePct}%)`
                  : (isDark ? "#334155" : "#E5E7EB"),
              }}
            />
            {/* Marqueurs de volume */}
            <div className="flex justify-between mt-1.5 px-0.5">
              {[0, 25, 50, 75, 100].map((v) => (
                <span key={v} className="text-[9px] text-neutral-muted dark:text-slate-600 font-semibold">{v}%</span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Section Langue ── */}
      <Section icon={Globe} title="Langue" iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-900/20">
        <SettingRow label="Langue de l'interface" sub="Langue utilisée dans toute l'application">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
            🇫🇷 Français
          </div>
        </SettingRow>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between rounded-xl border border-dashed border-neutral-200 dark:border-slate-600 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">🇬🇧</span>
              <div>
                <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200">English</p>
                <p className="text-xs text-neutral-muted dark:text-slate-500">Traduction de l'interface</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full whitespace-nowrap">
              Prochainement
            </span>
          </div>
        </div>
      </Section>

      {/* ── Section Données ── */}
      <Section icon={Database} title="Données & Statistiques" iconColor="text-rose-600" iconBg="bg-rose-50 dark:bg-rose-900/20">
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl px-4 py-3">
            <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Certaines actions (comme supprimer ton compte) sont <strong>irréversibles</strong>. Mais, vos données sont stockées en ligne — tu ne les perds pas même  si tu changes d'appareil.
            </p>
          </div>
        </div>

        {RESET_OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${opt.key === "all" ? "text-red-600 dark:text-red-400" : "text-neutral-ink dark:text-slate-200"}`}>
                {opt.key === "all" && <span className="mr-1">🗑️</span>}
                {opt.label}
              </p>
              <p className="text-xs text-neutral-muted dark:text-slate-500 mt-0.5">{opt.sub}</p>
            </div>
            <button
              onClick={() => setResetTarget(opt)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap border",
                opt.key === "all"
                  ? "border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  : "border-neutral-200 dark:border-slate-600 text-neutral-muted dark:text-slate-400 hover:border-rose-200 dark:hover:border-rose-700/40 hover:text-rose-600 dark:hover:text-rose-400",
              ].join(" ")}
              aria-label={`Réinitialiser ${opt.label}`}
            >
              <RefreshCw size={11} /> Réinitialiser
            </button>
          </div>
        ))}
      </Section>

      {/* ── Section Compte & Infos ── */}
      <Section icon={Info} title="À propos" iconColor="text-neutral-muted dark:text-slate-400" iconBg="bg-neutral-100 dark:bg-slate-700">
        <SettingRow label="Version" sub="FlashCards EN">
          <span className="text-xs font-bold text-neutral-muted dark:text-slate-400 bg-neutral-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
            v1.0
          </span>
        </SettingRow>
        <SettingRow label="Stockage" sub="Données enregistrées dans votre navigateur">
          <span className="text-xs font-semibold text-[#1A7BAD] dark:text-sky-400">En ligne</span>
        </SettingRow>
        {user && (
          <SettingRow label="Compte actif" sub={user.email}>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
              Connecté
            </span>
          </SettingRow>
        )}
        <div className="px-5 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-ink dark:text-slate-200">Mon profil</p>
            <p className="text-xs text-neutral-muted dark:text-slate-500 mt-0.5">Modifier le nom, l'avatar, voir les badges</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-1 text-xs font-bold text-[#1A7BAD] dark:text-sky-400 hover:underline whitespace-nowrap"
          >
            Voir le profil <ChevronRight size={13} />
          </Link>
        </div>
      </Section>

      {/* ── Modal de confirmation reset ── */}
      <Modal
        isOpen={resetTarget !== null}
        onClose={() => setResetTarget(null)}
        title="Confirmer la réinitialisation"
        maxWidth="sm"
      >
        {resetTarget && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-4">
              <Trash2 size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">
                  Supprimer : {resetTarget.label}
                </p>
                <p className="text-xs text-red-600 dark:text-red-500 mt-1">{resetTarget.sub}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-muted dark:text-slate-400">
              Cette action est <strong className="text-neutral-ink dark:text-slate-200">définitive</strong> et ne peut pas être annulée.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setResetTarget(null)}>Annuler</Button>
              <Button variant="wrong" fullWidth onClick={confirmReset} className="gap-1.5">
                <Trash2 size={14} /> Confirmer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
