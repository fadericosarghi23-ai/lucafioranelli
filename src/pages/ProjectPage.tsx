import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { Page } from '@/components/Page'
import { Img, imgMeta } from '@/components/Img'
import { Gallery } from '@/components/Gallery'
import { BeforeAfter } from '@/components/BeforeAfter'
import { ClosingCta } from '@/components/Blocks'
import { getProject, projects, categoryLabel, allImages } from '@/content/projects'
import { getService } from '@/content/services'
import { useScrollScenes } from '@/hooks/use-media'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const p = getProject(slug)
  const ref = useRef<HTMLDivElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  if (!p) return <NotFound />

  const idx = projects.findIndex((x) => x.slug === p.slug)
  const prev = projects[(idx - 1 + projects.length) % projects.length]
  const next = projects[(idx + 1) % projects.length]
  const imgs = allImages(p)
  const heroId = p.slug === 'casa-due-mari' ? '8ad1979f0f3257e7' : p.cover

  return (
    <Page path={`/progetti/${p.slug}`}>
      <article>
        <header className="wrap pb-8 pt-8 md:pt-14">
          <Link to="/progetti" className="t-label inline-flex items-center gap-2 text-grafite transition-colors hover:text-coppo">
            <ArrowLeft className="size-3.5" /> Tutti i progetti
          </Link>
          <div className="mt-6 grid gap-6 md:grid-cols-12">
            <h1 className="t-h1 md:col-span-8">{p.title}</h1>
            <dl className="grid grid-cols-3 gap-4 self-end border-t border-inchiostro pt-3 md:col-span-4">
              <div>
                <dt className="t-label text-grafite">Luogo</dt>
                <dd className="mt-1 font-display font-medium">{p.place}</dd>
              </div>
              <div>
                <dt className="t-label text-grafite">Tipo</dt>
                <dd className="mt-1 font-display font-medium">{categoryLabel[p.category]}</dd>
              </div>
              <div>
                <dt className="t-label text-grafite">Anno</dt>
                <dd className="mt-1 font-display font-medium" data-placeholder={p.year ? undefined : 'anno da chiedere'}>
                  {p.year ?? 'da confermare'}
                </dd>
              </div>
            </dl>
          </div>
        </header>

        {imgMeta(heroId).w >= 1400 ? (
          <div ref={ref} className="relative h-[56svh] min-h-[300px] overflow-hidden md:h-[78svh]">
            <motion.div className="absolute inset-[-6%_0]" style={scenes ? { y } : undefined}>
              <Img id={heroId} alt={`${p.title}, ${p.place}`} priority ratio="auto" className="h-full" sizes="100vw" />
            </motion.div>
          </div>
        ) : (
          // foto d'archivio a bassa risoluzione: niente tutto schermo, resta nitida
          <div ref={ref} className="wrap">
            <div className="mx-auto max-w-4xl" data-placeholder="foto in alta risoluzione da chiedere">
              <Img id={heroId} alt={`${p.title}, ${p.place}`} priority ratio="3 / 2" sizes="(min-width:1024px) 900px, 100vw" />
            </div>
          </div>
        )}

        <section className="wrap section grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="t-label text-coppo">Il progetto</p>
            <p className="mt-3 font-display text-xl font-medium leading-snug">{p.kicker}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.services.map((s) => (
                <li key={s}>
                  <Link to={`/servizi/${s}`} className="inline-block rounded-full border border-sabbia px-3 py-1 text-[0.9rem] transition-colors hover:border-inchiostro hover:text-coppo">
                    {getService(s)?.title}
                  </Link>
                </li>
              ))}
            </ul>
            {p.external && (
              <a href={p.external} target="_blank" rel="noopener noreferrer" className="link-line mt-6 inline-flex items-center gap-2 font-display text-[0.95rem]">
                Sito della struttura <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
          <div className="space-y-5 text-[1.15rem] leading-relaxed md:col-span-7 md:col-start-6" data-placeholder={p.bodySource === 'segnaposto' ? 'testo progetto da far scrivere o approvare' : undefined}>
            {p.bodySource === 'segnaposto' && <>{/* [SEGNAPOSTO] descrizione scritta da noi guardando le foto */}</>}
            {p.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
            {p.bodySource === 'houzz' && <p className="t-label text-grafite">Testo dello studio</p>}
          </div>
        </section>

        {p.before && (
          <section className="wrap pb-12 md:pb-20">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-4" data-reveal>
                <p className="t-label text-coppo">Prima e dopo</p>
                <h2 className="t-h2 mt-3">Com’era, com’è</h2>
              </div>
              <div className="md:col-span-8">
                <BeforeAfter before={p.before.image} after={p.before.after} note={p.before.note} title={p.title} />
              </div>
            </div>
          </section>
        )}

        <section className="wrap pb-12 md:pb-20">
          {p.chapters ? (
            p.chapters.map((c, i) => (
              <div key={c.title} className={i ? 'mt-14' : ''}>
                <div className="mb-5 flex items-baseline justify-between border-t border-inchiostro pt-3">
                  <h2 className="t-h3">{c.title}</h2>
                  <span className="t-label text-grafite">{c.images.length} foto</span>
                </div>
                <Gallery images={c.images} title={`${p.title}, ${c.title.toLowerCase()}`} prefix={`${p.slug}-${i}`} />
              </div>
            ))
          ) : (
            <>
              <div className="mb-5 flex items-baseline justify-between border-t border-inchiostro pt-3">
                <h2 className="t-h3">Galleria</h2>
                <span className="t-label text-grafite">{imgs.length} foto</span>
              </div>
              <Gallery images={imgs} title={p.title} prefix={p.slug} />
            </>
          )}
        </section>

        <nav aria-label="Altri progetti" className="wrap grid gap-3 pb-6 sm:grid-cols-2">
          {[
            { q: prev, label: 'Precedente', Icon: ArrowLeft },
            { q: next, label: 'Successivo', Icon: ArrowRight },
          ].map(({ q, label, Icon }) => (
            <Link key={label} to={`/progetti/${q.slug}`} className="group grid grid-cols-[96px_1fr] items-center gap-4 border border-pietra bg-white/50 p-3 transition-colors hover:border-inchiostro">
              <Img id={q.cover} alt="" ratio="1 / 1" sizes="96px" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              <span>
                <span className="t-label flex items-center gap-1.5 text-grafite">
                  {label === 'Precedente' && <Icon className="size-3.5" />}
                  {label}
                  {label === 'Successivo' && <Icon className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
                </span>
                <span className="t-h3 mt-1 block transition-colors group-hover:text-coppo">{q.title}</span>
              </span>
            </Link>
          ))}
        </nav>
      </article>
      <ClosingCta />
    </Page>
  )
}
