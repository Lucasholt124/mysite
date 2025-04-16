import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"
import MaintenanceSection from "@/components/maintenance-section"
import AnimatedCounter from "@/components/animated-counter"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />

      {/* Stats Section */}
      <section className="w-full bg-gradient-to-r from-purple-900 to-indigo-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center text-white">
              <AnimatedCounter value={150} duration={2} />
              <p className="mt-2 text-lg">Projetos Entregues</p>
            </div>
            <div className="flex flex-col items-center text-center text-white">
              <AnimatedCounter value={98} duration={2} />
              <p className="mt-2 text-lg">Clientes Satisfeitos</p>
            </div>
            <div className="flex flex-col items-center text-center text-white">
              <AnimatedCounter value={5} suffix="+" duration={2} />
              <p className="mt-2 text-lg">Anos de Experiência</p>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      <MaintenanceSection />
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="w-full bg-white py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
            Pronto para impulsionar seu negócio?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Transforme sua presença digital com soluções personalizadas que realmente funcionam.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
            <Link
              href="/contrato"
              className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-lg font-medium text-white transition-all hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
            >
              Começar Projeto <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/contrato?type=maintenance"
              className="inline-flex items-center rounded-lg border-2 border-purple-600 bg-transparent px-6 py-3 text-lg font-medium text-purple-600 transition-all hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-950"
            >
              Planos de Manutenção
            </Link>
          </div>
        </div>
      </section>

      <ContactSection />
    </main>
  )
}
