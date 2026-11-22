# Studio di Architettura Fioranelli, Numana

Bozza del sito realizzata da Altalogik. Vite, React 19, TypeScript, Tailwind v4, struttura shadcn, framer-motion.

## Comandi
```bash
npm ci
npm run dev            # sviluppo
npm run build          # tsc + vite build + meta pre-renderizzati per ogni rotta, sitemap, robots, 404
npm run check:imports  # maiuscole esatte negli import (Netlify gira su Linux)
node scripts/screenshots.mjs   # screenshot di tutte le rotte, 1440/375, movimento attivo e ridotto (serve `npx vite preview`)
node scripts/metrics.mjs       # byte, LCP, CLS delle pagine chiave
```

## Segnaposto
- Nel codice: commenti `[SEGNAPOSTO]` e attributo `data-placeholder`.
- Nel browser: aggiungere `?segnaposto=1` a qualsiasi indirizzo per evidenziarli tutti (resta attivo nella scheda).
- Dati da confermare: `src/content/site.ts` (campi `verify: true`).

## Identità
- Logo "Falda": evoluzione del marchio esistente dello studio (`src/components/Logo.tsx`).
- Motivo grafico: profilo reale del Conero da dati EU-DEM (`src/lib/conero.ts`), simbolo di quota.
- Palette e font: `src/index.css`.

## Messa online
1. In `src/content/seo.json` impostare `"draft": false` e il dominio definitivo in `baseUrl`.
2. In `netlify.toml` togliere l'header `X-Robots-Tag: noindex`.
3. Attivare le notifiche di Netlify Forms per il modulo `richiesta`.
4. Se il dominio è fioranelli.com: attenzione ai record MX, la casella luca@fioranelli.com è in uso.

Vedi `CREDITI.md` per la provenienza di foto e dati.
