"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, MessageCircle, ArrowRight, Clock, Sparkles } from "lucide-react"

export default function WhatsAppButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [hasShownAutoTooltip, setHasShownAutoTooltip] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const phoneNumber = "5579999383543"
  const message =
    "Olá! Gostaria de saber mais sobre os serviços da Impulsioneweb."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mostrar tooltip automaticamente após 5 segundos
  useEffect(() => {
    if (!mounted || hasShownAutoTooltip) return

    const timer = setTimeout(() => {
      setIsTooltipVisible(true)
      setHasShownAutoTooltip(true)

      // Auto-esconder após 8 segundos
      setTimeout(() => {
        setIsTooltipVisible(false)
      }, 8000)
    }, 5000)

    return () => clearTimeout(timer)
  }, [mounted, hasShownAutoTooltip])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip / Chat bubble */}
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.9, x: 10 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            className="relative w-72 rounded-2xl bg-white shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden"
          >
            {/* Barra verde no topo */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold text-sm">IW</span>
                  </div>
                  {/* Status online */}
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-300 border-2 border-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">
                    Impulsioneweb
                  </h4>
                  <p className="text-[11px] text-green-100 mt-0.5 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-300 inline-block" />
                    Online agora
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsTooltipVisible(false)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white/80 hover:bg-white/25 hover:text-white transition-all"
                aria-label="Fechar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Corpo da mensagem */}
            <div className="p-4">
              {/* Balão de chat */}
              <div className="relative bg-green-50 rounded-2xl rounded-tl-sm px-4 py-3 mb-3">
                {/* Triângulo do balão */}
                <div className="absolute -left-1.5 top-3 w-3 h-3 bg-green-50 rotate-45" />

                <p className="text-sm text-gray-700 leading-relaxed relative z-10">
                  👋 Olá! Como posso ajudar você hoje?
                </p>
                <p className="text-sm text-gray-700 leading-relaxed mt-1.5 relative z-10">
                  Estamos prontos para criar a{" "}
                  <span className="font-semibold text-green-700">
                    solução digital perfeita
                  </span>{" "}
                  para o seu negócio!
                </p>

                <div className="flex items-center gap-1 mt-2 relative z-10">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400">
                    Resposta em ~30min
                  </span>
                </div>
              </div>

              {/* CTA */}
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-md shadow-green-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.2) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["-100% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />

                <MessageCircle className="h-4 w-4" />
                <span>Iniciar Conversa</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.div>
              </motion.a>

              {/* Trust text */}
              <p className="text-[10px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <svg
                  className="h-3 w-3 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                Conversa segura e sem compromisso
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão flutuante principal */}
      <div className="relative">
        {/* Ping / pulse de atenção */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500"
          animate={{
            scale: [1, 1.8, 1.8],
            opacity: [0.4, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />

        {/* Segundo ping com delay */}
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.3, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 0.3,
          }}
        />

        {/* Botão */}
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => {
            setIsHovered(true)
            if (!hasShownAutoTooltip) {
              setIsTooltipVisible(true)
              setHasShownAutoTooltip(true)
            }
          }}
          onHoverEnd={() => {
            setIsHovered(false)
          }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 1,
          }}
          aria-label="Contato via WhatsApp"
        >
          {/* Glow interno */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />

          {/* Ícone WhatsApp */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 relative z-10"
            animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </motion.svg>

          {/* Badge de notificação */}
          <motion.div
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white shadow-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 2,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
          >
            <span className="text-[9px] font-bold text-white">1</span>
          </motion.div>
        </motion.a>

        {/* Label flutuante (aparece no hover, desktop only) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden md:block"
            >
              <div className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 shadow-xl whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5 text-green-400" />
                <span className="text-sm font-semibold text-white">
                  Fale conosco!
                </span>

                {/* Seta apontando para a direita */}
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 bg-gray-900 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}