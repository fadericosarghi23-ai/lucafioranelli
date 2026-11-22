import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { ClosingCta } from '@/components/Blocks'
import { services } from '@/content/services'
import { projects } from '@/content/projects'
import { useScrollScenes } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

// [SEGNAPOSTO] fasi del lavoro scritte da noi, da far confermare allo studio
const STEPS = [
  ['Ascolto e sopralluogo', 'Ci vediamo sul posto: come vivi o come lavori, cosa non funziona, cosa desideri. Misuriamo e fotografiamo.'],
  ['Idea e stima', 'Prime soluzioni in pianta e in sezione, con una stima dei costi e dei tempi da discutere insieme.'],
  ['Progetto e pratiche', 'Progetto definitivo ed esecutivo, pratiche edilizie e, dove serve, autorizzazioni paesaggistiche.'],
  ['Cantiere', 'Scegliamo le imprese con te e seguiamo i lavori di persona, dalle demolizioni alle finiture.'],
  ['Dettagli e consegna', 'Arredi su misura, luci, materiali. Si consegna quando tutto è al suo posto.'],
]

function Process() {
  const ref = useRef<HTMLOListElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <section className="section bg-pietra/50">
      <div className="wrap grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4" data-reveal>
          <p className="t-label text-coppo">Come lavoriamo</p>
          <h2 className="t-h2 mt-3">Dal primo sopralluogo all’ultima maniglia</h2>
          <div className="mt-8 hidden md:block">
            <Img id="1f11604b0f32577b" alt="Casa Due Mari, dettaglio degli interni" ratio="4 / 5" sizes="30vw" />
          </div>
        </div>
        <ol ref={ref} className="relative md:col-span-7 md:col-start-6" data-placeholder="fasi del lavoro da confermare">
          <div className="absolute bottom-3 left-[11px] top-3 w-px bg-sabbia" aria-hidden />
          <motion.div className="absolute left-[11px] top-3 w-px bg-coppo" style={{ height: scenes ? h : 'calc(100% - 24px)' }} aria-hidden />
          {STEPS.map(([t, d], i) => (
            <li key={t} className="relative grid grid-cols-[24px_1fr] gap-5 pb-10 last:pb-0" data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
              <svg viewBox="0 0 24 20" className="relative mt-1 h-5 w-6 bg-[var(--calce)]" aria-hidden>
                <path d="M2 2 H22 L12 18 Z" fill="var(--calce)" stroke="var(--inchiostro)" strokeWidth="1.4" />
                <path d="M12 2 H22 L12 18 Z" fill="var(--coppo)" />
              </svg>
              <div>
                <p className="t-label text-grafite">Fase 0{i + 1}</p>
                <h3 className="t-h3 mt-1 text-[1.35rem]">{t}</h3>
                <p className="mt-2 max-w-xl text-grafite">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Services() {
  return (
    <Page path="/servizi">
      <section className="wrap pb-10 pt-10 md:pt-16">
        <p className="t-label mb-4 text-coppo">Servizi</p>
        <div className="grid gap-6 md:grid-cols-12">
          <h1 className="t-h1 md:col-span-8">Architettura per chi abita e per chi accoglie</h1>
          <p className="self-end text-grafite md:col-span-4" data-placeholder="introduzione servizi">
            {/* [SEGNAPOSTO] */}
            Lavoriamo soprattutto sulla Riviera del Conero: case e casali da ristrutturare, edifici nei centri storici, strutture ricettive, interni su misura.
          </p>
        </div>
      </section>

      <section className="wrap pb-12 md:pb-20">
        <ul className="divide-y divide-pietra border-y border-inchiostro">
          {services.map((s, i) => {
            const n = projects.filter((p) => p.services.includes(s.slug)).length
            return (
              <li key={s.slug} data-reveal>
                <Link to={`/servizi/${s.slug}`} className="group grid items-center gap-5 py-6 md:grid-cols-12 md:gap-8 md:py-8">
                  <div className={cn('overflow-hidden md:col-span-5', i % 2 && 'md:order-2 md:col-start-8')}>
                    <Img id={s.cover} alt="" ratio="3 / 2" sizes="(min-width:768px) 40vw, 100vw" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <div className={cn('md:col-span-6', i % 2 ? 'md:order-1 md:col-start-1' : 'md:col-start-7')}>
                    <p className="t-label text-grafite">
                      0{i + 1} · {n} progetti
                    </p>
                    <h2 className="t-h2 mt-2 flex items-start gap-3 transition-colors group-hover:text-coppo">
                      {s.title}
                      <ArrowUpRight className="mt-2 size-6 shrink-0 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </h2>
                    <p className="mt-3 max-w-lg text-grafite">{s.intro}</p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <Process />
      <ClosingCta image="ef71d1a90e54dc95" />
    </Page>
  )
}
