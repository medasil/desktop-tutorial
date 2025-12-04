"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, RotateCcw, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateScore, resetTeamScore, deleteTeam } from "@/lib/actions"
import type { Team } from "@/lib/actions"

interface AdminTeamCardProps {
  team: Team
  rank: number
  onUpdate: () => void
}

export function AdminTeamCard({ team, rank, onUpdate }: AdminTeamCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleScoreChange = (points: number) => {
    startTransition(async () => {
      await updateScore(team.id, points)
      onUpdate()
    })
  }

  const handleReset = () => {
    startTransition(async () => {
      await resetTeamScore(team.id)
      onUpdate()
    })
  }

  const handleDelete = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${team.name}" ?`)) {
      startTransition(async () => {
        await deleteTeam(team.id)
        onUpdate()
      })
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl",
        "bg-gray-800 border border-gray-700",
        isPending && "opacity-50 pointer-events-none"
      )}
    >
      {/* Rang et Avatar */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
            rank === 1
              ? "bg-yellow-500 text-yellow-900"
              : rank === 2
              ? "bg-gray-400 text-gray-900"
              : rank === 3
              ? "bg-orange-500 text-orange-900"
              : "bg-gray-700 text-gray-300"
          )}
        >
          {rank}
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
          {team.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate max-w-[150px]" title={team.name}>
            {team.name}
          </h3>
          <p className="text-2xl font-bold text-blue-400">{team.score.toLocaleString()} pts</p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <button
          onClick={() => handleScoreChange(10)}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm",
            "bg-green-600 hover:bg-green-500 text-white",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-green-400",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label={`Ajouter 10 points à ${team.name}`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          10
        </button>

        <button
          onClick={() => handleScoreChange(50)}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm",
            "bg-green-700 hover:bg-green-600 text-white",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-green-400",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label={`Ajouter 50 points à ${team.name}`}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          50
        </button>

        <button
          onClick={() => handleScoreChange(-10)}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm",
            "bg-red-600 hover:bg-red-500 text-white",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-red-400",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label={`Retirer 10 points à ${team.name}`}
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
          10
        </button>

        <button
          onClick={handleReset}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm",
            "bg-yellow-600 hover:bg-yellow-500 text-yellow-900",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label={`Réinitialiser le score de ${team.name}`}
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Reset
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className={cn(
            "flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm",
            "bg-gray-700 hover:bg-red-700 text-gray-300 hover:text-white",
            "transition-colors focus:outline-none focus:ring-2 focus:ring-red-400",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label={`Supprimer ${team.name}`}
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Indicateur de chargement */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-xl">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      )}
    </motion.article>
  )
}
