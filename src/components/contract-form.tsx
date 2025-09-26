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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import PixQRCode from "@/components/pix-qrcode"
import BoletoPayment from "@/components/boleto-payment"
import MaintenancePlanCard from "@/components/maintenance-plan-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatDocument,
  isValidDocument,
  getDocumentType,
} from "@/utils/document-validator"

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
}

// --- Dados de Configuração ---
const MAINTENANCE_PLANS: MaintenancePlan[] = [
  {
    id: "basic",
    name: "Básico",
    price: 100,
    features: [
      "Backup diário",
      "Monitoramento básico",
      "Suporte por email",
      "Atualizações de segurança",
    ],
    recommended: false,
  },
  {
    id: "intermediate",
    name: "Intermediário",
    price: 250,
    features: [
      "Backup diário",
      "Monitoramento avançado",
      "Suporte por email e telefone",
      "Atualizações de segurança",
      "Pequenas alterações de conteúdo",
    ],
    recommended: true,
  },
  {
    id: "advanced",
    name: "Avançado",
    price: 500,
    features: [
      "Backup diário",
      "Monitoramento em tempo real",
      "Suporte prioritário",
      "Atualizações de segurança",
      "Alterações de conteúdo ilimitadas",
      "Relatórios mensais de desempenho",
    ],
    recommended: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 1000,
    features: [
      "Backup diário",
      "Monitoramento em tempo real",
      "Suporte prioritário 24/7",
      "Atualizações de segurança",
      "Alterações de conteúdo ilimitadas",
      "Relatórios semanais de desempenho",
      "Desenvolvimento de novas funcionalidades",
      "Consultoria técnica especializada",
    ],
    recommended: false,
  },
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

  // --- Funções de Validação e Lógica de Negócio ---
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

  const getPaymentBreakdown = useMemo(() => {
    let total = 0
    if (formData.exactBudget) {
      total = parseFloat(formData.exactBudget)
    } else {
      switch (formData.budget) {
        case "1000-1500":
          total = 1250
          break
        case "1500-2500":
          total = 2000
          break
        case "2500-3500":
          total = 3000
          break
        case "3500-5000":
          total = 4250
          break
        case "5000+":
          total = 5000
          break
        default:
          total = 1500
      }
    }

    if (formData.paymentStructure === "40-30-30") {
      return {
        entrada: total * 0.4,
        segunda: total * 0.3,
        terceira: total * 0.3,
        total: total,
      }
    } else {
      return {
        entrada: total * 0.5,
        segunda: total * 0.5,
        terceira: 0,
        total: total,
      }
    }
  }, [formData.exactBudget, formData.budget, formData.paymentStructure])

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

  // --- Funções de Manipulação de Estado ---
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

      const contractPayload = {
        ...formData,
        totalAmount: formData.serviceType === "project" ? getPaymentBreakdown.total : MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.price,
        firstPayment: formData.serviceType === "project" ? getPaymentBreakdown.entrada : MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.price,
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
      return false;
    } finally {
      setSubmitting(false)
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

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      setSubmitError("Por favor, selecione um método de pagamento.")
      return
    }
    try {
      setPaymentProcessing(true)
      setSubmitError("")
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          paymentId: formData.paymentId,
          amount: formData.serviceType === "project"
            ? getPaymentBreakdown.entrada
            : MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.price,
          serviceType: formData.serviceType,
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

  // --- Renderização do Componente ---
  return (
    <div className="container mx-auto min-h-screen px-4 py-12 bg-gray-50">
      <Link
        href="/"
        className="mb-8 inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
      </Link>

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
          Contrato de Serviços Digitais
        </h1>
        <p className="text-lg text-gray-600">
          Preencha as informações abaixo para solicitar sua proposta personalizada.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10 flex justify-center">
        <div className="flex w-full max-w-3xl items-center">
          {[1, 2, 3].map((s, index) => (
            <React.Fragment key={s}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  step >= s
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-200 text-gray-600"
                } transition-all duration-300`}
              >
                {s}
              </div>
              {index < 2 && (
                <div
                  className={`h-1 flex-1 ${
                    step > s ? "bg-purple-600" : "bg-gray-200"
                  } transition-colors duration-300`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl"
          >
            <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {contractSigned && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl"
          >
            <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
              <Check className="h-4 w-4" />
              <AlertTitle>Contrato Assinado!</AlertTitle>
              <AlertDescription>
                O contrato foi assinado com sucesso. Prossiga para o pagamento.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-3xl"
      >
        {/* --- Passo 1: Informações do Projeto --- */}
        {step === 1 && (
          <Card className="w-full bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Informações do Projeto</CardTitle>
              <CardDescription>
                Informe seus dados e detalhes do serviço desejado para gerar sua proposta.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="mb-6">
                <Label className="text-lg font-semibold">Tipo de Serviço</Label>
                <Tabs
                  value={formData.serviceType}
                  onValueChange={(value) => handleSelectChange("serviceType", value)}
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg shadow-inner">
                    <TabsTrigger
                      value="project"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-colors py-2 text-center font-semibold text-gray-700"
                    >
                      Projeto Único
                    </TabsTrigger>
                    <TabsTrigger
                      value="maintenance"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-colors py-2 text-center font-semibold text-gray-700"
                    >
                      Plano de Manutenção
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
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
                    className={`pr-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black ${!documentValidation.isValid && documentValidation.touched ? "border-red-500" : ""}`}
                  />
                  {formData.cpf && documentValidation.touched && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {documentValidation.isValid ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {!documentValidation.isValid && documentValidation.touched && (
                  <p className="mt-1 text-sm text-red-500">{documentValidation.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Digite apenas os números ou com a formatação padrão.
                </p>
              </div>

              {formData.serviceType === "project" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Tipo de Projeto <span className="text-red-500">*</span></Label>
                    <RadioGroup
                      value={formData.projectType}
                      onValueChange={(value: string) => handleSelectChange("projectType", value)}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                    >
                      <Label htmlFor="website" className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="website" id="website" className="border-purple-600 text-white data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                        <Globe className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Website</span>
                      </Label>
                      <Label htmlFor="system" className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="system" id="system" className="border-purple-600 text-white data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                        <Cog className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Sistema/Aplicativo</span>
                      </Label>
                    </RadioGroup>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-sm">
  <div className="space-y-2">
    <Label htmlFor="budget">Orçamento Estimado</Label>
    <Select onValueChange={(value: string) => handleSelectChange("budget", value)}>
      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black">
        <SelectValue placeholder="Selecione uma faixa" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="1000-1500">R$ 1.000 - R$ 1.500 (Landing Page ou Site Institucional)</SelectItem>
        <SelectItem value="1500-2500">R$ 1.500 - R$ 2.500 (Website com funcionalidades básicas)</SelectItem>
        <SelectItem value="2500-3500">R$ 2.500 - R$ 3.500 (E-commerce ou Sistema Simples)</SelectItem>
        <SelectItem value="3500-5000">R$ 3.500 - R$ 5.000 (Aplicativo ou Sistema Médio)</SelectItem>
        <SelectItem value="5000+">Acima de R$ 5.000 (Projeto Personalizado Complexo)</SelectItem>
      </SelectContent>
    </Select>
  </div>
  <div className="space-y-2">
    <Label htmlFor="timeline">Prazo Desejado</Label>
    <Select onValueChange={(value: string) => handleSelectChange("timeline", value)}>
      <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black">
        <SelectValue placeholder="Selecione um prazo" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="2-3-weeks">2-3 semanas</SelectItem>
        <SelectItem value="3-4-weeks">3-4 semanas</SelectItem>
        <SelectItem value="1-2-months">1-2 meses</SelectItem>
        <SelectItem value="2-3-months">2-3 meses</SelectItem>
        <SelectItem value="3+-months">3+ meses</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
                  <div className="space-y-2">
                    <Label htmlFor="exactBudget">Valor Exato do Projeto (Opcional)</Label>
                    <Input id="exactBudget" name="exactBudget" type="number" step="0.01" placeholder="Ex: 2750.00" value={formData.exactBudget} onChange={handleChange} className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                    <p className="text-xs text-gray-500">
                      Digite um valor específico para um orçamento mais preciso.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">Estrutura de Pagamento</Label>
                    <RadioGroup
                      value={formData.paymentStructure}
                      onValueChange={(value: "50-50" | "40-30-30") => handleSelectChange("paymentStructure", value)}
                      className="space-y-3 mt-2"
                    >
                      <Label htmlFor="payment-40-30-30" className="flex items-start space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="40-30-30" id="payment-40-30-30" className="mt-1 border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white" />
                        <div className="flex-1">
                          <div className="font-semibold">3 Parcelas (40% + 30% + 30%)</div>
                          <div className="text-sm text-gray-600">
                            40% na entrada, 30% na aprovação do design, 30% na entrega final
                          </div>
                        </div>
                      </Label>
                      <Label htmlFor="payment-50-50" className="flex items-start space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="50-50" id="payment-50-50" className="mt-1 border-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white" />
                        <div className="flex-1">
                          <div className="font-semibold">2 Parcelas (50% + 50%)</div>
                          <div className="text-sm text-gray-600">
                            50% na entrada, 50% na entrega final
                          </div>
                        </div>
                      </Label>
                    </RadioGroup>
                  </div>

                  {(formData.budget || formData.exactBudget) && (
                    <Alert className="border-purple-200 bg-purple-50">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <AlertTitle className="text-purple-900">Valores de Pagamento</AlertTitle>
                      <AlertDescription className="text-purple-700">
                        <div className="mt-2 space-y-1">
                          <div>• Entrada ({formData.paymentStructure === "40-30-30" ? "40%" : "50%"}): R$ {getPaymentBreakdown.entrada.toFixed(2)}</div>
                          {formData.paymentStructure === "40-30-30" && (
                            <>
                              <div>• Aprovação (30%): R$ {getPaymentBreakdown.segunda.toFixed(2)}</div>
                              <div>• Entrega (30%): R$ {getPaymentBreakdown.terceira.toFixed(2)}</div>
                            </>
                          )}
                          {formData.paymentStructure === "50-50" && (
                            <div>• Entrega (50%): R$ {getPaymentBreakdown.segunda.toFixed(2)}</div>
                          )}
                          <div className="font-bold pt-2 border-t border-purple-300 mt-2">
                            Total: R$ {getPaymentBreakdown.total.toFixed(2)}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {formData.serviceType === "maintenance" && (
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">Selecione um Plano de Manutenção <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MAINTENANCE_PLANS.map((plan) => (
                      <MaintenancePlanCard
                        key={plan.id}
                        plan={plan}
                        selected={formData.maintenancePlan === plan.id}
                        onSelect={() => handleSelectChange("maintenancePlan", plan.id)}
                      />
                    ))}
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="siteLink">Link do seu site atual (opcional)</Label>
                    <Input id="siteLink" name="siteLink" value={formData.maintenanceDetails.siteLink} onChange={handleMaintenanceDetailsChange} placeholder="https://seusite.com.br" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Projeto</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px] w-full border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black"
                  placeholder={
                    formData.serviceType === "project"
                      ? "Descreva seus objetivos e funcionalidades desejadas..."
                      : "Descreva seu site/sistema atual e quais necessidades de manutenção você tem..."
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                disabled={submitting || !isStep1Valid}
                className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    Avançar <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* --- Passo 2: Termos do Contrato --- */}
        {step === 2 && (
          <Card className="w-full bg-white shadow-lg border border-gray-200">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-2xl font-semibold">Termos do Contrato</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Leia atentamente os termos abaixo e assine para prosseguir com o pagamento.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 shadow-md">
                <div className="mb-6 flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Contrato de Prestação de Serviços
                  </h3>
                </div>
                <div className="max-h-[350px] overflow-y-auto text-sm text-gray-700 space-y-4 pr-2">
                  <p>
                    <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS</strong>
                    <br />
                    Entre **Impulsioneweb** (CONTRATADA) e **{formData.name || "[Nome do Cliente]"}** (CONTRATANTE)
                  </p>

                  <p>
                    <strong>1. OBJETIVO DO CONTRATO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      `O presente contrato tem como objetivo o desenvolvimento de ${formData.projectType === "website" ? "um website institucional" : "um sistema personalizado"}.`
                    ) : (
                      `O presente contrato tem como objeto a prestação de serviços de manutenção e suporte para plataformas digitais, no Plano **${MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.name || "Básico"}**, com renovação mensal automática.`
                    )}
                  </p>

                  <p>
                    <strong>2. VALOR E PAGAMENTO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      `O valor total do projeto é de **R$ ${getPaymentBreakdown.total.toFixed(2)}**, dividido em ${formData.paymentStructure === "40-30-30" ? "3 parcelas" : "2 parcelas"}.`
                    ) : (
                      `O valor mensal do Plano **${MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.name || "Básico"}** é de **R$ ${MAINTENANCE_PLANS.find(p => p.id === formData.maintenancePlan)?.price.toFixed(2)}**, com vencimento todo dia 10 de cada mês.`
                    )}
                  </p>

                  <p>
                    <strong>3. POLÍTICA DE INADIMPLÊNCIA</strong>
                    <br />
                    • Atrasos no pagamento podem suspender os serviços e incorrer em juros e multas.<br />
                    • Em caso de inadimplência, a CONTRATADA reserva-se o direito de propriedade sobre o trabalho desenvolvido até a quitação total.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white rounded-md border border-gray-300 shadow-sm">
                <div className="pt-1">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={handleCheckboxChange}
                    className="h-5 w-5 rounded-md border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                </div>
                <label htmlFor="terms" className="text-sm font-semibold text-gray-800 cursor-pointer">
                  Li, compreendi e aceito todos os termos e condições.
                  <p className="text-sm text-gray-600 leading-snug font-normal mt-1">
                    Ao marcar esta caixa, você concorda com os termos acima. Este contrato entrará em vigor após o pagamento da primeira parcela.
                  </p>
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between mt-6">
              <Button variant="outline" onClick={prevStep} className="text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleSignContract}
                disabled={!formData.termsAccepted}
                className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
              >
                Assinar e Prosseguir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* --- Passo 3: Pagamento --- */}
        {step === 3 && (
          <Card className="w-full bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Pagamento do Projeto
              </CardTitle>
              <CardDescription>
                Selecione a forma de pagamento para darmos início ao seu projeto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.serviceType === "project" && (
                <div className="mb-6 space-y-4">
                  <h3 className="text-lg font-semibold">Estrutura de Pagamento</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className={`text-center transition-all ${paymentProcessing ? "opacity-50" : ""}`}>
                      <CardHeader>
                        <CardTitle className="text-xl">1ª Parcela (Entrada)</CardTitle>
                        <CardDescription>Pagamento inicial</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-purple-600">
                          R$ {getPaymentBreakdown.entrada.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">40% do total</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center opacity-50">
                      <CardHeader>
                        <CardTitle className="text-xl">2ª Parcela</CardTitle>
                        <CardDescription>Na aprovação do design</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-gray-400">
                          R$ {getPaymentBreakdown.segunda.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">30% do total</p>
                      </CardContent>
                    </Card>
                    <Card className="text-center opacity-50">
                      <CardHeader>
                        <CardTitle className="text-xl">3ª Parcela</CardTitle>
                        <CardDescription>Na entrega final</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-gray-400">
                          R$ {getPaymentBreakdown.terceira.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">30% do total</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Importante</AlertTitle>
                    <AlertDescription>
                      As 2ª e 3ª parcelas serão cobradas em etapas futuras do projeto. Você receberá um link de pagamento separado para cada uma no momento oportuno.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <h3 className="text-lg font-semibold mt-6">Forma de Pagamento (Entrada)</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}
                className="space-y-4 mt-2"
              >
                {[
                  { value: "pix", label: "PIX", description: "Pagamento instantâneo - Início imediato", recommended: true },
                  { value: "credit-card", label: "Cartão de Crédito", description: formData.serviceType === "project" ? "Parcele a entrada em até 3x sem juros" : "Cobrança mensal automática" },
                  { value: "boleto", label: "Boleto Bancário", description: "Vencimento em 3 dias úteis" },
                ].map((method) => (
                  <div
                    key={method.value}
                    className={`flex items-center space-x-3 rounded-lg border p-4 transition ${
                      method.recommended ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <RadioGroupItem id={method.value} value={method.value} className="border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white" />
                    <Label htmlFor={method.value} className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{method.label}</span>
                        {method.recommended && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium">Recomendado</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{method.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <AnimatePresence>
                {paymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 rounded-lg border border-gray-200 p-4 bg-white"
                  >
                    <h3 className="mb-4 text-lg font-semibold">Detalhes do Pagamento</h3>
                    {paymentMethod === "pix" && <PixQRCode paymentId={formData.paymentId} />}
                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Número do Cartão</Label>
                            <Input id="card-number" placeholder="0000 0000 0000 0000" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-name">Nome no Cartão</Label>
                            <Input id="card-name" placeholder="Nome como aparece no cartão" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Data de Validade</Label>
                            <Input id="expiry" placeholder="MM/AA" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black" />
                          </div>
                        </div>
                        {formData.serviceType === "project" && (
                          <div className="space-y-2">
                            <Label htmlFor="installments">Parcelas da Entrada</Label>
                            <Select defaultValue="1">
                              <SelectTrigger id="installments" className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-black"><SelectValue placeholder="Selecione o número de parcelas" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1x de R$ {getPaymentBreakdown.entrada.toFixed(2)} (à vista)</SelectItem>
                                <SelectItem value="2">2x de R$ {(getPaymentBreakdown.entrada / 2).toFixed(2)} (sem juros)</SelectItem>
                                <SelectItem value="3">3x de R$ {(getPaymentBreakdown.entrada / 3).toFixed(2)} (sem juros)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    )}
                    {paymentMethod === "boleto" && <BoletoPayment />}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep} className="text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={!isStep3Valid || paymentProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-300"
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    Confirmar Pagamento <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}