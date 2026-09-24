import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await forgotPassword(email);

    setFeedback(
      result.success
        ? { type: "success", text: result.message }
        : { type: "danger", text: result.error },
    );
    setIsSubmitting(false);
  }

  return (
    <section className="auth-page">
      <SeoHead
        title="Mot de passe oublié"
        description="Réinitialise ton mot de passe Antunes."
        noIndex
      />

      <div className="container auth-container">
        <div className="auth-card mx-auto" style={{ maxWidth: "480px" }}>
          <h2 className="auth-form-title">Mot de passe oublié</h2>
          <p className="text-muted mb-4">
            Indique ton adresse e-mail, on t&apos;envoie un lien pour choisir
            un nouveau mot de passe.
          </p>

          {feedback ? (
            <div className={`alert alert-${feedback.type}`} role="alert">
              {feedback.text}
            </div>
          ) : null}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Adresse e-mail
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer le lien"}
              </button>
            </div>
          </form>

          <p className="text-center mt-3 auth-switch-text">
            <Link to="/login">Retour à la connexion</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
