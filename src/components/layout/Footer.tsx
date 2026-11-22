import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { site } from '@/content/site'
import { services } from '@/content/services'
import { skyline, DEM_SOURCE } from '@/lib/conero'

const W = 1440
const H = 120
const sk = skyline(W, H, { topPad: 10 })

const fLink = 'link-line text-calce/85 hover:text-coppo-chiaro'

export function Footer() {
  return (
    <footer className="on-dark relative mt-0 bg-inchiostro text-calce">
      {/* Motivo grafico: profilo reale della costa dal Passetto di Ancona a Porto Recanati */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[70px] w-full md:h-[110px]" aria-hidden="true">
        <rect width={W} height={H} fill="var(--calce)" />
        <path d={sk.fill} fill="var(--inchiostro)" />
      </svg>

      <div className="wrap grid gap-10 pb-10 pt-10 md:grid-cols-12 md:pt-14">
        <div className="md:col-span-5">
          <Link to="/" aria-label="Torna alla Home" className="inline-block rounded-sm">
            <Logo onDark />
          </Link>
          <p className="mt-6 max-w-sm text-calce/80" data-placeholder="testo breve dello studio">
            {/* [SEGNAPOSTO] */}
            Case, centri storici e luoghi d’accoglienza sulla Riviera del Conero, disegnati su misura e seguiti in cantiere.
          </p>
          <p className="t-label mt-6 text-sabbia">
            {site.coordsLabel} · ±0,00 Via del Porto · +{site.coneroHeight} Monte Conero
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="t-label mb-4 text-sabbia">Studio</p>
          <address className="space-y-1.5 not-italic" data-placeholder="dati di contatto da confermare">
            <p>
              {site.address.street}
              <br />
              {site.address.cap} {site.address.city} ({site.address.province})
            </p>
            <p>
              <a className={fLink} href={site.phoneMobile.href}>
                {site.phoneMobile.label}
              </a>
            </p>
            <p>
              <a className={fLink} href={site.phoneOffice.href}>
                {site.phoneOffice.label}
              </a>
            </p>
            <p>
              <a className={fLink} href={site.email.href}>
                {site.email.label}
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Pagine" className="grid grid-cols-2 gap-6 md:col-span-4">
          <div>
            <p className="t-label mb-4 text-sabbia">Pagine</p>
            <ul className="space-y-1.5">
              {[
                ['/progetti', 'Progetti'],
                ['/servizi', 'Servizi'],
                ['/studio', 'Studio'],
                ['/contatti', 'Contatti'],
              ].map(([to, l]) => (
                <li key={to}>
                  <Link className={fLink} to={to}>
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="t-label mb-4 text-sabbia">Servizi</p>
            <ul className="space-y-1.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link className={fLink} to={`/servizi/${s.slug}`}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-calce/10">
        <div className="wrap flex flex-col gap-3 py-6 text-[0.85rem] text-calce/60 md:flex-row md:items-center md:justify-between">
          <p data-placeholder="dati legali da confermare">
            {/* [SEGNAPOSTO] P.IVA e PEC da confermare */}
            {site.brand} · {site.vat.label} · {site.albo}
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1">
            <Link className={fLink} to="/privacy">
              Privacy
            </Link>
            <Link className={fLink} to="/cookie">
              Cookie
            </Link>
            <a className={fLink} href={site.social.houzz} target="_blank" rel="noopener noreferrer">
              Houzz
            </a>
            <a className={fLink} href={site.social.facebook} target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
          </p>
        </div>
        <p className="wrap pb-6 text-[0.75rem] text-calce/40">{DEM_SOURCE}</p>
      </div>
    </footer>
  )
}
