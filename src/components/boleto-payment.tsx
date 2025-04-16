"use client"

import { useState } from "react"
import { ArrowDown, FileText, Printer, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BoletoPayment() {
  const [cpf, setCpf] = useState("")
  const [boletoGenerated, setBoletoGenerated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateBoleto = async () => {
    if (cpf.length > 0) {
      setIsLoading(true)
      try {
        // In a real implementation, this would call the Asaas API
        // For now, we'll simulate a successful response
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setBoletoGenerated(true)
      } catch (error) {
        console.error("Error generating boleto:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {!boletoGenerated ? (
        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Boleto Bancário</p>
              <p className="text-sm text-gray-500">Vencimento em 3 dias úteis</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">R$ 1.000,00</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF/CNPJ do Pagador</Label>
            <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} />
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded-md text-yellow-700 text-sm">
            <p>Após a confirmação, o boleto será gerado e enviado para seu email.</p>
            <p className="mt-1">O projeto será iniciado após a confirmação do pagamento.</p>
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="w-full" onClick={handleGenerateBoleto} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Boleto"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-md overflow-hidden">
          {/* Cabeçalho do Boleto */}
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-700" />
              <span className="font-medium">Boleto Gerado</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8">
                <Printer className="h-4 w-4 mr-1" /> Imprimir
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <ArrowDown className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>

          {/* Corpo do Boleto */}
          <div className="p-4 bg-white">
            <div className="mb-4 border-b pb-4">
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500">Beneficiário</p>
                  <p className="font-medium">Impulsioneweb Tecnologia</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">CNPJ</p>
                  <p className="font-medium">00.000.000/0001-00</p>
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Vencimento</p>
                  <p className="font-medium">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="font-medium">R$ 1.000,00</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Nosso Número</p>
                  <p className="font-medium">00000000123456789</p>
                </div>
              </div>
            </div>

            {/* Código de Barras */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Código de Barras</p>
              <div className="h-16 bg-white border border-gray-200 rounded flex items-center justify-center overflow-hidden">
                <div className="flex h-full w-full">
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
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Linha Digitável</p>
              <p className="font-mono text-sm bg-gray-50 p-2 border border-gray-200 rounded">
                34191.79001 01043.510047 91020.150008 9 89110000133798
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
              <p>
                O boleto também foi enviado para seu email. Você pode pagar em qualquer banco ou casa lotérica até a
                data de vencimento.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
