import Link from "next/link"
import {
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca e redes sociais */}
          <div>
            <h3 className="mb-4 text-2xl font-bold text-white">
              Inpulsione
              <span className="text-purple-500">web</span>
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Soluções digitais completas para impulsionar seu negócio no ambiente online.
            </p>
            <div className="flex gap-4">
              {[ Instagram, Linkedin].map((Icon, idx) => (
                <Link key={idx} href="https://www.instagram.com/impulsioneweb_?igsh=ajN3dHE3dnRqcDcz" className="group">
                  <Icon className="h-5 w-5 text-gray-400 transition-colors group-hover:text-purple-400" />
                  <span className="sr-only">Rede social</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Serviços</h4>
            <ul className="space-y-2 text-sm">
              {[
                "Criação de Sites",
                "Desenvolvimento de Sistemas",
                "Marketing Digital",
                "UI/UX Design",
                "Consultoria Digital",
              ].map((service, idx) => (
                <li key={idx}>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links rápidos */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-purple-400">Home</Link></li>
              <li><Link href="/#servicos" className="text-gray-400 hover:text-purple-400">Serviços</Link></li>
              <li><Link href="/contrato" className="text-gray-400 hover:text-purple-400">Iniciar Projeto</Link></li>
              <li><Link href="/#contato" className="text-gray-400 hover:text-purple-400">Contato</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Contato</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="mr-3 mt-0.5 h-5 w-5 text-purple-500" />
                <span>
                  Remoto<br />
                  Ribeirópolis-SE
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-purple-500" />
                <span>(79) 99938-3543</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-purple-500" />
                <span>lucasholt2021@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} <span className="text-white font-medium">Inpulsioneweb</span>. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
