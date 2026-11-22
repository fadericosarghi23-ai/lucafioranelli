import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { ProjectCard, ClosingCta } from '@/components/Blocks'
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder'
import { projects, categoryLabel, allImages, type Category } from '@/content/projects'
import { cn, pad2 } from '@/lib/utils'

const FILTERS: { key: 'tutti' | Category; label: string }[] = [
  { key: 'tutti', label: 'Tutti' },
  { key: 'case', label: 'Case' },
  { key: 'ospitalita', label: 'Ospitalità' },
]

export default function Projects() {
  const [params, setParams] = useSearchParams()
  const filter = (params.get('tipo') as Category | null) ?? 'tutti'
  const list = useMemo(() => (filter === 'tutti' ? projects : projects.filter((p) => p.category === filter)), [filter])
  const [hover, setHover] = useState(0)
  const current = list[Math.min(hover, list.length - 1)]

  return (
    <Page path="/progetti">
      <section className="wrap pb-6 pt-10 md:pt-16">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <p className="t-label mb-4 text-coppo">Progetti · {pad2(projects.length)}</p>
            <h1 className="t-h1">Case, casali e luoghi d’accoglienza</h1>
          </div>
          <p className="self-end text-grafite md:col-span-4">
            Da Ancona a Loreto: appartamenti, case nei centri storici, una country house, un convento diventato hotel. Le foto vengono dall’archivio dello studio.
          </p>
        </div>

        <div role="radiogroup" aria-label="Filtra per tipologia" className="mt-8 flex flex-wrap gap-2 border-t border-inchiostro pt-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="radio"
              aria-checked={filter === f.key}
              onClick={() => {
                setHover(0)
                setParams(f.key === 'tutti' ? {} : { tipo: f.key }, { replace: true, preventScrollReset: true })
              }}
              className={cn(
                'rounded-full border px-4 py-1.5 font-display text-[0.95rem] font-medium transition-colors duration-200',
                filter === f.key ? 'border-inchiostro bg-inchiostro text-calce' : 'border-sabbia hover:border-inchiostro hover:text-coppo',
              )}
            >
              {f.label}
              <span className="ml-2 opacity-60">{f.key === 'tutti' ? projects.length : projects.filter((p) => p.category === f.key).length}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Desktop: elenco editoriale con anteprima che cambia in dissolvenza */}
      <section className="wrap hidden pb-16 lg:block">
        <div className="grid grid-cols-12 gap-8">
          <ol className="col-span-6" onMouseLeave={() => undefined}>
            {list.map((p, i) => (
              <li key={p.slug} className="border-b border-pietra">
                <Link
                  to={`/progetti/${p.slug}`}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-5"
                >
                  <span className={cn('t-label transition-colors', i === hover ? 'text-coppo' : 'text-grafite')}>{pad2(i + 1)}</span>
                  <span>
                    <span className={cn('block font-display text-[1.9rem] font-semibold leading-tight tracking-[-0.015em] transition-colors', i === hover && 'text-coppo')} style={{ fontStretch: '112%' }}>
                      {p.title}
                    </span>
                    <span className="mt-1 block text-grafite">{p.kicker}</span>
                  </span>
                  <span className="t-label flex items-center gap-2 text-grafite">
                    {p.place}
                    <ArrowUpRight className={cn('size-4 transition-transform duration-200', i === hover && '-translate-y-0.5 translate-x-0.5 text-coppo')} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="col-span-6">
            <div className="sticky top-[calc(var(--header-h)+24px)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-pietra">
                <AnimatePresence initial={false}>
                  <motion.div key={current.slug} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <Img id={current.cover} alt={`${current.title}, ${current.place}`} ratio="auto" className="h-full" sizes="45vw" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-3 flex justify-between">
                <p className="t-label">{categoryLabel[current.category]}{current.year ? ` · ${current.year}` : ''}</p>
                <p className="t-label text-grafite">{allImages(current).length} foto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile e tablet: card in due colonne */}
      <section className="wrap pb-12 lg:hidden">
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3">
          {list.map((p) => (
            <li key={p.slug}>
              <ProjectCard p={p} ratio="4 / 5" sizes="(min-width:768px) 33vw, 50vw" />
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pb-12">
        <div className="grid items-center gap-6 border-t border-inchiostro pt-6 md:grid-cols-12">
          <div className="md:col-span-4">
            <PhotoPlaceholder subject="Ricci, pescheria e friggitoria a Numana: il banco e la “nave”" format="3:2 orizzontale" notes="Progetto citato in una recensione, non ancora pubblicato. Servono 6 o 8 foto." ratio="3 / 2" />
          </div>
          <p className="text-grafite md:col-span-6" data-placeholder="progetti da aggiungere">
            {/* [SEGNAPOSTO] */}
            Altri progetti in arrivo: ristoranti, stabilimenti balneari e case in costruzione. Chiedere al cliente l’elenco completo e le foto originali.
          </p>
        </div>
      </section>

      <ClosingCta />
    </Page>
  )
}
