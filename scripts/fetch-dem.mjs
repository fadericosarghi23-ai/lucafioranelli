// Scarica quote reali dal dataset pubblico EU-DEM 25 m (Copernicus) tramite OpenTopoData.
// 1) "skyline": per ogni latitudine tra Ancona e Porto Recanati prende la quota massima
//    su una fascia di longitudini (cosa si vede dal mare guardando a ovest).
// 2) "sezione": transetto dalla vetta del Conero al porto di Numana (Via del Porto).
// Uso: node scripts/fetch-dem.mjs  -> scrive scripts/data/conero-dem.json
import { writeFileSync, mkdirSync } from 'node:fs'

const API = 'https://api.opentopodata.org/v1/eudem25m?locations='
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function query(points) {
  const out = []
  for (let i = 0; i < points.length; i += 100) {
    const chunk = points.slice(i, i + 100)
    const url = API + chunk.map(([la, lo]) => `${la.toFixed(5)},${lo.toFixed(5)}`).join('|')
    const r = await fetch(url)
    const j = await r.json()
    if (j.status !== 'OK') throw new Error(JSON.stringify(j))
    out.push(...j.results.map((x) => x.elevation ?? 0))
    await sleep(1200)
  }
  return out
}

// Skyline
const lats = []
for (let la = 43.632; la >= 43.405; la -= 0.0032) lats.push(+la.toFixed(5))
const lons = []
for (let lo = 13.47; lo <= 13.665; lo += 0.013) lons.push(+lo.toFixed(5))
const grid = lats.flatMap((la) => lons.map((lo) => [la, lo]))
const elev = await query(grid)
const skyline = lats.map((la, i) => {
  const row = elev.slice(i * lons.length, (i + 1) * lons.length)
  return { lat: la, z: Math.max(0, ...row.map((v) => (v == null ? 0 : v))) }
})

// Sezione vetta -> porto
const A = [43.5503, 13.6011] // Monte Conero, vetta
const B = [43.5092, 13.6221] // Numana, Via del Porto
const N = 80
const tpts = Array.from({ length: N }, (_, k) => [A[0] + ((B[0] - A[0]) * k) / (N - 1), A[1] + ((B[1] - A[1]) * k) / (N - 1)])
const tz = await query(tpts)
const R = 6371000
const toRad = (d) => (d * Math.PI) / 180
const dist = (p, q) => {
  const dLa = toRad(q[0] - p[0]), dLo = toRad(q[1] - p[1])
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(toRad(p[0])) * Math.cos(toRad(q[0])) * Math.sin(dLo / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}
const section = tpts.map((p, k) => ({ d: Math.round(dist(A, p)), z: Math.max(0, tz[k] ?? 0) }))

mkdirSync('scripts/data', { recursive: true })
writeFileSync(
  'scripts/data/conero-dem.json',
  JSON.stringify({ source: 'EU-DEM v1.1 25 m (Copernicus), via api.opentopodata.org', fetched: new Date().toISOString(), lons: [lons[0], lons.at(-1)], skyline, section }, null, 1),
)
console.log('skyline', skyline.length, 'max', Math.max(...skyline.map((s) => s.z)).toFixed(1), 'section', section.length, 'len m', section.at(-1).d)
