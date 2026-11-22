import { useRef, type ReactNode } from 'react'
// MaskReveal non usa più framer-motion: entrate solo in CSS
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Img } from './Img'
import { ProjectCard } from './Blocks'
import { projects, type ServiceSlug } from '@/content/projects'
import { services } from '@/content/services'
import { useScrollScenes } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Percorso" className="t-label flex items-center gap-1.5 text-grafite">
      <Link to="/servizi" className="transition-colors hover:text-coppo">
        Servizi
      </Link>
      <ChevronRight className="size-3" aria-hidden />
      <span aria-current="page" className="text-inchiostro">
        {title}
      </span>
    </nav>
  )
}

/**
 * Foto che si apre con una maschera quando entra in vista (modalità alta).
 * Usa lo stesso sistema CSS delle entrate (classe .is-in + rete di sicurezza): non può restare nascosta.
 */
export function MaskReveal({ children, className, from = 'bottom' }: { children: ReactNode; className?: string; from?: 'bottom' | 'left' }) {
  return (
    <div className={className} data-reveal={from === 'bottom' ? 'mask' : 'mask-left'}>
      <div>{children}</div>
    </div>
  )
}

/** Foto con parallasse leggera legata allo scroll (spenta su mobile). */
export function ParallaxImg({ id, alt, className, ratio = '3 / 2', priority }: { id: string; alt: string; className?: string; ratio?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const scenes = useScrollScenes()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)} style={{ aspectRatio: ratio }}>
      <motion.div className="absolute inset-[-8%_0]" style={scenes ? { y } : undefined}>
        <Img id={id} alt={alt} ratio="auto" className="h-full" sizes="(min-width:1024px) 60vw, 100vw" priority={priority} />
      </motion.div>
    </div>
  )
}

export function ServiceProjects({ slug, title = 'Progetti collegati' }: { slug: ServiceSlug; title?: string }) {
  const list = projects.filter((p) => p.services.includes(slug))
  return (
    <section className="section">
      <div className="wrap">
        <div className="mb-8 flex items-baseline justify-between border-t border-inchiostro pt-4" data-reveal>
          <h2 className="t-h2">{title}</h2>
          <Link to="/progetti" className="link-line font-display text-[0.95rem]">
            Tutti i progetti
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-4">
          {list.map((p, i) => (
            <li key={p.slug}>
              <ProjectCard p={p} delay={(i % 3) * 70} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Altri servizi, in fondo alle pagine servizio */
export function OtherServices({ current }: { current: ServiceSlug }) {
  return (
    <section className="wrap pb-12">
      <p className="t-label mb-4 border-t border-pietra pt-4 text-grafite">Altri servizi</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {services
          .filter((s) => s.slug !== current)
          .map((s) => (
            <li key={s.slug}>
              <Link to={`/servizi/${s.slug}`} className="group grid grid-cols-[72px_1fr] items-center gap-3 border border-pietra p-2 transition-colors hover:border-inchiostro">
                <Img id={s.cover} alt="" ratio="1 / 1" sizes="72px" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                <span className="t-h3 text-[1rem] transition-colors group-hover:text-coppo">{s.title}</span>
              </Link>
            </li>
          ))}
      </ul>
    </section>
  )
}
