"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!isMenuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  const navLinks = [
    { href: "/#servicos", label: "Serviços" },
    { href: "/#contato", label: "Contato" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center group">
          <span className="text-2xl font-bold tracking-tight text-purple-600 group-hover:text-purple-700 transition-colors">
            Impulsione<span className="text-gray-900">web</span>
          </span>
          {/* <span className="ml-2 text-xs text-gray-500 font-medium hidden sm:inline">Soluções Digitais</span> */}
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8" role="navigation" aria-label="Menu principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contrato">
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md font-semibold transition"
            >
              Iniciar Projeto
            </Button>
          </Link>
        </nav>

        <button
          className="flex items-center md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-16 z-40 border-b border-gray-200 bg-white px-6 py-4 shadow-md md:hidden"
            role="navigation"
            aria-label="Menu mobile"
          >
            <nav className="flex flex-col gap-4 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-purple-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contrato" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md font-semibold transition">
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