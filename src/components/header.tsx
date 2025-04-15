"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-purple-600">
            Impulsione<span className="text-gray-900">web</span>
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-8">
          <Link href="/#servicos" className="text-gray-600 hover:text-purple-600 transition-colors text-lg font-medium">
            Serviços
          </Link>
          <Link href="/#contato" className="text-gray-600 hover:text-purple-600 transition-colors text-lg font-medium">
            Contato
          </Link>
          <Link href="/contrato">
            <Button size="sm" className="bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 ease-in-out">
              Iniciar Projeto
            </Button>
          </Link>
        </nav>

        <button
          className="flex items-center md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 border-t border-gray-200 bg-white px-4 py-6 shadow-lg md:hidden">
          <nav className="flex flex-col space-y-6">
            <Link
              href="/#servicos"
              className="py-2 text-gray-600 hover:text-purple-600 transition-colors text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Serviços
            </Link>
            <Link
              href="/#contato"
              className="py-2 text-gray-600 hover:text-purple-600 transition-colors text-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Link href="/contrato" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 transition-all duration-200 ease-in-out">
                Iniciar Projeto
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
