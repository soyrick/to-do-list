/**
 * Utility para combinar clases de Tailwind.
 * 
 * Esta función se usa en los componentes de shadcn/ui
 * para conditionally aplicar clases de Tailwind.
 * 
 * Inspirado en el paquete class-variance-authority (cva).
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}