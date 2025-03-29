import Image from "next/image";
import about1Img from '../../../public/tecnologia-rh-tendencias.jpg'
import { Check, MapPin } from "lucide-react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export function About() {
  return (
    <section className="bg-[#FDF6ec] py-16">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative" data-aos="fade-up-right" data-aos-delay="300">
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden">
              <Image
                src={about1Img}
                alt="Imagem sobre tecnologia e inovação"
                fill
                quality={100}
                className="object-cover hover:scale-110 duration-300"
                priority
              />
            </div>
          </div>
          <div className="space-y-6 mt-10" data-aos="fade-up-left" data-aos-delay="300">
            <h2 className="text-4xl font-bold">SOBRE NÓS</h2>
            <p>
              Somos uma startup inovadora especializada no desenvolvimento de sites, sistemas empresariais e estratégias de marketing digital. Nossa missão é transformar ideias em soluções tecnológicas eficientes, ajudando empresas a se destacarem no mercado digital.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <Check className="text-red-500" />
                Experiência consolidada em tecnologia e inovação.
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-red-500" />
                Soluções personalizadas para cada negócio.
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-red-500" />
                Compromisso com a qualidade e satisfação do cliente.
              </li>
            </ul>
            <div className="flex gap-2">
              <a
                target='_blank'
                href={`https://wa.me/5579999383543?text=Olá, vi seu site e gostaria de mais informações sobre seus serviços.`}
                className="bg-[#E84C3D] text-white flex items-center justify-center w-fit gap-2 px-4 py-2 rounded-md"
              >
                <WhatsappLogo className="w-5 h-5 text-white" />
                Contato via WhatsApp
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-fit gap-2 px-4 py-2 rounded-md"
              >
                <MapPin className="w-5 h-5 text-black" />
                Nossa Localização
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
