// « Léa Martin » → « LM » ; à défaut, les deux premières lettres du pseudo.
export function initials(user) {
  const letters = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;
  return (letters || user?.pseudo?.slice(0, 2) || "?").toUpperCase();
}
