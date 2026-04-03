import { useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  BookMarked,
  Search,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/base/Button";
import { Input } from "../../components/base/Input";
import { Modal } from "../../components/base/Modal";
import { Badge } from "../../components/base/Badge";
import { useAuth } from "../../context/AuthContext";
import type { Flashcard, Level } from "../../types";

// ─────────────────────────────────────────────────────────────
// Page "Mes Cartes" — Espace dédié à la gestion des cartes
// personnalisées de l'utilisateur (CRUD complet).
// Les cartes créées ici sont fusionnées dans tous les modes
// d'apprentissage (Étude, Quiz, Examen).
// ─────────────────────────────────────────────────────────────

const LEVELS: { key: Level; label: string; badgeVariant: "sky" | "gold" | "gray" }[] = [
  { key: "beginner",     label: "Débutant",      badgeVariant: "sky" },
  { key: "intermediate", label: "Intermédiaire", badgeVariant: "gold" },
  { key: "advanced",     label: "Avancé",        badgeVariant: "gray" },
];

const CATEGORIES = [
  "Greetings","Animals","Food & Drink","Colors","Numbers","Family",
  "Body Parts","Verbs","Adjectives","Travel","Work","Technology","Nature",
  "Phrases","Idioms","Advanced",
];

/** Carte vide pour initialiser le formulaire */
const EMPTY_FORM: Omit<Flashcard, "id"> = {
  english: "",
  french: "",
  phonetic: "",
  level: "beginner",
  category: "Greetings",
  example: "",
  exampleFr: "",
};

/** Génère un identifiant unique pour une nouvelle carte */
const uid = () => Math.random().toString(36).slice(2, 11);

export default function MyCardsPage() {
  const { user, addCustomCard, updateCustomCard, deleteCustomCard } = useAuth();

  const customCards = user?.customCards ?? [];

  // ─── Filtres ───
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<Level | "all">("all");

  // ─── Modals ───
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Flashcard | null>(null);

  // ─── Formulaire ───
  const [form, setForm] = useState<Omit<Flashcard, "id">>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  /** Cartes filtrées selon la recherche et le niveau */
  const filtered = useMemo(() => {
    return customCards.filter((c) => {
      const matchLevel = filterLevel === "all" || c.level === filterLevel;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.english.toLowerCase().includes(q) ||
        c.french.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchLevel && matchSearch;
    });
  }, [customCards, search, filterLevel]);

  // ─── Soumission du formulaire (ajout ou modification) ───
  const handleSubmit = () => {
    setFormError("");
    if (!form.english.trim() || !form.french.trim()) {
      setFormError("Le mot anglais et sa traduction française sont obligatoires.");
      return;
    }
    if (editCard) {
      // Mise à jour d'une carte existante
      updateCustomCard({ ...form, id: editCard.id } as Flashcard);
      setEditCard(null);
    } else {
      // Ajout d'une nouvelle carte avec un ID unique
      addCustomCard({ ...form, id: uid() } as Flashcard);
      setShowAddModal(false);
    }
    setForm(EMPTY_FORM);
    setFormError("");
  };

  /** Ouvre le formulaire de modification pré-rempli */
  const openEdit = (card: Flashcard) => {
    const { id, ...rest } = card;
    setEditCard(card);
    setForm(rest);
    setFormError("");
  };

  /** Confirme et exécute la suppression */
  const confirmDelete = () => {
    if (deleteTarget) {
      deleteCustomCard(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  const closeEditModal = () => {
    setEditCard(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  // ─────────────────────────────────────────────────────────
  // Rendu principal
  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24 md:pb-8">

      {/* ─── En-tête ─── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#C9E8F6]">
            <BookMarked size={20} className="text-[#1A7BAD]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-neutral-ink">
              Mes Cartes
            </h1>
            <p className="text-sm text-neutral-muted">
              {customCards.length} carte{customCards.length !== 1 ? "s" : ""} personnalisée{customCards.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => { setForm(EMPTY_FORM); setShowAddModal(true); }}
          className="gap-2 whitespace-nowrap"
        >
          <Plus size={16} /> Nouvelle carte
        </Button>
      </div>

      {/* ─── Barre de filtres ─── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Recherche texte */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un mot..."
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-neutral-line outline-none focus:border-[#87CEEB] bg-white dark:bg-slate-800 text-neutral-ink placeholder:text-neutral-muted"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-muted hover:text-neutral-ink cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtre par niveau */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterLevel("all")}
            className={[
              "px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap",
              filterLevel === "all"
                ? "bg-[#87CEEB] text-white"
                : "bg-white dark:bg-slate-800 border border-neutral-line text-neutral-muted hover:border-[#87CEEB]",
            ].join(" ")}
          >
            Tous
          </button>
          {LEVELS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterLevel(key)}
              className={[
                "px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap",
                filterLevel === key
                  ? "bg-[#87CEEB] text-white"
                  : "bg-white dark:bg-slate-800 border border-neutral-line text-neutral-muted hover:border-[#87CEEB]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── État vide ─── */}
      {customCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#E8F6FD] mb-4">
            <BookMarked size={28} className="text-[#87CEEB]" />
          </div>
          <h2 className="text-lg font-bold font-display text-neutral-ink mb-1">
            Aucune carte personnalisée
          </h2>
          <p className="text-sm text-neutral-muted max-w-xs mb-5">
            Créez vos propres cartes pour enrichir votre apprentissage. Elles seront disponibles dans tous les modes.
          </p>
          <Button variant="primary" size="md" onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus size={16} /> Créer ma première carte
          </Button>
        </div>
      )}

      {/* ─── Résultats filtrés vides ─── */}
      {customCards.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={32} className="text-neutral-muted mb-3 opacity-40" />
          <p className="text-sm text-neutral-muted">Aucune carte ne correspond à votre recherche.</p>
          <button
            onClick={() => { setSearch(""); setFilterLevel("all"); }}
            className="text-sm text-[#5BAED6] font-semibold mt-2 hover:underline cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ─── Grille de cartes ─── */}
      {filtered.length > 0 && (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {filtered.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onEdit={() => openEdit(card)}
              onDelete={() => setDeleteTarget(card)}
            />
          ))}
        </div>
      )}

      {/* ─── Modal Ajouter une carte ─── */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title="Ajouter une carte"
      >
        <CardForm
          form={form}
          onChange={setForm}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={closeAddModal}
          submitLabel="Ajouter la carte"
        />
      </Modal>

      {/* ─── Modal Modifier une carte ─── */}
      <Modal
        isOpen={!!editCard}
        onClose={closeEditModal}
        title="Modifier la carte"
      >
        <CardForm
          form={form}
          onChange={setForm}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={closeEditModal}
          submitLabel="Sauvegarder"
        />
      </Modal>

      {/* ─── Modal Confirmation de suppression ─── */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer la carte"
        maxWidth="sm"
      >
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50">
            <AlertTriangle size={22} className="text-[#EF4444]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-ink">
              Supprimer &ldquo;{deleteTarget?.english}&rdquo; ?
            </p>
            <p className="text-xs text-neutral-muted mt-1">
              Cette action est irréversible.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="md" fullWidth onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="wrong" size="md" fullWidth onClick={confirmDelete} className="gap-1.5">
            <Trash2 size={14} /> Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CardItem — Affiche une carte personnalisée avec actions
// ─────────────────────────────────────────────────────────────
interface CardItemProps {
  card: Flashcard;
  onEdit: () => void;
  onDelete: () => void;
}

function CardItem({ card, onEdit, onDelete }: CardItemProps) {
  const levelColors: Record<Level, string> = {
    beginner:     "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700/40",
    intermediate: "bg-[#E8F6FD] dark:bg-sky-900/30 text-[#1A7BAD] dark:text-sky-400 border-[#C9E8F6] dark:border-sky-700/40",
    advanced:     "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700/40",
  };
  const levelLabels: Record<Level, string> = {
    beginner:     "Débutant",
    intermediate: "Intermédiaire",
    advanced:     "Avancé",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-neutral-line p-4 flex flex-col gap-2 hover:border-[#87CEEB] transition-colors">
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-neutral-ink truncate">{card.english}</p>
          <p className="text-sm text-neutral-muted truncate">{card.french}</p>
          {card.phonetic && (
            <p className="text-xs text-[#5BAED6] mt-0.5 font-mono">{card.phonetic}</p>
          )}
        </div>
        {/* Boutons d'action */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#C9E8F6] text-neutral-muted hover:text-[#1A7BAD] transition-colors cursor-pointer"
            aria-label="Modifier"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-neutral-muted hover:text-[#EF4444] transition-colors cursor-pointer"
            aria-label="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Exemple */}
      {card.example && (
        <p className="text-xs text-neutral-muted italic border-t border-neutral-line pt-2 truncate">
          &ldquo;{card.example}&rdquo;
        </p>
      )}

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap pt-0.5">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${levelColors[card.level]}`}>
          {levelLabels[card.level]}
        </span>
        <span className="text-xs text-neutral-muted bg-neutral-soft px-2 py-0.5 rounded-full">
          {card.category}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CardForm — Formulaire partagé pour l'ajout et la modification
// ─────────────────────────────────────────────────────────────
interface CardFormProps {
  form: Omit<Flashcard, "id">;
  onChange: (f: Omit<Flashcard, "id">) => void;
  error: string;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

function CardForm({ form, onChange, error, onSubmit, onCancel, submitLabel }: CardFormProps) {
  /** Raccourci pour modifier un champ du formulaire */
  const set = (k: keyof Omit<Flashcard, "id">, v: string) =>
    onChange({ ...form, [k]: v });

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Mot en anglais *"
        value={form.english}
        onChange={(e) => set("english", e.target.value)}
        placeholder="Ex: Beautiful"
      />
      <Input
        label="Traduction française *"
        value={form.french}
        onChange={(e) => set("french", e.target.value)}
        placeholder="Ex: Beau / Belle"
      />
      <Input
        label="Phonétique"
        value={form.phonetic}
        onChange={(e) => set("phonetic", e.target.value)}
        placeholder="Ex: /ˈbjuːtɪfl/"
      />
      <Input
        label="Exemple (anglais)"
        value={form.example}
        onChange={(e) => set("example", e.target.value)}
        placeholder="Ex: What a beautiful day!"
      />
      <Input
        label="Traduction de l'exemple"
        value={form.exampleFr}
        onChange={(e) => set("exampleFr", e.target.value)}
        placeholder="Ex: Quelle belle journée !"
      />

      {/* Niveau + Catégorie côte à côte */}
      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-semibold text-neutral-ink">Niveau</label>
          <select
            value={form.level}
            onChange={(e) => set("level", e.target.value)}
            className="w-full text-sm rounded-lg border border-neutral-line px-3 py-2.5 outline-none focus:border-[#87CEEB] bg-white dark:bg-slate-800 text-neutral-ink cursor-pointer"
          >
            <option value="beginner">Débutant</option>
            <option value="intermediate">Intermédiaire</option>
            <option value="advanced">Avancé</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-semibold text-neutral-ink">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full text-sm rounded-lg border border-neutral-line px-3 py-2.5 outline-none focus:border-[#87CEEB] bg-white dark:bg-slate-800 text-neutral-ink cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}

      <div className="flex gap-3 mt-1">
        <Button variant="secondary" size="md" fullWidth onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="primary" size="md" fullWidth onClick={onSubmit} className="gap-1.5">
          <Save size={14} /> {submitLabel}
        </Button>
      </div>
    </div>
  );
}
