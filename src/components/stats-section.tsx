"use client"

import { useRef, useState, useEffect } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion"
import {
  Rocket,
  Users,
  Clock,
  TrendingUp,
  Award,
  Zap,
  LucideIcon,
} from "lucide-react"

const stats: {
  value: number
  label: string
  suffix: string
  prefix: string
  icon: LucideIcon
  description: string
  gradient: string
  glowColor: string
}[] = [
  {
    value: 50,
    label: "Projetos Entregues",
    suffix: "+",
    prefix: "",
    icon: Rocket,
    description: "Sites, sistemas e plataformas em produção",
    gradient: "from-purple-500 to-indigo-500",
    glowColor: "rgba(147,51,234,0.3)",
  },
  {
    value: 100,
    label: "Clientes Satisfeitos",
    suffix: "%",
    prefix: "",
    icon: Users,
    description: "Taxa de satisfação nos últimos projetos",
    gradient: "from-green-500 to-emerald-500",
    glowColor: "rgba(34,197,94,0.3)",
  },
  {
    value: 2,
    label: "Horas de Resposta",
    suffix: "h",
    prefix: "<",
    icon: Clock,
    description: "Tempo médio de resposta no WhatsApp",
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59,130,246,0.3)",
  },
  {
    value: 300,
    label: "Aumento em Vendas",
    suffix: "%",
    prefix: "+",
    icon: TrendingUp,
    description: "Resultado médio dos nossos clientes",
    gradient: "from-amber-500 to-orange-500",
    glowColor: "rgba(245,158,11,0.3)",
  },
]

// Contador animado com Framer Motion
function AnimatedNumber({
  value,
  suffix,
  prefix,
  duration = 2,
  delay = 0,
  inView,
}: {
  value: number
  suffix: string
  prefix: string
  duration?: number
  delay?: number
  inView: boolean
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.floor(latest))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return

    const controls = animate(count, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
    })

    const unsubscribe = rounded.on("change", (v) => setDisplay(v))

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [inView, value, duration, delay, count, rounded])

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

// Partícula flutuante
function FloatingDot({
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
        y: [0, -15, 0],
        opacity: [0.15, 0.4, 0.15],
        scale: [1, 1.3, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-24">
      {/* Fundo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/80 to-indigo-950" />

        {/* Gradientes radiais */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_50%)]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Linha animada no topo */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(147,51,234,0.4), rgba(236,72,153,0.4), rgba(147,51,234,0.4), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Linha animada no fundo */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(147,51,234,0.3), rgba(59,130,246,0.3), rgba(147,51,234,0.3), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["200% 0%", "0% 0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />

        {/* Partículas */}
        <FloatingDot delay={0} duration={6} x="10%" y="30%" size={6} color="bg-purple-400/20" />
        <FloatingDot delay={2} duration={8} x="85%" y="20%" size={8} color="bg-blue-400/15" />
        <FloatingDot delay={1} duration={7} x="60%" y="70%" size={5} color="bg-pink-400/15" />
        <FloatingDot delay={3} duration={9} x="30%" y="80%" size={7} color="bg-indigo-400/15" />

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header compacto */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 backdrop-blur-sm">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Award className="h-3.5 w-3.5 text-purple-400" />
            </motion.div>
            <span className="text-xs font-semibold text-purple-300">
              Nossos Números
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Resultados que{" "}
            <motion.span
              className="inline-block"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{ backgroundPosition: ["0% center", "200% center"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              falam por si
            </motion.span>
          </h2>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            const isHovered = hoveredStat === index

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredStat(index)}
                onHoverEnd={() => setHoveredStat(null)}
                className="group relative"
              >
                {/* Glow no hover */}
                {isHovered && (
                  <motion.div
                    className="absolute -inset-1 rounded-2xl blur-xl pointer-events-none"
                    style={{ background: stat.glowColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative h-full flex flex-col items-center rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 md:p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.06] hover:-translate-y-1 overflow-hidden text-center">
                  {/* Barra gradiente topo */}
                  <motion.div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stat.gradient}`}
                    initial={{ scaleX: 0 }}
                    animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Decoração de canto */}
                  <div
                    className={`absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-700 blur-2xl`}
                  />

                  {/* Ícone */}
                  <motion.div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]`}
                    animate={
                      isHovered
                        ? { scale: 1.15, rotate: [0, -8, 8, 0] }
                        : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.5 }}
                  >
                    {/* Fundo ícone hover */}
                    {isHovered && (
                      <motion.div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <Icon
                      className={`relative z-10 h-5 w-5 transition-colors duration-300 ${
                        isHovered ? "text-white" : "text-gray-400"
                      }`}
                    />
                  </motion.div>

                  {/* Número */}
                  <div className="mb-1">
                    <span
                      className="text-4xl font-extrabold tracking-tight md:text-5xl"
                      style={{
                        backgroundImage: `linear-gradient(135deg, white, rgba(255,255,255,0.8))`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      <AnimatedNumber
                        value={stat.value}
                        suffix={stat.suffix}
                        prefix={stat.prefix}
                        duration={2.5}
                        delay={index * 0.2}
                        inView={isInView}
                      />
                    </span>
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-bold text-white/80 mb-1">
                    {stat.label}
                  </h3>

                  {/* Descrição (aparece no hover / sempre em mobile) */}
                  <p className="text-[11px] text-gray-500 leading-relaxed md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    {stat.description}
                  </p>

                  {/* Barra de progresso decorativa */}
                  <div className="mt-4 w-full">
                    <div className="h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: "100%" } : { width: "0%" }}
                        transition={{
                          duration: 2,
                          delay: 0.5 + index * 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Separador inferior decorativo */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500/30" />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-4 w-4 text-purple-500/40" />
          </motion.div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500/30" />
        </motion.div>
      </div>
    </section>
  )
}