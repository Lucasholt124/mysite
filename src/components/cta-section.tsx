"use client"

import { useRef } from "react"
import {
  ArrowRight,
  Sparkles,
  Rocket,
  MessageCircle,
  CheckCircle2,
  Zap,
  Shield,
  Clock,
} from "lucide-react"
import { motion, useInView } from "framer-motion"

const WHATSAPP_LINK =
  "https://wa.me/5579999383543?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20para%20meu%20projeto.%20Podemos%20conversar%3F"

const trustItems = [
  { icon: Clock, text: "Resposta em até 2h" },
  { icon: Shield, text: "Orçamento 100% gratuito" },
  { icon: Zap, text: "Sem compromisso" },
]

const benefits = [
  "Site profissional e responsivo",
  "Otimização para Google (SEO)",
  "Suporte dedicado pós-entrega",
  "Design exclusivo para sua marca",
]

// Partículas orbitais
function OrbitParticle({
  size,
  radius,
  duration,
  delay,
  color,
}: {
  size: number
  radius: number
  duration: number
  delay: number
  color: string
}) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-none"
      style={{ width: size, height: size }}
      animate={{
        x: [
          Math.cos(0) * radius,
          Math.cos(Math.PI / 2) * radius,
          Math.cos(Math.PI) * radius,
          Math.cos((3 * Math.PI) / 2) * radius,
          Math.cos(2 * Math.PI) * radius,
        ],
        y: [
          Math.sin(0) * radius,
          Math.sin(Math.PI / 2) * radius,
          Math.sin(Math.PI) * radius,
          Math.sin((3 * Math.PI) / 2) * radius,
          Math.sin(2 * Math.PI) * radius,
        ],
        opacity: [0.2, 0.6, 0.2, 0.6, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div
        className={`h-full w-full rounded-full ${color} blur-[1px]`}
      />
    </motion.div>
  )
}

// Meteoros
function Meteor({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left, top: "-5%" }}
      initial={{ y: "-10%", x: "0%", opacity: 0 }}
      animate={{
        y: "120%",
        x: "40%",
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: 8 + Math.random() * 5,
        ease: "linear",
      }}
    >
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-transparent rotate-[35deg]" />
    </motion.div>
  )
}

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="relative w-full overflow-hidden py-28 md:py-36 text-white">
      {/* Fundo complexo */}
      <div className="absolute inset-0">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950 to-indigo-950" />

        {/* Gradientes sobrepostos */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_50%)]" />

        {/* Orbs flutuantes */}
        <motion.div
          className="absolute top-10 left-[15%] w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-[10%] w-96 h-96 rounded-full bg-pink-600/10 blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Meteoros */}
        <Meteor delay={0} left="20%" />
        <Meteor delay={3} left="60%" />
        <Meteor delay={6} left="40%" />
        <Meteor delay={9} left="80%" />

        {/* Pulso central */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10 pointer-events-none"
            animate={{
              width: [0, 600 + i * 200],
              height: [0, 600 + i * 200],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: 5,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Conteúdo */}
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container relative mx-auto px-4"
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8 inline-block">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-5 py-2.5 backdrop-blur-sm">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Rocket className="h-4 w-4 text-purple-300" />
              </motion.div>
              <span className="text-sm font-semibold text-purple-200">
                Pronto para decolar?
              </span>
              <motion.div
                className="h-2 w-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Título */}
          <motion.h2
            variants={itemVariants}
            className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-7xl leading-[1.1]"
          >
            Pronto para{" "}
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
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Elevar
              </motion.span>

              {/* Sparkle ao lado */}
              <motion.div
                className="absolute -top-3 -right-6"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-5 w-5 text-amber-400" />
              </motion.div>
            </span>
            <br className="hidden sm:block" />
            Seu Negócio?
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl leading-relaxed"
          >
            Vamos transformar sua visão em uma{" "}
            <span className="font-semibold text-white">
              solução digital de alto impacto
            </span>
            . Solicite uma proposta sem compromisso e dê o próximo passo.
          </motion.p>

          {/* Mini benefits */}
          <motion.div
            variants={itemVariants}
            className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-400"
                initial={{ opacity: 0, x: -10 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                }
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              >
                <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                <span>{benefit}</span>
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
                {/* Glow pulsante */}
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

                  {/* WhatsApp Icon */}
                  <svg
                    className="h-5 w-5 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Solicitar Proposta Grátis</span>
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

            {/* CTA Secundário → WhatsApp */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="group"
              >
                <div className="flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10">
                  <MessageCircle className="h-5 w-5" />
                  <span>Fale Conosco</span>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>
              </motion.div>
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            {trustItems.map((item, i) => {
              const TrustIcon = item.icon
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ delay: 1 + i * 0.12, duration: 0.5 }}
                  whileHover={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <TrustIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-400 font-medium">
                    {item.text}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Counter social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 backdrop-blur-sm"
          >
            {/* Avatares sobrepostos */}
            <div className="flex -space-x-3">
              {[0, 1, 2, 3, 4].map((i) => {
                const gradients = [
                  "from-purple-500 to-pink-500",
                  "from-blue-500 to-cyan-500",
                  "from-amber-500 to-orange-500",
                  "from-green-500 to-emerald-500",
                  "from-indigo-500 to-violet-500",
                ]
                return (
                  <motion.div
                    key={i}
                    className={`h-9 w-9 rounded-full bg-gradient-to-br ${gradients[i]} border-2 border-gray-950 flex items-center justify-center`}
                    initial={{ opacity: 0, scale: 0, x: -10 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1, x: 0 }
                        : { opacity: 0, scale: 0, x: -10 }
                    }
                    transition={{
                      delay: 1.6 + i * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <span className="text-xs font-bold text-white">
                      {["JI", "LA", "RA", "MS", "CF"][i]}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-white">+50</span>
                <span className="text-sm text-gray-400">
                  clientes satisfeitos
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        isInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0 }
                      }
                      transition={{ delay: 2 + j * 0.05 }}
                    >
                      <svg
                        className="h-3 w-3 text-amber-400 fill-amber-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">4.9/5</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Partículas orbitais */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <OrbitParticle
            size={6}
            radius={200}
            duration={15}
            delay={0}
            color="bg-purple-400/40"
          />
          <OrbitParticle
            size={4}
            radius={280}
            duration={20}
            delay={3}
            color="bg-pink-400/30"
          />
          <OrbitParticle
            size={8}
            radius={150}
            duration={12}
            delay={6}
            color="bg-blue-400/30"
          />
          <OrbitParticle
            size={5}
            radius={250}
            duration={18}
            delay={9}
            color="bg-amber-400/25"
          />
        </div>
      </motion.div>
    </section>
  )
}