// Point d'entrée du pré-rendu : produit au moment du build le HTML des pages
// publiques, pour que les moteurs de recherche et les outils d'audit lisent
// le contenu sans exécuter JavaScript. Dans le navigateur, React reprend
// ensuite ce HTML (hydratation) au lieu de le reconstruire.
import { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { routes } from "./routes";
import { prerenderedHead } from "./utils/prerenderedHead";

function renderTree(router, context) {
  // Même arbre de composants que App.jsx. hydrate={false} : aucune donnée de
  // routage à transmettre, donc aucun script en ligne (interdit par la CSP).
  return prerenderToNodeStream(
    <StrictMode>
      <AuthProvider>
        <ProductsProvider>
          <StaticRouterProvider
            router={router}
            context={context}
            hydrate={false}
          />
        </ProductsProvider>
      </AuthProvider>
    </StrictMode>,
    // Tout le contenu dans le flux principal : sans cette option, React sort
    // les gros blocs en différé avec des scripts en ligne, bloqués par la CSP.
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  );
}

export async function render(url, origin) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(url, origin)));
  const router = createStaticRouter(handler.dataRoutes, context);

  for (const key of Object.keys(prerenderedHead)) {
    delete prerenderedHead[key];
  }

  const { prelude } = await renderTree(router, context);

  let html = "";
  for await (const chunk of prelude) {
    html += chunk;
  }

  return { html, head: { ...prerenderedHead } };
}
