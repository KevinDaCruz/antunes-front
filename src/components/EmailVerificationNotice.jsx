import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

// Rappel affiché tant que l'adresse e-mail n'est pas confirmée, avec la
// possibilité de recevoir un nouveau lien (le précédent expire en 24 h).
function EmailVerificationNotice({ reason }) {
  const { user, resendVerificationEmail } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [isSending, setIsSending] = useState(false);

  if (!user || user.emailVerified) {
    return null;
  }

  async function handleResendClick() {
    setIsSending(true);
    const result = await resendVerificationEmail();
    setFeedback(
      result.success
        ? { type: "success", text: result.message }
        : { type: "danger", text: result.error },
    );
    setIsSending(false);
  }

  return (
    <div className="alert alert-warning email-verification-notice" role="status">
      <p className="mb-2">
        <strong>Confirme ton adresse e-mail.</strong> Un lien a été envoyé à{" "}
        {user.email}. {reason}
      </p>

      <button
        type="button"
        className="btn btn-sm btn-outline-dark"
        onClick={handleResendClick}
        disabled={isSending}
      >
        {isSending ? "Envoi..." : "Renvoyer le lien"}
      </button>

      {feedback ? (
        <p className={`mt-2 mb-0 text-${feedback.type}-emphasis`}>
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}

export default EmailVerificationNotice;
