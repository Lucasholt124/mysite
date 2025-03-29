
import { InstagramLogo, LinkedinLogo, GithubLogo } from '@phosphor-icons/react/dist/ssr';
const services =  [
  "Desenvolvimento de Sitemas",
  "Sistemas Empresariais",
  "E-commerce",
  "Funil de Vendas",
  "Marketing Digital",
  "Gestão de Tráfego Pago"
];

export function Footer() {
  return (
    <section className="bg-[#1E293B] py-16 text-white" data-aos="zoom-in-down">
      <div className='container mx-auto px-4'>

        <div className='border-b border-white/20 pb-8'>
          <h4 className='text-3xl font-semibold mb-8 text-center'>Nossos Serviços</h4>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {services.map((service, index) => (
              <div key={index} className='bg-white p-4 rounded-lg text-black font-semibold'>
                {service}
              </div>
            ))}
          </div>
        </div>

        <footer className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 mt-5' data-aos="flip-up">
          <div>
            <h3 className='text-2xl font-semibold mb-2'>Sobre Nós</h3>
            <p className='mb-4'>Fornecemos soluções digitais inovadoras para transformar negócios locais em grandes marcas online.</p>
            <a data-aos="flip-up"
              href="#"
              className='bg-green-500 px-4 py-2 rounded-md'
            >
              Contato via WhatsApp
            </a>
          </div>

          <div>
            <h3 className='text-2xl font-semibold mb-2'>Contatos</h3>
            <p>Email: Lucatavares321@hotmail.com</p>
            <p>Telefone: (79) 99938-3543</p>
            <p>Rua Antônio Mendonça, Centro, Ribeiropolis-SE</p>
          </div>

          <div>
            <h3 className='text-2xl font-semibold mb-2'>Redes sociais</h3>
            <div className='flex gap-4'>
              <a data-aos="flip-up" href="https://www.linkedin.com/in/lucas-arag%C3%A3o-front-end/" target='_blank'>
                <LinkedinLogo className='w-8 h-8' />
              </a>
              <a data-aos="flip-up" href="https://www.instagram.com/impulsioneweb_?igsh=ajN3dHE3dnRqcDcz" target='_blank'>
                <InstagramLogo className='w-8 h-8' />
              </a>
              <a data-aos="flip-up" href="https://github.com/Lucasholt124" target='_blank'>
                <GithubLogo className='w-8 h-8' />
              </a>
            </div>
          </div>
        </footer>

      </div>
    </section>
  );
}
