"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
}

export default function AnimatedCounter({ value, duration = 2, suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    const start = performance.now()
    const end = Math.min(value, 999)
    const totalDuration = duration * 1000

    const animate = (now: number) => {
      const progress = Math.min((now - start) / totalDuration, 1)
      const current = Math.floor(progress * end)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <div ref={ref} className="text-4xl font-bold md:text-5xl">
      {count.toLocaleString("pt-BR")}
      {suffix}
    </div>
  )
}
