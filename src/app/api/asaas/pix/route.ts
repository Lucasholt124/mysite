import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get("paymentId")

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    // Verificar se estamos em ambiente de desenvolvimento/preview
    const isPreview = !process.env.ASAAS_API_KEY || process.env.NODE_ENV === "development"

    if (isPreview) {
      console.log("Ambiente de preview/desenvolvimento detectado. Usando simulação do PIX.")

      // Simular um pequeno atraso para parecer uma chamada de API real
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Retornar dados simulados
      return NextResponse.json({
        encodedImage: "base64-encoded-image-data",
        payload:
          "00020126580014BR.GOV.BCB.PIX0136a1f86a98-7258-4321-8456-213c789e74ab5204000053039865802BR5925IMPULSIONEWEB TECNOLOGIA6009RIBEROPOLIS62070503***6304E2CA",
        expirationDate: new Date(Date.now() + 30 * 60000).toISOString(),
      })
    }

    // Código real para ambiente de produção
    // Verificar se a chave de API está disponível
    if (!process.env.ASAAS_API_KEY) {
      return NextResponse.json({ error: "Asaas API key not configured" }, { status: 500 })
    }

    // Fetch PIX QR code from Asaas API
    const response = await fetch(`https://www.asaas.com/api/v3/payments/${paymentId}/pixQrCode`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `Error fetching PIX QR code: ${errorData.errors?.[0]?.description || "Unknown error"}` },
        { status: response.status },
      )
    }

    const pixData = await response.json()
    return NextResponse.json(pixData)
  } catch (error) {
    console.error("Error processing PIX QR code request:", error)
    return NextResponse.json({ error: "Error processing PIX QR code request" }, { status: 500 })
  }
}
