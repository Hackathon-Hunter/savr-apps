import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility for client-side only components
export const isClient = typeof window !== 'undefined'

// Dynamic import wrapper for client-side only components
export const dynamicImport = <T>(importFn: () => Promise<T>): Promise<T | null> => {
  if (isClient) {
    return importFn()
  }
  return Promise.resolve(null)
}
