import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Pause, Play } from 'lucide-react'
import { ButtonLink } from './ui/button'
import { imgMeta, imgSrc } from './Img'
import { useReducedMotion, useScrollScenes } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

/**
 * Hero della Home a tutto schermo.
 * - Tre foto del cliente scelte misurando la luminosità della zona del titolo (scripts/hero-legibility.mjs):
 *   con la soglia del contrasto 3:1 sotto le righe reali del titolo (scripts/hero-legibility2.mjs). Niente velature: titolo chiaro con ombra morbida.
 * - Primo secondo (solo prima visita): su fondo scuro il titolo è già leggibile, la foto si apre dall'orizzonte.
 * - Dissolvenza incrociata tra le foto con zoom lento (solo desktop), pausa, selettori a forma di quota.
 * - Movimento ridotto: nessuna rotazione automatica, nessuno zoom; tutto resta usabile.
 */
const SLIDES = [
  {
    id: 'ab4174c40e456148',
    big: { w: 1920 },
    pos: '50% 100%',
    alt: 'Country House Borgo Rosso a Sirolo: il giardino con il cipresso e la casa rossa',
    title: 'Country House Borgo Rosso',
    place: 'Sirolo',
    to: '/progetti/country-house-borgo-rosso',
  },
  {
    id: 'c6c1394e0e455902',
    big: { w: 2400 },
    pos: '50% 100%',
    alt: 'Casa Due Mari a Numana: il soggiorno con la poltrona rossa e il pavimento in legno scuro',
    title: 'Casa Due Mari',
    place: 'Numana',
    to: '/progetti/casa-due-mari',
  },
  {
    id: 'e7f104cb0e455aaa',
    big: null,
    pos: '50% 50%',
    alt: 'Nilu Relais a Sirolo: una camera con il soffitto in cotto e il pavimento in legno',
    title: 'Nilu Relais',
    place: 'Sirolo',
    to: '/progetti/nilu-relais',
  },
] as const

const DURATION = 7000

export const heroSrcSet = (s: (typeof SLIDES)[number]) =>
  [`${imgSrc(s.id, 480)} 480w`, `${imgSrc(s.id, 960)} 960w`, `${imgSrc(s.id, 1600)} 1600w`, s.big ? `/img/p/${s.id}-${s.big.w}.webp ${s.big.w}w` : null].filter(Boolean).join(', ')

// L'apertura parte solo alla prima visita della sessione.
function firstVisit() {
  try {
    if (sessionStorage.getItem('hero-visto')) return false
    sessionStorage.setItem('hero-visto', '1')
    return true
  } catch {
    return true
  }
}

function Quota({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 20 16" className="h-3 w-[15px]" aria-hidden>
      <path d="M1 1 H19 L10 15 Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 1 H19 L10 15 Z" fill={active ? 'var(--coppo)' : 'transparent'} className="transition-colors duration-200" />
    </svg>
  )
}

