"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function PagamentoSucessoPage() {
  // Número do WhatsApp formatado para o link
  const whatsappNumber = "5579999383543"
  const whatsappMessage = "Olá! Acabei de contratar um serviço no site e gostaria de mais informações."
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 px-4 py-12">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
      >
        <CheckCircle className="h-16 w-16 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Pagamento Confirmado!</h1>
        <p className="mb-8 text-lg text-gray-600">
          Obrigado por confiar na Impulsioneweb. Seu projeto foi iniciado com sucesso.
        </p>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Próximos Passos</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start">
              <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                1
              </div>
              <p>Nossa equipe entrará em contato em até 24 horas para agendar uma reunião inicial.</p>
            </li>
            <li className="flex items-start">
              <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                2
              </div>
              <p>Você receberá um email com o comprovante de pagamento e detalhes do contrato.</p>
            </li>
            <li className="flex items-start">
              <div className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                3
              </div>
              <p>Iniciaremos o planejamento do seu projeto conforme as especificações fornecidas.</p>
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 sm:w-auto">
              Voltar para a Página Inicial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31Z"
                  fill="#25D366"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7484 9.98718C12.4655 9.35359 12.1677 9.33654 11.8987 9.32156C11.6786 9.30873 11.4301 9.30989 11.1816 9.30989C10.9331 9.30989 10.5216 9.40205 10.1673 9.77564C9.81296 10.1492 8.92334 10.9815 8.92334 12.6748C8.92334 14.3681 10.1387 15.9899 10.3014 16.2384C10.4642 16.487 12.6714 20.1 16.2013 21.4849C19.1551 22.6247 19.7313 22.4338 20.3506 22.3701C20.9699 22.3063 22.3548 21.5376 22.6663 20.7689C22.9777 20.0002 22.9777 19.3666 22.8963 19.2315C22.8149 19.0964 22.5664 19.0185 22.1937 18.8627C21.8209 18.7069 20.1276 17.8746 19.7833 17.7674C19.4389 17.6602 19.1904 17.6066 18.9419 17.9802C18.6934 18.3538 18.0313 19.0964 17.8114 19.3449C17.5915 19.5935 17.3716 19.6203 16.9988 19.4645C16.6261 19.3087 15.5177 18.9547 14.1978 17.7674C13.1609 16.8398 12.4704 15.6919 12.2505 15.3183C12.0306 14.9447 12.2288 14.7413 12.4184 14.5539C12.5892 14.3851 12.7984 14.1155 12.9898 13.8956C13.1812 13.6757 13.2348 13.5199 13.342 13.2714C13.4492 13.0229 13.3956 12.803 13.3171 12.6472C13.2348 12.4914 12.5789 10.7871 12.2791 10.0414C12.0953 9.58462 11.8911 9.49744 11.6434 9.48205L12.7484 9.98718Z"
                  fill="#25D366"
                />
              </svg>
              Fale Conosco
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  )
}
