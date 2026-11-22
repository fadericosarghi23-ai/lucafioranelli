# Crediti e provenienza dei materiali

## Fotografie
Tutte le foto dei progetti (`public/img/p/`) vengono dal profilo Houzz dello Studio di Architettura Fioranelli,
pubblicate dallo studio stesso tra febbraio e agosto 2020. Sono materiale del cliente, usato per la bozza.

- **Da fare prima della messa online:** chiedere al cliente conferma scritta all'uso e gli **originali in alta risoluzione**.
  Diverse foto sono sotto i 1000 px (Hotel San Francesco, Casa al mare, Giulia Camere, Casa Vacanze G.): nel sito sono
  usate solo in formati piccoli, ma meritano originali migliori.
- Alcune foto di Casa Due Mari ("vissuta") hanno l'aspetto di un servizio professionale: chiedere il nome del fotografo
  e se va citato.
- Script: `scripts/build-images.mjs` (scarica, converte in WebP 480/960/1600 px sotto i 300 KB).

## Dati altimetrici
Profilo della costa e sezione Conero/porto: **EU-DEM v1.1, 25 m**, programma Copernicus dell'Unione Europea
(uso libero con citazione), interrogato tramite api.opentopodata.org il 17/11/2026. Script: `scripts/fetch-dem.mjs`.
La vetta nel modello risulta più bassa della quota ufficiale (smussamento a 25 m): nelle etichette si usa 572 m.

## Testi
- Testi marcati "Testo dello studio" e la citazione "vestiti su misura": dal profilo Houzz dello studio.
- Recensioni: pubbliche su Houzz (5 recensioni, marzo 2020), riportate solo con le iniziali. Chiedere il permesso di citarle.
- Tutti gli altri testi sono segnaposto scritti da Altalogik (`data-placeholder`, commenti `[SEGNAPOSTO]`).

## Font
Archivo, Newsreader (SIL Open Font License) e IBM Plex Mono (SIL OFL), auto-ospitati tramite Fontsource.

## Icone
Lucide (licenza ISC).
