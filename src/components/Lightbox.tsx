import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { imgMeta, imgSrc, imgSrcSet } from './Img'
import { cn, pad2 } from '@/lib/utils'

export interface LightboxProps {
  images: string[]
  /** indice aperto, null = chiuso */
  index: number | null
  /** id dell'immagine cliccata: la cornice si espande dalla sua miniatura (layoutId condiviso) */
  originId: string | null
  layoutPrefix: string
  title: string
  onClose: () => void
  onIndex: (i: number) => void
}

/**
 * Visore a schermo intero: transizione condivisa dalla miniatura, frecce, tastiera (← → Esc, + per lo zoom),
 * trascinamento orizzontale, zoom sul dettaglio che segue il puntatore.
 */
export function Lightbox({ images, index, originId, layoutPrefix, title, onClose, onIndex }: LightboxProps) {
  const open = index !== null
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const [dir, setDir] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const go = useCallback(
    (d: number) => {
      if (index === null) return
      setZoom(false)
      setDir(d)
      onIndex((index + d + images.length) % images.length)
    },
    [index, images.length, onIndex],
  )

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement
    closeRef.current?.focus()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '+' || e.key === '=') setZoom(true)
      else if (e.key === '-') setZoom(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
      returnFocus.current?.focus?.()
    }
  }, [open, go, onClose])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1)
  }

  const id = index !== null ? images[index] : null
  const m = id ? imgMeta(id) : null
  const ratio = m ? m.w / m.h : 1.5

  return createPortal(
    <AnimatePresence>
      {open && id && (
        <motion.div
          key="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, foto ${index! + 1} di ${images.length}`}
          className="fixed inset-0 z-[100] flex flex-col bg-inchiostro/96 text-calce on-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // in chiusura non intercetta più i clic, mentre la foto torna alla miniatura
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between gap-4 px-4 md:px-8">
            <p className="t-label truncate text-sabbia">
              {title} · <span className="text-calce">{pad2(index! + 1)}</span> / {pad2(images.length)}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => !z)}
                aria-pressed={zoom}
                aria-label={zoom ? 'Riduci' : 'Ingrandisci il dettaglio'}
                className="grid size-11 place-items-center rounded-full transition-colors hover:bg-calce/10"
              >
                {zoom ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
              </button>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Chiudi" className="grid size-11 place-items-center rounded-full transition-colors hover:bg-calce/10">
                <X className="size-6" />
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20">
            <motion.div
              layoutId={originId ? `${layoutPrefix}-${originId}` : undefined}
              className="relative overflow-hidden bg-inchiostro"
              style={{ aspectRatio: `${ratio}`, width: `min(96vw, calc((100svh - 9rem) * ${ratio}))` }}
              transition={{ type: 'spring', stiffness: 260, damping: 34, mass: 0.9 }}
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.img
                  key={id}
                  src={imgSrc(id, 1600)}
                  srcSet={imgSrcSet(id)}
                  sizes="96vw"
                  alt={`${title}, foto ${index! + 1}`}
                  width={m!.w}
                  height={m!.h}
                  draggable={false}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.7, 0.1, 1] }}
                  drag={zoom ? false : 'x'}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={onDragEnd}
                  onDoubleClick={() => setZoom((z) => !z)}
                  onPointerMove={(e) => {
                    if (!zoom) return
                    const r = (e.currentTarget as HTMLImageElement).getBoundingClientRect()
                    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
                  }}
                  className={cn(
                    'absolute inset-0 h-full w-full select-none object-cover transition-transform duration-300 ease-out',
                    zoom ? 'scale-[2.2] cursor-zoom-out' : 'cursor-grab active:cursor-grabbing',
                  )}
                  style={{ transformOrigin: origin }}
                />
              </AnimatePresence>
            </motion.div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Foto precedente"
                  className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-calce/10 transition-colors hover:bg-coppo md:left-6"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Foto successiva"
                  className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-calce/10 transition-colors hover:bg-coppo md:right-6"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          {/* indicatore di avanzamento */}
          <div className="h-14 shrink-0 px-4 md:px-8">
            <div className="relative mt-6 h-px bg-calce/20" aria-hidden="true">
              <motion.div className="absolute left-0 top-0 h-px bg-coppo-chiaro" animate={{ width: `${((index! + 1) / images.length) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
            <p className="mt-2 hidden text-[0.8rem] text-calce/50 md:block">Frecce o trascinamento per scorrere · doppio clic per lo zoom · Esc per chiudere</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
