import { Link } from 'react-router-dom'
import { Img } from './Img'
import { ButtonLink, ButtonA } from './ui/button'
import { categoryLabel, type Project } from '@/content/projects'
import { reviews, site } from '@/content/site'
import { FaldaGlyph } from './Logo'
import { cn } from '@/lib/utils'

export function ProjectCard({ p, ratio = '4 / 3', sizes, className, delay = 0 }: { p: Project; ratio?: string; sizes?: string; className?: string; delay?: number }) {
  return (
    <Link to={`/progetti/${p.slug}`} className={cn('group block', className)} data-reveal style={{ ['--d' as string]: `${delay}ms` }}>
      <div className="relative overflow-hidden">
        <Img
          id={p.cover}
          alt={`${p.title}, ${p.place}`}
          ratio={ratio}
          sizes={sizes ?? '(min-width:1024px) 33vw, 50vw'}
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="pill t-label absolute bottom-3 left-3 !text-[0.66rem]">{categoryLabel[p.category]}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <h3 className="t-h3 transition-colors duration-200 group-hover:text-coppo">{p.title}</h3>
        <span className="t-label shrink-0 text-grafite">{p.place}</span>
      </div>
      <p className="mt-1 text-[0.98rem] leading-snug text-grafite">{p.kicker}</p>
    </Link>
  )
}

export function Reviews({ limit = 3, className }: { limit?: number; className?: string }) {
  return (
    <ul className={cn('grid gap-4 md:grid-cols-3', className)} data-placeholder="recensioni Houzz: chiedere il permesso di citarle">
      {/* [SEGNAPOSTO] recensioni pubbliche Houzz, solo iniziali, da confermare con il cliente */}
      {reviews.slice(0, limit).map((r, i) => (
        <li key={r.initials} className="flex flex-col justify-between border border-pietra bg-white/60 p-6" data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
          <blockquote className="text-[1.05rem] leading-relaxed">
            <span aria-hidden className="mb-2 block font-display text-4xl leading-none text-coppo">
              “
            </span>
            {r.text}
          </blockquote>
          <p className="t-label mt-5 text-grafite">
            {r.initials} · Houzz, {r.date}
          </p>
        </li>
      ))}
    </ul>
  )
}

/** Chiusura delle pagine: invito a scrivere, con una foto del cliente come appoggio visivo. */
export function ClosingCta({ image = '8d01820c0f3257df', title, text }: { image?: string; title?: string; text?: string }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="grid items-stretch gap-0 overflow-hidden bg-inchiostro text-calce on-dark md:grid-cols-12" data-reveal>
          <div className="flex flex-col justify-between gap-10 p-6 md:col-span-7 md:p-12">
            <FaldaGlyph className="h-12 w-10 text-sabbia" accent="var(--coppo-chiaro)" />
            <div>
              <h2 className="t-h2 max-w-[18ch]">{title ?? 'Raccontaci la casa, il locale o il casale che hai in mente.'}</h2>
              <p className="mt-4 max-w-lg text-calce/75" data-placeholder="testo invito">
                {/* [SEGNAPOSTO] */}
                {text ?? 'Bastano poche righe: dove si trova, cosa vorresti cambiare, entro quando. Ti richiamiamo per fissare un sopralluogo.'}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to="/contatti" variant="light">
                  Scrivici
                </ButtonLink>
                <ButtonA href={site.phoneMobile.href} variant="outline" className="border-calce/50 text-calce hover:bg-calce hover:text-inchiostro" arrow={false}>
                  {site.phoneMobile.label}
                </ButtonA>
              </div>
            </div>
          </div>
          <div className="relative min-h-[260px] md:col-span-5">
            <Img id={image} alt="" className="absolute inset-0 h-full" ratio="auto" sizes="(min-width:768px) 40vw, 100vw" />
          </div>
        </div>
      </div>
    </section>
  )
}
