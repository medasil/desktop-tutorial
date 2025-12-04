import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Équipes fictives avec des noms drôles liés au code
const teamsData = [
  { name: "Les Null Pointers", score: 420, avatar: "🎯" },
  { name: "Stack Overflow", score: 380, avatar: "📚" },
  { name: "Les Git Pushers", score: 350, avatar: "🚀" },
  { name: "404 Brain Not Found", score: 310, avatar: "🧠" },
  { name: "Console.log(café)", score: 290, avatar: "☕" },
  { name: "Infinite Loopers", score: 250, avatar: "🔄" },
  { name: "Les Segfaulters", score: 200, avatar: "💥" },
  { name: "Try { Catch } Sleep", score: 180, avatar: "😴" },
  { name: "Les CSS Wizards", score: 150, avatar: "🧙" },
  { name: "Debug Dragons", score: 100, avatar: "🐉" },
]

async function main() {
  console.log('🌱 Début du seeding...')
  
  // Supprime toutes les équipes existantes
  await prisma.team.deleteMany()
  
  // Crée les équipes
  for (const team of teamsData) {
    const created = await prisma.team.create({
      data: team,
    })
    console.log(`✅ Équipe créée: ${created.name} (${created.score} pts)`)
  }
  
  console.log('🎉 Seeding terminé!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
