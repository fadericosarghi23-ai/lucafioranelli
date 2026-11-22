import type { ServiceSlug } from './projects'

// [SEGNAPOSTO] testi dei servizi scritti da noi a partire dal profilo Houzz dello studio.
export interface Service {
  slug: ServiceSlug
  title: string
  short: string
  cover: string
  intro: string
}

export const services: Service[] = [
  {
    slug: 'ospitalita',
    title: 'Ospitalità',
    short: 'Hotel, B&B, ristoranti e stabilimenti balneari.',
    cover: 'e40112010e456143',
    intro: 'Gran parte del nostro lavoro è per chi accoglie: hotel, B&B, bar e ristoranti, stabilimenti balneari della Riviera del Conero e dell’entroterra.',
  },
  {
    slug: 'centri-storici',
    title: 'Centri storici e casali',
    short: 'Restauro, consolidamento e recupero di case antiche.',
    cover: 'dfd169f30e54da0a',
    intro: 'Le case dei centri storici e i casali di campagna vanno prima letti, poi trasformati. Sotto il bel vestito, spesso, c’è un lavoro strutturale che non si vede.',
  },
  {
    slug: 'case',
    title: 'Case e ristrutturazioni',
    short: 'Ristrutturazioni, ampliamenti, recupero di sottotetti.',
    cover: '7fb1e9610e54dba8',
    intro: 'Una casa su misura parte dall’ascolto: come si vive, cosa serve, cosa si desidera. Poi si disegna, e si segue il cantiere fino all’ultimo dettaglio.',
  },
  {
    slug: 'interni',
    title: 'Interni e dettagli',
    short: 'Scale, librerie, bagni e arredi disegnati per lo spazio.',
    cover: 'a2d18d8e0e54daaf',
    intro: 'Una scala in acciaio rivestita in legno, una libreria che diventa parapetto, un bagno ricavato in pochi metri. Il dettaglio è dove un progetto si riconosce.',
  },
]

export const getService = (slug: string) => services.find((s) => s.slug === slug)
