"use client"

import { motion } from "framer-motion"
import AnimatedCounter from "@/components/animated-counter" // Certifique-se que o caminho está correto

// --- Melhoria: Dados centralizados para fácil manutenção ---
const stats = [
  { value: 150, label: "Projetos Entregues", suffix: "" },
  { value: 98, label: "Clientes Satisfeitos", suffix: "%" },
  { value: 5, label: "Anos de Mercado", suffix: "+" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export default function StatsSection() {
  return (
    <section className="w-full bg-gray-900 py-16 text-white">
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
        viewport={{ once: true, amount: 0.3 }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center rounded-lg p-4"
            >
              <div className="text-5xl font-extrabold tracking-tighter text-purple-400 md:text-6xl">
                <AnimatedCounter value={stat.value} duration={2.5} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-lg text-purple-200/90">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}