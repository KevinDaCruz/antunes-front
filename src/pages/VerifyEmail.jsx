import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SeoHead from "../components/SeoHead";

// Page ouverte depuis le lien de l'e-mail de confirmation (double opt-in).
function VerifyEmail() {
  const { verifyEmail, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "pending" : "error");
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "Ce lien de confirmation est incomplet.",
  );

  // En mode StrictMode, React exécute les effets deux fois en développement.
  // Le token étant à usage unique, le second appel échouerait : on s'assure
  // de n'envoyer la requête qu'une seule fois.
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (!token || hasRequestedRef.current) {
      return;
    }
    hasRequestedRef.current = true;

    verifyEmail(token).then((result) => {
      setStatus(result.success ? "success" : "error");
      setErrorMessage(result.error ?? "");
    });
  }, [token, verifyEmail]);

  return (
    <section className="auth-page">
      <SeoHead
        title="Confirmation de l'adresse e-mail"
        description="Confirmation de l'adresse e-mail de ton compte Antunes."
        noIndex
      />

      <div className="container auth-container">
        <div className="auth-card mx-auto text-center verify-email-card">
          <h1 className="auth-form-title">Confirmation de l&apos;adresse e-mail</h1>

          {status === "pending" ? (
            <p className="text-muted mb-0" role="status">
              Vérification en cours...
            </p>
          ) : null}

          {status === "success" ? (
            <>
              <div className="alert alert-success" role="status">
                Ton adresse e-mail est confirmée. Tu peux maintenant publier
                des annonces.
              </div>
              <Link
                to={isAuthenticated ? "/sell" : "/login"}
                className="btn btn-primary"
              >
                {isAuthenticated ? "Déposer une annonce" : "Se connecter"}
              </Link>
            </>
          ) : null}

          {status === "error" ? (
            <>
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
              <p className="text-muted mb-0">
                Tu peux demander un nouveau lien depuis{" "}
                <Link to="/account">ton compte</Link>.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;
