// Après une mise en production, un onglet resté ouvert sur l'ancienne
// version réclame des fichiers JavaScript qui n'existent plus (leur nom
// contient une empreinte qui change à chaque build). Dans ce cas, il suffit
// de recharger la page pour récupérer la nouvelle version.
const RELOAD_KEY = "antunes-stale-build-reload";
const RELOAD_COOLDOWN_MS = 10_000;

// Message selon le navigateur : Chrome, Firefox, puis Safari.
const STALE_BUILD_MESSAGES =
  /dynamically imported module|error loading dynamically imported module|Importing a module script failed/i;

export function isStaleBuildError(error) {
  return STALE_BUILD_MESSAGES.test(error?.message ?? "");
}

// Recharge au plus une fois toutes les 10 secondes : si le fichier manque
// pour une autre raison, on affiche la page d'erreur au lieu de boucler.
export function reloadOnceForNewBuild(reload = () => window.location.reload()) {
  const lastReload = Number(window.sessionStorage.getItem(RELOAD_KEY) || 0);

  if (Date.now() - lastReload < RELOAD_COOLDOWN_MS) {
    return false;
  }

  window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  reload();
  return true;
}
