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
      const response = await fetch("/api/contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod, paymentId: formData.paymentId }),
      })
      if (!response.ok) throw new Error("Falha ao processar o pagamento")
      router.push("/pagamento-sucesso")
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
                      Desenvolvimento de site institucional ou sistema personalizado, com pagamento único.
                    </p>
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
                      <Label htmlFor="budget">Orçamento Estimado</Label>
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
                          <SelectItem value="2000-2500">
                            R$ 2.000 - R$ 2.500
                          </SelectItem>
                          <SelectItem value="3000-3500">
                            R$ 3.000 - R$ 3.500
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
                          <SelectItem value="1-2-weeks">1-2 semanas</SelectItem>
                          <SelectItem value="2-4-weeks">2-4 semanas</SelectItem>
                          <SelectItem value="1-2-months">1-2 meses</SelectItem>
                          <SelectItem value="3+-months">3+ meses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
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
                    <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong>
                    <br />
                    Entre Impulsioneweb e {formData.name || "[Nome do Cliente]"}
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
                        {" "}pela CONTRATADA à CONTRATANTE, conforme especificações detalhadas no Anexo I.
                      </>
                    ) : (
                      <>
                        O presente contrato tem como objeto a prestação de serviços de manutenção e suporte para plataformas digitais, no Plano {formData.maintenancePlan || "Básico"}, conforme as especificações no Anexo I.
                      </>
                    )}
                  </p>
                  <p>
                    <strong>2. PRAZO DE EXECUÇÃO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        Os serviços serão executados dentro do prazo estimado de {formData.timeline || "[prazo]"} após a assinatura e pagamento da primeira parcela.
                      </>
                    ) : (
                      <>
                        Os serviços são prestados mensalmente, com renovação automática e podem ser cancelados com aviso prévio de 30 dias.
                      </>
                    )}
                  </p>
                  <p>
                    <strong>3. VALOR E FORMA DE PAGAMENTO</strong>
                    <br />
                    {formData.serviceType === "project" ? (
                      <>
                        O valor dos serviços será determinado após análise detalhada do projeto. O pagamento será feito em parcelas, com a primeira no momento da assinatura do contrato.
                      </>
                    ) : (
                      <>
                        O valor mensal do Plano {formData.maintenancePlan || "Básico"} é de R${" "}
                        {maintenancePlans.find((p) => p.id === formData.maintenancePlan)?.price || "100,00"}, a ser pago via cobrança recorrente.
                      </>
                    )}
                  </p>
                  <p>
                    <strong>4. OBRIGAÇÕES DA CONTRATADA</strong>
                    <br />
                    A CONTRATADA compromete-se a prestar os serviços conforme acordado, mantendo sigilo sobre as informações da CONTRATANTE.
                  </p>
                  <p>
                    <strong>5. OBRIGAÇÕES DA CONTRATANTE</strong>
                    <br />
                    A CONTRATANTE compromete-se a fornecer todas as informações necessárias para a execução dos serviços e efetuar os pagamentos conforme combinado.
                  </p>
                  <p>
                    <strong>6. PROPRIEDADE INTELECTUAL</strong>
                    <br />
                    Após a conclusão dos serviços e quitação total do pagamento, a propriedade intelectual dos produtos desenvolvidos será transferida à CONTRATANTE.
                  </p>
                  <p>
                    <strong>7. FORO</strong>
                    <br />
                    Fica eleito o foro da comarca de São Paulo para dirimir quaisquer controvérsias oriundas deste contrato.
                  </p>
                </div>
              </div>
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
                    Aceito os termos e condições
                  </label>
                  <p className="text-sm text-gray-600 leading-snug">
                    Ao marcar esta caixa, você concorda com os termos acima e autoriza o início do processo.
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
                Assinar e Prosseguir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Pagamento</CardTitle>
              <CardDescription>
                Escolha a forma de pagamento para finalizar seu contrato
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
                  Seu contrato foi assinado digitalmente. Agora, escolha a forma de pagamento para iniciarmos seu{" "}
                  {formData.serviceType === "project"
                    ? "projeto"
                    : "plano de manutenção"}
                  .
                </p>
              </div>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}
                className="space-y-4"
              >
                {[
                  {
                    value: "credit-card",
                    label: "Cartão de Crédito",
                    description:
                      formData.serviceType === "project"
                        ? "Pagamento em até 12x"
                        : "Cobrança mensal automática",
                  },
                  {
                    value: "debit-card",
                    label: "Cartão de Débito",
                    description: "Pagamento à vista",
                  },
                  {
                    value: "pix",
                    label: "PIX",
                    description: "Transferência instantânea",
                  },
                  {
                    value: "boleto",
                    label: "Boleto Bancário",
                    description: "Vencimento em 3 dias úteis",
                  },
                ].map((method) => (
                  <div
                    key={method.value}
                    className="flex items-center space-x-3 rounded-lg border border-gray-200 p-4 hover:border-purple-300 transition"
                  >
                    <RadioGroupItem
                      id={method.value}
                      value={method.value}
                      className="border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor={method.value} className="cursor-pointer flex-1">
                      <div className="font-semibold">{method.label}</div>
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
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
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
                      {formData.serviceType === "project" ? (
                        <div>
                          <Label htmlFor="installments">Parcelas</Label>
                          <Select defaultValue="1">
                            <SelectTrigger id="installments">
                              <SelectValue placeholder="Selecione o número de parcelas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                1x de R$ 1.000,00 (sem juros)
                              </SelectItem>
                              <SelectItem value="2">
                                2x de R$ 500,00 (sem juros)
                              </SelectItem>
                              <SelectItem value="3">
                                3x de R$ 333,33 (sem juros)
                              </SelectItem>
                              <SelectItem value="6">
                                6x de R$ 166,67 (sem juros)
                              </SelectItem>
                              <SelectItem value="12">
                                12x de R$ 83,33 (sem juros)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
                          Seu cartão será cobrado mensalmente no valor de R${" "}
                          {maintenancePlans.find(
                            (p) => p.id === formData.maintenancePlan
                          )?.price || "100,00"}
                          . Você pode cancelar a qualquer momento.
                        </div>
                      )}
                    </div>
                  )}
                  {paymentMethod === "debit-card" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="debit-number">
                            Número do Cartão
                          </Label>
                          <Input
                            id="debit-number"
                            placeholder="0000 0000 0000 0000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="debit-name">Nome no Cartão</Label>
                          <Input
                            id="debit-name"
                            placeholder="Nome como aparece no cartão"
                          />
                        </div>
                        <div>
                          <Label htmlFor="debit-expiry">
                            Data de Validade
                          </Label>
                          <Input id="debit-expiry" placeholder="MM/AA" />
                        </div>
                        <div>
                          <Label htmlFor="debit-cvv">CVV</Label>
                          <Input id="debit-cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
                        O valor será debitado imediatamente da sua conta.
                      </div>
                    </div>
                  )}
                  {paymentMethod === "pix" && (
                    <PixQRCode paymentId={formData.paymentId} />
                  )}
                  {paymentMethod === "boleto" && <BoletoPayment />}
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
                    Processando...
                  </>
                ) : (
                  <>
                    Finalizar Pagamento <ArrowRight className="ml-2 h-4 w-4" />
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