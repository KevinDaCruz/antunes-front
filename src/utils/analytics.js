// Mesure d'audience avec Google Analytics 4.
//
// Le script n'est chargé qu'après consentement explicite de l'utilisateur
// (bandeau cookies), comme l'exige la CNIL pour un outil qui dépose des
// cookies à des fins statistiques. L'identifiant est lu à chaque appel
// pour pouvoir être changé dans les tests.
function getMeasurementId() {
  return import.meta.env.VITE_GA_MEASUREMENT_ID;
}

export function isAnalyticsConfigured() {
  return Boolean(getMeasurementId());
}

let isLoaded = false;

export function initAnalytics() {
  const measurementId = getMeasurementId();

  if (!measurementId || typeof document === "undefined") {
    return;
  }

  // Cas d'un utilisateur qui refuse puis accepte à nouveau sans recharger.
  window[`ga-disable-${measurementId}`] = false;

  if (isLoaded) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];

  // gtag.js attend l'objet "arguments" lui-même, pas un tableau : c'est
  // pourquoi on n'utilise pas de fonction fléchée ni de paramètre rest ici.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true });

  isLoaded = true;
}

// Retrait du consentement : on coupe l'envoi de données (option officielle
// de Google) et on supprime les cookies déjà déposés (_ga, _ga_XXXX).
export function disableAnalytics() {
  const measurementId = getMeasurementId();

  if (!measurementId) {
    return;
  }

  window[`ga-disable-${measurementId}`] = true;

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();

    if (name.startsWith("_ga")) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
      document.cookie = `${name}=; Max-Age=0; path=/`;
    }
  });
}
