// Controllo bug: tutte le rotte in 5 formati (1440, 1024, 768, 375, 320) con movimento attivo e ridotto,
// più test delle interazioni e dei link. Uso: node scripts/qa.mjs [baseUrl] [--solo-interazioni]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const BASE = process.argv.find((a) => a.startsWith('http')) ?? 'http://localhost:4173'
const ONLY_INTER = process.argv.includes('--solo-interazioni')
const seo = JSON.parse(readFileSync('src/content/seo.json', 'utf8'))
const ROUTES = Object.keys(seo.routes)
const VIEWS = [
  { n: 'desktop-1440', w: 1440, h: 900 },
  { n: 'tablet-1024', w: 1024, h: 768 },
  { n: 'tablet-768', w: 768, h: 1024, mobile: true },
  { n: 'mobile-375', w: 375, h: 812, mobile: true },
  { n: 'mobile-320', w: 320, h: 640, mobile: true },
]
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const bugs = []
const bug = (where, what) => {
  bugs.push({ where, what })
  console.log('  ✗', where, '·', what)
}
const ok = (what) => console.log('  ✓', what)

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })

async function newPage(v, reduced = false) {
  const ctx = await browser.createBrowserContext()
  const p = await ctx.newPage()
  p.__errors = []
  p.on('pageerror', (e) => p.__errors.push(String(e).slice(0, 200)))
  p.on('console', (m) => m.type() === 'error' && p.__errors.push(m.text().slice(0, 200)))
  p.on('response', (r) => {
    const u = r.url()
    if (r.status() >= 400 && u.startsWith(BASE) && r.request().method() === 'GET') p.__errors.push(`${r.status()} ${u.replace(BASE, '')}`)
  })
  await p.setViewport({ width: v.w, height: v.h, isMobile: !!v.mobile, hasTouch: !!v.mobile })
  await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }])
  p.__ctx = ctx
  return p
}

async function scrollAll(p, h) {
  const total = await p.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += Math.round(h * 0.8)) {
    await p.evaluate((yy) => window.scrollTo(0, yy), y)
    await wait(90)
  }
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await wait(500)
  await p.waitForNetworkIdle({ idleTime: 300, timeout: 10000 }).catch(() => {})
}

// ---------- 1. pagine in tutti i formati ----------
if (!ONLY_INTER) {
  for (const reduced of [false, true]) {
    for (const v of VIEWS) {
      console.log(`\n== ${v.n} ${reduced ? 'movimento ridotto' : 'movimento attivo'}`)
      const p = await newPage(v, reduced)
      for (const route of ROUTES) {
        p.__errors.length = 0
        const where = `${v.n}${reduced ? '/ridotto' : ''} ${route}`
        await p.goto(BASE + route, { waitUntil: 'networkidle0' })
        await scrollAll(p, v.h)
        const r = await p.evaluate((vw) => {
          const out = {}
          out.hscroll = document.documentElement.scrollWidth - window.innerWidth
          const shown = (el) => { for (let a = el; a; a = a.parentElement) if (getComputedStyle(a).display === 'none') return false; return true }
          out.hidden = [...document.querySelectorAll('[data-reveal]')].filter(shown).filter((el) => { const c = el.matches('[data-reveal^=mask]') ? el.firstElementChild : el; return getComputedStyle(el).opacity === '0' || ['inset(100%', 'inset(0% 100%', 'inset(0px 100%'].some((k) => getComputedStyle(c).clipPath.startsWith(k)) }).length
          out.broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map((i) => i.getAttribute('src'))
          out.noAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length
          // elementi visibili che sbordano a destra, fuori da contenitori con overflow nascosto
          const clipped = (el) => {
            for (let a = el.parentElement; a; a = a.parentElement) {
              const o = getComputedStyle(a).overflowX
              if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') return true
            }
            return false
          }
          out.overflow = [...document.querySelectorAll('body *')]
            .filter((el) => {
              const b = el.getBoundingClientRect()
              return b.width > 0 && b.right > vw + 1 && !clipped(el) && getComputedStyle(el).position !== 'fixed'
            })
            .slice(0, 3)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} (${Math.round(el.getBoundingClientRect().right)}px)`)
          // pulsanti/link troppo piccoli su touch (meno di 32px in entrambe le dimensioni)
          out.tiny = [...document.querySelectorAll('a, button, [role="radio"], input, label')]
            .filter((el) => {
              const b = el.getBoundingClientRect()
              if (b.width <= 1 || getComputedStyle(el).visibility === 'hidden') return false // input sr-only: il bersaglio è l'etichetta
              return b.width < 24 && b.height < 24
            })
            .slice(0, 3)
            .map((el) => `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}"`)
          // testo che esce dal proprio contenitore (titoli troppo lunghi)
          out.textOverflow = [...document.querySelectorAll('h1, h2, h3')]
            .filter((el) => el.scrollWidth > el.clientWidth + 2)
            .slice(0, 3)
            .map((el) => el.textContent.trim().slice(0, 40))
          out.h1 = document.querySelectorAll('h1').length
          return out
        }, v.w)
        if (r.hscroll > 0) bug(where, `scroll orizzontale di ${r.hscroll}px`)
        if (r.hidden) bug(where, `${r.hidden} elementi rimasti invisibili`)
        if (r.broken.length) bug(where, `immagini rotte: ${r.broken.slice(0, 2).join(', ')}`)
        if (r.noAlt) bug(where, `${r.noAlt} immagini senza alt`)
        if (r.overflow.length) bug(where, `elementi oltre il bordo: ${r.overflow.join('; ')}`)
        if (v.mobile && r.tiny.length) bug(where, `bersagli piccoli: ${r.tiny.join('; ')}`)
        if (r.textOverflow.length) bug(where, `titoli che escono dal contenitore: ${r.textOverflow.join('; ')}`)
        if (r.h1 !== 1) bug(where, `${r.h1} h1 nella pagina`)
        if (p.__errors.length) bug(where, `errori: ${[...new Set(p.__errors)].slice(0, 3).join(' | ')}`)
      }
      await p.__ctx.close()
    }
  }
}

