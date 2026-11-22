import { useRef } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { section } from '@/lib/conero'
import { site } from '@/content/site'
import { useScrollScenes } from '@/hooks/use-media'

const W = 1200
const H = 340
const TOP = 70
const s = section(W, H, TOP)
const km = (s.dMax / 1000).toFixed(1).replace('.', ',')

/** Simbolo di quota (motivo del sito): triangolo su una linea, metà pieno. */
function Quota({ x, y, label, align = 'start' }: { x: number; y: number; label: string; align?: 'start' | 'end' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={align === 'start' ? -4 : -60} x2={align === 'start' ? 60 : 4} y1="0" y2="0" stroke="var(--inchiostro)" strokeWidth="1.2" />
      <path d="M-8 -16 H8 L0 0 Z" fill="none" stroke="var(--inchiostro)" strokeWidth="1.2" />
      <path d="M0 -16 H8 L0 0 Z" fill="var(--coppo)" />
      <text x={align === 'start' ? 14 : -14} y="-24" textAnchor={align} style={{ font: '500 14px var(--font-mono)', letterSpacing: '0.06em' }} className="fill-inchiostro">
        {label}
      </text>
    </g>
  )
}

/**
 * Momento d'autore della pagina Studio: la sezione reale dalla vetta del Conero al porto di Numana,
 * dove sta lo studio. Si traccia con lo scroll su desktop; completa su mobile e con movimento ridotto.
 */
export function QuotaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'center 0.5'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const draw = useTransform(p, [0, 1], [0.02, 1])
  const full = useMotionValue(1)

  const first = s.points[0]
  const last = s.points.at(-1)!
  const ticks = Array.from({ length: Math.floor(s.dMax / 1000) + 1 }, (_, i) => i)

  return (
    <div ref={ref}>
      <svg viewBox={`-20 0 ${W + 40} ${H + 40}`} className="block h-auto w-full" role="img" aria-labelledby="sez-t sez-d">
        <title id="sez-t">Sezione dalla vetta del Monte Conero al porto di Numana</title>
        <desc id="sez-d">
          Profilo reale del terreno lungo {km} chilometri, dalla vetta a {site.coneroHeight} metri fino a Via del Porto, a livello del mare, dove si trova lo studio.
        </desc>
        <path d={s.fill} fill="var(--pietra)" />
        <motion.path d={s.d} fill="none" stroke="var(--inchiostro)" strokeWidth="1.8" style={{ pathLength: scenes ? draw : full }} />
        <line x1="0" x2={W} y1={H} y2={H} stroke="var(--adriatico)" strokeWidth="1.5" />
        {ticks.map((t) => (
          <g key={t} transform={`translate(${s.x(t * 1000)} ${H})`}>
            <line y1="0" y2="8" stroke="var(--grafite)" />
            <text y="26" textAnchor="middle" style={{ font: '500 12px var(--font-mono)' }} className="fill-grafite">
              {t} km
            </text>
          </g>
        ))}
        <Quota x={first[0]} y={first[1]} label={`+${site.coneroHeight} MONTE CONERO`} />
        <g>
          <Quota x={last[0]} y={H} label="±0,00 VIA DEL PORTO · LO STUDIO" align="end" />
        </g>
      </svg>
    </div>
  )
}
