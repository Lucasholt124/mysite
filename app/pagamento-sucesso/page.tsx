"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, CalendarCheck, FileText, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function PagamentoSucessoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4 py-12">
      {/* Ícone de sucesso */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-md"
      >
        <CheckCircle className="h-16 w-16 text-green-600" />
      </motion.div>

      {/* Mensagem principal */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center max-w-xl"
      >
        <h1 className="mb-4 text-4xl font-bold text-gray-900">Pagamento Confirmado!</h1>
        <p className="mb-6 text-lg text-gray-600">
          Obrigado por confiar na <span className="font-semibold text-purple-700">Inpulsioneweb</span>.
          Seu projeto foi iniciado com sucesso.
        </p>

        {/* Próximos passos */}
        <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-5 text-xl font-semibold text-gray-800">Próximos Passos</h2>
          <ul className="space-y-5 text-left">
            <li className="flex items-start">
              <CalendarCheck className="mr-3 mt-1 h-5 w-5 text-purple-600" />
              <p>Nossa equipe entrará em contato em até 24h para agendar uma reunião inicial.</p>
            </li>
            <li className="flex items-start">
              <FileText className="mr-3 mt-1 h-5 w-5 text-purple-600" />
              <p>Você receberá um email com o comprovante de pagamento e os detalhes do contrato.</p>
            </li>
            <li className="flex items-start">
              <Rocket className="mr-3 mt-1 h-5 w-5 text-purple-600" />
              <p>Iniciaremos o planejamento do seu projeto conforme suas especificações.</p>
            </li>
          </ul>
        </div>

        {/* Botões */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <Link href="/">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 sm:w-auto">
              Voltar para a Página Inicial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contato">
            <Button variant="outline" className="w-full sm:w-auto">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
