"use client"

import { MouseEvent } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useMotionValue, useSpring, useMotionValueEvent, MotionValue } from "framer-motion"

// --- CORRIGIDO: Componente de Padrão de Grid Dinâmico ---
function GridPattern({ mouseX, mouseY }: { mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  // 1. O maskImage agora é atualizado dinamicamente
  const maskImage = useMotionValue<string>(
    "radial-gradient(250px at 50% 50%, white, transparent)"
  );

  // 2. CORREÇÃO: Usamos useMotionValueEvent para conectar o mouse ao efeito
  //    Isso é performático e a forma correta de reagir a mudanças no MotionValue.
  useMotionValueEvent(mouseX, "change", (latestX) => {

    maskImage.set(`radial-gradient(350px at ${latestX * 100}% ${mouseY.get() * 100}%, white, transparent 80%)`);
  });

  // 3. CORREÇÃO: `let` trocado por `const`
  const style = {
    maskImage,
    WebkitMaskImage: maskImage,
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-purple-500/20 opacity-100"
        style={style}
      />
      <div className="absolute inset-0 z-0 mix-blend-soft-light">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(120, 120, 120, 0.15)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}

export default function HeroSection() {
  // 4. CORREÇÃO: Estado 'isHovering' removido, pois era inútil.
  const mouseX = useSpring(0.5, { stiffness: 400, damping: 90 });
  const mouseY = useSpring(0.5, { stiffness: 400, damping: 90 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width);
    mouseY.set((e.clientY - top) / height);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const titleWords = "Transformando ideias em realidade digital".split(" ");
  const subtitle = "Criamos a ponte entre sua visão e o sucesso online com soluções de tecnologia e design sob medida.";

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-gray-900 px-4 py-20"
    >
      <GridPattern mouseX={mouseX} mouseY={mouseY} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container relative z-10 mx-auto text-center"
      >
        <motion.h1
          variants={containerVariants}
          className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-lg"
        >
          {titleWords.map((word, index) => (
            <motion.span key={index} variants={itemVariants} className="inline-block mr-3">
              {index === 2 || index === 3 ? (
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mx-auto mb-10 max-w-2xl text-lg text-purple-200/90 md:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/contrato"
            aria-label="Solicitar um orçamento"
            className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-lg font-semibold text-purple-800 shadow-lg transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1"
          >
            Iniciar Projeto <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href="#servicos"
            aria-label="Conhecer nossos serviços"
            className="group inline-flex items-center justify-center rounded-full border-2 border-white/80 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10 hover:-translate-y-1"
          >
            Nossos Serviços
          </Link>
        </motion.div>
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}