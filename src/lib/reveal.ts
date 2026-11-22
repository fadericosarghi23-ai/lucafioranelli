// Entrate allo scroll robuste (regola 3 dell'agenzia):
// - CSS fa l'animazione, l'IntersectionObserver aggiunge solo la classe .is-in
// - il contenuto si nasconde solo se il JS è attivo (html.reveal-on), da 768px e senza movimento ridotto
// - rete di sicurezza: dopo 2,5s tutto ciò che è già sopra la piega viene mostrato
let io: IntersectionObserver | null = null

const enabled = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches &&
  'IntersectionObserver' in window

export function initReveal() {
  if (!enabled()) return
  document.documentElement.classList.add('reveal-on')
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in')
          io?.unobserve(e.target)
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  scanReveal()
}

/** da chiamare dopo ogni cambio pagina */
export function scanReveal() {
  if (!io) return
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')
  els.forEach((el) => io!.observe(el))
  window.setTimeout(() => {
    const vh = window.innerHeight
    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
      if (el.getBoundingClientRect().top < vh) el.classList.add('is-in')
    })
  }, 2500)
}
