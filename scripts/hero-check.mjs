// Verifica dell'hero della Home: 1440, 1920, 375px; ognuna delle tre foto; primo fotogramma, riposo, metà scroll;
// più una cattura con movimento ridotto. Uso: node scripts/hero-check.mjs [baseUrl]
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:4173'
const OUT = 'screenshots/hero'
mkdirSync(OUT, { recursive: true })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })

for (const [w, h] of [[1440, 900], [1920, 1080], [375, 812]]) {
  const ctx = await b.createBrowserContext()
  const p = await ctx.newPage()
  const errors = []
  p.on('pageerror', (e) => errors.push(String(e)))
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await p.setViewport({ width: w, height: h, isMobile: w < 768, hasTouch: w < 768 })
  // primo fotogramma dell'apertura (prima visita della sessione)
  await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
  await wait(180)
  await p.screenshot({ path: `${OUT}/${w}-apertura.png` })
  await p.waitForNetworkIdle({ idleTime: 400 }).catch(() => {})
  await wait(1600)
  for (let k = 0; k < 3; k++) {
    const btns = await p.$$('section[aria-labelledby="hero-titolo"] button[aria-label^="Mostra "]')
    await btns[k].click()
    await p.mouse.move(5, h / 2) // lontano dai comandi
    await wait(1500)
    await p.screenshot({ path: `${OUT}/${w}-foto${k + 1}.png` })
  }
  await p.evaluate(() => window.scrollTo(0, 420))
  await wait(700)
  await p.screenshot({ path: `${OUT}/${w}-scroll.png` })
  console.log(w, 'errori:', errors.length, errors.slice(0, 2).join(' | '))
  await ctx.close()
}

// movimento ridotto
const ctx = await b.createBrowserContext()
const p = await ctx.newPage()
await p.setViewport({ width: 1440, height: 900 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto(BASE + '/', { waitUntil: 'networkidle0' })
await wait(900)
await p.screenshot({ path: `${OUT}/1440-ridotto.png` })
const state = await p.evaluate(() => ({
  pausa: !!document.querySelector('button[aria-label*="pausa"]'),
  kb: document.querySelectorAll('.hero-kb').length,
  apertura: document.querySelectorAll('.hero-open').length,
}))
console.log('ridotto', JSON.stringify(state))
await b.close()
