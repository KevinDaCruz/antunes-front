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
    <section className="mx-auto max-w-lg px-6 pt-16">
      <SeoHead
        title="Mot de passe oublié"
        description="Réinitialise ton mot de passe Antunes."
        noIndex
      />

      <div>
        <div className="card p-8 md:p-10">
          <h1 className="text-4xl">Mot de passe oublié</h1>
          <p className="mt-2 mb-6 font-semibold text-ink-soft">
            Indique ton adresse e-mail, on t&apos;envoie un lien pour choisir un
            nouveau mot de passe.
          </p>

          {feedback ? (
            <div
              className={
                feedback.type === "success"
                  ? "alert-success mb-4"
                  : "alert-error mb-4"
              }
              role="alert"
            >
              {feedback.text}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="label">
                Adresse e-mail
              </label>
              <input
                type="email"
                className="field"
                id="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn-ink w-full !py-4 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer le lien"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm font-semibold">
            <Link to="/login" className="link">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
