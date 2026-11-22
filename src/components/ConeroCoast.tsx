import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { skyline, LAT_MIN, LAT_MAX } from '@/lib/conero'
import { projects, PLACES } from '@/content/projects'
import { site } from '@/content/site'
import { useMedia, useScrollScenes } from '@/hooks/use-media'
import { Img } from './Img'
import { cn } from '@/lib/utils'

const W = 1440
const H = 380
const TOP = 120
const sk = skyline(W, H, { topPad: TOP })

type PlaceKey = keyof typeof PLACES
const PLACE_ORDER: PlaceKey[] = ['Loreto', 'Numana', 'Sirolo', 'Camerano', 'Ancona']
// altezza dell'etichetta, sfalsata per non sovrapporre Numana e Sirolo
const LABEL_Y: Record<PlaceKey, number> = { Loreto: 34, Numana: 34, Sirolo: 78, Camerano: 34, Ancona: 34 }

/** z del profilo alla latitudine data (interpolazione lineare sui punti reali) */
function yAt(lat: number) {
  const x = sk.x(lat)
  const pts = sk.points
  for (let i = 0; i < pts.length - 1; i++) {
    if (x >= pts[i][0] && x <= pts[i + 1][0]) {
      const t = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0] || 1)
      return pts[i][1] + t * (pts[i + 1][1] - pts[i][1])
    }
  }
  return H
}

const peak = sk.points.reduce((a, b) => (b[1] < a[1] ? b : a))

/**
 * Momento d'autore della Home: il profilo reale della costa visto dal mare (dati EU-DEM),
 * con i luoghi dei progetti. Su desktop la linea si traccia con lo scroll (scroll nativo);
 * su mobile e con movimento ridotto è già disegnata.
 */
