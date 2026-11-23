import { Link } from "react-router-dom";

const LEGAL_LINKS = [
  { to: "/mentions-legales", label: "Mentions légales" },
  { to: "/confidentialite", label: "Politique de confidentialité" },
  { to: "/mes-donnees", label: "Mes données personnelles" },
];

// onManageCookies n'est fourni que si un outil de mesure d'audience est
// actif : c'est lui qui rouvre le bandeau de consentement.
function Footer({ onManageCookies }) {
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: "/catalog", label: "Catalogue" },
    { to: "/favorites", label: "Favoris" },
    { to: "/messages", label: "Messagerie" },
    { to: "/sell", label: "Vendre" },
  ];

  const utilityLinks = [
    { to: "/login", label: "Connexion" },
    { to: "/signup", label: "Inscription" },
    { to: "/account", label: "Mon compte" },
  ];

  return (
    <footer className="site-footer mt-auto">
      <div className="container site-footer-main">
        <section className="footer-brand-block">
          <p className="footer-kicker mb-2">Antunes Marketplace</p>
          <h2 className="h5 mb-2">
            La plateforme premium pour la tech d'occasion
          </h2>
          <p className="footer-description mb-0">
            Achète, revends et discute en confiance sur une expérience fluide,
            moderne et pensée pour la conversion.
          </p>
        </section>

        <nav className="footer-links-block" aria-label="Liens rapides">
          <p className="footer-links-title">Explorer</p>
          <ul className="footer-links-list">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer-link-pill">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer-links-block" aria-label="Liens utilitaires">
          <p className="footer-links-title">Compte</p>
          <ul className="footer-links-list">
            {utilityLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="footer-link-pill">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="footer-cta-block">
          <p className="footer-links-title">Prêt à vendre ?</p>
          <p className="footer-description mb-3">
            Publie une annonce en quelques minutes et touche les bons acheteurs.
          </p>
          <Link to="/sell" className="btn btn-primary fx-neon footer-cta-btn">
            Déposer une annonce
          </Link>
        </section>
      </div>

      <div className="site-footer-bottom">
        <div className="container site-footer-bottom-content">
          <p className="mb-0">© {year} Antunes. Tous droits réservés.</p>

          <nav aria-label="Informations légales">
            <ul className="footer-legal-list">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
              {onManageCookies ? (
                <li>
                  <button
                    type="button"
                    className="footer-legal-button"
                    onClick={onManageCookies}
                  >
                    Gérer les cookies
                  </button>
                </li>
              ) : null}
            </ul>
          </nav>

          <p className="mb-0">Projet de mémoire — Kevin Da Cruz</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
