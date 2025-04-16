"use client"

import { useRef } from "react"
import { Code, Globe, LayoutGrid, MessageSquare, Zap } from "lucide-react"
import { motion, useInView } from "framer-motion"

const services = [
  {
    icon: <Globe className="h-10 w-10" />,
    title: "Criação de Sites",
    description: "Sites responsivos, otimizados para SEO e com design moderno para destacar sua marca.",
  },
  {
    icon: <Code className="h-10 w-10" />,
    title: "Desenvolvimento de Sistemas",
    description: "Sistemas web personalizados para automatizar e otimizar processos do seu negócio.",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Marketing Digital",
    description: "Estratégias completas para aumentar sua visibilidade online e atrair mais clientes.",
  },
  {
    icon: <LayoutGrid className="h-10 w-10" />,
    title: "UI/UX Design",
    description: "Interfaces intuitivas e experiências de usuário que convertem visitantes em clientes.",
  },
  {
    icon: <MessageSquare className="h-10 w-10" />,
    title: "Consultoria Digital",
    description: "Orientação especializada para impulsionar sua presença digital e resultados online.",
  },
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section id="servicos" className="w-full bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Nossos Serviços</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Soluções completas para impulsionar seu negócio no ambiente digital
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-purple-100 p-3 text-purple-600">{service.icon}</div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
