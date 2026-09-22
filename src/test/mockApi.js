import { vi } from "vitest";

// Simule fetch() pour les tests front : évite toute dépendance à un vrai
// back-end qui tournerait pendant `npm run test`. Chaque route déclarée
// se comporte comme le ferait la vraie API (même forme de réponse).
export function createApiMock(routes) {
  return vi.fn(async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const { pathname, searchParams } = new URL(url);
    const apiPath = pathname.replace(/^.*\/api/, "");
    const method = (init.method || "GET").toUpperCase();
    const body = init.body ? JSON.parse(init.body) : undefined;
    const authorization = init.headers?.Authorization;

    const matchedRoute = routes.find(
      (route) => route.method === method && route.pattern.test(apiPath),
    );

    if (!matchedRoute) {
      throw new Error(`Requête non simulée : ${method} ${apiPath}`);
    }

    const match = apiPath.match(matchedRoute.pattern);
    const result = await matchedRoute.handler({
      body,
      params: match?.groups ?? {},
      searchParams,
      authorization,
    });
    const status = result.status ?? 200;
    const json = result.json ?? {};

    return {
      ok: status >= 200 && status < 300,
      status,
      headers: {
        get: (name) =>
          name.toLowerCase() === "content-type" ? "application/json" : null,
      },
      json: async () => json,
    };
  });
}
