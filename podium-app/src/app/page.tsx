"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { Trophy, RefreshCw, Settings, Sparkles, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { Podium } from "@/components/Podium"
import { TeamList } from "@/components/TeamList"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/actions"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Fonction pour déclencher les confettis
function fireConfetti() {
  const duration = 3000
  const end = Date.now() + duration

  const colors = ["#FFD700", "#FFA500", "#FF6347", "#00CED1", "#9370DB"]

  ;(function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors,
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors,
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  })()

  // Explosion centrale
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  })
}

export default function HomePage() {
  const { data: teams, error, isLoading, mutate } = useSWR<Team[]>(
    "/api/teams",
    fetcher,
    {
      refreshInterval: 2000, // Polling toutes les 2 secondes
      revalidateOnFocus: true,
    }
  )

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [reducedMotion, setReducedMotion] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const previousLeaderRef = useRef<number | null>(null)

  // Détecter prefers-reduced-motion au chargement
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handler)
    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  // Détecter changement de leader et déclencher confettis
  useEffect(() => {
    if (teams && teams.length > 0) {
      const currentLeaderId = teams[0].id
      const currentLeaderName = teams[0].name

      // Si le leader a changé (et ce n'est pas le premier chargement)
      if (
        previousLeaderRef.current !== null &&
        previousLeaderRef.current !== currentLeaderId &&
        !reducedMotion
      ) {
        // Déclencher les confettis !
        fireConfetti()
        // Annonce pour lecteurs d'écran
        setAnnouncement(`Nouveau leader ! ${currentLeaderName} passe en première position !`)
      } else if (previousLeaderRef.current !== currentLeaderId) {
        // Mise à jour simple sans confettis
        setAnnouncement(`Classement mis à jour. Leader actuel : ${currentLeaderName}`)
      }

      previousLeaderRef.current = currentLeaderId
      setLastUpdate(new Date())
    }
  }, [teams, reducedMotion])

  const toggleReducedMotion = useCallback(() => {
    setReducedMotion((prev) => !prev)
  }, [])

  if (error) {
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
          className="min-h-screen flex items-center justify-center p-4"
          role="main"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Erreur de chargement
            </h1>
            <p className="text-gray-300 mb-4">
              Impossible de charger le classement. Vérifiez votre connexion.
            </p>
            <button
              onClick={() => mutate()}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Réessayer
            </button>
          </div>
        </main>
      </>
    )
  }

  const top3 = teams?.slice(0, 3) || []
  const restOfTeams = teams?.slice(3) || []

  return (
    <>
      {/* Skip to content link - Accessibilité */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Aller au contenu principal
      </a>

      {/* Zone aria-live pour les annonces aux lecteurs d'écran */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      <main
        id="main-content"
        className="min-h-screen"
        role="main"
        aria-label="Classement des équipes"
      >
        {/* Header avec Glassmorphism */}
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={reducedMotion ? {} : { rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-8 h-8 text-yellow-400" aria-hidden="true" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    Podium Live
                  </h1>
                  <p className="text-xs text-gray-400">
                    Nuit de l'Info 2024
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Bouton toggle animations - Accessibilité */}
                <button
                  onClick={toggleReducedMotion}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900",
                    reducedMotion
                      ? "bg-orange-600 hover:bg-orange-500 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  )}
                  aria-pressed={reducedMotion}
                  aria-label={reducedMotion ? "Activer les animations" : "Désactiver les animations"}
                  title={reducedMotion ? "Animations désactivées" : "Animations activées"}
                >
                  {reducedMotion ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {reducedMotion ? "Anims OFF" : "Anims ON"}
                  </span>
                </button>

                {/* Indicateur de mise à jour */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                  <motion.div
                    animate={reducedMotion ? {} : { opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                    aria-hidden="true"
                  />
                  <span>
                    {lastUpdate.toLocaleTimeString("fr-FR")}
                  </span>
                </div>

                {/* Lien Admin */}
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Accéder à l'administration"
                >
                  <Settings className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
          {/* État de chargement */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20" role="status" aria-label="Chargement en cours">
              <motion.div
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-12 h-12 text-blue-400" />
              </motion.div>
              <p className="mt-4 text-gray-300">Chargement du classement...</p>
            </div>
          ) : teams && teams.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" aria-hidden="true" />
              <h2 className="text-xl font-bold text-gray-300">
                Aucune équipe inscrite
              </h2>
              <p className="text-gray-400 mt-2">
                Ajoutez des équipes depuis la page d'administration.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                Aller à l'admin
              </Link>
            </div>
          ) : (
            <>
              {/* Podium TOP 3 */}
              <motion.section
                initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                aria-labelledby="podium-heading"
              >
                <h2 id="podium-heading" className="sr-only">
                  Podium des 3 meilleures équipes
                </h2>
                <Podium teams={top3} reducedMotion={reducedMotion} />
              </motion.section>

              {/* Séparateur */}
              {restOfTeams.length > 0 && (
                <div className="flex items-center gap-4 py-4" aria-hidden="true">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                  <span className="text-sm text-gray-400 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Classement complet
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                </div>
              )}

              {/* Liste des autres équipes */}
              {restOfTeams.length > 0 && (
                <motion.section
                  initial={reducedMotion ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  aria-labelledby="other-teams-heading"
                >
                  <TeamList teams={restOfTeams} startRank={4} />
                </motion.section>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-700/50 py-6 bg-gray-900/50">
          <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-400">
            <p>
              🏆 Podium Live - Créé pour la{" "}
              <span className="text-blue-400 font-medium">Nuit de l'Info 2024</span>
            </p>
            <p className="mt-1">
              Rafraîchissement automatique toutes les 2 secondes • Accessible WCAG AA
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}
