"use client"

import type React from "react"

import { useState } from "react"
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formState.name || !formState.email || !formState.message) {
      setStatus("error")
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    try {
      setStatus("loading")

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Ocorreu um erro ao enviar sua mensagem.")
      }

      // Send email to the correct address
      const emailData = {
        to: "lucasholt2021@gmail.com",
        subject: "Nova mensagem de contato do site",
        text: `
    Nome: ${formState.name}
    Email: ${formState.email}
    Telefone: ${formState.phone || "Não informado"}
    Mensagem: ${formState.message}
  `,
      }
      console.log("Email would be sent with data:", emailData)

      // Limpar o formulário após envio bem-sucedido
      setFormState({
        name: "",
        email: "",
        phone: "",
        message: "",
      })

      setStatus("success")

      // Resetar o status após 5 segundos
      setTimeout(() => {
        setStatus("idle")
      }, 5000)
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro ao enviar sua mensagem.")

      // Resetar o status de erro após 5 segundos
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
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Entre em Contato</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Estamos prontos para transformar suas ideias em realidade
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-xl bg-purple-50 p-8"
          >
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Informações de Contato</h3>

            <div className="mb-6 flex items-start">
              <MapPin className="mr-4 h-6 w-6 text-purple-600" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Endereço</h4>
                <p className="text-gray-600">
                  Remoto
                  <br />
                  Ribeirópolis-SE - 49530-000
                </p>
              </div>
            </div>

            <div className="mb-6 flex items-start">
              <Phone className="mr-4 h-6 w-6 text-purple-600" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Telefone</h4>
                <p className="text-gray-600">(79) 99938-3543</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="mr-4 h-6 w-6 text-purple-600" />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                <p className="text-gray-600">lucasholt2021@gmail.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {status === "success" && (
              <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Mensagem enviada!</AlertTitle>
                <AlertDescription>
                  Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao enviar mensagem</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-900">
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-900">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-900">
                  Telefone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full"
                  disabled={status === "loading"}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900">
                  Mensagem <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  className="min-h-[120px] w-full"
                  disabled={status === "loading"}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
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
