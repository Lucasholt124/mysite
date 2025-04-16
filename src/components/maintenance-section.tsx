"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Shield, Clock, Server, RefreshCw } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function MaintenanceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="w-full bg-gradient-to-br from-purple-900 to-indigo-800 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Proteção Contínua para seu Negócio Digital</h2>
          <p className="mx-auto max-w-2xl text-lg text-purple-100">
            Mantenha seu site ou sistema sempre atualizado, seguro e funcionando perfeitamente com nossos planos de
            manutenção mensal
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
          >
            <div className="mb-4 inline-flex rounded-lg bg-purple-700 p-3 text-white">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Proteção Total</h3>
            <p className="text-purple-100">
              Backups diários, monitoramento constante e proteção contra invasões para manter seus dados sempre seguros.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
          >
            <div className="mb-4 inline-flex rounded-lg bg-purple-700 p-3 text-white">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Tempo de Atividade Máximo</h3>
            <p className="text-purple-100">
              Monitoramento 24/7 para garantir que seu site ou sistema esteja sempre disponível para seus clientes.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
          >
            <div className="mb-4 inline-flex rounded-lg bg-purple-700 p-3 text-white">
              <Server className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Atualizações Constantes</h3>
            <p className="text-purple-100">
              Mantenha seu site ou sistema sempre atualizado com as últimas tecnologias e correções de segurança.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15"
          >
            <div className="mb-4 inline-flex rounded-lg bg-purple-700 p-3 text-white">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Suporte Contínuo</h3>
            <p className="text-purple-100">
              Equipe especializada à disposição para resolver problemas e implementar melhorias quando necessário.
            </p>
          </motion.div>
        </motion.div>

        <div className="mt-12 text-center">
          <h3 className="mb-6 text-2xl font-bold">Por que contratar um plano de manutenção?</h3>

          <div className="mb-8 mx-auto max-w-3xl">
            <p className="mb-4 text-lg text-purple-100">
              Muitas empresas investem em um site ou sistema, mas esquecem da manutenção contínua. Isso é como comprar
              um carro e nunca fazer revisões.
            </p>
            <p className="mb-4 text-lg text-purple-100">
              Com nossos planos de manutenção mensal, você garante que seu investimento digital continue funcionando
              perfeitamente e gerando resultados por muito mais tempo.
            </p>
            <p className="text-lg text-purple-100">
              Além disso, você economiza tempo e dinheiro ao evitar problemas que poderiam ser facilmente prevenidos com
              manutenção regular.
            </p>
          </div>

          <Link href="/contrato?type=maintenance">
            <Button size="lg" className="bg-white text-purple-800 hover:bg-gray-100">
              Conhecer Planos de Manutenção <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