// ---------- 2. interazioni ----------
console.log('\n== interazioni')
const D = VIEWS[0]
const M = VIEWS[3]
const isVisible = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); if (!e) return false; const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden' && +getComputedStyle(e).opacity > 0.5 }, sel)

// menu mobile
{
  const p = await newPage(M)
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await p.click('button[aria-controls="menu-mobile"]')
  await wait(500)
  if (await isVisible(p, '#menu-mobile')) ok('menu mobile si apre')
  else bug('menu mobile', 'non si apre')
  const locked = await p.evaluate(() => document.documentElement.style.overflow === 'hidden')
  locked ? ok('scroll bloccato col menu aperto') : bug('menu mobile', 'la pagina scorre sotto il menu')
  await p.keyboard.press('Escape')
  await wait(500)
  ;(await p.$('#menu-mobile')) ? bug('menu mobile', 'Esc non lo chiude') : ok('Esc chiude il menu')
  await p.click('button[aria-controls="menu-mobile"]')
  await wait(500)
  await p.evaluate(() => window.scrollTo(0, 0))
  await Promise.all([p.waitForFunction(() => location.pathname === '/progetti'), p.click('#menu-mobile a[href="/progetti"]')])
  await wait(700)
  ;(await p.$('#menu-mobile')) ? bug('menu mobile', 'resta aperto dopo il cambio pagina') : ok('il menu si chiude cambiando pagina')
  const unlocked = await p.evaluate(() => document.documentElement.style.overflow !== 'hidden')
  unlocked ? ok('scroll sbloccato dopo il cambio pagina') : bug('menu mobile', 'scroll resta bloccato dopo il cambio pagina')
  // sottovoci servizi
  await p.click('button[aria-controls="menu-mobile"]')
  await wait(450)
  await Promise.all([p.waitForFunction(() => location.pathname === '/servizi/interni'), p.click('#menu-mobile a[href="/servizi/interni"]')])
  ok('sottovoce servizi del menu mobile funziona')
  if (p.__errors.length) bug('menu mobile', p.__errors.join(' | '))
  await p.__ctx.close()
}

