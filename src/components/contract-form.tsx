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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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

// --- Tipos de Dados ---
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
  paymentStructure: "50-50" | "40-30-30"
  exactBudget: string
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
  features: string[]
  recommended: boolean
  icon: React.ReactNode
  badge?: string
}

// --- Dados de Configuração ---
const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: "basic",
    name: "Básico",
    price: 100,
    features: [
      "Backup diário automático",
      "Monitoramento básico 24/7",
      "Suporte por email em horário comercial",
      "Atualizações de segurança mensais",
      "Relatório mensal de performance",
    ],
    recommended: false,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: "intermediate",
    name: "Profissional",
    price: 250,
    features: [
      "Tudo do plano Básico",
      "Monitoramento avançado com alertas",
      "Suporte prioritário (email + telefone)",
      "5 alterações de conteúdo por mês",
      "Otimização SEO mensal",
      "Backup em nuvem redundante",
    ],
    recommended: true,
    icon: <TrendingUp className="w-5 h-5" />,
    badge: "Mais Popular",
  },
  {
    id: "advanced",
    name: "Empresarial",
    price: 500,
    features: [
      "Tudo do plano Profissional",
      "Monitoramento em tempo real",
      "Suporte prioritário 24/7",
      "Alterações de conteúdo ilimitadas",
      "Relatórios semanais detalhados",
      "CDN premium incluído",
      "Testes A/B mensais",
    ],
    recommended: false,
    icon: <Shield className="w-5 h-5" />,
  },
  {
    id: "premium",
    name: "Premium",
    price: 1000,
    features: [
      "Tudo do plano Empresarial",
      "Gerente de conta dedicado",
      "Desenvolvimento de novas funcionalidades",
      "Consultoria técnica ilimitada",
      "SLA garantido de 99.9%",
      "Auditoria de segurança trimestral",
      "Treinamento para sua equipe",
      "Suporte multi-idiomas",
    ],
    recommended: false,
    icon: <Star className="w-5 h-5" />,
    badge: "Exclusivo",
  },
]

const BUDGET_OPTIONS = [
  { value: "1000-1500", label: "R$ 1.000 - R$ 1.500", description: "Landing Page ou Site Institucional", average: 1250 },
  { value: "1500-2500", label: "R$ 1.500 - R$ 2.500", description: "Website com funcionalidades básicas", average: 2000 },
  { value: "2500-3500", label: "R$ 2.500 - R$ 3.500", description: "E-commerce ou Sistema Simples", average: 3000 },
  { value: "3500-5000", label: "R$ 3.500 - R$ 5.000", description: "Aplicativo ou Sistema Médio", average: 4250 },
  { value: "5000+", label: "Acima de R$ 5.000", description: "Projeto Personalizado Complexo", average: 5000 },
]

const TIMELINE_OPTIONS = [
  { value: "2-3-weeks", label: "2-3 semanas", icon: <Zap className="w-4 h-4" /> },
  { value: "3-4-weeks", label: "3-4 semanas", icon: <Clock className="w-4 h-4" /> },
  { value: "1-2-months", label: "1-2 meses", icon: <Calendar className="w-4 h-4" /> },
  { value: "2-3-months", label: "2-3 meses", icon: <Calendar className="w-4 h-4" /> },
  { value: "3+-months", label: "3+ meses", icon: <Calendar className="w-4 h-4" /> },
]

