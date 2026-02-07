"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  LucideIcon,
  ArrowRight,
  Heart,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Globe,
} from "lucide-react"
import { motion, useInView } from "framer-motion"

const WHATSAPP_LINK =
  "https://wa.me/5579999383543?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20um%20projeto.%20Podemos%20falar%3F"

const PORTFOLIO_LINK = "https://new-portfolio-delta-blond.vercel.app/"

const socialLinks: {
  href: string
  label: string
  icon: LucideIcon
  gradient: string
  hoverBg: string
}[] = [
  {
    href: "https://www.instagram.com/impulsioneweb_?igsh=ajN3dHE3dnRqcDcz",
    label: "Instagram",
    icon: Instagram,
    gradient: "from-pink-500 via-purple-500 to-orange-500",
    hoverBg: "hover:bg-pink-500/10 hover:border-pink-500/30",
  },
  {
    href: "https://www.linkedin.com/in/lucas-arag%C3%A3o-fullstack/",
    label: "LinkedIn",
    icon: Linkedin,
    gradient: "from-blue-500 to-blue-600",
    hoverBg: "hover:bg-blue-500/10 hover:border-blue-500/30",
  },
]

const serviceLinks = [
  { label: "Criação de Sites", href: "/#servicos" },
  { label: "Sistemas Web", href: "/#servicos" },
  { label: "UI/UX Design", href: "/#servicos" },
  { label: "Plataformas Digitais", href: "/#servicos" },
  { label: "Manutenção", href: "/#servicos" },
]

const quickLinks = [
  { label: "Início", href: "/", external: false },
  { label: "Serviços", href: "/#servicos", external: false },
  { label: "Portfólio", href: PORTFOLIO_LINK, external: true },
  { label: "Depoimentos", href: "/#depoimentos", external: false },
  { label: "Contato", href: "/#contato", external: false },
]

const contactInfo: {
  icon: LucideIcon
  text: string
  href: string | null
  label: string
}[] = [
  {
    icon: MapPin,
    text: "Atendimento Remoto | Ribeirópolis-SE",
    href: null,
    label: "Localização",
  },
  {
    icon: Phone,
    text: "(79) 99938-3543",
    href: "tel:+5579999383543",
    label: "Telefone",
  },
  {
    icon: Mail,
    text: "lucasholt2021@gmail.com",
    href: "mailto:lucasholt2021@gmail.com",
    label: "Email",
  },
]

