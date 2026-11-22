import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Img } from './Img'
import { cn } from '@/lib/utils'

/**
 * Prima e dopo: le due foto non hanno lo stesso punto di vista, quindi niente cursore sovrapposto
 * (sarebbe ingannevole) ma un selettore con dissolvenza incrociata. Con foto allineate si passa al cursore.
 */
export function BeforeAfter({ before, after, note, title }: { before: string; after: string; note: string; title: string }) {
  const [state, setState] = useState<'prima' | 'dopo'>('prima')
  const id = state === 'prima' ? before : after
  return (
    <figure>
      <div className="relative">
        <div className="relative overflow-hidden" style={{ aspectRatio: '3 / 2' }}>
          <AnimatePresence initial={false}>
            <motion.div key={id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
              <Img id={id} alt={`${title}, ${state === 'prima' ? 'prima dei lavori' : 'dopo i lavori'}`} ratio="3 / 2" sizes="(min-width:1024px) 60vw, 100vw" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div role="radiogroup" aria-label="Prima o dopo i lavori" className="absolute left-3 top-3 flex rounded-full bg-calce/95 p-1">
          {(['prima', 'dopo'] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={state === k}
              onClick={() => setState(k)}
              className={cn(
                'rounded-full px-4 py-1.5 font-display text-sm font-medium capitalize transition-colors duration-200',
                state === k ? 'bg-inchiostro text-calce' : 'text-inchiostro hover:text-coppo',
              )}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-[0.95rem] text-grafite">{note}</figcaption>
    </figure>
  )
}
