import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BadgeEuro, ShieldCheck, Store } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirements from "../components/PasswordRequirements";
import { isPasswordValid } from "../utils/passwordRules";

const INITIAL_FORM_STATE = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    if (!isPasswordValid(formValues.password)) {
      setErrorMessage(
        "Le mot de passe ne respecte pas toutes les règles indiquées.",
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
    <>
      <SeoHead
        title="Inscription"
        description="Crée ton compte vendeur Antunes et publie tes premières annonces de tech d'occasion en quelques minutes."
      />
      <AuthLayout
        panelTitle="Rejoins la communauté."
        panelPoints={[
          {
            icon: <Store className="size-5" aria-hidden="true" />,
            text: "Publie tes annonces gratuitement",
          },
          {
            icon: <BadgeEuro className="size-5" aria-hidden="true" />,
            text: "Achète au prix total affiché",
          },
          {
            icon: <ShieldCheck className="size-5" aria-hidden="true" />,
            text: "Tes données restent les tiennes",
          },
        ]}
      >
        <h1 className="text-5xl">Créer un compte</h1>
        <p className="mt-2 font-medium text-ink-soft">
          Déjà inscrit ?{" "}
          <Link to="/login" className="link">
            Connecte-toi
          </Link>
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="alert-error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="label">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                className="field"
                autoComplete="given-name"
                value={formValues.firstName}
                onChange={(event) =>
                  handleFieldChange("firstName", event.target.value)
                }
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="label">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                className="field"
                autoComplete="family-name"
                value={formValues.lastName}
                onChange={(event) =>
                  handleFieldChange("lastName", event.target.value)
                }
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="username" className="label">
              Pseudo
            </label>
            <input
              id="username"
              type="text"
              className="field"
              autoComplete="username"
              value={formValues.username}
              onChange={(event) =>
                handleFieldChange("username", event.target.value)
              }
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              className="field"
              autoComplete="email"
              value={formValues.email}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              value={formValues.password}
              onChange={(event) =>
                handleFieldChange("password", event.target.value)
              }
              aria-describedby="password-requirements"
              required
            />
            <PasswordRequirements
              id="password-requirements"
              password={formValues.password}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirmer le mot de passe
            </label>
            <PasswordInput
              id="confirmPassword"
              autoComplete="new-password"
              value={formValues.confirmPassword}
              onChange={(event) =>
                handleFieldChange("confirmPassword", event.target.value)
              }
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              className="mt-0.5 size-6 shrink-0 cursor-pointer appearance-none rounded-md border-2 border-ink bg-white bg-center bg-no-repeat checked:bg-pink checked:bg-[url('/icons/check.svg')]"
              checked={acceptsTerms}
              onChange={(event) => setAcceptsTerms(event.target.checked)}
            />
            <label htmlFor="terms" className="text-sm font-semibold">
              J&apos;accepte les conditions d&apos;utilisation et la{" "}
              <Link to="/confidentialite" target="_blank" className="link">
                politique de confidentialité
              </Link>
              .
            </label>
          </div>

          <button type="submit" className="btn-pink w-full !py-4 text-base">
            Créer un compte
          </button>
          <p className="text-center text-xs font-semibold text-ink-muted">
            Un e-mail de confirmation te sera envoyé pour valider ton adresse.
          </p>
        </form>
      </AuthLayout>
    </>
  );
}

export default Signup;
