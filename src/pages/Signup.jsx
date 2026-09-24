import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCursorSpotlight } from "../hooks/useCursorSpotlight";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";
import PasswordInput from "../components/PasswordInput";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const { elementRef, spotlightHandlers } = useCursorSpotlight({
    resetToCenterOnLeave: false,
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sellerPerks = [
    "Badge vendeur vérifié",
    "Mise en avant des annonces",
    "Messagerie centralisée",
  ];

  function handleFieldChange(field, value) {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!acceptsTerms) {
      setErrorMessage(
        "Merci d'accepter les conditions d'utilisation pour continuer.",
      );
      return;
    }

    const result = await signup(formValues);

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    navigate("/account", { replace: true });
  }

  return (
    <section className="auth-page">
      <SeoHead
        title="Inscription"
        description="Crée ton compte vendeur Antunes et publie tes premières annonces de tech d'occasion en quelques minutes."
      />

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

            <form className="auth-form" onSubmit={handleSubmit}>
              {errorMessage ? (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              ) : null}

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
                    value={formValues.firstName}
                    onChange={(event) =>
                      handleFieldChange("firstName", event.target.value)
                    }
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
                    value={formValues.lastName}
                    onChange={(event) =>
                      handleFieldChange("lastName", event.target.value)
                    }
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
                  value={formValues.username}
                  onChange={(event) =>
                    handleFieldChange("username", event.target.value)
                  }
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
                  value={formValues.email}
                  onChange={(event) =>
                    handleFieldChange("email", event.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mot de passe
                </label>
                <PasswordInput
                  id="password"
                  placeholder="Votre mot de passe"
                  value={formValues.password}
                  onChange={(event) =>
                    handleFieldChange("password", event.target.value)
                  }
                />
                <div className="auth-password-hint mt-2">
                  8 caractères minimum, avec lettres et chiffres.
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmer le mot de passe
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirmez votre mot de passe"
                  value={formValues.confirmPassword}
                  onChange={(event) =>
                    handleFieldChange("confirmPassword", event.target.value)
                  }
                />
              </div>

              <div className="form-check mb-3 auth-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="terms"
                  checked={acceptsTerms}
                  onChange={(event) => setAcceptsTerms(event.target.checked)}
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
