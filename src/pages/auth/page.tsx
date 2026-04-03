import {
    AlertCircle,
    ArrowRight,
    Award,
    BookOpenCheck, Brain,
    CheckCircle,
    Eye, EyeOff,
    Flame,
    Lock,
    Mail,
    Moon,
    Sparkles,
    Sun,
    User,
    Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

type Mode = "login" | "register";

const WORDS = [
  { en: "Serendipity",  fr: "Sérendipité",       cat: "Philosophie" },
  { en: "Resilience",   fr: "Résilience",         cat: "Psychologie" },
  { en: "Wanderlust",   fr: "Envie de voyager",   cat: "Voyage" },
  { en: "Eloquent",     fr: "Éloquent",           cat: "Communication" },
  { en: "Perseverance", fr: "Persévérance",       cat: "Qualités" },
  { en: "Ephemeral",    fr: "Éphémère",           cat: "Philosophie" },
];

const STATS = [
  { value: "500+", label: "Flashcards" },
  { value: "4",    label: "Modes" },
  { value: "20+",  label: "Badges" },
];

const FEATURES = [
  { icon: BookOpenCheck, label: "Flashcards recto/verso", color: "text-sky-400" },
  { icon: Brain,         label: "Quiz QCM chronométré",   color: "text-emerald-400" },
  { icon: Zap,           label: "Révision intelligente",  color: "text-amber-400" },
  { icon: Award,         label: "Badges & trophées",      color: "text-orange-400" },
  { icon: Flame,         label: "Streak quotidien",       color: "text-rose-400" },
  { icon: CheckCircle,   label: "Suivi de progression",   color: "text-teal-400" },
];

export default function AuthPage() {
  const { login, register } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mode,     setMode]     = useState<Mode>("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [wordIdx,  setWordIdx]  = useState(0);
  const [fadeIn,   setFadeIn]   = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setFadeIn(true);
      }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    if (mode === "register" && !name.trim()) { setError("Veuillez entrer votre prénom."); return; }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return; }
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name.trim(), email, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const w = WORDS[wordIdx];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-slate-950">

      {/* ══════════════════════════════════════════
          PANNEAU GAUCHE — Showcase visuel
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-slate-950">

        {/* Fond gradient animé */}
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        {/* Grille de fond subtile */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex flex-col w-full px-12 py-10">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-auto cursor-pointer group">
            <div className="w-10 h-10 bg-sky-500/20 border border-sky-500/30 rounded-xl flex items-center justify-center overflow-hidden group-hover:bg-sky-500/30 transition-colors">
              <img
                src="https://public.readdy.ai/ai/img_res/dc3c08c6-47d6-4bc0-95c2-a64c6fefc6d3.png"
                alt="FlashCards EN"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">FlashCards EN</span>
          </Link>

          {/* Titre central */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            <div>
              <p className="text-sky-400 text-xs font-bold uppercase tracking-widest mb-3">
                Apprendre l&apos;anglais autrement
              </p>
              <h1 className="text-5xl font-extrabold text-white leading-[1.1] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                La méthode<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
                  qui fonctionne
                </span>
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                Flashcards, quiz, examens chronométrés, révision intelligente — tout ce qu&apos;il vous faut pour progresser rapidement.
              </p>
            </div>

            {/* Carte mot animée — flagship element */}
            <div
              className="relative w-full max-w-sm"
              style={{
                transition: "opacity 0.35s ease, transform 0.35s ease",
                opacity: fadeIn ? 1 : 0,
                transform: fadeIn ? "translateY(0)" : "translateY(10px)",
              }}
            >
              {/* Carte recto */}
              <div className="bg-white/8 backdrop-blur-md border border-white/12 rounded-3xl p-7 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-start justify-between mb-5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/8 rounded-full">
                    {w.cat}
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 opacity-60" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  </div>
                </div>
                <p className="text-4xl font-extrabold text-white mb-2 tracking-tight">{w.en}</p>
                <p className="text-slate-400 text-base">{w.fr}</p>
                <div className="flex gap-2 mt-6">
                  <div className="flex-1 h-1.5 bg-emerald-400 rounded-full" />
                  <div className="flex-1 h-1.5 bg-sky-400/40 rounded-full" />
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full" />
                </div>
                <p className="text-[10px] text-slate-600 mt-1.5">Maîtrise · Progression</p>
              </div>

              {/* Badge flottant streak */}
              <div className="absolute -top-3 -right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Flame size={12} /> 7 jours
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-3">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex-1 bg-white/5 border border-white/8 rounded-2xl px-4 py-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {FEATURES.map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white/4 border border-white/6 rounded-xl px-3 py-2.5 hover:bg-white/8 transition-colors">
                  <Icon size={15} className={color} />
                  <span className="text-xs text-slate-300 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-slate-700 text-xs pt-6">© 2025 FlashCards EN — Gratuit · Données locales · Aucune pub</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          PANNEAU DROIT — Formulaire
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative">

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5">
          {/* Logo mobile */}
          <Link to="/" className="lg:hidden flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900/40 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="https://public.readdy.ai/ai/img_res/dc3c08c6-47d6-4bc0-95c2-a64c6fefc6d3.png"
                alt="FlashCards EN"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="text-sm font-bold text-neutral-ink dark:text-slate-100">FlashCards EN</span>
          </Link>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2">
            {/* Dark toggle */}
            <button
              onClick={toggleTheme}
              className={[
                "w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer",
                isDark
                  ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                  : "bg-neutral-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600",
              ].join(" ")}
              aria-label="Basculer le thème"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>

        {/* Formulaire centré */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[380px]">

            {/* Titre */}
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-neutral-ink dark:text-slate-100 mb-1.5 flex items-center gap-2">
                {mode === "login" ? (
                  <><i className="ri-user-smile-line text-amber-400" /> Bon retour !</>
                ) : (
                  <><Sparkles size={22} className="text-sky-400" /> Créez votre compte</>
                )}
              </h2>
              <p className="text-sm text-neutral-muted dark:text-slate-400">
                {mode === "login"
                  ? "Reprenez là où vous en étiez."
                  : "Rejoignez des milliers d'apprenants dès maintenant."}
              </p>
            </div>

            {/* Tabs mode */}
            <div className="flex bg-neutral-100 dark:bg-slate-800 rounded-xl p-1 mb-7 gap-1">
              {(["login", "register"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  className={[
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap",
                    mode === m
                      ? "bg-white dark:bg-slate-700 text-neutral-ink dark:text-slate-100 shadow-sm"
                      : "text-neutral-muted dark:text-slate-400 hover:text-neutral-ink dark:hover:text-slate-200",
                  ].join(" ")}
                >
                  {m === "login" ? "Connexion" : "Inscription"}
                </button>
              ))}
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-neutral-ink dark:text-slate-200">Prénom</label>
                  <div className="relative flex items-center">
                    <User size={15} className="absolute left-3.5 text-neutral-muted dark:text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Ex : Marie"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="given-name"
                      className="w-full text-sm rounded-xl border px-4 py-3 pl-10 outline-none transition-all bg-neutral-50 dark:bg-slate-800 text-neutral-ink dark:text-slate-100 placeholder:text-neutral-300 dark:placeholder:text-slate-500 border-neutral-200 dark:border-slate-700 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-ink dark:text-slate-200">Email</label>
                <div className="relative flex items-center">
                  <Mail size={15} className="absolute left-3.5 text-neutral-muted dark:text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="w-full text-sm rounded-xl border px-4 py-3 pl-10 outline-none transition-all bg-neutral-50 dark:bg-slate-800 text-neutral-ink dark:text-slate-100 placeholder:text-neutral-300 dark:placeholder:text-slate-500 border-neutral-200 dark:border-slate-700 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-neutral-ink dark:text-slate-200">Mot de passe</label>
                <div className="relative flex items-center">
                  <Lock size={15} className="absolute left-3.5 text-neutral-muted dark:text-slate-400 pointer-events-none" />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="6 caractères minimum"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    className="w-full text-sm rounded-xl border px-4 py-3 pl-10 pr-11 outline-none transition-all bg-neutral-50 dark:bg-slate-800 text-neutral-ink dark:text-slate-100 placeholder:text-neutral-300 dark:placeholder:text-slate-500 border-neutral-200 dark:border-slate-700 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3.5 text-neutral-muted dark:text-slate-400 hover:text-neutral-ink dark:hover:text-slate-200 cursor-pointer transition-colors"
                    aria-label="Afficher/masquer le mot de passe"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-3.5 py-3 rounded-xl border border-rose-100 dark:border-rose-800/40">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-sky-500 hover:bg-sky-600 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Se connecter" : "Créer mon compte"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Switch mode */}
            <p className="text-center text-sm text-neutral-muted dark:text-slate-400 mt-5">
              {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
              <button
                onClick={() => { setMode((m) => m === "login" ? "register" : "login"); setError(""); }}
                className="text-sky-600 dark:text-sky-400 font-bold hover:underline cursor-pointer"
              >
                {mode === "login" ? "S'inscrire gratuitement" : "Se connecter"}
              </button>
            </p>

            {/* Séparateur + social proof */}
            <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-4">
                {FEATURES.slice(0, 3).map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 group cursor-default">
                    <div className="w-10 h-10 flex items-center justify-center bg-neutral-50 dark:bg-slate-800 border border-neutral-100 dark:border-slate-700 rounded-xl group-hover:scale-105 transition-transform">
                      <Icon size={18} className={color} />
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-slate-500 font-medium text-center leading-tight max-w-[60px]">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-neutral-300 dark:text-slate-600 mt-4">
                100% gratuit · Données stockées localement · Aucune pub
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
