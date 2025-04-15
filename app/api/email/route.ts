import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailData {
  name: string
  email: string
  phone?: string
  message: string
}

export async function POST(request: Request) {
  try {
    const body: EmailData = await request.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: "Por favor, preencha todos os campos obrigatórios." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "Por favor, forneça um endereço de e-mail válido." },
        { status: 400 }
      )
    }

    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f8f9fa; padding: 24px; color: #333;">
        <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <h2 style="color: #1e40af; margin-bottom: 16px;">📬 Nova mensagem de contato</h2>
          <p><strong>Nome:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Telefone:</strong> ${body.phone || "Não informado"}</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="margin-bottom: 8px;"><strong>Mensagem:</strong></p>
          <p style="line-height: 1.6;">${(body.message || "").replace(/\n/g, "<br>")}</p>
          <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <footer style="text-align: center; font-size: 12px; color: #6b7280;">
            Mensagem enviada através do site <strong>InpulsioneWeb</strong><br/>
            © ${new Date().getFullYear()} InpulsioneWeb. Todos os direitos reservados.
          </footer>
        </div>
      </div>
    `

    const response = await resend.emails.send({
      from: "contato@inpulsioneweb.com",
      to: process.env.EMAIL_TO || "lucasholt2021@gmail.com",
      subject: `📨 Novo contato de ${body.name}`,
      html: htmlContent,
    })

    if (response.error) {
      console.error("Erro ao enviar e-mail com Resend:", response.error)
      throw new Error(response.error.message)
    }

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" }, { status: 200 })
  } catch (error) {
    console.error("[ERRO - API /api/contact]", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao processar a mensagem. Por favor, tente novamente mais tarde.",
      },
      { status: 500 }
    )
  }
}
