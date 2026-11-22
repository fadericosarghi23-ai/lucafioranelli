// Stampa il PDF di presentazione per il cliente con Chrome headless e i font del sito.
// Uso: node scripts/build-pdf.mjs [percorso di uscita]
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const today = new Date().toISOString().slice(0, 10)
const out = process.argv[2] ?? resolve(process.env.USERPROFILE ?? '.', 'Downloads', `${today}_Luca-Fioranelli_Presentazione.pdf`)

// profilo della costa dagli stessi dati del sito
const dem = JSON.parse(readFileSync('src/content/conero-dem.json', 'utf8'))
const sky = [...dem.skyline].sort((a, b) => a.lat - b.lat)
const W = 400, H = 88
const zMax = Math.max(...sky.map((s) => s.z))
const pts = sky.map((s) => [((s.lat - sky[0].lat) / (sky.at(-1).lat - sky[0].lat)) * W, H - (s.z / zMax) * (H - 6)])
let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
for (let i = 0; i < pts.length - 1; i++) {
  const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2
  d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
}

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--allow-file-access-from-files'] })
const page = await browser.newPage()
await page.evaluateOnNewDocument((path) => {
  window.__SKY__ = path
}, d)
await page.goto(pathToFileURL(resolve('scripts/pdf/presentazione.html')).href, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
const n = await page.evaluate(() => document.querySelectorAll('.page').length)
const broken = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')))
if (broken.length) console.log('IMMAGINI MANCANTI:', broken)
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true })
// anteprima delle pagine per il controllo
await page.setViewport({ width: 794, height: 1123 })
await page.screenshot({ path: 'screenshots/pdf-anteprima.png', fullPage: true })
await browser.close()
console.log(`PDF: ${out} (${n} pagine)`)
