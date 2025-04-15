"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function WhatsAppButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Substitua este número pelo seu número de WhatsApp no formato internacional
  const phoneNumber = "5579999383543  "
  const message = "Olá! Gostaria de saber mais sobre os serviços da Inpulsioneweb."

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-12 right-0 mb-2 w-56 rounded-lg bg-white p-3 shadow-lg"
          >
            <button
              onClick={() => setIsTooltipVisible(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              aria-label="Fechar dica"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <p className="text-xs text-gray-700">Fale conosco pelo WhatsApp para um atendimento rápido!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:bg-[#22c55e]"
        whileHover={{ scale: 1.05, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setTimeout(() => setIsTooltipVisible(false), 1000)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        aria-label="Contato via WhatsApp"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.7484 9.98718C12.4655 9.35359 12.1677 9.33654 11.8987 9.32156C11.6786 9.30873 11.4301 9.30989 11.1816 9.30989C10.9331 9.30989 10.5216 9.40205 10.1673 9.77564C9.81296 10.1492 8.92334 10.9815 8.92334 12.6748C8.92334 14.3681 10.1387 15.9899 10.3014 16.2384C10.4642 16.487 12.6714 20.1 16.2013 21.4849C19.1551 22.6247 19.7313 22.4338 20.3506 22.3701C20.9699 22.3063 22.3548 21.5376 22.6663 20.7689C22.9777 20.0002 22.9777 19.3666 22.8963 19.2315C22.8149 19.0964 22.5664 19.0185 22.1937 18.8627C21.8209 18.7069 20.1276 17.8746 19.7833 17.7674C19.4389 17.6602 19.1904 17.6066 18.9419 17.9802C18.6934 18.3538 18.0313 19.0964 17.8114 19.3449C17.5915 19.5935 17.3716 19.6203 16.9988 19.4645C16.6261 19.3087 15.5177 18.9547 14.1978 17.7674C13.1609 16.8398 12.4704 15.6919 12.2505 15.3183C12.0306 14.9447 12.2288 14.7413 12.4184 14.5539C12.5892 14.3851 12.7984 14.1155 12.9898 13.8956C13.1812 13.6757 13.2348 13.5199 13.342 13.2714C13.4492 13.0229 13.3956 12.803 13.3171 12.6472C13.2348 12.4914 12.5789 10.7871 12.2791 10.0414C12.0953 9.58462 11.8911 9.49744 11.6434 9.48205L12.7484 9.98718Z"
            fill="white"
          />
        </svg>
      </motion.a>
    </div>
  )
}
