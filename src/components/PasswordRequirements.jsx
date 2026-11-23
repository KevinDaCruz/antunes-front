import { PASSWORD_RULES } from "../utils/passwordRules";

// Liste des règles du mot de passe, cochées au fil de la saisie.
// Reliée au champ par aria-describedby pour les lecteurs d'écran.
function PasswordRequirements({ id, password }) {
  return (
    <ul id={id} className="password-requirements mt-2 mb-0">
      {PASSWORD_RULES.map((rule) => {
        const isMet = rule.test(password);

        return (
          <li key={rule.id} className={isMet ? "is-met" : undefined}>
            <span aria-hidden="true">{isMet ? "✓" : "•"}</span> {rule.label}
            <span className="visually-hidden">
              {isMet ? " (respecté)" : " (non respecté)"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default PasswordRequirements;
