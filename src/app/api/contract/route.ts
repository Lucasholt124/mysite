// app/api/contract/route.ts
import { NextResponse } from "next/server"

interface ContractData {
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  company?: string;
  serviceType: string;
  projectType?: string;
  maintenancePlan?: string;
  budget?: string;
  timeline?: string;
  description?: string;
  totalAmount: number;
  firstPayment: number;
  paymentStructure?: "full" | "50-50" | "40-30-30";
}

async function sendContractEmail(data: ContractData) {
  console.log("Enviando dados do contrato por email:", data)
  return true
}

async function sendToAsaas(data: ContractData) {
  try {
    const isPreview = !process.env.ASAAS_API_KEY || process.env.NODE_ENV === "development"

    if (isPreview) {
      console.log("Ambiente de preview/desenvolvimento detectado. Usando simulação do Asaas.")
      return mockAsaasResponse(data)
    }

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
           Valor Total: R$ ${data.totalAmount.toFixed(2)}
           Primeira Parcela: R$ ${data.firstPayment.toFixed(2)}
           Estrutura: ${data.paymentStructure || ""}
           Prazo: ${data.timeline || ""}
           Descrição: ${data.description || ""}`
          : `Plano de Manutenção: ${data.maintenancePlan || ""}
           Valor Mensal: R$ ${data.totalAmount.toFixed(2)}
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

    let value: number;

    if (data.serviceType === "maintenance") {
      value = data.totalAmount;
    } else {
      value = data.firstPayment;
    }

    if (value < 50) {
      throw new Error("Valor mínimo de cobrança é R$ 50,00");
    }

    if (value > 50000) {
      throw new Error("Valor máximo de cobrança é R$ 50.000,00. Contate o suporte para valores maiores.");
    }

    console.log("=== VALOR ASAAS ===");
    console.log("Service Type:", data.serviceType);
    console.log("Total Amount:", data.totalAmount);
    console.log("First Payment:", data.firstPayment);
    console.log("Valor enviado ao Asaas:", value);
    console.log("==================");

    if (data.serviceType === "project") {
      console.log("Criando cobrança para projeto...")

      const paymentData = {
        customer: customer.id,
        billingType: "UNDEFINED",
        value: value,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        description: `Impulsioneweb - ${data.projectType || "Projeto"} - Parcela 1/${data.paymentStructure === "40-30-30" ? "3" : data.paymentStructure === "50-50" ? "2" : "1"}`,
        externalReference: `project_${Date.now()}`,
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
      // 🔥 CORREÇÃO PRINCIPAL - ASSINATURA COM QR CODE PIX
      console.log("Criando assinatura para plano de manutenção...")

      const subscriptionData = {
        customer: customer.id,
        billingType: "UNDEFINED", // Permite PIX, Cartão e Boleto
        value: value,
        nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 3 dias
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

      // 🔥 CORREÇÃO: Buscar a primeira cobrança gerada pela assinatura
      console.log("Buscando primeira cobrança da assinatura...")

      const paymentsResponse = await fetch(
        `https://www.asaas.com/api/v3/payments?subscription=${subscriptionData2.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access_token: process.env.ASAAS_API_KEY || "",
          },
        }
      )

      if (!paymentsResponse.ok) {
        console.error("Erro ao buscar cobranças da assinatura")
        // Se falhar, retorna o ID da assinatura mesmo
        return {
          ...subscriptionData2,
          paymentId: subscriptionData2.id,
          subscriptionId: subscriptionData2.id,
        }
      }

      const paymentsData = await paymentsResponse.json()
      console.log("Cobranças da assinatura:", paymentsData)

      // Pegar o ID da primeira cobrança
      const firstPaymentId = paymentsData.data?.[0]?.id || subscriptionData2.id

      console.log("=== ASSINATURA CRIADA ===")
      console.log("Subscription ID:", subscriptionData2.id)
      console.log("First Payment ID:", firstPaymentId)
      console.log("========================")

      return {
        ...subscriptionData2,
        paymentId: firstPaymentId, // 🔥 AGORA RETORNA O ID DA COBRANÇA, NÃO DA ASSINATURA
        subscriptionId: subscriptionData2.id,
      }
    }
  } catch (error) {
    console.error("Erro na integração com Asaas:", error)
    throw error
  }
}

function mockAsaasResponse(data: ContractData) {
  console.log("Simulando resposta do Asaas para os dados:", data)

  const mockId = `mock_${Math.random().toString(36).substring(2, 15)}`

  let value: number;

  if (data.serviceType === "maintenance") {
    value = data.totalAmount;
  } else {
    value = data.firstPayment;
  }

  console.log("=== MOCK ASAAS ===");
  console.log("Service Type:", data.serviceType);
  console.log("Total Amount:", data.totalAmount);
  console.log("First Payment:", data.firstPayment);
  console.log("Valor simulado:", value);
  console.log("==================");

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
          description: `Impulsioneweb - ${data.projectType || "Projeto"} - R$ ${value.toFixed(2)}`,
          invoiceUrl: `https://www.asaas.com/i/${mockId}`,
          bankSlipUrl: `https://www.asaas.com/b/${mockId}`,
        })
      } else {
        // 🔥 MOCK CORRIGIDO PARA ASSINATURA
        const subscriptionId = `sub_${mockId}`
        const paymentId = `pay_${mockId}` // ID da primeira cobrança

        resolve({
          id: subscriptionId,
          paymentId: paymentId, // 🔥 RETORNA ID DA COBRANÇA
          subscriptionId: subscriptionId,
          customer: `customer_${mockId}`,
          value: value,
          status: "ACTIVE",
          nextDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          cycle: "MONTHLY",
          description: `Impulsioneweb - Plano ${data.maintenancePlan || "Básico"} - R$ ${value.toFixed(2)}/mês`,
        })
      }
    }, 1000)
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, message: "Nome e email são obrigatórios." },
        { status: 400 }
      )
    }

    if (typeof body.totalAmount !== "number" || body.totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Valor total inválido." },
        { status: 400 }
      )
    }

    if (body.serviceType === "project") {
      if (typeof body.firstPayment !== "number" || body.firstPayment <= 0) {
        return NextResponse.json(
          { success: false, message: "Valor da primeira parcela inválido." },
          { status: 400 }
        )
      }

      if (body.totalAmount < 800) {
        return NextResponse.json(
          {
            success: false,
            message: "Valor mínimo para projetos é R$ 800,00. Por favor, escolha um orçamento válido."
          },
          { status: 400 }
        )
      }

      if (body.totalAmount > 50000) {
        return NextResponse.json(
          {
            success: false,
            message: "Para projetos acima de R$ 50.000, entre em contato pelo WhatsApp."
          },
          { status: 400 }
        )
      }
    }

    console.log("=== DADOS RECEBIDOS ===");
    console.log("Nome:", body.name);
    console.log("Email:", body.email);
    console.log("Service Type:", body.serviceType);
    console.log("Total Amount:", body.totalAmount);
    console.log("First Payment:", body.firstPayment);
    console.log("Payment Structure:", body.paymentStructure);
    console.log("=====================");

    await sendContractEmail(body)

    let asaasResponse
    try {
      asaasResponse = await sendToAsaas(body)
    } catch (error) {
      console.error("Erro detalhado ao processar dados no Asaas:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao processar pagamento: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
        },
        { status: 500 },
      )
    }

    console.log("=== COBRANÇA/ASSINATURA CRIADA ===");
    console.log("Payment ID:", asaasResponse.paymentId);
    console.log("Subscription ID:", asaasResponse.subscriptionId || "N/A");
    console.log("Valor cobrado:", asaasResponse.value);
    console.log("==================================");

    return NextResponse.json(
      {
        success: true,
        message: "Contrato criado com sucesso!",
        asaasData: asaasResponse,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Erro ao processar dados do contrato:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro ao processar os dados do contrato. Por favor, tente novamente.",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}