import React from 'react'
import { WhatsappLogo } from '@phosphor-icons/react/dist/ssr'
import MyImg from '../../../public/Imagem do WhatsApp de 2025-03-28 à(s) 10.13.05_7d53ee59.png'
import GrennLogo from '../../../public/Green and White Simple Technology Logo.png'
import Image from 'next/image';

const hero = () => {
  return (
    <section className="bg-[#01081C] text-white relative overflow-hidden">

    <div>

      <Image
       data-aos="flip-left"
       data-aos-easing="ease-out-cubic"
       data-aos-duration="2000"
        src={MyImg}
        alt='Minha imagem'
        fill
        sizes='100vw'
        priority
        className='object-cover opacity-60 lg:hidden'

      />
      <div className='absolute inset-0 bg-black opacity-40 md:hidden'></div>
    </div>

    <div className="container mx-auto pt-16 pb-16 md:pb-0 px-4 relative">

      <article className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="space-y-6">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-10"
            data-aos="fade-down"
          >
            Agora você irá ter grande facilidade no digital
          </h1>
          <p className=" lg:text-lg" data-aos="fade-right">
            Oferecemos os melhores serviços para impulsionar seus negócios

          </p>


          <a
            data-aos="fade-up"
            data-aos-delay="500"
            target='_blank'
            href={`https://wa.me/5579999383543?text=Olá vim pelo site e gostaria de mais informações`}
            className="bg-green-500 px-5 py-2 rounded-md font-semibold flex items-center justify-center w-fit gap-2"
          >
            <WhatsappLogo className='w-5 h-5' />
            Contato via WhatsApp
          </a>

          <div className="mt-8">
            <p className="text-sm mb-4" data-aos="fade-down"
     data-aos-easing="linear"
     data-aos-duration="1500">
              <b className="bg-green-500 text-white px-2 py-1 rounded-md">5%</b> de desconto no primeiro mês
            </p>

            <div className='flex mt-4'>
              <div className='w-32 hidden lg:block'>
                <Image
                data-aos="flip-left"
                data-aos-easing="ease-out-cubic"
                data-aos-duration="2000"
                  src={MyImg}
                  alt="Foto do gato"
                  quality={100}
                  className='object-fill'
                />
              </div>
            </div>
          </div>

        </div>

        <div className="hidden md:block h-full relative">
          <Image
           data-aos="flip-left"
           data-aos-easing="ease-out-cubic"
           data-aos-duration="2000"
            src={GrennLogo}
            alt='Minha foto'
            className='object-contain'
            fill
            sizes="(max-width: 768px) 0vw, 50vw"
            quality={100}
            priority
          />
        </div>

      </article>

    </div>


  </section>
  )
}

export default hero