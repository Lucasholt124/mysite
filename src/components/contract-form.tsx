"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  AlertCircle,
  Cog,
  Globe,
  X,
  CreditCard,
  Info,
  Sparkles,
  Shield,
  Clock,
  DollarSign,
  Smartphone,
  Monitor,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  CheckCircle,
  TrendingUp,
  Zap,
  Star,
  Lock,
  Award,
  AlertTriangle,
  Flame,
  Users,
  Target,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import PixQRCode from "@/components/pix-qrcode"
import BoletoPayment from "@/components/boleto-payment"
import { cn } from "@/lib/utils"
import {
  formatDocument,
  isValidDocument,
  getDocumentType,
} from "@/utils/document-validator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// ============================================
// TIPOS DE DADOS
// ============================================
type MaintenanceDetails = {
  siteLink: string
  otherInfo: string
}

type FormData = {
  name: string
  email: string
  phone: string
  company: string
  cpf: string
  projectType: string
  budget: string
  timeline: string
  description: string
  termsAccepted: boolean
  serviceType: "project" | "maintenance"
  maintenancePlan: string
  paymentId: string
  maintenanceDetails: MaintenanceDetails
  paymentStructure: "full" | "50-50" | "40-30-30"
}

type DocumentValidation = {
  isValid: boolean
  message: string
  touched: boolean
}

type MaintenancePlan = {
  id: string
  name: string
  price: number
  originalPrice: number
  features: string[]
  recommended: boolean
  icon: React.ReactNode
  badge?: string
}

interface BudgetOption {
  value: string
  label: string
  description: string
  average: number
  originalPrice: number
}

interface TimelineOption {
  value: string
  label: string
  icon: React.ReactNode
  urgent?: boolean
}

interface PaymentBreakdown {
  entrada: number
  segunda: number
  terceira: number
  total: number
  discount: number
  originalTotal: number
}

// ============================================
// CONSTANTES
// ============================================
const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: "basic",
    name: "Essencial",
    price: 97,
    originalPrice: 197,
    features: [
      "Backup semanal automático",
      "Monitoramento 24/7",
      "2 horas de suporte/mês",
      "Atualizações de segurança",
      "SSL incluso",
    ],
    recommended: false,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "professional",
    name: "Profissional",
    price: 197,
    originalPrice: 397,
    features: [
      "Tudo do Essencial",
      "Backup diário",
      "5 horas de alterações/mês",
      "Suporte prioritário",
      "Otimização SEO mensal",
      "CDN básico",
    ],
    recommended: true,
    icon: <TrendingUp className="w-5 h-5" />,
    badge: "Mais Vendido",
  },
  {
    id: "business",
    name: "Business",
    price: 397,
    originalPrice: 697,
    features: [
      "Tudo do Profissional",
      "15 horas de alterações/mês",
      "Suporte 24/7",
      "CDN Premium",
      "Relatórios semanais",
      "Consultoria mensal",
    ],
    recommended: false,
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "premium",
    name: "Enterprise",
    price: 697,
    originalPrice: 1297,
    features: [
      "Tudo do Business",
      "Gerente dedicado",
      "Desenvolvimento ilimitado",
      "SLA 99.9%",
      "Infraestrutura dedicada",
      "Auditoria mensal",
    ],
    recommended: false,
    icon: <Star className="w-5 h-5" />,
    badge: "Premium",
  },
]

const BUDGET_OPTIONS: BudgetOption[] = [
  {
    value: "800-1200",
    label: "R$ 800 - R$ 1.200",
    description: "Landing Page Simples",
    average: 997,
    originalPrice: 1997
  },
  {
    value: "1200-1800",
    label: "R$ 1.200 - R$ 1.800",
    description: "Site Institucional 5-7 páginas",
    average: 1497,
    originalPrice: 2497
  },
  {
    value: "1800-3000",
    label: "R$ 1.800 - R$ 3.000",
    description: "Site Completo + Blog",
    average: 2497,
    originalPrice: 4497
  },
  {
    value: "3000-5000",
    label: "R$ 3.000 - R$ 5.000",
    description: "E-commerce ou Portal",
    average: 3997,
    originalPrice: 6997
  },
  {
    value: "5000+",
    label: "Acima de R$ 5.000",
    description: "Sistema Personalizado",
    average: 5997,
    originalPrice: 9997
  },
]

const TIMELINE_OPTIONS: TimelineOption[] = [
  { value: "1-2-weeks", label: "7-15 dias", icon: <Flame className="w-4 h-4" />, urgent: true },
  { value: "2-3-weeks", label: "15-20 dias", icon: <Zap className="w-4 h-4" /> },
  { value: "3-4-weeks", label: "20-30 dias", icon: <Clock className="w-4 h-4" /> },
  { value: "1-2-months", label: "1-2 meses", icon: <Calendar className="w-4 h-4" /> },
  { value: "flexible", label: "Flexível", icon: <Calendar className="w-4 h-4" /> },
]

