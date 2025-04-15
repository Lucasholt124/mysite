import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"

import WhatsAppButton from "@/components/whatsapp-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Impulsioneweb - Criação de Sites, Sistemas e Marketing Digital",
  description:
    "Soluções digitais completas para impulsionar seu negócio. Criação de sites, sistemas e estratégias de marketing digital personalizadas.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>

          <Header />
          {children}
          <Footer />
          <WhatsAppButton />

      </body>
    </html>
  )
}
