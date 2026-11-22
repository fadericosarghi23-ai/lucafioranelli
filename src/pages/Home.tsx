import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Page, SectionHead } from '@/components/Page'
import { Img } from '@/components/Img'
import { ProjectCard, Reviews, ClosingCta } from '@/components/Blocks'
import { ConeroCoast } from '@/components/ConeroCoast'
import { HomeHero } from '@/components/HomeHero'
import { getProject } from '@/content/projects'
import { services } from '@/content/services'
import { cn } from '@/lib/utils'

function Approach() {
  return (
    <section className="section">
      <div className="wrap grid gap-10 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5" data-reveal>
          <p className="t-label mb-4 text-coppo">Sulla Riviera del Conero</p>
          <blockquote className="t-h2 max-w-[22ch]">
            “Al centro di ogni immagine scattata nei paesi in cui viviamo c’è sempre una nostra macchia di colore.”
          </blockquote>
          <p className="t-label mt-4 text-grafite">Dalla presentazione dello studio</p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-7">
          <Img id="4da1b9370e45613c" alt="Country House Borgo Rosso a Sirolo, la casa rossa nel giardino" ratio="4 / 5" className="mt-10" sizes="(min-width:1024px) 28vw, 50vw" />
          <div className="space-y-3">
            <Img id="dfd169f30e54da0a" alt="Casa del fornaio a Numana, la scala esterna con i gerani" ratio="4 / 5" sizes="(min-width:1024px) 28vw, 50vw" />
          </div>
        </div>
        <ul className="grid gap-6 border-t border-pietra pt-8 sm:grid-cols-3 md:col-span-12" data-placeholder="tratti qualitativi da confermare">
          {/* [SEGNAPOSTO] tratti ricavati dal profilo Houzz e dalle recensioni, da far confermare */}
          {[
            ['Prima si ascolta', 'Nessuno stile precostituito: il progetto nasce da come vivi la casa o da come accogli i tuoi ospiti.'],
            ['Sempre in cantiere', 'Seguiamo i lavori di persona, dalle demolizioni ai dettagli, insieme alle imprese.'],
            ['Case antiche e vincoli', 'Centri storici, spazi ridotti, vincoli urbanistici: si leggono gli edifici prima di trasformarli.'],
          ].map(([t, d], i) => (
            <li key={t} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <p className="t-label mb-2 text-coppo">0{i + 1}</p>
              <p className="t-h3">{t}</p>
              <p className="mt-2 text-grafite">{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Featured() {
  const big = getProject('casa-due-mari')!
  const rest = ['country-house-borgo-rosso', 'hotel-san-francesco', 'giulia-camere'].map((s) => getProject(s)!)
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead label="Progetti" title="Case, casali e hotel tra Ancona e Loreto">
          <p>Una selezione dei lavori dello studio. Ogni progetto ha la sua galleria completa.</p>
          <Link to="/progetti" className="link-line mt-4 inline-block font-display font-medium text-inchiostro">
            Tutti i progetti
          </Link>
        </SectionHead>
        <div className="mt-10 grid gap-x-4 gap-y-10 md:grid-cols-12">
          <ProjectCard p={big} ratio="3 / 2" className="md:col-span-7" sizes="(min-width:1024px) 58vw, 100vw" />
          <div className="grid gap-y-10 md:col-span-5">
            <ProjectCard p={rest[0]} ratio="3 / 2" sizes="(min-width:1024px) 40vw, 100vw" delay={80} />
          </div>
          <ProjectCard p={rest[1]} ratio="4 / 3" className="md:col-span-5" delay={0} />
          <ProjectCard p={rest[2]} ratio="4 / 3" className="md:col-span-4 md:col-start-8" delay={80} />
        </div>
      </div>
    </section>
  )
}

/** Servizi come pannelli fotografici che si allargano al passaggio (desktop); due colonne su mobile. */
function ServicesStrip() {
  const [open, setOpen] = useState(0)
  return (
    <section className="section bg-pietra/50">
      <div className="wrap">
        <SectionHead label="Servizi" title="Quattro modi di entrare in una casa">
          <p data-placeholder="introduzione servizi">Dall’hotel alla scala di casa: stesso metodo, scale diverse.</p>
        </SectionHead>
        <ul className="mt-10 grid grid-cols-2 gap-3 lg:flex lg:h-[520px] lg:gap-3">
          {services.map((s, i) => (
            <li
              key={s.slug}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              className={cn('relative transition-[flex-grow] duration-500 ease-out lg:min-w-0 lg:basis-0', open === i ? 'lg:grow-[2.6]' : 'lg:grow')}
              data-reveal
              style={{ ['--d' as string]: `${i * 70}ms` }}
            >
              <Link to={`/servizi/${s.slug}`} className="group relative block h-full overflow-hidden">
                <Img id={s.cover} alt="" className="aspect-[3/4] lg:aspect-auto lg:h-full" ratio="auto" sizes="(min-width:1024px) 40vw, 50vw" imgClassName="transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-4">
                  <div className="bg-calce/95 p-3 md:p-4">
                    <p className="t-label text-coppo">0{i + 1}</p>
                    <p className="t-h3 mt-1 text-[1rem] md:text-[1.2rem]">{s.title}</p>
                    <p className={cn('mt-1 hidden text-[0.95rem] leading-snug text-grafite md:block', open !== i && 'lg:hidden')}>
                      {s.short}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <Page path="/">
      <HomeHero />
      <Approach />
      <Featured />
      <ServicesStrip />
      <section className="section">
        <div className="wrap">
          <SectionHead label="La costa, vista dal mare" title="Dal Passetto a Porto Recanati, i luoghi dei nostri progetti">
            <p>
              Il profilo è disegnato con le quote reali del terreno. Al centro il Monte Conero; ai suoi piedi Sirolo e Numana, dove lavoriamo di più. Tocca un paese per
              vedere i progetti.
            </p>
          </SectionHead>
          <div className="mt-10">
            <ConeroCoast />
          </div>
        </div>
      </section>
      <section className="section pt-0">
        <div className="wrap">
          <SectionHead label="Dicono di noi" title={<span data-placeholder="titolo da confermare">Clienti che tornano, a volte dopo trent’anni</span>} />
          <Reviews className="mt-10" />
        </div>
      </section>
      <ClosingCta />
    </Page>
  )
}
