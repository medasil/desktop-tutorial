"use client"

import { useState, useEffect, useTransition } from "react"
import useSWR from "swr"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Trophy,
  RefreshCw,
  Home,
  RotateCcw,
  Loader2,
  AlertTriangle,
  Shield,
  Users,
  Zap,
  Lock,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { AdminTeamCard } from "@/components/AdminTeamCard"
import { AddTeamForm } from "@/components/AddTeamForm"
import { resetScores } from "@/lib/actions"
import type { Team } from "@/lib/actions"

// Identifiants admin
const ADMIN_USER = "admin"
const ADMIN_PASSWORD = "password123"
const AUTH_KEY = "podium_admin_auth"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const auth = sessionStorage.getItem(AUTH_KEY)
    if (auth === "true") {
      setIsAuthenticated(true)
    }
    setIsCheckingAuth(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "true")
      setIsAuthenticated(true)
      setAuthError("")
      toast.success("Connexion réussie !", { icon: "🔓" })
    } else {
      setAuthError("Identifiants incorrects")
      toast.error("Identifiants incorrects")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    setUsername("")
    setPassword("")
    toast.info("Déconnecté")
  }

  const { data: teams, error, isLoading, mutate } = useSWR<Team[]>(
    isAuthenticated ? "/api/teams" : null,
    fetcher,
    {
      refreshInterval: 3000,
    }
  )

  const [isResetting, startResetTransition] = useTransition()

  const handleResetAll = () => {
    if (
      confirm(
        "⚠️ Êtes-vous sûr de vouloir réinitialiser TOUS les scores à zéro ?"
      )
    ) {
      startResetTransition(async () => {
        await resetScores()
        mutate()
        toast.success("Tous les scores ont été réinitialisés !", {
          icon: "🔄",
        })
      })
    }
  }

  // Handler pour les mises à jour avec toast
  const handleTeamUpdate = () => {
    mutate()
    toast.success("Score mis à jour !", {
      icon: "⚡",
      duration: 2000,
    })
  }

  // Handler pour ajout d'équipe avec toast
  const handleTeamAdded = () => {
    mutate()
    toast.success("Nouvelle équipe ajoutée !", {
      icon: "🎉",
    })
  }

  // Écran de chargement pendant la vérification auth
  if (isCheckingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </main>
    )
  }

  // Formulaire de connexion
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-yellow-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
              <p className="text-gray-400 text-sm mt-1">
                Connectez-vous pour accéder à l'administration
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>

              {authError && (
                <p className="text-red-400 text-sm text-center">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Se connecter
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-xs text-gray-500">
                Identifiants : <code className="bg-gray-700 px-1 rounded">admin</code> / <code className="bg-gray-700 px-1 rounded">password123</code>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-blue-400 hover:underline text-sm">
                ← Retour au podium
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" role="main">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">
            Erreur de connexion
          </h1>
          <p className="text-gray-300 mb-4">
            Impossible de charger les données.
          </p>
          <button
            onClick={() => mutate()}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Réessayer
          </button>
        </div>
      </main>
    )
  }

  // Statistiques rapides
  const totalScore = teams?.reduce((acc, team) => acc + team.score, 0) || 0
  const avgScore = teams?.length ? Math.round(totalScore / teams.length) : 0
  const topTeam = teams?.[0]

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Aller au contenu principal
      </a>

      <main
        id="main-content"
        className="min-h-screen"
        role="main"
        aria-label="Administration des équipes"
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Shield className="w-6 h-6 text-yellow-400" aria-hidden="true" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Panel Admin
                  </h1>
                  <p className="text-xs text-gray-400">
                    Gérer les équipes et les scores
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Bouton rafraîchir */}
                <button
                  onClick={() => {
                    mutate()
                    toast.info("Données rafraîchies", { duration: 1500 })
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Rafraîchir les données"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {/* Lien retour accueil */}
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Retour à l'accueil"
                >
                  <Home className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Voir le podium</span>
                </Link>

                {/* Bouton déconnexion */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Statistiques">
            <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Équipes</p>
                  <p className="text-2xl font-bold text-white">{teams?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-green-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Score total</p>
                  <p className="text-2xl font-bold text-white">{totalScore.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Leader</p>
                  <p className="text-lg font-bold text-white truncate">
                    {topTeam ? `${topTeam.avatar} ${topTeam.name}` : "-"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Actions globales */}
          <section className="flex flex-wrap gap-4 items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50">
            <div>
              <h2 className="font-bold text-white">Actions globales</h2>
              <p className="text-sm text-gray-400">
                Score moyen : {avgScore.toLocaleString()} pts
              </p>
            </div>

            <button
              onClick={handleResetAll}
              disabled={isResetting || !teams?.length}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Réinitialiser tous les scores"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Réinitialisation...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Reset tous les scores
                </>
              )}
            </button>
          </section>

          {/* Formulaire d'ajout */}
          <AddTeamForm onTeamAdded={handleTeamAdded} />

          {/* Liste des équipes en GRID */}
          <section aria-label="Liste des équipes">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" aria-hidden="true" />
              Gérer les équipes
              <span className="text-sm font-normal text-gray-400">
                (trié par score)
              </span>
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-12" role="status">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" aria-hidden="true" />
                <span className="ml-3 text-gray-400">Chargement...</span>
              </div>
            ) : teams && teams.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" aria-hidden="true" />
                <p className="text-gray-400">
                  Aucune équipe pour le moment.
                  <br />
                  Utilisez le formulaire ci-dessus pour en ajouter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {teams?.map((team, index) => (
                    <motion.div
                      key={team.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <AdminTeamCard
                        team={team}
                        rank={index + 1}
                        onUpdate={handleTeamUpdate}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-700/50 py-6 bg-gray-900/50">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400">
            <p>
              🔐 Panel d'administration sécurisé •{" "}
              <Link href="/" className="text-blue-400 hover:underline focus:outline-none focus:underline">
                Retour au podium
              </Link>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Identifiants : admin / password123
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
