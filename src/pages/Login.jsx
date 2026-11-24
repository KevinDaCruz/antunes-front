import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, LockKeyhole, MessageCircle, Package } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";
import PasswordInput from "../components/PasswordInput";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const successMessage = location.state?.message;

  async function handleSubmit(event) {
    event.preventDefault();

    const result = await login({ email, password });

    if (!result.success) {
      setErrorMessage(result.error);
      return;
    }

    const redirectTo = location.state?.from?.pathname ?? "/account";
    navigate(redirectTo, { replace: true });
  }

  return (
    <>
      <SeoHead
        title="Connexion"
        description="Connecte-toi à ton compte Antunes pour retrouver tes annonces, tes favoris et tes conversations."
      />
      <AuthLayout
        panelTitle="Content de te revoir."
        panelPoints={[
          {
            icon: <Heart className="size-5" aria-hidden="true" />,
            text: "Retrouve tes favoris",
          },
          {
            icon: <MessageCircle className="size-5" aria-hidden="true" />,
            text: "Réponds à tes messages",
          },
          {
            icon: <Package className="size-5" aria-hidden="true" />,
            text: "Suis tes ventes et tes achats",
          },
        ]}
      >
        <p className="eyebrow">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          Connexion sécurisée
        </p>
        <h1 className="mt-4 text-5xl">Connexion</h1>
        <p className="mt-2 font-medium text-ink-soft">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="link">
            Inscris-toi gratuitement
          </Link>
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {successMessage ? (
            <div className="alert-success" role="status">
              {successMessage}
            </div>
          ) : null}
          {errorMessage ? (
            <div className="alert-error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label htmlFor="email" className="label">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              className="field"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-extrabold underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <button type="submit" className="btn-ink w-full !py-4 text-base">
            Se connecter
          </button>
        </form>
      </AuthLayout>
    </>
  );
}

export default Login;
