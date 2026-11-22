// Screenshot a pagina intera di ogni rotta a 1440 e 375px con Chrome headless (DevTools Protocol).
// Due passate: movimento attivo (per scoprire contenuto rimasto invisibile) e movimento ridotto (stato finale).
// Prima della cattura le altezze in vh/svh vengono fissate in pixel, altrimenti la cattura a tutta altezza le gonfia.
// Uso: node scripts/screenshots.mjs [baseUrl] [--only=/,/studio] [--widths=1440,375] [--modes=motion,reduced]
import { mkdirSync, writeFileSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const args = process.argv.slice(2)
const BASE = args.find((a) => !a.startsWith('--')) ?? 'http://localhost:4173'
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1] ?? d).split(',')
const seo = (await import('../src/content/seo.json', { with: { type: 'json' } })).default
const ROUTES = opt('only', [...Object.keys(seo.routes), '/pagina-che-non-esiste'].join(','))
const WIDTHS = opt('widths', '1440,375').map(Number)
const MODES = opt('modes', 'motion,reduced')
const OUT = 'screenshots'
mkdirSync(OUT, { recursive: true })

const report = []
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })

for (const mode of MODES) {
  for (const w of WIDTHS) {
    const page = await browser.newPage()
    const errors = []
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('requestfailed', (r) => errors.push(`richiesta fallita: ${r.url()}`))
    page.on('response', (r) => r.status() >= 400 && !r.url().includes('pagina-che-non-esiste') && errors.push(`${r.status()} ${r.url()}`))
    const h = w < 768 ? 812 : 900
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: mode === 'reduced' ? 'reduce' : 'no-preference' }])

    for (const route of ROUTES) {
      errors.length = 0
      await page.goto(BASE + route, { waitUntil: 'networkidle0' })
      await page.evaluate(() => document.fonts.ready)
      // scorre fino in fondo a passi per far partire entrate e immagini lazy, poi torna su
      const total = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < total; y += Math.round(h * 0.7)) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y)
        await new Promise((r) => setTimeout(r, 120))
      }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      await new Promise((r) => setTimeout(r, 700))
      await page.evaluate(() => window.scrollTo(0, 0))
      await new Promise((r) => setTimeout(r, 900))
      await page.waitForNetworkIdle({ idleTime: 300, timeout: 15000 }).catch(() => {})

      // controlli: contenuto invisibile, immagini rotte, scroll orizzontale
      const check = await page.evaluate(() => {
        const hidden = [...document.querySelectorAll('[data-reveal]')].filter((el) => getComputedStyle(el).opacity === '0').length
        const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src)
        const hscroll = document.documentElement.scrollWidth > window.innerWidth + 1
        return { hidden, broken, hscroll }
      })

      // fissa in pixel le altezze in vh prima della cattura a tutta altezza
      await page.evaluate(() => {
        for (const el of document.querySelectorAll('*')) {
          const c = el.getAttribute('class') ?? ''
          if (/h-\[\d{3}vh\]/.test(c)) {
            // pista di scroll di una sezione sticky: nella cattura a pagina intera diventerebbe una banda vuota
            el.style.height = window.innerHeight + 'px'
          } else if (/vh|svh/.test(c)) {
            const r = el.getBoundingClientRect()
            el.style.height = r.height + 'px'
            el.style.minHeight = '0px'
          }
        }
      })
      const name = `${OUT}/${mode}-${w}-${route === '/' ? 'home' : route.slice(1).replace(/\//g, '_')}.png`
      await page.screenshot({ path: name, fullPage: true })
      report.push({ mode, w, route, ...check, errors: [...errors] })
      const flag = check.hidden || check.broken.length || check.hscroll || errors.length ? '⚠' : '✓'
      console.log(`${flag} ${mode} ${w} ${route} nascosti:${check.hidden} rotte:${check.broken.length} hscroll:${check.hscroll} errori:${errors.length}`)
    }
    await page.close()
  }
}
await browser.close()
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1))
