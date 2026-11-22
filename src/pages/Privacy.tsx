import { Link } from 'react-router-dom'
import { LegalLayout } from './Legal'
import { site } from '@/content/site'

// Informativa scritta su ciò che il sito usa davvero: hosting Netlify, Netlify Forms, mappa OpenStreetMap dopo un clic,
// font auto-ospitati, nessuno strumento di statistica, nessun cookie.
// [SEGNAPOSTO] dati del titolare (ragione sociale, P.IVA, PEC) da confermare; far rivedere a un consulente privacy.
export default function Privacy() {
  return (
    <LegalLayout path="/privacy" title="Informativa privacy" updated="17 novembre 2026">
      <p data-placeholder="dati titolare da confermare">
        Titolare del trattamento: {site.brand}, {site.address.street}, {site.address.cap} {site.address.city} ({site.address.province}), {site.vat.label}, email{' '}
        <a className="link-line" href={site.email.href}>
          {site.email.label}
        </a>
        .
      </p>
      <h2>Quali dati raccogliamo</h2>
      <ul>
        <li>
          <strong>Richieste dal modulo contatti</strong>: tipo di intervento, luogo, tempi, nome, email, telefono e messaggio. Li usiamo solo per risponderti e, se lo chiedi,
          per preparare un preventivo.
        </li>
        <li>
          <strong>Dati tecnici di navigazione</strong>: il fornitore di hosting (Netlify, Inc.) registra indirizzo IP, data e pagina richiesta nei log del server, per sicurezza
          e funzionamento del servizio.
        </li>
      </ul>
      <h2>Base giuridica e conservazione</h2>
      <p>
        Le richieste sono trattate per dare seguito alla tua domanda (misure precontrattuali, art. 6.1.b GDPR) e conservate per il tempo necessario a gestirla, e comunque non
        oltre 24 mesi se non nasce un incarico.
      </p>
      <h2>Chi tratta i dati per nostro conto</h2>
      <ul>
        <li>Netlify, Inc. (hosting del sito e ricezione del modulo), che può trattare i dati anche negli Stati Uniti con le garanzie previste dal GDPR.</li>
        <li>OpenStreetMap Foundation, solo se scegli di aprire la mappa nella pagina Contatti: in quel momento il tuo browser si collega ai loro server.</li>
      </ul>
      <p>I caratteri tipografici sono ospitati sul nostro sito: non ci colleghiamo a Google Fonts o ad altri servizi esterni durante la navigazione.</p>
      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiedere accesso, rettifica, cancellazione, limitazione od opposizione al trattamento scrivendo a{' '}
        <a className="link-line" href={site.email.href}>
          {site.email.label}
        </a>
        . Puoi anche presentare reclamo al Garante per la protezione dei dati personali.
      </p>
      <p>
        Sui cookie: vedi l’
        <Link to="/cookie" className="link-line">
          informativa cookie
        </Link>
        .
      </p>
    </LegalLayout>
  )
}
