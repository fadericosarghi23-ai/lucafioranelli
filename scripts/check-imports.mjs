// Verifica che ogni import relativo o con alias @/ punti a un file che esiste con le maiuscole ESATTE
// (Windows e macOS perdonano, Netlify gira su Linux e no).
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, resolve, relative, sep } from 'node:path'

const ROOT = resolve('src')
const EXT = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '.css', '/index.ts', '/index.tsx']

function walk(d) {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f)
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) ? [p] : []
  })
}

// esiste con queste maiuscole? confronta ogni segmento con il contenuto reale della cartella
function existsExact(p) {
  const rel = relative(resolve('.'), p).split(sep)
  let cur = resolve('.')
  for (const seg of rel) {
    let names
    try {
      names = readdirSync(cur)
    } catch {
      return false
    }
    if (!names.includes(seg)) return false
    cur = join(cur, seg)
  }
  return true
}

let bad = 0
let n = 0
for (const file of walk(ROOT)) {
  const src = readFileSync(file, 'utf8')
  for (const m of src.matchAll(/(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|@import\s+['"]([^'"]+)['"]/g)) {
    const spec = m[1] ?? m[2] ?? m[3]
    if (!spec.startsWith('.') && !spec.startsWith('@/')) continue
    n++
    const base = spec.startsWith('@/') ? join(ROOT, spec.slice(2)) : resolve(dirname(file), spec)
    const ok = EXT.some((e) => {
      const p = base + e
      try {
        return statSync(p).isFile() && existsExact(p)
      } catch {
        return false
      }
    })
    if (!ok) {
      bad++
      console.log(`✗ ${relative('.', file)} → ${spec}`)
    }
  }
}
console.log(`${n} import controllati, ${bad} errori`)
process.exit(bad ? 1 : 0)