// tendina servizi desktop, anche da tastiera
{
  const p = await newPage(D)
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await p.hover('a[href="/servizi"]')
  await wait(350)
  ;(await isVisible(p, '#tendina-servizi')) ? ok('tendina servizi al passaggio del mouse') : bug('tendina servizi', 'non si apre al passaggio')
  await p.mouse.move(700, 600)
  await wait(500)
  ;(await p.$('#tendina-servizi')) ? bug('tendina servizi', 'non si chiude uscendo col mouse') : ok('tendina si chiude uscendo col mouse')
  await p.focus('button[aria-controls="tendina-servizi"]')
  await p.keyboard.press('Enter')
  await wait(350)
  ;(await isVisible(p, '#tendina-servizi')) ? ok('tendina si apre da tastiera') : bug('tendina servizi', 'non si apre da tastiera')
  await p.keyboard.press('Tab')
  const inDrop = await p.evaluate(() => !!document.activeElement.closest('#tendina-servizi'))
  inDrop ? ok('il Tab entra nella tendina') : bug('tendina servizi', 'il Tab non entra nella tendina')
  await p.keyboard.press('Escape')
  await wait(350)
  ;(await p.$('#tendina-servizi')) ? bug('tendina servizi', 'Esc non la chiude') : ok('Esc chiude la tendina')
  // focus visibile: contorno nel colore d'accento
  await p.keyboard.press('Tab')
  await wait(300) // le voci animano il colore in 200ms
  const outline = await p.evaluate(() => getComputedStyle(document.activeElement).outlineColor)
  outline.includes('166, 71, 42') || outline.includes('201, 113, 79') ? ok(`focus visibile color coppo (${outline})`) : bug('focus', `contorno non d'accento: ${outline}`)
  // link "salta al contenuto"
  await p.goto(BASE + '/studio', { waitUntil: 'networkidle0' })
  await p.keyboard.press('Tab')
  const skip = await p.evaluate(() => document.activeElement.textContent.trim())
  skip === 'Vai al contenuto' ? ok('primo Tab: "Vai al contenuto"') : bug('tastiera', `primo Tab su "${skip}"`)
  await p.__ctx.close()
}

// hero: comandi e pausa
{
  const p = await newPage(D)
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await wait(1800)
  const sel = 'section[aria-labelledby="hero-titolo"] button[aria-label^="Mostra "]'
  const btns = await p.$$(sel)
  await btns[1].click()
  await wait(400)
  const cap = await p.evaluate(() => document.querySelector('section[aria-labelledby="hero-titolo"] a[href^="/progetti/"]').textContent)
  cap.includes('Casa Due Mari') ? ok('hero: selettore foto cambia didascalia') : bug('hero', `didascalia non aggiornata: ${cap}`)
  await p.click('button[aria-label*="pausa"]')
  await wait(200)
  const pressed = await p.evaluate(() => document.querySelector('button[aria-pressed]').getAttribute('aria-pressed'))
  pressed === 'true' ? ok('hero: pausa') : bug('hero', 'pausa non attiva')
  await wait(7600)
  const cap2 = await p.evaluate(() => document.querySelector('section[aria-labelledby="hero-titolo"] a[href^="/progetti/"]').textContent)
  cap2.includes('Casa Due Mari') ? ok('hero: in pausa non avanza') : bug('hero', 'avanza anche in pausa')
  await p.click('button[aria-label*="Riprendi"]')
  await wait(7600)
  const cap3 = await p.evaluate(() => document.querySelector('section[aria-labelledby="hero-titolo"] a[href^="/progetti/"]').textContent)
  cap3.includes('Nilu') ? ok('hero: riprende e avanza da solo') : bug('hero', `non avanza dopo la ripresa: ${cap3}`)
  // seconda visita nella sessione: niente apertura
  await p.goto(BASE + '/progetti', { waitUntil: 'networkidle0' })
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' })
  ;(await p.$('.hero-open')) ? bug('hero', 'apertura ripetuta alla seconda visita') : ok('hero: apertura solo alla prima visita')
  if (p.__errors.length) bug('hero', p.__errors.join(' | '))
  await p.__ctx.close()
}

