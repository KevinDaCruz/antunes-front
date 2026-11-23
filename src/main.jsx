import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.scss'
import App from './App.jsx'
import { initAnalytics } from './utils/analytics.js'
import { readConsent } from './utils/cookieConsent.js'
import { reloadOnceForNewBuild } from './utils/staleBuild.js'

// Émis par Vite quand un fichier chargé à la demande est introuvable,
// typiquement après une nouvelle mise en production : on recharge la page
// au lieu d'afficher une erreur. Sinon, RouteError prend le relais.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForNewBuild()) {
    event.preventDefault()
  }
})

// Google Analytics n'est chargé que si l'utilisateur l'a accepté lors
// d'une visite précédente (sinon le bandeau cookies le lui demandera).
if (readConsent()?.analytics) {
  initAnalytics()
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
