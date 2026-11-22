import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { BeforeAfter } from '@/components/BeforeAfter'
import { ClosingCta } from '@/components/Blocks'
import { Breadcrumb, MaskReveal, OtherServices, ServiceProjects } from '@/components/ServiceParts'
import { getService, } from '@/content/services'
import { getProject } from '@/content/projects'
import { useScrollScenes } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

const s = getService('centri-storici')!
const borgo = getProject('country-house-borgo-rosso')!

type LayerKey = 'fondazioni' | 'murature' | 'solai' | 'copertura'

// Sezione schematica di una casa del borgo (non un rilievo): serve a raccontare l'ordine degli interventi.
const LAYERS: { key: LayerKey; label: string; text: string; paths: string[] }[] = [
  {
    key: 'fondazioni',
    label: 'Fondazioni',
    text: 'Si parte da sotto: si verifica su cosa poggia la casa e, se serve, si consolida.',
    paths: ['M70 520 V598 H160 V520', 'M440 520 V598 H530 V520'],
  },
  {
    key: 'murature',
    label: 'Murature',
    text: 'Muri in pietra e mattoni, spesso rimaneggiati nei secoli: si leggono, si cuciono, si rinforzano.',
    paths: ['M95 520 V168', 'M135 520 V150', 'M465 520 V150', 'M505 520 V168', 'M95 470 H135 M95 420 H135 M465 470 H505 M465 420 H505 M95 330 H135 M465 330 H505'],
  },
  {
    key: 'solai',
    label: 'Solai',
    text: 'I solai in legno vengono controllati trave per trave e collegati alle murature.',
    paths: ['M135 392 H465', 'M135 402 H465', 'M135 268 H465', 'M135 278 H465', 'M170 402 v10 M230 402 v10 M290 402 v10 M350 402 v10 M410 402 v10 M170 278 v10 M230 278 v10 M290 278 v10 M350 278 v10 M410 278 v10'],
  },
  {
    key: 'copertura',
    label: 'Copertura',
    text: 'Infine il tetto: struttura, isolamento e coppi, rimessi al loro posto.',
    paths: ['M70 176 L300 62 L530 176', 'M95 168 L300 72 L505 168', 'M530 176 V196'],
  },
]

function HouseSection({ active, scenes }: { active: number; scenes: boolean }) {
  return (
    <svg viewBox="0 0 600 640" className="block h-auto w-full" role="img" aria-labelledby="casa-t casa-d">
      <title id="casa-t">Sezione schematica di una casa del centro storico</title>
      <desc id="casa-d">Gli interventi di consolidamento in ordine: fondazioni, murature, solai, copertura.</desc>
      {/* terreno */}
      <path d="M10 520 H590" stroke="var(--inchiostro)" strokeWidth="1.4" />
      {Array.from({ length: 28 }, (_, i) => (
        <path key={i} d={`M${20 + i * 21} 528 l-10 10`} stroke="var(--sabbia)" strokeWidth="1" />
      ))}
      {LAYERS.map((l, i) => {
        const on = i <= active
        const isNow = i === active
        return (
          <g key={l.key}>
            {l.paths.map((d, j) => (
              <motion.path
                key={j}
                d={d}
                fill="none"
                strokeLinecap="square"
                stroke={isNow ? 'var(--coppo)' : 'var(--inchiostro)'}
                strokeWidth={isNow ? 2.4 : 1.6}
                initial={false}
                animate={{ pathLength: scenes ? (on ? 1 : 0) : 1, opacity: scenes ? (on ? 1 : 0.15) : 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.7, 0.1, 1], delay: j * 0.05 }}
              />
            ))}
          </g>
        )
      })}
      {/* quota del terreno */}
      <g transform="translate(560 520)">
        <path d="M-7 -14 H7 L0 0 Z" fill="none" stroke="var(--inchiostro)" strokeWidth="1.2" />
        <path d="M0 -14 H7 L0 0 Z" fill="var(--coppo)" />
        <text x="-12" y="-20" textAnchor="end" style={{ font: '500 12px var(--font-mono)' }} className="fill-grafite">
          ±0,00
        </text>
      </g>
    </svg>
  )
}

function Step({ i, l, onActive }: { i: number; l: (typeof LAYERS)[number]; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(i)
  }, [inView, i, onActive])
  return (
    <li ref={ref} className="flex flex-col justify-center border-t border-pietra py-6 lg:min-h-[44svh] lg:py-8">
      <p className="t-label text-coppo">0{i + 1}</p>
      <h3 className="t-h2 mt-2">{l.label}</h3>
      <p className="mt-3 max-w-md text-grafite" data-placeholder="spiegazione da confermare">
        {l.text}
      </p>
    </li>
  )
}

