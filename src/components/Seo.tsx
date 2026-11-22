import { useEffect } from 'react'
import seo from '@/content/seo.json'

type R = { title: string; description: string; image?: string }
const routes = seo.routes as Record<string, R>

/** Aggiorna title e description lato client; i meta per i crawler sono pre-renderizzati da scripts/prerender-meta.mjs */
export function Seo({ path, title, description }: { path: string; title?: string; description?: string }) {
  useEffect(() => {
    const r = routes[path]
    document.title = title ?? r?.title ?? seo.siteName
    const d = description ?? r?.description
    if (d) document.querySelector('meta[name="description"]')?.setAttribute('content', d)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', seo.baseUrl + (path === '/' ? '/' : path))
  }, [path, title, description])
  return null
}
