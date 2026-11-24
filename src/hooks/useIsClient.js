import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

// Vaut false pendant le pré-rendu et pendant l'hydratation, puis true.
// Ce qui dépend du navigateur (session, choix des cookies) n'est donc
// affiché qu'après l'hydratation : le HTML pré-rendu et le premier rendu
// côté client restent identiques.
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
