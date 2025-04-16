"use client"

import { useState, useEffect } from "react"
import { Check, Copy, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface PixQRCodeProps {
  paymentId?: string
}

export default function PixQRCode({ paymentId }: PixQRCodeProps) {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pixData, setPixData] = useState({
    encodedImage: "",
    payload: "",
    expirationDate: new Date(Date.now() + 30 * 60000),
  })

  useEffect(() => {
    const fetchPixData = async () => {
      if (!paymentId) return

      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/asaas/pix?paymentId=${paymentId}`)
        if (!res.ok) {
          const { error } = await res.json()
          throw new Error(error || "Erro desconhecido")
        }

        const data = await res.json()
        setPixData({
          encodedImage: data.encodedImage,
          payload: data.payload,
          expirationDate: new Date(data.expirationDate),
        })
      } catch (err) {
        if (err instanceof Error) {
          console.error(err)
          setError(err.message || "Erro ao buscar QR Code PIX.")
        } else {
          console.error(err)
          setError("Erro ao buscar QR Code PIX.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPixData()
  }, [paymentId])

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pixData.payload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatExpirationTime = () => {
    const now = new Date()
    const diffMs = pixData.expirationDate.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins <= 0 ? "Expirado" : `${diffMins} minutos`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-600">Gerando QR Code PIX...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-600 text-center">
        <AlertTriangle className="h-6 w-6 mb-2" />
        <p className="font-semibold">Erro ao gerar QR Code</p>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {pixData.encodedImage ? (
          <Image
            src={`data:image/png;base64,${pixData.encodedImage}`}
            alt="QR Code PIX"
            width={208}
            height={208}
            className="object-contain"
            unoptimized
          />
        ) : (
          <div className="w-52 h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            QR Code indisponível
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <p className="mb-2 font-medium">Escaneie o QR Code com seu app bancário</p>
        <p className="text-sm text-gray-500 mb-4">Pagamento confirmado automaticamente</p>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Ou use o PIX Copia e Cola:</p>
          <div className="relative">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-700 break-all">
              {pixData.payload}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              onClick={handleCopyClick}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
          <div className="flex items-center bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
            <p>Válido por {formatExpirationTime()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
