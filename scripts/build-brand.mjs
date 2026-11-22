// Genera favicon (svg, 32px, 180px) e immagine Open Graph 1200x630 dal logo Falda,
// renderizzati con Chrome headless e i font del sito. Uso: node scripts/build-brand.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const dem = JSON.parse(readFileSync('src/content/conero-dem.json', 'utf8'))

function smooth(pts) {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}
const sky = [...dem.skyline].sort((a, b) => a.lat - b.lat)
const W = 1200, H = 190
const zMax = Math.max(...sky.map((s) => s.z))
const lat0 = sky[0].lat, lat1 = sky.at(-1).lat
const pts = sky.map((s) => [((s.lat - lat0) / (lat1 - lat0)) * W, H - (s.z / zMax) * (H - 10)])
const skyFill = smooth(pts) + ` L${W} ${H} L0 ${H} Z`

const glyph = (stroke, accent, w = 2.6) =>
  `<svg viewBox="0 0 30 38" fill="none"><path d="M2 30 L15 3 L28 30" stroke="${stroke}" stroke-width="${w}" stroke-linecap="square"/><path d="M28 30 L28 37" stroke="${accent}" stroke-width="${w}" stroke-linecap="square"/></svg>`

const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#1b1e1c"/><g transform="translate(14 10) scale(1.2)"><path d="M2 30 L15 3 L28 30" fill="none" stroke="#f6f3ee" stroke-width="3.4" stroke-linecap="square"/><path d="M28 30 L28 37" stroke="#c9714f" stroke-width="3.4" stroke-linecap="square"/></g></svg>`
writeFileSync('public/favicon.svg', favSvg)

const fontCss = (pkg, file) => pathToFileURL(resolve('node_modules', pkg, file)).href
const page = (body, w, h) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="${fontCss('@fontsource-variable/archivo', 'wdth.css')}">
<link rel="stylesheet" href="${fontCss('@fontsource/ibm-plex-mono', 'latin-500.css')}">
<style>*{margin:0;box-sizing:border-box}html,body{width:${w}px;height:${h}px;overflow:hidden}body{background:#f6f3ee;color:#1b1e1c;font-family:'Archivo Variable'}</style></head><body>${body}</body></html>`

const og = page(
  `<div style="position:relative;width:1200px;height:630px">
    <div style="position:absolute;left:80px;top:96px">
      <div style="display:flex;align-items:flex-end;font-stretch:118%;font-weight:500;font-size:104px;letter-spacing:.07em;line-height:1">
        <span>FIOR</span><span style="display:inline-block;width:92px;height:116px;margin:0 2px -24px">${glyph('#1b1e1c', '#a6472a', 2.4)}</span><span>NELLI</span>
      </div>
      <div style="font-family:'IBM Plex Mono';font-weight:500;font-size:22px;letter-spacing:.24em;text-transform:uppercase;color:#5e605b;margin-top:26px">Studio di architettura · Numana</div>
      <div style="font-stretch:112%;font-weight:600;font-size:40px;letter-spacing:-.01em;margin-top:44px;max-width:900px;line-height:1.08">Case, casali e luoghi d’accoglienza sulla Riviera del Conero</div>
    </div>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="position:absolute;left:0;bottom:0;width:1200px;height:150px"><path d="${skyFill}" fill="#1b1e1c"/></svg>
  </div>`,
  1200,
  630,
)

mkdirSync('scripts/.cache', { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files'] })
const p = await browser.newPage()
async function shot(html, w, h, out, type = 'png') {
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  const tmp = resolve('scripts/.cache/brand.html')
  writeFileSync(tmp, html)
  await p.goto(pathToFileURL(tmp).href, { waitUntil: 'load' })
  await p.evaluate(() => document.fonts.ready)
  await p.screenshot({ path: out, type, ...(type === 'jpeg' ? { quality: 86 } : { omitBackground: true }) })
}
await shot(og, 1200, 630, 'public/og.jpg', 'jpeg')
for (const [size, out] of [[32, 'public/favicon-32.png'], [180, 'public/apple-touch-icon.png']]) {
  await shot(`<!doctype html><html><body style="margin:0;background:transparent">${favSvg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`, size, size, out)
}
await browser.close()
console.log('favicon e og.jpg generati')