const PAYMENT_DISCOUNT = 15

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function ContractForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type")

  const [step, setStep] = useState<number>(1)
  const [contractSigned, setContractSigned] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    cpf: "",
    projectType: "",
    budget: "",
    timeline: "",
    description: "",
    termsAccepted: false,
    serviceType: "project",
    maintenancePlan: "",
    paymentId: "",
    maintenanceDetails: {
      siteLink: "",
      otherInfo: "",
    },
    paymentStructure: "40-30-30",
  })

  const [documentValidation, setDocumentValidation] = useState<DocumentValidation>({
    isValid: true,
    message: "",
    touched: false,
  })
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string>("")
  const [paymentProcessing, setPaymentProcessing] = useState<boolean>(false)

  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60)
  const [spotsLeft] = useState(3)

  useEffect(() => {
    if (typeParam) {
      setFormData((prev) => ({
        ...prev,
        serviceType: typeParam === "maintenance" ? "maintenance" : "project",
      }))
    }
  }, [typeParam])

  useEffect(() => {
    if (formData.cpf && documentValidation.touched) {
      validateDocument(formData.cpf)
    }
  }, [formData.cpf, documentValidation.touched])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const validateDocument = (value: string): void => {
    if (!value) {
      setDocumentValidation({ isValid: true, message: "", touched: true })
      return
    }
    const documentType = getDocumentType(value)
    const isValid = isValidDocument(value)
    const message =
      documentType === "invalid"
        ? "Formato inválido. Digite um CPF ou CNPJ válido."
        : !isValid
        ? documentType === "cpf"
          ? "CPF inválido. Verifique os dígitos."
          : "CNPJ inválido. Verifique os dígitos."
        : ""

    setDocumentValidation({ isValid, message, touched: true })
  }

  const calculateProjectValue = (): number => {
    const budgetOption = BUDGET_OPTIONS.find(opt => opt.value === formData.budget)
    return budgetOption?.average || 997
  }

  const getPaymentBreakdown = useMemo((): PaymentBreakdown => {
    const total = formData.serviceType === "project"
        ? calculateProjectValue()
        : MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.price || 0

    if (formData.serviceType === "maintenance") {
      return {
        entrada: total,
        segunda: 0,
        terceira: 0,
        total: total,
        discount: 0,
        originalTotal: total,
      }
    }

    const discount = formData.paymentStructure === "full" ? (total * PAYMENT_DISCOUNT) / 100 : 0
    const finalTotal = total - discount

    if (formData.paymentStructure === "full") {
      return {
        entrada: Number(finalTotal.toFixed(2)),
        segunda: 0,
        terceira: 0,
        total: Number(finalTotal.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        originalTotal: Number(total.toFixed(2)),
      }
    } else if (formData.paymentStructure === "40-30-30") {
      return {
        entrada: Number((total * 0.4).toFixed(2)),
        segunda: Number((total * 0.3).toFixed(2)),
        terceira: Number((total * 0.3).toFixed(2)),
        total: Number(total.toFixed(2)),
        discount: 0,
        originalTotal: Number(total.toFixed(2)),
      }
    } else {
      return {
        entrada: Number((total * 0.5).toFixed(2)),
        segunda: Number((total * 0.5).toFixed(2)),
        terceira: 0,
        total: Number(total.toFixed(2)),
        discount: 0,
        originalTotal: Number(total.toFixed(2)),
      }
    }
  }, [formData.budget, formData.paymentStructure, formData.serviceType, formData.maintenancePlan])

  const isStep1Valid = useMemo((): boolean => {
    const { name, email, serviceType, projectType, maintenancePlan, budget } = formData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!name || !email || !emailRegex.test(email)) return false
    if (serviceType === "project" && (!projectType || !budget)) return false
    if (serviceType === "maintenance" && !maintenancePlan) return false
    if (formData.cpf && !documentValidation.isValid) return false
    return true
  }, [formData, documentValidation.isValid])

  const isStep3Valid = useMemo((): boolean => !!paymentMethod, [paymentMethod])

  const progressPercentage = useMemo((): number => {
    return ((step - 1) / 2) * 100
  }, [step])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatDocument(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean): void => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleMaintenanceDetailsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      maintenanceDetails: {
        ...prev.maintenanceDetails,
        [name]: value,
      },
    }))
  }

  const handleSignContract = (): void => {
    if (formData.termsAccepted) {
      setContractSigned(true)
      setStep(3)
    }
  }

  const submitContractData = async (): Promise<boolean> => {
    try {
      setSubmitting(true)
      setSubmitError("")

      if (!isStep1Valid) {
        setSubmitError("Por favor, preencha todos os campos obrigatórios corretamente.")
        setSubmitting(false)
        return false
      }

      const realValue = getPaymentBreakdown.total
      const firstPaymentValue = getPaymentBreakdown.entrada

      const contractPayload = {
        ...formData,
        totalAmount: realValue,
        firstPayment: firstPaymentValue,
        serviceDetails: {
          type: formData.serviceType,
          planName: formData.serviceType === "maintenance"
            ? MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.name
            : formData.projectType,
          paymentStructure: formData.paymentStructure,
        }
      }

      const response = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractPayload),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao enviar dados do contrato")
      }

      setFormData((prev) => ({ ...prev, paymentId: responseData.asaasData.id }))
      return true
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError("Ocorreu um erro desconhecido ao enviar os dados.")
      }
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentSubmit = async (): Promise<void> => {
    if (!paymentMethod) {
      setSubmitError("Por favor, selecione um método de pagamento.")
      return
    }

    try {
      setPaymentProcessing(true)
      setSubmitError("")

      const paymentValue = getPaymentBreakdown.entrada

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          paymentId: formData.paymentId,
          amount: paymentValue,
          serviceType: formData.serviceType,
          customerData: {
            name: formData.name,
            email: formData.email,
            cpfCnpj: formData.cpf,
          }
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erro no processamento do pagamento")
      }

      router.push("/pagamento-sucesso")
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError("Ocorreu um erro desconhecido durante o pagamento.")
      }
    } finally {
      setPaymentProcessing(false)
    }
  }

  const nextStep = async (): Promise<void> => {
    if (step === 1) {
      const success = await submitContractData()
      if (success) setStep(2)
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = (): void => setStep((prev) => prev - 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* BARRA DE URGÊNCIA */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-2xl"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 text-center">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-sm md:text-base">
                🔥 PROMOÇÃO: Apenas {spotsLeft} vagas restantes com até 50% OFF
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-base md:text-lg font-bold bg-black/30 px-4 py-2 rounded-lg backdrop-blur">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10 mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-all hover:gap-3 font-semibold group"
          >
            <div className="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <span className="text-sm md:text-base">Voltar para início</span>
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-5 shadow-lg"
          >
            <Star className="w-4 h-4 fill-white" />
            4.9★ • +127 Clientes Satisfeitos
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seu Site Profissional
            </span>
            <br />
            <span className="text-gray-800">Pronto em Dias</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6 leading-relaxed">
            <span className="font-bold text-green-600">Preços justos</span> com qualidade premium.<br />
            <span className="text-base text-orange-600 font-semibold">Competimos com IAs, mas você tem suporte humano real 24/7! 🚀</span>
          </p>

          {/* COMPARAÇÃO VISUAL */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-8"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2 border-gray-300 bg-gray-50 p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-700">
                    🤖 IAs e Concorrentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Código genérico cheio de bugs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Zero suporte após entregar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Design sem personalização</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-xl p-5">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                    ✅ Com a Impulsioneweb
                    <Badge className="bg-emerald-500 text-white text-xs">Premium</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0 stroke-[3]" />
                      <span className="font-semibold text-gray-900">Código limpo e testado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0 stroke-[3]" />
                      <span className="font-semibold text-gray-900">30 dias de suporte grátis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0 stroke-[3]" />
                      <span className="font-semibold text-gray-900">Design exclusivo</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { icon: <DollarSign className="w-4 h-4" />, text: "Preço Justo" },
              { icon: <Clock className="w-4 h-4" />, text: "Entrega Rápida" },
              { icon: <Shield className="w-4 h-4" />, text: "30 Dias Garantia" },
              { icon: <Users className="w-4 h-4" />, text: "Suporte 24/7" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-700 text-sm"
              >
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {badge.icon}
                </div>
                <span className="font-semibold">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              {[
                { num: 1, label: "Seus Dados", icon: <User className="w-5 h-5" /> },
                { num: 2, label: "Contrato", icon: <FileText className="w-5 h-5" /> },
                { num: 3, label: "Pagamento", icon: <CreditCard className="w-5 h-5" /> },
              ].map((s, index) => (
                <React.Fragment key={s.num}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex flex-col items-center gap-2 transition-all flex-1 ${
                      step >= s.num ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-bold transition-all ${
                        step >= s.num
                          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step > s.num ? (
                        <Check className="w-6 h-6 stroke-[3]" />
                      ) : (
                        s.icon
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
                      {s.label}
                    </span>
                  </motion.div>
                  {index < 2 && (
                    <div className="flex-1 h-1 bg-gray-200 rounded-full mx-4 overflow-hidden max-w-[100px]">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: step > s.num ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm font-semibold text-gray-600">
                <span>Início</span>
                <span>{Math.round(progressPercentage)}% completo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <Alert className="border-red-300 bg-red-50 shadow-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800 font-bold">Ops! Algo deu errado</AlertTitle>
                <AlertDescription className="text-red-700">{submitError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {contractSigned && step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <Alert className="border-green-300 bg-green-50 shadow-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 font-bold">✅ Contrato Assinado!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Tudo certo! Agora é só finalizar o pagamento para iniciarmos seu projeto.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RENDERIZAÇÃO COMPLETA DOS STEPS - Continua com o código do antigo... */}
        {/* Por limitação de espaço, o código completo tem 2000+ linhas */}
        {/* Use o código do arquivo antigo para os Steps 1, 2 e 3 */}
                {/* MAIN CONTENT - STEPS */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* ==================== STEP 1: DADOS DO PROJETO ==================== */}
          {step === 1 && (
            <Card className="border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="p-3 bg-white/20 rounded-2xl backdrop-blur"
                  >
                    <Target className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl md:text-4xl font-black">
                      Conte-nos Sobre Seu Projeto
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-sm md:text-base mt-1">
                      Campos com <span className="text-yellow-300">*</span> são obrigatórios
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
                {/* Service Type Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Label className="text-lg md:text-xl font-bold flex items-center gap-2 text-gray-900">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                    O que você precisa? <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {[
                      {
                        value: "project",
                        label: "Criar um Projeto Novo",
                        description: "Website, app ou sistema do zero",
                        icon: <Monitor className="w-6 h-6" />,
                        gradient: "from-blue-500 to-cyan-500"
                      },
                      {
                        value: "maintenance",
                        label: "Manutenção do Meu Site",
                        description: "Suporte e melhorias contínuas",
                        icon: <Shield className="w-6 h-6" />,
                        gradient: "from-purple-500 to-pink-500"
                      },
                    ].map((type) => (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectChange("serviceType", type.value)}
                        className={cn(
                          "p-4 md:p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden group",
                          formData.serviceType === type.value
                            ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl shadow-indigo-500/20"
                            : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-lg"
                        )}
                      >
                        <div className="flex items-start gap-3 relative z-10">
                          <div className={cn(
                            "p-2.5 md:p-3 rounded-xl transition-all",
                            formData.serviceType === type.value
                              ? `bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          )}>
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-base md:text-lg text-gray-900">{type.label}</h3>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                          {formData.serviceType === type.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-3 right-3"
                            >
                              <div className="p-1 bg-indigo-600 rounded-full">
                                <Check className="w-3 h-3 md:w-4 md:h-4 text-white stroke-[3]" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4 bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-2xl border border-gray-200"
                >
                  <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-gray-900">
                    <User className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                    Seus Dados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="name" className="flex items-center gap-1 text-sm md:text-base font-semibold">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm md:text-base font-semibold">
                        <Mail className="w-4 h-4" /> Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-sm md:text-base font-semibold">
                        <Phone className="w-4 h-4" /> Telefone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-2 text-sm md:text-base font-semibold">
                        <Building className="w-4 h-4" /> Empresa
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                        placeholder="Nome da empresa (opcional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-sm md:text-base font-semibold">CPF/CNPJ</Label>
                      <div className="relative">
                        <Input
                          id="cpf"
                          name="cpf"
                          value={formData.cpf}
                          onChange={handleChange}
                          onBlur={() => validateDocument(formData.cpf)}
                          placeholder="000.000.000-00 ou 00.000.000/0001-00"
                          className={cn(
                            "h-11 md:h-12 text-base pr-10 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20",
                            !documentValidation.isValid && documentValidation.touched && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          )}
                        />
                        {formData.cpf && documentValidation.touched && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                          >
                            {documentValidation.isValid ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )}
                          </motion.div>
                        )}
                      </div>
                      {!documentValidation.isValid && documentValidation.touched && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs md:text-sm text-red-500 font-medium"
                        >
                          {documentValidation.message}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* PROJECT DETAILS */}
                {formData.serviceType === "project" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6 rounded-2xl border border-indigo-200">
                      <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 mb-4 text-gray-900">
                        <Cog className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                        Detalhes do Projeto
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4">
                        {[
                          { value: "website", label: "Website/Portal", icon: <Globe className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" },
                          { value: "system", label: "Sistema/App", icon: <Smartphone className="w-5 h-5" />, gradient: "from-orange-500 to-red-500" },
                        ].map((type) => (
                          <motion.button
                            key={type.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectChange("projectType", type.value)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all relative overflow-hidden",
                              formData.projectType === type.value
                                ? "border-indigo-500 bg-white shadow-lg shadow-indigo-500/20"
                                : "border-white bg-white/50 hover:border-indigo-300 hover:bg-white"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-lg transition-all",
                                formData.projectType === type.value
                                  ? `bg-gradient-to-br ${type.gradient} text-white shadow-md`
                                  : "bg-gray-100 text-gray-600"
                              )}>
                                {type.icon}
                              </div>
                              <span className="font-bold text-gray-900">{type.label}</span>
                              {formData.projectType === type.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto"
                                >
                                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 bg-white p-4 rounded-xl shadow-sm">
                        <div className="space-y-2">
                          <Label htmlFor="budget" className="text-sm md:text-base font-semibold flex items-center gap-2">
                            Quanto Quer Investir? <span className="text-red-500">*</span>
                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs border-0">
                              Até 50% OFF
                            </Badge>
                          </Label>
                          <Select
                            value={formData.budget}
                            onValueChange={(value) => handleSelectChange("budget", value)}
                          >
                            <SelectTrigger className="h-11 md:h-12 bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20">
                              <SelectValue placeholder="Escolha sua faixa de preço" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {BUDGET_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="py-1">
                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                      {option.label}
                                      <span className="text-xs line-through text-gray-400">
                                        de R$ {option.originalPrice.toLocaleString('pt-BR')}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500">{option.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timeline" className="text-sm md:text-base font-semibold">Prazo Desejado</Label>
                          <Select
                            value={formData.timeline}
                            onValueChange={(value) => handleSelectChange("timeline", value)}
                          >
                            <SelectTrigger className="h-11 md:h-12 bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20">
                              <SelectValue placeholder="Quando precisa?" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {TIMELINE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    {option.icon}
                                    <span className="text-gray-900">{option.label}</span>
                                    {option.urgent && (
                                      <Badge className="bg-red-500 text-white text-xs">Urgente</Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <Label className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          Como Prefere Pagar?
                        </Label>
                        <RadioGroup
                          value={formData.paymentStructure}
                          onValueChange={(value: "full" | "50-50" | "40-30-30") =>
                            handleSelectChange("paymentStructure", value)
                          }
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                            {[
                              {
                                value: "full",
                                label: "À Vista",
                                description: `${PAYMENT_DISCOUNT}% de desconto!`,
                                badge: "Economize Mais",
                                badgeColor: "bg-green-500"
                              },
                              {
                                value: "50-50",
                                label: "2 Vezes",
                                description: "50% agora + 50% depois",
                              },
                              {
                                value: "40-30-30",
                                label: "3 Vezes",
                                description: "40% + 30% + 30%",
                                badge: "Mais Escolhido",
                                badgeColor: "bg-blue-500"
                              },
                            ].map((option) => (
                              <div key={option.value} className="relative">
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={option.value}
                                  className={cn(
                                    "flex flex-col gap-2 rounded-xl border-2 p-4 cursor-pointer transition-all",
                                    "hover:border-indigo-300 hover:shadow-md bg-white",
                                    "peer-data-[state=checked]:border-indigo-600",
                                    "peer-data-[state=checked]:bg-indigo-50",
                                    "peer-data-[state=checked]:shadow-lg peer-data-[state=checked]:shadow-indigo-500/20"
                                  )}
                                >
                                  {option.badge && (
                                    <Badge className={`absolute -top-2 -right-2 ${option.badgeColor} text-white border-0 shadow-lg text-xs`}>
                                      {option.badge}
                                    </Badge>
                                  )}
                                  <div className="font-bold text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-600">{option.description}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      {/* RESUMO FINANCEIRO */}
                      {formData.budget && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border-2 border-green-300 shadow-xl mt-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                              <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black text-base md:text-lg text-gray-900 mb-3 flex items-center gap-2">
                                💰 Resumo do Investimento
                                {getPaymentBreakdown.discount > 0 && (
                                  <Badge className="bg-green-500 text-white font-bold animate-pulse">
                                    Economize R$ {getPaymentBreakdown.discount.toFixed(2)}
                                  </Badge>
                                )}
                              </h4>
                              <div className="space-y-2">
                                {formData.paymentStructure === "full" ? (
                                  <div className="flex justify-between items-center py-3 border-b-2 border-green-200">
                                    <span className="text-sm md:text-base text-gray-700 font-semibold">
                                      À Vista ({PAYMENT_DISCOUNT}% OFF)
                                    </span>
                                    <div className="text-right">
                                      <div className="text-xs line-through text-gray-400">
                                        R$ {getPaymentBreakdown.originalTotal.toFixed(2)}
                                      </div>
                                      <span className="font-black text-lg md:text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        R$ {getPaymentBreakdown.entrada.toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                      <span className="text-sm md:text-base text-gray-600">
                                        {formData.paymentStructure === "40-30-30" ? "1ª Parcela (40%)" : "1ª Parcela (50%)"}
                                      </span>
                                      <span className="font-bold text-base md:text-lg text-gray-900">
                                        R$ {getPaymentBreakdown.entrada.toFixed(2)}
                                      </span>
                                    </div>
                                    {formData.paymentStructure === "40-30-30" ? (
                                      <>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                          <span className="text-sm md:text-base text-gray-600">2ª Parcela (30%)</span>
                                          <span className="font-bold text-base md:text-lg text-gray-900">
                                            R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                          <span className="text-sm md:text-base text-gray-600">3ª Parcela (30%)</span>
                                          <span className="font-bold text-base md:text-lg text-gray-900">
                                            R$ {getPaymentBreakdown.terceira.toFixed(2)}
                                          </span>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                        <span className="text-sm md:text-base text-gray-600">2ª Parcela (50%)</span>
                                        <span className="font-bold text-base md:text-lg text-gray-900">
                                          R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                        </span>
                                      </div>
                                    )}
                                  </>
                                )}
                                <div className="flex justify-between items-center pt-3 bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-lg md:text-xl font-black text-gray-900">TOTAL HOJE</span>
                                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    R$ {getPaymentBreakdown.entrada.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* MAINTENANCE PLANS */}
                {formData.serviceType === "maintenance" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-gray-900">
                        <Shield className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                        Planos de Manutenção <span className="text-red-500">*</span>
                      </h3>
                      <Badge className="bg-orange-500 text-white font-bold">Até 50% OFF</Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                      {MAINTENANCE_PLANS.map((plan, index) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={cn(
                              "cursor-pointer transition-all h-full relative overflow-hidden",
                              formData.maintenancePlan === plan.id
                                ? "border-2 border-indigo-500 shadow-2xl shadow-indigo-500/30 bg-gradient-to-br from-indigo-50 to-purple-50"
                                : "border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl bg-white"
                            )}
                            onClick={() => handleSelectChange("maintenancePlan", plan.id)}
                          >
                            {plan.badge && (
                              <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg z-10 text-xs">
                                {plan.badge}
                              </Badge>
                            )}
                            <CardHeader className="pb-3 pt-6">
                              <div className="flex items-center justify-between mb-3">
                                <div className={cn(
                                  "p-2.5 rounded-xl transition-all",
                                  formData.maintenancePlan === plan.id
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg"
                                    : "bg-gray-100 text-gray-600"
                                )}>
                                  {plan.icon}
                                </div>
                                {formData.maintenancePlan === plan.id && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 500 }}
                                  >
                                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                                  </motion.div>
                                )}
                              </div>
                              <CardTitle className="text-lg md:text-xl font-bold">{plan.name}</CardTitle>
                              <div className="mt-2">
                                <div className="text-xs line-through text-gray-400">
                                  R$ {plan.originalPrice}/mês
                                </div>
                                <div>
                                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    R$ {plan.price}
                                  </span>
                                  <span className="text-gray-500 text-sm font-medium">/mês</span>
                                </div>
                                <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
                                  Economize R$ {plan.originalPrice - plan.price}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2.5">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs md:text-sm">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0 stroke-[2.5]" />
                                    <span className="text-gray-700">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 border border-gray-200">
                      <Label htmlFor="siteLink" className="text-sm md:text-base font-semibold">Link do seu site (opcional)</Label>
                      <Input
                        id="siteLink"
                        name="siteLink"
                        value={formData.maintenanceDetails.siteLink}
                        onChange={handleMaintenanceDetailsChange}
                        placeholder="https://seusite.com.br"
                        className="h-11 md:h-12 text-base mt-2 border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="description" className="text-sm md:text-base font-semibold">
                    Conte mais sobre seu projeto (opcional)
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[120px] md:min-h-[140px] resize-none text-base border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                    placeholder={
                      formData.serviceType === "project"
                        ? "Descreva: objetivos, funcionalidades, cores preferidas, exemplos de sites que gosta..."
                        : "Conte sobre seu site atual e o que precisa de manutenção..."
                    }
                  />
                </motion.div>

                {/* Garantias */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border-2 border-green-300 shadow-lg"
                >
                  <h4 className="font-black text-lg mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    🎁 O Que Está Incluso (Grátis!)
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "✅ 30 dias de suporte grátis",
                      "✅ 3 rodadas de ajustes incluídas",
                      "✅ Código limpo e documentado",
                      "✅ Design 100% responsivo (mobile/desktop)",
                      "✅ SSL e segurança configurada",
                      "✅ Hospedagem Next.js/Vercel configurada",
                    ].map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 font-semibold flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </CardContent>

              <CardFooter className="bg-gray-50 p-4 md:p-6 flex-col sm:flex-row gap-3">
                <div className="w-full flex flex-col sm:flex-row justify-end items-center gap-3">
                  <span className="text-sm text-gray-500 font-medium order-2 sm:order-1">
                    Etapa 1 de 3
                  </span>
                  <Button
                    onClick={nextStep}
                    disabled={submitting || !isStep1Valid}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl shadow-indigo-500/50 h-12 md:h-14 px-8 font-black text-base order-1 sm:order-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        CONTINUAR PARA O CONTRATO
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* ==================== STEP 2: CONTRATO ==================== */}
          {step === 2 && (
            <Card className="border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="p-3 bg-white/20 rounded-2xl backdrop-blur"
                  >
                    <FileText className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl md:text-4xl font-black">
                      Termos do Contrato
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-sm md:text-base mt-1">
                      Leia com atenção antes de aceitar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 border-2 border-gray-200 shadow-inner"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg">
                      <Shield className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">
                      Contrato de Prestação de Serviços
                    </h3>
                  </div>

                  <div className="prose prose-sm md:prose-base max-w-none text-gray-700 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-gray-200">
                    <h4 className="font-black text-gray-900">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS</h4>
                    <p className="text-sm md:text-base">
                      Entre <strong className="text-indigo-600">Impulsioneweb</strong> (CONTRATADA) e{" "}
                      <strong className="text-indigo-600">{formData.name || "[Nome do Cliente]"}</strong> (CONTRATANTE)
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">1. OBJETO DO CONTRATO</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project" ? (
                        <>
                          Desenvolvimento de{" "}
                          {formData.projectType === "website"
                            ? "website/portal web"
                            : "sistema/aplicativo"}{" "}
                          conforme especificações, com valor de{" "}
                          <strong className="text-green-600">R$ {getPaymentBreakdown.total.toFixed(2)}</strong>
                          {getPaymentBreakdown.discount > 0 && (
                            <> (desconto de R$ {getPaymentBreakdown.discount.toFixed(2)} à vista aplicado)</>
                          )}.
                        </>
                      ) : (
                        <>
                          Manutenção mensal no Plano{" "}
                          <strong className="text-indigo-600">
                            {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.name}
                          </strong>
                          , por{" "}
                          <strong className="text-green-600">
                            R$ {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.price}/mês
                          </strong>
                          .
                        </>
                      )}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">2. FORMA DE PAGAMENTO</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project" ? (
                        <>
                          Pagamento:
                          <ul className="mt-2 space-y-1">
                            {formData.paymentStructure === "full" ? (
                              <li>
                                <strong>À Vista ({PAYMENT_DISCOUNT}% OFF):</strong> R$ {getPaymentBreakdown.entrada.toFixed(2)}
                              </li>
                            ) : (
                              <>
                                <li>
                                  <strong>1ª Parcela:</strong> R$ {getPaymentBreakdown.entrada.toFixed(2)}{" "}
                                  ({formData.paymentStructure === "40-30-30" ? "40%" : "50%"})
                                </li>
                                {formData.paymentStructure === "40-30-30" ? (
                                  <>
                                    <li>
                                      <strong>2ª Parcela:</strong> R$ {getPaymentBreakdown.segunda.toFixed(2)} (30%)
                                    </li>
                                    <li>
                                      <strong>3ª Parcela:</strong> R$ {getPaymentBreakdown.terceira.toFixed(2)} (30%)
                                    </li>
                                  </>
                                ) : (
                                  <li>
                                    <strong>2ª Parcela:</strong> R$ {getPaymentBreakdown.segunda.toFixed(2)} (50%)
                                  </li>
                                )}
                              </>
                            )}
                          </ul>
                        </>
                      ) : (
                        <>
                          Mensalidade de{" "}
                          <strong className="text-green-600">
                            R$ {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.price}
                          </strong>{" "}
                          vencendo todo dia 10. <strong>Atraso de 15 dias = site suspenso automaticamente.</strong>
                        </>
                      )}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">3. PRAZO</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project"
                        ? `Prazo estimado: ${TIMELINE_OPTIONS.find(t => t.value === formData.timeline)?.label || "a combinar"}.`
                        : "Serviço contínuo até cancelamento."}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">4. OBRIGAÇÕES</h4>
                    <ul className="space-y-1 text-sm md:text-base">
                      <li>• CONTRATADA entrega conforme acordado</li>
                      <li>• CONTRATANTE fornece informações necessárias</li>
                      <li>• Atrasos no pagamento suspendem serviços</li>
                      {formData.serviceType === "project" && (
                        <li>• Incluído: 3 revisões + 30 dias suporte grátis</li>
                      )}
                    </ul>

                    <h4 className="font-black mt-4 text-gray-900 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      5. SUSPENSÃO POR FALTA DE PAGAMENTO
                    </h4>
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 my-3">
                      <p className="text-sm md:text-base font-bold text-red-900">
                        ATENÇÃO - CLÁUSULA IMPORTANTE:
                      </p>
                      <ul className="space-y-1 text-sm md:text-base text-red-800 mt-2">
                        <li>• <strong>Projetos:</strong> Não pagou parcela = desenvolvimento SUSPENSO até quitação.</li>
                        <li>• <strong>Manutenção:</strong> 15 dias de atraso = site/sistema SAI DO AR automaticamente.</li>
                        <li>• Multa: 2% ao mês + juros 1% a.m.</li>
                        <li>• Após 60 dias: possível exclusão permanente de arquivos.</li>
                      </ul>
                    </div>

                    <h4 className="font-black mt-4 text-gray-900">6. CANCELAMENTO</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project"
                        ? "Cancelamento: valores pagos NÃO são reembolsados."
                        : "Deve avisar com 30 dias de antecedência."}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">7. GARANTIAS</h4>
                    <ul className="space-y-1 text-sm md:text-base">
                      <li>• 30 dias para correção de bugs</li>
                      <li>• SSL incluso</li>
                      <li>• Backup conforme plano</li>
                    </ul>

                    <h4 className="font-black mt-4 text-gray-900">8. PROPRIEDADE</h4>
                    <p className="text-sm md:text-base">
                      Após quitação TOTAL, código-fonte é seu. Frameworks mantêm licenças originais.
                    </p>

                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <p className="text-sm font-bold text-blue-900">
                        ✓ Ao aceitar, você confirma que leu e concorda com TODOS os termos acima.
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={handleCheckboxChange}
                      className="mt-1 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 w-5 h-5"
                    />
                    <label htmlFor="terms" className="cursor-pointer flex-1">
                      <div className="font-bold text-base md:text-lg text-gray-900">
                        ✓ Li e aceito todos os termos
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Estou ciente das condições de pagamento, prazos e suspensão por inadimplência.
                      </div>
                    </label>
                  </div>
                </motion.div>
              </CardContent>

              <CardFooter className="bg-gray-50 p-4 md:p-6 flex-col sm:flex-row gap-3">
                <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    size="lg"
                    className="w-full sm:w-auto border-2 h-12 md:h-14 px-6 font-bold order-2 sm:order-1"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </Button>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                    <span className="text-sm text-gray-500 font-medium">Etapa 2 de 3</span>
                    <Button
                      onClick={handleSignContract}
                      disabled={!formData.termsAccepted}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl shadow-indigo-500/50 h-12 md:h-14 px-8 font-black text-base disabled:opacity-50"
                    >
                      ASSINAR E CONTINUAR
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* ==================== STEP 3: PAGAMENTO ==================== */}
          {step === 3 && (
            <Card className="border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="p-3 bg-white/20 rounded-2xl backdrop-blur"
                    >
                      <CreditCard className="w-6 h-6 md:w-8 md:h-8" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl md:text-4xl font-black">
                        🎉 Último Passo!
                      </CardTitle>
                      <CardDescription className="text-emerald-100 text-sm md:text-base mt-1">
                        Pagamento 100% seguro e criptografado
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-8 space-y-6">
                {/* GARANTIA EM DESTAQUE */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border-2 border-blue-300 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-xl shadow-lg">
                      <Shield className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg mb-2 text-gray-900">
                        🛡️ Garantia de 30 Dias ou Seu Dinheiro de Volta
                      </h4>
                      <p className="text-sm text-gray-700">
                        Se em 30 dias você não estiver 100% satisfeito, devolvemos TODO o valor pago. Sem perguntas, sem burocracia.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border-2 border-green-300 shadow-lg"
                >
                  <h3 className="text-lg md:text-xl font-black mb-4 flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    💰 Valor a Pagar AGORA
                  </h3>

                  {formData.serviceType === "project" ? (
                    <div className="space-y-4">
                      <Card className="border-2 border-green-500 bg-white shadow-xl">
                        <CardHeader className="pb-3">
                          <Badge className="w-fit bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                            <Zap className="w-3 h-3 mr-1" />
                            {formData.paymentStructure === "full" ? "Pagamento Único" : "1ª Parcela"}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            R$ {getPaymentBreakdown.entrada.toFixed(2)}
                          </p>
                          {getPaymentBreakdown.discount > 0 && (
                            <div className="mt-2">
                              <span className="text-sm line-through text-gray-400">
                                R$ {getPaymentBreakdown.originalTotal.toFixed(2)}
                              </span>
                              <Badge className="ml-2 bg-green-500 text-white font-bold animate-pulse">
                                Economize R$ {getPaymentBreakdown.discount.toFixed(2)} ({PAYMENT_DISCOUNT}% OFF)
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 mt-2 font-semibold">
                            {formData.paymentStructure === "full"
                              ? "Pagamento único com desconto! Projeto inicia em até 24h."
                              : `Demais parcelas cobradas no andamento do projeto`}
                          </p>
                        </CardContent>
                      </Card>

                      <Alert className="border-blue-300 bg-blue-50">
                        <Info className="h-5 w-5 text-blue-600" />
                        <AlertDescription className="text-blue-800 font-medium">
                          🚀 Projeto inicia imediatamente após confirmação do pagamento!
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <Card className="border-2 border-green-500 bg-white shadow-xl">
                      <CardContent className="pt-6">
                        <div className="text-sm line-through text-gray-400">
                          De: R$ {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.originalPrice}/mês
                        </div>
                        <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          R$ {getPaymentBreakdown.total.toFixed(2)}
                          <span className="text-lg font-normal text-gray-500">/mês</span>
                        </p>
                        <Badge className="mt-2 bg-green-500 text-white font-bold">
                          Economize R$ {(MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.originalPrice || 0) - getPaymentBreakdown.total}/mês
                        </Badge>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg md:text-xl font-black text-gray-900">Como Quer Pagar?</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      {[
                        {
                          value: "pix",
                          label: "PIX",
                          description: "Aprovação instantânea - Mais Rápido! ⚡",
                          icon: <Zap className="w-5 h-5" />,
                          recommended: true,
                          gradient: "from-green-500 to-emerald-500"
                        },
                        {
                          value: "credit-card",
                          label: "Cartão de Crédito",
                          description: formData.serviceType === "project" ? "Parcele em até 3x sem juros" : "Débito automático mensal",
                          icon: <CreditCard className="w-5 h-5" />,
                          gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                          value: "boleto",
                          label: "Boleto",
                          description: "Vence em 3 dias úteis",
                          icon: <FileText className="w-5 h-5" />,
                          gradient: "from-orange-500 to-red-500"
                        },
                      ].map((method) => (
                        <div key={method.value} className="relative">
                          <RadioGroupItem
                            value={method.value}
                            id={method.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={method.value}
                            className={cn(
                              "flex items-center gap-4 rounded-2xl border-2 p-4 md:p-5 cursor-pointer transition-all bg-white",
                              "hover:border-green-400 hover:shadow-xl",
                              "peer-data-[state=checked]:border-green-600",
                              "peer-data-[state=checked]:bg-green-50",
                              "peer-data-[state=checked]:shadow-2xl peer-data-[state=checked]:scale-[1.02]"
                            )}
                          >
                            <div className={cn(
                              "p-3 rounded-xl transition-all",
                              paymentMethod === method.value
                                ? `bg-gradient-to-br ${method.gradient} text-white shadow-lg`
                                : "bg-gray-100 text-gray-600"
                            )}>
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-gray-900">{method.label}</span>
                                {method.recommended && (
                                  <Badge className="bg-green-500 text-white text-xs animate-pulse">
                                    Recomendado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 font-medium">{method.description}</p>
                            </div>
                            {paymentMethod === method.value && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </motion.div>

                {/* Payment Details */}
                <AnimatePresence>
                  {paymentMethod && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-2xl p-4 md:p-6 border-2 border-gray-200 shadow-lg"
                    >
                      {paymentMethod === "pix" && (
                        <PixQRCode
                          paymentId={formData.paymentId}
                          amount={getPaymentBreakdown.entrada}
                        />
                      )}

                      {paymentMethod === "credit-card" && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            Dados do Cartão
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Label>Número do Cartão</Label>
                              <Input placeholder="1234 5678 9012 3456" className="h-12 text-base mt-2" />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Nome no Cartão</Label>
                              <Input placeholder="COMO ESTÁ NO CARTÃO" className="h-12 text-base mt-2" />
                            </div>
                            <div>
                              <Label>Validade</Label>
                              <Input placeholder="MM/AA" className="h-12 text-base mt-2" />
                            </div>
                            <div>
                              <Label>CVV</Label>
                              <Input placeholder="123" maxLength={4} className="h-12 text-base mt-2" />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "boleto" && (
                        <BoletoPayment
                          paymentId={formData.paymentId}
                          amount={getPaymentBreakdown.entrada}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="bg-gray-50 p-4 md:p-6">
                <div className="w-full flex flex-col sm:flex-row justify-between gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={paymentProcessing}
                    size="lg"
                    className="w-full sm:w-auto h-14 px-6 font-bold"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={!isStep3Valid || paymentProcessing}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl h-14 px-8 font-black text-lg disabled:opacity-50"
                  >
                    {paymentProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        CONFIRMAR PAGAMENTO R$ {getPaymentBreakdown.entrada.toFixed(2)}
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </motion.div>

        {/* Trust Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border shadow-lg">
            <div className="flex flex-wrap items-center justify-center gap-6 text-center">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Pagamento 100% Seguro</p>
                  <p className="text-xs text-gray-600">Criptografia SSL 256-bit</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">LGPD Compliant</p>
                  <p className="text-xs text-gray-600">Seus dados protegidos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">+127 Clientes</p>
                  <p className="text-xs text-gray-600">4.9★ de avaliação</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-600" />
                <div className="text-left">
                  <p className="text-xs font-bold text-gray-900">Garantia 30 Dias</p>
                  <p className="text-xs text-gray-600">Dinheiro de volta</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}