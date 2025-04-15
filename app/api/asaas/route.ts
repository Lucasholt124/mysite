import { NextResponse } from "next/server"

interface AsaasData {
  // Define the expected properties of the data object
  customerId?: string;
  value?: number;
  dueDate?: string;
  description?: string;
  // Add other properties as needed
}

const getAsaasResponse = async (method: string, endpoint: string, data: AsaasData | null = null) => {
  try {
    const asaasResponse = await fetch(`https://www.asaas.com/api/v3/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY!,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    const responseData = await asaasResponse.json()

    if (!asaasResponse.ok) {
      throw new Error(responseData.errors?.[0]?.description || "Erro desconhecido")
    }

    return { success: true, data: responseData }
  } catch (error) {
    console.error(`Erro ao acessar a API do Asaas (${endpoint}):`, error)
    return { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Verificar se a chave de API está disponível
    if (!process.env.ASAAS_API_KEY) {
      return NextResponse.json({ error: "Chave de API do Asaas não configurada" }, { status: 500 })
    }

    // Determinar o endpoint com base no tipo de operação
    let endpoint = "payments"
    if (body.operation === "customer") {
      endpoint = "customers"
    } else if (body.operation === "subscription") {
      endpoint = "subscriptions"
    }

    // Requisição à API Asaas
    const { success, data, error } = await getAsaasResponse("POST", endpoint, body.data)

    if (!success) {
      return NextResponse.json({ error: `Erro ao processar requisição no Asaas: ${error}` }, { status: 400 })
    }

    // Se for pagamento via PIX, retornar dados do QR Code
    if (body.operation === "payment" && data.billingType === "PIX" && data.pixQrCode) {
      return NextResponse.json(
        {
          paymentId: data.id,
          status: data.status,
          dueDate: data.dueDate,
          value: data.value,
          invoiceUrl: data.invoiceUrl,
          qrCode: {
            payload: data.pixQrCode.payload,
            encodedImage: data.pixQrCode.encodedImage,
          },
        },
        { status: 200 }
      )
    }

    // Retorno padrão para outras operações
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    if (!process.env.ASAAS_API_KEY) {
      return NextResponse.json({ error: "Chave de API do Asaas não configurada" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do pagamento não fornecido" }, { status: 400 })
    }

    // Requisição à API Asaas
    const { success, data, error } = await getAsaasResponse("GET", `payments/${id}`)

    if (!success) {
      return NextResponse.json({ error: `Erro ao consultar pagamento: ${error}` }, { status: 400 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error)
    return NextResponse.json({ error: "Erro ao consultar pagamento" }, { status: 500 })
  }
}
