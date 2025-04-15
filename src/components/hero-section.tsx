"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return

      const { clientX, clientY } = e
      const { left, top, width, height } = heroRef.current.getBoundingClientRect()

      const x = (clientX - left) / width - 0.5
      const y = (clientY - top) / height - 0.5

      heroRef.current.style.setProperty("--mouse-x", `${x * 20}px`)
      heroRef.current.style.setProperty("--mouse-y", `${y * 20}px`)
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-800 px-4 py-20"
      style={{
        backgroundPosition: "calc(50% + var(--mouse-x, 0px)) calc(50% + var(--mouse-y, 0px))",
        transition: "background-position 0.1s ease-out",
      }}
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] bg-cover opacity-5 mix-blend-soft-light pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="container relative z-10 mx-auto text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          <span className="block">Impulsione seu negócio</span>
          <span className="block bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            com soluções digitais
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-base text-purple-100 sm:text-lg md:text-xl"
        >
          Criamos sites, sistemas e estratégias de marketing digital que transformam sua presença online e impulsionam
          seus resultados.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <Link
            href="/contrato"
            className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-lg font-semibold text-purple-800 transition-all duration-300 hover:bg-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-400"
          >
            Começar Projeto <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="#servicos"
            className="inline-flex items-center rounded-xl border border-white/60 bg-white/10 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Nossos Serviços
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
