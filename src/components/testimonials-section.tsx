"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

const testimonials = [
  {
    name: "Carlos Silva",
    role: "CEO, TechSolutions",
    content:
      "A Impulsioneweb transformou completamente nossa presença online. O site ficou incrível e os resultados de marketing superaram todas as expectativas.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Ana Oliveira",
    role: "Diretora, Moda Express",
    content:
      "Nosso e-commerce desenvolvido pela equipe da Impulsioneweb aumentou nossas vendas em 200% no primeiro trimestre. Profissionais excepcionais!",
    avatar: "/Ana.svg?height=100&width=100",
  },
  {
    name: "Roberto Mendes",
    role: "Gerente, Constrular",
    content:
      "O sistema de gestão que desenvolveram para nossa empresa otimizou processos e reduziu custos. Melhor investimento que fizemos nos últimos anos.",
    avatar: "/Roberto.svg?height=100&width=100",
  },
]

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">O Que Nossos Clientes Dizem</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Histórias de sucesso de quem confiou em nossos serviços
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
