import { useEffect, useState } from 'react'

export function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches))
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}

/** Scenografie legate allo scroll: solo desktop e senza movimento ridotto (su mobile si spengono). */
export const useScrollScenes = () => useMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
