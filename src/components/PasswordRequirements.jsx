import { Check } from "lucide-react";
import { PASSWORD_RULES } from "../utils/passwordRules";

// Liste des règles du mot de passe, cochées au fil de la saisie.
// Reliée au champ par aria-describedby pour les lecteurs d'écran.
function PasswordRequirements({ id, password }) {
  return (
    <ul
      id={id}
      className="mt-3 grid gap-2 rounded-xl border-2 border-ink bg-cream p-4 text-sm font-bold sm:grid-cols-2"
    >
      {PASSWORD_RULES.map((rule) => {
        const isMet = rule.test(password);

        return (
          <li key={rule.id} className="flex items-center gap-2">
            <span
              className={`grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink ${isMet ? "bg-mint" : "bg-white"}`}
              aria-hidden="true"
            >
              {isMet ? <Check className="size-3 text-ink" /> : null}
            </span>
            <span className={isMet ? "" : "text-ink-muted"}>
              {rule.label}
              <span className="sr-only">
                {isMet ? " (respecté)" : " (non respecté)"}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordRequirements;
