import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { Gallery } from '@/components/Gallery'
import { ClosingCta } from '@/components/Blocks'
import { Breadcrumb, OtherServices, ServiceProjects } from '@/components/ServiceParts'
import { getService } from '@/content/services'
import { useScrollScenes } from '@/hooks/use-media'

const s = getService('interni')!

// Mosaico di dettagli dagli archivi dello studio. Al centro la scala in acciaio e legno (Numana, 2014).
const CENTER = 'a2d18d8e0e54daaf'
const AROUND: { id: string; alt: string; pos: string; size: string; k: number }[] = [
  { id: '310121c30f32582a', alt: 'Casa Due Mari, la scala a sbalzo', pos: 'left-[6%] top-[8%]', size: 'w-[20vw] aspect-[4/5]', k: 2.2 },
  { id: '0871bf680e78f82b', alt: 'Casa Due Mari, la libreria a parete', pos: 'right-[5%] top-[6%]', size: 'w-[24vw] aspect-[3/2]', k: 2.6 },
  { id: '14910a950e54db33', alt: 'Casa L, la scala nera', pos: 'left-[10%] bottom-[6%]', size: 'w-[18vw] aspect-[4/3]', k: 2.8 },
  { id: '2c31a0810e540009', alt: 'Casa Due Mari, il bagno laccato arancio', pos: 'right-[9%] bottom-[8%]', size: 'w-[16vw] aspect-[4/5]', k: 2.4 },
  { id: 'a67122ca0f3257ae', alt: 'Casa Due Mari, un dettaglio degli interni', pos: 'left-[38%] top-[3%]', size: 'w-[12vw] aspect-[1/1]', k: 3 },
]

function Around({ a, progress }: { a: (typeof AROUND)[number]; progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [1, a.k])
  const opacity = useTransform(progress, [0.45, 0.8], [1, 0])
  return (
    <motion.div className={`absolute ${a.pos} ${a.size}`} style={{ scale, opacity }}>
      <Img id={a.id} alt={a.alt} ratio="auto" className="h-full" sizes="25vw" />
    </motion.div>
  )
}

/**
 * Momento d'autore: mosaico di dettagli; scorrendo, i dettagli si allontanano e la scala al centro
 * si ingrandisce fino a riempire lo schermo. Lo stato finale è la foto piena, mai vuoto. Solo desktop.
 */
function DetailZoom() {
  const ref = useRef<HTMLDivElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const w = useTransform(scrollYProgress, [0, 0.85], ['26vw', '100vw'])
  const h = useTransform(scrollYProgress, [0, 0.85], ['34vh', '100%'])

  if (!scenes) {
    return (
      <section className="wrap pb-12">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {[{ id: CENTER, alt: 'Scala in acciaio rivestita in legno, Numana' }, ...AROUND].map((a) => (
            <li key={a.id}>
              <Img id={a.id} alt={a.alt} ratio="4 / 5" sizes="(min-width:768px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[200vh]" aria-label="Dettagli d’interni">
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden">
        {AROUND.map((a) => (
          <Around key={a.id} a={a} progress={scrollYProgress} />
        ))}
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden" style={{ width: w, height: h }}>
          <Img id={CENTER} alt="Scala in acciaio rivestita in legno, illuminata dal basso, in una casa di Numana" ratio="auto" className="h-full" sizes="100vw" />
        </motion.div>
        <p className="pill t-label absolute bottom-5 left-5 !text-[0.68rem]">Scala in acciaio e legno · Numana · 2014</p>
      </div>
    </section>
  )
}

const DETAILS = ['a2d18d8e0e54daaf', 'ec7169ad0e54daa5', '1161da080e54daaa', '8ff1519c0f32581e', '99f1843f0f3257b8', '0871bf680e78f82b', '2c31a0810e540009', '61d1c7b80e4558cf', '14910a950e54db33', 'c711ffa80e54db2f', '9611267f0e456d86', '2dd16a890e456d8e']

export default function Interni() {
  return (
    <Page path="/servizi/interni">
      <section className="wrap pb-10 pt-8 md:pt-14">
        <Breadcrumb title={s.title} />
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <h1 className="t-h1 md:col-span-7">Il dettaglio è dove un progetto si riconosce</h1>
          <p className="t-lead self-end text-grafite md:col-span-5">{s.intro}</p>
        </div>
      </section>

      <DetailZoom />

      <section className="section">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4" data-reveal>
            <p className="t-label text-coppo">Disegnati per lo spazio</p>
            <h2 className="t-h2 mt-3">Scale, librerie, bagni, camere</h2>
            <p className="mt-4 text-grafite" data-placeholder="testo servizio interni">
              {/* [SEGNAPOSTO] */}
              Disegniamo gli elementi che fanno funzionare una casa piccola o una camera d’albergo: scale che occupano poco, librerie che fanno da parapetto, bagni ricavati in pochi metri, testate e armadi su misura.
            </p>
          </div>
          <div className="md:col-span-8">
            <Gallery images={DETAILS} title="Dettagli d’interni" prefix="interni" className="lg:grid-cols-3" />
          </div>
        </div>
      </section>

      <ServiceProjects slug="interni" title="Progetti con interni su misura" />
      <OtherServices current="interni" />
      <ClosingCta image="310121c30f32582a" title="Hai uno spazio che non funziona?" />
    </Page>
  )
}
