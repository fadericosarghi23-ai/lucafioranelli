// Dati dello studio. Ogni campo con `verify: true` va confermato dal cliente prima di andare online.
// [SEGNAPOSTO] indirizzo (civico 14 o 16), telefoni, email, P.IVA, PEC, ruoli di Luca e Luciano.

export const site = {
  brand: 'Studio di Architettura Fioranelli',
  person: 'Luca Fioranelli',
  role: 'architetto',
  url: 'https://www.fioranelli.com', // [SEGNAPOSTO] dominio da confermare (oggi risponde 403)
  address: { street: 'Via del Porto 16', cap: '60026', city: 'Numana', province: 'AN', verify: true },
  geo: { lat: 43.50916, lng: 13.62206 },
  phoneMobile: { label: '338 102 1979', href: 'tel:+393381021979', verify: true },
  phoneOffice: { label: '071 736 0737', href: 'tel:+390717360737', verify: true },
  email: { label: 'luca@fioranelli.com', href: 'mailto:luca@fioranelli.com', verify: true },
  vat: { label: 'P.IVA 01011950423', verify: true },
  pec: { label: 'PEC da inserire', verify: true },
  albo: 'Iscritto all’Ordine degli Architetti PPC della Provincia di Ancona, matricola 1363',
  social: {
    houzz: 'https://www.houzz.it/professionisti/architetti/studio-di-architettura-fioranelli-pfvwit-pf~379915604',
    facebook: 'https://www.facebook.com/people/Studio-di-Architettura-Fioranelli/100063480703502/',
  },
  coordsLabel: '43°30′N 13°37′E',
  coneroHeight: 572, // quota ufficiale della vetta del Monte Conero
} as const

/** Recensioni pubbliche su Houzz. Solo iniziali: [SEGNAPOSTO] chiedere al cliente il permesso di citarle. */
export const reviews = [
  {
    initials: 'M. R. B.',
    date: 'marzo 2020',
    text: 'Mi sono rivolta allo studio la prima volta nel 1988 per l’arredamento del mio appartamento, poi nel 2016 per un immobile nel centro storico di Numana e nel 2018 per la mia casa a Sirolo. Il risultato è stato al di sopra delle mie aspettative, considerando lo spazio ridotto e i vincoli urbanistici.',
  },
  {
    initials: 'Famiglia R.',
    date: 'marzo 2020',
    text: 'Ci siamo affidati allo studio per ristrutturare il nostro locale, pescheria e friggitoria a Numana centro. Sempre presenti in cantiere; i consigli tecnici sulla disposizione dei banchi, sulla cucina e sui materiali adatti alla lavorazione del pesce si sono rivelati indispensabili.',
  },
  {
    initials: 'O. B.',
    date: 'marzo 2020',
    text: 'Architetti competenti, con idee all’avanguardia su disegni e divisione degli spazi. Ti consigliano al meglio su come scegliere i materiali e sono sempre presenti in cantiere. Ringrazio Luciano e Luca.',
  },
  {
    initials: 'D. S. S.',
    date: 'marzo 2020',
    text: 'Sono soddisfatta della mia casa, che rispetta tutti i requisiti che avevo chiesto: minimalista, semplice ma, al tempo stesso, calda e funzionale.',
  },
  {
    initials: 'M. M.',
    date: 'marzo 2020',
    text: 'Professionisti seri, competenti, rispettosi dei desideri del cliente e sempre disponibili.',
  },
]
