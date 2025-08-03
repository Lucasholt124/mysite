"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"

// --- Função para gerar avatares em SVG dinamicamente ---
// Ela cria um avatar com as iniciais e uma cor de fundo única.
const generateAvatar = (name: string, index: number): string => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  // Paleta de cores suaves e profissionais
  const colors = [
    "#E9D5FF", // Roxo claro
    "#D1FAE5", // Verde claro
    "#DBEAFE", // Azul claro
    "#FEE2E2", // Vermelho claro
    "#FEF3C7", // Amarelo claro
    "#E0E7FF", // Indigo claro
  ]

  const textColors = [
    "#581C87", // Roxo escuro
    "#065F46", // Verde escuro
    "#1E40AF", // Azul escuro
    "#991B1B", // Vermelho escuro
    "#92400E", // Amarelo escuro
    "#3730A3", // Indigo escuro
  ]

  const bgColor = colors[index % colors.length];
  const textColor = textColors[index % textColors.length];

  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${bgColor}" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="40"
        font-weight="bold"
        fill="${textColor}"
      >
        ${initials}
      </text>
    </svg>
  `
  // Codifica o SVG para ser usado em um Data URL
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

// --- Dados dos Depoimentos Atualizados ---
const testimonialsData = [
  {
    name: "José Igor",
    role: "Proprietário, JV Peças e Acessórios",
    content:
      "A Impulsioneweb desenvolveu nosso e-commerce do zero e o resultado foi fenomenal. A plataforma é robusta, rápida e nossas vendas de peças para caminhão aumentaram 300% em 6 meses.",
  },
  {
    name: "Lucas Aragão",
    role: "Criadora de Conteúdo Digital",
    content:
      "O Freelink se tornou uma ferramenta essencial para mim. É muito mais que um 'link na bio'; as análises avançadas me ajudam a entender meu público e otimizar minhas campanhas. Indispensável!",
  },
  {
    name: "Ricardo Alves",
    role: "Fundador, Café Aconchego",
    content:
      "Precisávamos de um site charmoso com sistema de pedidos online. A equipe entregou um projeto lindo, funcional e que otimizou nosso serviço de delivery, trazendo muitos clientes novos.",
  },
]

// Adiciona os avatares gerados aos dados
const testimonials = testimonialsData.map((testimonial, index) => ({
  ...testimonial,
  avatar: generateAvatar(testimonial.name, index),
}))

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="w-full bg-gray-50 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Resultados reais de empresas que confiaram na nossa expertise para crescer.
          </p>
        </div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          aria-label="Depoimentos de clientes"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              {/* Aspas estilizadas */}
              <div className="absolute left-6 top-6 text-7xl font-bold text-gray-100 select-none -z-0">“</div>

              <div className="relative z-10 mb-6 flex items-center">
                <div className="mr-4 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <Image
                    src={testimonial.avatar}
                    alt={`Avatar de ${testimonial.name}`}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="relative z-10 text-gray-700 text-base leading-relaxed">
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}