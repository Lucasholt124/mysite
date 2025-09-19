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
  Shield,
  CreditCard,
  Info,
} from "lucide-react"
import { motion } from "framer-motion"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatDocument,
  isValidDocument,
  getDocumentType,
} from "@/utils/document-validator"

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
  paymentStructure: string
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

  const validateDocument = (value: string) => {
    if (!value) {
      setDocumentValidation({
        isValid: true,
        message: "",
        touched: true,
      })
      return
    }
    const documentType = getDocumentType(value)
    const isValid = isValidDocument(value)
    if (documentType === "invalid") {
      setDocumentValidation({
        isValid: false,
        message: "Formato inválido. Digite um CPF ou CNPJ válido.",
        touched: true,
      })
    } else if (!isValid) {
      setDocumentValidation({
        isValid: false,
        message:
          documentType === "cpf"
            ? "CPF inválido. Verifique os dígitos."
            : "CNPJ inválido. Verifique os dígitos.",
        touched: true,
      })
    } else {
      setDocumentValidation({
        isValid: true,
        message: "",
        touched: true,
      })
    }
  }

  const isStep1Valid = useMemo(() => {
    const { name, email } = formData
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!name || !email || !emailRegex.test(email)) return false
    if (formData.serviceType === "maintenance" && !formData.maintenancePlan)
      return false
    if (formData.cpf && !documentValidation.isValid) return false
    return true
  }, [formData, documentValidation.isValid])

  const isStep3Valid = useMemo(() => !!paymentMethod, [paymentMethod])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === "cpf") {
      setFormData((prev) => ({ ...prev, [name]: formatDocument(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleDocumentBlur = () => {
    validateDocument(formData.cpf)
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleSignContract = () => {
    if (formData.termsAccepted) {
      setContractSigned(true)
      setStep(3)
    }
  }

  const submitContractData = async () => {
    try {
      setSubmitting(true)
      setSubmitError("")
      if (!formData.name || !formData.email) {
        setSubmitError("Por favor, preencha os campos obrigatórios (nome e email).")
        setSubmitting(false)
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setSubmitError("Por favor, forneça um endereço de email válido.")
        setSubmitting(false)
        return false
      }
      if (formData.cpf && !documentValidation.isValid) {
        setSubmitError("Por favor, forneça um CPF ou CNPJ válido.")
        setSubmitting(false)
        return false
      }
      if (
        formData.serviceType === "maintenance" &&
        !formData.maintenancePlan
      ) {
        setSubmitError("Por favor, selecione um plano de manutenção.")
        setSubmitting(false)
        return false
      }

      // Adiciona o valor total calculado ao payload
      const contractPayload = {
        ...formData,
        totalAmount: getPaymentBreakdown().total,
        firstPayment: getPaymentBreakdown().entrada,
      }

      const response = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractPayload),
      })
      const responseText = await response.text()
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch {
        throw new Error("Erro ao analisar resposta do servidor")
      }
      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao enviar dados do contrato")
      }
      if (responseData.asaasData) {
        setFormData((prev) => ({
          ...prev,
          paymentId:
            responseData.asaasData.paymentId || responseData.asaasData.id,
        }))
      }
      return true
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Erro ao enviar dados do contrato"
      )
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (step === 1) {
      if (!isStep1Valid) {
        setSubmitError("Por favor, preencha todos os campos obrigatórios corretamente.")
        return
      }
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

      const paymentPayload = {
        paymentMethod,
        paymentId: formData.paymentId,
        amount: formData.serviceType === "project"
          ? getPaymentBreakdown().entrada
          : maintenancePlans.find(p => p.id === formData.maintenancePlan)?.price,
        serviceType: formData.serviceType,
      }

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      })

      if (!response.ok) throw new Error("Falha ao processar o pagamento")

      const data = await response.json()

      if (data.success) {
        router.push("/pagamento-sucesso")
      } else {
        throw new Error(data.message || "Erro no processamento do pagamento")
      }
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Erro ao processar pagamento"
      )
    } finally {
      setPaymentProcessing(false)
    }
  }

  // Função para calcular valores reais de pagamento
  const getPaymentBreakdown = () => {
    // Se tem valor exato digitado, usa ele
    if (formData.exactBudget) {
      const total = parseFloat(formData.exactBudget)
      if (formData.paymentStructure === "40-30-30") {
        return {
          entrada: total * 0.4,
          segunda: total * 0.3,
          terceira: total * 0.3,
          total: total
        }
      } else {
        return {
          entrada: total * 0.5,
          segunda: total * 0.5,
          terceira: 0,
          total: total
        }
      }
    }

    // Senão usa a faixa selecionada
    const budgetRange = formData.budget
    let total = 0

    switch(budgetRange) {
      case "1000-1500": total = 1250; break
      case "1500-2500": total = 2000; break
      case "2500-3500": total = 3000; break
      case "3500-5000": total = 4250; break
      case "5000+": total = 5000; break
      default: total = 1500
    }

    if (formData.paymentStructure === "40-30-30") {
      return {
        entrada: total * 0.4,
        segunda: total * 0.3,
        terceira: total * 0.3,
        total: total
      }
    } else {
      return {
        entrada: total * 0.5,
        segunda: total * 0.5,
        terceira: 0,
        total: total
      }
    }
  }

  const maintenancePlans: MaintenancePlan[] = [
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

  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center text-purple-600 hover:text-purple-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
      </Link>

      <div className="mb-8">
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
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= s
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {s}
              </div>
              {index < 2 && (
                <div
                  className={`h-1 flex-1 ${
                    step > s ? "bg-purple-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {submitError && (
        <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {contractSigned && (
        <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-800 shadow-sm">
          O contrato foi assinado com sucesso!
        </div>
      )}

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-3xl"
      >
        {step === 1 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Informações do Projeto</CardTitle>
              <CardDescription>
                Informe seus dados e detalhes do serviço desejado.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tipo de Serviço */}
              <div className="mb-6">
                <Tabs
                  value={formData.serviceType}
                  onValueChange={(value: string) =>
                    handleSelectChange("serviceType", value)
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-md shadow-md">
                    <TabsTrigger
                      value="project"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-colors py-2 text-center font-semibold text-gray-700 hover:bg-purple-500 hover:text-white"
                    >
                      Projeto Único
                    </TabsTrigger>
                    <TabsTrigger
                      value="maintenance"
                      className="data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-md transition-colors py-2 text-center font-semibold text-gray-700 hover:bg-purple-500 hover:text-white"
                    >
                      Plano de Manutenção
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="project"
                    className="mt-6 px-4 py-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">
                      Projeto Único
                    </h3>
                    <p className="text-sm text-gray-600">
                      Desenvolvimento de site institucional ou sistema personalizado.
                    </p>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Shield className="h-4 w-4" />
                        <span className="font-semibold text-sm">Proteção Total</span>
                      </div>
                      <p className="text-xs text-blue-700 mt-1">
                        Entrada de 40% ou 50% + parcelas. Seu projeto seguro e garantido.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="maintenance"
                    className="mt-6 px-4 py-4 bg-white rounded-lg shadow-md border border-gray-200"
                  >
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">
                      Plano de Manutenção
                    </h3>
                    <p className="text-sm text-gray-600">
                      Serviço mensal para manutenção, atualizações e proteção do seu site ou sistema.
                    </p>
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-800">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-semibold text-sm">Pagamento Mensal</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">
                        Cancele quando quiser. Sem multas ou taxas extras.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Informações Pessoais */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
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
                    onBlur={handleDocumentBlur}
                    placeholder="000.000.000-00 ou 00.000.000/0001-00"
                    className={`pr-10 ${
                      !documentValidation.isValid && documentValidation.touched
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
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
                  <p className="mt-1 text-sm text-red-500">
                    {documentValidation.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Digite apenas os números ou com a formatação padrão.
                </p>
              </div>

              {/* Condicional para Projeto */}
              {formData.serviceType === "project" ? (
                <>
                  <div className="space-y-2">
                    <Label>
                      Tipo de Projeto <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.projectType}
                      onValueChange={(value: string) =>
                        handleSelectChange("projectType", value)
                      }
                      className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="website"
                          id="website"
                          className="border bg-white data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor="website" className="flex items-center gap-1">
                          <Globe className="w-4 h-4" /> Website
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="system"
                          id="system"
                          className="border bg-white data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor="system" className="flex items-center gap-1">
                          <Cog className="w-4 h-4" /> Sistema
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budget">
                        Orçamento Estimado
                        <span className="ml-1 text-purple-600 cursor-help" title="Valores especiais para novos clientes">
                          <Info className="inline h-3 w-3" />
                        </span>
                      </Label>
                      <Select
                        onValueChange={(value: string) =>
                          handleSelectChange("budget", value)
                        }
                      >
                        <SelectTrigger className="bg-white border border-zinc-300 text-black">
                          <SelectValue placeholder="Selecione uma faixa" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-zinc-300 text-black">
                          <SelectItem value="1000-1500">
                            R$ 1.000 - R$ 1.500
                          </SelectItem>
                          <SelectItem value="1500-2500">
                            R$ 1.500 - R$ 2.500
                          </SelectItem>
                          <SelectItem value="2500-3500">
                            R$ 2.500 - R$ 3.500
                          </SelectItem>
                          <SelectItem value="3500-5000">
                            R$ 3.500 - R$ 5.000
                          </SelectItem>
                          <SelectItem value="5000+">
                            Acima de R$ 5.000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Prazo Desejado</Label>
                      <Select
                        onValueChange={(value: string) =>
                          handleSelectChange("timeline", value)
                        }
                      >
                        <SelectTrigger className="bg-white border border-zinc-300 text-black">
                          <SelectValue placeholder="Selecione um prazo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-zinc-300 text-black">
                          <SelectItem value="2-3-weeks">2-3 semanas</SelectItem>
                          <SelectItem value="3-4-weeks">3-4 semanas</SelectItem>
                          <SelectItem value="1-2-months">1-2 meses</SelectItem>
                          <SelectItem value="2-3-months">2-3 meses</SelectItem>
                          <SelectItem value="3+-months">3+ meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Campo para valor exato */}
                  <div className="space-y-2">
                    <Label htmlFor="exactBudget">
                      Valor Exato do Projeto (Opcional)
                    </Label>
                    <Input
                      id="exactBudget"
                      name="exactBudget"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 2750.00"
                      value={formData.exactBudget}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500">
                      Digite um valor específico ou deixe em branco para usar a faixa selecionada acima.
                    </p>
                  </div>

                  {/* Estrutura de Pagamento */}
                  <div className="space-y-2">
                    <Label>
                      Estrutura de Pagamento
                      <span className="ml-1 text-purple-600 cursor-help" title="Escolha como prefere dividir o pagamento">
                        <Info className="inline h-3 w-3" />
                      </span>
                    </Label>
                    <RadioGroup
                      value={formData.paymentStructure}
                      onValueChange={(value: string) =>
                        handleSelectChange("paymentStructure", value)
                      }
                      className="space-y-3"
                    >
                      <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem
                          value="40-30-30"
                          id="payment-40-30-30"
                          className="mt-1 border bg-white data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor="payment-40-30-30" className="cursor-pointer flex-1">
                          <div className="font-semibold">3 Parcelas (40% + 30% + 30%)</div>
                          <div className="text-sm text-gray-600">
                            40% entrada, 30% aprovação do design, 30% entrega final
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem
                          value="50-50"
                          id="payment-50-50"
                          className="mt-1 border bg-white data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
                        />
                        <Label htmlFor="payment-50-50" className="cursor-pointer flex-1">
                          <div className="font-semibold">2 Parcelas (50% + 50%)</div>
                          <div className="text-sm text-gray-600">
                            50% entrada, 50% na entrega final
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Preview do Pagamento Real */}
                  {(formData.budget || formData.exactBudget) && (
                    <Alert className="border-purple-200 bg-purple-50">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <AlertTitle className="text-purple-900">Valores de Pagamento</AlertTitle>
                      <AlertDescription className="text-purple-700">
                        {formData.paymentStructure === "40-30-30" ? (
                          <>
                            <div className="mt-2 space-y-1">
                              <div>• Entrada (40%): R$ {getPaymentBreakdown().entrada.toFixed(2)}</div>
                              <div>• Aprovação (30%): R$ {getPaymentBreakdown().segunda.toFixed(2)}</div>
                              <div>• Entrega (30%): R$ {getPaymentBreakdown().terceira.toFixed(2)}</div>
                              <div className="font-semibold pt-1 border-t border-purple-300 mt-2">
                                Total: R$ {getPaymentBreakdown().total.toFixed(2)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mt-2 space-y-1">
                              <div>• Entrada (50%): R$ {getPaymentBreakdown().entrada.toFixed(2)}</div>
                              <div>• Entrega (50%): R$ {getPaymentBreakdown().segunda.toFixed(2)}</div>
                              <div className="font-semibold pt-1 border-t border-purple-300 mt-2">
                                Total: R$ {getPaymentBreakdown().total.toFixed(2)}
                              </div>
                            </div>
                          </>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <Label>
                    Selecione um Plano de Manutenção{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {maintenancePlans.map((plan) => (
                      <MaintenancePlanCard
                        key={plan.id}
                        plan={plan}
                        selected={formData.maintenancePlan === plan.id}
                        onSelect={() =>
                          handleSelectChange("maintenancePlan", plan.id)
                        }
                      />
                    ))}
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="siteLink">
                      Link do seu site atual (opcional)
                    </Label>
                    <Input
                      id="siteLink"
                      name="siteLink"
                      value={formData.maintenanceDetails.siteLink}
                      onChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setFormData((prev) => ({
                          ...prev,
                          maintenanceDetails: {
                            ...prev.maintenanceDetails,
                            siteLink: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://seusite.com.br"
                    />
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
                  className="min-h-[120px] w-full"
                  placeholder={
                    formData.serviceType === "project"
                      ? "Descreva seu projeto, objetivos e funcionalidades desejadas..."
                      : "Descreva seu site ou sistema atual e quais necessidades específicas de manutenção você possui..."
                  }
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end mt-6">
              <Button
                onClick={nextStep}
                disabled={submitting || !isStep1Valid}
                className={`${
                  isStep1Valid
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
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

        {step === 2 && (
          <Card className="w-full">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Termos do Contrato
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Leia atentamente os termos abaixo e assine para prosseguir.
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
                <div className="max-h-[350px] overflow-y-auto text-sm text-gray-700 space-y-4">
                  <p>
                    <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DIGITAIS</strong>
                    <br />
                    Entre Impulsioneweb (CONTRATADA) e {formData.name || "[Nome do Cliente]"} (CONTRATANTE)
                  </p>

                  <p>
                    <strong>1. OBJETIVO DO CONTRATO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        O presente contrato tem como objetivo a prestação de serviços de{" "}
                        {formData.projectType === "website"
                          ? "desenvolvimento de website institucional"
                          : "desenvolvimento de sistema personalizado"}
                        {" "}pela CONTRATADA à CONTRATANTE, conforme especificações acordadas.
                      </>
                    ) : (
                      <>
                        O presente contrato tem como objeto a prestação de serviços de manutenção e suporte para plataformas digitais, no Plano {formData.maintenancePlan || "Básico"}, com renovação mensal automática.
                      </>
                    )}
                  </p>

                  <p>
                    <strong>2. PRAZO DE EXECUÇÃO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        Os serviços serão executados dentro do prazo estimado de {formData.timeline || "[prazo]"} após a confirmação do pagamento da entrada (primeira parcela). Atrasos causados pela CONTRATANTE (demora na entrega de conteúdo, aprovações, etc.) poderão estender o prazo proporcionalmente.
                      </>
                    ) : (
                      <>
                        Os serviços são prestados mensalmente, com renovação automática. O cancelamento pode ser solicitado com aviso prévio de 30 dias, sem multas ou taxas adicionais.
                      </>
                    )}
                  </p>

                  <p>
                    <strong>3. VALOR E FORMA DE PAGAMENTO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        <strong>Estrutura de Pagamento: {formData.paymentStructure === "40-30-30" ? "3 parcelas" : "2 parcelas"}</strong>
                        <br />
                        {formData.paymentStructure === "40-30-30" ? (
                          <>
                            • 1ª Parcela (40%): R$ {getPaymentBreakdown().entrada.toFixed(2)} - Na assinatura do contrato<br />
                            • 2ª Parcela (30%): R$ {getPaymentBreakdown().segunda.toFixed(2)} - Na aprovação do design/protótipo<br />
                            • 3ª Parcela (30%): R$ {getPaymentBreakdown().terceira.toFixed(2)} - Na entrega final do projeto<br />
                          </>
                        ) : (
                          <>
                            • 1ª Parcela (50%): R$ {getPaymentBreakdown().entrada.toFixed(2)} - Na assinatura do contrato<br />
                            • 2ª Parcela (50%): R$ {getPaymentBreakdown().segunda.toFixed(2)} - Na entrega final do projeto<br />
                          </>
                        )}
                        <br />
                        <strong>Total: R$ {getPaymentBreakdown().total.toFixed(2)}</strong>
                      </>
                    ) : (
                      <>
                        O valor mensal do Plano {formData.maintenancePlan || "Básico"} é de R${" "}
                        {maintenancePlans.find((p) => p.id === formData.maintenancePlan)?.price || "100,00"}, com vencimento todo dia 10 de cada mês. Pagamento via cartão de crédito, boleto ou PIX.
                      </>
                    )}
                  </p>

                  <p>
                    <strong>4. POLÍTICA DE PAGAMENTO E INADIMPLÊNCIA</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        • O não pagamento de qualquer parcela suspende imediatamente o desenvolvimento do projeto.<br />
                        • Atraso superior a 7 dias incorre em multa de 2% + juros de 1% ao mês.<br />
                        • A CONTRATADA reserva o direito de propriedade sobre todo o trabalho desenvolvido até a quitação total.<br />
                        • Em caso de inadimplência superior a 30 dias, o contrato será rescindido e os valores pagos não serão devolvidos.
                      </>
                    ) : (
                      <>
                        • O atraso no pagamento mensal suspende os serviços após 5 dias do vencimento.<br />
                        • Sites/sistemas podem ser colocados offline após 15 dias de inadimplência.<br />
                        • A reativação dos serviços ocorre em até 24h após confirmação do pagamento.
                      </>
                    )}
                  </p>

                  <p>
                    <strong>5. OBRIGAÇÕES DA CONTRATADA</strong>
                    <br />
                    • Executar os serviços conforme especificações acordadas<br />
                    • Manter sigilo sobre informações confidenciais da CONTRATANTE<br />
                    • Fornecer suporte técnico durante o período de desenvolvimento<br />
                    • Entregar o projeto dentro do prazo estipulado (salvo atrasos causados pela CONTRATANTE)<br />
                    {formData.serviceType === "project" && "• Oferecer 30 dias de garantia para correção de bugs após a entrega"}
                  </p>

                  <p>
                    <strong>6. OBRIGAÇÕES DA CONTRATANTE</strong>
                    <br />
                    • Efetuar os pagamentos conforme estabelecido neste contrato<br />
                    • Fornecer todas as informações e materiais necessários em tempo hábil<br />
                    • Aprovar etapas do projeto dentro de 3 dias úteis<br />
                    • Não solicitar alterações significativas após aprovação de etapas<br />
                    • Respeitar os direitos autorais e propriedade intelectual
                  </p>

                  <p>
                    <strong>7. PROPRIEDADE INTELECTUAL E DIREITOS</strong>
                    <br />
                    • A propriedade total do projeto só é transferida após quitação completa<br />
                    • Códigos e tecnologias proprietárias da CONTRATADA permanecem sob sua propriedade<br />
                    • A CONTRATANTE não pode revender ou redistribuir o código-fonte sem autorização<br />
                    • A CONTRATADA pode incluir o projeto em seu portfólio
                  </p>

                  <p>
                    <strong>8. GARANTIA E SUPORTE</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        • 30 dias de garantia para correção de bugs após a entrega<br />
                        • Suporte técnico básico por 60 dias via email<br />
                        • Alterações e novas funcionalidades serão orçadas à parte<br />
                        • Treinamento básico para uso do sistema (se aplicável)
                      </>
                    ) : (
                      <>
                        • Suporte contínuo conforme plano contratado<br />
                        • Tempo de resposta: Básico (48h), Intermediário (24h), Avançado (12h), Premium (2h)<br />
                        • Backups diários com retenção de 30 dias<br />
                        • Relatórios de desempenho mensais (planos Avançado e Premium)
                      </>
                    )}
                  </p>

                  <p>
                    <strong>9. CANCELAMENTO E RESCISÃO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        • Cancelamento pela CONTRATANTE: valores pagos não são reembolsáveis<br />
                        • Cancelamento pela CONTRATADA: devolução proporcional ao trabalho não realizado<br />
                        • Mudanças significativas no escopo podem resultar em novo orçamento<br />
                        • Disputas serão resolvidas preferencialmente por mediação
                      </>
                    ) : (
                      <>
                        • Cancelamento sem multas com aviso de 30 dias<br />
                        • Exportação de dados fornecida em até 15 dias após cancelamento<br />
                        • Não há reembolso de mensalidades já pagas<br />
                        • Serviços extras já executados devem ser quitados
                      </>
                    )}
                  </p>

                  <p>
                    <strong>10. DISPOSIÇÕES GERAIS</strong>
                    <br />
                    • Este contrato é regido pelas leis brasileiras<br />
                    • Alterações só são válidas se acordadas por escrito<br />
                    • A tolerância a descumprimentos não implica em renúncia de direitos<br />
                    • Comunicações oficiais devem ser feitas por email cadastrado
                  </p>

                  <p>
                    <strong>11. FORO</strong>
                    <br />
                    Fica eleito o foro da comarca de Ribeirópolis-SE para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
                  </p>

                  <p className="mt-4 pt-4 border-t border-gray-400">
                    <strong>DATA:</strong> {new Date().toLocaleDateString('pt-BR')}<br />
                    <strong>CONTRATANTE:</strong> {formData.name || "[Nome]"}<br />
                    <strong>CPF/CNPJ:</strong> {formData.cpf || "[Documento]"}<br />
                    <strong>EMAIL:</strong> {formData.email || "[Email]"}
                  </p>
                </div>
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-900">Importante</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Este é um contrato digital juridicamente válido. Ao aceitar, você concorda com todos os termos e condições estabelecidos. Uma cópia será enviada para seu email.
                </AlertDescription>
              </Alert>

              <div className="flex items-start gap-3 p-4 bg-white rounded-md border border-gray-300 shadow-sm">
                <div className="pt-1">
                  <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={handleCheckboxChange}
                    className="h-5 w-5 text-purple-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="terms"
                    className="text-sm font-semibold text-gray-800 cursor-pointer"
                  >
                    Li, compreendi e aceito todos os termos e condições
                  </label>
                  <p className="text-sm text-gray-600 leading-snug">
                    Ao marcar esta caixa, você concorda com os termos acima e autoriza o início do processo. Este contrato entrará em vigor após o pagamento da primeira parcela.
                  </p>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                className="text-gray-700 border border-gray-300 hover:bg-gray-100"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handleSignContract}
                disabled={!formData.termsAccepted}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Assinar e Prosseguir para Pagamento <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {formData.serviceType === "project" ? "Pagamento da Entrada" : "Pagamento do Plano"}
              </CardTitle>
              <CardDescription>
                {formData.serviceType === "project"
                  ? `Efetue o pagamento da entrada (R$ ${getPaymentBreakdown().entrada.toFixed(2)}) para iniciarmos seu projeto`
                  : "Escolha a forma de pagamento para ativar seu plano de manutenção"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5" />
                  <p className="font-medium">
                    Contrato assinado com sucesso!
                  </p>
                </div>
                <p className="mt-2 text-sm">
                  {formData.serviceType === "project"
                    ? "Após a confirmação do pagamento da entrada, iniciaremos imediatamente o desenvolvimento do seu projeto."
                    : "Após a confirmação do pagamento, seu plano será ativado imediatamente."
                  }
                </p>
              </div>

              {formData.serviceType === "project" && (
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900">Pagamento Seguro</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <div className="mt-2 space-y-1">
                      <div>• Valor da entrada: R$ {getPaymentBreakdown().entrada.toFixed(2)}</div>
                      <div>• Início imediato após confirmação</div>
                      <div>• Garantia de 30 dias após entrega</div>
                      <div>• Suporte durante todo desenvolvimento</div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}
                className="space-y-4"
              >
                {[
                  {
                    value: "pix",
                    label: "PIX",
                    description: "Pagamento instantâneo - Início imediato",
                    recommended: true,
                  },
                  {
                    value: "credit-card",
                    label: "Cartão de Crédito",
                    description:
                      formData.serviceType === "project"
                        ? "Parcele a entrada em até 3x sem juros"
                        : "Cobrança mensal automática",
                  },
                  {
                    value: "boleto",
                    label: "Boleto Bancário",
                    description: "Vencimento em 3 dias úteis",
                  },
                ].map((method) => (
                  <div
                    key={method.value}
                    className={`flex items-center space-x-3 rounded-lg border p-4 transition ${
                      method.recommended
                        ? "border-purple-300 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <RadioGroupItem
                      id={method.value}
                      value={method.value}
                      className="border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor={method.value} className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{method.label}</span>
                        {method.recommended && (
                          <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">
                            Recomendado
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {method.description}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {paymentMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="mb-4 text-lg font-semibold">
                    Detalhes do Pagamento
                  </h3>

                  {paymentMethod === "pix" && (
                    <div className="space-y-4">
                      <Alert className="border-green-200 bg-green-50">
                        <Info className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          <strong>Valor: R$ {
                            formData.serviceType === "project"
                              ? getPaymentBreakdown().entrada.toFixed(2)
                              : maintenancePlans.find(p => p.id === formData.maintenancePlan)?.price.toFixed(2)
                          }</strong>
                          <br />
                          PIX válido por 30 minutos. Após o pagamento, o início é imediato.
                        </AlertDescription>
                      </Alert>
                      <PixQRCode paymentId={formData.paymentId} />
                    </div>
                  )}

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <Alert className="border-blue-200 bg-blue-50 mb-4">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-700">
                          <strong>Valor: R$ {
                            formData.serviceType === "project"
                              ? getPaymentBreakdown().entrada.toFixed(2)
                              : maintenancePlans.find(p => p.id === formData.maintenancePlan)?.price.toFixed(2)
                          }</strong>
                          {formData.serviceType === "project" && (
                            <span className="block mt-1">Você pode parcelar a entrada em até 3x sem juros</span>
                          )}
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-number">
                            Número do Cartão
                          </Label>
                          <Input
                            id="card-number"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card-name">Nome no Cartão</Label>
                          <Input
                            id="card-name"
                            placeholder="Nome como aparece no cartão"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiry">Data de Validade</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>

                      {formData.serviceType === "project" && (
                        <div>
                          <Label htmlFor="installments">Parcelas da Entrada</Label>
                          <Select defaultValue="1">
                            <SelectTrigger id="installments">
                              <SelectValue placeholder="Selecione o número de parcelas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                1x de R$ {getPaymentBreakdown().entrada.toFixed(2)} (à vista)
                              </SelectItem>
                              <SelectItem value="2">
                                2x de R$ {(getPaymentBreakdown().entrada / 2).toFixed(2)} (sem juros)
                              </SelectItem>
                              <SelectItem value="3">
                                3x de R$ {(getPaymentBreakdown().entrada / 3).toFixed(2)} (sem juros)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === "boleto" && (
                    <div className="space-y-4">
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-700">
                          <strong>Valor: R$ {
                            formData.serviceType === "project"
                              ? getPaymentBreakdown().entrada.toFixed(2)
                              : maintenancePlans.find(p => p.id === formData.maintenancePlan)?.price.toFixed(2)
                          }</strong>
                          <br />
                          O boleto vence em 3 dias úteis. O projeto inicia após compensação.
                        </AlertDescription>
                      </Alert>
                      <BoletoPayment />
                    </div>
                  )}
                </motion.div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button
                onClick={handlePaymentSubmit}
                disabled={!isStep3Valid || paymentProcessing}
                className={`${
                  isStep3Valid && !paymentProcessing
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white`}
              >
                {paymentProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando Pagamento...
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