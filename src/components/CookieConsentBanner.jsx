import { Link } from "react-router-dom";
import { saveConsent } from "../utils/cookieConsent";
import { disableAnalytics, initAnalytics } from "../utils/analytics";

// Bandeau de recueil du consentement (recommandations CNIL) :
// - aucun cookie de mesure d'audience avant un choix explicite ;
// - refuser est aussi simple qu'accepter (deux boutons de même niveau) ;
// - le choix reste modifiable à tout moment depuis le pied de page.
function CookieConsentBanner({ onClose }) {
  function handleChoice(acceptsAnalytics) {
    saveConsent({ analytics: acceptsAnalytics });

    if (acceptsAnalytics) {
      initAnalytics();
    } else {
      disableAnalytics();
    }

    onClose();
  }

  return (
    <section
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border-3 border-ink bg-white p-6 text-ink shadow-brutal-lg"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="flex items-start gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-ink bg-yellow text-2xl"
          aria-hidden="true"
        >
          🍪
        </span>
        <div>
          <h2 id="cookie-banner-title" className="text-2xl">
            Tes choix concernant les cookies
          </h2>
          <p
            id="cookie-banner-description"
            className="mt-1 text-[15px] font-medium text-ink-soft"
          >
            Avec ton accord, nous utilisons Google Analytics pour mesurer
            l&apos;audience du site et l&apos;améliorer. Aucun cookie
            publicitaire n&apos;est utilisé. Tu peux changer d&apos;avis à tout
            moment via « Gérer les cookies » en bas de page.{" "}
            <Link to="/confidentialite" className="font-extrabold underline">
              En savoir plus
            </Link>
          </p>
        </div>
      </div>

      {/* Deux boutons strictement identiques : refuser est aussi simple
          qu'accepter. */}
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="btn-ink"
          onClick={() => handleChoice(false)}
        >
          Tout refuser
        </button>
        <button
          type="button"
          className="btn-ink"
          onClick={() => handleChoice(true)}
        >
          Tout accepter
        </button>
      </div>
    </section>
  );
}

export default CookieConsentBanner;
