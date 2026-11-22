import { cn } from '@/lib/utils'
import { FaldaGlyph } from './Logo'

/** Segnaposto foto dichiarativo: dice cosa va scattato e in che formato (mai riquadri grigi anonimi). */
export function PhotoPlaceholder({
  subject,
  format,
  notes,
  ratio = '4 / 5',
  className,
}: {
  subject: string
  format: string
  notes?: string
  ratio?: string
  className?: string
}) {
  return (
    <figure
      data-placeholder={`foto: ${subject}`}
      className={cn('relative flex flex-col justify-between overflow-hidden border border-sabbia bg-pietra/70 p-5 text-inchiostro', className)}
      style={{ aspectRatio: ratio }}
    >
      {/* [SEGNAPOSTO] foto da scattare */}
      <FaldaGlyph className="h-14 w-11 text-sabbia" />
      <figcaption className="space-y-1.5">
        <p className="t-label text-coppo">Foto da scattare</p>
        <p className="font-display text-lg font-medium leading-tight">{subject}</p>
        <p className="t-label text-grafite">Formato {format}</p>
        {notes && <p className="text-sm leading-snug text-grafite">{notes}</p>}
      </figcaption>
    </figure>
  )
}
