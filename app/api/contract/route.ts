import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContractData {
  name: string
  email: string
  phone?: string
  cpf?: string
  company?: string
  projectType?: string
  budget?: number
  timeline?: string
  description?: string
}

// Enviar e-mail com Resend
async function sendContractEmail(data: ContractData) {
  try {
    const response = await resend.emails.send({
      from: "contato@inpulsioneweb.com",
      to: [process.env.CONTRACT_EMAIL || "seu-email@exemplo.com"],
      subject: `Novo contrato enviado por ${data.name}`,
      html: `
        <h2>Dados do Contrato</h2>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone || "Não informado"}</p>
        <p><strong>CPF/CNPJ:</strong> ${data.cpf || "Não informado"}</p>
        <p><strong>Empresa:</strong> ${data.company || "Não informado"}</p>
        <p><strong>Tipo de Projeto:</strong> ${data.projectType || "Não informado"}</p>
        <p><strong>Orçamento:</strong> R$ ${data.budget || "Não informado"}</p>
        <p><strong>Prazo:</strong> ${data.timeline || "Não informado"}</p>
        <p><strong>Descrição:</strong><br>${data.description?.replace(/\n/g, "<br>") || "Não informado"}</p>
      `,
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    return true
  } catch (error) {
    console.error("Erro ao enviar e-mail de contrato:", error)
    throw new Error("Erro ao enviar dados do contrato por e-mail")
  }
}

// Validação dos dados
const validateContractData = (data: ContractData): string | null => {
  if (!data.name || !data.email) {
    return "Nome e email são obrigatórios."
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return "Por favor, forneça um endereço de email válido."
  }

  return null
}

// Integração com Asaas
async function sendToAsaas(data: ContractData) {
  try {
    if (!process.env.ASAAS_API_KEY) {
      throw new Error("Chave de API do Asaas não configurada")
    }

    const customerResponse = await fetch("https://www.asaas.com/api/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        mobilePhone: data.phone || "",
        cpfCnpj: data.cpf || "",
        company: data.company || "",
        notes: `Tipo de Projeto: ${data.projectType || ""}\nOrçamento: ${data.budget || ""}\nPrazo: ${data.timeline || ""}\nDescrição: ${data.description || ""}`,
      }),
    })

    if (!customerResponse.ok) {
      const errorData = await customerResponse.json()
      throw new Error(`Erro ao criar cliente: ${errorData.errors?.[0]?.description || "Erro desconhecido"}`)
    }

    const customer = await customerResponse.json()

    const paymentResponse = await fetch("https://www.asaas.com/api/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY,
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: "UNDEFINED",
        value: data.budget || 1000,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: `Contrato de serviço - ${data.projectType || "Website/Sistema"}`,
      }),
    })

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json()
      throw new Error(`Erro ao criar cobrança: ${errorData.errors?.[0]?.description || "Erro desconhecido"}`)
    }

    return await paymentResponse.json()
  } catch (error) {
    console.error("Erro na integração com Asaas:", error)
    throw error
  }
}

// Handler da rota
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const validationError = validateContractData(body)
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 })
    }

    try {
      await sendContractEmail(body)
    } catch (emailError: unknown) {
      return NextResponse.json(
        { success: false, message: `Erro ao enviar e-mail de contrato: ${(emailError as Error).message}` },
        { status: 500 }
      )
    }

    let asaasResponse
    try {
      asaasResponse = await sendToAsaas(body)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao processar dados no Asaas: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Dados do contrato recebidos com sucesso!",
        asaasData: asaasResponse,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Erro ao processar dados do contrato:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar os dados do contrato. Por favor, tente novamente mais tarde.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    )
  }
}
