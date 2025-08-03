import { NextResponse } from "next/server"
import nodemailer from 'nodemailer'

// Esta é uma rota alternativa para envio de email usando Nodemailer
// Você pode escolher qual implementação usar baseado no seu provedor de email preferido

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

    const transporter = nodemailer.createTransport({

      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: 'seu-email@exemplo.com',
      subject: `Nova mensagem de contato de ${body.name}`,
      text: `
        Nome: ${body.name}
        Email: ${body.email}
        Telefone: ${body.phone || 'Não informado'}
        Mensagem: ${body.message}
      `,
      html: `
        <h3>Nova mensagem de contato</h3>
        <p><strong>Nome:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Telefone:</strong> ${body.phone || 'Não informado'}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log('Transporter:', transporter)

    // Simulando o envio de email para demonstração
    console.log("Enviando email com os dados:", body)

    // Simulando um pequeno atraso
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar mensagem de contato:", error)

    return NextResponse.json(
      { success: false, message: "Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde." },
      { status: 500 },
    )
  }
}
