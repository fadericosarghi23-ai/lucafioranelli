// Catture a schermo dei momenti d'autore a metà scroll (1440px) e del visore aperto, per i checkpoint.
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:4173'
const OUT = 'screenshots/momenti'
mkdirSync(OUT, { recursive: true })
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 900 })
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function at(route, sel, frac, name) {
  await p.goto(BASE + route, { waitUntil: 'networkidle0' })
  await p.evaluate(() => document.fonts.ready)
  // scorre a passi fino al punto, come un utente (gli effetti seguono lo scroll nativo)
  const target = await p.evaluate(
    (s, f) => {
      const el = document.querySelector(s)
      const r = el.getBoundingClientRect()
      return window.scrollY + r.top + (r.height - window.innerHeight) * f
    },
    sel,
    frac,
  )
  for (let y = 0; y <= target; y += 300) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y)
    await wait(40)
  }
  await p.evaluate((yy) => window.scrollTo(0, yy), target)
  await wait(1200)
  await p.screenshot({ path: `${OUT}/${name}.png` })
  console.log('✓', name)
}

await at('/', 'section[aria-labelledby="hero-titolo"]', 0, 'home-hero')
await at('/', 'svg[aria-labelledby="costa-titolo costa-desc"]', 0.35, 'home-costa')
await at('/servizi/ospitalita', 'section[aria-label="Il recupero di Country House Borgo Rosso"]', 0.55, 'ospitalita-zoom')
await at('/servizi/centri-storici', 'svg[aria-labelledby="casa-t casa-d"]', 0.2, 'centri-storici-sezione')
await at('/servizi/interni', 'section[aria-label="Dettagli d’interni"]', 0.45, 'interni-mosaico')
await at('/studio', 'svg[aria-labelledby="sez-t sez-d"]', 0.3, 'studio-quota')

// modulo contatti, secondo passo
await p.goto(BASE + '/contatti', { waitUntil: 'networkidle0' })
await p.evaluate(() => [...document.querySelectorAll('label')].find((l) => l.textContent === 'Casale').click())
await p.click('form button[type="submit"]')
await wait(400)
await p.evaluate(() => [...document.querySelectorAll('label')].find((l) => l.textContent === 'Sirolo').click())
await wait(300)
await p.screenshot({ path: `${OUT}/contatti.png` })
console.log('✓ contatti')

// visore a schermo intero su Casa Due Mari
await p.goto(BASE + '/progetti/casa-due-mari', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.querySelector('ul button[aria-label^="Apri la foto"]').scrollIntoView({ block: 'center' }))
await wait(600)
await p.click('ul button[aria-label^="Apri la foto"]')
await wait(900)
await p.keyboard.press('ArrowRight')
await wait(700)
await p.screenshot({ path: `${OUT}/visore.png` })
console.log('✓ visore')
await b.close()
