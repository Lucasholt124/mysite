/**
 * Funções de validação para CPF e CNPJ
 */

// Remove caracteres não numéricos
export function cleanDocumentNumber(value: string): string {
    return value.replace(/\D/g, "")
  }

  // Formata CPF: 000.000.000-00
  export function formatCPF(value: string): string {
    const cleaned = cleanDocumentNumber(value)

    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`
    } else if (cleaned.length <= 9) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`
    } else {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`
    }
  }

  // Formata CNPJ: 00.000.000/0001-00
  export function formatCNPJ(value: string): string {
    const cleaned = cleanDocumentNumber(value)

    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 5) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`
    } else if (cleaned.length <= 8) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
    } else if (cleaned.length <= 12) {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`
    } else {
      return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`
    }
  }

  // Formata automaticamente como CPF ou CNPJ dependendo do comprimento
  export function formatDocument(value: string): string {
    const cleaned = cleanDocumentNumber(value)

    // Se tiver mais de 11 dígitos, trata como CNPJ
    if (cleaned.length > 11) {
      return formatCNPJ(cleaned)
    }

    // Caso contrário, trata como CPF
    return formatCPF(cleaned)
  }

  // Verifica se o CPF é válido
  export function isValidCPF(cpf: string): boolean {
    const cleaned = cleanDocumentNumber(cpf)

    // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) {
      return false
    }

    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1+$/.test(cleaned)) {
      return false
    }

    // Calcula o primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cleaned.charAt(i)) * (10 - i)
    }

    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder

    // Calcula o segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cleaned.charAt(i)) * (11 - i)
    }

    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder

    // Verifica se os dígitos verificadores estão corretos
    return Number.parseInt(cleaned.charAt(9)) === digit1 && Number.parseInt(cleaned.charAt(10)) === digit2
  }

  // Verifica se o CNPJ é válido
  export function isValidCNPJ(cnpj: string): boolean {
    const cleaned = cleanDocumentNumber(cnpj)

    // Verifica se tem 14 dígitos
    if (cleaned.length !== 14) {
      return false
    }

    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1+$/.test(cleaned)) {
      return false
    }

    // Calcula o primeiro dígito verificador
    let size = cleaned.length - 2
    let numbers = cleaned.substring(0, size)
    const digits = cleaned.substring(size)
    let sum = 0
    let pos = size - 7

    for (let i = size; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (result !== Number.parseInt(digits.charAt(0))) {
      return false
    }

    // Calcula o segundo dígito verificador
    size = size + 1
    numbers = cleaned.substring(0, size)
    sum = 0
    pos = size - 7

    for (let i = size; i >= 1; i--) {
      sum += Number.parseInt(numbers.charAt(size - i)) * pos--
      if (pos < 2) pos = 9
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11)

    return result === Number.parseInt(digits.charAt(1))
  }

  // Verifica se o documento (CPF ou CNPJ) é válido
  export function isValidDocument(document: string): boolean {
    const cleaned = cleanDocumentNumber(document)

    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cleaned.length === 11) {
      return isValidCPF(cleaned)
    } else if (cleaned.length === 14) {
      return isValidCNPJ(cleaned)
    }

    // Se não for nem CPF nem CNPJ, é inválido
    return false
  }

  // Identifica o tipo de documento
  export function getDocumentType(document: string): "cpf" | "cnpj" | "invalid" {
    const cleaned = cleanDocumentNumber(document)

    if (cleaned.length === 11) {
      return "cpf"
    } else if (cleaned.length === 14) {
      return "cnpj"
    }

    return "invalid"
  }
