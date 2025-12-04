# 🏆 Podium Live - Classement d'équipes gamifié

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite" alt="SQLite" />
  <img src="https://img.shields.io/badge/WCAG-AA+-green?style=for-the-badge" alt="Accessible" />
</p>

<p align="center">
  Application de classement d'équipes en temps réel avec animations, gamification et accessibilité maximale.<br/>
  <strong>Créée pour la Nuit de l'Info 2024</strong>
</p>

---

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation et Lancement](#-installation-et-lancement)
- [Identifiants Admin](#-identifiants-admin)
- [Structure du projet](#-structure-du-projet)
- [Accessibilité](#-accessibilité-wcag-aa)
- [Personnalisation](#-personnalisation)

---

## ✨ Fonctionnalités

### 🎯 Temps Réel Simulé
- **Polling SWR** : Rafraîchissement automatique toutes les 2 secondes
- **Pas de WebSocket nécessaire** : Simple et efficace
- **Synchronisation multi-onglets** : Les changements sont visibles partout

### 🎮 Gamification & WOW Effect
- **Podium visuel 3D** : TOP 3 avec design Glassmorphism
- **Confettis** : Explosion de confettis quand le leader change !
- **Badges de médailles** : 🥇 🥈 🥉 pour le podium
- **Animations fluides** : Framer Motion avec `layoutId` pour les transitions

### 🔐 Admin Sécurisé
- **Basic Auth** : Protection par identifiants
- **Gestion complète** : Ajouter, modifier, supprimer des équipes
- **Boutons rapides** : +10, +50, -10, Reset
- **Toast notifications** : Feedback visuel instantané

### ♿ Accessibilité WCAG AA+
- **Navigation clavier** : 100% accessible
- **Lecteurs d'écran** : `aria-live` pour les annonces vocales
- **Contraste élevé** : Textes lisibles sur tous les fonds
- **Bouton animations** : Désactivation pour `prefers-reduced-motion`
- **Skip to content** : Lien d'accès rapide au contenu

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │   SWR       │  │   Framer Motion     │  │
│  │   App Router│  │   Polling   │  │   Animations        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         └────────────────┼────────────────────┘              │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │  API Route │                            │
│                    │  /api/teams│                            │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                     BACKEND                                  │
│                    ┌─────▼─────┐                            │
│                    │  Prisma   │                            │
│                    │   ORM     │                            │
│                    └─────┬─────┘                            │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │  SQLite   │                            │
│                    │  dev.db   │                            │
│                    └───────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### Stack Technique

| Technologie | Rôle | Version |
|-------------|------|---------|
| **Next.js** | Framework React full-stack | 14.x |
| **TypeScript** | Typage statique | 5.x |
| **Prisma** | ORM et migrations | 5.x |
| **SQLite** | Base de données locale | - |
| **Tailwind CSS** | Styling utility-first | 3.x |
| **Framer Motion** | Animations | 10.x |
| **SWR** | Data fetching & caching | 2.x |
| **Sonner** | Toast notifications | - |
| **Lucide React** | Icônes | - |

---

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ installé
- npm ou yarn

### Étapes

```bash
# 1. Se déplacer dans le projet
cd podium-app

# 2. Installer les dépendances
npm install

# 3. Initialiser la base de données SQLite
npx prisma db push

# 4. Peupler avec 10 équipes de test
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

### URLs de l'application

| Page | URL | Description |
|------|-----|-------------|
| **Leaderboard** | http://localhost:3000 | Page publique du podium |
| **Admin** | http://localhost:3000/admin | Gestion des équipes (protégé) |

---

## 🔐 Identifiants Admin

> ⚠️ **IMPORTANT POUR LE JURY**

Pour accéder à la page d'administration (`/admin`), utilisez :

| Champ | Valeur |
|-------|--------|
| **Utilisateur** | `admin` |
| **Mot de passe** | `password123` |

Le navigateur affichera une popup d'authentification Basic Auth.

---

## 📁 Structure du projet

```
podium-app/
├── prisma/
│   ├── schema.prisma       # Modèle Team (id, name, score, avatar)
│   ├── seed.ts             # 10 équipes fictives drôles
│   └── dev.db              # Base SQLite (générée)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Layout avec Toaster
│   │   ├── page.tsx        # Leaderboard avec confettis
│   │   ├── globals.css     # Styles Tailwind + animations
│   │   ├── admin/
│   │   │   └── page.tsx    # Admin avec Grid et Toasts
│   │   └── api/
│   │       └── teams/
│   │           └── route.ts # API GET pour SWR
│   │
│   ├── components/
│   │   ├── Podium.tsx      # TOP 3 Glassmorphism
│   │   ├── TeamList.tsx    # Liste animée
│   │   ├── AdminTeamCard.tsx
│   │   └── AddTeamForm.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts       # Client singleton
│   │   ├── actions.ts      # Server Actions
│   │   └── utils.ts        # cn() helper
│   │
│   └── middleware.ts       # Basic Auth pour /admin
│
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## ♿ Accessibilité (WCAG AA+)

Cette application respecte les standards d'accessibilité :

| Critère | Implementation |
|---------|----------------|
| **Navigation clavier** | Tous les éléments interactifs sont focusables |
| **Skip to content** | Lien caché en haut de page |
| **Annonces vocales** | `aria-live="polite"` sur le classement |
| **Reduced motion** | Bouton pour désactiver les animations |
| **Contraste** | Ratio minimum 4.5:1 respecté |
| **Sémantique** | Balises `<main>`, `<section>`, `<h1>`-`<h3>` |
| **Labels** | Tous les boutons ont des `aria-label` |

---

## 🎨 Personnalisation

### Modifier les équipes de départ

```typescript
// prisma/seed.ts
const teamsData = [
  { name: "Mon Équipe", score: 100, avatar: "🚀" },
  // Ajouter d'autres équipes...
]
```

Puis : `npm run db:seed`

### Changer l'intervalle de polling

```typescript
// src/app/page.tsx
useSWR<Team[]>("/api/teams", fetcher, {
  refreshInterval: 2000, // Millisecondes
})
```

### Modifier les identifiants admin

```typescript
// src/middleware.ts
const ADMIN_USER = "admin"
const ADMIN_PASSWORD = "password123"
```

---

## 🔧 Commandes utiles

```bash
npm run dev        # Développement
npm run build      # Build production
npm start          # Production
npm run db:seed    # Re-seeder la base
npm run db:studio  # Interface Prisma Studio
```

---

## 🎯 Fonctionnalités pour le Jury

1. **Ouvrez 2 onglets** : Un sur `/` et un sur `/admin`
2. **Modifiez un score** dans l'admin
3. **Observez** la mise à jour en temps réel sur le leaderboard
4. **Faites passer une équipe en tête** → Confettis ! 🎉
5. **Testez l'accessibilité** : Navigation Tab, bouton "Anims OFF"

---

## 📝 Licence

Projet open-source créé pour la **Nuit de l'Info 2024**.

---

<p align="center">
  Made with ❤️, ☕ and 🎉 for la Nuit de l'Info
</p>
