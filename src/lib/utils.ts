import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Função para combinar e mesclar classes, ignorando entradas inválidas
export function cn(...inputs: ClassValue[]) {
  // Filtra valores falsy e chama o twMerge para mesclar as classes
  return twMerge(clsx(inputs.filter(Boolean)))
}
