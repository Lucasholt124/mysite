// app/api/payment/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { paymentMethod, paymentId, amount, serviceType } = body

    if (!paymentMethod || !paymentId || !amount) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos." },
        { status: 400 }
      )
    }

    console.log("=== PROCESSAMENTO DE PAGAMENTO ===")
    console.log("Payment Method:", paymentMethod)
    console.log("Payment ID:", paymentId)
    console.log("Amount:", amount)
    console.log("Service Type:", serviceType)
    console.log("==================================")

    // 🔥 PIX e Boleto não precisam de processamento adicional
    // Apenas retornam sucesso para exibir QR Code/Link
    if (paymentMethod === "pix" || paymentMethod === "boleto") {
      return NextResponse.json({
        success: true,
        message: `Pagamento via ${paymentMethod.toUpperCase()} iniciado com sucesso!`,
        paymentId: paymentId
      })
    }

    // 🔥 CARTÃO DE CRÉDITO - Aqui você implementaria a integração real
    if (paymentMethod === "credit-card") {
      // TODO: Implementar tokenização e cobrança no cartão via Asaas
      return NextResponse.json(
        {
          success: false,
          message: "Pagamento via cartão será implementado em breve. Use PIX ou Boleto."
        },
        { status: 501 }
      )
    }

    return NextResponse.json(
      { success: false, message: "Método de pagamento inválido." },
      { status: 400 }
    )
  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar pagamento. Tente novamente.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    )
  }
}