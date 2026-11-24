// @vitest-environment node
import { describe, expect, it } from "vitest";
import { render } from "./entry-prerender";

const ORIGIN = "https://antunes-front.vercel.app";

describe("pré-rendu des pages publiques", () => {
  it("produit le contenu complet de l'accueil, sans écran de chargement", async () => {
    const { html, head } = await render("/", ORIGIN);

    expect(html).toContain("<h1");
    expect(html).toContain("Explorer par catégorie");
    expect(html).not.toContain("Chargement en cours");
    expect(head.title).toBe(
      "Achète et revends ta tech d'occasion en confiance | Antunes",
    );
    expect(head.description).toMatch(/marketplace/i);
  });

  it("n'ajoute aucun script en ligne, interdit par la CSP", async () => {
    const { html } = await render("/catalog", ORIGIN);

    expect(html).not.toMatch(/<script/);
  });

  it("rend la page comme pour un visiteur anonyme, sans bandeau cookies", async () => {
    const { html } = await render("/mentions-legales", ORIGIN);

    expect(html).toContain("Se connecter");
    expect(html).not.toContain('role="dialog"');
  });
});
