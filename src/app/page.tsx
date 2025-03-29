import React from 'react'
import Hero from './_components/hero'
import { About } from './_components/about';
import { Services } from './_components/services';
import { Testimonials } from './_components/testimonials';
import { Footer } from './_components/footer';

const page = () => {
  return (
    <main>
      <Hero/>
      <About/>
      <Services />
      <Testimonials/>
      <Footer/>
    </main>
  )
}

export default page