"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  LucideIcon,
  Send,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Clock,
  Globe,
  ExternalLink,
} from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const WHATSAPP_LINK =
  "https://wa.me/5579999383543?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto.%20Podemos%20falar%3F"

type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

const contactDetails: {
  icon: LucideIcon
  title: string
  lines: string[]
  href?: string
  gradient: string
  iconBg: string
}[] = [
  {
    icon: MapPin,
    title: "Localização",
    lines: ["Atendimento Remoto", "Ribeirópolis-SE, Brasil"],
    gradient: "from-purple-500 to-indigo-500",
    iconBg: "bg-purple-500/20",
  },
  {
    icon: Phone,
    title: "Telefone / WhatsApp",
    lines: ["(79) 99938-3543"],
    href: "tel:+5579999383543",
    gradient: "from-green-500 to-emerald-500",
    iconBg: "bg-green-500/20",
  },
  {
    icon: Mail,
    title: "Email Principal",
    lines: ["lucasholt2021@gmail.com"],
    href: "mailto:lucasholt2021@gmail.com",
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/20",
  },
]

const quickActions = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    description: "Resposta imediata",
    href: WHATSAPP_LINK,
    gradient: "from-green-500 to-emerald-500",
    shadow: "shadow-green-500/20",
  },
  {
    icon: Mail,
    label: "Email",
    description: "Para detalhes",
    href: "mailto:lucasholt2021@gmail.com",
    gradient: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
  },
  {
    icon: Phone,
    label: "Ligar",
    description: "Fale agora",
    href: "tel:+5579999383543",
    gradient: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20",
  },
]

// Partícula flutuante
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
        y: [0, -20, 0],
        x: [0, 10, 0],
        opacity: [0.2, 0.4, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  )
}

