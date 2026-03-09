import { Link } from "react-router-dom";
import { useCursorSpotlight } from "../hooks/useCursorSpotlight";

function Signup() {
  const { elementRef, spotlightHandlers } = useCursorSpotlight({
    resetToCenterOnLeave: false,
  });

  const sellerPerks = [
    "Badge vendeur vérifié",
    "Mise en avant des annonces",
    "Messagerie centralisée",
  ];

  return (
    <section className="auth-page">
      <div className="container auth-container">
        <div className="auth-shell">
          <div className="auth-shell-side">
            <p className="auth-chip">Inscription rapide</p>
            <h1 className="auth-title">Crée ton espace vendeur tech.</h1>
            <p className="auth-description">
              Publie tes produits, construis ta réputation et échange avec des
              acheteurs qualifiés.
            </p>
            <ul className="auth-benefits">
              <li>Mise en ligne simple et guidée</li>
              <li>Profil vendeur clair et rassurant</li>
              <li>Gestion centralisée de tes annonces</li>
            </ul>

            <div className="auth-side-perks">
              {sellerPerks.map((perk) => (
                <span key={perk} className="auth-perk-pill">
                  {perk}
                </span>
              ))}
            </div>
          </div>

          <div ref={elementRef} {...spotlightHandlers} className="auth-card">
            <h2 className="auth-form-title">Inscription</h2>

            <form className="auth-form">
              <div className="row g-2 auth-form-row mb-2">
                <div className="col-12 col-md-6">
                  <label htmlFor="firstName" className="form-label">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder="Votre prénom"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="lastName" className="form-label">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Pseudo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Votre pseudo"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="nom@exemple.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Votre mot de passe"
                />
                <div className="auth-password-hint mt-2">
                  8 caractères minimum, avec lettres et chiffres.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>

              <div className="form-check mb-3 auth-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                />
                <label className="form-check-label" htmlFor="terms">
                  J&apos;accepte les conditions d&apos;utilisation et la
                  politique de confidentialité.
                </label>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                >
                  Créer un compte
                </button>
              </div>
            </form>

            <div className="auth-divider" role="presentation">
              <span>Démarrage rapide</span>
            </div>

            <div className="auth-trust-row" aria-label="Bénéfices inscription">
              <span className="auth-trust-pill">Profil en 2 min</span>
              <span className="auth-trust-pill">Sans frais cachés</span>
            </div>

            <p className="text-center mt-3 auth-switch-text">
              Déjà un compte ? <Link to="/login">Connectez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
