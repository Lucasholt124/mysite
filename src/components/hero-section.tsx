"use client"

import { MouseEvent, useEffect, useState } from "react"
import {
  ArrowRight,
  Sparkles,
  Code2,
  Palette,
  Rocket,
  CheckCircle2,
  Star,
  Zap,
  Globe,

} from "lucide-react"
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion"
import Link from "next/link"

const WHATSAPP_LINK =
  "https://wa.me/5579999383543?text=Ol%C3%A1!%20Gostaria%20de%20iniciar%20um%20projeto.%20Podemos%20conversar%3F"

// Grid interativo com mouse
function GridPattern({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const maskImage = useMotionValue<string>(
    "radial-gradient(300px at 50% 50%, white, transparent)"
  )

  useMotionValueEvent(mouseX, "change", (latestX) => {
    maskImage.set(
      `radial-gradient(400px at ${latestX * 100}% ${mouseY.get() * 100}%, white, transparent 80%)`
    )
  })

  const style = {
    maskImage,
    WebkitMaskImage: maskImage,
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-br from-purple-500/25 via-indigo-500/20 to-pink-500/20"
        style={style}
      />
      <div className="absolute inset-0 z-0 mix-blend-soft-light">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="heroGrid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>
    </div>
  )
}

// Meteoros
function Meteor({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none z-[1]"
      style={{ left, top: "-5%" }}
      initial={{ y: "-10%", x: "0%", opacity: 0 }}
      animate={{ y: "120%", x: "30%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 1.8,
        delay,
        repeat: Infinity,
        repeatDelay: 7 + Math.random() * 6,
        ease: "linear",
      }}
    >
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[35deg]" />
    </motion.div>
  )
}

// Orb flutuante
function FloatingOrb({
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
        x: [0, 40, 0],
        y: [0, -30, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

// Ícones orbitais flutuantes
function FloatingIcon({
  icon: Icon,
  delay,
  x,
  y,
  size,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  delay: number
  x: string
  y: string
  size: number
}) {
  return (
    <motion.div
      className="absolute pointer-events-none z-[1] hidden md:block"
      style={{ left: x, top: y }}
      animate={{
        y: [0, -15, 0],
        x: [0, 8, 0],
        rotate: [0, 10, -10, 0],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
        <Icon className={`text-white/40`} style={{ width: size, height: size }} />
      </div>
    </motion.div>
  )
}

// Texto digitado
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    let i = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i))
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 50)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])

  return (
    <span>
      {displayText}
      {showCursor && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-purple-400 ml-0.5 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </span>
  )
}

// Contador animado
function AnimatedCounter({
  value,
  suffix = "",
  duration = 2,
  delay = 0,
}: {
  value: number
  suffix?: string
  duration?: number
  delay?: number
}) {
  const [count, setCount] = useState(0)
  const [, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStarted(true)
      let start = 0
      const increment = value / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, duration, delay])

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export default function HeroSection() {
  const mouseX = useSpring(0.5, { stiffness: 400, damping: 90 })
  const mouseY = useSpring(0.5, { stiffness: 400, damping: 90 })

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - left) / width)
    mouseY.set((e.clientY - top) / height)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const stats = [
    { value: 50, suffix: "+", label: "Projetos", icon: Rocket },
    { value: 100, suffix: "%", label: "Satisfação", icon: Star },
    { value: 2, suffix: "h", label: "Resposta", icon: Zap },
  ]

  const trustBadges = [
    "Sites Responsivos",
    "SEO Otimizado",
    "Suporte Dedicado",
    "Design Exclusivo",
  ]

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gray-950 px-4 py-24 md:py-32"
    >
      {/* Fundo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/60 to-indigo-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.1),transparent_50%)]" />
      </div>

      {/* Grid interativo */}
      <GridPattern mouseX={mouseX} mouseY={mouseY} />

      {/* Orbs */}
      <FloatingOrb
        className="w-[500px] h-[500px] bg-purple-600/15 -top-40 -left-40"
        delay={0}
        duration={10}
      />
      <FloatingOrb
        className="w-[400px] h-[400px] bg-pink-600/10 -bottom-20 -right-20"
        delay={3}
        duration={12}
      />
      <FloatingOrb
        className="w-[300px] h-[300px] bg-indigo-600/10 top-1/3 right-1/4"
        delay={6}
        duration={9}
      />

      {/* Meteoros */}
      <Meteor delay={1} left="15%" />
      <Meteor delay={4} left="55%" />
      <Meteor delay={7} left="35%" />
      <Meteor delay={10} left="75%" />
      <Meteor delay={13} left="45%" />

      {/* Pulsos */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/[0.06] pointer-events-none"
          animate={{
            width: [0, 800 + i * 200],
            height: [0, 800 + i * 200],
            opacity: [0.2, 0],
          }}
          transition={{
            duration: 5,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Ícones flutuantes */}
      <FloatingIcon icon={Code2} delay={0} x="8%" y="25%" size={18} />
      <FloatingIcon icon={Palette} delay={1.5} x="88%" y="20%" size={18} />
      <FloatingIcon icon={Globe} delay={3} x="82%" y="65%" size={18} />
      <FloatingIcon icon={Rocket} delay={4.5} x="12%" y="70%" size={18} />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Conteúdo */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto text-center max-w-5xl"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8 inline-block">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2.5 backdrop-blur-sm"
            whileHover={{ scale: 1.05, borderColor: "rgba(147,51,234,0.5)" }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
            </motion.div>
            <span className="text-sm font-semibold text-purple-200">
              <TypewriterText
                text="Soluções Digitais de Alto Impacto"
                delay={800}
              />
            </span>
            <motion.div
              className="h-2 w-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05]"
        >
          <span className="block">Transformando</span>
          <span className="block mt-1">
            <span className="relative inline-block">
              <motion.span
                className="inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #a78bfa, #ec4899, #f59e0b, #34d399, #a78bfa)",
                  backgroundSize: "400% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
                animate={{
                  backgroundPosition: ["0% center", "400% center"],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                ideias
              </motion.span>

              {/* Sparkle decorativo */}
              <motion.div
                className="absolute -top-4 -right-6 hidden sm:block"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-amber-400/80" />
              </motion.div>
            </span>{" "}
            em{" "}
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
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                realidade
              </motion.span>

              {/* Underline animado */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #34d399, #60a5fa, #a78bfa)",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </span>
          <motion.span
            className="block text-white/90 mt-1"
            variants={itemVariants}
          >
            digital.
          </motion.span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          variants={itemVariants}
          className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed"
        >
          Criamos a ponte entre sua{" "}
          <span className="font-semibold text-white">visão</span> e o{" "}
          <span className="font-semibold text-white">sucesso online</span> com
          soluções de tecnologia e design sob medida.
        </motion.p>

        {/* Trust badges */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex flex-wrap items-center justify-center gap-3"
        >
          {trustBadges.map((badge, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
              whileHover={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              <span className="text-xs text-gray-400 font-medium">
                {badge}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5"
        >
          {/* CTA Principal → WhatsApp */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              {/* Glow */}
              <motion.div
                className="absolute -inset-1.5 rounded-2xl blur-lg pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #22c55e, #10b981, #22c55e)",
                }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-green-500/30 transition-all duration-300 overflow-hidden">
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 45%, rgba(255,255,255,0.25) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["-100% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />

                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Iniciar Projeto</span>
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

          {/* CTA Secundário */}
          <Link href="/#servicos">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group"
            >
              <div className="flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10">
                <Rocket className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span>Nossos Serviços</span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {stats.map((stat, i) => {
            const StatIcon = stat.icon
            return (
              <motion.div
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 1.8 + i * 0.15,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
                  <StatIcon className="h-4 w-4 text-purple-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-extrabold text-white leading-none">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      delay={2000 + i * 200}
                    />
                  </div>
                  <div className="text-xs text-gray-500 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="mt-12 inline-flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.6 }}
        >
          {/* Avatares */}
          <div className="flex -space-x-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const gradients = [
                "from-purple-500 to-pink-500",
                "from-blue-500 to-cyan-500",
                "from-amber-500 to-orange-500",
                "from-green-500 to-emerald-500",
                "from-indigo-500 to-violet-500",
              ]
              const initials = ["JI", "LA", "RA", "MS", "CF"]
              return (
                <motion.div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${gradients[i]} border-2 border-gray-950`}
                  initial={{ opacity: 0, scale: 0, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{
                    delay: 2.6 + i * 0.08,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <span className="text-[10px] font-bold text-white">
                    {initials[i]}
                  </span>
                </motion.div>
              )
            })}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.9 + j * 0.05 }}
                  >
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">4.9/5</span>
            </div>
            <span className="text-xs text-gray-400">
              <span className="font-semibold text-white">+50 clientes</span>{" "}
              satisfeitos
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.6 }}
      >
        <span className="text-[10px] font-medium uppercase tracking-widest text-gray-600">
          Scroll
        </span>
        <motion.div
          className="flex h-8 w-5 items-start justify-center rounded-full border border-white/10 p-1"
          animate={{ borderColor: ["rgba(255,255,255,0.1)", "rgba(147,51,234,0.3)", "rgba(255,255,255,0.1)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="h-1.5 w-1.5 rounded-full bg-purple-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Gradiente inferior → transição para a próxima seção */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-[2]"
        aria-hidden="true"
      />
    </section>
  )
}