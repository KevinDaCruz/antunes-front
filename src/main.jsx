import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { initAnalytics } from "./utils/analytics.js";
import { readConsent } from "./utils/cookieConsent.js";
import { reloadOnceForNewBuild } from "./utils/staleBuild.js";

// Émis par Vite quand un fichier chargé à la demande est introuvable,
// typiquement après une nouvelle mise en production : on recharge la page
// au lieu d'afficher une erreur. Sinon, RouteError prend le relais.
window.addEventListener("vite:preloadError", (event) => {
  if (reloadOnceForNewBuild()) {
    event.preventDefault();
  }
});

// Google Analytics n'est chargé que si l'utilisateur l'a accepté lors
// d'une visite précédente (sinon le bandeau cookies le lui demandera).
if (readConsent()?.analytics) {
  initAnalytics();
}

const container = document.getElementById("root");
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Les pages publiques arrivent déjà rendues (voir scripts/prerender.mjs) :
// React s'y rattache. Les autres pages sont construites dans le navigateur.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
