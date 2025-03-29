'use client';

import { useState } from "react";

const Contract = ({ onAccept }: { onAccept: () => void }) => {
  const [accepted, setAccepted] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setMessageVisible(true);
    setTimeout(() => {
      setMessageVisible(false);
    }, 10000); // A mensagem desaparece após 3 segundos
    onAccept(); // Chama a função de callback para prosseguir com a compra
  };

  return (
    <div className="p-4 bg-gray-200 rounded"  data-aos="fade-right">
      <h2 className="text-lg font-bold">Contrato de Desenvolvimento</h2>
      <p className="text-sm text-gray-600">
        Ao prosseguir com a compra, você concorda com os termos do contrato de desenvolvimento de sites ou markting digital.
      </p>
      <div className="mt-2 flex items-center">
        <input
          type="checkbox"
          id="accept"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <label htmlFor="accept" className="ml-2 text-sm">
          Eu aceito os termos do contrato.
        </label>
      </div>
      <button
        onClick={handleAccept}
        disabled={!accepted}
        className={`mt-4 px-6 py-3 rounded-lg transition-all duration-300 ${accepted ? "bg-blue-500 text-white border-4 border-blue-600 shadow-lg hover:bg-blue-600" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
      >
        {accepted ? (
          <>
            <span className="mr-2">&#10003;</span>Prosseguir para o Pagamento
          </>
        ) : (
          "Aceite os termos para prosseguir"
        )}
      </button>

      {/* Mensagem temporária de confirmação */}
      {messageVisible && (
        <div className="mt-4 text-sm text-green-600">
          Contrato aceito! Você pode agora finalizar a compra.
        </div>
      )}
    </div>
  );
};

export default Contract;
