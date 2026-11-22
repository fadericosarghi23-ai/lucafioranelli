// Misure, non impressioni: per le pagine chiave a 1440 e 375px
// byte scaricati al primo caricamento e dopo lo scroll completo, LCP e CLS.
// Rete simulata "Fast 4G"; su 375px anche CPU rallentata 4x. Uso: node scripts/metrics.mjs [baseUrl]
import { writeFileSync, mkdirSync } from 'node:fs'
import puppeteer, { PredefinedNetworkConditions } from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = process.argv[2] ?? 'http://localhost:4173'
const ROUTES = ['/', '/progetti', '/progetti/casa-due-mari', '/servizi/ospitalita', '/servizi/centri-storici', '/servizi/interni', '/studio', '/contatti']
const WIDTHS = [1440, 375]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const rows = []
for (const w of WIDTHS) {
  for (const route of ROUTES) {
    const ctx = await browser.createBrowserContext() // cache vuota per ogni misura
    const page = await ctx.newPage()
    await page.setViewport({ width: w, height: w < 768 ? 812 : 900, isMobile: w < 768, hasTouch: w < 768 })
    await page.emulateNetworkConditions(PredefinedNetworkConditions['Fast 4G'])
    if (w < 768) await page.emulateCPUThrottling(4)
    const cdp = await page.createCDPSession()
    await cdp.send('Network.enable')
    let bytes = 0
    const byType = {}
    const types = new Map()
    cdp.on('Network.responseReceived', (e) => types.set(e.requestId, e.type))
    cdp.on('Network.loadingFinished', (e) => {
      bytes += e.encodedDataLength
      const t = types.get(e.requestId) ?? 'Other'
      byType[t] = (byType[t] ?? 0) + e.encodedDataLength
    })
    await page.evaluateOnNewDocument(() => {
      window.__lcp = 0
      window.__cls = 0
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__lcp = e.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 })
    await new Promise((r) => setTimeout(r, 800))
    const first = bytes
    const firstTypes = { ...byType }
    const lcp = await page.evaluate(() => window.__lcp)
    // scroll completo a passi, come un utente
    const H = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < H; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y)
      await new Promise((r) => setTimeout(r, 150))
    }
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }).catch(() => {})
    const cls = await page.evaluate(() => window.__cls)
    const kb = (b) => Math.round(b / 1024)
    rows.push({
      route,
      w,
      firstKB: kb(first),
      firstJS: kb(firstTypes.Script ?? 0),
      firstImg: kb(firstTypes.Image ?? 0),
      firstFont: kb(firstTypes.Font ?? 0),
      afterScrollKB: kb(bytes),
      lcpMs: Math.round(lcp),
      cls: +cls.toFixed(4),
    })
    console.log(`${w} ${route.padEnd(26)} primo ${kb(first)} KB (js ${kb(firstTypes.Script ?? 0)}, img ${kb(firstTypes.Image ?? 0)}, font ${kb(firstTypes.Font ?? 0)}) · dopo scroll ${kb(bytes)} KB · LCP ${Math.round(lcp)} ms · CLS ${cls.toFixed(4)}`)
    await ctx.close()
  }
}
await browser.close()
mkdirSync('screenshots', { recursive: true })
writeFileSync('screenshots/metrics.json', JSON.stringify({ date: new Date().toISOString(), network: 'Fast 4G', cpuMobile: '4x', rows }, null, 1))
