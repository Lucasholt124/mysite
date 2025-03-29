'use client'; // Indica que o componente usa recursos do cliente (como o redirecionamento)

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Cancel = () => {
  const router = useRouter();

  useEffect(() => {
    // Redireciona o usuário para a página inicial após o carregamento da página
    router.push('/');
  }, [router]);

  return null; // Não exibe nada na tela
};

export default Cancel;