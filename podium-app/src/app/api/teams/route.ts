import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET: Récupérer toutes les équipes triées par score
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        score: "desc",
      },
    })
    
    return NextResponse.json(teams)
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}
