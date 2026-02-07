"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion"

const WHATSAPP_LINK = "https://wa.me/5579999383543?text=Ol%C3%A1!%20Tenho%20interesse%20em%20iniciar%20um%20projeto.%20Podemos%20conversar%3F"
// ☝️ SUBSTITUA "5500000000000" pelo seu número real com DDI+DDD (ex: 5511999999999)

const PORTFOLIO_LINK = "https://new-portfolio-delta-blond.vercel.app/"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [, setIsScrolled] = useState<boolean>(false)
  const [activeLink, setActiveLink] = useState<string>("")
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll()
  const headerBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0.6)", "rgba(255,255,255,0.95)"]
  )
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 0 rgba(0,0,0,0)", "0 4px 30px -5px rgba(147,51,234,0.15)"]
  )
  const headerBorder = useTransform(
    scrollY,
    [0, 100],
    ["rgba(147,51,234,0)", "rgba(147,51,234,0.1)"]
  )

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // Detectar seção ativa
  useEffect(() => {
    const sections = ["servicos", "depoimentos", "contato"]
    function handleScroll() {
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveLink(`/#${id}`)
            return
          }
        }
      }
      setActiveLink("")
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  // Bloqueia scroll quando menu mobile aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const navLinks = [
    { href: "/#servicos", label: "Serviços", external: false },
    { href: PORTFOLIO_LINK, label: "Portfólio", external: true },
    { href: "/#depoimentos", label: "Depoimentos", external: false },
    { href: "/#contato", label: "Contato", external: false },
  ]

  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.1 + i * 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const ctaVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0, y: -10 },
    animate: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const mobileItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  }

  // Componente de link que lida com interno/externo
  const NavLink = ({
    href,
    external,
    children,
    className,
    onClick,
  }: {
    href: string
    external: boolean
    children: React.ReactNode
    className?: string
    onClick?: () => void
  }) => {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={onClick}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <motion.header
        style={{
          backgroundColor: headerBg,
          boxShadow: headerShadow,
          borderBottomColor: headerBorder,
        }}
        className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
      >
        {/* Linha de gradiente animada no topo */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #9333ea, #ec4899, #9333ea, transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "200% 0%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="container mx-auto flex h-16 md:h-18 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <motion.div variants={logoVariants} initial="initial" animate="animate">
            <Link href="/" className="flex items-center group relative">
              {/* Glow atrás do logo */}
              <motion.div
                className="absolute -inset-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(147,51,234,0.12) 0%, transparent 70%)",
                }}
              />

              {/* Ícone animado */}
              <motion.div
                className="relative mr-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25"
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="text-white font-black text-lg leading-none"
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(255,255,255,0.5)",
                      "0 0 15px rgba(255,255,255,0.8)",
                      "0 0 5px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  I
                </motion.span>

                {/* Partículas ao redor do ícone */}
                <motion.div
                  className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-pink-400"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, -6, -12],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                />
                <motion.div
                  className="absolute -bottom-0.5 -left-0.5 h-1.5 w-1.5 rounded-full bg-purple-300"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    y: [0, 4, 8],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: 1,
                  }}
                />
              </motion.div>

              <div className="relative flex flex-col">
                <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Impulsione
                  </span>
                  <span className="text-gray-900">web</span>
                </span>
                <motion.span
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase text-purple-400/80 hidden sm:block"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  Soluções Digitais
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex md:items-center md:gap-1 lg:gap-2"
            role="navigation"
            aria-label="Menu principal"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
                onHoverStart={() => setHoveredLink(link.href)}
                onHoverEnd={() => setHoveredLink(null)}
                className="relative"
              >
                <NavLink
                  href={link.href}
                  external={link.external}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 inline-flex items-center gap-1 ${
                    activeLink === link.href
                      ? "text-purple-700"
                      : "text-gray-600 hover:text-purple-600"
                  }`}
                >
                  {/* Background animado no hover */}
                  <AnimatePresence>
                    {(hoveredLink === link.href || activeLink === link.href) && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-purple-50 border border-purple-100"
                        layoutId="navHover"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  <span className="relative z-10">{link.label}</span>

                  {/* Badge "externo" para portfólio */}
                  {link.external && (
                    <motion.span
                      className="relative z-10 ml-0.5"
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-50"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </motion.span>
                  )}

                  {/* Indicador de link ativo */}
                  {activeLink === link.href && (
                    <motion.span
                      className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                </NavLink>
              </motion.div>
            ))}

            {/* Separador */}
            <motion.div
              className="mx-2 h-6 w-px bg-gray-200"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />

            {/* CTA Button → WhatsApp */}
            <motion.div variants={ctaVariants} initial="initial" animate="animate">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group"
                >
                  {/* Glow pulsante atrás do botão */}
                  <motion.div
                    className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #22c55e, #16a34a, #22c55e)",
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />

                  <Button
                    size="sm"
                    className="relative bg-gradient-to-r from-green-500 via-green-500 to-emerald-500 hover:from-green-600 hover:via-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg shadow-green-500/25 font-semibold px-5 py-2.5 text-sm transition-all duration-300 border-0 overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0.3) 55%, transparent 60%)",
                        backgroundSize: "200% 100%",
                      }}
                      animate={{
                        backgroundPosition: ["-100% 0%", "200% 0%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />

                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                    <span>Iniciar Projeto</span>
                    <motion.div
                      className="ml-1.5 inline-flex"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.button
            className="flex items-center justify-center h-10 w-10 rounded-full md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 bg-gray-50 hover:bg-purple-50 transition-colors"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5 text-purple-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Menu - Full overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              className="fixed top-[66px] left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-purple-100 shadow-2xl shadow-purple-500/10 md:hidden overflow-hidden"
              variants={mobileMenuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              role="navigation"
              aria-label="Menu mobile"
            >
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-50 to-transparent rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <nav className="relative flex flex-col gap-1 px-5 py-5">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} variants={mobileItemVariants}>
                    <NavLink
                      href={link.href}
                      external={link.external}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 group ${
                        activeLink === link.href
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : "text-gray-700 hover:bg-gray-50 hover:text-purple-600"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {/* Número decorativo */}
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-pink-50 text-xs font-bold text-purple-500 group-hover:from-purple-200 group-hover:to-pink-100 transition-colors shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="flex items-center gap-1.5">
                        {link.label}
                        {link.external && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-40"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        )}
                      </span>

                      {activeLink === link.href && (
                        <motion.div
                          className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}

                      <ArrowRight className="ml-auto h-4 w-4 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </NavLink>
                  </motion.div>
                ))}

                {/* Separador */}
                <motion.div
                  variants={mobileItemVariants}
                  className="my-2 mx-4"
                >
                  <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
                </motion.div>

                {/* CTA Mobile → WhatsApp */}
                <motion.div variants={mobileItemVariants}>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative group overflow-hidden"
                    >
                      <Button className="w-full bg-gradient-to-r from-green-500 via-green-500 to-emerald-500 hover:from-green-600 hover:via-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-lg shadow-green-500/20 font-semibold py-6 text-base transition-all duration-300 border-0">
                        {/* Shimmer mobile */}
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.2) 55%, transparent 60%)",
                            backgroundSize: "200% 100%",
                          }}
                          animate={{
                            backgroundPosition: ["-100% 0%", "200% 0%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        />

                        {/* Ícone WhatsApp SVG */}
                        <svg
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        <span>Iniciar Meu Projeto</span>
                        <motion.div
                          className="ml-2 inline-flex"
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </a>
                </motion.div>

                {/* Info extra mobile */}
                <motion.div
                  variants={mobileItemVariants}
                  className="mt-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 border border-green-100/50"
                >
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    💬 Resposta rápida via{" "}
                    <span className="font-semibold text-green-600">
                      WhatsApp
                    </span>{" "}
                    — Tire suas dúvidas e receba um orçamento gratuito
                  </p>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}