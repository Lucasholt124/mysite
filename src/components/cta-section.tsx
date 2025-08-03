"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function CtaSection() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="container mx-auto px-4 text-center"
      >
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          Pronto para Elevar Seu Negócio?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-purple-200/90">
          Vamos transformar sua visão em uma solução digital de alto impacto. Solicite uma proposta sem compromisso e dê o próximo passo.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contrato"
            className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-lg font-semibold text-purple-800 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1"
          >
            Solicitar Proposta <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="#contato"
            className="group inline-flex items-center justify-center rounded-full border-2 border-white/80 px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-1"
          >
            Fale Conosco
          </Link>
        </div>
      </motion.div>
    </section>
  )
}