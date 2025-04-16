import { NextResponse } from "next/server"

interface ContractData {
  name: string;
  email: string;
  phone?: string; // Optional field
  cpf?: string; // Optional field
  company?: string; // Optional field
  serviceType: string; // e.g., "project" or "maintenance"
  projectType?: string; // Optional for projects
  maintenancePlan?: string; // Optional for maintenance
  budget?: string; // Optional field
  timeline?: string; // Optional field
  description?: string; // Optional field
}

// Função para enviar dados do contrato por email
async function sendContractEmail(data: ContractData) {
  // Implementação real será feita quando você configurar as variáveis de email
  console.log("Enviando dados do contrato por email:", data)
  return true
}

// Função para enviar dados para o Asaas (ou simular em ambiente de desenvolvimento)
async function sendToAsaas(data: ContractData) {
  try {
    // Verificar se estamos em ambiente de desenvolvimento/preview
    const isPreview = !process.env.ASAAS_API_KEY || process.env.NODE_ENV === "development"

    if (isPreview) {
      console.log("Ambiente de preview/desenvolvimento detectado. Usando simulação do Asaas.")
      return mockAsaasResponse(data)
    }

    // Código real para ambiente de produção
    console.log("Enviando dados do cliente para o Asaas...")

    const customerData = {
      name: data.name || "Cliente",
      email: data.email || "cliente@exemplo.com",
      phone: data.phone || "",
      mobilePhone: data.phone || "",
      cpfCnpj: data.cpf || "",
      company: data.company || "",
      notes:
        data.serviceType === "project"
          ? `Tipo de Projeto: ${data.projectType || ""}
           Orçamento: ${data.budget || ""}
           Prazo: ${data.timeline || ""}
           Descrição: ${data.description || ""}`
          : `Plano de Manutenção: ${data.maintenancePlan || ""}
           Descrição: ${data.description || ""}`,
    }

    console.log("Dados do cliente:", customerData)

    const customerResponse = await fetch("https://www.asaas.com/api/v3/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: process.env.ASAAS_API_KEY || "",
      },
      body: JSON.stringify(customerData),
    })

    // Verificar se a resposta é válida antes de tentar analisá-la como JSON
    if (!customerResponse.ok) {
      const responseText = await customerResponse.text()
      console.error("Resposta de erro do Asaas:", responseText)

      let errorMessage = "Erro desconhecido ao criar cliente"
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.errors?.[0]?.description || "Erro desconhecido ao criar cliente"
      } catch (parseError) {
        console.error("Erro ao analisar resposta de erro:", parseError)
        errorMessage = responseText || "Erro desconhecido ao criar cliente"
      }

      throw new Error(`Erro ao criar cliente: ${errorMessage}`)
    }

    const responseText = await customerResponse.text()
    let customer

    try {
      customer = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Erro ao analisar resposta do cliente:", parseError, "Resposta:", responseText)
      throw new Error("Erro ao analisar resposta do cliente")
    }

    console.log("Cliente criado no Asaas:", customer)

    // Determine the value based on the service type
    let value = 1000; // Default value for projects

    if (data.serviceType === "maintenance") {
      // Values for maintenance plans
      const planValues: Record<string, number> = {
        basic: 100,
        intermediate: 250,
        advanced: 500,
        premium: 1000,
      };

      // Check if maintenancePlan is defined and use it as an index
      value = data.maintenancePlan && planValues[data.maintenancePlan] !== undefined
        ? planValues[data.maintenancePlan]
        : 100; // Default to 100 if undefined
    }

    // Criar cobrança ou assinatura com base no tipo de serviço
    if (data.serviceType === "project") {
      // Criar cobrança única para projetos
      console.log("Criando cobrança para projeto...")

      const paymentData = {
        customer: customer.id,
        billingType: "UNDEFINED", // Será definido posteriormente pelo cliente
        value: value,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 dias a partir de hoje
        description: `Impulsioneweb - Contrato de serviço - ${data.projectType || "Website/Sistema"}`,
      }

      console.log("Dados da cobrança:", paymentData)

      const paymentResponse = await fetch("https://www.asaas.com/api/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY || "",
        },
        body: JSON.stringify(paymentData),
      })

      // Verificar se a resposta é válida antes de tentar analisá-la como JSON
      if (!paymentResponse.ok) {
        const responseText = await paymentResponse.text()
        console.error("Resposta de erro do Asaas (pagamento):", responseText)

        let errorMessage = "Erro desconhecido ao criar cobrança"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.errors?.[0]?.description || "Erro desconhecido ao criar cobrança"
        } catch (parseError) {
          console.error("Erro ao analisar resposta de erro:", parseError)
          errorMessage = responseText || "Erro desconhecido ao criar cobrança"
        }

        throw new Error(`Erro ao criar cobrança: ${errorMessage}`)
      }

      const paymentResponseText = await paymentResponse.text()
      let paymentData2

      try {
        paymentData2 = JSON.parse(paymentResponseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta do pagamento:", parseError, "Resposta:", paymentResponseText)
        throw new Error("Erro ao analisar resposta do pagamento")
      }

      console.log("Cobrança criada no Asaas:", paymentData2)

      return {
        ...paymentData2,
        paymentId: paymentData2.id,
      }
    } else {
      // Criar assinatura recorrente para manutenção
      console.log("Criando assinatura para plano de manutenção...")

      const subscriptionData = {
        customer: customer.id,
        billingType: "UNDEFINED", // Será definido posteriormente pelo cliente
        value: value,
        nextDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 dia a partir de hoje
        cycle: "MONTHLY",
        description: `Impulsioneweb - Plano de Manutenção ${data.maintenancePlan || "Básico"}`,
      }

      console.log("Dados da assinatura:", subscriptionData)

      const subscriptionResponse = await fetch("https://www.asaas.com/api/v3/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: process.env.ASAAS_API_KEY || "",
        },
        body: JSON.stringify(subscriptionData),
      })

      // Verificar se a resposta é válida antes de tentar analisá-la como JSON
      if (!subscriptionResponse.ok) {
        const responseText = await subscriptionResponse.text()
        console.error("Resposta de erro do Asaas (assinatura):", responseText)

        let errorMessage = "Erro desconhecido ao criar assinatura"
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.errors?.[0]?.description || "Erro desconhecido ao criar assinatura"
        } catch (parseError) {
          console.error("Erro ao analisar resposta de erro:", parseError)
          errorMessage = responseText || "Erro desconhecido ao criar assinatura"
        }

        throw new Error(`Erro ao criar assinatura: ${errorMessage}`)
      }

      const subscriptionResponseText = await subscriptionResponse.text()
      let subscriptionData2

      try {
        subscriptionData2 = JSON.parse(subscriptionResponseText)
      } catch (parseError) {
        console.error("Erro ao analisar resposta da assinatura:", parseError, "Resposta:", subscriptionResponseText)
        throw new Error("Erro ao analisar resposta da assinatura")
      }

      console.log("Assinatura criada no Asaas:", subscriptionData2)

      return {
        ...subscriptionData2,
        paymentId: subscriptionData2.id,
      }
    }
  } catch (error) {
    console.error("Erro na integração com Asaas:", error)
    throw error
  }
}

