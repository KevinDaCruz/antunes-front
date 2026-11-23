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
      className="cookie-banner"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="container cookie-banner-content">
        <div>
          <h2 id="cookie-banner-title" className="h6 mb-1">
            Tes choix concernant les cookies
          </h2>
          <p id="cookie-banner-description" className="mb-0">
            Avec ton accord, nous utilisons Google Analytics pour mesurer
            l&apos;audience du site et l&apos;améliorer. Aucun cookie
            publicitaire n&apos;est utilisé. Tu peux changer d&apos;avis à
            tout moment via « Gérer les cookies » en bas de page.{" "}
            <Link to="/confidentialite">En savoir plus</Link>
          </p>
        </div>

        <div className="cookie-banner-actions">
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => handleChoice(false)}
          >
            Tout refuser
          </button>
          <button
            type="button"
            className="btn btn-light"
            onClick={() => handleChoice(true)}
          >
            Tout accepter
          </button>
        </div>
      </div>
    </section>
  );
}

export default CookieConsentBanner;
