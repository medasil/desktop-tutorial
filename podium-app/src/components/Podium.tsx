"use client"

import { motion } from "framer-motion"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Team } from "@/lib/actions"

interface PodiumProps {
  teams: Team[]
  reducedMotion?: boolean
}

// Badges de médailles
const RANK_BADGES: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
}

const podiumConfig = {
  1: {
    height: "h-44",
    glassStyle: "bg-gradient-to-b from-yellow-400/30 to-yellow-600/40 backdrop-blur-md border border-yellow-400/50",
    avatarStyle: "bg-gradient-to-br from-yellow-200 to-yellow-400 border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.6)]",
    textColor: "text-yellow-100",
    scoreColor: "text-yellow-300",
    icon: Crown,
    label: "1er",
    order: 1,
    delay: 0.2,
  },
  2: {
    height: "h-36",
    glassStyle: "bg-gradient-to-b from-slate-300/30 to-slate-500/40 backdrop-blur-md border border-slate-400/50",
    avatarStyle: "bg-gradient-to-br from-slate-200 to-slate-400 border-slate-400 shadow-[0_0_20px_rgba(148,163,184,0.5)]",
    textColor: "text-slate-100",
    scoreColor: "text-slate-300",
    icon: Medal,
    label: "2e",
    order: 0,
    delay: 0.4,
  },
  3: {
    height: "h-28",
    glassStyle: "bg-gradient-to-b from-orange-400/30 to-orange-700/40 backdrop-blur-md border border-orange-400/50",
    avatarStyle: "bg-gradient-to-br from-orange-200 to-orange-400 border-orange-500 shadow-[0_0_20px_rgba(251,146,60,0.5)]",
    textColor: "text-orange-100",
    scoreColor: "text-orange-300",
    icon: Award,
    label: "3e",
    order: 2,
    delay: 0.6,
  },
}

function PodiumPlace({
  team,
  position,
  reducedMotion = false,
}: {
  team: Team | undefined
  position: 1 | 2 | 3
  reducedMotion?: boolean
}) {
  const config = podiumConfig[position]
  const Icon = config.icon
  const badge = RANK_BADGES[position]

  // Animation config basée sur prefers-reduced-motion
  const animationProps = reducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { delay: config.delay, type: "spring", stiffness: 100, damping: 15 }
      }

  if (!team) {
    return (
      <div className={cn("flex flex-col items-center", `order-${config.order}`)}>
        <div className="w-32 md:w-40 flex flex-col items-center">
          {/* Glassmorphism Card vide */}
          <div className="relative w-full p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 mb-2">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gray-700 border-4 border-gray-600 flex items-center justify-center">
              <span className="text-3xl">?</span>
            </div>
            <p className="text-center text-gray-500 mt-2 font-medium">En attente</p>
          </div>
          {/* Socle */}
          <div className={cn(config.height, "w-full bg-gray-700/50 rounded-t-xl flex items-end justify-center pb-3")}>
            <span className="text-2xl font-bold text-gray-500">{config.label}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      layoutId={`podium-team-${team.id}`}
      {...animationProps}
      className={cn("flex flex-col items-center", `order-${config.order}`)}
    >
      <div className="w-32 md:w-40 flex flex-col items-center">
        {/* Glassmorphism Card */}
        <motion.div
          initial={reducedMotion ? {} : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: config.delay + 0.1, type: "spring" }}
          className={cn(
            "relative w-full p-4 rounded-2xl mb-2 transition-all duration-300",
            config.glassStyle,
            position === 1 && !reducedMotion && "animate-pulse-glow"
          )}
        >
          {/* Badge de rang */}
          <div className="absolute -top-3 -right-2 text-3xl drop-shadow-lg" aria-hidden="true">
            {badge}
          </div>

          {/* Avatar */}
          <div
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full border-4 flex items-center justify-center",
              config.avatarStyle
            )}
            role="img"
            aria-label={`Avatar de ${team.name}`}
          >
            <span className="text-3xl md:text-4xl">{team.avatar}</span>
          </div>

          {/* Infos */}
          <div className="text-center mt-3">
            <h3 
              className={cn("font-bold text-sm md:text-base truncate", config.textColor)} 
              title={team.name}
            >
              {team.name}
            </h3>
            <p className={cn("text-2xl md:text-3xl font-extrabold", config.scoreColor)}>
              {team.score.toLocaleString()}
            </p>
            <p className="text-xs text-white/60">points</p>
          </div>
        </motion.div>

        {/* Socle du podium - Glassmorphism */}
        <motion.div
          initial={reducedMotion ? {} : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ delay: config.delay, duration: 0.5 }}
          className={cn(
            config.height,
            config.glassStyle,
            "w-full rounded-t-xl flex flex-col items-center justify-end pb-3"
          )}
        >
          <Icon className={cn("w-8 h-8 md:w-10 md:h-10", config.textColor)} aria-hidden="true" />
          <span className={cn("text-xl md:text-2xl font-bold", config.textColor)}>
            {config.label}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Podium({ teams, reducedMotion = false }: PodiumProps) {
  const first = teams[0]
  const second = teams[1]
  const third = teams[2]

  return (
    <section aria-label="Podium des 3 meilleures équipes" className="w-full">
      <h2 className="sr-only">Podium - Classement des 3 meilleures équipes</h2>
      <div className="flex items-end justify-center gap-3 md:gap-6 px-4">
        <PodiumPlace team={second} position={2} reducedMotion={reducedMotion} />
        <PodiumPlace team={first} position={1} reducedMotion={reducedMotion} />
        <PodiumPlace team={third} position={3} reducedMotion={reducedMotion} />
      </div>
    </section>
  )
}