// filtri progetti
{
  for (const v of [D, M]) {
    const p = await newPage(v)
    await p.goto(BASE + '/progetti', { waitUntil: 'networkidle0' })
    const all = await p.$$eval('a[href^="/progetti/"]', (a) => new Set(a.filter((x) => x.getBoundingClientRect().width > 0).map((x) => x.getAttribute('href'))).size)
    await p.evaluate(() => [...document.querySelectorAll('[role="radio"]')].find((b) => b.textContent.startsWith('Ospitalità')).click())
    await wait(500)
    const url = await p.evaluate(() => location.search)
    const n = await p.$$eval('a[href^="/progetti/"]', (a) => new Set(a.filter((x) => x.getBoundingClientRect().width > 0 && !x.closest('footer')).map((x) => x.getAttribute('href'))).size)
    url === '?tipo=ospitalita' && n === 5 ? ok(`${v.n}: filtro Ospitalità (5 progetti, url ${url})`) : bug(`filtro ${v.n}`, `url "${url}", progetti visibili ${n} (tutti ${all})`)
    await p.__ctx.close()
  }
}

// visore: clic, frecce, Esc, ritorno del focus, trascinamento
{
  for (const v of [D, M]) {
    const p = await newPage(v)
    await p.goto(BASE + '/progetti/casa-l', { waitUntil: 'networkidle0' })
    const first = 'ul button[aria-label^="Apri la foto 1 "]'
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), first)
    await wait(500)
    await p.click(first)
    await wait(700)
    const label = () => p.evaluate(() => document.querySelector('[role="dialog"]')?.getAttribute('aria-label') ?? '')
    ;(await label()).includes('foto 1 di') ? ok(`${v.n}: visore si apre`) : bug(`visore ${v.n}`, 'non si apre')
    await p.keyboard.press('ArrowRight')
    await wait(450)
    ;(await label()).includes('foto 2 di') ? ok(`${v.n}: freccia destra`) : bug(`visore ${v.n}`, `freccia non avanza: ${await label()}`)
    await p.keyboard.press('ArrowLeft')
    await p.keyboard.press('ArrowLeft')
    await wait(450)
    ;(await label()).includes('foto 9 di 9') ? ok(`${v.n}: dall'inizio torna all'ultima`) : bug(`visore ${v.n}`, `giro all'indietro: ${await label()}`)
    // trascinamento
    const box = await p.evaluate(() => { const b = document.querySelector('[role="dialog"] img').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } })
    await p.mouse.move(box.x, box.y)
    await p.mouse.down()
    for (let k = 1; k <= 10; k++) await p.mouse.move(box.x - k * 18, box.y)
    await p.mouse.up()
    await wait(600)
    ;(await label()).includes('foto 1 di 9') ? ok(`${v.n}: trascinamento a sinistra avanza`) : bug(`visore ${v.n}`, `trascinamento: ${await label()}`)
    // zoom
    await p.click('[role="dialog"] button[aria-label^="Ingrandisci"]')
    await wait(400)
    const zoomed = await p.evaluate(() => document.querySelector('[role="dialog"] img').className.includes('scale-[2.2]'))
    zoomed ? ok(`${v.n}: zoom sul dettaglio`) : bug(`visore ${v.n}`, 'zoom non attivo')
    await p.keyboard.press('Escape')
    await wait(1300)
    ;(await p.$('[role="dialog"]')) ? bug(`visore ${v.n}`, 'Esc non chiude') : ok(`${v.n}: Esc chiude il visore`)
    const back = await p.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.tagName)
    back?.startsWith('Apri la foto') ? ok(`${v.n}: il focus torna alla miniatura`) : bug(`visore ${v.n}`, `focus dopo la chiusura su: ${back}`)
    const unl = await p.evaluate(() => document.documentElement.style.overflow !== 'hidden')
    unl ? ok(`${v.n}: scroll sbloccato dopo il visore`) : bug(`visore ${v.n}`, 'scroll resta bloccato')
    if (p.__errors.length) bug(`visore ${v.n}`, p.__errors.join(' | '))
    await p.__ctx.close()
  }
}

// prima e dopo
{
  const p = await newPage(M)
  await p.goto(BASE + '/progetti/country-house-borgo-rosso', { waitUntil: 'networkidle0' })
  await p.evaluate(() => [...document.querySelectorAll('[role="radio"]')].find((b) => b.textContent === 'dopo').click())
  await wait(700)
  const st = await p.evaluate(() => [...document.querySelectorAll('[role="radio"]')].map((b) => b.textContent + '=' + b.getAttribute('aria-checked')).join(','))
  st.includes('dopo=true') ? ok('prima/dopo: passa a "dopo"') : bug('prima/dopo', st)
  const imgs = await p.evaluate(() => [...document.querySelectorAll('figure img')].map((i) => i.alt))
  imgs.some((a) => a.includes('dopo i lavori')) ? ok('prima/dopo: cambia foto') : bug('prima/dopo', `foto: ${imgs.join(' | ')}`)
  await p.__ctx.close()
}

