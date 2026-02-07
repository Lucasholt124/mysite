"use client"

import { useRef, useState } from "react"
import {
  ArrowRight,
  Shield,
  Clock,
  Server,
  RefreshCw,
  CheckCircle,
  LucideIcon,
  Sparkles,
  Zap,
  Lock,
  Activity,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Users,
} from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const WHATSAPP_LINK =
  "https://wa.me/557999383543?text=Ol%C3%A1!%20Tenho%20interesse%20nos%20planos%20de%20manuten%C3%A7%C3%A3o.%20Podemos%20conversar%3F"

const maintenanceFeatures: {
  icon: LucideIcon
  title: string
  description: string
  stat: string
  statLabel: string
  gradient: string
  glowColor: string
}[] = [
  {
    icon: Shield,
    title: "Proteção Avançada",
    description:
      "Backups diários, monitoramento 24/7 e barreiras contra ameaças para manter seus dados e sua reputação seguros.",
    stat: "99.9%",
    statLabel: "de segurança",
    gradient: "from-emerald-400 to-cyan-400",
    glowColor: "rgba(52,211,153,0.3)",
  },
  {
    icon: Clock,
    title: "Performance Otimizada",
    description:
      "Alta disponibilidade e velocidade, assegurando que seu site esteja sempre acessível e rápido para seus clientes.",
    stat: "<1s",
    statLabel: "de carregamento",
    gradient: "from-blue-400 to-violet-400",
    glowColor: "rgba(96,165,250,0.3)",
  },
  {
    icon: RefreshCw,
    title: "Atualizações Contínuas",
    description:
      "Sistema sempre em dia com as últimas tecnologias, patches de segurança e melhorias de performance.",
    stat: "24/7",
    statLabel: "monitoramento",
    gradient: "from-purple-400 to-pink-400",
    glowColor: "rgba(192,132,252,0.3)",
  },
  {
    icon: Server,
    title: "Suporte Especializado",
    description:
      "Equipe técnica pronta para resolver demandas, prevenir riscos e implementar melhorias sob demanda.",
    stat: "2h",
    statLabel: "tempo de resposta",
    gradient: "from-amber-400 to-orange-400",
    glowColor: "rgba(251,191,36,0.3)",
  },
]

const benefits = [
  {
    icon: AlertTriangle,
    text: "Evite paradas inesperadas e perda de receita",
    highlight: "paradas inesperadas",
  },
  {
    icon: Lock,
    text: "Proteja-se contra vulnerabilidades e ataques",
    highlight: "vulnerabilidades",
  },
  {
    icon: TrendingUp,
    text: "Mantenha a performance e experiência do usuário",
    highlight: "performance",
  },
  {
    icon: DollarSign,
    text: "Reduza custos com manutenções emergenciais",
    highlight: "custos",
  },
  {
    icon: Users,
    text: "Garanta a confiança e fidelidade dos seus clientes",
    highlight: "confiança",
  },
]

