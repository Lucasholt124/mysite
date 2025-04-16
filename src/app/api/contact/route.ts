import { NextResponse } from "next/server"
import nodemailer from 'nodemailer';

interface EmailData {
  name: string;
  email: string;
  phone?: string; // Optional field
  message: string;
}

// Função para enviar email usando as variáveis de ambiente configuradas
async function sendEmail(data: EmailData) {
  try {
    // Verificar se as variáveis de ambiente necessárias estão configuradas
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log("Variáveis de ambiente de email não configuradas. Simulando envio.")
      console.log("Dados do email:", data)
      return true
    }

    // Aqui você implementaria o código real para enviar email
    // usando as variáveis de ambiente configuradas

    // Exemplo com Nodemailer (você precisará instalar o pacote):


    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'contato@inpulsioneweb.com',
      to: 'seu-email@exemplo.com',
      subject: `Nova mensagem de contato de ${data.name}`,
      text: `
        Nome: ${data.name}
        Email: ${data.email}
        Telefone: ${data.phone || 'Não informado'}
        Mensagem: ${data.message}
      `,
      html: `
        <h3>Nova mensagem de contato</h3>
        <p><strong>Nome:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Telefone:</strong> ${data.phone || 'Não informado'}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);


    return true
  } catch (error) {
    console.error("Erro ao enviar email:", error)
    throw error
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validação básica dos dados
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: "Por favor, preencha todos os campos obrigatórios." },
        { status: 400 },
      )
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "Por favor, forneça um endereço de email válido." },
        { status: 400 },
      )
    }

    // Enviar email
    await sendEmail({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    })

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar mensagem de contato:", error)

    return NextResponse.json(
      { success: false, message: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde." },
      { status: 500 },
    )
  }
}