export function ConeroCoast() {
  const ref = useRef<HTMLDivElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.45'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const draw = useTransform(smooth, [0, 1], [0.02, 1])
  const [active, setActive] = useState<PlaceKey>('Numana')
  const full = useMotionValue(1)
  // sotto i 768px le etichette del profilo sono troppo piccole da toccare: diventano solo segni, l'elenco sotto resta interattivo
  const pinsInteractive = useMedia('(min-width: 768px)')

  const byPlace = useMemo(() => {
    const m = {} as Record<PlaceKey, typeof projects>
    for (const k of PLACE_ORDER) m[k] = projects.filter((p) => p.lat === PLACES[k])
    return m
  }, [])

  return (
    <div ref={ref}>
      <div className="relative -mx-4 md:mx-0">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="costa-titolo costa-desc">
          <title id="costa-titolo">Profilo della costa dal Passetto di Ancona a Porto Recanati</title>
          <desc id="costa-desc">Linea delle quote reali vista dal mare, con il Monte Conero al centro e i paesi dove lo studio ha lavorato.</desc>
          <path d={sk.fill} fill="var(--pietra)" />
          {/* il mare */}
          <line x1="0" x2={W} y1={H - 0.75} y2={H - 0.75} stroke="var(--adriatico)" strokeWidth="1.5" />
          <motion.path d={sk.d} fill="none" stroke="var(--inchiostro)" strokeWidth="1.6" strokeLinejoin="round" style={{ pathLength: scenes ? draw : full }} />

          {/* vetta */}
          <g transform={`translate(${peak[0]} ${peak[1]})`}>
            <path d="M-6 -16 H6 L0 -4 Z" fill="none" stroke="var(--inchiostro)" strokeWidth="1.2" />
            <path d="M0 -16 H6 L0 -4 Z" fill="var(--coppo)" />
            <text y="-24" textAnchor="middle" className="fill-inchiostro" style={{ font: '500 13px var(--font-mono)', letterSpacing: '0.08em' }}>
              MONTE CONERO +{site.coneroHeight}
            </text>
          </g>

          {PLACE_ORDER.map((k) => (
            <Pin key={k} k={k} n={byPlace[k].length} active={active === k} onActive={setActive} draw={draw} scenes={scenes} interactive={pinsInteractive} />
          ))}

          <text x="8" y={H - 12} style={{ font: '500 12px var(--font-mono)', letterSpacing: '0.08em' }} className="fill-grafite">
            ← PORTO RECANATI
          </text>
          <text x={W - 8} y={H - 12} textAnchor="end" style={{ font: '500 12px var(--font-mono)', letterSpacing: '0.08em' }} className="fill-grafite">
            ANCONA, PASSETTO →
          </text>
        </svg>
      </div>

      {/* elenco dei luoghi: stesso stato dei pin */}
      <div className="mt-8 grid gap-6 md:grid-cols-12">
        <ul className="flex flex-wrap gap-2 md:col-span-4 md:flex-col md:gap-1" role="tablist" aria-label="Luoghi">
          {PLACE_ORDER.slice()
            .reverse()
            .map((k) => (
              <li key={k} role="presentation">
                <button
                  id={`luogo-${k}`}
                  role="tab"
                  aria-selected={active === k}
                  onClick={() => setActive(k)}
                  onMouseEnter={() => setActive(k)}
                  className={cn(
                    'flex w-full items-baseline justify-between gap-6 rounded-full border px-4 py-2 text-left font-display transition-colors md:rounded-none md:border-0 md:border-b md:px-0 md:py-3',
                    active === k ? 'border-inchiostro bg-inchiostro text-calce md:bg-transparent md:text-coppo' : 'border-sabbia hover:text-coppo md:border-pietra',
                  )}
                >
                  <span className="text-lg font-medium md:text-2xl">{k}</span>
                  <span className="t-label hidden md:inline">
                    {byPlace[k].length} {byPlace[k].length === 1 ? 'progetto' : 'progetti'}
                  </span>
                </button>
              </li>
            ))}
        </ul>
        <div className="md:col-span-8" role="tabpanel" aria-label={`Progetti a ${active}`}>
          <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {byPlace[active].map((p) => (
              <motion.li key={p.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Link to={`/progetti/${p.slug}`} className="group block">
                  <Img id={p.cover} alt="" ratio="4 / 3" sizes="(min-width:1024px) 22vw, 50vw" imgClassName="transition-transform duration-500 group-hover:scale-[1.04]" />
                  <p className="t-h3 mt-2 transition-colors group-hover:text-coppo">{p.title}</p>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/** Un luogo sul profilo: compare quando la linea lo raggiunge (solo con le scenografie attive). */
function Pin({
  k,
  n,
  active,
  onActive,
  draw,
  scenes,
  interactive,
}: {
  k: PlaceKey
  n: number
  active: boolean
  onActive: (k: PlaceKey) => void
  draw: MotionValue<number>
  scenes: boolean
  interactive: boolean
}) {
  const lat = PLACES[k]
  const x = sk.x(lat)
  const y = yAt(lat)
  const ly = LABEL_Y[k]
  const at = (lat - LAT_MIN) / (LAT_MAX - LAT_MIN)
  const opacity = useTransform(draw, [Math.max(0, at - 0.04), at + 0.02], [0.35, 1])
  const label = (
    <>
      <rect x={x - 54} y={ly - 16} width="108" height="30" rx="15" fill={active ? 'var(--inchiostro)' : 'var(--calce)'} stroke="var(--inchiostro)" strokeWidth="1" />
      <text x={x} y={ly + 4} textAnchor="middle" style={{ font: '600 14px var(--font-display)', fill: active ? 'var(--calce)' : 'var(--inchiostro)' }}>
        {k} · {n}
      </text>
    </>
  )
  return (
    <motion.g style={{ opacity: scenes ? opacity : 1 }} onMouseEnter={interactive ? () => onActive(k) : undefined} className={interactive ? 'cursor-pointer' : undefined}>
      <line x1={x} x2={x} y1={ly + 10} y2={y - 6} stroke={active ? 'var(--coppo)' : 'var(--grafite)'} strokeWidth="1" strokeDasharray="3 4" />
      <circle cx={x} cy={y} r={active ? 5 : 3.5} fill={active ? 'var(--coppo)' : 'var(--inchiostro)'} />
      {interactive ? (
        <a
          href={`#luogo-${k}`}
          onFocus={() => onActive(k)}
          onClick={(e) => {
            e.preventDefault()
            onActive(k)
          }}
          aria-label={`${k}: ${n} ${n === 1 ? 'progetto' : 'progetti'}`}
        >
          {label}
        </a>
      ) : (
        <g aria-hidden="true">{label}</g>
      )}
    </motion.g>
  )
}
