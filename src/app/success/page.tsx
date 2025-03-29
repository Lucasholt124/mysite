'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const Success = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const session_id = queryParams.get("session_id");

    if (!session_id) {
      // Se não houver session_id, redireciona para a página inicial
      router.push("/");
    } else {
      setSessionId(session_id);
    }
  }, [router]);

  return (
    <div style={styles.container}>
      <h1 className="text-3xl font-semibold text-green-600">Obrigado pela sua compra!</h1>
      {sessionId ? (
        <p className="text-lg text-gray-700">Seu pagamento foi processado com sucesso.</p>
      ) : (
        <p className="text-lg text-gray-500">Aguarde enquanto processamos seu pagamento...</p>
      )}
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center' as const,
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
};

export default Success;