// Partículas animadas de fundo
function BackgroundOrb({
  className,
  delay,
  duration,
}: {
  className: string
  delay: number
  duration: number
}) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none blur-3xl ${className}`}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.15, 0.3, 0.15],
        x: [0, 30, 0],
        y: [0, -20, 0],
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

// Grid lines animadas
function GridLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Linhas horizontais */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
          style={{ top: `${(i + 1) * 16}%` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.5, delay: i * 0.1 }}
        />
      ))}
      {/* Linhas verticais */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent"
          style={{ left: `${(i + 1) * 12}%` }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.08 }}
        />
      ))}
    </div>
  )
}

// Pulso de radar
function RadarPulse() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-400/10"
          animate={{
            width: [0, 800],
            height: [0, 800],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 4,
            delay: i * 1.3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export default function MaintenanceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 })
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

  return (
    <section className="relative w-full overflow-hidden bg-gray-950 py-24 text-white md:py-32">
      {/* Fundo animado */}
      <div className="absolute inset-0">
        {/* Gradiente principal */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/80 to-indigo-950" />

        {/* Orbs decorativos */}
        <BackgroundOrb
          className="w-[500px] h-[500px] bg-purple-600/20 top-0 -left-40"
          delay={0}
          duration={8}
        />
        <BackgroundOrb
          className="w-[400px] h-[400px] bg-indigo-600/15 bottom-0 right-0"
          delay={2}
          duration={10}
        />
        <BackgroundOrb
          className="w-[300px] h-[300px] bg-pink-600/10 top-1/2 left-1/3"
          delay={4}
          duration={9}
        />

        {/* Grid */}
        <GridLines />

        {/* Radar */}
        <RadarPulse />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header da seção */}
        <div ref={titleRef} className="mb-20 text-center">
          {/* Badge */}
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 backdrop-blur-sm"
          >
            <motion.div
              className="relative"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-4 w-4 text-green-400" />
            </motion.div>
            <span className="text-sm font-semibold text-purple-300">
              Manutenção & Suporte
            </span>
            <motion.span
              className="h-2 w-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>

          <motion.h2
            variants={titleVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mb-5 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            Sua Operação Digital,{" "}
            <span className="relative inline-block">
              <motion.span
                className="inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #34d399, #60a5fa, #a78bfa, #34d399)",
                  backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% center", "300% center"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Sempre Segura
              </motion.span>

              {/* Underline animado */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #34d399, #60a5fa, #a78bfa)",
                }}
                initial={{ scaleX: 0 }}
                animate={isTitleInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h2>

          <motion.p
            variants={subtitleVariants}
            initial="hidden"
            animate={isTitleInView ? "visible" : "hidden"}
            className="mx-auto max-w-3xl text-lg text-gray-400 md:text-xl leading-relaxed"
          >
            Foque no seu negócio enquanto garantimos que seu site esteja sempre{" "}
            <span className="font-semibold text-white/90">
              atualizado, protegido e performando
            </span>{" "}
            no seu máximo potencial.
          </motion.p>
        </div>

        {/* Cards de features */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
        >
          {maintenanceFeatures.map((feature, index) => {
            const Icon = feature.icon
            const isHovered = hoveredCard === index

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group relative cursor-pointer"
              >
                {/* Glow de fundo */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -inset-1 rounded-2xl blur-xl pointer-events-none"
                      style={{ background: feature.glowColor }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  )}
                </AnimatePresence>

                <div className="relative h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07] hover:-translate-y-2 overflow-hidden">
                  {/* Linha de gradiente no topo */}
                  <motion.div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Mesh decorativo de canto */}
                  <div
                    className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-700 blur-2xl`}
                  />

                  {/* Stat badge */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        className="absolute top-4 right-4 z-10"
                        initial={{ opacity: 0, scale: 0.5, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                      >
                        <div
                          className={`flex flex-col items-center rounded-xl bg-gradient-to-br ${feature.gradient} px-3 py-2 shadow-lg`}
                        >
                          <span className="text-lg font-black text-white leading-none">
                            {feature.stat}
                          </span>
                          <span className="text-[9px] font-medium text-white/80 mt-0.5">
                            {feature.statLabel}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Ícone */}
                  <div className="relative mb-6">
                    <motion.div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-500`}
                      animate={
                        isHovered
                          ? { scale: 1.15, rotate: [0, -8, 8, 0] }
                          : { scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      {/* Fundo do ícone no hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </AnimatePresence>

                      <Icon
                        className={`relative z-10 h-6 w-6 transition-all duration-300 ${
                          isHovered ? "text-white" : "text-gray-400"
                        }`}
                      />
                    </motion.div>

                    {/* Ping ao redor do ícone */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className={`absolute inset-0 h-14 w-14 rounded-xl border bg-gradient-to-br ${feature.gradient} opacity-40`}
                          initial={{ scale: 1, opacity: 0.4 }}
                          animate={{
                            scale: [1, 1.6],
                            opacity: [0.4, 0],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Texto */}
                  <h3 className="mb-3 text-lg font-bold text-white/95 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Mini CTA */}
                  <motion.div
                    className="mt-5 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${
                        feature.gradient.includes("emerald")
                          ? "#34d399, #22d3ee"
                          : feature.gradient.includes("blue")
                          ? "#60a5fa, #8b5cf6"
                          : feature.gradient.includes("purple")
                          ? "#c084fc, #f472b6"
                          : "#fbbf24, #f97316"
                      })`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <span>Saiba mais</span>
                    <motion.div
                      animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
                      transition={{
                        duration: 1,
                        repeat: isHovered ? Infinity : 0,
                      }}
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-white/60" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Seção "Por que investir?" */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isCtaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative"
        >
          {/* Glow atrás do card */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
            {/* Borda gradiente no topo */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

            {/* Padrão decorativo */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-600/[0.04] to-transparent pointer-events-none" />

            <div className="p-8 md:p-12">
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Lado esquerdo */}
                <div className="text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isCtaInView
                        ? { opacity: 1, x: 0 }
                        : { opacity: 0, x: -20 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5">
                      <Zap className="h-3.5 w-3.5 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">
                        Investimento Inteligente
                      </span>
                    </div>

                    <h3 className="mb-5 text-3xl font-extrabold md:text-4xl leading-tight">
                      Tranquilidade e{" "}
                      <span
                        className="inline-block"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, #34d399, #60a5fa)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Performance
                      </span>{" "}
                      Garantidas
                    </h3>

                    <p className="text-gray-400 text-lg leading-relaxed">
                      A manutenção preventiva é o melhor investimento para
                      proteger seus ativos digitais, evitar custos emergenciais e
                      garantir a confiança dos seus clientes.
                    </p>
                  </motion.div>
                </div>

                {/* Lado direito — benefits */}
                <div>
                  <ul className="space-y-3">
                    {benefits.map((benefit, i) => {
                      return (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: 30 }}
                          animate={
                            isCtaInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: 30 }
                          }
                          transition={{
                            duration: 0.5,
                            delay: 0.3 + i * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="group/item flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 transition-all duration-300 group-hover/item:bg-green-500/20 group-hover/item:scale-110">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          </div>
                          <span className="text-gray-300 font-medium group-hover/item:text-white transition-colors text-sm md:text-base">
                            {benefit.text}
                          </span>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isCtaInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                {/* Botão principal → WhatsApp */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group/cta"
                  >
                    {/* Glow pulsante */}
                    <motion.div
                      className="absolute -inset-1 rounded-2xl blur-lg pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e, #16a34a, #22c55e)",
                      }}
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <Button
                      size="lg"
                      className="relative bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl shadow-xl shadow-green-500/20 font-bold px-8 py-6 text-base transition-all duration-300 border-0 overflow-hidden"
                    >
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
                        className="h-5 w-5 mr-2 shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Contratar Manutenção</span>
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

                {/* Botão secundário */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10 hover:border-white/25 font-semibold px-8 py-6 text-base backdrop-blur-sm transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Solicitar Orçamento Grátis
                    </Button>
                  </motion.div>
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isCtaInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500"
              >
                <span className="flex items-center gap-1.5">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Resposta em até 2h
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-gray-600" />
                  Sem fidelidade
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-gray-600" />
                  Cancele quando quiser
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}