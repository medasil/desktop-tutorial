"use client"

import { useState, useTransition } from "react"
import { UserPlus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { addTeam } from "@/lib/actions"

interface AddTeamFormProps {
  onTeamAdded: () => void
}

const emojis = ["🚀", "🎯", "💻", "🐛", "🔥", "⚡", "🎮", "🏆", "🦄", "🐉", "🧙", "👾", "🤖", "💡", "🌟"]

export function AddTeamForm({ onTeamAdded }: AddTeamFormProps) {
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("🚀")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Le nom de l'équipe est requis")
      return
    }

    startTransition(async () => {
      try {
        await addTeam(name.trim(), avatar)
        setName("")
        setAvatar("🚀")
        onTeamAdded()
      } catch (err) {
        setError("Une équipe avec ce nom existe déjà")
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "p-6 rounded-xl bg-gray-800 border border-gray-700",
        "space-y-4"
      )}
    >
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <UserPlus className="w-5 h-5" aria-hidden="true" />
        Ajouter une équipe
      </h2>

      {error && (
        <div
          className="p-3 rounded-lg bg-red-900/50 border border-red-700 text-red-300 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="team-name" className="block text-sm font-medium text-gray-300">
          Nom de l'équipe
        </label>
        <input
          type="text"
          id="team-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Les Bug Hunters"
          disabled={isPending}
          className={cn(
            "w-full px-4 py-2 rounded-lg",
            "bg-gray-700 border border-gray-600",
            "text-white placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Avatar (emoji)
        </label>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Sélectionner un avatar">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              disabled={isPending}
              className={cn(
                "w-10 h-10 rounded-lg text-xl flex items-center justify-center",
                "transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
                avatar === emoji
                  ? "bg-blue-600 ring-2 ring-blue-400"
                  : "bg-gray-700 hover:bg-gray-600"
              )}
              role="radio"
              aria-checked={avatar === emoji}
              aria-label={`Emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending || !name.trim()}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
          "bg-blue-600 hover:bg-blue-500 text-white font-medium",
          "transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Ajout en cours...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" aria-hidden="true" />
            Ajouter l'équipe
          </>
        )}
      </button>
    </form>
  )
}
