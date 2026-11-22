// Geometrie del profilo del Conero da dati altimetrici reali (EU-DEM 25 m, Copernicus).
// Lo "skyline" è ciò che si vede dal mare guardando a ovest: il nord sta a destra.
import dem from '@/content/conero-dem.json'

export type Pt = [number, number]

/** Catmull-Rom -> curve di Bézier cubiche: linea morbida che passa per tutti i punti */
export function smoothPath(pts: Pt[], close?: { baseY: number }) {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  if (close) d += ` L${pts.at(-1)![0].toFixed(1)} ${close.baseY} L${pts[0][0].toFixed(1)} ${close.baseY} Z`
  return d
}

const sky = [...dem.skyline].sort((a, b) => a.lat - b.lat) // sud -> nord
export const LAT_MIN = sky[0].lat
export const LAT_MAX = sky.at(-1)!.lat
export const Z_MAX = Math.max(...sky.map((s) => s.z))

/** skyline in un riquadro W x H; topPad lascia spazio alle etichette */
export function skyline(W: number, H: number, opts: { latMin?: number; latMax?: number; topPad?: number } = {}) {
  const latMin = opts.latMin ?? LAT_MIN
  const latMax = opts.latMax ?? LAT_MAX
  const top = opts.topPad ?? 0
  const pts = sky.filter((s) => s.lat >= latMin - 1e-6 && s.lat <= latMax + 1e-6)
  const zMax = Math.max(...pts.map((s) => s.z))
  const x = (lat: number) => ((lat - latMin) / (latMax - latMin)) * W
  const y = (z: number) => H - (z / zMax) * (H - top)
  const p: Pt[] = pts.map((s) => [x(s.lat), y(s.z)])
  return { d: smoothPath(p), fill: smoothPath(p, { baseY: H }), x, y, zMax, points: p }
}

/** sezione vetta -> porto di Numana (in metri reali) */
export function section(W: number, H: number, topPad = 0) {
  const s = dem.section
  const dMax = s.at(-1)!.d
  const zMax = Math.max(...s.map((v) => v.z))
  const x = (d: number) => (d / dMax) * W
  const y = (z: number) => H - (z / zMax) * (H - topPad)
  const p: Pt[] = s.map((v) => [x(v.d), y(v.z)])
  return { d: smoothPath(p), fill: smoothPath(p, { baseY: H }), x, y, dMax, zMax, points: p }
}

export const DEM_SOURCE = 'Quote: EU-DEM v1.1, 25 m (Copernicus). Vetta del Conero: quota ufficiale 572 m.'
