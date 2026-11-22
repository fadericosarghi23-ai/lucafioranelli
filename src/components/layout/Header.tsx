import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Img } from '@/components/Img'
import { ButtonLink } from '@/components/ui/button'
import { services } from '@/content/services'
import { site } from '@/content/site'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/progetti', label: 'Progetti' },
  { to: '/servizi', label: 'Servizi', dropdown: true },
  { to: '/studio', label: 'Studio' },
  { to: '/contatti', label: 'Contatti' },
]

const navLink =
  'relative font-display text-[0.95rem] font-medium py-2 transition-colors duration-200 hover:text-coppo after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-coppo after:transition-transform after:duration-200 hover:after:scale-x-100'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [drop, setDrop] = useState(false)
  const loc = useLocation()
  const dropRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number>(0)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    setMenu(false)
    setDrop(false)
  }, [loc.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false)
        setDrop(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : ''
  }, [menu])

  const openDrop = () => {
    window.clearTimeout(closeTimer.current)
    setDrop(true)
  }
  const closeDropSoon = () => {
    closeTimer.current = window.setTimeout(() => setDrop(false), 140)
  }

  return (
    <>
      <a href="#contenuto" className="sr-only z-[60] rounded-full bg-inchiostro px-4 py-2 text-calce focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
        Vai al contenuto
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b transition-[background-color,border-color,box-shadow] duration-300',
          scrolled || menu ? 'border-pietra bg-calce/95 shadow-[0_1px_18px_rgb(27_30_28/0.06)] backdrop-blur-sm' : 'border-transparent bg-calce',
        )}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Link to="/" aria-label="Studio di Architettura Fioranelli, torna alla Home" className="rounded-sm">
            <Logo />
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) =>
              n.dropdown ? (
                <div key={n.to} ref={dropRef} className="relative" onMouseEnter={openDrop} onMouseLeave={closeDropSoon}>
                  <div className="flex items-center gap-1">
                    <NavLink to={n.to} className={({ isActive }) => cn(navLink, isActive && 'text-coppo after:scale-x-100')}>
                      {n.label}
                    </NavLink>
                    <button
                      type="button"
                      aria-expanded={drop}
                      aria-controls="tendina-servizi"
                      aria-label="Mostra i servizi"
                      onClick={() => setDrop((d) => !d)}
                      className="grid size-7 place-items-center rounded-full transition-colors hover:bg-pietra"
                    >
                      <ChevronDown className={cn('size-4 transition-transform duration-200', drop && 'rotate-180')} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {drop && (
                      <motion.div
                        id="tendina-servizi"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: [0.2, 0.7, 0.1, 1] }}
                        className="absolute left-1/2 top-full z-10 mt-3 w-[620px] -translate-x-1/2 border border-pietra bg-calce p-3 shadow-[0_20px_50px_rgb(27_30_28/0.12)]"
                        onFocus={openDrop}
                        onBlur={(e) => {
                          if (!dropRef.current?.contains(e.relatedTarget as Node)) setDrop(false)
                        }}
                      >
                        <ul className="grid grid-cols-2 gap-1">
                          {services.map((s) => (
                            <li key={s.slug}>
                              <Link to={`/servizi/${s.slug}`} className="group flex gap-3 p-2.5 transition-colors hover:bg-white">
                                <Img id={s.cover} alt="" ratio="1 / 1" className="w-16 shrink-0" sizes="64px" imgClassName="transition-transform duration-300 group-hover:scale-105" />
                                <span>
                                  <span className="t-h3 block text-[1rem] transition-colors group-hover:text-coppo">{s.title}</span>
                                  <span className="mt-1 block text-[0.88rem] leading-snug text-grafite">{s.short}</span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <NavLink key={n.to} to={n.to} className={({ isActive }) => cn(navLink, isActive && 'text-coppo after:scale-x-100')}>
                  {n.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink to="/contatti" size="sm" className="hidden md:inline-flex">
              Parliamo del progetto
            </ButtonLink>
            <button
              type="button"
              className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-pietra lg:hidden"
              aria-expanded={menu}
              aria-controls="menu-mobile"
              aria-label={menu ? 'Chiudi il menu' : 'Apri il menu'}
              onClick={() => setMenu((m) => !m)}
            >
              <span className={cn('absolute h-[2px] w-6 bg-inchiostro transition-transform duration-300', menu ? 'rotate-45' : '-translate-y-[5px]')} />
              <span className={cn('absolute h-[2px] w-6 bg-inchiostro transition-transform duration-300', menu ? '-rotate-45' : 'translate-y-[5px]')} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.1, 1] }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-calce lg:hidden"
          >
            <nav aria-label="Menu mobile" className="wrap flex min-h-full flex-col pb-8 pt-6">
              <ul className="space-y-1">
                {NAV.map((n, i) => (
                  <motion.li key={n.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + i * 0.05, duration: 0.3 }}>
                    <NavLink to={n.to} className={({ isActive }) => cn('t-h1 block py-1.5 transition-colors', isActive ? 'text-coppo' : 'hover:text-coppo')}>
                      {n.label}
                    </NavLink>
                    {n.dropdown && (
                      <ul className="mb-3 mt-1 grid grid-cols-2 gap-x-4 gap-y-1 border-l border-sabbia pl-4">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link to={`/servizi/${s.slug}`} className="block py-1 font-display text-[0.98rem] text-grafite hover:text-coppo">
                              {s.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3 border-t border-pietra pt-6">
                <ButtonLink to="/contatti" className="w-full">
                  Parliamo del progetto
                </ButtonLink>
                <p className="t-label text-grafite" data-placeholder="indirizzo e telefono da confermare">
                  {site.address.street}, {site.address.city} · <a href={site.phoneMobile.href}>{site.phoneMobile.label}</a>
                </p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
