import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.scss'
import App from './App.jsx'
import { initAnalytics } from './utils/analytics.js'
import { readConsent } from './utils/cookieConsent.js'

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
