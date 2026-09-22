import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen } from "../test/test-utils";
import Account from "./Account";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

const meRoute = {
  method: "GET",
  pattern: /^\/auth\/me$/,
  handler: () => ({ status: 200, json: { user: DEMO_USER } }),
};

const favoritesRoute = {
  method: "GET",
  pattern: /^\/favorites$/,
  handler: () => ({ status: 200, json: { products: [] } }),
};

function seedAuthenticatedSession() {
  window.localStorage.setItem(
    "antunes-auth",
    JSON.stringify({ token: FAKE_TOKEN, user: DEMO_USER }),
  );
}

describe("Account", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([listProductsRoute]);
  });

  it("invites the visitor to log in when not authenticated", () => {
    renderWithProviders(<Account />);

    expect(
      screen.getByText("Connecte-toi pour accéder à ton espace vendeur."),
    ).toBeInTheDocument();
  });

  it("shows the profile and an empty listings state for a new user", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([listProductsRoute, meRoute, favoritesRoute]);

    renderWithProviders(<Account />);

    expect(await screen.findByLabelText("Pseudo")).toHaveValue("kevintech");
    expect(screen.getByLabelText("Email")).toHaveValue("kevin@example.com");
    expect(
      screen.getByText(/n'as encore publié aucune annonce/),
    ).toBeInTheDocument();
  });

  it("saves profile changes through the API", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      listProductsRoute,
      meRoute,
      favoritesRoute,
      {
        method: "PATCH",
        pattern: /^\/users\/me$/,
        handler: ({ body }) => ({
          status: 200,
          json: { user: { ...DEMO_USER, ...body } },
        }),
      },
    ]);
    const user = userEvent.setup();
    renderWithProviders(<Account />);

    const pseudoInput = await screen.findByLabelText("Pseudo");
    await user.clear(pseudoInput);
    await user.type(pseudoInput, "nouveaupseudo");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(
      await screen.findByText("Modifications enregistrées."),
    ).toBeInTheDocument();
  });

  it("logs out when clicking Se déconnecter", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([listProductsRoute, meRoute, favoritesRoute]);
    const user = userEvent.setup();
    renderWithProviders(<Account />);

    await user.click(
      await screen.findByRole("button", { name: "Se déconnecter" }),
    );

    expect(window.localStorage.getItem("antunes-auth")).toBeNull();
  });
});
