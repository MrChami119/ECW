import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata } from "next"
import "./custom.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Edirisinghe Cushion Works",
  description: "High-end vehicle interior and cushion modification company",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
        style={{ backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
