"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContactSection() {
  const [formState, setFormState] = useState({ name: "", email: "", phone: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formState.name || !formState.email || !formState.message) {
      setStatus("error")
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    try {
      setStatus("loading")
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Erro ao enviar a mensagem.")
      }

      setFormState({ name: "", email: "", phone: "", message: "" })
      setStatus("success")
      setTimeout(() => setStatus("idle"), 5000)
    } catch (err) {
      console.error(err)
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : "Erro ao enviar a mensagem.")
      setTimeout(() => {
        setStatus("idle")
        setErrorMessage("")
      }, 5000)
    }
  }

  return (
    <section id="contato" className="w-full bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Entre em Contato</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Estamos prontos para transformar suas ideias em realidade.
          </p>
        </div>

        <div className="grid max-w-6xl mx-auto grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Informações */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-purple-50 p-8 shadow-sm"
          >
            <h3 className="mb-6 text-2xl font-semibold text-gray-900">Informações de Contato</h3>

            <ul className="space-y-6 text-gray-700">
              <li className="flex items-start">
                <MapPin className="mr-4 h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium">Endereço</h4>
                  <p>Remoto<br />Ribeirópolis-SE 49530-000</p>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="mr-4 h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium">Telefone</h4>
                  <p>(79) 99938-3543</p>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="mr-4 h-6 w-6 text-purple-600" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p>lucasholt2021@gmail.com</p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {status === "success" && (
              <Alert className="mb-6 border-green-300 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Mensagem enviada com sucesso!</AlertTitle>
                <AlertDescription>Em breve entraremos em contato com você.</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="mb-6 border-red-300 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao enviar mensagem</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800">
                  Telefone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="(00) 00000-0000"
                  value={formState.phone}
                  onChange={handleChange}
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-800">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Digite sua mensagem"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="min-h-[120px]"
                  disabled={status === "loading"}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Mensagem"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