// accordion domande
{
  const p = await newPage(M)
  await p.goto(BASE + '/servizi/case', { waitUntil: 'networkidle0' })
  const btn = 'button[aria-controls="faq-1"]'
  await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), btn)
  await p.click(btn)
  await wait(450)
  const ex = await p.$eval(btn, (b) => b.getAttribute('aria-expanded'))
  ex === 'true' && (await isVisible(p, '#faq-1')) ? ok('domande frequenti: apertura') : bug('accordion', `aria-expanded=${ex}`)
  await p.__ctx.close()
}

// modulo contatti in tre passi
{
  for (const v of [D, M]) {
    const p = await newPage(v)
    await p.goto(BASE + '/contatti', { waitUntil: 'networkidle0' })
    const next = 'form button[type="submit"]'
    const dis = await p.$eval(next, (b) => b.disabled)
    dis ? ok(`${v.n}: "Avanti" bloccato senza scelta`) : bug(`modulo ${v.n}`, 'Avanti attivo senza scelta')
    await p.evaluate(() => [...document.querySelectorAll('label')].find((l) => l.textContent === 'Casale').click())
    await p.click(next)
    await wait(400)
    await p.evaluate(() => [...document.querySelectorAll('label')].find((l) => l.textContent === 'Sirolo').click())
    await p.evaluate(() => [...document.querySelectorAll('label')].find((l) => l.textContent === 'Entro un anno').click())
    await p.click(next)
    await wait(400)
    await p.click(next)
    await wait(250)
    const err = await p.evaluate(() => document.querySelector('[role="alert"]')?.textContent ?? '')
    err.includes('Servono') ? ok(`${v.n}: validazione senza dati`) : bug(`modulo ${v.n}`, 'nessun messaggio senza dati')
    await p.type('input[name="nome"]', 'Prova Test')
    await p.type('input[name="email"]', 'prova@example.com')
    await p.click('input[name="privacy"]')
    await p.click(next)
    await wait(1500)
    const res = await p.evaluate(() => (document.querySelector('[role="status"]')?.textContent ?? '') + '|' + (document.querySelector('[role="alert"]')?.textContent ?? ''))
    // in locale (vite preview) Netlify Forms non esiste: atteso il messaggio d'errore gestito
    res.includes('Grazie') || res.includes('Invio non riuscito') ? ok(`${v.n}: invio gestito (${res.includes('Grazie') ? 'inviato' : 'errore gestito, atteso in locale'})`) : bug(`modulo ${v.n}`, `esito: ${res}`)
    // indietro conserva i dati
    await p.__ctx.close()
  }
  // indietro conserva le scelte
  const p = await newPage(D)
  await p.goto(BASE + '/contatti', { waitUntil: 'networkidle0' })
  await p.evaluate(() => [...document.querySelectorAll('label')].find((l) => l.textContent === 'Interni').click())
  await p.click('form button[type="submit"]')
  await wait(350)
  await p.evaluate(() => [...document.querySelectorAll('form button')].find((b) => b.textContent.includes('Indietro')).click())
  await wait(350)
  const kept = await p.evaluate(() => [...document.querySelectorAll('input[name="tipo"]')].find((i) => i.checked)?.value)
  kept === 'Interni' ? ok('modulo: "Indietro" conserva le scelte') : bug('modulo', `scelta persa tornando indietro: ${kept}`)
  // mappa dopo il clic
  const before = await p.$('iframe')
  await p.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Mostra la mappa')).click())
  await wait(600)
  const after = await p.$('iframe[src*="openstreetmap"]')
  !before && after ? ok('mappa: nessun iframe prima del clic, caricata dopo') : bug('mappa', `prima ${!!before}, dopo ${!!after}`)
  await p.__ctx.close()
}

