import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { ClosingCta } from '@/components/Blocks'
import { Breadcrumb, MaskReveal, OtherServices, ParallaxImg, ServiceProjects } from '@/components/ServiceParts'
import { getService } from '@/content/services'
import { cn } from '@/lib/utils'

const s = getService('case')!

// Racconto di Casa L con le parole dello studio (profilo Houzz), diviso in tre momenti.
const STORY = [
  {
    n: '45 mq',
    t: 'Un appartamento piccolo, per un ragazzo giovane e dinamico.',
    img: 'b9d103e80e54db38',
    alt: 'Casa L ad Ancona, la zona notte sotto la scala',
  },
  {
    n: 'Il sopralluogo',
    t: 'Durante i lavori saliamo nel sottotetto. Nasce, con entusiasmo, l’idea di collegarlo alla casa.',
    img: '14910a950e54db33',
    alt: 'Casa L, la scala a sbalzo che sale al sottotetto',
  },
  {
    n: 'La luce',
    t: 'Sopra l’apertura nel solaio, una finestra in copertura illumina la zona giorno.',
    img: '7ff1cea10e7b9309',
    alt: 'Casa L, la zona giorno con la scala nera',
  },
]

// [SEGNAPOSTO] domande e risposte scritte da noi: da far rivedere allo studio (tempi e pratiche variano caso per caso)
const FAQ = [
  ['Da dove si comincia?', 'Da un sopralluogo: vediamo la casa, ascoltiamo cosa vorresti cambiare e ti diciamo cosa è possibile fare e con quali pratiche.'],
  ['Servono permessi?', 'Dipende dall’intervento. Ci occupiamo noi delle pratiche edilizie e, dove serve, delle autorizzazioni paesaggistiche.'],
  ['Seguite anche il cantiere?', 'Sì. La direzione dei lavori fa parte del progetto: siamo in cantiere con le imprese fino alla consegna.'],
  ['Lavorate anche per chi non vive qui?', 'Sì. Concordiamo aggiornamenti fotografici e visite in cantiere nei momenti chiave dei lavori.'],
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <ul className="border-t border-inchiostro" data-placeholder="domande frequenti da confermare">
      {FAQ.map(([q, a], i) => {
        const isOpen = open === i
        return (
          <li key={q} className="border-b border-pietra">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="t-h3 text-[1.2rem] transition-colors group-hover:text-coppo">{q}</span>
                <span className="grid size-8 shrink-0 place-items-center" aria-hidden>
                  <Plus className={cn('size-5 transition-transform duration-200', isOpen && 'rotate-45 text-coppo')} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`faq-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.7, 0.1, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-grafite">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        )
      })}
    </ul>
  )
}

export default function Case() {
  return (
    <Page path="/servizi/case">
      <section className="wrap pb-10 pt-8 md:pt-14">
        <Breadcrumb title={s.title} />
        <div className="mt-6 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-6">
            <h1 className="t-h1">Ristrutturare casa, su misura di chi la abita</h1>
            <p className="t-lead mt-6 text-grafite">{s.intro}</p>
          </div>
          <div className="md:col-span-6">
            <ParallaxImg id="7fb1e9610e54dba8" alt="Casa al mare, il giardino con le palme dopo l’ampliamento" ratio="4 / 3" priority />
          </div>
        </div>
      </section>

      {/* Momento d'autore: il racconto di Casa L in tre foto che si aprono come sipari */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-4 border-t border-inchiostro pt-4 md:grid-cols-12" data-reveal>
            <div className="md:col-span-7">
              <p className="t-label text-coppo">Casa L · Ancona · 2017</p>
              <h2 className="t-h2 mt-3">Quarantacinque metri quadri e un sottotetto scoperto durante i lavori</h2>
            </div>
            <p className="text-grafite md:col-span-5 md:pt-8">Un progetto che è cambiato in cantiere, come succede spesso nelle ristrutturazioni. Il racconto è dello studio.</p>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-4">
            {STORY.map((st, i) => (
              <li key={st.n} className={cn(i === 1 && 'md:mt-16', i === 2 && 'md:mt-32')}>
                <MaskReveal>
                  <Img id={st.img} alt={st.alt} ratio="4 / 5" sizes="(min-width:768px) 33vw, 100vw" />
                </MaskReveal>
                <p className="t-label mt-4 text-coppo">
                  0{i + 1} · {st.n}
                </p>
                <p className="t-h3 mt-1">{st.t}</p>
              </li>
            ))}
          </ol>
          <Link to="/progetti/casa-l" className="link-line mt-10 inline-block font-display">
            Tutte le foto di Casa L
          </Link>
        </div>
      </section>

      <section className="section bg-pietra/50">
        <div className="wrap grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5" data-reveal>
            <p className="t-label text-coppo">Domande frequenti</p>
            <h2 className="t-h2 mt-3">Prima di cominciare</h2>
            <div className="mt-8 hidden md:block">
              <Img id="25c17be90e54dbad" alt="Casa al mare, la zona giorno" ratio="4 / 3" sizes="40vw" />
            </div>
          </div>
          <div className="md:col-span-7">
            <Faq />
          </div>
        </div>
      </section>

      <ServiceProjects slug="case" title="Case che abbiamo ristrutturato" />
      <OtherServices current="case" />
      <ClosingCta image="7fb1e9610e54dba8" title="Hai una casa da ristrutturare o da ampliare?" />
    </Page>
  )
}
