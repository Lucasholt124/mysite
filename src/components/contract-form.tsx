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
} from "../components/ui/tooltip"
import { Progress } from "../components/ui/progress"
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

  // Função corrigida para calcular valores reais
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
    return (step / 3) * 100
  }, [step])

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

  // --- Funções de Submissão CORRIGIDAS ---
  const submitContractData = async () => {
    try {
      setSubmitting(true)
      setSubmitError("")

      if (!isStep1Valid) {
        setSubmitError("Por favor, preencha todos os campos obrigatórios corretamente.")
        setSubmitting(false)
        return false
      }

      // Valores corretos calculados
      const realValue = getPaymentBreakdown.total
      const firstPaymentValue = getPaymentBreakdown.entrada

      console.log('Enviando valores:', {
        total: realValue,
        entrada: firstPaymentValue,
        serviceType: formData.serviceType
      })

      const contractPayload = {
        ...formData,
        totalAmount: realValue, // Valor real total
        firstPayment: firstPaymentValue, // Valor real da entrada
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

      // Valor correto da entrada/mensalidade
      const paymentValue = getPaymentBreakdown.entrada

      console.log('Processando pagamento:', {
        valor: paymentValue,
        metodo: paymentMethod,
        serviceType: formData.serviceType
      })

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          paymentId: formData.paymentId,
          amount: paymentValue, // Valor real correto
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-all hover:gap-3 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a página inicial
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Processo Seguro e Transparente
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Contrato de Serviços Digitais
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete o formulário abaixo para iniciar seu projeto com total segurança e transparência
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto mb-10"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              {[
                { num: 1, label: "Informações", icon: <User className="w-4 h-4" /> },
                { num: 2, label: "Contrato", icon: <FileText className="w-4 h-4" /> },
                { num: 3, label: "Pagamento", icon: <CreditCard className="w-4 h-4" /> },
              ].map((s, index) => (
                <React.Fragment key={s.num}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "flex flex-col items-center gap-2 cursor-pointer transition-all",
                            step >= s.num ? "opacity-100" : "opacity-50"
                          )}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold transition-all",
                              step >= s.num
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-110"
                                : "bg-gray-200 text-gray-500"
                            )}
                          >
                            {step > s.num ? (
                              <Check className="w-5 h-5 md:w-6 md:h-6" />
                            ) : (
                              s.icon
                            )}
                          </div>
                          <span className={cn(
                            "text-xs md:text-sm font-medium hidden md:block",
                            step >= s.num ? "text-purple-600" : "text-gray-400"
                          )}>
                            {s.label}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Etapa {s.num}: {s.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {index < 2 && (
                    <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                      <div
                        className={cn(
                          "h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500",
                          step > s.num ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Progress value={progressPercentage} className="h-2" />
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
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <AlertTitle className="text-red-800">Erro ao processar</AlertTitle>
                <AlertDescription className="text-red-700">{submitError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Alert */}
        <AnimatePresence>
          {contractSigned && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-6"
            >
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800">Contrato Assinado!</AlertTitle>
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
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <User className="w-6 h-6" />
                  </div>
                  Informações do Projeto
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Preencha os dados para gerar sua proposta personalizada
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-8">
                {/* Service Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Tipo de Serviço
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        value: "project",
                        label: "Projeto Único",
                        description: "Desenvolvimento de website ou sistema",
                        icon: <Monitor className="w-6 h-6" />,
                      },
                      {
                        value: "maintenance",
                        label: "Plano de Manutenção",
                        description: "Suporte e manutenção mensal",
                        icon: <Shield className="w-6 h-6" />,
                      },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleSelectChange("serviceType", type.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all text-left",
                          formData.serviceType === type.value
                            ? "border-purple-600 bg-purple-50 shadow-lg scale-[1.02]"
                            : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            formData.serviceType === type.value
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{type.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Informações Pessoais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-1">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="h-11"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1">
                        <Mail className="w-4 h-4" /> Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-11"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1">
                        <Phone className="w-4 h-4" /> Telefone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="h-11"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="flex items-center gap-1">
                        <Building className="w-4 h-4" /> Empresa
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="h-11"
                        placeholder="Nome da empresa (opcional)"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF/CNPJ</Label>
                    <div className="relative">
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleChange}
                        onBlur={() => validateDocument(formData.cpf)}
                        placeholder="000.000.000-00 ou 00.000.000/0001-00"
                        className={cn(
                          "h-11 pr-10",
                          !documentValidation.isValid && documentValidation.touched && "border-red-500"
                        )}
                      />
                      {formData.cpf && documentValidation.touched && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {documentValidation.isValid ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {!documentValidation.isValid && documentValidation.touched && (
                      <p className="text-sm text-red-500">{documentValidation.message}</p>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                {formData.serviceType === "project" && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Cog className="w-5 h-5 text-purple-600" />
                        Detalhes do Projeto
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { value: "website", label: "Website", icon: <Globe className="w-5 h-5" /> },
                          { value: "system", label: "Sistema/App", icon: <Smartphone className="w-5 h-5" /> },
                        ].map((type) => (
                          <button
                            key={type.value}
                            onClick={() => handleSelectChange("projectType", type.value)}
                            className={cn(
                              "p-4 rounded-xl border-2 transition-all",
                              formData.projectType === type.value
                                ? "border-purple-600 bg-purple-50 shadow-lg"
                                : "border-gray-200 hover:border-purple-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                formData.projectType === type.value
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-100 text-gray-600"
                              )}>
                                {type.icon}
                              </div>
                              <span className="font-semibold">{type.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border-2 border-purple-200 bg-white shadow-sm">
  <div className="space-y-2">
    <Label htmlFor="budget">Orçamento Estimado</Label>
    <Select
      value={formData.budget}
      onValueChange={(value) => handleSelectChange("budget", value)}
    >
                             <SelectTrigger className="h-11 bg-white border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500">
        <SelectValue placeholder="Selecione uma faixa" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        {BUDGET_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div>
              <div className="font-medium text-gray-900">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </div>
          </SelectItem>
        ))}
                            </SelectContent>
                          </Select>
                        </div>

                         <div className="space-y-2">
    <Label htmlFor="timeline">Prazo Desejado</Label>
    <Select
      value={formData.timeline}
      onValueChange={(value) => handleSelectChange("timeline", value)}
    >
                           <SelectTrigger className="h-11 bg-white border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-purple-500">
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
                          <Label htmlFor="exactBudget">
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
                            className="h-11"
                          />
                          <p className="text-xs text-gray-500">
                            Digite um valor específico para um orçamento mais preciso
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-base font-semibold">Estrutura de Pagamento</Label>
                        <RadioGroup
                          value={formData.paymentStructure}
                          onValueChange={(value: "50-50" | "40-30-30") =>
                            handleSelectChange("paymentStructure", value)
                          }
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    "hover:border-purple-300 hover:shadow-md",
                                    "peer-data-[state=checked]:border-purple-600",
                                    "peer-data-[state=checked]:bg-purple-50",
                                    "peer-data-[state=checked]:shadow-lg"
                                  )}
                                >
                                  {option.badge && (
                                    <Badge className="absolute -top-2 -right-2 bg-purple-600">
                                      {option.badge}
                                    </Badge>
                                  )}
                                  <div className="font-semibold">{option.label}</div>
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
                          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-600 text-white rounded-lg">
                              <DollarSign className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Resumo do Investimento
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center py-2 border-b border-purple-200">
                                  <span className="text-gray-600">
                                    Entrada ({formData.paymentStructure === "40-30-30" ? "40%" : "50%"})
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    R$ {getPaymentBreakdown.entrada.toFixed(2)}
                                  </span>
                                </div>
                                {formData.paymentStructure === "40-30-30" ? (
                                  <>
                                    <div className="flex justify-between items-center py-2 border-b border-purple-200">
                                      <span className="text-gray-600">Aprovação do Design (30%)</span>
                                      <span className="font-semibold text-gray-900">
                                        R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-purple-200">
                                      <span className="text-gray-600">Entrega Final (30%)</span>
                                      <span className="font-semibold text-gray-900">
                                        R$ {getPaymentBreakdown.terceira.toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex justify-between items-center py-2 border-b border-purple-200">
                                    <span className="text-gray-600">Entrega Final (50%)</span>
                                    <span className="font-semibold text-gray-900">
                                      R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-3">
                                  <span className="text-lg font-bold text-gray-900">Total</span>
                                  <span className="text-xl font-bold text-purple-600">
                                    R$ {getPaymentBreakdown.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}

                {/* Maintenance Plans */}
                {formData.serviceType === "maintenance" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Escolha seu Plano de Manutenção
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {MAINTENANCE_PLANS.map((plan) => (
                        <motion.div
                          key={plan.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={cn(
                              "cursor-pointer transition-all h-full relative",
                              formData.maintenancePlan === plan.id
                                ? "border-2 border-purple-600 shadow-xl"
                                : "border-gray-200 hover:border-purple-300 hover:shadow-lg"
                            )}
                            onClick={() => handleSelectChange("maintenancePlan", plan.id)}
                          >
                            {plan.badge && (
                              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600">
                                {plan.badge}
                              </Badge>
                            )}
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className={cn(
                                  "p-2 rounded-lg",
                                  formData.maintenancePlan === plan.id
                                    ? "bg-purple-600 text-white"
                                    : "bg-gray-100 text-gray-600"
                                )}>
                                  {plan.icon}
                                </div>
                                {formData.maintenancePlan === plan.id && (
                                  <CheckCircle className="w-5 h-5 text-purple-600" />
                                )}
                              </div>
                              <CardTitle className="text-lg">{plan.name}</CardTitle>
                              <div className="mt-2">
                                <span className="text-3xl font-bold text-purple-600">
                                  R$ {plan.price}
                                </span>
                                <span className="text-gray-500 text-sm">/mês</span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                      <Label htmlFor="siteLink">Link do seu site atual (opcional)</Label>
                      <Input
                        id="siteLink"
                        name="siteLink"
                        value={formData.maintenanceDetails.siteLink}
                        onChange={handleMaintenanceDetailsChange}
                        placeholder="https://seusite.com.br"
                        className="h-11"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Descreva seu projeto ou necessidade
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[120px] resize-none"
                    placeholder={
                      formData.serviceType === "project"
                        ? "Descreva os objetivos, funcionalidades desejadas e referências..."
                        : "Descreva seu site/sistema atual e suas necessidades de manutenção..."
                    }
                  />
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 rounded-b-lg p-6">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Etapa 1 de 3
                  </div>
                  <Button
                    onClick={nextStep}
                    disabled={submitting || !isStep1Valid}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <FileText className="w-6 h-6" />
                  </div>
                  Termos do Contrato
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Revise e aceite os termos para prosseguir
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 md:p-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <h3 className="text-xl font-semibold">
                      Contrato de Prestação de Serviços
                    </h3>
                  </div>

                  <div className="prose prose-sm max-w-none text-gray-700 max-h-[400px] overflow-y-auto pr-4">
                    <h4 className="font-bold">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS</h4>
                    <p>
                      Entre <strong>Impulsioneweb</strong> (CONTRATADA) e{" "}
                      <strong>{formData.name || "[Nome do Cliente]"}</strong> (CONTRATANTE)
                    </p>

                    <h4 className="font-bold mt-4">1. OBJETO DO CONTRATO</h4>
                    <p>
                      {formData.serviceType === "project" ? (
                        <>
                          Desenvolvimento de{" "}
                          {formData.projectType === "website"
                            ? "website institucional"
                            : "sistema personalizado"}{" "}
                          conforme especificações acordadas, com valor total de{" "}
                          <strong>R$ {getPaymentBreakdown.total.toFixed(2)}</strong>.
                        </>
                      ) : (
                        <>
                          Prestação de serviços de manutenção e suporte no Plano{" "}
                          <strong>
                            {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.name}
                          </strong>
                          , com mensalidade de{" "}
                          <strong>
                            R${" "}
                            {MAINTENANCE_PLANS.find(
                              (p) => p.id === formData.maintenancePlan
                            )?.price.toFixed(2)}
                          </strong>
                          .
                        </>
                      )}
                    </p>

                    <h4 className="font-bold mt-4">2. FORMA DE PAGAMENTO</h4>
                    <p>
                      {formData.serviceType === "project" ? (
                        <>
                          O pagamento será realizado em{" "}
                          {formData.paymentStructure === "40-30-30" ? "3 parcelas" : "2 parcelas"}:
                          <ul className="mt-2">
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
                          <strong>
                            R${" "}
                            {MAINTENANCE_PLANS.find(
                              (p) => p.id === formData.maintenancePlan
                            )?.price.toFixed(2)}
                          </strong>{" "}
                          com vencimento todo dia 10.
                        </>
                      )}
                    </p>

                    <h4 className="font-bold mt-4">3. PRAZO DE ENTREGA</h4>
                    <p>
                      {formData.serviceType === "project"
                        ? `O prazo estimado para conclusão é de ${formData.timeline || "a definir"}.`
                        : "Serviço contínuo com renovação mensal automática."}
                    </p>

                    <h4 className="font-bold mt-4">4. DIREITOS E OBRIGAÇÕES</h4>
                    <ul>
                      <li>
                        A CONTRATADA se compromete a entregar o serviço conforme especificado
                      </li>
                      <li>O CONTRATANTE deve fornecer informações necessárias para execução</li>
                      <li>Atrasos no pagamento podem suspender os serviços</li>
                    </ul>

                    <h4 className="font-bold mt-4">5. POLÍTICA DE CANCELAMENTO</h4>
                    <p>
                      {formData.serviceType === "project"
                        ? "Em caso de cancelamento, valores já pagos não serão reembolsados."
                        : "O cancelamento deve ser solicitado com 30 dias de antecedência."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.termsAccepted}
                      onCheckedChange={handleCheckboxChange}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="cursor-pointer">
                      <div className="font-semibold text-gray-900">
                        Li e aceito os termos do contrato
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Ao aceitar, você concorda com todos os termos e condições descritos acima.
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50 rounded-b-lg p-6">
                <div className="w-full flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </Button>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Etapa 2 de 3</span>
                    <Button
                      onClick={handleSignContract}
                      disabled={!formData.termsAccepted}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  Finalizar Pagamento
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Escolha a forma de pagamento para começarmos seu projeto
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 md:p-8 space-y-6">
                {/* Payment Summary */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Resumo do Pagamento
                  </h3>

                  {formData.serviceType === "project" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-purple-300 bg-white">
                          <CardHeader className="pb-3">
                            <Badge className="w-fit bg-purple-600">Hoje</Badge>
                            <CardTitle className="text-lg mt-2">1ª Parcela</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold text-purple-600">
                              R$ {getPaymentBreakdown.entrada.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formData.paymentStructure === "40-30-30" ? "40%" : "50%"} do total
                            </p>
                          </CardContent>
                        </Card>

                        {formData.paymentStructure === "40-30-30" ? (
                          <>
                            <Card className="border-gray-200 bg-white/50 opacity-75">
                              <CardHeader className="pb-3">
                                <Badge variant="outline">Futuro</Badge>
                                <CardTitle className="text-lg mt-2">2ª Parcela</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl font-semibold text-gray-400">
                                  R$ {getPaymentBreakdown.segunda.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">Na aprovação</p>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white/50 opacity-75">
                              <CardHeader className="pb-3">
                                <Badge variant="outline">Futuro</Badge>
                                <CardTitle className="text-lg mt-2">3ª Parcela</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-2xl font-semibold text-gray-400">
                                  R$ {getPaymentBreakdown.terceira.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">Na entrega</p>
                              </CardContent>
                            </Card>
                          </>
                        ) : (
                          <Card className="border-gray-200 bg-white/50 opacity-75 md:col-span-2">
                            <CardHeader className="pb-3">
                              <Badge variant="outline">Futuro</Badge>
                              <CardTitle className="text-lg mt-2">2ª Parcela</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-2xl font-semibold text-gray-400">
                                R$ {getPaymentBreakdown.segunda.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-400 mt-1">Na entrega final</p>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-5 w-5 text-blue-600" />
                        <AlertTitle>Informação Importante</AlertTitle>
                        <AlertDescription>
                          Você está pagando apenas a primeira parcela agora. As demais parcelas
                          serão cobradas conforme o andamento do projeto.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <Card className="border-purple-300 bg-white">
                      <CardHeader>
                        <CardTitle>
                          Plano {MAINTENANCE_PLANS.find((p) => p.id === formData.maintenancePlan)?.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-purple-600">
                          R$ {getPaymentBreakdown.total.toFixed(2)}
                          <span className="text-base font-normal text-gray-500">/mês</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Renovação automática mensal
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Forma de Pagamento</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="grid grid-cols-1 gap-4">
                      {[
                        {
                          value: "pix",
                          label: "PIX",
                          description: "Pagamento instantâneo com QR Code",
                          icon: <Zap className="w-5 h-5" />,
                          recommended: true,
                        },
                        {
                          value: "credit-card",
                          label: "Cartão de Crédito",
                          description: formData.serviceType === "project"
                            ? "Parcele em até 3x sem juros"
                            : "Cobrança recorrente automática",
                          icon: <CreditCard className="w-5 h-5" />,
                        },
                        {
                          value: "boleto",
                          label: "Boleto Bancário",
                          description: "Vencimento em 3 dias úteis",
                          icon: <FileText className="w-5 h-5" />,
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
                              "flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all",
                              "hover:border-purple-300 hover:shadow-md",
                              "peer-data-[state=checked]:border-purple-600",
                              "peer-data-[state=checked]:bg-purple-50",
                              "peer-data-[state=checked]:shadow-lg"
                            )}
                          >
                            <div className="p-2 bg-gray-100 rounded-lg peer-data-[state=checked]:bg-purple-600 peer-data-[state=checked]:text-white">
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{method.label}</span>
                                {method.recommended && (
                                  <Badge className="bg-green-500">Recomendado</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Payment Details */}
                <AnimatePresence>
                  {paymentMethod && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      {paymentMethod === "pix" && (
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
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
                          <h4 className="font-semibold flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                            Dados do Cartão
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <Label htmlFor="card-number">Número do Cartão</Label>
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                className="h-11"
                              />
                            </div>
                            <div>
                              <Label htmlFor="card-name">Nome no Cartão</Label>
                              <Input
                                id="card-name"
                                placeholder="NOME COMPLETO"
                                className="h-11"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry">Validade</Label>
                                <Input
                                  id="expiry"
                                  placeholder="MM/AA"
                                  className="h-11"
                                />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  placeholder="123"
                                  className="h-11"
                                />
                              </div>
                            </div>
                            {formData.serviceType === "project" && (
                              <div className="md:col-span-2">
                                <Label htmlFor="installments">Parcelamento</Label>
                                <Select defaultValue="1">
                                  <SelectTrigger className="h-11">
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
                          <h4 className="font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
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

              <CardFooter className="bg-gray-50 rounded-b-lg p-6">
                <div className="w-full flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={paymentProcessing}
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Voltar
                  </Button>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Etapa 3 de 3</span>
                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={!isStep3Valid || paymentProcessing}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {paymentProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-5 w-5" />
                          Confirmar Pagamento de R$ {getPaymentBreakdown.entrada.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}