// cambio pagina: transizione e ritorno in cima
{
  const p = await newPage(D)
  await p.goto(BASE + '/', { waitUntil: 'networkidle0' })
  await p.evaluate(() => window.scrollTo(0, 2500))
  await wait(300)
  await p.evaluate(() => document.querySelector('a[href="/progetti/casa-due-mari"]').click())
  await wait(900)
  const y = await p.evaluate(() => window.scrollY)
  const h1 = await p.evaluate(() => document.querySelector('h1')?.textContent)
  const op = await p.evaluate(() => getComputedStyle(document.querySelector('main > div')).opacity)
  y === 0 && h1 === 'Casa Due Mari' && op === '1' ? ok('cambio pagina: dissolvenza, nuova pagina in cima e visibile') : bug('cambio pagina', `scrollY ${y}, h1 "${h1}", opacità ${op}`)
  const title = await p.title()
  title.startsWith('Casa Due Mari') ? ok(`title aggiornato: "${title}"`) : bug('cambio pagina', `title non aggiornato: ${title}`)
  await p.goBack()
  await wait(900)
  const back = await p.evaluate(() => location.pathname)
  back === '/' ? ok('indietro del browser funziona') : bug('cambio pagina', `indietro porta a ${back}`)
  // rotta inesistente
  await p.goto(BASE + '/progetti/non-esiste', { waitUntil: 'networkidle0' })
  const nf = await p.evaluate(() => document.querySelector('h1')?.textContent)
  nf?.includes('non c’è') ? ok('progetto inesistente: pagina 404') : bug('404', `h1: ${nf}`)
  // segnaposto
  await p.goto(BASE + '/?segnaposto=1', { waitUntil: 'networkidle0' })
  const ph = await p.evaluate(() => [document.documentElement.classList.contains('show-ph'), document.querySelectorAll('[data-placeholder]').length])
  ph[0] && ph[1] > 3 ? ok(`?segnaposto=1 evidenzia ${ph[1]} segnaposto in Home`) : bug('segnaposto', JSON.stringify(ph))
  if (p.__errors.length) bug('cambio pagina', p.__errors.join(' | '))
  await p.__ctx.close()
}

await browser.close()

// ---------- 3. HTML senza JavaScript: meta pre-renderizzati ----------
console.log('\n== HTML senza JavaScript')
for (const r of ROUTES) {
  const html = await (await fetch(BASE + r + (r === '/' ? '' : '/'))).text()
  const t = html.match(/<title>([^<]*)<\/title>/)?.[1]
  if (t !== seo.routes[r].title.replace(/&/g, '&amp;')) bug(`meta ${r}`, `title nell'HTML: ${t}`)
  if (!html.includes('application/ld+json')) bug(`meta ${r}`, 'dati strutturati mancanti')
  if (!html.includes(`og:title`)) bug(`meta ${r}`, 'og:title mancante')
}
ok(`meta controllati su ${ROUTES.length} rotte`)

// ---------- 4. link interni ed esterni ----------
console.log('\n== link')
const src = (await import('node:child_process')).execSync('git ls-files -co --exclude-standard src', { encoding: 'utf8' }).split('\n').filter((f) => /\.(tsx?|json)$/.test(f))
const hrefs = new Set()
for (const f of src) for (const m of readFileSync(f, 'utf8').matchAll(/(?:to|href|link|external)[=:]\s*[{]?['"`]([^'"`$]+)['"`]/g)) hrefs.add(m[1])
for (const h of [...hrefs].filter((h) => h.startsWith('/') && !h.startsWith('/img') && !h.includes('#'))) {
  const path = h.split('?')[0]
  if (!ROUTES.includes(path)) bug('link interno', `${h} non è una rotta`)
}
ok(`link interni controllati: ${[...hrefs].filter((h) => h.startsWith('/')).length}`)
const ext = [...hrefs].filter((h) => h.startsWith('http') && !h.includes('fioranelli.com') && !h.includes('schema.org') && !h.includes('opentopodata'))
for (const u of ext) {
  try {
    const r = await fetch(u, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(15000) })
    r.status < 400 ? ok(`${r.status} ${u}`) : bug('link esterno', `${r.status} ${u}`)
  } catch (e) {
    bug('link esterno', `${u} non risponde (${e.name})`)
  }
}

mkdirSync('screenshots', { recursive: true })
writeFileSync('screenshots/qa.json', JSON.stringify({ date: new Date().toISOString(), bugs }, null, 1))
console.log(`\nTOTALE BUG: ${bugs.length}`)
