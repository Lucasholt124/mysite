"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  MessageCircle,
  Mail,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Phone,
  Download,
  Star,
} from "lucide-react"
import Link from "next/link"
import Confetti from 'react-confetti'

export default function PaymentSuccess() {
  const [showConfetti, setShowConfetti] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  const whatsappNumber = "5579999383543"
  const whatsappMessage = "Olá! Acabei de finalizar o pagamento e gostaria de dar início ao meu projeto 🚀"
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Success Card */}
          <Card className="border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-xl mb-8">
            <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-8 md:p-12 text-center relative overflow-hidden">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="mx-auto mb-6"
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30"></div>
                  <div className="relative bg-white rounded-full p-6">
                    <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-3xl md:text-5xl font-black mb-4">
                  🎉 Pagamento Confirmado!
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg md:text-xl font-medium">
                  Seu projeto já está em nossas mãos. Vamos criar algo incrível juntos!
                </CardDescription>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                <Sparkles className="absolute top-10 left-10 w-8 h-8 animate-pulse" />
                <Star className="absolute top-20 right-20 w-6 h-6 animate-spin-slow" />
                <Zap className="absolute bottom-10 left-1/4 w-10 h-10 animate-bounce" />
              </div>
            </CardHeader>

            <CardContent className="p-8 md:p-12 space-y-8">
              {/* WhatsApp CTA - DESTAQUE */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
                <Card className="border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-2xl relative">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="p-3 bg-green-500 rounded-2xl shadow-lg">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                          Próximo Passo: Entre em Contato!
                        </h3>
                        <p className="text-gray-700 text-base md:text-lg font-medium">
                          Clique no botão abaixo para falar comigo no WhatsApp e alinharmos os detalhes do seu projeto agora mesmo.
                        </p>
                      </div>
                    </div>

                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl shadow-green-500/50 h-16 md:h-20 text-lg md:text-xl font-black group relative overflow-hidden"
                    >
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <MessageCircle className="w-6 h-6 md:w-7 md:h-7 mr-3 animate-bounce" />
                        <span>FALAR NO WHATSAPP AGORA</span>
                        <ArrowRight className="w-6 h-6 md:w-7 md:h-7 ml-3 group-hover:translate-x-2 transition-transform" />
                      </a>
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">Respondo em até 30 minutos!</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Próximos Passos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                  O Que Acontece Agora?
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      step: "1",
                      title: "Confirmação Imediata",
                      description: "Você receberá um email com os detalhes do pagamento",
                      icon: <Mail className="w-6 h-6" />,
                      color: "from-blue-500 to-cyan-500"
                    },
                    {
                      step: "2",
                      title: "Conversa no WhatsApp",
                      description: "Alinhamos briefing, referências e cronograma",
                      icon: <MessageCircle className="w-6 h-6" />,
                      color: "from-green-500 to-emerald-500"
                    },
                    {
                      step: "3",
                      title: "Início do Projeto",
                      description: "Começamos o desenvolvimento em até 24h",
                      icon: <Zap className="w-6 h-6" />,
                      color: "from-purple-500 to-pink-500"
                    }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                    >
                      <Card className="border-2 border-gray-200 hover:border-indigo-300 transition-all hover:shadow-lg h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                              {item.icon}
                            </div>
                            <Badge className="bg-indigo-600 text-white text-lg font-bold px-3 py-1">
                              {item.step}
                            </Badge>
                          </div>
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Informações Importantes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 border-2 border-blue-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  Informações Importantes
                </h3>
                <ul className="space-y-3">
                  {[
                    "✅ Comprovante de pagamento enviado para seu email",
                    "✅ Projeto registrado em nosso sistema com prioridade",
                    "✅ Você receberá atualizações regulares do andamento",
                    "✅ Suporte disponível durante todo o desenvolvimento",
                    "✅ 30 dias de garantia após a entrega",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Card className="border-2 border-green-300 bg-green-50 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-lg">Preferência de Contato</h4>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm">
                      WhatsApp é a forma mais rápida de nos comunicarmos!
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-2 border-green-500 hover:bg-green-100"
                    >
                      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Abrir WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-300 bg-blue-50 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-lg">Já Enviamos Email</h4>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm">
                      Verifique sua caixa de entrada (e spam) com todos os detalhes
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-2 border-blue-500 hover:bg-blue-100"
                    >
                      <a href="mailto:contato@impulsioneweb.com">
                        <Mail className="w-4 h-4 mr-2" />
                        Abrir Email
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Download Invoice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="text-center pt-6 border-t-2 border-gray-200"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Comprovante (PDF)
                </Button>
              </motion.div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="text-center"
          >
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                Voltar para o site
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
      `}</style>
    </div>
  )
}