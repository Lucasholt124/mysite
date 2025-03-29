'use client';

import { useState } from "react";
import Contract from "./Contract";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const PaymentOptions = () => {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<"basic" | "intermediate" | "advanced" | "premium" | null>(null);

  const handleCheckout = async (type: string, plan: string) => {
    if (!accepted || loading) return;

    setLoading(true);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, plan }),
    });

    const { sessionId } = await response.json();

    const stripe = await stripePromise;
    await stripe?.redirectToCheckout({ sessionId });
  };

  const toggleExpansion = (plan: "basic" | "intermediate" | "advanced" | "premium") => {
    setExpanded(prev => prev === plan ? null : plan);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto"  data-aos="fade-right">
      <Contract onAccept={() => setAccepted(true)} />

      <h2 className="text-2xl font-semibold text-center mb-6">Escolha o pacote ou plano que melhor atende sua necessidade</h2>

      {/* Container para Pacotes de Sites e Planos de Assinatura lado a lado */}
      <div className="flex flex-wrap justify-between gap-8 w-full">

        {/* Pacotes de Sites */}
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 w-full sm:w-72">
          <h3 className="text-xl font-medium text-center mb-4">Pacotes de Sistemas</h3>
          <button
            onClick={() => handleCheckout("one-time", "basic")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full mb-3 hover:bg-blue-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Sistema Básico (R$ 1000)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("basic")}>
            <span className="text-blue-500">+ Ver mais</span>
            {expanded === "basic" && (
              <div className="bg-blue-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Sistema Básico</h4>
                <p>Ideal para quem está começando e precisa de um site simples, funcional e fácil de gerenciar.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout("one-time", "intermediate")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg w-full mb-3 hover:bg-green-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Sistema Intermediário (R$ 2500)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("intermediate")}>
            <span className="text-green-500">+ Ver mais</span>
            {expanded === "intermediate" && (
              <div className="bg-green-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Sistema Intermediário</h4>
                <p>Para empresas que precisam de funcionalidades extras, como integração com sistemas de pagamento e analytics.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout("one-time", "advanced")}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg w-full mb-3 hover:bg-yellow-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Sistema Avançado (R$ 5000)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("advanced")}>
            <span className="text-yellow-500">+ Ver mais</span>
            {expanded === "advanced" && (
              <div className="bg-yellow-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Sistema Avançado</h4>
                <p>Para empresas que exigem soluções personalizadas e recursos avançados de e-commerce, marketing e relatórios.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout("one-time", "premium")}
            className="bg-red-500 text-white px-6 py-3 rounded-lg w-full hover:bg-red-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Sistema Premium (R$ 7000)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("premium")}>
            <span className="text-red-500">+ Ver mais</span>
            {expanded === "premium" && (
              <div className="bg-red-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Sistema Premium</h4>
                <p>Uma solução completa e exclusiva, com suporte 24/7, customizações avançadas e estratégias de marketing digital.</p>
              </div>
            )}
          </div>
        </div>

        {/* Planos de Assinatura */}
        <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 w-full sm:w-72">
          <h3 className="text-xl font-medium text-center mb-4">Planos de Assinatura</h3>
          <button
            onClick={() => handleCheckout("subscription", "basic")}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full mb-3 hover:bg-blue-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Plano Básico (R$ 100/mês)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("basic")}>
            <span className="text-blue-500">+ Ver mais</span>
            {expanded === "basic" && (
              <div className="bg-blue-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Plano Básico</h4>
                <p>Ideal para pequenas empresas que precisam de um site com manutenção básica e atualizações periódicas.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout("subscription", "intermediate")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg w-full mb-3 hover:bg-green-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Plano Intermediário (R$ 250/mês)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("intermediate")}>
            <span className="text-green-500">+ Ver mais</span>
            {expanded === "intermediate" && (
              <div className="bg-green-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Plano Intermediário</h4>
                <p>Para empresas que necessitam de recursos avançados, incluindo SEO, performance otimizada e relatórios mensais.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout("subscription", "advanced")}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg w-full mb-3 hover:bg-yellow-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Plano Avançado (R$ 500/mês)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("advanced")}>
            <span className="text-yellow-500">+ Ver mais</span>
            {expanded === "advanced" && (
              <div className="bg-yellow-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Plano Avançado</h4>
                <p>Perfeito para empresas de médio porte que exigem customizações e soluções de marketing digital avançadas.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => handleCheckout("subscription", "premium")}
            className="bg-red-500 text-white px-6 py-3 rounded-lg w-full hover:bg-red-600 transition-colors"
            disabled={!accepted || loading}
          >
            {loading ? "Carregando..." : "Plano Premium (R$ 1000/mês)"}
          </button>
          <div className="text-center mb-4 cursor-pointer" onClick={() => toggleExpansion("premium")}>
            <span className="text-red-500">+ Ver mais</span>
            {expanded === "premium" && (
              <div className="bg-red-50 p-4 rounded-lg mt-2 text-gray-700">
                <h4 className="font-semibold">Plano Premium</h4>
                <p>Uma solução completa com todos os recursos avançados e suporte premium para o crescimento acelerado do seu negócio, acssine caso queira somente marketing digital</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Demonstrativo de Importância dos Planos Mensais */}
      <div className="text-center mt-8 bg-gray-50 p-6 rounded-lg shadow-lg w-full">
        <h4 className="font-semibold text-lg mb-4">Importância do Pagamento Mensal:</h4>
        <p className="text-gray-700 mb-4">
          Os planos de assinatura mensal são essenciais para garantir a manutenção contínua e o crescimento do seu site.
        </p>
        <p className="text-gray-700">
          Ao escolher um plano de assinatura, você terá acesso a suporte contínuo, atualizações regulares e otimização do seu site, garantindo que sua presença online permaneça competitiva e relevante.
        </p>
      </div>
    </div>
  );
};

export default PaymentOptions;
