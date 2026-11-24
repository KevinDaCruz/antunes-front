import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirements from "../components/PasswordRequirements";
import { isPasswordValid } from "../utils/passwordRules";

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

    if (!isPasswordValid(password)) {
      setErrorMessage(
        "Le mot de passe ne respecte pas toutes les règles indiquées.",
      );
      return;
    }

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
      <section className="mx-auto max-w-lg px-6 pt-16">
        <div className="card p-8 text-center md:p-10">
          <SeoHead title="Lien invalide" description="Lien invalide." noIndex />
          <p className="mt-3 font-semibold text-ink-soft">
            Ce lien de réinitialisation est invalide.{" "}
            <Link to="/forgot-password" className="link">
              Demandes-en un nouveau
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg px-6 pt-16">
      <SeoHead
        title="Nouveau mot de passe"
        description="Choisis un nouveau mot de passe pour ton compte Antunes."
        noIndex
      />

      <div>
        <div className="card p-8 md:p-10">
          <h1 className="text-4xl">Choisir un nouveau mot de passe</h1>

          {errorMessage ? (
            <div className="alert-error my-4" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="label">
                Nouveau mot de passe
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-describedby="password-requirements"
              />
              <PasswordRequirements
                id="password-requirements"
                password={password}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirmer le mot de passe
              </label>
              <PasswordInput
                id="confirmPassword"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="btn-ink w-full !py-4 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : "Réinitialiser le mot de passe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
