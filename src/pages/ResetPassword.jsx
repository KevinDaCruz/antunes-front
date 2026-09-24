import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";
import PasswordInput from "../components/PasswordInput";

function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const result = await resetPassword({ token, password });

    if (result.success) {
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Ton mot de passe a bien été réinitialisé. Tu peux te reconnecter.",
        },
      });
    } else {
      setErrorMessage(result.error);
    }

    setIsSubmitting(false);
  }

  if (!token) {
    return (
      <section className="auth-page">
        <div className="container auth-container text-center">
          <SeoHead title="Lien invalide" description="Lien invalide." noIndex />
          <p className="text-muted">
            Ce lien de réinitialisation est invalide.{" "}
            <Link to="/forgot-password">Demandes-en un nouveau</Link>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <SeoHead
        title="Nouveau mot de passe"
        description="Choisis un nouveau mot de passe pour ton compte Antunes."
        noIndex
      />

      <div className="container auth-container">
        <div className="auth-card mx-auto" style={{ maxWidth: "480px" }}>
          <h2 className="auth-form-title">Choisir un nouveau mot de passe</h2>

          {errorMessage ? (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Nouveau mot de passe
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmer le mot de passe
              </label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enregistrement..." : "Réinitialiser le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
