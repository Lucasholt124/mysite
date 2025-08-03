import HeroSection from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import ServicesSection from "@/components/services-section"
import MaintenanceSection from "@/components/maintenance-section"
import TestimonialsSection from "@/components/testimonials-section"
import CtaSection from "@/components/cta-section"
import ContactSection from "@/components/contact-section"
import SectionDivider from "@/components/section-divider"

// --- O código da sua página agora é uma elegante orquestração de componentes ---
export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <HeroSection />

      {/* O divisor cria uma transição suave da seção Hero (branca no final) para a seção de Stats (escura) */}
      <SectionDivider color="#111827" flip={true} />

      <StatsSection />

      {/* Transição da seção de Stats (escura) para a de Serviços (branca) */}
      <SectionDivider color="#FFFFFF" />

      <ServicesSection />
      <MaintenanceSection />
      <TestimonialsSection />

      {/* Transição da seção de Testimonials (cinza claro) para a CTA (escura) */}
      <SectionDivider color="#111827" flip={true} />

      <CtaSection />

      {/* Transição da CTA (escura) para o Contato (branca) */}
      <SectionDivider color="#FFFFFF" />

      <ContactSection />
    </main>
  )
}