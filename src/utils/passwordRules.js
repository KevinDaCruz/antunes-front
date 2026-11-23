// Mêmes règles que le back-end (src/validators/passwordPolicy.js), basées
// sur la recommandation CNIL de 2022. Le front ne fait qu'aider à la saisie :
// c'est toujours le serveur qui a le dernier mot.
export const PASSWORD_RULES = [
  {
    id: "length",
    label: "12 caractères minimum",
    test: (password) => password.length >= 12,
  },
  {
    id: "lowercase",
    label: "Une minuscule",
    test: (password) => /[a-z]/.test(password),
  },
  {
    id: "uppercase",
    label: "Une majuscule",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    id: "digit",
    label: "Un chiffre",
    test: (password) => /[0-9]/.test(password),
  },
  {
    id: "special",
    label: "Un caractère spécial",
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export function isPasswordValid(password) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
