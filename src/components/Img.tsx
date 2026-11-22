import { useState, type CSSProperties } from 'react'
import images from '@/content/images.json'
import { cn } from '@/lib/utils'

type Meta = { w: number; h: number; color: string }
const META = images as Record<string, Meta>

export const imgMeta = (id: string): Meta => META[id] ?? { w: 1600, h: 1067, color: '#cfc6b8' }
export const imgSrc = (id: string, w: 480 | 960 | 1600 = 960) => `/img/p/${id}-${w}.webp`
export const imgSrcSet = (id: string) => `${imgSrc(id, 480)} 480w, ${imgSrc(id, 960)} 960w, ${imgSrc(id, 1600)} 1600w`

interface Props {
  id: string
  alt: string
  className?: string
  imgClassName?: string
  sizes?: string
  priority?: boolean
  /** rapporto del contenitore; se assente usa quello della foto */
  ratio?: string
  style?: CSSProperties
  position?: string
}

/** Foto WebP con srcset, spazio riservato (width/height o aspect-ratio) e comparsa al caricamento. */
export function Img({ id, alt, className, imgClassName, sizes = '(min-width: 1024px) 50vw, 100vw', priority, ratio, style, position }: Props) {
  const m = imgMeta(id)
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={cn('relative overflow-hidden', className)} style={{ ...(ratio === 'auto' ? {} : { aspectRatio: ratio ?? `${m.w} / ${m.h}` }), backgroundColor: m.color + '33', ...style }}>
      <img
        src={imgSrc(id, 960)}
        srcSet={imgSrcSet(id)}
        sizes={sizes}
        width={m.w}
        height={m.h}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          if (el?.complete && el.naturalWidth && !loaded) setLoaded(true)
        }}
        className={cn('img-fade absolute inset-0 h-full w-full object-cover', loaded && 'is-loaded', imgClassName)}
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  )
}
