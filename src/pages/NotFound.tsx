import { Link } from 'react-router-dom'
import { Page } from '@/components/Page'
import { ButtonLink } from '@/components/ui/button'
import { projects } from '@/content/projects'
import { Img } from '@/components/Img'

export default function NotFound() {
  const picks = projects.slice(0, 3)
  return (
    <Page path="/404" title="Pagina non trovata | Studio Fioranelli" description="La pagina che cerchi non esiste.">
      <section className="wrap grid min-h-[70svh] gap-10 pb-16 pt-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-6">
          <p className="t-label text-coppo">Errore 404 · quota non trovata</p>
          <h1 className="t-h1 mt-4">Questa pagina non c’è</h1>
          <p className="mt-4 max-w-md text-grafite">Forse il link è vecchio o c’è un errore di battitura. Riparti dalla Home o guarda i progetti.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/">Torna alla Home</ButtonLink>
            <ButtonLink to="/progetti" variant="outline">
              I progetti
            </ButtonLink>
          </div>
        </div>
        <ul className="grid grid-cols-3 gap-3 md:col-span-6">
          {picks.map((p) => (
            <li key={p.slug}>
              <Link to={`/progetti/${p.slug}`} className="group block">
                <Img id={p.cover} alt="" ratio="3 / 4" sizes="18vw" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                <span className="t-label mt-2 block transition-colors group-hover:text-coppo">{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  )
}
