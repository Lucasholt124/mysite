"use client"

import { useRef } from "react"
import { Code, Globe, LayoutGrid, MessageSquare, Zap } from "lucide-react"
import { motion, useInView } from "framer-motion"

const services = [
  {
    icon: <Globe className="h-12 w-12" />,
    title: "Criação de Sites",
    description: "Sites responsivos, otimizados para SEO e com design moderno para destacar sua marca.",
  },
  {
    icon: <Code className="h-12 w-12" />,
    title: "Desenvolvimento de Sistemas",
    description: "Sistemas web personalizados para automatizar e otimizar processos do seu negócio.",
  },
  {
    icon: <Zap className="h-12 w-12" />,
    title: "Marketing Digital",
    description: "Estratégias completas para aumentar sua visibilidade online e atrair mais clientes.",
  },
  {
    icon: <LayoutGrid className="h-12 w-12" />,
    title: "UI/UX Design",
    description: "Interfaces intuitivas e experiências de usuário que convertem visitantes em clientes.",
  },
  {
    icon: <MessageSquare className="h-12 w-12" />,
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
    <section id="servicos" className="w-full bg-gradient-to-r from-purple-100 via-purple-200 to-white py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">Nossos Serviços</h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Soluções completas para impulsionar seu negócio no ambiente digital
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out"
            >
              <div className="mb-6 inline-flex rounded-lg bg-gradient-to-r from-purple-300 to-purple-600 p-4 text-white">
                {service.icon}
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
