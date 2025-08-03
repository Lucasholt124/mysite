"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Shield, Clock, Server, RefreshCw, CheckCircle, LucideIcon } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"

// --- Melhoria de Código: Centralizando os dados dos cards (Princípio DRY) ---
const maintenanceFeatures: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: Shield,
    title: "Proteção Avançada",
    description: "Backups diários, monitoramento 24/7 e barreiras contra ameaças para manter seus dados e sua reputação seguros.",
  },
  {
    icon: Clock,
    title: "Performance Otimizada",
    description: "Garantimos alta disponibilidade e velocidade, assegurando que seu site esteja sempre acessível e rápido para seus clientes.",
  },
  {
    icon: RefreshCw,
    title: "Atualizações Contínuas",
    description: "Seu sistema sempre em dia com as últimas tecnologias, patches de segurança e melhorias de performance.",
  },
  {
    icon: Server,
    title: "Suporte Especializado",
    description: "Nossa equipe técnica está pronta para resolver demandas, prevenir riscos e implementar melhorias sob demanda.",
  },
]

export default function MaintenanceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <section className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-20 text-white md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Sua Operação Digital, Sempre Segura e Ativa
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-purple-200/90">
            Foque no seu negócio enquanto garantimos que seu site ou sistema esteja sempre atualizado, protegido e performando no seu máximo potencial.
          </p>
        </motion.div>

        {/* --- Código Refatorado: Usando .map() para gerar os cards --- */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {maintenanceFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:-translate-y-1.5 shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/80 p-3 text-white transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-purple-200/90">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* --- Melhoria Visual: Seção "Por que investir?" mais estruturada --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg"
        >
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <h3 className="mb-4 text-2xl font-bold">Tranquilidade e Performance Garantidas</h3>
              <p className="text-lg text-purple-200/90">
                A manutenção preventiva é o melhor investimento para proteger seus ativos digitais, evitar custos emergenciais e garantir a confiança dos seus clientes.
              </p>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center text-lg">
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-green-400" />
                Evite paradas inesperadas e perda de receita.
              </li>
              <li className="flex items-center text-lg">
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-green-400" />
                Proteja-se contra vulnerabilidades e ataques.
              </li>
              <li className="flex items-center text-lg">
                <CheckCircle className="mr-3 h-6 w-6 flex-shrink-0 text-green-400" />
                Mantenha a performance e a experiência do usuário.
              </li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link href="/contrato?type=maintenance" legacyBehavior>
              <Button
                size="lg"
                className="bg-white text-purple-800 transition-transform hover:bg-gray-100 hover:scale-105"
                aria-label="Ver planos de manutenção"
              >
                Ver Planos de Manutenção <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}