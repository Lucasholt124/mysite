import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"
import AnimatedCounter from "@/components/animated-counter"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />

      {/* Stats Section */}
      <section className="w-full bg-gradient-to-r from-purple-900 to-indigo-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { value: 150, label: "Projetos Entregues" },
              { value: 98, label: "Clientes Satisfeitos" },
              { value: 5, suffix: "+", label: "Anos de Experiência" },
            ].map(({ value, label, suffix = "" }) => (
              <div key={label} className="flex flex-col items-center text-center text-white">
                <AnimatedCounter value={value} duration={2} suffix={suffix} />
                <p className="mt-2 text-lg">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServicesSection />
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="w-full bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
            Pronto para impulsionar seu negócio?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Transforme sua presença digital com soluções personalizadas que realmente funcionam.
          </p>
          <Link
            href="/contrato"
            className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      <ContactSection />
    </main>
  )
}