// Coluna de links reutilizável
function FooterLinkColumn({
  title,
  links,
  index,
  isInView,
}: {
  title: string
  links: { label: string; href: string; external?: boolean }[]
  index: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
        <span className="h-px w-4 bg-gradient-to-r from-purple-500 to-transparent" />
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link, ) => {
          const isExternal = link.external

          const linkContent = (
            <motion.span
              className="group flex items-center gap-2 text-sm text-gray-400 transition-all duration-300 hover:text-white"
              whileHover={{ x: 4 }}
            >
              <span className="h-1 w-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 group-hover:shadow-sm group-hover:shadow-purple-400/50 transition-all duration-300" />
              <span>{link.label}</span>
              {isExternal && (
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
              )}
            </motion.span>
          )

          return (
            <li key={link.label}>
              {isExternal ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkContent}
                </a>
              ) : (
                <Link href={link.href}>{linkContent}</Link>
              )}
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <footer className="relative w-full overflow-hidden bg-gray-950 text-white">
      {/* Decoração de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradiente superior */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* Orbs */}
        <motion.div
          className="absolute -top-40 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/[0.05] blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-600/[0.04] blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.04, 0.07, 0.04],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Grid sutil */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Newsletter / CTA superior */}
      <div className="relative border-b border-white/[0.06]">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6 md:flex-row md:justify-between"
          >
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold md:text-2xl flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Pronto para transformar sua presença digital?
              </h3>
              <p className="mt-2 text-sm text-gray-400 max-w-md">
                Entre em contato agora e receba um orçamento personalizado
                para o seu projeto.
              </p>
            </div>

            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group"
            >
              {/* Glow */}
              <motion.div
                className="absolute -inset-1 rounded-2xl blur-md pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #22c55e, #10b981)",
                }}
                animate={{ opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-green-500/20 transition-all duration-300 overflow-hidden">
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.2) 55%, transparent 60%)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["-100% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />

                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Falar no WhatsApp</span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </div>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo principal do footer */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Branding — 4 colunas */}
          <motion.div
            className="sm:col-span-2 lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-5">
              {/* Logo icon */}
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20"
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-white font-black text-lg">I</span>
              </motion.div>

              <div>
                <h3 className="text-xl font-extrabold tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                    Impulsione
                  </span>
                  <span className="text-white">web</span>
                </h3>
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-purple-400/60">
                  Soluções Digitais
                </span>
              </div>
            </Link>

            <p className="mb-6 text-sm text-gray-400 leading-relaxed max-w-xs">
              Transformamos ideias em{" "}
              <span className="text-white/80 font-medium">
                soluções digitais de alto impacto
              </span>{" "}
              que geram resultados e impulsionam o crescimento do seu negócio.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social, i) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 transition-all duration-300 ${social.hoverBg} hover:text-white`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                )
              })}

              {/* WhatsApp social */}
              <motion.a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-400 transition-all duration-300 hover:bg-green-500/10 hover:border-green-500/30 hover:text-white"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{ delay: 0.6 }}
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
            </div>

            {/* Status badge */}
            <motion.div
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5"
              initial={{ opacity: 0, y: 10 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[11px] text-gray-500 font-medium">
                Disponível para novos projetos
              </span>
            </motion.div>
          </motion.div>

          {/* Serviços — 2 colunas */}
          <div className="lg:col-span-2 lg:col-start-6">
            <FooterLinkColumn
              title="Serviços"
              links={serviceLinks}
              index={1}
              isInView={isInView}
            />
          </div>

          {/* Navegação — 2 colunas */}
          <div className="lg:col-span-2">
            <FooterLinkColumn
              title="Navegação"
              links={quickLinks}
              index={2}
              isInView={isInView}
            />
          </div>

          {/* Contato — 3 colunas */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 0.6,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
              <span className="h-px w-4 bg-gradient-to-r from-purple-500 to-transparent" />
              Fale Conosco
            </h3>

            <address className="not-italic space-y-3">
              {contactInfo.map((item, i) => {
                const Icon = item.icon
                const content = (
                  <motion.div
                    className="group flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.08]"
                    whileHover={{ x: 3 }}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/15 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                        {item.label}
                      </span>
                      <span className="block text-sm text-gray-400 group-hover:text-white transition-colors truncate">
                        {item.text}
                      </span>
                    </div>
                    {item.href && (
                      <ExternalLink className="h-3.5 w-3.5 text-gray-600 group-hover:text-purple-400 transition-colors shrink-0 mt-2 ml-auto" />
                    )}
                  </motion.div>
                )

                return item.href ? (
                  <a
                    key={i}
                    href={item.href}
                    className="block"
                    target={
                      item.href.startsWith("tel") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={i}>{content}</div>
                )
              })}
            </address>

            {/* Horário */}
            <motion.div
              className="mt-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-2 text-xs">
                <Globe className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-gray-500">
                  Horário:{" "}
                  <span className="text-gray-300 font-medium">
                    Seg–Sex, 8h–18h
                  </span>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="relative border-t border-white/[0.06]">
        {/* Gradiente na borda */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <motion.p
              className="text-sm text-gray-500 flex items-center gap-1.5 flex-wrap justify-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1 }}
            >
              &copy; {new Date().getFullYear()} Impulsioneweb. Feito com
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400 inline" />
              </motion.span>
              por{" "}
              <a
                href={PORTFOLIO_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                Lucas Aragão
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </motion.p>

            <motion.div
              className="flex items-center gap-4 text-xs text-gray-600"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 1.1 }}
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-gray-500 hover:text-white hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300"
              >
                <motion.svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={{ y: [0, -2, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <polyline points="18 15 12 9 6 15" />
                </motion.svg>
                <span className="text-[11px] font-medium">Voltar ao topo</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}