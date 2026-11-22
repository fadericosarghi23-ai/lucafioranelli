// Misura la luminosità della zona del titolo (in basso a sinistra) per ogni foto candidata all'hero,
// con il taglio object-cover reale a 1440x832, 1920x1012 e 375x744. Titolo chiaro: serve una zona scura.
// Uso: node scripts/hero-legibility.mjs id[:posX,posY] ...
import sharp from 'sharp'
const VIEWS = [
  { n: '1440', w: 1440, h: 832, box: [0.03, 0.5, 0.62, 0.93] },
  { n: '1920', w: 1920, h: 1012, box: [0.03, 0.52, 0.55, 0.93] },
  { n: '375', w: 375, h: 744, box: [0.04, 0.5, 0.96, 0.92] },
]
const args = process.argv.slice(2)
for (const a of args) {
  const [id, pos = '50,50'] = a.split(':')
  const [px, py] = pos.split(',').map(Number)
  const src = `scripts/.cache/${id}.jpg`
  const meta = await sharp(src).metadata()
  const out = []
  for (const v of VIEWS) {
    const s = Math.max(v.w / meta.width, v.h / meta.height)
    const sw = Math.round(meta.width * s), sh = Math.round(meta.height * s)
    const left = Math.round((sw - v.w) * (px / 100)), top = Math.round((sh - v.h) * (py / 100))
    const bx = Math.round(v.box[0] * v.w), by = Math.round(v.box[1] * v.h)
    const bw = Math.round((v.box[2] - v.box[0]) * v.w), bh = Math.round((v.box[3] - v.box[1]) * v.h)
    const { data } = await sharp(src).resize(sw, sh).extract({ left, top, width: v.w, height: v.h }).extract({ left: bx, top: by, width: bw, height: bh }).greyscale().raw().toBuffer({ resolveWithObject: true })
    const arr = Array.from(data).map((x) => x / 255).sort((p, q) => p - q)
    const mean = arr.reduce((p, q) => p + q, 0) / arr.length
    const p90 = arr[Math.floor(arr.length * 0.9)]
    const bright = arr.filter((x) => x > 0.78).length / arr.length
    out.push(`${v.n}: media ${mean.toFixed(2)} p90 ${p90.toFixed(2)} chiari ${(bright * 100).toFixed(0)}%`)
  }
  console.log(id.slice(0, 8), pos.padEnd(6), '|', out.join(' | '))
}
