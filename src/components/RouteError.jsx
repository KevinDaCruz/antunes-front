import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { isStaleBuildError } from "../utils/staleBuild";

// Remplace l'écran d'erreur par défaut de React Router (en anglais et
// destiné aux développeurs) par un message compréhensible pour le visiteur.
function RouteError() {
  const error = useRouteError();
  const isNewVersion = isStaleBuildError(error);
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  let title = "Une erreur inattendue est survenue";
  let message =
    "Réessaie dans quelques instants. Si le problème persiste, reviens à l'accueil.";

  if (isNewVersion) {
    title = "Une nouvelle version d'Antunes est disponible";
    message = "Recharge la page pour continuer avec la dernière version.";
  } else if (isNotFound) {
    title = "Page introuvable";
    message = "Cette page n'existe pas ou a été déplacée.";
  }

  return (
    <div className="container my-5 text-center" role="alert">
      <h1 className="h2 mb-3">{title}</h1>
      <p className="text-muted mb-4">{message}</p>
      <div className="d-flex justify-content-center gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Recharger la page
        </button>
        {/* Lien classique : recharge entièrement l'application. */}
        <a href="/" className="btn btn-outline-primary">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

export default RouteError;
