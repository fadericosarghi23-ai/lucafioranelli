import { cn } from '@/lib/utils'

/**
 * Logo "Falda": evoluzione del marchio esistente dello studio (FiorAnelli, A come falda di tetto).
 * La A senza traversa è un tetto a capanna; la gamba destra scende come un muro.
 * Risposta all'hover: la gamba si allunga (feedback sul link alla Home).
 */
export function FaldaGlyph({ className, stroke = 'currentColor', accent }: { className?: string; stroke?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 30 38" fill="none" aria-hidden="true" className={className}>
      <path d="M2 30 L15 3 L28 30" stroke={stroke} strokeWidth="2.6" strokeLinecap="square" strokeLinejoin="miter" />
      <path
        className="origin-top transition-transform duration-200 ease-out [transform-box:fill-box] group-hover:scale-y-[1.7]"
        d="M28 30 L28 37"
        stroke={accent ?? stroke}
        strokeWidth="2.6"
        strokeLinecap="square"
      />
    </svg>
  )
}

export function Logo({ className, compact = false, onDark = false }: { className?: string; compact?: boolean; onDark?: boolean }) {
  return (
    <span className={cn('group inline-flex flex-col leading-none', className)}>
      <span
        className="inline-flex items-end font-display font-medium tracking-[0.07em]"
        style={{ fontStretch: '118%', fontSize: compact ? '1.18rem' : '1.4rem' }}
      >
        <span>FIOR</span>
        <FaldaGlyph className="mx-[1px] -mb-[0.22em] h-[1.12em] w-[0.88em]" accent={onDark ? 'var(--coppo-chiaro)' : 'var(--coppo)'} />
        <span>NELLI</span>
      </span>
      {!compact && (
        <span className={cn('t-label mt-1.5 !text-[0.6rem] !tracking-[0.22em]', onDark ? 'text-sabbia' : 'text-grafite')}>architettura · Numana</span>
      )}
    </span>
  )
}
