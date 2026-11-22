// Dopo `vite build`: crea dist/<rotta>/index.html per ogni rotta con title, description, canonical,
// Open Graph e dati strutturati già nell'HTML (leggibili anche senza JavaScript).
// Genera anche 404.html, sitemap.xml e robots.txt. Finché seo.json ha draft:true, tutto è noindex.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

const seo = JSON.parse(readFileSync('src/content/seo.json', 'utf8'))
const tpl = readFileSync('dist/index.html', 'utf8')
const BASE = seo.baseUrl
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const business = {
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${BASE}/#studio`,
  name: 'Studio di Architettura Fioranelli',
  description: 'Studio di architettura a Numana: ristrutturazioni, centri storici e casali, hotel, B&B e ristoranti sulla Riviera del Conero.',
  url: `${BASE}/`,
  image: `${BASE}/og.jpg`,
  logo: `${BASE}/apple-touch-icon.png`,
  telephone: '+39 338 102 1979', // [SEGNAPOSTO] da confermare
  email: 'luca@fioranelli.com', // [SEGNAPOSTO] da confermare
  address: { '@type': 'PostalAddress', streetAddress: 'Via del Porto 16', postalCode: '60026', addressLocality: 'Numana', addressRegion: 'AN', addressCountry: 'IT' },
  geo: { '@type': 'GeoCoordinates', latitude: 43.50916, longitude: 13.62206 },
  areaServed: ['Numana', 'Sirolo', 'Camerano', 'Ancona', 'Loreto', 'Porto Recanati', 'Riviera del Conero'],
  sameAs: ['https://www.houzz.it/professionisti/architetti/studio-di-architettura-fioranelli-pfvwit-pf~379915604', 'https://www.facebook.com/people/Studio-di-Architettura-Fioranelli/100063480703502/'],
  employee: [{ '@type': 'Person', name: 'Luca Fioranelli', jobTitle: 'Architetto' }],
}

function head(path, r) {
  const url = BASE + (path === '/' ? '/' : path)
  const img = BASE + (r.image ?? seo.defaultImage)
  const ld = [business]
  if (path.startsWith('/progetti/')) {
    ld.push({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: r.title.split(' | ')[0], description: r.description, image: img, url, creator: { '@id': `${BASE}/#studio` } })
  }
  if (path !== '/') {
    const parts = path.split('/').filter(Boolean)
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', path: '/' }, ...parts.map((_, i) => ({ name: parts[i], path: '/' + parts.slice(0, i + 1).join('/') }))].map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: BASE + b.path,
      })),
    })
  }
  return [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    seo.draft ? '<meta name="robots" content="noindex, nofollow" />' : '<meta name="robots" content="index, follow" />',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="it_IT" />`,
    `<meta property="og:site_name" content="${esc(seo.siteName)}" />`,
    `<meta property="og:title" content="${esc(r.title)}" />`,
    `<meta property="og:description" content="${esc(r.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(ld.length === 1 ? ld[0] : ld)}</script>`,
    // Home: la prima foto dell'hero parte subito (LCP)
    path === '/' ? '<link rel="preload" as="image" href="/img/p/ab4174c40e456148-1600.webp" imagesrcset="/img/p/ab4174c40e456148-480.webp 480w, /img/p/ab4174c40e456148-960.webp 960w, /img/p/ab4174c40e456148-1600.webp 1600w, /img/p/ab4174c40e456148-1920.webp 1920w" imagesizes="100vw" fetchpriority="high" />' : '',
  ].join('\n    ')
}

const re = /<!--META-->[\s\S]*?<!--\/META-->/
if (!re.test(tpl)) throw new Error('segnaposto META non trovato in dist/index.html')

for (const [path, r] of Object.entries(seo.routes)) {
  const html = tpl.replace(re, head(path, r))
  const out = path === '/' ? 'dist/index.html' : join('dist', path, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}
writeFileSync('dist/404.html', tpl.replace(re, head('/404', { title: 'Pagina non trovata | Studio Fioranelli', description: 'La pagina che cerchi non esiste.' })))

const today = new Date().toISOString().slice(0, 10)
const urls = Object.keys(seo.routes).map((p) => `  <url><loc>${BASE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`)
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
writeFileSync('dist/robots.txt', seo.draft ? `# Bozza: non indicizzare\nUser-agent: *\nDisallow:\n\nSitemap: ${BASE}/sitemap.xml\n` : `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`)
console.log(`meta pre-renderizzati: ${Object.keys(seo.routes).length} rotte + 404 (draft=${seo.draft})`)
