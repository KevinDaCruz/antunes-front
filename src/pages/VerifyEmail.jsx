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
    <section className="mx-auto max-w-lg px-6 pt-16">
      <SeoHead
        title="Confirmation de l'adresse e-mail"
        description="Confirmation de l'adresse e-mail de ton compte Antunes."
        noIndex
      />

      <div>
        <div className="card p-8 text-center md:p-10">
          <h1 className="text-4xl">Confirmation de l&apos;adresse e-mail</h1>

          {status === "pending" ? (
            <p className="mt-3 font-semibold text-ink-soft" role="status">
              Vérification en cours...
            </p>
          ) : null}

          {status === "success" ? (
            <>
              <div className="alert-success my-4" role="status">
                Ton adresse e-mail est confirmée. Tu peux maintenant publier des
                annonces.
              </div>
              <Link
                to={isAuthenticated ? "/sell" : "/login"}
                className="btn-pink mt-6"
              >
                {isAuthenticated ? "Déposer une annonce" : "Se connecter"}
              </Link>
            </>
          ) : null}

          {status === "error" ? (
            <>
              <div className="alert-error my-4" role="alert">
                {errorMessage}
              </div>
              <p className="mt-3 font-semibold text-ink-soft">
                Tu peux demander un nouveau lien depuis{" "}
                <Link to="/account" className="link">
                  ton compte
                </Link>
                .
              </p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;
