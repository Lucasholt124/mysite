"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion"
import {
  Star,
  Quote,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const WHATSAPP_LINK =
  "https://wa.me/5579999383543?text=Ol%C3%A1!%20Vi%20os%20depoimentos%20e%20tenho%20interesse%20em%20um%20projeto.%20Podemos%20conversar%3F"

// Gera avatar SVG com iniciais
const generateAvatar = (name: string, index: number): string => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const gradients = [
    ["#9333ea", "#ec4899"],
    ["#3b82f6", "#06b6d4"],
    ["#f59e0b", "#ef4444"],
    ["#10b981", "#3b82f6"],
    ["#8b5cf6", "#6366f1"],
    ["#f43f5e", "#fb923c"],
  ]

  const [color1, color2] = gradients[index % gradients.length]

  const svg = `
    <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#grad${index})" />
      <text
        x="50%"
        y="50%"
        dominant-baseline="central"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="36"
        font-weight="bold"
        fill="white"
      >
        ${initials}
      </text>
    </svg>
  `
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`
}

const testimonialsData = [
  {
    name: "José Igor",
    role: "Proprietário, JV Peças e Acessórios",
    content:
      "A Impulsioneweb desenvolveu nosso e-commerce do zero e o resultado foi fenomenal. A plataforma é robusta, rápida e nossas vendas de peças para caminhão aumentaram 300% em 6 meses.",
    rating: 5,
    stat: "+300%",
    statLabel: "em vendas",
    highlight: "aumentaram 300%",
    gradient: "from-purple-500 to-pink-500",
    bgGlow: "rgba(147,51,234,0.15)",
  },
  {
    name: "Lucas Aragão",
    role: "Criador de Conteúdo Digital",
    content:
      "O Freelink se tornou uma ferramenta essencial para mim. É muito mais que um 'link na bio'; as análises avançadas me ajudam a entender meu público e otimizar minhas campanhas. Indispensável!",
    rating: 5,
    stat: "10x",
    statLabel: "mais cliques",
    highlight: "ferramenta essencial",
    gradient: "from-blue-500 to-cyan-500",
    bgGlow: "rgba(59,130,246,0.15)",
  },
  {
    name: "Ricardo Alves",
    role: "Fundador, Café Aconchego",
    content:
      "Precisávamos de um site charmoso com sistema de pedidos online. A equipe entregou um projeto lindo, funcional e que otimizou nosso serviço de delivery, trazendo muitos clientes novos.",
    rating: 5,
    stat: "+85%",
    statLabel: "novos clientes",
    highlight: "muitos clientes novos",
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "rgba(245,158,11,0.15)",
  },
]

const testimonials = testimonialsData.map((testimonial, index) => ({
  ...testimonial,
  avatar: generateAvatar(testimonial.name, index),
}))

// Estrelas animadas
function AnimatedStars({ rating, delay = 0 }: { rating: number; delay?: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            duration: 0.4,
            delay: delay + i * 0.08,
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
        >
          <Star
            className={`h-4 w-4 ${
              i < rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
            }`}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Partículas decorativas
function FloatingParticle({
  delay,
  duration,
  x,
  y,
  size,
  color,
}: {
  delay: number
  duration: number
  x: string
  y: string
  size: number
  color: string
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${color}`}
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -25, 0],
        x: [0, 12, 0],
        opacity: [0.15, 0.4, 0.15],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [activeTestimonialMobile, setActiveTestimonialMobile] = useState(0)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const nextTestimonial = () => {
    setActiveTestimonialMobile((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    )
  }

  const prevTestimonial = () => {
    setActiveTestimonialMobile((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    )
  }

  return (
    <section
      id="depoimentos"
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-24 md:py-32"
    >
      {/* Decoração de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grade pontilhada */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(147,51,234) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Gradientes radiais */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-purple-100/30 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-blue-100/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-gradient-radial from-pink-100/20 via-transparent to-transparent rounded-full blur-3xl" />

        {/* Partículas */}
        <FloatingParticle delay={0} duration={7} x="8%" y="25%" size={8} color="bg-purple-300/30" />
        <FloatingParticle delay={2} duration={9} x="88%" y="18%" size={6} color="bg-blue-300/30" />
        <FloatingParticle delay={1} duration={8} x="75%" y="75%" size={10} color="bg-pink-300/20" />
        <FloatingParticle delay={3} duration={6} x="15%" y="80%" size={7} color="bg-amber-300/25" />
        <FloatingParticle delay={1.5} duration={7.5} x="55%" y="8%" size={5} color="bg-indigo-300/25" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div ref={titleRef} className="mb-20 text-center">
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-4 py-2 backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="h-4 w-4 text-purple-500" />
            </motion.div>
            <span className="text-sm font-semibold text-purple-700">
              Depoimentos
            </span>
          </motion.div>

          <motion.h2
            variants={titleVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
          >
            Quem confia,{" "}
            <span className="relative inline-block">
              <motion.span
                className="inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #9333ea, #ec4899, #f59e0b, #9333ea)",
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% center", "300% center"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                recomenda
              </motion.span>

              {/* Underline animado */}
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                  isTitleInView
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: 0, opacity: 0 }
                }
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 8 C 40 2, 80 2, 100 6 S 160 12, 198 4"
                  stroke="url(#testimonialUnderline)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={
                    isTitleInView ? { pathLength: 1 } : { pathLength: 0 }
                  }
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="testimonialUnderline"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h2>

          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mx-auto max-w-3xl text-lg text-gray-500 md:text-xl leading-relaxed"
          >
            Resultados reais de empresas que confiaram na nossa expertise para{" "}
            <span className="font-semibold text-gray-700">
              crescer e se destacar
            </span>{" "}
            no mundo digital.
          </motion.p>

          {/* Stats resumo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { value: "50+", label: "Projetos Entregues" },
              { value: "100%", label: "Satisfação" },
              { value: "4.9", label: "Avaliação Média", icon: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </span>
                <div className="flex flex-col items-start">
                  {stat.icon && (
                    <div className="flex gap-0.5 mb-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className="h-2.5 w-2.5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-gray-500 font-medium">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Cards Desktop (lg+) */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8"
          aria-label="Depoimentos de clientes"
        >
          {testimonials.map((testimonial, index) => {
            const isHovered = hoveredCard === index

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative"
              >
                {/* Glow */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -inset-2 rounded-3xl blur-xl pointer-events-none"
                      style={{ background: testimonial.bgGlow }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative h-full flex flex-col rounded-2xl border border-gray-200/80 bg-white p-8 transition-all duration-500 hover:border-gray-300 hover:shadow-2xl hover:-translate-y-3 overflow-hidden">
                  {/* Barra gradiente topo */}
                  <motion.div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Mesh decorativo */}
                  <div
                    className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700 blur-2xl`}
                  />

                  {/* Aspas estilizadas */}
                  <motion.div
                    className="absolute right-6 top-6"
                    animate={
                      isHovered
                        ? { scale: 1.2, rotate: 10, opacity: 0.15 }
                        : { scale: 1, rotate: 0, opacity: 0.08 }
                    }
                    transition={{ duration: 0.4 }}
                  >
                    <Quote className={`h-16 w-16 bg-gradient-to-br ${testimonial.gradient} bg-clip-text`} style={{ color: isHovered ? undefined : '#e5e7eb' }} />
                  </motion.div>

                  {/* Stat badge */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute top-4 right-4 z-20"
                        initial={{ opacity: 0, scale: 0.5, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                      >
                        <div
                          className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r ${testimonial.gradient} px-3 py-1.5 text-white shadow-lg`}
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span className="text-xs font-bold">
                            {testimonial.stat}
                          </span>
                          <span className="text-[10px] opacity-80">
                            {testimonial.statLabel}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Avatar + Info */}
                  <div className="relative z-10 mb-5 flex items-center gap-4">
                    <motion.div
                      className="relative shrink-0"
                      animate={
                        isHovered
                          ? { scale: 1.1 }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {/* Ring animado */}
                      <div
                        className={`absolute -inset-1 rounded-full bg-gradient-to-r ${testimonial.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]`}
                      />
                      <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-md">
                        <Image
                          src={testimonial.avatar}
                          alt={`Avatar de ${testimonial.name}`}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Status online */}
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 leading-tight">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Estrelas */}
                  <div className="relative z-10 mb-4">
                    <AnimatedStars rating={testimonial.rating} delay={0.3 + index * 0.15} />
                  </div>

                  {/* Conteúdo */}
                  <p className="relative z-10 flex-1 text-gray-600 text-[15px] leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Verificado */}
                  <motion.div
                    className="relative z-10 mt-5 flex items-center gap-2 pt-5 border-t border-gray-100"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.8 + index * 0.15 }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <motion.svg
                        className="h-3.5 w-3.5 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6L9 17l-5-5"
                          initial={{ pathLength: 0 }}
                          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                          transition={{
                            duration: 0.6,
                            delay: 1 + index * 0.15,
                          }}
                        />
                      </motion.svg>
                      Cliente verificado
                    </div>

                    <span className="text-xs text-gray-400 ml-auto">
                      {testimonial.stat} {testimonial.statLabel}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Cards Mobile (< lg) — Carousel */}
        <div className="lg:hidden">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === activeTestimonialMobile && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="relative rounded-2xl border border-gray-200/80 bg-white p-7 shadow-lg overflow-hidden"
                    >
                      {/* Barra topo */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${testimonial.gradient}`}
                      />

                      {/* Aspas */}
                      <div className="absolute right-5 top-5 opacity-[0.06]">
                        <Quote className="h-14 w-14 text-gray-400" />
                      </div>

                      {/* Stat badge mobile */}
                      <div
                        className={`absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r ${testimonial.gradient} px-2.5 py-1 text-white shadow-md`}
                      >
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs font-bold">
                          {testimonial.stat}
                        </span>
                      </div>

                      {/* Avatar */}
                      <div className="relative z-10 mb-5 flex items-center gap-4">
                        <div className="relative shrink-0">
                          <div
                            className={`absolute -inset-1 rounded-full bg-gradient-to-r ${testimonial.gradient} opacity-60 blur-[2px]`}
                          />
                          <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-md">
                            <Image
                              src={testimonial.avatar}
                              alt={`Avatar de ${testimonial.name}`}
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>

                      {/* Estrelas */}
                      <div className="relative z-10 mb-4">
                        <AnimatedStars rating={testimonial.rating} />
                      </div>

                      {/* Conteúdo */}
                      <p className="relative z-10 text-gray-600 text-[15px] leading-relaxed mb-5">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>

                      {/* Verificado */}
                      <div className="relative z-10 flex items-center gap-2 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                          <svg
                            className="h-3.5 w-3.5 text-green-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                          Cliente verificado
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">
                          {testimonial.stat} {testimonial.statLabel}
                        </span>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            {/* Controles do carousel */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTestimonial}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-purple-50 hover:border-purple-200 transition-colors"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </motion.button>

              {/* Indicadores */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveTestimonialMobile(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeTestimonialMobile
                        ? "w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    aria-label={`Ir para depoimento ${i + 1}`}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTestimonial}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-purple-50 hover:border-purple-200 transition-colors"
                aria-label="Próximo depoimento"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* CTA inferior */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block">
            {/* Glow */}
            <motion.div
              className="absolute -inset-3 rounded-2xl blur-xl opacity-30 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, #22c55e, #16a34a, #22c55e)",
              }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative group overflow-hidden"
              >
                <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-white font-bold text-lg shadow-xl shadow-green-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30">
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
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
                      repeatDelay: 3,
                    }}
                  />

                  {/* WhatsApp icon */}
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Quero resultados assim também!</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </div>
              </motion.div>
            </a>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-4 text-sm text-gray-400"
          >
            Junte-se a mais de 50 empresas satisfeitas • Orçamento gratuito
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}