// Função para simular resposta do Asaas em ambiente de desenvolvimento
function mockAsaasResponse(data: ContractData) {
  console.log("Simulando resposta do Asaas para os dados:", data)

  // Gerar um ID aleatório para simular o ID do Asaas
  const mockId = `mock_${Math.random().toString(36).substring(2, 15)}`

  // Determine the value based on the service type
  let value = 1000; // Default value for projects

  if (data.serviceType === "maintenance") {
    // Values for maintenance plans
    const planValues: Record<string, number> = {
      basic: 100,
      intermediate: 250,
      advanced: 500,
      premium: 1000,
    };

    // Check if maintenancePlan is defined and use it as an index
    value = data.maintenancePlan && planValues[data.maintenancePlan] !== undefined
      ? planValues[data.maintenancePlan]
      : 100; // Default to 100 if undefined
  }

  // Simular um pequeno atraso para parecer uma chamada de API real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.serviceType === "project") {
        resolve({
          id: mockId,
          paymentId: mockId,
          customer: `customer_${mockId}`,
          value: value,
          status: "PENDING",
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          description: `Impulsioneweb - Contrato de serviço - ${data.projectType || "Website/Sistema"}`,
          invoiceUrl: `https://www.asaas.com/i/${mockId}`,
          bankSlipUrl: `https://www.asaas.com/b/${mockId}`,
        })
      } else {
        resolve({
          id: mockId,
          paymentId: mockId,
          customer: `customer_${mockId}`,
          value: value,
          status: "ACTIVE",
          nextDueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          cycle: "MONTHLY",
          description: `Impulsioneweb - Plano de Manutenção ${data.maintenancePlan || "Básico"}`,
        })
      }
    }, 1000) // Simular um atraso de 1 segundo
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validação básica dos dados
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, message: "Nome e email são obrigatórios." }, { status: 400 })
    }

    // Enviar por email (quando configurado)
    await sendContractEmail(body)

    // Enviar para o Asaas (ou simular)
    let asaasResponse
    try {
      asaasResponse = await sendToAsaas(body)
    } catch (error) {
      console.error("Erro detalhado ao processar dados no Asaas:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao processar dados no Asaas: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Dados do contrato recebidos com sucesso!",
        asaasData: asaasResponse,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao processar dados do contrato:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar os dados do contrato. Por favor, tente novamente mais tarde.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