export default function ContactSection() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [, setFocusedField] = useState<string | null>(null)

  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const isSectionInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formState.name || !formState.email || !formState.message) {
      setStatus("error")
      setErrorMessage("Por favor, preencha os campos obrigatórios.")
      setTimeout(() => setStatus("idle"), 5000)
      return
    }
    setStatus("loading")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ocorreu um erro.")
      }
      setStatus("success")
      setFormState({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      setStatus("error")
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido."
      )
    } finally {
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

  const filledFields = [
    formState.name,
    formState.email,
    formState.message,
  ].filter(Boolean).length
  const progress = (filledFields / 3) * 100

  return (
    <section
      id="contato"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-gray-50/30 to-white py-24 md:py-32"
    >
      {/* Decoração de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(147,51,234) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-purple-100/30 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-radial from-blue-100/20 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-gradient-radial from-green-100/20 via-transparent to-transparent rounded-full blur-3xl" />

        <FloatingParticle delay={0} duration={7} x="10%" y="20%" size={8} color="bg-purple-300/25" />
        <FloatingParticle delay={2} duration={9} x="85%" y="30%" size={6} color="bg-blue-300/25" />
        <FloatingParticle delay={1} duration={8} x="70%" y="80%" size={10} color="bg-green-300/20" />
        <FloatingParticle delay={3} duration={6.5} x="20%" y="75%" size={7} color="bg-pink-300/20" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={titleRef}
          initial="hidden"
          animate={isTitleInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="mb-20 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-block">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-4 py-2 backdrop-blur-sm">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Send className="h-4 w-4 text-purple-500" />
              </motion.div>
              <span className="text-sm font-semibold text-purple-700">
                Entre em Contato
              </span>
            </div>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mb-5 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
          >
            Vamos Construir Algo{" "}
            <span className="relative inline-block">
              <motion.span
                className="inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #9333ea, #ec4899, #3b82f6, #9333ea)",
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
                Incrível
              </motion.span>

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
                  stroke="url(#contactUnderline)"
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
                    id="contactUnderline"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
            ?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto max-w-2xl text-lg text-gray-500 md:text-xl leading-relaxed"
          >
            Preencha o formulário ou use um de nossos canais.{" "}
            <span className="font-semibold text-gray-700">
              Estamos prontos para transformar sua ideia em realidade.
            </span>
          </motion.p>
        </motion.div>

        {/* Quick Actions (Mobile-first) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:hidden"
        >
          {quickActions.map((action, i) => {
            const ActionIcon = action.icon
            return (
              <motion.a
                key={i}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  action.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={`flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${action.shadow}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md`}
                >
                  <ActionIcon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {action.label}
                </span>
                <span className="text-[11px] text-gray-500">
                  {action.description}
                </span>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Grid principal */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-10">
          {/* Card de Contato — 2 colunas */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={
              isSectionInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: -30 }
            }
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-2"
          >
            <div className="relative h-full rounded-3xl overflow-hidden">
              {/* Fundo do card */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950" />

              {/* Decoração */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative p-8 md:p-10 flex flex-col h-full text-white">
                {/* Header do card */}
                <div className="mb-8">
                  <motion.div
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/15 px-3 py-1.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isSectionInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 0.5 }}
                  >
                    <Globe className="h-3.5 w-3.5 text-purple-300" />
                    <span className="text-xs font-semibold text-purple-200">
                      Atendimento Remoto
                    </span>
                    <motion.div
                      className="h-1.5 w-1.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>

                  <h3 className="text-2xl md:text-3xl font-extrabold mb-2">
                    Informações de{" "}
                    <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Contato
                    </span>
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Escolha o melhor canal para falar conosco. Respondemos
                    rapidamente!
                  </p>
                </div>

                {/* Detalhes de contato */}
                <address className="not-italic space-y-4 flex-1">
                  {contactDetails.map((detail, i) => {
                    const Icon = detail.icon
                    const content = (
                      <motion.div
                        className="group flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.12]"
                        initial={{ opacity: 0, x: -20 }}
                        animate={
                          isSectionInView
                            ? { opacity: 1, x: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        transition={{
                          delay: 0.6 + i * 0.12,
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${detail.iconBg} transition-all duration-300 group-hover:scale-110`}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white/90 mb-0.5">
                            {detail.title}
                          </h4>
                          {detail.lines.map((line, j) => (
                            <p
                              key={j}
                              className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors truncate"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        {detail.href && (
                          <ExternalLink className="h-4 w-4 text-gray-600 group-hover:text-purple-400 transition-colors shrink-0 mt-1 ml-auto" />
                        )}
                      </motion.div>
                    )

                    return detail.href ? (
                      <a
                        key={detail.title}
                        href={detail.href}
                        className="block"
                        target={
                          detail.href.startsWith("mailto")
                            ? undefined
                            : "_blank"
                        }
                        rel="noopener noreferrer"
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={detail.title}>{content}</div>
                    )
                  })}
                </address>

                {/* Separador */}
                <div className="my-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                {/* CTA WhatsApp */}
                <motion.a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isSectionInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ delay: 1 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group overflow-hidden"
                  >
                    {/* Glow */}
                    <motion.div
                      className="absolute -inset-1 rounded-2xl blur-md pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, #22c55e, #10b981)",
                      }}
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-white font-bold shadow-lg shadow-green-500/20 transition-all duration-300">
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

                      <svg
                        className="h-5 w-5 shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span>Chamar no WhatsApp</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
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
                </motion.a>

                {/* Tempo de resposta */}
                <motion.div
                  className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={isSectionInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>Tempo médio de resposta:</span>
                  <span className="font-bold text-green-400">~30min</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Formulário — 3 colunas */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={
              isSectionInView
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: 30 }
            }
            transition={{
              duration: 0.7,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-3 relative"
          >
            <div className="relative rounded-3xl border border-gray-200/80 bg-white p-8 md:p-10 shadow-xl shadow-gray-200/50 overflow-hidden">
              {/* Decoração de canto */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-100/40 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-2xl pointer-events-none" />

              {/* Barra de progresso */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Formulário de Contato
                  </span>
                  <span className="text-xs text-gray-400">
                    {filledFields}/3 campos preenchidos
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
                    style={{ backgroundSize: "200% 100%" }}
                    animate={{
                      width: `${progress}%`,
                      backgroundPosition:
                        progress === 100
                          ? ["0% 0%", "200% 0%"]
                          : "0% 0%",
                    }}
                    transition={{
                      width: { duration: 0.5, ease: "easeOut" },
                      backgroundPosition:
                        progress === 100
                          ? {
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }
                          : {},
                    }}
                  />
                </div>
              </div>

              {/* Alerts */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6"
                  >
                    <Alert
                      variant="default"
                      className="border-green-200 bg-green-50 text-green-900 rounded-xl"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 15,
                        }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </motion.div>
                      <AlertTitle className="font-bold">
                        Mensagem Enviada! 🎉
                      </AlertTitle>
                      <AlertDescription>
                        Obrigado! Entraremos em contato muito em breve.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6"
                  >
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-5 w-5" />
                      <AlertTitle className="font-bold">
                        Ocorreu um Erro
                      </AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nome */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isSectionInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ delay: 0.5 }}
                >
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Nome completo{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formState.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoComplete="name"
                      className={`h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-all duration-300 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 ${
                        formState.name
                          ? "border-green-300 bg-green-50/30"
                          : ""
                      }`}
                    />
                    <AnimatePresence>
                      {formState.name && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Email & Telefone */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={
                      isSectionInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 15 }
                    }
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Seu melhor email"
                        value={formState.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        required
                        autoComplete="email"
                        className={`h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-all duration-300 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 ${
                          formState.email
                            ? "border-green-300 bg-green-50/30"
                            : ""
                        }`}
                      />
                      <AnimatePresence>
                        {formState.email && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={
                      isSectionInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 15 }
                    }
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-sm font-semibold text-gray-700"
                    >
                      Telefone{" "}
                      <span className="text-gray-400 font-normal">
                        (opcional)
                      </span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(00) 00000-0000"
                      value={formState.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="tel"
                      className="h-12 rounded-xl border-gray-200 bg-gray-50/50 px-4 text-base transition-all duration-300 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </motion.div>
                </div>

                {/* Mensagem */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isSectionInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ delay: 0.8 }}
                >
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold text-gray-700"
                  >
                    Mensagem <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Conte-nos sobre seu projeto, objetivos e expectativas..."
                      value={formState.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`min-h-[140px] rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-base transition-all duration-300 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none ${
                        formState.message
                          ? "border-green-300 bg-green-50/30"
                          : ""
                      }`}
                    />
                    <AnimatePresence>
                      {formState.message && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute right-3 top-3"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {formState.message && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-xs text-gray-400 text-right"
                    >
                      {formState.message.length} caracteres
                    </motion.p>
                  )}
                </motion.div>

                {/* Botão de envio */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    isSectionInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ delay: 0.9 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    {/* Glow */}
                    <motion.div
                      className="absolute -inset-1 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, #9333ea, #ec4899, #9333ea)",
                      }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="relative w-full h-14 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-base shadow-lg shadow-purple-500/20 transition-all duration-300 border-0 overflow-hidden"
                      disabled={status === "loading"}
                    >
                      {/* Shimmer */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.2) 55%, transparent 60%)",
                          backgroundSize: "200% 100%",
                        }}
                        animate={{
                          backgroundPosition: ["-100% 0%", "200% 0%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      />

                      {status === "loading" ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Enviando...</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          <span>Enviar Mensagem</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Texto de garantia */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={
                    isSectionInView ? { opacity: 1 } : { opacity: 0 }
                  }
                  transition={{ delay: 1.1 }}
                  className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5"
                >
                  <svg
                    className="h-3.5 w-3.5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      ry="2"
                    />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Seus dados estão seguros e não serão compartilhados.
                </motion.p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}