export function HomeHero() {
  const [opening] = useState(firstVisit)
  const reduced = useReducedMotion()
  const scenes = useScrollScenes()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLElement>(null)

  const autoplay = !reduced && !paused && visible && ready

  // le altre foto si montano solo dopo il caricamento della prima (non rubano banda all'LCP)
  const onFirstLoad = () => window.setTimeout(() => setReady(true), 1200)

  useEffect(() => {
    if (!autoplay) return
    const t = window.setTimeout(() => setI((x) => (x + 1) % SLIDES.length), DURATION)
    return () => window.clearTimeout(t)
  }, [autoplay, i])

  // si ferma fuori schermo e con la scheda in background
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let inView = true
    const update = () => setVisible(inView && !document.hidden)
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting
      update()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', update)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 700], [0, -90])
  const scale = useTransform(scrollY, [0, 800], [1, 1.08])
  const cur = SLIDES[i]

  return (
    <section
      ref={ref}
      aria-labelledby="hero-titolo"
      aria-roledescription="presentazione"
      className="on-dark relative h-[calc(100svh-var(--header-h))] min-h-[560px] overflow-hidden bg-inchiostro text-calce"
    >
      {/* foto */}
      {/* su mobile la foto sta nella parte alta e il titolo sotto, sul fondo scuro: leggibile su qualsiasi foto */}
      <motion.div className={cn('absolute inset-x-0 top-0 h-[calc(100%-300px)] overflow-hidden md:inset-0 md:h-auto', opening && !reduced && 'hero-open')} style={scenes ? { scale } : undefined}>
        {SLIDES.map((s, k) => {
          if (k > 0 && !ready) return null
          const m = imgMeta(s.id)
          const on = k === i
          return (
            <div key={s.id} className="absolute inset-0 transition-opacity duration-[900ms] ease-out" style={{ opacity: on ? 1 : 0 }} aria-hidden={!on}>
              <img
                key={on ? `${s.id}-${i}` : s.id}
                src={imgSrc(s.id, 1600)}
                srcSet={heroSrcSet(s)}
                sizes="100vw"
                width={m.w}
                height={m.h}
                alt={on ? s.alt : ''}
                loading={k === 0 ? 'eager' : 'lazy'}
                fetchPriority={k === 0 ? 'high' : 'low'}
                decoding="async"
                onLoad={k === 0 ? onFirstLoad : undefined}
                className={cn('h-full w-full object-cover', on && autoplay && 'hero-kb')}
                style={{ objectPosition: s.pos }}
              />
            </div>
          )
        })}
      </motion.div>

      {/* testo: leggibile al primo fotogramma, mai animato lettera per lettera */}
      <motion.div className="absolute inset-x-0 bottom-0 z-10" style={scenes ? { y: textY } : undefined}>
        <div className="wrap pb-7 md:pb-12">
          <p className="pill t-label !text-[0.66rem] md:!text-[0.7rem]">Studio di architettura · Numana</p>
          <h1
            id="hero-titolo"
            className="mt-5 max-w-[16ch] font-display font-semibold leading-[0.95] tracking-[-0.03em] text-calce [font-size:clamp(2.35rem,6.2vw,7.2rem)] [font-stretch:112%] md:[text-shadow:0_2px_36px_rgb(0_0_0/0.5),0_1px_4px_rgb(0_0_0/0.35)]"
            data-placeholder="titolo hero da approvare"
          >
            {/* [SEGNAPOSTO] titolo costruito sulle parole dello studio ("su misura") */}
            Architettura su misura, tra il Conero e il mare
          </h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink to="/progetti" variant="light">
              Guarda i progetti
            </ButtonLink>
            <ButtonLink to="/contatti" variant="outline" arrow={false} className="hidden border-calce/80 bg-inchiostro/20 text-calce hover:bg-calce hover:text-inchiostro sm:inline-flex">
              Parliamo del progetto
            </ButtonLink>
          </div>
        </div>
      </motion.div>

      {/* didascalia e comandi: su pillola chiara, in alto su mobile e in basso a destra su desktop */}
      <div className="absolute right-3 top-3 z-20 md:bottom-12 md:right-8 md:top-auto">
        <div className="pill flex-col !items-stretch !gap-2 !rounded-2xl !px-4 !py-3 md:min-w-[290px]">
          <Link to={cur.to} className="group flex items-baseline justify-between gap-4" aria-live={autoplay ? 'off' : 'polite'}>
            <span className="font-display text-[0.95rem] font-semibold transition-colors group-hover:text-coppo">{cur.title}</span>
            <span className="t-label text-grafite">{cur.place}</span>
          </Link>
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s, k) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setReady(true)
                  setI(k)
                }}
                aria-label={`Mostra ${s.title}, ${s.place}`}
                aria-current={k === i}
                className={cn('grid size-8 place-items-center rounded-full transition-colors hover:bg-pietra', k === i ? 'text-inchiostro' : 'text-grafite')}
              >
                <Quota active={k === i} />
              </button>
            ))}
            {/* avanzamento della foto corrente */}
            <span className="relative mx-1 h-px flex-1 overflow-hidden bg-sabbia" aria-hidden>
              <span key={`${i}-${autoplay}`} className={cn('absolute inset-0 origin-left bg-coppo', autoplay ? 'hero-progress' : 'scale-x-0')} />
            </span>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? 'Riprendi la presentazione' : 'Metti in pausa la presentazione'}
                className="grid size-8 place-items-center rounded-full transition-colors hover:bg-pietra"
              >
                {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
