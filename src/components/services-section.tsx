"use client"

import { useRef } from "react"
import { Code, Globe, LayoutGrid, Palette } from "lucide-react" // Troquei MessageSquare por Palette para UI/UX
import { motion, useInView } from "framer-motion"

// --- Melhoria de Código: Passando o componente do ícone, não o elemento JSX ---
// Isso torna o array de dados mais limpo e a lógica de renderização mais flexível.
const services = [
  {
    icon: Globe,
    title: "Criação de Sites e Lojas Virtuais",
    description: "Desenvolvemos sites e e-commerces responsivos, otimizados para SEO e focados em performance para valorizar sua marca e gerar vendas.",
  },
  {
    icon: Code,
    title: "Sistemas Web Sob Medida",
    description: "Criamos sistemas e plataformas web personalizadas para automatizar processos, aumentar a eficiência e escalar o seu negócio.",
  },
  {
    icon: Palette, // Ícone mais visual para design
    title: "Design de Experiência (UI/UX)",
    description: "Projetamos interfaces intuitivas e experiências de usuário que encantam, aumentam a conversão e fidelizam seus clientes.",
  },
  {
    icon: LayoutGrid, // Movi o LayoutGrid para cá, faz mais sentido para 'plataformas'
    title: "Desenvolvimento de Plataformas",
    description: "Construímos ecossistemas digitais robustos, como marketplaces e redes sociais, transformando suas ideias em realidade.",
  },
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  // O `amount: 0.2` significa que a animação começa quando 20% do elemento está visível.
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Atraso um pouco maior para um efeito mais cadenciado
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut", // Efeito de desaceleração suave
      },
    },
  }

  return (
    <section id="servicos" className="w-full bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Soluções Sob Medida para o Seu Sucesso
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Da concepção à implementação, oferecemos a expertise digital completa para transformar seus objetivos em resultados concretos.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          // --- Melhoria de Layout: Grid adaptativo ---
          // Agora com 4 colunas em telas grandes, evitando linhas "quebradas".
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Lista de serviços"
        >
          {services.map((service, index) => {
            const Icon = service.icon // Boa prática: atribuir o componente a uma variável com letra maiúscula.
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                // --- Melhoria Visual: Efeitos de hover mais dinâmicos ---
                className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:!border-purple-600 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}