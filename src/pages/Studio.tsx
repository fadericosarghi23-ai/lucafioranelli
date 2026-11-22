import { Page, SectionHead } from '@/components/Page'
import { Img } from '@/components/Img'
import { PhotoPlaceholder } from '@/components/PhotoPlaceholder'
import { QuotaSection } from '@/components/QuotaSection'
import { Reviews, ClosingCta } from '@/components/Blocks'
import { MaskReveal } from '@/components/ServiceParts'
import { site } from '@/content/site'
import { DEM_SOURCE } from '@/lib/conero'

// [SEGNAPOSTO] ruoli e biografie: lo studio è di due architetti (Luciano e Luca Fioranelli, dalle recensioni Houzz).
const PEOPLE = [
  {
    name: 'Luca Fioranelli',
    role: 'Architetto',
    note: 'Iscritto all’Ordine degli Architetti PPC di Ancona, matricola 1363.',
    photo: 'Ritratto di Luca Fioranelli in studio o in cantiere',
  },
  {
    name: 'Luciano Fioranelli',
    role: 'Architetto',
    note: 'Ruolo e biografia da chiedere al cliente.',
    photo: 'Ritratto di Luciano Fioranelli in studio',
  },
]

export default function Studio() {
  return (
    <Page path="/studio">
      <section className="wrap pb-10 pt-10 md:pt-16">
        <p className="t-label mb-4 text-coppo">Lo studio</p>
        <div className="grid gap-8 md:grid-cols-12">
          <h1 className="t-h1 md:col-span-7">Uno studio in Via del Porto, ai piedi del Conero</h1>
          <div className="space-y-4 self-end text-[1.08rem] md:col-span-5" data-placeholder="testo dello studio (da Houzz), da rivedere">
            {/* Testo dello studio dal profilo Houzz, leggermente ripulito. [SEGNAPOSTO] da far rivedere */}
            <p>
              Le idee, i progetti e le realizzazioni dello studio sono sostenuti da una profonda conoscenza della natura dei segni, dei materiali e delle tecniche.
            </p>
            <p className="text-grafite">
              Le nostre opere non seguono schemi, stili o tendenze precostituite: sono vestiti su misura, tagliati sull’ascolto delle esigenze e dei desideri del cliente. Il nostro
              fare è semplice e familiare, ricco di riferimenti e profumato di memoria.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap pb-12 md:pb-20">
        <div className="grid grid-cols-6 gap-3 md:grid-cols-12">
          <MaskReveal className="col-span-6 md:col-span-7">
            <Img id="8ad1979f0f3257e7" alt="La baia di Numana vista dalla terrazza di Casa Due Mari" ratio="3 / 2" priority sizes="(min-width:768px) 58vw, 100vw" />
          </MaskReveal>
          <div className="col-span-3 md:col-span-2 md:mt-24">
            <Img id="4da1b9370e45613c" alt="Country House Borgo Rosso, il giardino" ratio="3 / 4" sizes="(min-width:768px) 16vw, 50vw" />
          </div>
          <div className="col-span-3 md:col-span-3">
            <PhotoPlaceholder subject="L’ingresso dello studio in Via del Porto" format="3:4 verticale" notes="Facciata e insegna, luce del mattino." ratio="3 / 4" />
          </div>
        </div>
      </section>

      {/* Momento d'autore: la sezione reale dalla vetta al porto */}
      <section className="section bg-pietra/50">
        <div className="wrap">
          <SectionHead label="Dove lavoriamo" title={`Dalla vetta a +${site.coneroHeight} al porto a ±0,00`}>
            <p>
              Lo studio sta a livello del mare, in Via del Porto. Alle spalle c’è il Monte Conero: questa è la sezione vera del terreno tra la vetta e lo studio. Molti dei
              progetti che trovi in questo sito sono a pochi chilometri da qui.
            </p>
          </SectionHead>
          <div className="mt-10">
            <QuotaSection />
          </div>
          <p className="mt-4 text-[0.8rem] text-grafite">{DEM_SOURCE}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead label="Le persone" title="Due architetti, uno studio">
            <p data-placeholder="testo da confermare">
              {/* [SEGNAPOSTO] dalle recensioni: i clienti ringraziano “Luciano e Luca”. Chiedere storia e ruoli. */}
              I clienti ci conoscono come “i due Fioranelli”: lavoriamo insieme su ogni progetto e siamo entrambi in cantiere.
            </p>
          </SectionHead>
          <ul className="mt-10 grid gap-8 md:grid-cols-2">
            {PEOPLE.map((p, i) => (
              <li key={p.name} className="grid grid-cols-[40%_1fr] gap-5" data-reveal style={{ ['--d' as string]: `${i * 90}ms` }}>
                <PhotoPlaceholder subject={p.photo} format="4:5 verticale" ratio="4 / 5" />
                <div className="self-end">
                  <p className="t-label text-coppo">{p.role}</p>
                  <h3 className="t-h2 mt-2">{p.name}</h3>
                  <p className="mt-3 text-grafite" data-placeholder="biografia da chiedere">
                    {p.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section pt-0">
        <div className="wrap">
          <SectionHead label="Cinque recensioni su Houzz" title="Quello che dicono i clienti" />
          <Reviews limit={5} className="mt-10 md:grid-cols-2 lg:grid-cols-3" />
        </div>
      </section>

      <ClosingCta image="ef71d1a90e54dc95" />
    </Page>
  )
}
