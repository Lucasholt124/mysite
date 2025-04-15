"use client"

import { useState } from "react"
import { ArrowDown, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

export default function BoletoPayment() {
  const [cpf, setCpf] = useState("")
  const [boletoGenerated, setBoletoGenerated] = useState(false)

  const handleGenerateBoleto = () => {
    if (cpf.length > 0) {
      setBoletoGenerated(true)
    }
  }

  const vencimento = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")

  return (
    <div className="space-y-6">
      {!boletoGenerated ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 border border-gray-200 rounded-2xl bg-white shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <div>
              <p className="text-lg font-semibold text-gray-800">Boleto Bancário</p>
              <p className="text-sm text-gray-500">Vencimento em 3 dias úteis</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-700">R$ 1.000,00</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF/CNPJ do Pagador</Label>
            <Input
              id="cpf"
              name="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div className="mt-5 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            <p>Após a confirmação, o boleto será gerado e enviado para seu email.</p>
            <p className="mt-1">O projeto será iniciado após a confirmação do pagamento.</p>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={handleGenerateBoleto}>
              Gerar Boleto
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white"
        >
          {/* Cabeçalho */}
          <div className="bg-gray-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-700" />
              <span className="font-medium text-gray-800">Boleto Gerado</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Printer className="h-4 w-4 mr-1" /> Imprimir
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowDown className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            <div className="mb-6 border-b border-gray-200 pb-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">Beneficiário</p>
                  <p className="font-medium text-gray-800">Impulsioneweb Tecnologia LTDA</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CNPJ</p>
                  <p className="font-medium text-gray-800">00.000.000/0001-00</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500">Vencimento</p>
                  <p className="font-medium text-gray-800">{vencimento}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="font-medium text-gray-800">R$ 1.000,00</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nosso Número</p>
                  <p className="font-medium text-gray-800">00000000123456789</p>
                </div>
              </div>
            </div>

            {/* Código de Barras */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-1">Código de Barras</p>
              <div className="h-16 border border-gray-300 rounded-md bg-white flex items-center justify-center">
                <div className="flex h-full w-full overflow-hidden">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`}
                      style={{ width: `${Math.random() * 3 + 0.5}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Linha Digitável */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-1">Linha Digitável</p>
              <p className="font-mono text-sm bg-gray-50 p-2 border border-gray-200 rounded-md">
                34191.79001 01043.510047 91020.150008 9 89110000133798
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
              <p>
                O boleto também foi enviado para seu email. Você pode pagá-lo em qualquer banco ou casa lotérica até a
                data de vencimento.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
