// Scarica le foto dei progetti dal profilo Houzz del cliente (originali fino a 2560px),
// le salva in scripts/.cache e genera WebP in public/img/p/<id>-{480,960,1600}.webp
// sotto i 300 KB, più un manifest con dimensioni per riservare lo spazio (niente CLS).
// Uso: node scripts/build-images.mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs'
import sharp from 'sharp'

const data = JSON.parse(readFileSync('scripts/data/houzz.json', 'utf8'))
const CACHE = 'scripts/.cache'
const OUT = 'public/img/p'
mkdirSync(CACHE, { recursive: true })
mkdirSync(OUT, { recursive: true })

const WIDTHS = [480, 960, 1600]
const manifest = {}
const ids = data.projects.flatMap((p) => [...p.images, ...(p.before ?? [])])

async function download(id) {
  const file = `${CACHE}/${id}.jpg`
  if (existsSync(file) && statSync(file).size > 1000) return file
  // _14 = originale (se disponibile), _16 = 1600px, _9 = 990px
  for (const size of [14, 16, 9]) {
    const url = `https://st.hzcdn.com/simgs/${id}_${size}-0000/home-design.jpg`
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) continue
    writeFileSync(file, Buffer.from(await r.arrayBuffer()))
    return file
  }
  throw new Error(`${id} non trovata`)
}

async function encode(src, out, width) {
  for (const q of [72, 64, 56, 48]) {
    const buf = await sharp(src).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: q, effort: 5 }).toBuffer()
    if (buf.length < 300 * 1024 || q === 48) {
      writeFileSync(out, buf)
      return buf.length
    }
  }
}

let i = 0
for (const id of ids) {
  i++
  try {
    const src = await download(id)
    const meta = await sharp(src).metadata()
    const sizes = {}
    for (const w of WIDTHS) {
      const out = `${OUT}/${id}-${w}.webp`
      sizes[w] = existsSync(out) ? statSync(out).size : await encode(src, out, w)
    }
    // colore medio per il segnaposto mentre l'immagine carica
    const { dominant } = await sharp(src).stats()
    const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('')
    manifest[id] = { w: meta.width, h: meta.height, color: hex, kb: Math.round(sizes[1600] / 1024) }
    process.stdout.write(`\r${i}/${ids.length} ${id}`)
  } catch (e) {
    console.log('\nERRORE', id, e.message)
  }
}
writeFileSync('src/content/images.json', JSON.stringify(manifest, null, 1))
const big = Object.entries(manifest).filter(([, v]) => v.kb >= 300)
console.log(`\nfatto: ${Object.keys(manifest).length} immagini; sopra 300KB: ${big.length}`)
