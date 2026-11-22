// Leggibilità reale: legge dalla pagina il riquadro del titolo dell'hero a 1440, 1920, 375 e misura,
// per ogni foto candidata e taglio, la quota di pixel chiari (>0.72) sotto il testo. Più bassa = meglio.
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const views = []
for (const [w, h] of [[1440, 900], [1920, 1080], [375, 812]]) {
  const p = await b.newPage()
  await p.setViewport({ width: w, height: h })
  await p.goto('http://localhost:4173/', { waitUntil: 'networkidle0' })
  const r = await p.evaluate(() => {
    const s = document.querySelector('section[aria-labelledby="hero-titolo"]').getBoundingClientRect()
    const t = document.querySelector('#hero-titolo').getBoundingClientRect()
    // riga per riga: usa i rettangoli del testo, non tutto il blocco
    const range = document.createRange(); range.selectNodeContents(document.querySelector('#hero-titolo'))
    const rects = [...range.getClientRects()].map((q) => [q.left - s.left, q.top - s.top, q.width, q.height])
    return { W: s.width, H: s.height, rects }
  })
  views.push({ n: String(w), ...r })
  await p.close()
}
await b.close()
const cands = process.argv.slice(2)
const rows = []
for (const c of cands) {
  const [id, pos = '50,50'] = c.split(':')
  const [px, py] = pos.split(',').map(Number)
  const src = `scripts/.cache/${id}.jpg`
  const meta = await sharp(src).metadata()
  const res = []
  for (const v of views) {
    const s = Math.max(v.W / meta.width, v.H / meta.height)
    const sw = Math.ceil(meta.width * s), sh = Math.ceil(meta.height * s)
    const left = Math.round((sw - v.W) * px / 100), top = Math.round((sh - v.H) * py / 100)
    const img = sharp(src).resize(sw, sh).extract({ left, top, width: Math.floor(v.W), height: Math.floor(v.H) }).greyscale()
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
    let n = 0, br = 0
    for (const [x, y, w, h] of v.rects) for (let yy = Math.max(0, Math.round(y)); yy < Math.min(info.height, y + h); yy++) for (let xx = Math.max(0, Math.round(x)); xx < Math.min(info.width, x + w); xx++) { n++; if (data[yy * info.width + xx] / 255 > (process.env.SOGLIA ? +process.env.SOGLIA : 0.72)) br++ }
    res.push(Math.round((br / n) * 100))
  }
  rows.push({ c, res, worst: Math.max(...res) })
}
rows.sort((a, b) => a.worst - b.worst)
for (const r of rows) console.log(r.c.padEnd(26), '1440', String(r.res[0]).padStart(3) + '%', ' 1920', String(r.res[1]).padStart(3) + '%', ' 375', String(r.res[2]).padStart(3) + '%')
