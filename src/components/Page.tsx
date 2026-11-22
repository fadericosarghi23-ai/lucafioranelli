import { useEffect, type ReactNode } from 'react'
import { Seo } from './Seo'
import { scanReveal } from '@/lib/reveal'

/** Involucro di ogni pagina: meta lato client + scansione delle entrate dopo il montaggio (anche per le rotte lazy). */
export function Page({ path, title, description, children }: { path: string; title?: string; description?: string; children: ReactNode }) {
  useEffect(() => {
    scanReveal()
  }, [path])
  return (
    <>
      <Seo path={path} title={title} description={description} />
      {children}
    </>
  )
}

/** Intestazione di sezione: etichetta tecnica, titolo come blocco, testo. */
export function SectionHead({
  label,
  title,
  children,
  className = '',
  as: Tag = 'h2',
}: {
  label?: string
  title: ReactNode
  children?: ReactNode
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={'grid gap-5 border-t border-inchiostro pt-4 md:grid-cols-12 ' + className} data-reveal>
      <div className="md:col-span-7">
        {label && <p className="t-label mb-3 text-coppo">{label}</p>}
        <Tag className={Tag === 'h1' ? 't-h1' : 't-h2'}>{title}</Tag>
      </div>
      {children && <div className="text-grafite md:col-span-5 md:pt-8">{children}</div>}
    </div>
  )
}
