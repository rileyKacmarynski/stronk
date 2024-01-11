import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config.js'
import { useEffect, useState } from 'react'

const { theme } = resolveConfig(tailwindConfig)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type TailwindScreen = 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export function useTailwindMediaQuery(screen: TailwindScreen) {
  const query = `(min-width: ${theme.screens[screen]})`
  console.log('media query', query)

  function getMatches(query: string) {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  }

  const [matches, setMatches] = useState(getMatches(query))

  function handleChange() {
    setMatches(getMatches(query))
  }

  useEffect(() => {
    const matchMedia = window.matchMedia(query)

    handleChange()

    matchMedia.addEventListener('change', handleChange)

    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
