import { LegalLayout } from './Legal'

// Il sito non imposta cookie. Usa sessionStorage solo per due preferenze tecniche (vedi sotto).
export default function Cookie() {
  return (
    <LegalLayout path="/cookie" title="Cookie" updated="17 novembre 2026">
      <p>Questo sito non usa cookie di profilazione, né strumenti di statistica, né pulsanti social che tracciano la navigazione. Per questo non ti chiediamo il consenso.</p>
      <h2>Memoria tecnica del browser</h2>
      <p>Il sito salva nella memoria di sessione del tuo browser (sessionStorage, cancellata alla chiusura della scheda) due sole informazioni tecniche:</p>
      <ul>
        <li>se hai già visto l’animazione d’apertura della pagina iniziale, per non ripetertela;</li>
        <li>una impostazione di revisione usata durante la preparazione del sito.</li>
      </ul>
      <p>Non contengono dati personali e non vengono inviate a nessuno.</p>
      <h2>Servizi esterni</h2>
      <p>
        La mappa nella pagina Contatti viene da OpenStreetMap e si carica solo se premi “Mostra la mappa”. I link a Houzz e Facebook portano a siti esterni, con le loro
        informative.
      </p>
    </LegalLayout>
  )
}
