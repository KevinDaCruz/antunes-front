import { Mail } from "lucide-react";
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
    <div
      className="flex flex-wrap items-start gap-4 rounded-2xl border-3 border-ink bg-sky p-5 text-ink"
      role="status"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-white">
        <Mail className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-black">Confirme ton adresse e-mail.</p>
        <p className="text-sm font-semibold">
          Un lien a été envoyé à {user.email}. {reason}
        </p>
        {feedback ? (
          <p
            className={`mt-2 text-sm font-extrabold ${feedback.type === "success" ? "" : "text-[#a3131b]"}`}
          >
            {feedback.text}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className="btn-white !py-2 text-sm"
        onClick={handleResendClick}
        disabled={isSending}
      >
        {isSending ? "Envoi..." : "Renvoyer le lien"}
      </button>
    </div>
  );
}

export default EmailVerificationNotice;
