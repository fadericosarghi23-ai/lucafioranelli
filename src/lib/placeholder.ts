// ?segnaposto=1 evidenzia tutti gli elementi con data-placeholder (testi, foto, dati da confermare)
export function initPlaceholders() {
  const on = new URLSearchParams(window.location.search).get('segnaposto') === '1'
  try {
    if (on) sessionStorage.setItem('segnaposto', '1')
    if (on || sessionStorage.getItem('segnaposto') === '1') document.documentElement.classList.add('show-ph')
  } catch {
    if (on) document.documentElement.classList.add('show-ph')
  }
}
