import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Podium Live - Classement des équipes | Nuit de l'Info 2024",
  description: "Application de classement d'équipes gamifiée avec temps réel, animations et accessibilité maximale pour la Nuit de l'Info 2024.",
  keywords: ["podium", "classement", "équipes", "nuit de l'info", "compétition", "temps réel", "gamification"],
  authors: [{ name: "Nuit de l'Info Team" }],
}

export const viewport: Viewport = {
  themeColor: "#1f2937",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen antialiased`}>
        {children}
        {/* Toast notifications */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              border: "1px solid #374151",
              color: "#f3f4f6",
            },
          }}
          richColors
        />
      </body>
    </html>
  )
}