/** Momento d'autore: la casa si consolida strato per strato mentre si scorre (sezione sticky, scroll nativo). */
function Consolidation() {
  const scenes = useScrollScenes()
  const [active, setActive] = useState(scenes ? 0 : 3)
  useEffect(() => {
    if (!scenes) setActive(3)
  }, [scenes])
  return (
    <section className="section bg-pietra/50">
      <div className="wrap">
        <div className="grid gap-6 border-t border-inchiostro pt-4 md:grid-cols-12" data-reveal>
          <div className="md:col-span-7">
            <p className="t-label text-coppo">Sotto il bel vestito</p>
            <blockquote className="t-h2 mt-3">“Partendo dalle fondazioni, passando per le murature, sino alla copertura.”</blockquote>
          </div>
          <p className="text-grafite md:col-span-5 md:pt-8">
            Così lo studio racconta il consolidamento di{' '}
            <Link to="/progetti/giulia-camere" className="link-line text-inchiostro">
              Giulia Camere
            </Link>
            , una casa del centro storico di Numana: la parte più importante del lavoro è quella che non si vede.
          </p>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6 lg:order-2">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              <HouseSection active={active} scenes={scenes} />
              <ul className="mt-2 flex flex-wrap gap-2" aria-hidden>
                {LAYERS.map((l, i) => (
                  <li key={l.key} className={cn('t-label rounded-full border px-3 py-1 transition-colors', i === active ? 'border-coppo bg-coppo text-white' : i < active ? 'border-inchiostro' : 'border-sabbia text-grafite')}>
                    {l.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ol className="lg:col-span-5 lg:order-1">
            {LAYERS.map((l, i) => (
              <Step key={l.key} i={i} l={l} onActive={(n) => scenes && setActive(n)} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default function CentriStorici() {
  return (
    <Page path="/servizi/centri-storici">
      <section className="wrap pb-10 pt-8 md:pt-14">
        <Breadcrumb title={s.title} />
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="t-h1">Case antiche, da leggere prima di trasformare</h1>
            <p className="t-lead mt-6 max-w-2xl text-grafite">{s.intro}</p>
          </div>
          <MaskReveal className="md:col-span-5">
            <Img id="dfd169f30e54da0a" alt="Casa del fornaio a Numana, la scala esterna con i gerani" ratio="4 / 5" priority sizes="(min-width:768px) 40vw, 100vw" />
          </MaskReveal>
        </div>
      </section>

      <Consolidation />

      <section className="section">
        <div className="wrap grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4" data-reveal>
            <p className="t-label text-coppo">Casali di campagna</p>
            <h2 className="t-h2 mt-3">Borgo Rosso, prima e dopo</h2>
            <p className="mt-4 text-grafite" data-placeholder="testo da confermare">
              {/* [SEGNAPOSTO] */}
              Un casale di Sirolo com’era all’inizio del cantiere e com’è oggi, diventato country house.
            </p>
            <Link to={`/progetti/${borgo.slug}`} className="link-line mt-5 inline-block font-display">
              Il progetto completo
            </Link>
          </div>
          <div className="md:col-span-8">
            <BeforeAfter before={borgo.before!.image} after={borgo.before!.after} note={borgo.before!.note} title={borgo.title} />
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap grid items-center gap-8 md:grid-cols-12">
          <MaskReveal className="md:col-span-6" from="left">
            <Img id="c60139a40e7b8cde" alt="Casa Vacanze G. a Numana, il soggiorno" ratio="3 / 2" sizes="(min-width:768px) 50vw, 100vw" />
          </MaskReveal>
          <div className="md:col-span-5 md:col-start-8" data-reveal>
            <p className="t-label text-coppo">Spazi ridotti, vincoli, permessi</p>
            <h2 className="t-h2 mt-3">Nei centri storici ogni metro va guadagnato</h2>
            <p className="mt-4 text-grafite" data-placeholder="testo da confermare: pratiche e vincoli">
              {/* [SEGNAPOSTO] chiedere al cliente quali pratiche segue (vincolo paesaggistico, Parco del Conero, centro storico) */}
              Case strette e alte, scale ripide, vincoli urbanistici e paesaggistici. Seguiamo il progetto e le pratiche necessarie, e troviamo lo spazio dove sembra non esserci.
            </p>
          </div>
        </div>
      </section>

      <ServiceProjects slug="centri-storici" />
      <OtherServices current="centri-storici" />
      <ClosingCta image="ef71d1a90e54dc95" title="Hai una casa nel borgo o un casale da recuperare?" />
    </Page>
  )
}
