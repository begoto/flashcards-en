# FlashCards EN — Application d'apprentissage de l'anglais

Application React de flashcards pour apprendre le vocabulaire anglais, avec quiz, examens, révision intelligente, défi du jour et système de badges.

## Démarrage rapide

### Prérequis
- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone <url-du-repo>
cd flashcards-en
npm install
npm run dev
```

L'app démarre sur **http://localhost:5173**

## Base de données

**Aucune base de données externe requise.** Toutes les données sont stockées dans le `localStorage` du navigateur :
- Comptes utilisateurs (`flashcards_users`)
- Session active (`flashcards_session`)
- Mots de passe chiffrés en base64 (`pwd_<id>`)

Pour réinitialiser : ouvrir DevTools → Application → Local Storage → tout supprimer.

## Fonctionnalités

| Mode | Description |
|------|-------------|
| **Étude** | Flashcards 3D, filtres niveau/catégorie, cartes ratées en fin |
| **Quiz** | QCM chronométré, filtre catégorie, récompenses |
| **Examen** | 20 questions, score final |
| **Révision Intelligente** | Priorité aux cartes les plus ratées |
| **Défi du Jour** | 5 cartes aléatoires déterministes par jour |
| **Dashboard** | Stats, streak, maîtrise par catégorie, badges |
| **Profil** | Avatar, tous les badges, statistiques détaillées |

## Build production

```bash
npm run build
npm run preview
```

## Stack technique

- React 19 + TypeScript + Vite
- TailwindCSS
- React Router v6
- Lucide React (icônes)
- localStorage (persistance)
