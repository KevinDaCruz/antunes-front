import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, ApiError } from "../utils/apiClient";
import { PRIVACY_REQUEST_TYPES } from "../constants/legal";
import SeoHead from "../components/SeoHead";

// Formulaire d'exercice des droits RGPD, accessible même sans compte.
function PrivacyRequest() {
  const { user } = useAuth();

  const [formValues, setFormValues] = useState({
    email: user?.email ?? "",
    type: PRIVACY_REQUEST_TYPES[0].value,
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field, value) {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const data = await apiRequest("/privacy-requests", {
        method: "POST",
        body: formValues,
      });
      setConfirmation(data);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Impossible d'envoyer ta demande pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="legal-page mx-auto max-w-4xl px-6 pt-10">
      <SeoHead
        title="Mes données personnelles"
        description="Exerce tes droits sur tes données personnelles : accès, rectification, suppression, portabilité ou opposition."
      />

      <h1 className="mb-4 text-4xl md:text-5xl">Mes données personnelles</h1>
      <p>
        Tu peux exercer ici tes droits sur les données qu&apos;Antunes détient à
        ton sujet. Si tu as un compte, tu peux aussi télécharger ou supprimer
        tes données directement depuis <Link to="/account">ton espace</Link>.
      </p>
      <p className="text-sm font-semibold text-ink-muted">
        Pour protéger tes données, nous vérifierons que la demande émane bien du
        titulaire de l&apos;adresse e-mail avant d&apos;y répondre, dans un
        délai d&apos;un mois maximum.
      </p>

      {confirmation ? (
        <div className="alert-success mb-4" role="status">
          <p className="mb-1">{confirmation.message}</p>
          <p className="text-sm">Référence : {confirmation.reference}</p>
        </div>
      ) : (
        <form className="card mt-6 space-y-5 p-8" onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="alert-error mb-4" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label htmlFor="privacy-email" className="label">
              Adresse e-mail concernée
            </label>
            <input
              type="email"
              className="field"
              id="privacy-email"
              autoComplete="email"
              required
              value={formValues.email}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
            />
          </div>

          <div>
            <label htmlFor="privacy-type" className="label">
              Ta demande
            </label>
            <select
              className="field"
              id="privacy-type"
              value={formValues.type}
              onChange={(event) =>
                handleFieldChange("type", event.target.value)
              }
            >
              {PRIVACY_REQUEST_TYPES.map((requestType) => (
                <option key={requestType.value} value={requestType.value}>
                  {requestType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="privacy-message" className="label">
              Précisions (facultatif)
            </label>
            <textarea
              className="field"
              id="privacy-message"
              rows={4}
              maxLength={2000}
              value={formValues.message}
              onChange={(event) =>
                handleFieldChange("message", event.target.value)
              }
            />
          </div>

          <button type="submit" className="btn-pink" disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm font-semibold text-ink-muted">
        En savoir plus :{" "}
        <Link to="/confidentialite">politique de confidentialité</Link>.
      </p>
    </div>
  );
}

export default PrivacyRequest;
