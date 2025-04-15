"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, FileText, Loader2, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import PixQRCode from "@/components/pix-qrcode"
import BoletoPayment from "@/components/boleto-payment"

export default function ContratoPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
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
  })

  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [, setContractSigned] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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

      // Validação básica
      if (!formData.name || !formData.email) {
        setSubmitError("Por favor, preencha os campos obrigatórios (nome e email).")
        setSubmitting(false)
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setSubmitError("Por favor, forneça um endereço de email válido.")
        setSubmitting(false)
        return
      }

      // Enviar dados do contrato
      const response = await fetch("/api/contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.message || "Erro ao enviar dados do contrato")
      }

      console.log("Resposta do servidor:", responseData)

      // Se tiver dados do Asaas, armazenar para uso posterior
      if (responseData.asaasData) {
        console.log("Dados do Asaas:", responseData.asaasData)
        // Você pode armazenar isso no estado se precisar usar depois
      }

      // Sucesso - continuar para a próxima etapa
      setStep(2)
    } catch (error) {
      console.error("Erro ao enviar dados do contrato:", error)
      setSubmitError(error instanceof Error ? error.message : "Erro ao enviar dados do contrato")
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = async () => {
    if (step === 1) {
      // Validar campos obrigatórios
      if (!formData.name || !formData.email) {
        setSubmitError("Por favor, preencha os campos obrigatórios (nome e email).")
        return
      }

      // Enviar dados do contrato antes de avançar
      await submitContractData()
    } else {
      setStep((prev) => prev + 1)
    }
  }

  const prevStep = () => setStep((prev) => prev - 1)

  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center text-purple-600 hover:text-purple-700">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">Contrato de Serviços</h1>
        <p className="text-lg text-gray-600">Preencha as informações abaixo para iniciar seu projeto</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-10 flex justify-center">
        <div className="flex w-full max-w-3xl items-center">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 1 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div className={`h-1 flex-1 ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`}></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 2 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <div className={`h-1 flex-1 ${step >= 3 ? "bg-purple-600" : "bg-gray-200"}`}></div>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              step >= 3 ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
      </div>

      {submitError && (
        <Alert className="mb-4 border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
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
              <CardDescription>Conte-nos sobre você e seu projeto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF/CNPJ</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                />
              </div>

              <div className="space-y-2">
  <Label className="text-lg font-semibold text-gray-800">Tipo de Projeto</Label>
  <RadioGroup
    value={formData.projectType}
    onValueChange={(value) => handleSelectChange("projectType", value)}
    className="grid grid-cols-1 gap-4 md:grid-cols-3"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value="website"
        id="website"
        className="w-6 h-6 border-2 border-gray-600 bg-white checked:bg-black checked:border-black rounded-full focus:ring-2 focus:ring-purple-500 transition-all duration-300"
      />
      <Label htmlFor="website" className="text-gray-700">Website</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value="system"
        id="system"
        className="w-6 h-6 border-2 border-gray-600 bg-white checked:bg-black checked:border-black rounded-full focus:ring-2 focus:ring-purple-500 transition-all duration-300"
      />
      <Label htmlFor="system" className="text-gray-700">Sistema</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value="marketing"
        id="marketing"
        className="w-6 h-6 border-2 border-gray-600 bg-white checked:bg-black checked:border-black rounded-full focus:ring-2 focus:ring-purple-500 transition-all duration-300"
      />
      <Label htmlFor="marketing" className="text-gray-700">Marketing Digital</Label>
    </div>
  </RadioGroup>
</div>



              <div className="space-y-4">
                <Label htmlFor="budget" className="text-lg font-semibold text-gray-800">Orçamento Estimado</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("budget", value)}
                >
                  <SelectTrigger className="w-full bg-white text-gray-700 p-4 rounded-lg shadow-md hover:border-purple-300 focus:outline-none">
                    <SelectValue placeholder="Selecione uma faixa" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-md">
                    <SelectItem value="1000-3000" className="text-gray-700 hover:bg-purple-50">R$ 1.000 - R$ 1.500</SelectItem>
                    <SelectItem value="3000-5000" className="text-gray-700 hover:bg-purple-50">R$ 2.000 - R$ 2.500</SelectItem>
                    <SelectItem value="5000-10000" className="text-gray-700 hover:bg-purple-50">R$ 3.000 - R$ 3.500</SelectItem>
                    <SelectItem value="10000+" className="text-gray-700 hover:bg-purple-50">Acima de R$ 5.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
  <Label htmlFor="timeline" className="text-lg font-semibold text-gray-800">Prazo Desejado</Label>
  <div className="w-full border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
    <Select onValueChange={(value) => handleSelectChange("timeline", value)}>
      <SelectTrigger className="w-full bg-white text-gray-700 p-4 rounded-lg shadow-md hover:border-purple-300 focus:outline-none">
        <SelectValue placeholder="Selecione um prazo" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value="1-2-weeks" className="text-gray-700 hover:bg-purple-50">1-2 semanas</SelectItem>
        <SelectItem value="2-4-weeks" className="text-gray-700 hover:bg-purple-50">2-4 semanas</SelectItem>
        <SelectItem value="1-2-months" className="text-gray-700 hover:bg-purple-50">1-2 meses</SelectItem>
        <SelectItem value="3+-months" className="text-gray-700 hover:bg-purple-50">3+ meses</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>


              <div className="space-y-2">
                <Label htmlFor="description">Descrição do Projeto</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[120px]"
                  placeholder="Descreva seu projeto, objetivos e funcionalidades desejadas..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
            <Button
  onClick={nextStep}
  disabled={submitting}
  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none"
>
  {submitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
      Enviando...
    </>
  ) : (
    <>
      Próximo <ArrowRight className="ml-2 h-4 w-4" />
    </>
  )}
</Button>

            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Termos do Contrato</CardTitle>
              <CardDescription>Leia atentamente e assine o contrato para prosseguir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Contrato de Prestação de Serviços</h3>
                </div>

                <div className="max-h-[300px] overflow-y-auto text-sm text-gray-700">
                  <p className="mb-4">
                    <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong>
                    <br />
                    Entre Impulsioneweb e {formData.name || "[Nome do Cliente]"}
                  </p>

                  <p className="mb-4">
                    <strong>1. OBJETO DO CONTRATO</strong>
                    <br />O presente contrato tem como objeto a prestação de serviços de{" "}
                    {formData.projectType || "desenvolvimento web"} pela CONTRATADA à CONTRATANTE, conforme
                    especificações técnicas detalhadas no Anexo I.
                  </p>

                  <p className="mb-4">
                    <strong>2. PRAZO DE EXECUÇÃO</strong>
                    <br />
                    Os serviços serão executados no prazo estimado de {formData.timeline || "[prazo]"}, contados a
                    partir da assinatura deste contrato e do pagamento da primeira parcela.
                  </p>

                  <p className="mb-4">
                    <strong>3. VALOR E FORMA DE PAGAMENTO</strong>
                    <br />O valor total dos serviços será definido após análise detalhada do projeto, com base nas
                    informações fornecidas. O pagamento será realizado em parcelas, sendo a primeira no ato da
                    assinatura do contrato.
                  </p>

                  <p className="mb-4">
                    <strong>4. OBRIGAÇÕES DA CONTRATADA</strong>
                    <br />A CONTRATADA se compromete a executar os serviços conforme especificações acordadas, dentro do
                    prazo estabelecido, mantendo sigilo sobre as informações da CONTRATANTE.
                  </p>

                  <p className="mb-4">
                    <strong>5. OBRIGAÇÕES DA CONTRATANTE</strong>
                    <br />A CONTRATANTE se compromete a fornecer todas as informações necessárias para a execução dos
                    serviços, realizar os pagamentos conforme acordado e aprovar as entregas dentro dos prazos
                    estabelecidos.
                  </p>

                  <p className="mb-4">
                    <strong>6. PROPRIEDADE INTELECTUAL</strong>
                    <br />
                    Após a conclusão dos serviços e quitação total do pagamento, a propriedade intelectual dos produtos
                    desenvolvidos será transferida à CONTRATANTE.
                  </p>

                  <p>
                    <strong>7. FORO</strong>
                    <br />
                    Fica eleito o foro da comarca de São Paulo para dirimir quaisquer dúvidas ou controvérsias oriundas
                    deste contrato.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="terms" checked={formData.termsAccepted} onCheckedChange={handleCheckboxChange} />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Aceito os termos e condições do contrato
                  </label>
                  <p className="text-sm text-gray-500">
                    Ao marcar esta caixa, você concorda com os termos acima e autoriza o início do processo.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Button onClick={handleSignContract} disabled={!formData.termsAccepted}>
                Assinar e Prosseguir <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
              <CardDescription>Escolha a forma de pagamento para finalizar seu contrato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <div className="flex items-center">
                  <Check className="mr-2 h-5 w-5" />
                  <p className="font-medium">Contrato assinado com sucesso!</p>
                </div>
                <p className="mt-2 text-sm">
                  Seu contrato foi assinado digitalmente. Agora, escolha a forma de pagamento para iniciarmos seu
                  projeto.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:border-purple-200 hover:shadow">
                  <RadioGroup defaultValue="credit-card" onValueChange={setPaymentMethod}>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                          <div className="font-medium">Cartão de Crédito</div>
                          <div className="text-sm text-gray-500">Pagamento em até 12x</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="debit-card" id="debit-card" />
                        <Label htmlFor="debit-card" className="flex-1 cursor-pointer">
                          <div className="font-medium">Cartão de Débito</div>
                          <div className="text-sm text-gray-500">Pagamento à vista</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex-1 cursor-pointer">
                          <div className="font-medium">PIX</div>
                          <div className="text-sm text-gray-500">Transferência instantânea</div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                          <div className="font-medium">Boleto Bancário</div>
                          <div className="text-sm text-gray-500">Vencimento em 3 dias úteis</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <h3 className="mb-4 text-lg font-semibold">Detalhes do Pagamento</h3>

                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Número do Cartão</Label>
                            <Input id="card-number" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="card-name">Nome no Cartão</Label>
                            <Input id="card-name" placeholder="Nome como aparece no cartão" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Data de Validade</Label>
                            <Input id="expiry" placeholder="MM/AA" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="installments">Parcelas</Label>
                          <Select defaultValue="1">
                            <SelectTrigger id="installments">
                              <SelectValue placeholder="Selecione o número de parcelas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1x de R$ 1.000,00 (sem juros)</SelectItem>
                              <SelectItem value="2">2x de R$ 500,00 (sem juros)</SelectItem>
                              <SelectItem value="3">3x de R$ 333,33 (sem juros)</SelectItem>
                              <SelectItem value="6">6x de R$ 166,67 (sem juros)</SelectItem>
                              <SelectItem value="12">12x de R$ 83,33 (sem juros)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "debit-card" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="debit-number">Número do Cartão</Label>
                            <Input id="debit-number" placeholder="0000 0000 0000 0000" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="debit-name">Nome no Cartão</Label>
                            <Input id="debit-name" placeholder="Nome como aparece no cartão" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="debit-expiry">Data de Validade</Label>
                            <Input id="debit-expiry" placeholder="MM/AA" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="debit-cvv">CVV</Label>
                            <Input id="debit-cvv" placeholder="123" />
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-md text-blue-700 text-sm">
                          O valor será debitado imediatamente da sua conta.
                        </div>
                      </div>
                    )}

                    {paymentMethod === "pix" && <PixQRCode />}

                    {paymentMethod === "boleto" && <BoletoPayment />}
                  </motion.div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
              <Link href="/pagamento-sucesso">
                <Button>
                  Finalizar Pagamento <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
