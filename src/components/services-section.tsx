"use client"

import { useRef, useState } from "react"
import {
  Code,
  Globe,
  LayoutGrid,
  Palette,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Star,
} from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"

const WHATSAPP_LINK =
  "https://wa.me/5579999383545?text=Ol%C3%A1!%20Tenho%20interesse%20em%20iniciar%20um%20projeto.%20Podemos%20conversar%3F"

const services = [
  {
    icon: Globe,
    title: "Criação de Sites e Lojas Virtuais",
    description:
      "Sites e e-commerces responsivos, otimizados para SEO e focados em performance para valorizar sua marca e gerar vendas.",
    features: ["Design Responsivo", "SEO Otimizado", "Alta Performance"],
    gradient: "from-purple-500 to-indigo-600",
    shadowColor: "shadow-purple-500/20",
    bgAccent: "bg-purple-50",
    textAccent: "text-purple-600",
    borderAccent: "border-purple-200",
    hoverBorder: "group-hover:border-purple-400",
    stat: "+300%",
    statLabel: "mais visibilidade",
  },
  {
    icon: Code,
    title: "Sistemas Web Sob Medida",
    description:
      "Sistemas e plataformas web personalizadas para automatizar processos, aumentar a eficiência e escalar o seu negócio.",
    features: ["Automação", "Escalabilidade", "Integração API"],
    gradient: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/20",
    bgAccent: "bg-blue-50",
    textAccent: "text-blue-600",
    borderAccent: "border-blue-200",
    hoverBorder: "group-hover:border-blue-400",
    stat: "10x",
    statLabel: "mais eficiência",
  },
  {
    icon: Palette,
    title: "Design de Experiência (UI/UX)",
    description:
      "Interfaces intuitivas e experiências de usuário que encantam, aumentam a conversão e fidelizam seus clientes.",
    features: ["UI Moderna", "UX Research", "Prototipagem"],
    gradient: "from-pink-500 to-rose-500",
    shadowColor: "shadow-pink-500/20",
    bgAccent: "bg-pink-50",
    textAccent: "text-pink-600",
    borderAccent: "border-pink-200",
    hoverBorder: "group-hover:border-pink-400",
    stat: "+85%",
    statLabel: "mais conversão",
  },
  {
    icon: LayoutGrid,
    title: "Desenvolvimento de Plataformas",
    description:
      "Ecossistemas digitais robustos, como marketplaces e redes sociais, transformando suas ideias em realidade.",
    features: ["Marketplace", "SaaS", "Redes Sociais"],
    gradient: "from-amber-500 to-orange-500",
    shadowColor: "shadow-amber-500/20",
    bgAccent: "bg-amber-50",
    textAccent: "text-amber-600",
    borderAccent: "border-amber-200",
    hoverBorder: "group-hover:border-amber-400",
    stat: "∞",
    statLabel: "possibilidades",
  },
]

