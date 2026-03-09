import { Link } from "react-router-dom";
import { useCursorSpotlight } from "../hooks/useCursorSpotlight";

function Login() {
  const { elementRef, spotlightHandlers } = useCursorSpotlight({
    resetToCenterOnLeave: false,
  });

  const authStats = [
    { value: "12k+", label: "Membres actifs" },
    { value: "4.9/5", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <section className="auth-page">
      <div className="container auth-container">
        <div className="auth-shell">
          <div className="auth-shell-side">
            <p className="auth-chip">Connexion sécurisée</p>
            <h1 className="auth-title">Bon retour sur Antunes.</h1>
            <p className="auth-description">
              Retrouve tes annonces, tes favoris et tes conversations en un
              instant.
            </p>
            <ul className="auth-benefits">
              <li>Suivi des annonces en temps réel</li>
              <li>Messagerie rapide acheteur/vendeur</li>
              <li>Expérience optimisée mobile & desktop</li>
            </ul>

            <div className="auth-side-stats">
              {authStats.map((stat) => (
                <article key={stat.label} className="auth-side-stat-card">
                  <p className="auth-side-stat-value mb-0">{stat.value}</p>
                  <p className="auth-side-stat-label mb-0">{stat.label}</p>
                </article>
              ))}
            </div>
          </div>

          <div ref={elementRef} {...spotlightHandlers} className="auth-card">
            <h2 className="auth-form-title">Connexion</h2>

            <form className="auth-form">
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
              </div>

              <div className="auth-form-meta mb-3">
                <a href="#" className="auth-meta-link">
                  Mot de passe oublié ?
                </a>
                <span className="auth-meta-dot" aria-hidden="true">
                  •
                </span>
                <span className="auth-meta-note">Connexion chiffrée</span>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary auth-submit-btn"
                >
                  Se connecter
                </button>
              </div>
            </form>

            <div className="auth-divider" role="presentation">
              <span>Accès sécurisé</span>
            </div>

            <div className="auth-trust-row" aria-label="Garanties de sécurité">
              <span className="auth-trust-pill">Données protégées</span>
              <span className="auth-trust-pill">Session sécurisée</span>
            </div>

            <p className="text-center mt-3 auth-switch-text">
              Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
