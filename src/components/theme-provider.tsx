"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

// Cria o contexto com tipagem para o setTheme
interface ThemeContextType {
  setTheme: (theme: string) => void
}

// Contexto com valor padrão vazio
export const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => {},
})

export const useThemeContext = () => useContext(ThemeContext)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Garante que o tema seja aplicado após o componente montar
  useEffect(() => {
    setMounted(true)
  }, [])

  // Usamos o hook do next-themes dentro do provider montado
  if (!mounted) return null

  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      enableColorScheme={true}
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange={false}
    >
      <InnerThemeContextProvider>{children}</InnerThemeContextProvider>
    </NextThemesProvider>
  )
}

// Provider interno para injetar o setTheme no contexto
function InnerThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme()

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
