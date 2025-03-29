import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!stripeSecretKey) {
  throw new Error("A chave secreta do Stripe não está definida.");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { type, plan }: { type: string; plan: "basic" | "intermediate" | "advanced" | "premium" } = await req.json();

    const plans: Record<"basic" | "intermediate" | "advanced" | "premium", { amount: number; product: string; recurringAmount?: number }> = {
      "basic": { amount: type === "one-time" ? 100000 : 10000, product: "Sistema Básico", recurringAmount: 10000 },
      "intermediate": { amount: type === "one-time" ? 250000 : 25000, product: "Sistema Intermediário", recurringAmount: 25000 },
      "advanced": { amount: type === "one-time" ? 500000 : 50000, product: "Sistema Avançado", recurringAmount: 50000 },
      "premium": { amount: type === "one-time" ? 700000 : 100000, product: "Sistema Premium", recurringAmount: 100000  },
    };

    const selectedPlan = plans[plan];

    const lineItems = [
      {
        price_data: {
          currency: "brl",
          product_data: { name: selectedPlan.product },
          unit_amount: selectedPlan.amount,
          recurring: type === "subscription" ? { interval: "month" as Stripe.Price.Recurring.Interval } : undefined, // Definindo o preço recorrente para assinatura
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"], // Aceitar cartão de crédito e boleto
      mode: type === "subscription" ? "subscription" : "payment", // Definindo o tipo de pagamento (associação ou único)
      line_items: lineItems,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`, // URL de sucesso
      cancel_url: `${siteUrl}/cancel`, // URL de cancelamento
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) { // Usando 'unknown' para capturar o erro de forma mais segura
    if (error instanceof Error) {
      console.error("Erro ao criar a sessão de checkout:", error.message);
      return NextResponse.json({ error: "Erro ao criar a sessão de pagamento", details: error.message }, { status: 500 });
    } else {
      console.error("Erro desconhecido:", error);
      return NextResponse.json({ error: "Erro desconhecido ao criar a sessão de pagamento" }, { status: 500 });
    }
  }
}
