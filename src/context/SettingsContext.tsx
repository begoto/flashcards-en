import {
  createContext, useContext, useState, useEffect, useCallback, type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────
// SettingsContext — Volume, sons, langue — persistance localStorage
// ─────────────────────────────────────────────────────────────

export interface AppSettings {
  volume: number;        // 0 à 1
  soundEnabled: boolean;
  language: "fr";        // Seul "fr" supporté actuellement
}

interface SettingsContextValue extends AppSettings {
  setVolume: (v: number) => void;
  setSoundEnabled: (v: boolean) => void;
  setLanguage: (v: "fr") => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const SETTINGS_KEY = "flashcards_settings";

const DEFAULT_SETTINGS: AppSettings = {
  volume: 0.8,
  soundEnabled: true,
  language: "fr",
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (_e) {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const save = useCallback((next: AppSettings) => {
    setSettings(next);
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } catch (_e) { /* ignore */ }
  }, []);

  // Sync si une autre onglet modifie localStorage
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) setSettings(loadSettings());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setVolume       = useCallback((v: number) => save({ ...settings, volume: Math.max(0, Math.min(1, v)) }), [settings, save]);
  const setSoundEnabled = useCallback((v: boolean) => save({ ...settings, soundEnabled: v }), [settings, save]);
  const setLanguage     = useCallback((v: "fr") => save({ ...settings, language: v }), [settings, save]);

  return (
    <SettingsContext.Provider value={{ ...settings, setVolume, setSoundEnabled, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}

/** Utilitaire utilisable hors composant React (fonctions sons) */
export function getAudioVolume(): number {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS.volume;
    const s = JSON.parse(raw) as Partial<AppSettings>;
    if (s.soundEnabled === false) return 0;
    return typeof s.volume === "number" ? Math.max(0, Math.min(1, s.volume)) : DEFAULT_SETTINGS.volume;
  } catch (_e) {
    return DEFAULT_SETTINGS.volume;
  }
}
