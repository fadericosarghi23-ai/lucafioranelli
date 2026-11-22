import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { initReveal } from '@/lib/reveal'
import { initPlaceholders } from '@/lib/placeholder'
import './index.css'

initPlaceholders()
initReveal()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user": con movimento ridotto framer-motion salta le trasformazioni */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
