"use client"

import Link from "next/link"
import { Instagram, Linkedin, Mail, MapPin, Phone, LucideIcon } from "lucide-react"

// --- Melhoria: Centralização de Dados ---
// Todos os dados do rodapé estão aqui, facilitando a manutenção.

const socialLinks: { href: string; label: string; icon: LucideIcon }[] = [
  {
    href: "https://www.instagram.com/impulsioneweb_?igsh=ajN3dHE3dnRqcDcz",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.linkedin.com/in/lucas-arag%C3%A3o-fullstack/",
    label: "LinkedIn",
    icon: Linkedin,
  },
]

const serviceLinks = [
  { label: "Criação de Sites", href: "/#servicos" },
  { label: "Sistemas Web", href: "/#servicos" },
  { label: "UI/UX Design", href: "/#servicos" },
  { label: "Plataformas Digitais", href: "/#servicos" },
]

const quickLinks = [
  { label: "Início", href: "/" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Portfólio", href: "/#portfolio" }, // Adicionado Portfólio como exemplo
  { label: "Contato", href: "/#contato" },
]

const contactInfo = [
    { icon: MapPin, text: "Atendimento Remoto | Ribeirópolis-SE", href: null },
    { icon: Phone, text: "(79) 99938-3543", href: "tel:+5579999383543" },
    { icon: Mail, text: "lucasholt2021@gmail.com", href: "mailto:lucasholt2021@gmail.com" },
]

// --- Melhoria: Componente Reutilizável para Colunas de Links (Princípio DRY) ---
function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <ul className="space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group text-gray-400 transition-colors duration-300 hover:text-white"
            >
              <span className="group-hover:text-purple-400">›</span> {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Coluna de Branding */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-2xl font-bold text-white transition-transform hover:scale-105">
                Impulsione<span className="text-purple-400">web</span>
              </h3>
            </Link>
            <p className="mb-6 text-gray-400 text-sm leading-relaxed max-w-xs">
              Transformando ideias em soluções digitais que geram resultados e impulsionam o crescimento do seu negócio.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-gray-400 transition-all duration-300 hover:text-purple-400 hover:-translate-y-1"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Coluna de Serviços (Reutilizando Componente) */}
          <FooterLinkColumn title="Nossos Serviços" links={serviceLinks} />

          {/* Coluna de Links Rápidos (Reutilizando Componente) */}
          <FooterLinkColumn title="Navegação" links={quickLinks} />

          {/* Coluna de Contato */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Fale Conosco</h3>
            <address className="not-italic space-y-3 text-sm text-gray-400">
              {contactInfo.map((item, index) => {
                  const Icon = item.icon
                  const content = (
                      <div className="flex items-start">
                          <Icon className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-purple-400" />
                          <span>{item.text}</span>
                      </div>
                  );
                  return item.href ? (
                      <a key={index} href={item.href} className="transition-colors duration-300 hover:text-white">{content}</a>
                  ) : (
                      <div key={index}>{content}</div>
                  );
              })}
            </address>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Impulsioneweb. Criado e desenvolvido por Lucas Aragão.
          </p>
        </div>
      </div>
    </footer>
  )
}