// --- Componente Principal ---
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
    exactBudget: "",
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

  // NOVO: Estado para o contador de urgência (15 minutos)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

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

  // NOVO: useEffect para o contador
  useEffect(() => {
    if (step !== 3 || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeLeft]);


  // --- Funções de Validação e Cálculo ---
  const validateDocument = (value: string) => {
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

  const calculateProjectValue = () => {
    if (formData.exactBudget && !isNaN(parseFloat(formData.exactBudget))) {
      return parseFloat(formData.exactBudget)
    }

    const budgetOption = BUDGET_OPTIONS.find(opt => opt.value === formData.budget)
    return budgetOption?.average || 1500
  }

  const getPaymentBreakdown = useMemo(() => {
    const total = formData.serviceType === "project"
        ? calculateProjectValue()
        : MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.price || 0

    if (formData.serviceType === "maintenance") {
      return {
        entrada: total,
        segunda: 0,
        terceira: 0,
        total: total,
      }
    }

    if (formData.paymentStructure === "40-30-30") {
      return {
        entrada: Number((total * 0.4).toFixed(2)),
        segunda: Number((total * 0.3).toFixed(2)),
        terceira: Number((total * 0.3).toFixed(2)),
        total: Number(total.toFixed(2)),
      }
    } else {
      return {
        entrada: Number((total * 0.5).toFixed(2)),
        segunda: Number((total * 0.5).toFixed(2)),
        terceira: 0,
        total: Number(total.toFixed(2)),
      }
    }
  }, [formData.exactBudget, formData.budget, formData.paymentStructure, formData.serviceType, formData.maintenancePlan])

  const isStep1Valid = useMemo(() => {
    const { name, email, serviceType, projectType, maintenancePlan } = formData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!name || !email || !emailRegex.test(email)) return false
    if (serviceType === "project" && !projectType) return false
    if (serviceType === "maintenance" && !maintenancePlan) return false
    if (formData.cpf && !documentValidation.isValid) return false
    return true
  }, [formData, documentValidation.isValid])

  const isStep3Valid = useMemo(() => !!paymentMethod, [paymentMethod])

  const progressPercentage = useMemo(() => {
    // The form has 3 steps, so we have 2 transitions (1->2, 2->3).
    // This calculates progress as 0%, 50%, 100%.
    return ((step - 1) / 2) * 100
  }, [step])

  // NOVO: Formata o tempo para exibição
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // --- Funções de Manipulação ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cpf" ? formatDocument(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleMaintenanceDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      maintenanceDetails: {
        ...prev.maintenanceDetails,
        [name]: value,
      },
    }))
  }

  const handleSignContract = () => {
    if (formData.termsAccepted) {
      setContractSigned(true)
      setStep(3)
    }
  }

  // --- Funções de Submissão ---
  const submitContractData = async () => {
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
    } catch (error: unknown) {
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

  const handlePaymentSubmit = async () => {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError("Ocorreu um erro desconhecido durante o pagamento.")
      }
    } finally {
      setPaymentProcessing(false)
    }
  }

  const nextStep = async () => {
    if (step === 1) {
      const success = await submitContractData()
      if (success) setStep(2)
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  // --- Renderização do Componente ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12 relative z-10">
        {/* Header Navigation */}
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

        {/* Hero Section - Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6 shadow-lg shadow-indigo-500/30"
          >
            <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Ambiente 100% Seguro e Criptografado
          </motion.div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-3 md:mb-5 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Seu Projeto Digital
            </span>
            <br />
            <span className="text-gray-800">Começa Aqui</span>
          </h1>

          <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Processo simplificado em <span className="font-bold text-indigo-600">3 etapas</span> para transformar sua visão em realidade
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 md:mt-8">
            {[
              { icon: <Shield className="w-4 h-4" />, text: "Pagamento Seguro" },
              { icon: <Award className="w-4 h-4" />, text: "Garantia Total" },
              { icon: <Clock className="w-4 h-4" />, text: "Suporte Rápido" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-600 text-xs md:text-sm"
              >
                <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                  {badge.icon}
                </div>
                <span className="font-medium">{badge.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Progress Bar - Melhorado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8 md:mb-12"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 md:p-8 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              {[
                { num: 1, label: "Informações", icon: <User className="w-4 h-4 md:w-5 md:h-5" />, color: "from-blue-500 to-cyan-500" },
                { num: 2, label: "Contrato", icon: <FileText className="w-4 h-4 md:w-5 md:h-5" />, color: "from-purple-500 to-pink-500" },
                { num: 3, label: "Pagamento", icon: <CreditCard className="w-4 h-4 md:w-5 md:h-5" />, color: "from-green-500 to-emerald-500" },
              ].map((s, index) => (
                <React.Fragment key={s.num}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "flex flex-col items-center gap-2 cursor-pointer transition-all flex-1",
                            step >= s.num ? "opacity-100" : "opacity-40"
                          )}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-bold transition-all relative",
                              step >= s.num
                                ? `bg-gradient-to-br ${s.color} text-white shadow-2xl shadow-${s.color.split('-')[1]}-500/50 scale-110`
                                : "bg-gray-100 text-gray-400 scale-100"
                            )}
                          >
                            {step > s.num ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              >
                                <Check className="w-5 h-5 md:w-7 md:h-7 stroke-[3]" />
                              </motion.div>
                            ) : (
                              <motion.div
                                animate={step === s.num ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                {s.icon}
                              </motion.div>
                            )}
                            {step === s.num && (
                              <motion.div
                                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              />
                            )}
                          </div>
                          <span className={cn(
                            "text-xs md:text-sm font-semibold text-center",
                            step >= s.num ? "text-gray-900" : "text-gray-400"
                          )}>
                            {s.label}
                          </span>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-900 text-white border-0">
                        <p className="font-semibold">Etapa {s.num}: {s.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {index < 2 && (
                    <div className="flex-1 h-1 bg-gray-200 rounded-full mx-2 md:mx-4 overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                           step > s.num ? s.color : "from-gray-300 to-gray-300"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: step > s.num ? "100%" : "0%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="relative">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
              <div className="flex justify-between mt-2 text-xs md:text-sm font-semibold text-gray-600">
                <span>Início</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <Alert className="border-red-300 bg-red-50 shadow-lg shadow-red-500/20">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800 font-bold">Erro ao processar</AlertTitle>
                <AlertDescription className="text-red-700">{submitError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Alert */}
        <AnimatePresence>
          {contractSigned && step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <Alert className="border-green-300 bg-green-50 shadow-lg shadow-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 font-bold">Contrato Assinado!</AlertTitle>
                <AlertDescription className="text-green-700">
                  O contrato foi assinado com sucesso. Prossiga para finalizar o pagamento.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Step 1: Project Information */}
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
                    <User className="w-6 h-6 md:w-8 md:h-8" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl md:text-4xl font-black">
                      Informações do Projeto
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-sm md:text-base mt-1">
                      Preencha os dados para gerar sua proposta personalizada
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
                    Tipo de Serviço
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {[
                      {
                        value: "project",
                        label: "Projeto Único",
                        description: "Desenvolvimento de website ou sistema",
                        icon: <Monitor className="w-6 h-6" />,
                        gradient: "from-blue-500 to-cyan-500"
                      },
                      {
                        value: "maintenance",
                        label: "Plano de Manutenção",
                        description: "Suporte e manutenção mensal",
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
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
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
                    Informações Pessoais
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
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                        className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                            "h-11 md:h-12 text-base pr-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500",
                            !documentValidation.isValid && documentValidation.touched && "border-red-500 focus:border-red-500 focus:ring-red-500"
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

                {/* Project Details */}
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
                          { value: "website", label: "Website", icon: <Globe className="w-5 h-5" />, gradient: "from-green-500 to-emerald-500" },
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
                          <Label htmlFor="budget" className="text-sm md:text-base font-semibold">Orçamento Estimado</Label>
                          <Select
                            value={formData.budget}
                            onValueChange={(value) => handleSelectChange("budget", value)}
                          >
                            <SelectTrigger className="h-11 md:h-12 bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500">
                              <SelectValue placeholder="Selecione uma faixa" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {BUDGET_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div>
                                    <div className="font-semibold text-gray-900">{option.label}</div>
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
                            <SelectTrigger className="h-11 md:h-12 bg-white border-gray-300 hover:border-indigo-400 focus:border-indigo-500 focus:ring-indigo-500">
                              <SelectValue placeholder="Selecione um prazo" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {TIMELINE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    {option.icon}
                                    <span className="text-gray-900">{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="exactBudget" className="text-sm md:text-base font-semibold">
                            Valor Exato do Projeto (Opcional)
                          </Label>
                          <Input
                            id="exactBudget"
                            name="exactBudget"
                            type="number"
                            step="0.01"
                            value={formData.exactBudget}
                            onChange={handleChange}
                            placeholder="Ex: 2750.00"
                            className="h-11 md:h-12 text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <p className="text-xs text-gray-500">
                            Digite um valor específico para um orçamento mais preciso
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 mt-4">
                        <Label className="text-base md:text-lg font-bold text-gray-900">Estrutura de Pagamento</Label>
                        <RadioGroup
                          value={formData.paymentStructure}
                          onValueChange={(value: "50-50" | "40-30-30") =>
                            handleSelectChange("paymentStructure", value)
                          }
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            {[
                              {
                                value: "40-30-30",
                                label: "3 Parcelas",
                                description: "40% entrada + 30% design + 30% entrega",
                                badge: "Recomendado",
                              },
                              {
                                value: "50-50",
                                label: "2 Parcelas",
                                description: "50% entrada + 50% entrega",
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
                                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
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

                      {(formData.budget || formData.exactBudget) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-xl p-4 md:p-6 border-2 border-indigo-200 shadow-lg mt-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                              <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-base md:text-lg text-gray-900 mb-3">
                                Resumo do Investimento
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                  <span className="text-sm md:text-base text-gray-600">
                                    Entrada ({formData.paymentStructure === "40-30-30" ? "40%" : "50%"})
                                  </span>
                                  <span className="font-bold text-base md:text-lg text-gray-900">
                                    R$ {getPaymentBreakdown.entrada.toFixed(2)}
                                  </span>
                                </div>
                                {formData.paymentStructure === "40-30-30" ? (
                                  <>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                      <span className="text-sm md:text-base text-gray-600">Aprovação do Design (30%)</span>
                                      <span className="font-bold text-base md:text-lg text-gray-900">
                                        R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                      <span className="text-sm md:text-base text-gray-600">Entrega Final (30%)</span>
                                      <span className="font-bold text-base md:text-lg text-gray-900">
                                        R$ {getPaymentBreakdown.terceira.toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                    <span className="text-sm md:text-base text-gray-600">Entrega Final (50%)</span>
                                    <span className="font-bold text-base md:text-lg text-gray-900">
                                      R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-3">
                                  <span className="text-lg md:text-xl font-black text-gray-900">Total</span>
                                  <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    R$ {getPaymentBreakdown.total.toFixed(2)}
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

                {/* Maintenance Plans */}
                {formData.serviceType === "maintenance" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg md:text-xl font-bold flex items-center gap-2 text-gray-900">
                      <Shield className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
                      Escolha seu Plano de Manutenção
                    </h3>

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
                                <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                  R$ {plan.price}
                                </span>
                                <span className="text-gray-500 text-sm font-medium">/mês</span>
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
                      <Label htmlFor="siteLink" className="text-sm md:text-base font-semibold">Link do seu site atual (opcional)</Label>
                      <Input
                        id="siteLink"
                        name="siteLink"
                        value={formData.maintenanceDetails.siteLink}
                        onChange={handleMaintenanceDetailsChange}
                        placeholder="https://seusite.com.br"
                        className="h-11 md:h-12 text-base mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                    Descreva seu projeto ou necessidade
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[120px] md:min-h-[140px] resize-none text-base border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder={
                      formData.serviceType === "project"
                        ? "Descreva os objetivos, funcionalidades desejadas e referências..."
                        : "Descreva seu site/sistema atual e suas necessidades de manutenção..."
                    }
                  />
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
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl shadow-indigo-500/50 h-12 md:h-14 px-8 font-bold text-base order-1 sm:order-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Continuar
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Contract Terms */}
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
                      Revise e aceite os termos para prosseguir
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
                            ? "website institucional"
                            : "sistema personalizado"}{" "}
                          conforme especificações acordadas, com valor total de{" "}
                          <strong className="text-green-600">R$ {getPaymentBreakdown.total.toFixed(2)}</strong>.
                        </>
                      ) : (
                        <>
                          Prestação de serviços de manutenção e suporte no Plano{" "}
                          <strong className="text-indigo-600">
                            {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.name}
                          </strong>
                          , com mensalidade de{" "}
                          <strong className="text-green-600">
                            R${" "}
                            {MAINTENANCE_PLANS.find(
                              (p) => p.id === formData.maintenancePlan
                            )?.price.toFixed(2)}
                          </strong>
                          .
                        </>
                      )}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">2. FORMA DE PAGAMENTO</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project" ? (
                        <>
                          O pagamento será realizado em{" "}
                          {formData.paymentStructure === "40-30-30" ? "3 parcelas" : "2 parcelas"}:
                          <ul className="mt-2 space-y-1">
                            <li>
                              <strong>Entrada:</strong> R$ {getPaymentBreakdown.entrada.toFixed(2)}{" "}
                              ({formData.paymentStructure === "40-30-30" ? "40%" : "50%"})
                            </li>
                            {formData.paymentStructure === "40-30-30" ? (
                              <>
                                <li>
                                  <strong>Aprovação do Design:</strong> R${" "}
                                  {getPaymentBreakdown.segunda.toFixed(2)} (30%)
                                </li>
                                <li>
                                  <strong>Entrega Final:</strong> R${" "}
                                  {getPaymentBreakdown.terceira.toFixed(2)} (30%)
                                </li>
                              </>
                            ) : (
                              <li>
                                <strong>Entrega Final:</strong> R${" "}
                                {getPaymentBreakdown.segunda.toFixed(2)} (50%)
                              </li>
                            )}
                          </ul>
                        </>
                      ) : (
                        <>
                          Pagamento mensal de{" "}
                          <strong className="text-green-600">
                            R${" "}
                            {MAINTENANCE_PLANS.find(
                              (p) => p.id === formData.maintenancePlan
                            )?.price.toFixed(2)}
                          </strong>{" "}
                          com vencimento todo dia 10.
                        </>
                      )}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">3. PRAZO DE ENTREGA</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project"
                        ? `O prazo estimado para conclusão é de ${TIMELINE_OPTIONS.find(t => t.value === formData.timeline)?.label || "a definir"}.`
                        : "Serviço contínuo com renovação mensal automática."}
                    </p>

                    <h4 className="font-black mt-4 text-gray-900">4. DIREITOS E OBRIGAÇÕES</h4>
                    <ul className="space-y-1 text-sm md:text-base">
                      <li>
                        A CONTRATADA se compromete a entregar o serviço conforme especificado
                      </li>
                      <li>O CONTRATANTE deve fornecer informações necessárias para execução</li>
                      <li>Atrasos no pagamento podem suspender os serviços</li>
                    </ul>

                    <h4 className="font-black mt-4 text-gray-900">5. POLÍTICA DE CANCELAMENTO</h4>
                    <p className="text-sm md:text-base">
                      {formData.serviceType === "project"
                        ? "Em caso de cancelamento, valores já pagos não serão reembolsados."
                        : "O cancelamento deve ser solicitado com 30 dias de antecedência."}
                    </p>
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
                        Li e aceito os termos do contrato
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Ao aceitar, você concorda com todos os termos e condições descritos acima.
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
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl shadow-indigo-500/50 h-12 md:h-14 px-8 font-bold text-base"
                    >
                      Assinar Contrato
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <Card className="border-0 shadow-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
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
                        Finalizar Pagamento
                      </CardTitle>
                      <CardDescription className="text-purple-100 text-sm md:text-base mt-1">
                        Escolha a forma de pagamento para começarmos seu projeto
                      </CardDescription>
                    </div>
                  </div>
                  {/* NOVO: Badge do contador de urgência */}
                  {timeLeft > 0 ? (
                     <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                        <Badge
                        variant="destructive"
                        className="text-base md:text-lg px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 border-0 shadow-lg"
                        >
                        <Clock className="w-5 h-5 mr-2 animate-pulse" />
                        Expira em: {formatTime(timeLeft)}
                        </Badge>
                     </motion.div>
                  ) : (
                    <Badge variant="secondary" className="text-base">Oferta Expirada</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 md:p-8 space-y-6">
                {/* Payment Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border-2 border-green-200 shadow-lg"
                >
                  <h3 className="text-lg md:text-xl font-black mb-4 flex items-center gap-2 text-gray-900">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    Resumo do Pagamento
                  </h3>

                  {formData.serviceType === "project" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <Card className="border-2 border-green-400 bg-white shadow-xl">
                          <CardHeader className="pb-3">
                            <Badge className="w-fit bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                              <Zap className="w-3 h-3 mr-1" />
                              Hoje
                            </Badge>
                            <CardTitle className="text-base md:text-lg mt-2 font-bold">1ª Parcela</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              R$ {getPaymentBreakdown.entrada.toFixed(2)}
                            </p>
                            <p className="text-xs md:text-sm text-gray-500 mt-1 font-semibold">
                              {formData.paymentStructure === "40-30-30" ? "40%" : "50%"} do total
                            </p>
                          </CardContent>
                        </Card>

                        {formData.paymentStructure === "40-30-30" ? (
                          <>
                            <Card className="border-2 border-gray-200 bg-white/60 opacity-70">
                              <CardHeader className="pb-3">
                                <Badge variant="outline" className="w-fit">Futuro</Badge>
                                <CardTitle className="text-base md:text-lg mt-2 font-bold">2ª Parcela</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl md:text-3xl font-bold text-gray-400">
                                  R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                </p>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">Na aprovação</p>
                              </CardContent>
                            </Card>
                            <Card className="border-2 border-gray-200 bg-white/60 opacity-70">
                              <CardHeader className="pb-3">
                                <Badge variant="outline" className="w-fit">Futuro</Badge>
                                <CardTitle className="text-base md:text-lg mt-2 font-bold">3ª Parcela</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl md:text-3xl font-bold text-gray-400">
                                  R$ {getPaymentBreakdown.terceira.toFixed(2)}
                                </p>
                                <p className="text-xs md:text-sm text-gray-400 mt-1">Na entrega</p>
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <Card className="border-2 border-gray-200 bg-white/60 opacity-70 md:col-span-2">
                            <CardHeader className="pb-3">
                              <Badge variant="outline" className="w-fit">Futuro</Badge>
                              <CardTitle className="text-base md:text-lg mt-2 font-bold">2ª Parcela</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl md:text-3xl font-bold text-gray-400">
                                R$ {getPaymentBreakdown.segunda.toFixed(2)}
                              </p>
                              <p className="text-xs md:text-sm text-gray-400 mt-1">Na entrega final</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <Alert className="border-blue-300 bg-blue-50 shadow-lg">
                        <Info className="h-5 w-5 text-blue-600" />
                        <AlertTitle className="font-bold text-blue-900">Informação Importante</AlertTitle>
                        <AlertDescription className="text-blue-800">
                          Você está pagando apenas a primeira parcela agora. As demais parcelas
                          serão cobradas conforme o andamento do projeto.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <Card className="border-2 border-green-400 bg-white shadow-xl">
                      <CardHeader>
                        <CardTitle className="text-lg md:text-xl font-bold">
                          Plano {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          R$ {getPaymentBreakdown.total.toFixed(2)}
                          <span className="text-base font-normal text-gray-500">/mês</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2 font-semibold">
                          Renovação automática mensal
                        </p>
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
                  <h3 className="text-lg md:text-xl font-black text-gray-900">Forma de Pagamento</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      {[
                        {
                          value: "pix",
                          label: "PIX",
                          description: "Pagamento instantâneo com QR Code",
                          icon: <Zap className="w-5 h-5" />,
                          recommended: true,
                          gradient: "from-green-500 to-emerald-500"
                        },
                        {
                          value: "credit-card",
                          label: "Cartão de Crédito",
                          description: formData.serviceType === "project"
                            ? "Parcele em até 3x sem juros"
                            : "Cobrança recorrente automática",
                          icon: <CreditCard className="w-5 h-5" />,
                          gradient: "from-blue-500 to-cyan-500"
                        },
                        {
                          value: "boleto",
                          label: "Boleto Bancário",
                          description: "Vencimento em 3 dias úteis",
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
                              "hover:border-indigo-300 hover:shadow-xl hover:scale-[1.01]",
                              "peer-data-[state=checked]:border-indigo-600",
                              "peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-indigo-50 peer-data-[state=checked]:to-purple-50",
                              "peer-data-[state=checked]:shadow-2xl peer-data-[state=checked]:shadow-indigo-500/30"
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
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-base md:text-lg text-gray-900">{method.label}</span>
                                {method.recommended && (
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg text-xs">
                                    <Star className="w-3 h-3 mr-1" />
                                    Recomendado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                            </div>
                            {paymentMethod === method.value && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                              </motion.div>
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
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 border-2 border-gray-200 shadow-lg"
                    >
                      {paymentMethod === "pix" && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-900">
                            <Zap className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            Pagamento via PIX
                          </h4>
                          <PixQRCode
                            paymentId={formData.paymentId}
                            amount={getPaymentBreakdown.entrada}
                          />
                        </div>
                      )}

                      {paymentMethod === "credit-card" && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-900">
                            <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            Dados do Cartão
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="md:col-span-2">
                              <Label htmlFor="card-number" className="font-semibold">Número do Cartão</Label>
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                className="h-11 md:h-12 text-base mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="card-name" className="font-semibold">Nome no Cartão</Label>
                              <Input
                                id="card-name"
                                placeholder="NOME COMPLETO"
                                className="h-11 md:h-12 text-base mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="expiry" className="font-semibold">Validade</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/AA"
                                className="h-11 md:h-12 text-base mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <Label htmlFor="cvv" className="font-semibold">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                className="h-11 md:h-12 text-base mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                              />
                            </div>
                            {formData.serviceType === "project" && (
                              <div className="md:col-span-2">
                                <Label htmlFor="installments" className="font-semibold">Parcelamento</Label>
                                <Select defaultValue="1">
                                  <SelectTrigger className="h-11 md:h-12 mt-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">
                                      À vista - R$ {getPaymentBreakdown.entrada.toFixed(2)}
                                    </SelectItem>
                                    <SelectItem value="2">
                                      2x de R$ {(getPaymentBreakdown.entrada / 2).toFixed(2)}
                                    </SelectItem>
                                    <SelectItem value="3">
                                      3x de R$ {(getPaymentBreakdown.entrada / 3).toFixed(2)}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {paymentMethod === "boleto" && (
                        <div className="space-y-4">
                          <h4 className="font-bold text-lg md:text-xl flex items-center gap-2 text-gray-900">
                            <FileText className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                            Boleto Bancário
                          </h4>
                          <BoletoPayment
                            paymentId={formData.paymentId}
                            amount={getPaymentBreakdown.entrada}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>

              <CardFooter className="bg-gray-50 p-4 md:p-6 flex-col sm:flex-row gap-3">
                <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={paymentProcessing}
                    size="lg"
                    className="w-full sm:w-auto border-2 h-12 md:h-14 px-6 font-bold order-2 sm:order-1"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </Button>
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                    <span className="text-sm text-gray-500 font-medium">Etapa 3 de 3</span>
                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={!isStep3Valid || paymentProcessing || timeLeft <= 0}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-xl shadow-green-500/50 h-12 md:h-14 px-6 md:px-8 font-bold text-sm md:text-base"
                    >
                      {paymentProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-5 w-5" />
                          <span className="hidden sm:inline">Confirmar Pagamento</span>
                          <span className="sm:hidden">Pagar</span>
                          <span className="ml-1">R$ {getPaymentBreakdown.entrada.toFixed(2)}</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}
        </motion.div>

        {/* Trust Section - Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-8 md:mt-12"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-200 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Pagamento Seguro</p>
                  <p className="text-xs text-gray-600">Criptografia SSL</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Dados Protegidos</p>
                  <p className="text-xs text-gray-600">LGPD Compliance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Garantia Total</p>
                  <p className="text-xs text-gray-600">Satisfação 100%</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-indigo-500::-webkit-scrollbar-thumb {
          background-color: #6366f1;
          border-radius: 3px;
        }
        .scrollbar-track-gray-200::-webkit-scrollbar-track {
          background-color: #e5e7eb;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}