// Partículas flutuantes de fundo
function FloatingParticle({
  delay,
  duration,
  x,
  y,
  size,
}: {
  delay: number
  duration: number
  x: string
  y: string
  size: number
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-purple-300/20 pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section
      id="servicos"
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white py-24 md:py-32"
    >
      {/* Decoração de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grade sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(147,51,234) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradiente radial decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-radial from-purple-100/40 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-pink-100/30 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-gradient-radial from-blue-100/30 via-transparent to-transparent rounded-full blur-3xl" />

        {/* Partículas flutuantes */}
        <FloatingParticle delay={0} duration={6} x="10%" y="20%" size={8} />
        <FloatingParticle delay={1} duration={8} x="85%" y="15%" size={6} />
        <FloatingParticle delay={2} duration={7} x="70%" y="70%" size={10} />
        <FloatingParticle delay={3} duration={9} x="20%" y="80%" size={7} />
        <FloatingParticle delay={1.5} duration={6.5} x="50%" y="10%" size={5} />
        <FloatingParticle delay={4} duration={7.5} x="90%" y="60%" size={8} />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Cabeçalho da seção */}
        <div ref={titleRef} className="mb-20 text-center">
          {/* Badge */}
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-4 py-2 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
            </motion.div>
            <span className="text-sm font-semibold text-purple-700">
              Nossos Serviços
            </span>
          </motion.div>

          <motion.h2
            variants={titleVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
          >
            Soluções Sob Medida para o{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto]">
                <motion.span
                  className="inline-block"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #9333ea, #ec4899, #9333ea)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  animate={{
                    backgroundPosition: ["0% center", "200% center"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  Seu Sucesso
                </motion.span>
              </span>
              {/* Sublinhado decorativo */}
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
                  stroke="url(#underlineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isTitleInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient
                    id="underlineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#9333ea" />
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
            Da concepção à implementação, oferecemos a{" "}
            <span className="font-semibold text-gray-700">
              expertise digital completa
            </span>{" "}
            para transformar seus objetivos em resultados concretos.
          </motion.p>
        </div>

        {/* Grid de serviços */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-8"
          aria-label="Lista de serviços"
        >
          {services.map((service, index) => {
            const Icon = service.icon
            const isHovered = hoveredCard === index

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className={`group relative cursor-pointer rounded-2xl border bg-white p-7 transition-all duration-500 ${service.borderAccent} ${service.hoverBorder} hover:shadow-2xl hover:-translate-y-3`}
              >
                {/* Glow de fundo no hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${service.gradient} opacity-[0.06] pointer-events-none`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.06 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Shimmer no topo do card */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Estatística flutuante */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -top-3 -right-2 z-10"
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <div
                        className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${service.gradient} px-3 py-1.5 text-white shadow-lg ${service.shadowColor}`}
                      >
                        <Zap className="h-3 w-3" />
                        <span className="text-xs font-bold">
                          {service.stat}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ícone */}
                <div className="relative mb-6">
                  <motion.div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${service.bgAccent} ${service.textAccent} transition-all duration-500`}
                    animate={
                      isHovered
                        ? { scale: 1.1, rotate: [0, -5, 5, 0] }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {/* Glow do ícone */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </AnimatePresence>

                    <Icon
                      className={`relative z-10 h-7 w-7 transition-colors duration-300 ${
                        isHovered ? "text-white" : ""
                      }`}
                    />
                  </motion.div>

                  {/* Partículas ao redor do ícone */}
                  <AnimatePresence>
                    {isHovered && (
                      <>
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.gradient}`}
                            initial={{
                              opacity: 0,
                              x: 32,
                              y: 32,
                              scale: 0,
                            }}
                            animate={{
                              opacity: [0, 1, 0],
                              x: 32 + Math.cos((i * 2 * Math.PI) / 3) * 35,
                              y: 32 + Math.sin((i * 2 * Math.PI) / 3) * 35,
                              scale: [0, 1.2, 0],
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                              duration: 1,
                              delay: i * 0.15,
                              repeat: Infinity,
                              repeatDelay: 0.5,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Conteúdo */}
                <h3 className="mb-3 text-lg font-bold text-gray-900 leading-snug group-hover:text-gray-800 transition-colors">
                  {service.title}
                </h3>

                <p className="mb-5 text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                  {service.description}
                </p>

                {/* Features tags */}
                <div className="mb-5 flex flex-wrap gap-2">
                  {service.features.map((feature, i) => (
                    <motion.span
                      key={i}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${service.bgAccent} ${service.textAccent} border ${service.borderAccent} transition-all duration-300`}
                      initial={false}
                      animate={
                        isHovered
                          ? {
                              scale: 1.05,
                              transition: { delay: i * 0.05 },
                            }
                          : { scale: 1 }
                      }
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {feature}
                    </motion.span>
                  ))}
                </div>

                {/* Stat label visível no hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="mb-4 flex items-center gap-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs text-gray-500">
                        <span className={`font-bold ${service.textAccent}`}>
                          {service.stat}
                        </span>{" "}
                        {service.statLabel}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CTA do card */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    className={`flex items-center justify-center gap-2 rounded-xl border ${service.borderAccent} ${service.bgAccent} px-4 py-2.5 text-sm font-semibold ${service.textAccent} transition-all duration-300 group-hover:bg-gradient-to-r group-hover:${service.gradient} group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:${service.shadowColor}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Solicitar Orçamento</span>
                    <motion.div
                      animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
                      transition={{
                        duration: 1,
                        repeat: isHovered ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </motion.div>
                </a>
              </motion.div>
            )
          })}
        </motion.div>

        {/* CTA inferior */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 text-center"
        >
          <div className="relative inline-block">
            {/* Glow pulsante */}
            <motion.div
              className="absolute -inset-3 rounded-2xl blur-xl opacity-30"
              style={{
                background:
                  "linear-gradient(135deg, #9333ea, #ec4899, #9333ea)",
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
                <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-8 py-4 text-white font-bold text-lg shadow-xl shadow-purple-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30">
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
                  <span>Tem um projeto em mente? Vamos conversar!</span>
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
            Orçamento 100% gratuito • Resposta em até 2 horas
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}