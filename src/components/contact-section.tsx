"use client"

import type React from "react"
import { useState } from "react"
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader2, LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


type FormState = {
  name: string
  email: string
  phone: string
  message: string
}

// --- Melhoria: Dados de contato centralizados para fácil manutenção ---
const contactDetails: {
  icon: LucideIcon
  title: string
  lines: string[]
  href?: string
}[] = [
  {
    icon: MapPin,
    title: "Localização",
    lines: ["Atendimento Remoto", "Ribeirópolis-SE, Brasil"],
  },
  {
    icon: Phone,
    title: "Telefone",
    lines: ["(79) 99938-3543"],
    href: "tel:+5579999383543",
  },
  {
    icon: Mail,
    title: "Email Principal",
    lines: ["lucasholt2021@gmail.com"],
    href: "mailto:lucasholt2021@gmail.com",
  },
]

export default function ContactSection() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro desconhecido.")
    } finally {
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  // --- Melhoria: Variantes para animações em cascata ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section id="contato" className="w-full bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16 text-center"
        >
          <motion.h2 variants={itemVariants} className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            Vamos Construir Algo Incrível?
          </motion.h2>
          <motion.p variants={itemVariants} className="mx-auto max-w-2xl text-lg text-gray-600">
            Preencha o formulário ou use um de nossos canais. Estamos prontos para transformar sua ideia em realidade.
          </motion.p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* --- Melhoria: Card de Contato Refinado e com dados mapeados --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 p-8 text-white shadow-lg"
          >
            <h3 className="mb-8 text-3xl font-bold">Informações de Contato</h3>
            <address className="not-italic space-y-6">
              {contactDetails.map((detail) => {
                const Icon = detail.icon
                const content = (
                  <div className="flex items-start space-x-4">
                    <Icon className="h-7 w-7 text-purple-300" />
                    <div>
                      <h4 className="text-lg font-semibold">{detail.title}</h4>
                      {detail.lines.map((line, i) => (
                        <p key={i} className="text-purple-200">{line}</p>
                      ))}
                    </div>
                  </div>
                )
                return detail.href ? (
                  <a key={detail.title} href={detail.href} className="group block transition-opacity hover:opacity-80">{content}</a>
                ) : (
                  <div key={detail.title}>{content}</div>
                )
              })}
            </address>
          </motion.div>

          {/* --- Melhoria: Formulário com feedback de submissão aprimorado --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative" // Posição relativa para o overlay de loading
          >
            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-white p-8 shadow-lg">
              <div className="relative h-20">
                <AnimatePresence>
                  {status === "success" && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Alert variant="default" className="border-green-500 bg-green-50 text-green-900">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <AlertTitle>Mensagem Enviada!</AlertTitle>
                        <AlertDescription>Obrigado! Entraremos em contato em breve.</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                  {status === "error" && (
                     <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Alert variant="destructive">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Ocorreu um Erro</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Campos do Formulário */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input id="name" name="name" placeholder="Seu nome completo *" value={formState.name} onChange={handleChange} required autoComplete="name" />
                </div>
                <div>
                  <Input id="email" name="email" type="email" placeholder="Seu melhor email *" value={formState.email} onChange={handleChange} required autoComplete="email" />
                </div>
                <div>
                  <Input id="phone" name="phone" placeholder="Seu telefone (Opcional)" value={formState.phone} onChange={handleChange} autoComplete="tel" />
                </div>
                <div className="sm:col-span-2">
                  <Textarea id="message" name="message" placeholder="Conte-nos sobre seu projeto... *" value={formState.message} onChange={handleChange} required className="min-h-[140px]" />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full font-bold" disabled={status === 'loading'}>
                Enviar Mensagem
              </Button>
            </form>

            {/* --- Melhoria: Overlay de Loading --- */}
            <AnimatePresence>
              {status === 'loading' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}