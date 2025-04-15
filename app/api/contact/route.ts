import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// Instância do Resend com chave de API
const resend = new Resend(process.env.RESEND_API_KEY);

// Envia o e-mail com os dados do formulário
const sendEmail = async (data: ContactData) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM || "contato@seudominio.com", // Precisa estar verificado na Resend
      to: [process.env.CONTACT_EMAIL || "voce@seudominio.com"],
      subject: `Nova mensagem de contato de ${data.name}`,
      html: `
        <h3>Nova mensagem de contato</h3>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone || "Não informado"}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (response.error) {
      console.error("Erro no envio do e-mail:", response.error);
      return { success: false, error: response.error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar com Resend:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

// Validação básica dos dados
const validateContactData = (data: ContactData): string | null => {
  if (!data.name || !data.email || !data.message) {
    return "Por favor, preencha todos os campos obrigatórios.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return "Por favor, forneça um endereço de e-mail válido.";
  }

  return null;
};

// API handler (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json() as ContactData;

    const validationError = validateContactData(body);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const { success, error } = await sendEmail(body);

    if (!success) {
      return NextResponse.json(
        { success: false, message: `Erro ao enviar e-mail: ${error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
