import { useState } from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import { Page } from '@/components/Page'
import { Img } from '@/components/Img'
import { RequestForm } from '@/components/RequestForm'
import { Button } from '@/components/ui/button'
import { site } from '@/content/site'

/** La mappa (OpenStreetMap) si carica solo dopo un clic: prima nessuna richiesta a servizi esterni. */
function MapOnClick() {
  const [on, setOn] = useState(false)
  const { lat, lng } = site.geo
  const bbox = `${lng - 0.012},${lat - 0.006},${lng + 0.012},${lat + 0.006}`
  return (
    <div className="relative aspect-[4/3] overflow-hidden border border-pietra bg-pietra">
      {on ? (
        <iframe
          title="Mappa: Studio di Architettura Fioranelli, Via del Porto, Numana"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`}
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      ) : (
        <>
          <Img id="8ad1979f0f3257e7" alt="" ratio="auto" className="absolute inset-0 h-full opacity-40" sizes="(min-width:1024px) 40vw, 100vw" />
          <div className="absolute inset-0 flex flex-col items-start justify-end gap-3 p-5">
            <p className="pill text-[0.9rem]">La mappa viene da OpenStreetMap e si carica solo se la apri.</p>
            <Button type="button" onClick={() => setOn(true)} size="sm">
              Mostra la mappa
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Contacts() {
  return (
    <Page path="/contatti">
      <section className="wrap pb-8 pt-10 md:pt-16">
        <p className="t-label mb-4 text-coppo">Contatti</p>
        <div className="grid gap-6 md:grid-cols-12">
          <h1 className="t-h1 md:col-span-8">Parliamo del progetto</h1>
          <p className="self-end text-grafite md:col-span-4">Tre domande per capire di cosa hai bisogno. Ti ricontattiamo per una chiamata o un sopralluogo.</p>
        </div>
      </section>

      <section className="wrap grid gap-10 pb-16 md:pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RequestForm />
        </div>
        <aside className="space-y-6 lg:col-span-4 lg:col-start-9">
          <ul className="space-y-4 border-t border-inchiostro pt-5" data-placeholder="contatti da confermare">
            <li className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-coppo" />
              <span>
                {site.address.street}
                <br />
                {site.address.cap} {site.address.city} ({site.address.province})
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-1 size-5 shrink-0 text-coppo" />
              <span>
                <a href={site.phoneMobile.href} className="link-line">
                  {site.phoneMobile.label}
                </a>
                <br />
                <a href={site.phoneOffice.href} className="link-line">
                  {site.phoneOffice.label}
                </a>
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-1 size-5 shrink-0 text-coppo" />
              <a href={site.email.href} className="link-line">
                {site.email.label}
              </a>
            </li>
          </ul>
          <p className="t-label text-grafite" data-placeholder="orari da chiedere">
            {/* [SEGNAPOSTO] */}
            Orari dello studio: da confermare
          </p>
          <MapOnClick />
        </aside>
      </section>
    </Page>
  )
}
