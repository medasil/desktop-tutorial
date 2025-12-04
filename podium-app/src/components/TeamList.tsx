"use client"

import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/actions"

interface TeamListProps {
  teams: Team[]
  startRank?: number
}

function getRankBadgeStyle(rank: number) {
  if (rank === 4) return "bg-purple-600 text-white"
  if (rank === 5) return "bg-blue-600 text-white"
  return "bg-gray-700 text-gray-300"
}

export function TeamList({ teams, startRank = 4 }: TeamListProps) {
  if (teams.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Aucune autre équipe pour le moment.</p>
      </div>
    )
  }

  return (
    <section aria-label="Classement des autres équipes" className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-white mb-4 px-4">Autres équipes</h2>
      <ul className="space-y-2 px-4" role="list">
        <AnimatePresence mode="popLayout">
          {teams.map((team, index) => {
            const rank = startRank + index
            return (
              <motion.li
                key={team.id}
                layoutId={`team-${team.id}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl",
                  "bg-gray-800/80 backdrop-blur-sm border border-gray-700",
                  "hover:bg-gray-700/80 transition-colors",
                  "focus-within:ring-2 focus-within:ring-blue-500"
                )}
              >
                {/* Rang */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                    getRankBadgeStyle(rank)
                  )}
                  aria-label={`Rang ${rank}`}
                >
                  {rank}
                </div>

                {/* Avatar */}
                <div
                  className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl"
                  role="img"
                  aria-label={`Avatar de ${team.name}`}
                >
                  {team.avatar}
                </div>

                {/* Nom */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate" title={team.name}>
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Mis à jour: {new Date(team.lastUpdated).toLocaleTimeString("fr-FR")}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {team.score.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </section>
  )
}
