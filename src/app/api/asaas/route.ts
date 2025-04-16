import { NextResponse } from "next/server"

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

    // Fazer a requisição para a API do Asaas
    const asaasResponse = await fetch(`https://www.asaas.com/api/v3/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
      body: JSON.stringify(body.data),
    })

    // Processar a resposta
    const responseData = await asaasResponse.json()

    if (!asaasResponse.ok) {
      console.error(`Erro na API do Asaas (${endpoint}):`, responseData)
      return NextResponse.json(
        {
          error: `Erro ao processar requisição no Asaas: ${responseData.errors?.[0]?.description || "Erro desconhecido"}`,
        },
        { status: asaasResponse.status },
      )
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar pagamento:", error)
    return NextResponse.json({ error: "Erro ao processar pagamento" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Verificar se a chave de API está disponível
    if (!process.env.ASAAS_API_KEY) {
      return NextResponse.json({ error: "Chave de API do Asaas não configurada" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do pagamento não fornecido" }, { status: 400 })
    }

    // Consultar pagamento na API do Asaas
    const asaasResponse = await fetch(`https://www.asaas.com/api/v3/payments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
    })

    const responseData = await asaasResponse.json()

    if (!asaasResponse.ok) {
      console.error("Erro ao consultar pagamento no Asaas:", responseData)
      return NextResponse.json(
        { error: `Erro ao consultar pagamento: ${responseData.errors?.[0]?.description || "Erro desconhecido"}` },
        { status: asaasResponse.status },
      )
    }

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error)
    return NextResponse.json({ error: "Erro ao consultar pagamento" }, { status: 500 })
  }
}
