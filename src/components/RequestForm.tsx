import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

const TIPI = ['Casa o appartamento', 'Casale', 'Casa nel centro storico', 'Hotel, B&B, camere', 'Bar o ristorante', 'Stabilimento balneare', 'Interni', 'Altro']
const LUOGHI = ['Numana', 'Sirolo', 'Camerano', 'Ancona', 'Loreto', 'Porto Recanati', 'Altro']
const STATI = ['Ho già l’immobile', 'Sto valutando un acquisto', 'La struttura è già in attività']
const TEMPI = ['Entro sei mesi', 'Entro un anno', 'Sto solo valutando']

type Data = Record<'tipo' | 'luogo' | 'stato' | 'tempi' | 'nome' | 'email' | 'telefono' | 'messaggio', string> & { privacy: boolean }
const EMPTY: Data = { tipo: '', luogo: '', stato: '', tempi: '', nome: '', email: '', telefono: '', messaggio: '', privacy: false }
const STEPS = ['Che cosa', 'Dove e quando', 'I tuoi contatti']

function Choice({ name, value, options, onChange, legend }: { name: string; value: string; options: string[]; onChange: (v: string) => void; legend: string }) {
  return (
    <fieldset>
      <legend className="t-label mb-3 text-grafite">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={cn(
              'cursor-pointer rounded-full border px-4 py-2 font-display text-[0.95rem] transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-coppo',
              value === o ? 'border-inchiostro bg-inchiostro text-calce' : 'border-sabbia bg-white/60 hover:border-inchiostro',
            )}
          >
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

const field = 'mt-1.5 w-full border border-sabbia bg-white px-3.5 py-3 text-[1rem] transition-colors focus:border-inchiostro focus:outline-none focus-visible:outline-2 focus-visible:outline-coppo'

/** Richiesta guidata in tre passi, inviata a Netlify Forms (nessun cookie, nessun servizio esterno). */
export function RequestForm() {
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Data>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [err, setErr] = useState('')
  const set = (k: keyof Data) => (v: string | boolean) => setD((x) => ({ ...x, [k]: v }))

  const canNext = step === 0 ? !!d.tipo : step === 1 ? !!d.luogo && !!d.tempi : true

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (step < 2) {
      if (canNext) setStep(step + 1)
      return
    }
    if (!d.nome || !/^\S+@\S+\.\S+$/.test(d.email) || !d.privacy) {
      setErr('Servono nome, un’email valida e il consenso al trattamento dei dati.')
      return
    }
    setErr('')
    setStatus('sending')
    try {
      const body = new URLSearchParams({ 'form-name': 'richiesta', ...Object.fromEntries(Object.entries(d).map(([k, v]) => [k, String(v)])) })
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() })
      if (!r.ok) throw new Error(String(r.status))
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="border border-inchiostro bg-white/70 p-8" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-coppo text-white">
          <Check className="size-6" />
        </span>
        <h3 className="t-h2 mt-5">Grazie, {d.nome.split(' ')[0]}.</h3>
        <p className="mt-3 max-w-md text-grafite">Abbiamo ricevuto la tua richiesta. Ti ricontattiamo per fissare una chiamata o un sopralluogo.</p>
      </motion.div>
    )
  }

  return (
    <form name="richiesta" onSubmit={submit} noValidate className="border border-pietra bg-white/60 p-5 md:p-8">
      <input type="hidden" name="form-name" value="richiesta" />
      <p className="sr-only" aria-live="polite">
        Passo {step + 1} di 3: {STEPS[step]}
      </p>
      {/* avanzamento: tre quote */}
      <ol className="mb-8 grid grid-cols-3 gap-2" aria-hidden>
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <svg viewBox="0 0 20 16" className="h-3.5 w-4 shrink-0">
              <path d="M1 1 H19 L10 15 Z" fill="none" stroke={i <= step ? 'var(--inchiostro)' : 'var(--sabbia)'} strokeWidth="1.4" />
              <path d="M10 1 H19 L10 15 Z" fill={i <= step ? 'var(--coppo)' : 'transparent'} className="transition-colors duration-300" />
            </svg>
            <span className={cn('t-label truncate transition-colors', i === step ? 'text-inchiostro' : 'text-grafite/70')}>{s}</span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }} className="space-y-7">
          {step === 0 && <Choice name="tipo" legend="Su che cosa vorresti lavorare?" value={d.tipo} options={TIPI} onChange={set('tipo')} />}
          {step === 1 && (
            <>
              <Choice name="luogo" legend="Dove si trova?" value={d.luogo} options={LUOGHI} onChange={set('luogo')} />
              <Choice name="stato" legend="A che punto sei?" value={d.stato} options={STATI} onChange={set('stato')} />
              <Choice name="tempi" legend="Quando vorresti iniziare?" value={d.tempi} options={TEMPI} onChange={set('tempi')} />
            </>
          )}
          {step === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <p className="hidden">
                <label>
                  Non compilare: <input name="sito" tabIndex={-1} autoComplete="off" />
                </label>
              </p>
              <label className="block">
                <span className="t-label text-grafite">Nome e cognome *</span>
                <input className={field} name="nome" autoComplete="name" required value={d.nome} onChange={(e) => set('nome')(e.target.value)} />
              </label>
              <label className="block">
                <span className="t-label text-grafite">Email *</span>
                <input className={field} name="email" type="email" autoComplete="email" required value={d.email} onChange={(e) => set('email')(e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <span className="t-label text-grafite">Telefono</span>
                <input className={field} name="telefono" type="tel" autoComplete="tel" value={d.telefono} onChange={(e) => set('telefono')(e.target.value)} />
              </label>
              <label className="block md:col-span-2">
                <span className="t-label text-grafite">Raccontaci in due righe</span>
                <textarea className={cn(field, 'min-h-[120px]')} name="messaggio" value={d.messaggio} onChange={(e) => set('messaggio')(e.target.value)} />
              </label>
              <label className="flex items-start gap-3 md:col-span-2">
                <input type="checkbox" name="privacy" checked={d.privacy} onChange={(e) => set('privacy')(e.target.checked)} className="mt-1 size-4 accent-[var(--coppo)]" required />
                <span className="text-[0.95rem] text-grafite">
                  Ho letto l’
                  <Link to="/privacy" className="link-line text-inchiostro">
                    informativa privacy
                  </Link>{' '}
                  e acconsento al trattamento dei dati per essere ricontattato. *
                </span>
              </label>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {err && (
        <p role="alert" className="mt-5 text-[0.95rem] text-coppo">
          {err}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="mt-5 text-[0.95rem] text-coppo">
          Invio non riuscito. Riprova, oppure scrivici direttamente via email.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-pietra pt-5">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 font-display text-[0.95rem] transition-colors hover:text-coppo">
            <ArrowLeft className="size-4" /> Indietro
          </button>
        ) : (
          <span className="t-label text-grafite">Tre passi, un minuto</span>
        )}
        <Button type="submit" disabled={!canNext || status === 'sending'} arrow>
          {step < 2 ? 'Avanti' : status === 'sending' ? 'Invio…' : 'Invia la richiesta'}
        </Button>
      </div>
    </form>
  )
}
