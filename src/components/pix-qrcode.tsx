"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function PixQRCode() {
  const [copied, setCopied] = useState(false)
  const [pixCode, setPixCode] = useState("")
  const [qrImage, setQrImage] = useState("")

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // Substitua com dados reais dinamicamente se quiser
    const createPixPayment = async () => {
      try {
        const response = await fetch("/api/asaas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operation: "pix",
            data: {
              customerId: "cus_1234567890abcdef", // ID do cliente cadastrado no Asaas
              value: 50.0,
              dueDate: new Date().toISOString().split("T")[0],
              description: "Pagamento via PIX",
            },
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setPixCode(data.pixCopyPasteKey || "")
          setQrImage(data.invoiceUrl || "") // Alternativamente: data.encodedImage
        } else {
          console.error("Erro:", data.error)
        }
      } catch (err) {
        console.error("Erro ao criar pagamento PIX:", err)
      }
    }

    createPixPayment()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {qrImage ? (
        <Image
          src={qrImage}
          alt="QR Code PIX"
          width={192}
          height={192}
          className="mb-6 object-contain border rounded"
        />
      ) : (
        <div className="mb-6 text-sm text-gray-500">Carregando QR Code...</div>
      )}

      <div className="text-center w-full">
        <p className="mb-2 font-medium">Escaneie o QR Code com seu aplicativo bancário</p>
        <p className="text-sm text-gray-500 mb-4">O pagamento será confirmado automaticamente</p>

        {pixCode && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Ou use o PIX Copia e Cola:</p>
            <div className="relative">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-700 break-all">
                {pixCode}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleCopyClick}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">Válido por 30 minutos</p>
      </div>
    </div>
  )
}
