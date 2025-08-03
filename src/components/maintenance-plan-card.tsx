"use client"

import { Check, Shield } from "lucide-react"
import { motion } from "framer-motion"

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  recommended: boolean
}

interface MaintenancePlanCardProps {
  plan: Plan
  selected: boolean
  onSelect: () => void
}

export default function MaintenancePlanCard({ plan, selected, onSelect }: MaintenancePlanCardProps) {
  // Permite seleção por teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative cursor-pointer rounded-lg border p-5 transition-all outline-none
        ${selected
          ? "border-purple-600 bg-purple-50 dark:border-purple-400 dark:bg-purple-950 shadow-lg"
          : "border-gray-200 bg-white hover:border-purple-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-700"
        }`}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`Selecionar plano ${plan.name}`}
    >
      {plan.recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-1 text-xs font-semibold text-white shadow-md uppercase tracking-wide">
          Plano Recomendado
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h3
          className={`text-lg font-bold ${selected ? "text-purple-700 dark:text-purple-300" : "text-gray-900 dark:text-white"}`}
        >
          {plan.name}
        </h3>
        <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${selected ? "border-purple-600" : "border-gray-300 dark:border-gray-600"}`}>
          {selected && <div className="h-3 w-3 rounded-full bg-purple-600"></div>}
        </div>
      </div>

      <div className="mb-4 flex items-end">
        <span className="text-2xl font-extrabold text-gray-900 dark:text-white">R$ {plan.price}</span>
        <span className="ml-1 mb-0.5 text-sm text-gray-500 dark:text-gray-400">/mês</span>
      </div>

      <div className="mb-4 flex items-center">
        <Shield className="mr-2 h-5 w-5 text-purple-600" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Proteção e Manutenção</span>
      </div>

      <ul className="space-y-2">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}