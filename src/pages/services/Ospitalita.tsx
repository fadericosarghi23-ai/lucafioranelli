import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { ClosingCta } from '@/components/Blocks'
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder'
import { Breadcrumb, MaskReveal, OtherServices, ServiceProjects } from '@/components/ServiceParts'
import { getService } from '@/content/services'
import { useScrollScenes } from '@/hooks/use-media'

const s = getService('ospitalita')!

// [SEGNAPOSTO] le tre frasi sul recupero del casale sono nostre, da far confermare
const STEPS = [
  { k: 'Prima', t: 'Un casale di campagna tra gli ulivi di Sirolo, da riportare in vita.' },
  { k: 'Il progetto', t: 'Camere, spazi comuni e un giardino con piscina, senza perdere il carattere della casa colonica.' },
  { k: 'Oggi', t: 'Country House Borgo Rosso: facciate rosse, persiane chiare, il prato davanti.' },
]

/**
 * Momento d'autore: sezione sticky in cui la foto del casale si ingrandisce fino a riempire lo schermo
 * mentre scorrono le tre fasi. Scroll nativo; stato finale = foto piena. Su mobile versione statica.
 */
function StickyZoom() {
  const ref = useRef<HTMLDivElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const inset = useTransform(scrollYProgress, [0, 0.7], [18, 0])
  const clip = useTransform(inset, (v) => `inset(${v}% ${v * 1.4}% ${v}% ${v * 1.4}% round ${v > 0.5 ? 4 : 0}px)`)
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1])

  if (!scenes) {
    return (
      <section className="section">
        <div className="wrap grid gap-6 md:grid-cols-2">
          <Img id="2911ad4e0e456130" alt="Country House Borgo Rosso a Sirolo, la casa dopo il recupero" ratio="3 / 2" sizes="(min-width:768px) 50vw, 100vw" />
          <ol className="space-y-5" data-placeholder="testo da confermare">
            {STEPS.map((st) => (
              <li key={st.k}>
                <p className="t-label text-coppo">{st.k}</p>
                <p className="t-h3 mt-1">{st.t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[220vh]" aria-label="Il recupero di Country House Borgo Rosso">
      <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          <motion.div className="absolute inset-0" style={{ scale }}>
            <Img id="2911ad4e0e456130" alt="Country House Borgo Rosso a Sirolo, la casa dopo il recupero" ratio="auto" className="h-full" sizes="100vw" />
          </motion.div>
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10" data-placeholder="testo da confermare">
          <div className="relative h-[150px] max-w-xl">
            {STEPS.map((st, i) => (
              <StepCard key={st.k} i={i} progress={scrollYProgress} k={st.k} t={st.t} />
            ))}
          </div>
        </div>
        <Link to="/progetti/country-house-borgo-rosso" className="pill t-label absolute right-6 top-6 !text-[0.68rem] transition-colors hover:bg-white hover:text-coppo">
          Country House Borgo Rosso · Sirolo
        </Link>
      </div>
    </section>
  )
}

function StepCard({ i, progress, k, t }: { i: number; progress: MotionValue<number>; k: string; t: string }) {
  const a = i / 3
  const b = (i + 1) / 3
  // intervalli sempre dentro 0..1 e crescenti (framer li passa a WAAPI come offset)
  const range = i === 0 ? [0, b - 0.04, b + 0.02] : i === 2 ? [a - 0.04, a + 0.04, 1] : [a - 0.04, a + 0.04, b - 0.04, b + 0.02]
  const values = i === 0 ? [1, 1, 0] : i === 2 ? [0, 1, 1] : [0, 1, 1, 0]
  const opacity = useTransform(progress, range, values)
  const y = useTransform(progress, i === 0 ? [0, 1] : [a - 0.04, a + 0.04], i === 0 ? [0, 0] : [14, 0])
  return (
    <motion.div className="absolute inset-x-0 bottom-0 bg-calce/95 p-5" style={{ opacity, y }}>
      <p className="t-label text-coppo">
        0{i + 1} · {k}
      </p>
      <p className="t-h3 mt-2 text-[1.3rem]">{t}</p>
    </motion.div>
  )
}

const TYPES = [
  { t: 'Hotel', d: 'Ristrutturazioni e trasformazioni di edifici esistenti in hotel, anche storici.', img: 'cf7137b60e7b88dc', link: '/progetti/hotel-san-francesco', p: 'Hotel San Francesco, Loreto' },
  { t: 'B&B e camere', d: 'Poche camere nei centri storici, dove ogni metro conta.', img: 'ef71d1a90e54dc95', link: '/progetti/giulia-camere', p: 'Giulia Camere, Numana' },
  { t: 'Country house', d: 'Casali di campagna che diventano luoghi di vacanza.', img: 'e40112010e456143', link: '/progetti/country-house-borgo-rosso', p: 'Borgo Rosso, Sirolo' },
  { t: 'Boutique hotel', d: 'Palazzi storici con camere disegnate una per una.', img: 'b9e110430e456d7e', link: '/progetti/palazzo-ruschioni', p: 'Palazzo Ruschioni, Camerano' },
]

export default function Ospitalita() {
  return (
    <Page path="/servizi/ospitalita">
      <section className="wrap pb-10 pt-8 md:pt-14">
        <Breadcrumb title={s.title} />
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h1 className="t-h1">Hotel, B&amp;B, ristoranti, stabilimenti balneari</h1>
            <p className="t-lead mt-6 text-grafite">{s.intro}</p>
            <p className="mt-4 text-grafite" data-placeholder="testo servizio">
              {/* [SEGNAPOSTO] */}
              Chi gestisce una struttura ha una stagione da rispettare: progettiamo pensando ai tempi del cantiere, alla manutenzione e a come gli ospiti useranno davvero gli spazi.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-3 md:col-span-6">
            <MaskReveal className="col-span-3">
              <Img id="e7f104cb0e455aaa" alt="Nilu Relais a Sirolo, una camera" ratio="4 / 5" priority sizes="(min-width:768px) 30vw, 60vw" />
            </MaskReveal>
            <MaskReveal className="col-span-2 mt-16" from="left">
              <Img id="9611267f0e456d86" alt="Palazzo Ruschioni a Camerano, una camera" ratio="3 / 4" sizes="(min-width:768px) 20vw, 40vw" />
            </MaskReveal>
          </div>
        </div>
      </section>

      <StickyZoom />

      <section className="section">
        <div className="wrap">
          <div className="mb-8 grid gap-4 border-t border-inchiostro pt-4 md:grid-cols-12" data-reveal>
            <h2 className="t-h2 md:col-span-6">Che cosa progettiamo</h2>
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {TYPES.map((x, i) => (
              <li key={x.t} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
                <Link to={x.link} className="group block">
                  <Img id={x.img} alt={x.p} ratio="4 / 5" sizes="(min-width:1024px) 25vw, 50vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                  <p className="t-h3 mt-3 transition-colors group-hover:text-coppo">{x.t}</p>
                  <p className="mt-1 text-[0.95rem] leading-snug text-grafite">{x.d}</p>
                  <p className="t-label mt-2 text-grafite">{x.p}</p>
                </Link>
              </li>
            ))}
            <li>
              <PhotoPlaceholder subject="Ristorazione: Ricci, pescheria e friggitoria a Numana" format="4:5 verticale" notes="Il banco del pesce e la “nave” progettata dallo studio." />
              <p className="t-h3 mt-3">Bar e ristoranti</p>
            </li>
            <li>
              <PhotoPlaceholder subject="Uno stabilimento balneare progettato dallo studio" format="4:5 verticale" notes="Chiedere al cliente quali stabilimenti ha seguito." />
              <p className="t-h3 mt-3">Stabilimenti balneari</p>
            </li>
          </ul>
        </div>
      </section>

      <ServiceProjects slug="ospitalita" title="Strutture che abbiamo progettato" />
      <OtherServices current="ospitalita" />
      <ClosingCta image="cf7137b60e7b88dc" title="Hai una struttura da rinnovare prima della stagione?" />
    </Page>
  )
}
