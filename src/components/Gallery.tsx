import { useState } from 'react'
import { motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { Img, imgMeta } from './Img'
import { Lightbox } from './Lightbox'
import { cn } from '@/lib/utils'

/**
 * Galleria a mosaico: ogni miniatura è un pulsante che apre il visore.
 * La miniatura e la cornice del visore condividono il layoutId (la foto si espande nel visore).
 * Su mobile due colonne, mai pile di foto verticali a tutta larghezza.
 */
export function Gallery({ images, title, prefix, className }: { images: string[]; title: string; prefix: string; className?: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const [originId, setOriginId] = useState<string | null>(null)

  return (
    <>
      <ul className={cn('grid grid-flow-dense grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4', className)}>
        {images.map((id, i) => {
          const m = imgMeta(id)
          const wide = m.w / m.h > 1.2 && i % 5 === 0
          return (
            <li key={id} className={cn(wide && 'col-span-2')} data-reveal style={{ ['--d' as string]: `${Math.min(i % 4, 3) * 60}ms` }}>
              <button
                type="button"
                onClick={() => {
                  setOriginId(id)
                  setIndex(i)
                }}
                aria-label={`Apri la foto ${i + 1} di ${images.length} a schermo intero`}
                className="group relative block w-full overflow-hidden"
              >
                <motion.div layoutId={`${prefix}-${id}`} transition={{ type: 'spring', stiffness: 260, damping: 34, mass: 0.9 }}>
                  <Img
                    id={id}
                    alt=""
                    ratio={wide ? '16 / 9' : '4 / 3'}
                    sizes={wide ? '(min-width:1024px) 50vw, 100vw' : '(min-width:1024px) 25vw, 50vw'}
                    imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </motion.div>
                <span className="pointer-events-none absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-calce/95 text-inchiostro opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Maximize2 className="size-4" />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <Lightbox
        images={images}
        index={index}
        originId={originId}
        layoutPrefix={prefix}
        title={title}
        onIndex={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  )
}
