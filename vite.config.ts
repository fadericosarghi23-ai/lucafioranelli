import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Precarica i soli font latini davvero usati sopra la piega (Archivo, Newsreader, Plex Mono 500):
 * arrivano prima del primo disegno, i titoli non cambiano a capo e il CLS resta basso.
 */
function preloadFonts(): Plugin {
  const wanted = [/archivo-latin-wdth-normal/, /newsreader-latin-wght-normal/, /ibm-plex-mono-latin-500-normal/]
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => f.endsWith('.woff2') && wanted.some((r) => r.test(f)))
        const links = files.map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin />`).join('\n    ')
        // fuori dal blocco <!--META-->, che lo script di prerender riscrive per ogni rotta
        return html.replace('<meta name="theme-color"', `${links}\n    <meta name="theme-color"`)
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  build: { target: 'es2020', cssCodeSplit: true, reportCompressedSize: false },
})
