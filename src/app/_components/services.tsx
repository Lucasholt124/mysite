"use client"

import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Code, Globe, BarChart, Clock } from 'lucide-react'
import { WhatsappLogo } from '@phosphor-icons/react'

const services = [
  {
    title: "Desenvolvimento de Sites",
    description: "Criação de sites modernos, responsivos e otimizados para SEO, garantindo uma presença digital forte para sua empresa.",
    duration: "Prazo variável",
    price: "Sob consulta",
    icon: <Globe />,
    linkText: 'Olá, vi no site sobre Desenvolvimento de Sites e gostaria de mais informações.'
  },
  {
    title: "Sistemas Empresariais",
    description: "Desenvolvimento de sistemas personalizados para otimizar processos empresariais, incluindo automação e integrações com APIs.",
    duration: "Prazo variável",
    price: "Sob consulta",
    icon: <Code />,
    linkText: 'Olá, vi no site sobre Sistemas Empresariais e gostaria de mais informações.'
  },
  {
    title: "Marketing Digital",
    description: "Serviços de tráfego pago, gestão de redes sociais e estratégias para aumentar a conversão e engajamento do seu negócio.",
    duration: "Serviço contínuo",
    price: "Sob consulta",
    icon: <BarChart />,
    linkText: 'Olá, vi no site sobre Marketing Digital e gostaria de mais informações.'
  }
]

export function Services() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 3 }
    }
  })

  function scrollPrev() {
    emblaApi?.scrollPrev();
  }

  function scrollNext() {
    emblaApi?.scrollNext();
  }

  return (
    <section className="bg-white py-16" data-aos="fade-down"
    data-aos-easing="linear"
    data-aos-duration="1500">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12">Serviços</h2>
        <div className="relative">
          <div className='overflow-hidden' ref={emblaRef}>
            <div className='flex'>
              {services.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(100%/3)] px-3">
                  <article className="bg-[#1e293b] text-white rounded-2xl p-6 space-y-4 h-full flex flex-col">
                    <div className='flex-1 flex items-start justify-between'>
                      <div className='flex gap-3'>
                        <span className='text-3xl'>{item.icon}</span>
                        <div>
                          <h3 className='font-bold text-xl my-1'>{item.title}</h3>
                          <p className='text-gray-400 text-sm select-none'>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='border-t border-gray-700 pt-4 flex items-center justify-between'>
                      <div className='flex items-center gap-2 text-sm'>
                        <Clock className='w-4 h-4' />
                        <span>{item.duration}</span>
                      </div>
                      <a
                      data-aos="fade-down"
                      data-aos-easing="linear"
                      data-aos-duration="1500"
                        target='_blank'
                        href={`https://wa.me/5579999383543?text=${encodeURIComponent(item.linkText)}`}
                        className='flex items-center justify-center gap-2 hover:bg-red-500 px-4 py-1 rounded-md duration-300'
                      >
                        <WhatsappLogo className='w-5 h-5' />
                        Entrar em contato
                      </a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
          <button
            className='bg-white flex items-center justify-center rounded-full shadow-lg w-10 h-10 absolute left-3 -translate-y-1/2 -translate-x-1/2 top-1/2 z-10'
            onClick={scrollPrev}
          >
            <ChevronLeft className='w-6 h-6 text-gray-600' />
          </button>
          <button
            className='bg-white flex items-center justify-center rounded-full shadow-lg w-10 h-10 absolute -right-6 -translate-y-1/2 -translate-x-1/2 top-1/2 z-10'
            onClick={scrollNext}
          >
            <ChevronRight className='w-6 h-6 text-gray-600' />
          </button>
        </div>
      </div>
    </section>
  )
}
