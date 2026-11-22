import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'group/btn inline-flex items-center justify-center gap-2 rounded-full font-display text-[0.95rem] font-medium tracking-[0.005em] transition-[background-color,color,border-color,transform] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-inchiostro text-calce hover:bg-coppo',
        outline: 'border border-inchiostro/80 text-inchiostro hover:bg-inchiostro hover:text-calce',
        light: 'bg-calce text-inchiostro hover:bg-white',
        ghost: 'text-inchiostro hover:text-coppo',
      },
      size: { md: 'h-11 px-5', lg: 'h-13 px-6 text-base', sm: 'h-9 px-4 text-sm' },
    },
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)

type V = VariantProps<typeof buttonVariants>
const Arrow = () => (
  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
)

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & V & { arrow?: boolean }>(
  ({ className, variant, size, arrow, children, ...p }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...p}>
      {children}
      {arrow && <Arrow />}
    </button>
  ),
)
Button.displayName = 'Button'

export function ButtonLink({ className, variant, size, arrow = true, children, ...p }: LinkProps & V & { arrow?: boolean }) {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...p}>
      {children}
      {arrow && <Arrow />}
    </Link>
  )
}

export function ButtonA({ className, variant, size, arrow = true, children, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & V & { arrow?: boolean }) {
  return (
    <a className={cn(buttonVariants({ variant, size }), className)} {...p}>
      {children}
      {arrow && <Arrow />}
    </a>
  )
}
