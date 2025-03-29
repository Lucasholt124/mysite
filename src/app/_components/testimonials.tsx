"use client"

import useEmblaCarousel from 'embla-carousel-react'
import client2 from '../../../public/Imagem do WhatsApp de 2025-03-28 à(s) 17.29.47_c8d6807a.jpg'
import client3 from '../../../public/images.jpg'
import client1 from '../../../public/Rafael-Cardoso.webp'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  {
    content:
      "A equipe desenvolveu um site incrível para o meu negócio! Agora tenho uma presença online profissional e já comecei a atrair novos clientes. O suporte foi excelente e o resultado superou minhas expectativas!",
    author: "Wislla Souza",
    role: "Empreendedora",
    image: client2,
  },
  {
    content:
      "Precisávamos de um sistema personalizado para gerenciar nossos pedidos e estoque. O software desenvolvido trouxe muito mais eficiência para nossa empresa. Recomendo os serviços sem hesitar!",
    author: "Rafael Lima",
    role: "Gerente de Loja",
    image: client1,
  },
  {
    content: "Nosso marketing digital melhorou significativamente desde que contratamos os serviços. A equipe criou campanhas estratégicas que aumentaram nosso alcance e engajamento. Estamos muito satisfeitos!",
    author: "Camila Fernandes",
    role: "CEO de Startup",
    image: client3,
  },
]

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true
  })

  function scrollPrev() {
    emblaApi?.scrollPrev();
  }

  function scrollNext() {
    emblaApi?.scrollNext();
  }

  return (
    <section className="bg-[#12E19F] py-16" data-aos="zoom-out-up">
      <div className="container mx-auto px-4" data-aos="zoom-out-up">
        <h2 className="text-4xl font-bold text-center mb-12">Depoimentos dos nossos clientes</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className='overflow-hidden' ref={emblaRef}>
            <div className='flex'>
              {testimonials.map((item, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0 px-3">
                  <article className="bg-[#1e293b] text-white rounded-2xl p-6 space-y-4 h-full flex flex-col">
                    <div className='flex flex-col items-center text-center space-y-4'>
                      <div className='relative w-24 h-24'>
                        <Image
                          src={item.image}
                          alt={item.author}
                          fill
                          sizes='96px'
                          className='object-cover rounded-full'
                        />
                      </div>
                      <p className='text-gray-200'>{item.content}</p>
                      <div>
                        <p className='font-bold'>{item.author}</p>
                        <p className='text-sm text-gray-400'>{item.role}</p>
                      </div>
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
