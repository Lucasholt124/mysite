"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight text-purple-600">
            Impulsione<span className="text-gray-900">web</span>
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          <Link href="/#servicos" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            Serviços
          </Link>
          <Link href="/#contato" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
            Contato
          </Link>
          <Link href="/contrato">
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full">
              Iniciar Projeto
            </Button>
          </Link>
        </nav>

        <button
          className="flex items-center md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-16 z-40 border-b border-gray-200 bg-white px-6 py-4 shadow-md md:hidden"
          >
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <Link
                href="/#servicos"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link
                href="/#contato"
                className="text-gray-700 hover:text-purple-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link href="/contrato" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full">
                  Iniciar Projeto
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
