import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";
import { PUBLISHER } from "../constants/legal";

// Informations à fournir aux personnes concernées (RGPD, article 13).
const PROCESSINGS = [
  {
    purpose: "Création et gestion du compte",
    data: "Nom, prénom, pseudo, adresse e-mail, mot de passe (stocké haché), adresse de livraison",
    legalBasis: "Exécution du contrat (conditions d'utilisation)",
    retention: "Jusqu'à la suppression du compte",
  },
  {
    purpose: "Publication d'annonces et messagerie entre membres",
    data: "Contenu des annonces, messages échangés, favoris",
    legalBasis: "Exécution du contrat",
    retention:
      "Jusqu'à la suppression du compte (les annonces vendues restent liées à la commande)",
  },
  {
    purpose: "Paiement et suivi des commandes",
    data: "Article acheté, montant, date, statut. Les données de carte bancaire sont saisies et traitées uniquement par Stripe",
    legalBasis: "Exécution du contrat et obligation légale (comptabilité)",
    retention: "10 ans (article L123-22 du Code de commerce)",
  },
  {
    purpose: "E-mails de service (confirmation d'adresse, mot de passe oublié)",
    data: "Adresse e-mail",
    legalBasis: "Exécution du contrat",
    retention: "Liens valables 24 heures (confirmation) et 1 heure (mot de passe)",
  },
  {
    purpose: "Mesure d'audience",
    data: "Pages vues, type d'appareil, adresse IP anonymisée, identifiant de cookie",
    legalBasis: "Consentement (bandeau cookies)",
    retention: "13 mois maximum pour les cookies, 6 mois pour ton choix",
  },
  {
    purpose: "Sécurité du service",
    data: "Adresse IP lors des échecs de connexion, journaux techniques",
    legalBasis: "Intérêt légitime (prévenir les intrusions et la fraude)",
    retention: "Durée de conservation des journaux de l'hébergeur",
  },
  {
    purpose: "Réponse aux demandes d'exercice des droits",
    data: "Adresse e-mail, type de demande, message",
    legalBasis: "Obligation légale (RGPD)",
    retention: "Le temps du traitement de la demande et de la preuve de la réponse",
  },
];

const PROCESSORS = [
  { name: "Vercel", role: "hébergement du site", location: "États-Unis" },
  { name: "Render", role: "hébergement de l'API", location: "États-Unis" },
  { name: "MongoDB Atlas", role: "base de données", location: "selon la région du cluster" },
  { name: "Stripe", role: "paiement en ligne", location: "Irlande / États-Unis" },
  { name: "Resend", role: "envoi des e-mails", location: "États-Unis" },
  { name: "Google Analytics", role: "mesure d'audience, avec ton accord", location: "États-Unis" },
  {
    name: "API Adresse (data.gouv.fr)",
    role: "suggestions lors de la saisie de l'adresse",
    location: "France",
  },
];

function PrivacyPolicy() {
  return (
    <div className="container legal-page my-4">
      <SeoHead
        title="Politique de confidentialité"
        description="Comment Antunes collecte, utilise et protège tes données personnelles, et comment exercer tes droits."
      />

      <h1 className="h2 mb-2">Politique de confidentialité</h1>
      <p className="text-muted">Dernière mise à jour : 23 novembre 2026</p>

      <h2>Responsable du traitement</h2>
      <p>
        Le responsable du traitement des données collectées sur Antunes est{" "}
        {PUBLISHER.name}, éditeur du site (voir les{" "}
        <Link to="/mentions-legales">mentions légales</Link>). Antunes ne
        vend ni ne loue tes données à des tiers.
      </p>

      <h2>Données collectées et finalités</h2>
      <div className="table-responsive">
        <table className="table table-sm align-top">
          <caption className="visually-hidden">
            Traitements de données personnelles réalisés par Antunes
          </caption>
          <thead>
            <tr>
              <th scope="col">Finalité</th>
              <th scope="col">Données</th>
              <th scope="col">Base légale</th>
              <th scope="col">Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            {PROCESSINGS.map((processing) => (
              <tr key={processing.purpose}>
                <th scope="row">{processing.purpose}</th>
                <td>{processing.data}</td>
                <td>{processing.legalBasis}</td>
                <td>{processing.retention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Destinataires et sous-traitants</h2>
      <p>
        Tes données ne sont accessibles qu&apos;à l&apos;éditeur et aux
        prestataires techniques nécessaires au fonctionnement du service :
      </p>
      <ul>
        {PROCESSORS.map((processor) => (
          <li key={processor.name}>
            <strong>{processor.name}</strong> : {processor.role} (
            {processor.location})
          </li>
        ))}
      </ul>
      <p>
        Les transferts vers les États-Unis sont encadrés par le cadre de
        protection des données UE–États-Unis (Data Privacy Framework) ou par
        les clauses contractuelles types de la Commission européenne.
      </p>

      <h2>Cookies et stockage local</h2>
      <h3>Sans consentement (strictement nécessaires)</h3>
      <ul>
        <li>
          <code>antunes-auth</code> : maintien de ta connexion (stockage local
          du navigateur).
        </li>
        <li>
          <code>antunes-theme</code> : ta préférence d&apos;affichage (thème
          clair ou sombre).
        </li>
        <li>
          <code>antunes-cookie-consent</code> : mémorisation de ton choix
          concernant les cookies.
        </li>
      </ul>
      <h3>Avec ton consentement</h3>
      <ul>
        <li>
          <code>_ga</code> et <code>_ga_*</code> : cookies de Google Analytics
          servant à mesurer l&apos;audience du site, déposés uniquement si tu
          cliques sur « Tout accepter ».
        </li>
      </ul>
      <p>
        Tu peux modifier ton choix à tout moment avec le lien « Gérer les
        cookies » en bas de chaque page.
      </p>

      <h2>Sécurité</h2>
      <p>
        Les échanges sont chiffrés (HTTPS), les mots de passe sont stockés
        sous forme de hash (bcrypt) et ne sont jamais lisibles, y compris par
        l&apos;éditeur. Les liens envoyés par e-mail sont à usage unique et
        expirent rapidement.
      </p>

      <h2>Tes droits</h2>
      <p>
        Conformément au RGPD et à la loi Informatique et Libertés, tu disposes
        d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de
        portabilité, de limitation et d&apos;opposition sur tes données, ainsi
        que du droit de retirer ton consentement à tout moment.
      </p>
      <ul>
        <li>
          Depuis <Link to="/account">ton compte</Link> : modifier ton profil,
          télécharger toutes tes données ou supprimer ton compte.
        </li>
        <li>
          Pour toute autre demande, même sans compte : le{" "}
          <Link to="/mes-donnees">formulaire de demande</Link>. Une réponse
          t&apos;est apportée dans un délai d&apos;un mois.
        </li>
      </ul>
      <p>
        Si tu estimes que tes droits ne sont pas respectés, tu peux adresser
        une réclamation à la CNIL sur{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer">
          cnil.fr/fr/plaintes
        </a>
        .
      </p>
    </div>
  );
}

export default PrivacyPolicy;
