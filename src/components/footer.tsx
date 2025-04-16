"use client"

import Link from "next/link"
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold text-white">
              Impulsione<span className="text-purple-400">web</span>
            </h3>
            <p className="mb-6 text-gray-400 text-sm leading-relaxed">
              Soluções digitais completas para impulsionar seu negócio no ambiente online.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/impulsioneweb_?igsh=ajN3dHE3dnRqcDcz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/lucas-arag%C3%A3o-fullstack/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-purple-400 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Criação de Sites
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Desenvolvimento de Sistemas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Marketing Digital
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Consultoria Digital
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#servicos" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/contrato" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Iniciar Projeto
                </Link>
              </li>
              <li>
                <Link href="/#contato" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Contato</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-purple-400" />
                Ribeirópolis-SE
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-purple-400" />
                (79) 99938-3543
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-purple-400" />
                lucasholt2021@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Impulsioneweb. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
