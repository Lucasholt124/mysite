import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, cpf, serviceType, projectType, maintenancePlan, description } = body;

  const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
  const ASAAS_API_URL = "https://www.asaas.com/api/v3";

  try {
    const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY!,
      },
      body: JSON.stringify({ name, email, mobilePhone: phone, cpfCnpj: cpf }),
    });

    // Verificar se a resposta tem corpo antes de tentar fazer o parse
    const customerText = await customerRes.text(); // Ler como texto primeiro
    let customerData;

    if (customerText) {
      try {
        customerData = JSON.parse(customerText); // Tentar parsear o JSON
      } catch (e) {
        console.error("Erro ao parsear JSON da resposta:", e);
        return NextResponse.json({ message: "Erro ao processar resposta da API Asaas (cliente)" }, { status: 500 });
      }
    } else {
      console.error("Resposta vazia da API Asaas (cliente)");
      return NextResponse.json({ message: "Resposta vazia da API Asaas (cliente)" }, { status: 500 });
    }

    if (customerRes.ok && customerData.errors) {
      return NextResponse.json(
        { message: "Erro ao criar cliente", errors: customerData.errors },
        { status: 400 }
      );
    }

    let paymentRes;
    if (serviceType === "project") {
      paymentRes = await fetch(`${ASAAS_API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY!,
        },
        body: JSON.stringify({
          customer: customerData.id,
          billingType: "PIX",
          value: 2000,
          dueDate: new Date().toISOString().split("T")[0],
          description: `Projeto: ${projectType} - ${description}`,
        }),
      });
    } else {
      paymentRes = await fetch(`${ASAAS_API_URL}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY!,
        },
        body: JSON.stringify({
          customer: customerData.id,
          billingType: "CREDIT_CARD",
          value: 299.99,
          cycle: "MONTHLY",
          description: `Plano de manutenção: ${maintenancePlan} - ${description}`,
        }),
      });
    }

    const paymentData = await paymentRes.json();
    return NextResponse.json(paymentData, { status: 200 });
  } catch (error) {
    console.error("Erro:", error);

    return NextResponse.json({ message: "Erro interno ao integrar com Asaas" }, { status: 500 });
  }
}
