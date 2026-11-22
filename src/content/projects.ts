// Progetti dello studio, importati dal profilo Houzz del cliente (17/11/2026).
// "fonte: houzz" = testo scritto dallo studio; "segnaposto" = testo nostro da far confermare.
// [SEGNAPOSTO] anni, ruoli e attribuzioni (Luca o Luciano) vanno confermati dal cliente.

export type Category = 'case' | 'ospitalita'
export type ServiceSlug = 'case' | 'centri-storici' | 'ospitalita' | 'interni'

export interface Project {
  slug: string
  title: string
  place: string
  lat?: number
  category: Category
  services: ServiceSlug[]
  year?: number
  /** una riga per le card */
  kicker: string
  /** testo lungo; fonte indica se è dello studio (Houzz) o nostro */
  body: string[]
  bodySource: 'houzz' | 'segnaposto'
  cover: string
  images: string[]
  before?: { image: string; after: string; note: string }
  chapters?: { title: string; images: string[] }[]
  external?: string
}

export const PLACES = {
  Ancona: 43.6158,
  Camerano: 43.529,
  Sirolo: 43.5228,
  Numana: 43.511,
  Loreto: 43.4405,
} as const

export const projects: Project[] = [
  {
    slug: 'casa-due-mari',
    title: 'Casa Due Mari',
    place: 'Numana',
    lat: PLACES.Numana,
    category: 'case',
    services: ['case', 'interni'],
    year: 2019,
    kicker: 'Una casa su più livelli affacciata sulla baia, con un soppalco vetrato al centro.',
    body: [
      'Una casa su più livelli a Numana, ripensata attorno a un soppalco con parapetto in vetro che porta la luce fino al piano più basso.',
      'Pareti bianche, legno scuro a pavimento, una scala a sbalzo e le collezioni dei proprietari a fare da decorazione. In alto la terrazza guarda la baia, dalla spiaggia fino alle colline.',
    ],
    bodySource: 'segnaposto',
    cover: '0871bf680e78f82b',
    images: [],
    chapters: [
      {
        title: 'A lavori finiti',
        images: ['0871bf680e78f82b', 'ddf1a5da0e4559d7', 'd8116a680e4558dd', '3ff16b8c0e4558f9', 'c6c1394e0e455902', 'dce162fb0e455913', 'b49190d50e54001a', '92014a760e540022', '61d1c7b80e4558cf', 'a241ecbe0e4558f2', '2c31a0810e540009'],
      },
      {
        title: 'Vissuta, un anno dopo',
        images: ['8ad1979f0f3257e7', 'f1d197c40f32575d', '3b3162910f325765', '40f16e160f325830', '18e15a530f325756', 'e9d1cb590f3257ee', '5ec12f560f32576a', 'bb61f1430f325771', '1f11604b0f32577b', 'd0f1449f0f325776', '247154750f325835', '488101300f32583a', '8271ec980f3257c9', '668166cf0f3257bf', '8ff1519c0f32581e', '99f1843f0f3257b8', '310121c30f32582a', 'd4a18f5a0f3257dd', 'b331a4b40f325843', '64a17a3c0f32584e', 'ed01a92e0f325848', '8d01820c0f3257df', 'fdf140670f32576c', 'a67122ca0f3257ae', 'd8f1aaf80f3257d3'],
      },
    ],
  },
  {
    slug: 'country-house-borgo-rosso',
    title: 'Country House Borgo Rosso',
    place: 'Sirolo',
    lat: PLACES.Sirolo,
    category: 'ospitalita',
    services: ['ospitalita', 'centri-storici'],
    kicker: 'Un casale di campagna diventato country house, tra prato, ulivi e piscina.',
    body: [
      'Un casale della campagna di Sirolo recuperato e trasformato in country house: camere, spazi comuni e un giardino con piscina tra gli ulivi.',
      'Le facciate rosse, le persiane chiare e i coppi del tetto tengono il carattere della casa colonica. Dentro, travi a vista e bagni con arredi d’epoca.',
    ],
    bodySource: 'segnaposto',
    cover: 'e40112010e456143',
    images: ['e40112010e456143', '2911ad4e0e456130', '4da1b9370e45613c', '07313ffd0e456135', 'ab4174c40e456148', 'b0015f880e45614c', '1e61d19e0e7b80f8', 'bce13c180e7b80fb', '5721673c0e7b80fd', 'caa1cd120e7b80ff'],
    before: { image: '139190840e7b800b', after: '2911ad4e0e456130', note: 'Lo stato di fatto prima dell’intervento di ristrutturazione.' },
    external: 'https://www.countryhousesirolo.com/it/',
  },
  {
    slug: 'hotel-san-francesco',
    title: 'Hotel San Francesco',
    place: 'Loreto',
    lat: PLACES.Loreto,
    category: 'ospitalita',
    services: ['ospitalita', 'centri-storici'],
    kicker: 'Un convento trasformato in hotel, attorno al chiostro.',
    body: ['Intervento di ristrutturazione e trasformazione di un convento di Loreto in hotel a 4 stelle.'],
    bodySource: 'houzz',
    cover: '852192620e7b88f6',
    images: ['852192620e7b88f6', 'cf7137b60e7b88dc', '99115a510e7b88f2', 'b2b1569b0e7b88e2', '137170490e7b88f4', 'a081e8c90e7b88e5', '99d1ba500e7b88e3', '110199830e7b88e8', '3501b9280e7b88f8', 'b1e151ab0e7b88f9', '9fe1373c0e7b88de', '61718e580e7b88e9', '8e91e8940e7b88eb', '5d3141790e7b88ed', 'd9c19c2b0e7b88ef'],
  },
  {
    slug: 'palazzo-ruschioni',
    title: 'Palazzo Ruschioni',
    place: 'Camerano',
    lat: PLACES.Camerano,
    category: 'ospitalita',
    services: ['ospitalita', 'centri-storici'],
    kicker: 'Un palazzo storico nel centro di Camerano diventato boutique hotel.',
    body: [
      'Un palazzo del centro storico di Camerano trasformato in boutique hotel. Camere tutte diverse, con testate su misura, luce calda e bagni rivestiti in vetro colorato.',
    ],
    bodySource: 'segnaposto',
    cover: 'b9e110430e456d7e',
    images: ['b9e110430e456d7e', 'b0a1c3c90e456d80', '113104f70e456d8b', 'e0e1121b0e456d82', '25f1b2bc0e456d8a', 'f85164130e456d88', '9611267f0e456d86', '2dd16a890e456d8e', 'bf21c8d70e456d91', '7641867f0e456d93', '730138060e456d92'],
    external: 'http://palazzoruschioni.it/',
  },
  {
    slug: 'nilu-relais',
    title: 'Nilu Relais',
    place: 'Sirolo',
    lat: PLACES.Sirolo,
    category: 'ospitalita',
    services: ['ospitalita', 'interni'],
    kicker: 'Camere con soffitti in legno, pietra chiara e arredi su misura.',
    body: ['Un relais di poche camere a Sirolo: soffitti in legno, pietra chiara all’ingresso, arredi su misura.'],
    bodySource: 'segnaposto',
    cover: 'e7f104cb0e455aaa',
    images: ['e7f104cb0e455aaa', 'fb1131460e455ab6', 'e1c11d550e455ab4', 'c9a1e19a0e455aad', '6ca1fb1f0e455aaf', '58a14da10e455ab1'],
  },
  {
    slug: 'giulia-camere',
    title: 'Giulia Camere',
    place: 'Numana',
    lat: PLACES.Numana,
    category: 'ospitalita',
    services: ['ospitalita', 'centri-storici'],
    year: 2019,
    kicker: 'Una casa del centro storico consolidata dalle fondazioni al tetto.',
    body: [
      'Nella primavera del 2019 ci siamo dedicati alla ristrutturazione di una tipica abitazione del centro storico di Numana. Le ristrutturazioni sono sempre una sfida interessante dove bisogna saper leggere gli edifici e la loro storia, e trasformare le insidie celate in opportunità.',
      'La cura dei particolari è ben visibile dalle foto, ma la cosa più importante è che, in parte nascosti sotto il bel vestito, sono stati eseguiti interventi mirati di consolidamento strutturale: partendo dalle fondazioni, passando per le murature, sino alla copertura.',
    ],
    bodySource: 'houzz',
    cover: 'ef71d1a90e54dc95',
    images: ['ef71d1a90e54dc95', '15b1f4840e54dc98', '0d0177720e54dc9a', 'ac91a08b0e54dc9b'],
  },
  {
    slug: 'casa-vacanze-g',
    title: 'Casa Vacanze G.',
    place: 'Numana',
    lat: PLACES.Numana,
    category: 'case',
    services: ['centri-storici', 'case'],
    kicker: 'Una casa del centro storico per due giovani proprietari innamorati del mare.',
    body: [
      'L’intervento ha comportato la ristrutturazione completa di una tipica abitazione del centro storico di Numana, adattandola alle esigenze dei nuovi giovani proprietari, amanti del mare e della Riviera del Conero.',
    ],
    bodySource: 'houzz',
    cover: '3cd16ada0e7b8ce9',
    images: ['3cd16ada0e7b8ce9', 'c60139a40e7b8cde', '7081a4950e7b8ced'],
  },
  {
    slug: 'casa-del-fornaio',
    title: 'Casa del fornaio',
    place: 'Numana',
    lat: PLACES.Numana,
    category: 'case',
    services: ['case', 'centri-storici'],
    kicker: 'Facciate color salvia, ringhiere bianche e gerani sulla salita.',
    body: ['Una casa sulla salita di Numana: nuove facciate, scale esterne e balconi fioriti verso la strada.'],
    bodySource: 'segnaposto',
    cover: 'dfd169f30e54da0a',
    images: ['dfd169f30e54da0a', 'ba11dac10e54da07', 'b671bbef0e54da0c', 'd9f1869c0e54da02', '4261ff070e54da05'],
  },
  {
    slug: 'casa-l',
    title: 'Casa L',
    place: 'Ancona',
    lat: PLACES.Ancona,
    category: 'case',
    services: ['case', 'interni'],
    year: 2017,
    kicker: '45 metri quadri e un sottotetto scoperto durante i lavori.',
    body: [
      'Ristrutturazione di un appartamento di 45 mq per un ragazzo giovane e dinamico.',
      'Nel corso dei lavori siamo stati per un sopralluogo nel sottotetto ed è nata, con entusiasmo, la volontà di collegarlo all’abitazione sottostante. In corrispondenza dell’apertura nel solaio è stata posta in opera una finestra in copertura per illuminare la zona giorno.',
    ],
    bodySource: 'houzz',
    cover: 'b9d103e80e54db38',
    images: ['b9d103e80e54db38', 'c711ffa80e54db2f', '14910a950e54db33', 'bee180e50e54db3b', '7ff1cea10e7b9309', 'a6e16c710e7b930d', 'a0e1cc190e7b930f', 'd951d0920e7b9311', '7381b35f0e7b9313'],
  },
  {
    slug: 'casa-al-mare',
    title: 'Casa al mare',
    place: 'Riviera del Conero',
    category: 'case',
    services: ['case'],
    year: 2019,
    kicker: 'Ampliamento e ristrutturazione di una casa con giardino.',
    body: ['Ampliamento e ristrutturazione di abitazione privata.'],
    bodySource: 'houzz',
    cover: '7fb1e9610e54dba8',
    images: ['7fb1e9610e54dba8', '25c17be90e54dbad', 'fbb11e420e54dbaf', '62f150c50e54dbb0', '7231d1be0e54dbb1', '7e61b3c20e54dbb2', '714100f10e54dbb8', 'db410bbd0e54dbb6', '6981fe950e54dbc5', '0711ba870e54dbc3', '8bd12d9d0e54dbab', '296180310e54dba9', 'b2a189980e54dbac', '5fa124cb0e54dbc6'],
  },
  {
    slug: 'abitazione-privata-numana',
    title: 'Abitazione privata',
    place: 'Numana',
    lat: PLACES.Numana,
    category: 'case',
    services: ['interni'],
    year: 2014,
    kicker: 'Una scala in acciaio rivestita in legno, illuminata dal basso.',
    body: ['Particolare di scala interna con struttura in acciaio e rivestimento in legno.'],
    bodySource: 'houzz',
    cover: 'a2d18d8e0e54daaf',
    images: ['a2d18d8e0e54daaf', 'ec7169ad0e54daa5', '1161da080e54daaa'],
  },
]

export const allImages = (p: Project) => (p.chapters ? p.chapters.flatMap((c) => c.images) : p.images)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const categoryLabel: Record<Category, string> = { case: 'Case', ospitalita: 'Ospitalità' }
