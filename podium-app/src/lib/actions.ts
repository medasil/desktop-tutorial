"use server"

import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"

export type Team = {
  id: number
  name: string
  score: number
  avatar: string
  lastUpdated: Date
}

// Récupère toutes les équipes triées par score décroissant
export async function getTeams(): Promise<Team[]> {
  const teams = await prisma.team.findMany({
    orderBy: {
      score: "desc",
    },
  })
  return teams
}

// Met à jour le score d'une équipe
export async function updateScore(teamId: number, points: number): Promise<Team> {
  const team = await prisma.team.update({
    where: { id: teamId },
    data: {
      score: {
        increment: points,
      },
      lastUpdated: new Date(),
    },
  })
  
  revalidatePath("/")
  revalidatePath("/admin")
  
  return team
}

// Remet tous les scores à zéro
export async function resetScores(): Promise<void> {
  await prisma.team.updateMany({
    data: {
      score: 0,
      lastUpdated: new Date(),
    },
  })
  
  revalidatePath("/")
  revalidatePath("/admin")
}

// Remet le score d'une équipe à zéro
export async function resetTeamScore(teamId: number): Promise<Team> {
  const team = await prisma.team.update({
    where: { id: teamId },
    data: {
      score: 0,
      lastUpdated: new Date(),
    },
  })
  
  revalidatePath("/")
  revalidatePath("/admin")
  
  return team
}

// Ajoute une nouvelle équipe
export async function addTeam(name: string, avatar: string): Promise<Team> {
  const team = await prisma.team.create({
    data: {
      name,
      avatar,
      score: 0,
    },
  })
  
  revalidatePath("/")
  revalidatePath("/admin")
  
  return team
}

// Supprime une équipe
export async function deleteTeam(teamId: number): Promise<void> {
  await prisma.team.delete({
    where: { id: teamId },
  })
  
  revalidatePath("/")
  revalidatePath("/admin")
}
