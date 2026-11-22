import { cloneElement, lazy, Suspense, useEffect, type ReactElement } from 'react'
import { useLocation, useRoutes, type RouteObject } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { scanReveal } from '@/lib/reveal'
import Home from '@/pages/Home'

const Projects = lazy(() => import('@/pages/Projects'))
const ProjectPage = lazy(() => import('@/pages/ProjectPage'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceOspitalita = lazy(() => import('@/pages/services/Ospitalita'))
const ServiceCentriStorici = lazy(() => import('@/pages/services/CentriStorici'))
const ServiceCase = lazy(() => import('@/pages/services/Case'))
const ServiceInterni = lazy(() => import('@/pages/services/Interni'))
const Studio = lazy(() => import('@/pages/Studio'))
const Contacts = lazy(() => import('@/pages/Contacts'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const Cookie = lazy(() => import('@/pages/Cookie'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/progetti', element: <Projects /> },
  { path: '/progetti/:slug', element: <ProjectPage /> },
  { path: '/servizi', element: <Services /> },
  { path: '/servizi/ospitalita', element: <ServiceOspitalita /> },
  { path: '/servizi/centri-storici', element: <ServiceCentriStorici /> },
  { path: '/servizi/case', element: <ServiceCase /> },
  { path: '/servizi/interni', element: <ServiceInterni /> },
  { path: '/studio', element: <Studio /> },
  { path: '/contatti', element: <Contacts /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/cookie', element: <Cookie /> },
  { path: '*', element: <NotFound /> },
]

// La transizione tra pagine non parte al primo caricamento: flag sul solo contenitore
// (non initial={false} su AnimatePresence, che spegnerebbe gli stati iniziali di tutti i figli).
let firstPage = true

function PageFrame({ children }: { children: React.ReactNode }) {
  const initial = firstPage ? false : { opacity: 0 }
  useEffect(() => {
    firstPage = false
    scanReveal()
  }, [])
  return (
    <motion.div initial={initial} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: 'easeOut' }}>
      {children}
    </motion.div>
  )
}

/** Il segnaposto delle rotte è alto almeno uno schermo: il footer non sale e scende (CLS). */
const RouteFallback = () => <div className="min-h-[100svh]" aria-busy="true" />

export default function App() {
  const location = useLocation()
  const element = useRoutes(routes, location)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  return (
    <>
      <Header />
      <main id="contenuto" className="pt-[var(--header-h)]">
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
          <PageFrame key={location.pathname}>
            <Suspense fallback={<RouteFallback />}>{element && cloneElement(element as ReactElement)}</Suspense>
          </PageFrame>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
