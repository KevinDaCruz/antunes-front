import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { HOSTS, PUBLISHER } from "../constants/legal";

// Mentions obligatoires pour tout site édité en France
// (article 6 de la loi n° 2004-575 pour la confiance dans l'économie numérique).
function LegalNotice() {
  return (
    <div className="container legal-page my-4">
      <SeoHead
        title="Mentions légales"
        description="Mentions légales du site Antunes : éditeur, hébergeurs et propriété intellectuelle."
      />

      <h1 className="h2 mb-4">Mentions légales</h1>

      <h2>Éditeur du site</h2>
      <p>
        Le site Antunes est édité par {PUBLISHER.name}, à titre personnel et
        non commercial. {PUBLISHER.context}
      </p>
      <p>
        Contact :{" "}
        {PUBLISHER.contactEmail ? (
          <a href={`mailto:${PUBLISHER.contactEmail}`}>
            {PUBLISHER.contactEmail}
          </a>
        ) : (
          <Link to="/mes-donnees">formulaire de contact</Link>
        )}
        .
      </p>
      <p>Directeur de la publication : {PUBLISHER.name}.</p>

      <h2>Hébergement</h2>
      <ul>
        {HOSTS.map((host) => (
          <li key={host.name}>
            <strong>{host.role}</strong> : {host.name}, {host.address} (
            <a href={host.website} target="_blank" rel="noreferrer">
              {host.website.replace("https://", "")}
            </a>
            ).
          </li>
        ))}
      </ul>

      <h2>Nature du service</h2>
      <p>
        Antunes est une démonstration de place de marché entre particuliers
        pour l&apos;électronique d&apos;occasion. Les paiements sont réalisés
        en mode test de Stripe : aucune transaction réelle n&apos;est
        effectuée et aucun montant n&apos;est débité.
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        La structure du site, ses textes, son logo et son code source sont
        protégés par le droit d&apos;auteur. Toute reproduction ou
        représentation, totale ou partielle, sans autorisation de
        l&apos;éditeur est interdite (article L122-4 du Code de la propriété
        intellectuelle). Les marques citées dans les annonces appartiennent à
        leurs propriétaires respectifs.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données personnelles est détaillé dans la{" "}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    </div>
  );
}

export default LegalNotice;
