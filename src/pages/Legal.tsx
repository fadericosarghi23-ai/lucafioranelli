import type { ReactNode } from 'react'
import { Page } from '@/components/Page'
import { FaldaGlyph } from '@/components/Logo'

export function LegalLayout({ path, title, updated, children }: { path: string; title: string; updated: string; children: ReactNode }) {
  return (
    <Page path={path}>
      <section className="wrap grid gap-10 pb-20 pt-10 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-5">
          <FaldaGlyph className="h-12 w-10 text-sabbia" />
          <h1 className="t-h2 mt-6 [overflow-wrap:anywhere]">{title}</h1>
          <p className="t-label mt-4 text-grafite">Aggiornata il {updated}</p>
        </div>
        <div className="space-y-5 md:col-span-7 md:col-start-6 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[1.35rem] [&_h2]:font-semibold [&_h2]:leading-tight [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
          {children}
        </div>
      </section>
    </Page>
  )
}
